/**
 * Dados de preços para o simulador de custos do Kadeh Ads
 * Baseado na planilha: kadeh_tabela_combinacoes_final.xlsx
 * Fórmula: (Valor da duração × Multiplicador de lojas) + Valor dos produtos
 */

export const DURATION_PRICES = {
  "1day": 1000,
  "3days": 2700,
  "5days": 4000,
  "7days": 4900,
} as const;

export const STORE_MULTIPLIERS = {
  "1-5": 1.0,
  "6-20": 1.5,
  "21-50": 2.0,
  "50+": 2.5,
} as const;

export const PRODUCT_PACKAGES = {
  "1": 100,
  "3": 270,
  "5": 350,
  "10": 500,
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
  durationLabels: DURATION_LABELS,
  storeLabels: STORE_LABELS,
  productLabels: PRODUCT_LABELS,
} as const;
