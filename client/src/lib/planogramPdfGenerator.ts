import html2pdf from 'html2pdf.js';

export interface ProductInfo {
  name: string;
  dimensions: string;
  giro: string;
  margem: string;
  quadrantes: number;
  espaço: string;
  percentualGondola: number;
  zona: string;
}

export interface ShelfConfig {
  largura: number;
  profundidade: number;
  altura: number;
  numPrateleiras: number;
  alturaEntrePrateleiras: number;
}

export interface PlanogramData {
  products: ProductInfo[];
  shelfConfig: ShelfConfig;
  dataGeracao: string;
  totalEspacoUtilizado: number;
}

export const generatePlanogramPDF = async (data: PlanogramData, filename: string = 'planograma.pdf'): Promise<void> => {
  try {
    // Criar HTML do planograma
    const htmlContent = createPlanogramHTML(data);
    
    // Configurar opções do html2pdf
    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Gerar e baixar PDF
    await (html2pdf() as any).set(options).from(htmlContent).save();
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar planograma em PDF');
  }
};

const createPlanogramHTML = (data: PlanogramData): string => {
  const { products, shelfConfig, dataGeracao, totalEspacoUtilizado } = data;

  // Agrupar produtos por zona
  const produtosPorZona = agruparProdutosPorZona(products);

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Planograma de Gôndola</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background-color: #f5f5f5;
        }

        .container {
          max-width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 15mm;
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
          border-bottom: 3px solid #1e40af;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        .header h1 {
          font-size: 24px;
          color: #1e40af;
          margin-bottom: 5px;
        }

        .header-info {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }

        .section {
          margin-bottom: 15px;
        }

        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #1e40af;
          background-color: #e0e7ff;
          padding: 8px;
          margin-bottom: 8px;
          border-left: 4px solid #1e40af;
        }

        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
          font-size: 11px;
        }

        .config-item {
          background-color: #f9fafb;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .config-label {
          font-weight: bold;
          color: #374151;
          margin-bottom: 2px;
        }

        .config-value {
          color: #1e40af;
          font-size: 12px;
        }

        .zone-section {
          margin-bottom: 12px;
          page-break-inside: avoid;
        }

        .zone-header {
          background-color: #f3f4f6;
          padding: 6px 8px;
          font-weight: bold;
          font-size: 12px;
          border-left: 3px solid;
          margin-bottom: 6px;
        }

        .zone-header.olhos {
          border-left-color: #10b981;
          background-color: #ecfdf5;
        }

        .zone-header.maos {
          border-left-color: #f59e0b;
          background-color: #fffbeb;
        }

        .zone-header.baixo {
          border-left-color: #ef4444;
          background-color: #fef2f2;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin-bottom: 8px;
        }

        .products-table th {
          background-color: #f3f4f6;
          padding: 6px 4px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #d1d5db;
          color: #374151;
        }

        .products-table td {
          padding: 5px 4px;
          border-bottom: 1px solid #e5e7eb;
        }

        .products-table tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .product-name {
          font-weight: 500;
          color: #1f2937;
        }

        .product-zone {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: bold;
          text-align: center;
        }

        .zone-olhos {
          background-color: #d1fae5;
          color: #065f46;
        }

        .zone-maos {
          background-color: #fef3c7;
          color: #92400e;
        }

        .zone-baixo {
          background-color: #fee2e2;
          color: #7f1d1d;
        }

        .summary {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
          font-size: 11px;
        }

        .summary-item {
          background-color: #f0f9ff;
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid #0284c7;
          text-align: center;
        }

        .summary-label {
          font-size: 10px;
          color: #666;
          margin-bottom: 3px;
        }

        .summary-value {
          font-size: 14px;
          font-weight: bold;
          color: #0284c7;
        }

        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
          font-size: 9px;
          color: #999;
          text-align: center;
        }

        .recomendacoes {
          background-color: #f0fdf4;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #10b981;
          font-size: 11px;
          margin-top: 10px;
        }

        .recomendacoes-title {
          font-weight: bold;
          color: #065f46;
          margin-bottom: 5px;
        }

        .recomendacoes-list {
          list-style: none;
          padding-left: 0;
        }

        .recomendacoes-list li {
          margin-bottom: 3px;
          padding-left: 15px;
          position: relative;
        }

        .recomendacoes-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        @media print {
          body {
            background-color: white;
          }
          .container {
            box-shadow: none;
            max-width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Planograma de Gôndola</h1>
          <div class="header-info">
            <span>Gerado em: ${dataGeracao}</span>
            <span>Espaço Utilizado: ${totalEspacoUtilizado.toFixed(1)}%</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">⚙️ Configuração da Gôndola</div>
          <div class="config-grid">
            <div class="config-item">
              <div class="config-label">Largura</div>
              <div class="config-value">${shelfConfig.largura} cm</div>
            </div>
            <div class="config-item">
              <div class="config-label">Profundidade</div>
              <div class="config-value">${shelfConfig.profundidade} cm</div>
            </div>
            <div class="config-item">
              <div class="config-label">Altura entre Prateleiras</div>
              <div class="config-value">${shelfConfig.alturaEntrePrateleiras} cm</div>
            </div>
            <div class="config-item">
              <div class="config-label">Número de Prateleiras</div>
              <div class="config-value">${shelfConfig.numPrateleiras}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📦 Distribuição de Produtos por Zona</div>
          
          ${renderZoneSection('Altura dos Olhos (Eye Level)', produtosPorZona['Altura dos olhos'] || [], 'olhos')}
          ${renderZoneSection('Altura das Mãos (Hand Level)', produtosPorZona['Altura das mãos'] || [], 'maos')}
          ${renderZoneSection('Parte de Baixo (Floor Level)', produtosPorZona['Lugar baixo'] || [], 'baixo')}
        </div>

        <div class="section">
          <div class="section-title">📈 Resumo Geral</div>
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total de Produtos</div>
              <div class="summary-value">${products.length}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Prateleiras Ocupadas</div>
              <div class="summary-value">${shelfConfig.numPrateleiras}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Ocupação</div>
              <div class="summary-value">${totalEspacoUtilizado.toFixed(0)}%</div>
            </div>
          </div>
        </div>

        <div class="recomendacoes">
          <div class="recomendacoes-title">💡 Recomendações de Implementação</div>
          <ul class="recomendacoes-list">
            <li>Produtos de alta margem e alto giro devem estar em destaque na altura dos olhos</li>
            <li>Produtos de baixa margem devem ser posicionados na parte de baixo para otimizar espaço premium</li>
            <li>Manter consistência na organização por zona para facilitar localização do cliente</li>
            <li>Revisar posicionamento a cada 30 dias ou conforme mudança de sazonalidade</li>
          </ul>
        </div>

        <div class="footer">
          <p>Este planograma foi gerado automaticamente pelo Kadeh Smart Layout.</p>
          <p>Para mais informações, visite: www.kadeh.io</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const renderZoneSection = (zoneName: string, products: ProductInfo[], zoneClass: string): string => {
  if (products.length === 0) {
    return `
      <div class="zone-section">
        <div class="zone-header ${zoneClass}">${zoneName} - Sem produtos</div>
      </div>
    `;
  }

  const tableRows = products.map(product => `
    <tr>
      <td class="product-name">${product.name}</td>
      <td>${product.dimensions}</td>
      <td>${product.giro}</td>
      <td>${product.margem}</td>
      <td style="text-align: center;">${product.quadrantes}</td>
      <td>${product.espaço}</td>
      <td style="text-align: right;">${product.percentualGondola.toFixed(1)}%</td>
    </tr>
  `).join('');

  return `
    <div class="zone-section">
      <div class="zone-header ${zoneClass}">${zoneName} (${products.length} produto${products.length !== 1 ? 's' : ''})</div>
      <table class="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Dimensões</th>
            <th>Giro</th>
            <th>Margem</th>
            <th>Quad.</th>
            <th>Espaço</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
};

const agruparProdutosPorZona = (products: ProductInfo[]): Record<string, ProductInfo[]> => {
  const agrupado: Record<string, ProductInfo[]> = {
    'Altura dos olhos': [],
    'Altura das mãos': [],
    'Lugar baixo': []
  };

  products.forEach(product => {
    const zona = product.zona || 'Altura das mãos';
    if (agrupado[zona]) {
      agrupado[zona].push(product);
    }
  });

  return agrupado;
};

export const preparePlanogramData = (
  products: any[],
  shelfConfig: ShelfConfig
): PlanogramData => {
  const totalEspacoUtilizado = products.reduce((sum, p) => sum + (p.percentualGondola || 0), 0);

  const productInfos: ProductInfo[] = products.map(p => ({
    name: p.name,
    dimensions: p.dimensions || 'N/A',
    giro: p.giro || 'N/A',
    margem: p.margem || 'N/A',
    quadrantes: p.quadrantes || 0,
    espaço: p.espaço || 'N/A',
    percentualGondola: p.percentualGondola || 0,
    zona: p.zona || 'Altura das mãos'
  }));

  return {
    products: productInfos,
    shelfConfig,
    dataGeracao: new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    totalEspacoUtilizado
  };
};
