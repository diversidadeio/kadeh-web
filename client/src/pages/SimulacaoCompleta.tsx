import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { AdvancedPathfinder } from '@/lib/advancedPathfinding';

interface Point {
  x: number;
  y: number;
}

// 14 Departamentos - Dados Fallback (sempre disponíveis)
const DEPARTMENTS = [
  { name: 'Açougue', nameEn: 'Butcher', x: 140, y: 40, code: 'A', color: '#dc2626' },
  { name: 'Hortifrutí', nameEn: 'Produce', x: 500, y: 40, code: 'H', color: '#2563eb' },
  { name: 'Padaria', nameEn: 'Bakery', x: 750, y: 40, code: 'P', color: '#f97316' },
  { name: 'Laticínios e Bebidas Geladas', nameEn: 'Dairy & Cold Beverages', x: 100, y: 130, code: 'L', color: '#fbbf24' },
  { name: 'Refrigerantes', nameEn: 'Soft Drinks', x: 250, y: 130, code: 'R', color: '#22c55e' },
  { name: 'Cereais e Bolachas', nameEn: 'Cereals & Crackers', x: 380, y: 130, code: 'C', color: '#8b5cf6' },
  { name: 'Infantis', nameEn: 'Baby Products', x: 480, y: 130, code: 'I', color: '#ec4899' },
  { name: 'Higiene', nameEn: 'Hygiene', x: 580, y: 130, code: 'G', color: '#06b6d4' },
  { name: 'Limpeza', nameEn: 'Cleaning', x: 680, y: 130, code: 'K', color: '#f43f5e' },
  { name: 'Utilidades', nameEn: 'Utilities', x: 780, y: 130, code: 'U', color: '#6366f1' },
  { name: 'Orgânicos & Naturais', nameEn: 'Organic & Natural', x: 380, y: 380, code: 'O', color: '#10b981' },
  { name: 'Congelados', nameEn: 'Frozen', x: 520, y: 380, code: 'F', color: '#3b82f6' },
  { name: 'Pet', nameEn: 'Pet', x: 620, y: 380, code: 'T', color: '#f59e0b' },
  { name: 'Bebidas Alcoólicas', nameEn: 'Alcoholic Beverages', x: 750, y: 380, code: 'B', color: '#8b4513' },
];

interface Department {
  name: string;
  nameEn: string;
  x: number;
  y: number;
  code: string;
  color: string;
  id?: number;
}

interface DatabaseCategory {
  id: number;
  code: string;
  name: string;
  nameEn?: string | null;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface DatabaseRoute {
  id: number;
  fromCategoryId: number;
  toCategoryId: number;
  pathPoints: Array<{ x: number; y: number }>;
  distance: number;
}

export default function SimulacaoCompleta() {
  const { language } = useLanguage();
  const [currentDept, setCurrentDept] = useState('Açougue');
  const [destinationDept, setDestinationDept] = useState('Hortifrutí');
  const [isAnimating, setIsAnimating] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const [routeDescription, setRouteDescription] = useState('');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [distance, setDistance] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [allRoutes, setAllRoutes] = useState<DatabaseRoute[]>([]);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const pathfinderRef = useRef<AdvancedPathfinder | null>(null);

  // Fetch categories and routes from database (optional - use fallback if empty)
  const { data: dbCategories } = trpc.storeLayout.categories.list.useQuery();
  const { data: dbRoutes } = trpc.storeLayout.routes.list.useQuery();

  // Initialize advanced pathfinder
  useEffect(() => {
    const initPathfinder = async () => {
      if (!imageLoaded) return;
      
      const pathfinder = new AdvancedPathfinder();
      const imageUrl = '/floor-plan.png';
      
      const initialized = await pathfinder.initialize(imageUrl);
      if (initialized) {
        pathfinderRef.current = pathfinder;
        console.log('[Simulação] Advanced pathfinder initialized');
      } else {
        console.error('[Simulação] Failed to initialize pathfinder');
        setError(language === 'pt' ? 'Erro ao inicializar motor de navegação' : 'Failed to initialize pathfinding engine');
      }
    };
    
    initPathfinder();
  }, [imageLoaded, language]);

  // Update departments from database (only if we get valid data)
  useEffect(() => {
    if (dbCategories && Array.isArray(dbCategories) && dbCategories.length > 0) {
      // Only update if we got actual department data (not products)
      const validDepts = dbCategories.filter(cat => 
        DEPARTMENTS.some(d => d.code === cat.code)
      );
      
      if (validDepts.length > 0) {
        setDepartments(validDepts.map(cat => ({
          name: cat.name,
          nameEn: cat.nameEn || cat.name,
          x: cat.x,
          y: cat.y,
          code: cat.code,
          id: cat.id,
          color: cat.color,
        })));
      }
    }
  }, [dbCategories]);

  // Update routes from database
  useEffect(() => {
    if (dbRoutes && Array.isArray(dbRoutes) && dbRoutes.length > 0) {
      setAllRoutes(dbRoutes);
    }
  }, [dbRoutes]);

  // Load the floor plan image
  useEffect(() => {
    const img = new Image();
    img.src = '/floor-plan.png';
    
    img.onload = () => {
      imageRef.current = img;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        imageDataRef.current = ctx.getImageData(0, 0, img.width, img.height);
        
        setImageLoaded(true);
        setError('');
      }
    };
    
    img.onerror = (err) => {
      console.error('[Simulação] Image load error:', err);
      setError(language === 'pt' ? 'Erro ao carregar a imagem da planta' : 'Error loading floor plan image');
      // Still set imageLoaded to true to allow fallback rendering
      setImageLoaded(true);
    };
  }, [language]);

  // Draw canvas with all routes and current path
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    // Set canvas dimensions to match image
    if (imageRef.current) {
      canvas.width = imageRef.current.width;
      canvas.height = imageRef.current.height;
    } else {
      canvas.width = 2048;
      canvas.height = 1150;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('[Canvas] Drawing image. Canvas:', canvas.width, 'x', canvas.height, 'Image:', imageRef.current?.width, 'x', imageRef.current?.height);

    // Draw image if available
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
      console.log('[Canvas] Image drawn');
    } else {
      // Draw white background if image not loaded
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      console.log('[Canvas] White background drawn');
    }

    // Draw all routes if enabled
    if (showAllRoutes && allRoutes.length > 0) {
      allRoutes.forEach((route) => {
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        
        if (route.pathPoints.length > 0) {
          ctx.moveTo(route.pathPoints[0].x, route.pathPoints[0].y);
          for (let i = 1; i < route.pathPoints.length; i++) {
            ctx.lineTo(route.pathPoints[i].x, route.pathPoints[i].y);
          }
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);
    }

    // Draw current path
    if (path.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();

      // Draw waypoints
      path.forEach((point, index) => {
        ctx.fillStyle = index === 0 ? '#10b981' : index === path.length - 1 ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw department markers
    departments.forEach((dept) => {
      ctx.fillStyle = dept.color;
      ctx.beginPath();
      ctx.arc(dept.x, dept.y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dept.code, dept.x, dept.y);
    });

    // Draw animated position if animating
    if (isAnimating && path.length > 0 && animationProgress < 100) {
      const currentIndex = Math.floor((animationProgress / 100) * (path.length - 1));
      const nextIndex = Math.min(currentIndex + 1, path.length - 1);
      const progress = ((animationProgress / 100) * (path.length - 1)) - currentIndex;

      const currentPoint = path[currentIndex];
      const nextPoint = path[nextIndex];
      const animatedX = currentPoint.x + (nextPoint.x - currentPoint.x) * progress;
      const animatedY = currentPoint.y + (nextPoint.y - currentPoint.y) * progress;

      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(animatedX, animatedY, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [path, departments, allRoutes, showAllRoutes, isAnimating, animationProgress, imageLoaded]);

  const handleNavigate = async () => {
    if (!currentDept || !destinationDept) {
      setError(language === 'pt' ? 'Selecione departamentos válidos' : 'Please select valid departments');
      return;
    }

    if (currentDept === destinationDept) {
      setError(language === 'pt' ? 'Selecione departamentos diferentes' : 'Please select different departments');
      return;
    }

    setError('');
    setPath([]);
    setIsAnimating(false);

    // Try to find route in database first
    const savedRoute = allRoutes.find(
      (r) => {
        const fromDept = departments.find(d => d.name === currentDept);
        const toDept = departments.find(d => d.name === destinationDept);
        return fromDept && toDept && fromDept.id && toDept.id && r.fromCategoryId === fromDept.id && r.toCategoryId === toDept.id;
      }
    );

    if (savedRoute && savedRoute.pathPoints.length > 0) {
      setPath(savedRoute.pathPoints.map(p => ({ x: p.x, y: p.y })));
      setDistance(savedRoute.distance);
      setRouteDescription(
        language === 'pt'
          ? `Rota de ${currentDept} para ${destinationDept} - Distância: ${Math.round(savedRoute.distance)} pixels`
          : `Route from ${currentDept} to ${destinationDept} - Distance: ${Math.round(savedRoute.distance)} pixels`
      );
      setIsAnimating(true);
      setAnimationProgress(0);
      return;
    }

    // Use pathfinder for real-time calculation
    if (!pathfinderRef.current) {
      setError(language === 'pt' ? 'Motor de navegação não inicializado' : 'Pathfinding engine not initialized');
      return;
    }

    const fromDept = departments.find(d => d.name === currentDept);
    const toDept = departments.find(d => d.name === destinationDept);

    if (!fromDept || !toDept) {
      setError(language === 'pt' ? 'Departamento não encontrado' : 'Department not found');
      return;
    }

    const calculatedPath = await pathfinderRef.current.findPath(
      { x: fromDept.x, y: fromDept.y },
      { x: toDept.x, y: toDept.y }
    );

    if (!calculatedPath || calculatedPath.length === 0) {
      setError(language === 'pt' ? 'Rota não encontrada' : 'Route not found');
      return;
    }

    const totalDistance = calculatedPath.reduce((sum, point, i) => {
      if (i === 0) return 0;
      const dx = point.x - calculatedPath[i - 1].x;
      const dy = point.y - calculatedPath[i - 1].y;
      return sum + Math.hypot(dx, dy);
    }, 0);

    setDistance(Math.round(totalDistance));
    setPath(calculatedPath);
    setIsAnimating(true);
    setAnimationProgress(0);
    setError('');

    const description = language === 'pt'
      ? `Rota de ${currentDept} para ${destinationDept} - Distância: ${Math.round(totalDistance)} pixels`
      : `Route from ${currentDept} to ${destinationDept} - Distance: ${Math.round(totalDistance)} pixels`;
    setRouteDescription(description);
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          setIsAnimating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  if (!imageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'pt' ? 'Carregando simulação...' : 'Loading simulation...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'pt' ? 'Simulação de Navegação Completa' : 'Complete Navigation Simulation'}
        </h1>
        <p className="text-gray-600 mb-6">
          {language === 'pt'
            ? 'Rotas inteligentes que respeitam todos os 14 departamentos e evitam 251 gôndolas e expositores'
            : 'Smart routes that respect all 14 departments and avoid 251 gondolas and fixtures'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                {language === 'pt' ? 'Você está em:' : 'You are at:'}
              </label>
              <select
                value={currentDept}
                onChange={(e) => setCurrentDept(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {language === 'pt' ? dept.name : dept.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {language === 'pt' ? 'Desejo ir para:' : 'I want to go to:'}
              </label>
              <select
                value={destinationDept}
                onChange={(e) => setDestinationDept(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {language === 'pt' ? dept.name : dept.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleNavigate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {language === 'pt' ? 'Iniciar Navegação' : 'Start Navigation'}
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showRoutes"
                checked={showAllRoutes}
                onChange={(e) => setShowAllRoutes(e.target.checked)}
              />
              <span className="text-sm font-medium">
                {language === 'pt' ? `Mostrar todas as rotas salvas (${allRoutes.length})` : `Show all saved routes (${allRoutes.length})`}
              </span>
            </label>
          </div>

          <div className="border-2 border-red-300 rounded-lg overflow-hidden bg-white" style={{ maxHeight: '600px', overflow: 'auto' }}>
            <canvas
              ref={canvasRef}
              style={{ display: 'block' }}
            />
          </div>

          {routeDescription && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-semibold">{routeDescription}</p>
              <p className="text-blue-600 text-sm mt-1">
                {language === 'pt' ? `Progresso: ${animationProgress}%` : `Progress: ${animationProgress}%`}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'pt' ? 'Informações' : 'Information'}
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              {language === 'pt' ? '14 departamentos disponíveis' : '14 departments available'}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              {language === 'pt' ? '251 gôndolas e expositores mapeados' : '251 gondolas and fixtures mapped'}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              {language === 'pt' ? 'Rotas salvas no banco de dados' : 'Routes saved in database'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
