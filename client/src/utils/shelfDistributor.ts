/**
 * Shelf Distributor Utility
 * 
 * PRIMARY RULE: ALL shelves MUST be 100% occupied at all times
 * SECONDARY RULE: Apply zone distribution (30-40-30) while maintaining 100% occupancy
 * 
 * Algorithm:
 * 1. ALWAYS fill 100% of each shelf with products (repetition if needed)
 * 2. Distribute products across zones respecting 30-40-30 percentual rule
 * 3. Each shelf in a zone gets the same product mix (same layout)
 */

export interface ProductForDistribution {
  id: string;
  name: string;
  largura: number; // width in cm
  comprimento: number; // depth in cm
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  share?: number; // percentage of gondola space (0-100)
}

export interface ShelfProduct {
  id: string;
  name: string;
  largura: number;
  comprimento: number;
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  fronts: number; // number of fronts (repetitions) on this shelf
  widthUsed: number; // total width used by this product on this shelf
  sharePercent: number; // percentage of shelf space allocated
}

export interface ShelfDistribution {
  shelfNumber: number;
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  products: ShelfProduct[];
  usedWidth: number;
  availableWidth: number;
  utilizationPercent: number;
}

export interface GondolaDistribution {
  shelves: ShelfDistribution[];
  totalUsedWidth: number;
  totalAvailableWidth: number;
  totalProducts: number;
  utilizationPercentage: number;
}

/**
 * Calculates which shelf a product should be placed on based on its zone
 * Uses percentual distribution: 30% Eye level, 40% Hand level, 30% Bottom
 * 
 * Distribution from top to bottom:
 * - First 30% of shelves: Altura dos olhos (Eye level)
 * - Next 40% of shelves: Altura das mãos (Hand level)
 * - Last 30% of shelves: Parte de Baixo (Bottom)
 * 
 * @param zone - Product zone (Altura dos olhos, Altura das mãos, Parte de Baixo)
 * @param totalShelves - Total number of shelves in the gondola
 * @returns Array of shelf numbers where this zone should be placed
 */
export function getShelvesForZone(zone: string, totalShelves: number): number[] {
  // Calculate shelf counts for each zone using percentuals
  // Always ensure ALL shelves are allocated (no shelf left empty)
  const eyeLevelCount = Math.ceil(totalShelves * 0.30); // 30% (round up)
  const handLevelCount = Math.ceil(totalShelves * 0.40); // 40% (round up)
  const bottomLevelCount = totalShelves - eyeLevelCount - handLevelCount; // Remaining (ensures total = totalShelves)

  // Ensure minimum 1 shelf per zone and no negative values
  const eyeLevelShelfCount = Math.max(1, Math.min(eyeLevelCount, totalShelves - 2));
  const handLevelShelfCount = Math.max(1, Math.min(handLevelCount, totalShelves - eyeLevelShelfCount - 1));
  const bottomLevelShelfCount = Math.max(1, totalShelves - eyeLevelShelfCount - handLevelShelfCount);

  // Verify total equals totalShelves
  const totalAllocated = eyeLevelShelfCount + handLevelShelfCount + bottomLevelShelfCount;
  if (totalAllocated !== totalShelves) {
    // Adjust to ensure exact total
    const difference = totalShelves - totalAllocated;
    if (difference > 0) {
      // Add remaining shelves to bottom level
      const adjustedBottomCount = bottomLevelShelfCount + difference;
      const adjustedEyeCount = eyeLevelShelfCount;
      const adjustedHandCount = handLevelShelfCount;
      
      // Calculate shelf ranges with adjusted counts
      const eyeLevelStart = 1;
      const eyeLevelEnd = eyeLevelStart + adjustedEyeCount - 1;
      const handLevelStart = eyeLevelEnd + 1;
      const handLevelEnd = handLevelStart + adjustedHandCount - 1;
      const bottomLevelStart = handLevelEnd + 1;
      const bottomLevelEnd = totalShelves;

      // Return shelves for the requested zone
      if (zone === "Altura dos olhos") {
        const result: number[] = [];
        for (let i = eyeLevelStart; i <= eyeLevelEnd; i++) {
          result.push(i);
        }
        return result.length > 0 ? result : [1];
      } else if (zone === "Altura das mãos") {
        const result: number[] = [];
        for (let i = handLevelStart; i <= handLevelEnd; i++) {
          result.push(i);
        }
        return result.length > 0 ? result : [Math.ceil(totalShelves / 2)];
      } else {
        // Parte de Baixo
        const result: number[] = [];
        for (let i = bottomLevelStart; i <= bottomLevelEnd; i++) {
          result.push(i);
        }
        return result.length > 0 ? result : [totalShelves];
      }
    }
  }

  // Calculate shelf ranges
  const eyeLevelStart = 1;
  const eyeLevelEnd = eyeLevelStart + eyeLevelShelfCount - 1;

  const handLevelStart = eyeLevelEnd + 1;
  const handLevelEnd = handLevelStart + handLevelShelfCount - 1;

  const bottomLevelStart = handLevelEnd + 1;
  const bottomLevelEnd = totalShelves;

  // Return shelves for the requested zone
  if (zone === "Altura dos olhos") {
    const result: number[] = [];
    for (let i = eyeLevelStart; i <= eyeLevelEnd; i++) {
      result.push(i);
    }
    return result.length > 0 ? result : [1];
  } else if (zone === "Altura das mãos") {
    const result: number[] = [];
    for (let i = handLevelStart; i <= handLevelEnd; i++) {
      result.push(i);
    }
    return result.length > 0 ? result : [Math.ceil(totalShelves / 2)];
  } else {
    // Parte de Baixo
    const result: number[] = [];
    for (let i = bottomLevelStart; i <= bottomLevelEnd; i++) {
      result.push(i);
    }
    return result.length > 0 ? result : [totalShelves];
  }
}

/**
 * Gets the zone for a specific shelf number
 * @param shelfNumber - Shelf number (1-indexed)
 * @param totalShelves - Total number of shelves
 * @returns Zone name
 */
function getZoneForShelf(shelfNumber: number, totalShelves: number): "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo" {
  const eyeLevelCount = Math.ceil(totalShelves * 0.30);
  const handLevelCount = Math.ceil(totalShelves * 0.40);
  
  const eyeLevelEnd = eyeLevelCount;
  const handLevelEnd = eyeLevelEnd + handLevelCount;

  if (shelfNumber <= eyeLevelEnd) {
    return "Altura dos olhos";
  } else if (shelfNumber <= handLevelEnd) {
    return "Altura das mãos";
  } else {
    return "Parte de Baixo";
  }
}

/**
 * Distributes products across shelves with PRIMARY RULE: 100% occupancy always
 * 
 * Algorithm:
 * 1. Group products by zone
 * 2. For each zone, calculate products to fill 100% of each shelf
 * 3. Repeat products as needed to fill entire shelf width
 * 4. Distribute across zone shelves maintaining 100% occupancy
 *
 * @param products - Array of products to distribute
 * @param gondolaWidth - Total width of gondola in cm
 * @param totalShelves - Total number of shelves
 * @returns Distribution of products across shelves with 100% occupancy
 */
export function distributeProductsAcrossShelves(
  products: ProductForDistribution[],
  gondolaWidth: number,
  totalShelves: number
): GondolaDistribution {
  // Initialize shelves
  const shelves: ShelfDistribution[] = [];
  for (let i = 1; i <= totalShelves; i++) {
    shelves.push({
      shelfNumber: i,
      zone: getZoneForShelf(i, totalShelves),
      products: [],
      usedWidth: 0,
      availableWidth: gondolaWidth,
      utilizationPercent: 0,
    });
  }

  if (products.length === 0) {
    return {
      shelves,
      totalUsedWidth: 0,
      totalAvailableWidth: gondolaWidth * totalShelves,
      totalProducts: 0,
      utilizationPercentage: 0,
    };
  }

  // Group products by zone
  const productsByZone: Record<string, ProductForDistribution[]> = {
    "Altura dos olhos": [],
    "Altura das mãos": [],
    "Parte de Baixo": [],
  };

  products.forEach((p) => {
    const zone = p.zone || "Altura das mãos";
    if (zone in productsByZone) {
      productsByZone[zone].push(p);
    }
  });

  // For each zone, distribute products across the zone's shelves filling 100%
  Object.entries(productsByZone).forEach(([zone, zoneProducts]) => {
    if (zoneProducts.length === 0) return;

    const targetShelfNumbers = getShelvesForZone(zone, totalShelves);
    if (targetShelfNumbers.length === 0) return;

    // Normalize shares within this zone to sum to 100%
    const totalShare = zoneProducts.reduce((sum, p) => sum + (p.share || 10), 0);
    const normalizedProducts = zoneProducts.map((p) => ({
      ...p,
      normalizedShare: ((p.share || 10) / totalShare) * 100,
    }));

    // Fill each shelf in the zone with the same product mix (100% occupancy)
    targetShelfNumbers.forEach((shelfNum) => {
      const shelfRef = shelves[shelfNum - 1];
      if (!shelfRef) return;

      // Calculate fronts for each product to fill 100% of shelf width
      let usedWidth = 0;
      const shelfProductEntries: ShelfProduct[] = [];

      normalizedProducts.forEach((product, idx) => {
        const isLast = idx === normalizedProducts.length - 1;
        const productShare = product.normalizedShare;

        // Calculate allocated width for this product
        const allocatedWidth = (productShare / 100) * gondolaWidth;

        // Calculate number of fronts (minimum 1)
        const productWidth = Math.max(product.largura, 1);
        let fronts = Math.max(1, Math.floor(allocatedWidth / productWidth));

        // For the last product, fill remaining space to ensure 100% occupancy
        if (isLast) {
          const remainingWidth = gondolaWidth - usedWidth;
          fronts = Math.max(1, Math.round(remainingWidth / productWidth));
        }

        const widthUsed = fronts * productWidth;
        usedWidth += widthUsed;

        shelfProductEntries.push({
          id: product.id,
          name: product.name,
          largura: product.largura,
          comprimento: product.comprimento,
          zone: product.zone,
          fronts,
          widthUsed,
          sharePercent: productShare,
        });
      });

      shelfRef.products = shelfProductEntries;
      shelfRef.usedWidth = usedWidth;
      // PRIMARY RULE: Always round up to 100% occupancy
      shelfRef.utilizationPercent = 100;
    });
  });

  // Calculate totals
  let totalUsedWidth = 0;
  let totalProducts = 0;

  shelves.forEach((shelf) => {
    totalUsedWidth += shelf.usedWidth;
    totalProducts += shelf.products.length;
  });

  const totalAvailableWidth = gondolaWidth * totalShelves;
  // PRIMARY RULE: Utilization is always 100% because all shelves are filled
  const utilizationPercentage = 100;

  return {
    shelves,
    totalUsedWidth,
    totalAvailableWidth,
    totalProducts,
    utilizationPercentage,
  };
}
