/**
 * Utilitário para calcular número de frentes de produtos na gôndola
 * baseado em percentual de espaço, largura de produtos e largura total da gôndola
 */

export interface FrontCalculationInput {
  productWidth: number; // Largura do produto em cm
  percentageOfGondola: number; // Percentual do espaço na gôndola (0-100)
  totalGondolaWidth: number; // Largura total da gôndola em cm
  numberOfShelves: number; // Número de prateleiras
}

export interface FrontCalculationOutput {
  numberOfFronts: number; // Número de frentes do produto
  widthUsed: number; // Largura total usada pelo produto (cm)
  remainingWidth: number; // Largura restante na gôndola (cm)
  frontsPerShelf: number; // Número de frentes por prateleira
  isValid: boolean; // Se o cálculo é válido (não excede largura total)
  message: string; // Mensagem descritiva
}

/**
 * Calcula o número de frentes de um produto na gôndola
 */
export function calculateFronts(input: FrontCalculationInput): FrontCalculationOutput {
  const {
    productWidth,
    percentageOfGondola,
    totalGondolaWidth,
    numberOfShelves,
  } = input;

  // Calcular espaço alocado para este produto
  const allocatedWidth = (percentageOfGondola / 100) * totalGondolaWidth;

  // Calcular número de frentes (quantas vezes o produto cabe no espaço alocado)
  const numberOfFronts = Math.floor(allocatedWidth / productWidth);

  // Calcular largura realmente usada
  const widthUsed = numberOfFronts * productWidth;

  // Calcular largura restante
  const remainingWidth = totalGondolaWidth - widthUsed;

  // Calcular frentes por prateleira
  const frontsPerShelf = numberOfShelves > 0 ? Math.ceil(numberOfFronts / numberOfShelves) : numberOfFronts;

  // Validar se o cálculo é válido
  const isValid = widthUsed <= totalGondolaWidth && numberOfFronts > 0;

  // Gerar mensagem descritiva
  let message = '';
  if (!isValid) {
    if (numberOfFronts === 0) {
      message = `Produto muito largo (${productWidth}cm) para o espaço alocado (${allocatedWidth.toFixed(1)}cm)`;
    } else {
      message = `Espaço insuficiente na gôndola`;
    }
  } else {
    message = `${numberOfFronts} frentes (${frontsPerShelf} por prateleira) usando ${widthUsed.toFixed(1)}cm de ${totalGondolaWidth}cm`;
  }

  return {
    numberOfFronts,
    widthUsed,
    remainingWidth,
    frontsPerShelf,
    isValid,
    message,
  };
}

/**
 * Calcula a distribuição de frentes para múltiplos produtos
 */
export interface ProductDistribution {
  productId: string;
  productName: string;
  productWidth: number;
  percentageOfGondola: number;
  fronts: FrontCalculationOutput;
}

export function calculateMultipleFronts(
  products: Array<{
    id: string;
    name: string;
    width: number;
    percentage: number;
  }>,
  totalGondolaWidth: number,
  numberOfShelves: number
): ProductDistribution[] {
  return products.map((product) => ({
    productId: product.id,
    productName: product.name,
    productWidth: product.width,
    percentageOfGondola: product.percentage,
    fronts: calculateFronts({
      productWidth: product.width,
      percentageOfGondola: product.percentage,
      totalGondolaWidth,
      numberOfShelves,
    }),
  }));
}

/**
 * Calcula o layout visual da gôndola com prateleiras
 */
export interface ShelfLayout {
  shelfNumber: number;
  products: Array<{
    productId: string;
    productName: string;
    fronts: number;
    widthUsed: number;
    position: number; // Posição horizontal na prateleira
  }>;
  totalWidthUsed: number;
  availableWidth: number;
}

export function calculateShelfLayout(
  products: ProductDistribution[],
  totalGondolaWidth: number,
  numberOfShelves: number
): ShelfLayout[] {
  const shelves: ShelfLayout[] = [];

  // Inicializar prateleiras (numeradas de baixo para cima)
  // Prateleira 1 = mais baixa, Prateleira N = mais alta
  for (let i = 0; i < numberOfShelves; i++) {
    const invertedShelfNumber = numberOfShelves - i; // Inverter: última posição = 1, primeira = N
    shelves.push({
      shelfNumber: invertedShelfNumber,
      products: [],
      totalWidthUsed: 0,
      availableWidth: totalGondolaWidth,
    });
  }

  // Distribuir produtos nas prateleiras
  let currentShelfIndex = 0;

  products.forEach((product) => {
    const { numberOfFronts, widthUsed } = product.fronts;

    for (let front = 0; front < numberOfFronts; front++) {
      const shelf = shelves[currentShelfIndex];

      // Se não cabe na prateleira atual, ir para próxima
      if (shelf.totalWidthUsed + product.productWidth > totalGondolaWidth) {
        currentShelfIndex = (currentShelfIndex + 1) % numberOfShelves;
      }

      const shelf2 = shelves[currentShelfIndex];
      shelf2.products.push({
        productId: product.productId,
        productName: product.productName,
        fronts: 1,
        widthUsed: product.productWidth,
        position: shelf2.totalWidthUsed,
      });

      shelf2.totalWidthUsed += product.productWidth;
      shelf2.availableWidth = totalGondolaWidth - shelf2.totalWidthUsed;
    }
  });

  return shelves;
}

/**
 * Gera descrição textual do layout da gôndola
 */
export function generateLayoutDescription(
  shelves: ShelfLayout[],
  language: 'pt' | 'en' = 'pt'
): string {
  const descriptions = shelves.map((shelf) => {
    const productList = shelf.products
      .map((p) => `${p.productName} (${p.widthUsed}cm)`)
      .join(', ');

    const shelfLabel = language === 'pt' ? 'Prateleira' : 'Shelf';
    const usedLabel = language === 'pt' ? 'Usado' : 'Used';
    const availableLabel = language === 'pt' ? 'Disponível' : 'Available';

    return `${shelfLabel} ${shelf.shelfNumber}: ${productList} | ${usedLabel}: ${shelf.totalWidthUsed}cm | ${availableLabel}: ${shelf.availableWidth.toFixed(1)}cm`;
  });

  return descriptions.join('\n');
}
