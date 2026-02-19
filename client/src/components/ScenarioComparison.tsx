/**
 * Scenario Comparison Component
 * Displays visual comparison of different simulation scenarios
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface ScenarioData {
  id: string;
  name: string;
  totalMargin: number;
  totalRevenue: number;
  spaceEfficiency: number;
  productCount: number;
  averageMargin: number;
  timestamp: Date;
}

interface ScenarioComparisonProps {
  scenarios: ScenarioData[];
  onDeleteScenario: (id: string) => void;
}

const TRANSLATIONS = {
  pt: {
    title: "Comparação de Cenários",
    noScenarios: "Nenhum cenário salvo para comparação",
    margin: "Margem",
    revenue: "Faturamento",
    efficiency: "Eficiência",
    products: "Produtos",
    marginChart: "Margem por Cenário",
    revenueChart: "Faturamento por Cenário",
    efficiencyChart: "Eficiência de Espaço",
    delete: "Deletar",
    currency: "R$",
    percent: "%",
  },
  en: {
    title: "Scenario Comparison",
    noScenarios: "No saved scenarios for comparison",
    margin: "Margin",
    revenue: "Revenue",
    efficiency: "Efficiency",
    products: "Products",
    marginChart: "Margin by Scenario",
    revenueChart: "Revenue by Scenario",
    efficiencyChart: "Space Efficiency",
    delete: "Delete",
    currency: "R$",
    percent: "%",
  },
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function ScenarioComparison({ scenarios, onDeleteScenario }: ScenarioComparisonProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  if (scenarios.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">{t.noScenarios}</p>
      </div>
    );
  }

  const chartData = scenarios.map((s) => ({
    name: s.name.substring(0, 15),
    margin: Math.round(s.totalMargin),
    revenue: Math.round(s.totalRevenue),
    efficiency: Math.round(s.spaceEfficiency),
    products: s.productCount,
  }));

  const efficiencyData = scenarios.map((s, i) => ({
    name: s.name.substring(0, 15),
    value: s.spaceEfficiency,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.title}</h3>

        {/* Margin Comparison */}
        <div className="bg-card p-4 rounded-lg border border-border mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t.marginChart}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${t.currency} ${value}`} />
              <Legend />
              <Bar dataKey="margin" fill="#3b82f6" name={t.margin} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Comparison */}
        <div className="bg-card p-4 rounded-lg border border-border mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t.revenueChart}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${t.currency} ${value}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name={t.revenue} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Space Efficiency */}
        <div className="bg-card p-4 rounded-lg border border-border mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t.efficiencyChart}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={efficiencyData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value.toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {efficiencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(0) : value}${t.percent}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Scenarios Table */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Detalhes dos Cenários</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-semibold text-foreground">Nome</th>
                  <th className="text-right py-2 px-3 font-semibold text-foreground">{t.margin}</th>
                  <th className="text-right py-2 px-3 font-semibold text-foreground">{t.revenue}</th>
                  <th className="text-right py-2 px-3 font-semibold text-foreground">{t.efficiency}</th>
                  <th className="text-right py-2 px-3 font-semibold text-foreground">{t.products}</th>
                  <th className="text-center py-2 px-3 font-semibold text-foreground">Ação</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => (
                  <tr key={scenario.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-3 text-foreground">{scenario.name}</td>
                    <td className="py-3 px-3 text-right text-foreground font-semibold">{t.currency} {scenario.totalMargin.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-foreground font-semibold">{t.currency} {scenario.totalRevenue.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-foreground font-semibold">{scenario.spaceEfficiency.toFixed(0)}%</td>
                    <td className="py-3 px-3 text-right text-foreground">{scenario.productCount}</td>
                    <td className="py-3 px-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => onDeleteScenario(scenario.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
