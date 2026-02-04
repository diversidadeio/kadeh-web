/**
 * SmartLayoutSimulator Component
 * Interactive simulator for testing layout recommendations with category filters
 * Design: Tech-Forward Minimalism with interactive elements
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw, Download } from "lucide-react";
import CSVImporter from "@/components/CSVImporter";
import { numericToCategory, formatMetricValue } from "@/lib/marginGiroCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import html2pdf from "html2pdf.js";

type CategoryType = "Alimentar" | "Não-Alimentar";
type SubCategory = "Alimentos" | "Bebidas" | "Higiene" | "Beleza" | "Vestuário" | "Eletrônicos" | "Brinquedos" | "Outro";

interface Product {
  id: string;
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
  category: CategoryType;
  subCategory: SubCategory;
  largura?: number;
  comprimento?: number;
  promotionalPoints?: PromotionalPoint[];
}

interface PromotionalPoint {
  id: string;
  type: "Ilha Promocional" | "Terminal de Gôndola" | "Outro";
  capacity: number;
}

interface Recommendation {
  quadrantes: number;
  zone: string;
  share: number;
  label: string;
  color: string;
}

const CATEGORIES = {
  "Alimentar": ["Alimentos", "Bebidas"],
  "Não-Alimentar": ["Higiene", "Beleza", "Vestuário", "Eletrônicos", "Brinquedos", "Outro"],
};

const RECOMMENDATION_MATRIX = {
  "Alto-Alta": { quadrantes: 1, zone: "Altura dos olhos", share: 35, label: "Maior espaço", color: "bg-green-600" },
  "Alto-Média": { quadrantes: 2, zone: "Altura dos olhos", share: 25, label: "Melhor espaço", color: "bg-green-500" },
  "Alto-Baixa": { quadrantes: 2, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Médio-Alta": { quadrantes: 2, zone: "Altura dos olhos", share: 25, label: "Melhor espaço", color: "bg-green-500" },
  "Médio-Média": { quadrantes: 3, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Médio-Baixa": { quadrantes: 4, zone: "Altura das mãos", share: 15, label: "Pequeno espaço", color: "bg-orange-400" },
  "Baixo-Alta": { quadrantes: 3, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Baixo-Média": { quadrantes: 4, zone: "Altura das mãos", share: 15, label: "Pequeno espaço", color: "bg-orange-400" },
  "Baixo-Baixa": { quadrantes: 5, zone: "Lugar baixo", share: 5, label: "Menor espaço", color: "bg-red-400" },
};

// Product presets for different categories
const PRODUCT_PRESETS = {
  rice: [
    { id: "1", name: "Arroz 5kg", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "2", name: "Arroz Nobre 5 kg", giro: "Médio", margem: "Alta", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "3", name: "Arroz Precinho 5kg", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "4", name: "Arroz Marca Própria 5 kg", giro: "Alto", margem: "Alta", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "5", name: "Arroz Premium 5 Kg", giro: "Médio", margem: "Alta", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
  ] as Product[],
  beverages: [
    { id: "1", name: "Refrigerante 2L", giro: "Alto", margem: "Média", category: "Alimentar", subCategory: "Bebidas", largura: 10, comprimento: 25 },
    { id: "2", name: "Suco Natural 1L", giro: "Médio", margem: "Alta", category: "Alimentar", subCategory: "Bebidas", largura: 8, comprimento: 20 },
    { id: "3", name: "Água Mineral 1.5L", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Bebidas", largura: 8, comprimento: 22 },
    { id: "4", name: "Chá Gelado Premium", giro: "Baixo", margem: "Alta", category: "Alimentar", subCategory: "Bebidas", largura: 7, comprimento: 18 },
    { id: "5", name: "Café Premium 500g", giro: "Médio", margem: "Alta", category: "Alimentar", subCategory: "Bebidas", largura: 12, comprimento: 15 },
  ] as Product[],
  hygiene: [
    { id: "1", name: "Sabonete Líquido 250ml", giro: "Alto", margem: "Média", category: "Não-Alimentar", subCategory: "Higiene", largura: 8, comprimento: 15 },
    { id: "2", name: "Shampoo Premium 400ml", giro: "Médio", margem: "Alta", category: "Não-Alimentar", subCategory: "Higiene", largura: 8, comprimento: 18 },
    { id: "3", name: "Desodorante Spray", giro: "Alto", margem: "Média", category: "Não-Alimentar", subCategory: "Higiene", largura: 6, comprimento: 12 },
    { id: "4", name: "Papel Higiênico 12 rolos", giro: "Alto", margem: "Baixa", category: "Não-Alimentar", subCategory: "Higiene", largura: 15, comprimento: 20 },
    { id: "5", name: "Escova de Dentes Premium", giro: "Médio", margem: "Alta", category: "Não-Alimentar", subCategory: "Higiene", largura: 5, comprimento: 10 },
  ] as Product[],
  electronics: [
    { id: "1", name: "Fone Bluetooth", giro: "Médio", margem: "Alta", category: "Não-Alimentar", subCategory: "Eletrônicos", largura: 12, comprimento: 10 },
    { id: "2", name: "Carregador USB-C", giro: "Alto", margem: "Média", category: "Não-Alimentar", subCategory: "Eletrônicos", largura: 8, comprimento: 8 },
    { id: "3", name: "Cabo HDMI 2m", giro: "Alto", margem: "Baixa", category: "Não-Alimentar", subCategory: "Eletrônicos", largura: 10, comprimento: 5 },
    { id: "4", name: "Bateria Recarregável Premium", giro: "Médio", margem: "Alta", category: "Não-Alimentar", subCategory: "Eletrônicos", largura: 6, comprimento: 8 },
    { id: "5", name: "Adaptador Viagem Universal", giro: "Baixo", margem: "Alta", category: "Não-Alimentar", subCategory: "Eletrônicos", largura: 10, comprimento: 10 },
  ] as Product[],
};

const TRANSLATIONS = {
  pt: {
    filterByCategory: "Filtrar por Categoria",
    mainCategory: "Categoria Principal",
    subCategory: "Subcategoria",
    allCategories: "Todas as Categorias",
    allSubCategories: "Todas as Subcategorias",
    clearFilters: "Limpar Filtros",
    shelfWidth: "Largura da Gôndola (cm)",
    numberOfShelves: "Número de Prateleiras",
    shelfDepth: "Profundidade da Prateleira (cm)",
    resetComplete: "Reset Completo",
    addProduct: "Adicionar Produto",
    productName: "Nome do produto",
    lowVelocity: "Giro Baixo",
    mediumVelocity: "Giro Médio",
    highVelocity: "Giro Alto",
    lowMargin: "Margem Baixa",
    mediumMargin: "Margem Média",
    highMargin: "Margem Alta",
    add: "Adicionar",
    productsAdded: "Produtos Adicionados",
    product: "Produto",
    dimensions: "Dimensões (L×C)",
    category: "Categoria",
    velocity: "Giro",
    margin: "Margem",
    perShelf: "Por Prateleira",
    naturalPoint: "Ponto Natural",
    quadrants: "Quadrantes",
    zone: "Zona",
    action: "Ação",
    shelfVisualization: "Visualização da Gôndola",
    totalSpace: "Espaço total",
    usedSpace: "Espaço utilizado",
    spaceExceeded: "Espaço excedido! Reduza produtos ou aumente a gôndola.",
    promotionalPoints: "Pontos Promocionais",
    selectProduct: "Selecione um produto na tabela abaixo para adicionar ponto promocional",
    capacity: "Capacidade (unidades)",
    promotionalIsland: "Ilha Promocional",
    gondolaTerminal: "Terminal de Gôndola",
    other: "Outro",
    addPromotion: "Adicionar",
    presets: "Presets de Produtos",
    loadRicePreset: "Carregar Arroz",
    loadBeveragesPreset: "Carregar Bebidas",
    loadHygienePreset: "Carregar Higiene",
    loadElectronicsPreset: "Carregar Eletrônicos",
    exportPlanogram: "Exportar Planograma",
    bulkImport: "Importar Produtos em Massa",
    shelfHeight: "Altura entre Prateleiras (cm)",
  },
  en: {
    filterByCategory: "Filter by Category",
    mainCategory: "Main Category",
    subCategory: "Subcategory",
    allCategories: "All Categories",
    allSubCategories: "All Subcategories",
    clearFilters: "Clear Filters",
    shelfWidth: "Shelf Width (cm)",
    numberOfShelves: "Number of Shelves",
    shelfDepth: "Shelf Depth (cm)",
    resetComplete: "Full Reset",
    addProduct: "Add Product",
    productName: "Product name",
    lowVelocity: "Low Velocity",
    mediumVelocity: "Medium Velocity",
    highVelocity: "High Velocity",
    lowMargin: "Low Margin",
    mediumMargin: "Medium Margin",
    highMargin: "High Margin",
    add: "Add",
    productsAdded: "Products Added",
    product: "Product",
    dimensions: "Dimensions (W×D)",
    category: "Category",
    velocity: "Velocity",
    margin: "Margin",
    perShelf: "Per Shelf",
    naturalPoint: "Natural Point",
    quadrants: "Quadrants",
    zone: "Zone",
    action: "Action",
    shelfVisualization: "Shelf Visualization",
    totalSpace: "Total space",
    usedSpace: "Used space",
    spaceExceeded: "Space exceeded! Reduce products or increase shelf width.",
    promotionalPoints: "Promotional Points",
    selectProduct: "Select a product in the table below to add promotional point",
    capacity: "Capacity (units)",
    promotionalIsland: "Promotional Island",
    gondolaTerminal: "Gondola Terminal",
    other: "Other",
    addPromotion: "Add",
    presets: "Product Presets",
    loadRicePreset: "Load Rice",
    loadBeveragesPreset: "Load Beverages",
    loadHygienePreset: "Load Hygiene",
    loadElectronicsPreset: "Load Electronics",
    exportPlanogram: "Export Planogram",
    bulkImport: "Bulk Import Products",
    shelfHeight: "Shelf Height (cm)",
  }
};

function getRecommendation(giro: string, margem: string): Recommendation {
  const key = `${giro}-${margem}`;
  return RECOMMENDATION_MATRIX[key as keyof typeof RECOMMENDATION_MATRIX] || 
    { quadrantes: 1, zone: "N/A", share: 0, label: "N/A", color: "bg-gray-300" };
}

export default function SmartLayoutSimulator() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Arroz 5kg", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "2", name: "Arroz Nobre 5 kg", giro: "Médio", margem: "Alta", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "3", name: "Arroz Precinho 5kg", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "4", name: "Arroz Marca Própria 5 kg", giro: "Alto", margem: "Alta", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
    { id: "5", name: "Arroz Premium 5 Kg", giro: "Médio", margem: "Alta", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
  ]);

  const [gondolaWidth, setGondolaWidth] = useState(280);
  const [shelves, setShelves] = useState(5);
  const [shelfDepth, setShelfDepth] = useState(40);
  const [shelfHeight, setShelfHeight] = useState(60);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "Todas">("Todas");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | "Todas">("Todas");
  const [newProductName, setNewProductName] = useState("");
  const [newProductGiro, setNewProductGiro] = useState<"Baixo" | "Médio" | "Alto">("Médio");
  const [newProductMargem, setNewProductMargem] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [newProductCategory, setNewProductCategory] = useState<CategoryType>("Alimentar");
  const [newProductSubCategory, setNewProductSubCategory] = useState<SubCategory>("Alimentos");
  const [promotionalPointType, setPromotionalPointType] = useState<"Ilha Promocional" | "Terminal de Gôndola" | "Outro">("Ilha Promocional");
  const [promotionalPointCapacity, setPromotionalPointCapacity] = useState(0);

  const addProduct = () => {
    if (newProductName.trim()) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: newProductName,
        giro: newProductGiro,
        margem: newProductMargem,
        category: newProductCategory,
        subCategory: newProductSubCategory,
        largura: 20,
        comprimento: 30,
      };
      setProducts([...products, newProduct]);
      setNewProductName("");
      setNewProductGiro("Médio");
      setNewProductMargem("Média");
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "Todas" && p.category !== selectedCategory) return false;
    if (selectedSubCategory !== "Todas" && p.subCategory !== selectedSubCategory) return false;
    return true;
  });

  const resetSimulator = () => {
    setProducts(PRODUCT_PRESETS.rice);
    setGondolaWidth(280);
    setShelves(5);
    setShelfDepth(40);
    setShelfHeight(60);
    setSelectedCategory("Todas");
    setSelectedSubCategory("Todas");
  };

  const loadPreset = (preset: keyof typeof PRODUCT_PRESETS) => {
    setProducts(PRODUCT_PRESETS[preset]);
    setSelectedCategory("Todas");
    setSelectedSubCategory("Todas");
  };

  const calculateNaturalPointCapacity = (product: Product): number => {
    if (!product.largura || !product.comprimento) return 0;
    const rec = getRecommendation(product.giro, product.margem);
    const produtosPorQuadrante = Math.floor(shelfDepth / product.comprimento);
    const produtosAltura = Math.floor(shelfHeight / (product.largura || 1));
    return rec.quadrantes * produtosPorQuadrante * produtosAltura;
  };

  const calculatePromotionalCapacity = (product: Product): number => {
    if (!product.promotionalPoints || product.promotionalPoints.length === 0) return 0;
    return product.promotionalPoints.reduce((sum, point) => sum + point.capacity, 0);
  };

  const calculateTotalStoreCapacity = (product: Product): number => {
    return calculateNaturalPointCapacity(product) + calculatePromotionalCapacity(product);
  };

  const addPromotionalPoint = (productId: string) => {
    if (promotionalPointCapacity <= 0) return;
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          promotionalPoints: [
            ...(p.promotionalPoints || []),
            {
              id: `promo-${Date.now()}`,
              type: promotionalPointType,
              capacity: promotionalPointCapacity,
            }
          ]
        };
      }
      return p;
    }));
    setPromotionalPointCapacity(0);
  };

  const removePromotionalPoint = (productId: string, promoId: string) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          promotionalPoints: (p.promotionalPoints || []).filter(pr => pr.id !== promoId)
        };
      }
      return p;
    }));
  };

  const totalShare = filteredProducts.reduce((sum, p) => {
    const rec = getRecommendation(p.giro, p.margem);
    return sum + rec.share;
  }, 0);

  const availableSubCategories = selectedCategory === "Todas" 
    ? Object.values(CATEGORIES).flat() as SubCategory[]
    : (CATEGORIES[selectedCategory as CategoryType] as SubCategory[]);

  const handleImportProducts = (importedProducts: any[]) => {
    const newProducts = importedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      giro: typeof p.giro === "number" ? numericToCategory(p.giro, "giro") as "Baixo" | "Médio" | "Alto" : p.giro,
      margem: typeof p.margem === "number" ? numericToCategory(p.margem, "margem") as "Baixa" | "Média" | "Alta" : p.margem,
      category: p.category,
      subCategory: p.subCategory,
      largura: p.largura || 20,
      comprimento: p.comprimento || 30,
      promotionalPoints: [],
    }));
    setProducts([...products, ...newProducts]);
  };

  const exportPlanogram = () => {
    const element = document.getElementById("planogram-export");
    if (!element) return;

    const opt: any = {
      margin: 10,
      filename: "planograma-gondola.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
    };

    (html2pdf() as any).set(opt).from(element).save();
  };

  return (
    <div className="space-y-8">
      <CSVImporter onImport={handleImportProducts} />

      {/* Presets */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.presets}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={() => loadPreset("rice")} variant="outline" className="text-sm">
            {t.loadRicePreset}
          </Button>
          <Button onClick={() => loadPreset("beverages")} variant="outline" className="text-sm">
            {t.loadBeveragesPreset}
          </Button>
          <Button onClick={() => loadPreset("hygiene")} variant="outline" className="text-sm">
            {t.loadHygienePreset}
          </Button>
          <Button onClick={() => loadPreset("electronics")} variant="outline" className="text-sm">
            {t.loadElectronicsPreset}
          </Button>
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.filterByCategory}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.mainCategory}</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as CategoryType | "Todas");
                setSelectedSubCategory("Todas");
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-white text-foreground text-sm"
            >
              <option value="Todas">{t.allCategories}</option>
              <option value="Alimentar">Alimentar</option>
              <option value="Não-Alimentar">Não-Alimentar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.subCategory}</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value as SubCategory | "Todas")}
              className="w-full px-3 py-2 border border-border rounded-md bg-white text-foreground text-sm"
            >
              <option value="Todas">{t.allSubCategories}</option>
              {availableSubCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => { setSelectedCategory("Todas"); setSelectedSubCategory("Todas"); }} variant="outline" className="flex-1">
              {t.clearFilters}
            </Button>
          </div>
        </div>
      </div>

      {/* Configuração da Gôndola */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.shelfWidth}</label>
          <input
            type="range"
            min="100"
            max="500"
            value={gondolaWidth}
            onChange={(e) => setGondolaWidth(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">{gondolaWidth} cm</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.numberOfShelves}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={shelves}
            onChange={(e) => setShelves(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">{shelves} {language === 'pt' ? 'prateleiras' : 'shelves'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.shelfDepth}</label>
          <input
            type="range"
            min="20"
            max="80"
            value={shelfDepth}
            onChange={(e) => setShelfDepth(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">{shelfDepth} cm</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.shelfHeight}</label>
          <input
            type="range"
            min="30"
            max="90"
            value={shelfHeight}
            onChange={(e) => setShelfHeight(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">{shelfHeight} cm</p>
        </div>
        <div className="flex items-end">
          <Button onClick={resetSimulator} variant="outline" className="w-full flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            {t.resetComplete}
          </Button>
        </div>
      </div>

      {/* Adicionar Produto */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.addProduct}</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <input
            type="text"
            placeholder={t.productName}
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm"
          />
          <select
            value={newProductCategory}
            onChange={(e) => {
              const cat = e.target.value as CategoryType;
              setNewProductCategory(cat);
              setNewProductSubCategory(CATEGORIES[cat][0] as SubCategory);
            }}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="Alimentar">Alimentar</option>
            <option value="Não-Alimentar">Não-Alimentar</option>
          </select>
          <select
            value={newProductSubCategory}
            onChange={(e) => setNewProductSubCategory(e.target.value as SubCategory)}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            {CATEGORIES[newProductCategory].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <select
            value={newProductGiro}
            onChange={(e) => setNewProductGiro(e.target.value as "Baixo" | "Médio" | "Alto")}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="Baixo">{t.lowVelocity}</option>
            <option value="Médio">{t.mediumVelocity}</option>
            <option value="Alto">{t.highVelocity}</option>
          </select>
          <select
            value={newProductMargem}
            onChange={(e) => setNewProductMargem(e.target.value as "Baixa" | "Média" | "Alta")}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="Baixa">{t.lowMargin}</option>
            <option value="Média">{t.mediumMargin}</option>
            <option value="Alta">{t.highMargin}</option>
          </select>
          <Button onClick={addProduct} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t.add}
          </Button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.productsAdded} ({filteredProducts.length} {language === 'pt' ? 'de' : 'of'} {products.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">{t.product}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.dimensions}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.category}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.velocity}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.margin}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.perShelf}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.naturalPoint}</th>
                <th className="text-left py-3 px-4 font-semibold bg-blue-50">{t.quadrants}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.zone}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const rec = getRecommendation(product.giro, product.margem);
                const spaceWidth = (rec.share / 100) * gondolaWidth;
                const naturalCapacity = calculateNaturalPointCapacity(product);
                return (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 text-xs">{product.largura || '-'}cm × {product.comprimento || '-'}cm</td>
                    <td className="py-3 px-4 text-xs">{product.subCategory}</td>
                    <td className="py-3 px-4">{product.giro}</td>
                    <td className="py-3 px-4">{product.margem}</td>
                    <td className="py-3 px-4 font-medium text-blue-600">{Math.floor(shelfDepth / (product.comprimento || 1))} {language === 'pt' ? 'unid.' : 'units'}</td>
                    <td className="py-3 px-4 font-medium text-green-600">{naturalCapacity} {language === 'pt' ? 'unid.' : 'units'}</td>
                    <td className="py-3 px-4 font-medium bg-blue-50">{rec.quadrantes}</td>
                    <td className="py-3 px-4 text-xs">{rec.zone}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualização da Gôndola */}
      <div id="planogram-export" className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.shelfVisualization}</h3>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-xs text-muted-foreground mb-2">{t.totalSpace}: {gondolaWidth} cm | {t.usedSpace}: {totalShare}%</p>
          {totalShare > 100 && (
            <p className="text-xs text-red-600 font-medium mb-2">{t.spaceExceeded}</p>
          )}
          <div className="flex gap-2 h-12 rounded border border-border">
            {filteredProducts.map((product) => {
              const rec = getRecommendation(product.giro, product.margem);
              const width = (rec.share / 100) * 100;
              return (
                <div
                  key={product.id}
                  className={`${rec.color} flex items-center justify-center text-white text-xs font-medium transition-all hover:opacity-80`}
                  style={{ width: `${width}%` }}
                  title={`${product.name}: ${rec.share}%`}
                >
                  {width > 8 && <span>{rec.share}%</span>}
                </div>
              );
            })}
          </div>
        </div>
        <Button onClick={exportPlanogram} className="flex items-center gap-2 mb-4">
          <Download className="w-4 h-4" />
          {t.exportPlanogram}
        </Button>
      </div>

      {/* Pontos Promocionais */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.promotionalPoints}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <select
            value={promotionalPointType}
            onChange={(e) => setPromotionalPointType(e.target.value as "Ilha Promocional" | "Terminal de Gôndola" | "Outro")}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="Ilha Promocional">{t.promotionalIsland}</option>
            <option value="Terminal de Gôndola">{t.gondolaTerminal}</option>
            <option value="Outro">{t.other}</option>
          </select>
          <input
            type="number"
            placeholder={t.capacity}
            value={promotionalPointCapacity}
            onChange={(e) => setPromotionalPointCapacity(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-md text-sm"
            min="0"
          />
          <div className="col-span-2 text-xs text-muted-foreground pt-2">
            {t.selectProduct}
          </div>
        </div>

        {/* Lista de Produtos com Pontos Promocionais */}
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const naturalCapacity = calculateNaturalPointCapacity(product);
            const promotionalCapacity = calculatePromotionalCapacity(product);
            const totalCapacity = calculateTotalStoreCapacity(product);
            return (
              <div key={product.id} className="border border-border rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{language === 'pt' ? 'Dimensões' : 'Dimensions'}: {product.largura || '-'}cm × {product.comprimento || '-'}cm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{t.naturalPoint}: {naturalCapacity} {language === 'pt' ? 'unid.' : 'units'}</p>
                    <p className="text-sm font-medium text-orange-600">{language === 'pt' ? 'Promocional' : 'Promotional'}: {promotionalCapacity} {language === 'pt' ? 'unid.' : 'units'}</p>
                    <p className="text-sm font-bold text-green-600">{language === 'pt' ? 'Total Loja' : 'Total Store'}: {totalCapacity} {language === 'pt' ? 'unid.' : 'units'}</p>
                  </div>
                </div>

                {/* Botão para adicionar ponto promocional */}
                <Button
                  onClick={() => addPromotionalPoint(product.id)}
                  disabled={promotionalPointCapacity <= 0}
                  className="w-full mb-3 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t.addPromotion} {promotionalPointType}
                </Button>

                {/* Lista de pontos promocionais do produto */}
                {product.promotionalPoints && product.promotionalPoints.length > 0 && (
                  <div className="space-y-2">
                    {product.promotionalPoints.map((point) => (
                      <div key={point.id} className="flex justify-between items-center bg-muted p-2 rounded text-sm">
                        <span>
                          <strong>{point.type}</strong>: {point.capacity} {language === 'pt' ? 'unid.' : 'units'}
                        </span>
                        <button
                          onClick={() => removePromotionalPoint(product.id, point.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
