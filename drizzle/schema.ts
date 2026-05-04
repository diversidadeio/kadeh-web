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
// KADEH SMART LAYOUT - Store Layout Management
// ============================================================================

/**
 * Store Layout Categories - Categorias posicionadas na planta baixa da loja
 * Cada categoria tem um código alfanumérico único (ex: A1, B2, C3)
 */
export const storeLayoutCategories = mysqlTable("storeLayoutCategories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Proprietário da loja
  code: varchar("code", { length: 10 }).notNull(), // Código alfanumérico (ex: A1, B2)
  name: varchar("name", { length: 100 }).notNull(), // Nome da categoria (ex: Açougue, Hortifrutí)
  nameEn: varchar("nameEn", { length: 100 }), // Nome em inglês
  x: int("x").notNull(), // Posição X na imagem (pixels)
  y: int("y").notNull(), // Posição Y na imagem (pixels)
  radius: int("radius").default(20).notNull(), // Raio do marcador (pixels)
  color: varchar("color", { length: 7 }).default("#3b82f6").notNull(), // Cor do marcador (hex)
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("storeLayoutCategories_user_idx").on(table.userId),
  codeIdx: index("storeLayoutCategories_code_idx").on(table.code),
}));

export type StoreLayoutCategory = typeof storeLayoutCategories.$inferSelect;
export type InsertStoreLayoutCategory = typeof storeLayoutCategories.$inferInsert;

/**
 * Store Layout Routes - Rotas desenhadas entre categorias
 * Armazena os pontos que definem a rota de um ponto a outro
 */
export const storeLayoutRoutes = mysqlTable("storeLayoutRoutes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Proprietário da loja
  fromCategoryId: int("fromCategoryId").notNull(), // Categoria de origem
  toCategoryId: int("toCategoryId").notNull(), // Categoria de destino
  pathPoints: json("pathPoints").$type<Array<{x: number, y: number}>>().notNull(), // Array de pontos da rota
  distance: int("distance").notNull(), // Distância em pixels
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("storeLayoutRoutes_user_idx").on(table.userId),
  fromIdx: index("storeLayoutRoutes_from_idx").on(table.fromCategoryId),
  toIdx: index("storeLayoutRoutes_to_idx").on(table.toCategoryId),
}));

export type StoreLayoutRoute = typeof storeLayoutRoutes.$inferSelect;
export type InsertStoreLayoutRoute = typeof storeLayoutRoutes.$inferInsert;

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
  status: mysqlEnum("status", ["pending_approval", "approved", "rejected", "payment_pending", "active", "completed", "cancelled", "refunded"]).default("pending_approval").notNull(),
  approvedBy: int("approvedBy"),
  approvalDate: timestamp("approvalDate"),
  rejectionReason: text("rejectionReason"),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
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
 * Produtos de Campanha - Permite múltiplos produtos por campanha
 */
export const campaignProducts = mysqlTable("campaignProducts", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productImageUrl: varchar("productImageUrl", { length: 500 }).notNull(),
  productEAN13: varchar("productEAN13", { length: 13 }).notNull(),
  position: int("position").notNull(), // Ordem dos produtos na campanha
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  campaignIdx: index("campaignProducts_campaign_idx").on(table.campaignId),
}));

export type CampaignProduct = typeof campaignProducts.$inferSelect;
export type InsertCampaignProduct = typeof campaignProducts.$inferInsert;

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


// ============================================================================
// STORE MAPPING SYSTEM - Mapeamento de Loja
// ============================================================================

/**
 * Lojas - Armazena informações da planta baixa da loja
 */
export const stores = mysqlTable("stores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  layoutType: mysqlEnum("layoutType", ["linear", "grid", "custom"]).default("linear").notNull(),
  // Dimensões em centímetros
  width: int("width").notNull(), // largura total em cm
  length: int("length").notNull(), // comprimento total em cm
  height: int("height").notNull(), // altura total em cm
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("stores_user_idx").on(table.userId),
}));

export type Store = typeof stores.$inferSelect;
export type InsertStore = typeof stores.$inferInsert;

/**
 * Corredores - Divisões dentro da loja
 */
export const corridors = mysqlTable("corridors", {
  id: int("id").autoincrement().primaryKey(),
  storeId: int("storeId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  // Posição em centímetros
  positionX: int("positionX").notNull(),
  positionY: int("positionY").notNull(),
  // Dimensões em centímetros
  width: int("width").notNull(),
  length: int("length").notNull(),
  order: int("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  storeIdx: index("corridors_store_idx").on(table.storeId),
}));

export type Corridor = typeof corridors.$inferSelect;
export type InsertCorridor = typeof corridors.$inferInsert;

/**
 * Modelos de Módulos - Templates reutilizáveis
 */
export const moduleTemplates = mysqlTable("moduleTemplates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["gondola", "freezer_horizontal", "freezer_vertical", "island", "produce_stand", "hanging_display"]).notNull(),
  description: text("description"),
  // Dimensões padrão em centímetros
  defaultWidth: int("defaultWidth").notNull(),
  defaultDepth: int("defaultDepth").notNull(),
  defaultHeight: int("defaultHeight").notNull(),
  defaultShelves: int("defaultShelves").notNull(),
  isCustomizable: boolean("isCustomizable").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("moduleTemplates_user_idx").on(table.userId),
  typeIdx: index("moduleTemplates_type_idx").on(table.type),
}));

export type ModuleTemplate = typeof moduleTemplates.$inferSelect;
export type InsertModuleTemplate = typeof moduleTemplates.$inferInsert;

/**
 * Módulos - Gôndolas, Freezers, Ilhas, etc. posicionados na loja
 */
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  storeId: int("storeId").notNull(),
  corridorId: int("corridorId"),
  templateId: int("templateId"),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["gondola", "freezer_horizontal", "freezer_vertical", "island", "produce_stand", "hanging_display"]).notNull(),
  // Posição em centímetros
  positionX: int("positionX").notNull(),
  positionY: int("positionY").notNull(),
  // Dimensões em centímetros
  width: int("width").notNull(),
  depth: int("depth").notNull(),
  height: int("height").notNull(),
  shelfHeight: int("shelfHeight"), // altura entre prateleiras
  numberOfShelves: int("numberOfShelves").notNull(),
  // Capacidade
  totalCapacity: int("totalCapacity").notNull(), // em cm³
  totalOccupied: int("totalOccupied").default(0).notNull(), // em cm³
  occupancyPercentage: decimal("occupancyPercentage", { precision: 5, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  storeIdx: index("modules_store_idx").on(table.storeId),
  corridorIdx: index("modules_corridor_idx").on(table.corridorId),
  typeIdx: index("modules_type_idx").on(table.type),
}));

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

/**
 * Prateleiras - Divisões dentro de cada módulo
 */
export const shelves = mysqlTable("shelves", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  order: int("order").notNull(), // 1 = topo, 5 = fundo
  // Dimensões em centímetros
  width: int("width").notNull(),
  depth: int("depth").notNull(),
  height: int("height").notNull(), // espaço acima da prateleira
  zone: mysqlEnum("zone", ["Altura dos olhos", "Altura das mãos", "Parte de Baixo"]).notNull(),
  // Capacidade
  capacity: int("capacity").notNull(), // em cm³
  occupiedSpace: int("occupiedSpace").default(0).notNull(), // em cm³
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  moduleIdx: index("shelves_module_idx").on(table.moduleId),
  zoneIdx: index("shelves_zone_idx").on(table.zone),
}));

export type Shelf = typeof shelves.$inferSelect;
export type InsertShelf = typeof shelves.$inferInsert;

/**
 * Posicionamento de Produtos - Produtos alocados em prateleiras
 */
export const productPlacements = mysqlTable("productPlacements", {
  id: int("id").autoincrement().primaryKey(),
  storeId: int("storeId").notNull(),
  moduleId: int("moduleId").notNull(),
  shelfId: int("shelfId").notNull(),
  productId: varchar("productId", { length: 255 }).notNull(), // EAN ou ID do produto
  productName: varchar("productName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  // Dimensões do produto em centímetros
  productWidth: int("productWidth").notNull(),
  productDepth: int("productDepth").notNull(),
  productHeight: int("productHeight").notNull(),
  // Propriedades
  giro: mysqlEnum("giro", ["A", "B", "C"]).notNull(), // Velocidade
  margem: mysqlEnum("margem", ["A", "B", "C"]).notNull(), // Margem
  zone: mysqlEnum("zone", ["Altura dos olhos", "Altura das mãos", "Parte de Baixo"]).notNull(),
  quantity: int("quantity").notNull(), // quantidade de unidades
  volume: int("volume").notNull(), // em cm³
  positionOrder: int("positionOrder").notNull(), // ordem esquerda para direita
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  storeIdx: index("productPlacements_store_idx").on(table.storeId),
  moduleIdx: index("productPlacements_module_idx").on(table.moduleId),
  shelfIdx: index("productPlacements_shelf_idx").on(table.shelfId),
  productIdx: index("productPlacements_product_idx").on(table.productId),
}));

export type ProductPlacement = typeof productPlacements.$inferSelect;
export type InsertProductPlacement = typeof productPlacements.$inferInsert;

/**
 * Relatórios de Capacidade - Cache de cálculos para performance
 */
export const capacityReports = mysqlTable("capacityReports", {
  id: int("id").autoincrement().primaryKey(),
  storeId: int("storeId").notNull(),
  moduleId: int("moduleId"),
  totalCapacity: int("totalCapacity").notNull(), // em cm³
  totalOccupied: int("totalOccupied").notNull(), // em cm³
  occupancyPercentage: decimal("occupancyPercentage", { precision: 5, scale: 2 }).notNull(),
  reportData: json("reportData").$type<object>().notNull(), // dados completos do relatório
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  storeIdx: index("capacityReports_store_idx").on(table.storeId),
  moduleIdx: index("capacityReports_module_idx").on(table.moduleId),
}));

export type CapacityReport = typeof capacityReports.$inferSelect;
export type InsertCapacityReport = typeof capacityReports.$inferInsert;

// ============================================================================
// PRE-CADASTRO - Levantamento de Dados de Vendas, Margem e Giro
// ============================================================================

/**
 * Categorias de Vendas - Dados de vendas levantados pelo lojista
 * Armazena informações agregadas de vendas por categoria (ex: Cervejas, Refrigerantes)
 */
export const salesCategories = mysqlTable("salesCategories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  storeId: int("storeId"),
  categoryName: varchar("categoryName", { length: 255 }).notNull(), // Ex: "Cervejas", "Refrigerantes"
  mainCategory: mysqlEnum("mainCategory", ["Alimentar", "Não-Alimentar"]).notNull(),
  
  // Dados agregados de vendas
  totalUnitsPerPeriod: int("totalUnitsPerPeriod").notNull(), // Total de unidades vendidas no período
  totalRevenuePerPeriod: decimal("totalRevenuePerPeriod", { precision: 12, scale: 2 }).notNull(), // Faturamento total
  totalCostPerPeriod: decimal("totalCostPerPeriod", { precision: 12, scale: 2 }).notNull(), // Custo total
  totalMarginPerPeriod: decimal("totalMarginPerPeriod", { precision: 12, scale: 2 }).notNull(), // Margem total (Faturamento - Custo)
  
  // Cálculos derivados
  averageMarginPercentage: decimal("averageMarginPercentage", { precision: 5, scale: 2 }).notNull(), // Margem média % da categoria
  averageTurnover: decimal("averageTurnover", { precision: 10, scale: 2 }).notNull(), // Giro médio da categoria
  
  // Classificações de limites
  lowMarginThreshold: decimal("lowMarginThreshold", { precision: 5, scale: 2 }).notNull(), // Margem baixa = média - 20%
  highMarginThreshold: decimal("highMarginThreshold", { precision: 5, scale: 2 }).notNull(), // Margem alta = média + 20%
  lowTurnoverThreshold: decimal("lowTurnoverThreshold", { precision: 10, scale: 2 }).notNull(), // Giro baixo = média - 20%
  highTurnoverThreshold: decimal("highTurnoverThreshold", { precision: 10, scale: 2 }).notNull(), // Giro alto = média + 20%
  
  // Período de referência
  periodStartDate: timestamp("periodStartDate").notNull(),
  periodEndDate: timestamp("periodEndDate").notNull(),
  periodDays: int("periodDays").notNull(), // Número de dias do período
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("salesCategories_user_idx").on(table.userId),
  storeIdx: index("salesCategories_store_idx").on(table.storeId),
  categoryIdx: index("salesCategories_category_idx").on(table.categoryName),
}));

export type SalesCategory = typeof salesCategories.$inferSelect;
export type InsertSalesCategory = typeof salesCategories.$inferInsert;

/**
 * Produtos de Vendas - Dados individuais de cada produto dentro de uma categoria
 * Armazena informações de margem e giro de cada produto
 */
export const salesProducts = mysqlTable("salesProducts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  salesCategoryId: int("salesCategoryId").notNull(),
  
  productName: varchar("productName", { length: 255 }).notNull(),
  productEAN: varchar("productEAN", { length: 13 }),
  
  // Dados de vendas do produto
  unitsPerPeriod: int("unitsPerPeriod").notNull(), // Unidades vendidas no período
  revenuePerPeriod: decimal("revenuePerPeriod", { precision: 12, scale: 2 }).notNull(), // Faturamento do produto
  costPerUnit: decimal("costPerUnit", { precision: 10, scale: 2 }).notNull(), // Custo unitário
  costPerPeriod: decimal("costPerPeriod", { precision: 12, scale: 2 }).notNull(), // Custo total
  marginPerPeriod: decimal("marginPerPeriod", { precision: 12, scale: 2 }).notNull(), // Margem total (Faturamento - Custo)
  
  // Cálculos derivados
  marginPercentage: decimal("marginPercentage", { precision: 5, scale: 2 }).notNull(), // Margem % do produto
  turnover: decimal("turnover", { precision: 10, scale: 2 }).notNull(), // Giro do produto (unidades/dia)
  marginToTurnoverRatio: decimal("marginToTurnoverRatio", { precision: 10, scale: 4 }).notNull(), // Relação margem/giro
  
  // Classificações
  marginClassification: mysqlEnum("marginClassification", ["Baixa", "Média", "Alta"]).notNull(),
  turnoverClassification: mysqlEnum("turnoverClassification", ["Baixo", "Médio", "Alto"]).notNull(),
  zone: mysqlEnum("zone", ["Altura dos olhos", "Altura das mãos", "Parte de Baixo"]).notNull(), // Zona recomendada
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("salesProducts_user_idx").on(table.userId),
  categoryIdx: index("salesProducts_category_idx").on(table.salesCategoryId),
  productIdx: index("salesProducts_product_idx").on(table.productEAN),
}));

export type SalesProduct = typeof salesProducts.$inferSelect;
export type InsertSalesProduct = typeof salesProducts.$inferInsert;

// ============================================================================
// CATEGORY MANAGEMENT - Gerenciamento de Categorias
// ============================================================================

/**
 * Categorias de Produtos - Banco de dados persistente de categorias
 */
export const productCategories = mysqlTable("productCategories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Usuário que criou/gerencia a categoria
  name: varchar("name", { length: 255 }).notNull(),
  mainCategory: mysqlEnum("mainCategory", ["Alimentar", "Não-Alimentar"]).notNull(),
  curvaFaturamento: mysqlEnum("curvaFaturamento", ["A", "B", "C"]).notNull(),
  curvaLucratividade: mysqlEnum("curvaLucratividade", ["A", "B", "C"]).notNull(),
  papelEstrategico: varchar("papelEstrategico", { length: 100 }).notNull(),
  defaultGiro: mysqlEnum("defaultGiro", ["Baixo", "Médio", "Alto"]).notNull(),
  defaultMargem: mysqlEnum("defaultMargem", ["Baixa", "Média", "Alta"]).notNull(),
  defaultLargura: int("defaultLargura").notNull(), // em cm
  defaultComprimento: int("defaultComprimento").notNull(), // em cm
  defaultAltura: int("defaultAltura").notNull().default(20), // em cm
  // Métricas de Performance
  salesVolume: decimal("salesVolume", { precision: 12, scale: 2 }).default("0.00").notNull(), // Volume de vendas em R$
  turnoverRate: decimal("turnoverRate", { precision: 5, scale: 2 }).default("0.00").notNull(), // Taxa de giro (%)
  profitMargin: decimal("profitMargin", { precision: 5, scale: 2 }).default("0.00").notNull(), // Margem de lucro (%)
  stockoutRate: decimal("stockoutRate", { precision: 5, scale: 2 }).default("0.00").notNull(), // Taxa de ruptura (%)
  lastUpdatedMetrics: timestamp("lastUpdatedMetrics"),
  isActive: boolean("isActive").default(true).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("productCategories_user_idx").on(table.userId),
  mainCategoryIdx: index("productCategories_mainCategory_idx").on(table.mainCategory),
  nameIdx: index("productCategories_name_idx").on(table.name),
}));

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

/**
 * Histórico de Performance de Categorias - Rastreamento de métricas ao longo do tempo
 */
export const categoryPerformanceHistory = mysqlTable("categoryPerformanceHistory", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  salesVolume: decimal("salesVolume", { precision: 12, scale: 2 }).notNull(),
  turnoverRate: decimal("turnoverRate", { precision: 5, scale: 2 }).notNull(),
  profitMargin: decimal("profitMargin", { precision: 5, scale: 2 }).notNull(),
  stockoutRate: decimal("stockoutRate", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("categoryPerformanceHistory_category_idx").on(table.categoryId),
  dateIdx: index("categoryPerformanceHistory_date_idx").on(table.date),
}));

export type CategoryPerformanceHistory = typeof categoryPerformanceHistory.$inferSelect;
export type InsertCategoryPerformanceHistory = typeof categoryPerformanceHistory.$inferInsert;

/**
 * Produtos de Categoria - Produtos dentro de cada categoria
 */
export const categoryProducts = mysqlTable("categoryProducts", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(), // Referência à categoria
  userId: int("userId").notNull(), // Usuário que criou/gerencia o produto
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(), // SKU do produto
  ean: varchar("ean", { length: 13 }), // Código EAN-13
  curvaFaturamento: mysqlEnum("curvaFaturamento", ["A", "B", "C"]).notNull(),
  curvaLucratividade: mysqlEnum("curvaLucratividade", ["A", "B", "C"]).notNull(),
  papelEstrategico: varchar("papelEstrategico", { length: 100 }).notNull(),
  defaultGiro: mysqlEnum("defaultGiro", ["Baixo", "Médio", "Alto"]).notNull(),
  defaultMargem: mysqlEnum("defaultMargem", ["Baixa", "Média", "Alta"]).notNull(),
  defaultLargura: int("defaultLargura").notNull(), // em cm
  defaultComprimento: int("defaultComprimento").notNull(), // em cm
  defaultAltura: int("defaultAltura").notNull(), // em cm
  // Métricas de Performance
  salesVolume: decimal("salesVolume", { precision: 12, scale: 2 }).default("0.00").notNull(),
  turnoverRate: decimal("turnoverRate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  profitMargin: decimal("profitMargin", { precision: 5, scale: 2 }).default("0.00").notNull(),
  stockoutRate: decimal("stockoutRate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  lastUpdatedMetrics: timestamp("lastUpdatedMetrics"),
  isActive: boolean("isActive").default(true).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("categoryProducts_category_idx").on(table.categoryId),
  userIdx: index("categoryProducts_user_idx").on(table.userId),
  skuIdx: index("categoryProducts_sku_idx").on(table.sku),
  eanIdx: index("categoryProducts_ean_idx").on(table.ean),
}));

export type CategoryProduct = typeof categoryProducts.$inferSelect;
export type InsertCategoryProduct = typeof categoryProducts.$inferInsert;

/**
 * Histórico de Performance de Produtos - Rastreamento de métricas ao longo do tempo
 */
export const productPerformanceHistory = mysqlTable("productPerformanceHistory", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  salesVolume: decimal("salesVolume", { precision: 12, scale: 2 }).notNull(),
  turnoverRate: decimal("turnoverRate", { precision: 5, scale: 2 }).notNull(),
  profitMargin: decimal("profitMargin", { precision: 5, scale: 2 }).notNull(),
  stockoutRate: decimal("stockoutRate", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("productPerformanceHistory_product_idx").on(table.productId),
  dateIdx: index("productPerformanceHistory_date_idx").on(table.date),
}));

export type ProductPerformanceHistory = typeof productPerformanceHistory.$inferSelect;
export type InsertProductPerformanceHistory = typeof productPerformanceHistory.$inferInsert;

// ============================================================================
// STRIPE PAYMENTS - Pagamentos com Stripe para Kadeh Ads
// ============================================================================

/**
 * Stripe Checkout Sessions - Rastreamento de sessões de checkout
 */
export const stripeCheckoutSessions = mysqlTable("stripeCheckoutSessions", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  status: mysqlEnum("status", ["open", "complete", "expired"]).default("open").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["unpaid", "paid", "no_payment_required"]).default("unpaid").notNull(),
  checkoutUrl: varchar("checkoutUrl", { length: 500 }).notNull(),
  successUrl: varchar("successUrl", { length: 500 }).notNull(),
  cancelUrl: varchar("cancelUrl", { length: 500 }).notNull(),
  expiresAt: timestamp("expiresAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  campaignIdx: index("stripeCheckoutSessions_campaign_idx").on(table.campaignId),
  stripeSessionIdx: index("stripeCheckoutSessions_stripe_idx").on(table.stripeSessionId),
  statusIdx: index("stripeCheckoutSessions_status_idx").on(table.status),
}));

export type StripeCheckoutSession = typeof stripeCheckoutSessions.$inferSelect;
export type InsertStripeCheckoutSession = typeof stripeCheckoutSessions.$inferInsert;

/**
 * Stripe Payments - Pagamentos processados via Stripe
 */
export const stripePayments = mysqlTable("stripePayments", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeChargeId: varchar("stripeChargeId", { length: 255 }).unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  status: mysqlEnum("status", ["processing", "succeeded", "requires_action", "canceled", "failed"]).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }), // card, boleto, etc
  receiptUrl: varchar("receiptUrl", { length: 500 }),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique(),
  invoiceUrl: varchar("invoiceUrl", { length: 500 }),
  paidAt: timestamp("paidAt"),
  refundedAt: timestamp("refundedAt"),
  refundAmount: decimal("refundAmount", { precision: 10, scale: 2 }),
  refundReason: text("refundReason"),
  failureReason: text("failureReason"),
  metadata: json("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  campaignIdx: index("stripePayments_campaign_idx").on(table.campaignId),
  stripePaymentIdx: index("stripePayments_stripe_idx").on(table.stripePaymentIntentId),
  statusIdx: index("stripePayments_status_idx").on(table.status),
}));

export type StripePayment = typeof stripePayments.$inferSelect;
export type InsertStripePayment = typeof stripePayments.$inferInsert;

/**
 * Stripe Customers - Mapeamento de clientes Stripe para anunciantes
 */
export const stripeCustomers = mysqlTable("stripeCustomers", {
  id: int("id").autoincrement().primaryKey(),
  advertiserId: int("advertiserId").notNull().unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  advertiserIdx: index("stripeCustomers_advertiser_idx").on(table.advertiserId),
  stripeIdx: index("stripeCustomers_stripe_idx").on(table.stripeCustomerId),
}));

export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type InsertStripeCustomer = typeof stripeCustomers.$inferInsert;

/**
 * Gondolas - Gôndolas/expositores na loja
 * Cada gôndola tem um número único e pode ter múltiplas posições
 */
export const gondolas = mysqlTable("gondolas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  gondolaNumber: int("gondolaNumber").notNull(),
  name: varchar("name", { length: 100 }),
  categoryId: int("categoryId"),
  totalPositions: int("totalPositions").default(6).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("gondolas_user_idx").on(table.userId),
  gondolaNumberIdx: index("gondolas_number_idx").on(table.gondolaNumber),
  categoryIdx: index("gondolas_category_idx").on(table.categoryId),
}));

export type Gondola = typeof gondolas.$inferSelect;
export type InsertGondola = typeof gondolas.$inferInsert;

/**
 * Products - Produtos cadastrados em massa
 * Cada produto tem código único, gôndola, posição, categoria e subcategoria
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productCode: varchar("productCode", { length: 50 }).notNull(),
  gondolaNumber: int("gondolaNumber").notNull(),
  position: varchar("position", { length: 20 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("products_user_idx").on(table.userId),
  productCodeIdx: index("products_code_idx").on(table.productCode),
  gondolaIdx: index("products_gondola_idx").on(table.gondolaNumber),
  categoryIdx: index("products_category_idx").on(table.category),
  subcategoryIdx: index("products_subcategory_idx").on(table.subcategory),
}));

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;


// ============================================================================
// PRODUCT CATEGORIES & SUBCATEGORIES - Categorias e Subcategorias de Produtos
// ============================================================================

/**
 * Categorias de Produtos - Mapeamento entre categorias Excel e departamentos do mapa
 * Exemplo: "Óleos Molhos e Azeites" → "Cereais e Bolachas"
 */
export const productSubcategoryMappings = mysqlTable("productSubcategoryMappings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Proprietário da loja
  
  // Identificação
  excelCategory: varchar("excelCategory", { length: 255 }).notNull(), // Categoria do Excel
  subcategory: varchar("subcategory", { length: 255 }).notNull(), // Subcategoria do Excel
  
  // Mapeamento para departamento do mapa
  departmentName: varchar("departmentName", { length: 100 }).notNull(), // Departamento do mapa (ex: "Açougue")
  departmentNameEn: varchar("departmentNameEn", { length: 100 }), // Em inglês
  
  // Metadados
  productCount: int("productCount").default(0).notNull(), // Quantidade de produtos
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("productSubcategoryMappings_user_idx").on(table.userId),
  excelCategoryIdx: index("productSubcategoryMappings_excelCategory_idx").on(table.excelCategory),
  departmentIdx: index("productSubcategoryMappings_department_idx").on(table.departmentName),
  subcategoryIdx: index("productSubcategoryMappings_subcategory_idx").on(table.subcategory),
}));

export type ProductSubcategoryMapping = typeof productSubcategoryMappings.$inferSelect;
export type InsertProductSubcategoryMapping = typeof productSubcategoryMappings.$inferInsert;

/**
 * Produtos com Localização - Produtos com código, gôndola e posição
 * Importado do Excel com correlação automática para departamentos
 */
export const productLocations = mysqlTable("productLocations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Proprietário da loja
  
  // Identificação do Produto
  productCode: varchar("productCode", { length: 50 }).notNull(), // Código do produto (ex: A1, B2)
  productName: varchar("productName", { length: 255 }), // Nome do produto
  
  // Localização na Loja
  gondolaNumber: int("gondolaNumber").notNull(), // Número da gôndola
  gondolaPosition: varchar("gondolaPosition", { length: 50 }), // Posição na gôndola (ex: "Term 1", "A", "B", "C")
  
  // Categorização
  excelCategory: varchar("excelCategory", { length: 255 }).notNull(), // Categoria do Excel
  subcategory: varchar("subcategory", { length: 255 }), // Subcategoria
  departmentName: varchar("departmentName", { length: 100 }).notNull(), // Departamento do mapa
  
  // Coordenadas no mapa (calculadas automaticamente)
  mapX: int("mapX"), // Coordenada X estimada
  mapY: int("mapY"), // Coordenada Y estimada
  
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("productLocations_user_idx").on(table.userId),
  productCodeIdx: index("productLocations_productCode_idx").on(table.productCode),
  gondolaIdx: index("productLocations_gondola_idx").on(table.gondolaNumber),
  departmentIdx: index("productLocations_department_idx").on(table.departmentName),
  subcategoryIdx: index("productLocations_subcategory_idx").on(table.subcategory),
}));

export type ProductLocation = typeof productLocations.$inferSelect;
export type InsertProductLocation = typeof productLocations.$inferInsert;

/**
 * Rotas de Navegação por Subcategoria - Rotas pré-calculadas entre subcategorias
 * Permite navegação rápida entre produtos específicos
 */
export const subcategoryRoutes = mysqlTable("subcategoryRoutes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Proprietário da loja
  
  // Origem e Destino
  fromSubcategory: varchar("fromSubcategory", { length: 255 }).notNull(),
  toSubcategory: varchar("toSubcategory", { length: 255 }).notNull(),
  
  // Departamentos
  fromDepartment: varchar("fromDepartment", { length: 100 }).notNull(),
  toDepartment: varchar("toDepartment", { length: 100 }).notNull(),
  
  // Rota
  pathPoints: json("pathPoints").$type<Array<{x: number, y: number}>>().notNull(), // Array de pontos
  distance: int("distance").notNull(), // Distância em pixels
  estimatedTime: int("estimatedTime").notNull(), // Tempo estimado em segundos
  
  // Metadados
  isActive: boolean("isActive").default(true).notNull(),
  usageCount: int("usageCount").default(0).notNull(), // Quantas vezes foi usada
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("subcategoryRoutes_user_idx").on(table.userId),
  fromSubcategoryIdx: index("subcategoryRoutes_from_idx").on(table.fromSubcategory),
  toSubcategoryIdx: index("subcategoryRoutes_to_idx").on(table.toSubcategory),
  fromDepartmentIdx: index("subcategoryRoutes_fromDept_idx").on(table.fromDepartment),
  toDepartmentIdx: index("subcategoryRoutes_toDept_idx").on(table.toDepartment),
}));

export type SubcategoryRoute = typeof subcategoryRoutes.$inferSelect;
export type InsertSubcategoryRoute = typeof subcategoryRoutes.$inferInsert;
