import { getDb } from "./db";
import {
  productSubcategoryMappings,
  productLocations,
  subcategoryRoutes,
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get all subcategory mappings for a user
 */
export async function getSubcategoryMappings(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(productSubcategoryMappings)
    .where(eq(productSubcategoryMappings.userId, userId));
}

/**
 * Get subcategories for a specific department
 */
export async function getSubcategoriesByDepartment(
  userId: number,
  departmentName: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(productSubcategoryMappings)
    .where(
      and(
        eq(productSubcategoryMappings.userId, userId),
        eq(productSubcategoryMappings.departmentName, departmentName)
      )
    );
}

/**
 * Create or update a subcategory mapping
 */
export async function createSubcategoryMapping(
  userId: number,
  data: {
    excelCategory: string;
    subcategory: string;
    departmentName: string;
    departmentNameEn?: string;
    productCount?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productSubcategoryMappings).values({
    userId,
    ...data,
  });

  return result;
}

/**
 * Get all product locations for a user
 */
export async function getProductLocations(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(productLocations)
    .where(eq(productLocations.userId, userId));
}

/**
 * Get products by subcategory
 */
export async function getProductsBySubcategory(
  userId: number,
  subcategory: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(productLocations)
    .where(
      and(
        eq(productLocations.userId, userId),
        eq(productLocations.subcategory, subcategory)
      )
    );
}

/**
 * Get products by department
 */
export async function getProductsByDepartment(
  userId: number,
  departmentName: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(productLocations)
    .where(
      and(
        eq(productLocations.userId, userId),
        eq(productLocations.departmentName, departmentName)
      )
    );
}

/**
 * Create product location
 */
export async function createProductLocation(
  userId: number,
  data: {
    productCode: string;
    productName?: string;
    gondolaNumber: number;
    gondolaPosition?: string;
    excelCategory: string;
    subcategory?: string;
    departmentName: string;
    mapX?: number;
    mapY?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productLocations).values({
    userId,
    ...data,
  });

  return result;
}

/**
 * Bulk create product locations
 */
export async function bulkCreateProductLocations(
  userId: number,
  products: Array<{
    productCode: string;
    productName?: string;
    gondolaNumber: number;
    gondolaPosition?: string;
    excelCategory: string;
    subcategory?: string;
    departmentName: string;
    mapX?: number;
    mapY?: number;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const data = products.map((p) => ({
    userId,
    ...p,
  }));

  const result = await db.insert(productLocations).values(data);
  return result;
}

/**
 * Get route between two subcategories
 */
export async function getSubcategoryRoute(
  userId: number,
  fromSubcategory: string,
  toSubcategory: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(subcategoryRoutes)
    .where(
      and(
        eq(subcategoryRoutes.userId, userId),
        eq(subcategoryRoutes.fromSubcategory, fromSubcategory),
        eq(subcategoryRoutes.toSubcategory, toSubcategory)
      )
    )
    .limit(1);
}

/**
 * Get all routes for a user
 */
export async function getAllSubcategoryRoutes(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(subcategoryRoutes)
    .where(eq(subcategoryRoutes.userId, userId));
}

/**
 * Create subcategory route
 */
export async function createSubcategoryRoute(
  userId: number,
  data: {
    fromSubcategory: string;
    toSubcategory: string;
    fromDepartment: string;
    toDepartment: string;
    pathPoints: Array<{ x: number; y: number }>;
    distance: number;
    estimatedTime: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subcategoryRoutes).values({
    userId,
    ...data,
  });

  return result;
}

/**
 * Update route usage count
 */
export async function incrementRouteUsage(routeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(subcategoryRoutes)
    .set({
      usageCount: subcategoryRoutes.usageCount,
    })
    .where(eq(subcategoryRoutes.id, routeId));
}

/**
 * Get most used routes
 */
export async function getMostUsedRoutes(userId: number, limit = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(subcategoryRoutes)
    .where(eq(subcategoryRoutes.userId, userId))
    .orderBy(() => desc(subcategoryRoutes.usageCount))
    .limit(limit);
}

/**
 * Search products by code or name
 */
export async function searchProducts(
  userId: number,
  query: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(productLocations)
    .where(
      and(
        eq(productLocations.userId, userId)
      )
    )
    .limit(20);
}
