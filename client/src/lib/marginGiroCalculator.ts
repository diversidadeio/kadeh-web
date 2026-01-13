/**
 * Utilitário para cálculo de margem e giro
 * Suporta valores categóricos (Baixa/Média/Alta) e numéricos com média ponderada
 */

interface MarginGiroData {
  margem: "Baixa" | "Média" | "Alta" | number;
  giro: "Baixo" | "Médio" | "Alto" | number;
  precoVenda?: number;
}

// Mapeamento de categorias para valores numéricos (para cálculo de média)
const MARGEM_RANGES = {
  "Baixa": { min: 0, max: 15, mid: 10 },
  "Média": { min: 15, max: 30, mid: 22.5 },
  "Alta": { min: 30, max: 100, mid: 50 },
};

const GIRO_RANGES = {
  "Baixo": { min: 0, max: 1, mid: 0.5 },
  "Médio": { min: 1, max: 3, mid: 2 },
  "Alto": { min: 3, max: 10, mid: 5 },
};

/**
 * Converte categoria em valor numérico para cálculo
 */
export function categoryToNumeric(
  value: "Baixa" | "Média" | "Alta" | "Baixo" | "Médio" | "Alto" | number,
  type: "margem" | "giro"
): number {
  if (typeof value === "number") return value;

  if (type === "margem") {
    const ranges = MARGEM_RANGES as Record<string, { mid: number }>;
    return ranges[value]?.mid || 0;
  } else {
    const ranges = GIRO_RANGES as Record<string, { mid: number }>;
    return ranges[value]?.mid || 0;
  }
}

/**
 * Converte valor numérico em categoria
 */
export function numericToCategory(
  value: number,
  type: "margem" | "giro"
): string {
  if (type === "margem") {
    if (value < 15) return "Baixa";
    if (value < 30) return "Média";
    return "Alta";
  } else {
    if (value < 1) return "Baixo";
    if (value < 3) return "Médio";
    return "Alto";
  }
}

/**
 * Calcula média ponderada de margem
 * Peso: preço de venda (produtos mais caros têm maior peso)
 */
export function calculateWeightedMargin(
  products: Array<{ margem: "Baixa" | "Média" | "Alta" | number; precoVenda: number }>
): number {
  if (products.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  products.forEach((product) => {
    const numericMargem = categoryToNumeric(product.margem, "margem");
    const weight = product.precoVenda;
    
    weightedSum += numericMargem * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calcula média ponderada de giro
 * Peso: preço de venda (produtos mais caros têm maior peso)
 */
export function calculateWeightedGiro(
  products: Array<{ giro: "Baixo" | "Médio" | "Alto" | number; precoVenda: number }>
): number {
  if (products.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  products.forEach((product) => {
    const numericGiro = categoryToNumeric(product.giro, "giro");
    const weight = product.precoVenda;
    
    weightedSum += numericGiro * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calcula margem e giro agregados para um grupo de produtos
 */
export function calculateAggregateMetrics(
  products: MarginGiroData[]
): {
  avgMargin: number;
  avgGiro: number;
  marginCategory: "Baixa" | "Média" | "Alta";
  giroCategory: "Baixo" | "Médio" | "Alto";
} {
  if (products.length === 0) {
    return {
      avgMargin: 0,
      avgGiro: 0,
      marginCategory: "Média",
      giroCategory: "Médio",
    };
  }

  // Simples média aritmética se não houver preço
  const avgMargin = products.reduce((sum, p) => {
    return sum + categoryToNumeric(p.margem, "margem");
  }, 0) / products.length;

  const avgGiro = products.reduce((sum, p) => {
    return sum + categoryToNumeric(p.giro, "giro");
  }, 0) / products.length;

  return {
    avgMargin: parseFloat(avgMargin.toFixed(2)),
    avgGiro: parseFloat(avgGiro.toFixed(2)),
    marginCategory: numericToCategory(avgMargin, "margem") as "Baixa" | "Média" | "Alta",
    giroCategory: numericToCategory(avgGiro, "giro") as "Baixo" | "Médio" | "Alto",
  };
}

/**
 * Formata valor numérico para exibição
 */
export function formatMetricValue(value: number, type: "margem" | "giro"): string {
  if (type === "margem") {
    return `${value.toFixed(1)}%`;
  } else {
    return `${value.toFixed(1)}x`;
  }
}
