import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
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

export const storeLayoutRouter = router({
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
