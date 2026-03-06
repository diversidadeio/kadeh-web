/**
 * Store Mapping System Types
 * Types for store layout, modules, shelves, and product placement
 */

// ============================================================================
// STORE TYPES
// ============================================================================

export type StoreLayoutType = "linear" | "grid" | "custom";
export type MeasurementUnit = "m" | "cm";

export interface StoreDimensions {
  width: number; // in cm
  length: number; // in cm
  height: number; // in cm
  unit: MeasurementUnit;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  dimensions: StoreDimensions;
  layoutType: StoreLayoutType;
  corridors: Corridor[];
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CORRIDOR TYPES
// ============================================================================

export interface CorridorDimensions {
  width: number; // in cm
  length: number; // in cm
}

export interface Corridor {
  id: string;
  storeId: string;
  name: string;
  position: {
    x: number; // in cm
    y: number; // in cm
  };
  dimensions: CorridorDimensions;
  moduleIds: string[];
  order: number;
}

// ============================================================================
// MODULE/FIXTURE TYPES
// ============================================================================

export type ModuleType =
  | "gondola"
  | "freezer_horizontal"
  | "freezer_vertical"
  | "island"
  | "produce_stand"
  | "hanging_display";

export type ExposureZone =
  | "Altura dos olhos"
  | "Altura das mãos"
  | "Parte de Baixo";

export interface ModuleTemplate {
  id: string;
  name: string;
  type: ModuleType;
  description?: string;
  defaultDimensions: ModuleDimensions;
  defaultShelves: number;
  isCustomizable: boolean;
}

export interface ModuleDimensions {
  width: number; // in cm (front width)
  depth: number; // in cm (shelf depth)
  height: number; // in cm (total height)
  shelfHeight?: number; // in cm (height between shelves)
}

export interface Shelf {
  id: string;
  moduleId: string;
  order: number; // 1 = top, 5 = bottom
  dimensions: {
    width: number; // in cm
    depth: number; // in cm
    height: number; // in cm (space above shelf)
  };
  zone: ExposureZone;
  capacity: number; // in cm³
  occupiedSpace: number; // in cm³
  products: ShelfProduct[];
}

export interface Module {
  id: string;
  storeId: string;
  corridorId?: string;
  templateId?: string;
  name: string;
  type: ModuleType;
  position: {
    x: number; // in cm
    y: number; // in cm
  };
  dimensions: ModuleDimensions;
  shelves: Shelf[];
  totalCapacity: number; // in cm³
  totalOccupied: number; // in cm³
  occupancyPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface ProductDimensions {
  width: number; // in cm
  depth: number; // in cm
  height: number; // in cm
}

export interface ShelfProduct {
  id: string;
  productId: string;
  productName: string;
  category: string;
  dimensions: ProductDimensions;
  giro: "A" | "B" | "C"; // Velocity: High, Medium, Low
  margem: "A" | "B" | "C"; // Margin: High, Medium, Low
  zone: ExposureZone;
  quantity: number; // number of units
  volume: number; // in cm³ (width × depth × height × quantity)
}

export interface ProductPlacement {
  id: string;
  storeId: string;
  moduleId: string;
  shelfId: string;
  productId: string;
  quantity: number;
  zone: ExposureZone;
  position: {
    order: number; // left to right
  };
}

// ============================================================================
// CAPACITY CALCULATION TYPES
// ============================================================================

export interface CapacityCalculation {
  shelfId: string;
  shelfDimensions: {
    width: number;
    depth: number;
    height: number;
  };
  shelfCapacity: number; // in cm³
  products: {
    productId: string;
    productName: string;
    dimensions: ProductDimensions;
    quantity: number;
    volume: number; // in cm³
    percentageOfShelf: number;
  }[];
  totalOccupied: number; // in cm³
  totalAvailable: number; // in cm³
  occupancyPercentage: number;
}

export interface ModuleCapacityReport {
  moduleId: string;
  moduleName: string;
  type: ModuleType;
  totalCapacity: number; // in cm³
  totalOccupied: number; // in cm³
  occupancyPercentage: number;
  shelves: CapacityCalculation[];
  recommendations: string[];
}

export interface StoreCapacityReport {
  storeId: string;
  storeName: string;
  totalCapacity: number; // in cm³
  totalOccupied: number; // in cm³
  occupancyPercentage: number;
  modules: ModuleCapacityReport[];
  summary: {
    totalProducts: number;
    totalModules: number;
    averageOccupancy: number;
    underutilizedModules: string[];
    overutilizedModules: string[];
  };
}

// ============================================================================
// SMART LAYOUT INTEGRATION TYPES
// ============================================================================

export interface SmartLayoutSuggestion {
  moduleId: string;
  shelfId: string;
  zone: ExposureZone;
  recommendedProducts: {
    productId: string;
    productName: string;
    suggestedQuantity: number;
    reasoning: string; // e.g., "High margin + High velocity"
  }[];
  estimatedOccupancy: number;
}

export interface StoreOptimizationSuggestion {
  storeId: string;
  suggestions: SmartLayoutSuggestion[];
  estimatedImpact: {
    salesIncrease: number; // percentage
    profitIncrease: number; // percentage
    rupturReduction: number; // percentage
  };
}

// ============================================================================
// VISUALIZATION TYPES
// ============================================================================

export interface ModuleVisualization {
  moduleId: string;
  moduleName: string;
  type: ModuleType;
  shelves: {
    shelfId: string;
    order: number;
    zone: ExposureZone;
    products: {
      productId: string;
      productName: string;
      quantity: number;
      width: number;
      color?: string;
    }[];
  }[];
}

export interface StoreFloorPlan {
  storeId: string;
  storeName: string;
  dimensions: StoreDimensions;
  corridors: {
    corridorId: string;
    name: string;
    position: { x: number; y: number };
    dimensions: CorridorDimensions;
    modules: {
      moduleId: string;
      name: string;
      type: ModuleType;
      position: { x: number; y: number };
      dimensions: ModuleDimensions;
    }[];
  }[];
}
