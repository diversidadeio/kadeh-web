/**
 * Margin and Velocity Converter Utility
 * Converts between categorical (Baixa/Média/Alta) and numeric (0-100%) representations
 */

export type MarginCategory = "Baixa" | "Média" | "Alta";
export type VelocityCategory = "Baixo" | "Médio" | "Alto";
export type MarginCategoryEN = "Low" | "Medium" | "High";
export type VelocityCategoryEN = "Low" | "Medium" | "High";

/**
 * Convert categorical margin to numeric percentage
 */
export function marginCategoryToPercentage(
  category: MarginCategory | MarginCategoryEN,
  language: "pt" | "en" = "pt"
): number {
  if (language === "pt") {
    const map: Record<MarginCategory, number> = { "Baixa": 33, "Média": 66, "Alta": 100 };
    return map[category as MarginCategory] || 66;
  }
  const map: Record<MarginCategoryEN, number> = { "Low": 33, "Medium": 66, "High": 100 };
  return map[category as MarginCategoryEN] || 66;
}

/**
 * Convert numeric percentage to categorical margin
 */
export function marginPercentageToCategory(
  percentage: number,
  language: "pt" | "en" = "pt"
): MarginCategory | MarginCategoryEN {
  if (percentage <= 33) {
    return language === "pt" ? "Baixa" : "Low";
  }
  if (percentage <= 66) {
    return language === "pt" ? "Média" : "Medium";
  }
  return language === "pt" ? "Alta" : "High";
}

/**
 * Convert categorical velocity to numeric percentage
 */
export function velocityCategoryToPercentage(
  category: VelocityCategory | VelocityCategoryEN,
  language: "pt" | "en" = "pt"
): number {
  if (language === "pt") {
    const map: Record<VelocityCategory, number> = { "Baixo": 33, "Médio": 66, "Alto": 100 };
    return map[category as VelocityCategory] || 66;
  }
  const map: Record<VelocityCategoryEN, number> = { "Low": 33, "Medium": 66, "High": 100 };
  return map[category as VelocityCategoryEN] || 66;
}

/**
 * Convert numeric percentage to categorical velocity
 */
export function velocityPercentageToCategory(
  percentage: number,
  language: "pt" | "en" = "pt"
): VelocityCategory | VelocityCategoryEN {
  if (percentage <= 33) {
    return language === "pt" ? "Baixo" : "Low";
  }
  if (percentage <= 66) {
    return language === "pt" ? "Médio" : "Medium";
  }
  return language === "pt" ? "Alto" : "High";
}

/**
 * Get all margin categories in specified language
 */
export function getMarginCategories(language: "pt" | "en" = "pt"): (MarginCategory | MarginCategoryEN)[] {
  return language === "pt"
    ? ["Baixa", "Média", "Alta"]
    : ["Low", "Medium", "High"];
}

/**
 * Get all velocity categories in specified language
 */
export function getVelocityCategories(language: "pt" | "en" = "pt"): (VelocityCategory | VelocityCategoryEN)[] {
  return language === "pt"
    ? ["Baixo", "Médio", "Alto"]
    : ["Low", "Medium", "High"];
}

/**
 * Get margin description based on percentage
 */
export function getMarginDescription(
  percentage: number,
  language: "pt" | "en" = "pt"
): string {
  const category = marginPercentageToCategory(percentage, language);
  
  if (language === "pt") {
    const map: Record<MarginCategory, string> = {
      "Baixa": "Baixa margem - Produtos com lucro reduzido",
      "Média": "Margem média - Produtos com lucro moderado",
      "Alta": "Alta margem - Produtos com alto lucro",
    };
    return map[category as MarginCategory] || "";
  }
  
  const map: Record<MarginCategoryEN, string> = {
    "Low": "Low margin - Products with reduced profit",
    "Medium": "Medium margin - Products with moderate profit",
    "High": "High margin - Products with high profit",
  };
  return map[category as MarginCategoryEN] || "";
}

/**
 * Get velocity description based on percentage
 */
export function getVelocityDescription(
  percentage: number,
  language: "pt" | "en" = "pt"
): string {
  const category = velocityPercentageToCategory(percentage, language);
  
  if (language === "pt") {
    const map: Record<VelocityCategory, string> = {
      "Baixo": "Baixo giro - Produtos com rotatividade lenta",
      "Médio": "Giro médio - Produtos com rotatividade moderada",
      "Alto": "Alto giro - Produtos com alta rotatividade",
    };
    return map[category as VelocityCategory] || "";
  }
  
  const map: Record<VelocityCategoryEN, string> = {
    "Low": "Low velocity - Products with slow turnover",
    "Medium": "Medium velocity - Products with moderate turnover",
    "High": "High velocity - Products with high turnover",
  };
  return map[category as VelocityCategoryEN] || "";
}

/**
 * Get recommended shelf zone based on margin and velocity percentages
 */
export function getRecommendedZone(
  marginPercentage: number,
  velocityPercentage: number,
  language: "pt" | "en" = "pt"
): string {
  // Portuguese zones
  if (language === "pt") {
    // High velocity + High margin = Eye level (best position)
    if (velocityPercentage > 66 && marginPercentage > 66) {
      return "Altura dos olhos";
    }
    // High velocity + Low margin = Eye level
    if (velocityPercentage > 66 && marginPercentage <= 33) {
      return "Altura dos olhos";
    }
    // High velocity + Medium margin = Eye level
    if (velocityPercentage > 66) {
      return "Altura dos olhos";
    }
    // Low velocity + High margin = Hand level (premium spot)
    if (velocityPercentage <= 33 && marginPercentage > 66) {
      return "Altura das mãos";
    }
    // Medium velocity = Hand level
    if (velocityPercentage > 33 && velocityPercentage <= 66) {
      return "Altura das mãos";
    }
    // Low velocity + Low margin = Bottom
    return "Parte de Baixo";
  }

  // English zones
  // High velocity + High margin = Eye level (best position)
  if (velocityPercentage > 66 && marginPercentage > 66) {
    return "Eye Level";
  }
  // High velocity + Low margin = Eye level
  if (velocityPercentage > 66 && marginPercentage <= 33) {
    return "Eye Level";
  }
  // High velocity + Medium margin = Eye level
  if (velocityPercentage > 66) {
    return "Eye Level";
  }
  // Low velocity + High margin = Hand level (premium spot)
  if (velocityPercentage <= 33 && marginPercentage > 66) {
    return "Hand Level";
  }
  // Medium velocity = Hand level
  if (velocityPercentage > 33 && velocityPercentage <= 66) {
    return "Hand Level";
  }
  // Low velocity + Low margin = Bottom
  return "Bottom Shelf";
}

/**
 * Validate percentage value
 */
export function isValidPercentage(value: number): boolean {
  return typeof value === "number" && value >= 0 && value <= 100;
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

/**
 * Get color code for margin percentage (for visualization)
 */
export function getMarginColor(percentage: number): string {
  if (percentage <= 33) return "#ef4444"; // Red - Low
  if (percentage <= 66) return "#f59e0b"; // Amber - Medium
  return "#10b981"; // Green - High
}

/**
 * Get color code for velocity percentage (for visualization)
 */
export function getVelocityColor(percentage: number): string {
  if (percentage <= 33) return "#6366f1"; // Indigo - Low
  if (percentage <= 66) return "#8b5cf6"; // Violet - Medium
  return "#ec4899"; // Pink - High
}
