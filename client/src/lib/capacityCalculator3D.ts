import { Module, Shelf } from '@shared/types/storeMapping';

export interface Capacity3DResult {
  totalCapacityVolume: number; // cm³
  totalOccupiedVolume: number; // cm³
  occupancyPercentage: number; // 0-100
  frontsPerProduct: Record<string, number>; // product name -> number of fronts
  shelfCapacities: ShelfCapacity[];
}

export interface ShelfCapacity {
  shelfId: string;
  order: number;
  capacityVolume: number; // cm³
  occupiedVolume: number; // cm³
  occupancyPercentage: number;
  frontsPerProduct: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  dimensions: {
    width: number; // cm
    depth: number; // cm
    height: number; // cm
  };
  quantity: number; // number of units
}

/**
 * Calcula a capacidade 3D de um módulo considerando:
 * - Volume total do módulo (Largura × Profundidade × Altura)
 * - Volume de cada produto (Largura × Profundidade × Altura)
 * - Quantidade de frentes (fronts) que cada produto ocupa
 */
export function calculateModuleCapacity3D(
  module: Module,
  products: Product[]
): Capacity3DResult {
  // Calcula volume total do módulo
  const moduleVolume = module.dimensions.width * module.dimensions.depth * module.dimensions.height;

  // Calcula ocupação por produto
  const frontsPerProduct: Record<string, number> = {};
  let totalOccupiedVolume = 0;

  products.forEach(product => {
    const productVolume = product.dimensions.width * product.dimensions.depth * product.dimensions.height;
    
    // Número de frentes = quantidade de produtos que cabem
    const fronts = Math.floor(moduleVolume / productVolume) * product.quantity;
    frontsPerProduct[product.name] = fronts;
    
    // Volume ocupado = volume do produto × quantidade
    totalOccupiedVolume += productVolume * product.quantity;
  });

  const occupancyPercentage = (totalOccupiedVolume / moduleVolume) * 100;

  return {
    totalCapacityVolume: moduleVolume,
    totalOccupiedVolume,
    occupancyPercentage: Math.min(occupancyPercentage, 100),
    frontsPerProduct,
    shelfCapacities: [],
  };
}

/**
 * Calcula a capacidade 3D por prateleira
 * Considera que cada prateleira tem a mesma largura e profundidade do módulo
 * mas altura diferente (shelfHeight)
 */
export function calculateShelfCapacity3D(
  module: Module,
  shelf: Shelf,
  products: Product[]
): ShelfCapacity {
  // Volume da prateleira = Largura × Profundidade × Altura
  const shelfVolume = shelf.dimensions.width * shelf.dimensions.depth * shelf.dimensions.height;

  const frontsPerProduct: Record<string, number> = {};
  let totalOccupiedVolume = 0;

  products.forEach(product => {
    const productVolume = product.dimensions.width * product.dimensions.depth * product.dimensions.height;
    
    // Número de frentes que cabem nesta prateleira
    const fronts = Math.floor(shelfVolume / productVolume) * product.quantity;
    frontsPerProduct[product.name] = fronts;
    
    // Volume ocupado
    totalOccupiedVolume += productVolume * product.quantity;
  });

  const occupancyPercentage = (totalOccupiedVolume / shelfVolume) * 100;

  return {
    shelfId: shelf.id,
    order: shelf.order,
    capacityVolume: shelfVolume,
    occupiedVolume: totalOccupiedVolume,
    occupancyPercentage: Math.min(occupancyPercentage, 100),
    frontsPerProduct,
  };
}

/**
 * Calcula o número de frentes que um produto ocupa em uma prateleira
 * Frente = unidade visual de um produto na gôndola
 * 
 * Fórmula: (Largura da Prateleira / Largura do Produto) × (Profundidade da Prateleira / Profundidade do Produto) × (Altura da Prateleira / Altura do Produto)
 */
export function calculateProductFronts(
  shelfWidth: number, // cm
  shelfDepth: number, // cm
  shelfHeight: number, // cm
  productWidth: number, // cm
  productDepth: number, // cm
  productHeight: number, // cm
  quantity: number = 1
): number {
  const frontsHorizontal = Math.floor(shelfWidth / productWidth);
  const frontsDepth = Math.floor(shelfDepth / productDepth);
  const frontsVertical = Math.floor(shelfHeight / productHeight);

  const totalFronts = frontsHorizontal * frontsDepth * frontsVertical;
  
  return Math.max(totalFronts * quantity, 1); // Mínimo de 1 frente
}

/**
 * Distribui produtos em prateleiras considerando capacidade 3D
 * Retorna alocação de produtos por prateleira
 */
export function distributeProductsAcrossShelves3D(
  module: Module,
  products: Product[]
): Map<string, Product[]> {
  const distribution = new Map<string, Product[]>();

  // Inicializa mapa com prateleiras vazias
  module.shelves.forEach(shelf => {
    distribution.set(shelf.id, []);
  });

  // Ordena prateleiras de cima para baixo
  const sortedShelves = [...module.shelves].sort((a, b) => a.order - b.order);

  // Distribui produtos
  let productIndex = 0;
  let currentShelfIndex = 0;

  while (productIndex < products.length && currentShelfIndex < sortedShelves.length) {
    const shelf = sortedShelves[currentShelfIndex];
    const product = products[productIndex];

    const shelfProducts = distribution.get(shelf.id) || [];
    shelfProducts.push(product);
    distribution.set(shelf.id, shelfProducts);

    productIndex++;
    currentShelfIndex = (currentShelfIndex + 1) % sortedShelves.length;
  }

  return distribution;
}

/**
 * Calcula o espaço necessário para armazenar um produto
 * Retorna o volume total necessário
 */
export function calculateProductSpaceRequired(
  product: Product
): number {
  const productVolume = product.dimensions.width * product.dimensions.depth * product.dimensions.height;
  return productVolume * product.quantity;
}

/**
 * Valida se um produto cabe em uma prateleira
 */
export function canProductFitInShelf(
  product: Product,
  shelf: Shelf
): boolean {
  return (
    product.dimensions.width <= shelf.dimensions.width &&
    product.dimensions.depth <= shelf.dimensions.depth &&
    product.dimensions.height <= shelf.dimensions.height
  );
}

/**
 * Calcula o percentual de ocupação de uma prateleira
 */
export function calculateShelfOccupancy(
  shelf: Shelf,
  products: Product[]
): number {
  const shelfVolume = shelf.dimensions.width * shelf.dimensions.depth * shelf.dimensions.height;
  let occupiedVolume = 0;

  products.forEach(product => {
    const productVolume = product.dimensions.width * product.dimensions.depth * product.dimensions.height;
    occupiedVolume += productVolume * product.quantity;
  });

  return Math.min((occupiedVolume / shelfVolume) * 100, 100);
}
