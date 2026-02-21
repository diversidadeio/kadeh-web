import React, { useMemo } from 'react';
import { calculateFronts, calculateShelfLayout, generateLayoutDescription } from '@/utils/frontCalculator';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  width: number; // Largura em cm
  percentage: number; // Percentual de espaço na gôndola
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  quadrantes: number;
}

interface GondolaVisualizationWithShelvesProps {
  products: Product[];
  totalWidth?: number; // Largura total da gôndola em cm
  numberOfShelves?: number; // Número de prateleiras
  shelfHeight?: number; // Altura de cada prateleira em pixels
  language?: 'pt' | 'en';
}

const zoneColors = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Altura dos olhos', labelEn: 'Eye Level' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Altura das mãos', labelEn: 'Hand Level' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Parte de Baixo', labelEn: 'Bottom Shelf' },
};

export default function GondolaVisualizationWithShelves({
  products,
  totalWidth = 280,
  numberOfShelves = 5,
  shelfHeight = 60,
  language = 'pt',
}: GondolaVisualizationWithShelvesProps) {
  // Calcular layout das prateleiras
  const shelfLayout = useMemo(() => {
    if (products.length === 0) return [];

    const productDistributions = products.map((p) => ({
      productId: p.id,
      productName: p.name,
      productWidth: p.width,
      percentageOfGondola: p.percentage,
      fronts: calculateFronts({
        productWidth: p.width,
        percentageOfGondola: p.percentage,
        totalGondolaWidth: totalWidth,
        numberOfShelves,
      }),
    }));

    return calculateShelfLayout(productDistributions, totalWidth, numberOfShelves);
  }, [products, totalWidth, numberOfShelves]);

  // Calcular estatísticas
  const statistics = useMemo(() => {
    const totalFronts = shelfLayout.reduce(
      (sum, shelf) => sum + shelf.products.length,
      0
    );
    const totalWidthUsed = shelfLayout.reduce(
      (sum, shelf) => sum + shelf.totalWidthUsed,
      0
    );
    const utilizationPercentage = totalWidth > 0 ? (totalWidthUsed / totalWidth) * 100 : 0;

    return {
      totalFronts,
      totalWidthUsed,
      utilizationPercentage,
      averageFrontsPerShelf: totalFronts > 0 ? Math.ceil(totalFronts / numberOfShelves) : 0,
    };
  }, [shelfLayout, totalWidth, numberOfShelves]);

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

  return (
    <div className="w-full space-y-6">
      {/* Visualização da Gôndola com Prateleiras */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4">
          {/* Título */}
          <div className="mb-4 pb-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              {language === 'pt' ? 'Visualização da Gôndola' : 'Gondola Visualization'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {language === 'pt'
                ? `${numberOfShelves} prateleiras × ${totalWidth}cm de largura`
                : `${numberOfShelves} shelves × ${totalWidth}cm width`}
            </p>
          </div>

          {/* Prateleiras */}
          <div className="space-y-4">
            {shelfLayout.map((shelf) => (
              <div key={shelf.shelfNumber} className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                {/* Cabeçalho da Prateleira */}
                <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-gray-700">
                      {language === 'pt' ? 'Prateleira' : 'Shelf'} {shelf.shelfNumber}
                    </span>
                    <span className="text-xs text-gray-600">
                      {shelf.totalWidthUsed.toFixed(1)}cm / {totalWidth}cm
                      {' '}
                      ({((shelf.totalWidthUsed / totalWidth) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>

                {/* Produtos na Prateleira */}
                <div
                  className="flex border-t border-gray-200 overflow-hidden"
                  style={{ height: `${shelfHeight}px` }}
                >
                  {shelf.products.length > 0 ? (
                    shelf.products.map((product, idx) => {
                      const productData = products.find((p) => p.id === product.productId);
                      const zoneColor = productData ? zoneColors[productData.zone] : zoneColors['Altura das mãos'];
                      const widthPercent = (product.widthUsed / totalWidth) * 100;

                      return (
                        <div
                          key={`${shelf.shelfNumber}-${idx}`}
                          className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 p-2 overflow-hidden flex-shrink-0"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: zoneColor.bg,
                            borderColor: zoneColor.border,
                          }}
                          title={`${product.productName} - ${product.widthUsed}cm`}
                        >
                          <span className="text-xs font-bold text-gray-800 text-center truncate">
                            {product.productName.substring(0, 10)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {product.widthUsed}cm
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full flex items-center justify-center text-gray-400 text-xs">
                      {language === 'pt' ? 'Sem produtos' : 'No products'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Base da Gôndola */}
          <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 mt-4 rounded-b-lg" />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 mb-2">
            {language === 'pt' ? 'Total de Frentes' : 'Total Fronts'}
          </p>
          <p className="text-2xl font-bold text-blue-900">{statistics.totalFronts}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs font-semibold text-green-600 mb-2">
            {language === 'pt' ? 'Espaço Utilizado' : 'Space Used'}
          </p>
          <p className="text-2xl font-bold text-green-900">
            {statistics.totalWidthUsed.toFixed(0)}cm
          </p>
          <p className="text-xs text-green-600 mt-1">
            {statistics.utilizationPercentage.toFixed(0)}%
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-xs font-semibold text-purple-600 mb-2">
            {language === 'pt' ? 'Média por Prateleira' : 'Avg per Shelf'}
          </p>
          <p className="text-2xl font-bold text-purple-900">
            {statistics.averageFrontsPerShelf}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {language === 'pt' ? 'frentes' : 'fronts'}
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-xs font-semibold text-orange-600 mb-2">
            {language === 'pt' ? 'Número de Prateleiras' : 'Number of Shelves'}
          </p>
          <p className="text-2xl font-bold text-orange-900">{numberOfShelves}</p>
        </div>
      </div>

      {/* Legenda de Zonas */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(zoneColors).map(([zone, config]) => (
          <div key={zone} className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
            <div
              className="w-6 h-6 rounded border-2"
              style={{ backgroundColor: config.bg, borderColor: config.border }}
            />
            <span className="text-xs font-medium text-gray-700">
              {language === 'pt' ? config.label : config.labelEn}
            </span>
          </div>
        ))}
      </div>

      {/* Descrição Textual */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-2">
          {language === 'pt' ? 'Distribuição Detalhada' : 'Detailed Distribution'}
        </p>
        <pre className="text-xs text-gray-700 overflow-auto max-h-48 whitespace-pre-wrap break-words font-mono">
          {generateLayoutDescription(shelfLayout, language)}
        </pre>
      </div>
    </div>
  );
}
