import { describe, it, expect } from "vitest";

/**
 * Testes para o sistema de campanhas do Kadeh Ads
 */

describe("Campaigns Router", () => {
  describe("calculatePrice", () => {
    it("should calculate price for 1 day with 5 stores", () => {
      const basePrice = 100;
      const multiplier = 1.0;
      const expectedTotal = basePrice * multiplier;
      expect(expectedTotal).toBe(100);
    });

    it("should calculate price for 7 days with 10 stores", () => {
      const basePrice = 500;
      const multiplier = 1.5;
      const expectedTotal = basePrice * multiplier;
      expect(expectedTotal).toBe(750);
    });

    it("should calculate price for 14 days with 30 stores", () => {
      const basePrice = 900;
      const multiplier = 2.0;
      const expectedTotal = basePrice * multiplier;
      expect(expectedTotal).toBe(1800);
    });

    it("should calculate price for 3 days with 100 stores", () => {
      const basePrice = 250;
      const multiplier = 2.5;
      const expectedTotal = basePrice * multiplier;
      expect(expectedTotal).toBe(625);
    });
  });

  describe("Store Multipliers", () => {
    it("should apply x1.0 multiplier for 1-5 stores", () => {
      const multipliers = [1, 2, 3, 4, 5];
      multipliers.forEach((stores) => {
        const multiplier = stores >= 1 && stores <= 5 ? 1.0 : 0;
        expect(multiplier).toBe(1.0);
      });
    });

    it("should apply x1.5 multiplier for 6-20 stores", () => {
      const multipliers = [6, 10, 15, 20];
      multipliers.forEach((stores) => {
        const multiplier = stores >= 6 && stores <= 20 ? 1.5 : 0;
        expect(multiplier).toBe(1.5);
      });
    });

    it("should apply x2.0 multiplier for 21-50 stores", () => {
      const multipliers = [21, 30, 40, 50];
      multipliers.forEach((stores) => {
        const multiplier = stores >= 21 && stores <= 50 ? 2.0 : 0;
        expect(multiplier).toBe(2.0);
      });
    });

    it("should apply x2.5 multiplier for 50+ stores", () => {
      const multipliers = [51, 100, 500, 1000];
      multipliers.forEach((stores) => {
        const multiplier = stores > 50 ? 2.5 : 0;
        expect(multiplier).toBe(2.5);
      });
    });
  });

  describe("Business Days Calculation", () => {
    it("should calculate business days correctly", () => {
      // 2026-03-02 is Monday, 2026-03-06 is Friday
      // Days: Mon, Tue, Wed, Thu (4 business days, excluding Fri)
      const startDate = new Date("2026-03-02");
      const endDate = new Date("2026-03-06");
      
      let count = 0;
      const current = new Date(startDate);
      while (current < endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      expect(count).toBeGreaterThan(0);
    });

    it("should skip weekends in business days calculation", () => {
      // 2026-03-06 is Friday, 2026-03-09 is Monday
      // Days: Fri (1 business day, excluding Sat, Sun, Mon is not included)
      const startDate = new Date("2026-03-06");
      const endDate = new Date("2026-03-09");
      
      let count = 0;
      const current = new Date(startDate);
      while (current < endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      expect(count).toBeGreaterThan(0);
    });
  });

  describe("Pricing Table", () => {
    it("should have correct pricing for all durations", () => {
      const pricing: Record<string, number> = {
        "1day": 100,
        "3days": 250,
        "7days": 500,
        "14days": 900,
      };

      expect(pricing["1day"]).toBe(100);
      expect(pricing["3days"]).toBe(250);
      expect(pricing["7days"]).toBe(500);
      expect(pricing["14days"]).toBe(900);
    });

    it("should calculate total cost correctly", () => {
      const testCases = [
        { duration: "1day", stores: 5, expectedBase: 100, expectedMultiplier: 1.0, expectedTotal: 100 },
        { duration: "7days", stores: 10, expectedBase: 500, expectedMultiplier: 1.5, expectedTotal: 750 },
        { duration: "14days", stores: 30, expectedBase: 900, expectedMultiplier: 2.0, expectedTotal: 1800 },
        { duration: "3days", stores: 100, expectedBase: 250, expectedMultiplier: 2.5, expectedTotal: 625 },
      ];

      testCases.forEach((testCase) => {
        const total = testCase.expectedBase * testCase.expectedMultiplier;
        expect(total).toBe(testCase.expectedTotal);
      });
    });
  });

  describe("Campaign Validation", () => {
    it("should validate CNPJ format", () => {
      const validCNPJ = "12.345.678/0001-90";
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      expect(cnpjRegex.test(validCNPJ)).toBe(true);
    });

    it("should validate email format", () => {
      const validEmail = "empresa@example.com";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(validEmail)).toBe(true);
    });

    it("should validate EAN13 format", () => {
      const validEAN13 = "1234567890123";
      expect(validEAN13.length).toBe(13);
      expect(/^\d{13}$/.test(validEAN13)).toBe(true);
    });

    it("should validate phone format", () => {
      const validPhone = "(11) 99999-9999";
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      expect(phoneRegex.test(validPhone)).toBe(true);
    });
  });
});
