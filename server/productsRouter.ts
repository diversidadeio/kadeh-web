/**
 * Products Router - tRPC procedures for product management within categories
 * Handles CRUD operations for products within categories
 */

import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { categoryProducts, productPerformanceHistory, InsertCategoryProduct, InsertProductPerformanceHistory } from "../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Validation schemas
const createProductSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  ean: z.string().optional(),
  curvaFaturamento: z.enum(["A", "B", "C"]),
  curvaLucratividade: z.enum(["A", "B", "C"]),
  papelEstrategico: z.string().min(1, "Papel estratégico é obrigatório"),
  defaultGiro: z.enum(["Baixo", "Médio", "Alto"]),
  defaultMargem: z.enum(["Baixa", "Média", "Alta"]),
  defaultLargura: z.number().min(1),
  defaultComprimento: z.number().min(1),
  defaultAltura: z.number().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  salesVolume: z.number().min(0).optional(),
  turnoverRate: z.number().min(0).max(100).optional(),
  profitMargin: z.number().min(0).max(100).optional(),
  stockoutRate: z.number().min(0).max(100).optional(),
});

const updateProductSchema = createProductSchema.partial().extend({
  id: z.number(),
});

const performanceMetricsSchema = z.object({
  productId: z.number(),
  salesVolume: z.number().min(0),
  turnoverRate: z.number().min(0).max(100),
  profitMargin: z.number().min(0).max(100),
  stockoutRate: z.number().min(0).max(100),
});

export const productsRouter = router({
  /**
   * Create a new product in a category
   */
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db.insert(categoryProducts).values({
          categoryId: input.categoryId,
          userId: ctx.user.id,
          name: input.name,
          sku: input.sku,
          ean: input.ean || null,
          curvaFaturamento: input.curvaFaturamento,
          curvaLucratividade: input.curvaLucratividade,
          papelEstrategico: input.papelEstrategico,
          defaultGiro: input.defaultGiro,
          defaultMargem: input.defaultMargem,
          defaultLargura: input.defaultLargura,
          defaultComprimento: input.defaultComprimento,
          defaultAltura: input.defaultAltura,
          description: input.description || null,
          imageUrl: input.imageUrl || null,
          salesVolume: input.salesVolume ? String(input.salesVolume) : "0.00",
          turnoverRate: input.turnoverRate ? String(input.turnoverRate) : "0.00",
          profitMargin: input.profitMargin ? String(input.profitMargin) : "0.00",
          stockoutRate: input.stockoutRate ? String(input.stockoutRate) : "0.00",
        } as InsertCategoryProduct);

        return {
          success: true,
          message: "Product created successfully",
        };
      } catch (error) {
        console.error("Error creating product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
        });
      }
    }),

  /**
   * Get all products for a category
   */
  listByCategory: protectedProcedure
    .input(z.number())
    .query(async ({ input: categoryId, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const products = await db
          .select()
          .from(categoryProducts)
          .where(
            and(
              eq(categoryProducts.categoryId, categoryId),
              eq(categoryProducts.userId, ctx.user.id)
            )
          )
          .orderBy(desc(categoryProducts.createdAt));

        return products.map((prod: any) => ({
          ...prod,
          salesVolume: parseFloat(prod.salesVolume as any),
          turnoverRate: parseFloat(prod.turnoverRate as any),
          profitMargin: parseFloat(prod.profitMargin as any),
          stockoutRate: parseFloat(prod.stockoutRate as any),
        }));
      } catch (error) {
        console.error("Error listing products:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list products",
        });
      }
    }),

  /**
   * Get a specific product by ID
   */
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ input: productId, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const product = await db
          .select()
          .from(categoryProducts)
          .where(
            and(
              eq(categoryProducts.id, productId),
              eq(categoryProducts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (product.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        const prod = product[0];
        return {
          ...prod,
          salesVolume: parseFloat(prod.salesVolume as any),
          turnoverRate: parseFloat(prod.turnoverRate as any),
          profitMargin: parseFloat(prod.profitMargin as any),
          stockoutRate: parseFloat(prod.stockoutRate as any),
        };
      } catch (error) {
        console.error("Error getting product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get product",
        });
      }
    }),

  /**
   * Update a product
   */
  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const { id, ...updateData } = input;

        // Verify ownership
        const product = await db
          .select()
          .from(categoryProducts)
          .where(
            and(
              eq(categoryProducts.id, id),
              eq(categoryProducts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (product.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        const updateValues: any = {};
        if (updateData.name) updateValues.name = updateData.name;
        if (updateData.sku) updateValues.sku = updateData.sku;
        if (updateData.ean !== undefined) updateValues.ean = updateData.ean;
        if (updateData.curvaFaturamento) updateValues.curvaFaturamento = updateData.curvaFaturamento;
        if (updateData.curvaLucratividade) updateValues.curvaLucratividade = updateData.curvaLucratividade;
        if (updateData.papelEstrategico) updateValues.papelEstrategico = updateData.papelEstrategico;
        if (updateData.defaultGiro) updateValues.defaultGiro = updateData.defaultGiro;
        if (updateData.defaultMargem) updateValues.defaultMargem = updateData.defaultMargem;
        if (updateData.defaultLargura) updateValues.defaultLargura = updateData.defaultLargura;
        if (updateData.defaultComprimento) updateValues.defaultComprimento = updateData.defaultComprimento;
        if (updateData.defaultAltura) updateValues.defaultAltura = updateData.defaultAltura;
        if (updateData.description !== undefined) updateValues.description = updateData.description;
        if (updateData.imageUrl !== undefined) updateValues.imageUrl = updateData.imageUrl;
        if (updateData.salesVolume !== undefined) updateValues.salesVolume = String(updateData.salesVolume);
        if (updateData.turnoverRate !== undefined) updateValues.turnoverRate = String(updateData.turnoverRate);
        if (updateData.profitMargin !== undefined) updateValues.profitMargin = String(updateData.profitMargin);
        if (updateData.stockoutRate !== undefined) updateValues.stockoutRate = String(updateData.stockoutRate);

        await db
          .update(categoryProducts)
          .set(updateValues)
          .where(eq(categoryProducts.id, id));

        return { success: true };
      } catch (error) {
        console.error("Error updating product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product",
        });
      }
    }),

  /**
   * Delete a product
   */
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: productId, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Verify ownership
        const product = await db
          .select()
          .from(categoryProducts)
          .where(
            and(
              eq(categoryProducts.id, productId),
              eq(categoryProducts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (product.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        await db
          .delete(categoryProducts)
          .where(eq(categoryProducts.id, productId));

        return { success: true };
      } catch (error) {
        console.error("Error deleting product:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product",
        });
      }
    }),

  /**
   * Update performance metrics for a product
   */
  updateMetrics: protectedProcedure
    .input(performanceMetricsSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Verify ownership
        const product = await db
          .select()
          .from(categoryProducts)
          .where(
            and(
              eq(categoryProducts.id, input.productId),
              eq(categoryProducts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (product.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        // Update product metrics
        await db
          .update(categoryProducts)
          .set({
            salesVolume: String(input.salesVolume),
            turnoverRate: String(input.turnoverRate),
            profitMargin: String(input.profitMargin),
            stockoutRate: String(input.stockoutRate),
            lastUpdatedMetrics: new Date(),
          })
          .where(eq(categoryProducts.id, input.productId));

        // Record in history
        await db.insert(productPerformanceHistory).values({
          productId: input.productId,
          salesVolume: String(input.salesVolume),
          turnoverRate: String(input.turnoverRate),
          profitMargin: String(input.profitMargin),
          stockoutRate: String(input.stockoutRate),
        } as InsertProductPerformanceHistory);

        return { success: true };
      } catch (error) {
        console.error("Error updating metrics:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update metrics",
        });
      }
    }),
});
