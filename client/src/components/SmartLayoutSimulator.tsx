/**
 * SmartLayoutSimulator Component
 * Interactive simulator for testing layout recommendations with category filters
 * Design: Tech-Forward Minimalism with interactive elements
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import CSVImporter from "@/components/CSVImporter";
import GondolaFrontView from "@/components/GondolaFrontView";
import GondolaImageGenerator from "@/components/GondolaImageGenerator";
import ProductFormModal from "@/components/ProductFormModal";
import { numericToCategory, formatMetricValue } from "@/lib/marginGiroCalculator";

type CategoryType = "Alimentar" | "Não-Alimentar";
type SubCategory = "Alimentos" | "Bebidas" | "Higiene" | "Beleza" | "Vestuário" | "Eletrônicos" | "Brinquedos" | "Outro";

interface Product {
  id: string;
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
  category: CategoryType;
  subCategory: SubCategory;
  largura?: number; // largura do produto em cm
  comprimento?: number; // comprimento/profundidade do produto em cm
  promotionalPoints?: PromotionalPoint[];
}

interface PromotionalPoint {
  id: string;
  type: "Ilha Promocional" | "Terminal de Gôndola" | "Outro";
  capacity: number; // capacidade em unidades
}

interface Recommendation {
  frentes: number;
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
  "Alto-Alta": { frentes: 1, zone: "Altura dos olhos", share: 35, label: "Maior espaço", color: "bg-green-600" },
  "Alto-Média": { frentes: 2, zone: "Altura dos olhos", share: 25, label: "Melhor espaço", color: "bg-green-500" },
  "Alto-Baixa": { frentes: 2, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Médio-Alta": { frentes: 2, zone: "Altura dos olhos", share: 25, label: "Melhor espaço", color: "bg-green-500" },
  "Médio-Média": { frentes: 3, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Médio-Baixa": { frentes: 4, zone: "Altura das mãos", share: 15, label: "Pequeno espaço", color: "bg-orange-400" },
  "Baixo-Alta": { frentes: 3, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Baixo-Média": { frentes: 4, zone: "Altura das mãos", share: 15, label: "Pequeno espaço", color: "bg-orange-400" },
  "Baixo-Baixa": { frentes: 5, zone: "Lugar baixo", share: 5, label: "Menor espaço", color: "bg-red-400" },
};

function getRecommendation(giro: string, margem: string): Recommendation {
  const key = `${giro}-${margem}`;
  return RECOMMENDATION_MATRIX[key as keyof typeof RECOMMENDATION_MATRIX] || 
    { frentes: 1, zone: "N/A", share: 0, label: "N/A", color: "bg-gray-300" };
}

export default function SmartLayoutSimulator() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Arroz 5kg", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Alimentos" },
    { id: "2", name: "Refrigerante 2L", giro: "Alto", margem: "Média", category: "Alimentar", subCategory: "Bebidas" },
    { id: "3", name: "Brinquedo Premium", giro: "Baixo", margem: "Alta", category: "Não-Alimentar", subCategory: "Brinquedos" },
  ]);

  const [gondolaWidth, setGondolaWidth] = useState(280);
  const [shelves, setShelves] = useState(5);
  const [shelfDepth, setShelfDepth] = useState(40); // profundidade da prateleira em cm
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "Todas">("Todas");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | "Todas">("Todas");
  const [newProductName, setNewProductName] = useState("");
  const [newProductGiro, setNewProductGiro] = useState<"Baixo" | "Médio" | "Alto">("Médio");
  const [newProductMargem, setNewProductMargem] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [newProductCategory, setNewProductCategory] = useState<CategoryType>("Alimentar");
  const [newProductSubCategory, setNewProductSubCategory] = useState<SubCategory>("Alimentos");
  const [promotionalPointType, setPromotionalPointType] = useState<"Ilha Promocional" | "Terminal de Gôndola" | "Outro">("Ilha Promocional");
  const [promotionalPointCapacity, setPromotionalPointCapacity] = useState(0);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const addProduct = () => {
    setIsProductFormOpen(true);
  };

  const handleProductFormSubmit = (productData: {
    name: string;
    largura: number;
    altura: number;
    profundidade: number;
    margem: number;
    giro: number;
  }) => {
    const giroCategory = numericToCategory(productData.giro, "giro");
    const margemCategory = numericToCategory(productData.margem, "margem");
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name,
      giro: giroCategory as "Baixo" | "Médio" | "Alto",
      margem: margemCategory as "Baixa" | "Média" | "Alta",
      category: newProductCategory,
      subCategory: newProductSubCategory,
      largura: productData.largura,
      comprimento: productData.profundidade,
    };
    setProducts([...products, newProduct]);
    setIsProductFormOpen(false);
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
    setProducts([
      { id: "1", name: "Arroz 5kg", giro: "Alto", margem: "Baixa", category: "Alimentar", subCategory: "Alimentos", largura: 20, comprimento: 30 },
      { id: "2", name: "Refrigerante 2L", giro: "Alto", margem: "Média", category: "Alimentar", subCategory: "Bebidas", largura: 10, comprimento: 25 },
      { id: "3", name: "Brinquedo Premium", giro: "Baixo", margem: "Alta", category: "Não-Alimentar", subCategory: "Brinquedos", largura: 15, comprimento: 20 },
    ]);
    setGondolaWidth(280);
    setShelves(5);
    setShelfDepth(40);
    setSelectedCategory("Todas");
    setSelectedSubCategory("Todas");
  };

  // Calcular capacidade no ponto natural (gôndola)
  const calculateNaturalPointCapacity = (product: Product): number => {
    if (!product.largura || !product.comprimento) return 0;
    const rec = getRecommendation(product.giro, product.margem);
    const produtosPorFrente = Math.floor(shelfDepth / product.comprimento);
    return rec.frentes * produtosPorFrente * shelves;
  };

  // Calcular capacidade em pontos promocionais
  const calculatePromotionalCapacity = (product: Product): number => {
    if (!product.promotionalPoints || product.promotionalPoints.length === 0) return 0;
    return product.promotionalPoints.reduce((sum, point) => sum + point.capacity, 0);
  };

  // Calcular capacidade total (ponto natural + promocional)
  const calculateTotalStoreCapacity = (product: Product): number => {
    return calculateNaturalPointCapacity(product) + calculatePromotionalCapacity(product);
  };

  // Adicionar ponto promocional a um produto
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

  // Remover ponto promocional
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

  const spacePer100 = gondolaWidth / 100;
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
      largura: p.largura,
      comprimento: p.comprimento,
      promotionalPoints: [],
    }));
    setProducts([...products, ...newProducts]);
  };


  return (
    <div className="space-y-8">
      <CSVImporter onImport={handleImportProducts} />

      {/* Filtros de Categoria */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Categoria Principal</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as CategoryType | "Todas");
                setSelectedSubCategory("Todas");
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-white text-foreground text-sm"
            >
              <option value="Todas">Todas as Categorias</option>
              <option value="Alimentar">Alimentar</option>
              <option value="Não-Alimentar">Não-Alimentar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Subcategoria</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value as SubCategory | "Todas")}
              className="w-full px-3 py-2 border border-border rounded-md bg-white text-foreground text-sm"
            >
              <option value="Todas">Todas as Subcategorias</option>
              {availableSubCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => { setSelectedCategory("Todas"); setSelectedSubCategory("Todas"); }} variant="outline" className="flex-1">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Configuração da Gôndola */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Largura da Gôndola (cm)</label>
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
          <label className="block text-sm font-medium text-foreground mb-2">Número de Prateleiras</label>
          <input
            type="range"
            min="1"
            max="10"
            value={shelves}
            onChange={(e) => setShelves(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">{shelves} prateleiras</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Profundidade da Prateleira (cm)</label>
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
        <div className="flex items-end">
          <Button onClick={resetSimulator} variant="outline" className="w-full flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Completo
          </Button>
        </div>
      </div>

      {/* Adicionar Produto */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Adicionar Produto</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <input
            type="text"
            placeholder="Nome do produto"
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
            <option value="Baixo">Giro Baixo</option>
            <option value="Médio">Giro Médio</option>
            <option value="Alto">Giro Alto</option>
          </select>
          <select
            value={newProductMargem}
            onChange={(e) => setNewProductMargem(e.target.value as "Baixa" | "Média" | "Alta")}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="Baixa">Margem Baixa</option>
            <option value="Média">Margem Média</option>
            <option value="Alta">Margem Alta</option>
          </select>
          <Button onClick={addProduct} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Produtos Adicionados ({filteredProducts.length} de {products.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Produto</th>
                <th className="text-left py-3 px-4 font-semibold">Dimensões (L×C)</th>
                <th className="text-left py-3 px-4 font-semibold">Categoria</th>
                <th className="text-left py-3 px-4 font-semibold">Giro</th>
                <th className="text-left py-3 px-4 font-semibold">Margem</th>
                <th className="text-left py-3 px-4 font-semibold">Por Prateleira</th>
                <th className="text-left py-3 px-4 font-semibold">Ponto Natural</th>
                <th className="text-left py-3 px-4 font-semibold">Frentes</th>
                <th className="text-left py-3 px-4 font-semibold">Zona</th>
                <th className="text-left py-3 px-4 font-semibold">Ação</th>
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
                    <td className="py-3 px-4 font-medium text-blue-600">{Math.floor(shelfDepth / (product.comprimento || 1))} unid.</td>
                    <td className="py-3 px-4 font-medium text-green-600">{naturalCapacity} unid.</td>
                    <td className="py-3 px-4 font-medium">{rec.frentes}</td>
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
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Visualização da Gôndola</h3>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-xs text-muted-foreground mb-2">Espaço total: {gondolaWidth} cm | Espaço utilizado: {totalShare}%</p>
          {totalShare > 100 && (
            <p className="text-xs text-red-600 font-medium mb-2">Espaço excedido! Reduza produtos ou aumente a gôndola.</p>
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
      </div>

      {/* Visualização Frontal da Gôndola */}
      <GondolaFrontView
        products={filteredProducts}
        gondolaWidth={gondolaWidth}
        shelves={shelves}
        shelfDepth={shelfDepth}
        getRecommendation={getRecommendation}
      />

      {/* Visualização Renderizada por IA */}
      <GondolaImageGenerator
        products={filteredProducts}
        gondolaWidth={gondolaWidth}
        shelves={shelves}
        shelfDepth={shelfDepth}
        getRecommendation={getRecommendation}
      />

      {/* Pontos Promocionais */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pontos Promocionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <select
            value={promotionalPointType}
            onChange={(e) => setPromotionalPointType(e.target.value as "Ilha Promocional" | "Terminal de Gôndola" | "Outro")}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="Ilha Promocional">Ilha Promocional</option>
            <option value="Terminal de Gôndola">Terminal de Gôndola</option>
            <option value="Outro">Outro</option>
          </select>
          <input
            type="number"
            placeholder="Capacidade (unidades)"
            value={promotionalPointCapacity}
            onChange={(e) => setPromotionalPointCapacity(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-md text-sm"
            min="0"
          />
          <div className="col-span-2 text-xs text-muted-foreground pt-2">
            Selecione um produto na tabela abaixo para adicionar ponto promocional
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
                    <p className="text-xs text-muted-foreground">Dimensões: {product.largura || '-'}cm × {product.comprimento || '-'}cm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">Ponto Natural: {naturalCapacity} unid.</p>
                    <p className="text-sm font-medium text-orange-600">Promocional: {promotionalCapacity} unid.</p>
                    <p className="text-sm font-bold text-green-600">Total Loja: {totalCapacity} unid.</p>
                  </div>
                </div>

                {/* Botão para adicionar ponto promocional */}
                <Button
                  onClick={() => addPromotionalPoint(product.id)}
                  disabled={promotionalPointCapacity <= 0}
                  className="w-full mb-3 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar {promotionalPointType}
                </Button>

                {/* Lista de pontos promocionais do produto */}
                {product.promotionalPoints && product.promotionalPoints.length > 0 && (
                  <div className="space-y-2">
                    {product.promotionalPoints.map((point) => (
                      <div key={point.id} className="flex justify-between items-center bg-muted p-2 rounded text-sm">
                        <span>
                          <strong>{point.type}</strong>: {point.capacity} unid.
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

      {/* ProductFormModal */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleProductFormSubmit}
      />
    </div>
  );
}
