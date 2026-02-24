import { describe, it, expect } from 'vitest';
import {
  calculateProductMetrics,
  calculateZoneScore,
  generateOptimizationSuggestions,
  type Product,
} from './productOptimizer';
import { CATEGORIES_DATABASE } from '@/data/categories';

// Mock getRecommendation function
const mockGetRecommendation = (curvaFaturamento: 'A' | 'B' | 'C', curvaLucratividade: 'A' | 'B' | 'C') => ({
  quadrantes: 3,
  zone: curvaLucratividade === 'A' ? 'Altura dos olhos' : curvaLucratividade === 'B' ? 'Altura das mãos' : 'Parte de Baixo',
  share: 15,
});

describe('productOptimizer', () => {
  const mockProduct: Product = {
    id: 'test-1',
    name: 'Test Product',
    categoryId: 'cat-1',
    category: {
      id: 'cat-1',
      name: 'Bebidas',
      mainCategory: 'Alimentar',
      curvaFaturamento: 'A',
      curvaLucratividade: 'A',
      defaultLargura: 10,
      defaultComprimento: 5,
    },
    largura: 10,
    comprimento: 5,
  };

  describe('calculateProductMetrics', () => {
    it('should calculate metrics for high-profitability product', () => {
      const metrics = calculateProductMetrics(mockProduct, mockGetRecommendation);
      
      expect(metrics.margin).toBe(0.35);
      expect(metrics.revenue).toBeGreaterThan(0);
      expect(metrics.profitability).toBeGreaterThan(0);
    });

    it('should calculate metrics for medium-profitability product', () => {
      const mediumProduct = {
        ...mockProduct,
        category: { ...mockProduct.category, curvaLucratividade: 'B' as const },
      };
      
      const metrics = calculateProductMetrics(mediumProduct, mockGetRecommendation);
      expect(metrics.margin).toBe(0.20);
    });

    it('should calculate metrics for low-profitability product', () => {
      const lowProduct = {
        ...mockProduct,
        category: { ...mockProduct.category, curvaLucratividade: 'C' as const },
      };
      
      const metrics = calculateProductMetrics(lowProduct, mockGetRecommendation);
      expect(metrics.margin).toBe(0.10);
    });

    it('should adjust revenue based on product width', () => {
      const wideProduct = { ...mockProduct, largura: 20 };
      const narrowProduct = { ...mockProduct, largura: 5 };
      
      const wideMetrics = calculateProductMetrics(wideProduct, mockGetRecommendation);
      const narrowMetrics = calculateProductMetrics(narrowProduct, mockGetRecommendation);
      
      expect(wideMetrics.revenue).toBeGreaterThan(narrowMetrics.revenue);
    });
  });

  describe('calculateZoneScore', () => {
    it('should prioritize margin for eye-level zone', () => {
      const eyeLevelScore = calculateZoneScore(mockProduct, 'Altura dos olhos', mockGetRecommendation);
      const handLevelScore = calculateZoneScore(mockProduct, 'Altura das mãos', mockGetRecommendation);
      
      expect(eyeLevelScore).toBeGreaterThan(handLevelScore);
    });

    it('should prioritize revenue for hand-level zone', () => {
      const highRevenueProduct = {
        ...mockProduct,
        category: { ...mockProduct.category, curvaFaturamento: 'A' as const },
      };
      
      const handLevelScore = calculateZoneScore(highRevenueProduct, 'Altura das mãos', mockGetRecommendation);
      const bottomLevelScore = calculateZoneScore(highRevenueProduct, 'Parte de Baixo', mockGetRecommendation);
      
      expect(handLevelScore).toBeGreaterThan(bottomLevelScore);
    });

    it('should give lowest score to bottom zone', () => {
      const eyeLevelScore = calculateZoneScore(mockProduct, 'Altura dos olhos', mockGetRecommendation);
      const bottomLevelScore = calculateZoneScore(mockProduct, 'Parte de Baixo', mockGetRecommendation);
      
      expect(eyeLevelScore).toBeGreaterThan(bottomLevelScore);
    });
  });

  describe('generateOptimizationSuggestions', () => {
    it('should generate suggestions for multiple products', () => {
      const products: Product[] = [
        mockProduct,
        {
          ...mockProduct,
          id: 'test-2',
          name: 'Low Margin Product',
          category: { ...mockProduct.category, curvaLucratividade: 'C' as const },
        },
      ];
      
      const result = generateOptimizationSuggestions(products, mockGetRecommendation);
      
      expect(result.suggestions).toBeDefined();
      expect(result.currentTotalMargin).toBeGreaterThan(0);
      expect(result.currentTotalRevenue).toBeGreaterThan(0);
    });

    it('should calculate positive margin increase', () => {
      const products: Product[] = [mockProduct];
      const result = generateOptimizationSuggestions(products, mockGetRecommendation);
      
      expect(result.optimizedTotalMargin).toBeGreaterThanOrEqual(result.currentTotalMargin);
      expect(result.marginIncreasePercentage).toBeGreaterThanOrEqual(0);
    });

    it('should sort suggestions by margin increase descending', () => {
      const products: Product[] = [
        mockProduct,
        {
          ...mockProduct,
          id: 'test-2',
          name: 'Another Product',
          category: { ...mockProduct.category, curvaLucratividade: 'B' as const },
        },
      ];
      
      const result = generateOptimizationSuggestions(products, mockGetRecommendation);
      
      if (result.suggestions.length > 1) {
        for (let i = 0; i < result.suggestions.length - 1; i++) {
          expect(result.suggestions[i].marginIncrease).toBeGreaterThanOrEqual(
            result.suggestions[i + 1].marginIncrease
          );
        }
      }
    });

    it('should provide reason for each suggestion', () => {
      const products: Product[] = [mockProduct];
      const result = generateOptimizationSuggestions(products, mockGetRecommendation);
      
      result.suggestions.forEach((suggestion) => {
        expect(suggestion.reason).toBeTruthy();
        expect(suggestion.reason.length).toBeGreaterThan(0);
      });
    });

    it('should calculate total metrics correctly', () => {
      const products: Product[] = [mockProduct];
      const result = generateOptimizationSuggestions(products, mockGetRecommendation);
      
      expect(result.optimizedTotalMargin).toBe(
        result.currentTotalMargin + result.totalMarginIncrease
      );
      expect(result.optimizedTotalRevenue).toBe(
        result.currentTotalRevenue + result.totalRevenueIncrease
      );
    });
  });
});
