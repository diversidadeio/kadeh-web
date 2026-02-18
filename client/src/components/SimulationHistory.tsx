/**
 * SimulationHistory Component
 * Manage, compare, and restore simulation scenarios
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Simulation {
  id: string;
  name: string;
  timestamp: number;
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
  }>;
  totalUsedSpace: number;
  spacePercentage: number;
  totalMargin: number;
  totalRevenue: number;
}

interface SimulationHistoryProps {
  simulations: Simulation[];
  onRestore: (simulation: Simulation) => void;
  onDelete: (id: string) => void;
  onCompare: (ids: string[]) => void;
}

const TRANSLATIONS = {
  pt: {
    simulationHistory: "Histórico de Simulações",
    noSimulations: "Nenhuma simulação salva",
    name: "Nome",
    date: "Data",
    gondolaConfig: "Configuração",
    spaceUsed: "Espaço Utilizado",
    margin: "Margem Total",
    revenue: "Faturamento",
    actions: "Ações",
    restore: "Restaurar",
    delete: "Deletar",
    compare: "Comparar",
    selectToCompare: "Selecione até 3 simulações para comparar",
    compareSelected: "Comparar Selecionadas",
    noComparison: "Selecione simulações para comparação",
    comparisonResults: "Resultados da Comparação",
    bestMargin: "Melhor Margem",
    bestRevenue: "Melhor Faturamento",
    bestSpaceEfficiency: "Melhor Eficiência de Espaço",
  },
  en: {
    simulationHistory: "Simulation History",
    noSimulations: "No saved simulations",
    name: "Name",
    date: "Date",
    gondolaConfig: "Configuration",
    spaceUsed: "Space Used",
    margin: "Total Margin",
    revenue: "Revenue",
    actions: "Actions",
    restore: "Restore",
    delete: "Delete",
    compare: "Compare",
    selectToCompare: "Select up to 3 simulations to compare",
    compareSelected: "Compare Selected",
    noComparison: "Select simulations for comparison",
    comparisonResults: "Comparison Results",
    bestMargin: "Best Margin",
    bestRevenue: "Best Revenue",
    bestSpaceEfficiency: "Best Space Efficiency",
  },
};

export default function SimulationHistory({
  simulations,
  onRestore,
  onDelete,
  onCompare,
}: SimulationHistoryProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCompare = () => {
    if (selectedIds.length > 0) {
      onCompare(selectedIds);
      setShowComparison(true);
    }
  };

  const getComparisonData = () => {
    const selected = simulations.filter((s) => selectedIds.includes(s.id));
    if (selected.length === 0) return null;

    const bestMargin = selected.reduce((max, s) => (s.totalMargin > max.totalMargin ? s : max));
    const bestRevenue = selected.reduce((max, s) => (s.totalRevenue > max.totalRevenue ? s : max));
    const bestEfficiency = selected.reduce((max, s) => (s.spacePercentage < max.spacePercentage ? s : max));

    return { bestMargin, bestRevenue, bestEfficiency };
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === "pt" ? "pt-BR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const comparisonData = getComparisonData();

  return (
    <div className="space-y-4">
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.simulationHistory}</h3>

        {simulations.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.noSimulations}</p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === simulations.length && simulations.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(simulations.slice(0, 3).map((s) => s.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-2 px-2">{t.name}</th>
                    <th className="text-left py-2 px-2">{t.date}</th>
                    <th className="text-left py-2 px-2">{t.gondolaConfig}</th>
                    <th className="text-left py-2 px-2">{t.spaceUsed}</th>
                    <th className="text-left py-2 px-2">{t.margin}</th>
                    <th className="text-left py-2 px-2">{t.revenue}</th>
                    <th className="text-left py-2 px-2">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.map((sim) => (
                    <tr key={sim.id} className="border-b border-border hover:bg-muted">
                      <td className="py-2 px-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(sim.id)}
                          onChange={() => toggleSelection(sim.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-2 px-2 font-medium">{sim.name}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">{formatDate(sim.timestamp)}</td>
                      <td className="py-2 px-2 text-xs">
                        {sim.gondolaWidth}cm × {sim.shelves}
                      </td>
                      <td className="py-2 px-2 text-xs">{sim.spacePercentage.toFixed(0)}%</td>
                      <td className="py-2 px-2 text-xs text-green-600">R$ {sim.totalMargin.toFixed(2)}</td>
                      <td className="py-2 px-2 text-xs text-blue-600">R$ {sim.totalRevenue.toFixed(2)}</td>
                      <td className="py-2 px-2 flex gap-1">
                        <Button
                          onClick={() => onRestore(sim)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          title={t.restore}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onDelete(sim.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
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

            {simulations.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleCompare}
                  disabled={selectedIds.length === 0}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {t.compareSelected} ({selectedIds.length}/3)
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comparison Results */}
      {showComparison && comparisonData && (
        <div className="bg-card p-6 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t.comparisonResults}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-2">{t.bestMargin}</p>
              <p className="text-2xl font-bold text-green-600">R$ {comparisonData.bestMargin.totalMargin.toFixed(2)}</p>
              <p className="text-xs text-green-700 mt-1">{comparisonData.bestMargin.name}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">{t.bestRevenue}</p>
              <p className="text-2xl font-bold text-blue-600">R$ {comparisonData.bestRevenue.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-blue-700 mt-1">{comparisonData.bestRevenue.name}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-2">{t.bestSpaceEfficiency}</p>
              <p className="text-2xl font-bold text-purple-600">{comparisonData.bestEfficiency.spacePercentage.toFixed(0)}%</p>
              <p className="text-xs text-purple-700 mt-1">{comparisonData.bestEfficiency.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
