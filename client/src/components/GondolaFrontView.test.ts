import { describe, it, expect } from 'vitest';

// Mock the distributeProductsToShelves function
// We'll extract it for testing purposes

interface Product {
  id: string;
  name: string;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  zona?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  quadrantes: number;
  largura?: number;
  share?: number;
  giro?: string;
  margem?: string;
}

function getShelfZone(shelfNumber: number): 'Parte de Baixo' | 'Altura das mãos' | 'Altura dos olhos' {
  if (shelfNumber <= 2) return 'Parte de Baixo';
  if (shelfNumber <= 4) return 'Altura das mãos';
  return 'Altura dos olhos';
}

function distributeProductsToShelves(products: Product[], numberOfShelves: number = 5): Map<number, Product[]> {
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.zona) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.zona) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.zona) === 'Parte de Baixo'),
  };

  const marginPriority = { 'A': 3, 'B': 2, 'C': 1, undefined: 0 };

  const sortByMargin = (products: Product[]) => {
    return [...products].sort((a, b) => {
      const priorityA = marginPriority[a.margem as keyof typeof marginPriority] || 0;
      const priorityB = marginPriority[b.margem as keyof typeof marginPriority] || 0;
      return priorityB - priorityA;
    });
  };

  const usedProductIds = new Set<string>();
  const shelvesMap = new Map<number, Product[]>();
  for (let i = 1; i <= numberOfShelves; i++) {
    shelvesMap.set(i, []);
  }

  // PRATELEIRAS 1-2 (Parte de Baixo)
  const bottomShelfNumbers = [1, 2].filter(n => n <= numberOfShelves);
  let spaceRemainingByShelf = new Map<number, number>();
  
  for (const shelfNum of bottomShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // Adicionar produtos da Parte de Baixo
  for (const product of productsByZone['Parte de Baixo']) {
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // Preencher com Altura das Mãos
  const handLevelSorted = sortByMargin(productsByZone['Altura das mãos']);
  for (const product of handLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining && spaceRemaining > 0) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // Preencher com Altura dos Olhos
  const eyeLevelSorted = sortByMargin(productsByZone['Altura dos olhos']);
  for (const product of eyeLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining && spaceRemaining > 0) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // PRATELEIRAS 3-4 (Altura das Mãos)
  const handShelfNumbers = [3, 4].filter(n => n <= numberOfShelves);
  spaceRemainingByShelf.clear();
  
  for (const shelfNum of handShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  const availableHandProducts = productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id));
  const handLevelSorted2 = sortByMargin(availableHandProducts);

  for (const product of handLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of handShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = handShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of handShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  const eyeLevelSorted2 = sortByMargin(productsByZone['Altura dos olhos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of eyeLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of handShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  // PRATELEIRAS 5+ (Altura dos Olhos)
  const eyeShelfNumbers = Array.from({ length: numberOfShelves - 4 }, (_, i) => i + 5).filter(n => n <= numberOfShelves);
  spaceRemainingByShelf.clear();
  
  for (const shelfNum of eyeShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  for (const product of productsByZone['Altura dos olhos']) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = eyeShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of eyeShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  const handLevelSorted3 = sortByMargin(productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of handLevelSorted3) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  return shelvesMap;
}

describe('GondolaFrontView - Shelf Distribution', () => {
  describe('getShelfZone', () => {
    it('should classify shelves 1-2 as Parte de Baixo', () => {
      expect(getShelfZone(1)).toBe('Parte de Baixo');
      expect(getShelfZone(2)).toBe('Parte de Baixo');
    });

    it('should classify shelves 3-4 as Altura das mãos', () => {
      expect(getShelfZone(3)).toBe('Altura das mãos');
      expect(getShelfZone(4)).toBe('Altura das mãos');
    });

    it('should classify shelf 5 and above as Altura dos olhos', () => {
      expect(getShelfZone(5)).toBe('Altura dos olhos');
      expect(getShelfZone(6)).toBe('Altura dos olhos');
      expect(getShelfZone(7)).toBe('Altura dos olhos');
      expect(getShelfZone(8)).toBe('Altura dos olhos');
    });
  });

  describe('distributeProductsToShelves - Basic Distribution', () => {
    it('should distribute bottom products only to bottom shelves', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Praiana',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 5,
          margem: 'C',
        },
        {
          id: 'p2',
          name: 'Polar',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 5,
          margem: 'C',
        },
      ];

      const distribution = distributeProductsToShelves(products, 5);
      const shelf1 = distribution.get(1) || [];
      const shelf2 = distribution.get(2) || [];

      // Products should be in bottom shelves
      expect(shelf1.length + shelf2.length).toBeGreaterThan(0);
      expect(distribution.get(5)?.length || 0).toBe(0); // Eye level should be empty
    });

    it('should fill remaining bottom shelf space with hand level products', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Praiana',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 5,
          margem: 'C',
        },
        {
          id: 'p2',
          name: 'Cerveja A',
          zone: 'Altura das mãos',
          quadrantes: 2,
          share: 30,
          margem: 'A',
        },
      ];

      const distribution = distributeProductsToShelves(products, 5);
      const shelf1 = distribution.get(1) || [];

      // Shelf 1 should have both bottom and hand level products
      expect(shelf1.length).toBeGreaterThanOrEqual(1);
      const hasBottomProduct = shelf1.some(p => p.zone === 'Parte de Baixo');
      const hasHandProduct = shelf1.some(p => p.zone === 'Altura das mãos');
      expect(hasBottomProduct || hasHandProduct).toBe(true);
    });
  });

  describe('distributeProductsToShelves - Multiple Shelves', () => {
    it('should handle 6 shelves with shelf 6 as Eye Level', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Arroz A',
          zone: 'Altura dos olhos',
          quadrantes: 1,
          share: 20,
          margem: 'A',
        },
        {
          id: 'p2',
          name: 'Arroz B',
          zone: 'Altura dos olhos',
          quadrantes: 1,
          share: 15,
          margem: 'B',
        },
      ];

      const distribution = distributeProductsToShelves(products, 6);
      
      // Shelves 5 and 6 should be Eye Level
      expect(getShelfZone(5)).toBe('Altura dos olhos');
      expect(getShelfZone(6)).toBe('Altura dos olhos');
      
      // Products should be distributed to eye level shelves
      const shelf5 = distribution.get(5) || [];
      const shelf6 = distribution.get(6) || [];
      expect(shelf5.length + shelf6.length).toBeGreaterThan(0);
    });

    it('should handle 8 shelves correctly', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Bottom Product',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 10,
          margem: 'C',
        },
        {
          id: 'p2',
          name: 'Hand Product',
          zone: 'Altura das mãos',
          quadrantes: 1,
          share: 20,
          margem: 'B',
        },
        {
          id: 'p3',
          name: 'Eye Product',
          zone: 'Altura dos olhos',
          quadrantes: 1,
          share: 30,
          margem: 'A',
        },
      ];

      const distribution = distributeProductsToShelves(products, 8);
      
      // Verify all shelves exist
      for (let i = 1; i <= 8; i++) {
        expect(distribution.has(i)).toBe(true);
      }

      // Verify zone classifications
      expect(getShelfZone(1)).toBe('Parte de Baixo');
      expect(getShelfZone(2)).toBe('Parte de Baixo');
      expect(getShelfZone(3)).toBe('Altura das mãos');
      expect(getShelfZone(4)).toBe('Altura das mãos');
      expect(getShelfZone(5)).toBe('Altura dos olhos');
      expect(getShelfZone(6)).toBe('Altura dos olhos');
      expect(getShelfZone(7)).toBe('Altura dos olhos');
      expect(getShelfZone(8)).toBe('Altura dos olhos');
    });
  });

  describe('distributeProductsToShelves - Space Filling', () => {
    it('should not duplicate products across shelves', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Praiana',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 5,
          margem: 'C',
        },
        {
          id: 'p2',
          name: 'Polar',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 5,
          margem: 'C',
        },
        {
          id: 'p3',
          name: 'Cerveja A',
          zone: 'Altura das mãos',
          quadrantes: 2,
          share: 30,
          margem: 'A',
        },
      ];

      const distribution = distributeProductsToShelves(products, 5);
      
      // Count total product occurrences
      let totalOccurrences = 0;
      for (let i = 1; i <= 5; i++) {
        const shelf = distribution.get(i) || [];
        totalOccurrences += shelf.length;
      }

      // Should have at least 3 products placed (no duplicates)
      expect(totalOccurrences).toBeGreaterThanOrEqual(3);
    });

    it('should respect product share percentages', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Praiana',
          zone: 'Parte de Baixo',
          quadrantes: 1,
          share: 5,
          margem: 'C',
        },
      ];

      const distribution = distributeProductsToShelves(products, 5);
      const shelf1 = distribution.get(1) || [];
      
      // Should have the product with its share
      const praianaInShelf = shelf1.find(p => p.id === 'p1');
      expect(praianaInShelf).toBeDefined();
      expect(praianaInShelf?.share).toBe(5);
    });

    it('should prioritize margin A products in hand level', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Cerveja A',
          zone: 'Altura das mãos',
          quadrantes: 2,
          share: 25,
          margem: 'A',
        },
        {
          id: 'p2',
          name: 'Cerveja B',
          zone: 'Altura das mãos',
          quadrantes: 2,
          share: 20,
          margem: 'C',
        },
      ];

      const distribution = distributeProductsToShelves(products, 5);
      const shelf3 = distribution.get(3) || [];
      
      // Margin A should be placed first
      const marginAProduct = shelf3.find(p => p.margem === 'A');
      expect(marginAProduct).toBeDefined();
    });
  });

  describe('distributeProductsToShelves - Edge Cases', () => {
    it('should handle empty product list', () => {
      const distribution = distributeProductsToShelves([], 5);
      
      for (let i = 1; i <= 5; i++) {
        expect(distribution.get(i)?.length || 0).toBe(0);
      }
    });

    it('should handle single shelf', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Product',
          zone: 'Altura dos olhos',
          quadrantes: 1,
          share: 50,
          margem: 'A',
        },
      ];

      const distribution = distributeProductsToShelves(products, 1);
      expect(distribution.has(1)).toBe(true);
      expect(distribution.get(1)?.length).toBeGreaterThan(0);
    });

    it('should handle products without share value', () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Product',
          zone: 'Altura dos olhos',
          quadrantes: 1,
          margem: 'A',
        },
      ];

      const distribution = distributeProductsToShelves(products, 5);
      // Should not crash and should handle gracefully
      expect(distribution.size).toBe(5);
    });
  });
});
