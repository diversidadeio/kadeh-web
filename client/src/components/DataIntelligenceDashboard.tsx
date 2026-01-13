/**
 * DataIntelligenceDashboard Component
 * Interactive real-time dashboard with charts and analytics
 * Design: Tech-Forward Minimalism with data visualization
 */

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, TrendingUp, Users, ShoppingCart, Clock } from "lucide-react";

// Dados simulados para gráficos
const SEARCH_PATTERNS_DATA = [
  { category: "Alimentos", searches: 2400, views: 2210 },
  { category: "Bebidas", searches: 1398, views: 2290 },
  { category: "Higiene", searches: 9800, views: 2000 },
  { category: "Eletrônicos", searches: 3908, views: 2108 },
  { category: "Vestuário", searches: 4800, views: 2780 },
  { category: "Beleza", searches: 3800, views: 2509 },
];

const HOURLY_TRAFFIC_DATA = [
  { time: "06h", traffic: 120, intent: 45 },
  { time: "08h", traffic: 380, intent: 120 },
  { time: "10h", traffic: 450, intent: 180 },
  { time: "12h", traffic: 620, intent: 280 },
  { time: "14h", traffic: 480, intent: 220 },
  { time: "16h", traffic: 750, intent: 350 },
  { time: "18h", traffic: 890, intent: 420 },
  { time: "20h", traffic: 720, intent: 340 },
  { time: "22h", traffic: 380, intent: 160 },
];

const BRAND_PREFERENCES_DATA = [
  { name: "Brand A", value: 28, color: "#0066FF" },
  { name: "Brand B", value: 22, color: "#00D9FF" },
  { name: "Brand C", value: 18, color: "#FF6B35" },
  { name: "Brand D", value: 15, color: "#F7B801" },
  { name: "Outros", value: 17, color: "#E0E0E0" },
];

const PURCHASE_INTENT_DATA = [
  { status: "Alto", count: 245, color: "#00C853" },
  { status: "Médio", count: 380, color: "#FFC400" },
  { status: "Baixo", count: 175, color: "#FF5252" },
];

const WEEKLY_TRAFFIC_DATA = [
  { day: "Seg", traffic: 1200 },
  { day: "Ter", traffic: 1400 },
  { day: "Qua", traffic: 1100 },
  { day: "Qui", traffic: 1800 },
  { day: "Sex", traffic: 2200 },
  { day: "Sab", traffic: 2800 },
  { day: "Dom", traffic: 1900 },
];

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

function MetricCard({ label, value, change, icon }: MetricCard) {
  const isPositive = change >= 0;
  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "↑" : "↓"} {Math.abs(change)}% vs ontem
      </p>
    </div>
  );
}

export default function DataIntelligenceDashboard() {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeCustomers, setActiveCustomers] = useState(1245);
  const [avgIntentScore, setAvgIntentScore] = useState(68);
  const [conversionRate, setConversionRate] = useState(12.4);
  const [avgSessionTime, setAvgSessionTime] = useState("4m 32s");

  // Simular atualização de dados em tempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setActiveCustomers((prev) => Math.max(800, prev + Math.floor(Math.random() * 100 - 30)));
      setAvgIntentScore((prev) => Math.min(100, Math.max(40, prev + Math.floor(Math.random() * 6 - 3))));
      setConversionRate((prev) => Math.max(8, Math.min(18, prev + (Math.random() * 0.4 - 0.2))));
      
      const minutes = Math.floor(Math.random() * 8) + 2;
      const seconds = Math.floor(Math.random() * 60);
      setAvgSessionTime(`${minutes}m ${seconds}s`);
      
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-8">
      {/* Header com Status Live */}
      <div className="flex items-center justify-between bg-card p-6 rounded-md border border-border">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
          <div>
            <p className="font-semibold text-foreground">
              {isLive ? "Dashboard On-Time" : "Dashboard Pausado"}
            </p>
            <p className="text-xs text-muted-foreground">
              Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
            isLive
              ? "bg-primary text-white border-primary hover:bg-primary/90"
              : "bg-white text-foreground border-border hover:bg-card"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          {isLive ? "Pausar" : "Retomar"}
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Clientes Ativos"
          value={activeCustomers}
          change={12}
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          label="Score de Intenção"
          value={`${avgIntentScore}%`}
          change={8}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Taxa de Conversão"
          value={`${conversionRate.toFixed(1)}%`}
          change={5}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <MetricCard
          label="Tempo Médio"
          value={avgSessionTime}
          change={-3}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Padrões de Busca por Categoria */}
        <div className="bg-card p-8 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Padrões de Busca por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SEARCH_PATTERNS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="category" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="searches" fill="#0066FF" name="Buscas" />
              <Bar dataKey="views" fill="#00D9FF" name="Visualizações" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tráfego por Hora */}
        <div className="bg-card p-8 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Tráfego e Intenção por Hora</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={HOURLY_TRAFFIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="traffic"
                stroke="#0066FF"
                strokeWidth={2}
                name="Tráfego"
                dot={{ fill: "#0066FF", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="intent"
                stroke="#FF6B35"
                strokeWidth={2}
                name="Intenção de Compra"
                dot={{ fill: "#FF6B35", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Preferências de Marca e Intenção */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preferências de Marca */}
        <div className="bg-card p-8 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Preferências de Marca</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={BRAND_PREFERENCES_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {BRAND_PREFERENCES_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Score de Intenção de Compra */}
        <div className="bg-card p-8 rounded-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Distribuição de Intenção de Compra</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={PURCHASE_INTENT_DATA}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="status" type="category" stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#0066FF" name="Clientes">
                {PURCHASE_INTENT_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tráfego Semanal */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Tráfego Semanal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={WEEKLY_TRAFFIC_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="traffic" fill="#00D9FF" name="Clientes" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heat Map Simulado */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Heat Map de Navegação (Simulado)</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Visualização simplificada do mapa de calor da loja. Áreas em vermelho recebem mais tráfego.
          </p>
          <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded border border-border">
            {/* Simulação de grid de heat map */}
            {Array.from({ length: 16 }).map((_, idx) => {
              const intensity = Math.random();
              let bgColor = "bg-blue-100";
              if (intensity > 0.7) bgColor = "bg-red-500";
              else if (intensity > 0.5) bgColor = "bg-orange-400";
              else if (intensity > 0.3) bgColor = "bg-yellow-300";
              
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded ${bgColor} transition-colors hover:opacity-80 cursor-pointer`}
                  title={`Intensidade: ${Math.round(intensity * 100)}%`}
                ></div>
              );
            })}
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-muted-foreground">Alto tráfego</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
              <span className="text-muted-foreground">Médio tráfego</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-muted-foreground">Baixo tráfego</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Insights em Tempo Real</h3>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-foreground">Alta intenção de compra detectada</p>
              <p className="text-sm text-muted-foreground">
                {avgIntentScore}% dos clientes ativos mostram sinais de alta intenção de compra. Recomende ofertas personalizadas.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-foreground">Horário de pico identificado</p>
              <p className="text-sm text-muted-foreground">
                18h é o horário com maior tráfego. Aumente recomendações e ofertas neste período.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-foreground">Categoria em destaque</p>
              <p className="text-sm text-muted-foreground">
                Higiene lidera em buscas com 9.800 buscas. Considere aumentar espaço desta categoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
