import { useEffect, useRef, useState } from 'react';
import routesData from '../routes_with_corridors.json';
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
  const result: { [key: string]: string[] } = {};
  
  productsData.forEach((product: any) => {
    const categoria = product.categoria;
    const subcategoria = product.subcategoria;
    
    if (categoria && subcategoria) {
      if (!result[categoria]) {
        result[categoria] = [];
      }
      if (!result[categoria].includes(subcategoria)) {
        result[categoria].push(subcategoria);
      }
    }
  });
  
  return result;
};

const SUBCATEGORIES_BY_DEPT = getSubcategoriesByDepartment();

// Get route from pre-calculated data
const getPreCalculatedRoute = (fromCode: string, toCode: string): [number, number][] | null => {
  const routeKey = `${fromCode}-${toCode}`;
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
        ctx.arc(dept.x, dept.y, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
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
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw progress percentage
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
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
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm">Mostrar todas as rotas salvas (182)</span>
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
          <li>✓ 14 departamentos disponíveis</li>
          <li>✓ 251 gôndolas e expositores mapeados</li>
          <li>✓ 182 rotas pré-calculadas e otimizadas</li>
          <li>✓ Animação de bolinha mostrando o progresso da navegação</li>
        </ul>
      </div>
    </div>
  );
}
