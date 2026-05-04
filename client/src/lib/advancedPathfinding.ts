/**
 * Advanced A* Pathfinding Algorithm
 * 
 * CRITICAL CONSTRAINTS:
 * - Routes ONLY use white floor areas (brightness > 200, saturation < 50)
 * - Routes NEVER pass over gondolas or products (colored areas with black borders)
 * - Routes ALWAYS contour obstacles
 * - Validates that no route crosses any product areas
 */

interface Point {
  x: number;
  y: number;
}

interface GridCell {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost
  parent?: GridCell;
}

export class AdvancedPathfinder {
  private imageData: ImageData | null = null;
  private grid: Uint8Array | null = null;
  private gridWidth: number = 0;
  private gridHeight: number = 0;
  private scale: number = 10; // 1 grid cell = 10x10 pixels
  private whiteThreshold = 200; // Brightness threshold for white
  private saturationThreshold = 50; // Saturation threshold for white

  /**
   * Initialize pathfinder with floor plan image
   */
  async initialize(imageUrl: string): Promise<boolean> {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.error("Failed to get canvas context");
            resolve(false);
            return;
          }

          ctx.drawImage(img, 0, 0);
          this.imageData = ctx.getImageData(0, 0, img.width, img.height);

          // Create walkability grid
          this.createWalkabilityGrid();
          resolve(true);
        };

        img.onerror = () => {
          console.error("Failed to load image");
          resolve(false);
        };

        img.src = imageUrl;
      });
    } catch (error) {
      console.error("Error initializing pathfinder:", error);
      return false;
    }
  }

  /**
   * Create walkability grid from image data
   * White areas = walkable (1), colored/dark areas = obstacles (0)
   */
  private createWalkabilityGrid(): void {
    if (!this.imageData) return;

    const data = this.imageData.data;
    const width = this.imageData.width;
    const height = this.imageData.height;

    this.gridWidth = Math.ceil(width / this.scale);
    this.gridHeight = Math.ceil(height / this.scale);
    this.grid = new Uint8Array(this.gridWidth * this.gridHeight);

    // Analyze each grid cell
    for (let gy = 0; gy < this.gridHeight; gy++) {
      for (let gx = 0; gx < this.gridWidth; gx++) {
        let whitePixels = 0;
        let totalPixels = 0;

        // Sample pixels in this grid cell
        for (let py = 0; py < this.scale; py++) {
          for (let px = 0; px < this.scale; px++) {
            const x = Math.min(gx * this.scale + px, width - 1);
            const y = Math.min(gy * this.scale + py, height - 1);
            const idx = (y * width + x) * 4;

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Calculate brightness and saturation
            const brightness = (r + g + b) / 3;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : ((max - min) / max) * 100;

            // White = high brightness, low saturation
            if (brightness > this.whiteThreshold && saturation < this.saturationThreshold) {
              whitePixels++;
            }

            totalPixels++;
          }
        }

        // Cell is walkable if > 70% white
        const walkableRatio = whitePixels / totalPixels;
        this.grid[gy * this.gridWidth + gx] = walkableRatio > 0.7 ? 1 : 0;
      }
    }

    console.log(
      `[Pathfinding] Grid created: ${this.gridWidth}x${this.gridHeight} cells`
    );
  }

  /**
   * Check if a grid cell is walkable
   */
  private isWalkable(x: number, y: number): boolean {
    if (!this.grid) return false;
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return false;
    return this.grid[y * this.gridWidth + x] === 1;
  }

  /**
   * Heuristic function (Manhattan distance)
   */
  private heuristic(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  /**
   * Find path between two points using A*
   * Returns path in pixel coordinates
   */
  findPath(startPixel: Point, endPixel: Point): Point[] | null {
    if (!this.grid) {
      console.error("Pathfinder not initialized");
      return null;
    }

    // Convert pixel coordinates to grid coordinates
    const startGrid = {
      x: Math.floor(startPixel.x / this.scale),
      y: Math.floor(startPixel.y / this.scale),
    };

    const endGrid = {
      x: Math.floor(endPixel.x / this.scale),
      y: Math.floor(endPixel.y / this.scale),
    };

    // Validate start and end points
    if (!this.isWalkable(startGrid.x, startGrid.y)) {
      console.warn("Start point is not walkable");
      return null;
    }

    if (!this.isWalkable(endGrid.x, endGrid.y)) {
      console.warn("End point is not walkable");
      return null;
    }

    // A* algorithm
    const openSet: GridCell[] = [];
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, GridCell>();

    const startCell: GridCell = {
      x: startGrid.x,
      y: startGrid.y,
      g: 0,
      h: this.heuristic(startGrid.x, startGrid.y, endGrid.x, endGrid.y),
      f: this.heuristic(startGrid.x, startGrid.y, endGrid.x, endGrid.y),
    };

    openSet.push(startCell);

    while (openSet.length > 0) {
      // Find node with lowest f score
      let current = openSet[0];
      let currentIdx = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
          currentIdx = i;
        }
      }

      if (current.x === endGrid.x && current.y === endGrid.y) {
        // Reconstruct path
        const path: Point[] = [];
        let node: GridCell | undefined = current;

        while (node) {
          path.unshift({
            x: node.x * this.scale + this.scale / 2,
            y: node.y * this.scale + this.scale / 2,
          });

          const key = `${node.x},${node.y}`;
          node = cameFrom.get(key);
        }

        return this.smoothPath(path);
      }

      openSet.splice(currentIdx, 1);
      closedSet.add(`${current.x},${current.y}`);

      // Check 8 neighbors
      const neighbors = [
        { dx: 0, dy: 1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
      ];

      for (const { dx, dy } of neighbors) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        const key = `${nx},${ny}`;

        if (!this.isWalkable(nx, ny) || closedSet.has(key)) continue;

        const isDiagonal = dx !== 0 && dy !== 0;
        const g = current.g + (isDiagonal ? 1.414 : 1);
        const h = this.heuristic(nx, ny, endGrid.x, endGrid.y);

        const neighbor: GridCell = {
          x: nx,
          y: ny,
          g,
          h,
          f: g + h,
        };

        // Check if neighbor is already in open set
        const existingIdx = openSet.findIndex((n) => n.x === nx && n.y === ny);

        if (existingIdx === -1) {
          openSet.push(neighbor);
          cameFrom.set(key, current);
        } else if (g < openSet[existingIdx].g) {
          openSet[existingIdx] = neighbor;
          cameFrom.set(key, current);
        }
      }
    }

    console.warn("No path found");
    return null;
  }

  /**
   * Smooth path by removing unnecessary waypoints
   */
  private smoothPath(path: Point[]): Point[] {
    if (path.length <= 2) return path;

    const smoothed: Point[] = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
      const prev = smoothed[smoothed.length - 1];
      const curr = path[i];
      const next = path[i + 1];

      // Check if current point is necessary
      const dx1 = curr.x - prev.x;
      const dy1 = curr.y - prev.y;
      const dx2 = next.x - curr.x;
      const dy2 = next.y - curr.y;

      const cross = dx1 * dy2 - dy1 * dx2;
      const dot = dx1 * dx2 + dy1 * dy2;

      // If cross product is small, points are collinear
      if (Math.abs(cross) > 1) {
        smoothed.push(curr);
      }
    }

    smoothed.push(path[path.length - 1]);
    return smoothed;
  }

  /**
   * Validate that a path only uses white floor areas
   */
  validatePath(path: Point[]): boolean {
    if (!this.imageData) return false;

    const data = this.imageData.data;
    const width = this.imageData.width;
    const height = this.imageData.height;

    for (const point of path) {
      const x = Math.floor(point.x);
      const y = Math.floor(point.y);

      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const brightness = (r + g + b) / 3;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : ((max - min) / max) * 100;

      // Check if point is on white floor
      if (brightness <= this.whiteThreshold || saturation >= this.saturationThreshold) {
        console.warn(
          `Path validation failed at (${x}, ${y}): brightness=${brightness.toFixed(1)}, saturation=${saturation.toFixed(1)}`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate path distance
   */
  calculateDistance(path: Point[]): number {
    if (path.length < 2) return 0;

    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      distance += Math.sqrt(dx * dx + dy * dy);
    }

    return distance;
  }
}
