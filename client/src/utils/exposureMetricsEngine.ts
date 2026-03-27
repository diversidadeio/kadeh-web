/**
 * Exposure Metrics Engine
 * Calcula métricas de exposição de produtos em gôndolas
 * Taxa de ocupação, produtos mais expostos, recomendações de ajuste
 */

export interface Product {
  id: string;
  name: string;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo' | 'Eye level' | 'Hand level' | 'Bottom shelf';
  zona?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo' | 'Eye level' | 'Hand level' | 'Bottom shelf';
  share?: number;
  giro?: string;
  margem?: string;
  category?: {
    curvaFaturamento?: 'A' | 'B' | 'C';
    curvaLucratividade?: 'A' | 'B' | 'C';
  };
}

export interface ShelfOccupancyMetrics {
  shelfNumber: number;
  zone: string;
  totalShare: number;
  occupancyPercentage: number;
  productCount: number;
  products: Product[];
  status: 'optimal' | 'underutilized' | 'overutilized';
}

export interface ProductExposureScore {
  productId: string;
  productName: string;
  exposureScore: number; // 0-100
  zone: string;
  share: number;
  velocity: string;
  margin: string;
  recommendation?: string;
}

export interface ExposureMetrics {
  shelfOccupancy: ShelfOccupancyMetrics[];
  topExposedProducts: ProductExposureScore[];
  underexposedProducts: ProductExposureScore[];
  recommendations: string[];
  totalOccupancyPercentage: number;
  averageOccupancyPercentage: number;
}

/**
 * Normaliza o nome da zona para português
 */
function normalizeZone(zone: string | undefined): string {
  if (!zone) return 'Altura das mãos';
  
  const zoneMap: Record<string, string> = {
    'Altura dos olhos': 'Altura dos olhos',
    'Eye level': 'Altura dos olhos',
    'Altura das mãos': 'Altura das mãos',
    'Hand level': 'Altura das mãos',
    'Parte de Baixo': 'Parte de Baixo',
    'Bottom shelf': 'Parte de Baixo',
  };
  
  return zoneMap[zone] || 'Altura das mãos';
}

/**
 * Calcula o score de exposição de um produto (0-100)
 * Baseado em: zona, share, velocidade de giro e margem
 */
function calculateExposureScore(product: Product): number {
  let score = 0;

  // Score por zona (máx 40 pontos)
  const zone = normalizeZone(product.zone || product.zona);
  switch (zone) {
    case 'Altura dos olhos':
      score += 40; // Melhor posição
      break;
    case 'Altura das mãos':
      score += 25; // Posição intermediária
      break;
    case 'Parte de Baixo':
      score += 10; // Posição inferior
      break;
  }

  // Score por share/ocupação (máx 30 pontos)
  const share = product.share || 0;
  if (share >= 15) score += 30;
  else if (share >= 10) score += 25;
  else if (share >= 5) score += 15;
  else if (share > 0) score += 5;

  // Score por velocidade de giro (máx 20 pontos)
  const velocity = product.giro || product.category?.curvaFaturamento || 'C';
  switch (velocity) {
    case 'A':
      score += 20;
      break;
    case 'B':
      score += 12;
      break;
    case 'C':
      score += 5;
      break;
  }

  // Score por margem (máx 10 pontos)
  const margin = product.margem || product.category?.curvaLucratividade || 'C';
  switch (margin) {
    case 'A':
      score += 10;
      break;
    case 'B':
      score += 6;
      break;
    case 'C':
      score += 2;
      break;
  }

  return Math.min(score, 100);
}

/**
 * Agrupa produtos por prateleira e zona
 */
function groupProductsByShelf(products: Product[]): Map<number, Product[]> {
  const shelfMap = new Map<number, Product[]>();

  products.forEach((product) => {
    const zone = normalizeZone(product.zone || product.zona);
    let shelfNumber = 3; // Padrão: altura das mãos (prateleira 3)

    // Mapear zona para número de prateleira
    if (zone === 'Altura dos olhos') {
      shelfNumber = 5; // Prateleira 5 (topo)
    } else if (zone === 'Altura das mãos') {
      shelfNumber = 3; // Prateleira 3 (meio)
    } else if (zone === 'Parte de Baixo') {
      shelfNumber = 1; // Prateleira 1 (base)
    }

    if (!shelfMap.has(shelfNumber)) {
      shelfMap.set(shelfNumber, []);
    }
    shelfMap.get(shelfNumber)!.push(product);
  });

  return shelfMap;
}

/**
 * Calcula métricas de ocupação por prateleira
 */
function calculateShelfOccupancy(shelfMap: Map<number, Product[]>): ShelfOccupancyMetrics[] {
  const metrics: ShelfOccupancyMetrics[] = [];

  // Sempre incluir 5 prateleiras (mesmo que vazias)
  for (let shelfNum = 1; shelfNum <= 5; shelfNum++) {
    const products = shelfMap.get(shelfNum) || [];
    const totalShare = products.reduce((sum, p) => sum + (p.share || 0), 0);
    
    let zone = '';
    if (shelfNum === 1) zone = 'Parte de Baixo';
    else if (shelfNum >= 2 && shelfNum <= 4) zone = 'Altura das mãos';
    else if (shelfNum === 5) zone = 'Altura dos olhos';

    let status: 'optimal' | 'underutilized' | 'overutilized' = 'optimal';
    if (totalShare < 50) status = 'underutilized';
    else if (totalShare > 100) status = 'overutilized';

    metrics.push({
      shelfNumber: shelfNum,
      zone,
      totalShare,
      occupancyPercentage: Math.min(totalShare, 100),
      productCount: products.length,
      products,
      status,
    });
  }

  return metrics.sort((a, b) => b.shelfNumber - a.shelfNumber); // Ordenar de cima para baixo
}

/**
 * Gera recomendações baseadas nas métricas
 */
function generateRecommendations(
  metrics: ExposureMetrics,
  language: 'pt' | 'en' = 'pt'
): string[] {
  const recommendations: string[] = [];
  const t = language === 'pt' ? {
    moveHighPerformer: 'Mover produtos de alto desempenho (A-A) para Altura dos Olhos',
    balanceOccupancy: 'Balancear ocupação: Prateleira {shelf} está {status}',
    increaseShare: 'Aumentar share de produtos com alta margem e giro',
    reduceBottom: 'Reduzir quantidade de produtos de baixo giro na Parte de Baixo',
    optimizeHandLevel: 'Otimizar Altura das Mãos com produtos B-B',
    fillEmpty: 'Preencher prateleiras vazias com produtos de giro médio',
    consolidate: 'Consolidar produtos similares para melhor visibilidade',
  } : {
    moveHighPerformer: 'Move high-performing products (A-A) to Eye Level',
    balanceOccupancy: 'Balance occupancy: Shelf {shelf} is {status}',
    increaseShare: 'Increase share of high-margin, high-velocity products',
    reduceBottom: 'Reduce low-velocity products at Bottom Shelf',
    optimizeHandLevel: 'Optimize Hand Level with B-B products',
    fillEmpty: 'Fill empty shelves with medium-velocity products',
    consolidate: 'Consolidate similar products for better visibility',
  };

  // Verificar produtos A-A não em Eye Level
  const highPerformers = metrics.topExposedProducts.filter(
    (p) => p.velocity === 'A' && p.margin === 'A' && p.zone !== 'Altura dos olhos'
  );
  if (highPerformers.length > 0) {
    recommendations.push(t.moveHighPerformer);
  }

  // Verificar prateleiras com ocupação baixa
  const underutilized = metrics.shelfOccupancy.filter((s) => s.status === 'underutilized');
  if (underutilized.length > 0) {
    underutilized.forEach((shelf) => {
      recommendations.push(
        t.balanceOccupancy
          .replace('{shelf}', `${shelf.shelfNumber}`)
          .replace('{status}', language === 'pt' ? 'subutilizada' : 'underutilized')
      );
    });
  }

  // Verificar prateleiras com ocupação alta
  const overutilized = metrics.shelfOccupancy.filter((s) => s.status === 'overutilized');
  if (overutilized.length > 0) {
    recommendations.push(t.increaseShare);
  }

  // Verificar muitos produtos C-C na Parte de Baixo
  const bottomShelf = metrics.shelfOccupancy.find((s) => s.zone === 'Parte de Baixo');
  if (bottomShelf && bottomShelf.products.length > 0) {
    const lowPerformers = bottomShelf.products.filter(
      (p) => (p.giro === 'C' || p.category?.curvaFaturamento === 'C') &&
             (p.margem === 'C' || p.category?.curvaLucratividade === 'C')
    );
    if (lowPerformers.length > 2) {
      recommendations.push(t.reduceBottom);
    }
  }

  // Verificar se Hand Level pode ser otimizado
  const handLevel = metrics.shelfOccupancy.filter((s) => s.zone === 'Altura das mãos');
  if (handLevel.length > 0) {
    const avgOccupancy = handLevel.reduce((sum, s) => sum + s.occupancyPercentage, 0) / handLevel.length;
    if (avgOccupancy < 70) {
      recommendations.push(t.optimizeHandLevel);
    }
  }

  // Verificar prateleiras vazias
  const empty = metrics.shelfOccupancy.filter((s) => s.productCount === 0);
  if (empty.length > 1) {
    recommendations.push(t.fillEmpty);
  }

  return recommendations;
}

/**
 * Calcula todas as métricas de exposição
 */
export function calculateExposureMetrics(
  products: Product[],
  language: 'pt' | 'en' = 'pt'
): ExposureMetrics {
  if (products.length === 0) {
    return {
      shelfOccupancy: [],
      topExposedProducts: [],
      underexposedProducts: [],
      recommendations: [],
      totalOccupancyPercentage: 0,
      averageOccupancyPercentage: 0,
    };
  }

  // Agrupar produtos por prateleira
  const shelfMap = groupProductsByShelf(products);

  // Calcular ocupação por prateleira
  const shelfOccupancy = calculateShelfOccupancy(shelfMap);

  // Calcular score de exposição para cada produto
  const productScores = products.map((product) => ({
    productId: product.id,
    productName: product.name,
    exposureScore: calculateExposureScore(product),
    zone: normalizeZone(product.zone || product.zona),
    share: product.share || 0,
    velocity: product.giro || product.category?.curvaFaturamento || 'C',
    margin: product.margem || product.category?.curvaLucratividade || 'C',
  }));

  // Ordenar por score de exposição
  const sortedByScore = [...productScores].sort((a, b) => b.exposureScore - a.exposureScore);

  // Produtos mais expostos (top 5)
  const topExposedProducts = sortedByScore.slice(0, 5);

  // Produtos subexpostos (bottom 5)
  const underexposedProducts = sortedByScore.slice(-5).reverse();

  // Calcular ocupação total e média
  const totalOccupancyPercentage = shelfOccupancy.reduce((sum, s) => sum + s.occupancyPercentage, 0) / 5;
  const averageOccupancyPercentage = shelfOccupancy
    .filter((s) => s.productCount > 0)
    .reduce((sum, s) => sum + s.occupancyPercentage, 0) / Math.max(shelfOccupancy.filter((s) => s.productCount > 0).length, 1);

  // Gerar recomendações
  const metrics: ExposureMetrics = {
    shelfOccupancy,
    topExposedProducts,
    underexposedProducts,
    recommendations: [],
    totalOccupancyPercentage,
    averageOccupancyPercentage,
  };

  metrics.recommendations = generateRecommendations(metrics, language);

  return metrics;
}

/**
 * Calcula recomendação específica para um produto
 */
export function getProductRecommendation(
  product: Product,
  language: 'pt' | 'en' = 'pt'
): string | undefined {
  const velocity = product.giro || product.category?.curvaFaturamento || 'C';
  const margin = product.margem || product.category?.curvaLucratividade || 'C';
  const zone = normalizeZone(product.zone || product.zona);
  const share = product.share || 0;

  const t = language === 'pt' ? {
    moveToEyeLevel: 'Mover para Altura dos Olhos (alto desempenho)',
    moveToHandLevel: 'Mover para Altura das Mãos (desempenho médio)',
    moveToBottom: 'Mover para Parte de Baixo (baixo desempenho)',
    increaseShare: 'Aumentar espaço (alta demanda)',
    decreaseShare: 'Reduzir espaço (baixa demanda)',
    optimal: 'Posicionamento ótimo',
  } : {
    moveToEyeLevel: 'Move to Eye Level (high performance)',
    moveToHandLevel: 'Move to Hand Level (medium performance)',
    moveToBottom: 'Move to Bottom Shelf (low performance)',
    increaseShare: 'Increase space (high demand)',
    decreaseShare: 'Reduce space (low demand)',
    optimal: 'Optimal positioning',
  };

  // Produtos A-A devem estar em Eye Level
  if (velocity === 'A' && margin === 'A') {
    if (zone !== 'Altura dos olhos') return t.moveToEyeLevel;
    if (share < 20) return t.increaseShare;
    return t.optimal;
  }

  // Produtos B-B devem estar em Hand Level
  if (velocity === 'B' && margin === 'B') {
    if (zone !== 'Altura das mãos') return t.moveToHandLevel;
    if (share < 15) return t.increaseShare;
    return t.optimal;
  }

  // Produtos C-C devem estar em Bottom
  if (velocity === 'C' && margin === 'C') {
    if (zone !== 'Parte de Baixo') return t.moveToBottom;
    if (share > 10) return t.decreaseShare;
    return t.optimal;
  }

  // Produtos com alta velocidade mas baixa margem
  if (velocity === 'A' && margin === 'C') {
    if (zone !== 'Altura das mãos') return t.moveToHandLevel;
    return t.optimal;
  }

  return undefined;
}
