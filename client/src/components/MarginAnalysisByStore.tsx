/**
 * MarginAnalysisByStore Component
 * Análise de margens por loja/grupo de lojas com relatórios on-time
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Store, TrendingUp, Filter, Download } from "lucide-react";

interface StoreData {
  id: string;
  name: string;
  group: string;
  region: string;
}

interface CategoryMargin {
  category: string;
  margin: number;
  revenue: number;
  products: number;
  trend: number;
}

interface StoreMarginData {
  storeId: string;
  storeName: string;
  margins: CategoryMargin[];
  avgMargin: number;
  totalRevenue: number;
}

const MOCK_STORES: StoreData[] = [
  { id: "loja-01", name: "Loja Centro", group: "Grupo A", region: "São Paulo" },
  { id: "loja-02", name: "Loja Zona Leste", group: "Grupo A", region: "São Paulo" },
  { id: "loja-03", name: "Loja Zona Oeste", group: "Grupo B", region: "São Paulo" },
  { id: "loja-04", name: "Loja Campinas", group: "Grupo B", region: "Interior" },
  { id: "loja-05", name: "Loja Ribeirão Preto", group: "Grupo C", region: "Interior" },
];

const MOCK_GROUPS = ["Todos", "Grupo A", "Grupo B", "Grupo C"];

function generateMarginData(storeId: string): CategoryMargin[] {
  const categories = ["Alimentos", "Bebidas", "Higiene", "Beleza", "Eletrônicos"];
  const baseMargins = [12, 18, 25, 35, 22];
  
  return categories.map((cat, idx) => ({
    category: cat,
    margin: baseMargins[idx] + Math.random() * 8 - 4,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    products: Math.floor(Math.random() * 500) + 100,
    trend: Math.random() * 10 - 5,
  }));
}

export default function MarginAnalysisByStore() {
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"comparison" | "detail">("comparison");

  const filteredStores = selectedGroup === "Todos" 
    ? MOCK_STORES 
    : MOCK_STORES.filter(s => s.group === selectedGroup);

  const storeMarginData: StoreMarginData[] = (selectedStores.length > 0 ? selectedStores : filteredStores.map(s => s.id))
    .map(storeId => {
      const store = MOCK_STORES.find(s => s.id === storeId);
      const margins = generateMarginData(storeId);
      const avgMargin = margins.reduce((sum, m) => sum + m.margin, 0) / margins.length;
      const totalRevenue = margins.reduce((sum, m) => sum + m.revenue, 0);
      
      return {
        storeId,
        storeName: store?.name || "Loja Desconhecida",
        margins,
        avgMargin: parseFloat(avgMargin.toFixed(2)),
        totalRevenue,
      };
    });

  const categoryAggregated = (() => {
    const categories = ["Alimentos", "Bebidas", "Higiene", "Beleza", "Eletrônicos"];
    return categories.map(cat => {
      const margins = storeMarginData.flatMap(s => s.margins.filter(m => m.category === cat));
      const avgMargin = margins.reduce((sum, m) => sum + m.margin, 0) / margins.length;
      const totalRevenue = margins.reduce((sum, m) => sum + m.revenue, 0);
      
      return {
        category: cat,
        avgMargin: parseFloat(avgMargin.toFixed(2)),
        totalRevenue,
        storeCount: storeMarginData.length,
      };
    });
  })();

  const comparisonChartData = storeMarginData.map(s => ({
    name: s.storeName.substring(0, 12),
    margin: s.avgMargin,
    revenue: s.totalRevenue / 1000,
  }));

  const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

  const toggleStoreSelection = (storeId: string) => {
    setSelectedStores(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros e Seleção
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Grupo de Lojas</label>
            <div className="flex flex-wrap gap-2">
              {MOCK_GROUPS.map(group => (
                <Button
                  key={group}
                  onClick={() => {
                    setSelectedGroup(group);
                    setSelectedStores([]);
                  }}
                  variant={selectedGroup === group ? "default" : "outline"}
                  className="text-sm"
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Lojas ({selectedStores.length > 0 ? selectedStores.length : "todas"} selecionadas)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredStores.map(store => (
                <button
                  key={store.id}
                  onClick={() => toggleStoreSelection(store.id)}
                  className={`p-3 rounded-md border-2 transition-colors text-left text-sm ${
                    selectedStores.includes(store.id)
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-xs">{store.region}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Modo de Visualização</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode("comparison")}
                variant={viewMode === "comparison" ? "default" : "outline"}
                className="text-sm"
              >
                Comparação
              </Button>
              <Button
                onClick={() => setViewMode("detail")}
                variant={viewMode === "detail" ? "default" : "outline"}
                className="text-sm"
              >
                Detalhado
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-md border border-border">
          <p className="text-xs text-muted-foreground mb-1">Lojas Analisadas</p>
          <p className="text-2xl font-bold text-foreground">{storeMarginData.length}</p>
        </div>
        <div className="bg-card p-4 rounded-md border border-border">
          <p className="text-xs text-muted-foreground mb-1">Margem Média</p>
          <p className="text-2xl font-bold text-green-600">
            {(storeMarginData.reduce((sum, s) => sum + s.avgMargin, 0) / storeMarginData.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-card p-4 rounded-md border border-border">
          <p className="text-xs text-muted-foreground mb-1">Receita Total</p>
          <p className="text-2xl font-bold text-blue-600">
            R$ {(storeMarginData.reduce((sum, s) => sum + s.totalRevenue, 0) / 1000).toFixed(0)}k
          </p>
        </div>
        <div className="bg-card p-4 rounded-md border border-border">
          <p className="text-xs text-muted-foreground mb-1">Categorias</p>
          <p className="text-2xl font-bold text-purple-600">5</p>
        </div>
      </div>

      {viewMode === "comparison" ? (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-md border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Margem Média por Loja
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
                <Bar dataKey="margin" fill="#0066FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card p-6 rounded-md border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Margem Média por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryAggregated}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
                <Bar dataKey="avgMargin" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card p-6 rounded-md border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição de Receita por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryAggregated}
                  dataKey="totalRevenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryAggregated.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % 5]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `R$ ${typeof value === 'number' ? (value / 1000).toFixed(0) : value}k`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {storeMarginData.map(store => (
            <div key={store.storeId} className="bg-card p-6 rounded-md border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    {store.storeName}
                  </h4>
                  <p className="text-sm text-muted-foreground">Margem Média: {store.avgMargin}% | Receita: R$ {(store.totalRevenue / 1000).toFixed(0)}k</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-semibold">Categoria</th>
                      <th className="text-left py-2 px-3 font-semibold">Margem</th>
                      <th className="text-left py-2 px-3 font-semibold">Receita</th>
                      <th className="text-left py-2 px-3 font-semibold">Produtos</th>
                      <th className="text-left py-2 px-3 font-semibold">Tendência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.margins.map((margin, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50">
                        <td className="py-2 px-3">{margin.category}</td>
                        <td className="py-2 px-3 font-medium">{margin.margin.toFixed(1)}%</td>
                        <td className="py-2 px-3">R$ {(margin.revenue / 1000).toFixed(1)}k</td>
                        <td className="py-2 px-3">{margin.products}</td>
                        <td className="py-2 px-3">
                          <span className={margin.trend > 0 ? "text-green-600" : "text-red-600"}>
                            {margin.trend > 0 ? "+" : ""}{margin.trend.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Relatório (PDF/Excel)
        </Button>
      </div>
    </div>
  );
}
