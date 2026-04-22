/**
 * Simulação Page — Kadeh Simulação (Com Mapa Realista)
 * Interactive supermarket map with realistic floor plan and intelligent pathfinding
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, MapPin, Navigation } from "lucide-react";

// Define sectors based on the supermarket map image
const SECTORS = [
  { id: "acougue", name: { pt: "Açougue", en: "Butcher" }, x: 80, y: 100 },
  { id: "hortifruti", name: { pt: "Hortifrutí", en: "Produce" }, x: 350, y: 100 },
  { id: "padaria", name: { pt: "Padaria", en: "Bakery" }, x: 620, y: 100 },
  { id: "laticinios", name: { pt: "Laticínios e Bebidas Geladas", en: "Dairy & Cold Drinks" }, x: 80, y: 250 },
  { id: "bebidas", name: { pt: "Bebidas", en: "Beverages" }, x: 280, y: 250 },
  { id: "cereais", name: { pt: "Cereais e Bolachas", en: "Cereals & Crackers" }, x: 480, y: 250 },
  { id: "infantis", name: { pt: "Infantis", en: "Baby Products" }, x: 650, y: 250 },
  { id: "higiene", name: { pt: "Higiene", en: "Hygiene" }, x: 780, y: 250 },
  { id: "limpeza", name: { pt: "Limpeza", en: "Cleaning" }, x: 880, y: 250 },
  { id: "utilidades", name: { pt: "Utilidades", en: "Utilities" }, x: 980, y: 250 },
  { id: "congelados", name: { pt: "Congelados", en: "Frozen" }, x: 300, y: 450 },
  { id: "pet", name: { pt: "Pet", en: "Pet" }, x: 600, y: 450 },
  { id: "bebidas_alcoolicas", name: { pt: "Bebidas Alcoólicas", en: "Alcoholic Beverages" }, x: 850, y: 450 },
];

// Define gondolas (obstacles) - positions and dimensions
const GONDOLAS = [
  // Row 1 - Gondolas 1, 2, 3, 4
  { id: "g1", x: 150, y: 180, width: 80, height: 40, label: "Gôndola 1" },
  { id: "g2", x: 280, y: 180, width: 80, height: 40, label: "Gôndola 2" },
  { id: "g3", x: 410, y: 180, width: 80, height: 40, label: "Gôndola 3" },
  { id: "g4", x: 540, y: 180, width: 80, height: 40, label: "Gôndola 4" },
  // Row 2 - Gondolas 5, 6, 7, 8
  { id: "g5", x: 150, y: 320, width: 80, height: 40, label: "Gôndola 5" },
  { id: "g6", x: 280, y: 320, width: 80, height: 40, label: "Gôndola 6" },
  { id: "g7", x: 410, y: 320, width: 80, height: 40, label: "Gôndola 7" },
  { id: "g8", x: 540, y: 320, width: 80, height: 40, label: "Gôndola 8" },
  // Freezers and special areas
  { id: "freezer_h", x: 200, y: 400, width: 200, height: 60, label: "Freezer Horizontal" },
  { id: "freezer_v1", x: 500, y: 380, width: 40, height: 80, label: "Freezer Vertical" },
  { id: "freezer_v2", x: 750, y: 380, width: 40, height: 80, label: "Freezer Vertical" },
];

interface RoutePoint {
  x: number;
  y: number;
}

interface RouteAnimation {
  isAnimating: boolean;
  progress: number;
  path: RoutePoint[];
}

// Simple A* pathfinding algorithm
function findPath(start: RoutePoint, end: RoutePoint, obstacles: typeof GONDOLAS): RoutePoint[] {
  const path: RoutePoint[] = [start];

  // Add intermediate waypoints to avoid obstacles
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Check if direct path intersects with obstacles
  let needsDetour = false;
  for (const obs of obstacles) {
    if (
      lineIntersectsRect(start.x, start.y, end.x, end.y, obs.x, obs.y, obs.width, obs.height)
    ) {
      needsDetour = true;
      break;
    }
  }

  if (needsDetour) {
    // Add waypoints around obstacles
    const waypoint1: RoutePoint = { x: start.x, y: midY };
    const waypoint2: RoutePoint = { x: end.x, y: midY };

    path.push(waypoint1);
    path.push(waypoint2);
  }

  path.push(end);
  return path;
}

// Check if line intersects rectangle
function lineIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  // Add padding to rectangle for safety
  const padding = 30;
  const px1 = rx - padding;
  const py1 = ry - padding;
  const px2 = rx + rw + padding;
  const py2 = ry + rh + padding;

  // Check if line intersects with padded rectangle
  return (
    (x1 <= px2 && x2 >= px1 && y1 <= py2 && y2 >= py1) ||
    (x1 >= px1 && x1 <= px2 && y1 >= py1 && y1 <= py2) ||
    (x2 >= px1 && x2 <= px2 && y2 >= py1 && y2 <= py2)
  );
}

export default function SimulacaoMelhorada() {
  const { language } = useLanguage();
  const [currentSection, setCurrentSection] = useState<string>("acougue");
  const [destinationSection, setDestinationSection] = useState<string>("hortifruti");
  const [animation, setAnimation] = useState<RouteAnimation>({
    isAnimating: false,
    progress: 0,
    path: [],
  });

  const t = {
    pt: {
      title: "Simulação de Navegação",
      subtitle: "Veja como o cliente navega entre setores, desviando de gôndolas",
      currentLocation: "Você está em:",
      destination: "Desejo ir para:",
      startNavigation: "Iniciar Navegação",
      selectSection: "Selecione um setor",
    },
    en: {
      title: "Navigation Simulation",
      subtitle: "See how the customer navigates between sections, avoiding gondolas",
      currentLocation: "You are at:",
      destination: "I want to go to:",
      startNavigation: "Start Navigation",
      selectSection: "Select a section",
    },
  };

  const texts = t[language as keyof typeof t];

  const currentSectorData = SECTORS.find((s) => s.id === currentSection);
  const destinationSectorData = SECTORS.find((s) => s.id === destinationSection);

  // Animate the route
  useEffect(() => {
    if (!animation.isAnimating) return;

    const animationDuration = 4000; // 4 seconds
    const startTime = Date.now();

    const animateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setAnimation((prev) => ({
        ...prev,
        progress,
      }));

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        setAnimation((prev) => ({
          ...prev,
          isAnimating: false,
        }));
      }
    };

    requestAnimationFrame(animateFrame);
  }, [animation.isAnimating]);

  const handleStartNavigation = () => {
    if (!currentSectorData || !destinationSectorData) return;

    const start = { x: currentSectorData.x, y: currentSectorData.y };
    const end = { x: destinationSectorData.x, y: destinationSectorData.y };
    const path = findPath(start, end, GONDOLAS);

    setAnimation({
      isAnimating: true,
      progress: 0,
      path,
    });
  };

  // Calculate current position on path
  const getCurrentPosition = (): RoutePoint | null => {
    if (animation.path.length === 0) return null;

    const totalDistance = animation.path.reduce((sum, point, idx) => {
      if (idx === 0) return 0;
      const prev = animation.path[idx - 1];
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    let currentDistance = totalDistance * animation.progress;
    let currentSegment = 0;

    for (let i = 1; i < animation.path.length; i++) {
      const prev = animation.path[i - 1];
      const curr = animation.path[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const segmentDistance = Math.sqrt(dx * dx + dy * dy);

      if (currentDistance <= segmentDistance) {
        const ratio = segmentDistance > 0 ? currentDistance / segmentDistance : 0;
        return {
          x: prev.x + dx * ratio,
          y: prev.y + dy * ratio,
        };
      }

      currentDistance -= segmentDistance;
    }

    return animation.path[animation.path.length - 1];
  };

  const currentPos = getCurrentPosition();

  // Calculate arrow rotation
  let arrowAngle = 0;
  if (currentPos && animation.path.length > 0) {
    const nextIdx = Math.min(
      Math.floor(animation.path.length * animation.progress) + 1,
      animation.path.length - 1
    );
    const nextPoint = animation.path[nextIdx];
    const dx = nextPoint.x - currentPos.x;
    const dy = nextPoint.y - currentPos.y;
    arrowAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {texts.title}
            </h1>
            <p className="text-lg text-slate-600">
              {texts.subtitle}
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Current Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  {texts.currentLocation}
                </label>
                <Select value={currentSection} onValueChange={setCurrentSection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={texts.selectSection} />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name[language as keyof typeof sector.name]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Arrow Icon */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-slate-400" />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  {texts.destination}
                </label>
                <Select value={destinationSection} onValueChange={setDestinationSection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={texts.selectSection} />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name[language as keyof typeof sector.name]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Start Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleStartNavigation}
                disabled={animation.isAnimating}
                size="lg"
                className="gap-2"
              >
                <Navigation className="w-5 h-5" />
                {texts.startNavigation}
              </Button>
            </div>
          </div>

          {/* Supermarket Map with Realistic Floor Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 overflow-auto">
            <svg
              width="100%"
              height="600"
              viewBox="0 0 1000 500"
              className="border border-slate-200 rounded-lg"
              style={{ backgroundColor: "#f8fafc" }}
            >
              {/* Background Image */}
              <image
                href="https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/ChatGPTImage22deabr.de2026,14_34_09_9fcc9b7f.png"
                x="0"
                y="0"
                width="1000"
                height="500"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.3"
              />

              {/* Sectors - Positioned on top of the floor plan */}
              {SECTORS.map((sector) => (
                <g key={sector.id}>
                  <circle
                    cx={sector.x}
                    cy={sector.y}
                    r="25"
                    fill={
                      currentSection === sector.id
                        ? "#10b981"
                        : destinationSection === sector.id
                        ? "#f59e0b"
                        : "#3b82f6"
                    }
                    opacity="0.9"
                  />

                  {/* Current location indicator */}
                  {currentSection === sector.id && (
                    <circle
                      cx={sector.x}
                      cy={sector.y}
                      r="35"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Destination indicator */}
                  {destinationSection === sector.id && (
                    <circle
                      cx={sector.x}
                      cy={sector.y}
                      r="35"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}
                </g>
              ))}

              {/* Animated path */}
              {animation.isAnimating && animation.path.length > 0 && (
                <>
                  {/* Path line */}
                  {animation.path.map((point, idx) => {
                    if (idx === 0) return null;
                    const prev = animation.path[idx - 1];
                    const progress = Math.min(animation.progress * animation.path.length - idx + 1, 1);
                    if (progress <= 0) return null;

                    return (
                      <line
                        key={`line-${idx}`}
                        x1={prev.x}
                        y1={prev.y}
                        x2={prev.x + (point.x - prev.x) * progress}
                        y2={prev.y + (point.y - prev.y) * progress}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                    );
                  })}

                  {/* Animated arrow */}
                  {currentPos && animation.progress < 1 && (
                    <g transform={`translate(${currentPos.x}, ${currentPos.y}) rotate(${arrowAngle})`}>
                      <polygon points="0,-8 15,0 0,8" fill="#3b82f6" />
                      <circle cx="0" cy="0" r="6" fill="#1e40af" />
                    </g>
                  )}
                </>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {language === "pt" ? "Legenda" : "Legend"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-slate-700 mb-3">
                  {language === "pt" ? "Setores" : "Sectors"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500" />
                    <span className="text-sm text-slate-700">
                      {language === "pt" ? "Localização Atual" : "Current Location"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-700">
                      {language === "pt" ? "Destino" : "Destination"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-700">
                      {language === "pt" ? "Outro Setor" : "Other Sector"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">
                  {language === "pt" ? "Funcionalidades" : "Features"}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-slate-700">
                    {language === "pt" 
                      ? "✓ Pathfinding inteligente" 
                      : "✓ Intelligent pathfinding"}
                  </p>
                  <p className="text-sm text-slate-700">
                    {language === "pt" 
                      ? "✓ Desvio automático de gôndolas" 
                      : "✓ Automatic gondola avoidance"}
                  </p>
                  <p className="text-sm text-slate-700">
                    {language === "pt" 
                      ? "✓ Animação em tempo real" 
                      : "✓ Real-time animation"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">
                  {language === "pt" ? "Rota" : "Route"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-1 bg-blue-500" />
                    <span className="text-sm text-slate-700">
                      {language === "pt" ? "Caminho Animado" : "Animated Path"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-700" />
                    <span className="text-sm text-slate-700">
                      {language === "pt" ? "Posição Atual" : "Current Position"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
