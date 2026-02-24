import { describe, it, expect } from 'vitest';
import { getShelvesForZone, distributeProductsAcrossShelves } from './shelfDistributor';

describe('shelfDistributor - Percentual Distribution (30-40-30)', () => {
  describe('getShelvesForZone - Distribution Logic', () => {
    it('should distribute 1 shelf correctly', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 1);
      const handLevel = getShelvesForZone('Altura das mãos', 1);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 1);

      // All zones should use shelf 1 when only 1 shelf exists
      expect(eyeLevel).toContain(1);
      expect(handLevel).toContain(1);
      expect(bottomLevel).toContain(1);
    });

    it('should distribute 2 shelves correctly', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 2);
      const handLevel = getShelvesForZone('Altura das mãos', 2);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 2);

      // 30% of 2 = 0.6 ≈ 1 shelf for eye level
      // 40% of 2 = 0.8 ≈ 1 shelf for hand level
      // 30% of 2 = 0.6 ≈ 0 shelves for bottom (but minimum 1)
      expect(eyeLevel).toEqual([1]);
      expect(handLevel).toEqual([2]);
      expect(bottomLevel).toEqual([2]);
    });

    it('should distribute 3 shelves correctly', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 3);
      const handLevel = getShelvesForZone('Altura das mãos', 3);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 3);

      // 30% of 3 = 0.9 ≈ 1 shelf for eye level
      // 40% of 3 = 1.2 ≈ 1 shelf for hand level
      // 30% of 3 = 0.9 ≈ 1 shelf for bottom
      expect(eyeLevel).toEqual([1]);
      expect(handLevel).toEqual([2]);
      expect(bottomLevel).toEqual([3]);
    });

    it('should distribute 5 shelves correctly', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 5);
      const handLevel = getShelvesForZone('Altura das mãos', 5);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 5);

      // 30% of 5 = 1.5 ≈ 2 shelves for eye level (shelves 1-2)
      // 40% of 5 = 2 ≈ 2 shelves for hand level (shelves 3-4)
      // 30% of 5 = 1.5 ≈ 1 shelf for bottom (shelf 5)
      expect(eyeLevel).toEqual([1, 2]);
      expect(handLevel).toEqual([3, 4]);
      expect(bottomLevel).toEqual([5]);
    });

    it('should distribute 10 shelves correctly', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 10);
      const handLevel = getShelvesForZone('Altura das mãos', 10);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 10);

      // 30% of 10 = 3 shelves for eye level (shelves 1-3)
      // 40% of 10 = 4 shelves for hand level (shelves 4-7)
      // 30% of 10 = 3 shelves for bottom (shelves 8-10)
      expect(eyeLevel).toEqual([1, 2, 3]);
      expect(handLevel).toEqual([4, 5, 6, 7]);
      expect(bottomLevel).toEqual([8, 9, 10]);
    });

    it('should distribute 6 shelves correctly', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 6);
      const handLevel = getShelvesForZone('Altura das mãos', 6);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 6);

      // 30% of 6 = 1.8 ≈ 2 shelves for eye level (shelves 1-2)
      // 40% of 6 = 2.4 ≈ 2 shelves for hand level (shelves 3-4)
      // 30% of 6 = 1.8 ≈ 2 shelves for bottom (shelves 5-6)
      expect(eyeLevel).toEqual([1, 2]);
      expect(handLevel).toEqual([3, 4]);
      expect(bottomLevel).toEqual([5, 6]);
    });
  });

  describe('distributeProductsAcrossShelves - Product Distribution', () => {
    it('should distribute single product across all shelves', () => {
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

      // Should have 5 shelves
      expect(distribution.shelves).toHaveLength(5);

      // Eye level shelves (1-2) should have the product
      expect(distribution.shelves[0].products).toHaveLength(1);
      expect(distribution.shelves[1].products).toHaveLength(1);

      // Hand level shelves (3-4) should be empty
      expect(distribution.shelves[2].products).toHaveLength(0);
      expect(distribution.shelves[3].products).toHaveLength(0);

      // Bottom shelf (5) should be empty
      expect(distribution.shelves[4].products).toHaveLength(0);
    });

    it('should distribute multiple products by zone', () => {
      const products = [
        {
          id: '1',
          name: 'Arroz',
          largura: 10,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 33,
        },
        {
          id: '2',
          name: 'Feijão',
          largura: 10,
          comprimento: 5,
          zone: 'Altura das mãos' as const,
          share: 33,
        },
        {
          id: '3',
          name: 'Milho',
          largura: 10,
          comprimento: 5,
          zone: 'Parte de Baixo' as const,
          share: 34,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 6);

      // Should have 6 shelves
      expect(distribution.shelves).toHaveLength(6);

      // Eye level shelves (1-2) should have Arroz
      expect(distribution.shelves[0].zone).toBe('Altura dos olhos');
      expect(distribution.shelves[1].zone).toBe('Altura dos olhos');

      // Hand level shelves (3-4) should have Feijão
      expect(distribution.shelves[2].zone).toBe('Altura das mãos');
      expect(distribution.shelves[3].zone).toBe('Altura das mãos');

      // Bottom shelves (5-6) should have Milho
      expect(distribution.shelves[4].zone).toBe('Parte de Baixo');
      expect(distribution.shelves[5].zone).toBe('Parte de Baixo');
    });

    it('should fill 100% of each shelf', () => {
      const products = [
        {
          id: '1',
          name: 'Produto A',
          largura: 20,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 50,
        },
        {
          id: '2',
          name: 'Produto B',
          largura: 15,
          comprimento: 5,
          zone: 'Altura dos olhos' as const,
          share: 50,
        },
      ];

      const distribution = distributeProductsAcrossShelves(products, 280, 3);

      // Check that eye level shelves (1) are filled to 100%
      const eyeLevelShelf = distribution.shelves[0];
      expect(eyeLevelShelf.utilizationPercent).toBeCloseTo(100, 0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty product list', () => {
      const distribution = distributeProductsAcrossShelves([], 280, 5);

      expect(distribution.shelves).toHaveLength(5);
      expect(distribution.totalProducts).toBe(0);
      expect(distribution.utilizationPercentage).toBe(0);
    });

    it('should handle very large shelf count', () => {
      const eyeLevel = getShelvesForZone('Altura dos olhos', 20);
      const handLevel = getShelvesForZone('Altura das mãos', 20);
      const bottomLevel = getShelvesForZone('Parte de Baixo', 20);

      // 30% of 20 = 6 shelves for eye level
      // 40% of 20 = 8 shelves for hand level
      // 30% of 20 = 6 shelves for bottom
      expect(eyeLevel).toHaveLength(6);
      expect(handLevel).toHaveLength(8);
      expect(bottomLevel).toHaveLength(6);
    });
  });
});
