import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { 
  adCampaigns, 
  adBankPayments,
  advertisers,
  campaignProducts,
  InsertAdCampaign,
  InsertAdBankPayment
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";

/**
 * Tabela de preços por duração
 */
const PRICING_BY_DURATION: Record<string, number> = {
  "1day": 100,
  "3days": 250,
  "7days": 500,
  "14days": 900,
};

/**
 * Multiplicadores por quantidade de lojas/região
 */
const STORE_MULTIPLIERS = [
  { min: 1, max: 5, multiplier: 1.0 },
  { min: 6, max: 20, multiplier: 1.5 },
  { min: 21, max: 50, multiplier: 2.0 },
  { min: 51, max: Infinity, multiplier: 2.5 },
];

/**
 * Calcular multiplicador baseado na quantidade de lojas
 */
function getStoreMultiplier(numberOfStores: number): number {
  for (const range of STORE_MULTIPLIERS) {
    if (numberOfStores >= range.min && numberOfStores <= range.max) {
      return range.multiplier;
    }
  }
  return 1.0;
}

/**
 * Calcular dias úteis entre duas datas
 */
function getBusinessDaysBetween(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = domingo, 6 = sábado
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Adicionar dias úteis a uma data
 */
function addBusinessDays(startDate: Date, daysToAdd: number): Date {
  let count = 0;
  const current = new Date(startDate);
  
  while (count < daysToAdd) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  
  return current;
}

/**
 * Calcular valor total da campanha
 */
export const calculateCampaignPrice = protectedProcedure
  .input(
    z.object({
      duration: z.enum(["1day", "3days", "7days", "14days"]),
      numberOfStores: z.number().min(1),
      numberOfProducts: z.number().min(1).default(1),
    })
  )
  .query(async ({ input }) => {
    try {
      // Multiplicadores por duração
      const durationMultipliers: Record<string, number> = {
        "1day": 1.0,
        "3days": 1.1,
        "7days": 1.2,
        "14days": 1.4,
      };

      const basePrice = PRICING_BY_DURATION[input.duration];
      const storeMultiplier = getStoreMultiplier(input.numberOfStores);
      const durationMultiplier = durationMultipliers[input.duration];
      
      // Fórmula: Preço Base × Multiplicador Duração × Multiplicador Lojas
      const totalCost = basePrice * durationMultiplier * storeMultiplier;

      return {
        success: true,
        basePrice,
        multiplier: storeMultiplier * durationMultiplier,
        totalCost,
        breakdown: {
          duration: input.duration,
          numberOfStores: input.numberOfStores,
          numberOfProducts: input.numberOfProducts,
          basePrice,
          durationMultiplier,
          storeMultiplier,
          totalCost,
        },
      };
    } catch (error) {
      console.error("Error calculating campaign price:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to calculate price",
      });
    }
  });

/**
 * Validar data inicial (deve ter antecedência de 7 dias úteis)
 */
export const validateStartDate = protectedProcedure
  .input(
    z.object({
      startDate: z.date(),
    })
  )
  .query(async ({ input }) => {
    try {
      const now = new Date();
      const requiredBusinessDays = 7;
      const earliestStartDate = addBusinessDays(now, requiredBusinessDays);

      const isValid = input.startDate >= earliestStartDate;

      return {
        success: true,
        isValid,
        message: isValid 
          ? "Data válida" 
          : `A campanha deve iniciar com antecedência de ${requiredBusinessDays} dias úteis. Data mínima: ${earliestStartDate.toLocaleDateString("pt-BR")}`,
        earliestStartDate,
        inputDate: input.startDate,
      };
    } catch (error) {
      console.error("Error validating start date:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to validate start date",
      });
    }
  });

/**
 * Criar campanha
 */
export const createCampaign = protectedProcedure
  .input(
    z.object({
      companyName: z.string().min(1),
      companyDocument: z.string().min(11).max(20),
      contactEmail: z.string().email(),
      contactPhone: z.string().min(10),
      duration: z.enum(["1day", "3days", "7days", "14days"]),
      numberOfProducts: z.number().min(1),
      numberOfStores: z.number().min(1),
      startDate: z.date(),
      products: z.array(
        z.object({
          productName: z.string().min(1),
          productImageUrl: z.string().url().optional().or(z.literal("")),
          productEAN13: z.string().max(20).optional(),
        })
      ).min(1),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Inserir campanha
      const result = await db.insert(adCampaigns).values({
        companyName: input.companyName,
        companyDocument: input.companyDocument,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        duration: input.duration,
        numberOfProducts: input.numberOfProducts,
        numberOfStores: input.numberOfStores,
        startDate: input.startDate,
        status: "pending",
        createdAt: new Date(),
      });

      // Obter o ID da campanha inserida
      // Drizzle retorna um objeto com insertId
      const campaignId = result?.insertId || 0;

      if (!campaignId) {
        console.error("Campaign insert result:", result);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create campaign - no ID returned",
        });
      }

      // Inserir produtos da campanha
      for (const product of input.products) {
        await db.insert(campaignProducts).values({
          campaignId,
          productName: product.productName,
          productImageUrl: product.productImageUrl || null,
          productEAN13: product.productEAN13 || null,
          createdAt: new Date(),
        });
      }

      // Notificar proprietário
      await notifyOwner({
        title: "Nova Campanha Criada",
        content: `${input.companyName} criou uma nova campanha de ${input.duration} com ${input.numberOfProducts} produtos para ${input.numberOfStores} lojas.`,
      });

      return {
        success: true,
        campaignId,
        message: "Campanha criada com sucesso!",
      };
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create campaign",
      });
    }
  });

/**
 * Router de campanhas
 */
export const campaignsRouter = router({
  calculatePrice: calculateCampaignPrice,
  validateStartDate,
  create: createCampaign,
});
