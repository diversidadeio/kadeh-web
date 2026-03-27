import { describe, it, expect } from 'vitest';
import {
  validateImageFidelity,
  generateValidationFeedback,
  calculateFidelityScore,
} from './imageValidationEngine';

describe('imageValidationEngine', () => {
  describe('validateImageFidelity', () => {
    it('should validate image with correct products', async () => {
      const expectedProducts = ['Arroz Branco 5kg', 'Arroz Integral 2kg'];
      const result = await validateImageFidelity(
        'https://example.com/image.jpg',
        expectedProducts,
        'Arroz'
      );

      expect(result).toBeDefined();
      expect(result.expectedProducts).toEqual(expectedProducts);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should detect missing products', async () => {
      const expectedProducts = ['Arroz Branco 5kg', 'Arroz Integral 2kg', 'Arroz Parboilizado 5kg'];
      const result = await validateImageFidelity(
        'https://example.com/image.jpg',
        expectedProducts,
        'Arroz'
      );

      expect(result.expectedProducts.length).toBeGreaterThanOrEqual(expectedProducts.length - 1);
    });

    it('should handle empty product list', async () => {
      const result = await validateImageFidelity(
        'https://example.com/image.jpg',
        [],
        'Arroz'
      );

      expect(result.expectedProducts).toEqual([]);
      expect(result.isValid).toBeDefined();
    });

    it('should include recommendations when validation fails', async () => {
      const expectedProducts = ['Arroz Branco 5kg'];
      const result = await validateImageFidelity(
        'https://example.com/image.jpg',
        expectedProducts,
        'Arroz'
      );

      if (!result.isValid) {
        expect(result.recommendations.length).toBeGreaterThan(0);
      }
    });
  });

  describe('generateValidationFeedback', () => {
    it('should generate positive feedback for valid validation', () => {
      const result = {
        isValid: true,
        confidence: 95,
        detectedProducts: ['Arroz Branco', 'Arroz Integral'],
        expectedProducts: ['Arroz Branco', 'Arroz Integral'],
        missingProducts: [],
        extraProducts: [],
        issues: [],
        recommendations: [],
      };

      const feedback = generateValidationFeedback(result);

      expect(feedback).toContain('✅');
      expect(feedback).toContain('95%');
    });

    it('should generate negative feedback for invalid validation', () => {
      const result = {
        isValid: false,
        confidence: 50,
        detectedProducts: ['Arroz Branco'],
        expectedProducts: ['Arroz Branco', 'Arroz Integral'],
        missingProducts: ['Arroz Integral'],
        extraProducts: [],
        issues: ['Produto faltante: Arroz Integral'],
        recommendations: ['Regenerar imagem com produto faltante'],
      };

      const feedback = generateValidationFeedback(result);

      expect(feedback).toContain('❌');
      expect(feedback).toContain('Problemas');
      expect(feedback).toContain('Recomendações');
    });

    it('should include extra products in feedback', () => {
      const result = {
        isValid: false,
        confidence: 60,
        detectedProducts: ['Arroz Branco', 'Feijão Carioca'],
        expectedProducts: ['Arroz Branco'],
        missingProducts: [],
        extraProducts: ['Feijão Carioca'],
        issues: ['Produtos não esperados: Feijão Carioca'],
        recommendations: ['Remover produtos de outras categorias'],
      };

      const feedback = generateValidationFeedback(result);

      expect(feedback).toContain('Feijão Carioca');
    });
  });

  describe('calculateFidelityScore', () => {
    it('should calculate score based on confidence', () => {
      const result = {
        isValid: true,
        confidence: 100,
        detectedProducts: [],
        expectedProducts: [],
        missingProducts: [],
        extraProducts: [],
        issues: [],
        recommendations: [],
      };

      const score = calculateFidelityScore(result);

      expect(score).toBe(100);
    });

    it('should penalize for extra products', () => {
      const result = {
        isValid: false,
        confidence: 100,
        detectedProducts: ['Arroz', 'Feijão', 'Macarrão'],
        expectedProducts: ['Arroz'],
        missingProducts: [],
        extraProducts: ['Feijão', 'Macarrão'],
        issues: [],
        recommendations: [],
      };

      const score = calculateFidelityScore(result);

      expect(score).toBeLessThan(100);
      expect(score).toBe(100 - 2 * 5); // 2 produtos extras * 5 pontos cada
    });

    it('should penalize for missing products', () => {
      const result = {
        isValid: false,
        confidence: 100,
        detectedProducts: ['Arroz'],
        expectedProducts: ['Arroz', 'Feijão'],
        missingProducts: ['Feijão'],
        extraProducts: [],
        issues: [],
        recommendations: [],
      };

      const score = calculateFidelityScore(result);

      expect(score).toBeLessThan(100);
      expect(score).toBe(100 - 1 * 10); // 1 produto faltante * 10 pontos
    });

    it('should not go below 0', () => {
      const result = {
        isValid: false,
        confidence: 10,
        detectedProducts: [],
        expectedProducts: ['A', 'B', 'C', 'D', 'E'],
        missingProducts: ['A', 'B', 'C', 'D', 'E'],
        extraProducts: ['X', 'Y', 'Z'],
        issues: [],
        recommendations: [],
      };

      const score = calculateFidelityScore(result);

      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should not go above 100', () => {
      const result = {
        isValid: true,
        confidence: 150,
        detectedProducts: [],
        expectedProducts: [],
        missingProducts: [],
        extraProducts: [],
        issues: [],
        recommendations: [],
      };

      const score = calculateFidelityScore(result);

      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
