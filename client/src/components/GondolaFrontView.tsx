import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  zona?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
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

/**
 * Renderiza uma prateleira com produtos distribuídos por largura
 * Regra: produtos são repetidos para preencher toda a largura disponível
 */
function renderShelf(
  productsInZone: Product[],
  totalWidth: number,
  shelfHeight: number,
  zoneColor: any,
  language: string
) {
  if (productsInZone.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
        {language === 'pt' ? 'Sem produtos' : 'No products'}
      </div>
    );
  }

  // Calcular largura total dos produtos
  const totalProductWidth = productsInZone.reduce((sum, p) => sum + (p.largura || 10), 0);
  
  // Calcular quantas vezes os produtos precisam se repetir para preencher a prateleira
  const repetitions = Math.max(1, Math.ceil(totalWidth / totalProductWidth));
  
  // Criar array com produtos repetidos
  const repeatedProducts: (Product & { repeatIndex: number })[] = [];
  for (let i = 0; i < repetitions; i++) {
    productsInZone.forEach((product, index) => {
      repeatedProducts.push({
        ...product,
        repeatIndex: i,
        id: `${product.id}-repeat-${i}-${index}`,
      });
    });
  }

  // Calcular largura de cada item (em pixels ou percentual)
  const itemWidthPercent = 100 / repeatedProducts.length;

  return (
    <div className="flex w-full h-full overflow-hidden">
      {repeatedProducts.map((product, index) => {
        const productWidth = product.largura || 10;
        const widthPercent = (productWidth / (totalProductWidth * repetitions)) * 100;

        return (
          <div
            key={product.id}
            className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 p-2 overflow-hidden transition-all hover:opacity-80"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: zoneColor.bg,
              minWidth: '30px',
            }}
            title={`${product.name} - ${productWidth}cm`}
          >
            <span className="text-xs font-bold text-gray-800 text-center truncate line-clamp-2">
              {product.name}
            </span>
            <span className="text-xs text-gray-600 font-semibold">
              {productWidth}cm
            </span>
          </div>
        );
      })}
    </div>
  );
}

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

  const colors = language === 'pt' ? zoneColors : zoneColorsEn;

  // REGRA 1: Se há apenas 1 produto, ele ocupa todo o espaço em todas as prateleiras
  if (products.length === 1) {
    const singleProduct = products[0];
    return (
      <div className="w-full space-y-6">
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4 space-y-4">
            {/* Bottom Shelf */}
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
                  backgroundColor: colors['Parte de Baixo'].bg,
                }}
              >
                <div className="w-full flex flex-col items-center justify-center p-2">
                  <span className="text-sm font-bold text-gray-800 text-center">
                    {singleProduct.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {singleProduct.largura || 10}cm
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Shelf - Hand Level */}
            <div>
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
                  backgroundColor: colors['Altura das mãos'].bg,
                }}
              >
                <div className="w-full flex flex-col items-center justify-center p-2">
                  <span className="text-sm font-bold text-gray-800 text-center">
                    {singleProduct.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {singleProduct.largura || 10}cm
                  </span>
                </div>
              </div>
            </div>

            {/* Top Shelf - Eye Level */}
            <div>
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
                  backgroundColor: colors['Altura dos olhos'].bg,
                }}
              >
                <div className="w-full flex flex-col items-center justify-center p-2">
                  <span className="text-sm font-bold text-gray-800 text-center">
                    {singleProduct.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {singleProduct.largura || 10}cm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REGRA 2 & 3: Múltiplos produtos - distribuir por zona e repetir por largura
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.zona) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.zona) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.zona) === 'Parte de Baixo'),
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4 space-y-4">
          {/* Bottom Shelf */}
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
              className="border-2 rounded-md overflow-hidden"
              style={{
                borderColor: colors['Parte de Baixo'].border,
                height: `${shelfHeight}px`,
              }}
            >
              {renderShelf(
                productsByZone['Parte de Baixo'],
                totalWidth,
                shelfHeight,
                colors['Parte de Baixo'],
                language
              )}
            </div>
          </div>

          {/* Middle Shelf - Hand Level */}
          <div>
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
              className="border-2 rounded-md overflow-hidden"
              style={{
                borderColor: colors['Altura das mãos'].border,
                height: `${shelfHeight}px`,
              }}
            >
              {renderShelf(
                productsByZone['Altura das mãos'],
                totalWidth,
                shelfHeight,
                colors['Altura das mãos'],
                language
              )}
            </div>
          </div>

          {/* Top Shelf - Eye Level */}
          <div>
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
              className="border-2 rounded-md overflow-hidden"
              style={{
                borderColor: colors['Altura dos olhos'].border,
                height: `${shelfHeight}px`,
              }}
            >
              {renderShelf(
                productsByZone['Altura dos olhos'],
                totalWidth,
                shelfHeight,
                colors['Altura dos olhos'],
                language
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-3">
          {language === 'pt' ? 'Legenda de Zonas' : 'Zone Legend'}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(colors).map(([zone, color]) => (
            <div key={zone} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{
                  backgroundColor: color.bg,
                  borderColor: color.border,
                }}
              />
              <span className="text-xs text-gray-700">{color.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
