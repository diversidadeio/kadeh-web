import { getSessionCookieOptions } from "./_core/cookies";

const COOKIE_NAME = "session";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { adsRouter } from "./adsRouter";
import { campaignsRouter } from "./campaignsRouter";
import { categoriesRouter } from "./categoriesRouter";
import { productsRouter } from "./productsRouter";
import { adsPaymentRouter } from "./adsPaymentRouter";
import { stripeRouter } from "./stripeRouter";
import { storeLayoutRouter } from "./storeLayoutRouter";
import { bulkProductsRouter } from "./bulkProductsRouter";
import { advertisers, advertisements, adPayments, adAnalytics, pricingPlans, correlatedCategories, InsertAdvertiser, InsertAdvertisement, InsertAdPayment, InsertAdAnalytic, InsertPricingPlan, InsertCorrelatedCategory } from "../drizzle/schema";
import { getAdvertiserByUserId, getAdvertiserById, getPendingAdvertisers, getApprovedAdvertisers, getActiveAdsByCategory, getAdvertisementById, getAdvertisementsByAdvertiserId, getPricingPlans, getCorrelatedCategories, getAdAnalyticsByAdvertisementId, getPaymentByAdvertisementId, getNextPriorityPosition, createLocationMap, getLocationMapsByUserId, getLocationMapById, createLocationMapNode, getLocationMapNodes, createLocationMapEdge, getLocationMapEdges, createLocationMapLocation, getLocationMapLocations, createLocationMapRoute, getLocationMapRoutes, deleteLocationMapRoute, updateLocationMapRoute } from "./db";
import { eq, and } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  ads: adsRouter,
  adsPayment: adsPaymentRouter,
  stripe: stripeRouter,
  campaigns: campaignsRouter,
  categories: categoriesRouter,
  products: productsRouter,
  storeLayout: storeLayoutRouter,
  bulkProducts: bulkProductsRouter,
  
  locationMapper: router({
    // Save a complete map with all nodes, edges, locations, and routes
    saveMap: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          venueType: z.string(),
          floorPlanUrl: z.string().optional(),
          description: z.string().optional(),
          nodes: z.array(z.object({
            nodeId: z.string(),
            x: z.number(),
            y: z.number(),
          })),
          edges: z.array(z.object({
            fromNodeId: z.string(),
            toNodeId: z.string(),
            distance: z.number(),
          })),
          locations: z.array(z.object({
            nodeId: z.string(),
            name: z.string(),
            category: z.string(),
            subcategory: z.string().optional(),
          })),
          routes: z.array(z.object({
            routeId: z.string(),
            name: z.string(),
            fromLocationId: z.number(),
            toLocationId: z.number(),
            waypoints: z.any().optional(),
            totalDistance: z.number().optional(),
          })),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Create the map
          const mapResult = await createLocationMap({
            userId: ctx.user!.id,
            name: input.name,
            venueType: input.venueType,
            floorPlanUrl: input.floorPlanUrl,
            description: input.description,
            isActive: true,
          });
          
          const mapId = (mapResult as any).insertId || (mapResult as any)[0];
          
          // Create nodes
          for (const node of input.nodes) {
            await createLocationMapNode({
              mapId,
              nodeId: node.nodeId,
              x: node.x,
              y: node.y,
            });
          }
          
          // Create edges
          for (const edge of input.edges) {
            await createLocationMapEdge({
              mapId,
              fromNodeId: edge.fromNodeId,
              toNodeId: edge.toNodeId,
              distance: String(edge.distance),
            });
          }
          
          // Create locations
          for (const location of input.locations) {
            await createLocationMapLocation({
              mapId,
              nodeId: location.nodeId,
              name: location.name,
              category: location.category,
              subcategory: location.subcategory,
            });
          }
          
          // Create routes
          for (const route of input.routes) {
            await createLocationMapRoute({
              mapId,
              routeId: route.routeId,
              name: route.name,
              fromLocationId: route.fromLocationId,
              toLocationId: route.toLocationId,
              waypoints: route.waypoints as any,
              totalDistance: route.totalDistance ? String(route.totalDistance) : undefined,
            });
          }
          
          return { success: true, mapId };
        } catch (error) {
          console.error("Error saving map:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save map" });
        }
      }),
    
    // Get all maps for the current user
    getMyMaps: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await getLocationMapsByUserId(ctx.user!.id);
      } catch (error) {
        console.error("Error getting maps:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get maps" });
      }
    }),
    
    // Get a specific map with all its data
    getMap: protectedProcedure
      .input(z.object({ mapId: z.number() }))
      .query(async ({ input, ctx }) => {
        try {
          const map = await getLocationMapById(input.mapId);
          if (!map || map.userId !== ctx.user!.id) {
            throw new TRPCError({ code: "FORBIDDEN", message: "Map not found" });
          }
          
          const nodes = await getLocationMapNodes(input.mapId);
          const edges = await getLocationMapEdges(input.mapId);
          const locations = await getLocationMapLocations(input.mapId);
          const routes = await getLocationMapRoutes(input.mapId);
          
          return {
            map,
            nodes,
            edges,
            locations,
            routes,
          };
        } catch (error) {
          console.error("Error getting map:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get map" });
        }
      }),
    
    // Delete a route
    deleteRoute: protectedProcedure
      .input(z.object({ routeId: z.number(), mapId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const map = await getLocationMapById(input.mapId);
          if (!map || map.userId !== ctx.user!.id) {
            throw new TRPCError({ code: "FORBIDDEN", message: "Map not found" });
          }
          
          await deleteLocationMapRoute(input.routeId);
          return { success: true };
        } catch (error) {
          console.error("Error deleting route:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete route" });
        }
      }),
    
    // Update a route
    updateRoute: protectedProcedure
      .input(
        z.object({
          routeId: z.number(),
          mapId: z.number(),
          name: z.string().optional(),
          waypoints: z.any().optional(),
          totalDistance: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const map = await getLocationMapById(input.mapId);
          if (!map || map.userId !== ctx.user!.id) {
            throw new TRPCError({ code: "FORBIDDEN", message: "Map not found" });
          }
          
          const updateData: any = {};
          if (input.name) updateData.name = input.name;
          if (input.waypoints) updateData.waypoints = JSON.stringify(input.waypoints);
          if (input.totalDistance) updateData.totalDistance = input.totalDistance;
          
          await updateLocationMapRoute(input.routeId, updateData);
          return { success: true };
        } catch (error) {
          console.error("Error updating route:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update route" });
        }
      }),
  }),
  
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
  // KADEH ADS - Advertising System (integrado via adsRouter)
  // ============================================================================
});

export type AppRouter = typeof appRouter;

/* REMOVIDO - Código antigo do ads router integrado via adsRouter.ts
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
  }),
*/
