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
  largura?: number; // em cm
  altura?: number; // em cm
  profundidade?: number; // em cm
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
    width: "Largura (cm)",
    height: "Altura (cm)",
    depth: "Profundidade (cm)",
    dimensionsDescription: "Dimensões do produto para cálculo de frentes",
    optional: "(Opcional)",
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
    width: "Width (cm)",
    height: "Height (cm)",
    depth: "Depth (cm)",
    dimensionsDescription: "Product dimensions for facings calculation",
    optional: "(Optional)",
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
  const [largura, setLargura] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [profundidade, setProfundidade] = useState<string>("");

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
      largura: largura ? parseFloat(largura) : undefined,
      altura: altura ? parseFloat(altura) : undefined,
      profundidade: profundidade ? parseFloat(profundidade) : undefined,
    };

    onAddProduct(newProduct);
    setProductName("");
    setMargin("Média");
    setVelocity("Médio");
    setLargura("");
    setAltura("");
    setProfundidade("");
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
          <select
            value={margin}
            onChange={(e) => setMargin(e.target.value as "Baixa" | "Média" | "Alta")}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="Baixa">{t.low}</option>
            <option value="Média">{t.medium}</option>
            <option value="Alta">{t.high}</option>
          </select>
        </div>

        {/* Velocity Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.velocity}
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            {t.velocityDescription}
          </p>
          <select
            value={velocity}
            onChange={(e) => setVelocity(e.target.value as "Baixo" | "Médio" | "Alto")}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="Baixo">{t.lowVelocity}</option>
            <option value="Médio">{t.mediumVelocity}</option>
            <option value="Alto">{t.highVelocity}</option>
          </select>
        </div>

        {/* SubCategory */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.subCategory}
          </label>
          <input
            type="text"
            placeholder={t.subCategory}
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          />
        </div>
      </div>

      {/* Dimensions Section */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
          {t.dimensionsDescription} {t.optional}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.width}
            </label>
            <input
              type="number"
              placeholder="ex: 10"
              value={largura}
              onChange={(e) => setLargura(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.height}
            </label>
            <input
              type="number"
              placeholder="ex: 15"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>

          {/* Depth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.depth}
            </label>
            <input
              type="number"
              placeholder="ex: 8"
              value={profundidade}
              onChange={(e) => setProfundidade(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>
        </div>
      </div>

      {/* Add Button */}
      <Button
        onClick={handleAddProduct}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t.add}
      </Button>
    </div>
  );
}
