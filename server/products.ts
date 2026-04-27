import { getDb } from "./db";
import { products, gondolas, Product, Gondola, InsertProduct, InsertGondola } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Product Helpers
 */

export async function createProduct(data: InsertProduct): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(products).values(data);
    const productId = (result as any).insertId || (result as any)[0];
    
    if (!productId) {
      console.error("[DB] No ID returned from insert");
      return null;
    }
    
    const created = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[DB] Error creating product:", error);
    return null;
  }
}

export async function createProductsBulk(dataArray: InsertProduct[]): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.insert(products).values(dataArray);
    return dataArray.length;
  } catch (error) {
    console.error("[DB] Error creating products in bulk:", error);
    return 0;
  }
}

export async function getProductsByUser(userId: number): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(products).where(eq(products.userId, userId));
    return result;
  } catch (error) {
    console.error("[DB] Error fetching products:", error);
    return [];
  }
}

export async function getProductsByGondola(userId: number, gondolaNumber: number): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(products).where(
      and(eq(products.userId, userId), eq(products.gondolaNumber, gondolaNumber))
    );
    return result;
  } catch (error) {
    console.error("[DB] Error fetching products by gondola:", error);
    return [];
  }
}

export async function getProductsByCategory(userId: number, category: string): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(products).where(
      and(eq(products.userId, userId), eq(products.category, category))
    );
    return result;
  } catch (error) {
    console.error("[DB] Error fetching products by category:", error);
    return [];
  }
}

export async function deleteProductsByUser(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(products).where(eq(products.userId, userId));
    return true;
  } catch (error) {
    console.error("[DB] Error deleting products:", error);
    return false;
  }
}

export async function getProductCategories(userId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select({ category: products.category }).from(products)
      .where(eq(products.userId, userId))
      .distinct();
    return result.map((r: any) => r.category);
  } catch (error) {
    console.error("[DB] Error fetching categories:", error);
    return [];
  }
}

export async function getProductSubcategories(userId: number, category: string): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select({ subcategory: products.subcategory }).from(products)
      .where(and(eq(products.userId, userId), eq(products.category, category)))
      .distinct();
    return result.map((r: any) => r.subcategory);
  } catch (error) {
    console.error("[DB] Error fetching subcategories:", error);
    return [];
  }
}

/**
 * Gondola Helpers
 */

export async function createGondola(data: InsertGondola): Promise<Gondola | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(gondolas).values(data);
    const gondolaId = (result as any).insertId || (result as any)[0];
    
    if (!gondolaId) {
      console.error("[DB] No ID returned from insert");
      return null;
    }
    
    const created = await db.select().from(gondolas).where(eq(gondolas.id, gondolaId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[DB] Error creating gondola:", error);
    return null;
  }
}

export async function getGondolasByUser(userId: number): Promise<Gondola[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(gondolas).where(eq(gondolas.userId, userId));
    return result;
  } catch (error) {
    console.error("[DB] Error fetching gondolas:", error);
    return [];
  }
}

export async function getGondolaNumbers(userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select({ gondolaNumber: gondolas.gondolaNumber }).from(gondolas)
      .where(eq(gondolas.userId, userId))
      .distinct();
    return result.map((r: any) => r.gondolaNumber).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("[DB] Error fetching gondola numbers:", error);
    return [];
  }
}
