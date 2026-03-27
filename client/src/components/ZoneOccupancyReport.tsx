/**
 * Zone Occupancy Report Component
 * Relatório visual mostrando taxa de ocupação de cada zona de exposição
 */

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Product } from '@/utils/exposureMetricsEngine';

interface ZoneOccupancyReportProps {
  products: Product[];
  shelfCount?: number;
  language?: 'pt' | 'en';
}

interface ZoneMetrics {
  zone: string;
  totalShare: number;
  productCount: number;
  occupancyPercentage: number;
  averageSharePerProduct: number;
  status: 'optimal' | 'underutilized' | 'overutilized';
}

const TRANSLATIONS = {
  pt: {
    title: 'Relatório de Ocupação por Zona',
    eyeLevel: 'Altura dos Olhos',
    handLevel: 'Altura das Mãos',
    bottomShelf: 'Parte de Baixo',
    occupancyRate: 'Taxa de Ocupação',
    productCount: 'Quantidade de Produtos',
    averageShare: 'Espaço Médio por Produto',
    status: 'Status',
    optimal: 'Ótimo',
    underutilized: 'Subutilizada',
    overutilized: 'Superutilizada',
    zoneDistribution: 'Distribuição por Zona',
    occupancyTrend: 'Tendência de Ocupação',
    zone: 'Zona',
    occupancy: 'Ocupação (%)',
    products: 'Produtos',
    recommendations: 'Recomendações',
    recommendEyeLevelIncrease: 'Aumentar produtos na Altura dos Olhos para maximizar visibilidade',
    recommendHandLevelBalance: 'Balancear Altura das Mãos com produtos de alto giro',
    recommendBottomShelfOptimize: 'Otimizar Parte de Baixo com produtos de baixa margem',
    noProducts: 'Nenhum produto adicionado',
    totalOccupancy: 'Ocupação Total',
    averageOccupancy: 'Ocupação Média por Zona',
  },
  en: {
    title: 'Zone Occupancy Report',
    eyeLevel: 'Eye Level',
    handLevel: 'Hand Level',
    bottomShelf: 'Bottom Shelf',
    occupancyRate: 'Occupancy Rate',
    productCount: 'Product Count',
    averageShare: 'Average Space per Product',
    status: 'Status',
    optimal: 'Optimal',
    underutilized: 'Underutilized',
    overutilized: 'Overutilized',
    zoneDistribution: 'Distribution by Zone',
    occupancyTrend: 'Occupancy Trend',
    zone: 'Zone',
    occupancy: 'Occupancy (%)',
    products: 'Products',
    recommendations: 'Recommendations',
    recommendEyeLevelIncrease: 'Increase products at Eye Level to maximize visibility',
    recommendHandLevelBalance: 'Balance Hand Level with high-velocity products',
    recommendBottomShelfOptimize: 'Optimize Bottom Shelf with low-margin products',
    noProducts: 'No products added',
    totalOccupancy: 'Total Occupancy',
    averageOccupancy: 'Average Occupancy by Zone',
  },
};

function normalizeZone(zone: string | undefined): string {
  if (!zone) return 'Altura das mãos';

  const zoneMap: Record<string, string> = {
    'Altura dos olhos': 'Altura dos olhos',
    'Eye level': 'Altura dos olhos',
    'Altura das mãos': 'Altura das mãos',
    'Hand level': 'Altura das mãos',
    'Parte de Baixo': 'Parte de Baixo',
    'Bottom shelf': 'Parte de Baixo',
  };

  return zoneMap[zone] || 'Altura das mãos';
}

function getZoneLabel(zone: string, language: string): string {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  switch (zone) {
    case 'Altura dos olhos':
      return t.eyeLevel;
    case 'Altura das mãos':
      return t.handLevel;
    case 'Parte de Baixo':
      return t.bottomShelf;
    default:
      return zone;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'optimal':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'underutilized':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'overutilized':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'optimal':
      return '#10B981'; // Green
    case 'underutilized':
      return '#F59E0B'; // Amber
    case 'overutilized':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
}

export function ZoneOccupancyReport({
  products,
  shelfCount = 5,
  language = 'pt',
}: ZoneOccupancyReportProps) {
  const { language: contextLanguage } = useLanguage();
  const lang = language || contextLanguage;
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];

  const zoneMetrics = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const zones = ['Altura dos olhos', 'Altura das mãos', 'Parte de Baixo'];
    const metrics: ZoneMetrics[] = [];

    zones.forEach((zone) => {
      const zoneProducts = products.filter((p) => normalizeZone(p.zone || p.zona) === zone);
      const totalShare = zoneProducts.reduce((sum, p) => sum + (p.share || 0), 0);
      const productCount = zoneProducts.length;
      const averageShare = productCount > 0 ? totalShare / productCount : 0;

      // Determinar status baseado em ocupação
      let status: 'optimal' | 'underutilized' | 'overutilized' = 'optimal';
      if (totalShare < 20) {
        status = 'underutilized';
      } else if (totalShare > 80) {
        status = 'overutilized';
      }

      metrics.push({
        zone,
        totalShare,
        productCount,
        occupancyPercentage: Math.min(totalShare, 100),
        averageSharePerProduct: averageShare,
        status,
      });
    });

    return metrics.sort((a, b) => b.occupancyPercentage - a.occupancyPercentage);
  }, [products]);

  const chartData = useMemo(() => {
    return zoneMetrics.map((metric) => ({
      zone: getZoneLabel(metric.zone, lang),
      occupancy: Math.round(metric.occupancyPercentage),
      products: metric.productCount,
      averageShare: Math.round(metric.averageSharePerProduct * 10) / 10,
    }));
  }, [zoneMetrics, lang]);

  const pieData = useMemo(() => {
    return zoneMetrics.map((metric) => ({
      name: getZoneLabel(metric.zone, lang),
      value: Math.round(metric.occupancyPercentage),
    }));
  }, [zoneMetrics, lang]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];

    zoneMetrics.forEach((metric) => {
      if (metric.zone === 'Altura dos olhos' && metric.occupancyPercentage < 40) {
        recs.push(t.recommendEyeLevelIncrease);
      }
      if (metric.zone === 'Altura das mãos' && metric.occupancyPercentage < 30) {
        recs.push(t.recommendHandLevelBalance);
      }
      if (metric.zone === 'Parte de Baixo' && metric.occupancyPercentage > 70) {
        recs.push(t.recommendBottomShelfOptimize);
      }
    });

    return recs.length > 0 ? recs : [];
  }, [zoneMetrics, t]);

  const totalOccupancy = useMemo(() => {
    return Math.round(zoneMetrics.reduce((sum, m) => sum + m.occupancyPercentage, 0) / 3);
  }, [zoneMetrics]);

  if (products.length === 0) {
    return (
      <Card className="p-6 bg-gray-50">
        <p className="text-center text-gray-500">{t.noProducts}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          {t.title}
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t.totalOccupancy}</p>
              <p className="text-3xl font-bold text-blue-600">{totalOccupancy}%</p>
            </div>
            <div className="text-4xl text-blue-200">📊</div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t.productCount}</p>
              <p className="text-3xl font-bold text-purple-600">{products.length}</p>
            </div>
            <div className="text-4xl text-purple-200">📦</div>
          </div>
        </Card>
      </div>

      {/* Zone Metrics Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.occupancyRate}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 text-gray-600 font-medium">{t.zone}</th>
                <th className="text-center py-2 px-4 text-gray-600 font-medium">{t.occupancy}</th>
                <th className="text-center py-2 px-4 text-gray-600 font-medium">{t.products}</th>
                <th className="text-center py-2 px-4 text-gray-600 font-medium">{t.averageShare}</th>
                <th className="text-center py-2 px-4 text-gray-600 font-medium">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {zoneMetrics.map((metric, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {getZoneLabel(metric.zone, lang)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${metric.occupancyPercentage}%`,
                            backgroundColor: getStatusColor(metric.status),
                          }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">
                        {Math.round(metric.occupancyPercentage)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{metric.productCount}</td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {Math.round(metric.averageSharePerProduct * 10) / 10}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="text-xs font-medium">
                        {metric.status === 'optimal'
                          ? t.optimal
                          : metric.status === 'underutilized'
                            ? t.underutilized
                            : t.overutilized}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Occupancy by Zone */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.occupancyTrend}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="zone" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="occupancy" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(zoneMetrics[index]?.status || 'optimal')}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Zone Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.zoneDistribution}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(zoneMetrics[index]?.status || 'optimal')}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-amber-50 border-amber-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {t.recommendations}
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
