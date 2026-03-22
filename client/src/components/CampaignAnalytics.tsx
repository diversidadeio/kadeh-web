import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, MousePointer, ShoppingCart } from "lucide-react";

interface CampaignAnalyticsProps {
  campaignId: number;
  campaignData?: {
    views?: number;
    clicks?: number;
    conversions?: number;
    revenue?: number;
    startDate: Date;
    endDate: Date;
  };
}

// Dados mock para demonstração
const generateMockAnalytics = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push({
      day: `Dia ${i + 1}`,
      views: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 200) + 50,
      conversions: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  return data;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function CampaignAnalytics({ campaignId, campaignData }: CampaignAnalyticsProps) {
  const analyticsData = useMemo(() => {
    const days = campaignData?.endDate && campaignData?.startDate
      ? Math.ceil((new Date(campaignData.endDate).getTime() - new Date(campaignData.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 7;
    return generateMockAnalytics(Math.max(days, 7));
  }, [campaignData]);

  const stats = useMemo(() => {
    return {
      totalViews: analyticsData.reduce((sum, d) => sum + d.views, 0),
      totalClicks: analyticsData.reduce((sum, d) => sum + d.clicks, 0),
      totalConversions: analyticsData.reduce((sum, d) => sum + d.conversions, 0),
      totalRevenue: analyticsData.reduce((sum, d) => sum + d.revenue, 0),
      ctr: ((analyticsData.reduce((sum, d) => sum + d.clicks, 0) / analyticsData.reduce((sum, d) => sum + d.views, 0)) * 100).toFixed(2),
      conversionRate: ((analyticsData.reduce((sum, d) => sum + d.conversions, 0) / analyticsData.reduce((sum, d) => sum + d.clicks, 0)) * 100).toFixed(2),
    };
  }, [analyticsData]);

  const conversionData = [
    { name: "Visualizações", value: stats.totalViews, fill: COLORS[0] },
    { name: "Cliques", value: stats.totalClicks, fill: COLORS[1] },
    { name: "Conversões", value: stats.totalConversions, fill: COLORS[2] },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de visualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Cliques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">CTR: {stats.ctr}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Conversões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Taxa: {stats.conversionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {(stats.totalRevenue / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground mt-1">Total gerado</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linha - Performance ao longo do tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Performance ao Longo do Tempo</CardTitle>
            <CardDescription>Visualizações, cliques e conversões por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke={COLORS[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="clicks" stroke={COLORS[1]} strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke={COLORS[2]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Barra - Receita por dia */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Dia</CardTitle>
            <CardDescription>Receita gerada em cada dia da campanha</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Proporção de visualizações, cliques e conversões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4 flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliques (CTR: {stats.ctr}%)</p>
                <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversões (Taxa: {stats.conversionRate}%)</p>
                <p className="text-2xl font-bold">{stats.totalConversions.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
