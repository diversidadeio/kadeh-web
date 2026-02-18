import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Eye, MousePointer, TrendingUp, Calendar, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/_core/hooks/useAuth";

interface Campaign {
  id: string;
  productName: string;
  adType: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  endDate: string;
  numStores: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  investment: number;
}

interface AdvertiserDashboardProps {
  language: string;
}

export default function AdvertiserDashboard({ language }: AdvertiserDashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  // Mock data - Replace with real API data
  const campaigns: Campaign[] = [
    {
      id: "1",
      productName: "Café Premium",
      adType: "promotion",
      status: "active",
      startDate: "2026-02-10",
      endDate: "2026-02-17",
      numStores: 5,
      impressions: 12500,
      clicks: 625,
      conversions: 94,
      revenue: 14100,
      investment: 3500,
    },
    {
      id: "2",
      productName: "Biscoitos Integrais",
      adType: "suggestion",
      status: "completed",
      startDate: "2026-02-01",
      endDate: "2026-02-08",
      numStores: 3,
      impressions: 8900,
      clicks: 445,
      conversions: 67,
      revenue: 10050,
      investment: 2100,
    },
  ];

  const texts = {
    pt: {
      title: "Dashboard de Campanhas",
      subtitle: "Acompanhe o desempenho de seus anúncios em tempo real",
      activeCampaigns: "Campanhas Ativas",
      history: "Histórico",
      product: "Produto",
      type: "Tipo",
      status: "Status",
      stores: "Lojas",
      impressions: "Impressões",
      clicks: "Cliques",
      conversions: "Conversões",
      revenue: "Receita",
      investment: "Investimento",
      roi: "ROI",
      startDate: "Data Início",
      endDate: "Data Fim",
      noCampaigns: "Nenhuma campanha encontrada",
      active: "Ativa",
      paused: "Pausada",
      completed: "Concluída",
      viewDetails: "Ver Detalhes",
      pause: "Pausar",
      resume: "Retomar",
      loginRequired: "Você precisa estar logado para acessar o dashboard",
      performanceChart: "Gráfico de Desempenho",
      metricsOverview: "Visão Geral de Métricas",
    },
    en: {
      title: "Campaign Dashboard",
      subtitle: "Track your ads performance in real-time",
      activeCampaigns: "Active Campaigns",
      history: "History",
      product: "Product",
      type: "Type",
      status: "Status",
      stores: "Stores",
      impressions: "Impressions",
      clicks: "Clicks",
      conversions: "Conversions",
      revenue: "Revenue",
      investment: "Investment",
      roi: "ROI",
      startDate: "Start Date",
      endDate: "End Date",
      noCampaigns: "No campaigns found",
      active: "Active",
      paused: "Paused",
      completed: "Completed",
      viewDetails: "View Details",
      pause: "Pause",
      resume: "Resume",
      loginRequired: "You need to be logged in to access the dashboard",
      performanceChart: "Performance Chart",
      metricsOverview: "Metrics Overview",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t.loginRequired}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const allCampaigns = campaigns;

  const chartData = campaigns.map((c) => ({
    name: c.productName.substring(0, 10),
    impressions: c.impressions,
    clicks: c.clicks,
    conversions: c.conversions,
  }));

  const renderCampaignTable = (data: Campaign[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">{t.product}</th>
            <th className="text-left p-2">{t.type}</th>
            <th className="text-left p-2">{t.status}</th>
            <th className="text-center p-2">{t.stores}</th>
            <th className="text-center p-2">{t.impressions}</th>
            <th className="text-center p-2">{t.clicks}</th>
            <th className="text-center p-2">{t.conversions}</th>
            <th className="text-right p-2">{t.revenue}</th>
            <th className="text-right p-2">{t.roi}</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4 text-gray-500">
                {t.noCampaigns}
              </td>
            </tr>
          ) : (
            data.map((campaign) => {
              const roi = ((campaign.revenue - campaign.investment) / campaign.investment * 100).toFixed(1);
              return (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{campaign.productName}</td>
                  <td className="p-2 capitalize">{campaign.adType}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      campaign.status === "active" ? "bg-green-100 text-green-800" :
                      campaign.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {t[campaign.status as keyof typeof t]}
                    </span>
                  </td>
                  <td className="text-center p-2">{campaign.numStores}</td>
                  <td className="text-center p-2">{campaign.impressions.toLocaleString()}</td>
                  <td className="text-center p-2">{campaign.clicks.toLocaleString()}</td>
                  <td className="text-center p-2">{campaign.conversions.toLocaleString()}</td>
                  <td className="text-right p-2">R$ {campaign.revenue.toLocaleString()}</td>
                  <td className="text-right p-2 font-semibold text-green-600">{roi}%</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.impressions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}</div>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.clicks}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}</div>
              <MousePointer className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.conversions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}</div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.revenue}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">R$ {campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}</div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t.performanceChart}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#3b82f6" />
              <Bar dataKey="clicks" fill="#8b5cf6" />
              <Bar dataKey="conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.metricsOverview}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="active">{t.activeCampaigns} ({activeCampaigns.length})</TabsTrigger>
              <TabsTrigger value="all">{t.history} ({allCampaigns.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              {renderCampaignTable(activeCampaigns)}
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              {renderCampaignTable(allCampaigns)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
