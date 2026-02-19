import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: "Alimentar" | "Não-Alimentar";
  curve: "A" | "B" | "C";
  lucratividade: "Alta" | "Média" | "Baixa";
  papel: string;
  giro: "Alto" | "Médio" | "Baixo";
  margem: "Alta" | "Média" | "Baixa";
}

const TOP_CATEGORIES: Category[] = [
  { id: "1", name: "Cervejas", type: "Alimentar", curve: "A", lucratividade: "Alta", papel: "Estratégico", giro: "Alto", margem: "Alta" },
  { id: "2", name: "Carnes Bovinas", type: "Alimentar", curve: "A", lucratividade: "Alta", papel: "Estratégico", giro: "Alto", margem: "Média" },
  { id: "3", name: "Óleos e Azeites", type: "Alimentar", curve: "A", lucratividade: "Alta", papel: "Estratégico", giro: "Médio", margem: "Alta" },
];

interface TopCategoriesSectionProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
}

export default function TopCategoriesSection({ onCategorySelect }: TopCategoriesSectionProps) {
  const [selectedType, setSelectedType] = useState<"Todas" | "Alimentar" | "Não-Alimentar">("Todas");

  const filteredCategories = TOP_CATEGORIES.filter((cat) => {
    return selectedType === "Todas" || cat.type === selectedType;
  });

  const handleAddCategory = (category: Category) => {
    const event = new CustomEvent("addCategory", { detail: category });
    window.dispatchEvent(event);
    onCategorySelect(category.id, category.name);
  };

  return (
    <div className="space-y-6 my-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Categorias com Maiores Vendas</h2>
        <p className="text-gray-600">Clique em uma categoria para adicioná-la ao simulador</p>
      </div>

      <div className="flex gap-2">
        {["Todas", "Alimentar", "Não-Alimentar"].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type as any)}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-600">
                      {category.type} • Curva {category.curve}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full w-8 h-8 p-0"
                    onClick={() => handleAddCategory(category)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Lucratividade</p>
                    <p className="font-medium">{category.lucratividade}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Papel</p>
                    <p className="font-medium">{category.papel}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Giro</p>
                    <p className="font-medium">{category.giro}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Margem</p>
                    <p className="font-medium">{category.margem}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
