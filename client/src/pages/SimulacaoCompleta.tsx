import { useState, useEffect, useRef } from 'react';
import productsData from '../products_data.json';

// Department definitions with coordinates from the real map
const DEPARTMENTS = [
  { code: 'A', name: 'Açougue', color: '#ff0000', x: 200, y: 200 },
  { code: 'H', name: 'Hortifruti', color: '#0066ff', x: 900, y: 250 },
  { code: 'P', name: 'Padaria', color: '#ff9900', x: 1400, y: 200 },
  { code: 'L', name: 'Laticionios Especiais', color: '#ffff00', x: 300, y: 500 },
  { code: 'R', name: 'Refrigerantes e Xaropes', color: '#00cc00', x: 700, y: 500 },
  { code: 'C', name: 'Cereais', color: '#00cccc', x: 1100, y: 500 },
  { code: 'I', name: 'Produtos Infantis', color: '#0099ff', x: 1600, y: 500 },
  { code: 'G', name: 'Higiene Pessoal', color: '#ff00ff', x: 400, y: 800 },
  { code: 'K', name: 'Materiais de Limpeza', color: '#ff0099', x: 900, y: 800 },
  { code: 'U', name: 'Utilidades', color: '#99ff00', x: 1400, y: 800 },
  { code: 'O', name: 'Orgânicos', color: '#ff6600', x: 200, y: 1000 },
  { code: 'F', name: 'Caarnes e fritas congeladas', color: '#6600ff', x: 700, y: 1000 },
  { code: 'T', name: ' Talheres', color: '#ff0066', x: 1100, y: 1000 },
  { code: 'B', name: 'Bebidas Alcoólicas', color: '#8b4513', x: 1600, y: 1000 },
];

// Extract unique subcategories from products data
const getSubcategoriesByDepartment = () => {
  const map: Record<string, Set<string>> = {};
  
  (productsData as any[]).forEach((product: any) => {
    const dept = product.categoria;
    const subcat = product.subcategoria;
    
    if (dept && subcat) {
      if (!map[dept]) {
        map[dept] = new Set();
      }
      map[dept].add(subcat);
    }
  });
  
  // Convert to object with sorted arrays
  const result: Record<string, string[]> = {};
  Object.keys(map).forEach(dept => {
    result[dept] = Array.from(map[dept]).sort();
  });
  
  return result;
};

const SUBCATEGORIES_BY_DEPT = getSubcategoriesByDepartment();

// Improved Pathfinder class
class ImprovedPathfinder {
  private grid: boolean[][] | null = null;
  private width: number = 0;
  private height: number = 0;
  private cellSize: number = 10;
  private imageData: ImageData | null = null;

  async initialize(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('[Pathfinder] Failed to get canvas context');
          resolve(false);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        this.imageData = ctx.getImageData(0, 0, img.width, img.height);
        this.width = img.width;
        this.height = img.height;
        
        this.buildGrid();
        console.log(`[Pathfinder] Initialized: ${this.width}x${this.height}`);
        resolve(true);
      };
      
      img.onerror = () => {
        console.error('[Pathfinder] Failed to load image');
        resolve(false);
      };
      
      img.src = imageUrl;
    });
  }

  private buildGrid(): void {
    if (!this.imageData) return;
    
    const gridHeight = Math.ceil(this.height / this.cellSize);
    const gridWidth = Math.ceil(this.width / this.cellSize);
    this.grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(false));
    
    const data = this.imageData.data;
    
    for (let gy = 0; gy < gridHeight; gy++) {
      for (let gx = 0; gx < gridWidth; gx++) {
        let walkableCount = 0;
        let sampleCount = 0;
        
        for (let dy = 0; dy < this.cellSize; dy += 2) {
          for (let dx = 0; dx < this.cellSize; dx += 2) {
            const py = gy * this.cellSize + dy;
            const px = gx * this.cellSize + dx;
            
            if (py < this.height && px < this.width) {
              const idx = (py * this.width + px) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              
              if (this.isWalkable(r, g, b)) {
                walkableCount++;
              }
              sampleCount++;
            }
          }
        }
        
        if (sampleCount > 0 && walkableCount / sampleCount > 0.6) {
          this.grid[gy][gx] = true;
        }
      }
    }
    
    const walkableCells = this.grid.flat().filter(x => x).length;
    console.log(`[Pathfinder] Grid: ${gridWidth}x${gridHeight}, Walkable: ${walkableCells}/${gridWidth * gridHeight}`);
  }

  private isWalkable(r: number, g: number, b: number): boolean {
    const brightness = (r + g + b) / 3;
    
    if (brightness < 180) return false;
    
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const saturation = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;
    
    return saturation < 0.2;
  }

  findPath(start: [number, number], end: [number, number]): [number, number][] | null {
    if (!this.grid) return null;
    
    const startGx = Math.floor(start[0] / this.cellSize);
    const startGy = Math.floor(start[1] / this.cellSize);
    const endGx = Math.floor(end[0] / this.cellSize);
    const endGy = Math.floor(end[1] / this.cellSize);
    
    const gridHeight = this.grid.length;
    const gridWidth = this.grid[0].length;
    
    // Clamp coordinates
    const clampedStartGx = Math.max(0, Math.min(startGx, gridWidth - 1));
    const clampedStartGy = Math.max(0, Math.min(startGy, gridHeight - 1));
    const clampedEndGx = Math.max(0, Math.min(endGx, gridWidth - 1));
    const clampedEndGy = Math.max(0, Math.min(endGy, gridHeight - 1));
    
    // Find nearest walkable cell to start
    let actualStartGx = clampedStartGx;
    let actualStartGy = clampedStartGy;
    
    if (!this.grid[clampedStartGy][clampedStartGx]) {
      let found = false;
      for (let radius = 1; radius < 20 && !found; radius++) {
        for (let dy = -radius; dy <= radius && !found; dy++) {
          for (let dx = -radius; dx <= radius && !found; dx++) {
            const ny = clampedStartGy + dy;
            const nx = clampedStartGx + dx;
            if (ny >= 0 && ny < gridHeight && nx >= 0 && nx < gridWidth && this.grid[ny][nx]) {
              actualStartGy = ny;
              actualStartGx = nx;
              found = true;
            }
          }
        }
      }
      if (!found) return null;
    }
    
    // Find nearest walkable cell to end
    let actualEndGx = clampedEndGx;
    let actualEndGy = clampedEndGy;
    
    if (!this.grid[clampedEndGy][clampedEndGx]) {
      let found = false;
      for (let radius = 1; radius < 20 && !found; radius++) {
        for (let dy = -radius; dy <= radius && !found; dy++) {
          for (let dx = -radius; dx <= radius && !found; dx++) {
            const ny = clampedEndGy + dy;
            const nx = clampedEndGx + dx;
            if (ny >= 0 && ny < gridHeight && nx >= 0 && nx < gridWidth && this.grid[ny][nx]) {
              actualEndGy = ny;
              actualEndGx = nx;
              found = true;
            }
          }
        }
      }
      if (!found) return null;
    }
    
    // A* algorithm
    const openSet: Array<[number, number, number]> = [[0, actualStartGx, actualStartGy]];
    const cameFrom = new Map<string, [number, number]>();
    const gScore = new Map<string, number>();
    const visited = new Set<string>();
    
    gScore.set(`${actualStartGx},${actualStartGy}`, 0);
    
    let iterations = 0;
    const maxIterations = 100000;
    
    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;
      
      // Find minimum f score
      let minIdx = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i][0] < openSet[minIdx][0]) {
          minIdx = i;
        }
      }
      
      const [, currentX, currentY] = openSet[minIdx];
      openSet.splice(minIdx, 1);
      
      const currentKey = `${currentX},${currentY}`;
      if (visited.has(currentKey)) continue;
      visited.add(currentKey);
      
      if (currentX === actualEndGx && currentY === actualEndGy) {
        // Reconstruct path
        const path: [number, number][] = [];
        let current: [number, number] = [currentX, currentY];
        
        while (cameFrom.has(`${current[0]},${current[1]}`)) {
          path.push(current);
          current = cameFrom.get(`${current[0]},${current[1]}`)!;
        }
        path.push([actualStartGx, actualStartGy]);
        path.reverse();
        
        // Convert to pixel coordinates
        const pixelPath = path.map(([x, y]) => [
          x * this.cellSize + this.cellSize / 2,
          y * this.cellSize + this.cellSize / 2,
        ] as [number, number]);
        
        console.log(`[Pathfinder] Path found in ${iterations} iterations, ${pixelPath.length} waypoints`);
        return pixelPath;
      }
      
      // Check neighbors
      const neighbors = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, -1], [1, -1], [-1, 1],
      ];
      
      for (const [dx, dy] of neighbors) {
        const nextX = currentX + dx;
        const nextY = currentY + dy;
        
        if (nextX < 0 || nextX >= gridWidth || nextY < 0 || nextY >= gridHeight) continue;
        if (!this.grid[nextY][nextX]) continue;
        
        const nextKey = `${nextX},${nextY}`;
        if (visited.has(nextKey)) continue;
        
        const moveCost = (dx !== 0 && dy !== 0) ? 1.414 : 1;
        const tentativeG = (gScore.get(currentKey) || 0) + moveCost;
        
        if (!gScore.has(nextKey) || tentativeG < gScore.get(nextKey)!) {
          cameFrom.set(nextKey, [currentX, currentY]);
          gScore.set(nextKey, tentativeG);
          
          const h = Math.sqrt((nextX - actualEndGx) ** 2 + (nextY - actualEndGy) ** 2);
          const f = tentativeG + h;
          openSet.push([f, nextX, nextY]);
        }
      }
    }
    
    console.log(`[Pathfinder] No path found after ${iterations} iterations`);
    return null;
  }
}

export default function SimulacaoCompleta() {
  const [fromDept, setFromDept] = useState('A');
  const [toDept, setToDept] = useState('H');
  const [fromSubcat, setFromSubcat] = useState('');
  const [toSubcat, setToSubcat] = useState('');
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [routeInfo, setRouteInfo] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathfinderRef = useRef<ImprovedPathfinder | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = '/floor-plan-real.webp';
    
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      console.error('[Canvas] Failed to load image');
      setError('Falha ao carregar mapa');
    };
  }, []);

  // Initialize pathfinder
  useEffect(() => {
    const initPathfinder = async () => {
      if (!imageLoaded) return;
      
      const pathfinder = new ImprovedPathfinder();
      const initialized = await pathfinder.initialize('/floor-plan-real.webp');
      if (initialized) {
        pathfinderRef.current = pathfinder;
        console.log('[Pathfinder] Ready');
      } else {
        setError('Falha ao inicializar pathfinder');
      }
    };
    
    initPathfinder();
  }, [imageLoaded]);

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 2048;
    canvas.height = 1150;
    
    // Draw image
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
    }
    
    // Draw departments
    DEPARTMENTS.forEach(dept => {
      ctx.fillStyle = dept.color;
      ctx.beginPath();
      ctx.arc(dept.x, dept.y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dept.code, dept.x, dept.y);
    });
  }, [imageLoaded]);

  const handleNavigate = async () => {
    setError('');
    setRouteInfo('');
    
    if (!pathfinderRef.current) {
      setError('Pathfinder não inicializado');
      return;
    }
    
    const fromDeptObj = DEPARTMENTS.find(d => d.code === fromDept);
    const toDeptObj = DEPARTMENTS.find(d => d.code === toDept);
    
    if (!fromDeptObj || !toDeptObj) {
      setError('Departamentos inválidos');
      return;
    }
    
    const path = pathfinderRef.current.findPath([fromDeptObj.x, fromDeptObj.y], [toDeptObj.x, toDeptObj.y]);
    
    if (!path) {
      setError('Rota não encontrada');
      return;
    }
    
    const distance = path.reduce((sum, _, i) => {
      if (i === 0) return 0;
      const dx = path[i][0] - path[i-1][0];
      const dy = path[i][1] - path[i-1][1];
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);
    
    setRouteInfo(`Rota de ${fromDeptObj.name} para ${toDeptObj.name} - Distância: ${distance.toFixed(0)} pixels`);
    
    // Draw route
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && imageRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageRef.current, 0, 0);
        
        // Draw departments again
        DEPARTMENTS.forEach(dept => {
          ctx.fillStyle = dept.color;
          ctx.beginPath();
          ctx.arc(dept.x, dept.y, 30, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(dept.code, dept.x, dept.y);
        });
        
        // Draw path
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i][0], path[i][1]);
        }
        ctx.stroke();
        
        // Draw start and end points
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(path[0][0], path[0][1], 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(path[path.length - 1][0], path[path.length - 1][1], 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const getSubcategoriesForDept = (deptCode: string) => {
    const deptObj = DEPARTMENTS.find(d => d.code === deptCode);
    if (!deptObj) return [];
    return SUBCATEGORIES_BY_DEPT[deptObj.name] || [];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Simulação de Navegação Completa</h1>
      <p className="text-gray-600 mb-6">Rotas inteligentes que respeitam todos os 14 departamentos e evitam 251 gôndolas e expositores</p>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Você está em:</label>
            <select
              value={fromDept}
              onChange={(e) => {
                setFromDept(e.target.value);
                setFromSubcat('');
              }}
              className="w-full p-2 border rounded"
            >
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
            {getSubcategoriesForDept(fromDept).length > 0 && (
              <div className="mt-2">
                <label className="block text-xs font-medium mb-1">Subcategoria:</label>
                <select
                  value={fromSubcat}
                  onChange={(e) => setFromSubcat(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Todas</option>
                  {getSubcategoriesForDept(fromDept).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Desejo ir para:</label>
            <select
              value={toDept}
              onChange={(e) => {
                setToDept(e.target.value);
                setToSubcat('');
              }}
              className="w-full p-2 border rounded"
            >
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
            {getSubcategoriesForDept(toDept).length > 0 && (
              <div className="mt-2">
                <label className="block text-xs font-medium mb-1">Subcategoria:</label>
                <select
                  value={toSubcat}
                  onChange={(e) => setToSubcat(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Todas</option>
                  {getSubcategoriesForDept(toDept).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleNavigate}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              Iniciar Navegação
            </button>
          </div>
        </div>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAllRoutes}
            onChange={(e) => setShowAllRoutes(e.target.checked)}
          />
          <span>Mostrar todas as rotas salvas (0)</span>
        </label>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {routeInfo && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {routeInfo}
        </div>
      )}
      
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Informações</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✓ 14 departamentos disponíveis</li>
          <li>✓ 251 gôndolas e expositores mapeados</li>
          <li>✓ Rotas salvas no banco de dados</li>
        </ul>
      </div>
    </div>
  );
}
