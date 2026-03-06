import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { adCampaigns, stripeCheckoutSessions, stripePayments, stripeCustomers, advertisers } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

/**
 * Cálculo de preço baseado em duração e número de lojas
 * R$ 89,00/dia/loja até 5 lojas, com desconto progressivo
 */
function calculateAdsCost(
  duration: "1day" | "3days" | "7days" | "14days",
  numberOfStores: number
): { basePrice: number; multiplier: number; totalCost: number } {
  const durationDays = {
    "1day": 1,
    "3days": 3,
    "7days": 7,
    "14days": 14,
  };

  const pricePerStorePerDay = 89; // R$ 89,00
  const days = durationDays[duration];

  // Desconto progressivo
  let multiplier = 1.0;
  if (numberOfStores > 5 && numberOfStores <= 10) {
    multiplier = 0.9; // 10% de desconto
  } else if (numberOfStores > 10 && numberOfStores <= 20) {
    multiplier = 0.8; // 20% de desconto
  } else if (numberOfStores > 20) {
    multiplier = 0.7; // 30% de desconto
  }

  const basePrice = pricePerStorePerDay * days * numberOfStores;
  const totalCost = basePrice * multiplier;

  return {
    basePrice,
    multiplier,
    totalCost: Math.round(totalCost * 100) / 100, // Arredondar para 2 casas decimais
  };
}

export const adsPaymentRouter = router({
  /**
   * Calcular preço de uma campanha
   */
  calculatePrice: publicProcedure
    .input(
      z.object({
        duration: z.enum(["1day", "3days", "7days", "14days"]),
        numberOfStores: z.number().int().min(1).max(1000),
      })
    )
    .query(({ input }) => {
      return calculateAdsCost(input.duration, input.numberOfStores);
    }),

  /**
   * Criar uma nova campanha de anúncio
   */
  createCampaign: protectedProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        companyDocument: z.string().min(11).max(20), // CNPJ
        contactEmail: z.string().email(),
        contactPhone: z.string().min(10),
        duration: z.enum(["1day", "3days", "7days", "14days"]),
        numberOfStores: z.number().int().min(1).max(1000),
        startDate: z.date(),
        productName: z.string().min(1),
        productImageUrl: z.string().url(),
        productEAN13: z.string().length(13),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar se o anunciante existe
      const advertiser = await db.query.advertisers.findFirst({
        where: eq(advertisers.userId, ctx.user.id),
      });

      if (!advertiser) {
        throw new Error("Anunciante não encontrado");
      }

      const { basePrice, multiplier, totalCost } = calculateAdsCost(
        input.duration,
        input.numberOfStores
      );

      // Calcular data final
      const durationDays = {
        "1day": 1,
        "3days": 3,
        "7days": 7,
        "14days": 14,
      };

      const endDate = new Date(input.startDate);
      endDate.setDate(endDate.getDate() + durationDays[input.duration]);

      // Criar campanha
      const result = await db.insert(adCampaigns).values({
        advertiserId: advertiser.id,
        companyName: input.companyName,
        companyDocument: input.companyDocument,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        duration: input.duration,
        numberOfStores: input.numberOfStores,
        startDate: input.startDate,
        endDate: endDate,
        productName: input.productName,
        productImageUrl: input.productImageUrl,
        productEAN13: input.productEAN13,
        basePrice: basePrice.toString(),
        multiplier: multiplier.toString(),
        totalCost: totalCost.toString(),
        status: "pending_approval",
      });

      return {
        campaignId: result.insertId,
        basePrice,
        multiplier,
        totalCost,
        message: "Campanha criada com sucesso. Aguardando aprovação do administrador.",
      };
    }),

  /**
   * Obter detalhes de uma campanha
   */
  getCampaign: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const campaign = await db.query.adCampaigns.findFirst({
        where: eq(adCampaigns.id, input.campaignId),
      });

      if (!campaign) {
        throw new Error("Campanha não encontrada");
      }

      // Verificar permissão
      const advertiser = await db.query.advertisers.findFirst({
        where: eq(advertisers.id, campaign.advertiserId),
      });

      if (advertiser?.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }

      return campaign;
    }),

  /**
   * Criar sessão de checkout Stripe
   */
  createCheckoutSession: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const campaign = await db.query.adCampaigns.findFirst({
        where: eq(adCampaigns.id, input.campaignId),
      });

      if (!campaign) {
        throw new Error("Campanha não encontrada");
      }

      // Verificar permissão
      const advertiser = await db.query.advertisers.findFirst({
        where: eq(advertisers.id, campaign.advertiserId),
      });

      if (advertiser?.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }

      // Verificar se campanha foi aprovada
      if (campaign.status !== "approved") {
        throw new Error("Campanha não foi aprovada para pagamento");
      }

      // Obter ou criar cliente Stripe
      let stripeCustomer = await db.query.stripeCustomers.findFirst({
        where: eq(stripeCustomers.advertiserId, advertiser.id),
      });

      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: campaign.contactEmail,
          name: campaign.companyName,
          metadata: {
            advertiserId: advertiser.id.toString(),
            companyDocument: campaign.companyDocument,
          },
        });

        await db.insert(stripeCustomers).values({
          advertiserId: advertiser.id,
          stripeCustomerId: customer.id,
          email: campaign.contactEmail,
          name: campaign.companyName,
        });

        stripeCustomer = {
          id: 0,
          advertiserId: advertiser.id,
          stripeCustomerId: customer.id,
          email: campaign.contactEmail,
          name: campaign.companyName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Criar sessão de checkout
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `Kadeh Ads - ${campaign.productName}`,
                description: `Campanha de ${campaign.duration} em ${campaign.numberOfStores} loja(s)`,
                images: [campaign.productImageUrl],
              },
              unit_amount: Math.round(parseFloat(campaign.totalCost.toString()) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.VITE_FRONTEND_URL || "http://localhost:5173"}/kadeh-ads/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VITE_FRONTEND_URL || "http://localhost:5173"}/kadeh-ads/cancel`,
        metadata: {
          campaignId: input.campaignId.toString(),
          advertiserId: advertiser.id.toString(),
        },
      });

      // Salvar sessão de checkout
      await db.insert(stripeCheckoutSessions).values({
        campaignId: input.campaignId,
        stripeSessionId: session.id,
        stripeCustomerId: stripeCustomer.stripeCustomerId,
        amount: parseFloat(campaign.totalCost.toString()),
        currency: "BRL",
        status: "open",
        paymentStatus: "unpaid",
        checkoutUrl: session.url || "",
        successUrl: session.success_url || "",
        cancelUrl: session.cancel_url || "",
        expiresAt: new Date(session.expires_at * 1000),
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Obter status de pagamento de uma campanha
   */
  getPaymentStatus: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const campaign = await db.query.adCampaigns.findFirst({
        where: eq(adCampaigns.id, input.campaignId),
      });

      if (!campaign) {
        throw new Error("Campanha não encontrada");
      }

      const payment = await db.query.stripePayments.findFirst({
        where: eq(stripePayments.campaignId, input.campaignId),
      });

      return {
        campaignStatus: campaign.status,
        paymentStatus: payment?.status || "not_started",
        amount: payment?.amount || campaign.totalCost,
        paidAt: payment?.paidAt,
      };
    }),

  /**
   * Listar campanhas do anunciante autenticado
   */
  listMyCampaigns: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const advertiser = await db.query.advertisers.findFirst({
      where: eq(advertisers.userId, ctx.user.id),
    });

    if (!advertiser) {
      return [];
    }

    const campaigns = await db.query.adCampaigns.findMany({
      where: eq(adCampaigns.advertiserId, advertiser.id),
    });

    return campaigns;
  }),

  /**
   * Listar todas as campanhas (apenas admin)
   */
  listAllCampaigns: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Acesso negado");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const campaigns = await db.query.adCampaigns.findMany();
    return campaigns;
  }),

  /**
   * Aprovar campanha (apenas admin)
   */
  approveCampaign: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(adCampaigns)
        .set({
          status: "approved",
          approvedBy: ctx.user.id,
          approvalDate: new Date(),
        })
        .where(eq(adCampaigns.id, input.campaignId));

      return { message: "Campanha aprovada com sucesso" };
    }),

  /**
   * Rejeitar campanha (apenas admin)
   */
  rejectCampaign: protectedProcedure
    .input(
      z.object({
        campaignId: z.number(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(adCampaigns)
        .set({
          status: "rejected",
          rejectionReason: input.reason,
        })
        .where(eq(adCampaigns.id, input.campaignId));

      return { message: "Campanha rejeitada com sucesso" };
    }),
});
