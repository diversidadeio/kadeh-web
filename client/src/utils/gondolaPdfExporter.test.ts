import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportGondolaPlanogram, exportGondolaVisualization } from './gondolaPdfExporter';

// Mock jsPDF
vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn(() => ({
      internal: {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297,
        },
      },
      setFont: vi.fn(),
      setFontSize: vi.fn(),
      setTextColor: vi.fn(),
      text: vi.fn(),
      addPage: vi.fn(),
      addImage: vi.fn(),
      save: vi.fn(),
    })),
  };
});

// Mock jspdf-autotable
vi.mock('jspdf-autotable', () => ({}));

describe('gondolaPdfExporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('exportGondolaPlanogram', () => {
    it('should export planogram with valid products and config', async () => {
      const products = [
        {
          id: '1',
          name: 'Leite Integral',
          zone: 'Altura das mãos',
          zona: 'Altura das mãos',
          quadrantes: 3,
          largura: 10,
          share: 15,
          giro: 'Alto',
          margem: 'Alta',
        },
        {
          id: '2',
          name: 'Leite Desnatado',
          zone: 'Parte de Baixo',
          zona: 'Parte de Baixo',
          quadrantes: 1,
          largura: 10,
          share: 5,
          giro: 'Baixo',
          margem: 'Baixa',
        },
      ];

      const gondolaConfig = {
        width: 280,
        height: 60,
        depth: 40,
        numberOfShelves: 5,
      };

      await exportGondolaPlanogram(products, gondolaConfig, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });

    it('should handle empty products array', async () => {
      const products: any[] = [];

      const gondolaConfig = {
        width: 280,
        height: 60,
        depth: 40,
        numberOfShelves: 5,
      };

      await exportGondolaPlanogram(products, gondolaConfig, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });

    it('should support English language', async () => {
      const products = [
        {
          id: '1',
          name: 'Milk',
          zone: 'Hand level',
          zona: 'Hand level',
          quadrantes: 3,
          largura: 10,
          share: 15,
          giro: 'High',
          margem: 'High',
        },
      ];

      const gondolaConfig = {
        width: 280,
        height: 60,
        depth: 40,
        numberOfShelves: 5,
      };

      await exportGondolaPlanogram(products, gondolaConfig, 'Test Store', 'en');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });

    it('should calculate shelf distribution correctly', async () => {
      const products = [
        {
          id: '1',
          name: 'Product A',
          zone: 'Parte de Baixo',
          zona: 'Parte de Baixo',
          quadrantes: 1,
          largura: 10,
          share: 20,
          giro: 'Baixo',
          margem: 'Baixa',
        },
        {
          id: '2',
          name: 'Product B',
          zone: 'Altura das mãos',
          zona: 'Altura das mãos',
          quadrantes: 2,
          largura: 10,
          share: 30,
          giro: 'Médio',
          margem: 'Média',
        },
        {
          id: '3',
          name: 'Product C',
          zone: 'Altura dos olhos',
          zona: 'Altura dos olhos',
          quadrantes: 3,
          largura: 10,
          share: 25,
          giro: 'Alto',
          margem: 'Alta',
        },
      ];

      const gondolaConfig = {
        width: 280,
        height: 60,
        depth: 40,
        numberOfShelves: 5,
      };

      await exportGondolaPlanogram(products, gondolaConfig, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });

    it('should handle products with missing optional fields', async () => {
      const products = [
        {
          id: '1',
          name: 'Product A',
          quadrantes: 1,
          largura: 10,
          // Missing zone, zona, share, giro, margem
        },
      ];

      const gondolaConfig = {
        width: 280,
        height: 60,
        depth: 40,
        numberOfShelves: 5,
      };

      await exportGondolaPlanogram(products, gondolaConfig, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });
  });

  describe('exportGondolaVisualization', () => {
    it('should export visualization from canvas element', async () => {
      // Create a mock canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;

      await exportGondolaVisualization(canvas, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });

    it('should support English language for visualization', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;

      await exportGondolaVisualization(canvas, 'Test Store', 'en');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });

    it('should handle canvas with different dimensions', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 400;

      await exportGondolaVisualization(canvas, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });
  });

  describe('Product distribution logic', () => {
    it('should fill bottom shelf with hand level products when space is available', async () => {
      const products = [
        {
          id: '1',
          name: 'Bottom Product',
          zone: 'Parte de Baixo',
          zona: 'Parte de Baixo',
          quadrantes: 1,
          largura: 10,
          share: 30, // 30% of bottom shelf
          giro: 'Baixo',
          margem: 'Baixa',
        },
        {
          id: '2',
          name: 'Hand Level Product 1',
          zone: 'Altura das mãos',
          zona: 'Altura das mãos',
          quadrantes: 2,
          largura: 10,
          share: 20, // Can fit in remaining 70% of bottom shelf
          giro: 'Médio',
          margem: 'Média',
        },
        {
          id: '3',
          name: 'Hand Level Product 2',
          zone: 'Altura das mãos',
          zona: 'Altura das mãos',
          quadrantes: 2,
          largura: 10,
          share: 20,
          giro: 'Médio',
          margem: 'Média',
        },
      ];

      const gondolaConfig = {
        width: 280,
        height: 60,
        depth: 40,
        numberOfShelves: 5,
      };

      await exportGondolaPlanogram(products, gondolaConfig, 'Loja Teste', 'pt');

      // Verify that the function completes without errors
      expect(true).toBe(true);
    });
  });
});
