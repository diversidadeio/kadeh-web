import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react";

interface SimulatorData {
  type: "retail" | "shopping";
  location: "oba" | "barra" | "spmarket";
  duration: 1 | 3 | 7 | 14;
  numStores: number;
  triggerType: "category" | "brand" | "search";
}

export default function AdsSimulator({ language }: { language: string }) {
  const [data, setData] = useState<SimulatorData>({
    type: "retail",
    location: "oba",
    duration: 7,
    numStores: 1,
    triggerType: "category",
  });

  // Dados reais de circulação
  const locationData = {
    oba: { dailyVisitors: 2500, name: "Oba Supermercados", type: "retail" },
    barra: { dailyVisitors: 70000, name: "Barra Shopping", type: "shopping" },
    spmarket: { dailyVisitors: 45000, name: "SP Market", type: "shopping" },
  };

  // Tabela de preços (baseada na estrutura existente)
  const priceTable = {
    retail: {
      1: { 1: 150, 5: 600, 10: 1000 },
      3: { 1: 350, 5: 1400, 10: 2300 },
      7: { 1: 700, 5: 2800, 10: 4600 },
      14: { 1: 1200, 5: 4800, 10: 8000 },
    },
    shopping: {
      1: { 1: 500, 3: 1200, 5: 1800 },
      3: { 1: 1200, 3: 2800, 5: 4200 },
      7: { 1: 2300, 3: 5400, 5: 8000 },
      14: { 1: 4000, 3: 9000, 5: 13500 },
    },
  };

  const currentLocation = locationData[data.location as keyof typeof locationData];
  const durationKey = data.duration as keyof (typeof priceTable)["retail"];
  const storeCountKey = Math.min(data.numStores, 10) as any;
  const pricePerStore = (priceTable[data.type][durationKey] as any)[storeCountKey] || 0;

  const totalInvestment = pricePerStore * data.numStores;
  const totalDailyVisitors = currentLocation.dailyVisitors * data.numStores;
  const estimatedImpressions = totalDailyVisitors * data.duration * 0.7; // 70% de taxa de visualização
  const estimatedCTR = estimatedImpressions * 0.05; // 5% CTR
  const estimatedConversion = estimatedCTR * 0.15; // 15% conversão
  const estimatedRevenue = estimatedConversion * 150; // Ticket médio R$ 150
  const roi = ((estimatedRevenue - totalInvestment) / totalInvestment) * 100;

  const texts = {
    pt: {
      title: "Simulador de Investimento em Ads",
      subtitle: "Calcule o ROI estimado da sua campanha de publicidade no ponto de venda",
      type: "Tipo de Ambiente",
      retail: "Varejo",
      shopping: "Shopping Center",
      location: "Localização",
      duration: "Duração da Campanha",
      days: "dias",
      numStores: "Número de Lojas",
      trigger: "Tipo de Gatilho",
      category: "Por Categoria",
      brand: "Por Marca",
      search: "Por Busca",
      results: "Resultados Estimados",
      investment: "Investimento Total",
      dailyVisitors: "Visitantes Diários",
      estimatedImpressions: "Impressões Estimadas",
      estimatedClicks: "Cliques Estimados",
      estimatedConversions: "Conversões Estimadas",
      estimatedRevenue: "Receita Estimada",
      roi: "ROI Estimado",
      calculate: "Calcular",
    },
    en: {
      title: "Ads Investment Simulator",
      subtitle: "Calculate the estimated ROI of your point-of-sale advertising campaign",
      type: "Environment Type",
      retail: "Retail",
      shopping: "Shopping Center",
      location: "Location",
      duration: "Campaign Duration",
      days: "days",
      numStores: "Number of Stores",
      trigger: "Trigger Type",
      category: "By Category",
      brand: "By Brand",
      search: "By Search",
      results: "Estimated Results",
      investment: "Total Investment",
      dailyVisitors: "Daily Visitors",
      estimatedImpressions: "Estimated Impressions",
      estimatedClicks: "Estimated Clicks",
      estimatedConversions: "Estimated Conversions",
      estimatedRevenue: "Estimated Revenue",
      roi: "Estimated ROI",
      calculate: "Calculate",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900">{t.title}</h2>
        <p className="text-xl text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuração */}
        <Card>
          <CardHeader>
            <CardTitle>{t.type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t.type}</label>
              <div className="flex gap-2">
                <Button
                  variant={data.type === "retail" ? "default" : "outline"}
                  onClick={() => setData({ ...data, type: "retail", location: "oba" })}
                  className="flex-1"
                >
                  {t.retail}
                </Button>
                <Button
                  variant={data.type === "shopping" ? "default" : "outline"}
                  onClick={() => setData({ ...data, type: "shopping", location: "barra" })}
                  className="flex-1"
                >
                  {t.shopping}
                </Button>
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t.location}</label>
              <select
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="oba">Oba Supermercados</option>
                <option value="barra">Barra Shopping (RJ)</option>
                <option value="spmarket">SP Market (São Paulo)</option>
              </select>
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t.duration}</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 7, 14].map((days) => (
                  <Button
                    key={days}
                    variant={data.duration === days ? "default" : "outline"}
                    onClick={() => setData({ ...data, duration: days as any })}
                    className="text-sm"
                  >
                    {days}
                  </Button>
                ))}
              </div>
            </div>

            {/* Número de Lojas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t.numStores}</label>
              <input
                type="number"
                min="1"
                max="100"
                value={data.numStores}
                onChange={(e) => setData({ ...data, numStores: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tipo de Gatilho */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t.trigger}</label>
              <div className="space-y-2">
                {["category", "brand", "search"].map((trigger) => (
                  <label key={trigger} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trigger"
                      value={trigger}
                      checked={data.triggerType === trigger}
                      onChange={(e) => setData({ ...data, triggerType: e.target.value as any })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      {trigger === "category" && t.category}
                      {trigger === "brand" && t.brand}
                      {trigger === "search" && t.search}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t.results}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t.investment}</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {totalInvestment.toLocaleString("pt-BR")}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t.dailyVisitors}</p>
                  <p className="text-2xl font-bold text-blue-600">{totalDailyVisitors.toLocaleString("pt-BR")}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t.estimatedImpressions}</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(estimatedImpressions).toLocaleString("pt-BR")}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t.estimatedClicks}</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(estimatedCTR).toLocaleString("pt-BR")}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t.estimatedConversions}</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(estimatedConversion).toLocaleString("pt-BR")}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t.estimatedRevenue}</p>
                  <p className="text-2xl font-bold text-green-600">R$ {Math.round(estimatedRevenue).toLocaleString("pt-BR")}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t.roi}</p>
                    <p className={`text-4xl font-bold ${roi > 0 ? "text-green-600" : "text-red-600"}`}>
                      {roi.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className={`w-12 h-12 ${roi > 0 ? "text-green-600" : "text-red-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
