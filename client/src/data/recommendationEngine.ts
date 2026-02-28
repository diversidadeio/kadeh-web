/**
 * Intelligent Recommendation Engine for Smart Layout
 * Provides automated suggestions based on product mix, margins, and shelf configuration
 */

import { Category } from "./categories";

export interface Recommendation {
  shelfHeight: number;
  gondolaWidth: number;
  numberOfShelves: number;
  productSuggestions: Array<{
    categoryId: string;
    categoryName: string;
    recommendedQuadrants: number;
    reason: string;
  }>;
  expectedMargin: number;
  expectedRevenue: number;
  spaceEfficiency: number;
  confidence: number;
}

interface ProductMix {
  totalMargin: number;
  totalRevenue: number;
  highMarginCount: number;
  highVelocityCount: number;
  categories: Category[];
}

/**
 * Calculate optimal shelf height based on product dimensions
 */
export function recommendShelfHeight(categories: Category[]): number {
  if (categories.length === 0) return 60;

  const avgHeight = categories.reduce((sum, cat) => sum + (cat.defaultLargura || 10), 0) / categories.length;

  // Recommend height that allows 2-3 rows of products
  if (avgHeight <= 15) return 50; // Small products
  if (avgHeight <= 25) return 60; // Medium products
  if (avgHeight <= 40) return 70; // Large products
  return 80; // Very large products
}

/**
 * Calculate optimal gondola width based on product mix
 */
export function recommendGondolaWidth(categories: Category[], targetMargin: number = 0.3): number {
  if (categories.length === 0) return 280;

  // High margin products need more space
  const highMarginProducts = categories.filter((c) => c.curvaLucratividade === "A");
  const baseWidth = 200 + highMarginProducts.length * 20;

  return Math.min(Math.max(baseWidth, 200), 500);
}

/**
 * Calculate optimal number of shelves
 */
export function recommendNumberOfShelves(categories: Category[], availableHeight: number = 200): number {
  if (categories.length === 0) return 5;

  const avgProductHeight = categories.reduce((sum, cat) => sum + (cat.defaultLargura || 10), 0) / categories.length;
  const shelfHeight = 60; // Standard shelf height

  // Calculate how many products can fit vertically
  const productsPerShelf = Math.floor(shelfHeight / avgProductHeight);
  const requiredShelves = Math.ceil(categories.length / (productsPerShelf || 1));

  return Math.max(Math.min(requiredShelves + 1, 10), 3);
}

/**
 * Recommend product placement based on ABC curves and margins
 */
export function recommendProductPlacement(
  categories: Category[],
  gondolaWidth: number,
  numberOfShelves: number
): Array<{
  categoryId: string;
  categoryName: string;
  recommendedQuadrants: number;
  zone: string;
  reason: string;
}> {
  // Sort categories by strategic importance
  const sorted = [...categories].sort((a, b) => {
    // Priority: A-curve faturamento > A-curve lucratividade > B-curves > C-curves
    const aScore =
      (a.curvaFaturamento === "A" ? 3 : a.curvaFaturamento === "B" ? 2 : 1) +
      (a.curvaLucratividade === "A" ? 3 : a.curvaLucratividade === "B" ? 2 : 1);
    const bScore =
      (b.curvaFaturamento === "A" ? 3 : b.curvaFaturamento === "B" ? 2 : 1) +
      (b.curvaLucratividade === "A" ? 3 : b.curvaLucratividade === "B" ? 2 : 1);
    return bScore - aScore;
  });

  const recommendations: Array<{
    categoryId: string;
    categoryName: string;
    recommendedQuadrants: number;
    zone: string;
    reason: string;
  }> = [];

  sorted.forEach((category, index) => {
    let quadrants = 1;
    let zone = "Altura das mãos";
    let reason = "";

    // Determine quadrants based on curves
    if (category.curvaFaturamento === "A" && category.curvaLucratividade === "A") {
      quadrants = 3; // Strategic products get maximum space
      zone = "Altura dos olhos";
      reason = "Strategic product (High revenue & margin)";
    } else if (category.curvaFaturamento === "A") {
      quadrants = 2;
      zone = "Altura dos olhos";
      reason = "High revenue product";
    } else if (category.curvaLucratividade === "A") {
      quadrants = 2;
      zone = "Altura das mãos";
      reason = "High margin product";
    } else if (category.curvaFaturamento === "B" || category.curvaLucratividade === "B") {
      quadrants = 1;
      zone = "Altura das mãos";
      reason = "Supporting product";
    } else {
      quadrants = 1;
      zone = "Parte de Baixo";
      reason = "Low priority product";
    }

    // Adjust based on position in ranking
    if (index > sorted.length * 0.7) {
      quadrants = Math.max(quadrants - 1, 1);
      zone = "Parte de Baixo";
    }

    recommendations.push({
      categoryId: category.id,
      categoryName: category.name,
      recommendedQuadrants: quadrants,
      zone,
      reason,
    });
  });

  return recommendations;
}

/**
 * Generate comprehensive recommendation
 */
export function generateRecommendation(
  categories: Category[],
  currentGondolaWidth: number = 280,
  currentShelves: number = 5
): Recommendation {
  const recommendedHeight = recommendShelfHeight(categories);
  const recommendedWidth = recommendGondolaWidth(categories);
  const recommendedShelves = recommendNumberOfShelves(categories);
  const productSuggestions = recommendProductPlacement(categories, recommendedWidth, recommendedShelves);

  // Calculate expected metrics
  let expectedMargin = 0;
  let expectedRevenue = 0;

  productSuggestions.forEach((suggestion) => {
    const category = categories.find((c) => c.id === suggestion.categoryId);
    if (category) {
      // Estimate based on curves and quadrants
      const marginMultiplier = category.curvaLucratividade === "A" ? 1.5 : category.curvaLucratividade === "B" ? 1.0 : 0.7;
      const revenueMultiplier = category.curvaFaturamento === "A" ? 2.0 : category.curvaFaturamento === "B" ? 1.0 : 0.5;

      expectedMargin += suggestion.recommendedQuadrants * marginMultiplier * 100;
      expectedRevenue += suggestion.recommendedQuadrants * revenueMultiplier * 200;
    }
  });

  const totalQuadrants = productSuggestions.reduce((sum, p) => sum + p.recommendedQuadrants, 0);
  const spaceEfficiency = (totalQuadrants / (recommendedWidth / 20)) * 100;

  // Confidence based on product mix quality
  const highQualityProducts = categories.filter(
    (c) => c.curvaFaturamento === "A" || c.curvaLucratividade === "A"
  ).length;
  const confidence = Math.min(0.95, 0.5 + (highQualityProducts / Math.max(categories.length, 1)) * 0.45);

  return {
    shelfHeight: recommendedHeight,
    gondolaWidth: recommendedWidth,
    numberOfShelves: recommendedShelves,
    productSuggestions,
    expectedMargin,
    expectedRevenue,
    spaceEfficiency: Math.min(spaceEfficiency, 100),
    confidence,
  };
}

/**
 * Get explanation for recommendation
 */
export function getRecommendationExplanation(recommendation: Recommendation, language: "pt" | "en"): string {
  const translations = {
    pt: {
      title: "Recomendação Inteligente de Layout",
      shelfHeight: "Altura entre prateleiras recomendada",
      gondolaWidth: "Largura da gôndola recomendada",
      shelves: "Número de prateleiras recomendado",
      expectedMargin: "Margem esperada",
      expectedRevenue: "Faturamento esperado",
      spaceEfficiency: "Eficiência de espaço",
      confidence: "Confiança da recomendação",
      cm: "cm",
      percent: "%",
    },
    en: {
      title: "Intelligent Layout Recommendation",
      shelfHeight: "Recommended shelf height",
      gondolaWidth: "Recommended gondola width",
      shelves: "Recommended number of shelves",
      expectedMargin: "Expected margin",
      expectedRevenue: "Expected revenue",
      spaceEfficiency: "Space efficiency",
      confidence: "Recommendation confidence",
      cm: "cm",
      percent: "%",
    },
  };

  const t = translations[language];

  return `${t.title}:
- ${t.shelfHeight}: ${recommendation.shelfHeight}${t.cm}
- ${t.gondolaWidth}: ${recommendation.gondolaWidth}${t.cm}
- ${t.shelves}: ${recommendation.numberOfShelves}
- ${t.expectedMargin}: R$ ${recommendation.expectedMargin.toFixed(2)}
- ${t.expectedRevenue}: R$ ${recommendation.expectedRevenue.toFixed(2)}
- ${t.spaceEfficiency}: ${recommendation.spaceEfficiency.toFixed(0)}${t.percent}
- ${t.confidence}: ${(recommendation.confidence * 100).toFixed(0)}${t.percent}`;
}
