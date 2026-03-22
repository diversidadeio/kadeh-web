import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { 
  adCampaigns, 
  adBankPayments,
  advertisers,
  campaignProducts,
  InsertAdCampaign,
  InsertAdBankPayment
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";

/**
 * Tabela de preços por duração
 */
const PRICING_BY_DURATION: Record<string, number> = {
  "1day": 100,
  "3days": 250,
  "7days": 500,
  "14days": 900,
};

/**
 * Multiplicadores por quantidade de lojas/região
 */
const STORE_MULTIPLIERS = [
  { min: 1, max: 5, multiplier: 1.0 },
  { min: 6, max: 20, multiplier: 1.5 },
  { min: 21, max: 50, multiplier: 2.0 },
  { min: 51, max: Infinity, multiplier: 2.5 },
];

/**
 * Calcular multiplicador baseado na quantidade de lojas
 */
function getStoreMultiplier(numberOfStores: number): number {
  for (const range of STORE_MULTIPLIERS) {
    if (numberOfStores >= range.min && numberOfStores <= range.max) {
      return range.multiplier;
    }
  }
  return 1.0;
}

/**
 * Calcular dias úteis entre duas datas
 */
function getBusinessDaysBetween(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = domingo, 6 = sábado
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Adicionar dias úteis a uma data
 */
function addBusinessDays(startDate: Date, daysToAdd: number): Date {
  let count = 0;
  const current = new Date(startDate);
  
  while (count < daysToAdd) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  
  return current;
}

/**
 * Calcular valor total da campanha
 */
export const calculateCampaignPrice = protectedProcedure
  .input(
    z.object({
      duration: z.enum(["1day", "3days", "7days", "14days"]),
      numberOfStores: z.number().min(1),
      numberOfProducts: z.number().min(1).default(1),
    })
  )
  .query(async ({ input }) => {
    try {
      // Multiplicadores por duração
      const durationMultipliers: Record<string, number> = {
        "1day": 1.0,
        "3days": 1.1,
        "7days": 1.2,
        "14days": 1.4,
      };

      const basePrice = PRICING_BY_DURATION[input.duration];
      const storeMultiplier = getStoreMultiplier(input.numberOfStores);
      const durationMultiplier = durationMultipliers[input.duration];
      
      // Fórmula: Preço Base × Multiplicador Duração × Multiplicador Lojas
      const totalCost = basePrice * durationMultiplier * storeMultiplier;

      return {
        success: true,
        basePrice,
        multiplier: storeMultiplier * durationMultiplier,
        totalCost,
        breakdown: {
          duration: input.duration,
          numberOfStores: input.numberOfStores,
          numberOfProducts: input.numberOfProducts,
          basePrice,
          durationMultiplier,
          storeMultiplier,
          totalCost,
        },
      };
    } catch (error) {
      console.error("Error calculating campaign price:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to calculate price",
      });
    }
  });

/**
 * Validar data inicial (deve ter antecedência de 7 dias úteis)
 */
export const validateStartDate = protectedProcedure
  .input(
    z.object({
      startDate: z.date(),
    })
  )
  .query(async ({ input }) => {
    try {
      const now = new Date();
      const requiredBusinessDays = 7;
      const earliestStartDate = addBusinessDays(now, requiredBusinessDays);

      const isValid = input.startDate >= earliestStartDate;

      return {
        success: true,
        isValid,
        message: isValid 
          ? "Data válida" 
          : `A campanha deve iniciar com antecedência de ${requiredBusinessDays} dias úteis. Data mínima: ${earliestStartDate.toLocaleDateString("pt-BR")}`,
        earliestStartDate,
        inputDate: input.startDate,
      };
    } catch (error) {
      console.error("Error validating start date:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to validate start date",
      });
    }
  });

/**
 * Criar campanha
 */
export const createCampaign = protectedProcedure
  .input(
    z.object({
      companyName: z.string().min(1),
      companyDocument: z.string().min(11).max(20),
      contactEmail: z.string().email(),
      contactPhone: z.string().min(10),
      duration: z.enum(["1day", "3days", "7days", "14days"]),
      numberOfProducts: z.number().min(1),
      numberOfStores: z.number().min(1),
      startDate: z.union([z.string(), z.date()]).transform((val) => {
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
          }
          return date;
        }
        return val;
      }),
      products: z.array(
        z.object({
          productName: z.string().min(1),
          productImageUrl: z.string().url().optional().or(z.literal("")),
          productEAN13: z.string().max(20).optional(),
        })
      ).min(1),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Validar que temos pelo menos um produto
      if (!input.products || input.products.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "At least one product is required",
        });
      }

      // Buscar ou criar anunciante para o usuário
      const existingAdvertiser = await db.query.advertisers.findFirst({
        where: (adv: any, { eq }: any) => eq(adv.userId, ctx.user.id),
      });

      let advertiserId: number;
      if (existingAdvertiser) {
        advertiserId = existingAdvertiser.id;
      } else {
        // Criar novo anunciante
        const insertResult = await db.insert(advertisers).values({
          userId: ctx.user.id,
          companyName: input.companyName,
          companyDocument: input.companyDocument,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          status: "pending",
        });
        
        // Obter o ID do anunciante inserido
        // Drizzle ORM retorna um objeto com insertId ou a linha inserida
        let tempAdvertiserId = 0;
        if (Array.isArray(insertResult) && insertResult.length > 0) {
          tempAdvertiserId = insertResult[0]?.id || 0;
        } else if ((insertResult as any)?.insertId) {
          tempAdvertiserId = (insertResult as any).insertId;
        } else if (typeof insertResult === 'object' && (insertResult as any)?.id) {
          tempAdvertiserId = (insertResult as any).id;
        }
        
        advertiserId = tempAdvertiserId;
        
        if (!advertiserId) {
          console.error("Advertiser insert result:", insertResult, "Type:", typeof insertResult);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create advertiser - no ID returned",
          });
        }
      }

      // Usar o primeiro produto como produto principal da campanha
      const primaryProduct = input.products[0];

      // Calcular endDate baseado na duração
      const durationDays: Record<string, number> = {
        "1day": 1,
        "3days": 3,
        "7days": 7,
        "14days": 14,
      };
      const endDate = addBusinessDays(input.startDate, durationDays[input.duration] || 1);

      // Calcular preço da campanha
      const basePrice = PRICING_BY_DURATION[input.duration] || 100;
      const storeMultiplier = getStoreMultiplier(input.numberOfStores);
      const durationMultipliers: Record<string, number> = {
        "1day": 1.0,
        "3days": 1.1,
        "7days": 1.2,
        "14days": 1.4,
      };
      const durationMultiplier = durationMultipliers[input.duration] || 1.0;
      const totalCost = basePrice * durationMultiplier * storeMultiplier;
      const multiplier = storeMultiplier * durationMultiplier;

      // Inserir campanha com todos os campos obrigatórios
      const result = await db.insert(adCampaigns).values({
        advertiserId: advertiserId,
        companyName: input.companyName,
        companyDocument: input.companyDocument,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        duration: input.duration,
        numberOfStores: input.numberOfStores,
        startDate: input.startDate,
        endDate: endDate,
        productName: primaryProduct.productName,
        productImageUrl: primaryProduct.productImageUrl || "",
        productEAN13: primaryProduct.productEAN13 || "",
        basePrice: basePrice,
        multiplier: multiplier,
        totalCost: totalCost,
        status: "pending_approval",
        createdAt: new Date(),
      });

      // Obter o ID da campanha inserida
      // Drizzle ORM retorna um objeto com insertId ou a linha inserida
      let campaignId = 0;
      if (Array.isArray(result) && result.length > 0) {
        // Se retornar array, usar o ID do primeiro elemento
        campaignId = result[0]?.id || 0;
      } else if (result?.insertId) {
        campaignId = result.insertId;
      } else if (typeof result === 'object' && result?.id) {
        campaignId = result.id;
      }

      if (!campaignId) {
        console.error("Campaign insert result:", result, "Type:", typeof result);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create campaign - no ID returned",
        });
      }

      // Inserir todos os produtos da campanha
      for (let i = 0; i < input.products.length; i++) {
        const product = input.products[i];
        await db.insert(campaignProducts).values({
          campaignId,
          productName: product.productName,
          productImageUrl: product.productImageUrl || "",
          productEAN13: product.productEAN13 || "",
          position: i + 1,
          createdAt: new Date(),
        });
      }

      // Notificar proprietário
      await notifyOwner({
        title: "Nova Campanha Criada",
        content: `${input.companyName} criou uma nova campanha de ${input.duration} com ${input.numberOfProducts} produtos para ${input.numberOfStores} lojas.`,
      });

      return {
        success: true,
        campaignId,
        message: "Campanha criada com sucesso!",
      };
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create campaign",
      });
    }
  });

/**
 * Criar sessão de checkout do Stripe
 */
const createCheckoutSession = protectedProcedure
  .input(
    z.object({
      campaignId: z.number().int().positive(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const Stripe = require("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Buscar a campanha
      const campaign = await db.query.adCampaigns.findFirst({
        where: (camp: any, { eq }: any) => eq(camp.id, input.campaignId),
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Criar sessão de checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `Campanha Kadeh Ads - ${campaign.productName}`,
                description: `Duração: ${campaign.duration} | Lojas: ${campaign.numberOfStores}`,
                images: [campaign.productImageUrl],
              },
              unit_amount: Math.round(parseFloat(campaign.totalCost.toString()) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${ctx.req?.headers.origin || "https://kadeh.io"}/pt/kadeh-ads/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req?.headers.origin || "https://kadeh.io"}/pt/kadeh-ads/cancel`,
        customer_email: campaign.contactEmail,
        metadata: {
          campaign_id: input.campaignId.toString(),
          user_id: ctx.user.id.toString(),
          company_name: campaign.companyName,
        },
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url,
      };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }
  });

/**
 * Listar campanhas do usuário
 */
const listUserCampaigns = protectedProcedure
  .input(
    z.object({
      status: z.enum(["pending_approval", "approved", "rejected", "payment_pending", "active", "completed", "cancelled", "refunded"]).optional(),
      sortBy: z.enum(["createdAt", "startDate", "totalCost"]).optional().default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    }).optional()
  )
  .query(async ({ ctx, input }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Buscar anunciante do usuário
      const advertiser = await db.query.advertisers.findFirst({
        where: (adv: any, { eq }: any) => eq(adv.userId, ctx.user.id),
      });

      if (!advertiser) {
        return {
          success: true,
          campaigns: [],
          total: 0,
        };
      }

      // Buscar campanhas do anunciante
      let campaigns: any[] = [];
      if (input?.status) {
        campaigns = await db.select().from(adCampaigns).where(
          and(eq(adCampaigns.advertiserId, advertiser.id), eq(adCampaigns.status, input.status))
        );
      } else {
        campaigns = await db.select().from(adCampaigns).where(eq(adCampaigns.advertiserId, advertiser.id));
      }

      // Ordenar campanhas
      const sortedCampaigns = campaigns.sort((a, b) => {
        let aValue: any = a[input?.sortBy || "createdAt"];
        let bValue: any = b[input?.sortBy || "createdAt"];

        if (aValue instanceof Date && bValue instanceof Date) {
          return input?.sortOrder === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return input?.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });

      return {
        success: true,
        campaigns: sortedCampaigns,
        total: sortedCampaigns.length,
      };
    } catch (error) {
      console.error("Error listing campaigns:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list campaigns",
      });
    }
  });

/**
 * Obter detalhes de uma campanha
 */
const getCampaignDetails = protectedProcedure
  .input(
    z.object({
      campaignId: z.number().int().positive(),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Buscar campanha
      const campaign = await db.query.adCampaigns.findFirst({
        where: (camp: any, { eq }: any) => eq(camp.id, input.campaignId),
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Verificar se o usuário é o proprietário da campanha
      const advertiser = await db.query.advertisers.findFirst({
        where: (adv: any, { eq }: any) => eq(adv.userId, ctx.user.id),
      });

      if (!advertiser || advertiser.id !== campaign.advertiserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this campaign",
        });
      }

      // Buscar produtos da campanha
      const products = await db.query.campaignProducts.findMany({
        where: (prod: any, { eq }: any) => eq(prod.campaignId, input.campaignId),
      });

      return {
        success: true,
        campaign,
        products,
      };
    } catch (error) {
      console.error("Error getting campaign details:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get campaign details",
      });
    }
  });

/**
 * Exportar campanhas em CSV
 */
const exportCampaignsCSV = protectedProcedure
  .query(async ({ ctx }) => {
    try {
      const db = getDb();
      
      // Buscar todas as campanhas do usuário
      const campaigns = await (db as any).query.adCampaigns.findMany({
        where: (campaign: any, { eq }: any) => eq(campaign.userId, ctx.user.id),
      });

      if (!campaigns || campaigns.length === 0) {
        return {
          success: true,
          csv: "No campaigns found",
          filename: "campaigns_empty.csv",
        };
      }

      // Buscar produtos para cada campanha
      const campaignsWithProducts = await Promise.all(
        campaigns.map(async (campaign: any) => {
          const products = await (db as any).query.campaignProducts.findMany({
            where: (prod: any, { eq }: any) => eq(prod.campaignId, campaign.id),
          });
          return { ...campaign, products };
        })
      );

      // Gerar CSV
      const headers = [
        "ID da Campanha",
        "Nome da Empresa",
        "Email de Contato",
        "Telefone",
        "Duração",
        "Número de Lojas",
        "Número de Produtos",
        "Data de Início",
        "Data de Criação",
        "Status",
        "Valor Total (R$)",
        "Produtos",
      ];

      const rows = campaignsWithProducts.map((campaign: any) => [
        campaign.id,
        campaign.companyName,
        campaign.contactEmail,
        campaign.contactPhone,
        campaign.duration,
        campaign.numberOfStores,
        campaign.numberOfProducts,
        new Date(campaign.startDate).toLocaleDateString("pt-BR"),
        new Date(campaign.createdAt).toLocaleDateString("pt-BR"),
        campaign.status || "active",
        campaign.totalCost?.toFixed(2) || "0.00",
        campaign.products?.map((p: any) => p.productName).join("; ") || "",
      ]);

      // Converter para CSV
      const csv = [
        headers.map((h) => `"${h}"`).join(","),
        ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(",")),
      ].join("\n");

      const filename = `campanhas_kadeh_${new Date().toISOString().split("T")[0]}.csv`;

      return {
        success: true,
        csv,
        filename,
      };
    } catch (error) {
      console.error("Error exporting campaigns to CSV:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export campaigns",
      });
    }
  });

/**
 * Router de campanhas
 */
export const campaignsRouter = router({
  calculatePrice: calculateCampaignPrice,
  validateStartDate,
  create: createCampaign,
  createCheckoutSession,
  listUserCampaigns,
  getCampaignDetails,
  exportCSV: exportCampaignsCSV,
});
