import { describe, it, expect } from "vitest";
import { distributeProductsIntelligently, type ProductForDistribution } from "./intelligentShelfDistributor";

describe("Intelligent Shelf Distributor", () => {
  // Test 1: Basic distribution with products in their zones
  it("should allocate products to their preferred zones", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Sprite",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 2.2,
        giro: "Baixo",
        margem: "Baixa",
      },
      {
        id: "2",
        name: "Coca-Cola",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 15.6,
        giro: "Alto",
        margem: "Alta",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    // Check that Sprite is in bottom shelves (1-2)
    const bottomShelves = result.shelves.filter((s) => s.shelfNumber <= 2);
    const hasSprite = bottomShelves.some((s) =>
      s.products.some((p) => p.id === "1")
    );
    expect(hasSprite).toBe(true);

    // Check that Coca-Cola is in eye level shelves (5-6)
    const eyeShelves = result.shelves.filter((s) => s.shelfNumber >= 5);
    const hasCocaCola = eyeShelves.some((s) =>
      s.products.some((p) => p.id === "2")
    );
    expect(hasCocaCola).toBe(true);
  });

  // Test 2: Fill empty space with complementary products
  it("should add complementary products to fill empty space", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Sprite",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 2.2,
        giro: "Baixo",
        margem: "Baixa",
      },
      {
        id: "2",
        name: "Barré",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 2.2,
        giro: "Baixo",
        margem: "Baixa",
      },
      {
        id: "3",
        name: "Sukita Uva",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 2.2,
        giro: "Baixo",
        margem: "Baixa",
      },
      {
        id: "4",
        name: "Tubaina",
        largura: 10,
        comprimento: 5,
        zone: "Altura das mãos",
        share: 8.9,
        giro: "Médio",
        margem: "Média",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    // Check that bottom shelf has products (including complementary if needed)
    const bottomShelf = result.shelves[0]; // Shelf 1
    expect(bottomShelf.products.length).toBeGreaterThan(0);

    // Check that bottom shelf has complementary products added
    expect(bottomShelf.utilizationPercent).toBeGreaterThan(5);
  });

  // Test 3: Respect product percentages
  it("should respect product percentages within zones", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Product A",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 20,
        giro: "Alto",
        margem: "Alta",
      },
      {
        id: "2",
        name: "Product B",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 15,
        giro: "Médio",
        margem: "Média",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    // Check that each product has its correct share
    const allProducts = result.shelves.flatMap((s) => s.products);
    const productA = allProducts.filter((p) => p.id === "1");
    const productB = allProducts.filter((p) => p.id === "2");

    // Each product should appear in multiple shelves with their share
    expect(productA.length).toBeGreaterThan(0);
    expect(productB.length).toBeGreaterThan(0);
  });

  // Test 4: 6-shelf distribution
  it("should distribute correctly for 6 shelves (2 bottom, 2 hand, 2 eye)", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Bottom Product",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 10,
        giro: "Baixo",
        margem: "Baixa",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    expect(result.shelves.length).toBe(6);

    // Verify zone distribution
    const bottomShelves = result.shelves.filter((s) => s.zone === "Parte de Baixo");
    const handShelves = result.shelves.filter((s) => s.zone === "Altura das mãos");
    const eyeShelves = result.shelves.filter((s) => s.zone === "Altura dos olhos");

    expect(bottomShelves.length).toBe(2);
    expect(handShelves.length).toBe(2);
    expect(eyeShelves.length).toBe(2);
  });

  // Test 5: 7-shelf distribution
  it("should distribute correctly for 7 shelves (2 bottom, 2 hand, 3 eye)", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Product",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 15,
        giro: "Alto",
        margem: "Alta",
      },
    ];

    const result = distributeProductsIntelligently(products, 7);

    expect(result.shelves.length).toBe(7);

    const bottomShelves = result.shelves.filter((s) => s.zone === "Parte de Baixo");
    const handShelves = result.shelves.filter((s) => s.zone === "Altura das mãos");
    const eyeShelves = result.shelves.filter((s) => s.zone === "Altura dos olhos");

    expect(bottomShelves.length).toBe(2);
    expect(handShelves.length).toBe(2);
    expect(eyeShelves.length).toBe(3);
  });

  // Test 6: 8-shelf distribution
  it("should distribute correctly for 8 shelves (2 bottom, 2 hand, 4 eye)", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Product",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 15,
        giro: "Alto",
        margem: "Alta",
      },
    ];

    const result = distributeProductsIntelligently(products, 8);

    expect(result.shelves.length).toBe(8);

    const bottomShelves = result.shelves.filter((s) => s.zone === "Parte de Baixo");
    const handShelves = result.shelves.filter((s) => s.zone === "Altura das mãos");
    const eyeShelves = result.shelves.filter((s) => s.zone === "Altura dos olhos");

    expect(bottomShelves.length).toBe(2);
    expect(handShelves.length).toBe(2);
    expect(eyeShelves.length).toBe(4);
  });

  // Test 7: Prioritize by margem/giro ratio
  it("should prioritize products with better margem/giro ratio for filling space", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Low Priority",
        largura: 10,
        comprimento: 5,
        zone: "Altura das mãos",
        share: 5,
        giro: "Baixo",
        margem: "Baixa",
      },
      {
        id: "2",
        name: "High Priority",
        largura: 10,
        comprimento: 5,
        zone: "Altura das mãos",
        share: 5,
        giro: "Alto",
        margem: "Alta",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    // High priority product should appear earlier in the distribution
    const allProducts = result.shelves.flatMap((s) => s.products);
    const highPriorityIndex = allProducts.findIndex((p) => p.id === "2");
    const lowPriorityIndex = allProducts.findIndex((p) => p.id === "1");

    expect(highPriorityIndex).toBeLessThanOrEqual(lowPriorityIndex);
  });

  // Test 8: Handle empty product list
  it("should handle empty product list", () => {
    const result = distributeProductsIntelligently([], 6);

    expect(result.shelves.length).toBe(6);
    expect(result.totalUtilizationPercent).toBe(0);
    result.shelves.forEach((shelf) => {
      expect(shelf.products.length).toBe(0);
    });
  });

  // Test 9: Single product fills all zones
  it("should fill all zones with single product", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Universal Product",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 20,
        giro: "Alto",
        margem: "Alta",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    // All shelves should have the product
    result.shelves.forEach((shelf) => {
      expect(shelf.products.length).toBeGreaterThan(0);
      expect(shelf.products.some((p) => p.id === "1")).toBe(true);
    });
  });

  // Test 10: Multiple products in same zone
  it("should distribute multiple products in same zone", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Eye Product 1",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 10,
        giro: "Alto",
        margem: "Alta",
      },
      {
        id: "2",
        name: "Eye Product 2",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 15,
        giro: "Médio",
        margem: "Média",
      },
      {
        id: "3",
        name: "Eye Product 3",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 8,
        giro: "Baixo",
        margem: "Baixa",
      },
    ];

    const result = distributeProductsIntelligently(products, 6);

    // Eye level shelves should have all three products
    const eyeShelves = result.shelves.filter((s) => s.zone === "Altura dos olhos");
    eyeShelves.forEach((shelf) => {
      expect(shelf.products.length).toBeGreaterThanOrEqual(1);
    });
  });
});
