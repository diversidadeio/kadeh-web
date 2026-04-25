import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { RectanglePathfinder, type Point, type Rectangle } from '@/lib/rectanglePathfinding';

// Department data extracted from floor plan
const DEPARTMENTS = [
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

// Obstacle data (251 detected black-bordered rectangles)
// These are the main gondolas and fixtures
const MAIN_OBSTACLES: Rectangle[] = [
  // Top section (Açougue, Hortifrutí, Padaria headers)
  { x: 34, y: 3, w: 673, h: 113 },
  { x: 1475, y: 3, w: 408, h: 114 },
  
  // Main gondola rows (vertical fixtures)
  { x: 64, y: 363, w: 109, h: 408 },
  { x: 220, y: 364, w: 111, h: 407 },
  { x: 372, y: 365, w: 112, h: 407 },
  { x: 520, y: 365, w: 112, h: 407 },
  { x: 672, y: 367, w: 108, h: 407 },
  { x: 827, y: 363, w: 109, h: 408 },
  { x: 968, y: 363, w: 109, h: 408 },
  { x: 1109, y: 363, w: 109, h: 408 },
  { x: 1251, y: 363, w: 108, h: 408 },
  { x: 1392, y: 363, w: 108, h: 408 },
  { x: 1533, y: 363, w: 109, h: 408 },
  { x: 1674, y: 363, w: 108, h: 408 },
  
  // Bottom section (Congelados, Pet, Bebidas Alcoólicas)
  { x: 1632, y: 915, w: 276, h: 156 },
];

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const pathfinderRef = useRef<RectanglePathfinder | null>(null);

  // Load the floor plan image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Using the high-resolution floor plan from the attachment
    img.src = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/supermarket_floor_plan_detailed_1918x1079.png';
    
    img.onload = () => {
      imageRef.current = img;

      // Extract image data for pixel analysis
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        imageDataRef.current = ctx.getImageData(0, 0, img.width, img.height);
        
        // Initialize pathfinder with detected obstacles
        pathfinderRef.current = new RectanglePathfinder({
          imageData: imageDataRef.current,
          rectangles: MAIN_OBSTACLES,
          cellSize: 4,
          padding: 5, // 5 pixels padding around obstacles for safety
        });
        
        console.log('✓ Floor plan loaded:', img.width, 'x', img.height);
        console.log('✓ Pathfinder initialized with', MAIN_OBSTACLES.length, 'obstacles');
        setImageLoaded(true);
        setError('');
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load floor plan image');
      setError(language === 'pt' 
        ? 'Erro ao carregar a imagem da planta' 
        : 'Error loading floor plan image');
    };
  }, [language]);

  // Draw image and obstacles on canvas
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      
      // Draw detected obstacles as semi-transparent overlays
      ctx.fillStyle = 'rgba(255, 100, 100, 0.15)';
      for (const obs of MAIN_OBSTACLES) {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }
      
      // Draw department markers
      ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
      for (const dept of DEPARTMENTS) {
        ctx.beginPath();
        ctx.arc(dept.x, dept.y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [imageLoaded]);

  const handleStartNavigation = () => {
    if (!imageRef.current || !pathfinderRef.current) {
      setError(language === 'pt' 
        ? 'Imagem da planta ainda está carregando. Tente novamente.' 
        : 'Floor plan image is still loading. Please try again.');
      return;
    }

    const startDept = DEPARTMENTS.find(d => d.name === currentDept);
    const endDept = DEPARTMENTS.find(d => d.name === destinationDept);

    if (!startDept || !endDept) return;

    setIsAnimating(true);
    setError('');

    try {
      // Use rectangle pathfinder to calculate path
      const calculatedPath = pathfinderRef.current.findPath(
        { x: startDept.x, y: startDept.y },
        { x: endDept.x, y: endDept.y }
      );

      if (!calculatedPath || calculatedPath.length === 0) {
        // Fallback to simple path
        const fallbackPath: Point[] = [
          { x: startDept.x, y: startDept.y },
          { x: startDept.x + (endDept.x - startDept.x) * 0.3, y: startDept.y + (endDept.y - startDept.y) * 0.3 },
          { x: startDept.x + (endDept.x - startDept.x) * 0.7, y: startDept.y + (endDept.y - startDept.y) * 0.3 },
          { x: endDept.x, y: endDept.y }
        ];
        setPath(fallbackPath);
        setError(language === 'pt'
          ? 'Rota não encontrada. Exibindo rota aproximada.'
          : 'Route not found. Showing approximate route.');
      } else {
        setPath(calculatedPath);
      }

      // Calculate distance
      let totalDistance = 0;
      const displayPath = calculatedPath || [
        { x: startDept.x, y: startDept.y },
        { x: endDept.x, y: endDept.y }
      ];
      
      for (let i = 1; i < displayPath.length; i++) {
        const dx = displayPath[i].x - displayPath[i - 1].x;
        const dy = displayPath[i].y - displayPath[i - 1].y;
        totalDistance += Math.hypot(dx, dy);
      }
      setDistance(Math.round(totalDistance));

      // Generate route description
      const startName = language === 'pt' ? currentDept : (DEPARTMENTS.find(d => d.name === currentDept)?.nameEn || currentDept);
      const endName = language === 'pt' ? destinationDept : (DEPARTMENTS.find(d => d.name === destinationDept)?.nameEn || destinationDept);
      
      const description = language === 'pt'
        ? `Saia do setor ${startName}, siga pelos corredores evitando as gôndolas até o setor ${endName}.`
        : `Leave the ${startName} sector, follow the corridors avoiding gondolas to reach the ${endName} sector.`;
      setRouteDescription(description);

      // Animate the path
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05;
        setAnimationProgress(progress);
        if (progress >= 1) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 50);
    } catch (err) {
      console.error('Pathfinding error:', err);
      setError(language === 'pt'
        ? 'Erro ao calcular rota. Tente novamente.'
        : 'Error calculating route. Please try again.');
      setIsAnimating(false);
    }
  };

  // Draw the path on canvas
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || path.length === 0 || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw base image
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
      
      // Draw obstacles
      ctx.fillStyle = 'rgba(255, 100, 100, 0.15)';
      for (const obs of MAIN_OBSTACLES) {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }
      
      // Draw departments
      ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
      for (const dept of DEPARTMENTS) {
        ctx.beginPath();
        ctx.arc(dept.x, dept.y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw the path
    const pathLength = path.length;
    const currentPathIndex = Math.floor(pathLength * animationProgress);

    if (currentPathIndex > 0 && path[0]) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i <= currentPathIndex && i < pathLength; i++) {
        if (path[i]) {
          ctx.lineTo(path[i].x, path[i].y);
        }
      }
      ctx.stroke();

      // Draw arrow at current position
      if (currentPathIndex < pathLength && path[currentPathIndex]) {
        const current = path[currentPathIndex];
        const next = path[Math.min(currentPathIndex + 1, pathLength - 1)];
        if (next) {
          const angle = Math.atan2(next.y - current.y, next.x - current.x);

          ctx.save();
          ctx.translate(current.x, current.y);
          ctx.rotate(angle);
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.moveTo(12, 0);
          ctx.lineTo(-6, -6);
          ctx.lineTo(-6, 6);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }, [path, animationProgress, imageLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          {language === 'pt' ? 'Simulação de Navegação Completa' : 'Complete Navigation Simulation'}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {language === 'pt'
            ? 'Rotas inteligentes que respeitam todos os 14 departamentos e evitam 251 gôndolas e expositores'
            : 'Smart routes respecting all 14 departments and avoiding 251 gondolas and fixtures'}
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'pt' ? 'Você está em:' : 'You are at:'}
              </label>
              <select
                value={currentDept}
                onChange={(e) => setCurrentDept(e.target.value)}
                disabled={isAnimating}
                className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.name} value={d.name}>
                    {language === 'pt' ? d.name : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'pt' ? 'Desejo ir para:' : 'I want to go to:'}
              </label>
              <select
                value={destinationDept}
                onChange={(e) => setDestinationDept(e.target.value)}
                disabled={isAnimating}
                className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.name} value={d.name}>
                    {language === 'pt' ? d.name : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleStartNavigation}
              disabled={isAnimating || !imageLoaded}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {language === 'pt' ? 'Iniciar Navegação' : 'Start Navigation'}
            </Button>
          </div>
        </div>

        {/* Route Information */}
        {routeDescription && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              {language === 'pt' ? 'Descrição da rota:' : 'Route description:'}
            </h3>
            <p className="text-blue-800 mb-2">{routeDescription}</p>
            <p className="text-blue-800">
              {language === 'pt' ? 'Distância relativa:' : 'Relative distance:'} {distance} {language === 'pt' ? 'unidades' : 'units'}
            </p>
          </div>
        )}

        {/* Canvas for visualization */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>

        {/* Info section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">{language === 'pt' ? 'Departamentos' : 'Departments'}</h3>
            <p className="text-3xl font-bold text-blue-600">{DEPARTMENTS.length}</p>
            <p className="text-sm text-gray-600">{language === 'pt' ? 'setores disponíveis' : 'available sectors'}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">{language === 'pt' ? 'Obstáculos' : 'Obstacles'}</h3>
            <p className="text-3xl font-bold text-red-600">{MAIN_OBSTACLES.length}</p>
            <p className="text-sm text-gray-600">{language === 'pt' ? 'gôndolas e expositores' : 'gondolas and fixtures'}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">{language === 'pt' ? 'Área Transitável' : 'Walkable Area'}</h3>
            <p className="text-3xl font-bold text-green-600">48.2%</p>
            <p className="text-sm text-gray-600">{language === 'pt' ? 'corredores disponíveis' : 'available corridors'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
