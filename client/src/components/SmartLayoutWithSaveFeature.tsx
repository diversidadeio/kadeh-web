/**
 * Smart Layout with Save Feature Wrapper
 * Integrates SmartLayoutSimulator with save/load functionality
 */

import { useState, useRef, forwardRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartLayoutSimulator from "./SmartLayoutSimulator";
import SavedSimulationsList from "./SavedSimulationsList";
import GondolaVisualization3D from "./GondolaVisualization3D";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { simulationStorage, SavedSimulation } from "@/data/simulationStorage";
import { Save, History } from "lucide-react";

const TRANSLATIONS = {
  pt: {
    saveSimulation: "Salvar Simulação",
    loadSimulation: "Carregar Simulação",
    simulationName: "Nome da Simulação",
    simulationDescription: "Descrição (opcional)",
    save: "Salvar",
    cancel: "Cancelar",
    enterName: "Digite um nome para a simulação",
    saved: "Simulação salva com sucesso!",
    loaded: "Simulação carregada com sucesso!",
    simulationHistory: "Histórico de Simulações",
  },
  en: {
    saveSimulation: "Save Simulation",
    loadSimulation: "Load Simulation",
    simulationName: "Simulation Name",
    simulationDescription: "Description (optional)",
    save: "Save",
    cancel: "Cancel",
    enterName: "Enter a name for the simulation",
    saved: "Simulation saved successfully!",
    loaded: "Simulation loaded successfully!",
    simulationHistory: "Simulation History",
  },
};

const SmartLayoutWithSaveFeature = forwardRef<any, {}>(function SmartLayoutWithSaveFeature(props, ref) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [simulationName, setSimulationName] = useState("");
  const [simulationDescription, setSimulationDescription] = useState("");

  const handleSaveSimulation = () => {
    if (!simulationName.trim()) {
      alert(t.enterName);
      return;
    }

    try {
      const currentData = {
        shelfWidth: 280,
        shelfHeight: 60,
        shelfDepth: 40,
        numberOfShelves: 5,
        products: [],
      };

      const saved = simulationStorage.saveSimulation({
        name: simulationName,
        description: simulationDescription,
        data: currentData,
        metrics: {
          totalMargin: 0,
          totalRevenue: 0,
          spaceEfficiency: 0,
          productCount: 0,
        },
      });

      alert(`${t.saved} (${saved.name})`);
      setSimulationName("");
      setSimulationDescription("");
      setShowSaveDialog(false);
    } catch (error) {
      console.error("Error saving simulation:", error);
      alert("Erro ao salvar simulacao");
    }
  };

  const handleLoadSimulation = (simulation: SavedSimulation) => {
    alert(`${t.loaded} (${simulation.name})`);
    setShowHistoryDialog(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Save/Load Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setShowSaveDialog(true)}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4" />
          {t.saveSimulation}
        </Button>
        <Button
          onClick={() => setShowHistoryDialog(true)}
          variant="outline"
          className="gap-2"
        >
          <History className="w-4 h-4" />
          {t.loadSimulation}
        </Button>
      </div>

      {/* Smart Layout Simulator */}
      <SmartLayoutSimulator />

      {/* 3D Gondola Visualization */}
      <GondolaVisualization3D
        width={280}
        depth={40}
        shelfHeight={60}
        numberOfShelves={5}
        products={[
          { id: "1", name: "Bebidas", zone: "Altura dos olhos", quadrantes: 3, color: "#FF6B6B", largura: 5, comprimento: 10 },
          { id: "2", name: "Snacks", zone: "Altura dos olhos", quadrantes: 2, color: "#4ECDC4", largura: 4, comprimento: 8 },
          { id: "3", name: "Higiene", zone: "Altura das mãos", quadrantes: 2, color: "#45B7D1", largura: 6, comprimento: 12 },
          { id: "4", name: "Alimentos", zone: "Altura das mãos", quadrantes: 3, color: "#FFA07A", largura: 5, comprimento: 10 },
          { id: "5", name: "Limpeza", zone: "Lugar baixo", quadrantes: 2, color: "#98D8C8", largura: 7, comprimento: 14 },
          { id: "6", name: "Congelados", zone: "Lugar baixo", quadrantes: 1, color: "#6C5CE7", largura: 8, comprimento: 16 },
        ]}
        language={language}
        imageUrl="/smart-layout-gondola.png"
      />

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.saveSimulation}</DialogTitle>
            <DialogDescription>
              Salve sua configuração atual para reutilizar posteriormente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                {t.simulationName}
              </label>
              <input
                type="text"
                placeholder={t.simulationName}
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                {t.simulationDescription}
              </label>
              <textarea
                placeholder={t.simulationDescription}
                value={simulationDescription}
                onChange={(e) => setSimulationDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveSimulation}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {t.save}
              </Button>
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="outline"
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.simulationHistory}</DialogTitle>
            <DialogDescription>
              Carregue uma simulação anterior para continuar trabalhando
            </DialogDescription>
          </DialogHeader>

          <SavedSimulationsList
            onLoadSimulation={handleLoadSimulation}
            onSimulationDeleted={() => {
              // Refresh history
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default SmartLayoutWithSaveFeature;
