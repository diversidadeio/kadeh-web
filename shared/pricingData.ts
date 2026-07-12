/**
 * Dados de preços para o simulador de custos do Kadeh Ads
 * Baseado na planilha: kadeh_tabela_combinacoes_final.xlsx
 * Fórmula: (Valor da duração × Multiplicador de lojas) + Valor dos produtos
 */

export const DURATION_PRICES = {
  "1day": 1500,
  "3days": 4000,
  "5days": 5000,
  "7days": 6300,
} as const;

export const STORE_MULTIPLIERS = {
  "1-5": 1.0,
  "6-20": 1.5,
  "21-50": 2.0,
  "50+": 2.5,
} as const;

export const PRODUCT_PACKAGES = {
  "1": 400,
  "3": 1080,
  "5": 1400,
  "10": 2000,
} as const;

// Recurring subscription: 3 packages with 50% discount
export const RECURRING_PACKAGES = {
  "1": 600, // 3 × 400 × 0.5
  "3": 1620, // 3 × 1080 × 0.5
  "5": 2100, // 3 × 1400 × 0.5
  "10": 3000, // 3 × 2000 × 0.5
} as const;

export const DURATION_LABELS = {
  "1day": "1 dia",
  "3days": "3 dias",
  "5days": "5 dias",
  "7days": "7 dias",
} as const;

export const STORE_LABELS = {
  "1-5": "De 1 a 5 lojas",
  "6-20": "De 6 a 20 lojas",
  "21-50": "De 21 a 50 lojas",
  "50+": "50+ lojas",
} as const;

export const PRODUCT_LABELS = {
  "1": "1 produto",
  "3": "3 produtos",
  "5": "5 produtos",
  "10": "10 produtos",
} as const;

export type DurationType = keyof typeof DURATION_PRICES;
export type StoreType = keyof typeof STORE_MULTIPLIERS;
export type ProductType = keyof typeof PRODUCT_PACKAGES;
export type RecurringType = "yes" | "no";

/**
 * Calcula o custo total da campanha
 * Fórmula: (Valor da duração × Multiplicador de lojas) + Valor dos produtos
 */
export function calculateCampaignCost(
  duration: DurationType,
  stores: StoreType,
  products: ProductType
): number {
  const durationPrice = DURATION_PRICES[duration];
  const storeMultiplier = STORE_MULTIPLIERS[stores];
  const productPrice = PRODUCT_PACKAGES[products];

  return durationPrice * storeMultiplier + productPrice;
}

/**
 * Retorna todos os dados de preços em um objeto único
 */
export const PRICING_DATA = {
  durations: DURATION_PRICES,
  stores: STORE_MULTIPLIERS,
  products: PRODUCT_PACKAGES,
  recurring: RECURRING_PACKAGES,
  durationLabels: DURATION_LABELS,
  storeLabels: STORE_LABELS,
  productLabels: PRODUCT_LABELS,
} as const;

/**
 * Calcula o custo com opção de recorrência
 * Recorrência: 3 pacotes com 50% de desconto
 */
export function calculateCampaignCostWithRecurring(
  duration: DurationType,
  stores: StoreType,
  products: ProductType,
  recurring: RecurringType = "no"
): number {
  const baseCost = calculateCampaignCost(duration, stores, products);
  
  if (recurring === "yes") {
    // 3 pacotes com 50% de desconto
    return baseCost * 3 * 0.5;
  }
  
  return baseCost;
}
