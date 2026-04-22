/**
 * Product Recommendation Engine
 * 
 * Sistema de recomendações automáticas baseado na Matriz de Decisão
 * Smart Layout - Margem x Giro
 * 
 * Utiliza 4 matrizes de decisão para:
 * 1. Posicionamento Principal na Gôndola
 * 2. Posicionamento Secundário (quando sobra espaço)
 * 3. Enquadramento/Classificação do Produto
 * 4. Prioridade de Aumento de Espaço
 */

export type MarginLevel = "BAIXA" | "MÉDIA" | "ALTA";
export type VelocityLevel = "BAIXO" | "MÉDIO" | "ALTO";
export type ShelfZone = "PARTE_DE_BAIXO" | "ALTURA_DAS_MÃOS" | "ALTURA_DOS_OLHOS";
export type ProductClassification =
  | "PRODUTO_EM_RISCO_DE_DESCARTE"
  | "PRODUTO_DE_MASSA_REAVALIACAO"
  | "PRODUTO_DE_MASSA"
  | "ITEM_DE_MASSA_NECESSÁRIO"
  | "PRODUTO_NECESSÁRIO_GERADOR_TRÁFEGO"
  | "NICHO_DE_MERCADO"
  | "PRODUTO_FOCO"
  | "GERADOR_DE_CAIXA";
export type SpaceExpansionPriority = "1ª_OPÇÃO" | "2ª_OPÇÃO" | "3ª_OPÇÃO" | "4ª_OPÇÃO";

export interface ProductMetrics {
  productId: string;
  productName: string;
  margin: number; // 0-100
  velocity: number; // 0-100
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  margin: number;
  velocity: number;
  marginLevel: MarginLevel;
  velocityLevel: VelocityLevel;
  primaryPosition: ShelfZone;
  secondaryPosition: ShelfZone;
  classification: ProductClassification;
  spaceExpansionPriority: SpaceExpansionPriority;
  reasoning: string;
}

/**
 * MATRIZ 1: POSICIONAMENTO PRINCIPAL NA GÔNDOLA
 */
const primaryPositionMatrix: Record<MarginLevel, Record<VelocityLevel, ShelfZone>> = {
  BAIXA: {
    BAIXO: "PARTE_DE_BAIXO",
    MÉDIO: "PARTE_DE_BAIXO",
    ALTO: "ALTURA_DAS_MÃOS",
  },
  MÉDIA: {
    BAIXO: "PARTE_DE_BAIXO",
    MÉDIO: "ALTURA_DAS_MÃOS",
    ALTO: "ALTURA_DAS_MÃOS",
  },
  ALTA: {
    BAIXO: "ALTURA_DAS_MÃOS",
    MÉDIO: "ALTURA_DOS_OLHOS",
    ALTO: "ALTURA_DOS_OLHOS",
  },
};

/**
 * MATRIZ 2: POSICIONAMENTO SECUNDÁRIO (quando sobra espaço)
 */
const secondaryPositionMatrix: Record<MarginLevel, Record<VelocityLevel, ShelfZone>> = {
  BAIXA: {
    BAIXO: "PARTE_DE_BAIXO",
    MÉDIO: "PARTE_DE_BAIXO",
    ALTO: "ALTURA_DOS_OLHOS",
  },
  MÉDIA: {
    BAIXO: "PARTE_DE_BAIXO",
    MÉDIO: "PARTE_DE_BAIXO",
    ALTO: "ALTURA_DOS_OLHOS",
  },
  ALTA: {
    BAIXO: "ALTURA_DAS_MÃOS",
    MÉDIO: "ALTURA_DOS_OLHOS",
    ALTO: "ALTURA_DOS_OLHOS",
  },
};

/**
 * MATRIZ 3: ENQUADRAMENTO/CLASSIFICAÇÃO DO PRODUTO
 */
const classificationMatrix: Record<MarginLevel, Record<VelocityLevel, ProductClassification>> = {
  BAIXA: {
    BAIXO: "PRODUTO_EM_RISCO_DE_DESCARTE",
    MÉDIO: "PRODUTO_DE_MASSA_REAVALIACAO",
    ALTO: "PRODUTO_DE_MASSA",
  },
  MÉDIA: {
    BAIXO: "PRODUTO_DE_MASSA_REAVALIACAO",
    MÉDIO: "ITEM_DE_MASSA_NECESSÁRIO",
    ALTO: "PRODUTO_NECESSÁRIO_GERADOR_TRÁFEGO",
  },
  ALTA: {
    BAIXO: "NICHO_DE_MERCADO",
    MÉDIO: "PRODUTO_FOCO",
    ALTO: "GERADOR_DE_CAIXA",
  },
};

/**
 * MATRIZ 4: PRIORIDADE DE AUMENTO DE ESPAÇO
 */
const spaceExpansionMatrix: Record<MarginLevel, Record<VelocityLevel, SpaceExpansionPriority>> = {
  BAIXA: {
    BAIXO: "4ª_OPÇÃO",
    MÉDIO: "3ª_OPÇÃO",
    ALTO: "3ª_OPÇÃO",
  },
  MÉDIA: {
    BAIXO: "3ª_OPÇÃO",
    MÉDIO: "3ª_OPÇÃO",
    ALTO: "2ª_OPÇÃO",
  },
  ALTA: {
    BAIXO: "1ª_OPÇÃO",
    MÉDIO: "1ª_OPÇÃO",
    ALTO: "1ª_OPÇÃO",
  },
};

/**
 * Classifica o nível de margem baseado no valor percentual
 * 
 * Critérios:
 * - BAIXA: 0-33%
 * - MÉDIA: 33-66%
 * - ALTA: 66-100%
 */
function classifyMarginLevel(margin: number): MarginLevel {
  if (margin < 33) return "BAIXA";
  if (margin < 66) return "MÉDIA";
  return "ALTA";
}

/**
 * Classifica o nível de giro/velocidade baseado no valor percentual
 * 
 * Critérios:
 * - BAIXO: 0-33%
 * - MÉDIO: 33-66%
 * - ALTO: 66-100%
 */
function classifyVelocityLevel(velocity: number): VelocityLevel {
  if (velocity < 33) return "BAIXO";
  if (velocity < 66) return "MÉDIO";
  return "ALTO";
}

/**
 * Converte o enum para formato legível em português
 */
export function formatShelfZone(zone: ShelfZone): string {
  const zoneMap: Record<ShelfZone, string> = {
    ALTURA_DOS_OLHOS: "Altura dos Olhos",
    ALTURA_DAS_MÃOS: "Altura das Mãos",
    PARTE_DE_BAIXO: "Parte de Baixo",
  };
  return zoneMap[zone];
}

export function formatClassification(classification: ProductClassification): string {
  const classificationMap: Record<ProductClassification, string> = {
    PRODUTO_EM_RISCO_DE_DESCARTE: "Produto em Risco de Descarte",
    PRODUTO_DE_MASSA_REAVALIACAO: "Produto de Massa - Reavaliação",
    PRODUTO_DE_MASSA: "Produto de Massa",
    ITEM_DE_MASSA_NECESSÁRIO: "Item de Massa: Necessário",
    PRODUTO_NECESSÁRIO_GERADOR_TRÁFEGO: "Produto Necessário: Gerador de Tráfego",
    NICHO_DE_MERCADO: "Nicho de Mercado",
    PRODUTO_FOCO: "Produto Foco",
    GERADOR_DE_CAIXA: "Gerador de Caixa",
  };
  return classificationMap[classification];
}

export function formatSpaceExpansionPriority(priority: SpaceExpansionPriority): string {
  return priority.replace(/_/g, " ");
}

/**
 * Gera a justificativa/reasoning para a recomendação
 */
function generateReasoning(
  marginLevel: MarginLevel,
  velocityLevel: VelocityLevel,
  classification: ProductClassification,
  primaryPosition: ShelfZone
): string {
  const classificationText = formatClassification(classification);
  const positionText = formatShelfZone(primaryPosition);

  const reasoningMap: Record<ProductClassification, string> = {
    PRODUTO_EM_RISCO_DE_DESCARTE:
      "Produto com baixa margem e baixo giro. Recomenda-se reavaliação de continuidade ou descarte. Posicione na parte de baixo para minimizar visibilidade.",
    PRODUTO_DE_MASSA_REAVALIACAO:
      "Produto de massa com margem baixa/média e giro baixo/médio. Recomenda-se reavaliação de continuidade ou promoção para aumentar giro.",
    PRODUTO_DE_MASSA:
      "Produto de massa com alta demanda (giro alto) mas margem baixa. Use como atração de clientes e complemente com produtos de maior margem.",
    ITEM_DE_MASSA_NECESSÁRIO:
      "Produto necessário com giro médio. Mantenha na altura das mãos para fácil acesso e visibilidade moderada.",
    PRODUTO_NECESSÁRIO_GERADOR_TRÁFEGO:
      "Produto necessário com alta demanda. Posicione na altura dos olhos para máxima visibilidade e atração de clientes.",
    NICHO_DE_MERCADO:
      "Produto de nicho com alta margem mas baixa demanda. Mantenha visibilidade moderada na altura das mãos.",
    PRODUTO_FOCO:
      "Produto estratégico com alta margem e giro médio. Posicione na altura dos olhos para maximizar visibilidade e vendas.",
    GERADOR_DE_CAIXA:
      "Melhor cenário: alta margem e alto giro. Posicione na altura dos olhos com máxima visibilidade e espaço.",
  };

  return reasoningMap[classification] || "";
}

/**
 * Gera recomendação completa para um produto
 */
export function generateProductRecommendation(metrics: ProductMetrics): ProductRecommendation {
  // Classificar níveis
  const marginLevel = classifyMarginLevel(metrics.margin);
  const velocityLevel = classifyVelocityLevel(metrics.velocity);

  // Buscar posicionamentos nas matrizes
  const primaryPosition = primaryPositionMatrix[marginLevel][velocityLevel];
  const secondaryPosition = secondaryPositionMatrix[marginLevel][velocityLevel];
  const classification = classificationMatrix[marginLevel][velocityLevel];
  const spaceExpansionPriority = spaceExpansionMatrix[marginLevel][velocityLevel];

  // Gerar reasoning
  const reasoning = generateReasoning(marginLevel, velocityLevel, classification, primaryPosition);

  return {
    productId: metrics.productId,
    productName: metrics.productName,
    margin: metrics.margin,
    velocity: metrics.velocity,
    marginLevel,
    velocityLevel,
    primaryPosition,
    secondaryPosition,
    classification,
    spaceExpansionPriority,
    reasoning,
  };
}

/**
 * Gera recomendações para múltiplos produtos
 */
export function generateBulkRecommendations(
  products: ProductMetrics[]
): ProductRecommendation[] {
  return products.map((product) => generateProductRecommendation(product));
}

/**
 * Agrupa produtos por classificação
 */
export function groupByClassification(
  recommendations: ProductRecommendation[]
): Record<ProductClassification, ProductRecommendation[]> {
  const grouped: Record<ProductClassification, ProductRecommendation[]> = {
    PRODUTO_EM_RISCO_DE_DESCARTE: [],
    PRODUTO_DE_MASSA_REAVALIACAO: [],
    PRODUTO_DE_MASSA: [],
    ITEM_DE_MASSA_NECESSÁRIO: [],
    PRODUTO_NECESSÁRIO_GERADOR_TRÁFEGO: [],
    NICHO_DE_MERCADO: [],
    PRODUTO_FOCO: [],
    GERADOR_DE_CAIXA: [],
  };

  recommendations.forEach((rec) => {
    grouped[rec.classification].push(rec);
  });

  return grouped;
}

/**
 * Agrupa produtos por zona de posicionamento
 */
export function groupByPrimaryPosition(
  recommendations: ProductRecommendation[]
): Record<ShelfZone, ProductRecommendation[]> {
  const grouped: Record<ShelfZone, ProductRecommendation[]> = {
    ALTURA_DOS_OLHOS: [],
    ALTURA_DAS_MÃOS: [],
    PARTE_DE_BAIXO: [],
  };

  recommendations.forEach((rec) => {
    grouped[rec.primaryPosition].push(rec);
  });

  return grouped;
}

/**
 * Calcula estatísticas das recomendações
 */
export function calculateRecommendationStats(recommendations: ProductRecommendation[]) {
  const total = recommendations.length;
  const byClassification = groupByClassification(recommendations);
  const byPosition = groupByPrimaryPosition(recommendations);

  return {
    total,
    byClassification: Object.entries(byClassification).reduce(
      (acc, [key, items]) => ({
        ...acc,
        [key]: items.length,
      }),
      {} as Record<ProductClassification, number>
    ),
    byPosition: Object.entries(byPosition).reduce(
      (acc, [key, items]) => ({
        ...acc,
        [key]: items.length,
      }),
      {} as Record<ShelfZone, number>
    ),
  };
}

/**
 * Exporta recomendações em formato CSV
 */
export function exportRecommendationsToCSV(recommendations: ProductRecommendation[]): string {
  const headers = [
    "ID Produto",
    "Nome Produto",
    "Margem (%)",
    "Giro (%)",
    "Nível Margem",
    "Nível Giro",
    "Posição Principal",
    "Posição Secundária",
    "Classificação",
    "Prioridade Aumento Espaço",
  ];

  const rows = recommendations.map((rec) => [
    rec.productId,
    rec.productName,
    rec.margin.toFixed(2),
    rec.velocity.toFixed(2),
    rec.marginLevel,
    rec.velocityLevel,
    formatShelfZone(rec.primaryPosition),
    formatShelfZone(rec.secondaryPosition),
    formatClassification(rec.classification),
    formatSpaceExpansionPriority(rec.spaceExpansionPriority),
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  return csv;
}
