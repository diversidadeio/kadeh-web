import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, MousePointer, ShoppingCart } from "lucide-react";

interface AdMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  revenue: number;
}

export default function AdsAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AdMetrics>({
    impressions: 12450,
    clicks: 847,
    conversions: 156,
    ctr: 6.8,
    conversionRate: 18.4,
    revenue: 3120,
  });

  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  // Simular atualização de dados baseado no período
  useEffect(() => {
    const multipliers = {
      today: 0.2,
      week: 1,
      month: 4.3,
    };

    const multiplier = multipliers[period];
    setMetrics({
      impressions: Math.round(12450 * multiplier),
      clicks: Math.round(847 * multiplier),
      conversions: Math.round(156 * multiplier),
      ctr: 6.8,
      conversionRate: 18.4,
      revenue: Math.round(3120 * multiplier),
    });
  }, [period]);

  const stats = [
    {
      label: "Impressões",
      value: metrics.impressions.toLocaleString(),
      icon: Eye,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Cliques",
      value: metrics.clicks.toLocaleString(),
      icon: MousePointer,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Conversões",
      value: metrics.conversions.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "CTR",
      value: `${metrics.ctr}%`,
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics em Tempo Real</h2>
        <div className="flex gap-2">
          {(["today", "week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p === "today" ? "Hoje" : p === "week" ? "Esta Semana" : "Este Mês"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
            <CardDescription>Percentual de cliques que resultaram em conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Conversão</span>
                  <span className="text-sm font-bold text-green-600">{metrics.conversionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${metrics.conversionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Estimada</CardTitle>
            <CardDescription>Baseado em conversões e valor médio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">R$</span>
                <span className="text-3xl font-bold">{metrics.revenue.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">
                Média de R$ {(metrics.revenue / Math.max(metrics.conversions, 1)).toFixed(2)} por conversão
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Performance</CardTitle>
          <CardDescription>Métricas detalhadas do período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Impressões</p>
                <p className="text-2xl font-bold">{metrics.impressions.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Cliques</p>
                <p className="text-2xl font-bold">{metrics.clicks.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">CTR</p>
                <p className="text-2xl font-bold">{metrics.ctr}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Conversões</p>
                <p className="text-2xl font-bold">{metrics.conversions.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
