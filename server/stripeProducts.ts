/**
 * Stripe Products and Prices for Kadeh Ads
 * Data from Stripe Dashboard - 1 Day Campaign Packages
 */

export const KADEH_ADS_PRODUCTS = {
  // Product ID from Stripe
  productId: 'prod_U9urHxcGkTMaIv',
  productName: 'Kadeh Ads - 1 Dia',
  
  // Price tiers for different store quantities (1 day duration)
  prices: {
    // 1-5 lojas
    '1-5': {
      priceId: 'price_1TBb1TFyI5BjRSkNEHUYk2vE',
      stores: '1-5 lojas',
      amount: 10000, // R$ 100.00 in cents
      currency: 'brl',
      multiplier: 1.0,
    },
    // 6-20 lojas
    '6-20': {
      priceId: 'price_1TBb1TFyI5BjRSkN9j6x0aA9',
      stores: '6-20 lojas',
      amount: 15000, // R$ 150.00 in cents
      currency: 'brl',
      multiplier: 1.5,
    },
    // 21-50 lojas
    '21-50': {
      priceId: 'price_1TBb1TFyI5BjRSkN0egZhfui',
      stores: '21-50 lojas',
      amount: 20000, // R$ 200.00 in cents
      currency: 'brl',
      multiplier: 2.0,
    },
    // 50+ lojas
    '50+': {
      priceId: 'price_1TBb1TFyI5BjRSkNhtQjOZ4Y',
      stores: '50+ lojas',
      amount: 25000, // R$ 250.00 in cents
      currency: 'brl',
      multiplier: 2.5,
    },
  },
};

/**
 * Get price by store quantity range
 */
export function getPriceByStores(storeRange: string) {
  const key = storeRange as keyof typeof KADEH_ADS_PRODUCTS.prices;
  return KADEH_ADS_PRODUCTS.prices[key];
}

/**
 * Get all available prices
 */
export function getAllPrices() {
  return Object.values(KADEH_ADS_PRODUCTS.prices);
}

/**
 * Format amount to BRL currency
 */
export function formatBRL(amountInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}
