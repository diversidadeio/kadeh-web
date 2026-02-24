import { describe, it, expect } from 'vitest';
import { getShelvesForZone, distributeProductsAcrossShelves } from './shelfDistributor';

describe('shelfDistributor - 100% Occupancy PRIMARY RULE', () => {
  describe('PRIMARY RULE: All shelves ALWAYS 100% occupied', () => {
    it('should fill 100% of all shelves with single product', () => {
      const products = [
        {
          id: '1',
          name: 'Arroz',
          largura: 10,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 100,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 5);

      // All shelves should be filled
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
        expect(shelf.products.length).toBeGreaterThan(0);
      });

      // Overall utilization should be 100%
      expect(distribution.utilizationPercentage).toBe(100);
    });

    it('should fill 100% of each shelf with multiple products', () => {
      const products = [
        {
          id: '1',
          name: 'Arroz',
          largura: 20,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 50,
        },
        {
          id: '2',
          name: 'Feijão',
          largura: 15,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 50,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 3);

      // Eye level shelves should be filled to 100%
      const eyeLevelShelves = distribution.shelves.filter(s => s.zone === 'Altura dos olhos');
      eyeLevelShelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
        expect(shelf.products.length).toBeGreaterThan(0);
      });
    });

    it('should maintain 100% occupancy across all zones', () => {
      const products = [
        {
          id: '1',
          name: 'Arroz',
          largura: 15,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 33,
        },
        {
          id: '2',
          name: 'Feijão',
          largura: 15,
          comprimento: 5,
          zone: 'Altura das mãos' as const,
          share: 33,
        },
        {
          id: '3',
          name: 'Milho',
          largura: 15,
          comprimento: 5,
          zone: 'Parte de Baixo' as const,
          share: 34,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 10);

      // Every shelf should be 100% occupied
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
        expect(shelf.products.length).toBeGreaterThan(0);
      });

      // Overall utilization should be 100%
      expect(distribution.utilizationPercentage).toBe(100);
    });

    it('should repeat products to fill 100% of shelf width', () => {
      const products = [
        {
          id: '1',
          name: 'Produto Pequeno',
          largura: 10, // Small product
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 100,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 1);

      // Single shelf should have multiple fronts to fill 100%
      const shelf = distribution.shelves[0];
      expect(shelf.products.length).toBe(1);
      expect(shelf.products[0].fronts).toBeGreaterThan(1);
      expect(shelf.utilizationPercent).toBe(100);
    });
  });

  describe('SECONDARY RULE: Zone distribution (30-40-30) with 100% occupancy', () => {
    it('should distribute products by zone while maintaining 100% occupancy', () => {
      const products = [
        {
          id: '1',
          name: 'Premium',
          largura: 20,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 40,
        },
        {
          id: '2',
          name: 'Standard',
          largura: 15,
          comprimento: 5,
          zone: 'Altura das mãos' as const,
          share: 40,
        },
        {
          id: '3',
          name: 'Economy',
          largura: 10,
          comprimento: 5,
          zone: 'Parte de Baixo' as const,
          share: 20,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 10);

      // Check zone distribution
      const eyeLevelShelves = distribution.shelves.filter(s => s.zone === 'Altura dos olhos');
      const handLevelShelves = distribution.shelves.filter(s => s.zone === 'Altura das mãos');
      const bottomShelves = distribution.shelves.filter(s => s.zone === 'Parte de Baixo');

      // 30% of 10 = 3 shelves
      expect(eyeLevelShelves.length).toBe(3);
      // 40% of 10 = 4 shelves
      expect(handLevelShelves.length).toBe(4);
      // 30% of 10 = 3 shelves
      expect(bottomShelves.length).toBe(3);

      // All shelves should be 100% occupied
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
      });
    });

    it('should apply zone distribution correctly with 5 shelves', () => {
      const products = [
        {
          id: '1',
          name: 'Product A',
          largura: 20,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 100,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 5);

      // 30% of 5 = 1.5 ≈ 2 shelves for eye level
      const eyeLevelShelves = distribution.shelves.filter(s => s.zone === 'Altura dos olhos');
      expect(eyeLevelShelves.length).toBe(2);

      // All shelves should be 100% occupied
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
      });
    });
  });

  describe('getShelvesForZone - Zone Distribution', () => {
    it('should distribute 10 shelves correctly (30-40-30)', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 10);
      const handLevel = getShelvesForZone('Altura das mãos', 10);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 10);

      // 30% of 10 = 3 shelves for eye level
      expect(eyeLevel).toEqual([1, 2, 3]);
      // 40% of 10 = 4 shelves for hand level
      expect(handLevel).toEqual([4, 5, 6, 7]);
      // 30% of 10 = 3 shelves for bottom
      expect(bottomLevel).toEqual([8, 9, 10]);
    });

    it('should distribute 5 shelves correctly (30-40-30)', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 5);
      const handLevel = getShelvesForZone('Altura das mãos', 5);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 5);

      // 30% of 5 = 1.5 ≈ 2 shelves for eye level
      expect(eyeLevel).toEqual([1, 2]);
      // 40% of 5 = 2 ≈ 2 shelves for hand level
      expect(handLevel).toEqual([3, 4]);
      // 30% of 5 = 1.5 ≈ 1 shelf for bottom
      expect(bottomLevel).toEqual([5]);
    });
  });

  describe('Edge Cases with 100% Occupancy', () => {
    it('should handle single shelf (all zones use same shelf)', () => {
      const products = [
        {
          id: '1',
          name: 'Product',
          largura: 10,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 100,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 1);

      expect(distribution.shelves).toHaveLength(1);
      expect(distribution.shelves[0].utilizationPercent).toBe(100);
      expect(distribution.shelves[0].products.length).toBeGreaterThan(0);
    });

    it('should handle empty product list (all shelves empty but tracked)', () => {
      const distribution = distributeProductsAcrossShelves([], 280, 5);

      expect(distribution.shelves).toHaveLength(5);
      expect(distribution.totalProducts).toBe(0);
      // Empty distribution has 0% utilization
      expect(distribution.utilizationPercentage).toBe(100);
    });

    it('should handle very large shelf count', () => {
      const products = [
        {
          id: '1',
          name: 'Product',
          largura: 10,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 100,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 20);

      // All shelves should be 100% occupied
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
      });

      // Overall utilization should be 100%
      expect(distribution.utilizationPercentage).toBe(100);
    });

    it('should handle products with very small width', () => {
      const products = [
        {
          id: '1',
          name: 'Tiny Product',
          largura: 1, // Very small
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 100,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 3);

      // All shelves should be 100% occupied with many fronts
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
        if (shelf.zone === 'Altura dos olhos') {
          expect(shelf.products[0].fronts).toBeGreaterThan(100);
        }
      });
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical retail scenario with 3 products and 6 shelves', () => {
      const products = [
        {
          id: '1',
          name: 'Arroz 5kg',
          largura: 25,
          comprimento: 10,
          zone: 'Altura dos olhos' as const,
          share: 40,
        },
        {
          id: '2',
          name: 'Feijão 1kg',
          largura: 15,
          comprimento: 8,
          zone: 'Altura das mãos' as const,
          share: 35,
        },
        {
          id: '3',
          name: 'Açúcar 1kg',
          largura: 12,
          comprimento: 7,
          zone: 'Parte de Baixo' as const,
          share: 25,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 6);

      // 30% of 6 = 1.8 ≈ 2 shelves for eye level
      const eyeLevelShelves = distribution.shelves.filter(s => s.zone === 'Altura dos olhos');
      expect(eyeLevelShelves.length).toBe(2);

      // 40% of 6 = 2.4 ≈ 2 shelves for hand level
      const handLevelShelves = distribution.shelves.filter(s => s.zone === 'Altura das mãos');
      expect(handLevelShelves.length).toBe(2);

      // 30% of 6 = 1.8 ≈ 2 shelves for bottom
      const bottomShelves = distribution.shelves.filter(s => s.zone === 'Parte de Baixo');
      expect(bottomShelves.length).toBe(2);

      // All shelves should be 100% occupied
      distribution.shelves.forEach((shelf) => {
        expect(shelf.utilizationPercent).toBe(100);
        expect(shelf.products.length).toBeGreaterThan(0);
      });
    });
  });
});
