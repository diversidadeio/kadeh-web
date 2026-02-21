/**
 * Gondola Shelves Visualization Component
 * Shows products distributed across shelves respecting zones
 */

import React from "react";
import { distributeProductsAcrossShelves, type ProductForDistribution, type GondolaDistribution } from "@/utils/shelfDistributor";

interface GondolaShelvesVisualizationProps {
  products: ProductForDistribution[];
  gondolaWidth: number;
  numberOfShelves: number;
  language: "pt" | "en";
}

const ZONE_COLORS: Record<string, string> = {
  "Altura dos olhos": "bg-green-100 border-green-400",
  "Altura das mãos": "bg-yellow-100 border-yellow-400",
  "Parte de Baixo": "bg-red-100 border-red-400",
};

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
  const distribution = distributeProductsAcrossShelves(products, gondolaWidth, numberOfShelves);

  const translations = {
    pt: {
      shelf: "Prateleira",
      products: "produtos",
      width: "Largura",
      utilization: "Utilização",
      empty: "Vazia",
      zone: "Zona",
      fronts: "Frentes",
    },
    en: {
      shelf: "Shelf",
      products: "products",
      width: "Width",
      utilization: "Utilization",
      empty: "Empty",
      zone: "Zone",
      fronts: "Fronts",
    },
  };

  const t = translations[language];

  return (
    <div className="space-y-6">
      {/* Summary */}
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
            <p className="text-2xl font-bold text-foreground">{distribution.totalUsedWidth}/{distribution.totalAvailableWidth} cm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.fronts}</p>
            <p className="text-2xl font-bold text-foreground">{distribution.shelves.reduce((sum, s) => sum + s.products.length, 0)}</p>
          </div>
        </div>
      </div>

      {/* Shelves Visualization */}
      <div className="space-y-4">
        {distribution.shelves.map((shelf) => (
          <div key={shelf.shelfNumber} className="bg-card p-4 rounded-md border border-border">
            {/* Shelf Header */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-border">
              <div>
                <h4 className="font-semibold text-foreground">
                  {t.shelf} {shelf.shelfNumber}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {ZONE_LABELS[language][shelf.zone]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {shelf.products.length} {t.products}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {shelf.usedWidth}/{shelf.availableWidth} cm
                </p>
              </div>
            </div>

            {/* Products on Shelf */}
            {shelf.products.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {shelf.products.map((product) => (
                  <div
                    key={product.id}
                    className={`flex-shrink-0 p-2 rounded border-2 ${ZONE_COLORS[product.zone]}`}
                    style={{
                      minWidth: `${(product.largura / shelf.availableWidth) * 100}%`,
                      maxWidth: `${(product.largura / shelf.availableWidth) * 100}%`,
                    }}
                  >
                    <p className="text-xs font-semibold text-foreground truncate">
                      {product.name.substring(0, 15)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.largura}cm
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">{t.empty}</p>
            )}

            {/* Shelf Utilization Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(shelf.usedWidth / shelf.availableWidth) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Details */}
      <div className="bg-card p-4 rounded-md border border-border">
        <h4 className="font-semibold text-foreground mb-3">{t.zone} Distribution</h4>
        <div className="space-y-2 text-sm">
          {["Altura dos olhos", "Altura das mãos", "Parte de Baixo"].map((zone) => {
            const productsInZone = products.filter((p) => p.zone === zone).length;
            return (
              <div key={zone} className="flex justify-between">
                <span className="text-muted-foreground">{ZONE_LABELS[language][zone]}:</span>
                <span className="font-medium text-foreground">{productsInZone} {t.products}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
