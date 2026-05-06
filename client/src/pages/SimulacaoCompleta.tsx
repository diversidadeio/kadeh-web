import { useEffect, useRef, useState } from 'react';
import routesData from '../routes_with_corridors.json';
import productsData from '../products_data.json';

// Department definitions with coordinates from the real map (2048x1150)
// Organized by area for clarity
const DEPARTMENTS = [
  // TOP ROW (banners)
  { code: 'A', name: 'Açougue', color: '#cc0000', x: 275, y: 35 },
  { code: 'H', name: 'Hortifruti', color: '#0066cc', x: 835, y: 35 },
  { code: 'P', name: 'Padaria', color: '#e67300', x: 1305, y: 35 },
  
  // CATEGORY LABELS ROW
  { code: 'L', name: 'Laticínios e Bebidas Geladas Lácteas', color: '#ccaa00', x: 140, y: 195 },
  { code: 'R', name: 'Refrigerantes', color: '#009933', x: 400, y: 195 },
  { code: 'C', name: 'Cereais', color: '#00aaaa', x: 700, y: 195 },
  { code: 'I', name: 'Infantis', color: '#0077cc', x: 885, y: 195 },
  { code: 'HG', name: 'Higiene', color: '#cc6699', x: 1030, y: 195 },
  { code: 'LP', name: 'Limpeza', color: '#cc3366', x: 1170, y: 195 },
  { code: 'U', name: 'Utilidades', color: '#666666', x: 1320, y: 195 },
  
  // BOTTOM SECTIONS
  { code: 'O', name: 'Orgânicos & Naturais', color: '#339933', x: 710, y: 650 },
  { code: 'OB', name: 'Biscoitos Diet e Light', color: '#ff8800', x: 560, y: 650 },
  { code: 'OM', name: 'Massas Diet e Light', color: '#ff6600', x: 660, y: 650 },
  { code: 'OZ', name: 'Zero Lactose', color: '#00cc99', x: 850, y: 650 },
  { code: 'T', name: 'Talheres', color: '#333333', x: 1030, y: 650 },
  { code: 'PT', name: 'Pet', color: '#996633', x: 1165, y: 650 },
  { code: 'B', name: 'Bebidas Alcoólicas', color: '#660033', x: 1350, y: 650 },
  
  // FREEZERS
  { code: 'F', name: 'Freezers (Danone, Glória, Itambé)', color: '#3399cc', x: 150, y: 650 },
  
  // CHECKOUT
  { code: 'CX', name: 'Caixas', color: '#ffcc00', x: 170, y: 870 },
  
  // BANHEIROS
  { code: 'BM', name: 'Banheiro Masculino', color: '#336699', x: 1370, y: 870 },
  { code: 'BF', name: 'Banheiro Feminino', color: '#993366', x: 1440, y: 870 },
];

// Mapping from department codes to product category names in products_data.json
// Some departments map to multiple categories
const DEPT_TO_CATEGORIES: { [code: string]: string[] } = {
  'A': ['Açougue'],
  'H': ['Hortifruti', 'Expositor de Frutas', 'Expositor de Legumes'],
  'P': ['Padaria', 'Expositor de Pães', 'Expositor de Bolos', 'Expositor de pães doces', 'Expositor de pães recheados'],
  'L': ['Geladeeira de Exposição 1', 'Geladeira Promocional', 'Laticionios Especiais'],
  'R': ['Refrigeranes Gelados', 'Refrigerantes e Xaropes', 'Sucos e Refrescos'],
  'C': ['Cereais'],
  'I': ['Produtos Infantis'],
  'HG': ['Higiene Pessoal', 'Higiene Geral', 'Expositor de Higiene'],
  'LP': ['Limpadores', 'Materiais de Limpeza', 'Expositor de limpeza'],
  'U': ['Utilidades', 'Acessórios de Decoração'],
  'O': ['Orgânicos', 'Achocolatados e Granolas'],
  'OB': ['Biscoito s Light e Diet', 'Biscoitos finos', 'Biscoitos Bolachas e Cereais'],
  'OM': ['Massas Especiais', 'Massas', 'Molhos especiais'],
  'OZ': ['Laticionios Especiais'],
  'T': [' Talheres'],
  'PT': ['Pet - Rações e Acessórios Pet'],
  'B': ['Bebidas Alcoólicas', 'Vinho Branco', 'Vinho Espumante', 'Vinhos Tinto'],
  'F': ['Frezer Vertical', 'Caarnes e fritas congeladas', 'Ilha Peromocional'],
};

// Additional gondola-level categories for departments that contain gondolas
const GONDOLA_CATEGORIES: { [code: string]: string[] } = {
  'A': ['Açougue'],
  'H': ['Hortifruti'],
  'P': ['Padaria'],
  // Gondola 1: Óleos, molhos, conservas
  // Gondola 2: Temperos, arroz, farinhas
  // Gondola 3: Massas, molhos, importados
  // Gondola 4: Açúcares, cafés, chás
  // Gondola 5: (small)
  // Gondola 6: Biscoitos, bolachas, cereais
  // Gondola 7: Achocolatados e granolas
  // Gondola 8: Higiene pessoal
  // Gondola 9: Detergentes, desinfetantes
  // Gondola 10: Higiene
  // Gondola 11: Materiais de limpeza
  // Gondola 12: Limpadores
};

// Extract unique subcategories from products data
const getSubcategoriesByDepartment = () => {
  const result: { [code: string]: string[] } = {};
  
  // Build subcategory lists per department code
  Object.entries(DEPT_TO_CATEGORIES).forEach(([code, categories]) => {
    const subcatSet = new Set<string>();
    
    productsData.forEach((product: any) => {
      const categoria = product.categoria;
      const subcategoria = product.subcategoria?.trim();
      
      if (categoria && subcategoria && categories.includes(categoria)) {
        subcatSet.add(subcategoria);
      }
    });
    
    if (subcatSet.size > 0) {
      result[code] = Array.from(subcatSet).sort();
    }
  });
  
  return result;
};

const SUBCATEGORIES_BY_DEPT = getSubcategoriesByDepartment();

// Get route from pre-calculated data
const getPreCalculatedRoute = (fromCode: string, toCode: string): [number, number][] | null => {
  const route = (routesData as any).routes?.find((r: any) => r.from_code === fromCode && r.to_code === toCode);
  return route ? route.waypoints : null;
};

export default function SimulacaoCompleta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [fromDept, setFromDept] = useState('A');
  const [toDept, setToDept] = useState('H');
  const [fromSubcat, setFromSubcat] = useState('');
  const [toSubcat, setToSubcat] = useState('');
  const [routeInfo, setRouteInfo] = useState('');
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = '/improved_floor_plan.webp';
    
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Draw canvas when image is loaded
  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = imageRef.current?.width || 2048;
    canvas.height = imageRef.current?.height || 1150;

    const ctx = canvas.getContext('2d');
    if (ctx && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);

      DEPARTMENTS.forEach(dept => {
        ctx.fillStyle = dept.color;
        ctx.beginPath();
        ctx.arc(dept.x, dept.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // White border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dept.code, dept.x, dept.y);
      });
    }
  }, [imageLoaded]);

  const animateBall = (path: [number, number][]) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate total distance
    const totalDistance = path.reduce((sum, _, i) => {
      if (i === 0) return 0;
      const dx = path[i][0] - path[i - 1][0];
      const dy = path[i][1] - path[i - 1][1];
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    const animationDuration = 5000; // 5 seconds
    const startTime = Date.now();

    const drawFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Clear canvas and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (imageRef.current) {
        ctx.drawImage(imageRef.current, 0, 0);
      }

      // Draw departments
      DEPARTMENTS.forEach(dept => {
        ctx.fillStyle = dept.color;
        ctx.beginPath();
        ctx.arc(dept.x, dept.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dept.code, dept.x, dept.y);
      });

      // Draw path
      ctx.strokeStyle = '#0066ff';
      ctx.lineWidth = 4;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1]);
      }
      ctx.stroke();

      // Draw start point (green)
      ctx.fillStyle = '#00cc00';
      ctx.beginPath();
      ctx.arc(path[0][0], path[0][1], 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw end point (red)
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(path[path.length - 1][0], path[path.length - 1][1], 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate ball position along the path
      let distanceCovered = totalDistance * progress;
      let ballX = path[0][0];
      let ballY = path[0][1];

      for (let i = 1; i < path.length; i++) {
        const dx = path[i][0] - path[i - 1][0];
        const dy = path[i][1] - path[i - 1][1];
        const segmentDistance = Math.sqrt(dx * dx + dy * dy);

        if (distanceCovered <= segmentDistance) {
          const ratio = segmentDistance > 0 ? distanceCovered / segmentDistance : 0;
          ballX = path[i - 1][0] + dx * ratio;
          ballY = path[i - 1][1] + dy * ratio;
          break;
        }
        distanceCovered -= segmentDistance;
      }

      // Draw animated ball
      ctx.fillStyle = '#ffff00';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw progress percentage
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(progress * 100)}%`, ballX, ballY);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
  };

  const handleNavigate = async () => {
    setError('');
    setRouteInfo('');

    // Cancel previous animation if running
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const fromDeptObj = DEPARTMENTS.find(d => d.code === fromDept);
    const toDeptObj = DEPARTMENTS.find(d => d.code === toDept);

    if (!fromDeptObj || !toDeptObj) {
      setError('Departamentos inválidos');
      return;
    }

    // Get pre-calculated route
    const path = getPreCalculatedRoute(fromDept, toDept);

    if (!path) {
      setError('Rota não encontrada');
      return;
    }

    const distance = path.reduce((sum, _, i) => {
      if (i === 0) return 0;
      const dx = path[i][0] - path[i - 1][0];
      const dy = path[i][1] - path[i - 1][1];
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    setRouteInfo(`Rota de ${fromDeptObj.name} para ${toDeptObj.name} - Distância: ${distance.toFixed(0)} pixels`);

    // Start animation
    animateBall(path);
  };

  const getSubcategoriesForDept = (deptCode: string) => {
    return SUBCATEGORIES_BY_DEPT[deptCode] || [];
  };

  const totalRoutes = (routesData as any).successful_routes || 420;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Simulação de Navegação Completa</h1>
      <p className="text-gray-600 mb-6">Rotas inteligentes que respeitam todos os {DEPARTMENTS.length} departamentos e seguem apenas os corredores de trânsito</p>

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
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm">Mostrar todas as rotas salvas ({totalRoutes})</span>
        </label>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {routeInfo && <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded">{routeInfo}</div>}

        <div className="mt-6 border rounded overflow-hidden">
          <canvas ref={canvasRef} className="w-full" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Informações</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ {DEPARTMENTS.length} departamentos e destinos disponíveis</li>
          <li>✓ {totalRoutes} rotas pré-calculadas e otimizadas</li>
          <li>✓ Rotas seguem APENAS corredores de trânsito (nunca passam por gôndolas)</li>
          <li>✓ Animação de bolinha mostrando o progresso da navegação</li>
          <li>✓ Inclui Orgânicos (Biscoitos Diet, Massas, Zero Lactose)</li>
          <li>✓ Inclui Caixas, Banheiro Masculino e Banheiro Feminino</li>
        </ul>
      </div>
    </div>
  );
}
