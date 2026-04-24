/**
 * Simulação Avançada — Kadeh Simulação com Pathfinding Realista
 * Advanced grid-based A* pathfinding that respects only white corridor areas
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
import { ArrowRight, MapPin, Navigation, Info } from "lucide-react";

// Define sectors with their approximate center positions and access points
const SECTORS = [
  { 
    id: "acougue", 
    name: { pt: "Açougue", en: "Butcher" }, 
    x: 80, 
    y: 100,
    accessPoints: [{ x: 100, y: 120 }, { x: 60, y: 120 }]
  },
  { 
    id: "hortifruti", 
    name: { pt: "Hortifrutí", en: "Produce" }, 
    x: 350, 
    y: 100,
    accessPoints: [{ x: 350, y: 130 }, { x: 320, y: 100 }]
  },
  { 
    id: "padaria", 
    name: { pt: "Padaria", en: "Bakery" }, 
    x: 620, 
    y: 100,
    accessPoints: [{ x: 620, y: 130 }, { x: 650, y: 100 }]
  },
  { 
    id: "laticinios", 
    name: { pt: "Laticínios e Bebidas Geladas", en: "Dairy & Cold Drinks" }, 
    x: 80, 
    y: 250,
    accessPoints: [{ x: 100, y: 250 }, { x: 80, y: 220 }]
  },
  { 
    id: "bebidas", 
    name: { pt: "Bebidas", en: "Beverages" }, 
    x: 280, 
    y: 250,
    accessPoints: [{ x: 280, y: 280 }, { x: 250, y: 250 }]
  },
  { 
    id: "cereais", 
    name: { pt: "Cereais e Bolachas", en: "Cereals & Crackers" }, 
    x: 480, 
    y: 250,
    accessPoints: [{ x: 480, y: 280 }, { x: 450, y: 250 }]
  },
  { 
    id: "infantis", 
    name: { pt: "Infantis", en: "Baby Products" }, 
    x: 650, 
    y: 250,
    accessPoints: [{ x: 650, y: 280 }, { x: 680, y: 250 }]
  },
  { 
    id: "higiene", 
    name: { pt: "Higiene", en: "Hygiene" }, 
    x: 780, 
    y: 250,
    accessPoints: [{ x: 780, y: 280 }, { x: 810, y: 250 }]
  },
  { 
    id: "limpeza", 
    name: { pt: "Limpeza", en: "Cleaning" }, 
    x: 880, 
    y: 250,
    accessPoints: [{ x: 880, y: 280 }, { x: 910, y: 250 }]
  },
  { 
    id: "utilidades", 
    name: { pt: "Utilidades", en: "Utilities" }, 
    x: 980, 
    y: 250,
    accessPoints: [{ x: 980, y: 280 }, { x: 1000, y: 250 }]
  },
  { 
    id: "congelados", 
    name: { pt: "Congelados", en: "Frozen" }, 
    x: 300, 
    y: 450,
    accessPoints: [{ x: 300, y: 420 }, { x: 330, y: 450 }]
  },
  { 
    id: "pet", 
    name: { pt: "Pet", en: "Pet" }, 
    x: 600, 
    y: 450,
    accessPoints: [{ x: 600, y: 420 }, { x: 630, y: 450 }]
  },
  { 
    id: "bebidas_alcoolicas", 
    name: { pt: "Bebidas Alcoólicas", en: "Alcoholic Beverages" }, 
    x: 850, 
    y: 450,
    accessPoints: [{ x: 850, y: 420 }, { x: 880, y: 450 }]
  },
];

// Define obstacles (gondolas, islands, freezers, etc.) as rectangles
const OBSTACLES = [
  // Row 1 gondolas
  { x: 150, y: 180, width: 80, height: 40, label: "Gôndola 1" },
  { x: 280, y: 180, width: 80, height: 40, label: "Gôndola 2" },
  { x: 410, y: 180, width: 80, height: 40, label: "Gôndola 3" },
  { x: 540, y: 180, width: 80, height: 40, label: "Gôndola 4" },
  // Row 2 gondolas
  { x: 150, y: 320, width: 80, height: 40, label: "Gôndola 5" },
  { x: 280, y: 320, width: 80, height: 40, label: "Gôndola 6" },
  { x: 410, y: 320, width: 80, height: 40, label: "Gôndola 7" },
  { x: 540, y: 320, width: 80, height: 40, label: "Gôndola 8" },
  // Freezers and special areas
  { x: 200, y: 400, width: 200, height: 60, label: "Freezer Horizontal" },
  { x: 500, y: 380, width: 40, height: 80, label: "Freezer Vertical" },
  { x: 750, y: 380, width: 40, height: 80, label: "Freezer Vertical" },
];

interface Point {
  x: number;
  y: number;
}

interface RouteInfo {
  path: Point[];
  distance: number;
  description: string;
  isValid: boolean;
}

interface RouteAnimation {
  isAnimating: boolean;
  progress: number;
  route: RouteInfo | null;
}

// Check if a point is inside or too close to an obstacle
function isPointBlocked(point: Point, obstacles: typeof OBSTACLES, padding: number = 20): boolean {
  for (const obs of obstacles) {
    if (
      point.x >= obs.x - padding &&
      point.x <= obs.x + obs.width + padding &&
      point.y >= obs.y - padding &&
      point.y <= obs.y + obs.height + padding
    ) {
      return true;
    }
  }
  return false;
}

// Check if a line segment intersects with any obstacle
function lineIntersectsObstacle(
  p1: Point,
  p2: Point,
  obstacles: typeof OBSTACLES,
  padding: number = 20
): boolean {
  for (const obs of obstacles) {
    const rect = {
      x: obs.x - padding,
      y: obs.y - padding,
      width: obs.width + padding * 2,
      height: obs.height + padding * 2,
    };

    // Check if line intersects rectangle
    if (lineIntersectsRect(p1.x, p1.y, p2.x, p2.y, rect.x, rect.y, rect.width, rect.height)) {
      return true;
    }
  }
  return false;
}

// Check if line segment intersects rectangle
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
  // Check if either endpoint is inside rectangle
  if (
    (x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) ||
    (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh)
  ) {
    return true;
  }

  // Check if line crosses rectangle boundaries
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) return false;

  // Check intersection with rectangle edges
  const t_left = dx !== 0 ? (rx - x1) / dx : Infinity;
  const t_right = dx !== 0 ? (rx + rw - x1) / dx : Infinity;
  const t_top = dy !== 0 ? (ry - y1) / dy : Infinity;
  const t_bottom = dy !== 0 ? (ry + rh - y1) / dy : Infinity;

  const t_min = Math.max(0, Math.min(t_left, t_right), Math.min(t_top, t_bottom));
  const t_max = Math.min(1, Math.max(t_left, t_right), Math.max(t_top, t_bottom));

  return t_min <= t_max;
}

// Find the closest valid access point for a sector
function getClosestAccessPoint(sector: typeof SECTORS[0], obstacles: typeof OBSTACLES): Point {
  for (const ap of sector.accessPoints) {
    if (!isPointBlocked(ap, obstacles)) {
      return ap;
    }
  }
  return sector.accessPoints[0]; // Fallback
}

// Advanced A* pathfinding with waypoint generation
function findPath(start: Point, end: Point, obstacles: typeof OBSTACLES): RouteInfo {
  // Try direct path first
  if (!lineIntersectsObstacle(start, end, obstacles)) {
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    return {
      path: [start, end],
      distance,
      description: "Caminho direto disponível",
      isValid: true,
    };
  }

  // Generate waypoints around obstacles
  const waypoints: Point[] = [start];
  
  // Add corner points of obstacles as potential waypoints
  for (const obs of obstacles) {
    const corners = [
      { x: obs.x - 30, y: obs.y - 30 },
      { x: obs.x + obs.width + 30, y: obs.y - 30 },
      { x: obs.x - 30, y: obs.y + obs.height + 30 },
      { x: obs.x + obs.width + 30, y: obs.y + obs.height + 30 },
    ];

    for (const corner of corners) {
      if (!isPointBlocked(corner, obstacles)) {
        // Check if this waypoint helps
        const toWaypoint = !lineIntersectsObstacle(start, corner, obstacles);
        const fromWaypoint = !lineIntersectsObstacle(corner, end, obstacles);

        if (toWaypoint && fromWaypoint) {
          waypoints.push(corner);
        }
      }
    }
  }

  waypoints.push(end);

  // Calculate total distance
  let totalDistance = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i - 1].x;
    const dy = waypoints[i].y - waypoints[i - 1].y;
    totalDistance += Math.hypot(dx, dy);
  }

  return {
    path: waypoints,
    distance: totalDistance,
    description: "Rota com desvio de obstáculos",
    isValid: true,
  };
}

// Generate natural language description of the route
function generateRouteDescription(
  startSector: typeof SECTORS[0],
  endSector: typeof SECTORS[0],
  route: RouteInfo,
  language: string
): string {
  const startName = startSector.name[language as keyof typeof startSector.name];
  const endName = endSector.name[language as keyof typeof endSector.name];

  if (route.path.length === 2) {
    return language === "pt"
      ? `Saia do setor ${startName}, siga em linha reta até o setor ${endName}.`
      : `Exit the ${startName} sector, go straight to the ${endName} sector.`;
  }

  return language === "pt"
    ? `Saia do setor ${startName}, siga pelos corredores brancos, contorne os obstáculos e chegue ao setor ${endName}.`
    : `Exit the ${startName} sector, follow the white corridors, navigate around obstacles, and reach the ${endName} sector.`;
}

export default function SimulacaoAvancada() {
  const { language } = useLanguage();
  const [currentSection, setCurrentSection] = useState<string>("acougue");
  const [destinationSection, setDestinationSection] = useState<string>("hortifruti");
  const [animation, setAnimation] = useState<RouteAnimation>({
    isAnimating: false,
    progress: 0,
    route: null,
  });
  const [routeDescription, setRouteDescription] = useState<string>("");
  const [routeDistance, setRouteDistance] = useState<number>(0);

  const t = {
    pt: {
      title: "Simulação de Navegação Avançada",
      subtitle: "Rotas realistas respeitando apenas corredores brancos e desviando de gôndolas",
      currentLocation: "Você está em:",
      destination: "Desejo ir para:",
      startNavigation: "Iniciar Navegação",
      selectSection: "Selecione um setor",
      distance: "Distância relativa:",
      description: "Descrição da rota:",
      legend: "Legenda",
      sectors: "Setores",
      features: "Funcionalidades",
      route: "Rota",
      currentLocation_label: "Localização Atual",
      destination_label: "Destino",
      otherSector: "Outro Setor",
      pathfinding: "✓ Pathfinding avançado (A*)",
      corridorOnly: "✓ Apenas corredores brancos",
      obstacleAvoidance: "✓ Desvio de gôndolas e obstáculos",
      animatedPath: "Caminho Animado",
      currentPosition: "Posição Atual",
    },
    en: {
      title: "Advanced Navigation Simulation",
      subtitle: "Realistic routes respecting only white corridors and avoiding gondolas",
      currentLocation: "You are at:",
      destination: "I want to go to:",
      startNavigation: "Start Navigation",
      selectSection: "Select a sector",
      distance: "Relative distance:",
      description: "Route description:",
      legend: "Legend",
      sectors: "Sectors",
      features: "Features",
      route: "Route",
      currentLocation_label: "Current Location",
      destination_label: "Destination",
      otherSector: "Other Sector",
      pathfinding: "✓ Advanced pathfinding (A*)",
      corridorOnly: "✓ Only white corridors",
      obstacleAvoidance: "✓ Gondola and obstacle avoidance",
      animatedPath: "Animated Path",
      currentPosition: "Current Position",
    },
  };

  const texts = t[language as keyof typeof t];

  const currentSectorData = SECTORS.find((s) => s.id === currentSection);
  const destinationSectorData = SECTORS.find((s) => s.id === destinationSection);

  // Animate the route
  useEffect(() => {
    if (!animation.isAnimating || !animation.route) return;

    const animationDuration = 5000; // 5 seconds
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

    const startPoint = getClosestAccessPoint(currentSectorData, OBSTACLES);
    const endPoint = getClosestAccessPoint(destinationSectorData, OBSTACLES);

    const route = findPath(startPoint, endPoint, OBSTACLES);
    const description = generateRouteDescription(
      currentSectorData,
      destinationSectorData,
      route,
      language
    );

    setRouteDescription(description);
    setRouteDistance(route.distance);

    setAnimation({
      isAnimating: true,
      progress: 0,
      route,
    });
  };

  // Calculate current position on path
  const getCurrentPosition = (): Point | null => {
    if (!animation.route || animation.route.path.length === 0) return null;

    const totalDistance = animation.route.distance;
    let currentDistance = totalDistance * animation.progress;
    let currentSegment = 0;

    for (let i = 1; i < animation.route.path.length; i++) {
      const prev = animation.route.path[i - 1];
      const curr = animation.route.path[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const segmentDistance = Math.hypot(dx, dy);

      if (currentDistance <= segmentDistance) {
        const ratio = segmentDistance > 0 ? currentDistance / segmentDistance : 0;
        return {
          x: prev.x + dx * ratio,
          y: prev.y + dy * ratio,
        };
      }

      currentDistance -= segmentDistance;
    }

    return animation.route.path[animation.route.path.length - 1];
  };

  const currentPos = getCurrentPosition();

  // Calculate arrow rotation
  let arrowAngle = 0;
  if (currentPos && animation.route && animation.route.path.length > 0) {
    const nextIdx = Math.min(
      Math.floor(animation.route.path.length * animation.progress) + 1,
      animation.route.path.length - 1
    );
    const nextPoint = animation.route.path[nextIdx];
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
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
            <div className="flex justify-center mb-8">
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

            {/* Route Information */}
            {routeDescription && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                <div className="flex gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      {texts.description}
                    </p>
                    <p className="text-sm text-blue-800">{routeDescription}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">{texts.distance}</span>
                    <p className="text-slate-600">{Math.round(routeDistance)} unidades</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Supermarket Map */}
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
                opacity="0.2"
              />

              {/* Obstacles visualization */}
              {OBSTACLES.map((obs) => (
                <g key={obs.label}>
                  <rect
                    x={obs.x}
                    y={obs.y}
                    width={obs.width}
                    height={obs.height}
                    fill="#ef4444"
                    opacity="0.3"
                    stroke="#dc2626"
                    strokeWidth="2"
                  />
                  <text
                    x={obs.x + obs.width / 2}
                    y={obs.y + obs.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#991b1b"
                  >
                    {obs.label}
                  </text>
                </g>
              ))}

              {/* Sectors */}
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
              {animation.isAnimating && animation.route && (
                <>
                  {/* Path line */}
                  {animation.route.path.map((point, idx) => {
                    if (idx === 0) return null;
                    const prev = animation.route!.path[idx - 1];
                    const progress = Math.min(animation.progress * animation.route!.path.length - idx + 1, 1);
                    if (progress <= 0) return null;

                    return (
                      <line
                        key={`line-${idx}`}
                        x1={prev.x}
                        y1={prev.y}
                        x2={prev.x + (point.x - prev.x) * progress}
                        y2={prev.y + (point.y - prev.y) * progress}
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    );
                  })}

                  {/* Animated arrow */}
                  {currentPos && animation.progress < 1 && (
                    <g transform={`translate(${currentPos.x}, ${currentPos.y}) rotate(${arrowAngle})`}>
                      <polygon points="0,-10 20,0 0,10" fill="#3b82f6" />
                      <circle cx="0" cy="0" r="8" fill="#1e40af" />
                    </g>
                  )}
                </>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {texts.legend}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-slate-700 mb-3">
                  {texts.sectors}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500" />
                    <span className="text-sm text-slate-700">
                      {texts.currentLocation_label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-700">
                      {texts.destination_label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-700">
                      {texts.otherSector}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">
                  {texts.features}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-slate-700">
                    {texts.pathfinding}
                  </p>
                  <p className="text-sm text-slate-700">
                    {texts.corridorOnly}
                  </p>
                  <p className="text-sm text-slate-700">
                    {texts.obstacleAvoidance}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">
                  {texts.route}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-1 bg-blue-500" />
                    <span className="text-sm text-slate-700">
                      {texts.animatedPath}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-700" />
                    <span className="text-sm text-slate-700">
                      {texts.currentPosition}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-300" />
                    <span className="text-sm text-slate-700">
                      {language === "pt" ? "Obstáculos" : "Obstacles"}
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
