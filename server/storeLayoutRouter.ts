import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { storeLayoutCategories, storeLayoutRoutes } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByUser,
  getCategoryById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRoutesByUser,
  getRouteBetweenCategories,
  deleteRoutesByCategory,
} from "./storeLayout";

const CategoryInput = z.object({
  code: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  nameEn: z.string().optional(),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  radius: z.number().int().min(5).max(100).default(20),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default("#3b82f6"),
});

const RouteInput = z.object({
  fromCategoryId: z.number().int().positive(),
  toCategoryId: z.number().int().positive(),
  pathPoints: z.array(z.object({ x: z.number(), y: z.number() })).min(2),
  distance: z.number().int().positive(),
});

const DEPARTMENTS = [
  { code: 'A', name: 'Açougue', nameEn: 'Butcher', x: 140, y: 40, color: '#dc2626' },
  { code: 'H', name: 'Hortifrutí', nameEn: 'Produce', x: 500, y: 40, color: '#2563eb' },
  { code: 'P', name: 'Padaria', nameEn: 'Bakery', x: 750, y: 40, color: '#f97316' },
  { code: 'L', name: 'Laticínios e Bebidas Geladas', nameEn: 'Dairy & Cold Beverages', x: 100, y: 130, color: '#fbbf24' },
  { code: 'R', name: 'Refrigerantes', nameEn: 'Soft Drinks', x: 250, y: 130, color: '#22c55e' },
  { code: 'C', name: 'Cereais e Bolachas', nameEn: 'Cereals & Crackers', x: 380, y: 130, color: '#8b5cf6' },
  { code: 'I', name: 'Infantis', nameEn: 'Baby Products', x: 480, y: 130, color: '#ec4899' },
  { code: 'G', name: 'Higiene', nameEn: 'Hygiene', x: 580, y: 130, color: '#06b6d4' },
  { code: 'K', name: 'Limpeza', nameEn: 'Cleaning', x: 680, y: 130, color: '#f43f5e' },
  { code: 'U', name: 'Utilidades', nameEn: 'Utilities', x: 780, y: 130, color: '#6366f1' },
  { code: 'O', name: 'Orgânicos & Naturais', nameEn: 'Organic & Natural', x: 380, y: 380, color: '#10b981' },
  { code: 'F', name: 'Congelados', nameEn: 'Frozen', x: 520, y: 380, color: '#3b82f6' },
  { code: 'T', name: 'Pet', nameEn: 'Pet', x: 620, y: 380, color: '#f59e0b' },
  { code: 'B', name: 'Bebidas Alcoólicas', nameEn: 'Alcoholic Beverages', x: 750, y: 380, color: '#8b4513' },
];

export const storeLayoutRouter = router({
  // ========== SEED DATA ==========
  seedDepartments: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Delete existing categories and routes for this user
      await db.delete(storeLayoutRoutes).where(eq(storeLayoutRoutes.userId, ctx.user.id));
      await db.delete(storeLayoutCategories).where(eq(storeLayoutCategories.userId, ctx.user.id));

      const categoryIds: number[] = [];

      // Insert departments
      for (const dept of DEPARTMENTS) {
        const result = await createCategory({
          userId: ctx.user.id,
          code: dept.code,
          name: dept.name,
          nameEn: dept.nameEn,
          x: dept.x,
          y: dept.y,
          radius: 20,
          color: dept.color,
        });
        if (result) {
          categoryIds.push((result as any).id);
        }
      }

      // Create routes between all departments
      let routeCount = 0;
      for (let i = 0; i < categoryIds.length; i++) {
        for (let j = 0; j < categoryIds.length; j++) {
          if (i !== j) {
            const fromDept = DEPARTMENTS[i];
            const toDept = DEPARTMENTS[j];

            const pathPoints = [
              { x: fromDept.x, y: fromDept.y },
              { x: (fromDept.x + toDept.x) / 2, y: (fromDept.y + toDept.y) / 2 },
              { x: toDept.x, y: toDept.y },
            ];

            const distance = Math.hypot(toDept.x - fromDept.x, toDept.y - fromDept.y);

            await createRoute({
              userId: ctx.user.id,
              fromCategoryId: categoryIds[i],
              toCategoryId: categoryIds[j],
              pathPoints,
              distance: Math.round(distance),
            });
            routeCount++;
          }
        }
      }

      return {
        success: true,
        categoriesCreated: categoryIds.length,
        routesCreated: routeCount,
      };
    } catch (error) {
      console.error('Error seeding departments:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to seed departments',
      });
    }
  }),

  // ========== CATEGORIES ==========
  
  categories: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const categories = await getCategoriesByUser(ctx.user.id);
      return categories;
    }),

    create: protectedProcedure
      .input(CategoryInput)
      .mutation(async ({ ctx, input }) => {
        const category = await createCategory({
          userId: ctx.user.id,
          ...input,
        });

        if (!category) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create category",
          });
        }

        return category;
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }).merge(CategoryInput.partial()))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;

        // Verify ownership
        const category = await getCategoryById(id);
        if (!category || category.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to update this category",
          });
        }

        const updated = await updateCategory(id, data);
        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update category",
          });
        }

        return updated;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const category = await getCategoryById(input.id);
        if (!category || category.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this category",
          });
        }

        // Delete all routes associated with this category
        await deleteRoutesByCategory(input.id);

        // Delete the category
        const success = await deleteCategory(input.id);
        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete category",
          });
        }

        return { success: true };
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const category = await getCategoryById(input.id);
        if (!category || category.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }
        return category;
      }),
  }),

  // ========== ROUTES ==========

  routes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const routes = await getRoutesByUser(ctx.user.id);
      return routes;
    }),

    create: protectedProcedure
      .input(RouteInput)
      .mutation(async ({ ctx, input }) => {
        // Verify ownership of both categories
        const fromCategory = await getCategoryById(input.fromCategoryId);
        const toCategory = await getCategoryById(input.toCategoryId);

        if (!fromCategory || fromCategory.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to use this source category",
          });
        }

        if (!toCategory || toCategory.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to use this destination category",
          });
        }

        const route = await createRoute({
          userId: ctx.user.id,
          ...input,
        });

        if (!route) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create route",
          });
        }

        return route;
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }).merge(RouteInput.partial()))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;

        // Verify ownership
        const route = await getRoutesByUser(ctx.user.id);
        const targetRoute = route.find(r => r.id === id);

        if (!targetRoute) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to update this route",
          });
        }

        const updated = await updateRoute(id, data);
        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update route",
          });
        }

        return updated;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const route = await getRoutesByUser(ctx.user.id);
        const targetRoute = route.find(r => r.id === input.id);

        if (!targetRoute) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this route",
          });
        }

        const success = await deleteRoute(input.id);
        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete route",
          });
        }

        return { success: true };
      }),

    get: protectedProcedure
      .input(z.object({ fromCategoryId: z.number().int().positive(), toCategoryId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const route = await getRouteBetweenCategories(input.fromCategoryId, input.toCategoryId);
        if (!route || route.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Route not found",
          });
        }
        return route;
      }),
  }),
});
