import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Test validation schemas
const ProductInput = z.object({
  productCode: z.string().min(1).max(50),
  gondolaNumber: z.number().int().positive(),
  position: z.string().min(1).max(20),
  category: z.string().min(1).max(100),
  subcategory: z.string().min(1).max(100),
});

describe('Bulk Products', () => {
  describe('Product validation', () => {
    it('should validate a correct product', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'A',
        category: 'Óleos Molhos e Azeites',
        subcategory: 'Óleo de soja em promoção',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should reject product with empty code', () => {
      const product = {
        productCode: '',
        gondolaNumber: 1,
        position: 'A',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should reject product with invalid gondola number', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: -1,
        position: 'A',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should reject product with zero gondola number', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 0,
        position: 'A',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should reject product with empty position', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: '',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should reject product with empty category', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'A',
        category: '',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should reject product with empty subcategory', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'A',
        category: 'Óleos',
        subcategory: '',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should accept product with long code', () => {
      const product = {
        productCode: 'A1B2C3D4E5F6G7H8I9J0',
        gondolaNumber: 1,
        position: 'A',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should reject product with code too long', () => {
      const product = {
        productCode: 'A'.repeat(51),
        gondolaNumber: 1,
        position: 'A',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should accept product with position "Term 1"', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'Term 1',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should accept product with position "Term 2"', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'Term 2',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should accept multiple products in bulk', () => {
      const products = [
        {
          productCode: 'A1',
          gondolaNumber: 1,
          position: 'A',
          category: 'Óleos',
          subcategory: 'Óleo de soja',
        },
        {
          productCode: 'A2',
          gondolaNumber: 1,
          position: 'B',
          category: 'Óleos',
          subcategory: 'Molhos',
        },
        {
          productCode: 'B1',
          gondolaNumber: 2,
          position: 'A',
          category: 'Temperos',
          subcategory: 'Farinha',
        },
      ];

      products.forEach(product => {
        const result = ProductInput.safeParse(product);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Product data extraction', () => {
    it('should extract product data correctly from object', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'Term 1',
        category: 'Óleos Molhos e Azeites',
        subcategory: 'Óleo de soja em promoção',
      };

      const result = ProductInput.parse(product);
      expect(result.productCode).toBe('A1');
      expect(result.gondolaNumber).toBe(1);
      expect(result.position).toBe('Term 1');
      expect(result.category).toBe('Óleos Molhos e Azeites');
      expect(result.subcategory).toBe('Óleo de soja em promoção');
    });

    it('should handle products with special characters in names', () => {
      const product = {
        productCode: 'A1-X',
        gondolaNumber: 1,
        position: 'A',
        category: 'Óleos, Molhos & Azeites',
        subcategory: 'Óleo de soja (em promoção)',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should handle products with accented characters', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1,
        position: 'A',
        category: 'Açúcar, Café e Chá',
        subcategory: 'Açúcar cristal',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(true);
    });
  });

  describe('Gondola number validation', () => {
    it('should accept gondola numbers 1-100', () => {
      for (let i = 1; i <= 100; i++) {
        const product = {
          productCode: 'A1',
          gondolaNumber: i,
          position: 'A',
          category: 'Óleos',
          subcategory: 'Óleo',
        };

        const result = ProductInput.safeParse(product);
        expect(result.success).toBe(true);
      }
    });

    it('should reject float gondola numbers', () => {
      const product = {
        productCode: 'A1',
        gondolaNumber: 1.5,
        position: 'A',
        category: 'Óleos',
        subcategory: 'Óleo',
      };

      const result = ProductInput.safeParse(product);
      expect(result.success).toBe(false);
    });
  });
});
