/**
 * FinancialImpactDashboard Component
 * Displays financial impact metrics for shelf layout simulations
 * Includes ROI, average ticket, rupture reduction, and profitability impact
 */

import { useMemo } from "react";
import { TrendingUp, DollarSign, ShoppingCart, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface FinancialProduct {
  id: string;
  name: string;
  categoryId: string;
  category: {
    relevance?: number;
    strategicRole?: string;
    giro?: "Baixo" | "Médio" | "Alto";
    margem?: "Baixa" | "Média" | "Alta";
  };
  quadrants?: number;
  zone?: string;
}

interface FinancialMetrics {
  estimatedROI: number;
  averageTicketIncrease: number;
  ruptureReduction: number;
  profitabilityIncrease: number;
  estimatedMonthlyRevenue: number;
  estimatedMonthlyCost: number;
  netMonthlyBenefit: number;
}

interface FinancialImpactDashboardProps {
  products: any[];
  gondolaWidth: number;
  shelfHeight: number;
  shelfDepth: number;
}

const TRANSLATIONS = {
  pt: {
    financialImpact: "Impacto Financeiro da Simulação",
    estimatedROI: "ROI Estimado",
    averageTicketIncrease: "Aumento de Ticket Médio",
    ruptureReduction: "Redução de Ruptura",
    profitabilityIncrease: "Aumento de Lucratividade",
    estimatedMonthlyRevenue: "Receita Mensal Estimada",
    estimatedMonthlyCost: "Custo Mensal Estimado",
    netMonthlyBenefit: "Benefício Líquido Mensal",
    metricsComparison: "Comparação de Métricas",
    productDistribution: "Distribuição de Produtos por Zona",
    financialProjection: "Projeção Financeira (12 meses)",
    eyeLevel: "Altura dos olhos",
    handLevel: "Altura das mãos",
    bottomShelf: "Parte de Baixo",
    noProducts: "Nenhum produto adicionado à simulação",
    baselineScenario: "Cenário Base",
    optimizedScenario: "Cenário Otimizado",
    month: "Mês",
    revenue: "Receita",
    cost: "Custo",
    benefit: "Benefício",
  },
  en: {
    financialImpact: "Simulation Financial Impact",
    estimatedROI: "Estimated ROI",
    averageTicketIncrease: "Average Ticket Increase",
    ruptureReduction: "Rupture Reduction",
    profitabilityIncrease: "Profitability Increase",
    estimatedMonthlyRevenue: "Estimated Monthly Revenue",
    estimatedMonthlyCost: "Estimated Monthly Cost",
    netMonthlyBenefit: "Net Monthly Benefit",
    metricsComparison: "Metrics Comparison",
    productDistribution: "Product Distribution by Zone",
    financialProjection: "Financial Projection (12 months)",
    eyeLevel: "Eye Level",
    handLevel: "Hand Level",
    bottomShelf: "Bottom Shelf",
    noProducts: "No products added to simulation",
    baselineScenario: "Baseline Scenario",
    optimizedScenario: "Optimized Scenario",
    month: "Month",
    revenue: "Revenue",
    cost: "Cost",
    benefit: "Benefit",
  },
};

export default function FinancialImpactDashboard({ products, gondolaWidth, shelfHeight, shelfDepth }: FinancialImpactDashboardProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  // Calculate financial metrics
  const metrics = useMemo(() => {
    if (products.length === 0) {
      return {
        estimatedROI: 0,
        averageTicketIncrease: 0,
        ruptureReduction: 0,
        profitabilityIncrease: 0,
        estimatedMonthlyRevenue: 0,
        estimatedMonthlyCost: 0,
        netMonthlyBenefit: 0,
      };
    }

    // Calculate base metrics based on product characteristics
    const highMarginProducts = products.filter((p) => p.category?.margem === "Alta").length;
    const highVelocityProducts = products.filter((p) => p.category?.giro === "Alto").length;
    const totalProducts = products.length;
    const shelfArea = gondolaWidth * shelfHeight * shelfDepth;

    // ROI calculation: Based on product mix and shelf optimization
    // High-margin + high-velocity products in optimal zones = higher ROI
    const optimalZoneProducts = products.filter((p) => p.zone === "Altura dos olhos" || p.zone === "Eye Level").length;
    const roiBase = (highMarginProducts / totalProducts) * 100;
    const roiOptimization = (optimalZoneProducts / totalProducts) * 50;
    const estimatedROI = Math.min(roiBase + roiOptimization, 150);

    // Average ticket increase: Higher with more high-margin products
    const averageTicketIncrease = (highMarginProducts / totalProducts) * 25;

    // Rupture reduction: Based on high-velocity products getting more space
    const ruptureReduction = (highVelocityProducts / totalProducts) * 30;

    // Profitability increase: Combined effect of margin and velocity optimization
    const profitabilityIncrease = (highMarginProducts * 0.6 + highVelocityProducts * 0.4) / totalProducts * 40;

    // Monthly revenue estimation (in R$)
    // Base: 10,000 per product per month
    const baseMonthlyRevenue = totalProducts * 10000;
    const estimatedMonthlyRevenue = baseMonthlyRevenue * (1 + averageTicketIncrease / 100);

    // Monthly cost estimation (in R$)
    // Base: 2,000 per product per month
    const estimatedMonthlyCost = totalProducts * 2000;

    // Net monthly benefit
    const netMonthlyBenefit = estimatedMonthlyRevenue - estimatedMonthlyCost;

    return {
      estimatedROI: Math.round(estimatedROI * 10) / 10,
      averageTicketIncrease: Math.round(averageTicketIncrease * 10) / 10,
      ruptureReduction: Math.round(ruptureReduction * 10) / 10,
      profitabilityIncrease: Math.round(profitabilityIncrease * 10) / 10,
      estimatedMonthlyRevenue: Math.round(estimatedMonthlyRevenue),
      estimatedMonthlyCost: Math.round(estimatedMonthlyCost),
      netMonthlyBenefit: Math.round(netMonthlyBenefit),
    };
  }, [products, gondolaWidth, shelfHeight, shelfDepth]);

  // Product distribution by zone
  const zoneDistribution = useMemo(() => {
    const distribution = {
      eyeLevel: 0,
      handLevel: 0,
      bottomShelf: 0,
    };

    products.forEach((p) => {
      if (p.zone === "Altura dos olhos" || p.zone === "Eye Level") {
        distribution.eyeLevel++;
      } else if (p.zone === "Altura das mãos" || p.zone === "Hand Level") {
        distribution.handLevel++;
      } else if (p.zone === "Parte de Baixo" || p.zone === "Bottom Shelf") {
        distribution.bottomShelf++;
      }
    });

    return [
      { name: t.eyeLevel, value: distribution.eyeLevel, fill: "#3b82f6" },
      { name: t.handLevel, value: distribution.handLevel, fill: "#10b981" },
      { name: t.bottomShelf, value: distribution.bottomShelf, fill: "#f59e0b" },
    ];
  }, [products, t]);

  // 12-month financial projection
  const projectionData = useMemo(() => {
    const data = [];
    for (let month = 1; month <= 12; month++) {
      const baselineRevenue = products.length * 10000;
      const optimizedRevenue = metrics.estimatedMonthlyRevenue;
      const cost = metrics.estimatedMonthlyCost;
      const benefit = optimizedRevenue - cost;

      data.push({
        month: `M${month}`,
        [t.baselineScenario]: Math.round(baselineRevenue),
        [t.optimizedScenario]: Math.round(optimizedRevenue),
        [t.benefit]: Math.round(benefit),
      });
    }
    return data;
  }, [products, metrics, t]);

  // Metrics comparison data
  const comparisonData = useMemo(() => {
    return [
      {
        metric: t.estimatedROI,
        value: metrics.estimatedROI,
        unit: "%",
        color: "#3b82f6",
        icon: TrendingUp,
      },
      {
        metric: t.averageTicketIncrease,
        value: metrics.averageTicketIncrease,
        unit: "%",
        color: "#10b981",
        icon: ShoppingCart,
      },
      {
        metric: t.ruptureReduction,
        value: metrics.ruptureReduction,
        unit: "%",
        color: "#f59e0b",
        icon: AlertCircle,
      },
      {
        metric: t.profitabilityIncrease,
        value: metrics.profitabilityIncrease,
        unit: "%",
        color: "#8b5cf6",
        icon: DollarSign,
      },
    ];
  }, [metrics, t]);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{t.noProducts}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.metric} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{item.metric}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: item.color }}>
                    {item.value}
                    <span className="text-lg ml-1">{item.unit}</span>
                  </p>
                </div>
                <Icon className="w-8 h-8" style={{ color: item.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <p className="text-sm text-blue-600 font-medium mb-2">{t.estimatedMonthlyRevenue}</p>
          <p className="text-2xl font-bold text-blue-900">
            R$ {(metrics.estimatedMonthlyRevenue / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
          <p className="text-sm text-orange-600 font-medium mb-2">{t.estimatedMonthlyCost}</p>
          <p className="text-2xl font-bold text-orange-900">
            R$ {(metrics.estimatedMonthlyCost / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <p className="text-sm text-green-600 font-medium mb-2">{t.netMonthlyBenefit}</p>
          <p className="text-2xl font-bold text-green-900">
            R$ {(metrics.netMonthlyBenefit / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">{t.productDistribution}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={zoneDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {zoneDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 12-Month Projection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">{t.financialProjection}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `R$ ${(Number(value) / 1000).toFixed(1)}k`} />
              <Legend />
              <Line
                type="monotone"
                dataKey={t.baselineScenario}
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={t.optimizedScenario}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={t.benefit}
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Comparison Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">{t.metricsComparison}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={comparisonData.map((item) => ({
              name: item.metric,
              value: Number(item.value),
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value}%`} />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
