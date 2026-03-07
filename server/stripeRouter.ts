import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { adCampaigns, stripeCheckoutSessions } from "../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Cálculo de preço baseado em duração e número de lojas
 */
function calculateAdsCost(
  duration: "1day" | "3days" | "7days" | "14days",
  numberOfStores: number
): { basePrice: number; multiplier: number; totalPrice: number } {
  const durationDays = {
    "1day": 1,
    "3days": 3,
    "7days": 7,
    "14days": 14,
  };

  const pricePerStorePerDay = 89; // R$ 89,00
  const days = durationDays[duration];

  let multiplier = 1.0;
  if (numberOfStores > 5 && numberOfStores <= 10) {
    multiplier = 0.9; // 10% desconto
  } else if (numberOfStores > 10 && numberOfStores <= 20) {
    multiplier = 0.8; // 20% desconto
  } else if (numberOfStores > 20) {
    multiplier = 0.7; // 30% desconto
  }

  const basePrice = pricePerStorePerDay * days * numberOfStores;
  const totalPrice = basePrice * multiplier;

  return {
    basePrice,
    multiplier,
    totalPrice,
  };
}

export const stripeRouter = router({
  /**
   * Criar sessão de checkout Stripe
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        cnpj: z.string().min(14),
        email: z.string().email(),
        phone: z.string().min(10),
        productName: z.string().min(1),
        ean13: z.string().length(13),
        duration: z.enum(["1day", "3days", "7days", "14days"]),
        numberOfStores: z.number().min(1).max(1000),
        productImageUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Validar CNPJ
        const cnpjNumbers = input.cnpj.replace(/\D/g, "");
        if (cnpjNumbers.length !== 14) {
          throw new Error("CNPJ inválido");
        }

        // Validar EAN13
        if (input.ean13.replace(/\D/g, "").length !== 13) {
          throw new Error("EAN13 inválido");
        }

        // Validar duplicatas - verificar se há campanha ativa para o mesmo produto
        const existingCampaigns = await db
          .select()
          .from(adCampaigns)
          .where(
            and(
              eq(adCampaigns.advertiserId, ctx.user.id),
              eq(adCampaigns.productEAN13, input.ean13),
              inArray(adCampaigns.status, ["payment_pending", "approved", "active"])
            )
          );

        if (existingCampaigns && existingCampaigns.length > 0) {
          throw new Error("Você já possui uma campanha ativa para este produto. Aguarde o término da campanha anterior.");
        }

        // Calcular preço
        const pricing = calculateAdsCost(input.duration, input.numberOfStores);

        // Criar campanha no banco de dados
        const startDate = new Date();
        const endDate = new Date();
        const durationDays = {
          "1day": 1,
          "3days": 3,
          "7days": 7,
          "14days": 14,
        };
        endDate.setDate(endDate.getDate() + durationDays[input.duration]);

        const campaign = await db
          .insert(adCampaigns)
          .values({
            advertiserId: ctx.user.id,
            companyName: input.companyName,
            companyDocument: input.cnpj,
            contactEmail: input.email,
            contactPhone: input.phone,
            productName: input.productName,
            productEAN13: input.ean13,
            productImageUrl: input.productImageUrl,
            duration: input.duration,
            numberOfStores: input.numberOfStores,
            basePrice: pricing.basePrice,
            multiplier: pricing.multiplier,
            totalCost: pricing.totalPrice,
            status: "payment_pending",
            startDate: startDate,
            endDate: endDate,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        const campaignId = (campaign as any)[0]?.id || (campaign as any).insertId;

        // Criar sessão de checkout Stripe
        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: input.email,
          client_reference_id: campaignId.toString(),
          line_items: [
            {
              price_data: {
                currency: "brl",
                product_data: {
                  name: `Kadeh Ads - ${input.productName}`,
                  description: `${input.numberOfStores} lojas por ${input.duration === "1day" ? "1 dia" : input.duration === "3days" ? "3 dias" : input.duration === "7days" ? "7 dias" : "14 dias"}`,
                  images: [input.productImageUrl],
                },
                unit_amount: Math.round(pricing.totalPrice * 100), // Stripe usa centavos
              },
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/pt/kadeh-ads/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/pt/kadeh-ads/cancel`,
          metadata: {
            campaign_id: campaignId.toString(),
            customer_email: input.email,
            customer_name: input.companyName,
            product_name: input.productName,
            ean13: input.ean13,
          },
        });

        // Salvar sessão de checkout no banco de dados
        await db.insert(stripeCheckoutSessions).values({
          sessionId: checkoutSession.id,
          campaignId: campaignId,
          paymentIntentId: checkoutSession.payment_intent as string,
          status: "pending",
          createdAt: new Date(),
        });

        return {
          sessionId: checkoutSession.id,
          checkoutUrl: checkoutSession.url,
          campaignId: campaignId,
          pricing: {
            basePrice: pricing.basePrice,
            discountPercentage: (1 - pricing.multiplier) * 100,
            totalPrice: pricing.totalPrice,
          },
        };
      } catch (error) {
        console.error("[Stripe Router] Error creating checkout session:", error);
        throw error;
      }
    }),

  /**
   * Obter status de uma campanha
   */
  getCampaignStatus: publicProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const campaign = await db
          .select()
          .from(adCampaigns)
          .where(eq(adCampaigns.id, input.campaignId))
          .limit(1);

        if (!campaign || campaign.length === 0) {
          throw new Error("Campaign not found");
        }

        return campaign[0];
      } catch (error) {
        console.error("[Stripe Router] Error getting campaign status:", error);
        throw error;
      }
    }),

  /**
   * Listar campanhas do usuário
   */
  listUserCampaigns: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const campaigns = await db
        .select()
        .from(adCampaigns)
        .where(eq(adCampaigns.advertiserId, ctx.user.id));

      return campaigns;
    } catch (error) {
      console.error("[Stripe Router] Error listing campaigns:", error);
      throw error;
    }
  }),

  /**
   * Calcular preço (sem criar campanha)
   */
  calculatePrice: publicProcedure
    .input(
      z.object({
        duration: z.enum(["1day", "3days", "7days", "14days"]),
        numberOfStores: z.number().min(1).max(1000),
      })
    )
    .query(({ input }) => {
      const pricing = calculateAdsCost(input.duration, input.numberOfStores);
      return {
        basePrice: pricing.basePrice,
        discountPercentage: (1 - pricing.multiplier) * 100,
        totalPrice: pricing.totalPrice,
      };
    }),
});
