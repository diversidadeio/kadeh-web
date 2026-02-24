import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useLanguage } from '@/contexts/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

export interface ZoneStats {
  zone: "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo";
  productCount: number;
  shelfCount: number;
  percentage: number;
  color: string;
}

interface ZoneDistributionChartProps {
  stats: ZoneStats[];
  totalShelves: number;
  totalProducts: number;
}

export function ZoneDistributionChart({
  stats,
  totalShelves,
  totalProducts,
}: ZoneDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const { language } = useLanguage();
  const isPortuguese = language === 'pt';

  const labels = {
    pt: {
      eyeLevel: "Altura dos Olhos",
      handLevel: "Altura das Mãos",
      bottomLevel: "Parte de Baixo",
      occupancy: "Ocupação",
      shelves: "Prateleiras",
      products: "Produtos",
      distribution: "Distribuição por Zona",
    },
    en: {
      eyeLevel: "Eye Level",
      handLevel: "Hand Level",
      bottomLevel: "Bottom Shelf",
      occupancy: "Occupancy",
      shelves: "Shelves",
      products: "Products",
      distribution: "Zone Distribution",
    },
  };

  const currentLabels = labels[language as keyof typeof labels] || labels.pt;

  useEffect(() => {
    if (!chartRef.current || stats.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const zoneNames = stats.map((s) => {
      if (s.zone === "Altura dos olhos") return currentLabels.eyeLevel;
      if (s.zone === "Altura das mãos") return currentLabels.handLevel;
      return currentLabels.bottomLevel;
    });

    const productCounts = stats.map((s) => s.productCount);
    const colors = stats.map((s) => s.color);

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 15,
            font: {
              size: 12,
              weight: 'bold',
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 13,
            weight: 'bold',
          },
          bodyFont: {
            size: 12,
          },
          callbacks: {
            label: function (context: any) {
              const stat = stats[context.dataIndex];
              return [
                `${currentLabels.products}: ${stat.productCount}`,
                `${currentLabels.shelves}: ${stat.shelfCount}`,
                `${currentLabels.occupancy}: 100%`,
              ];
            },
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: zoneNames,
        datasets: [
          {
            data: productCounts,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stats, language, currentLabels]);

  if (stats.length === 0 || totalProducts === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">
          {language === 'pt'
            ? 'Adicione produtos para visualizar a distribuição'
            : 'Add products to view distribution'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {currentLabels.distribution}
        </h3>

        <div className="relative h-64">
          <canvas ref={chartRef} />
        </div>

        {/* Zone Statistics Table */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const zoneName =
              stat.zone === "Altura dos olhos"
                ? currentLabels.eyeLevel
                : stat.zone === "Altura das mãos"
                  ? currentLabels.handLevel
                  : currentLabels.bottomLevel;

            return (
              <div
                key={stat.zone}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: stat.color, backgroundColor: `${stat.color}15` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <p className="font-semibold text-gray-900">{zoneName}</p>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.shelves}:</span>
                    <span className="font-bold text-gray-900">{stat.shelfCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.products}:</span>
                    <span className="font-bold text-gray-900">{stat.productCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.occupancy}:</span>
                    <span className="font-bold text-green-600">100%</span>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ backgroundColor: stat.color, width: '100%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'pt' ? 'Total de Prateleiras' : 'Total Shelves'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalShelves}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {language === 'pt' ? 'Total de Produtos' : 'Total Products'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm font-semibold text-blue-900">
              ✓ {language === 'pt'
                ? 'Todas as prateleiras 100% ocupadas'
                : 'All shelves 100% occupied'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
