import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createProductsBulk,
  getProductsByUser,
  deleteProductsByUser,
  getProductCategories,
  getProductSubcategories,
  getGondolaNumbers,
} from "./products";

const ProductInput = z.object({
  productCode: z.string().min(1).max(50),
  gondolaNumber: z.number().int().positive(),
  position: z.string().min(1).max(20),
  category: z.string().min(1).max(100),
  subcategory: z.string().min(1).max(100),
});

export const bulkProductsRouter = router({
  // ========== PRODUCTS ==========

  list: protectedProcedure.query(async ({ ctx }) => {
    const products = await getProductsByUser(ctx.user.id);
    return products;
  }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const categories = await getProductCategories(ctx.user.id);
    return categories;
  }),

  getSubcategories: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const subcategories = await getProductSubcategories(ctx.user.id, input.category);
      return subcategories;
    }),

  importBulk: protectedProcedure
    .input(z.object({
      products: z.array(ProductInput),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Add userId to each product
        const productsWithUser = input.products.map(p => ({
          ...p,
          userId: ctx.user.id,
        }));

        const count = await createProductsBulk(productsWithUser);

        if (count === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to import products",
          });
        }

        return {
          success: true,
          imported: count,
          message: `${count} products imported successfully`,
        };
      } catch (error) {
        console.error("[tRPC] Error importing products:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to import products",
        });
      }
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const success = await deleteProductsByUser(ctx.user.id);

      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete products",
        });
      }

      return { success: true, message: "All products deleted" };
    } catch (error) {
      console.error("[tRPC] Error deleting products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete products",
      });
    }
  }),

  getGondolaNumbers: protectedProcedure.query(async ({ ctx }) => {
    const numbers = await getGondolaNumbers(ctx.user.id);
    return numbers;
  }),
});
