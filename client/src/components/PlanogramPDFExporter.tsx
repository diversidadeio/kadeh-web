/**
 * PlanogramPDFExporter Component
 * Exports shelf planogram to PDF format
 * Design: Tech-Forward Minimalism with professional PDF output
 */

import html2pdf from "html2pdf.js";
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

interface PlanogramPDFExporterProps {
  products: Product[];
  gondolaWidth: number;
  areaType: string;
  getRecommendation: (curvaFaturamento: "A" | "B" | "C", curvaLucratividade: "A" | "B" | "C") => RecommendationResult;
  colorMap: Record<string, string>;
}

const TRANSLATIONS = {
  pt: {
    planogram: "Planograma",
    exposureArea: "Área de Exposição",
    shelfWidth: "Largura da Gôndola",
    products: "Produtos",
    product: "Produto",
    dimensions: "Dimensões",
    velocity: "Giro",
    margin: "Margem",
    zone: "Zona",
    quadrants: "Quadrantes",
    space: "Espaço",
    percentage: "Percentual",
    generatedOn: "Gerado em",
    gondola: "Gôndola",
    terminalGondola: "Terminal de Gôndola",
    freezerVertical: "Freezer Vertical",
    freezerHorizontal: "Freezer Horizontal",
    fruitStand: "Banca de Frutas/Legumes/Verduras",
  },
  en: {
    planogram: "Planogram",
    exposureArea: "Exposure Area",
    shelfWidth: "Shelf Width",
    products: "Products",
    product: "Product",
    dimensions: "Dimensions",
    velocity: "Velocity",
    margin: "Margin",
    zone: "Zone",
    quadrants: "Quadrants",
    space: "Space",
    percentage: "Percentage",
    generatedOn: "Generated on",
    gondola: "Gondola",
    terminalGondola: "Gondola Terminal",
    freezerVertical: "Vertical Freezer",
    freezerHorizontal: "Horizontal Freezer",
    fruitStand: "Fruit/Vegetable Stand",
  },
};

const getAreaTypeLabel = (areaType: string, t: any): string => {
  const areaLabels: Record<string, string> = {
    "gondola": t.gondola,
    "terminal": t.terminalGondola,
    "freezer-vertical": t.freezerVertical,
    "freezer-horizontal": t.freezerHorizontal,
    "fruit-stand": t.fruitStand,
  };
  return areaLabels[areaType] || areaType;
};

export function exportPlanogramToPDF(
  products: Product[],
  gondolaWidth: number,
  areaType: string,
  getRecommendation: (curvaFaturamento: "A" | "B" | "C", curvaLucratividade: "A" | "B" | "C") => RecommendationResult,
  colorMap: Record<string, string>,
  language: string
) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.pt;

  // Calcular alocações de produtos
  const totalShare = products.reduce((sum, product) => {
    const rec = getRecommendation(
      product.category.curvaFaturamento as "A" | "B" | "C",
      product.category.curvaLucratividade as "A" | "B" | "C"
    );
    const shareValue = typeof rec.share === "number" ? rec.share : 15;
    return sum + shareValue;
  }, 0);

  const normalizer = totalShare > 100 ? 100 / totalShare : 1;

  const productAllocations = products.map((product) => {
    const rec = getRecommendation(
      product.category.curvaFaturamento as "A" | "B" | "C",
      product.category.curvaLucratividade as "A" | "B" | "C"
    );
    const shareValue = typeof rec.share === "number" ? rec.share : 15;
    const normalizedShare = shareValue * normalizer;

    return {
      name: product.name,
      dimensions: `${product.largura}cm × ${product.comprimento}cm`,
      velocity: product.category.curvaFaturamento,
      margin: product.category.curvaLucratividade,
      zone: rec.zone,
      quadrants: rec.quadrantes,
      space: `${(gondolaWidth * normalizedShare) / 100}cm`,
      percentage: `${normalizedShare.toFixed(1)}%`,
    };
  });

  // Criar HTML para o PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #000;
          }
          .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
          }
          .info-section {
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .info-item {
            font-size: 12px;
          }
          .info-label {
            font-weight: bold;
            color: #333;
          }
          .info-value {
            color: #666;
          }
          .visualization {
            margin: 30px 0;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
          }
          .shelf-bar {
            display: flex;
            height: 60px;
            border: 1px solid #333;
            margin-bottom: 10px;
            overflow: hidden;
          }
          .shelf-segment {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            padding: 5px;
            overflow: hidden;
            border-right: 1px solid rgba(0,0,0,0.2);
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
          }
          .table th {
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            color: #333;
          }
          .table td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          .table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          .color-legend {
            margin-top: 20px;
            font-size: 10px;
          }
          .legend-item {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 5px;
          }
          .legend-color {
            display: inline-block;
            width: 15px;
            height: 15px;
            margin-right: 5px;
            vertical-align: middle;
            border: 1px solid #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t.planogram}</h1>
          <p><strong>${t.exposureArea}:</strong> ${getAreaTypeLabel(areaType, t)}</p>
          <p><strong>${t.shelfWidth}:</strong> ${gondolaWidth}cm</p>
        </div>

        <div class="info-section">
          <div class="info-item">
            <span class="info-label">${t.products}:</span>
            <span class="info-value">${products.length}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${t.generatedOn}:</span>
            <span class="info-value">${new Date().toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")}</span>
          </div>
        </div>

        <div class="visualization">
          <h3 style="margin-top: 0; font-size: 14px;">${t.planogram}</h3>
          <div class="shelf-bar">
            ${productAllocations
              .map((alloc, idx) => {
                const bgColor = colorMap[alloc.zone] || "bg-blue-500";
                const colorClass = bgColor.replace("bg-", "");
                const colorMap2: Record<string, string> = {
                  "green-600": "#16a34a",
                  "yellow-500": "#eab308",
                  "red-400": "#f87171",
                  "blue-500": "#3b82f6",
                };
                const color = colorMap2[colorClass] || "#3b82f6";
                return `
                  <div class="shelf-segment" style="width: ${alloc.percentage}; background-color: ${color};">
                    <div>
                      <div style="font-weight: bold;">${alloc.name.substring(0, 10)}</div>
                      <div>${alloc.percentage}</div>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>

          <div class="color-legend">
            ${Array.from(new Set(productAllocations.map((a) => a.zone)))
              .map((zone) => {
                const bgColor = colorMap[zone] || "bg-blue-500";
                const colorClass = bgColor.replace("bg-", "");
                const colorMap2: Record<string, string> = {
                  "green-600": "#16a34a",
                  "yellow-500": "#eab308",
                  "red-400": "#f87171",
                  "blue-500": "#3b82f6",
                };
                const color = colorMap2[colorClass] || "#3b82f6";
                return `
                  <div class="legend-item">
                    <span class="legend-color" style="background-color: ${color};"></span>
                    <span>${zone}</span>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>${t.product}</th>
              <th>${t.dimensions}</th>
              <th>${t.velocity}</th>
              <th>${t.margin}</th>
              <th>${t.zone}</th>
              <th>${t.quadrants}</th>
              <th>${t.space}</th>
              <th>${t.percentage}</th>
            </tr>
          </thead>
          <tbody>
            ${productAllocations
              .map(
                (alloc) => `
              <tr>
                <td>${alloc.name}</td>
                <td>${alloc.dimensions}</td>
                <td>${alloc.velocity}</td>
                <td>${alloc.margin}</td>
                <td>${alloc.zone}</td>
                <td>${alloc.quadrants}</td>
                <td>${alloc.space}</td>
                <td>${alloc.percentage}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>${t.generatedOn}: ${new Date().toLocaleString(language === "pt" ? "pt-BR" : "en-US")}</p>
        </div>
      </body>
    </html>
  `;

  // Exportar para PDF
  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  const opt = {
    margin: 10,
    filename: `planograma-${areaType}-${new Date().getTime()}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait" as const, unit: "mm" as const, format: "a4" as const },
  };

  html2pdf().set(opt).from(element).save();
}

export default function PlanogramPDFExporter({
  products,
  gondolaWidth,
  areaType,
  getRecommendation,
  colorMap,
}: PlanogramPDFExporterProps) {
  const { language } = useLanguage();

  return null;
}
