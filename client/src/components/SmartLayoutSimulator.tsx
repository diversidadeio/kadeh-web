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
import Shelf3DVisualization from "@/components/Shelf3DVisualization";
import SimulationHistory, { type Simulation } from "@/components/SimulationHistory";
import { generateRecommendation, getRecommendationExplanation } from "@/data/recommendationEngine";
import GondolaVisualization from "@/components/GondolaVisualization";
import ShelfZoneFilter from "@/components/ShelfZoneFilter";
import ExposureAreaModal from "@/components/ExposureAreaModal";
import { exportPlanogramToPDF } from "@/components/PlanogramPDFExporter";
import { ConfiguracaoAreaExposicao, type MedidasAreaExposicao, type TipoAreaExposicao } from "@/components/ConfiguracaoAreaExposicao";
import StoreVisualizationGenerator from "@/components/StoreVisualizationGenerator";

type CategoryType = "Alimentar" | "Não-Alimentar";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
  largura?: number;
  comprimento?: number;
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
    quadrants: "Quadrantes",
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
    bottom: "Parte de Baixo",
    allZones: "Todas as Zonas",
    configureExposureArea: "Configurar Area de Exposicao",
    selectExposureType: "Selecione o tipo de area de exposicao para gerar o planograma",
    exposureType: "Tipo de Area de Exposicao",
    gondola: "Gondola",
    terminalGondola: "Terminal de Gondola",
    freezerVertical: "Freezer Vertical",
    freezerHorizontal: "Freezer Horizontal",
    bancaFrutas: "Banca de Frutas/Legumes/Verduras",
    width: "Largura",
    depth: "Profundidade",
    shelfHeightBetween: "Altura entre Prateleiras",
    length: "Comprimento",
    widthHorizontal: "Largura",
    depthHorizontal: "Profundidade",
    cm: "cm",
    cancel: "Cancelar",
    confirm: "Confirmar",
    validationError: "Por favor, preencha todos os campos com valores validos (maiores que 0)",
    requiredField: "Campo obrigatorio",
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
    resetComplete: "Full Reset",
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
    quadrants: "Quadrants",
    zone: "Zone",
    action: "Action",
    shelfVisualization: "Shelf Visualization",
    totalSpace: "Total space",
    usedSpace: "Used space",
    spaceExceeded: "Space exceeded! Reduce products or increase shelf width.",
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
    dataSourcesDescription: "The relevance base and category roles were extracted and validated according to market reports from 2024-2026:",
    abras: "ABRAS (Brazilian Supermarket Association): Revenue rankings by section and consumption baskets.",
    nielseniq: "NielsenIQ: Retail Trends reports on the behavior of Food and HPC categories.",
    kantar: "Kantar Worldpanel: Data on Consumer Decision Tree and category penetration in Brazilian households.",
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
    eyes: "Eye Level",
    hands: "Hand Level",
    bottom: "Bottom Shelf",
    allZones: "All Zones",
    configureExposureArea: "Configure Exposure Area",
    selectExposureType: "Select the type of exposure area to generate the planogram",
    exposureType: "Exposure Area Type",
    gondola: "Shelf",
    terminalGondola: "Shelf Terminal",
    freezerVertical: "Vertical Freezer",
    freezerHorizontal: "Horizontal Freezer",
    bancaFrutas: "Fruit/Vegetable Stand",
    width: "Width",
    depth: "Depth",
    shelfHeightBetween: "Shelf Height",
    length: "Length",
    widthHorizontal: "Width",
    depthHorizontal: "Depth",
    cm: "cm",
    cancel: "Cancel",
    confirm: "Confirm",
    validationError: "Please fill in all fields with valid values (greater than 0)",
    requiredField: "Required field",
  },
};

export default function SmartLayoutSimulator() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [products, setProducts] = useState<Product[]>([]);
  const [gondolaWidth, setGondolaWidth] = useState(280);
  const [shelves, setShelves] = useState(5);
  const [shelfDepth, setShelfDepth] = useState(40);
  const [shelfHeight, setShelfHeight] = useState(60);
  const [selectedMainCategory, setSelectedMainCategory] = useState<CategoryType | "Todas">("Todas");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Todas");
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [simulationName, setSimulationName] = useState("");
  const [recommendation, setRecommendation] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfiguracao, setShowConfiguracao] = useState(false);
  const [medidasAreaExposicao, setMedidasAreaExposicao] = useState<MedidasAreaExposicao>({
    tipo: 'gondola',
    largura: 280,
    profundidade: 40,
    alturaEntrePrateleiras: 60,
  });

  // Get available subcategories based on selected main category
  const availableSubCategories = useMemo(() => {
    if (selectedMainCategory === "Todas") {
      return Array.from(new Set(CATEGORIES_DATABASE.map((c) => c.name))).sort();
    }
    return CATEGORIES_DATABASE.filter((c) => c.mainCategory === selectedMainCategory)
      .map((c) => c.name)
      .sort();
  }, [selectedMainCategory]);

  // Filter categories based on selections
  const filteredCategories = useMemo(() => {
    return CATEGORIES_DATABASE.filter((cat) => {
      if (selectedMainCategory !== "Todas" && cat.mainCategory !== selectedMainCategory) return false;
      if (selectedSubCategory !== "Todas" && cat.name !== selectedSubCategory) return false;
      return true;
    });
  }, [selectedMainCategory, selectedSubCategory]);

  const resetSimulator = () => {
    setProducts([]);
    setGondolaWidth(280);
    setShelves(5);
    setShelfDepth(40);
    setShelfHeight(60);
    setSelectedMainCategory("Todas");
    setSelectedSubCategory("Todas");
    setSelectedZone(null);
  };

  const filteredProductsByZone = useMemo(() => {
    if (!selectedZone) return products;
    return products.filter((product) => {
      const rec = getRecommendationByABCCurves(
        product.category.curvaFaturamento,
        product.category.curvaLucratividade
      );
      return rec.zone === selectedZone;
    });
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
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: category.name,
      categoryId: category.id,
      category,
      largura: category.defaultLargura,
      comprimento: category.defaultComprimento,
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
            >
              <option value="Todas">{t.allSubCategories}</option>
              {availableSubCategories.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSelectedMainCategory("Todas");
                setSelectedSubCategory("Todas");
              }}
              variant="outline"
              className="w-full"
            >
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
          <p className="text-xs text-muted-foreground mt-1">
            {shelves} {language === "pt" ? "prateleiras" : "shelves"}
          </p>
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

      {/* Product Descriptor */}
      <ProductDescriptor onAddProduct={(product) => {
        const matchingCategory = CATEGORIES_DATABASE.find(c => c.name === product.name);
        const newProduct: Product = {
          id: `desc_${Date.now()}`,
          name: product.name,
          categoryId: matchingCategory?.id || product.category,
          category: matchingCategory || ({
            id: product.category,
            name: product.name,
            type: product.category === "Alimentar" ? "Alimentar" : "Não-Alimentar",
            mainCategory: product.category === "Alimentar" ? "Alimentar" : "Não-Alimentar",
            papelEstrategico: product.velocity === "Alto" ? "Destaque" : "Complementar",
            curvaFaturamento: product.velocity === "Alto" ? "A" : product.velocity === "Médio" ? "B" : "C",
            curvaLucratividade: product.margin === "Alta" ? "A" : product.margin === "Média" ? "B" : "C",
            defaultLargura: 10,
            defaultComprimento: 5,
            defaultGiro: product.velocity,
            defaultMargem: product.margin,
          } as unknown as Category),
          largura: 10,
          comprimento: 5,
          promotionalPoints: [],
        };
        setProducts([...products, newProduct]);
      }} language={language} />

      {/* Categorias Disponíveis */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.loadProductPresets}</h3>
        {filteredCategories && filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
            {filteredCategories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => addProduct(cat)}
                variant="outline"
                size="sm"
                className="text-xs truncate hover:bg-accent"
                title={cat.name}
              >
                <Plus className="w-3 h-3 mr-1" />
                {cat.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma categoria encontrada. Verifique os filtros.</p>
            <Button
              onClick={() => {
                setSelectedMainCategory("Todas");
                setSelectedSubCategory("Todas");
              }}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              {t.clearFilters}
            </Button>
          </div>
        )}
      </div>

      {/* Produtos Adicionados */}
      {products.length > 0 && (
        <div className="bg-card p-6 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {t.productsAdded} ({filteredProductsByZone.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">{t.product}</th>
                  <th className="text-left py-2 px-2">{t.dimensions}</th>
                  <th className="text-left py-2 px-2">{t.velocity}</th>
                  <th className="text-left py-2 px-2">{t.margin}</th>
                  <th className="text-left py-2 px-2">{t.naturalPoint}</th>
                  <th className="text-left py-2 px-2">{t.quadrants}</th>
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
                  const capacity = calculateNaturalPointCapacity(product);
                  return (
                    <tr key={product.id} className="border-b border-border hover:bg-muted">
                      <td className="py-2 px-2">{product.name}</td>
                      <td className="py-2 px-2">
                        {product.largura}cm × {product.comprimento}cm
                      </td>
                      <td className="py-2 px-2">{product.category.curvaFaturamento}</td>
                      <td className="py-2 px-2">{product.category.curvaLucratividade}</td>
                      <td className="py-2 px-2">{capacity} unid.</td>
                      <td className="py-2 px-2">{rec.quadrantes}</td>
                      <td className="py-2 px-2 text-xs">{rec.zone}</td>
                      <td className="py-2 px-2">
                        <Button
                          onClick={() => removeProduct(product.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Filtro de Zona de Prateleira */}
      {products.length > 0 && (
        <ShelfZoneFilter selectedZone={selectedZone} onZoneChange={setSelectedZone} />
      )}

      {/* Botao de Configuracao de Area de Exposicao */}
      {products.length > 0 && (
        <div className="flex gap-2">
          <Button
            onClick={() => setShowConfiguracao(true)}
            variant="outline"
            className="flex items-center gap-2 flex-1"
          >
            {t.configureExposureArea}
          </Button>
          <Button
            onClick={() => setShowExportModal(true)}
            variant="default"
            className="flex items-center gap-2 flex-1"
          >
            <Download className="w-4 h-4" />
            {t.exportPlanogram}
          </Button>
        </div>
      )}

      {/* Modal de Selecao de Area de Exposicao */}
      <ExposureAreaModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportPDF}
      />

      {/* Modal de Configuracao de Area de Exposicao */}
      <ConfiguracaoAreaExposicao
        isOpen={showConfiguracao}
        onClose={() => setShowConfiguracao(false)}
        onConfirm={(medidas) => {
          setMedidasAreaExposicao(medidas);
          if (medidas.tipo === 'gondola' || medidas.tipo === 'terminal_gondola' || medidas.tipo === 'freezer_vertical') {
            setGondolaWidth(medidas.largura || 280);
            setShelfDepth(medidas.profundidade || 40);
            setShelfHeight(medidas.alturaEntrePrateleiras || 60);
          } else if (medidas.tipo === 'freezer_horizontal' || medidas.tipo === 'banca_frutas') {
            setGondolaWidth(medidas.comprimento || 300);
            setShelfDepth(medidas.profundidadeHorizontal || 80);
          }
        }}
        translations={{
          titulo: t.configureExposureArea,
          descricao: t.selectExposureType,
          tipoExposicao: t.exposureType,
          gondola: t.gondola,
          terminalGondola: t.terminalGondola,
          freezerVertical: t.freezerVertical,
          freezerHorizontal: t.freezerHorizontal,
          bancaFrutas: t.bancaFrutas,
          largura: t.width,
          profundidade: t.depth,
          alturaEntrePrateleiras: t.shelfHeightBetween,
          comprimento: t.length,
          larguraHorizontal: t.widthHorizontal,
          profundidadeHorizontal: t.depthHorizontal,
          cm: t.cm,
          cancelar: t.cancel,
          confirmar: t.confirm,
          erroValidacao: t.validationError,
          campoObrigatorio: t.requiredField,
        }}
      />

      {/* Visualização da Gôndola */}
      {products.length > 0 && (
        <GondolaVisualization
          products={filteredProductsByZone}
          gondolaWidth={gondolaWidth}
          getRecommendation={getRecommendationByABCCurves}
          colorMap={colorMap}
        />
      )}

      {/* Visualização da Loja com IA */}
      <StoreVisualizationGenerator
        products={products}
        gondolaWidth={gondolaWidth}
        shelfHeight={shelfHeight}
        shelfDepth={shelfDepth}
        exposureType={medidasAreaExposicao.tipo}
        selectedZone={selectedZone}
      />

      {/* Data Sources */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.dataSources}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t.dataSourcesDescription}</p>
        <ul className="space-y-3">
          <li className="text-sm text-foreground">
            <a href="https://www.abras.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t.abras}
            </a>
          </li>
          <li className="text-sm text-foreground">
            <a href="https://nielseniq.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t.nielseniq}
            </a>
          </li>
          <li className="text-sm text-foreground">
            <a href="https://www.kantarworldpanel.com/br" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t.kantar}
            </a>
          </li>
          <li className="text-sm text-foreground">
            <a href="https://www.savarejo.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t.savarejoe}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
