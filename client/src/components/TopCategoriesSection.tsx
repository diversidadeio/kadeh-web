/**
 * TopCategoriesSection Component
 * Displays the top 50 categories by sales volume with clickable cards
 * to add them to the Smart Layout simulator
 */

import { useState, useMemo } from "react";
import { CATEGORIES_DATABASE } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TopCategoriesSectionProps {
  onCategorySelect?: (categoryId: string, categoryName: string) => void;
}

export default function TopCategoriesSection({ onCategorySelect }: TopCategoriesSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<"Todas" | "Alimentar" | "Não-Alimentar">("Todas");
  const [selectedCurve, setSelectedCurve] = useState<"Todas" | "A" | "B" | "C">("Todas");

  // Get top 50 categories by faturamento curve A and B
  const topCategories = useMemo(() => {
    return CATEGORIES_DATABASE.filter((cat) => {
      if (selectedFilter !== "Todas" && cat.mainCategory !== selectedFilter) return false;
      if (selectedCurve !== "Todas" && cat.curvaFaturamento !== selectedCurve) return false;
      return cat.curvaFaturamento === "A" || cat.curvaFaturamento === "B";
    }).slice(0, 50);
  }, [selectedFilter, selectedCurve]);

  const getCurveColor = (curve: string) => {
    switch (curve) {
      case "A":
        return "bg-red-100 text-red-800 border-red-300";
      case "B":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "C":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryBadgeColor = (mainCategory: string) => {
    return mainCategory === "Alimentar"
      ? "bg-blue-50 border-blue-200"
      : "bg-purple-50 border-purple-200";
  };

  const handleAddCategory = (category: any) => {
    // Dispatch event to add category to simulator
    const event = new CustomEvent('addCategoryProduct', {
      detail: {
        categoryName: category.name,
        giro: category.defaultGiro,
        margem: category.defaultMargem,
        category: category.mainCategory,
        subCategory: category.mainCategory === 'Alimentar' ? 'Alimentos' : 'Higiene'
      }
    });
    document.dispatchEvent(event);
    
    if (onCategorySelect) {
      onCategorySelect(category.id, category.name);
    }
    
    // Scroll to simulator
    setTimeout(() => {
      const simulator = document.getElementById('smart-layout-simulator');
      if (simulator) {
        simulator.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="bg-card p-8 rounded-lg border border-border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Top 50 Categorias com Maiores Vendas
        </h2>
        <p className="text-muted-foreground">
          Clique em qualquer categoria para adicioná-la ao simulador de Smart Layout
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categoria Principal
          </label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="Todas">Todas as Categorias</option>
            <option value="Alimentar">Alimentar</option>
            <option value="Não-Alimentar">Não-Alimentar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Curva de Faturamento
          </label>
          <select
            value={selectedCurve}
            onChange={(e) => setSelectedCurve(e.target.value as any)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="Todas">Todas as Curvas</option>
            <option value="A">Curva A (Maior Volume)</option>
            <option value="B">Curva B (Volume Médio)</option>
            <option value="C">Curva C (Menor Volume)</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topCategories.map((category) => (
          <div
            key={category.id}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${getCategoryBadgeColor(
              category.mainCategory
            )}`}
            onClick={() => handleAddCategory(category)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.mainCategory}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCategory(category);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getCurveColor(category.curvaFaturamento)}`}>
                Curva {category.curvaFaturamento}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getCurveColor(category.curvaLucratividade)}`}>
                Lucr. {category.curvaLucratividade}
              </span>
            </div>

            {/* Strategic Role */}
            <p className="text-xs text-muted-foreground italic">
              {category.papelEstrategico}
            </p>

            {/* Default Values */}
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Giro:</span> {category.defaultGiro}
                </div>
                <div>
                  <span className="font-medium">Margem:</span> {category.defaultMargem}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma categoria encontrada com os filtros selecionados
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>💡 Dica:</strong> As categorias são baseadas em dados de faturamento e lucratividade
          do mercado varejista brasileiro. Clique em qualquer categoria para adicioná-la ao simulador
          com seus valores padrão de giro e margem.
        </p>
      </div>
    </div>
  );
}
