/**
 * Rectangle-based pathfinding for supermarket floor plan
 * Detects black-bordered rectangles as obstacles and finds paths around them
 */

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RectanglePathfindingConfig {
  imageData: ImageData;
  rectangles: Rectangle[];
  cellSize: number;
  padding: number; // Padding around rectangles to ensure clearance
}

export class RectanglePathfinder {
  private imageData: ImageData;
  private rectangles: Rectangle[];
  private cellSize: number;
  private padding: number;
  private walkableCache: Map<string, boolean> = new Map();

  constructor(config: RectanglePathfindingConfig) {
    this.imageData = config.imageData;
    this.rectangles = config.rectangles;
    this.cellSize = config.cellSize;
    this.padding = config.padding;
  }

  /**
   * Check if a point is inside any rectangle obstacle
   */
  private isInsideRectangle(x: number, y: number): boolean {
    for (const rect of this.rectangles) {
      const x1 = rect.x - this.padding;
      const y1 = rect.y - this.padding;
      const x2 = rect.x + rect.w + this.padding;
      const y2 = rect.y + rect.h + this.padding;

      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a cell is walkable (not inside any rectangle)
   */
  private isWalkableCell(gridX: number, gridY: number): boolean {
    const cacheKey = `${gridX},${gridY}`;
    if (this.walkableCache.has(cacheKey)) {
      return this.walkableCache.get(cacheKey)!;
    }

    const pixelX = gridX * this.cellSize + this.cellSize / 2;
    const pixelY = gridY * this.cellSize + this.cellSize / 2;

    // Check if point is inside any rectangle
    const walkable = !this.isInsideRectangle(pixelX, pixelY);

    this.walkableCache.set(cacheKey, walkable);
    return walkable;
  }

  /**
   * Heuristic for A* (Euclidean distance)
   */
  private heuristic(a: Point, b: Point): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
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

    const maxIterations = 10000;
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

        // Convert back to pixel coordinates and smooth path
        return this.smoothPath(
          path.map((p) => ({
            x: p.x * this.cellSize + this.cellSize / 2,
            y: p.y * this.cellSize + this.cellSize / 2,
          }))
        );
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

  /**
   * Smooth path by removing unnecessary waypoints
   */
  private smoothPath(path: Point[]): Point[] {
    if (path.length <= 2) return path;

    const smoothed: Point[] = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
      const prev = smoothed[smoothed.length - 1];
      const current = path[i];
      const next = path[i + 1];

      // Check if we can skip current point
      if (!this.lineIntersectsObstacle(prev, next)) {
        // Can skip, continue
        continue;
      }

      // Can't skip, add current point
      smoothed.push(current);
    }

    // Always add the last point
    smoothed.push(path[path.length - 1]);

    return smoothed;
  }

  /**
   * Check if a line segment intersects any rectangle obstacle
   */
  private lineIntersectsObstacle(p1: Point, p2: Point): boolean {
    // Check multiple points along the line
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;

      if (this.isInsideRectangle(x, y)) {
        return true;
      }
    }
    return false;
  }
}
