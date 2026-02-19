import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { advertisers, advertisements, adPayments, adAnalytics, pricingPlans, correlatedCategories, InsertAdvertiser, InsertAdvertisement, InsertAdPayment, InsertAdAnalytic, InsertPricingPlan, InsertCorrelatedCategory } from "../drizzle/schema";
import { getAdvertiserByUserId, getAdvertiserById, getPendingAdvertisers, getApprovedAdvertisers, getActiveAdsByCategory, getAdvertisementById, getAdvertisementsByAdvertiserId, getPricingPlans, getCorrelatedCategories, getAdAnalyticsByAdvertisementId, getPaymentByAdvertisementId, getNextPriorityPosition } from "./db";
import { eq, and } from "drizzle-orm";
import { stripeRouter } from "./routers/stripe";
import { campaignsRouter } from "./routers/campaigns";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().email(),
          type: z.enum(["consumer", "business"]),
          companyName: z.string().optional(),
          cnpj: z.string().optional(),
          contactPreference: z.enum(["whatsapp", "email", "phone"]),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const contactType = input.type === "consumer" ? "Consumidor" : "Empresa";
        const preferenceLabel = input.contactPreference === "whatsapp" ? "WhatsApp" : input.contactPreference === "email" ? "Email" : "Telefone";
        
        let emailContent = `
Novo Contato via Formulário Kadeh

Nome: ${input.name}
Telefone: ${input.phone}
Email: ${input.email}
Tipo: ${contactType}
Preferência de Contato: ${preferenceLabel}
`;

        if (input.type === "business") {
          emailContent += `
Empresa: ${input.companyName || "N/A"}
CNPJ: ${input.cnpj || "N/A"}
`;
        }

        if (input.message) {
          emailContent += `
Mensagem:
${input.message}
`;
        }

        await notifyOwner({
          title: `Novo Contato: ${input.name}`,
          content: emailContent,
        });

        return { success: true };
      }),
  }),

  // ============================================================================
  // KADEH ADS - Advertising System
  // ============================================================================
  ads: router({
    // Advertiser Registration and Management
    registerAdvertiser: protectedProcedure
      .input(
        z.object({
          companyName: z.string().min(1),
          companyDocument: z.string().min(14).max(14),
          contactEmail: z.string().email(),
          contactPhone: z.string().optional(),
          website: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const existing = await getAdvertiserByUserId(ctx.user!.id);
        if (existing) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Advertiser already registered" });
        }

        const newAdvertiser: InsertAdvertiser = {
          userId: ctx.user!.id,
          companyName: input.companyName,
          companyDocument: input.companyDocument,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          website: input.website,
          status: "pending",
          approvedBy: 0,
        };

        const result = await db.insert(advertisers).values(newAdvertiser);
        return { id: result[0], status: "pending" };
      }),

    getMyAdvertiser: protectedProcedure.query(async ({ ctx }) => {
      return getAdvertiserByUserId(ctx.user!.id);
    }),

    getPendingAdvertisers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      return getPendingAdvertisers();
    }),

    approveAdvertiser: protectedProcedure
      .input(z.object({ advertiserId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await db
          .update(advertisers)
          .set({
            status: "approved",
            approvedBy: ctx.user.id,
            approvalDate: new Date(),
          })
          .where(eq(advertisers.id, input.advertiserId));

        return { success: true };
      }),

    rejectAdvertiser: protectedProcedure
      .input(z.object({ advertiserId: z.number(), reason: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await db
          .update(advertisers)
          .set({
            status: "rejected",
            rejectionReason: input.reason,
          })
          .where(eq(advertisers.id, input.advertiserId));

        return { success: true };
      }),

    getPricingPlans: publicProcedure.query(async () => {
      return getPricingPlans();
    }),

    getCorrelatedCategories: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return getCorrelatedCategories(input.category);
      }),

    createAdvertisement: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().url(),
          productName: z.string().optional(),
          productCategory: z.string(),
          targetCategories: z.array(z.string()),
          adType: z.enum(["product", "promotion", "store"]),
          duration: z.enum(["1day", "3days", "7days", "14days"]),
          numberOfStores: z.number().min(1),
          selectedStores: z.array(z.number()).optional(),
          region: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const advertiser = await getAdvertiserByUserId(ctx.user!.id);
        if (!advertiser) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Advertiser not registered" });
        }
        if (advertiser.status !== "approved") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Advertiser not approved" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const priorityPosition = await getNextPriorityPosition();

        const newAd: InsertAdvertisement = {
          advertiserId: advertiser.id,
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          productName: input.productName,
          productCategory: input.productCategory,
          targetCategories: input.targetCategories,
          adType: input.adType,
          duration: input.duration,
          numberOfStores: input.numberOfStores,
          selectedStores: input.selectedStores,
          region: input.region,
          status: "draft",
          priorityPosition: priorityPosition,
          totalCost: "0.00",
        };

        const result = await db.insert(advertisements).values(newAd);
        return { id: result[0], priorityPosition };
      }),

    getMyAdvertisements: protectedProcedure.query(async ({ ctx }) => {
      const advertiser = await getAdvertiserByUserId(ctx.user!.id);
      if (!advertiser) return [];
      return getAdvertisementsByAdvertiserId(advertiser.id);
    }),

    getAdvertisement: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getAdvertisementById(input.id);
      }),

    getAdvertisementAnalytics: protectedProcedure
      .input(z.object({ advertisementId: z.number(), days: z.number().optional() }))
      .query(async ({ input, ctx }) => {
        const ad = await getAdvertisementById(input.advertisementId);
        if (!ad) throw new TRPCError({ code: "NOT_FOUND" });

        const advertiser = await getAdvertiserByUserId(ctx.user!.id);
        if (!advertiser || advertiser.id !== ad.advertiserId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return getAdAnalyticsByAdvertisementId(input.advertisementId, input.days);
      }),

    getActiveByCategory: publicProcedure
      .input(z.object({ category: z.string(), region: z.string().optional() }))
      .query(async ({ input }) => {
        return getActiveAdsByCategory(input.category);
      }),

    recordClick: publicProcedure
      .input(z.object({ advertisementId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await db
          .select()
          .from(adAnalytics)
          .where(
            and(
              eq(adAnalytics.advertisementId, input.advertisementId),
              eq(adAnalytics.date, today)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(adAnalytics)
            .set({ clicks: existing[0].clicks + 1 })
            .where(eq(adAnalytics.id, existing[0].id));
        } else {
          await db.insert(adAnalytics).values({
            advertisementId: input.advertisementId,
            date: today,
            clicks: 1,
            impressions: 0,
            conversions: 0,
          });
        }

        return { success: true };
      }),
  }),
  stripe: stripeRouter,
  campaigns: campaignsRouter,
});

export type AppRouter = typeof appRouter;
