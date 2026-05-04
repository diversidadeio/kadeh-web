import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { advertisements, advertisers, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Ads Promotion Link System", () => {
  let db: any;
  let testUserId: number;
  let testAdvertiserId: number;
  let testAdvertisementId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Criar usuário de teste
    const userResult = await db
      .insert(users)
      .values({
        openId: `test-user-${Date.now()}`,
        name: "Test User",
        email: "test@example.com",
        loginMethod: "test",
        role: "user",
      });
    testUserId = userResult[0].insertId;

    // Criar anunciante de teste
    const advertiserResult = await db
      .insert(advertisers)
      .values({
        userId: testUserId,
        companyName: "Test Company",
        companyDocument: `${Date.now()}`,
        contactEmail: "contact@test.com",
        status: "approved",
      });
    testAdvertiserId = advertiserResult[0].insertId;

    // Criar anúncio de teste
    const adResult = await db
      .insert(advertisements)
      .values({
        advertiserId: testAdvertiserId,
        title: "Test Ad",
        productCategory: "Test Category",
        targetCategories: ["Category1", "Category2"],
        adType: "product",
        duration: "7days",
        numberOfStores: 1,
        status: "draft",
        priorityPosition: 1,
        totalCost: 100,
      });
    testAdvertisementId = adResult[0].insertId;
  });

  afterAll(async () => {
    if (db) {
      // Limpar dados de teste
      await db
        .delete(advertisements)
        .where(eq(advertisements.id, testAdvertisementId));
      await db
        .delete(advertisers)
        .where(eq(advertisers.id, testAdvertiserId));
      await db
        .delete(users)
        .where(eq(users.id, testUserId));
    }
  });

  it("should generate unique retailer code", async () => {
    const ad = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, testAdvertisementId))
      .limit(1);

    expect(ad[0].retailerCode).toBeDefined();
    expect(ad[0].retailerCode).toMatch(/^KADEH-[A-F0-9]{6}$/);
  });

  it("should generate promotion link with retailer code", async () => {
    const ad = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, testAdvertisementId))
      .limit(1);

    expect(ad[0].promotionLink).toBeDefined();
    expect(ad[0].promotionLink).toContain("/ads/promo/");
    expect(ad[0].promotionLink).toContain(ad[0].retailerCode);
  });

  it("should store store count correctly", async () => {
    const ad = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, testAdvertisementId))
      .limit(1);

    expect(ad[0].storeCount).toBe(1);
  });

  it("should initialize product counts to zero", async () => {
    const ad = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, testAdvertisementId))
      .limit(1);

    expect(ad[0].productCount).toBe(0);
    expect(ad[0].advertisedProductCount).toBe(0);
  });

  it("should update retailer stats", async () => {
    // Atualizar estatísticas
    await db
      .update(advertisements)
      .set({
        productCount: 10,
        advertisedProductCount: 5,
        storeCount: 3,
      })
      .where(eq(advertisements.id, testAdvertisementId));

    const ad = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, testAdvertisementId))
      .limit(1);

    expect(ad[0].productCount).toBe(10);
    expect(ad[0].advertisedProductCount).toBe(5);
    expect(ad[0].storeCount).toBe(3);
  });

  it("should have unique retailer code", async () => {
    // Criar outro anúncio
    const adResult2 = await db
      .insert(advertisements)
      .values({
        advertiserId: testAdvertiserId,
        title: "Test Ad 2",
        productCategory: "Test Category 2",
        targetCategories: ["Category1"],
        adType: "product",
        duration: "7days",
        numberOfStores: 1,
        status: "draft",
        priorityPosition: 2,
        totalCost: 100,
      });

    const ad1 = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, testAdvertisementId))
      .limit(1);

    const ad2 = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, adResult2[0].insertId))
      .limit(1);

    expect(ad1[0].retailerCode).not.toBe(ad2[0].retailerCode);

    // Limpar
    await db
      .delete(advertisements)
      .where(eq(advertisements.id, adResult2[0].insertId));
  });

  it("should maintain retailer code format consistency", async () => {
    const ads = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.advertiserId, testAdvertiserId));

    ads.forEach((ad: any) => {
      if (ad.retailerCode) {
        expect(ad.retailerCode).toMatch(/^KADEH-[A-F0-9]{6}$/);
      }
    });
  });

  it("should have promotion link format consistency", async () => {
    const ads = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.advertiserId, testAdvertiserId));

    ads.forEach((ad: any) => {
      if (ad.promotionLink) {
        expect(ad.promotionLink).toContain("/ads/promo/");
        expect(ad.promotionLink).toMatch(/\/ads\/promo\/KADEH-[A-F0-9]{6}$/);
      }
    });
  });
});
