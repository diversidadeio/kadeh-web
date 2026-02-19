import { mysqlTable, varchar, text, int, timestamp, boolean, decimal, enum as mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Tabela de usuários
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "user", "advertiser"]).default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabela de leads de contato
export const contactLeads = mysqlTable("contact_leads", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  message: text("message"),
  source: varchar("source", { length: 50 }).default("contact_form"), // contact_form, kadeh_ads, etc
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "rejected"]).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabela de anúncios
export const advertisements = mysqlTable("advertisements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  advertiserId: varchar("advertiser_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  categories: varchar("categories", { length: 500 }), // JSON array como string
  duration: int("duration").notNull(), // em dias
  numStores: int("num_stores").notNull(),
  region: varchar("region", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "active", "expired"]).default("pending"),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: int("conversions").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabela de analytics de anúncios
export const adAnalytics = mysqlTable("ad_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  adId: varchar("ad_id", { length: 255 }).notNull(),
  date: timestamp("date").defaultNow(),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: int("conversions").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relações
export const usersRelations = relations(users, ({ many }) => ({
  advertisements: many(advertisements),
}));

export const advertisementsRelations = relations(advertisements, ({ one, many }) => ({
  advertiser: one(users, {
    fields: [advertisements.advertiserId],
    references: [users.id],
  }),
  analytics: many(adAnalytics),
}));

export const adAnalyticsRelations = relations(adAnalytics, ({ one }) => ({
  advertisement: one(advertisements, {
    fields: [adAnalytics.adId],
    references: [advertisements.id],
  }),
}));
