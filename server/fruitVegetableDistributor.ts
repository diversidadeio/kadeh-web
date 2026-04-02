/**
 * Fruit/Vegetable Display Distributor
 * Distributes products in fruit, vegetable, and produce displays (bancas)
 * Zone layout: Top display (eye level), Middle display (hand level), Bottom bulk (below hand level)
 */

export interface ProduceProduct {
  id: string;
  name: string;
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  share: number;
  marginToTurnoverRatio: number;
}

export interface ProduceDisplayLayout {
  displays: ProduceProduct[][];
  totalWidth: number;
  numberOfDisplays: number;
  height: number;
  depth: number;
}

/**
 * Distributes products in fruit/vegetable display with intelligent space filling
 * @param products - Array of products to distribute
 * @param numberOfDisplays - Number of display sections (typically 2-4)
 * @param totalWidth - Total width in cm
 * @param height - Height in cm
 * @param depth - Depth in cm
 * @returns ProduceDisplayLayout with products distributed by zone
 */
export function distributeProduceDisplayProducts(
  products: ProduceProduct[],
  numberOfDisplays: number = 3,
  totalWidth: number = 300,
  height: number = 150,
  depth: number = 80
): ProduceDisplayLayout {
  // Calculate display width
  const displayWidth = totalWidth / numberOfDisplays;

  // Group products by zone
  const productsByZone = {
    'Altura dos olhos': products.filter(p => p.zone === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => p.zone === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => p.zone === 'Parte de Baixo'),
  };

  // Calculate total share for each zone
  const zoneShares = {
    'Altura dos olhos': productsByZone['Altura dos olhos'].reduce((sum, p) => sum + p.share, 0),
    'Altura das mãos': productsByZone['Altura das mãos'].reduce((sum, p) => sum + p.share, 0),
    'Parte de Baixo': productsByZone['Parte de Baixo'].reduce((sum, p) => sum + p.share, 0),
  };

  // Initialize displays
  const displays: ProduceProduct[][] = Array.from({ length: numberOfDisplays }, () => []);

  // Distribute products to displays
  // Eye level products (top of display) go to all displays
  for (let i = 0; i < numberOfDisplays; i++) {
    displays[i] = [...productsByZone['Altura dos olhos']];
  }

  // Hand level products fill remaining space
  for (let i = 0; i < numberOfDisplays; i++) {
    const currentOccupancy = displays[i].reduce((sum, p) => sum + p.share, 0);
    const remainingSpace = 100 - currentOccupancy;

    if (remainingSpace > 0) {
      for (const product of productsByZone['Altura das mãos']) {
        if (!displays[i].includes(product) && product.share <= remainingSpace) {
          displays[i].push(product);
          break;
        }
      }
    }
  }

  // Bottom products go to bulk display area (typically bottom/back)
  for (let i = 0; i < numberOfDisplays; i++) {
    const currentOccupancy = displays[i].reduce((sum, p) => sum + p.share, 0);
    const remainingSpace = 100 - currentOccupancy;

    if (remainingSpace > 0) {
      for (const product of productsByZone['Parte de Baixo']) {
        if (!displays[i].includes(product) && product.share <= remainingSpace) {
          displays[i].push(product);
          break;
        }
      }
    }
  }

  return {
    displays,
    totalWidth,
    numberOfDisplays,
    height,
    depth,
  };
}

/**
 * Validates produce display distribution
 * @param layout - ProduceDisplayLayout to validate
 * @returns Validation result with any issues found
 */
export function validateProduceDisplayLayout(layout: ProduceDisplayLayout): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check each display occupancy
  for (let i = 0; i < layout.displays.length; i++) {
    const occupancy = layout.displays[i].reduce((sum, p) => sum + p.share, 0);

    if (occupancy < 50) {
      issues.push(`Display ${i + 1} has low occupancy: ${occupancy.toFixed(1)}%`);
    }

    if (occupancy > 100) {
      issues.push(`Display ${i + 1} exceeds capacity: ${occupancy.toFixed(1)}%`);
    }
  }

  // Check that top display (eye level) has products
  let topDisplayHasProducts = false;
  for (const display of layout.displays) {
    if (display.some(p => p.zone === 'Altura dos olhos')) {
      topDisplayHasProducts = true;
      break;
    }
  }

  if (!topDisplayHasProducts) {
    issues.push('No products in top display (eye level) position');
  }

  // Check that bulk area has products
  let bulkHasProducts = false;
  for (const display of layout.displays) {
    if (display.some(p => p.zone === 'Parte de Baixo')) {
      bulkHasProducts = true;
      break;
    }
  }

  if (!bulkHasProducts) {
    issues.push('No products in bulk display area');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
