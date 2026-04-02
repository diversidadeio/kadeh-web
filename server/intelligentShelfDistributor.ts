/**
 * Intelligent Shelf Distributor
 * 
 * ALGORITHM:
 * 1. Allocate space to each product based on its recommended percentage (share)
 * 2. Distribute products across shelves in their zone proportionally
 * 3. If a shelf has empty space, fill it with copies of the same product or products from adjacent zones
 * 4. Prioritize products with better margem/giro ratio for filling empty space
 * 5. Ensure 100% shelf utilization while respecting zone preferences
 */

export interface ProductForDistribution {
  id: string;
  name: string;
  largura: number;
  comprimento: number;
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  share?: number; // Recommended percentage (0-100)
  giro?: "Alto" | "Médio" | "Baixo" | "High" | "Medium" | "Low" | "A" | "B" | "C";
  margem?: "Alta" | "Média" | "Baixa" | "High" | "Medium" | "Low" | "A" | "B" | "C";
}

export interface ShelfProduct {
  id: string;
  name: string;
  share: number; // Percentage of shelf space
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  giro?: string;
  margem?: string;
  isComplementary?: boolean; // True if added to fill empty space
}

export interface ShelfDistribution {
  shelfNumber: number;
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  products: ShelfProduct[];
  utilizationPercent: number;
}

export interface GondolaDistribution {
  shelves: ShelfDistribution[];
  totalUtilizationPercent: number;
}

/**
 * Calculates margem/giro priority score (higher = better)
 * Used to prioritize products for filling empty space
 */
function calculatePriorityScore(product: ProductForDistribution): number {
  const giroPriority = getGiroPriority(product.giro);
  const margemPriority = getMargemPriority(product.margem);
  
  // Weighted: Giro is 60%, Margem is 40%
  return (giroPriority * 0.6) + (margemPriority * 0.4);
}

function getGiroPriority(giro?: string): number {
  if (!giro) return 1;
  const normalized = giro.toLowerCase();
  if (normalized === 'alto' || normalized === 'high' || normalized === 'a') return 3;
  if (normalized === 'médio' || normalized === 'medium' || normalized === 'b') return 2;
  return 1; // baixo/low/c
}

function getMargemPriority(margem?: string): number {
  if (!margem) return 1;
  const normalized = margem.toLowerCase();
  if (normalized === 'alta' || normalized === 'high' || normalized === 'a') return 3;
  if (normalized === 'média' || normalized === 'medium' || normalized === 'b') return 2;
  return 1; // baixa/low/c
}

/**
 * Determines which shelves belong to each zone
 * For 6 shelves: 2 bottom, 2 hand level, 2 eye level
 * For 7 shelves: 2 bottom, 2 hand level, 3 eye level
 * For 8 shelves: 2 bottom, 2 hand level, 4 eye level
 */
function getShelvesForZone(zone: string, totalShelves: number): number[] {
  const bottomCount = 2;
  const handCount = 2;
  const eyeCount = totalShelves - bottomCount - handCount;

  if (zone === "Parte de Baixo") {
    return Array.from({ length: bottomCount }, (_, i) => i + 1);
  } else if (zone === "Altura das mãos") {
    return Array.from({ length: handCount }, (_, i) => bottomCount + i + 1);
  } else {
    return Array.from({ length: eyeCount }, (_, i) => bottomCount + handCount + i + 1);
  }
}

/**
 * Gets the zone for a specific shelf number
 */
function getZoneForShelf(shelfNumber: number, totalShelves: number): "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo" {
  const bottomCount = 2;
  const handCount = 2;

  if (shelfNumber <= bottomCount) {
    return "Parte de Baixo";
  } else if (shelfNumber <= bottomCount + handCount) {
    return "Altura das mãos";
  } else {
    return "Altura dos olhos";
  }
}

/**
 * Gets neighboring zones for cascading fill
 */
function getNeighboringZones(zone: string): string[] {
  if (zone === "Altura das mãos") {
    return ["Altura dos olhos", "Parte de Baixo"];
  } else if (zone === "Altura dos olhos") {
    return ["Altura das mãos"];
  } else {
    return ["Altura das mãos", "Altura dos olhos"];
  }
}

/**
 * Main distribution algorithm
 */
export function distributeProductsIntelligently(
  products: ProductForDistribution[],
  totalShelves: number
): GondolaDistribution {
  // Initialize shelves
  const shelves: ShelfDistribution[] = [];
  for (let i = 1; i <= totalShelves; i++) {
    shelves.push({
      shelfNumber: i,
      zone: getZoneForShelf(i, totalShelves),
      products: [],
      utilizationPercent: 0,
    });
  }

  if (products.length === 0) {
    return {
      shelves,
      totalUtilizationPercent: 0,
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

  // Sort products by priority (margem/giro ratio)
  Object.keys(productsByZone).forEach((zone) => {
    productsByZone[zone].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));
  });

  // Step 1: Distribute products to shelves in their zones
  // Each product gets its share on EACH shelf in its zone
  Object.keys(productsByZone).forEach((zone) => {
    const shelvesInZone = getShelvesForZone(zone, totalShelves);
    const productsInZone = productsByZone[zone];

    shelvesInZone.forEach((shelfNumber) => {
      const shelf = shelves[shelfNumber - 1];
      
      // Add each product from this zone to this shelf
      productsInZone.forEach((product) => {
        shelf.products.push({
          id: product.id,
          name: product.name,
          share: product.share || 15,
          zone: product.zone,
          giro: product.giro,
          margem: product.margem,
          isComplementary: false,
        });
      });
    });
  });

  // Step 2: Calculate utilization and fill empty space
  shelves.forEach((shelf) => {
    let currentUtilization = shelf.products.reduce((sum, p) => sum + p.share, 0);
    shelf.utilizationPercent = Math.min(currentUtilization, 100);
    
    if (currentUtilization < 99.9) { // Allow small floating point error
      let remainingSpace = 100 - currentUtilization;
      const neighboringZones = getNeighboringZones(shelf.zone);

      // First, try to fill with copies of existing products in this shelf
      const existingProducts = [...shelf.products].sort((a, b) => {
        const aProduct = products.find(p => p.id === a.id);
        const bProduct = products.find(p => p.id === b.id);
        const aScore = aProduct ? calculatePriorityScore(aProduct) : 0;
        const bScore = bProduct ? calculatePriorityScore(bProduct) : 0;
        return bScore - aScore;
      });

      for (const existingProduct of existingProducts) {
        if (remainingSpace < 0.1) break;

        const originalProduct = products.find(p => p.id === existingProduct.id);
        if (!originalProduct) continue;

        const productShare = originalProduct.share || 15;
        const spaceToAdd = Math.min(productShare, remainingSpace);

        shelf.products.push({
          id: existingProduct.id,
          name: existingProduct.name,
          share: spaceToAdd,
          zone: existingProduct.zone,
          giro: existingProduct.giro,
          margem: existingProduct.margem,
          isComplementary: true,
        });

        remainingSpace -= spaceToAdd;
        currentUtilization += spaceToAdd;
      }

      // If still not full, try neighboring zones
      if (remainingSpace > 0.1) {
        for (const neighborZone of neighboringZones) {
          if (remainingSpace < 0.1) break;

          const neighborProducts = productsByZone[neighborZone]
            .filter((p) => !shelf.products.some((sp) => sp.id === p.id))
            .sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));

          for (const product of neighborProducts) {
            if (remainingSpace < 0.1) break;

            const productShare = product.share || 15;
            const spaceToAdd = Math.min(productShare, remainingSpace);

            shelf.products.push({
              id: product.id,
              name: product.name,
              share: spaceToAdd,
              zone: product.zone,
              giro: product.giro,
              margem: product.margem,
              isComplementary: true,
            });

            remainingSpace -= spaceToAdd;
            currentUtilization += spaceToAdd;
          }
        }
      }

      shelf.utilizationPercent = Math.min(currentUtilization, 100);
    }
  });

  // Calculate total utilization
  const totalUtilizationPercent = shelves.length > 0
    ? shelves.reduce((sum, s) => sum + s.utilizationPercent, 0) / shelves.length
    : 0;

  return {
    shelves,
    totalUtilizationPercent,
  };
}
