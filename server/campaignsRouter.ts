import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { 
  adCampaigns, 
  adBankPayments,
  advertisers,
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
    })
  )
  .query(async ({ input }) => {
    try {
      const basePrice = PRICING_BY_DURATION[input.duration];
      const multiplier = getStoreMultiplier(input.numberOfStores);
      const totalCost = basePrice * multiplier;

      return {
        success: true,
        basePrice,
        multiplier,
        totalCost,
        breakdown: {
          duration: input.duration,
          numberOfStores: input.numberOfStores,
          basePrice,
          multiplier,
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
        message: "Failed to validate date",
      });
    }
  });

/**
 * Criar nova campanha
 */
export const createCampaign = protectedProcedure
  .input(
    z.object({
      // Dados da Empresa
      companyName: z.string().min(1),
      companyDocument: z.string().min(14).max(14), // CNPJ
      contactEmail: z.string().email(),
      contactPhone: z.string().min(1),
      // Dados da Campanha
      duration: z.enum(["1day", "3days", "7days", "14days"]),
      numberOfStores: z.number().min(1),
      startDate: z.date(),
      // Dados do Produto
      productName: z.string().min(1),
      productImageUrl: z.string().url(),
      productEAN13: z.string().min(13).max(13),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Validar data inicial
      const now = new Date();
      const requiredBusinessDays = 7;
      const earliestStartDate = addBusinessDays(now, requiredBusinessDays);

      if (input.startDate < earliestStartDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `A campanha deve iniciar com antecedência de ${requiredBusinessDays} dias úteis. Data mínima: ${earliestStartDate.toLocaleDateString("pt-BR")}`,
        });
      }

      // Buscar anunciante
      const advertiser = await db
        .select()
        .from(advertisers)
        .where(eq(advertisers.userId, ctx.user!.id))
        .limit(1);

      if (advertiser.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Advertiser not found",
        });
      }

      // Calcular valor total
      const basePrice = PRICING_BY_DURATION[input.duration];
      const multiplier = getStoreMultiplier(input.numberOfStores);
      const totalCost = basePrice * multiplier;

      // Calcular data final
      const durationDays: Record<string, number> = {
        "1day": 1,
        "3days": 3,
        "7days": 7,
        "14days": 14,
      };
      const endDate = new Date(input.startDate);
      endDate.setDate(endDate.getDate() + durationDays[input.duration]);

      // Criar campanha
      const campaign: InsertAdCampaign = {
        advertiserId: advertiser[0].id,
        companyName: input.companyName,
        companyDocument: input.companyDocument,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        duration: input.duration,
        numberOfStores: input.numberOfStores,
        startDate: input.startDate,
        endDate,
        productName: input.productName,
        productImageUrl: input.productImageUrl,
        productEAN13: input.productEAN13,
        basePrice: basePrice.toString(),
        multiplier: multiplier.toString(),
        totalCost: totalCost.toString(),
        status: "pending_approval",
      };

      const result = await db.insert(adCampaigns).values(campaign);
      const campaignId = result[0]?.insertId || 0;

      // Enviar email de notificação
      const emailContent = `
Nova Campanha Kadeh Ads Solicitada

Empresa: ${input.companyName}
CNPJ: ${input.companyDocument}
Email: ${input.contactEmail}
Telefone: ${input.contactPhone}

Dados da Campanha:
- Produto: ${input.productName}
- EAN13: ${input.productEAN13}
- Duração: ${input.duration}
- Quantidade de Lojas: ${input.numberOfStores}
- Data Inicial: ${input.startDate.toLocaleDateString("pt-BR")}
- Data Final: ${endDate.toLocaleDateString("pt-BR")}

Cálculo de Valor:
- Preço Base: R$ ${basePrice.toFixed(2)}
- Multiplicador (${input.numberOfStores} lojas): x${multiplier.toFixed(2)}
- Valor Total: R$ ${totalCost.toFixed(2)}

Status: Pendente de Aprovação

ID da Campanha: ${campaignId}
`;

      // Notificar admin
      await notifyOwner({
        title: `Nova Campanha Kadeh Ads: ${input.companyName}`,
        content: emailContent,
      });

      // Notificar cliente
      // TODO: Implementar envio de email para o cliente

      return {
        success: true,
        campaignId,
        message: "Campanha criada com sucesso! Aguardando aprovação do administrador.",
        campaign: {
          id: campaignId,
          ...campaign,
        },
      };
    } catch (error) {
      console.error("Error creating campaign:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create campaign",
      });
    }
  });

/**
 * Listar campanhas do usuário
 */
export const listMyCampaigns = protectedProcedure
  .query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Buscar anunciante
      const advertiser = await db
        .select()
        .from(advertisers)
        .where(eq(advertisers.userId, ctx.user!.id))
        .limit(1);

      if (advertiser.length === 0) {
        return {
          success: true,
          campaigns: [],
        };
      }

      // Buscar campanhas
      const campaigns = await db
        .select()
        .from(adCampaigns)
        .where(eq(adCampaigns.advertiserId, advertiser[0].id));

      return {
        success: true,
        campaigns,
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
export const getCampaign = protectedProcedure
  .input(
    z.object({
      campaignId: z.number().min(1),
    })
  )
  .query(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Buscar campanha
      const campaign = await db
        .select()
        .from(adCampaigns)
        .where(eq(adCampaigns.id, input.campaignId))
        .limit(1);

      if (campaign.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Verificar permissão
      const advertiser = await db
        .select()
        .from(advertisers)
        .where(eq(advertisers.userId, ctx.user!.id))
        .limit(1);

      if (advertiser.length === 0 || advertiser[0].id !== campaign[0].advertiserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      return {
        success: true,
        campaign: campaign[0],
      };
    } catch (error) {
      console.error("Error getting campaign:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get campaign",
      });
    }
  });

/**
 * Upload de imagem para S3
 */
export const uploadProductImage = protectedProcedure
  .input(
    z.object({
      fileName: z.string().min(1),
      fileData: z.string(), // Sem limite de tamanho
      mimeType: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const buffer = Buffer.from(input.fileData, 'base64');
      const fileKey = `kadeh-ads/products/${Date.now()}-${input.fileName}`;
      
      const { url } = await storagePut(fileKey, buffer, input.mimeType);
      
      return {
        success: true,
        url,
        fileKey,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload image",
      });
    }
  });

// Export router
export const campaignsRouter = router({
  calculatePrice: calculateCampaignPrice,
  validateStartDate,
  create: createCampaign,
  list: listMyCampaigns,
  get: getCampaign,
  uploadImage: uploadProductImage,
});
