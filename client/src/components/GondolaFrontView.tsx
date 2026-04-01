import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  zona?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  quadrantes: number;
  largura?: number;
  share?: number;
  giro?: string;
  margem?: string;
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
 * Renderiza uma prateleira com produtos distribuídos proporcionalmente por percentual (share)
 * Regra: cada produto ocupa espaço proporcional ao seu percentual
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

  // Calcular share total (deve ser 100% ou próximo)
  const totalShare = productsInZone.reduce((sum, p) => sum + (p.share || 0), 0);
  
  // Se não houver share definido, usar largura como fallback
  const useShare = totalShare > 0;

  return (
    <div className="flex w-full h-full overflow-hidden">
      {productsInZone.map((product, index) => {
        // Usar share (percentual) se disponível, caso contrário usar largura
        let widthPercent = 0;
        let displayValue = '';
        
        if (useShare) {
          widthPercent = product.share || 0;
          displayValue = `${(product.share || 0).toFixed(1)}%`;
        } else {
          const totalProductWidth = productsInZone.reduce((sum, p) => sum + (p.largura || 10), 0);
          const productWidth = product.largura || 10;
          widthPercent = (productWidth / totalProductWidth) * 100;
          displayValue = `${productWidth}cm`;
        }

        return (
          <div
            key={product.id}
            className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 p-2 overflow-hidden transition-all hover:opacity-80"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: zoneColor.bg,
              minWidth: widthPercent > 5 ? '30px' : '20px',
            }}
            title={`${product.name} - ${displayValue}`}
          >
            <span className="text-xs font-bold text-gray-800 text-center truncate line-clamp-2">
              {product.name}
            </span>
            <span className="text-xs text-gray-600 font-semibold">
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renderiza uma seção de prateleira com número e label
 */
function renderShelfSection(
  shelfNumber: number,
  zone: string,
  productsInZone: Product[],
  totalWidth: number,
  shelfHeight: number,
  colors: any,
  language: string
) {
  const zoneColor = colors[zone as keyof typeof colors];
  
  // Calcular espaço utilizado
  const totalShare = productsInZone.reduce((sum, p) => sum + (p.share || 0), 0);
  const usedPercentage = Math.min(totalShare, 100);
  
  return (
    <div key={`shelf-${shelfNumber}`}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: zoneColor.bg }}
        />
        <span className="text-sm font-semibold text-gray-700">
          {language === 'pt' 
            ? `Prateleira ${shelfNumber} - ${zoneColor.label}` 
            : `Shelf ${shelfNumber} - ${zoneColor.label}`}
        </span>
        <span className="text-xs text-gray-500">
          {usedPercentage.toFixed(1)}% / 100%
        </span>
      </div>
      <div
        className="border-2 rounded-md overflow-hidden"
        style={{
          borderColor: zoneColor.border,
          height: `${shelfHeight}px`,
        }}
      >
        {renderShelf(
          productsInZone,
          totalWidth,
          shelfHeight,
          zoneColor,
          language
        )}
      </div>
    </div>
  );
}

/**
 * Distribui produtos nas prateleiras respeitando percentuais recomendados
 * IMPORTANTE: Produtos da Parte de Baixo ocupam APENAS seu percentual recomendado
 * O espaço restante é preenchido com produtos de Altura das Mãos
 */
function distributeProductsToShelves(products: Product[]): {
  shelf1: Product[];
  shelves2to4: Product[];
  shelf5: Product[];
} {
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.zona) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.zona) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.zona) === 'Parte de Baixo'),
  };

  // Calcular espaço utilizado APENAS pelos produtos da Parte de Baixo
  const bottomProducts = productsByZone['Parte de Baixo'];
  const bottomShare = bottomProducts.reduce((sum, p) => sum + (p.share || 0), 0);
  const spaceRemaining = 100 - bottomShare;

  // Manter produtos da Parte de Baixo com seu percentual recomendado
  let shelf1Products = [...bottomProducts];
  let handLevelProducts = [...productsByZone['Altura das mãos']];

  // Preencher espaço restante com produtos de Altura das Mãos
  if (spaceRemaining > 0 && handLevelProducts.length > 0) {
    let remainingSpace = spaceRemaining;
    const productsToAdd: Product[] = [];
    const productsToRemove: string[] = [];
    
    // Tentar adicionar produtos de Altura das Mãos que cabem no espaço restante
    for (const product of handLevelProducts) {
      if (remainingSpace <= 0) break;
      
      const productShare = product.share || 0;
      
      // Se o produto cabe completamente no espaço restante, adicionar
      if (productShare <= remainingSpace) {
        productsToAdd.push(product);
        productsToRemove.push(product.id);
        remainingSpace -= productShare;
      }
      // Se o produto não cabe completamente, criar uma cópia com share reduzido
      else if (remainingSpace > 5) { // Apenas se sobrar mais de 5%
        const adjustedProduct = { ...product, share: remainingSpace };
        productsToAdd.push(adjustedProduct);
        productsToRemove.push(product.id);
        remainingSpace = 0;
      }
    }

    shelf1Products = [...shelf1Products, ...productsToAdd];
    handLevelProducts = handLevelProducts.filter(p => !productsToRemove.includes(p.id));
  }

  return {
    shelf1: shelf1Products,
    shelves2to4: handLevelProducts,
    shelf5: productsByZone['Altura dos olhos'],
  };
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
          <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4 space-y-4 flex flex-col-reverse">
            {/* Prateleira 5 - Top */}
            {renderShelfSection(
              5,
              'Altura dos olhos',
              [singleProduct],
              totalWidth,
              shelfHeight,
              colors,
              language
            )}

            {/* Prateleira 4 - Middle-High */}
            {renderShelfSection(
              4,
              'Altura das mãos',
              [singleProduct],
              totalWidth,
              shelfHeight,
              colors,
              language
            )}

            {/* Prateleira 3 - Middle */}
            {renderShelfSection(
              3,
              'Altura das mãos',
              [singleProduct],
              totalWidth,
              shelfHeight,
              colors,
              language
            )}

            {/* Prateleira 2 - Middle-Low */}
            {renderShelfSection(
              2,
              'Altura das mãos',
              [singleProduct],
              totalWidth,
              shelfHeight,
              colors,
              language
            )}

            {/* Prateleira 1 - Bottom */}
            {renderShelfSection(
              1,
              'Parte de Baixo',
              [singleProduct],
              totalWidth,
              shelfHeight,
              colors,
              language
            )}
          </div>
        </div>
      </div>
    );
  }

  // REGRA 2 & 3: Múltiplos produtos - distribuir por zona e preencher espaço sobrando
  const { shelf1, shelves2to4, shelf5 } = distributeProductsToShelves(products);

  return (
    <div className="w-full space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4 space-y-4 flex flex-col-reverse">
          {/* Prateleira 5 - Top (Altura dos Olhos) */}
          {renderShelfSection(
            5,
            'Altura dos olhos',
            shelf5,
            totalWidth,
            shelfHeight,
            colors,
            language
          )}

          {/* Prateleira 4 - Middle-High (Altura das Mãos) */}
          {renderShelfSection(
            4,
            'Altura das mãos',
            shelves2to4,
            totalWidth,
            shelfHeight,
            colors,
            language
          )}

          {/* Prateleira 3 - Middle (Altura das Mãos) */}
          {renderShelfSection(
            3,
            'Altura das mãos',
            shelves2to4,
            totalWidth,
            shelfHeight,
            colors,
            language
          )}

          {/* Prateleira 2 - Middle-Low (Altura das Mãos) */}
          {renderShelfSection(
            2,
            'Altura das mãos',
            shelves2to4,
            totalWidth,
            shelfHeight,
            colors,
            language
          )}

          {/* Prateleira 1 - Bottom (Parte de Baixo) */}
          {renderShelfSection(
            1,
            'Parte de Baixo',
            shelf1,
            totalWidth,
            shelfHeight,
            colors,
            language
          )}
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
