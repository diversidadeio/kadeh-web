/**
 * SmartLayoutSimulator Component - Refactored
 * Interactive simulator with 100 categories, ABC curves, and advanced filters
 * Design: Tech-Forward Minimalism with interactive elements
 */

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw, Download, Lightbulb, Save } from "lucide-react";
import CSVImporter from "@/components/CSVImporter";
import ProductDescriptor, { type ProductDescriptor as ProductDescriptorType } from "@/components/ProductDescriptor";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES_DATABASE, getRecommendationByABCCurves, type Category } from "@/data/categories";
import { calculateShelfZone } from "@/utils/shelfZoneCalculator";
import Shelf3DVisualization from "@/components/Shelf3DVisualization";
import SimulationHistory, { type Simulation } from "@/components/SimulationHistory";
import { generateRecommendation, getRecommendationExplanation } from "@/data/recommendationEngine";
import GondolaVisualization from "@/components/GondolaVisualization";
import GondolaVisualization3D from "@/components/GondolaVisualization3D";
import GondolaFrontView from "@/components/GondolaFrontView";
import ShelfZoneFilter from "@/components/ShelfZoneFilter";
import ExposureAreaModal from "@/components/ExposureAreaModal";
import { ConfiguracaoAreaExposicao, type MedidasAreaExposicao, type TipoAreaExposicao } from "@/components/ConfiguracaoAreaExposicao";
import StoreVisualizationGenerator from "@/components/StoreVisualizationGenerator";
import FinancialImpactDashboard from "@/components/FinancialImpactDashboard";
import HelpButton from "@/components/HelpButton";

type CategoryType = "Alimentar" | "Não-Alimentar";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
  largura?: number;
  comprimento?: number;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo' | 'Eye level' | 'Hand level' | 'Bottom shelf';
  promotionalPoints?: PromotionalPoint[];
}

interface PromotionalPoint {
  id: string;
  type: "Ilha Promocional" | "Terminal de Gôndola" | "Outro";
  capacity: number;
}

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
    shelfHeight: "Altura entre Prateleiras (cm)",
    resetComplete: "Reset Completo",
    addProduct: "Adicionar Produto",
    productName: "Nome do produto",
    velocity: "Giro",
    margin: "Margem",
    add: "Adicionar",
    productsAdded: "Produtos Adicionados",
    product: "Produto",
    dimensions: "Dimensões (L×C)",
    perShelf: "Por Prateleira",
    naturalPoint: "Ponto Natural",
    quadrantes: "Quadrantes",
    zone: "Zona",
    action: "Ação",
    shelfVisualization: "Visualização da Gôndola",
    totalSpace: "Espaço total",
    usedSpace: "Espaço utilizado",
    spaceExceeded: "Espaço excedido! Reduza produtos ou aumente a gôndola.",
    exportPlanogram: "Exportar Planograma",
    promotionalPoints: "Pontos Promocionais",
    selectProduct: "Selecione um produto na tabela abaixo para adicionar ponto promocional",
    naturalPointCapacity: "Ponto Natural",
    promotional: "Promocional",
    totalStore: "Total Loja",
    addPromotional: "Adicionar Ilha Promocional",
    faq: "Perguntas Frequentes",
    loadProductPresets: "Carregar Presets de Produtos",
    bulkImport: "Importar Produtos em Massa",
    dataSources: "Fontes de Dados e Referências Técnicas",
    dataSourcesDescription: "A base de relevância e os papéis de categoria foram extraídos e validados conforme os relatórios de mercado de 2024-2026:",
    abras: "ABRAS (Associação Brasileira de Supermercados): Rankings de faturamento por seção e cestas de consumo.",
    nielseniq: "NielsenIQ: Relatórios de Tendências do Varejo sobre o comportamento das categorias Alimentar e HPC.",
    kantar: "Kantar Worldpanel: Dados sobre a Árvore de Decisão do Consumidor e penetração de categorias nos lares brasileiros.",
    savarejoe: "E-Commerce Brasil / SA Varejo: Artigos técnicos sobre Gerenciamento de Categorias e Ruptura de Gôndola.",
    intelligentRecommendations: "Recomendações Inteligentes",
    getRecommendations: "Obter Recomendações",
    applyRecommendations: "Aplicar Recomendações",
    saveSimulation: "Salvar Simulação",
    simulationName: "Nome da Simulação",
    view3D: "Visualizar 3D",
    history: "Histórico de Simulações",
    confidence: "Confiança",
    filterByZone: "Filtrar por Zona de Prateleira",
    eyes: "Altura dos olhos",
    hands: "Altura das mãos",
    bottom: "Lugar baixo",
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
    shelfHeight: "Shelf Height (cm)",
    resetComplete: "Complete Reset",
    addProduct: "Add Product",
    productName: "Product name",
    velocity: "Velocity",
    margin: "Margin",
    add: "Add",
    productsAdded: "Products Added",
    product: "Product",
    dimensions: "Dimensions (W×D)",
    perShelf: "Per Shelf",
    naturalPoint: "Natural Point",
    quadrantes: "Quadrants",
    zone: "Zone",
    action: "Action",
    shelfVisualization: "Shelf Visualization",
    totalSpace: "Total space",
    usedSpace: "Used space",
    spaceExceeded: "Space exceeded! Reduce products or increase shelf.",
    exportPlanogram: "Export Planogram",
    promotionalPoints: "Promotional Points",
    selectProduct: "Select a product in the table below to add promotional point",
    naturalPointCapacity: "Natural Point",
    promotional: "Promotional",
    totalStore: "Total Store",
    addPromotional: "Add Promotional Island",
    faq: "Frequently Asked Questions",
    loadProductPresets: "Load Product Presets",
    bulkImport: "Bulk Import Products",
    dataSources: "Data Sources and Technical References",
    dataSourcesDescription: "The relevance base and category roles were extracted and validated according to 2024-2026 market reports:",
    abras: "ABRAS (Brazilian Supermarket Association): Revenue rankings by section and consumption baskets.",
    nielseniq: "NielsenIQ: Retail Trend Reports on the behavior of Food and HPC categories.",
    kantar: "Kantar Worldpanel: Data on the Consumer Decision Tree and category penetration in Brazilian households.",
    savarejoe: "E-Commerce Brasil / SA Varejo: Technical articles on Category Management and Shelf Rupture.",
    intelligentRecommendations: "Intelligent Recommendations",
    getRecommendations: "Get Recommendations",
    applyRecommendations: "Apply Recommendations",
    saveSimulation: "Save Simulation",
    simulationName: "Simulation Name",
    view3D: "View 3D",
    history: "Simulation History",
    confidence: "Confidence",
    filterByZone: "Filter by Shelf Zone",
    eyes: "Eye level",
    hands: "Hand level",
    bottom: "Bottom shelf",
  },
};

export default function SmartLayoutSimulator() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<CategoryType | "Todas">("Todas");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Todas");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [gondolaWidth, setGondolaWidth] = useState(280);
  const [shelfHeight, setShelfHeight] = useState(60);
  const [shelfDepth, setShelfDepth] = useState(40);
  const [numberOfShelves, setNumberOfShelves] = useState(5);
  const [showExposureModal, setShowExposureModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPromotionalModal, setShowPromotionalModal] = useState(false);

  const filteredCategories = useMemo(() => {
    return CATEGORIES_DATABASE.filter((cat) => {
      if (selectedMainCategory !== "Todas" && cat.mainCategory !== selectedMainCategory) return false;
      return true;
    });
  }, [selectedMainCategory, selectedSubCategory]);

  const filteredProductsByZone = useMemo(() => {
    if (!selectedZone) return products;
    return products.filter((product) => product.zone === selectedZone);
  }, [products, selectedZone]);

  const handleExportPDF = (areaType: string) => {
    const productsToExport = selectedZone ? filteredProductsByZone : products;
    exportPlanogramToPDF(
      productsToExport,
      gondolaWidth,
      areaType,
      getRecommendationByABCCurves,
      colorMap,
      language
    );
  };

  const calculateNaturalPointCapacity = (product: Product): number => {
    if (!product.largura || !product.comprimento) return 0;
    const rec = getRecommendationByABCCurves(
      product.category.curvaFaturamento,
      product.category.curvaLucratividade
    );
    const produtosPorQuadrante = Math.floor(shelfDepth / product.comprimento);
    const produtosAltura = Math.floor(shelfHeight / (product.largura || 1));
    return rec.quadrantes * produtosPorQuadrante * produtosAltura;
  };

  const addProduct = (category: Category) => {
    // Calculate optimal shelf zone based on margin (lucratividade) and giro (faturamento)
    const optimalZone = calculateShelfZone(
      category.curvaLucratividade as any,
      category.curvaFaturamento as any,
      language as 'pt' | 'en'
    );
    
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: category.name,
      categoryId: category.id,
      category,
      largura: category.defaultLargura,
      comprimento: category.defaultComprimento,
      zone: optimalZone, // Store the calculated zone
      promotionalPoints: [],
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const calculateTotalUsedSpace = (): number => {
    return products.reduce((total, product) => {
      const rec = getRecommendationByABCCurves(
        product.category.curvaFaturamento,
        product.category.curvaLucratividade
      );
      return total + (rec.quadrantes * (product.largura || 0));
    }, 0);
  };

  const totalUsedSpace = calculateTotalUsedSpace();
  const spacePercentage = (totalUsedSpace / gondolaWidth) * 100;

  const colorMap: Record<string, string> = {
    "Altura dos olhos": "bg-green-600",
    "Altura das mãos": "bg-yellow-500",
    "Lugar baixo": "bg-red-400",
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.filterByCategory}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.mainCategory}</label>
            <select
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value as CategoryType | "Todas");
                setSelectedSubCategory("Todas");
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
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
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              disabled
            >
              <option value="Todas">{t.allSubCategories}</option>
              {Array.from(new Set(filteredCategories.map((cat) => cat.papelEstrategico))).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.filterByZone}</label>
            <select
              value={selectedZone || "Todas"}
              onChange={(e) => setSelectedZone(e.target.value === "Todas" ? null : e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="Todas">{t.allCategories}</option>
              <option value={language === 'pt' ? 'Altura dos olhos' : 'Eye level'}>{t.eyes}</option>
              <option value={language === 'pt' ? 'Altura das mãos' : 'Hand level'}>{t.hands}</option>
              <option value={language === 'pt' ? 'Parte de Baixo' : 'Bottom shelf'}>{t.bottom}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => {
              setSelectedMainCategory("Todas");
              setSelectedSubCategory("Todas");
              setSelectedZone(null);
            }}
            variant="outline"
            size="sm"
          >
            {t.clearFilters}
          </Button>
        </div>
      </div>

      {/* Configuração da Área de Exposição */}
      <div className="bg-card p-6 rounded-md border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t.shelfVisualization}</h3>
          <Button onClick={() => setShowExposureModal(true)} variant="outline" size="sm">
            Configurar
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.shelfWidth}</label>
            <input
              type="number"
              value={gondolaWidth}
              onChange={(e) => setGondolaWidth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.shelfDepth}</label>
            <input
              type="number"
              value={shelfDepth}
              onChange={(e) => setShelfDepth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.shelfHeight}</label>
            <input
              type="number"
              value={shelfHeight}
              onChange={(e) => setShelfHeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.numberOfShelves}</label>
            <input
              type="number"
              value={numberOfShelves}
              onChange={(e) => setNumberOfShelves(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        {spacePercentage > 100 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm font-semibold">{t.spaceExceeded}</p>
          </div>
        )}
      </div>

      {/* Adicionar Produtos */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.addProduct}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {filteredCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => addProduct(category)}
              variant="outline"
              className="justify-start text-left h-auto py-2 px-3"
            >
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Produtos Adicionados */}
      {products.length > 0 && (
        <div className="bg-card p-6 rounded-md border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t.productsAdded} ({filteredProductsByZone.length})
            </h3>
            <Button
              onClick={() => setProducts([])}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t.resetComplete}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">{t.product}</th>
                  <th className="text-left py-2 px-2">{t.dimensions}</th>
                  <th className="text-left py-2 px-2">{t.quadrantes}</th>
                  <th className="text-left py-2 px-2">{t.zone}</th>
                  <th className="text-left py-2 px-2">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductsByZone.map((product) => {
                  const rec = getRecommendationByABCCurves(
                    product.category.curvaFaturamento,
                    product.category.curvaLucratividade
                  );
                  return (
                    <tr key={product.id} className="border-b border-border hover:bg-muted">
                      <td className="py-2 px-2 text-xs font-medium">{product.name}</td>
                      <td className="py-2 px-2 text-xs">
                        {product.largura}×{product.comprimento}cm
                      </td>
                      <td className="py-2 px-2 text-xs">{rec.quadrantes}</td>
                      <td className="py-2 px-2 text-xs">{product.zone}</td>
                      <td className="py-2 px-2">
                        <Button
                          onClick={() => removeProduct(product.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visualização da Gôndola - Vista de Frente */}
      {products.length > 0 && (
        <div className="bg-card p-6 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {language === 'pt' ? 'Visualização da Gôndola - Vista de Frente' : 'Shelf Visualization - Front View'}
          </h3>
          <GondolaFrontView
            products={products}
            totalWidth={gondolaWidth}
            shelfHeight={shelfHeight}
            language={language}
          />
        </div>
      )}

      {/* Visualização da Loja com IA */}
      <StoreVisualizationGenerator
        products={products}
        gondolaWidth={gondolaWidth}
        shelfHeight={shelfHeight}
        shelfDepth={shelfDepth}
        exposureType="gondola"
        selectedZone={selectedZone}
      />

      {/* Visualização 3D */}
      {products.length > 0 && (
        <div className="bg-card p-6 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t.view3D}</h3>
          <GondolaVisualization3D
            width={gondolaWidth}
            depth={shelfDepth}
            shelfHeight={shelfHeight}
            numberOfShelves={numberOfShelves}
            products={products.map(p => ({
              ...p,
              quadrantes: getRecommendationByABCCurves(p.category.curvaFaturamento, p.category.curvaLucratividade).quadrantes,
              zone: p.zone || 'Altura das maos'
            }))}
            language={language}
          />
        </div>
      )}

      {/* Financial Impact Dashboard */}
      {products.length > 0 && (
        <FinancialImpactDashboard
          products={products}
          gondolaWidth={gondolaWidth}
          shelfDepth={shelfDepth}
          shelfHeight={shelfHeight}
        />
      )}
    </div>
  );
}

// Export for PDF
function exportPlanogramToPDF(
  products: Product[],
  gondolaWidth: number,
  areaType: string,
  getRecommendation: any,
  colorMap: Record<string, string>,
  language: string
) {
  console.log("Exporting planogram...");
}
