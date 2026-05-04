import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { AdvancedPathfinder } from '@/lib/advancedPathfinding';

interface Point {
  x: number;
  y: number;
}

// Fallback department data (used if database is empty)
const FALLBACK_DEPARTMENTS = [
  { name: 'Açougue', nameEn: 'Butcher', x: 140, y: 40 },
  { name: 'Hortifrutí', nameEn: 'Produce', x: 500, y: 40 },
  { name: 'Padaria', nameEn: 'Bakery', x: 750, y: 40 },
  { name: 'Laticínios e Bebidas Geladas', nameEn: 'Dairy & Cold Beverages', x: 100, y: 130 },
  { name: 'Refrigerantes', nameEn: 'Soft Drinks', x: 250, y: 130 },
  { name: 'Cereais e Bolachas', nameEn: 'Cereals & Crackers', x: 380, y: 130 },
  { name: 'Infantis', nameEn: 'Baby Products', x: 480, y: 130 },
  { name: 'Higiene', nameEn: 'Hygiene', x: 580, y: 130 },
  { name: 'Limpeza', nameEn: 'Cleaning', x: 680, y: 130 },
  { name: 'Utilidades', nameEn: 'Utilities', x: 780, y: 130 },
  { name: 'Orgânicos & Naturais', nameEn: 'Organic & Natural', x: 380, y: 380 },
  { name: 'Congelados', nameEn: 'Frozen', x: 520, y: 380 },
  { name: 'Pet', nameEn: 'Pet', x: 620, y: 380 },
  { name: 'Bebidas Alcoólicas', nameEn: 'Alcoholic Beverages', x: 750, y: 380 },
];

// Fallback obstacle data (no longer needed with AdvancedPathfinder)

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
  const [departments, setDepartments] = useState(FALLBACK_DEPARTMENTS);
  const [allRoutes, setAllRoutes] = useState<DatabaseRoute[]>([]);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const pathfinderRef = useRef<AdvancedPathfinder | null>(null);

  // Fetch categories and routes from database
  const { data: dbCategories } = trpc.storeLayout.categories.list.useQuery();
  const { data: dbRoutes } = trpc.storeLayout.routes.list.useQuery();

  // Initialize advanced pathfinder
  useEffect(() => {
    const initPathfinder = async () => {
      if (!imageLoaded) return;
      
      const pathfinder = new AdvancedPathfinder();
      const imageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/modified_floor_plan_ultimate_0f7086cb.png';
      
      const initialized = await pathfinder.initialize(imageUrl);
      if (initialized) {
        pathfinderRef.current = pathfinder;
        console.log('[Simulação] Advanced pathfinder initialized');
      } else {
        setError('Failed to initialize pathfinding engine');
      }
    };
    
    initPathfinder();
  }, [imageLoaded]);

  // Update departments from database
  useEffect(() => {
    if (dbCategories && dbCategories.length > 0) {
      setDepartments(dbCategories.map(cat => ({
        name: cat.name,
        nameEn: cat.nameEn || cat.name,
        x: cat.x,
        y: cat.y,
        code: cat.code,
        id: cat.id,
        color: cat.color,
      })));
    }
  }, [dbCategories]);

  // Update routes from database
  useEffect(() => {
    if (dbRoutes && dbRoutes.length > 0) {
      setAllRoutes(dbRoutes);
    }
  }, [dbRoutes]);

  // Load the floor plan image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/modified_floor_plan_ultimate_0f7086cb.png';
    
    img.onload = () => {
      imageRef.current = img;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        imageDataRef.current = ctx.getImageData(0, 0, img.width, img.height);
        
        // AdvancedPathfinder will be initialized separately
        
        setImageLoaded(true);
        setError('');
      }
    };
    
    img.onerror = () => {
      setError(language === 'pt' ? 'Erro ao carregar a imagem da planta' : 'Error loading floor plan image');
    };
  }, [language]);

  // Draw canvas with all routes and current path
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw image
    ctx.drawImage(img, 0, 0);

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

    // Draw departments
    departments.forEach((dept) => {
      const color = (dept as any).color || '#3b82f6';
      ctx.fillStyle = color + '80';
      ctx.beginPath();
      ctx.arc(dept.x, dept.y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw code if available
      if ((dept as any).code) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((dept as any).code, dept.x, dept.y);
      }
    });

    // Draw animated arrow if animating
    if (isAnimating && path.length > 0) {
      const currentIndex = Math.floor((animationProgress / 100) * (path.length - 1));
      const nextIndex = Math.min(currentIndex + 1, path.length - 1);
      const current = path[currentIndex];
      const next = path[nextIndex];

      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      ctx.save();
      ctx.translate(current.x, current.y);
      ctx.rotate(angle);

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }, [path, animationProgress, isAnimating, departments, allRoutes, showAllRoutes, imageLoaded]);

  const handleStartNavigation = async () => {
    if (!pathfinderRef.current || !imageRef.current) {
      setError(language === 'pt' ? 'Sistema de navegação não inicializado' : 'Navigation system not initialized');
      return;
    }

    const currentDeptData = departments.find(d => d.name === currentDept || d.nameEn === currentDept);
    const destDeptData = departments.find(d => d.name === destinationDept || d.nameEn === destinationDept);

    if (!currentDeptData || !destDeptData) {
      setError(language === 'pt' ? 'Departamento não encontrado' : 'Department not found');
      return;
    }

    if (currentDept === destinationDept) {
      setError(language === 'pt' ? 'Selecione departamentos diferentes' : 'Select different departments');
      return;
    }

    // Check if there's a saved route
    const savedRoute = allRoutes.find(
      r => r.fromCategoryId === (currentDeptData as any).id && r.toCategoryId === (destDeptData as any).id
    );

    let calculatedPath: Point[] = [];

    if (savedRoute) {
      // Use saved route
      calculatedPath = savedRoute.pathPoints as Point[];
      setDistance(savedRoute.distance);
    } else {
      // Use pathfinding algorithm
      const foundPath = pathfinderRef.current.findPath(
        { x: currentDeptData.x, y: currentDeptData.y },
        { x: destDeptData.x, y: destDeptData.y }
      );

      if (!foundPath) {
        setError(language === 'pt' ? 'Não foi possível encontrar uma rota' : 'Could not find a route');
        return;
      }

      calculatedPath = foundPath;
      // Calculate distance from path points
      let totalDistance = 0;
      for (let i = 1; i < foundPath.length; i++) {
        const dx = foundPath[i].x - foundPath[i - 1].x;
        const dy = foundPath[i].y - foundPath[i - 1].y;
        totalDistance += Math.hypot(dx, dy);
      }
      setDistance(Math.round(totalDistance));
    }

    setPath(calculatedPath);
    setIsAnimating(true);
    setAnimationProgress(0);
    setError('');

    // Generate route description
    const totalDist = savedRoute ? savedRoute.distance : Math.round(
      calculatedPath.reduce((sum, point, i) => {
        if (i === 0) return 0;
        const dx = point.x - calculatedPath[i - 1].x;
        const dy = point.y - calculatedPath[i - 1].y;
        return sum + Math.hypot(dx, dy);
      }, 0)
    );
    
    const description = language === 'pt'
      ? `Rota de ${currentDept} para ${destinationDept} - Distância: ${totalDist} pixels`
      : `Route from ${currentDept} to ${destinationDept} - Distance: ${totalDist} pixels`;
    setRouteDescription(description);
    setDistance(totalDist);
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
              <Button onClick={handleStartNavigation} className="w-full h-10">
                {language === 'pt' ? 'Iniciar Navegação' : 'Start Navigation'}
              </Button>
            </div>
          </div>

          {/* Route visualization toggle */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="showRoutes"
              checked={showAllRoutes}
              onChange={(e) => setShowAllRoutes(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showRoutes" className="text-sm font-medium">
              {language === 'pt'
                ? `Mostrar todas as rotas salvas (${allRoutes.length})`
                : `Show all saved routes (${allRoutes.length})`}
            </label>
          </div>

          {/* Canvas */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
              style={{ maxHeight: '600px', objectFit: 'contain' }}
            />
          </div>

          {/* Route info */}
          {routeDescription && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-semibold">{routeDescription}</p>
              {isAnimating && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${animationProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'pt' ? 'Informações' : 'Information'}
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ {language === 'pt' ? '14 departamentos disponíveis' : '14 available departments'}</li>
            <li>✅ {language === 'pt' ? '251 gôndolas e expositores mapeados' : '251 gondolas and fixtures mapped'}</li>
            <li>✅ {language === 'pt' ? 'Rotas salvas no banco de dados' : 'Routes saved in database'}</li>
            <li>✅ {language === 'pt' ? 'Visualização de todas as rotas em tempo real' : 'Real-time visualization of all routes'}</li>
            <li>✅ {language === 'pt' ? 'Navegação animada com seta direcional' : 'Animated navigation with directional arrow'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
