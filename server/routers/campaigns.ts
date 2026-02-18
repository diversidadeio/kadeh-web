import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { advertisements, advertisers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const campaignsRouter = router({
  /**
   * Solicitar pausa de campanha com aviso de 24h
   */
  requestPause: protectedProcedure
    .input(
      z.object({
        advertisementId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Buscar anúncio
        const adList = await db
          .select()
          .from(advertisements)
          .where(eq(advertisements.id, input.advertisementId))
          .limit(1);
        const ad = adList.length > 0 ? adList[0] : null;

        if (!ad) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Advertisement not found",
          });
        }

        // Verificar se o usuário é o proprietário do anúncio
        const advertiserList = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, ad.advertiserId))
          .limit(1);
        const advertiser = advertiserList.length > 0 ? advertiserList[0] : null;

        if (!advertiser || advertiser.userId !== ctx.user?.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to pause this advertisement",
          });
        }

        // Verificar se já há uma solicitação de pausa pendente
        if (ad.pauseRequestedAt) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Pause request already pending for this advertisement",
          });
        }

        // Calcular data efetiva de pausa (24h depois)
        const now = new Date();
        const pauseEffectiveAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Atualizar anúncio com data de solicitação de pausa
        await db
          .update(advertisements)
          .set({
            pauseRequestedAt: now,
            pauseEffectiveAt: pauseEffectiveAt,
            updatedAt: now,
          })
          .where(eq(advertisements.id, input.advertisementId));

        return {
          success: true,
          message: "Pause request submitted. Campaign will pause in 24 hours.",
          pauseEffectiveAt: pauseEffectiveAt,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to request pause",
        });
      }
    }),

  /**
   * Cancelar solicitação de pausa
   */
  cancelPauseRequest: protectedProcedure
    .input(
      z.object({
        advertisementId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Buscar anúncio
        const adList = await db
          .select()
          .from(advertisements)
          .where(eq(advertisements.id, input.advertisementId))
          .limit(1);
        const ad = adList.length > 0 ? adList[0] : null;

        if (!ad) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Advertisement not found",
          });
        }

        // Verificar se o usuário é o proprietário do anúncio
        const advertiserList = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, ad.advertiserId))
          .limit(1);
        const advertiser = advertiserList.length > 0 ? advertiserList[0] : null;

        if (!advertiser || advertiser.userId !== ctx.user?.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to cancel pause for this advertisement",
          });
        }

        // Verificar se há uma solicitação de pausa pendente
        if (!ad.pauseRequestedAt) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No pause request pending for this advertisement",
          });
        }

        // Cancelar solicitação de pausa
        await db
          .update(advertisements)
          .set({
            pauseRequestedAt: null,
            pauseEffectiveAt: null,
            updatedAt: new Date(),
          })
          .where(eq(advertisements.id, input.advertisementId));

        return {
          success: true,
          message: "Pause request cancelled",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel pause request",
        });
      }
    }),

  /**
   * Obter status de pausa pendente
   */
  getPauseStatus: protectedProcedure
    .input(
      z.object({
        advertisementId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Buscar anúncio
        const adList = await db
          .select()
          .from(advertisements)
          .where(eq(advertisements.id, input.advertisementId))
          .limit(1);
        const ad = adList.length > 0 ? adList[0] : null;

        if (!ad) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Advertisement not found",
          });
        }

        // Verificar se o usuário é o proprietário do anúncio
        const advertiserList = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, ad.advertiserId))
          .limit(1);
        const advertiser = advertiserList.length > 0 ? advertiserList[0] : null;

        if (!advertiser || advertiser.userId !== ctx.user?.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to view this advertisement",
          });
        }

        if (!ad.pauseRequestedAt) {
          return {
            hasPendingPause: false,
            pauseRequestedAt: null,
            pauseEffectiveAt: null,
            hoursUntilPause: null,
          };
        }

        const now = new Date();
        const hoursUntilPause = Math.ceil(
          (ad.pauseEffectiveAt!.getTime() - now.getTime()) / (1000 * 60 * 60)
        );

        return {
          hasPendingPause: true,
          pauseRequestedAt: ad.pauseRequestedAt,
          pauseEffectiveAt: ad.pauseEffectiveAt,
          hoursUntilPause: Math.max(0, hoursUntilPause),
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get pause status",
        });
      }
    }),
});
