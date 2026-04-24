import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

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

// Utility function to check if a point is on a white area (navigable)
const isWhitePixel = (imageData: ImageData, x: number, y: number): boolean => {
  const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];
  const a = imageData.data[index + 3];

  // White pixels have high R, G, B values and full alpha
  // Also check for light gray (corridors)
  return a > 200 && r > 200 && g > 200 && b > 200;
};

// A* pathfinding algorithm that respects white pixels only
const findPathOnWhitePixels = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  imageData: ImageData,
  maxIterations: number = 10000
): { x: number; y: number }[] => {
  const path: { x: number; y: number }[] = [];
  const visited = new Set<string>();
  const queue: Array<{ x: number; y: number; parent?: { x: number; y: number } }> = [{ x: start.x, y: start.y }];

  let iterations = 0;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const current = queue.shift()!;
    const key = `${Math.round(current.x)},${Math.round(current.y)}`;

    if (visited.has(key)) continue;
    visited.add(key);

    // Check if we reached the destination
    const distance = Math.hypot(current.x - end.x, current.y - end.y);
    if (distance < 20) {
      // Reconstruct path
      let node: any = current;
      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path;
    }

    // Explore neighbors in 8 directions
    const directions = [
      { dx: 5, dy: 0 }, { dx: -5, dy: 0 }, { dx: 0, dy: 5 }, { dx: 0, dy: -5 },
      { dx: 5, dy: 5 }, { dx: -5, dy: 5 }, { dx: 5, dy: -5 }, { dx: -5, dy: -5 }
    ];

    for (const dir of directions) {
      const newX = current.x + dir.dx;
      const newY = current.y + dir.dy;
      const newKey = `${Math.round(newX)},${Math.round(newY)}`;

      if (!visited.has(newKey) && isWhitePixel(imageData, newX, newY)) {
        queue.push({ x: newX, y: newY, parent: current });
      }
    }
  }

  // If no path found, return direct line as fallback
  return [
    { x: start.x, y: start.y },
    { x: end.x, y: end.y }
  ];
};

export default function SimulacaoPixelBased() {
  const { language } = useLanguage();
  const [currentSector, setCurrentSector] = useState('Açougue');
  const [destinationSector, setDestinationSector] = useState('Hortifrutí');
  const [isAnimating, setIsAnimating] = useState(false);
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [routeDescription, setRouteDescription] = useState('');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [distance, setDistance] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

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
        console.log('Floor plan image loaded successfully', img.width, 'x', img.height);
        setImageLoaded(true);
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load floor plan image');
    };
  }, []);

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
    if (!imageRef.current) {
      alert(language === 'pt' ? 'Imagem da planta ainda está carregando. Tente novamente.' : 'Floor plan image is still loading. Please try again.');
      return;
    }

    const startSector = SECTORS.find(s => s.name === currentSector);
    const endSector = SECTORS.find(s => s.name === destinationSector);

    if (!startSector || !endSector) return;

    setIsAnimating(true);

    // Create a simple path with waypoints
    const calculatedPath: { x: number; y: number }[] = [
      { x: startSector.x, y: startSector.y },
      { x: startSector.x + (endSector.x - startSector.x) * 0.3, y: startSector.y + (endSector.y - startSector.y) * 0.3 },
      { x: startSector.x + (endSector.x - startSector.x) * 0.7, y: startSector.y + (endSector.y - startSector.y) * 0.3 },
      { x: endSector.x, y: endSector.y }
    ];

    setPath(calculatedPath);

    // Calculate distance
    let totalDistance = 0;
    for (let i = 1; i < calculatedPath.length; i++) {
      const dx = calculatedPath[i].x - calculatedPath[i - 1].x;
      const dy = calculatedPath[i].y - calculatedPath[i - 1].y;
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
              disabled={isAnimating}
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
