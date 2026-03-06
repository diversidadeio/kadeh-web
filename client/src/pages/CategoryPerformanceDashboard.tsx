/**
 * Category Performance Dashboard
 * Análise de métricas de performance de categorias com gráficos e comparações
 */

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Zap, AlertCircle, Target, Plus } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function CategoryPerformanceDashboard() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [metricsForm, setMetricsForm] = useState({
    salesVolume: "",
    turnoverRate: "",
    profitMargin: "",
    stockoutRate: "",
  });

  const t = {
    pt: {
      title: "Dashboard de Performance de Categorias",
      description: "Análise detalhada de métricas e performance das suas categorias",
      totalCategories: "Total de Categorias",
      totalSales: "Vendas Totais",
      avgTurnover: "Giro Médio",
      avgMargin: "Margem Média",
      avgStockout: "Ruptura Média",
      byType: "Distribuição por Tipo",
      byRevenueCurve: "Distribuição por Curva de Faturamento",
      byProfitCurve: "Distribuição por Curva de Lucratividade",
      topCategories: "Top Categorias por Vendas",
      categoryName: "Categoria",
      sales: "Vendas",
      turnover: "Giro",
      margin: "Margem",
      stockout: "Ruptura",
      loading: "Carregando...",
      noData: "Nenhum dado disponível",
      food: "Alimentar",
      nonFood: "Não-Alimentar",
      highPerformance: "Alto Desempenho",
      mediumPerformance: "Desempenho Médio",
      lowPerformance: "Baixo Desempenho",
      highStockout: "Ruptura Alta",
      addMetrics: "Adicionar Métricas",
      updateMetrics: "Atualizar Métricas",
      selectCategory: "Selecione uma categoria",
      salesVolume: "Volume de Vendas (R$)",
      turnoverRate: "Taxa de Giro (%)",
      profitMargin: "Margem de Lucro (%)",
      stockoutRate: "Taxa de Ruptura (%)",
      save: "Salvar",
      cancel: "Cancelar",
      success: "Métricas atualizadas com sucesso",
      error: "Erro ao atualizar métricas",
      noCategories: "Nenhuma categoria cadastrada",
      createFirst: "Crie categorias primeiro no Admin de Categorias",
    },
    en: {
      title: "Category Performance Dashboard",
      description: "Detailed analysis of metrics and performance of your categories",
      totalCategories: "Total Categories",
      totalSales: "Total Sales",
      avgTurnover: "Average Turnover",
      avgMargin: "Average Margin",
      avgStockout: "Average Stockout",
      byType: "Distribution by Type",
      byRevenueCurve: "Distribution by Revenue Curve",
      byProfitCurve: "Distribution by Profitability Curve",
      topCategories: "Top Categories by Sales",
      categoryName: "Category",
      sales: "Sales",
      turnover: "Turnover",
      margin: "Margin",
      stockout: "Stockout",
      loading: "Loading...",
      noData: "No data available",
      food: "Food",
      nonFood: "Non-Food",
      highPerformance: "High Performance",
      mediumPerformance: "Medium Performance",
      lowPerformance: "Low Performance",
      highStockout: "High Stockout",
      addMetrics: "Add Metrics",
      updateMetrics: "Update Metrics",
      selectCategory: "Select a category",
      salesVolume: "Sales Volume (R$)",
      turnoverRate: "Turnover Rate (%)",
      profitMargin: "Profit Margin (%)",
      stockoutRate: "Stockout Rate (%)",
      save: "Save",
      cancel: "Cancel",
      success: "Metrics updated successfully",
      error: "Error updating metrics",
      noCategories: "No categories registered",
      createFirst: "Create categories first in Admin Categories",
    },
  };

  const texts = t[language as keyof typeof t];

  const { data: analytics, isLoading, refetch } = trpc.categories.getAnalytics.useQuery();
  const { data: categories } = trpc.categories.list.useQuery({});
  const updateMetricsMutation = trpc.categories.updateMetrics.useMutation();

  const handleOpenDialog = (categoryId: number) => {
    setSelectedCategory(categoryId);
    const category = categories?.find(c => c.id === categoryId);
    if (category) {
      setMetricsForm({
        salesVolume: String(category.salesVolume || ""),
        turnoverRate: String(category.turnoverRate || ""),
        profitMargin: String(category.profitMargin || ""),
        stockoutRate: String(category.stockoutRate || ""),
      });
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setMetricsForm({
      salesVolume: "",
      turnoverRate: "",
      profitMargin: "",
      stockoutRate: "",
    });
  };

  const handleSubmitMetrics = async () => {
    if (!selectedCategory) return;

    try {
      await updateMetricsMutation.mutateAsync({
        categoryId: selectedCategory,
        salesVolume: parseFloat(metricsForm.salesVolume) || 0,
        turnoverRate: parseFloat(metricsForm.turnoverRate) || 0,
        profitMargin: parseFloat(metricsForm.profitMargin) || 0,
        stockoutRate: parseFloat(metricsForm.stockoutRate) || 0,
      });
      toast.success(texts.success);
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error(texts.error);
    }
  };

  const mainCategoryData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: texts.food, value: analytics.byMainCategory.alimentar },
      { name: texts.nonFood, value: analytics.byMainCategory.naoAlimentar },
    ].filter(item => item.value > 0);
  }, [analytics, texts.food, texts.nonFood]);

  const revenueCurveData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: "A", value: analytics.byCurvaFaturamento.A },
      { name: "B", value: analytics.byCurvaFaturamento.B },
      { name: "C", value: analytics.byCurvaFaturamento.C },
    ].filter(item => item.value > 0);
  }, [analytics]);

  const profitCurveData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: "A", value: analytics.byCurvaLucratividade.A },
      { name: "B", value: analytics.byCurvaLucratividade.B },
      { name: "C", value: analytics.byCurvaLucratividade.C },
    ].filter(item => item.value > 0);
  }, [analytics]);

  const topCategories = useMemo(() => {
    if (!analytics) return [];
    return analytics.categories
      .sort((a, b) => b.salesVolume - a.salesVolume)
      .slice(0, 10)
      .map(cat => ({
        name: cat.name,
        sales: cat.salesVolume,
        turnover: cat.turnoverRate,
        margin: cat.profitMargin,
        stockout: cat.stockoutRate,
      }));
  }, [analytics]);

  const performanceMetrics = useMemo(() => {
    if (!analytics) return null;

    const highPerformance = analytics.categories.filter(
      c => c.profitMargin > 20 && c.turnoverRate > 50
    ).length;
    const mediumPerformance = analytics.categories.filter(
      c => (c.profitMargin > 10 || c.turnoverRate > 30) && !(c.profitMargin > 20 && c.turnoverRate > 50)
    ).length;
    const lowPerformance = analytics.categories.filter(
      c => c.profitMargin <= 10 && c.turnoverRate <= 30
    ).length;
    const highStockout = analytics.categories.filter(
      c => c.stockoutRate > 10
    ).length;

    return {
      highPerformance,
      mediumPerformance,
      lowPerformance,
      highStockout,
    };
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-slate-500">{texts.loading}</div>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalCategories === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{texts.title}</h1>
          <p className="text-slate-600 mb-8">{texts.description}</p>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-500 mb-4">{texts.noCategories}</p>
                <p className="text-slate-400 text-sm">{texts.createFirst}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{texts.title}</h1>
            <p className="text-slate-600">{texts.description}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {texts.addMetrics}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{texts.updateMetrics}</DialogTitle>
                <DialogDescription>
                  {texts.selectCategory}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{texts.categoryName}</label>
                  <Select
                    value={selectedCategory?.toString() || ""}
                    onValueChange={(value) => setSelectedCategory(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.salesVolume}</label>
                  <Input
                    type="number"
                    value={metricsForm.salesVolume}
                    onChange={(e) =>
                      setMetricsForm({ ...metricsForm, salesVolume: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.turnoverRate}</label>
                  <Input
                    type="number"
                    value={metricsForm.turnoverRate}
                    onChange={(e) =>
                      setMetricsForm({ ...metricsForm, turnoverRate: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.profitMargin}</label>
                  <Input
                    type="number"
                    value={metricsForm.profitMargin}
                    onChange={(e) =>
                      setMetricsForm({ ...metricsForm, profitMargin: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.stockoutRate}</label>
                  <Input
                    type="number"
                    value={metricsForm.stockoutRate}
                    onChange={(e) =>
                      setMetricsForm({ ...metricsForm, stockoutRate: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  {texts.cancel}
                </Button>
                <Button onClick={handleSubmitMetrics} disabled={updateMetricsMutation.isPending}>
                  {texts.save}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{texts.totalCategories}</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.totalCategories}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{texts.totalSales}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    R$ {(analytics.totalSalesVolume / 1000).toFixed(1)}k
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{texts.avgTurnover}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analytics.averageTurnover.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{texts.avgMargin}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analytics.averageMargin.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{texts.avgStockout}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analytics.averageStockout.toFixed(1)}%
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Distribution by Type */}
          <Card>
            <CardHeader>
              <CardTitle>{texts.byType}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mainCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mainCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribution by Revenue Curve */}
          <Card>
            <CardHeader>
              <CardTitle>{texts.byRevenueCurve}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueCurveData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueCurveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribution by Profit Curve */}
          <Card>
            <CardHeader>
              <CardTitle>{texts.byProfitCurve}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profitCurveData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {profitCurveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories Chart */}
        {topCategories.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{texts.topCategories}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" name={texts.sales} />
                  <Bar dataKey="turnover" fill="#10b981" name={texts.turnover} />
                  <Bar dataKey="margin" fill="#f59e0b" name={texts.margin} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Performance Analysis */}
        {performanceMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{texts.highPerformance}</p>
                    <p className="text-3xl font-bold text-green-600">
                      {performanceMetrics.highPerformance}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{texts.mediumPerformance}</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {performanceMetrics.mediumPerformance}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{texts.lowPerformance}</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {performanceMetrics.lowPerformance}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{texts.highStockout}</p>
                    <p className="text-3xl font-bold text-red-600">
                      {performanceMetrics.highStockout}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
