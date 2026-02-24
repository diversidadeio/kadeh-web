import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GondolaFrontView from './GondolaFrontView';

describe('GondolaFrontView - Distribution Rules', () => {
  /**
   * REGRA 1: Um produto deve ocupar todo o espaço em todas as prateleiras
   */
  describe('Rule 1: Single Product Distribution', () => {
    it('should render a single product across all three shelves', () => {
      const singleProduct = [
        {
          id: '1',
          name: 'Arroz Integral',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
      ];

      render(
        <GondolaFrontView
          products={singleProduct}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      // Verificar que o produto aparece em todas as 3 prateleiras
      const productNames = screen.getAllByText('Arroz Integral');
      expect(productNames.length).toBeGreaterThanOrEqual(3); // Uma para cada prateleira
    });

    it('should display product width in all shelves when single product', () => {
      const singleProduct = [
        {
          id: '1',
          name: 'Feijão',
          zona: 'Altura das mãos' as const,
          quadrantes: 1,
          largura: 15,
        },
      ];

      render(
        <GondolaFrontView
          products={singleProduct}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      // Verificar que a largura é exibida
      const widthElements = screen.getAllByText('15cm');
      expect(widthElements.length).toBeGreaterThanOrEqual(3); // Uma para cada prateleira
    });
  });

  /**
   * REGRA 2: Múltiplos produtos devem ser distribuídos por zona
   * (Altura dos olhos, Altura das mãos, Parte de Baixo)
   */
  describe('Rule 2: Multi-Product Zone Distribution', () => {
    it('should distribute products by zone correctly', () => {
      const multipleProducts = [
        {
          id: '1',
          name: 'Arroz',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
        {
          id: '2',
          name: 'Feijão',
          zona: 'Altura das mãos' as const,
          quadrantes: 1,
          largura: 10,
        },
        {
          id: '3',
          name: 'Milho',
          zona: 'Parte de Baixo' as const,
          quadrantes: 1,
          largura: 10,
        },
      ];

      render(
        <GondolaFrontView
          products={multipleProducts}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      // Verificar que cada produto aparece em sua zona
      expect(screen.getByText('Arroz')).toBeDefined();
      expect(screen.getByText('Feijão')).toBeDefined();
      expect(screen.getByText('Milho')).toBeDefined();
    });

    it('should show zone labels in Portuguese', () => {
      const products = [
        {
          id: '1',
          name: 'Produto A',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
      ];

      render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      expect(screen.getByText('Altura dos olhos')).toBeDefined();
      expect(screen.getByText('Altura das mãos')).toBeDefined();
      expect(screen.getByText('Parte de Baixo')).toBeDefined();
    });

    it('should show zone labels in English', () => {
      const products = [
        {
          id: '1',
          name: 'Product A',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
      ];

      render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="en"
        />
      );

      expect(screen.getByText('Eye Level')).toBeDefined();
      expect(screen.getByText('Hand Level')).toBeDefined();
      expect(screen.getByText('Bottom Shelf')).toBeDefined();
    });
  });

  /**
   * REGRA 3: Produtos devem ser repetidos por largura para preencher toda a prateleira
   */
  describe('Rule 3: Width-Based Product Repetition', () => {
    it('should repeat products to fill shelf width', () => {
      const products = [
        {
          id: '1',
          name: 'Produto A',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
      ];

      const { container } = render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      // Verificar que o produto está renderizado
      expect(screen.getByText('Produto A')).toBeDefined();

      // Verificar que há múltiplas instâncias do produto (repetição)
      const productElements = container.querySelectorAll('[title*="Produto A"]');
      expect(productElements.length).toBeGreaterThan(0);
    });

    it('should display product width information', () => {
      const products = [
        {
          id: '1',
          name: 'Produto B',
          zona: 'Altura das mãos' as const,
          quadrantes: 1,
          largura: 15,
        },
      ];

      render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      // Verificar que a largura é exibida
      expect(screen.getByText('15cm')).toBeDefined();
    });

    it('should handle multiple products with different widths', () => {
      const products = [
        {
          id: '1',
          name: 'Arroz',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
        {
          id: '2',
          name: 'Feijão',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 20,
        },
      ];

      render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      // Verificar que ambos os produtos aparecem
      expect(screen.getByText('Arroz')).toBeDefined();
      expect(screen.getByText('Feijão')).toBeDefined();

      // Verificar que as larguras são exibidas
      expect(screen.getByText('10cm')).toBeDefined();
      expect(screen.getByText('20cm')).toBeDefined();
    });
  });

  /**
   * Testes de casos extremos
   */
  describe('Edge Cases', () => {
    it('should handle empty product list', () => {
      render(
        <GondolaFrontView
          products={[]}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      expect(
        screen.getByText('Nenhum produto adicionado à simulação')
      ).toBeDefined();
    });

    it('should handle products without width (use default)', () => {
      const products = [
        {
          id: '1',
          name: 'Produto Sem Largura',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          // largura não definida
        },
      ];

      render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      expect(screen.getByText('Produto Sem Largura')).toBeDefined();
    });

    it('should render legend with all zones', () => {
      const products = [
        {
          id: '1',
          name: 'Produto',
          zona: 'Altura dos olhos' as const,
          quadrantes: 1,
          largura: 10,
        },
      ];

      render(
        <GondolaFrontView
          products={products}
          totalWidth={280}
          shelfHeight={60}
          language="pt"
        />
      );

      expect(screen.getByText('Legenda de Zonas')).toBeDefined();
    });
  });
});
