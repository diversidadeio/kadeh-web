import { Category } from "@/data/categories";

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
  largura?: number;
  comprimento?: number;
}

export interface OptimizationSuggestion {
  productId: string;
  productName: string;
  currentZone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  suggestedZone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  reason: string;
  marginIncrease: number;
  revenueIncrease: number;
}

export interface OptimizationResult {
  suggestions: OptimizationSuggestion[];
  totalMarginIncrease: number;
  totalRevenueIncrease: number;
  currentTotalMargin: number;
  optimizedTotalMargin: number;
  currentTotalRevenue: number;
  optimizedTotalRevenue: number;
  marginIncreasePercentage: number;
  revenueIncreasePercentage: number;
}

/**
 * Calcula a margem e faturamento de um produto
 */
export const calculateProductMetrics = (
  product: Product,
  getRecommendation: (curvaFaturamento: "A" | "B" | "C", curvaLucratividade: "A" | "B" | "C") => any
) => {
  const rec = getRecommendation(
    product.category.curvaFaturamento,
    product.category.curvaLucratividade
  );

  // Simular margem baseada na curva de lucratividade
  const marginMap: Record<string, number> = {
    A: 0.35, // 35% de margem para produtos de alta lucratividade
    B: 0.20, // 20% para média
    C: 0.10, // 10% para baixa
  };

  // Simular faturamento baseado na curva de faturamento
  const revenueMap: Record<string, number> = {
    A: 1000, // Alto giro
    B: 500, // Médio giro
    C: 200, // Baixo giro
  };

  const margin = marginMap[product.category.curvaLucratividade] || 0.15;
  const baseRevenue = revenueMap[product.category.curvaFaturamento] || 300;

  // Ajustar pela largura do produto (produtos maiores têm mais presença)
  const widthFactor = (product.largura || 10) / 10;
  const revenue = baseRevenue * widthFactor;

  return {
    margin,
    revenue,
    profitability: margin * revenue,
  };
};

/**
 * Calcula o score de otimização para cada zona
 * Produtos com alta margem devem ficar em altura dos olhos
 * Produtos com alto giro devem ficar em altura das mãos
 * Produtos com baixa performance ficam na parte de baixo
 */
export const calculateZoneScore = (
  product: Product,
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo",
  getRecommendation: (curvaFaturamento: "A" | "B" | "C", curvaLucratividade: "A" | "B" | "C") => any
) => {
  const rec = getRecommendation(
    product.category.curvaFaturamento,
    product.category.curvaLucratividade
  );

  const metrics = calculateProductMetrics(product, getRecommendation);

  // Scores para cada zona
  const zoneScores: Record<string, number> = {
    "Altura dos olhos": metrics.margin * 0.7 + (metrics.revenue / 1000) * 0.3, // Prioriza margem
    "Altura das mãos": metrics.margin * 0.3 + (metrics.revenue / 1000) * 0.7, // Prioriza giro
    "Parte de Baixo": (metrics.margin * 0.1 + (metrics.revenue / 1000) * 0.2) * 0.5, // Menor prioridade
  };

  return zoneScores[zone] || 0;
};

/**
 * Gera sugestões de otimização para redistribuição de produtos
 */
export const generateOptimizationSuggestions = (
  products: Product[],
  getRecommendation: (curvaFaturamento: "A" | "B" | "C", curvaLucratividade: "A" | "B" | "C") => any
): OptimizationResult => {
  const suggestions: OptimizationSuggestion[] = [];

  // Calcular métricas atuais
  let currentTotalMargin = 0;
  let currentTotalRevenue = 0;

  products.forEach((product) => {
    const metrics = calculateProductMetrics(product, getRecommendation);
    currentTotalMargin += metrics.profitability;
    currentTotalRevenue += metrics.revenue;
  });

  // Gerar sugestões para cada produto
  products.forEach((product) => {
    const rec = getRecommendation(
      product.category.curvaFaturamento,
      product.category.curvaLucratividade
    );
    const currentZone = rec.zone;
    const metrics = calculateProductMetrics(product, getRecommendation);

    // Calcular scores para cada zona
    const eyeLevelScore = calculateZoneScore(product, "Altura dos olhos", getRecommendation);
    const handLevelScore = calculateZoneScore(product, "Altura das mãos", getRecommendation);
    const bottomLevelScore = calculateZoneScore(product, "Parte de Baixo", getRecommendation);

    // Encontrar melhor zona
    const scores = {
      "Altura dos olhos": eyeLevelScore,
      "Altura das mãos": handLevelScore,
      "Parte de Baixo": bottomLevelScore,
    };

    const suggestedZone = Object.entries(scores).reduce((best, [zone, score]) => {
      const bestScore = scores[best as keyof typeof scores];
      return score > bestScore ? (zone as unknown as "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo") : best;
    }, "Altura dos olhos" as "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo");

    // Se a zona sugerida é diferente da atual, criar sugestão
    if (suggestedZone !== currentZone) {
      const currentScore = scores[currentZone as keyof typeof scores];
      const suggestedScore = scores[suggestedZone as keyof typeof scores];
      const scoreImprovement = suggestedScore - currentScore;

      // Calcular impacto financeiro (estimado)
      const marginIncrease = metrics.profitability * (scoreImprovement / Math.max(currentScore, 0.1));
      const revenueIncrease = metrics.revenue * (scoreImprovement / Math.max(currentScore, 0.1)) * 0.1;

      let reason = "";
      if (suggestedZone === "Altura dos olhos") {
        reason = "Alto potencial de margem - mover para altura dos olhos aumenta visibilidade premium";
      } else if (suggestedZone === "Altura das mãos") {
        reason = "Alto giro - mover para altura das mãos facilita acesso e compra";
      } else {
        reason = "Baixa performance - mover para parte de baixo libera espaço premium";
      }

      suggestions.push({
        productId: product.id,
        productName: product.name,
        currentZone,
        suggestedZone,
        reason,
        marginIncrease: Math.max(0, marginIncrease),
        revenueIncrease: Math.max(0, revenueIncrease),
      });
    }
  });

  // Calcular impacto total
  const totalMarginIncrease = suggestions.reduce((sum, s) => sum + s.marginIncrease, 0);
  const totalRevenueIncrease = suggestions.reduce((sum, s) => sum + s.revenueIncrease, 0);

  const optimizedTotalMargin = currentTotalMargin + totalMarginIncrease;
  const optimizedTotalRevenue = currentTotalRevenue + totalRevenueIncrease;

  const marginIncreasePercentage =
    currentTotalMargin > 0 ? (totalMarginIncrease / currentTotalMargin) * 100 : 0;
  const revenueIncreasePercentage =
    currentTotalRevenue > 0 ? (totalRevenueIncrease / currentTotalRevenue) * 100 : 0;

  return {
    suggestions: suggestions.sort((a, b) => b.marginIncrease - a.marginIncrease),
    totalMarginIncrease,
    totalRevenueIncrease,
    currentTotalMargin,
    optimizedTotalMargin,
    currentTotalRevenue,
    optimizedTotalRevenue,
    marginIncreasePercentage,
    revenueIncreasePercentage,
  };
};

/**
 * Aplica as sugestões de otimização aos produtos
 */
export const applyOptimizationSuggestions = (
  products: Product[],
  suggestions: OptimizationSuggestion[]
): Product[] => {
  // Criar mapa de sugestões por ID de produto
  const suggestionMap = new Map(suggestions.map((s) => [s.productId, s]));

  // Aplicar sugestões (nota: isso seria feito no backend em produção)
  // Por enquanto, apenas retornamos os produtos com a informação de zona atualizada
  return products.map((product) => {
    const suggestion = suggestionMap.get(product.id);
    if (suggestion) {
      // Atualizar a categoria do produto para refletir a nova zona
      return {
        ...product,
        category: {
          ...product.category,
          // Aqui você atualizaria as curvas para refletir a nova zona
          // Isso seria feito no backend
        },
      };
    }
    return product;
  });
};
