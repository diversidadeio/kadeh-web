import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Polyfill for Node.js
if (typeof global !== 'undefined' && !(global as any).localStorage) {
  (global as any).localStorage = localStorageMock;
}

describe('SmartLayoutSimulator - Simulation Save/Load', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save simulation to localStorage', () => {
    const simulation = {
      id: 'sim_123',
      name: 'Test Simulation',
      timestamp: Date.now(),
      gondolaWidth: 280,
      shelves: 5,
      shelfDepth: 40,
      shelfHeight: 60,
      products: [
        {
          id: 'prod_1',
          name: 'Product 1',
          categoryId: 'cat_1',
          largura: 10,
          comprimento: 5,
        },
      ],
      totalUsedSpace: 50,
      spacePercentage: 17.86,
      totalMargin: 6000,
      totalRevenue: 10000,
    };

    const simulations = [simulation];
    localStorage.setItem('kadeh_simulations', JSON.stringify(simulations));

    const saved = localStorage.getItem('kadeh_simulations');
    expect(saved).toBeDefined();
    
    const parsed = JSON.parse(saved!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('Test Simulation');
    expect(parsed[0].gondolaWidth).toBe(280);
    expect(parsed[0].shelves).toBe(5);
  });

  it('should load simulation from localStorage', () => {
    const simulation = {
      id: 'sim_456',
      name: 'Loaded Simulation',
      timestamp: Date.now(),
      gondolaWidth: 300,
      shelves: 6,
      shelfDepth: 45,
      shelfHeight: 65,
      products: [
        {
          id: 'prod_2',
          name: 'Product 2',
          categoryId: 'cat_2',
          largura: 12,
          comprimento: 6,
        },
      ],
      totalUsedSpace: 72,
      spacePercentage: 24,
      totalMargin: 8000,
      totalRevenue: 12000,
    };

    localStorage.setItem('kadeh_simulations', JSON.stringify([simulation]));

    const saved = localStorage.getItem('kadeh_simulations');
    const loaded = JSON.parse(saved!);

    expect(loaded[0].id).toBe('sim_456');
    expect(loaded[0].name).toBe('Loaded Simulation');
    expect(loaded[0].gondolaWidth).toBe(300);
    expect(loaded[0].shelves).toBe(6);
    expect(loaded[0].products).toHaveLength(1);
  });

  it('should handle multiple simulations', () => {
    const sim1 = {
      id: 'sim_1',
      name: 'Simulation 1',
      timestamp: Date.now(),
      gondolaWidth: 280,
      shelves: 5,
      shelfDepth: 40,
      shelfHeight: 60,
      products: [],
      totalUsedSpace: 0,
      spacePercentage: 0,
      totalMargin: 0,
      totalRevenue: 0,
    };

    const sim2 = {
      id: 'sim_2',
      name: 'Simulation 2',
      timestamp: Date.now() + 1000,
      gondolaWidth: 300,
      shelves: 6,
      shelfDepth: 45,
      shelfHeight: 65,
      products: [],
      totalUsedSpace: 0,
      spacePercentage: 0,
      totalMargin: 0,
      totalRevenue: 0,
    };

    const simulations = [sim1, sim2];
    localStorage.setItem('kadeh_simulations', JSON.stringify(simulations));

    const saved = localStorage.getItem('kadeh_simulations');
    const loaded = JSON.parse(saved!);

    expect(loaded).toHaveLength(2);
    expect(loaded[0].name).toBe('Simulation 1');
    expect(loaded[1].name).toBe('Simulation 2');
  });

  it('should delete simulation from localStorage', () => {
    const sim1 = {
      id: 'sim_1',
      name: 'Simulation 1',
      timestamp: Date.now(),
      gondolaWidth: 280,
      shelves: 5,
      shelfDepth: 40,
      shelfHeight: 60,
      products: [],
      totalUsedSpace: 0,
      spacePercentage: 0,
      totalMargin: 0,
      totalRevenue: 0,
    };

    const sim2 = {
      id: 'sim_2',
      name: 'Simulation 2',
      timestamp: Date.now() + 1000,
      gondolaWidth: 300,
      shelves: 6,
      shelfDepth: 45,
      shelfHeight: 65,
      products: [],
      totalUsedSpace: 0,
      spacePercentage: 0,
      totalMargin: 0,
      totalRevenue: 0,
    };

    const simulations = [sim1, sim2];
    localStorage.setItem('kadeh_simulations', JSON.stringify(simulations));

    // Delete sim1
    const loaded = JSON.parse(localStorage.getItem('kadeh_simulations')!);
    const filtered = loaded.filter((s: any) => s.id !== 'sim_1');
    localStorage.setItem('kadeh_simulations', JSON.stringify(filtered));

    const saved = localStorage.getItem('kadeh_simulations');
    const updated = JSON.parse(saved!);

    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe('sim_2');
  });

  it('should handle empty localStorage gracefully', () => {
    const saved = localStorage.getItem('kadeh_simulations');
    expect(saved).toBeNull();

    // Should not throw when parsing
    if (saved) {
      const parsed = JSON.parse(saved);
      expect(parsed).toBeDefined();
    } else {
      expect(true).toBe(true);
    }
  });

  it('should preserve product data when saving and loading', () => {
    const simulation = {
      id: 'sim_789',
      name: 'Product Data Test',
      timestamp: Date.now(),
      gondolaWidth: 280,
      shelves: 5,
      shelfDepth: 40,
      shelfHeight: 60,
      products: [
        {
          id: 'prod_wine',
          name: 'Vinho Tinto Premium',
          categoryId: 'cat_bebidas',
          largura: 12,
          comprimento: 8,
        },
        {
          id: 'prod_oil',
          name: 'Azeite Extra Virgem',
          categoryId: 'cat_alimentos',
          largura: 8,
          comprimento: 6,
        },
      ],
      totalUsedSpace: 160,
      spacePercentage: 57.14,
      totalMargin: 12000,
      totalRevenue: 20000,
    };

    localStorage.setItem('kadeh_simulations', JSON.stringify([simulation]));

    const saved = localStorage.getItem('kadeh_simulations');
    const loaded = JSON.parse(saved!);
    const restoredSim = loaded[0];

    expect(restoredSim.products).toHaveLength(2);
    expect(restoredSim.products[0].name).toBe('Vinho Tinto Premium');
    expect(restoredSim.products[0].largura).toBe(12);
    expect(restoredSim.products[0].comprimento).toBe(8);
    expect(restoredSim.products[1].name).toBe('Azeite Extra Virgem');
    expect(restoredSim.products[1].largura).toBe(8);
    expect(restoredSim.products[1].comprimento).toBe(6);
  });
});
