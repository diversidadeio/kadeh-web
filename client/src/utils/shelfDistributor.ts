/**
 * Shelf Distributor Utility
 * 
 * PRIMARY RULE: Maximize space utilization with intelligent cascading
 * SECONDARY RULE: Respect zone preferences, but use neighbors if zone is empty
 * TERTIARY RULE: Prioritize products by Giro (sales velocity) then Margem (margin)
 * 
 * Algorithm:
 * 1. Group products by zone
 * 2. For each zone, try to fill with zone-specific products first
 * 3. If zone is empty, cascade to neighboring zones (Mãos → Olhos/Baixo, Olhos → Mãos, Baixo → Mãos)
 * 4. If only 1 product type exists, fill all zones with it
 * 5. Allocate more space to products with higher Giro, then higher Margem
 */

export interface ProductForDistribution {
  id: string;
  name: string;
  largura: number; // width in cm
  comprimento: number; // depth in cm
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  share?: number; // percentage of gondola space (0-100)
  giro?: "Alto" | "Médio" | "Baixo" | "High" | "Medium" | "Low";
  margem?: "Alta" | "Média" | "Baixa" | "High" | "Medium" | "Low";
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
 */
export function getShelvesForZone(zone: string, totalShelves: number): number[] {
  const eyeLevelCount = Math.ceil(totalShelves * 0.30);
  const handLevelCount = Math.ceil(totalShelves * 0.40);
  const bottomLevelCount = totalShelves - eyeLevelCount - handLevelCount;

  const eyeLevelStart = 1;
  const eyeLevelEnd = eyeLevelStart + eyeLevelCount - 1;

  const handLevelStart = eyeLevelEnd + 1;
  const handLevelEnd = handLevelStart + handLevelCount - 1;

  const bottomLevelStart = handLevelEnd + 1;
  const bottomLevelEnd = totalShelves;

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
    const result: number[] = [];
    for (let i = bottomLevelStart; i <= bottomLevelEnd; i++) {
      result.push(i);
    }
    return result.length > 0 ? result : [totalShelves];
  }
}

/**
 * Gets the zone for a specific shelf number
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
 * Converts giro/margem strings to numeric priority (higher = better)
 */
function getGiroPriority(giro?: string): number {
  if (!giro) return 1;
  const normalized = giro.toLowerCase();
  if (normalized === 'alto' || normalized === 'high') return 3;
  if (normalized === 'médio' || normalized === 'medium') return 2;
  return 1; // baixo/low
}

function getMargemPriority(margem?: string): number {
  if (!margem) return 1;
  const normalized = margem.toLowerCase();
  if (normalized === 'alta' || normalized === 'high') return 3;
  if (normalized === 'média' || normalized === 'medium') return 2;
  return 1; // baixa/low
}

/**
 * Sorts products by priority: Giro first, then Margem
 */
function sortProductsByPriority(products: ProductForDistribution[]): ProductForDistribution[] {
  return [...products].sort((a, b) => {
    const giroPriorityA = getGiroPriority(a.giro);
    const giroPriorityB = getGiroPriority(b.giro);
    
    if (giroPriorityA !== giroPriorityB) {
      return giroPriorityB - giroPriorityA; // Higher giro first
    }
    
    const margemPriorityA = getMargemPriority(a.margem);
    const margemPriorityB = getMargemPriority(b.margem);
    
    return margemPriorityB - margemPriorityA; // Higher margem first
  });
}

/**
 * Gets products to fill a zone using cascading logic
 * Priority: Zone products > Neighbor products > All products
 */
function getProductsForZone(
  zone: string,
  productsByZone: Record<string, ProductForDistribution[]>,
  allProducts: ProductForDistribution[]
): ProductForDistribution[] {
  // First priority: Use zone-specific products
  if (productsByZone[zone].length > 0) {
    return sortProductsByPriority(productsByZone[zone]);
  }

  // Second priority: Use neighboring zone products
  if (zone === "Altura das mãos") {
    // Hand level can use Eye level or Bottom
    if (productsByZone["Altura dos olhos"].length > 0) {
      return sortProductsByPriority(productsByZone["Altura dos olhos"]);
    }
    if (productsByZone["Parte de Baixo"].length > 0) {
      return sortProductsByPriority(productsByZone["Parte de Baixo"]);
    }
  } else if (zone === "Altura dos olhos") {
    // Eye level can use Hand level
    if (productsByZone["Altura das mãos"].length > 0) {
      return sortProductsByPriority(productsByZone["Altura das mãos"]);
    }
  } else if (zone === "Parte de Baixo") {
    // Bottom can use Hand level
    if (productsByZone["Altura das mãos"].length > 0) {
      return sortProductsByPriority(productsByZone["Altura das mãos"]);
    }
  }

  // Third priority: Use all products if only one type exists
  if (allProducts.length > 0) {
    return sortProductsByPriority(allProducts);
  }

  return [];
}

/**
 * Distributes products across shelves with intelligent cascading
 * 
 * Algorithm:
 * 1. Group products by zone
 * 2. For each zone, get products (zone-specific or cascaded from neighbors)
 * 3. Distribute products across zone shelves
 * 4. Allocate space based on Giro priority, then Margem
 * 5. Fill 100% of each shelf
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

  // For each zone, distribute products using cascading logic
  const zones = ["Altura dos olhos", "Altura das mãos", "Parte de Baixo"];
  
  zones.forEach((zone) => {
    const targetShelfNumbers = getShelvesForZone(zone, totalShelves);
    
    // Get products for this zone (using cascading logic)
    const zoneProducts = getProductsForZone(zone, productsByZone, products);
    
    if (zoneProducts.length === 0) {
      // No products available for this zone
      return;
    }

    // Normalize shares within this zone to sum to 100%
    const totalShare = zoneProducts.reduce((sum, p) => sum + (p.share || 10), 0);
    const normalizedProducts = zoneProducts.map((p) => ({
      ...p,
      normalizedShare: ((p.share || 10) / totalShare) * 100,
    }));

    // Fill each shelf in the zone with products
    targetShelfNumbers.forEach((shelfNum) => {
      const shelfRef = shelves[shelfNum - 1];
      if (!shelfRef) {
        console.error(`[ERROR] Shelf ${shelfNum} not found in shelves array`);
        return;
      }

      // Calculate fronts for each product to fill shelf width
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
      shelfRef.utilizationPercent = (usedWidth / gondolaWidth) * 100;
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
  const utilizationPercentage = totalAvailableWidth > 0 
    ? (totalUsedWidth / totalAvailableWidth) * 100 
    : 0;

  return {
    shelves,
    totalUsedWidth,
    totalAvailableWidth,
    totalProducts,
    utilizationPercentage,
  };
}
