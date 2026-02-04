/**
 * SmartLayoutEnhanced Component
 * Wraps SmartLayoutSimulator with 3D visualization, history, and intelligent recommendations
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lightbulb, Box, History, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartLayoutSimulator from "@/components/SmartLayoutSimulator";
import Shelf3DVisualization from "@/components/Shelf3DVisualization";
import SimulationHistory, { type Simulation } from "@/components/SimulationHistory";
import { generateRecommendation, getRecommendationExplanation } from "@/data/recommendationEngine";
import { CATEGORIES_DATABASE } from "@/data/categories";

interface EnhancedSimulatorState {
  gondolaWidth: number;
  shelves: number;
  shelfDepth: number;
  shelfHeight: number;
  products: Array<{
    id: string;
    name: string;
    categoryId: string;
    largura?: number;
    comprimento?: number;
    color: string;
    quadrantes: number;
    zone: string;
  }>;
}

const TRANSLATIONS = {
  pt: {
    simulator: "Simulador",
    visualization3D: "Visualização 3D",
    history: "Histórico",
    recommendations: "Recomendações",
    getRecommendations: "Obter Recomendações Inteligentes",
    applyRecommendations: "Aplicar Recomendações",
    noProducts: "Adicione produtos para obter recomendações",
    recommendedConfig: "Configuração Recomendada",
    shelfHeight: "Altura entre Prateleiras",
    gondolaWidth: "Largura da Gôndola",
    numberOfShelves: "Número de Prateleiras",
    expectedMargin: "Margem Esperada",
    expectedRevenue: "Faturamento Esperado",
    spaceEfficiency: "Eficiência de Espaço",
    confidence: "Confiança",
  },
  en: {
    simulator: "Simulator",
    visualization3D: "3D Visualization",
    history: "History",
    recommendations: "Recommendations",
    getRecommendations: "Get Intelligent Recommendations",
    applyRecommendations: "Apply Recommendations",
    noProducts: "Add products to get recommendations",
    recommendedConfig: "Recommended Configuration",
    shelfHeight: "Shelf Height",
    gondolaWidth: "Gondola Width",
    numberOfShelves: "Number of Shelves",
    expectedMargin: "Expected Margin",
    expectedRevenue: "Expected Revenue",
    spaceEfficiency: "Space Efficiency",
    confidence: "Confidence",
  },
};

export default function SmartLayoutEnhanced() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [currentState, setCurrentState] = useState<EnhancedSimulatorState>({
    gondolaWidth: 280,
    shelves: 5,
    shelfDepth: 40,
    shelfHeight: 60,
    products: [],
  });
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleGetRecommendations = () => {
    if (currentState.products.length === 0) return;

    const categories = currentState.products
      .map((p) => CATEGORIES_DATABASE.find((c) => c.id === p.categoryId))
      .filter(Boolean);

    const rec = generateRecommendation(categories as any, currentState.gondolaWidth, currentState.shelves);
    setRecommendation(rec);
    setShowRecommendations(true);
  };

  const handleApplyRecommendations = () => {
    if (recommendation) {
      setCurrentState((prev) => ({
        ...prev,
        gondolaWidth: recommendation.gondolaWidth,
        shelves: recommendation.numberOfShelves,
        shelfHeight: recommendation.shelfHeight,
      }));
      setShowRecommendations(false);
    }
  };

  const handleRestoreSimulation = (simulation: Simulation) => {
    setCurrentState({
      gondolaWidth: simulation.gondolaWidth,
      shelves: simulation.shelves,
      shelfDepth: simulation.shelfDepth,
      shelfHeight: simulation.shelfHeight,
      products: simulation.products.map((p) => ({
        id: p.id,
        name: p.name,
        categoryId: p.categoryId,
        largura: p.largura,
        comprimento: p.comprimento,
        color: "#3b82f6",
        quadrantes: 1,
        zone: "Altura das mãos",
      })),
    });
  };

  const handleDeleteSimulation = (id: string) => {
    setSimulations(simulations.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{t.simulator}</span>
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            <span className="hidden sm:inline">3D</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">{t.recommendations}</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{t.history}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="mt-4">
          <SmartLayoutSimulator />
        </TabsContent>

        <TabsContent value="3d" className="mt-4">
          {currentState.products.length === 0 ? (
            <div className="bg-card p-6 rounded-md border border-border text-center">
              <p className="text-muted-foreground">{t.noProducts}</p>
            </div>
          ) : (
            <Shelf3DVisualization
              products={currentState.products}
              gondolaWidth={currentState.gondolaWidth}
              shelfDepth={currentState.shelfDepth}
              shelfHeight={currentState.shelfHeight}
              numberOfShelves={currentState.shelves}
            />
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <div className="space-y-4">
            <Button onClick={handleGetRecommendations} disabled={currentState.products.length === 0} className="w-full">
              <Lightbulb className="w-4 h-4 mr-2" />
              {t.getRecommendations}
            </Button>

            {showRecommendations && recommendation && (
              <div className="bg-card p-6 rounded-md border border-border space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{t.recommendedConfig}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">{t.shelfHeight}</p>
                    <p className="text-2xl font-bold text-blue-600">{recommendation.shelfHeight} cm</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">{t.gondolaWidth}</p>
                    <p className="text-2xl font-bold text-blue-600">{recommendation.gondolaWidth} cm</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-md border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-1">{t.numberOfShelves}</p>
                    <p className="text-2xl font-bold text-green-600">{recommendation.numberOfShelves}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
                    <p className="text-sm font-medium text-purple-900 mb-1">{t.confidence}</p>
                    <p className="text-2xl font-bold text-purple-600">{(recommendation.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900 mb-1">{t.expectedMargin}</p>
                    <p className="text-xl font-bold text-yellow-600">R$ {recommendation.expectedMargin.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900 mb-1">{t.expectedRevenue}</p>
                    <p className="text-xl font-bold text-yellow-600">R$ {recommendation.expectedRevenue.toFixed(2)}</p>
                  </div>
                </div>

                <Button onClick={handleApplyRecommendations} className="w-full" variant="default">
                  {t.applyRecommendations}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SimulationHistory
            simulations={simulations}
            onRestore={handleRestoreSimulation}
            onDelete={handleDeleteSimulation}
            onCompare={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
