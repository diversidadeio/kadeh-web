/**
 * PDF Report Generator for Smart Layout
 * Generates comprehensive reports with analytics and recommendations
 */

import html2pdf from "html2pdf.js";

export interface SimulationReport {
  simulationName: string;
  timestamp: Date;
  gondolaConfig: {
    width: number;
    depth: number;
    height: number;
    numberOfShelves: number;
  };
  products: Array<{
    name: string;
    category: string;
    quadrants: number;
    zone: string;
    margin: number;
    revenue: number;
  }>;
  metrics: {
    totalMargin: number;
    totalRevenue: number;
    spaceEfficiency: number;
    averageMarginPerProduct: number;
    averageRevenuePerProduct: number;
    recommendationConfidence: number;
  };
  recommendations: string[];
}

/**
 * Generate HTML report content
 */
function generateReportHTML(report: SimulationReport, language: "pt" | "en"): string {
  const translations = {
    pt: {
      title: "Relatório de Simulação Smart Layout",
      simulationName: "Nome da Simulação",
      generatedOn: "Gerado em",
      gondolaConfiguration: "Configuração da Gôndola",
      width: "Largura",
      depth: "Profundidade",
      height: "Altura entre Prateleiras",
      shelves: "Número de Prateleiras",
      products: "Produtos",
      product: "Produto",
      category: "Categoria",
      quadrants: "Quadrantes",
      zone: "Zona",
      margin: "Margem",
      revenue: "Faturamento",
      metrics: "Métricas de Desempenho",
      totalMargin: "Margem Total",
      totalRevenue: "Faturamento Total",
      spaceEfficiency: "Eficiência de Espaço",
      avgMarginPerProduct: "Margem Média por Produto",
      avgRevenuePerProduct: "Faturamento Médio por Produto",
      recommendationConfidence: "Confiança da Recomendação",
      recommendations: "Recomendações",
      cm: "cm",
      percent: "%",
      currency: "R$",
    },
    en: {
      title: "Smart Layout Simulation Report",
      simulationName: "Simulation Name",
      generatedOn: "Generated on",
      gondolaConfiguration: "Gondola Configuration",
      width: "Width",
      depth: "Depth",
      height: "Shelf Height",
      shelves: "Number of Shelves",
      products: "Products",
      product: "Product",
      category: "Category",
      quadrants: "Quadrants",
      zone: "Zone",
      margin: "Margin",
      revenue: "Revenue",
      metrics: "Performance Metrics",
      totalMargin: "Total Margin",
      totalRevenue: "Total Revenue",
      spaceEfficiency: "Space Efficiency",
      avgMarginPerProduct: "Avg Margin per Product",
      avgRevenuePerProduct: "Avg Revenue per Product",
      recommendationConfidence: "Recommendation Confidence",
      recommendations: "Recommendations",
      cm: "cm",
      percent: "%",
      currency: "R$",
    },
  };

  const t = translations[language];
  const dateStr = report.timestamp.toLocaleDateString(language === "pt" ? "pt-BR" : "en-US");
  const timeStr = report.timestamp.toLocaleTimeString(language === "pt" ? "pt-BR" : "en-US");

  let html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 20px; border-left: 4px solid #3b82f6; padding-left: 10px; }
          .header { background: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .config-item { background: #f9fafb; padding: 10px; border-left: 3px solid #10b981; border-radius: 3px; }
          .config-label { font-weight: bold; color: #374151; }
          .config-value { font-size: 18px; color: #1f2937; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #3b82f6; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) { background: #f9fafb; }
          .metrics-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 15px 0; }
          .metric-card { background: #f0f9ff; padding: 15px; border-radius: 5px; border: 1px solid #bfdbfe; }
          .metric-label { font-size: 12px; color: #0369a1; font-weight: bold; }
          .metric-value { font-size: 24px; color: #0284c7; font-weight: bold; margin-top: 5px; }
          .recommendations { background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; }
          .recommendation-item { margin: 8px 0; padding: 8px; background: white; border-radius: 3px; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>${t.title}</h1>
        
        <div class="header">
          <p><strong>${t.simulationName}:</strong> ${report.simulationName}</p>
          <p><strong>${t.generatedOn}:</strong> ${dateStr} ${timeStr}</p>
        </div>

        <h2>${t.gondolaConfiguration}</h2>
        <div class="config-grid">
          <div class="config-item">
            <div class="config-label">${t.width}</div>
            <div class="config-value">${report.gondolaConfig.width} ${t.cm}</div>
          </div>
          <div class="config-item">
            <div class="config-label">${t.depth}</div>
            <div class="config-value">${report.gondolaConfig.depth} ${t.cm}</div>
          </div>
          <div class="config-item">
            <div class="config-label">${t.height}</div>
            <div class="config-value">${report.gondolaConfig.height} ${t.cm}</div>
          </div>
          <div class="config-item">
            <div class="config-label">${t.shelves}</div>
            <div class="config-value">${report.gondolaConfig.numberOfShelves}</div>
          </div>
        </div>

        <h2>${t.products}</h2>
        <table>
          <thead>
            <tr>
              <th>${t.product}</th>
              <th>${t.category}</th>
              <th>${t.quadrants}</th>
              <th>${t.zone}</th>
              <th>${t.margin}</th>
              <th>${t.revenue}</th>
            </tr>
          </thead>
          <tbody>
            ${report.products
              .map(
                (p) => `
              <tr>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.quadrants}</td>
                <td>${p.zone}</td>
                <td>${t.currency} ${p.margin.toFixed(2)}</td>
                <td>${t.currency} ${p.revenue.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>${t.metrics}</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">${t.totalMargin}</div>
            <div class="metric-value">${t.currency} ${report.metrics.totalMargin.toFixed(2)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">${t.totalRevenue}</div>
            <div class="metric-value">${t.currency} ${report.metrics.totalRevenue.toFixed(2)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">${t.spaceEfficiency}</div>
            <div class="metric-value">${report.metrics.spaceEfficiency.toFixed(0)}${t.percent}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">${t.avgMarginPerProduct}</div>
            <div class="metric-value">${t.currency} ${report.metrics.averageMarginPerProduct.toFixed(2)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">${t.avgRevenuePerProduct}</div>
            <div class="metric-value">${t.currency} ${report.metrics.averageRevenuePerProduct.toFixed(2)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">${t.recommendationConfidence}</div>
            <div class="metric-value">${(report.metrics.recommendationConfidence * 100).toFixed(0)}${t.percent}</div>
          </div>
        </div>

        ${
          report.recommendations.length > 0
            ? `
        <div class="recommendations">
          <h2 style="margin-top: 0; border: none; padding: 0;">${t.recommendations}</h2>
          ${report.recommendations.map((rec) => `<div class="recommendation-item">• ${rec}</div>`).join("")}
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>Relatório gerado automaticamente pelo Smart Layout Simulator - Kadeh</p>
        </div>
      </body>
    </html>
  `;

  return html;
}

/**
 * Export report as PDF
 */
export function exportReportAsPDF(report: SimulationReport, language: "pt" | "en" = "pt"): void {
  const html = generateReportHTML(report, language);
  const element = document.createElement("div");
  element.innerHTML = html;

  const filename = `smart-layout-report-${report.simulationName}-${Date.now()}.pdf`;

  const options = {
    margin: 10,
    filename,
    image: { type: "png", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  };

  html2pdf().set(options as any).from(element).save();
}

/**
 * Export report as HTML
 */
export function exportReportAsHTML(report: SimulationReport, language: "pt" | "en" = "pt"): string {
  return generateReportHTML(report, language);
}

/**
 * Export report as CSV
 */
export function exportReportAsCSV(report: SimulationReport, language: "pt" | "en" = "pt"): string {
  const separator = ",";
  const newline = "\n";

  let csv = `Smart Layout Report - ${report.simulationName}${newline}`;
  csv += `Generated: ${report.timestamp.toISOString()}${newline}${newline}`;

  csv += `Gondola Configuration${newline}`;
  csv += `Width (cm),Depth (cm),Height (cm),Shelves${newline}`;
  csv += `${report.gondolaConfig.width},${report.gondolaConfig.depth},${report.gondolaConfig.height},${report.gondolaConfig.numberOfShelves}${newline}${newline}`;

  csv += `Products${newline}`;
  csv += `Product,Category,Quadrants,Zone,Margin,Revenue${newline}`;
  report.products.forEach((p) => {
    csv += `"${p.name}","${p.category}",${p.quadrants},"${p.zone}",${p.margin},${p.revenue}${newline}`;
  });

  csv += `${newline}Metrics${newline}`;
  csv += `Total Margin,Total Revenue,Space Efficiency,Avg Margin/Product,Avg Revenue/Product,Confidence${newline}`;
  csv += `${report.metrics.totalMargin},${report.metrics.totalRevenue},${report.metrics.spaceEfficiency},${report.metrics.averageMarginPerProduct},${report.metrics.averageRevenuePerProduct},${report.metrics.recommendationConfidence}${newline}`;

  return csv;
}
