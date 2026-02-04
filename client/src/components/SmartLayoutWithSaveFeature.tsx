/**
 * Smart Layout with Save Feature Wrapper
 * Integrates SmartLayoutSimulator with save/load functionality
 */

import { useState, useRef, forwardRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartLayoutSimulator from "./SmartLayoutSimulator";
import SavedSimulationsList from "./SavedSimulationsList";
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

interface SimulationData {
  shelfWidth: number;
  shelfHeight: number;
  shelfDepth: number;
  numberOfShelves: number;
  products: any[];
}

const SmartLayoutWithSaveFeature = forwardRef<any, {}>(function SmartLayoutWithSaveFeature(props, ref) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [simulationName, setSimulationName] = useState("");
  const [simulationDescription, setSimulationDescription] = useState("");
  const simulatorRef = useRef<any>(null);

  const handleSaveSimulation = () => {
    if (!simulationName.trim()) {
      alert(t.enterName);
      return;
    }

    // Get current simulation data from simulator
    const currentData = simulatorRef.current?.getSimulationData?.();

    if (!currentData) {
      alert("Erro ao obter dados da simulação");
      return;
    }

    const saved = simulationStorage.saveSimulation({
      name: simulationName,
      description: simulationDescription,
      data: currentData,
      metrics: {
        totalMargin: currentData.metrics?.totalMargin || 0,
        totalRevenue: currentData.metrics?.totalRevenue || 0,
        spaceEfficiency: currentData.metrics?.spaceEfficiency || 0,
        productCount: currentData.products?.length || 0,
      },
    });

    alert(`${t.saved} (${saved.name})`);
    setSimulationName("");
    setSimulationDescription("");
    setShowSaveDialog(false);
  };

  const handleLoadSimulation = (simulation: SavedSimulation) => {
    if (simulatorRef.current?.loadSimulationData) {
      simulatorRef.current.loadSimulationData(simulation.data);
      alert(`${t.loaded} (${simulation.name})`);
      setShowHistoryDialog(false);
    }
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
