/**
 * Saved Simulations List Component
 * Displays and manages saved Smart Layout simulations
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Trash2, Download, Upload, Eye } from "lucide-react";
import { SavedSimulation, simulationStorage } from "@/data/simulationStorage";

interface SavedSimulationsListProps {
  onLoadSimulation: (simulation: SavedSimulation) => void;
  onSimulationDeleted?: () => void;
}

const TRANSLATIONS = {
  pt: {
    title: "Simulações Salvas",
    noSimulations: "Nenhuma simulação salva",
    startSimulating: "Comece a simular para salvar suas configurações",
    name: "Nome",
    date: "Data",
    margin: "Margem",
    efficiency: "Eficiência",
    products: "Produtos",
    actions: "Ações",
    load: "Carregar",
    duplicate: "Duplicar",
    delete: "Deletar",
    export: "Exportar",
    import: "Importar",
    view: "Visualizar",
    confirmDelete: "Tem certeza que deseja deletar esta simulação?",
    duplicateName: "Cópia de",
    searchPlaceholder: "Buscar simulações...",
    statistics: "Estatísticas",
    totalSaved: "Total Salvo",
    avgMargin: "Margem Média",
    avgEfficiency: "Eficiência Média",
    bestMargin: "Melhor Margem",
    exportAll: "Exportar Todas",
    importFile: "Importar Arquivo",
    deleteAll: "Deletar Todas",
    confirmDeleteAll: "Tem certeza que deseja deletar TODAS as simulações?",
  },
  en: {
    title: "Saved Simulations",
    noSimulations: "No saved simulations",
    startSimulating: "Start simulating to save your configurations",
    name: "Name",
    date: "Date",
    margin: "Margin",
    efficiency: "Efficiency",
    products: "Products",
    actions: "Actions",
    load: "Load",
    duplicate: "Duplicate",
    delete: "Delete",
    export: "Export",
    import: "Import",
    view: "View",
    confirmDelete: "Are you sure you want to delete this simulation?",
    duplicateName: "Copy of",
    searchPlaceholder: "Search simulations...",
    statistics: "Statistics",
    totalSaved: "Total Saved",
    avgMargin: "Average Margin",
    avgEfficiency: "Average Efficiency",
    bestMargin: "Best Margin",
    exportAll: "Export All",
    importFile: "Import File",
    deleteAll: "Delete All",
    confirmDeleteAll: "Are you sure you want to delete ALL simulations?",
  },
};

export default function SavedSimulationsList({ onLoadSimulation, onSimulationDeleted }: SavedSimulationsListProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [simulations, setSimulations] = useState<SavedSimulation[]>(simulationStorage.getAllSimulations());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSimulation, setSelectedSimulation] = useState<SavedSimulation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredSimulations = searchQuery
    ? simulationStorage.searchSimulations(searchQuery)
    : simulations;

  const stats = simulationStorage.getStatistics();

  const handleLoadSimulation = (simulation: SavedSimulation) => {
    onLoadSimulation(simulation);
  };

  const handleDuplicateSimulation = (simulation: SavedSimulation) => {
    const newName = `${t.duplicateName} ${simulation.name}`;
    const duplicated = simulationStorage.duplicateSimulation(simulation.id, newName);
    if (duplicated) {
      setSimulations(simulationStorage.getAllSimulations());
    }
  };

  const handleDeleteSimulation = (id: string) => {
    if (confirm(t.confirmDelete)) {
      simulationStorage.deleteSimulation(id);
      setSimulations(simulationStorage.getAllSimulations());
      onSimulationDeleted?.();
    }
  };

  const handleExportAll = () => {
    const json = simulationStorage.exportSimulations();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kadeh-simulations-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const count = simulationStorage.importSimulations(event.target.result);
          setSimulations(simulationStorage.getAllSimulations());
          alert(`${count} simulações importadas com sucesso!`);
        } catch (error) {
          alert("Erro ao importar arquivo. Verifique o formato.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDeleteAll = () => {
    if (confirm(t.confirmDeleteAll)) {
      simulationStorage.deleteAllSimulations();
      setSimulations([]);
      onSimulationDeleted?.();
    }
  };

  if (simulations.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground mb-2">{t.noSimulations}</p>
        <p className="text-sm text-muted-foreground">{t.startSimulating}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleExportAll} className="gap-2">
              <Download className="w-4 h-4" />
              {t.exportAll}
            </Button>
            <Button variant="outline" size="sm" onClick={handleImportFile} className="gap-2">
              <Upload className="w-4 h-4" />
              {t.importFile}
            </Button>
            {simulations.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAll}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t.deleteAll}
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t.totalSaved}</p>
            <p className="text-xl font-bold text-foreground">{stats.totalSimulations}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t.avgMargin}</p>
            <p className="text-xl font-bold text-foreground">R$ {stats.avgMargin.toFixed(0)}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t.avgEfficiency}</p>
            <p className="text-xl font-bold text-foreground">{stats.avgEfficiency.toFixed(0)}%</p>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t.bestMargin}</p>
            <p className="text-xl font-bold text-foreground">R$ {stats.maxMargin.toFixed(0)}</p>
          </div>
        </div>

        {/* Simulations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-foreground">{t.name}</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">{t.date}</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">{t.margin}</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">{t.efficiency}</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">{t.products}</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSimulations.map((sim) => (
                <tr key={sim.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-3 font-medium text-foreground">{sim.name}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">
                    {sim.timestamp.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-center text-foreground">
                    R$ {sim.metrics.totalMargin.toFixed(0)}
                  </td>
                  <td className="py-3 px-3 text-center text-foreground">
                    {sim.metrics.spaceEfficiency.toFixed(0)}%
                  </td>
                  <td className="py-3 px-3 text-center text-foreground">
                    {sim.metrics.productCount}
                  </td>
                  <td className="py-3 px-3 text-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSimulation(sim);
                        setShowDetails(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                      title={t.view}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadSimulation(sim)}
                      className="text-green-600 hover:text-green-700"
                      title={t.load}
                    >
                      📂
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateSimulation(sim)}
                      className="text-purple-600 hover:text-purple-700"
                      title={t.duplicate}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSimulation(sim.id)}
                      className="text-red-600 hover:text-red-700"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSimulation?.name}</DialogTitle>
            <DialogDescription>{selectedSimulation?.description}</DialogDescription>
          </DialogHeader>

          {selectedSimulation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSimulation.timestamp.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.margin}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {selectedSimulation.metrics.totalMargin.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.efficiency}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSimulation.metrics.spaceEfficiency.toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.products}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSimulation.metrics.productCount}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Configuração da Gôndola</p>
                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <p>Largura: {selectedSimulation.data.shelfWidth} cm</p>
                  <p>Altura: {selectedSimulation.data.shelfHeight} cm</p>
                  <p>Profundidade: {selectedSimulation.data.shelfDepth} cm</p>
                  <p>Prateleiras: {selectedSimulation.data.numberOfShelves}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleLoadSimulation(selectedSimulation);
                    setShowDetails(false);
                  }}
                  className="flex-1"
                >
                  {t.load}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
