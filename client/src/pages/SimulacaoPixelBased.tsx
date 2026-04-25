import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { PixelPathfinder, type Point } from '@/lib/pixelPathfinding';

interface Sector {
  name: string;
  nameEn: string;
  x: number;
  y: number;
  radius: number;
}

const SECTORS: Sector[] = [
  { name: 'Açougue', nameEn: 'Butcher', x: 220, y: 200, radius: 30 },
  { name: 'Hortifrutí', nameEn: 'Produce', x: 520, y: 200, radius: 30 },
  { name: 'Padaria', nameEn: 'Bakery', x: 800, y: 200, radius: 30 },
  { name: 'Bebidas', nameEn: 'Beverages', x: 350, y: 320, radius: 30 },
  { name: 'Cereais e Bolachas', nameEn: 'Cereals', x: 520, y: 320, radius: 30 },
  { name: 'Infantis', nameEn: 'Baby', x: 650, y: 320, radius: 30 },
  { name: 'Higiene', nameEn: 'Hygiene', x: 750, y: 320, radius: 30 },
  { name: 'Limpeza', nameEn: 'Cleaning', x: 820, y: 320, radius: 30 },
  { name: 'Utilidades', nameEn: 'Utilities', x: 900, y: 320, radius: 30 },
  { name: 'Congelados', nameEn: 'Frozen', x: 550, y: 520, radius: 30 },
  { name: 'Pet', nameEn: 'Pet', x: 700, y: 520, radius: 30 },
  { name: 'Bebidas Alcoólicas', nameEn: 'Alcoholic Beverages', x: 850, y: 520, radius: 30 },
];

export default function SimulacaoPixelBased() {
  const { language } = useLanguage();
  const [currentSector, setCurrentSector] = useState('Açougue');
  const [destinationSector, setDestinationSector] = useState('Hortifrutí');
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
  const pathfinderRef = useRef<PixelPathfinder | null>(null);

  // Load the floor plan image and extract pixel data
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/supermarket_floor_plan_dceb59fc.png';
    
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
        
        // Initialize pathfinder with image data
        pathfinderRef.current = new PixelPathfinder({
          imageData: imageDataRef.current,
          brightnessThreshold: 140,
          saturationThreshold: 0.2,
          cellSize: 4,
        });
        
        console.log('Floor plan image loaded successfully', img.width, 'x', img.height);
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

  // Draw image when it loads
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      console.log('Image drawn on canvas:', img.width, 'x', img.height);
    }
  }, [imageLoaded]);

  const handleStartNavigation = () => {
    if (!imageRef.current || !pathfinderRef.current) {
      setError(language === 'pt' 
        ? 'Imagem da planta ainda está carregando. Tente novamente.' 
        : 'Floor plan image is still loading. Please try again.');
      return;
    }

    const startSector = SECTORS.find(s => s.name === currentSector);
    const endSector = SECTORS.find(s => s.name === destinationSector);

    if (!startSector || !endSector) return;

    setIsAnimating(true);
    setError('');

    try {
      // Use pixel pathfinder to calculate path
      const calculatedPath = pathfinderRef.current.findPath(
        { x: startSector.x, y: startSector.y },
        { x: endSector.x, y: endSector.y }
      );

      if (!calculatedPath) {
        // Fallback to simple path if pathfinding fails
        const fallbackPath: Point[] = [
          { x: startSector.x, y: startSector.y },
          { x: startSector.x + (endSector.x - startSector.x) * 0.3, y: startSector.y + (endSector.y - startSector.y) * 0.3 },
          { x: startSector.x + (endSector.x - startSector.x) * 0.7, y: startSector.y + (endSector.y - startSector.y) * 0.3 },
          { x: endSector.x, y: endSector.y }
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
        { x: startSector.x, y: startSector.y },
        { x: endSector.x, y: endSector.y }
      ];
      
      for (let i = 1; i < displayPath.length; i++) {
        const dx = displayPath[i].x - displayPath[i - 1].x;
        const dy = displayPath[i].y - displayPath[i - 1].y;
        totalDistance += Math.hypot(dx, dy);
      }
      setDistance(Math.round(totalDistance));

      // Generate route description
      const description = language === 'pt'
        ? `Saia do setor ${currentSector}, siga pelos corredores até o setor ${destinationSector}.`
        : `Leave the ${currentSector} sector, follow the corridors to the ${destinationSector} sector.`;
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

  // Draw the floor plan with the path
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || path.length === 0 || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the floor plan image
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
    }

    // Draw the path up to animation progress
    const pathLength = path.length;
    const currentPathIndex = Math.floor(pathLength * animationProgress);

    if (currentPathIndex > 0 && path[0]) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
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
          ctx.moveTo(10, 0);
          ctx.lineTo(-5, -5);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }, [path, animationProgress, imageLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          {language === 'pt' ? 'Simulação de Navegação Avançada' : 'Advanced Navigation Simulation'}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {language === 'pt'
            ? 'Rotas realistas respeitando apenas corredores brancos e desviando de gôndolas'
            : 'Realistic routes respecting only white corridors and avoiding gondolas'}
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
                value={currentSector}
                onChange={(e) => setCurrentSector(e.target.value)}
                disabled={isAnimating}
                className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
              >
                {SECTORS.map(s => (
                  <option key={s.name} value={s.name}>
                    {language === 'pt' ? s.name : s.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'pt' ? 'Desejo ir para:' : 'I want to go to:'}
              </label>
              <select
                value={destinationSector}
                onChange={(e) => setDestinationSector(e.target.value)}
                disabled={isAnimating}
                className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
              >
                {SECTORS.map(s => (
                  <option key={s.name} value={s.name}>
                    {language === 'pt' ? s.name : s.nameEn}
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
          />
        </div>
      </div>
    </div>
  );
}
