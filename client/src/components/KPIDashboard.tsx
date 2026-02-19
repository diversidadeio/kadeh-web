/**
 * KPI Dashboard Component
 * Displays key performance indicators and analytics for Smart Layout
 */

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from "lucide-react";

export interface KPIData {
  date: Date;
  totalMargin: number;
  totalRevenue: number;
  spaceEfficiency: number;
  productCount: number;
  averageMargin: number;
  simulationsCount: number;
}

interface KPIDashboardProps {
  data: KPIData[];
}

const TRANSLATIONS = {
  pt: {
    title: "Dashboard de KPIs",
    marginTrend: "Tendência de Margem",
    revenueTrend: "Tendência de Faturamento",
    efficiencyTrend: "Eficiência de Espaço",
    productTrend: "Quantidade de Produtos",
    anomalies: "Anomalias Detectadas",
    noAnomalies: "Nenhuma anomalia detectada",
    anomalyAlert: "Alerta de Anomalia",
    efficiency: "Eficiência",
    margin: "Margem",
    revenue: "Faturamento",
    products: "Produtos",
    date: "Data",
    value: "Valor",
    average: "Média",
    trend: "Tendência",
    statistics: "Estatísticas",
    totalMargin: "Margem Total",
    totalRevenue: "Faturamento Total",
    avgMargin: "Margem Média",
    spaceEff: "Eficiência de Espaço",
    currency: "R$",
    percent: "%",
  },
  en: {
    title: "KPI Dashboard",
    marginTrend: "Margin Trend",
    revenueTrend: "Revenue Trend",
    efficiencyTrend: "Space Efficiency",
    productTrend: "Product Quantity",
    anomalies: "Detected Anomalies",
    noAnomalies: "No anomalies detected",
    anomalyAlert: "Anomaly Alert",
    efficiency: "Efficiency",
    margin: "Margin",
    revenue: "Revenue",
    products: "Products",
    date: "Date",
    value: "Value",
    average: "Average",
    trend: "Trend",
    statistics: "Statistics",
    totalMargin: "Total Margin",
    totalRevenue: "Total Revenue",
    avgMargin: "Average Margin",
    spaceEff: "Space Efficiency",
    currency: "R$",
    percent: "%",
  },
};

export default function KPIDashboard({ data }: KPIDashboardProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const chartData = useMemo(() => {
    return data.map((d) => ({
      date: d.date.toLocaleDateString(),
      margin: Math.round(d.totalMargin),
      revenue: Math.round(d.totalRevenue),
      efficiency: Math.round(d.spaceEfficiency),
      products: d.productCount,
      avgMargin: Math.round(d.averageMargin),
    }));
  }, [data]);

  const statistics = useMemo(() => {
    if (data.length === 0) {
      return {
        totalMargin: 0,
        totalRevenue: 0,
        avgMargin: 0,
        avgEfficiency: 0,
        maxMargin: 0,
        minMargin: 0,
      };
    }

    const margins = data.map((d) => d.totalMargin);
    const revenues = data.map((d) => d.totalRevenue);
    const efficiencies = data.map((d) => d.spaceEfficiency);

    return {
      totalMargin: margins.reduce((a, b) => a + b, 0),
      totalRevenue: revenues.reduce((a, b) => a + b, 0),
      avgMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
      avgEfficiency: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
      maxMargin: Math.max(...margins),
      minMargin: Math.min(...margins),
    };
  }, [data]);

  const anomalies = useMemo((): Array<{
    type: string;
    date: string;
    value: number;
    expected: number;
    severity: string;
  }> => {
    if (data.length < 3) return [];

    const anomaliesList: Array<{
      type: string;
      date: string;
      value: number;
      expected: number;
      severity: string;
    }> = [];
    const margins = data.map((d) => d.totalMargin);
    const avgMargin = margins.reduce((a, b) => a + b, 0) / margins.length;
    const stdDev = Math.sqrt(margins.reduce((sq, n) => sq + Math.pow(n - avgMargin, 2), 0) / margins.length);

    data.forEach((d, i) => {
      // Detect margin anomaly (>2 std devs from mean)
      if (Math.abs(d.totalMargin - avgMargin) > 2 * stdDev) {
        anomaliesList.push({
          type: "margin",
          date: d.date.toLocaleDateString(),
          value: d.totalMargin,
          expected: avgMargin,
          severity: Math.abs(d.totalMargin - avgMargin) > 3 * stdDev ? "high" : "medium",
        });
      }

      // Detect efficiency drop
      if (i > 0 && data[i - 1].spaceEfficiency - d.spaceEfficiency > 15) {
        anomaliesList.push({
          type: "efficiency",
          date: d.date.toLocaleDateString(),
          value: d.spaceEfficiency,
          expected: data[i - 1].spaceEfficiency,
          severity: "medium",
        });
      }
    });

    return anomaliesList;
  }, [data]);

  return (
    <div className="w-full space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">{t.totalMargin}</p>
          <p className="text-2xl font-bold text-foreground">
            {t.currency} {statistics.totalMargin.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {t.trend}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">{t.totalRevenue}</p>
          <p className="text-2xl font-bold text-foreground">
            {t.currency} {statistics.totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {t.trend}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">{t.avgMargin}</p>
          <p className="text-2xl font-bold text-foreground">{t.currency} {statistics.avgMargin.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {t.average}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">{t.spaceEff}</p>
          <p className="text-2xl font-bold text-foreground">{statistics.avgEfficiency.toFixed(0)}{t.percent}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {t.average}
          </p>
        </div>
      </div>

      {/* Margin Trend Chart */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">{t.marginTrend}</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${t.currency} ${value}`} />
            <Legend />
            <Area type="monotone" dataKey="margin" fill="#3b82f6" stroke="#3b82f6" name={t.margin} />
            <Area type="monotone" dataKey="avgMargin" fill="#93c5fd" stroke="#93c5fd" name={t.average} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue & Efficiency Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t.revenueTrend}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${t.currency} ${value}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name={t.revenue} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t.efficiencyTrend}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}${t.percent}`} />
              <Legend />
              <Bar dataKey="efficiency" fill="#f59e0b" name={t.efficiency} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomalies Section */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {t.anomalies}
        </h4>

        {anomalies.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            {t.noAnomalies}
          </div>
        ) : (
          <div className="space-y-2">
            {anomalies.map((anomaly, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  anomaly.severity === "high" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <p className={`text-sm font-semibold ${anomaly.severity === "high" ? "text-red-900" : "text-yellow-900"}`}>
                  {t.anomalyAlert} - {anomaly.type}
                </p>
                <p className={`text-xs ${anomaly.severity === "high" ? "text-red-800" : "text-yellow-800"}`}>
                  {anomaly.date}: {anomaly.value.toFixed(2)} (esperado: {anomaly.expected.toFixed(2)})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Trend */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">{t.productTrend}</h4>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter name={t.products} dataKey="products" fill="#8b5cf6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
