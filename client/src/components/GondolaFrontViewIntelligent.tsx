/**
 * Intelligent Gondola Front View Component
 * 
 * Distribution logic:
 * - Each product's share% represents its TOTAL space across ALL shelves
 * - Products are placed starting from their primary zone shelves
 * - If primary zone is full, overflow to adjacent zones
 * - Each shelf has 100% capacity
 * - Total gondola capacity = numberOfShelves × 100%
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

type ZoneName = 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';

/**
 * Gets the zone for a specific shelf number
 */
function getZoneForShelf(shelfNumber: number, totalShelves: number): ZoneName {
  const bottomCount = Math.max(1, Math.floor(totalShelves * 0.3));
  const handCount = Math.max(1, Math.floor(totalShelves * 0.3));

  if (shelfNumber <= bottomCount) {
    return "Parte de Baixo";
  } else if (shelfNumber <= bottomCount + handCount) {
    return "Altura das mãos";
  } else {
    return "Altura dos olhos";
  }
}

/**
 * Gets the ordered list of shelves for a zone, from highest to lowest
 */
function getShelvesForZone(zone: ZoneName, totalShelves: number): number[] {
  const shelves: number[] = [];
  for (let i = totalShelves; i >= 1; i--) {
    if (getZoneForShelf(i, totalShelves) === zone) {
      shelves.push(i);
    }
  }
  return shelves;
}

/**
 * Gets overflow zones for a given zone (priority order)
 */
function getOverflowZones(zone: ZoneName): ZoneName[] {
  switch (zone) {
    case "Altura dos olhos":
      return ["Altura das mãos", "Parte de Baixo"];
    case "Altura das mãos":
      return ["Altura dos olhos", "Parte de Baixo"];
    case "Parte de Baixo":
      return ["Altura das mãos", "Altura dos olhos"];
  }
}

interface ShelfSlot {
  productId: string;
  productName: string;
  widthPercent: number; // percentage of this shelf (0-100)
  product: Product;
}

/**
 * DISTRIBUTION ALGORITHM (v4) - Proportional per-shelf distribution
 * 
 * Each product's share% represents its proportion of EACH shelf in its zone.
 * Products are placed on their primary zone shelves first.
 * If a zone has more products than fit, they proportionally scale down
 * and overflow to adjacent zones.
 * 
 * This ensures:
 * - Products from each zone always appear on their zone's shelves
 * - No zone is completely displaced by overflow from another zone
 * - Proportions are maintained within each shelf
 */
function distributeProductsToShelves(
  products: Product[],
  totalShelves: number
): Map<number, ShelfSlot[]> {
  const distribution = new Map<number, ShelfSlot[]>();

  // Initialize shelves
  for (let i = 1; i <= totalShelves; i++) {
    distribution.set(i, []);
  }

  if (products.length === 0) {
    return distribution;
  }

  // Group products by zone
  const productsByZone: Record<ZoneName, Product[]> = {
    "Altura dos olhos": [],
    "Altura das mãos": [],
    "Parte de Baixo": [],
  };

  products.forEach((p) => {
    const zone = (p.zone || p.zona || "Altura das mãos") as ZoneName;
    if (zone in productsByZone) {
      productsByZone[zone].push(p);
    }
  });

  // Sort products by share descending within each zone
  Object.keys(productsByZone).forEach((zone) => {
    productsByZone[zone as ZoneName].sort((a, b) => (b.share || 0) - (a.share || 0));
  });

  const zoneOrder: ZoneName[] = ["Altura dos olhos", "Altura das mãos", "Parte de Baixo"];

  // For each zone, place its products on its shelves proportionally
  for (const zone of zoneOrder) {
    const productsInZone = productsByZone[zone];
    if (productsInZone.length === 0) continue;

    const zoneShelves = getShelvesForZone(zone, totalShelves);

    // Calculate total share for this zone's products
    const totalShare = productsInZone.reduce((sum, p) => sum + (p.share || 0), 0);
    if (totalShare <= 0) continue;

    // Place products on each shelf of this zone
    // Each product gets its proportional share of the shelf width (100%)
    for (const shelfNum of zoneShelves) {
      for (const product of productsInZone) {
        const productShare = product.share || 0;
        if (productShare <= 0) continue;

        // Product's width on this shelf = its share relative to total zone share
        // Scaled to fill 100% of the shelf
        const widthPercent = (productShare / totalShare) * 100;

        const slots = distribution.get(shelfNum) || [];
        slots.push({
          productId: product.id,
          productName: product.name,
          widthPercent: widthPercent,
          product: product,
        });
        distribution.set(shelfNum, slots);
      }
    }
  }

  return distribution;
}

/**
 * Renders a single product slot in a shelf
 */
function renderProductSlot(
  slot: ShelfSlot,
  zoneColor: any,
  language: string,
  key: string
) {
  const displayValue = `${slot.widthPercent.toFixed(1)}%`;

  return (
    <div
      key={key}
      className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 p-2 overflow-hidden transition-all hover:opacity-80"
      style={{
        width: `${slot.widthPercent}%`,
        backgroundColor: zoneColor.bg,
        minWidth: slot.widthPercent > 5 ? '30px' : '20px',
      }}
      title={`${slot.productName} - ${slot.product.share?.toFixed(1)}% total`}
    >
      <span className="text-xs font-bold text-gray-800 text-center truncate line-clamp-2">
        {slot.productName}
      </span>
      <span className="text-xs text-gray-600 font-semibold">
        {displayValue}
      </span>
    </div>
  );
}

/**
 * Renders a shelf with product slots
 */
function renderShelf(
  slots: ShelfSlot[],
  zoneColor: any,
  language: string,
  shelfNumber: number
) {
  if (slots.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
        {language === 'pt' ? 'Sem produtos' : 'No products'}
      </div>
    );
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      {slots.map((slot, idx) =>
        renderProductSlot(slot, zoneColor, language, `shelf-${shelfNumber}-slot-${idx}`)
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
  slots: ShelfSlot[],
  shelfHeight: number,
  colors: any,
  language: string
) {
  const zoneColor = colors[zone as keyof typeof colors];

  // Calculate utilization
  const totalUsed = slots.reduce((sum, s) => sum + s.widthPercent, 0);
  const utilizationPercent = Math.min(totalUsed, 100);

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
        {renderShelf(slots, zoneColor, language, shelfNumber)}
      </div>
    </div>
  );
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

  // DEBUG: Log distribution
  console.log('[GondolaFrontViewIntelligent] Products received FULL:', JSON.stringify(products.map(p => ({ name: p.name, zone: p.zone, zona: p.zona, share: p.share, allKeys: Object.keys(p) }))));
  console.log('[GondolaFrontViewIntelligent] Distribution:');
  for (let i = numberOfShelves; i >= 1; i--) {
    const slots = distribution.get(i) || [];
    const zone = getZoneForShelf(i, numberOfShelves);
    console.log(`  Shelf ${i} (${zone}):`, slots.map(s => `${s.productName} ${s.widthPercent.toFixed(1)}%`));
  }

  // Render shelves in reverse order (top to bottom: highest shelf first)
  const shelves: React.ReactNode[] = [];
  for (let i = numberOfShelves; i >= 1; i--) {
    const slots = distribution.get(i) || [];
    const zone = getZoneForShelf(i, numberOfShelves);

    shelves.push(
      renderShelfSection(i, zone, slots, shelfHeight, colors, language)
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
