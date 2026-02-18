import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Lugar baixo' | 'Eye Level' | 'Hand Level' | 'Bottom Shelf';
  quadrantes?: number;
  largura?: number;
  comprimento?: number;
  color?: string;
}

interface GondolaFrontViewProps {
  products: Product[];
  totalWidth?: number;
  shelfHeight?: number;
  language?: 'pt' | 'en';
}

const zoneConfig = {
  pt: {
    'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Altura dos olhos', textColor: '#92400E' },
    'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Altura das mãos', textColor: '#1E40AF' },
    'Lugar baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Parte de Baixo', textColor: '#15803D' },
  },
  en: {
    'Eye Level': { bg: '#FEF3C7', border: '#FBBF24', label: 'Eye Level', textColor: '#92400E' },
    'Hand Level': { bg: '#DBEAFE', border: '#3B82F6', label: 'Hand Level', textColor: '#1E40AF' },
    'Bottom Shelf': { bg: '#DCFCE7', border: '#22C55E', label: 'Bottom Shelf', textColor: '#15803D' },
  },
};

export default function GondolaFrontView({
  products,
  totalWidth = 280,
  shelfHeight = 60,
  language = 'pt',
}: GondolaFrontViewProps) {
  // Map zones to standard names
  const normalizeZone = (zone: string): string => {
    if (zone === 'Altura dos olhos' || zone === 'Eye Level') return language === 'pt' ? 'Altura dos olhos' : 'Eye Level';
    if (zone === 'Altura das mãos' || zone === 'Hand Level') return language === 'pt' ? 'Altura das mãos' : 'Hand Level';
    if (zone === 'Lugar baixo' || zone === 'Bottom Shelf') return language === 'pt' ? 'Lugar baixo' : 'Bottom Shelf';
    return zone;
  };

  // Group products by zone
  const eyeLevelZone = language === 'pt' ? 'Altura dos olhos' : 'Eye Level';
  const handLevelZone = language === 'pt' ? 'Altura das mãos' : 'Hand Level';
  const bottomLevelZone = language === 'pt' ? 'Lugar baixo' : 'Bottom Shelf';

  const productsByZone = {
    eyeLevel: products.filter(p => {
      const normalized = normalizeZone(p.zone);
      return normalized === eyeLevelZone;
    }),
    handLevel: products.filter(p => {
      const normalized = normalizeZone(p.zone);
      return normalized === handLevelZone;
    }),
    bottomLevel: products.filter(p => {
      const normalized = normalizeZone(p.zone);
      return normalized === bottomLevelZone;
    }),
  };

  const config = zoneConfig[language as keyof typeof zoneConfig] || zoneConfig.pt;

  // Cores padrão para produtos
  const defaultColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC', '#55EFC4',
  ];

  const getProductColor = (index: number) => {
    return defaultColors[index % defaultColors.length];
  };

  const renderShelf = (zoneProducts: Product[], zoneKey: 'eyeLevel' | 'handLevel' | 'bottomLevel', zoneLabel: string) => {
    const zoneConfig = config[zoneLabel as keyof typeof config] || { bg: '#F3F4F6', border: '#9CA3AF', label: zoneLabel, textColor: '#374151' };
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-5 h-5 rounded-sm border-2"
            style={{
              backgroundColor: (zoneConfig as any).bg,
              borderColor: (zoneConfig as any).border,
            }}
          />
          <span className="text-sm font-bold" style={{ color: (zoneConfig as any).textColor }}>
            {(zoneConfig as any).label}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            ({zoneProducts.length} {language === 'pt' ? 'produtos' : 'products'})
          </span>
        </div>
        
        <div
          className="flex border-4 rounded-lg overflow-hidden bg-white shadow-md"
          style={{
            borderColor: (zoneConfig as any).border,
            minHeight: `${shelfHeight + 20}px`,
          }}
        >
          {zoneProducts.length > 0 ? (
            zoneProducts.map((product, idx) => {
              const productWidth = Math.max(40, (product.largura || 5) * 2);
              const backgroundColor = product.color || getProductColor(idx);
              
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center justify-center flex-shrink-0 border-r border-gray-200 last:border-r-0 p-2 text-white font-semibold text-center transition-transform hover:scale-105"
                  style={{
                    width: `${productWidth}px`,
                    minHeight: `${shelfHeight}px`,
                    backgroundColor: backgroundColor,
                    opacity: 0.9,
                  }}
                  title={`${product.name}${product.quadrantes ? ` - ${product.quadrantes} quadrantes` : ''}${product.largura && product.comprimento ? ` - ${product.largura}×${product.comprimento}cm` : ''}`}
                >
                  <span className="text-xs font-bold leading-tight truncate max-w-[90%]">
                    {product.name.substring(0, 10)}
                  </span>
                  {product.quadrantes && (
                    <span className="text-[10px] leading-tight mt-1">
                      {product.quadrantes}x
                    </span>
                  )}
                  {product.largura && product.comprimento && (
                    <span className="text-[9px] leading-tight mt-1 opacity-80">
                      {product.largura}×{product.comprimento}cm
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center text-gray-400 text-sm">
              {language === 'pt' ? 'Sem produtos' : 'No products'}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Check if there are any products
  const hasProducts = products.length > 0;

  if (!hasProducts) {
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
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">
          {language === 'pt' ? 'Visualização da Gôndola - Vista de Frente' : 'Gondola Visualization - Front View'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {language === 'pt'
            ? 'Disposição dos produtos por zona de exposição'
            : 'Product arrangement by exposure zone'}
        </p>
      </div>

      {/* Front View Visualization */}
      <div className="bg-white border-4 border-gray-300 rounded-lg overflow-hidden shadow-xl p-6 space-y-6">
        {/* Eye Level Shelf */}
        {renderShelf(productsByZone.eyeLevel, 'eyeLevel', eyeLevelZone)}

        {/* Hand Level Shelf */}
        {renderShelf(productsByZone.handLevel, 'handLevel', handLevelZone)}

        {/* Bottom Level Shelf */}
        {renderShelf(productsByZone.bottomLevel, 'bottomLevel', bottomLevelZone)}
      </div>

      {/* Summary */}
      {hasProducts && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">
              {language === 'pt' ? 'Total de produtos: ' : 'Total products: '}
            </span>
            {products.length}
            {language === 'pt' ? ' produtos distribuídos em ' : ' products distributed across '}
            {productsByZone.eyeLevel.length > 0 ? 1 : 0 + productsByZone.handLevel.length > 0 ? 1 : 0 + productsByZone.bottomLevel.length > 0 ? 1 : 0}
            {language === 'pt' ? ' zonas' : ' zones'}
          </p>
        </div>
      )}
    </div>
  );
}
