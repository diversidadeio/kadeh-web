/**
 * Simulação Page — Kadeh Simulação
 * Interactive supermarket map with route animation
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

// Define sections/areas of the supermarket
const SECTIONS = [
  { id: "acougue", name: { pt: "Açougue", en: "Butcher" }, color: "#FF4444", x: 50, y: 50 },
  { id: "hortifruti", name: { pt: "Hortifrutí", en: "Produce" }, color: "#0066FF", x: 350, y: 50 },
  { id: "padaria", name: { pt: "Padaria", en: "Bakery" }, color: "#FF9900", x: 650, y: 50 },
  { id: "bebidas", name: { pt: "Bebidas", en: "Beverages" }, color: "#00AA00", x: 150, y: 200 },
  { id: "congelados", name: { pt: "Congelados", en: "Frozen" }, color: "#0099FF", x: 450, y: 200 },
  { id: "limpeza", name: { pt: "Limpeza", en: "Cleaning" }, color: "#FF66FF", x: 750, y: 200 },
  { id: "higiene", name: { pt: "Higiene", en: "Hygiene" }, color: "#FFAA00", x: 100, y: 350 },
  { id: "utilidades", name: { pt: "Utilidades", en: "Utilities" }, color: "#666666", x: 400, y: 350 },
  { id: "infantis", name: { pt: "Infantis", en: "Baby Products" }, color: "#FF99FF", x: 700, y: 350 },
];

interface RouteAnimation {
  isAnimating: boolean;
  progress: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default function Simulacao() {
  const { language } = useLanguage();
  const [currentSection, setCurrentSection] = useState<string>("acougue");
  const [destinationSection, setDestinationSection] = useState<string>("hortifruti");
  const [animation, setAnimation] = useState<RouteAnimation>({
    isAnimating: false,
    progress: 0,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

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

  const currentSectionData = SECTIONS.find((s) => s.id === currentSection);
  const destinationSectionData = SECTIONS.find((s) => s.id === destinationSection);

  // Animate the route
  useEffect(() => {
    if (!animation.isAnimating) return;

    const animationDuration = 3000; // 3 seconds
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
    if (!currentSectionData || !destinationSectionData) return;

    setAnimation({
      isAnimating: true,
      progress: 0,
      startX: currentSectionData.x,
      startY: currentSectionData.y,
      endX: destinationSectionData.x,
      endY: destinationSectionData.y,
    });
  };

  // Calculate arrow position during animation
  const arrowX = animation.startX + (animation.endX - animation.startX) * animation.progress;
  const arrowY = animation.startY + (animation.endY - animation.startY) * animation.progress;

  // Calculate arrow rotation
  const dx = animation.endX - animation.startX;
  const dy = animation.endY - animation.startY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
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
                disabled={animation.isAnimating}
                size="lg"
                className="gap-2"
              >
                <Navigation className="w-5 h-5" />
                {texts.startNavigation}
              </Button>
            </div>
          </div>

          {/* Supermarket Map */}
          <div className="bg-white rounded-lg shadow-lg p-8 overflow-auto">
            <svg
              width="100%"
              height="500"
              viewBox="0 0 900 450"
              className="border border-slate-200 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100"
            >
              {/* Grid background */}
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="900" height="450" fill="url(#grid)" />

              {/* Render all sections as circles */}
              {SECTIONS.map((section) => (
                <g key={section.id}>
                  {/* Section circle */}
                  <circle
                    cx={section.x}
                    cy={section.y}
                    r="35"
                    fill={section.color}
                    opacity={
                      currentSection === section.id || destinationSection === section.id
                        ? 1
                        : 0.7
                    }
                    className="transition-opacity"
                  />

                  {/* Section label */}
                  <text
                    x={section.x}
                    y={section.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-white pointer-events-none"
                    fontSize="11"
                  >
                    {section.name[language as keyof typeof section.name].split(" ")[0]}
                  </text>

                  {/* Current location indicator */}
                  {currentSection === section.id && (
                    <circle
                      cx={section.x}
                      cy={section.y}
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Destination indicator */}
                  {destinationSection === section.id && (
                    <circle
                      cx={section.x}
                      cy={section.y}
                      r="45"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}
                </g>
              ))}

              {/* Animated route line */}
              {animation.isAnimating && (
                <line
                  x1={animation.startX}
                  y1={animation.startY}
                  x2={arrowX}
                  y2={arrowY}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              )}

              {/* Animated arrow */}
              {animation.isAnimating && animation.progress < 1 && (
                <g
                  transform={`translate(${arrowX}, ${arrowY}) rotate(${angle})`}
                >
                  <polygon
                    points="0,-8 12,0 0,8"
                    fill="#3b82f6"
                    className="animate-pulse"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {language === "pt" ? "Legenda" : "Legend"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {SECTIONS.map((section) => (
                <div key={section.id} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <span className="text-sm text-slate-700">
                    {section.name[language as keyof typeof section.name]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
