/**
 * Product Form Modal Component
 * Advanced form for adding products with dimensions, margin/velocity options (categorical + numeric percentages)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";

export interface ProductFormData {
  id: string;
  name: string;
  width: number; // cm
  depth: number; // cm
  height: number; // cm
  marginType: "categorical" | "numeric";
  marginCategory?: "Baixa" | "Média" | "Alta";
  marginPercentage?: number; // 0-100
  velocityType: "categorical" | "numeric";
  velocityCategory?: "Baixo" | "Médio" | "Alto";
  velocityPercentage?: number; // 0-100
  category: string;
  subCategory: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductFormData) => void;
  language: "pt" | "en";
}

const TRANSLATIONS = {
  pt: {
    addProduct: "Adicionar Novo Produto",
    productName: "Nome do Produto",
    dimensions: "Dimensões do Produto",
    width: "Largura (cm)",
    depth: "Profundidade (cm)",
    height: "Altura (cm)",
    margin: "Margem",
    velocity: "Giro",
    marginType: "Tipo de Margem",
    velocityType: "Tipo de Giro",
    categorical: "Categórico",
    numeric: "Numérico (%)",
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    lowVelocity: "Baixo",
    mediumVelocity: "Médio",
    highVelocity: "Alto",
    category: "Categoria",
    subCategory: "Subcategoria",
    add: "Adicionar Produto",
    cancel: "Cancelar",
    close: "Fechar",
    enterProductName: "Digite o nome do produto",
    enterValidDimensions: "Digite dimensões válidas (maiores que 0)",
    enterValidPercentage: "Digite um percentual entre 0 e 100",
    productAdded: "Produto adicionado com sucesso!",
    marginDescription: "Selecione o nível de margem (lucro) do produto",
    velocityDescription: "Selecione a velocidade de giro (rotatividade) do produto",
    percentageLabel: "Percentual (%)",
    basicInfo: "Informações Básicas",
    dimensionsTab: "Dimensões",
    marginTab: "Margem",
    velocityTab: "Giro",
  },
  en: {
    addProduct: "Add New Product",
    productName: "Product Name",
    dimensions: "Product Dimensions",
    width: "Width (cm)",
    depth: "Depth (cm)",
    height: "Height (cm)",
    margin: "Margin",
    velocity: "Velocity",
    marginType: "Margin Type",
    velocityType: "Velocity Type",
    categorical: "Categorical",
    numeric: "Numeric (%)",
    low: "Low",
    medium: "Medium",
    high: "High",
    lowVelocity: "Low",
    mediumVelocity: "Medium",
    highVelocity: "High",
    category: "Category",
    subCategory: "Subcategory",
    add: "Add Product",
    cancel: "Cancel",
    close: "Close",
    enterProductName: "Enter the product name",
    enterValidDimensions: "Enter valid dimensions (greater than 0)",
    enterValidPercentage: "Enter a percentage between 0 and 100",
    productAdded: "Product added successfully!",
    marginDescription: "Select the product margin (profit) level",
    velocityDescription: "Select the product velocity (turnover) level",
    percentageLabel: "Percentage (%)",
    basicInfo: "Basic Information",
    dimensionsTab: "Dimensions",
    marginTab: "Margin",
    velocityTab: "Velocity",
  },
};

// Conversion functions between categorical and numeric
const categoryToPercentage = {
  pt: {
    margin: {
      "Baixa": 33,
      "Média": 66,
      "Alta": 100,
    },
    velocity: {
      "Baixo": 33,
      "Médio": 66,
      "Alto": 100,
    },
  },
  en: {
    margin: {
      "Low": 33,
      "Medium": 66,
      "High": 100,
    },
    velocity: {
      "Low": 33,
      "Medium": 66,
      "High": 100,
    },
  },
};

const percentageToCategory = {
  pt: {
    margin: (percentage: number) => {
      if (percentage <= 33) return "Baixa";
      if (percentage <= 66) return "Média";
      return "Alta";
    },
    velocity: (percentage: number) => {
      if (percentage <= 33) return "Baixo";
      if (percentage <= 66) return "Médio";
      return "Alto";
    },
  },
  en: {
    margin: (percentage: number) => {
      if (percentage <= 33) return "Low";
      if (percentage <= 66) return "Medium";
      return "High";
    },
    velocity: (percentage: number) => {
      if (percentage <= 33) return "Low";
      if (percentage <= 66) return "Medium";
      return "High";
    },
  },
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onAddProduct,
  language,
}: ProductFormModalProps) {
  const t = TRANSLATIONS[language];

  // Form state
  const [productName, setProductName] = useState("");
  const [width, setWidth] = useState<number | "">(10);
  const [depth, setDepth] = useState<number | "">(5);
  const [height, setHeight] = useState<number | "">(20);
  const [category, setCategory] = useState("Alimentar");
  const [subCategory, setSubCategory] = useState("Alimentos");

  // Margin state
  const [marginType, setMarginType] = useState<"categorical" | "numeric">("categorical");
  const [marginCategory, setMarginCategory] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [marginPercentage, setMarginPercentage] = useState(66);

  // Velocity state
  const [velocityType, setVelocityType] = useState<"categorical" | "numeric">("categorical");
  const [velocityCategory, setVelocityCategory] = useState<"Baixo" | "Médio" | "Alto">("Médio");
  const [velocityPercentage, setVelocityPercentage] = useState(66);

  // Handle margin category change
  const handleMarginCategoryChange = (category: "Baixa" | "Média" | "Alta") => {
    setMarginCategory(category);
    if (language === "pt") {
      const categoryMap: Record<string, number> = categoryToPercentage.pt.margin;
      setMarginPercentage(categoryMap[category] || 66);
    } else {
      const categoryMap: Record<string, number> = { "Low": 33, "Medium": 66, "High": 100 };
      setMarginPercentage(categoryMap[category as string] || 66);
    }
  };

  // Handle margin percentage change
  const handleMarginPercentageChange = (percentage: number) => {
    setMarginPercentage(percentage);
    const categoryFn = language === "pt"
      ? percentageToCategory.pt.margin
      : percentageToCategory.en.margin;
    setMarginCategory(categoryFn(percentage) as any);
  };

  // Handle velocity category change
  const handleVelocityCategoryChange = (category: "Baixo" | "Médio" | "Alto") => {
    setVelocityCategory(category);
    if (language === "pt") {
      const categoryMap: Record<string, number> = categoryToPercentage.pt.velocity;
      setVelocityPercentage(categoryMap[category] || 66);
    } else {
      const categoryMap: Record<string, number> = { "Low": 33, "Medium": 66, "High": 100 };
      setVelocityPercentage(categoryMap[category as string] || 66);
    }
  };

  // Handle velocity percentage change
  const handleVelocityPercentageChange = (percentage: number) => {
    setVelocityPercentage(percentage);
    const categoryFn = language === "pt"
      ? percentageToCategory.pt.velocity
      : percentageToCategory.en.velocity;
    setVelocityCategory(categoryFn(percentage) as any);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Debug log ANTES de validação
    console.log('DEBUG - ProductFormModal.handleSubmit - ANTES de validação:', {
      productName,
      marginCategory,
      velocityCategory,
      marginType,
      velocityType,
    });

    // Validation
    if (!productName.trim()) {
      alert(t.enterProductName);
      return;
    }

    if (!width || !depth || !height || width <= 0 || depth <= 0 || height <= 0) {
      alert(t.enterValidDimensions);
      return;
    }

    if (marginPercentage < 0 || marginPercentage > 100) {
      alert(t.enterValidPercentage);
      return;
    }

    if (velocityPercentage < 0 || velocityPercentage > 100) {
      alert(t.enterValidPercentage);
      return;
    }

    const newProduct: ProductFormData = {
      id: Date.now().toString(),
      name: productName,
      width: Number(width),
      depth: Number(depth),
      height: Number(height),
      marginType,
      marginCategory,
      marginPercentage,
      velocityType,
      velocityCategory,
      velocityPercentage,
      category,
      subCategory,
    };

    console.log('DEBUG - newProduct ANTES de onAddProduct:', newProduct);
    onAddProduct(newProduct);
    console.log('DEBUG - onAddProduct chamado com:', newProduct);
    
    // Reset form
    setProductName("");
    setWidth(10);
    setDepth(5);
    setHeight(20);
    setMarginCategory("Média");
    setMarginPercentage(66);
    setVelocityCategory("Médio");
    setVelocityPercentage(66);
    
    alert(t.productAdded);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t.addProduct}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information Tab */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t.basicInfo}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.productName} *
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
          </div>

          {/* Dimensions Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t.dimensions}</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Width */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.width} *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="10"
                  value={width}
                  onChange={(e) => setWidth(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
              </div>

              {/* Depth */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.depth} *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="5"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.height} *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="20"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
              </div>
            </div>
          </div>

          {/* Margin Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t.margin}</h3>
            
            {/* Margin Type Selection */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="marginType"
                  value="categorical"
                  checked={marginType === "categorical"}
                  onChange={() => setMarginType("categorical")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{t.categorical}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="marginType"
                  value="numeric"
                  checked={marginType === "numeric"}
                  onChange={() => setMarginType("numeric")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{t.numeric}</span>
              </label>
            </div>

            {/* Margin Categorical */}
            {marginType === "categorical" && (
              <div className="space-y-2">
                {(["Baixa", "Média", "Alta"] as const).map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="marginCategory"
                      value={m}
                      checked={marginCategory === m}
                      onChange={() => handleMarginCategoryChange(m)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">
                      {m === "Baixa" ? t.low : m === "Média" ? t.medium : t.high}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Margin Numeric */}
            {marginType === "numeric" && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={marginPercentage}
                    onChange={(e) => handleMarginPercentageChange(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marginPercentage}
                      onChange={(e) => handleMarginPercentageChange(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm"
                    />
                    <span className="text-sm text-foreground">%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "pt" ? "Categoria: " : "Category: "}
                  <strong>
                    {marginCategory === "Baixa" ? t.low : marginCategory === "Média" ? t.medium : t.high}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* Velocity Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t.velocity}</h3>
            
            {/* Velocity Type Selection */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="velocityType"
                  value="categorical"
                  checked={velocityType === "categorical"}
                  onChange={() => setVelocityType("categorical")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{t.categorical}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="velocityType"
                  value="numeric"
                  checked={velocityType === "numeric"}
                  onChange={() => setVelocityType("numeric")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{t.numeric}</span>
              </label>
            </div>

            {/* Velocity Categorical */}
            {velocityType === "categorical" && (
              <div className="space-y-2">
                {(["Baixo", "Médio", "Alto"] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="velocityCategory"
                      value={v}
                      checked={velocityCategory === v}
                      onChange={() => handleVelocityCategoryChange(v)}
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
            )}

            {/* Velocity Numeric */}
            {velocityType === "numeric" && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={velocityPercentage}
                    onChange={(e) => handleVelocityPercentageChange(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={velocityPercentage}
                      onChange={(e) => handleVelocityPercentageChange(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm"
                    />
                    <span className="text-sm text-foreground">%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "pt" ? "Categoria: " : "Category: "}
                  <strong>
                    {velocityCategory === "Baixo"
                      ? t.lowVelocity
                      : velocityCategory === "Médio"
                      ? t.mediumVelocity
                      : t.highVelocity}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
              {language === "pt" ? "Resumo do Produto" : "Product Summary"}
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>
                <strong>{language === "pt" ? "Nome: " : "Name: "}</strong>
                {productName || "(não preenchido)"}
              </li>
              <li>
                <strong>{language === "pt" ? "Dimensões: " : "Dimensions: "}</strong>
                {width} × {depth} × {height} cm
              </li>
              <li>
                <strong>{language === "pt" ? "Margem: " : "Margin: "}</strong>
                {marginPercentage}% ({marginCategory})
              </li>
              <li>
                <strong>{language === "pt" ? "Giro: " : "Velocity: "}</strong>
                {velocityPercentage}% ({velocityCategory})
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            {t.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            {t.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
