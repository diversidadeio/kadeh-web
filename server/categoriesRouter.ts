/**
 * Categories Router - tRPC procedures for category management
 * Handles CRUD operations and performance analytics for product categories
 */

import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { productCategories, categoryPerformanceHistory, InsertProductCategory, InsertCategoryPerformanceHistory } from "../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  mainCategory: z.enum(["Alimentar", "Não-Alimentar"]),
  curvaFaturamento: z.enum(["A", "B", "C"]),
  curvaLucratividade: z.enum(["A", "B", "C"]),
  papelEstrategico: z.string().min(1, "Papel estratégico é obrigatório"),
  defaultGiro: z.enum(["Baixo", "Médio", "Alto"]),
  defaultMargem: z.enum(["Baixa", "Média", "Alta"]),
  defaultLargura: z.number().min(1, "Largura deve ser maior que 0"),
  defaultComprimento: z.number().min(1, "Comprimento deve ser maior que 0"),
  description: z.string().optional(),
  salesVolume: z.number().min(0).optional(),
  turnoverRate: z.number().min(0).max(100).optional(),
  profitMargin: z.number().min(0).max(100).optional(),
  stockoutRate: z.number().min(0).max(100).optional(),
});

const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number(),
});

const performanceMetricsSchema = z.object({
  categoryId: z.number(),
  salesVolume: z.number().min(0),
  turnoverRate: z.number().min(0).max(100),
  profitMargin: z.number().min(0).max(100),
  stockoutRate: z.number().min(0).max(100),
});

export const categoriesRouter = router({
  /**
   * Create a new product category
   */
  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db.insert(productCategories).values({
          userId: ctx.user.id,
          name: input.name,
          mainCategory: input.mainCategory,
          curvaFaturamento: input.curvaFaturamento,
          curvaLucratividade: input.curvaLucratividade,
          papelEstrategico: input.papelEstrategico,
          defaultGiro: input.defaultGiro,
          defaultMargem: input.defaultMargem,
          defaultLargura: input.defaultLargura,
          defaultComprimento: input.defaultComprimento,
          description: input.description || null,
          salesVolume: input.salesVolume ? String(input.salesVolume) : "0.00",
          turnoverRate: input.turnoverRate ? String(input.turnoverRate) : "0.00",
          profitMargin: input.profitMargin ? String(input.profitMargin) : "0.00",
          stockoutRate: input.stockoutRate ? String(input.stockoutRate) : "0.00",
        } as InsertProductCategory);

        return {
          success: true,
          message: "Category created successfully",
        };
      } catch (error) {
        console.error("Error creating category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }
    }),

  /**
   * Get all categories for the current user
   */
  list: protectedProcedure
    .input(
      z.object({
        mainCategory: z.enum(["Alimentar", "Não-Alimentar"]).optional(),
        isActive: z.boolean().optional(),
      }).optional()
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
        const conditions = [eq(productCategories.userId, ctx.user.id)];

        if (input?.mainCategory) {
          conditions.push(eq(productCategories.mainCategory, input.mainCategory));
        }

        if (input?.isActive !== undefined) {
          conditions.push(eq(productCategories.isActive, input.isActive));
        }

        const categories = await db
          .select()
          .from(productCategories)
          .where(and(...conditions))
          .orderBy(desc(productCategories.createdAt));

        return categories.map(cat => ({
          ...cat,
          salesVolume: parseFloat(cat.salesVolume as any),
          turnoverRate: parseFloat(cat.turnoverRate as any),
          profitMargin: parseFloat(cat.profitMargin as any),
          stockoutRate: parseFloat(cat.stockoutRate as any),
        }));
      } catch (error) {
        console.error("Error listing categories:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list categories",
        });
      }
    }),

  /**
   * Get a specific category by ID
   */
  getById: protectedProcedure
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
        const category = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.id, categoryId),
              eq(productCategories.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (category.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        const cat = category[0];
        return {
          ...cat,
          salesVolume: parseFloat(cat.salesVolume as any),
          turnoverRate: parseFloat(cat.turnoverRate as any),
          profitMargin: parseFloat(cat.profitMargin as any),
          stockoutRate: parseFloat(cat.stockoutRate as any),
        };
      } catch (error) {
        console.error("Error getting category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get category",
        });
      }
    }),

  /**
   * Update a category
   */
  update: protectedProcedure
    .input(updateCategorySchema)
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
        const category = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.id, id),
              eq(productCategories.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (category.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        const updateValues: any = {};
        if (updateData.name) updateValues.name = updateData.name;
        if (updateData.mainCategory) updateValues.mainCategory = updateData.mainCategory;
        if (updateData.curvaFaturamento) updateValues.curvaFaturamento = updateData.curvaFaturamento;
        if (updateData.curvaLucratividade) updateValues.curvaLucratividade = updateData.curvaLucratividade;
        if (updateData.papelEstrategico) updateValues.papelEstrategico = updateData.papelEstrategico;
        if (updateData.defaultGiro) updateValues.defaultGiro = updateData.defaultGiro;
        if (updateData.defaultMargem) updateValues.defaultMargem = updateData.defaultMargem;
        if (updateData.defaultLargura) updateValues.defaultLargura = updateData.defaultLargura;
        if (updateData.defaultComprimento) updateValues.defaultComprimento = updateData.defaultComprimento;
        if (updateData.description !== undefined) updateValues.description = updateData.description;
        if (updateData.salesVolume !== undefined) updateValues.salesVolume = String(updateData.salesVolume);
        if (updateData.turnoverRate !== undefined) updateValues.turnoverRate = String(updateData.turnoverRate);
        if (updateData.profitMargin !== undefined) updateValues.profitMargin = String(updateData.profitMargin);
        if (updateData.stockoutRate !== undefined) updateValues.stockoutRate = String(updateData.stockoutRate);

        await db
          .update(productCategories)
          .set(updateValues)
          .where(eq(productCategories.id, id));

        return { success: true };
      } catch (error) {
        console.error("Error updating category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category",
        });
      }
    }),

  /**
   * Delete a category
   */
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: categoryId, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Verify ownership
        const category = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.id, categoryId),
              eq(productCategories.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (category.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        await db
          .delete(productCategories)
          .where(eq(productCategories.id, categoryId));

        return { success: true };
      } catch (error) {
        console.error("Error deleting category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete category",
        });
      }
    }),

  /**
   * Update performance metrics for a category
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
        const category = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.id, input.categoryId),
              eq(productCategories.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (category.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        // Update category metrics
        await db
          .update(productCategories)
          .set({
            salesVolume: String(input.salesVolume),
            turnoverRate: String(input.turnoverRate),
            profitMargin: String(input.profitMargin),
            stockoutRate: String(input.stockoutRate),
            lastUpdatedMetrics: new Date(),
          })
          .where(eq(productCategories.id, input.categoryId));

        // Record in history
        await db.insert(categoryPerformanceHistory).values({
          categoryId: input.categoryId,
          salesVolume: String(input.salesVolume),
          turnoverRate: String(input.turnoverRate),
          profitMargin: String(input.profitMargin),
          stockoutRate: String(input.stockoutRate),
        } as InsertCategoryPerformanceHistory);

        return { success: true };
      } catch (error) {
        console.error("Error updating metrics:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update metrics",
        });
      }
    }),

  /**
   * Get performance history for a category
   */
  getPerformanceHistory: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
        daysBack: z.number().min(1).max(365).optional(),
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
        // Verify ownership
        const category = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.id, input.categoryId),
              eq(productCategories.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (category.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        const daysBack = input.daysBack || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        const history = await db
          .select()
          .from(categoryPerformanceHistory)
          .where(
            and(
              eq(categoryPerformanceHistory.categoryId, input.categoryId),
              gte(categoryPerformanceHistory.date, startDate)
            )
          )
          .orderBy(desc(categoryPerformanceHistory.date));

        return history.map(h => ({
          ...h,
          salesVolume: parseFloat(h.salesVolume as any),
          turnoverRate: parseFloat(h.turnoverRate as any),
          profitMargin: parseFloat(h.profitMargin as any),
          stockoutRate: parseFloat(h.stockoutRate as any),
        }));
      } catch (error) {
        console.error("Error getting performance history:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get performance history",
        });
      }
    }),

  /**
   * Get performance analytics for all categories
   */
  getAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const categories = await db
          .select()
          .from(productCategories)
          .where(eq(productCategories.userId, ctx.user.id))
          .orderBy(desc(productCategories.salesVolume));

        const analytics = {
          totalCategories: categories.length,
          byMainCategory: {
            alimentar: 0,
            naoAlimentar: 0,
          },
          byCurvaFaturamento: {
            A: 0,
            B: 0,
            C: 0,
          },
          byCurvaLucratividade: {
            A: 0,
            B: 0,
            C: 0,
          },
          totalSalesVolume: 0,
          averageTurnover: 0,
          averageMargin: 0,
          averageStockout: 0,
          categories: categories.map(cat => ({
            ...cat,
            salesVolume: parseFloat(cat.salesVolume as any),
            turnoverRate: parseFloat(cat.turnoverRate as any),
            profitMargin: parseFloat(cat.profitMargin as any),
            stockoutRate: parseFloat(cat.stockoutRate as any),
          })),
        };

        // Calculate aggregates
        categories.forEach(cat => {
          if (cat.mainCategory === "Alimentar") {
            analytics.byMainCategory.alimentar++;
          } else {
            analytics.byMainCategory.naoAlimentar++;
          }

          analytics.byCurvaFaturamento[cat.curvaFaturamento]++;
          analytics.byCurvaLucratividade[cat.curvaLucratividade]++;

          analytics.totalSalesVolume += parseFloat(cat.salesVolume as any);
          analytics.averageTurnover += parseFloat(cat.turnoverRate as any);
          analytics.averageMargin += parseFloat(cat.profitMargin as any);
          analytics.averageStockout += parseFloat(cat.stockoutRate as any);
        });

        if (categories.length > 0) {
          analytics.averageTurnover /= categories.length;
          analytics.averageMargin /= categories.length;
          analytics.averageStockout /= categories.length;
        }

        return analytics;
      } catch (error) {
        console.error("Error getting analytics:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get analytics",
        });
      }
    }),
});
