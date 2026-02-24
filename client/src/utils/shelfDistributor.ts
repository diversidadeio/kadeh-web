/**
 * Shelf Distributor Utility
 * Distributes products across shelves respecting zones, widths, and shelf count
 * Fills 100% of each shelf by repeating product fronts proportionally to their share
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
 * @param zone - Product zone (Altura dos olhos, Altura das mãos, Parte de Baixo)
 * @param totalShelves - Total number of shelves in the gondola
 * @returns Array of shelf numbers where this zone should be placed
 */
export function getShelvesForZone(zone: string, totalShelves: number): number[] {
  if (totalShelves === 1) return [1];
  if (totalShelves === 2) {
    // 2 shelves: Eye level (top), Bottom
    return zone === "Altura dos olhos" ? [1] : [2];
  }
  if (totalShelves === 3) {
    // 3 shelves: Eye level (middle), Hand level (top/bottom), Bottom
    return zone === "Altura dos olhos" ? [2] : zone === "Altura das mãos" ? [1, 3] : [3];
  }
  if (totalShelves === 4) {
    // 4 shelves: Eye level (2nd), Hand level (1st/3rd), Bottom (4th)
    return zone === "Altura dos olhos" ? [2] : zone === "Altura das mãos" ? [1, 3] : [4];
  }
  if (totalShelves === 5) {
    // 5 shelves: Eye level (2nd/3rd), Hand level (1st/4th), Bottom (5th)
    return zone === "Altura dos olhos" ? [2, 3] : zone === "Altura das mãos" ? [1, 4] : [5];
  }

  // For 6+ shelves: Eye level (middle 2), Hand level (surrounding), Bottom
  const middleStart = Math.floor(totalShelves / 2) - 1;
  const middleEnd = Math.ceil(totalShelves / 2);

  if (zone === "Altura dos olhos") {
    return [middleStart, middleEnd];
  } else if (zone === "Altura das mãos") {
    const result: number[] = [];
    if (middleStart > 1) result.push(middleStart - 1);
    if (middleEnd < totalShelves) result.push(middleEnd + 1);
    return result.length > 0 ? result : [1, totalShelves];
  } else {
    return [totalShelves];
  }
}

/**
 * Gets the zone for a specific shelf number
 * @param shelfNumber - Shelf number (1-indexed)
 * @param totalShelves - Total number of shelves
 * @returns Zone name
 */
function getZoneForShelf(shelfNumber: number, totalShelves: number): "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo" {
  if (totalShelves === 1) return "Altura dos olhos";
  if (totalShelves === 2) {
    return shelfNumber === 1 ? "Altura dos olhos" : "Parte de Baixo";
  }
  if (totalShelves === 3) {
    if (shelfNumber === 2) return "Altura dos olhos";
    if (shelfNumber === 1 || shelfNumber === 3) return "Altura das mãos";
    return "Parte de Baixo";
  }
  if (totalShelves === 4) {
    if (shelfNumber === 2) return "Altura dos olhos";
    if (shelfNumber === 1 || shelfNumber === 3) return "Altura das mãos";
    return "Parte de Baixo";
  }
  if (totalShelves === 5) {
    if (shelfNumber === 2 || shelfNumber === 3) return "Altura dos olhos";
    if (shelfNumber === 1 || shelfNumber === 4) return "Altura das mãos";
    return "Parte de Baixo";
  }

  // For 6+ shelves
  const middleStart = Math.floor(totalShelves / 2);
  const middleEnd = Math.ceil(totalShelves / 2);

  if (shelfNumber === middleStart || shelfNumber === middleEnd) {
    return "Altura dos olhos";
  } else if (shelfNumber === middleStart - 1 || shelfNumber === middleEnd + 1) {
    return "Altura das mãos";
  } else {
    return "Parte de Baixo";
  }
}

/**
 * Distributes products across shelves filling 100% of each shelf by repeating fronts.
 *
 * Algorithm:
 * 1. Group products by zone
 * 2. For each zone, normalize shares to sum to 100% within that zone
 * 3. Allocate space proportionally: allocatedWidth = (normalizedShare / 100) * gondolaWidth
 * 4. Calculate fronts: fronts = Math.max(1, Math.floor(allocatedWidth / product.largura))
 * 5. Adjust last product to fill remaining space (100% utilization)
 *
 * @param products - Array of products to distribute
 * @param gondolaWidth - Total width of gondola in cm
 * @param totalShelves - Total number of shelves
 * @returns Distribution of products across shelves with 100% fill
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

    // Distribute products evenly across the zone's shelves
    // Each shelf in the zone gets the same set of products (same layout)
    // but the products are split proportionally
    const productsPerShelf = Math.ceil(normalizedProducts.length / targetShelfNumbers.length);

    targetShelfNumbers.forEach((shelfNum, shelfIdx) => {
      const shelfRef = shelves[shelfNum - 1];
      if (!shelfRef) return;

      // Determine which products go on this shelf
      const startIdx = shelfIdx * productsPerShelf;
      const endIdx = Math.min(startIdx + productsPerShelf, normalizedProducts.length);
      const shelfProducts = normalizedProducts.slice(startIdx, endIdx);

      if (shelfProducts.length === 0) return;

      // Re-normalize shares for products on this specific shelf
      const shelfTotalShare = shelfProducts.reduce((sum, p) => sum + p.normalizedShare, 0);

      // Calculate fronts for each product to fill 100% of shelf width
      let usedWidth = 0;
      const shelfProductEntries: ShelfProduct[] = [];

      shelfProducts.forEach((product, idx) => {
        const isLast = idx === shelfProducts.length - 1;
        const productShare = (product.normalizedShare / shelfTotalShare) * 100;

        // Calculate allocated width for this product
        const allocatedWidth = (productShare / 100) * gondolaWidth;

        // Calculate number of fronts (minimum 1)
        const productWidth = Math.max(product.largura, 1);
        let fronts = Math.max(1, Math.floor(allocatedWidth / productWidth));

        // For the last product, fill remaining space
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

      // Update shelf
      shelfRef.products = shelfProductEntries;
      shelfRef.usedWidth = usedWidth;
      shelfRef.utilizationPercent = gondolaWidth > 0 ? (usedWidth / gondolaWidth) * 100 : 0;
    });
  });

  // Calculate totals
  const totalUsedWidth = shelves.reduce((sum, shelf) => sum + shelf.usedWidth, 0);
  const totalAvailableWidth = gondolaWidth * totalShelves;
  const utilizationPercentage = totalAvailableWidth > 0 ? (totalUsedWidth / totalAvailableWidth) * 100 : 0;

  return {
    shelves,
    totalUsedWidth,
    totalAvailableWidth,
    totalProducts: products.length,
    utilizationPercentage,
  };
}

/**
 * Calculates the number of product fronts (frentes) that can fit on a shelf
 * @param products - Products on the shelf
 * @param gondolaWidth - Width of gondola in cm
 * @returns Number of fronts
 */
export function calculateFronts(products: ProductForDistribution[], gondolaWidth: number): number {
  if (products.length === 0) return 0;

  // Count how many products fit horizontally
  let fronts = 0;
  let currentWidth = 0;

  for (const product of products) {
    if (currentWidth + product.largura <= gondolaWidth) {
      fronts++;
      currentWidth += product.largura;
    }
  }

  return fronts;
}

/**
 * Generates a text description of the shelf distribution
 * @param distribution - Shelf distribution
 * @param language - Language (pt or en)
 * @returns Text description
 */
export function generateDistributionDescription(
  distribution: GondolaDistribution,
  language: "pt" | "en" = "pt"
): string {
  const translations = {
    pt: {
      shelf: "Prateleira",
      products: "produtos",
      zone: "Zona",
      width: "Largura utilizada",
      utilization: "Utilização",
      total: "Total",
      fronts: "frentes",
    },
    en: {
      shelf: "Shelf",
      products: "products",
      zone: "Zone",
      width: "Used width",
      utilization: "Utilization",
      total: "Total",
      fronts: "fronts",
    },
  };

  const t = translations[language];
  let description = `${t.total}: ${distribution.totalProducts} ${t.products}\n`;
  description += `${t.utilization}: ${distribution.utilizationPercentage.toFixed(1)}%\n\n`;

  for (const shelf of distribution.shelves) {
    if (shelf.products.length > 0) {
      const totalFronts = shelf.products.reduce((sum, p) => sum + p.fronts, 0);
      description += `${t.shelf} ${shelf.shelfNumber} (${shelf.zone}): ${shelf.products.length} ${t.products}, ${totalFronts} ${t.fronts}, ${shelf.usedWidth.toFixed(0)}cm/${shelf.availableWidth}cm (${shelf.utilizationPercent.toFixed(0)}%)\n`;
    }
  }

  return description;
}
