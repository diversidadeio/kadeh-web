import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Product {
  id: string;
  name: string;
  zone?: string;
  zona?: string;
  quadrantes: number;
  largura?: number;
  share?: number;
  giro?: string;
  margem?: string;
}

interface GondolaConfig {
  width: number;
  height: number;
  depth: number;
  numberOfShelves: number;
}

interface ShelfDistribution {
  shelf1: Product[];
  shelves2to4: Product[];
  shelf5: Product[];
}

/**
 * Calcula a distribuição de produtos nas prateleiras
 */
function distributeProductsToShelves(products: Product[]): ShelfDistribution {
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.zona) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.zona) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.zona) === 'Parte de Baixo'),
  };

  const bottomShare = productsByZone['Parte de Baixo'].reduce((sum, p) => sum + (p.share || 0), 0);
  const spaceRemaining = 100 - bottomShare;

  let shelf1Products = [...productsByZone['Parte de Baixo']];
  let handLevelProducts = [...productsByZone['Altura das mãos']];

  if (spaceRemaining > 0 && handLevelProducts.length > 0) {
    let remainingSpace = spaceRemaining;
    const productsToAdd: Product[] = [];
    
    for (const product of handLevelProducts) {
      if (remainingSpace <= 0) break;
      
      const productShare = product.share || 0;
      if (productShare <= remainingSpace) {
        productsToAdd.push(product);
        remainingSpace -= productShare;
      }
    }

    shelf1Products = [...shelf1Products, ...productsToAdd];
    handLevelProducts = handLevelProducts.filter(p => !productsToAdd.includes(p));
  }

  return {
    shelf1: shelf1Products,
    shelves2to4: handLevelProducts,
    shelf5: productsByZone['Altura dos olhos'],
  };
}

/**
 * Gera um PDF com o planograma completo da gôndola
 */
export async function exportGondolaPlanogram(
  products: Product[],
  gondolaConfig: GondolaConfig,
  storeName: string = 'Loja',
  language: 'pt' | 'en' = 'pt'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Configurar fonte padrão
  doc.setFont('Arial');

  // Título
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  const title = language === 'pt' ? 'Planograma de Gôndola' : 'Shelf Planogram';
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Informações da loja
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const storeLabel = language === 'pt' ? 'Loja:' : 'Store:';
  const dateLabel = language === 'pt' ? 'Data:' : 'Date:';
  const date = new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
  
  doc.text(`${storeLabel} ${storeName}`, margin, yPosition);
  doc.text(`${dateLabel} ${date}`, pageWidth / 2, yPosition);
  yPosition += 8;

  // Configuração da gôndola
  const configLabel = language === 'pt' ? 'Configuração da Gôndola' : 'Shelf Configuration';
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(configLabel, margin, yPosition);
  yPosition += 6;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const widthLabel = language === 'pt' ? 'Largura:' : 'Width:';
  const depthLabel = language === 'pt' ? 'Profundidade:' : 'Depth:';
  const heightLabel = language === 'pt' ? 'Altura entre prateleiras:' : 'Height between shelves:';
  const shelvesLabel = language === 'pt' ? 'Total de prateleiras:' : 'Total shelves:';

  doc.text(`${widthLabel} ${gondolaConfig.width}cm`, margin, yPosition);
  doc.text(`${depthLabel} ${gondolaConfig.depth}cm`, pageWidth / 2, yPosition);
  yPosition += 5;
  doc.text(`${heightLabel} ${gondolaConfig.height}cm`, margin, yPosition);
  doc.text(`${shelvesLabel} ${gondolaConfig.numberOfShelves}`, pageWidth / 2, yPosition);
  yPosition += 10;

  // Distribuição de produtos
  const distribution = distributeProductsToShelves(products);

  // Tabela de produtos por prateleira
  const shelfTables = [
    { number: 1, name: language === 'pt' ? 'Prateleira 1 (Parte de Baixo)' : 'Shelf 1 (Bottom)', products: distribution.shelf1 },
    { number: 2, name: language === 'pt' ? 'Prateleira 2 (Altura das Mãos)' : 'Shelf 2 (Hand Level)', products: distribution.shelves2to4 },
    { number: 3, name: language === 'pt' ? 'Prateleira 3 (Altura das Mãos)' : 'Shelf 3 (Hand Level)', products: distribution.shelves2to4 },
    { number: 4, name: language === 'pt' ? 'Prateleira 4 (Altura das Mãos)' : 'Shelf 4 (Hand Level)', products: distribution.shelves2to4 },
    { number: 5, name: language === 'pt' ? 'Prateleira 5 (Altura dos Olhos)' : 'Shelf 5 (Eye Level)', products: distribution.shelf5 },
  ];

  // Renderizar tabelas de cada prateleira
  for (const shelf of shelfTables) {
    if (shelf.products.length === 0) continue;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Título da prateleira
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(shelf.name, margin, yPosition);
    yPosition += 6;

    // Tabela de produtos
    const tableData = shelf.products.map(product => [
      product.name,
      `${(product.share || 0).toFixed(1)}%`,
      product.giro || '-',
      product.margem || '-',
    ]);

    const tableHeaders = language === 'pt' 
      ? ['Produto', 'Percentual', 'Giro', 'Margem']
      : ['Product', 'Percentage', 'Turnover', 'Margin'];

    (doc as any).autoTable({
      startY: yPosition,
      head: [tableHeaders],
      body: tableData,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headerStyles: {
        fillColor: [70, 130, 180],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 8;
  }

  // Nova página para resumo
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Resumo de capacidade
  const summaryTitle = language === 'pt' ? 'Resumo de Capacidade' : 'Capacity Summary';
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(summaryTitle, margin, yPosition);
  yPosition += 8;

  // Calcular totais por prateleira
  const summaryData = [
    {
      shelf: language === 'pt' ? 'Prateleira 1' : 'Shelf 1',
      products: distribution.shelf1.length,
      capacity: distribution.shelf1.reduce((sum, p) => sum + (p.share || 0), 0),
    },
    {
      shelf: language === 'pt' ? 'Prateleiras 2-4' : 'Shelves 2-4',
      products: distribution.shelves2to4.length,
      capacity: distribution.shelves2to4.reduce((sum, p) => sum + (p.share || 0), 0),
    },
    {
      shelf: language === 'pt' ? 'Prateleira 5' : 'Shelf 5',
      products: distribution.shelf5.length,
      capacity: distribution.shelf5.reduce((sum, p) => sum + (p.share || 0), 0),
    },
  ];

  const summaryTableData = summaryData.map(row => [
    row.shelf,
    row.products.toString(),
    `${row.capacity.toFixed(1)}%`,
  ]);

  const summaryHeaders = language === 'pt'
    ? ['Prateleira', 'Nº de Produtos', 'Capacidade Utilizada']
    : ['Shelf', 'Number of Products', 'Capacity Used'];

  (doc as any).autoTable({
    startY: yPosition,
    head: [summaryHeaders],
    body: summaryTableData,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headerStyles: {
      fillColor: [70, 130, 180],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [240, 248, 255],
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Resumo geral
  const totalProducts = products.length;
  const totalCapacity = products.reduce((sum, p) => sum + (p.share || 0), 0);
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const totalProductsLabel = language === 'pt' ? 'Total de Produtos:' : 'Total Products:';
  const totalCapacityLabel = language === 'pt' ? 'Capacidade Total Utilizada:' : 'Total Capacity Used:';
  
  doc.text(`${totalProductsLabel} ${totalProducts}`, margin, yPosition);
  yPosition += 5;
  doc.text(`${totalCapacityLabel} ${totalCapacity.toFixed(1)}%`, margin, yPosition);

  // Salvar PDF
  const fileName = `planograma_gondola_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

/**
 * Exporta apenas a visualização da gôndola como imagem em PDF
 */
export async function exportGondolaVisualization(
  canvasElement: HTMLCanvasElement,
  storeName: string = 'Loja',
  language: 'pt' | 'en' = 'pt'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let yPosition = margin;

  // Título
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  const title = language === 'pt' ? 'Visualização da Gôndola' : 'Shelf Visualization';
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Informações
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const storeLabel = language === 'pt' ? 'Loja:' : 'Store:';
  const dateLabel = language === 'pt' ? 'Data:' : 'Date:';
  const date = new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
  
  doc.text(`${storeLabel} ${storeName}`, margin, yPosition);
  doc.text(`${dateLabel} ${date}`, pageWidth / 2, yPosition);
  yPosition += 10;

  // Converter canvas para imagem
  const imageData = canvasElement.toDataURL('image/png');
  const imageWidth = pageWidth - 2 * margin;
  const imageHeight = (imageWidth * canvasElement.height) / canvasElement.width;

  // Adicionar imagem ao PDF
  doc.addImage(imageData, 'PNG', margin, yPosition, imageWidth, imageHeight);

  // Salvar PDF
  const fileName = `visualizacao_gondola_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}
