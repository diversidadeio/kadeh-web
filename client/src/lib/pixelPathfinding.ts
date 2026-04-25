/**
 * Pixel-based A* pathfinding for supermarket floor plan
 * Works directly with image pixels to detect walkable areas
 */

export interface Point {
  x: number;
  y: number;
}

export interface PathfindingConfig {
  imageData: ImageData;
  brightnessThreshold: number;
  saturationThreshold: number;
  cellSize: number;
}

export class PixelPathfinder {
  private imageData: ImageData;
  private brightnessThreshold: number;
  private saturationThreshold: number;
  private cellSize: number;
  private walkableCache: Map<string, boolean> = new Map();

  constructor(config: PathfindingConfig) {
    this.imageData = config.imageData;
    this.brightnessThreshold = config.brightnessThreshold;
    this.saturationThreshold = config.saturationThreshold;
    this.cellSize = config.cellSize;
  }

  /**
   * Check if a pixel is walkable (light gray/white, low saturation)
   */
  private isWalkablePixel(x: number, y: number): boolean {
    const cacheKey = `${x},${y}`;
    if (this.walkableCache.has(cacheKey)) {
      return this.walkableCache.get(cacheKey)!;
    }

    const data = this.imageData.data;
    const width = this.imageData.width;
    const idx = (Math.floor(y) * width + Math.floor(x)) * 4;

    if (idx < 0 || idx >= data.length - 3) {
      return false;
    }

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Calculate brightness
    const brightness = (r + g + b) / 3;

    // Calculate saturation
    const max_c = Math.max(r, g, b);
    const min_c = Math.min(r, g, b);
    const saturation = max_c > 0 ? (max_c - min_c) / max_c : 0;

    // Walkable if bright and low saturation, OR very low saturation
    const walkable =
      (brightness > this.brightnessThreshold && saturation < this.saturationThreshold) ||
      (brightness > 100 && saturation < 0.05);

    this.walkableCache.set(cacheKey, walkable);
    return walkable;
  }

  /**
   * Check if a cell (grid point) is walkable
   */
  private isWalkableCell(gridX: number, gridY: number): boolean {
    const pixelX = gridX * this.cellSize;
    const pixelY = gridY * this.cellSize;

    // Check multiple points in the cell
    let walkableCount = 0;
    const checkPoints = 4;

    for (let i = 0; i < checkPoints; i++) {
      const offsetX = (i % 2) * (this.cellSize - 1);
      const offsetY = Math.floor(i / 2) * (this.cellSize - 1);

      if (this.isWalkablePixel(pixelX + offsetX, pixelY + offsetY)) {
        walkableCount++;
      }
    }

    return walkableCount >= 2; // At least 50% of sample points must be walkable
  }

  /**
   * Heuristic for A* (Manhattan distance)
   */
  private heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  /**
   * Find path from start to goal using A*
   */
  findPath(startPixel: Point, goalPixel: Point): Point[] | null {
    // Convert to grid coordinates
    const start: Point = {
      x: Math.floor(startPixel.x / this.cellSize),
      y: Math.floor(startPixel.y / this.cellSize),
    };

    const goal: Point = {
      x: Math.floor(goalPixel.x / this.cellSize),
      y: Math.floor(goalPixel.y / this.cellSize),
    };

    // Check if start and goal are walkable
    if (!this.isWalkableCell(start.x, start.y) || !this.isWalkableCell(goal.x, goal.y)) {
      return null;
    }

    const openSet: Array<{ f: number; point: Point }> = [];
    const cameFrom: Map<string, Point> = new Map();
    const gScore: Map<string, number> = new Map();
    const fScore: Map<string, number> = new Map();
    const visited: Set<string> = new Set();

    const pointKey = (p: Point) => `${p.x},${p.y}`;

    gScore.set(pointKey(start), 0);
    const h = this.heuristic(start, goal);
    fScore.set(pointKey(start), h);
    openSet.push({ f: h, point: start });

    const maxIterations = 5000;
    let iterations = 0;

    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;

      // Find node with lowest f score
      let current: Point = openSet[0].point;
      let currentIdx = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[currentIdx].f) {
          currentIdx = i;
          current = openSet[i].point;
        }
      }

      if (current.x === goal.x && current.y === goal.y) {
        // Reconstruct path
        const path: Point[] = [];
        let curr = goal;
        while (cameFrom.has(pointKey(curr))) {
          path.unshift(curr);
          curr = cameFrom.get(pointKey(curr))!;
        }
        path.unshift(start);

        // Convert back to pixel coordinates
        return path.map((p) => ({
          x: p.x * this.cellSize + this.cellSize / 2,
          y: p.y * this.cellSize + this.cellSize / 2,
        }));
      }

      openSet.splice(currentIdx, 1);
      visited.add(pointKey(current));

      // Check 8 neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;

          const neighbor: Point = { x: current.x + dx, y: current.y + dy };
          const neighborKey = pointKey(neighbor);

          if (visited.has(neighborKey)) continue;

          // Check bounds
          const maxX = Math.floor(this.imageData.width / this.cellSize);
          const maxY = Math.floor(this.imageData.height / this.cellSize);
          if (neighbor.x < 0 || neighbor.x >= maxX || neighbor.y < 0 || neighbor.y >= maxY) {
            continue;
          }

          // Check if walkable
          if (!this.isWalkableCell(neighbor.x, neighbor.y)) continue;

          // Calculate cost
          const cost = dx !== 0 && dy !== 0 ? 1.4 : 1;
          const tentativeG = gScore.get(pointKey(current))! + cost;

          if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)!) {
            cameFrom.set(neighborKey, current);
            gScore.set(neighborKey, tentativeG);
            const f = tentativeG + this.heuristic(neighbor, goal);
            fScore.set(neighborKey, f);

            if (!visited.has(neighborKey)) {
              openSet.push({ f, point: neighbor });
            }
          }
        }
      }
    }

    return null; // No path found
  }
}
