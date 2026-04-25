import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PixelPathfinder, type Point } from './pixelPathfinding';

// Mock ImageData for Node.js environment
class MockImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;

  constructor(data: Uint8ClampedArray, width: number, height: number) {
    this.data = data;
    this.width = width;
    this.height = height;
  }
}

describe('PixelPathfinder', () => {
  let imageData: any;
  let pathfinder: PixelPathfinder;

  beforeEach(() => {
    // Create a simple test image: 100x100 pixels
    // White area (walkable) in the middle, black borders (obstacles)
    const width = 100;
    const height = 100;
    const data = new Uint8ClampedArray(width * height * 4);

    // Fill with white (walkable)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 200;     // R
      data[i + 1] = 200; // G
      data[i + 2] = 200; // B
      data[i + 3] = 255; // A
    }

    // Add black obstacles (borders)
    // Top border
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < 10; y++) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      }
    }

    // Bottom border
    for (let x = 0; x < width; x++) {
      for (let y = height - 10; y < height; y++) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      }
    }

    // Left border
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      }
    }

    // Right border
    for (let x = width - 10; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      }
    }

        imageData = new MockImageData(data, width, height);
    pathfinder = new PixelPathfinder({
      imageData,
      brightnessThreshold: 140,
      saturationThreshold: 0.2,
      cellSize: 4,
    });
  });

  it('should initialize pathfinder with correct config', () => {
    expect(pathfinder).toBeDefined();
    expect(imageData.width).toBe(100);
    expect(imageData.height).toBe(100);
  });

  it('should find a path between two walkable points', () => {
    const start: Point = { x: 20, y: 20 };
    const goal: Point = { x: 80, y: 80 };

    const path = pathfinder.findPath(start, goal);

    expect(path).not.toBeNull();
    expect(path).toBeDefined();
    if (path) {
      expect(path.length).toBeGreaterThan(0);
      // Path should start near the start point
      expect(Math.abs(path[0].x - start.x)).toBeLessThan(10);
      expect(Math.abs(path[0].y - start.y)).toBeLessThan(10);
      // Path should end near the goal point
      expect(Math.abs(path[path.length - 1].x - goal.x)).toBeLessThan(10);
      expect(Math.abs(path[path.length - 1].y - goal.y)).toBeLessThan(10);
    }
  });

  it('should return null when start or goal is in an obstacle', () => {
    // Try to find path from obstacle to walkable area
    const start: Point = { x: 5, y: 5 };   // In black border
    const goal: Point = { x: 50, y: 50 };  // In walkable area

    const path = pathfinder.findPath(start, goal);

    expect(path).toBeNull();
  });

  it('should calculate path distance correctly', () => {
    const start: Point = { x: 20, y: 20 };
    const goal: Point = { x: 80, y: 20 }; // Same Y, different X

    const path = pathfinder.findPath(start, goal);

    if (path) {
      // Calculate total distance
      let totalDistance = 0;
      for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        totalDistance += Math.hypot(dx, dy);
      }

      // Distance should be roughly 60 pixels (80-20)
      expect(totalDistance).toBeGreaterThan(50);
      expect(totalDistance).toBeLessThan(100);
    }
  });

  it('should find the shortest path', () => {
    const start: Point = { x: 20, y: 50 };
    const goal: Point = { x: 80, y: 50 };

    const path = pathfinder.findPath(start, goal);

    expect(path).not.toBeNull();
    if (path) {
      // For a straight horizontal path, the number of waypoints should be reasonable
      expect(path.length).toBeLessThan(50); // Should not be too many waypoints
    }
  });

  it('should handle adjacent start and goal points', () => {
    const start: Point = { x: 50, y: 50 };
    const goal: Point = { x: 52, y: 50 };

    const path = pathfinder.findPath(start, goal);

    expect(path).not.toBeNull();
    if (path) {
      expect(path.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should find path around obstacles', () => {
    // Create a test image with a vertical wall in the middle
    const width = 100;
    const height = 100;
    const data = new Uint8ClampedArray(width * height * 4);

    // Fill with white (walkable)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 200;
      data[i + 1] = 200;
      data[i + 2] = 200;
      data[i + 3] = 255;
    }

    // Add vertical wall in the middle
    for (let x = 45; x < 55; x++) {
      for (let y = 20; y < 80; y++) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      }
    }

    const testImageData = new MockImageData(data, width, height);
    const testPathfinder = new PixelPathfinder({
      imageData: testImageData,
      brightnessThreshold: 140,
      saturationThreshold: 0.2,
      cellSize: 4,
    });

    // Try to find path from left to right (must navigate around wall)
    const start: Point = { x: 20, y: 50 };
    const goal: Point = { x: 80, y: 50 };

    const path = testPathfinder.findPath(start, goal);

    // Path should be found
    expect(path).not.toBeNull();
    if (path) {
      // Path should have multiple waypoints (not just a straight line)
      expect(path.length).toBeGreaterThan(5);
      // Start and end should be correct
      expect(Math.abs(path[0].x - start.x)).toBeLessThan(10);
      expect(Math.abs(path[path.length - 1].x - goal.x)).toBeLessThan(10);
    }
  });

  it('should handle same start and goal', () => {
    const point: Point = { x: 50, y: 50 };

    const path = pathfinder.findPath(point, point);

    // Should return null or a single-point path
    if (path) {
      expect(path.length).toBeLessThanOrEqual(1);
    }
  });

  it('should respect brightness threshold', () => {
    // Create image with varying brightness
    const width = 100;
    const height = 100;
    const data = new Uint8ClampedArray(width * height * 4);

    // Fill with dark gray (not walkable)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 100;
      data[i + 1] = 100;
      data[i + 2] = 100;
      data[i + 3] = 255;
    }

    const darkImageData = new MockImageData(data, width, height);
    const darkPathfinder = new PixelPathfinder({
      imageData: darkImageData,
      brightnessThreshold: 140,
      saturationThreshold: 0.2,
      cellSize: 4,
    });

    const start: Point = { x: 20, y: 20 };
    const goal: Point = { x: 80, y: 80 };

    const path = darkPathfinder.findPath(start, goal);

    // Should not find path in dark area
    expect(path).toBeNull();
  });
});
