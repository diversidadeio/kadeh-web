/**
 * GondolaRealisticView Component
 * 
 * Visualização realista da gôndola em HTML/CSS com fidelidade 100%
 * Usa EXATAMENTE a mesma lógica de distribuição do GondolaFrontViewIntelligent
 * 
 * Estilo: Gôndola metálica de supermercado com perspectiva frontal,
 * prateleiras com profundidade, produtos com cores distintas por marca,
 * etiquetas de preço/nome, iluminação simulada.
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

interface GondolaRealisticViewProps {
  products: Product[];
  totalWidth?: number;
  numberOfShelves?: number;
  language?: 'pt' | 'en';
}

// ============================================================
// EXACT SAME DISTRIBUTION LOGIC AS GondolaFrontViewIntelligent
// ============================================================

function getShelvesForZone(zone: string, totalShelves: number): number[] {
  const bottomCount = 2;
  const handCount = 2;
  const eyeCount = totalShelves - bottomCount - handCount;

  if (zone === "Parte de Baixo") {
    return Array.from({ length: bottomCount }, (_, i) => i + 1);
  } else if (zone === "Altura das mãos") {
    return Array.from({ length: handCount }, (_, i) => bottomCount + i + 1);
  } else {
    return Array.from({ length: Math.max(eyeCount, 0) }, (_, i) => bottomCount + handCount + i + 1);
  }
}

function getZoneForShelf(shelfNumber: number, totalShelves: number): string {
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

function distributeProductsToShelves(
  products: Product[],
  totalShelves: number
): Map<number, Product[]> {
  const distribution = new Map<number, Product[]>();

  for (let i = 1; i <= totalShelves; i++) {
    distribution.set(i, []);
  }

  if (products.length === 0) {
    return distribution;
  }

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

  Object.keys(productsByZone).forEach((zone) => {
    productsByZone[zone].sort((a, b) => (b.share || 0) - (a.share || 0));
  });

  Object.keys(productsByZone).forEach((zone) => {
    const shelvesInZone = getShelvesForZone(zone, totalShelves);
    const productsInZone = productsByZone[zone];

    shelvesInZone.forEach((shelfNumber) => {
      const shelf = distribution.get(shelfNumber) || [];
      productsInZone.forEach((product) => {
        shelf.push(product);
      });
      distribution.set(shelfNumber, shelf);
    });
  });

  distribution.forEach((shelfProducts, shelfNumber) => {
    const zone = getZoneForShelf(shelfNumber, totalShelves);
    const totalShare = shelfProducts.reduce((sum, p) => sum + (p.share || 0), 0);

    if (totalShare < 99.9) {
      let remainingSpace = 100 - totalShare;

      const neighboringZones = zone === "Altura das mãos"
        ? ["Altura dos olhos", "Parte de Baixo"]
        : zone === "Altura dos olhos"
        ? ["Altura das mãos"]
        : ["Altura das mãos"];

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

// ============================================================
// COLOR GENERATION - Distinct colors for each product
// ============================================================

const PRODUCT_COLORS = [
  { bg: '#E53E3E', text: '#fff', accent: '#C53030' },  // Red
  { bg: '#3182CE', text: '#fff', accent: '#2B6CB0' },  // Blue
  { bg: '#38A169', text: '#fff', accent: '#2F855A' },  // Green
  { bg: '#D69E2E', text: '#fff', accent: '#B7791F' },  // Yellow
  { bg: '#805AD5', text: '#fff', accent: '#6B46C1' },  // Purple
  { bg: '#DD6B20', text: '#fff', accent: '#C05621' },  // Orange
  { bg: '#E53E8C', text: '#fff', accent: '#B83280' },  // Pink
  { bg: '#319795', text: '#fff', accent: '#2C7A7B' },  // Teal
  { bg: '#718096', text: '#fff', accent: '#4A5568' },  // Gray
  { bg: '#9F7AEA', text: '#fff', accent: '#805AD5' },  // Light Purple
  { bg: '#ED8936', text: '#fff', accent: '#DD6B20' },  // Light Orange
  { bg: '#48BB78', text: '#fff', accent: '#38A169' },  // Light Green
  { bg: '#4299E1', text: '#fff', accent: '#3182CE' },  // Light Blue
  { bg: '#FC8181', text: '#fff', accent: '#F56565' },  // Light Red
  { bg: '#F6AD55', text: '#fff', accent: '#ED8936' },  // Peach
];

function getProductColor(productName: string, allProducts: string[]) {
  const index = allProducts.indexOf(productName);
  return PRODUCT_COLORS[index % PRODUCT_COLORS.length];
}

// ============================================================
// REALISTIC SHELF RENDERING
// ============================================================

function RealisticProduct({
  product,
  widthPercent,
  color,
  shelfHeight,
}: {
  product: Product;
  widthPercent: number;
  color: { bg: string; text: string; accent: string };
  shelfHeight: number;
}) {
  const share = product.share || 0;
  // Number of "facing" units based on share proportion
  const facings = Math.max(1, Math.round(share / 8));
  
  return (
    <div
      style={{
        width: `${widthPercent}%`,
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '2px 1px',
        position: 'relative',
      }}
      title={`${product.name} - ${share.toFixed(1)}%`}
    >
      {/* Product packages */}
      <div
        style={{
          width: '100%',
          height: `${Math.min(95, Math.max(60, shelfHeight - 10))}%`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '1px',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: facings }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: '1 1 0',
              maxWidth: `${100 / facings}%`,
              height: '100%',
              background: `linear-gradient(135deg, ${color.bg} 0%, ${color.accent} 100%)`,
              borderRadius: '2px 2px 0 0',
              border: `1px solid ${color.accent}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '8px',
              boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)`,
            }}
          >
            {/* Product label */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                padding: '1px 2px',
                borderRadius: '1px',
                maxWidth: '95%',
                textAlign: 'center',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <span
                style={{
                  fontSize: '7px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  display: 'block',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {product.name.length > 12 ? product.name.substring(0, 12) + '…' : product.name}
              </span>
            </div>
            {/* Shine effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '40%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Price tag / label below */}
      <div
        style={{
          position: 'absolute',
          bottom: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '2px',
          padding: '1px 4px',
          whiteSpace: 'nowrap',
          zIndex: 5,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        <span style={{ fontSize: '7px', fontWeight: 600, color: '#333' }}>
          {product.name.length > 15 ? product.name.substring(0, 15) + '…' : product.name}
        </span>
        <span style={{ fontSize: '6px', color: '#666', marginLeft: '3px' }}>
          {share.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function RealisticShelf({
  shelfNumber,
  zone,
  productsInShelf,
  shelfHeight,
  allProductNames,
  totalShelves,
  language,
}: {
  shelfNumber: number;
  zone: string;
  productsInShelf: Product[];
  shelfHeight: number;
  allProductNames: string[];
  totalShelves: number;
  language: string;
}) {
  const totalShare = productsInShelf.reduce((sum, p) => sum + (p.share || 0), 0);
  
  // Normalize shares to fill the shelf
  const normalizedProducts = productsInShelf.map((p) => ({
    ...p,
    normalizedShare: totalShare > 0 ? ((p.share || 0) / totalShare) * 100 : 0,
  }));

  // Zone indicator colors
  const zoneIndicator = zone === 'Altura dos olhos' 
    ? { color: '#FBBF24', label: language === 'pt' ? 'Olhos' : 'Eye' }
    : zone === 'Altura das mãos'
    ? { color: '#3B82F6', label: language === 'pt' ? 'Mãos' : 'Hand' }
    : { color: '#22C55E', label: language === 'pt' ? 'Baixo' : 'Low' };

  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      {/* Shelf number label on the left */}
      <div
        style={{
          position: 'absolute',
          left: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: zoneIndicator.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          {shelfNumber}
        </div>
        <span style={{ fontSize: '7px', color: '#666', fontWeight: 500 }}>
          {zoneIndicator.label}
        </span>
      </div>

      {/* Shelf surface with products */}
      <div
        style={{
          height: `${shelfHeight}px`,
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative',
          paddingBottom: '4px',
        }}
      >
        {normalizedProducts.length > 0 ? (
          normalizedProducts.map((product, idx) => (
            <RealisticProduct
              key={`${product.id}-${idx}`}
              product={product}
              widthPercent={product.normalizedShare}
              color={getProductColor(product.name, allProductNames)}
              shelfHeight={shelfHeight}
            />
          ))
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '11px',
            }}
          >
            {language === 'pt' ? 'Sem produtos' : 'No products'}
          </div>
        )}
      </div>

      {/* Metal shelf plate */}
      <div
        style={{
          height: '6px',
          background: 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 30%, #6b7280 70%, #4b5563 100%)',
          borderRadius: '0 0 2px 2px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      />
      
      {/* Shelf bracket shadows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <div
          style={{
            width: '8px',
            height: '12px',
            background: 'linear-gradient(180deg, #6b7280 0%, transparent 100%)',
            borderRadius: '0 0 2px 2px',
          }}
        />
        <div
          style={{
            width: '8px',
            height: '12px',
            background: 'linear-gradient(180deg, #6b7280 0%, transparent 100%)',
            borderRadius: '0 0 2px 2px',
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function GondolaRealisticView({
  products,
  totalWidth = 280,
  numberOfShelves = 5,
  language = 'pt',
}: GondolaRealisticViewProps) {
  if (products.length === 0) {
    return null;
  }

  const distribution = distributeProductsToShelves(products, numberOfShelves);
  
  // Get all unique product names for consistent color assignment
  const allProductNames = Array.from(new Set(products.map(p => p.name)));

  // Calculate shelf height based on number of shelves
  const shelfHeight = Math.max(50, Math.min(80, 400 / numberOfShelves));

  // Build shelves from top to bottom (highest number = top)
  const shelves: React.ReactNode[] = [];
  for (let i = numberOfShelves; i >= 1; i--) {
    const shelfProducts = distribution.get(i) || [];
    const zone = getZoneForShelf(i, numberOfShelves);

    shelves.push(
      <RealisticShelf
        key={`shelf-${i}`}
        shelfNumber={i}
        zone={zone}
        productsInShelf={shelfProducts}
        shelfHeight={shelfHeight}
        allProductNames={allProductNames}
        totalShelves={numberOfShelves}
        language={language}
      />
    );
  }

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-foreground">
          {language === 'pt' ? 'Visualização Realista da Gôndola' : 'Realistic Gondola View'}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {language === 'pt'
          ? 'Representação fiel da gôndola com produtos posicionados conforme a simulação'
          : 'Faithful gondola representation with products positioned according to the simulation'}
      </p>

      {/* Gondola frame */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)',
          borderRadius: '8px',
          padding: '20px 20px 30px 60px',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
          border: '2px solid #9ca3af',
          overflow: 'visible',
        }}
      >
        {/* Top header bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(180deg, #4b5563 0%, #6b7280 100%)',
            borderRadius: '6px 6px 0 0',
          }}
        />

        {/* Category label */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '16px',
            marginTop: '4px',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '3px 16px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
            }}
          >
            {products[0]?.name ? (products[0].name.split(' ')[0] || 'Produtos') : 'Produtos'}
          </span>
        </div>

        {/* Shelves */}
        {shelves}

        {/* Base/floor */}
        <div
          style={{
            height: '10px',
            background: 'linear-gradient(180deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
            borderRadius: '0 0 4px 4px',
            marginTop: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />

        {/* Left vertical rail */}
        <div
          style={{
            position: 'absolute',
            left: '48px',
            top: '8px',
            bottom: '0',
            width: '4px',
            background: 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 50%, #9ca3af 100%)',
          }}
        />

        {/* Right vertical rail */}
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '8px',
            bottom: '0',
            width: '4px',
            background: 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 50%, #9ca3af 100%)',
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {allProductNames.map((name, idx) => {
          const color = getProductColor(name, allProductNames);
          return (
            <div key={name} className="flex items-center gap-1.5">
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  background: `linear-gradient(135deg, ${color.bg} 0%, ${color.accent} 100%)`,
                  border: `1px solid ${color.accent}`,
                }}
              />
              <span className="text-xs text-muted-foreground font-medium">{name}</span>
            </div>
          );
        })}
      </div>

      {/* Zone legend */}
      <div className="mt-3 flex gap-4 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
          <span>{language === 'pt' ? 'Altura dos olhos' : 'Eye Level'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
          <span>{language === 'pt' ? 'Altura das mãos' : 'Hand Level'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
          <span>{language === 'pt' ? 'Parte de Baixo' : 'Bottom'}</span>
        </div>
      </div>
    </div>
  );
}
