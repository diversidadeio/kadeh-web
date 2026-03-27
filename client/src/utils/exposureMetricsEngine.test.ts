/**
 * Tests for Exposure Metrics Engine
 */

import { describe, it, expect } from 'vitest';
import {
  calculateExposureMetrics,
  getProductRecommendation,
  type Product,
} from './exposureMetricsEngine';

describe('Exposure Metrics Engine', () => {
  describe('calculateExposureMetrics', () => {
    it('should return empty metrics for empty products array', () => {
      const metrics = calculateExposureMetrics([]);
      
      expect(metrics.shelfOccupancy).toEqual([]);
      expect(metrics.topExposedProducts).toEqual([]);
      expect(metrics.underexposedProducts).toEqual([]);
      expect(metrics.recommendations).toEqual([]);
      expect(metrics.totalOccupancyPercentage).toBe(0);
      expect(metrics.averageOccupancyPercentage).toBe(0);
    });

    it('should calculate shelf occupancy for products in different zones', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A',
          zone: 'Altura dos olhos',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
        {
          id: '2',
          name: 'Produto B',
          zone: 'Altura das mãos',
          share: 15,
          giro: 'B',
          margem: 'B',
        },
        {
          id: '3',
          name: 'Produto C',
          zone: 'Parte de Baixo',
          share: 10,
          giro: 'C',
          margem: 'C',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      // Verificar que temos 5 prateleiras
      expect(metrics.shelfOccupancy).toHaveLength(5);

      // Prateleira 5 (Eye Level) deve ter produto A
      const shelf5 = metrics.shelfOccupancy.find((s) => s.shelfNumber === 5);
      expect(shelf5).toBeDefined();
      expect(shelf5?.occupancyPercentage).toBe(20);
      expect(shelf5?.productCount).toBe(1);

      // Prateleira 1 (Bottom) deve ter produto C
      const shelf1 = metrics.shelfOccupancy.find((s) => s.shelfNumber === 1);
      expect(shelf1).toBeDefined();
      expect(shelf1?.occupancyPercentage).toBe(10);
      expect(shelf1?.productCount).toBe(1);
    });

    it('should identify top exposed products', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto Premium',
          zone: 'Altura dos olhos',
          share: 25,
          giro: 'A',
          margem: 'A',
        },
        {
          id: '2',
          name: 'Produto Básico',
          zone: 'Parte de Baixo',
          share: 5,
          giro: 'C',
          margem: 'C',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      expect(metrics.topExposedProducts.length).toBeGreaterThan(0);
      expect(metrics.topExposedProducts[0].productName).toBe('Produto Premium');
      expect(metrics.topExposedProducts[0].exposureScore).toBeGreaterThan(
        metrics.topExposedProducts[1]?.exposureScore || 0
      );
    });

    it('should identify underexposed products', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto Premium',
          zone: 'Altura dos olhos',
          share: 25,
          giro: 'A',
          margem: 'A',
        },
        {
          id: '2',
          name: 'Produto Básico',
          zone: 'Parte de Baixo',
          share: 5,
          giro: 'C',
          margem: 'C',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      expect(metrics.underexposedProducts.length).toBeGreaterThan(0);
      expect(metrics.underexposedProducts[0].productName).toBe('Produto Básico');
    });

    it('should generate recommendations for high performers not in eye level', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A-A',
          zone: 'Altura das mãos', // Deveria estar em Eye Level
          share: 15,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      expect(metrics.recommendations.length).toBeGreaterThan(0);
      expect(metrics.recommendations[0]).toContain('Altura dos Olhos');
    });

    it('should generate recommendations for underutilized shelves', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A',
          zone: 'Altura dos olhos',
          share: 10,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      // Outras prateleiras estarão vazias
      const underutilized = metrics.shelfOccupancy.filter((s) => s.status === 'underutilized');
      expect(underutilized.length).toBeGreaterThan(0);
    });

    it('should calculate correct total occupancy percentage', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A',
          zone: 'Altura dos olhos',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
        {
          id: '2',
          name: 'Produto B',
          zone: 'Altura das mãos',
          share: 30,
          giro: 'B',
          margem: 'B',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      // Total ocupação = (20 + 30) / 5 prateleiras = 10%
      expect(metrics.totalOccupancyPercentage).toBe(10);
    });

    it('should support English language', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Product A',
          zone: 'Eye level',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'en');

      expect(metrics.recommendations).toBeDefined();
      expect(metrics.topExposedProducts).toBeDefined();
    });
  });

  describe('getProductRecommendation', () => {
    it('should recommend moving A-A product to eye level', () => {
      const product: Product = {
        id: '1',
        name: 'Produto Premium',
        zone: 'Altura das mãos',
        share: 15,
        giro: 'A',
        margem: 'A',
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toContain('Altura dos Olhos');
    });

    it('should recommend increasing share for high performers', () => {
      const product: Product = {
        id: '1',
        name: 'Produto Premium',
        zone: 'Altura dos olhos',
        share: 10,
        giro: 'A',
        margem: 'A',
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toContain('Aumentar');
    });

    it('should recommend moving B-B product to hand level', () => {
      const product: Product = {
        id: '1',
        name: 'Produto Médio',
        zone: 'Altura dos olhos',
        share: 15,
        giro: 'B',
        margem: 'B',
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toContain('Altura das Mãos');
    });

    it('should recommend moving C-C product to bottom shelf', () => {
      const product: Product = {
        id: '1',
        name: 'Produto Básico',
        zone: 'Altura dos olhos',
        share: 10,
        giro: 'C',
        margem: 'C',
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toContain('Parte de Baixo');
    });

    it('should recommend reducing share for low performers', () => {
      const product: Product = {
        id: '1',
        name: 'Produto Básico',
        zone: 'Parte de Baixo',
        share: 15,
        giro: 'C',
        margem: 'C',
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toContain('Reduzir');
    });

    it('should return optimal for well-positioned products', () => {
      const product: Product = {
        id: '1',
        name: 'Produto Premium',
        zone: 'Altura dos olhos',
        share: 25,
        giro: 'A',
        margem: 'A',
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toContain('ótimo');
    });

    it('should support English language for recommendations', () => {
      const product: Product = {
        id: '1',
        name: 'Product A',
        zone: 'Hand level',
        share: 15,
        giro: 'A',
        margem: 'A',
      };

      const recommendation = getProductRecommendation(product, 'en');

      expect(recommendation).toContain('Eye Level');
    });

    it('should handle products with category info', () => {
      const product: Product = {
        id: '1',
        name: 'Produto A',
        zone: 'Altura das mãos',
        share: 15,
        category: {
          curvaFaturamento: 'A',
          curvaLucratividade: 'A',
        },
      };

      const recommendation = getProductRecommendation(product, 'pt');

      expect(recommendation).toBeDefined();
      expect(recommendation).toContain('Altura dos Olhos');
    });
  });

  describe('Zone normalization', () => {
    it('should normalize Portuguese zone names', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A',
          zone: 'Altura dos olhos',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');
      const shelf5 = metrics.shelfOccupancy.find((s) => s.shelfNumber === 5);

      expect(shelf5?.zone).toBe('Altura dos olhos');
    });

    it('should normalize English zone names to Portuguese', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Product A',
          zone: 'Eye level',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');
      const shelf5 = metrics.shelfOccupancy.find((s) => s.shelfNumber === 5);

      expect(shelf5?.zone).toBe('Altura dos olhos');
    });

    it('should handle missing zone gracefully', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      expect(metrics.shelfOccupancy).toBeDefined();
      expect(metrics.topExposedProducts).toBeDefined();
    });
  });

  describe('Exposure score calculation', () => {
    it('should give highest score to A-A products in eye level', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto A-A Eye Level',
          zone: 'Altura dos olhos',
          share: 20,
          giro: 'A',
          margem: 'A',
        },
        {
          id: '2',
          name: 'Produto C-C Bottom',
          zone: 'Parte de Baixo',
          share: 5,
          giro: 'C',
          margem: 'C',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      expect(metrics.topExposedProducts[0].productName).toBe('Produto A-A Eye Level');
      expect(metrics.topExposedProducts[0].exposureScore).toBeGreaterThan(90);
    });

    it('should consider share in exposure score', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Produto High Share',
          zone: 'Altura dos olhos',
          share: 30,
          giro: 'A',
          margem: 'A',
        },
        {
          id: '2',
          name: 'Produto Low Share',
          zone: 'Altura dos olhos',
          share: 5,
          giro: 'A',
          margem: 'A',
        },
      ];

      const metrics = calculateExposureMetrics(products, 'pt');

      const highShare = metrics.topExposedProducts.find((p) => p.productName === 'Produto High Share');
      const lowShare = metrics.topExposedProducts.find((p) => p.productName === 'Produto Low Share');

      expect((highShare?.exposureScore || 0) > (lowShare?.exposureScore || 0)).toBe(true);
    });
  });
});
