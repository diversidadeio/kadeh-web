import { getDb } from "./db";
import { storeLayoutCategories, storeLayoutRoutes, InsertStoreLayoutCategory, InsertStoreLayoutRoute, StoreLayoutCategory, StoreLayoutRoute } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Store Layout Category Helpers
 */

export async function createCategory(data: InsertStoreLayoutCategory): Promise<StoreLayoutCategory | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(storeLayoutCategories).values(data);
    const categoryId = result[0];
    
    // Fetch and return the created category
    const created = await db.select().from(storeLayoutCategories).where(eq(storeLayoutCategories.id, categoryId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[DB] Error creating category:", error);
    return null;
  }
}

export async function updateCategory(id: number, data: Partial<InsertStoreLayoutCategory>): Promise<StoreLayoutCategory | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(storeLayoutCategories).set(data).where(eq(storeLayoutCategories.id, id));
    
    // Fetch and return the updated category
    const updated = await db.select().from(storeLayoutCategories).where(eq(storeLayoutCategories.id, id)).limit(1);
    return updated[0] || null;
  } catch (error) {
    console.error("[DB] Error updating category:", error);
    return null;
  }
}

export async function deleteCategory(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(storeLayoutCategories).where(eq(storeLayoutCategories.id, id));
    return true;
  } catch (error) {
    console.error("[DB] Error deleting category:", error);
    return false;
  }
}

export async function getCategoriesByUser(userId: number): Promise<StoreLayoutCategory[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(storeLayoutCategories).where(eq(storeLayoutCategories.userId, userId));
    return result;
  } catch (error) {
    console.error("[DB] Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: number): Promise<StoreLayoutCategory | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(storeLayoutCategories).where(eq(storeLayoutCategories.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[DB] Error fetching category:", error);
    return null;
  }
}

/**
 * Store Layout Route Helpers
 */

export async function createRoute(data: InsertStoreLayoutRoute): Promise<StoreLayoutRoute | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(storeLayoutRoutes).values(data);
    const routeId = result[0];
    
    // Fetch and return the created route
    const created = await db.select().from(storeLayoutRoutes).where(eq(storeLayoutRoutes.id, routeId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[DB] Error creating route:", error);
    return null;
  }
}

export async function updateRoute(id: number, data: Partial<InsertStoreLayoutRoute>): Promise<StoreLayoutRoute | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(storeLayoutRoutes).set(data).where(eq(storeLayoutRoutes.id, id));
    
    // Fetch and return the updated route
    const updated = await db.select().from(storeLayoutRoutes).where(eq(storeLayoutRoutes.id, id)).limit(1);
    return updated[0] || null;
  } catch (error) {
    console.error("[DB] Error updating route:", error);
    return null;
  }
}

export async function deleteRoute(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(storeLayoutRoutes).where(eq(storeLayoutRoutes.id, id));
    return true;
  } catch (error) {
    console.error("[DB] Error deleting route:", error);
    return false;
  }
}

export async function getRoutesByUser(userId: number): Promise<StoreLayoutRoute[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(storeLayoutRoutes).where(eq(storeLayoutRoutes.userId, userId));
    return result;
  } catch (error) {
    console.error("[DB] Error fetching routes:", error);
    return [];
  }
}

export async function getRouteBetweenCategories(fromCategoryId: number, toCategoryId: number): Promise<StoreLayoutRoute | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(storeLayoutRoutes).where(
      and(
        eq(storeLayoutRoutes.fromCategoryId, fromCategoryId),
        eq(storeLayoutRoutes.toCategoryId, toCategoryId)
      )
    ).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[DB] Error fetching route between categories:", error);
    return null;
  }
}

export async function deleteRoutesByCategory(categoryId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Delete routes where this category is either source or destination
    await db.delete(storeLayoutRoutes).where(eq(storeLayoutRoutes.fromCategoryId, categoryId));
    await db.delete(storeLayoutRoutes).where(eq(storeLayoutRoutes.toCategoryId, categoryId));
    return true;
  } catch (error) {
    console.error("[DB] Error deleting routes by category:", error);
    return false;
  }
}
