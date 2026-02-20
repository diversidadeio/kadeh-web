/**
 * Gondola Distribution Utility
 * Calculates product distribution across shelves and zones
 */

export interface ProductDistribution {
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  products: Array<{
    name: string;
    percentage: number;
    shelfPosition: number; // 0-indexed shelf number
    quantity: number;
  }>;
}

export interface ZonePercentages {
  eyeLevel: number;
  handLevel: number;
  bottomLevel: number;
}

/**
 * Calculate zone percentages based on products
 */
export function calculateZonePercentages(
  products: Array<{ zone: string; share?: number }>
): ZonePercentages {
  const totalShare = products.reduce((sum, p) => sum + (p.share || 0), 0);
  
  const eyeLevelProducts = products.filter(p => p.zone === 'Altura dos olhos');
  const handLevelProducts = products.filter(p => p.zone === 'Altura das mãos');
  const bottomLevelProducts = products.filter(p => p.zone === 'Parte de Baixo');

  const eyeLevelShare = eyeLevelProducts.reduce((sum, p) => sum + (p.share || 0), 0);
  const handLevelShare = handLevelProducts.reduce((sum, p) => sum + (p.share || 0), 0);
  const bottomLevelShare = bottomLevelProducts.reduce((sum, p) => sum + (p.share || 0), 0);

  return {
    eyeLevel: totalShare > 0 ? (eyeLevelShare / totalShare) * 100 : 0,
    handLevel: totalShare > 0 ? (handLevelShare / totalShare) * 100 : 0,
    bottomLevel: totalShare > 0 ? (bottomLevelShare / totalShare) * 100 : 0,
  };
}

/**
 * Distribute products across shelves based on zone and number of shelves
 */
export function distributeProductsAcrossShelves(
  products: Array<{ 
    id: string;
    name: string;
    zone: string;
    share?: number;
    quadrantes?: number;
  }>,
  numberOfShelves: number
): Map<number, Array<{ name: string; percentage: number; zone: string }>> {
  const distribution = new Map<number, Array<{ name: string; percentage: number; zone: string }>>();
  
  // Initialize shelves
  for (let i = 0; i < numberOfShelves; i++) {
    distribution.set(i, []);
  }

  // Zone to shelf mapping (considering typical retail layout)
  // Shelf 0 (top) = Altura dos olhos
  // Shelves 1-2 (middle) = Altura das mãos
  // Shelves 3+ (bottom) = Parte de Baixo
  
  const zoneToShelves: Record<string, number[]> = {
    'Altura dos olhos': [0],
    'Altura das mãos': numberOfShelves > 2 ? [1, 2] : [1],
    'Parte de Baixo': numberOfShelves > 3 ? Array.from({ length: numberOfShelves - 3 }, (_, i) => i + 3) : [numberOfShelves - 1],
  };

  // Group products by zone
  const productsByZone: Record<string, typeof products> = {
    'Altura dos olhos': [],
    'Altura das mãos': [],
    'Parte de Baixo': [],
  };

  products.forEach(p => {
    const zone = p.zone || 'Altura das mãos';
    if (zone in productsByZone) {
      productsByZone[zone].push(p);
    }
  });

  // Distribute products to shelves
  Object.entries(productsByZone).forEach(([zone, zoneProducts]) => {
    const shelves = zoneToShelves[zone] || [];
    const totalShare = zoneProducts.reduce((sum, p) => sum + (p.share || 0), 0);

    if (shelves.length > 0 && totalShare > 0) {
      // Distribute products evenly across shelves in this zone
      const productsPerShelf = Math.ceil(zoneProducts.length / shelves.length);
      
      shelves.forEach((shelfIndex, shelfPosition) => {
        const startIdx = shelfPosition * productsPerShelf;
        const endIdx = Math.min(startIdx + productsPerShelf, zoneProducts.length);
        const shelfProducts = zoneProducts.slice(startIdx, endIdx);

        const shelfShare = shelfProducts.reduce((sum, p) => sum + (p.share || 0), 0);
        
        shelfProducts.forEach(product => {
          const percentage = (product.share || 0) / shelfShare * 100;
          distribution.get(shelfIndex)?.push({
            name: product.name,
            percentage,
            zone,
          });
        });
      });
    }
  });

  return distribution;
}

/**
 * Generate detailed shelf description for AI prompt
 */
export function generateShelfDescription(
  products: Array<{ 
    id: string;
    name: string;
    zone: string;
    share?: number;
    category?: { name: string };
  }>,
  numberOfShelves: number,
  language: 'pt' | 'en' = 'pt'
): string {
  const distribution = distributeProductsAcrossShelves(products, numberOfShelves);
  const zonePercentages = calculateZonePercentages(products);

  const shelfDescriptions: string[] = [];
  
  for (let i = 0; i < numberOfShelves; i++) {
    const shelfProducts = distribution.get(i) || [];
    
    if (shelfProducts.length === 0) continue;

    const shelfName = i === 0 ? 'Top' : i === numberOfShelves - 1 ? 'Bottom' : `Middle (${i})`;
    const zoneLabel = shelfProducts[0]?.zone || 'Unknown';
    
    const productList = shelfProducts
      .map(p => `${p.name} (${p.percentage.toFixed(0)}%)`)
      .join(', ');

    if (language === 'pt') {
      shelfDescriptions.push(
        `**Prateleira ${i + 1} (${zoneLabel}):** ${productList}`
      );
    } else {
      shelfDescriptions.push(
        `**Shelf ${i + 1} (${zoneLabel}):** ${productList}`
      );
    }
  }

  // Add zone summary
  if (language === 'pt') {
    shelfDescriptions.push(
      `\n**Distribuição por Zona:**\n` +
      `- Altura dos Olhos: ${zonePercentages.eyeLevel.toFixed(1)}%\n` +
      `- Altura das Mãos: ${zonePercentages.handLevel.toFixed(1)}%\n` +
      `- Parte de Baixo: ${zonePercentages.bottomLevel.toFixed(1)}%`
    );
  } else {
    shelfDescriptions.push(
      `\n**Zone Distribution:**\n` +
      `- Eye Level: ${zonePercentages.eyeLevel.toFixed(1)}%\n` +
      `- Hand Level: ${zonePercentages.handLevel.toFixed(1)}%\n` +
      `- Bottom Shelf: ${zonePercentages.bottomLevel.toFixed(1)}%`
    );
  }

  return shelfDescriptions.join('\n');
}
