/**
 * Freezer Vertical Distributor
 * Distributes products in vertical freezer displays
 * Zone layout: Eye level (middle), Hand level (middle-lower), Bottom (lower)
 */

export interface FreezerProduct {
  id: string;
  name: string;
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  share: number;
  marginToTurnoverRatio: number;
}

export interface FreezerShelfLayout {
  shelves: FreezerProduct[][];
  totalHeight: number;
  numberOfShelves: number;
  width: number;
}

/**
 * Distributes products in vertical freezer with intelligent space filling
 * @param products - Array of products to distribute
 * @param numberOfShelves - Number of shelves in the freezer (typically 4-6)
 * @param totalHeight - Total height in cm
 * @param width - Width in cm
 * @returns FreezerShelfLayout with products distributed by zone
 */
export function distributeFreezerVerticalProducts(
  products: FreezerProduct[],
  numberOfShelves: number = 5,
  totalHeight: number = 200,
  width: number = 60
): FreezerShelfLayout {
  // Calculate shelf height
  const shelfHeight = totalHeight / numberOfShelves;

  // Determine eye level shelves (typically middle 2 shelves for 5-shelf freezer)
  const eyeLevelStart = Math.floor(numberOfShelves / 2) - 1;
  const eyeLevelEnd = Math.ceil(numberOfShelves / 2);

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

  // Initialize shelves
  const shelves: FreezerProduct[][] = Array.from({ length: numberOfShelves }, () => []);

  // Distribute products to shelves
  // Eye level shelves get priority for eye level products
  for (let i = eyeLevelStart; i <= eyeLevelEnd && i < numberOfShelves; i++) {
    shelves[i] = [...productsByZone['Altura dos olhos']];
  }

  // Hand level products go to hand level shelves
  const handLevelShelves = [
    ...Array.from({ length: eyeLevelStart }, (_, i) => i + 1),
    ...Array.from({ length: numberOfShelves - eyeLevelEnd - 1 }, (_, i) => eyeLevelEnd + 1 + i),
  ];

  for (const shelfIndex of handLevelShelves) {
    if (shelfIndex < numberOfShelves) {
      shelves[shelfIndex] = [...productsByZone['Altura das mãos']];
    }
  }

  // Bottom products go to bottom shelves
  const bottomShelfIndex = numberOfShelves - 1;
  shelves[bottomShelfIndex] = [...productsByZone['Parte de Baixo']];

  // Fill empty space with products from adjacent zones (prioritize by margin/giro)
  for (let i = 0; i < numberOfShelves; i++) {
    const currentOccupancy = shelves[i].reduce((sum, p) => sum + p.share, 0);
    const remainingSpace = 100 - currentOccupancy;

    if (remainingSpace > 0) {
      // Try to fill with hand level products first
      for (const product of productsByZone['Altura das mãos']) {
        if (!shelves[i].includes(product) && product.share <= remainingSpace) {
          shelves[i].push(product);
          break;
        }
      }

      // If still space, try eye level products
      const updatedOccupancy = shelves[i].reduce((sum, p) => sum + p.share, 0);
      const updatedRemainingSpace = 100 - updatedOccupancy;

      if (updatedRemainingSpace > 0) {
        for (const product of productsByZone['Altura dos olhos']) {
          if (!shelves[i].includes(product) && product.share <= updatedRemainingSpace) {
            shelves[i].push(product);
            break;
          }
        }
      }
    }
  }

  return {
    shelves,
    totalHeight,
    numberOfShelves,
    width,
  };
}

/**
 * Validates freezer vertical distribution
 * @param layout - FreezerShelfLayout to validate
 * @returns Validation result with any issues found
 */
export function validateFreezerVerticalLayout(layout: FreezerShelfLayout): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check each shelf occupancy
  for (let i = 0; i < layout.shelves.length; i++) {
    const occupancy = layout.shelves[i].reduce((sum, p) => sum + p.share, 0);

    if (occupancy < 50) {
      issues.push(`Shelf ${i + 1} has low occupancy: ${occupancy.toFixed(1)}%`);
    }

    if (occupancy > 100) {
      issues.push(`Shelf ${i + 1} exceeds capacity: ${occupancy.toFixed(1)}%`);
    }
  }

  // Check that eye level has products
  const eyeLevelStart = Math.floor(layout.numberOfShelves / 2) - 1;
  const eyeLevelEnd = Math.ceil(layout.numberOfShelves / 2);
  let eyeLevelHasProducts = false;

  for (let i = eyeLevelStart; i <= eyeLevelEnd && i < layout.numberOfShelves; i++) {
    if (layout.shelves[i].length > 0) {
      eyeLevelHasProducts = true;
      break;
    }
  }

  if (!eyeLevelHasProducts) {
    issues.push('No products in eye level shelves');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
