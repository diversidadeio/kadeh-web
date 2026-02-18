/**
 * Simulation Storage Service
 * Manages saving, loading, and managing Smart Layout simulations
 */

export interface SavedSimulation {
  id: string;
  name: string;
  description: string;
  timestamp: Date;
  data: {
    shelfWidth: number;
    shelfHeight: number;
    shelfDepth: number;
    numberOfShelves: number;
    products: Array<{
      id: string;
      name: string;
      category: string;
      subcategory: string;
      width: number;
      depth: number;
      velocity: string;
      margin: string;
      perShelf: number;
      naturalPoint: number;
      quadrants: number;
      zone: string;
    }>;
  };
  metrics: {
    totalMargin: number;
    totalRevenue: number;
    spaceEfficiency: number;
    productCount: number;
  };
}

const STORAGE_KEY = "kadeh_smart_layout_simulations";
const MAX_SIMULATIONS = 50;

/**
 * Simulation Storage Service Class
 */
export class SimulationStorageService {
  /**
   * Save a simulation
   */
  static saveSimulation(simulation: Omit<SavedSimulation, "id" | "timestamp">): SavedSimulation {
    const saved: SavedSimulation = {
      ...simulation,
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    const simulations = this.getAllSimulations();

    // Keep only the most recent MAX_SIMULATIONS
    if (simulations.length >= MAX_SIMULATIONS) {
      simulations.pop();
    }

    simulations.unshift(saved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));

    return saved;
  }

  /**
   * Get all saved simulations
   */
  static getAllSimulations(): SavedSimulation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const simulations = JSON.parse(data) as SavedSimulation[];
      // Convert timestamp strings back to Date objects
      return simulations.map((sim) => ({
        ...sim,
        timestamp: new Date(sim.timestamp),
      }));
    } catch (error) {
      console.error("Error loading simulations:", error);
      return [];
    }
  }

  /**
   * Get a specific simulation
   */
  static getSimulation(id: string): SavedSimulation | null {
    const simulations = this.getAllSimulations();
    return simulations.find((sim) => sim.id === id) || null;
  }

  /**
   * Update a simulation
   */
  static updateSimulation(id: string, updates: Partial<SavedSimulation>): SavedSimulation | null {
    const simulations = this.getAllSimulations();
    const index = simulations.findIndex((sim) => sim.id === id);

    if (index === -1) return null;

    const updated = {
      ...simulations[index],
      ...updates,
      id, // Keep original ID
      timestamp: simulations[index].timestamp, // Keep original timestamp
    };

    simulations[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));

    return updated;
  }

  /**
   * Delete a simulation
   */
  static deleteSimulation(id: string): boolean {
    const simulations = this.getAllSimulations();
    const filtered = simulations.filter((sim) => sim.id !== id);

    if (filtered.length === simulations.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Delete all simulations
   */
  static deleteAllSimulations(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Export simulations as JSON
   */
  static exportSimulations(): string {
    const simulations = this.getAllSimulations();
    return JSON.stringify(simulations, null, 2);
  }

  /**
   * Import simulations from JSON
   */
  static importSimulations(jsonData: string): number {
    try {
      const imported = JSON.parse(jsonData) as SavedSimulation[];

      if (!Array.isArray(imported)) {
        throw new Error("Invalid format: expected array of simulations");
      }

      const current = this.getAllSimulations();
      const combined = [...imported, ...current];

      // Keep only the most recent MAX_SIMULATIONS
      const limited = combined.slice(0, MAX_SIMULATIONS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      return imported.length;
    } catch (error) {
      console.error("Error importing simulations:", error);
      throw error;
    }
  }

  /**
   * Search simulations by name or description
   */
  static searchSimulations(query: string): SavedSimulation[] {
    const simulations = this.getAllSimulations();
    const lowerQuery = query.toLowerCase();

    return simulations.filter(
      (sim) =>
        sim.name.toLowerCase().includes(lowerQuery) ||
        sim.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get simulations sorted by date (most recent first)
   */
  static getSimulationsSortedByDate(limit?: number): SavedSimulation[] {
    const simulations = this.getAllSimulations();
    if (limit) {
      return simulations.slice(0, limit);
    }
    return simulations;
  }

  /**
   * Get simulations sorted by margin (highest first)
   */
  static getSimulationsSortedByMargin(limit?: number): SavedSimulation[] {
    const simulations = this.getAllSimulations().sort(
      (a, b) => b.metrics.totalMargin - a.metrics.totalMargin
    );
    if (limit) {
      return simulations.slice(0, limit);
    }
    return simulations;
  }

  /**
   * Get statistics about saved simulations
   */
  static getStatistics(): {
    totalSimulations: number;
    avgMargin: number;
    avgEfficiency: number;
    maxMargin: number;
    minMargin: number;
    oldestSimulation: SavedSimulation | null;
    newestSimulation: SavedSimulation | null;
  } {
    const simulations = this.getAllSimulations();

    if (simulations.length === 0) {
      return {
        totalSimulations: 0,
        avgMargin: 0,
        avgEfficiency: 0,
        maxMargin: 0,
        minMargin: 0,
        oldestSimulation: null,
        newestSimulation: null,
      };
    }

    const margins = simulations.map((s) => s.metrics.totalMargin);
    const efficiencies = simulations.map((s) => s.metrics.spaceEfficiency);

    return {
      totalSimulations: simulations.length,
      avgMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
      avgEfficiency: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
      maxMargin: Math.max(...margins),
      minMargin: Math.min(...margins),
      oldestSimulation: simulations[simulations.length - 1],
      newestSimulation: simulations[0],
    };
  }

  /**
   * Duplicate a simulation
   */
  static duplicateSimulation(id: string, newName: string): SavedSimulation | null {
    const original = this.getSimulation(id);
    if (!original) return null;

    return this.saveSimulation({
      name: newName,
      description: `Copy of: ${original.description}`,
      data: JSON.parse(JSON.stringify(original.data)), // Deep copy
      metrics: { ...original.metrics },
    });
  }

  /**
   * Compare two simulations
   */
  static compareSimulations(
    id1: string,
    id2: string
  ): {
    sim1: SavedSimulation | null;
    sim2: SavedSimulation | null;
    marginDifference: number;
    efficiencyDifference: number;
    productDifference: number;
  } | null {
    const sim1 = this.getSimulation(id1);
    const sim2 = this.getSimulation(id2);

    if (!sim1 || !sim2) return null;

    return {
      sim1,
      sim2,
      marginDifference: sim1.metrics.totalMargin - sim2.metrics.totalMargin,
      efficiencyDifference: sim1.metrics.spaceEfficiency - sim2.metrics.spaceEfficiency,
      productDifference: sim1.metrics.productCount - sim2.metrics.productCount,
    };
  }
}

// Export singleton instance
export const simulationStorage = SimulationStorageService;
