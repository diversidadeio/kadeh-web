import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, BarChart3, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SalesCategoryData {
  categoryName: string;
  mainCategory: 'Alimentar' | 'Não-Alimentar';
  totalUnitsPerPeriod: number;
  totalRevenuePerPeriod: number;
  totalCostPerPeriod: number;
  periodDays: number;
  products: SalesProductData[];
}

interface SalesProductData {
  productName: string;
  productEAN?: string;
  unitsPerPeriod: number;
  revenuePerPeriod: number;
  costPerUnit: number;
}

interface CalculatedMetrics {
  averageMarginPercentage: number;
  averageTurnover: number;
  lowMarginThreshold: number;
  highMarginThreshold: number;
  lowTurnoverThreshold: number;
  highTurnoverThreshold: number;
}

export default function PreCadastro() {
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'analysis'>('categories');
  const [salesCategories, setSalesCategories] = useState<SalesCategoryData[]>([]);
  const [currentCategory, setCurrentCategory] = useState<SalesCategoryData>({
    categoryName: '',
    mainCategory: 'Alimentar',
    totalUnitsPerPeriod: 0,
    totalRevenuePerPeriod: 0,
    totalCostPerPeriod: 0,
    periodDays: 30,
    products: [],
  });
  const [currentProduct, setCurrentProduct] = useState<SalesProductData>({
    productName: '',
    unitsPerPeriod: 0,
    revenuePerPeriod: 0,
    costPerUnit: 0,
  });

  // Adicionar novo produto à categoria
  const handleAddProduct = () => {
    if (!currentProduct.productName) {
      toast.error('Por favor, preencha o nome do produto');
      return;
    }

    if (currentProduct.unitsPerPeriod <= 0 || currentProduct.revenuePerPeriod <= 0 || currentProduct.costPerUnit <= 0) {
      toast.error('Por favor, preencha todos os valores numéricos com números positivos');
      return;
    }

    const newProduct: SalesProductData = {
      ...currentProduct,
      revenuePerPeriod: currentProduct.unitsPerPeriod * (currentProduct.revenuePerPeriod / currentProduct.unitsPerPeriod),
    };

    setCurrentCategory({
      ...currentCategory,
      products: [...currentCategory.products, newProduct],
    });

    setCurrentProduct({
      productName: '',
      unitsPerPeriod: 0,
      revenuePerPeriod: 0,
      costPerUnit: 0,
    });

    toast.success('Produto adicionado com sucesso');
  };

  // Remover produto da categoria
  const handleRemoveProduct = (index: number) => {
    setCurrentCategory({
      ...currentCategory,
      products: currentCategory.products.filter((_, i) => i !== index),
    });
    toast.success('Produto removido');
  };

  // Adicionar categoria
  const handleAddCategory = () => {
    if (!currentCategory.categoryName) {
      toast.error('Por favor, preencha o nome da categoria');
      return;
    }

    if (currentCategory.products.length === 0) {
      toast.error('Por favor, adicione pelo menos um produto à categoria');
      return;
    }

    // Calcular totais agregados
    const totalUnits = currentCategory.products.reduce((sum, p) => sum + p.unitsPerPeriod, 0);
    const totalRevenue = currentCategory.products.reduce((sum, p) => sum + p.revenuePerPeriod, 0);
    const totalCost = currentCategory.products.reduce((sum, p) => sum + (p.costPerUnit * p.unitsPerPeriod), 0);

    const newCategory: SalesCategoryData = {
      ...currentCategory,
      totalUnitsPerPeriod: totalUnits,
      totalRevenuePerPeriod: totalRevenue,
      totalCostPerPeriod: totalCost,
    };

    setSalesCategories([...salesCategories, newCategory]);
    setCurrentCategory({
      categoryName: '',
      mainCategory: 'Alimentar',
      totalUnitsPerPeriod: 0,
      totalRevenuePerPeriod: 0,
      totalCostPerPeriod: 0,
      periodDays: 30,
      products: [],
    });

    toast.success('Categoria adicionada com sucesso');
  };

  // Remover categoria
  const handleRemoveCategory = (index: number) => {
    setSalesCategories(salesCategories.filter((_, i) => i !== index));
    toast.success('Categoria removida');
  };

  // Calcular métricas de uma categoria
  const calculateMetrics = (category: SalesCategoryData): CalculatedMetrics => {
    const totalMargin = category.totalRevenuePerPeriod - category.totalCostPerPeriod;
    const averageMarginPercentage = (totalMargin / category.totalRevenuePerPeriod) * 100;
    const averageTurnover = category.totalUnitsPerPeriod / category.periodDays;

    return {
      averageMarginPercentage,
      averageTurnover,
      lowMarginThreshold: averageMarginPercentage * 0.8,
      highMarginThreshold: averageMarginPercentage * 1.2,
      lowTurnoverThreshold: averageTurnover * 0.8,
      highTurnoverThreshold: averageTurnover * 1.2,
    };
  };

  // Classificar produto baseado em margem e giro
  const classifyProduct = (product: SalesProductData, metrics: CalculatedMetrics) => {
    const productMarginPercentage = ((product.revenuePerPeriod - (product.costPerUnit * product.unitsPerPeriod)) / product.revenuePerPeriod) * 100;
    const productTurnover = product.unitsPerPeriod / 30;

    let marginClass = 'Média';
    if (productMarginPercentage < metrics.lowMarginThreshold) marginClass = 'Baixa';
    if (productMarginPercentage > metrics.highMarginThreshold) marginClass = 'Alta';

    let turnoverClass = 'Médio';
    if (productTurnover < metrics.lowTurnoverThreshold) turnoverClass = 'Baixo';
    if (productTurnover > metrics.highTurnoverThreshold) turnoverClass = 'Alto';

    return { marginClass, turnoverClass };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pré Cadastro - Levantamento de Dados</h1>
        <p className="text-gray-600">
          Levante os dados de vendas da sua loja para calcular margem e giro médios por categoria.
          Isso ajudará o sistema a classificar seus produtos e posicioná-los corretamente nas prateleiras.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'categories' | 'products' | 'analysis')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
        </TabsList>

        {/* Tab: Categorias */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Adicionar Nova Categoria</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="categoryName">Nome da Categoria</Label>
                <Input
                  id="categoryName"
                  placeholder="Ex: Cervejas"
                  value={currentCategory.categoryName}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, categoryName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="mainCategory">Categoria Principal</Label>
                <Select value={currentCategory.mainCategory} onValueChange={(value) => setCurrentCategory({ ...currentCategory, mainCategory: value as 'Alimentar' | 'Não-Alimentar' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimentar">Alimentar</SelectItem>
                    <SelectItem value="Não-Alimentar">Não-Alimentar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="periodDays">Período (dias)</Label>
                <Input
                  id="periodDays"
                  type="number"
                  min="1"
                  value={currentCategory.periodDays}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, periodDays: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>

            <Button onClick={handleAddCategory} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Categoria
            </Button>
          </Card>

          {/* Lista de Categorias */}
          <div className="space-y-4">
            {salesCategories.map((category, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{category.categoryName}</h3>
                    <p className="text-sm text-gray-600">{category.mainCategory}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveCategory(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Total Unidades:</span>
                    <p className="font-semibold">{category.totalUnitsPerPeriod}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Faturamento:</span>
                    <p className="font-semibold">R$ {category.totalRevenuePerPeriod.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Custo Total:</span>
                    <p className="font-semibold">R$ {category.totalCostPerPeriod.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Produtos:</span>
                    <p className="font-semibold">{category.products.length}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Produtos */}
        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Adicionar Produto à Categoria</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  placeholder="Ex: Cerveja Brahma 600ml"
                  value={currentProduct.productName}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="productEAN">EAN (opcional)</Label>
                <Input
                  id="productEAN"
                  placeholder="Ex: 7891008100012"
                  value={currentProduct.productEAN || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, productEAN: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="unitsPerPeriod">Unidades Vendidas (período)</Label>
                <Input
                  id="unitsPerPeriod"
                  type="number"
                  min="0"
                  value={currentProduct.unitsPerPeriod}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, unitsPerPeriod: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="revenuePerPeriod">Faturamento (período)</Label>
                <Input
                  id="revenuePerPeriod"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentProduct.revenuePerPeriod}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, revenuePerPeriod: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="costPerUnit">Custo Unitário</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentProduct.costPerUnit}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, costPerUnit: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <Button onClick={handleAddProduct} className="w-full mb-6">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </Card>

          {/* Lista de Produtos da Categoria Atual */}
          {currentCategory.products.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Produtos Adicionados ({currentCategory.products.length})</h3>
              <div className="space-y-2">
                {currentCategory.products.map((product, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{product.productName}</p>
                      <p className="text-sm text-gray-600">
                        {product.unitsPerPeriod} un. • R$ {product.revenuePerPeriod.toFixed(2)} • Custo: R$ {product.costPerUnit.toFixed(2)}/un.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveProduct(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Análise */}
        <TabsContent value="analysis" className="space-y-6">
          {salesCategories.length === 0 ? (
            <Card className="p-6 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Adicione categorias e produtos para ver a análise</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {salesCategories.map((category, idx) => {
                const metrics = calculateMetrics(category);
                const totalMargin = category.totalRevenuePerPeriod - category.totalCostPerPeriod;

                return (
                  <Card key={idx} className="p-6">
                    <h3 className="font-bold text-lg mb-4">{category.categoryName}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Margem Média</p>
                        <p className="text-2xl font-bold text-blue-600">{metrics.averageMarginPercentage.toFixed(2)}%</p>
                        <p className="text-xs text-gray-600 mt-2">
                          Baixa: &lt; {metrics.lowMarginThreshold.toFixed(2)}% | Alta: &gt; {metrics.highMarginThreshold.toFixed(2)}%
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Giro Médio (un/dia)</p>
                        <p className="text-2xl font-bold text-green-600">{metrics.averageTurnover.toFixed(2)}</p>
                        <p className="text-xs text-gray-600 mt-2">
                          Baixo: &lt; {metrics.lowTurnoverThreshold.toFixed(2)} | Alto: &gt; {metrics.highTurnoverThreshold.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Faturamento Total</p>
                        <p className="text-2xl font-bold text-purple-600">R$ {category.totalRevenuePerPeriod.toFixed(2)}</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Margem Total</p>
                        <p className="text-2xl font-bold text-orange-600">R$ {totalMargin.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Classificação de Produtos
                      </h4>
                      <div className="space-y-2">
                        {category.products.map((product, pIdx) => {
                          const classification = classifyProduct(product, metrics);
                          const productMargin = ((product.revenuePerPeriod - (product.costPerUnit * product.unitsPerPeriod)) / product.revenuePerPeriod) * 100;
                          const productTurnover = product.unitsPerPeriod / 30;

                          return (
                            <div key={pIdx} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                              <div>
                                <p className="font-semibold">{product.productName}</p>
                                <p className="text-xs text-gray-600">
                                  Margem: {productMargin.toFixed(2)}% ({classification.marginClass}) • Giro: {productTurnover.toFixed(2)} un/dia ({classification.turnoverClass})
                                </p>
                              </div>
                              <div className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {classification.marginClass}-{classification.turnoverClass}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
