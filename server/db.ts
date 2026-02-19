import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, advertisers, advertisements, pricingPlans, adAnalytics, adPayments, correlatedCategories } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// KADEH ADS - Advertising System Queries
// ============================================================================

export async function getAdvertiserByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(advertisers)
    .where(eq(advertisers.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAdvertiserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(advertisers)
    .where(eq(advertisers.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPendingAdvertisers() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(advertisers)
    .where(eq(advertisers.status, "pending"))
    .orderBy(asc(advertisers.createdAt));
}

export async function getApprovedAdvertisers() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(advertisers)
    .where(eq(advertisers.status, "approved"));
}

export async function getActiveAdsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return db
    .select()
    .from(advertisements)
    .where(
      and(
        eq(advertisements.status, "active"),
        gte(advertisements.endDate, now)
      )
    )
    .orderBy(asc(advertisements.priorityPosition));
}

export async function getAdvertisementById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(advertisements)
    .where(eq(advertisements.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAdvertisementsByAdvertiserId(advertiserId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(advertisements)
    .where(eq(advertisements.advertiserId, advertiserId))
    .orderBy(desc(advertisements.createdAt));
}

export async function getPricingPlans() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.isActive, true))
    .orderBy(asc(pricingPlans.duration));
}

export async function getCorrelatedCategories(primaryCategory: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(correlatedCategories)
    .where(eq(correlatedCategories.primaryCategory, primaryCategory))
    .orderBy(desc(correlatedCategories.correlationScore));
}

export async function getAdAnalyticsByAdvertisementId(advertisementId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return db
    .select()
    .from(adAnalytics)
    .where(
      and(
        eq(adAnalytics.advertisementId, advertisementId),
        gte(adAnalytics.date, startDate)
      )
    )
    .orderBy(asc(adAnalytics.date));
}

export async function getPaymentByAdvertisementId(advertisementId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(adPayments)
    .where(eq(adPayments.advertisementId, advertisementId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getNextPriorityPosition() {
  const db = await getDb();
  if (!db) return 1;

  const result = await db
    .select()
    .from(advertisements)
    .orderBy(desc(advertisements.priorityPosition))
    .limit(1);

  return result.length > 0 ? result[0].priorityPosition + 1 : 1;
}

export async function recordAdClick(advertisementId: number) {
  const db = await getDb();
  if (!db) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db
    .select()
    .from(adAnalytics)
    .where(
      and(
        eq(adAnalytics.advertisementId, advertisementId),
        gte(adAnalytics.date, today)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(adAnalytics)
      .set({ clicks: existing[0].clicks + 1 })
      .where(eq(adAnalytics.id, existing[0].id));
  } else {
    await db.insert(adAnalytics).values({
      advertisementId,
      date: today,
      clicks: 1,
      impressions: 0,
      conversions: 0,
    });
  }
}

export async function recordAdImpression(advertisementId: number) {
  const db = await getDb();
  if (!db) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db
    .select()
    .from(adAnalytics)
    .where(
      and(
        eq(adAnalytics.advertisementId, advertisementId),
        gte(adAnalytics.date, today)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(adAnalytics)
      .set({ impressions: existing[0].impressions + 1 })
      .where(eq(adAnalytics.id, existing[0].id));
  } else {
    await db.insert(adAnalytics).values({
      advertisementId,
      date: today,
      impressions: 1,
      clicks: 0,
      conversions: 0,
    });
  }
}

export async function getAdAnalyticsSummary(advertisementId: number) {
  const db = await getDb();
  if (!db) return null;

  const analytics = await db
    .select()
    .from(adAnalytics)
    .where(eq(adAnalytics.advertisementId, advertisementId));

  if (analytics.length === 0) return null;

  const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
  const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
  const totalConversions = analytics.reduce((sum, a) => sum + a.conversions, 0);
  const totalConversionValue = analytics.reduce((sum, a) => sum + parseFloat(a.conversionValue?.toString() || "0"), 0);

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const roi = totalConversionValue > 0 ? ((totalConversionValue - parseFloat(analytics[0].conversionValue?.toString() || "0")) / parseFloat(analytics[0].conversionValue?.toString() || "1")) * 100 : 0;

  return {
    totalImpressions,
    totalClicks,
    totalConversions,
    totalConversionValue,
    ctr: parseFloat(ctr.toFixed(2)),
    conversionRate: parseFloat(conversionRate.toFixed(2)),
    roi: parseFloat(roi.toFixed(2)),
  };
}
