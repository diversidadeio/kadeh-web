import { Module, Shelf, ExposureZone } from '@shared/types/storeMapping';

export interface ProductRecommendation {
  productName: string;
  recommendedZone: ExposureZone;
  recommendedShelfOrder: number;
  reasoning: string;
  marginLevel: 'Baixa' | 'Média' | 'Alta';
  velocityLevel: 'Baixo' | 'Médio' | 'Alto';
  priority: number; // 1-10, higher = more important
}

export interface StoreLayoutRecommendation {
  moduleId: string;
  moduleName: string;
  recommendations: ProductRecommendation[];
  optimizationScore: number; // 0-100
}

/**
 * Matriz de correlação Margem × Giro para determinar zona de exposição
 * Baseado em princípios de merchandising varejista
 */
const MARGIN_VELOCITY_MATRIX: Record<string, Record<string, ExposureZone>> = {
  'Baixa': {
    'Baixo': 'Parte de Baixo',
    'Médio': 'Altura das mãos',
    'Alto': 'Altura das mãos',
  },
  'Média': {
    'Baixo': 'Altura das mãos',
    'Médio': 'Altura das mãos',
    'Alto': 'Altura dos olhos',
  },
  'Alta': {
    'Baixo': 'Altura das mãos',
    'Médio': 'Altura das mãos',
    'Alto': 'Altura dos olhos',
  },
};

/**
 * Prioridade de zona de exposição (quanto maior, melhor a visibilidade)
 */
const ZONE_PRIORITY: Record<ExposureZone, number> = {
  'Altura dos olhos': 10,
  'Altura das mãos': 7,
  'Parte de Baixo': 3,
};

/**
 * Gera recomendações de posicionamento para um módulo
 */
export function generateStoreLayoutRecommendations(
  module: Module,
  products: Array<{
    name: string;
    margin: 'Baixa' | 'Média' | 'Alta';
    velocity: 'Baixo' | 'Médio' | 'Alto';
  }>
): StoreLayoutRecommendation {
  const recommendations: ProductRecommendation[] = [];

  products.forEach(product => {
    const recommendedZone = MARGIN_VELOCITY_MATRIX[product.margin][product.velocity];
    const shelfWithZone = module.shelves.find(s => s.zone === recommendedZone);
    const recommendedShelfOrder = shelfWithZone?.order || 1;

    const recommendation: ProductRecommendation = {
      productName: product.name,
      recommendedZone,
      recommendedShelfOrder,
      reasoning: generateRecommendationReasoning(product.margin, product.velocity),
      marginLevel: product.margin,
      velocityLevel: product.velocity,
      priority: calculateProductPriority(product.margin, product.velocity),
    };

    recommendations.push(recommendation);
  });

  // Ordena por prioridade (maior primeiro)
  recommendations.sort((a, b) => b.priority - a.priority);

  const optimizationScore = calculateOptimizationScore(recommendations, module);

  return {
    moduleId: module.id,
    moduleName: module.name,
    recommendations,
    optimizationScore,
  };
}

/**
 * Gera texto explicativo para a recomendação
 */
function generateRecommendationReasoning(
  margin: 'Baixa' | 'Média' | 'Alta',
  velocity: 'Baixo' | 'Médio' | 'Alto'
): string {
  const reasons: Record<string, string> = {
    'Baixa-Baixo': 'Produto com baixa margem e baixo giro deve ficar em posição menos privilegiada para economizar espaço premium',
    'Baixa-Médio': 'Produto com baixa margem mas giro médio pode ficar em altura das mãos para aumentar visibilidade',
    'Baixa-Alto': 'Produto com baixa margem mas alto giro merece posição em altura das mãos para maximizar vendas',
    'Média-Baixo': 'Produto com margem média e baixo giro deve ficar em altura das mãos para estimular vendas',
    'Média-Médio': 'Produto com margem e giro médios fica bem em altura das mãos para bom equilíbrio',
    'Média-Alto': 'Produto com margem média e alto giro deve ficar em altura dos olhos para máxima visibilidade',
    'Alta-Baixo': 'Produto premium com baixo giro fica em altura das mãos para capturar clientes interessados',
    'Alta-Médio': 'Produto premium com giro médio merece altura das mãos para bom posicionamento',
    'Alta-Alto': 'Produto premium com alto giro DEVE ficar em altura dos olhos - posição de destaque',
  };

  return reasons[`${margin}-${velocity}`] || 'Recomendação padrão de posicionamento';
}

/**
 * Calcula prioridade do produto (1-10)
 */
function calculateProductPriority(
  margin: 'Baixa' | 'Média' | 'Alta',
  velocity: 'Baixo' | 'Médio' | 'Alto'
): number {
  const marginScore = margin === 'Alta' ? 3 : margin === 'Média' ? 2 : 1;
  const velocityScore = velocity === 'Alto' ? 3 : velocity === 'Médio' ? 2 : 1;

  return Math.min(marginScore + velocityScore, 10);
}

/**
 * Calcula score de otimização do layout (0-100)
 * Quanto maior, melhor a distribuição de produtos
 */
function calculateOptimizationScore(
  recommendations: ProductRecommendation[],
  module: Module
): number {
  let score = 0;
  const maxScore = recommendations.length * 10;

  recommendations.forEach(rec => {
    // Produtos de alta prioridade em zonas premium recebem pontuação máxima
    const zoneScore = ZONE_PRIORITY[rec.recommendedZone];
    const priorityBonus = rec.priority * 0.5;
    score += zoneScore + priorityBonus;
  });

  return Math.min((score / maxScore) * 100, 100);
}

/**
 * Sugere redistribuição de produtos entre prateleiras
 */
export function suggestShelfReallocation(
  module: Module,
  currentAllocation: Map<string, string[]>, // shelfId -> productNames
  recommendations: ProductRecommendation[]
): Map<string, string[]> {
  const newAllocation = new Map<string, string[]>();

  // Inicializa com prateleiras vazias
  module.shelves.forEach(shelf => {
    newAllocation.set(shelf.id, []);
  });

  // Aloca produtos conforme recomendação
  recommendations.forEach(rec => {
    const targetShelf = module.shelves.find(
      s => s.zone === rec.recommendedZone && s.order === rec.recommendedShelfOrder
    );

    if (targetShelf) {
      const shelfProducts = newAllocation.get(targetShelf.id) || [];
      shelfProducts.push(rec.productName);
      newAllocation.set(targetShelf.id, shelfProducts);
    }
  });

  return newAllocation;
}

/**
 * Calcula impacto estimado da recomendação
 */
export function calculateRecommendationImpact(
  recommendations: ProductRecommendation[]
): {
  estimatedSalesIncrease: number; // percentual
  estimatedMarginIncrease: number; // percentual
  estimatedRuptureReduction: number; // percentual
} {
  let highPriorityInPremiumZones = 0;
  let totalProducts = recommendations.length;

  recommendations.forEach(rec => {
    if (rec.priority >= 7 && rec.recommendedZone === 'Altura dos olhos') {
      highPriorityInPremiumZones++;
    }
  });

  const premiumPlacementRatio = highPriorityInPremiumZones / totalProducts;

  return {
    estimatedSalesIncrease: 8 + premiumPlacementRatio * 12, // 8-20%
    estimatedMarginIncrease: 5 + premiumPlacementRatio * 8, // 5-13%
    estimatedRuptureReduction: 15 + premiumPlacementRatio * 10, // 15-25%
  };
}

/**
 * Valida se a recomendação é viável
 */
export function validateRecommendation(
  module: Module,
  recommendations: ProductRecommendation[]
): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Verifica se há prateleiras suficientes
  const uniqueZones = new Set(recommendations.map(r => r.recommendedZone));
  if (uniqueZones.size > module.shelves.length) {
    warnings.push('Número de zonas recomendadas maior que número de prateleiras');
  }

  // Verifica se há produtos demais para as prateleiras
  const shelvesByZone = new Map<ExposureZone, number>();
  module.shelves.forEach(shelf => {
    shelvesByZone.set(shelf.zone, (shelvesByZone.get(shelf.zone) || 0) + 1);
  });

  recommendations.forEach(rec => {
    const shelfCount = shelvesByZone.get(rec.recommendedZone) || 0;
    if (shelfCount === 0) {
      warnings.push(`Nenhuma prateleira disponível para zona: ${rec.recommendedZone}`);
    }
  });

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
