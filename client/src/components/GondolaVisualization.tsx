/**
 * GondolaVisualization Component
 * Displays shelf products horizontally with names and percentage allocations
 * Design: Tech-Forward Minimalism with clear product positioning
 */

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  largura?: number;
  comprimento?: number;
  category: {
    curvaFaturamento: string;
    curvaLucratividade: string;
  };
}

interface RecommendationResult {
  quadrantes: number;
  share: number | string;
  zone: string;
}

interface GondolaVisualizationProps {
  products: Product[];
  gondolaWidth: number;
  getRecommendation: (curvaFaturamento: "A" | "B" | "C", curvaLucratividade: "A" | "B" | "C") => RecommendationResult;
  colorMap: Record<string, string>;
}

const TRANSLATIONS = {
  pt: {
    totalSpace: "Espaço total",
    usedSpace: "Espaço utilizado",
    spaceExceeded: "Espaço excedido! Reduza produtos ou aumente a gôndola.",
    shelfVisualization: "Visualização da Gôndola",
    percentage: "%",
    productDetails: "Detalhamento dos Produtos",
    product: "Produto",
    quadrants: "Quadrantes",
    space: "Espaço",
    percentage2: "% Gôndola",
    zone: "Zona",
    zoneSummary: "Resumo de Zonas",
    eyeLevel: "Altura dos olhos",
    handLevel: "Altura das mãos",
    lowLevel: "Lugar baixo",
    products: "produtos",
  },
  en: {
    totalSpace: "Total space",
    usedSpace: "Used space",
    spaceExceeded: "Space exceeded! Reduce products or increase shelf.",
    shelfVisualization: "Shelf Visualization",
    percentage: "%",
    productDetails: "Product Details",
    product: "Product",
    quadrants: "Quadrants",
    space: "Space",
    percentage2: "% Shelf",
    zone: "Zone",
    zoneSummary: "Zone Summary",
    eyeLevel: "Eye Level",
    handLevel: "Hand Level",
    lowLevel: "Low Level",
    products: "products",
  },
};

export default function GondolaVisualization({
  products,
  gondolaWidth,
  getRecommendation,
  colorMap,
}: GondolaVisualizationProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.pt;

  const productAllocations = useMemo(() => {
    if (products.length === 0) return [];

    // Calcular o espaço total disponível baseado nos produtos
    const totalShare = products.reduce((sum, product) => {
      const rec = getRecommendation(
        product.category.curvaFaturamento as "A" | "B" | "C",
        product.category.curvaLucratividade as "A" | "B" | "C"
      );
      const shareValue = typeof rec.share === 'number' ? rec.share : 15;
      return sum + shareValue;
    }, 0);

    // Normalizar os percentuais se excederem 100%
    const normalizer = totalShare > 100 ? 100 / totalShare : 1;

    return products.map((product) => {
      const rec = getRecommendation(
        product.category.curvaFaturamento as "A" | "B" | "C",
        product.category.curvaLucratividade as "A" | "B" | "C"
      );
      const shareValue = typeof rec.share === 'number' ? rec.share : 15;
      const normalizedShare = shareValue * normalizer;
      const width = normalizedShare; // Usar o percentual normalizado diretamente
      const color = colorMap[rec.zone] || "bg-blue-500";
      const shareStr = `${normalizedShare.toFixed(1)}%`;

      return {
        id: product.id,
        name: product.name,
        width: Math.max(width, 2),
        displayWidth: width,
        color,
        share: shareStr,
        zone: rec.zone,
        quadrantes: rec.quadrantes,
      };
    });
  }, [products, gondolaWidth, getRecommendation, colorMap]);

  // Calculate zone summary
  const zoneSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    productAllocations.forEach((alloc) => {
      summary[alloc.zone] = (summary[alloc.zone] || 0) + 1;
    });
    return summary;
  }, [productAllocations]);

  const totalUsedSpace = useMemo(() => {
    return productAllocations.reduce((sum, alloc) => sum + alloc.displayWidth, 0);
  }, [productAllocations]);

  const spacePercentage = totalUsedSpace;

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {t.shelfVisualization}
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted p-3 rounded-md">
          <p className="text-xs text-muted-foreground">{t.totalSpace}</p>
          <p className="text-lg font-semibold text-foreground">{gondolaWidth} cm</p>
        </div>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-xs text-muted-foreground">{t.usedSpace}</p>
          <p className="text-lg font-semibold text-foreground">
            {Math.min(spacePercentage, 100).toFixed(0)}{t.percentage}
          </p>
        </div>
      </div>

      {/* Warning */}
      {spacePercentage > 100 && (
        <p className="text-sm text-destructive mb-4 font-semibold">
          ⚠️ {t.spaceExceeded}
        </p>
      )}

      {/* Horizontal Shelf Visualization */}
      <div className="mb-6">
        <div className="flex gap-1 h-16 bg-muted rounded-md overflow-hidden border-2 border-border">
          {productAllocations.map((alloc) => (
            <div
              key={alloc.id}
              style={{ width: `${alloc.width}%` }}
              className={`${alloc.color} flex flex-col items-center justify-center text-xs font-bold text-white relative group cursor-pointer transition-opacity hover:opacity-80`}
              title={`${alloc.name}: ${alloc.share} - ${alloc.quadrantes} quadrantes - ${alloc.zone}`}
            >
              {/* Product name and percentage - shown if space allows */}
              {alloc.displayWidth > 5 && (
                <div className="flex flex-col items-center gap-0.5 overflow-hidden">
                  <span className="text-xs font-bold truncate px-1 max-w-full leading-tight">
                    {alloc.name.length > 12
                      ? alloc.name.substring(0, 10) + "..."
                      : alloc.name}
                  </span>
                  <span className="text-xs font-semibold leading-tight">{alloc.share}</span>
                </div>
              )}

              {/* Tooltip for small sections */}
              {alloc.displayWidth <= 5 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {alloc.name}: {alloc.share}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Zone Summary */}
      {Object.keys(zoneSummary).length > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-md border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t.zoneSummary}</h4>
          <div className="grid grid-cols-3 gap-3">
            {["Altura dos olhos", "Altura das mãos", "Lugar baixo"].map((zone) => (
              <div key={zone} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colorMap[zone] || "bg-gray-400"}`}></div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {zone === "Altura dos olhos" ? t.eyeLevel : zone === "Altura das mãos" ? t.handLevel : t.lowLevel}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {zoneSummary[zone] || 0} {t.products}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Details Table */}
      {products.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            {t.productDetails} ({products.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left py-2 px-2">{t.product}</th>
                  <th className="text-center py-2 px-2">{t.quadrants}</th>
                  <th className="text-center py-2 px-2">{t.space}</th>
                  <th className="text-center py-2 px-2">{t.percentage2}</th>
                  <th className="text-center py-2 px-2">{t.zone}</th>
                </tr>
              </thead>
              <tbody>
                {productAllocations.map((alloc) => (
                  <tr key={alloc.id} className="border-b border-border hover:bg-muted">
                    <td className="py-2 px-2 font-medium text-foreground">
                      {alloc.name}
                    </td>
                    <td className="py-2 px-2 text-center">{alloc.quadrantes}</td>
                    <td className="py-2 px-2 text-center">
                      {alloc.displayWidth.toFixed(1)} cm
                    </td>
                    <td className="py-2 px-2 text-center font-semibold text-blue-600">
                      {alloc.share}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold text-white ${alloc.color}`}
                      >
                        {alloc.zone === "Altura dos olhos" ? t.eyeLevel : alloc.zone === "Altura das mãos" ? t.handLevel : t.lowLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
