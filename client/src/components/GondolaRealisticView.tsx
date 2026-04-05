/**
 * GondolaRealisticView Component
 * 
 * Visualização realista da gôndola em HTML/CSS com fidelidade 100%
 * Usa EXATAMENTE a mesma lógica de distribuição do GondolaFrontViewIntelligent
 * 
 * Features:
 * - Estilo gôndola metálica 3D com perspectiva frontal
 * - Etiquetas de preço realistas simulando etiquetas de gôndola
 * - Modo de comparação lado a lado (antes/depois)
 * - Indicadores de zona por cor
 */

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, Save, X, RotateCcw } from "lucide-react";

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
  price?: number;
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
  { bg: '#E53E3E', text: '#fff', accent: '#C53030' },
  { bg: '#3182CE', text: '#fff', accent: '#2B6CB0' },
  { bg: '#38A169', text: '#fff', accent: '#2F855A' },
  { bg: '#D69E2E', text: '#fff', accent: '#B7791F' },
  { bg: '#805AD5', text: '#fff', accent: '#6B46C1' },
  { bg: '#DD6B20', text: '#fff', accent: '#C05621' },
  { bg: '#E53E8C', text: '#fff', accent: '#B83280' },
  { bg: '#319795', text: '#fff', accent: '#2C7A7B' },
  { bg: '#718096', text: '#fff', accent: '#4A5568' },
  { bg: '#9F7AEA', text: '#fff', accent: '#805AD5' },
  { bg: '#ED8936', text: '#fff', accent: '#DD6B20' },
  { bg: '#48BB78', text: '#fff', accent: '#38A169' },
  { bg: '#4299E1', text: '#fff', accent: '#3182CE' },
  { bg: '#FC8181', text: '#fff', accent: '#F56565' },
  { bg: '#F6AD55', text: '#fff', accent: '#ED8936' },
];

function getProductColor(productName: string, allProducts: string[]) {
  const index = allProducts.indexOf(productName);
  return PRODUCT_COLORS[index % PRODUCT_COLORS.length];
}

// ============================================================
// PRICE TAG COMPONENT - Simulates real gondola price labels
// ============================================================

function PriceTag({
  product,
  color,
  language,
}: {
  product: Product;
  color: { bg: string; text: string; accent: string };
  language: string;
}) {
  const share = product.share || 0;
  const giroLabel = product.giro === 'Alto' ? 'A' : product.giro === 'Medio' || product.giro === 'Média' ? 'M' : 'B';
  const margemLabel = product.margem === 'Alta' ? 'A' : product.margem === 'Media' || product.margem === 'Média' ? 'M' : 'B';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '-22px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        minWidth: '60px',
        maxWidth: '120px',
      }}
    >
      {/* Price tag body - simulates real supermarket shelf labels */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderBottom: `3px solid ${color.bg}`,
          borderRadius: '2px',
          padding: '2px 4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        {/* Product name */}
        <span
          style={{
            fontSize: '7px',
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '110px',
            display: 'block',
          }}
        >
          {product.name.length > 16 ? product.name.substring(0, 16) + '…' : product.name}
        </span>
        {/* Info row: share + giro/margem */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '1px',
          }}
        >
          <span
            style={{
              fontSize: '8px',
              fontWeight: 800,
              color: color.bg,
              lineHeight: 1,
            }}
          >
            {share.toFixed(1)}%
          </span>
          <span
            style={{
              fontSize: '6px',
              color: '#888',
              lineHeight: 1,
              borderLeft: '1px solid #ddd',
              paddingLeft: '3px',
            }}
          >
            G:{giroLabel} M:{margemLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REALISTIC PRODUCT BLOCK
// ============================================================

function RealisticProduct({
  product,
  widthPercent,
  color,
  shelfHeight,
  language,
}: {
  product: Product;
  widthPercent: number;
  color: { bg: string; text: string; accent: string };
  shelfHeight: number;
  language: string;
}) {
  const share = product.share || 0;
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
      title={`${product.name} - ${share.toFixed(1)}% | Giro: ${product.giro || '-'} | Margem: ${product.margem || '-'}`}
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
            {/* Product label on package */}
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
      
      {/* Price tag / shelf label */}
      <PriceTag product={product} color={color} language={language} />
    </div>
  );
}

// ============================================================
// REALISTIC SHELF ROW
// ============================================================

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

  const normalizedProducts = productsInShelf.map((p) => ({
    ...p,
    normalizedShare: totalShare > 0 ? ((p.share || 0) / totalShare) * 100 : 0,
  }));

  const zoneIndicator = zone === 'Altura dos olhos' 
    ? { color: '#FBBF24', label: language === 'pt' ? 'Olhos' : 'Eye' }
    : zone === 'Altura das mãos'
    ? { color: '#3B82F6', label: language === 'pt' ? 'Mãos' : 'Hand' }
    : { color: '#22C55E', label: language === 'pt' ? 'Baixo' : 'Low' };

  return (
    <div style={{ position: 'relative', marginBottom: '28px' }}>
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
              language={language}
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
// SINGLE GONDOLA RENDER (used for both main and comparison)
// ============================================================

function GondolaRender({
  products,
  numberOfShelves,
  language,
  label,
  compact = false,
}: {
  products: Product[];
  numberOfShelves: number;
  language: string;
  label?: string;
  compact?: boolean;
}) {
  const distribution = distributeProductsToShelves(products, numberOfShelves);
  const allProductNames = Array.from(new Set(products.map(p => p.name)));
  const shelfHeight = compact
    ? Math.max(40, Math.min(60, 300 / numberOfShelves))
    : Math.max(50, Math.min(80, 400 / numberOfShelves));

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
    <div>
      {/* Optional label (ANTES / DEPOIS) */}
      {label && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '8px',
            padding: '4px 12px',
            backgroundColor: label.includes('Antes') || label.includes('Before') ? '#FEF3C7' : '#D1FAE5',
            borderRadius: '4px',
            border: label.includes('Antes') || label.includes('Before') ? '1px solid #F59E0B' : '1px solid #10B981',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: label.includes('Antes') || label.includes('Before') ? '#92400E' : '#065F46',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Gondola frame */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)',
          borderRadius: '8px',
          padding: compact ? '16px 16px 24px 50px' : '20px 20px 30px 60px',
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
        <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '4px' }}>
          <span
            style={{
              fontSize: compact ? '11px' : '13px',
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
            left: compact ? '38px' : '48px',
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

      {/* Product legend */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {allProductNames.map((name) => {
          const color = getProductColor(name, allProductNames);
          return (
            <div key={name} className="flex items-center gap-1">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: `linear-gradient(135deg, ${color.bg} 0%, ${color.accent} 100%)`,
                  border: `1px solid ${color.accent}`,
                }}
              />
              <span style={{ fontSize: '10px', color: '#666', fontWeight: 500 }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// COMPARISON STATS
// ============================================================

function ComparisonStats({
  beforeProducts,
  afterProducts,
  numberOfShelves,
  language,
}: {
  beforeProducts: Product[];
  afterProducts: Product[];
  numberOfShelves: number;
  language: string;
}) {
  const pt = language === 'pt';

  const beforeByZone = { olhos: 0, maos: 0, baixo: 0 };
  const afterByZone = { olhos: 0, maos: 0, baixo: 0 };

  beforeProducts.forEach(p => {
    const zone = p.zone || p.zona || 'Altura das mãos';
    if (zone === 'Altura dos olhos') beforeByZone.olhos++;
    else if (zone === 'Altura das mãos') beforeByZone.maos++;
    else beforeByZone.baixo++;
  });

  afterProducts.forEach(p => {
    const zone = p.zone || p.zona || 'Altura das mãos';
    if (zone === 'Altura dos olhos') afterByZone.olhos++;
    else if (zone === 'Altura das mãos') afterByZone.maos++;
    else afterByZone.baixo++;
  });

  const stats = [
    {
      label: pt ? 'Total de Produtos' : 'Total Products',
      before: beforeProducts.length,
      after: afterProducts.length,
    },
    {
      label: pt ? 'Altura dos Olhos' : 'Eye Level',
      before: beforeByZone.olhos,
      after: afterByZone.olhos,
    },
    {
      label: pt ? 'Altura das Mãos' : 'Hand Level',
      before: beforeByZone.maos,
      after: afterByZone.maos,
    },
    {
      label: pt ? 'Parte de Baixo' : 'Bottom',
      before: beforeByZone.baixo,
      after: afterByZone.baixo,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
      }}
    >
      {stats.map((stat) => {
        const diff = stat.after - stat.before;
        const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#DC2626' : '#6B7280';
        const diffSign = diff > 0 ? '+' : '';

        return (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#92400E' }}>{stat.before}</span>
              <span style={{ fontSize: '10px', color: '#9CA3AF' }}>→</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#065F46' }}>{stat.after}</span>
            </div>
            {diff !== 0 && (
              <div style={{ fontSize: '10px', fontWeight: 600, color: diffColor, marginTop: '2px' }}>
                {diffSign}{diff}
              </div>
            )}
          </div>
        );
      })}
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
  const [savedState, setSavedState] = useState<Product[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const pt = language === 'pt';

  const handleSaveState = useCallback(() => {
    setSavedState(JSON.parse(JSON.stringify(products)));
  }, [products]);

  const handleCompare = useCallback(() => {
    if (savedState) {
      setIsComparing(true);
    }
  }, [savedState]);

  const handleExitComparison = useCallback(() => {
    setIsComparing(false);
  }, []);

  const handleClearSaved = useCallback(() => {
    setSavedState(null);
    setIsComparing(false);
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      {/* Header with comparison controls */}
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {pt ? 'Visualização Realista da Gôndola' : 'Realistic Gondola View'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {pt
              ? 'Representação fiel com etiquetas de preço e informações de produto'
              : 'Faithful representation with price tags and product information'}
          </p>
        </div>

        {/* Comparison controls */}
        <div className="flex gap-2 flex-wrap">
          {!isComparing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveState}
                className="text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                {savedState
                  ? (pt ? 'Atualizar "Antes"' : 'Update "Before"')
                  : (pt ? 'Salvar como "Antes"' : 'Save as "Before"')}
              </Button>
              {savedState && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCompare}
                    className="text-xs"
                  >
                    <GitCompareArrows className="w-3.5 h-3.5 mr-1" />
                    {pt ? 'Comparar Antes/Depois' : 'Compare Before/After'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSaved}
                    className="text-xs text-muted-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    {pt ? 'Limpar' : 'Clear'}
                  </Button>
                </>
              )}
            </>
          )}
          {isComparing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitComparison}
              className="text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              {pt ? 'Sair da Comparação' : 'Exit Comparison'}
            </Button>
          )}
        </div>
      </div>

      {/* Comparison mode: side by side */}
      {isComparing && savedState ? (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {/* BEFORE */}
            <GondolaRender
              products={savedState}
              numberOfShelves={numberOfShelves}
              language={language}
              label={pt ? '⬅ Antes' : '⬅ Before'}
              compact={true}
            />
            {/* AFTER */}
            <GondolaRender
              products={products}
              numberOfShelves={numberOfShelves}
              language={language}
              label={pt ? 'Depois ➡' : 'After ➡'}
              compact={true}
            />
          </div>

          {/* Comparison statistics */}
          <ComparisonStats
            beforeProducts={savedState}
            afterProducts={products}
            numberOfShelves={numberOfShelves}
            language={language}
          />
        </div>
      ) : (
        /* Normal mode: single gondola */
        <GondolaRender
          products={products}
          numberOfShelves={numberOfShelves}
          language={language}
        />
      )}

      {/* Zone legend */}
      <div className="mt-3 flex gap-4 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
          <span>{pt ? 'Altura dos olhos' : 'Eye Level'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
          <span>{pt ? 'Altura das mãos' : 'Hand Level'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
          <span>{pt ? 'Parte de Baixo' : 'Bottom'}</span>
        </div>
      </div>

      {/* Saved state indicator */}
      {savedState && !isComparing && (
        <div
          className="mt-3 text-center"
          style={{
            padding: '6px 12px',
            backgroundColor: '#FEF3C7',
            borderRadius: '4px',
            border: '1px solid #F59E0B',
          }}
        >
          <span style={{ fontSize: '11px', color: '#92400E' }}>
            {pt
              ? `Estado "Antes" salvo com ${savedState.length} produto(s). Modifique a gôndola e clique "Comparar Antes/Depois".`
              : `"Before" state saved with ${savedState.length} product(s). Modify the gondola and click "Compare Before/After".`}
          </span>
        </div>
      )}
    </div>
  );
}
