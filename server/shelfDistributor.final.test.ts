import { describe, it, expect } from "vitest";

// Import the utility from client-side (it's just TypeScript, no browser APIs)
// @ts-ignore
import { distributeProductsAcrossShelves } from "../client/src/utils/shelfDistributor";
// @ts-ignore
import type { ProductForDistribution } from "../client/src/utils/shelfDistributor";

describe("Shelf Distributor - PRIMARY RULE: 100% Occupancy", () => {
  it("should fill ALL 5 shelves with products (no empty shelves)", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Café",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 50,
      },
      {
        id: "2",
        name: "Feijão",
        largura: 10,
        comprimento: 5,
        zone: "Altura das mãos",
        share: 50,
      },
    ];

    const distribution = distributeProductsAcrossShelves(products, 280, 5);

    // Check that all 5 shelves have products
    expect(distribution.shelves).toHaveLength(5);
    
    distribution.shelves.forEach((shelf: any, idx: number) => {
      const shelfNum = idx + 1;
      console.log(`Shelf ${shelfNum}: ${shelf.products.length} products, usedWidth: ${shelf.usedWidth}cm`);
      
      // PRIMARY RULE: Every shelf must have products
      expect(shelf.products.length).toBeGreaterThan(0, 
        `Shelf ${shelfNum} should have products but is empty!`);
      
      // Every shelf should be 100% occupied
      expect(shelf.utilizationPercent).toBe(100, 
        `Shelf ${shelfNum} should be 100% occupied`);
      
      // Every shelf should have used width > 0
      expect(shelf.usedWidth).toBeGreaterThan(0, 
        `Shelf ${shelfNum} should have used width > 0`);
    });

    // Specifically check shelf 5 (bottom level)
    const shelf5 = distribution.shelves[4];
    expect(shelf5.products.length).toBeGreaterThan(0, 
      "Shelf 5 (bottom level) must have products!");
    expect(shelf5.usedWidth).toBeGreaterThan(0, 
      "Shelf 5 must have used width > 0!");
    expect(shelf5.utilizationPercent).toBe(100, 
      "Shelf 5 must be 100% occupied!");
  });

  it("should fill ALL 10 shelves with products (distribution 3-4-3)", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Produto A",
        largura: 10,
        comprimento: 5,
        zone: "Altura dos olhos",
        share: 33,
      },
      {
        id: "2",
        name: "Produto B",
        largura: 10,
        comprimento: 5,
        zone: "Altura das mãos",
        share: 34,
      },
      {
        id: "3",
        name: "Produto C",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 33,
      },
    ];

    const distribution = distributeProductsAcrossShelves(products, 280, 10);

    // Check that all 10 shelves have products
    expect(distribution.shelves).toHaveLength(10);
    
    let emptyShelfCount = 0;
    distribution.shelves.forEach((shelf: any, idx: number) => {
      const shelfNum = idx + 1;
      
      if (shelf.products.length === 0) {
        emptyShelfCount++;
        console.error(`❌ Shelf ${shelfNum} is EMPTY!`);
      } else {
        console.log(`✅ Shelf ${shelfNum}: ${shelf.products.length} products, ${shelf.utilizationPercent}% occupied`);
      }
      
      // PRIMARY RULE: Every shelf must have products
      expect(shelf.products.length).toBeGreaterThan(0, 
        `Shelf ${shelfNum} should have products`);
      
      // Every shelf should be 100% occupied
      expect(shelf.utilizationPercent).toBe(100, 
        `Shelf ${shelfNum} should be 100% occupied`);
    });

    expect(emptyShelfCount).toBe(0, "No shelves should be empty!");
  });

  it("should fill ALL 3 shelves with single product (100% on each)", () => {
    const products: ProductForDistribution[] = [
      {
        id: "1",
        name: "Café Favela",
        largura: 10,
        comprimento: 5,
        zone: "Parte de Baixo",
        share: 100,
      },
    ];

    const distribution = distributeProductsAcrossShelves(products, 280, 3);

    expect(distribution.shelves).toHaveLength(3);
    
    distribution.shelves.forEach((shelf: any, idx: number) => {
      const shelfNum = idx + 1;
      
      // With 1 product, it should appear on all shelves
      expect(shelf.products.length).toBeGreaterThan(0, 
        `Shelf ${shelfNum} should have the product`);
      
      expect(shelf.utilizationPercent).toBe(100, 
        `Shelf ${shelfNum} should be 100% occupied`);
      
      console.log(`Shelf ${shelfNum}: ${shelf.products[0].fronts} fronts of "${shelf.products[0].name}"`);
    });
  });
});
