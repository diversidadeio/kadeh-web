/**
 * Product Descriptor Component
 * Allows users to describe product types with margin and velocity characteristics
 * to create ideal planograms
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export interface ProductDescriptor {
  id: string;
  name: string;
  margin: "Baixa" | "Média" | "Alta";
  velocity: "Baixo" | "Médio" | "Alto";
  category: string;
  subCategory: string;
}

interface ProductDescriptorProps {
  onAddProduct: (product: ProductDescriptor) => void;
  language: "pt" | "en";
}

const TRANSLATIONS = {
  pt: {
    addProduct: "Adicionar Produto",
    productName: "Nome do Produto",
    margin: "Margem",
    velocity: "Giro",
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    lowVelocity: "Baixo",
    mediumVelocity: "Médio",
    highVelocity: "Alto",
    category: "Categoria",
    subCategory: "Subcategoria",
    add: "Adicionar",
    cancel: "Cancelar",
    enterProductName: "Digite o nome do produto",
    productAdded: "Produto adicionado com sucesso!",
    marginDescription: "Selecione o nível de margem (lucro) do produto",
    velocityDescription: "Selecione a velocidade de giro (rotatividade) do produto",
  },
  en: {
    addProduct: "Add Product",
    productName: "Product Name",
    margin: "Margin",
    velocity: "Velocity",
    low: "Low",
    medium: "Medium",
    high: "High",
    lowVelocity: "Low",
    mediumVelocity: "Medium",
    highVelocity: "High",
    category: "Category",
    subCategory: "Subcategory",
    add: "Add",
    cancel: "Cancel",
    enterProductName: "Enter the product name",
    productAdded: "Product added successfully!",
    marginDescription: "Select the product margin (profit) level",
    velocityDescription: "Select the product velocity (turnover) level",
  },
};

export default function ProductDescriptor({
  onAddProduct,
  language,
}: ProductDescriptorProps) {
  const t = TRANSLATIONS[language];

  const [productName, setProductName] = useState("");
  const [margin, setMargin] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [velocity, setVelocity] = useState<"Baixo" | "Médio" | "Alto">("Médio");
  const [category, setCategory] = useState("Alimentar");
  const [subCategory, setSubCategory] = useState("Alimentos");

  const handleAddProduct = () => {
    if (!productName.trim()) {
      alert(t.enterProductName);
      return;
    }

    const newProduct: ProductDescriptor = {
      id: Date.now().toString(),
      name: productName,
      margin,
      velocity,
      category,
      subCategory,
    };

    onAddProduct(newProduct);
    setProductName("");
    setMargin("Média");
    setVelocity("Médio");
    alert(t.productAdded);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {t.addProduct}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.productName}
          </label>
          <input
            type="text"
            placeholder={t.productName}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.category}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="Alimentar">Alimentar</option>
            <option value="Não-Alimentar">Não-Alimentar</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Margin Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.margin}
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            {t.marginDescription}
          </p>
          <div className="space-y-2">
            {(["Baixa", "Média", "Alta"] as const).map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="margin"
                  value={m}
                  checked={margin === m}
                  onChange={(e) => setMargin(e.target.value as typeof m)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  {m === "Baixa" ? t.low : m === "Média" ? t.medium : t.high}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Velocity Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.velocity}
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            {t.velocityDescription}
          </p>
          <div className="space-y-2">
            {(["Baixo", "Médio", "Alto"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="velocity"
                  value={v}
                  checked={velocity === v}
                  onChange={(e) =>
                    setVelocity(e.target.value as typeof v)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  {v === "Baixo"
                    ? t.lowVelocity
                    : v === "Médio"
                    ? t.mediumVelocity
                    : t.highVelocity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
            {language === "pt" ? "Combinações Recomendadas" : "Recommended Combinations"}
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              <strong>{language === "pt" ? "Alto Giro + Alta Margem" : "High Velocity + High Margin"}:</strong> {language === "pt" ? "Frente principal" : "Main front"}
            </li>
            <li>
              <strong>{language === "pt" ? "Alto Giro + Baixa Margem" : "High Velocity + Low Margin"}:</strong> {language === "pt" ? "Altura dos olhos" : "Eye level"}
            </li>
            <li>
              <strong>{language === "pt" ? "Baixo Giro + Alta Margem" : "Low Velocity + High Margin"}:</strong> {language === "pt" ? "Ponto premium" : "Premium spot"}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleAddProduct}
          className="gap-2 bg-green-600 hover:bg-green-700 flex-1"
        >
          <Plus className="w-4 h-4" />
          {t.add}
        </Button>
      </div>
    </div>
  );
}
