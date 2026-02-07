import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  zona: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  quadrantes: number;
  largura?: number;
  share?: number;
}

interface GondolaFrontViewProps {
  products: Product[];
  totalWidth?: number;
  shelfHeight?: number;
  language?: 'pt' | 'en';
}

const zoneColors = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Altura dos olhos' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Altura das mãos' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Parte de Baixo' },
};

const zoneColorsEn = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Eye Level' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Hand Level' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Bottom Shelf' },
};

export default function GondolaFrontView({
  products,
  totalWidth = 280,
  shelfHeight = 60,
  language = 'pt',
}: GondolaFrontViewProps) {
  if (products.length === 0) {
    return (
      <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm">
          {language === 'pt'
            ? 'Nenhum produto adicionado à simulação'
            : 'No products added to the simulation'}
        </p>
      </div>
    );
  }

  // Group products by zone
  const productsByZone = {
    'Altura dos olhos': products.filter(p => p.zona === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => p.zona === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => p.zona === 'Parte de Baixo'),
  };

  const colors = language === 'pt' ? zoneColors : zoneColorsEn;

  // Calculate total share for normalization
  const totalShare = products.reduce((sum, p) => sum + (p.share || 0), 0);

  return (
    <div className="w-full space-y-6">
      {/* Front View Visualization */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        {/* Shelf Structure */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4">
          {/* Top Shelf (Altura dos olhos) */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors['Altura dos olhos'].bg }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {colors['Altura dos olhos'].label}
              </span>
            </div>
            <div
              className="flex border-2 rounded-md overflow-hidden"
              style={{
                borderColor: colors['Altura dos olhos'].border,
                height: `${shelfHeight}px`,
              }}
            >
              {productsByZone['Altura dos olhos'].map((product) => {
                const widthPercent = totalShare > 0 ? ((product.share || 0) / totalShare) * 100 : 0;
                return (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 bg-gradient-to-b from-yellow-100 to-yellow-50 p-2 overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                    title={`${product.name} - ${(widthPercent).toFixed(1)}%`}
                  >
                    <span className="text-xs font-bold text-gray-800 text-center truncate">
                      {product.name.substring(0, 12)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {(widthPercent).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
              {productsByZone['Altura dos olhos'].length === 0 && (
                <div className="w-full flex items-center justify-center text-gray-400 text-xs">
                  {language === 'pt' ? 'Sem produtos' : 'No products'}
                </div>
              )}
            </div>
          </div>

          {/* Middle Shelf (Altura das mãos) */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors['Altura das mãos'].bg }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {colors['Altura das mãos'].label}
              </span>
            </div>
            <div
              className="flex border-2 rounded-md overflow-hidden"
              style={{
                borderColor: colors['Altura das mãos'].border,
                height: `${shelfHeight}px`,
              }}
            >
              {productsByZone['Altura das mãos'].map((product) => {
                const widthPercent = totalShare > 0 ? ((product.share || 0) / totalShare) * 100 : 0;
                return (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 bg-gradient-to-b from-blue-100 to-blue-50 p-2 overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                    title={`${product.name} - ${(widthPercent).toFixed(1)}%`}
                  >
                    <span className="text-xs font-bold text-gray-800 text-center truncate">
                      {product.name.substring(0, 12)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {(widthPercent).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
              {productsByZone['Altura das mãos'].length === 0 && (
                <div className="w-full flex items-center justify-center text-gray-400 text-xs">
                  {language === 'pt' ? 'Sem produtos' : 'No products'}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Shelf (Parte de Baixo) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors['Parte de Baixo'].bg }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {colors['Parte de Baixo'].label}
              </span>
            </div>
            <div
              className="flex border-2 rounded-md overflow-hidden"
              style={{
                borderColor: colors['Parte de Baixo'].border,
                height: `${shelfHeight}px`,
              }}
            >
              {productsByZone['Parte de Baixo'].map((product) => {
                const widthPercent = totalShare > 0 ? ((product.share || 0) / totalShare) * 100 : 0;
                return (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 bg-gradient-to-b from-green-100 to-green-50 p-2 overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                    title={`${product.name} - ${(widthPercent).toFixed(1)}%`}
                  >
                    <span className="text-xs font-bold text-gray-800 text-center truncate">
                      {product.name.substring(0, 12)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {(widthPercent).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
              {productsByZone['Parte de Baixo'].length === 0 && (
                <div className="w-full flex items-center justify-center text-gray-400 text-xs">
                  {language === 'pt' ? 'Sem produtos' : 'No products'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shelf Base */}
        <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500" />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(colors).map(([zone, config]) => (
          <div key={zone} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <div
              className="w-6 h-6 rounded border-2"
              style={{ backgroundColor: config.bg, borderColor: config.border }}
            />
            <span className="text-xs font-medium text-gray-700">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(productsByZone).map(([zone, zoneProducts]) => (
          <div key={zone} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              {colors[zone as keyof typeof colors].label}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {zoneProducts.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'pt' ? 'produtos' : 'products'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
