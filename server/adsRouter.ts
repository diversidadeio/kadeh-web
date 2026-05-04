import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { 
  advertisements, 
  adAnalytics, 
  adPayments, 
  correlatedCategories,
  advertisers
} from "../drizzle/schema";
import { eq, and, desc, lte, gte } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import crypto from "crypto";
// Stripe será configurado quando as credenciais forem fornecidas
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" } as any);

/**
 * Procedimento para sugerir categorias correlacionadas com IA
 */
export const suggestCorrelatedCategories = protectedProcedure
  .input(
    z.object({
      productName: z.string().min(1),
      productCategory: z.string().min(1),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em varejo e marketing. Analise o produto fornecido e sugira 5 categorias de produtos correlacionadas que frequentemente são comprados juntos ou complementam o produto principal. Retorne um JSON com array de objetos contendo 'category' e 'reason'.",
          },
          {
            role: "user",
            content: `Produto Principal: ${input.productName} (${input.productCategory})\nDescrição: ${input.description || "N/A"}\n\nSugira categorias correlacionadas em JSON.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "correlated_categories",
            strict: true,
            schema: {
              type: "object",
              properties: {
                categories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      reason: { type: "string" },
                      correlationScore: { type: "number", minimum: 0, maximum: 1 },
                    },
                    required: ["category", "reason", "correlationScore"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["categories"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from LLM");

      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
      const parsed = JSON.parse(contentStr);
      return {
        success: true,
        categories: parsed.categories,
      };
    } catch (error) {
      console.error("Error suggesting correlated categories:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to suggest categories",
      });
    }
  });

/**
 * Procedimento para visualizar posição de prioridade antes do pagamento
 */
export const previewAdPosition = protectedProcedure
  .input(
    z.object({
      productCategory: z.string().min(1),
      numberOfStores: z.number().min(1),
      duration: z.enum(["1day", "3days", "7days", "14days"]),
    })
  )
  .query(async ({ input }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Buscar anúncios ativos na mesma categoria
      const activeAds = await db
        .select()
        .from(advertisements)
        .where(
          and(
            eq(advertisements.productCategory, input.productCategory),
            eq(advertisements.status, "active")
          )
        )
        .orderBy(desc(advertisements.priorityPosition))
        .limit(10);

      // Calcular posição estimada
      const estimatedPosition = activeAds.length + 1;

      // Buscar preço
      const pricingPlan = await db
        .select()
        .from(z.any() as any) // Usar qualquer tipo para buscar pricing
        .where(
          and(
            eq((z.any() as any).duration, input.duration),
            lte((z.any() as any).minStores, input.numberOfStores),
            gte((z.any() as any).maxStores, input.numberOfStores)
          )
        )
        .limit(1);

      return {
        success: true,
        estimatedPosition,
        activeAdsInCategory: activeAds.length,
        estimatedCost: pricingPlan.length > 0 
          ? Number((pricingPlan[0] as any).pricePerStore) * input.numberOfStores
          : 0,
        preview: {
          position: estimatedPosition,
          visibility: estimatedPosition <= 3 ? "high" : estimatedPosition <= 6 ? "medium" : "low",
          message: estimatedPosition <= 3 
            ? "Seu anúncio será exibido em posição de destaque!"
            : estimatedPosition <= 6
            ? "Seu anúncio será exibido em posição intermediária"
            : "Seu anúncio será exibido em posição padrão",
        },
      };
    } catch (error) {
      console.error("Error previewing ad position:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to preview position",
      });
    }
  });

/**
 * Procedimento para criar Payment Intent do Stripe
 * TODO: Configurar Stripe API key via webdev_request_secrets
 */
// export const createPaymentIntent = protectedProcedure
//   .input(
//     z.object({
//       advertisementId: z.number().min(1),
//       amount: z.number().min(0.01),
//       currency: z.string().default("BRL"),
//     })
//   )
//   .mutation(async ({ input, ctx }) => {
//     try {
//       const db = await getDb();
//       if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
//
//       // Verificar se o anúncio pertence ao usuário
//       const ad = await db
//         .select()
//         .from(advertisements)
//         .innerJoin(advertisers, eq(advertisements.advertiserId, advertisers.id))
//         .where(
//           and(
//             eq(advertisements.id, input.advertisementId),
//             eq(advertisers.userId, ctx.user!.id)
//           )
//         )
//         .limit(1);
//
//       if (ad.length === 0) {
//         throw new TRPCError({ code: "FORBIDDEN", message: "Advertisement not found or unauthorized" });
//       }
//
//       // Criar Payment Intent no Stripe
//       // const paymentIntent = await stripe.paymentIntents.create({
//       //   amount: Math.round(input.amount * 100), // Converter para centavos
//       //   currency: input.currency.toLowerCase(),
//       //   metadata: {
//       //     advertisementId: input.advertisementId.toString(),
//       //     userId: ctx.user!.id.toString(),
//       //   },
//       // });
//
//       // Atualizar anúncio com Payment Intent ID
//       // await db
//       //   .update(advertisements)
//       //   .set({
//       //     paymentIntentId: paymentIntent.id,
//       //     status: "pending_payment",
//       //   })
//       //   .where(eq(advertisements.id, input.advertisementId));
//
//       // return {
//       //   success: true,
//       //   clientSecret: paymentIntent.client_secret,
//       //   paymentIntentId: paymentIntent.id,
//       // };
//     } catch (error) {
//       console.error("Error creating payment intent:", error);
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to create payment intent",
//       });
//     }
//   });

const createPaymentIntent = protectedProcedure
  .input(
    z.object({
      advertisementId: z.number().min(1),
      amount: z.number().min(0.01),
      currency: z.string().default("BRL"),
    })
  )
  .mutation(async () => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stripe not configured. Please contact support.",
    });
  });

/**
 * Procedimento para confirmar pagamento e gerar recibo
 * TODO: Configurar Stripe API key via webdev_request_secrets
 */
// export const confirmPayment = protectedProcedure
//   .input(
//     z.object({
//       paymentIntentId: z.string().min(1),
//       advertisementId: z.number().min(1),
//     })
//   )
//   .mutation(async ({ input, ctx }) => {
//     try {
//       const db = await getDb();
//       if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
//
//       // Verificar status do Payment Intent no Stripe
//       // const paymentIntent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
//
//       if (paymentIntent.status !== "succeeded") {
//         throw new TRPCError({ code: "BAD_REQUEST", message: "Payment not completed" });
//       }
//
//       // Atualizar status do anúncio para ativo
//       const now = new Date();
//       await db
//         .update(advertisements)
//         .set({
//           status: "active",
//           startDate: now,
//           totalCost: (paymentIntent.amount / 100).toString(),
//         })
//         .where(eq(advertisements.id, input.advertisementId));
//
//       // Registrar pagamento
//       const invoiceNumber = `INV-${Date.now()}-${input.advertisementId}`;
//       await db.insert(adPayments).values({
//         advertisementId: input.advertisementId,
//         stripePaymentIntentId: input.paymentIntentId,
//         amount: (paymentIntent.amount / 100).toString(),
//         currency: paymentIntent.currency.toUpperCase(),
//         status: "succeeded",
//         invoiceNumber,
//         paidAt: new Date(),
//       });
//
//       return {
//         success: true,
//         invoiceNumber,
//         message: "Pagamento confirmado! Seu anúncio está ativo.",
//       };
//     } catch (error) {
//       console.error("Error confirming payment:", error);
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to confirm payment",
//       });
//     }
//   });

const confirmPayment = protectedProcedure
  .input(
    z.object({
      paymentIntentId: z.string().min(1),
      advertisementId: z.number().min(1),
    })
  )
  .mutation(async () => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stripe not configured. Please contact support.",
    });
  });

/**
 * Procedimento para obter analytics de um anúncio
 */
export const getAdAnalytics = protectedProcedure
  .input(
    z.object({
      advertisementId: z.number().min(1),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verificar se o anúncio pertence ao usuário
      const ad = await db
        .select()
        .from(advertisements)
        .innerJoin(advertisers, eq(advertisements.advertiserId, advertisers.id))
        .where(
          and(
            eq(advertisements.id, input.advertisementId),
            eq(advertisers.userId, ctx.user!.id)
          )
        )
        .limit(1);

      if (ad.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Advertisement not found or unauthorized" });
      }

      // Buscar analytics
      let query: any = db
        .select()
        .from(adAnalytics)
        .where(eq(adAnalytics.advertisementId, input.advertisementId));

      if (input.startDate) {
        query = db
          .select()
          .from(adAnalytics)
          .where(
            and(
              eq(adAnalytics.advertisementId, input.advertisementId),
              gte(adAnalytics.date, input.startDate)
            )
          );
      }

      if (input.endDate) {
        query = db
          .select()
          .from(adAnalytics)
          .where(
            and(
              eq(adAnalytics.advertisementId, input.advertisementId),
              lte(adAnalytics.date, input.endDate)
            )
          );
      }

      const analytics = await query;

      // Calcular totais
      const totals = {
        impressions: analytics.reduce((sum: number, a: any) => sum + (a.impressions || 0), 0),
        clicks: analytics.reduce((sum: number, a: any) => sum + (a.clicks || 0), 0),
        conversions: analytics.reduce((sum: number, a: any) => sum + (a.conversions || 0), 0),
        conversionValue: analytics.reduce((sum: number, a: any) => sum + Number(a.conversionValue || 0), 0),
      };

      return {
        success: true,
        analytics,
        totals,
        ctr: totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : "0.00",
        conversionRate: totals.clicks > 0 ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : "0.00",
      };
    } catch (error) {
      console.error("Error getting ad analytics:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get analytics",
      });
    }
  });

/**
 * Procedimento para pausar anúncio com aviso de 24h
 */
export const requestAdPause = protectedProcedure
  .input(
    z.object({
      advertisementId: z.number().min(1),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verificar se o anúncio pertence ao usuário
      const ad = await db
        .select()
        .from(advertisements)
        .innerJoin(advertisers, eq(advertisements.advertiserId, advertisers.id))
        .where(
          and(
            eq(advertisements.id, input.advertisementId),
            eq(advertisers.userId, ctx.user!.id)
          )
        )
        .limit(1);

      if (ad.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Advertisement not found or unauthorized" });
      }

      const now = new Date();
      const pauseEffectiveAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas depois

      // Atualizar anúncio
      await db
        .update(advertisements)
        .set({
          pauseRequestedAt: now,
          pauseEffectiveAt,
        })
        .where(eq(advertisements.id, input.advertisementId));

      return {
        success: true,
        message: "Pausa solicitada. O anúncio será pausado em 24 horas.",
        pauseEffectiveAt,
      };
    } catch (error) {
      console.error("Error requesting ad pause:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to request pause",
      });
    }
  });

/**
 * Procedimento para gerar link de promoção único com código do varejista
 */
export const generatePromotionLink = protectedProcedure
  .input(
    z.object({
      advertisementId: z.number().min(1),
      storeCount: z.number().min(1),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verificar se o anúncio pertence ao usuário
      const ad = await db
        .select()
        .from(advertisements)
        .innerJoin(advertisers, eq(advertisements.advertiserId, advertisers.id))
        .where(
          and(
            eq(advertisements.id, input.advertisementId),
            eq(advertisers.userId, ctx.user!.id)
          )
        )
        .limit(1);

      if (ad.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Advertisement not found or unauthorized" });
      }

      // Gerar código único do varejista (ex: KADEH-ABC123)
      const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
      const retailerCode = `KADEH-${randomSuffix}`;
      
      // Gerar link de promoção
      const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "https://kadeh.io";
      const promotionLink = `${baseUrl}/ads/promo/${retailerCode}`;

      // Atualizar anúncio com código e link
      await db
        .update(advertisements)
        .set({
          retailerCode,
          promotionLink,
          storeCount: input.storeCount,
        })
        .where(eq(advertisements.id, input.advertisementId));

      return {
        success: true,
        retailerCode,
        promotionLink,
        message: "Link de promoção gerado com sucesso!",
      };
    } catch (error) {
      console.error("Error generating promotion link:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate promotion link",
      });
    }
  });

/**
 * Procedimento para obter estatísticas do varejista (código único)
 */
export const getRetailerStats = publicProcedure
  .input(
    z.object({
      retailerCode: z.string().min(1),
    })
  )
  .query(async ({ input }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Buscar anúncio pelo código do varejista
      const ad = await db
        .select()
        .from(advertisements)
        .where(eq(advertisements.retailerCode, input.retailerCode))
        .limit(1);

      if (ad.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Retailer code not found" });
      }

      const advertisement = ad[0];

      return {
        success: true,
        retailerCode: advertisement.retailerCode,
        storeCount: advertisement.storeCount,
        productCount: advertisement.productCount,
        advertisedProductCount: advertisement.advertisedProductCount,
        promotionLink: advertisement.promotionLink,
        status: advertisement.status,
        createdAt: advertisement.createdAt,
      };
    } catch (error) {
      console.error("Error getting retailer stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get retailer stats",
      });
    }
  });

/**
 * Procedimento para atualizar estatísticas do varejista
 */
export const updateRetailerStats = protectedProcedure
  .input(
    z.object({
      advertisementId: z.number().min(1),
      productCount: z.number().min(0).optional(),
      advertisedProductCount: z.number().min(0).optional(),
      storeCount: z.number().min(1).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verificar se o anúncio pertence ao usuário
      const ad = await db
        .select()
        .from(advertisements)
        .innerJoin(advertisers, eq(advertisements.advertiserId, advertisers.id))
        .where(
          and(
            eq(advertisements.id, input.advertisementId),
            eq(advertisers.userId, ctx.user!.id)
          )
        )
        .limit(1);

      if (ad.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Advertisement not found or unauthorized" });
      }

      // Preparar dados para atualizar
      const updateData: any = {};
      if (input.productCount !== undefined) updateData.productCount = input.productCount;
      if (input.advertisedProductCount !== undefined) updateData.advertisedProductCount = input.advertisedProductCount;
      if (input.storeCount !== undefined) updateData.storeCount = input.storeCount;

      // Atualizar anúncio
      await db
        .update(advertisements)
        .set(updateData)
        .where(eq(advertisements.id, input.advertisementId));

      // Buscar dados atualizados
      const updated = await db
        .select()
        .from(advertisements)
        .where(eq(advertisements.id, input.advertisementId))
        .limit(1);

      return {
        success: true,
        retailerCode: updated[0].retailerCode,
        storeCount: updated[0].storeCount,
        productCount: updated[0].productCount,
        advertisedProductCount: updated[0].advertisedProductCount,
      };
    } catch (error) {
      console.error("Error updating retailer stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update retailer stats",
      });
    }
  });

// Export router
export const adsRouter = router({
  suggestCorrelatedCategories,
  previewAdPosition,
  // createPaymentIntent, // TODO: Enable after Stripe configuration
  // confirmPayment, // TODO: Enable after Stripe configuration
  getAdAnalytics,
  requestAdPause,
  generatePromotionLink,
  getRetailerStats,
  updateRetailerStats,
});
