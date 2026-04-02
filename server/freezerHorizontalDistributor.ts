/**
 * Freezer Horizontal Distributor
 * Distributes products in horizontal freezer displays (chest freezers)
 * Zone layout: Top (eye level), Middle (hand level), Bottom (below hand level)
 */

export interface HorizontalFreezerProduct {
  id: string;
  name: string;
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  share: number;
  marginToTurnoverRatio: number;
}

export interface HorizontalFreezerLayout {
  sections: HorizontalFreezerProduct[][];
  totalLength: number;
  numberOfSections: number;
  width: number;
  depth: number;
}

/**
 * Distributes products in horizontal freezer with intelligent space filling
 * @param products - Array of products to distribute
 * @param numberOfSections - Number of sections/compartments (typically 3-6)
 * @param totalLength - Total length in cm
 * @param width - Width in cm
 * @param depth - Depth in cm
 * @returns HorizontalFreezerLayout with products distributed by zone
 */
export function distributeHorizontalFreezerProducts(
  products: HorizontalFreezerProduct[],
  numberOfSections: number = 4,
  totalLength: number = 240,
  width: number = 120,
  depth: number = 80
): HorizontalFreezerLayout {
  // Calculate section length
  const sectionLength = totalLength / numberOfSections;

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

  // Initialize sections
  const sections: HorizontalFreezerProduct[][] = Array.from({ length: numberOfSections }, () => []);

  // Distribute products to sections
  // Eye level products (top front) go to all sections
  for (let i = 0; i < numberOfSections; i++) {
    sections[i] = [...productsByZone['Altura dos olhos']];
  }

  // Hand level products fill remaining space
  for (let i = 0; i < numberOfSections; i++) {
    const currentOccupancy = sections[i].reduce((sum, p) => sum + p.share, 0);
    const remainingSpace = 100 - currentOccupancy;

    if (remainingSpace > 0) {
      for (const product of productsByZone['Altura das mãos']) {
        if (!sections[i].includes(product) && product.share <= remainingSpace) {
          sections[i].push(product);
          break;
        }
      }
    }
  }

  // Bottom products go to bottom sections (back of freezer)
  for (let i = 0; i < numberOfSections; i++) {
    const currentOccupancy = sections[i].reduce((sum, p) => sum + p.share, 0);
    const remainingSpace = 100 - currentOccupancy;

    if (remainingSpace > 0) {
      for (const product of productsByZone['Parte de Baixo']) {
        if (!sections[i].includes(product) && product.share <= remainingSpace) {
          sections[i].push(product);
          break;
        }
      }
    }
  }

  return {
    sections,
    totalLength,
    numberOfSections,
    width,
    depth,
  };
}

/**
 * Validates horizontal freezer distribution
 * @param layout - HorizontalFreezerLayout to validate
 * @returns Validation result with any issues found
 */
export function validateHorizontalFreezerLayout(layout: HorizontalFreezerLayout): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check each section occupancy
  for (let i = 0; i < layout.sections.length; i++) {
    const occupancy = layout.sections[i].reduce((sum, p) => sum + p.share, 0);

    if (occupancy < 50) {
      issues.push(`Section ${i + 1} has low occupancy: ${occupancy.toFixed(1)}%`);
    }

    if (occupancy > 100) {
      issues.push(`Section ${i + 1} exceeds capacity: ${occupancy.toFixed(1)}%`);
    }
  }

  // Check that top front (eye level) has products
  let topFrontHasProducts = false;
  for (const section of layout.sections) {
    if (section.some(p => p.zone === 'Altura dos olhos')) {
      topFrontHasProducts = true;
      break;
    }
  }

  if (!topFrontHasProducts) {
    issues.push('No products in top front (eye level) position');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
