/**
 * Shelf Distributor Utility
 * Distributes products across shelves respecting zones, widths, and shelf count
 */

export interface ProductForDistribution {
  id: string;
  name: string;
  largura: number; // width in cm
  comprimento: number; // depth in cm
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
}

export interface ShelfDistribution {
  shelfNumber: number;
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  products: ProductForDistribution[];
  usedWidth: number;
  availableWidth: number;
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
 * Distributes products across shelves respecting zones and widths
 * @param products - Array of products to distribute
 * @param gondolaWidth - Total width of gondola in cm
 * @param totalShelves - Total number of shelves
 * @returns Distribution of products across shelves
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
    });
  }

  // Sort products by zone priority (Eye level > Hand level > Bottom)
  const zoneOrder = { "Altura dos olhos": 0, "Altura das mãos": 1, "Parte de Baixo": 2 };
  const sortedProducts = [...products].sort(
    (a, b) => zoneOrder[a.zone as keyof typeof zoneOrder] - zoneOrder[b.zone as keyof typeof zoneOrder]
  );

  // Distribute products
  for (const product of sortedProducts) {
    const targetShelves = getShelvesForZone(product.zone, totalShelves);

    // Try to fit product on one of the target shelves
    let placed = false;
    for (const shelfNum of targetShelves) {
      const shelf = shelves[shelfNum - 1];
      if (shelf && shelf.usedWidth + product.largura <= gondolaWidth) {
        shelf.products.push(product);
        shelf.usedWidth += product.largura;
        placed = true;
        break;
      }
    }

    // If not placed on target shelf, try any available shelf
    if (!placed) {
      for (const shelf of shelves) {
        if (shelf.usedWidth + product.largura <= gondolaWidth) {
          shelf.products.push(product);
          shelf.usedWidth += product.largura;
          placed = true;
          break;
        }
      }
    }
  }

  // Calculate totals
  const totalUsedWidth = shelves.reduce((sum, shelf) => sum + shelf.usedWidth, 0);
  const totalAvailableWidth = gondolaWidth * totalShelves;
  const utilizationPercentage = (totalUsedWidth / totalAvailableWidth) * 100;

  return {
    shelves,
    totalUsedWidth,
    totalAvailableWidth,
    totalProducts: products.length,
    utilizationPercentage,
  };
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
    },
    en: {
      shelf: "Shelf",
      products: "products",
      zone: "Zone",
      width: "Used width",
      utilization: "Utilization",
      total: "Total",
    },
  };

  const t = translations[language];
  let description = `${t.total}: ${distribution.totalProducts} ${t.products}\n`;
  description += `${t.utilization}: ${distribution.utilizationPercentage.toFixed(1)}%\n\n`;

  for (const shelf of distribution.shelves) {
    if (shelf.products.length > 0) {
      description += `${t.shelf} ${shelf.shelfNumber} (${shelf.zone}): ${shelf.products.length} ${t.products}, ${shelf.usedWidth}cm/${distribution.shelves[0].availableWidth}cm\n`;
    }
  }

  return description;
}
