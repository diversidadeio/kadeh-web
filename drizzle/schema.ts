import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// KADEH ADS - Advertising System
// ============================================================================

/**
 * Anunciantes (Advertisers) - Empresas que desejam anunciar seus produtos
 */
export const advertisers = mysqlTable("advertisers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyDocument: varchar("companyDocument", { length: 20 }).notNull().unique(), // CNPJ
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "suspended"]).default("pending").notNull(),
  approvedBy: int("approvedBy").notNull().default(0), // Admin user ID
  approvalDate: timestamp("approvalDate"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("advertisers_userId_idx").on(table.userId),
  statusIdx: index("advertisers_status_idx").on(table.status),
}));

export type Advertiser = typeof advertisers.$inferSelect;
export type InsertAdvertiser = typeof advertisers.$inferInsert;

/**
 * Tabela de Preços - Configuração de valores por duração e quantidade de lojas/região
 */
export const pricingPlans = mysqlTable("pricingPlans", {
  id: int("id").autoincrement().primaryKey(),
  duration: mysqlEnum("duration", ["1day", "3days", "7days", "14days"]).notNull(),
  minStores: int("minStores").notNull(), // Número mínimo de lojas
  maxStores: int("maxStores").notNull(), // Número máximo de lojas (null = ilimitado)
  pricePerStore: decimal("pricePerStore", { precision: 10, scale: 2 }).notNull(), // Preço por loja
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  durationIdx: index("pricingPlans_duration_idx").on(table.duration),
}));

export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertPricingPlan = typeof pricingPlans.$inferInsert;

/**
 * Categorias Correlacionadas - Mapeamento de categorias relacionadas para segmentação de anúncios
 */
export const correlatedCategories = mysqlTable("correlatedCategories", {
  id: int("id").autoincrement().primaryKey(),
  primaryCategory: varchar("primaryCategory", { length: 100 }).notNull(),
  relatedCategory: varchar("relatedCategory", { length: 100 }).notNull(),
  correlationScore: decimal("correlationScore", { precision: 3, scale: 2 }).notNull(), // 0.00 a 1.00
  description: text("description"), // Ex: "Queijos e Vinhos"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  primaryIdx: index("correlatedCategories_primary_idx").on(table.primaryCategory),
  relatedIdx: index("correlatedCategories_related_idx").on(table.relatedCategory),
}));

export type CorrelatedCategory = typeof correlatedCategories.$inferSelect;
export type InsertCorrelatedCategory = typeof correlatedCategories.$inferInsert;

/**
 * Anúncios (Advertisements)
 */
export const advertisements = mysqlTable("advertisements", {
  id: int("id").autoincrement().primaryKey(),
  advertiserId: int("advertiserId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(), // URL da imagem no S3
  productName: varchar("productName", { length: 255 }),
  productCategory: varchar("productCategory", { length: 100 }).notNull(),
  targetCategories: json("targetCategories").$type<string[]>().notNull(), // Array de categorias alvo
  adType: mysqlEnum("adType", ["product", "promotion", "store"]).notNull(),
  duration: mysqlEnum("duration", ["1day", "3days", "7days", "14days"]).notNull(),
  numberOfStores: int("numberOfStores").notNull(),
  selectedStores: json("selectedStores").$type<number[]>(), // Array de IDs de lojas (se específico)
  region: varchar("region", { length: 100 }), // Região geográfica (se aplicável)
  status: mysqlEnum("status", ["draft", "pending_payment", "active", "paused", "expired", "cancelled"]).default("draft").notNull(),
  priorityPosition: int("priorityPosition").notNull(), // Posição na fila de prioridade
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  pauseRequestedAt: timestamp("pauseRequestedAt"), // Data da solicitação de pausa
  pauseEffectiveAt: timestamp("pauseEffectiveAt"), // Data em que a pausa entra em vigor (24h após solicitação)
  totalCost: decimal("totalCost", { precision: 10, scale: 2 }).notNull(),
  paymentIntentId: varchar("paymentIntentId", { length: 255 }), // Stripe Payment Intent ID
  invoiceUrl: varchar("invoiceUrl", { length: 500 }), // URL do recibo/nota fiscal
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  advertiserIdx: index("advertisements_advertiser_idx").on(table.advertiserId),
  statusIdx: index("advertisements_status_idx").on(table.status),
  categoryIdx: index("advertisements_category_idx").on(table.productCategory),
}));

export type Advertisement = typeof advertisements.$inferSelect;
export type InsertAdvertisement = typeof advertisements.$inferInsert;

/**
 * Analytics de Anúncios - Rastreamento de impressões, cliques e conversões
 */
export const adAnalytics = mysqlTable("adAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  advertisementId: int("advertisementId").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  impressions: int("impressions").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  conversionValue: decimal("conversionValue", { precision: 10, scale: 2 }).default("0.00"),
  ctr: decimal("ctr", { precision: 5, scale: 2 }), // Click-through rate (%)
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }), // Conversion rate (%)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  adIdx: index("adAnalytics_ad_idx").on(table.advertisementId),
  dateIdx: index("adAnalytics_date_idx").on(table.date),
}));

export type AdAnalytic = typeof adAnalytics.$inferSelect;
export type InsertAdAnalytic = typeof adAnalytics.$inferInsert;

/**
 * Campanhas de Anúncios - Requisições de contratação de anúncios
 */
export const adCampaigns = mysqlTable("adCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  advertiserId: int("advertiserId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyDocument: varchar("companyDocument", { length: 20 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }).notNull(),
  duration: mysqlEnum("duration", ["1day", "3days", "7days", "14days"]).notNull(),
  numberOfStores: int("numberOfStores").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productImageUrl: varchar("productImageUrl", { length: 500 }).notNull(),
  productEAN13: varchar("productEAN13", { length: 13 }).notNull(),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 5, scale: 2 }).notNull(),
  totalCost: decimal("totalCost", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending_approval", "approved", "rejected", "payment_pending", "active", "completed", "cancelled"]).default("pending_approval").notNull(),
  approvedBy: int("approvedBy"),
  approvalDate: timestamp("approvalDate"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  advertiserIdx: index("adCampaigns_advertiser_idx").on(table.advertiserId),
  statusIdx: index("adCampaigns_status_idx").on(table.status),
  startDateIdx: index("adCampaigns_startDate_idx").on(table.startDate),
}));

export type AdCampaign = typeof adCampaigns.$inferSelect;
export type InsertAdCampaign = typeof adCampaigns.$inferInsert;

/**
 * Pagamentos por Depósito Bancário
 */
export const adBankPayments = mysqlTable("adBankPayments", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "failed", "cancelled"]).default("pending").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique(),
  invoiceUrl: varchar("invoiceUrl", { length: 500 }),
  paymentProofUrl: varchar("paymentProofUrl", { length: 500 }),
  paidAt: timestamp("paidAt"),
  confirmedAt: timestamp("confirmedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  campaignIdx: index("adBankPayments_campaign_idx").on(table.campaignId),
  statusIdx: index("adBankPayments_status_idx").on(table.status),
}));

export type AdBankPayment = typeof adBankPayments.$inferSelect;
export type InsertAdBankPayment = typeof adBankPayments.$inferInsert;

/**
 * Transações de Pagamento - Histórico de pagamentos dos anúncios
 */
export const adPayments = mysqlTable("adPayments", {
  id: int("id").autoincrement().primaryKey(),
  advertisementId: int("advertisementId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique(),
  invoiceUrl: varchar("invoiceUrl", { length: 500 }),
  paidAt: timestamp("paidAt"),
  refundedAt: timestamp("refundedAt"),
  refundReason: text("refundReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  adIdx: index("adPayments_ad_idx").on(table.advertisementId),
  statusIdx: index("adPayments_status_idx").on(table.status),
}));

export type AdPayment = typeof adPayments.$inferSelect;
export type InsertAdPayment = typeof adPayments.$inferInsert;

// ============================================================================
// Relations
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  advertisers: many(advertisers),
}));

export const advertisersRelations = relations(advertisers, ({ one, many }) => ({
  user: one(users, {
    fields: [advertisers.userId],
    references: [users.id],
  }),
  advertisements: many(advertisements),
  payments: many(adPayments),
}));

export const advertisementsRelations = relations(advertisements, ({ one, many }) => ({
  advertiser: one(advertisers, {
    fields: [advertisements.advertiserId],
    references: [advertisers.id],
  }),
  analytics: many(adAnalytics),
}));

export const adAnalyticsRelations = relations(adAnalytics, ({ one }) => ({
  advertisement: one(advertisements, {
    fields: [adAnalytics.advertisementId],
    references: [advertisements.id],
  }),
}));

export const adPaymentsRelations = relations(adPayments, ({ one }) => ({
  advertisement: one(advertisements, {
    fields: [adPayments.advertisementId],
    references: [advertisements.id],
  }),
}));
