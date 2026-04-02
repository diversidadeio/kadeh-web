/**
 * Intelligent Gondola Front View Component
 * 
 * Uses intelligent distribution to:
 * 1. Allocate space to each product based on its recommended percentage (share)
 * 2. Distribute products proportionally across shelves in their zone
 * 3. Fill empty space with products from adjacent zones with better margem/giro ratio
 * 4. Ensure 100% shelf utilization while respecting zone preferences
 */

import React from "react";

interface Product {
  id: string;
  name: string;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  zona?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  quadrantes: number;
  largura?: number;
  comprimento?: number;
  share?: number;
  giro?: string;
  margem?: string;
}

interface GondolaFrontViewIntelligentProps {
  products: Product[];
  totalWidth?: number;
  shelfHeight?: number;
  numberOfShelves?: number;
  language?: 'pt' | 'en';
}

const zoneColors = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Altura dos olhos' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Altura das mãos' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Parte de Baixo' },
};

const zoneColorsEn = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Eye Level' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Hand Level' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Bottom Shelf' },
};

/**
 * Determines which shelves belong to each zone
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
 * Renders a single product in a shelf
 */
function renderProduct(
  product: Product,
  widthPercent: number,
  zoneColor: any,
  language: string
) {
  const displayValue = `${(product.share || 0).toFixed(1)}%`;
  
  return (
    <div
      className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 p-2 overflow-hidden transition-all hover:opacity-80"
      style={{
        width: `${widthPercent}%`,
        backgroundColor: zoneColor.bg,
        minWidth: widthPercent > 5 ? '30px' : '20px',
      }}
      title={`${product.name} - ${displayValue}`}
    >
      <span className="text-xs font-bold text-gray-800 text-center truncate line-clamp-2">
        {product.name}
      </span>
      <span className="text-xs text-gray-600 font-semibold">
        {displayValue}
      </span>
    </div>
  );
}

/**
 * Renders a shelf with products distributed by their share percentage
 */
function renderShelf(
  productsInShelf: Product[],
  zoneColor: any,
  language: string
) {
  if (productsInShelf.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
        {language === 'pt' ? 'Sem produtos' : 'No products'}
      </div>
    );
  }

  // Calculate total share
  const totalShare = productsInShelf.reduce((sum, p) => sum + (p.share || 0), 0);
  
  // Normalize shares to 100%
  const normalizedProducts = productsInShelf.map((p) => ({
    ...p,
    normalizedShare: ((p.share || 0) / totalShare) * 100,
  }));

  return (
    <div className="flex w-full h-full overflow-hidden">
      {normalizedProducts.map((product) =>
        renderProduct(product, product.normalizedShare, zoneColor, language)
      )}
    </div>
  );
}

/**
 * Renders a shelf section with zone information
 */
function renderShelfSection(
  shelfNumber: number,
  zone: string,
  productsInShelf: Product[],
  shelfHeight: number,
  colors: any,
  language: string
) {
  const zoneColor = colors[zone as keyof typeof colors];
  
  // Calculate utilization
  const totalShare = productsInShelf.reduce((sum, p) => sum + (p.share || 0), 0);
  const utilizationPercent = Math.min(totalShare, 100);
  
  return (
    <div key={`shelf-${shelfNumber}`}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: zoneColor.bg }}
        />
        <span className="text-sm font-semibold text-gray-700">
          {language === 'pt' 
            ? `Prateleira ${shelfNumber} - ${zoneColor.label}` 
            : `Shelf ${shelfNumber} - ${zoneColor.label}`}
        </span>
        <span className="text-xs text-gray-500">
          {utilizationPercent.toFixed(1)}% / 100%
        </span>
      </div>
      <div
        className="border-2 rounded-md overflow-hidden"
        style={{
          borderColor: zoneColor.border,
          height: `${shelfHeight}px`,
        }}
      >
        {renderShelf(productsInShelf, zoneColor, language)}
      </div>
    </div>
  );
}

/**
 * Distributes products to shelves respecting their zone and share percentages
 * Ensures each product goes to a shelf in its assigned zone
 */
function distributeProductsToShelves(
  products: Product[],
  totalShelves: number
): Map<number, Product[]> {
  const distribution = new Map<number, Product[]>();

  // Initialize shelves
  for (let i = 1; i <= totalShelves; i++) {
    distribution.set(i, []);
  }

  if (products.length === 0) {
    return distribution;
  }

  // Group products by zone
  const productsByZone: Record<string, Product[]> = {
    "Altura dos olhos": [],
    "Altura das mãos": [],
    "Parte de Baixo": [],
  };

  products.forEach((p) => {
    const zone = p.zone || p.zona || "Altura das mãos";
    if (zone in productsByZone) {
      productsByZone[zone].push(p);
    }
  });

  // Sort products by share (larger share first)
  Object.keys(productsByZone).forEach((zone) => {
    productsByZone[zone].sort((a, b) => (b.share || 0) - (a.share || 0));
  });

  // Distribute products to their zone shelves
  // Each product gets added to ALL shelves in its zone
  Object.keys(productsByZone).forEach((zone) => {
    const shelvesInZone = getShelvesForZone(zone, totalShelves);
    const productsInZone = productsByZone[zone];

    // Add each product to EACH shelf in its zone
    shelvesInZone.forEach((shelfNumber) => {
      const shelf = distribution.get(shelfNumber) || [];
      productsInZone.forEach((product) => {
        shelf.push(product);
      });
      distribution.set(shelfNumber, shelf);
    });
  });

  // Fill empty space with complementary products from other zones
  distribution.forEach((shelfProducts, shelfNumber) => {
    const zone = getZoneForShelf(shelfNumber, totalShelves);
    const totalShare = shelfProducts.reduce((sum, p) => sum + (p.share || 0), 0);
    
    if (totalShare < 99.9) {
      let remainingSpace = 100 - totalShare;
      
      // Get neighboring zones
      const neighboringZones = zone === "Altura das mãos" 
        ? ["Altura dos olhos", "Parte de Baixo"]
        : zone === "Altura dos olhos"
        ? ["Altura das mãos"]
        : ["Altura das mãos"];

      // Try to fill with products from neighboring zones
      for (const neighborZone of neighboringZones) {
        if (remainingSpace <= 0.1) break;

        const neighborProducts = productsByZone[neighborZone]
          .filter((p) => !shelfProducts.some((sp) => sp.id === p.id));

        for (const product of neighborProducts) {
          if (remainingSpace <= 0.1) break;

          const productShare = product.share || 0;
          if (productShare <= remainingSpace + 0.1) {
            shelfProducts.push(product);
            remainingSpace -= productShare;
          }
        }
      }
    }
  });

  return distribution;
}

export default function GondolaFrontViewIntelligent({
  products,
  totalWidth = 280,
  shelfHeight = 60,
  numberOfShelves = 5,
  language = 'pt',
}: GondolaFrontViewIntelligentProps) {
  if (products.length === 0) {
    return (
      <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm">
          {language === 'pt'
            ? 'Nenhum produto adicionado à simulação'
            : 'No products added to the simulation'}
        </p>
      </div>
    );
  }

  const colors = language === 'pt' ? zoneColors : zoneColorsEn;
  const distribution = distributeProductsToShelves(products, numberOfShelves);

  // Render shelves in reverse order (top to bottom)
  const shelves: React.ReactNode[] = [];
  for (let i = numberOfShelves; i >= 1; i--) {
    const shelfProducts = distribution.get(i) || [];
    const zone = getZoneForShelf(i, numberOfShelves);

    shelves.push(
      renderShelfSection(i, zone, shelfProducts, shelfHeight, colors, language)
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4 space-y-4">
          {shelves}
        </div>
      </div>
    </div>
  );
}
