/**
 * Gondola Shelves Visualization Component
 * Shows products distributed across shelves respecting zones
 * Each shelf is filled 100% with products repeating their fronts proportionally
 */

import React from "react";
import { distributeProductsStrictByZone, type ProductForDistribution, type GondolaDistribution, type ShelfProduct } from "@/utils/shelfDistributor";

interface GondolaShelvesVisualizationProps {
  products: ProductForDistribution[];
  gondolaWidth: number;
  numberOfShelves: number;
  language: "pt" | "en";
}

const ZONE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "Altura dos olhos": { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-800" },
  "Altura das mãos": { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-800" },
  "Parte de Baixo": { bg: "bg-green-50", border: "border-green-400", text: "text-green-800" },
};

// Color palette for individual products (cycling through colors)
const PRODUCT_COLORS = [
  { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" },
  { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
  { bg: "#DCFCE7", border: "#22C55E", text: "#166534" },
  { bg: "#FCE7F3", border: "#EC4899", text: "#9D174D" },
  { bg: "#EDE9FE", border: "#8B5CF6", text: "#4C1D95" },
  { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B" },
  { bg: "#FFEDD5", border: "#F97316", text: "#9A3412" },
  { bg: "#CFFAFE", border: "#06B6D4", text: "#164E63" },
  { bg: "#F0FDF4", border: "#16A34A", text: "#14532D" },
  { bg: "#FDF4FF", border: "#A855F7", text: "#581C87" },
];

const ZONE_LABELS: Record<string, Record<string, string>> = {
  pt: {
    "Altura dos olhos": "Altura dos Olhos",
    "Altura das mãos": "Altura das Mãos",
    "Parte de Baixo": "Parte de Baixo",
  },
  en: {
    "Altura dos olhos": "Eye Level",
    "Altura das mãos": "Hand Level",
    "Parte de Baixo": "Bottom Shelf",
  },
};

export default function GondolaShelvesVisualization({
  products,
  gondolaWidth,
  numberOfShelves,
  language,
}: GondolaShelvesVisualizationProps) {
  const distribution = distributeProductsStrictByZone(products, gondolaWidth, numberOfShelves);

  // Build a color map for products by id (consistent colors across shelves)
  const productColorMap: Record<string, typeof PRODUCT_COLORS[0]> = {};
  products.forEach((p, idx) => {
    productColorMap[p.id] = PRODUCT_COLORS[idx % PRODUCT_COLORS.length];
  });

  const translations = {
    pt: {
      shelf: "Prateleira",
      products: "produtos",
      width: "Largura",
      utilization: "Utilização",
      empty: "Vazia",
      zone: "Zona",
      fronts: "Frentes",
      gondolaVisualization: "Visualização da Gôndola",
      shelvesCount: `${numberOfShelves} prateleiras × ${gondolaWidth}cm`,
      totalFronts: "Total de Frentes",
      spaceUsed: "Espaço Utilizado",
      avgPerShelf: "Média por Prateleira",
      shelvesNum: "Prateleiras",
      zoneDist: "Distribuição por Zona",
      detailedDist: "Distribuição Detalhada",
      frontsLabel: "frentes",
    },
    en: {
      shelf: "Shelf",
      products: "products",
      width: "Width",
      utilization: "Utilization",
      empty: "Empty",
      zone: "Zone",
      fronts: "Fronts",
      gondolaVisualization: "Gondola Visualization",
      shelvesCount: `${numberOfShelves} shelves × ${gondolaWidth}cm`,
      totalFronts: "Total Fronts",
      spaceUsed: "Space Used",
      avgPerShelf: "Avg per Shelf",
      shelvesNum: "Shelves",
      zoneDist: "Zone Distribution",
      detailedDist: "Detailed Distribution",
      frontsLabel: "fronts",
    },
  };

  const t = translations[language];

  // Calculate statistics
  const totalFronts = distribution.shelves.reduce(
    (sum, shelf) => sum + shelf.products.reduce((s, p) => s + p.fronts, 0),
    0
  );
  const avgFrontsPerShelf = numberOfShelves > 0 ? Math.round(totalFronts / numberOfShelves) : 0;

  if (products.length === 0) {
    return (
      <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm">
          {language === "pt"
            ? "Nenhum produto adicionado à simulação"
            : "No products added to the simulation"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-card p-4 rounded-md border border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t.products}</p>
            <p className="text-2xl font-bold text-foreground">{distribution.totalProducts}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.utilization}</p>
            <p className="text-2xl font-bold text-foreground">{distribution.utilizationPercentage.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.width}</p>
            <p className="text-2xl font-bold text-foreground">{distribution.totalUsedWidth.toFixed(0)}/{distribution.totalAvailableWidth} cm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.fronts}</p>
            <p className="text-2xl font-bold text-foreground">{totalFronts}</p>
          </div>
        </div>
      </div>

      {/* Gondola Visual Representation */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4">
          {/* Title */}
          <div className="mb-4 pb-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">{t.gondolaVisualization}</h3>
            <p className="text-sm text-gray-600 mt-1">{t.shelvesCount}</p>
          </div>

          {/* Shelves */}
          <div className="space-y-3">
            {distribution.shelves.map((shelf) => {
              const zoneStyle = ZONE_COLORS[shelf.zone] || ZONE_COLORS["Altura das mãos"];

              return (
                <div
                  key={shelf.shelfNumber}
                  className={`border-2 rounded-lg overflow-hidden bg-white ${zoneStyle.border}`}
                >
                  {/* Shelf Header */}
                  <div className={`px-3 py-1.5 border-b ${zoneStyle.bg} ${zoneStyle.border}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold text-sm ${zoneStyle.text}`}>
                        {t.shelf} {shelf.shelfNumber}
                        <span className="ml-2 text-xs font-normal opacity-75">
                          ({ZONE_LABELS[language][shelf.zone]})
                        </span>
                      </span>
                      <span className="text-xs text-gray-600">
                        {shelf.usedWidth.toFixed(0)}cm / {gondolaWidth}cm
                        {" "}
                        <span className={`font-semibold ${shelf.utilizationPercent >= 95 ? "text-green-600" : "text-orange-500"}`}>
                          ({shelf.utilizationPercent.toFixed(0)}%)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Products on Shelf - filling 100% width */}
                  <div
                    className="flex overflow-hidden"
                    style={{ height: "56px", width: "100%" }}
                  >
                    {shelf.products.length > 0 ? (
                      shelf.products.map((product: ShelfProduct, productIdx: number) => {
                        const color = productColorMap[product.id] || PRODUCT_COLORS[0];
                        // Width percentage relative to gondola width
                        const widthPercent = gondolaWidth > 0
                          ? (product.widthUsed / gondolaWidth) * 100
                          : 0;

                        return (
                          <div
                            key={`${shelf.shelfNumber}-${product.id}-${productIdx}`}
                            className="flex flex-col items-center justify-center border-r border-gray-200 last:border-r-0 overflow-hidden flex-shrink-0 relative"
                            style={{
                              width: `${widthPercent}%`,
                              backgroundColor: color.bg,
                              borderColor: color.border,
                              borderWidth: "0 1px 0 0",
                            }}
                            title={`${product.name} — ${product.fronts} frente(s) × ${product.largura}cm = ${product.widthUsed.toFixed(0)}cm (${widthPercent.toFixed(1)}%)`}
                          >
                            {/* Repeat visual fronts inside the product block */}
                            <div className="flex h-full w-full">
                              {Array.from({ length: product.fronts }).map((_, frontIdx) => (
                                <div
                                  key={frontIdx}
                                  className="flex flex-col items-center justify-center h-full border-r border-dashed last:border-r-0 overflow-hidden"
                                  style={{
                                    width: `${100 / product.fronts}%`,
                                    borderColor: color.border,
                                    opacity: 0.85,
                                  }}
                                >
                                  {/* Show product name only on first front or if enough space */}
                                  {(frontIdx === 0 || product.fronts <= 3) && (
                                    <span
                                      className="text-xs font-bold text-center truncate px-0.5 leading-tight"
                                      style={{ color: color.text, fontSize: "9px" }}
                                    >
                                      {product.name.length > 8
                                        ? product.name.substring(0, 7) + "…"
                                        : product.name}
                                    </span>
                                  )}
                                  {frontIdx === 0 && (
                                    <span
                                      className="text-center leading-tight"
                                      style={{ color: color.text, fontSize: "8px", opacity: 0.8 }}
                                    >
                                      {product.largura}cm
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Fronts badge */}
                            <div
                              className="absolute top-0.5 right-0.5 rounded text-white font-bold leading-none"
                              style={{
                                backgroundColor: color.border,
                                fontSize: "8px",
                                padding: "1px 3px",
                              }}
                            >
                              ×{product.fronts}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full flex items-center justify-center text-gray-400 text-xs">
                        {t.empty}
                      </div>
                    )}
                  </div>

                  {/* Shelf Utilization Bar */}
                  <div className="h-1.5 bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        shelf.utilizationPercent >= 95
                          ? "bg-green-500"
                          : shelf.utilizationPercent >= 70
                          ? "bg-yellow-400"
                          : "bg-orange-400"
                      }`}
                      style={{ width: `${Math.min(shelf.utilizationPercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gondola Base */}
          <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 mt-3 rounded-b-lg" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 mb-2">{t.totalFronts}</p>
          <p className="text-2xl font-bold text-blue-900">{totalFronts}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs font-semibold text-green-600 mb-2">{t.spaceUsed}</p>
          <p className="text-2xl font-bold text-green-900">{distribution.utilizationPercentage.toFixed(0)}%</p>
          <p className="text-xs text-green-600 mt-1">{distribution.totalUsedWidth.toFixed(0)}cm</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-xs font-semibold text-purple-600 mb-2">{t.avgPerShelf}</p>
          <p className="text-2xl font-bold text-purple-900">{avgFrontsPerShelf}</p>
          <p className="text-xs text-purple-600 mt-1">{t.frontsLabel}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-xs font-semibold text-orange-600 mb-2">{t.shelvesNum}</p>
          <p className="text-2xl font-bold text-orange-900">{numberOfShelves}</p>
        </div>
      </div>

      {/* Zone Legend */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(ZONE_COLORS).map(([zone, colors]) => {
          const productsInZone = products.filter((p) => p.zone === zone).length;
          return (
            <div key={zone} className={`flex items-center gap-2 p-3 rounded border-2 ${colors.bg} ${colors.border}`}>
              <div className={`w-5 h-5 rounded border-2 ${colors.bg} ${colors.border}`} />
              <div>
                <span className={`text-xs font-medium ${colors.text}`}>
                  {ZONE_LABELS[language][zone]}
                </span>
                <p className="text-xs text-gray-500">{productsInZone} {t.products}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Distribution */}
      <div className="bg-card p-4 rounded-md border border-border">
        <h4 className="font-semibold text-foreground mb-3">{t.zoneDist}</h4>
        <div className="space-y-2 text-sm">
          {["Altura dos olhos", "Altura das mãos", "Parte de Baixo"].map((zone) => {
            const productsInZone = products.filter((p) => p.zone === zone).length;
            const frontsInZone = distribution.shelves
              .filter((s) => s.zone === zone)
              .reduce((sum, s) => sum + s.products.reduce((ps, p) => ps + p.fronts, 0), 0);
            return (
              <div key={zone} className="flex justify-between items-center">
                <span className="text-muted-foreground">{ZONE_LABELS[language][zone]}:</span>
                <span className="font-medium text-foreground">
                  {productsInZone} {t.products} · {frontsInZone} {t.frontsLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
