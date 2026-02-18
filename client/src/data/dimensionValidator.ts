/**
 * Dimension Validator for Smart Layout
 * Validates product dimensions and shelf compatibility
 */

export interface DimensionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  maxProductsPerShelf: number;
  maxProductsPerDepth: number;
}

export interface RetailTemplate {
  id: string;
  name: string;
  description: string;
  gondolaWidth: number;
  numberOfShelves: number;
  shelfDepth: number;
  shelfHeight: number;
  recommendedProductCount: number;
  targetMargin: number;
  targetRevenue: number;
}

const RETAIL_TEMPLATES: RetailTemplate[] = [
  {
    id: "supermarket",
    name: "Supermercado",
    description: "Configuração otimizada para supermercados com alta rotatividade",
    gondolaWidth: 400,
    numberOfShelves: 6,
    shelfDepth: 45,
    shelfHeight: 55,
    recommendedProductCount: 12,
    targetMargin: 0.25,
    targetRevenue: 5000,
  },
  {
    id: "pharmacy",
    name: "Farmácia",
    description: "Layout compacto para farmácias com produtos de menor volume",
    gondolaWidth: 280,
    numberOfShelves: 5,
    shelfDepth: 35,
    shelfHeight: 50,
    recommendedProductCount: 8,
    targetMargin: 0.35,
    targetRevenue: 2000,
  },
  {
    id: "convenience",
    name: "Loja de Conveniência",
    description: "Gôndola compacta para lojas de conveniência e pequenos estabelecimentos",
    gondolaWidth: 200,
    numberOfShelves: 4,
    shelfDepth: 30,
    shelfHeight: 45,
    recommendedProductCount: 5,
    targetMargin: 0.4,
    targetRevenue: 1500,
  },
  {
    id: "specialty",
    name: "Loja Especializada",
    description: "Layout para lojas especializadas com produtos premium",
    gondolaWidth: 320,
    numberOfShelves: 4,
    shelfDepth: 40,
    shelfHeight: 60,
    recommendedProductCount: 10,
    targetMargin: 0.45,
    targetRevenue: 3500,
  },
  {
    id: "warehouse",
    name: "Warehouse/Cash & Carry",
    description: "Gôndola grande para lojas de atacado e warehouse",
    gondolaWidth: 500,
    numberOfShelves: 7,
    shelfDepth: 50,
    shelfHeight: 60,
    recommendedProductCount: 20,
    targetMargin: 0.15,
    targetRevenue: 8000,
  },
];

/**
 * Validate product dimensions against shelf configuration
 */
export function validateProductDimensions(
  productWidth: number,
  productDepth: number,
  shelfWidth: number,
  shelfDepth: number,
  shelfHeight: number
): DimensionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if product fits on shelf
  if (productWidth <= 0 || productDepth <= 0 || productWidth > 100 || productDepth > 100) {
    errors.push("Dimensões do produto inválidas (0-100 cm)");
  }

  if (productWidth > shelfWidth) {
    errors.push(`Largura do produto (${productWidth}cm) maior que a gôndola (${shelfWidth}cm)`);
  }

  if (productDepth > shelfDepth) {
    errors.push(`Profundidade do produto (${productDepth}cm) maior que a prateleira (${shelfDepth}cm)`);
  }

  // Calculate capacity
  const maxProductsPerShelf = Math.floor(shelfWidth / productWidth);
  const maxProductsPerDepth = Math.floor(shelfDepth / productDepth);
  const maxProductsPerShelfRow = Math.max(1, maxProductsPerShelf * maxProductsPerDepth);

  // Warnings for suboptimal configurations
  if (maxProductsPerShelf < 2) {
    warnings.push("Apenas 1 produto por linha - considere reduzir tamanho ou aumentar gôndola");
  }

  if ((shelfWidth % productWidth) / shelfWidth > 0.2) {
    warnings.push("Espaço desperdiçado na largura - considere ajustar dimensões");
  }

  if ((shelfDepth % productDepth) / shelfDepth > 0.2) {
    warnings.push("Espaço desperdiçado na profundidade - considere ajustar dimensões");
  }

  // Check shelf height for stacking
  if (productWidth > shelfHeight) {
    warnings.push("Altura do produto maior que espaço entre prateleiras - considere aumentar altura");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    maxProductsPerShelf: maxProductsPerShelfRow,
    maxProductsPerDepth,
  };
}

/**
 * Get all available retail templates
 */
export function getRetailTemplates(): RetailTemplate[] {
  return RETAIL_TEMPLATES;
}

/**
 * Get retail template by ID
 */
export function getRetailTemplate(id: string): RetailTemplate | undefined {
  return RETAIL_TEMPLATES.find((t) => t.id === id);
}

/**
 * Calculate optimal shelf configuration based on product mix
 */
export function calculateOptimalConfiguration(
  averageProductWidth: number,
  averageProductDepth: number,
  targetProductCount: number,
  targetMargin: number
): Partial<RetailTemplate> {
  // Calculate minimum gondola width needed
  const minWidth = Math.ceil(averageProductWidth * Math.sqrt(targetProductCount)) + 20;
  const minDepth = Math.ceil(averageProductDepth * 1.5) + 10;
  const minHeight = Math.ceil(averageProductWidth * 1.2) + 10;

  // Calculate number of shelves needed
  const productsPerShelfRow = Math.floor(minWidth / averageProductWidth);
  const shelves = Math.ceil(targetProductCount / productsPerShelfRow);

  return {
    gondolaWidth: Math.min(Math.max(minWidth, 200), 500),
    numberOfShelves: Math.min(Math.max(shelves, 3), 10),
    shelfDepth: Math.min(Math.max(minDepth, 30), 60),
    shelfHeight: Math.min(Math.max(minHeight, 45), 80),
    recommendedProductCount: targetProductCount,
    targetMargin,
  };
}

/**
 * Get validation messages in specific language
 */
export function getValidationMessages(
  validation: DimensionValidation,
  language: "pt" | "en"
): { errors: string[]; warnings: string[] } {
  const translations = {
    pt: {
      invalidDimensions: "Dimensões do produto inválidas (0-100 cm)",
      widthExceeded: "Largura do produto maior que a gôndola",
      depthExceeded: "Profundidade do produto maior que a prateleira",
      singleProduct: "Apenas 1 produto por linha - considere reduzir tamanho",
      wastedWidth: "Espaço desperdiçado na largura",
      wastedDepth: "Espaço desperdiçado na profundidade",
      heightIssue: "Altura do produto maior que espaço entre prateleiras",
    },
    en: {
      invalidDimensions: "Invalid product dimensions (0-100 cm)",
      widthExceeded: "Product width exceeds gondola width",
      depthExceeded: "Product depth exceeds shelf depth",
      singleProduct: "Only 1 product per line - consider reducing size",
      wastedWidth: "Wasted space in width",
      wastedDepth: "Wasted space in depth",
      heightIssue: "Product height exceeds shelf spacing",
    },
  };

  return {
    errors: validation.errors,
    warnings: validation.warnings,
  };
}
