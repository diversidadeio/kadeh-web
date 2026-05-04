/**
 * Simulação Page — Kadeh Simulação
 * Interactive supermarket map with route animation
 * Uses the actual store floor plan image with proper pathfinding around gondolas
 */

import { useState, useEffect, useRef, useMemo } from "react";
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

// Floor plan image URL
const FLOOR_PLAN_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/plantaexemplosimplificada-kadeh.mercado_2fe3b4ed.webp";

// Map dimensions (based on the floor plan proportions)
const MAP_WIDTH = 1456;
const MAP_HEIGHT = 850;

// Define sections/areas of the supermarket with positions matching the floor plan
// Coordinates are based on the actual floor plan image
const SECTIONS = [
  { id: "acougue", name: { pt: "Açougue", en: "Butcher" }, color: "#CC0000", x: 270, y: 35 },
  { id: "hortifruti", name: { pt: "Hortifrutí", en: "Produce" }, color: "#0066FF", x: 830, y: 35 },
  { id: "padaria", name: { pt: "Padaria", en: "Bakery" }, color: "#FF9900", x: 1280, y: 35 },
  { id: "laticinio", name: { pt: "Laticínios", en: "Dairy" }, color: "#FFD700", x: 140, y: 210 },
  { id: "refrigerantes", name: { pt: "Refrigerantes", en: "Soft Drinks" }, color: "#00AA00", x: 460, y: 210 },
  { id: "cereais", name: { pt: "Cereais", en: "Cereals" }, color: "#00AA00", x: 700, y: 210 },
  { id: "infantis", name: { pt: "Infantis", en: "Baby" }, color: "#0066FF", x: 900, y: 210 },
  { id: "higiene_top", name: { pt: "Higiene", en: "Hygiene" }, color: "#FF66AA", x: 1060, y: 210 },
  { id: "limpeza", name: { pt: "Limpeza", en: "Cleaning" }, color: "#FF66FF", x: 1180, y: 210 },
  { id: "utilidades", name: { pt: "Utilidades", en: "Utilities" }, color: "#666666", x: 1340, y: 210 },
  { id: "gondola1", name: { pt: "Óleos, molhos", en: "Oils, sauces" }, color: "#D4A574", x: 65, y: 430 },
  { id: "gondola2", name: { pt: "Temperos, arroz", en: "Spices, rice" }, color: "#D4A574", x: 195, y: 430 },
  { id: "gondola3", name: { pt: "Massas, importados", en: "Pasta, imported" }, color: "#D4A574", x: 310, y: 430 },
  { id: "gondola4", name: { pt: "Açúcares, cafés", en: "Sugar, coffee" }, color: "#D4A574", x: 435, y: 430 },
  { id: "gondola6", name: { pt: "Biscoitos, cereais", en: "Cookies, cereals" }, color: "#D4A574", x: 590, y: 430 },
  { id: "gondola7", name: { pt: "Achocolatados", en: "Chocolate drinks" }, color: "#D4A574", x: 700, y: 430 },
  { id: "gondola8", name: { pt: "Higiene pessoal", en: "Personal hygiene" }, color: "#D4A574", x: 820, y: 430 },
  { id: "gondola9", name: { pt: "Detergentes", en: "Detergents" }, color: "#D4A574", x: 940, y: 430 },
  { id: "gondola10", name: { pt: "Higiene", en: "Hygiene" }, color: "#D4A574", x: 1060, y: 430 },
  { id: "gondola11", name: { pt: "Mat. limpeza", en: "Cleaning mat." }, color: "#D4A574", x: 1160, y: 430 },
  { id: "gondola12", name: { pt: "Limpadores", en: "Cleaners" }, color: "#D4A574", x: 1270, y: 430 },
  { id: "organicos", name: { pt: "Orgânicos & Naturais", en: "Organic & Natural" }, color: "#228B22", x: 710, y: 700 },
  { id: "talheres", name: { pt: "Talheres", en: "Cutlery" }, color: "#333333", x: 1050, y: 660 },
  { id: "pet", name: { pt: "Pet", en: "Pet" }, color: "#333333", x: 1170, y: 660 },
  { id: "bebidas_alcoolicas", name: { pt: "Bebidas Alcoólicas", en: "Alcoholic Beverages" }, color: "#333333", x: 1340, y: 660 },
  { id: "caixas", name: { pt: "Caixas", en: "Checkout" }, color: "#FFD700", x: 170, y: 780 },
];

// Define walkable corridors (aisles) as waypoints
// These represent the corridors between gondolas where people can walk
const CORRIDOR_WAYPOINTS = [
  // Top corridor (along the top sections - Açougue, Hortifruti, Padaria)
  { id: "c_top_1", x: 50, y: 80 },
  { id: "c_top_2", x: 270, y: 80 },
  { id: "c_top_3", x: 500, y: 80 },
  { id: "c_top_4", x: 730, y: 80 },
  { id: "c_top_5", x: 1000, y: 80 },
  { id: "c_top_6", x: 1280, y: 80 },
  { id: "c_top_7", x: 1420, y: 80 },

  // Second corridor (between top sections and gondolas)
  { id: "c_mid1_1", x: 50, y: 175 },
  { id: "c_mid1_2", x: 270, y: 175 },
  { id: "c_mid1_3", x: 500, y: 175 },
  { id: "c_mid1_4", x: 730, y: 175 },
  { id: "c_mid1_5", x: 1000, y: 175 },
  { id: "c_mid1_6", x: 1200, y: 175 },
  { id: "c_mid1_7", x: 1420, y: 175 },

  // Corridor above gondolas (between category labels and gondola tops)
  { id: "c_above_g1", x: 50, y: 270 },
  { id: "c_above_g2", x: 195, y: 270 },
  { id: "c_above_g3", x: 370, y: 270 },
  { id: "c_above_g4", x: 530, y: 270 },
  { id: "c_above_g5", x: 700, y: 270 },
  { id: "c_above_g6", x: 880, y: 270 },
  { id: "c_above_g7", x: 1060, y: 270 },
  { id: "c_above_g8", x: 1200, y: 270 },
  { id: "c_above_g9", x: 1350, y: 270 },
  { id: "c_above_g10", x: 1420, y: 270 },

  // Corridor below gondolas (between gondola bottoms and lower sections)
  { id: "c_below_g1", x: 50, y: 600 },
  { id: "c_below_g2", x: 195, y: 600 },
  { id: "c_below_g3", x: 370, y: 600 },
  { id: "c_below_g4", x: 530, y: 600 },
  { id: "c_below_g5", x: 700, y: 600 },
  { id: "c_below_g6", x: 880, y: 600 },
  { id: "c_below_g7", x: 1060, y: 600 },
  { id: "c_below_g8", x: 1200, y: 600 },
  { id: "c_below_g9", x: 1350, y: 600 },
  { id: "c_below_g10", x: 1420, y: 600 },

  // Bottom corridor (along the bottom - caixas, orgânicos, pet)
  { id: "c_bot_1", x: 50, y: 750 },
  { id: "c_bot_2", x: 270, y: 750 },
  { id: "c_bot_3", x: 500, y: 750 },
  { id: "c_bot_4", x: 730, y: 750 },
  { id: "c_bot_5", x: 1000, y: 750 },
  { id: "c_bot_6", x: 1200, y: 750 },
  { id: "c_bot_7", x: 1420, y: 750 },

  // Vertical corridors between gondolas (aisles)
  { id: "c_aisle_1", x: 130, y: 350 },
  { id: "c_aisle_1b", x: 130, y: 500 },
  { id: "c_aisle_2", x: 255, y: 350 },
  { id: "c_aisle_2b", x: 255, y: 500 },
  { id: "c_aisle_3", x: 370, y: 350 },
  { id: "c_aisle_3b", x: 370, y: 500 },
  { id: "c_aisle_4", x: 510, y: 350 },
  { id: "c_aisle_4b", x: 510, y: 500 },
  { id: "c_aisle_5", x: 650, y: 350 },
  { id: "c_aisle_5b", x: 650, y: 500 },
  { id: "c_aisle_6", x: 765, y: 350 },
  { id: "c_aisle_6b", x: 765, y: 500 },
  { id: "c_aisle_7", x: 880, y: 350 },
  { id: "c_aisle_7b", x: 880, y: 500 },
  { id: "c_aisle_8", x: 1000, y: 350 },
  { id: "c_aisle_8b", x: 1000, y: 500 },
  { id: "c_aisle_9", x: 1115, y: 350 },
  { id: "c_aisle_9b", x: 1115, y: 500 },
  { id: "c_aisle_10", x: 1220, y: 350 },
  { id: "c_aisle_10b", x: 1220, y: 500 },
  { id: "c_aisle_11", x: 1350, y: 350 },
  { id: "c_aisle_11b", x: 1350, y: 500 },
];

// Define connections between corridor waypoints (edges of the navigation graph)
const CORRIDOR_EDGES: [string, string][] = [
  // Top horizontal corridor
  ["c_top_1", "c_top_2"], ["c_top_2", "c_top_3"], ["c_top_3", "c_top_4"],
  ["c_top_4", "c_top_5"], ["c_top_5", "c_top_6"], ["c_top_6", "c_top_7"],

  // Second horizontal corridor
  ["c_mid1_1", "c_mid1_2"], ["c_mid1_2", "c_mid1_3"], ["c_mid1_3", "c_mid1_4"],
  ["c_mid1_4", "c_mid1_5"], ["c_mid1_5", "c_mid1_6"], ["c_mid1_6", "c_mid1_7"],

  // Above gondolas horizontal corridor
  ["c_above_g1", "c_above_g2"], ["c_above_g2", "c_above_g3"], ["c_above_g3", "c_above_g4"],
  ["c_above_g4", "c_above_g5"], ["c_above_g5", "c_above_g6"], ["c_above_g6", "c_above_g7"],
  ["c_above_g7", "c_above_g8"], ["c_above_g8", "c_above_g9"], ["c_above_g9", "c_above_g10"],

  // Below gondolas horizontal corridor
  ["c_below_g1", "c_below_g2"], ["c_below_g2", "c_below_g3"], ["c_below_g3", "c_below_g4"],
  ["c_below_g4", "c_below_g5"], ["c_below_g5", "c_below_g6"], ["c_below_g6", "c_below_g7"],
  ["c_below_g7", "c_below_g8"], ["c_below_g8", "c_below_g9"], ["c_below_g9", "c_below_g10"],

  // Bottom horizontal corridor
  ["c_bot_1", "c_bot_2"], ["c_bot_2", "c_bot_3"], ["c_bot_3", "c_bot_4"],
  ["c_bot_4", "c_bot_5"], ["c_bot_5", "c_bot_6"], ["c_bot_6", "c_bot_7"],

  // Vertical connections (top to mid1)
  ["c_top_1", "c_mid1_1"], ["c_top_2", "c_mid1_2"], ["c_top_3", "c_mid1_3"],
  ["c_top_4", "c_mid1_4"], ["c_top_5", "c_mid1_5"], ["c_top_6", "c_mid1_6"],
  ["c_top_7", "c_mid1_7"],

  // Vertical connections (mid1 to above gondolas)
  ["c_mid1_1", "c_above_g1"], ["c_mid1_2", "c_above_g2"], ["c_mid1_3", "c_above_g3"],
  ["c_mid1_4", "c_above_g5"], ["c_mid1_5", "c_above_g7"], ["c_mid1_6", "c_above_g8"],
  ["c_mid1_7", "c_above_g10"],

  // Vertical aisles between gondolas (above to below)
  ["c_above_g1", "c_aisle_1"], ["c_aisle_1", "c_aisle_1b"], ["c_aisle_1b", "c_below_g1"],
  ["c_above_g2", "c_aisle_2"], ["c_aisle_2", "c_aisle_2b"], ["c_aisle_2b", "c_below_g2"],
  ["c_above_g3", "c_aisle_3"], ["c_aisle_3", "c_aisle_3b"], ["c_aisle_3b", "c_below_g3"],
  ["c_above_g4", "c_aisle_4"], ["c_aisle_4", "c_aisle_4b"], ["c_aisle_4b", "c_below_g4"],
  ["c_above_g5", "c_aisle_5"], ["c_aisle_5", "c_aisle_5b"], ["c_aisle_5b", "c_below_g5"],
  ["c_above_g6", "c_aisle_6"], ["c_aisle_6", "c_aisle_6b"], ["c_aisle_6b", "c_below_g6"],
  ["c_above_g7", "c_aisle_7"], ["c_aisle_7", "c_aisle_7b"], ["c_aisle_7b", "c_below_g7"],
  ["c_above_g8", "c_aisle_8"], ["c_aisle_8", "c_aisle_8b"], ["c_aisle_8b", "c_below_g8"],
  ["c_above_g9", "c_aisle_9"], ["c_aisle_9", "c_aisle_9b"], ["c_aisle_9b", "c_below_g9"],
  ["c_above_g10", "c_aisle_10"], ["c_aisle_10", "c_aisle_10b"], ["c_aisle_10b", "c_below_g10"],
  ["c_above_g9", "c_aisle_11"], ["c_aisle_11", "c_aisle_11b"], ["c_aisle_11b", "c_below_g9"],

  // Below gondolas to bottom
  ["c_below_g1", "c_bot_1"], ["c_below_g2", "c_bot_2"], ["c_below_g3", "c_bot_3"],
  ["c_below_g4", "c_bot_4"], ["c_below_g5", "c_bot_5"], ["c_below_g6", "c_bot_6"],
  ["c_below_g7", "c_bot_7"],
  ["c_below_g8", "c_bot_5"], ["c_below_g9", "c_bot_6"], ["c_below_g10", "c_bot_7"],
];

// Map each section to its nearest corridor waypoint(s) for pathfinding
const SECTION_TO_WAYPOINTS: Record<string, string[]> = {
  acougue: ["c_top_2"],
  hortifruti: ["c_top_4"],
  padaria: ["c_top_6"],
  laticinio: ["c_mid1_1", "c_mid1_2"],
  refrigerantes: ["c_mid1_3"],
  cereais: ["c_mid1_4"],
  infantis: ["c_mid1_5"],
  higiene_top: ["c_mid1_5", "c_mid1_6"],
  limpeza: ["c_mid1_6"],
  utilidades: ["c_mid1_7"],
  gondola1: ["c_aisle_1", "c_aisle_1b"],
  gondola2: ["c_aisle_2", "c_aisle_2b"],
  gondola3: ["c_aisle_3", "c_aisle_3b"],
  gondola4: ["c_aisle_3", "c_aisle_4"],
  gondola6: ["c_aisle_4", "c_aisle_5"],
  gondola7: ["c_aisle_5", "c_aisle_6"],
  gondola8: ["c_aisle_6", "c_aisle_7"],
  gondola9: ["c_aisle_7", "c_aisle_8"],
  gondola10: ["c_aisle_8", "c_aisle_9"],
  gondola11: ["c_aisle_9", "c_aisle_10"],
  gondola12: ["c_aisle_10", "c_aisle_11"],
  organicos: ["c_below_g4", "c_below_g5"],
  talheres: ["c_below_g7", "c_bot_5"],
  pet: ["c_below_g8", "c_bot_6"],
  bebidas_alcoolicas: ["c_below_g9", "c_bot_7"],
  caixas: ["c_bot_1", "c_bot_2"],
};

// Dijkstra's algorithm for shortest path
function findShortestPath(startWaypoints: string[], endWaypoints: string[]): { x: number; y: number }[] {
  const allNodes = CORRIDOR_WAYPOINTS.map((w) => w.id);
  const adjacency: Record<string, { id: string; dist: number }[]> = {};

  // Build adjacency list
  allNodes.forEach((id) => {
    adjacency[id] = [];
  });

  CORRIDOR_EDGES.forEach(([a, b]) => {
    const nodeA = CORRIDOR_WAYPOINTS.find((w) => w.id === a);
    const nodeB = CORRIDOR_WAYPOINTS.find((w) => w.id === b);
    if (nodeA && nodeB) {
      const dist = Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);
      adjacency[a].push({ id: b, dist });
      adjacency[b].push({ id: a, dist });
    }
  });

  // Find best path from any start waypoint to any end waypoint
  let bestPath: string[] = [];
  let bestDist = Infinity;

  for (const startId of startWaypoints) {
    // Dijkstra from startId
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visited = new Set<string>();

    allNodes.forEach((id) => {
      dist[id] = Infinity;
      prev[id] = null;
    });
    dist[startId] = 0;

    while (true) {
      let minNode: string | null = null;
      let minDist = Infinity;
      for (const id of allNodes) {
        if (!visited.has(id) && dist[id] < minDist) {
          minDist = dist[id];
          minNode = id;
        }
      }
      if (minNode === null) break;
      visited.add(minNode);

      for (const neighbor of adjacency[minNode]) {
        const alt = dist[minNode] + neighbor.dist;
        if (alt < dist[neighbor.id]) {
          dist[neighbor.id] = alt;
          prev[neighbor.id] = minNode;
        }
      }
    }

    // Check which end waypoint gives shortest path
    for (const endId of endWaypoints) {
      if (dist[endId] < bestDist) {
        bestDist = dist[endId];
        // Reconstruct path
        const path: string[] = [];
        let current: string | null = endId;
        while (current) {
          path.unshift(current);
          current = prev[current];
        }
        bestPath = path;
      }
    }
  }

  // Convert path IDs to coordinates
  return bestPath
    .map((id) => {
      const wp = CORRIDOR_WAYPOINTS.find((w) => w.id === id);
      return wp ? { x: wp.x, y: wp.y } : null;
    })
    .filter(Boolean) as { x: number; y: number }[];
}

interface RouteAnimation {
  isAnimating: boolean;
  progress: number;
  path: { x: number; y: number }[];
}

export default function Simulacao() {
  const { language } = useLanguage();
  const [currentSection, setCurrentSection] = useState<string>("acougue");
  const [destinationSection, setDestinationSection] = useState<string>("organicos");
  const [animation, setAnimation] = useState<RouteAnimation>({
    isAnimating: false,
    progress: 0,
    path: [],
  });
  const animationRef = useRef<number | null>(null);

  const t = {
    pt: {
      title: "Simulação de Navegação",
      subtitle: "Veja como o cliente navega de uma sessão para outra",
      currentLocation: "Você está em:",
      destination: "Desejo ir para:",
      startNavigation: "Iniciar Navegação",
      selectSection: "Selecione uma sessão",
    },
    en: {
      title: "Navigation Simulation",
      subtitle: "See how the customer navigates from one section to another",
      currentLocation: "You are at:",
      destination: "I want to go to:",
      startNavigation: "Start Navigation",
      selectSection: "Select a section",
    },
  };

  const texts = t[language as keyof typeof t];

  // Calculate the route path using Dijkstra
  const routePath = useMemo(() => {
    const startWaypoints = SECTION_TO_WAYPOINTS[currentSection] || [];
    const endWaypoints = SECTION_TO_WAYPOINTS[destinationSection] || [];
    if (startWaypoints.length === 0 || endWaypoints.length === 0) return [];
    return findShortestPath(startWaypoints, endWaypoints);
  }, [currentSection, destinationSection]);

  // Calculate total path length
  const totalPathLength = useMemo(() => {
    let total = 0;
    for (let i = 1; i < routePath.length; i++) {
      const dx = routePath[i].x - routePath[i - 1].x;
      const dy = routePath[i].y - routePath[i - 1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  }, [routePath]);

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
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        setAnimation((prev) => ({
          ...prev,
          isAnimating: false,
        }));
      }
    };

    animationRef.current = requestAnimationFrame(animateFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animation.isAnimating]);

  const handleStartNavigation = () => {
    if (routePath.length < 2) return;

    setAnimation({
      isAnimating: true,
      progress: 0,
      path: routePath,
    });
  };

  // Get position along the path at a given progress (0 to 1)
  const getPositionAtProgress = (progress: number) => {
    if (routePath.length < 2) return { x: 0, y: 0, angle: 0 };

    const targetDist = progress * totalPathLength;
    let accumulated = 0;

    for (let i = 1; i < routePath.length; i++) {
      const dx = routePath[i].x - routePath[i - 1].x;
      const dy = routePath[i].y - routePath[i - 1].y;
      const segLen = Math.sqrt(dx * dx + dy * dy);

      if (accumulated + segLen >= targetDist) {
        const segProgress = (targetDist - accumulated) / segLen;
        const x = routePath[i - 1].x + dx * segProgress;
        const y = routePath[i - 1].y + dy * segProgress;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return { x, y, angle };
      }
      accumulated += segLen;
    }

    // Fallback to last point
    const last = routePath[routePath.length - 1];
    const prev = routePath[routePath.length - 2];
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x) * (180 / Math.PI);
    return { x: last.x, y: last.y, angle };
  };

  // Generate SVG path string for the route
  const routePathString = useMemo(() => {
    if (routePath.length < 2) return "";
    return routePath.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [routePath]);

  // Get animated path string (partial path based on progress)
  const animatedPathString = useMemo(() => {
    if (!animation.isAnimating || routePath.length < 2) return "";

    const targetDist = animation.progress * totalPathLength;
    let accumulated = 0;
    const points: { x: number; y: number }[] = [routePath[0]];

    for (let i = 1; i < routePath.length; i++) {
      const dx = routePath[i].x - routePath[i - 1].x;
      const dy = routePath[i].y - routePath[i - 1].y;
      const segLen = Math.sqrt(dx * dx + dy * dy);

      if (accumulated + segLen >= targetDist) {
        const segProgress = (targetDist - accumulated) / segLen;
        points.push({
          x: routePath[i - 1].x + dx * segProgress,
          y: routePath[i - 1].y + dy * segProgress,
        });
        break;
      }
      points.push(routePath[i]);
      accumulated += segLen;
    }

    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [animation.isAnimating, animation.progress, routePath, totalPathLength]);

  const arrowPos = animation.isAnimating ? getPositionAtProgress(animation.progress) : null;

  // Get section data for display
  const currentSectionData = SECTIONS.find((s) => s.id === currentSection);
  const destinationSectionData = SECTIONS.find((s) => s.id === destinationSection);

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
                    {SECTIONS.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name[language as keyof typeof section.name]}
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
                    {SECTIONS.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name[language as keyof typeof section.name]}
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
                disabled={animation.isAnimating || currentSection === destinationSection}
                size="lg"
                className="gap-2"
              >
                <Navigation className="w-5 h-5" />
                {texts.startNavigation}
              </Button>
            </div>
          </div>

          {/* Supermarket Map with Floor Plan */}
          <div className="bg-white rounded-lg shadow-lg p-4 overflow-auto">
            <div className="relative w-full" style={{ maxWidth: "100%", aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}` }}>
              {/* Floor plan image */}
              <img
                src={FLOOR_PLAN_URL}
                alt="Planta do supermercado"
                className="w-full h-full object-contain rounded-lg"
                style={{ display: "block" }}
              />

              {/* SVG overlay for route animation */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Dashed preview of full route */}
                {routePath.length >= 2 && !animation.isAnimating && (
                  <path
                    d={routePathString}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray="12,8"
                    opacity="0.5"
                  />
                )}

                {/* Animated route line */}
                {animation.isAnimating && (
                  <path
                    d={animatedPathString}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Start marker */}
                {currentSectionData && (
                  <g>
                    <circle
                      cx={currentSectionData.x}
                      cy={currentSectionData.y}
                      r="18"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="3"
                      opacity="0.9"
                    />
                    <text
                      x={currentSectionData.x}
                      y={currentSectionData.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      A
                    </text>
                  </g>
                )}

                {/* Destination marker */}
                {destinationSectionData && (
                  <g>
                    <circle
                      cx={destinationSectionData.x}
                      cy={destinationSectionData.y}
                      r="18"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="3"
                      opacity="0.9"
                    />
                    <text
                      x={destinationSectionData.x}
                      y={destinationSectionData.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      B
                    </text>
                  </g>
                )}

                {/* Animated arrow */}
                {animation.isAnimating && arrowPos && animation.progress < 1 && (
                  <g transform={`translate(${arrowPos.x}, ${arrowPos.y}) rotate(${arrowPos.angle})`}>
                    <polygon
                      points="0,-10 16,0 0,10"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Arrival marker */}
                {animation.isAnimating && animation.progress >= 1 && destinationSectionData && (
                  <circle
                    cx={destinationSectionData.x}
                    cy={destinationSectionData.y}
                    r="28"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    opacity="0.8"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {language === "pt" ? "Legenda" : "Legend"}
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow" />
                <span className="text-sm text-slate-700">
                  {language === "pt" ? "Ponto de partida (A)" : "Start point (A)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow" />
                <span className="text-sm text-slate-700">
                  {language === "pt" ? "Destino (B)" : "Destination (B)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-blue-500 rounded" />
                <span className="text-sm text-slate-700">
                  {language === "pt" ? "Rota sugerida" : "Suggested route"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
