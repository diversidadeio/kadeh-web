/**
 * Exposure Metrics Dashboard Component
 * Visualiza taxa de ocupação por prateleira, produtos mais expostos e recomendações
 */

import { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { calculateExposureMetrics, getProductRecommendation, type Product, type ExposureMetrics } from '@/utils/exposureMetricsEngine';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExposureMetricsDashboardProps {
  products: Product[];
  language?: 'pt' | 'en';
}

const TRANSLATIONS = {
  pt: {
    title: 'Dashboard de Métricas de Exposição',
    occupancyByShelf: 'Taxa de Ocupação por Prateleira',
    topExposedProducts: 'Produtos Mais Expostos',
    underexposedProducts: 'Produtos Subexpostos',
    recommendations: 'Recomendações de Ajuste',
    shelf: 'Prateleira',
    occupancy: 'Ocupação',
    zone: 'Zona',
    product: 'Produto',
    score: 'Score',
    exposure: 'Exposição',
    velocity: 'Giro',
    margin: 'Margem',
    recommendation: 'Recomendação',
    noProducts: 'Nenhum produto adicionado',
    noRecommendations: 'Nenhuma recomendação no momento',
    optimal: 'Ótimo',
    underutilized: 'Subutilizada',
    overutilized: 'Superutilizada',
    eyeLevel: 'Altura dos Olhos',
    handLevel: 'Altura das Mãos',
    bottomShelf: 'Parte de Baixo',
    averageOccupancy: 'Ocupação Média',
    totalOccupancy: 'Ocupação Total',
  },
  en: {
    title: 'Exposure Metrics Dashboard',
    occupancyByShelf: 'Occupancy Rate by Shelf',
    topExposedProducts: 'Most Exposed Products',
    underexposedProducts: 'Underexposed Products',
    recommendations: 'Adjustment Recommendations',
    shelf: 'Shelf',
    occupancy: 'Occupancy',
    zone: 'Zone',
    product: 'Product',
    score: 'Score',
    exposure: 'Exposure',
    velocity: 'Velocity',
    margin: 'Margin',
    recommendation: 'Recommendation',
    noProducts: 'No products added',
    noRecommendations: 'No recommendations at this time',
    optimal: 'Optimal',
    underutilized: 'Underutilized',
    overutilized: 'Overutilized',
    eyeLevel: 'Eye Level',
    handLevel: 'Hand Level',
    bottomShelf: 'Bottom Shelf',
    averageOccupancy: 'Average Occupancy',
    totalOccupancy: 'Total Occupancy',
  },
};

function getZoneLabel(zone: string, language: string): string {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  switch (zone) {
    case 'Altura dos olhos':
    case 'Eye level':
      return t.eyeLevel;
    case 'Altura das mãos':
    case 'Hand level':
      return t.handLevel;
    case 'Parte de Baixo':
    case 'Bottom shelf':
      return t.bottomShelf;
    default:
      return zone;
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

function getStatusLabel(status: string, language: string): string {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  switch (status) {
    case 'optimal':
      return t.optimal;
    case 'underutilized':
      return t.underutilized;
    case 'overutilized':
      return t.overutilized;
    default:
      return status;
  }
}

export default function ExposureMetricsDashboard({
  products,
  language = 'pt',
}: ExposureMetricsDashboardProps) {
  const { language: contextLanguage } = useLanguage();
  const lang = language || contextLanguage;
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];

  const metrics = useMemo(() => {
    return calculateExposureMetrics(products, lang as 'pt' | 'en');
  }, [products, lang]);

  if (products.length === 0) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-500">{t.noProducts}</p>
      </div>
    );
  }

  // Preparar dados para gráfico de ocupação por prateleira
  const occupancyChartData = metrics.shelfOccupancy.map((shelf) => ({
    name: `${t.shelf} ${shelf.shelfNumber}`,
    occupancy: Math.round(shelf.occupancyPercentage),
    zone: getZoneLabel(shelf.zone, lang),
    status: shelf.status,
  }));

  // Preparar dados para gráfico de score de exposição
  const exposureChartData = metrics.topExposedProducts.map((product) => ({
    name: product.productName.substring(0, 15),
    score: Math.round(product.exposureScore),
    fullName: product.productName,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          {t.title}
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          {t.totalOccupancy}: <span className="font-semibold text-gray-900">{Math.round(metrics.totalOccupancyPercentage)}%</span> | 
          {' '}{t.averageOccupancy}: <span className="font-semibold text-gray-900">{Math.round(metrics.averageOccupancyPercentage)}%</span>
        </p>
      </div>

      {/* Occupancy by Shelf Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-600" />
          {t.occupancyByShelf}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={occupancyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value) => `${value}%`}
              labelFormatter={(label) => label}
              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="occupancy" fill="#3B82F6" radius={[8, 8, 0, 0]}>
              {occupancyChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Exposed Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          {t.topExposedProducts}
        </h3>
        <div className="space-y-3">
          {metrics.topExposedProducts.length > 0 ? (
            metrics.topExposedProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-700 bg-green-200 rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-600">
                        {t.zone}: {getZoneLabel(product.zone, lang)} | {t.velocity}: {product.velocity} | {t.margin}: {product.margin}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{Math.round(product.exposureScore)}</p>
                  <p className="text-xs text-gray-600">{t.score}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">{t.noProducts}</p>
          )}
        </div>
      </Card>

      {/* Underexposed Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          {t.underexposedProducts}
        </h3>
        <div className="space-y-3">
          {metrics.underexposedProducts.length > 0 ? (
            metrics.underexposedProducts.map((product, index) => {
              const foundProduct = products.find((p) => p.id === product.productId);
              const recommendation = foundProduct ? getProductRecommendation(
                foundProduct,
                lang as 'pt' | 'en'
              ) : undefined;
              return (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-amber-700 bg-amber-200 rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-xs text-gray-600">
                          {t.zone}: {getZoneLabel(product.zone, lang)} | {t.velocity}: {product.velocity} | {t.margin}: {product.margin}
                        </p>
                        {recommendation && (
                          <p className="text-xs text-amber-700 font-medium mt-1">💡 {recommendation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">{Math.round(product.exposureScore)}</p>
                    <p className="text-xs text-gray-600">{t.score}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">{t.noProducts}</p>
          )}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          {t.recommendations}
        </h3>
        {metrics.recommendations.length > 0 ? (
          <ul className="space-y-2">
            {metrics.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center py-4">{t.noRecommendations}</p>
        )}
      </Card>

      {/* Shelf Status Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Prateleiras</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {metrics.shelfOccupancy.map((shelf) => (
            <div
              key={shelf.shelfNumber}
              className="p-3 rounded-lg border-2 text-center"
              style={{
                borderColor: getStatusColor(shelf.status),
                backgroundColor: getStatusColor(shelf.status) + '15',
              }}
            >
              <p className="text-sm font-semibold text-gray-900">{t.shelf} {shelf.shelfNumber}</p>
              <p className="text-xs text-gray-600 mb-2">{getZoneLabel(shelf.zone, lang)}</p>
              <p className="text-2xl font-bold" style={{ color: getStatusColor(shelf.status) }}>
                {Math.round(shelf.occupancyPercentage)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {shelf.productCount} {t.product}{shelf.productCount !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
