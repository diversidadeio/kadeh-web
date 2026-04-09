import React from 'react';

interface ShelfProduct {
  name: string;
  percentage: number;
  color: string;
  imagePath: string;
}

interface GondolaRealisticVisualizationProps {
  shelves: Array<{
    id: string;
    name: string;
    zone: string;
    backgroundColor: string;
    products: ShelfProduct[];
  }>;
}

/**
 * Realistic gondola visualization component
 * Displays products on shelves with proportional widths based on percentages
 * Uses product images replicated across the shelf width
 */
export const GondolaRealisticVisualization: React.FC<GondolaRealisticVisualizationProps> = ({ shelves }) => {
  const getProductImageUrl = (productName: string): string => {
    const productMap: Record<string, string> = {
      // Garrafas (600ml)
      'Brahma': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/brahma-bottle_d68ac266.png',
      'Antártica': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/antartica-bottle_ec6a1a2b.png',
      'Heineken': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/heineken-bottle_aef15d30.png',
      'Corona': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/corona-bottle_58f9fe0b.png',
      'Skol': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/skol-bottle_341a1371.png',
      'Itaipava': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/itaipava-bottle_407e0b44.png',
      'Budweiser': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/budweiser-bottle_f348de33.png',
      'Stella Artois': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/stella-artois-bottle_93cb2847.png',
      'Schin': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/schin-bottle_ae095f6f.png',
      'Polar': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/schin-bottle_ae095f6f.png',
      
      // Latas (350ml)
      'Brahma Chopp': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/brahma-can_ef56c05c.png',
      'Skol Lata': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/skol-can_ba2e9adb.png',
      'Itaipava Lata': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/itaipava-can_c5e8868d.png',
      'Antártica Lata': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/antarctica-can_9171d945.png',
      'Heineken Lata': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/heineken-can_412440ff.png',
      'Budweiser Lata': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/budweiser-can_134427bf.png',
    };
    return productMap[productName] || 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/skol-bottle_341a1371.png';
  };

  const renderShelf = (shelf: any) => {
    const totalPercentage = shelf.products.reduce((sum: number, p: ShelfProduct) => sum + p.percentage, 0);
    
    return (
      <div key={shelf.id} className="mb-4">
        {/* Shelf Label */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm">{shelf.name}</h4>
          <span className="text-xs text-gray-600">{totalPercentage.toFixed(1)}% / 100%</span>
        </div>

        {/* Shelf Container */}
        <div
          className={`relative w-full rounded-lg border-2 overflow-hidden shadow-md`}
          style={{
            backgroundColor: shelf.backgroundColor,
            minHeight: '120px',
            borderColor: shelf.backgroundColor === '#FEF3C7' ? '#FBBF24' : 
                        shelf.backgroundColor === '#DBEAFE' ? '#3B82F6' : 
                        '#10B981',
          }}
        >
          {/* Products Row */}
          <div className="flex h-full items-center justify-start overflow-x-auto">
            {shelf.products.map((product: ShelfProduct, idx: number) => {
              const productWidth = (product.percentage / 100) * 100;
              const imageUrl = getProductImageUrl(product.name);
              
              // Calculate number of product images to display based on width
              const imageCount = Math.max(1, Math.ceil((product.percentage / 100) * 8));
              
              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-center flex-shrink-0 border-r border-gray-300 last:border-r-0"
                  style={{
                    width: `${productWidth}%`,
                    minHeight: '120px',
                  }}
                >
                  {/* Product Images - Replicated */}
                  <div className="flex items-center justify-center h-full w-full gap-1 px-2">
                    {Array.from({ length: imageCount }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                          width: '35px',
                          height: '100px',
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full object-contain"
                          style={{
                            maxWidth: '35px',
                            maxHeight: '100px',
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Product Label */}
                  <div
                    className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-90 rounded px-1 py-0.5 text-center"
                    style={{
                      fontSize: '8px',
                    }}
                  >
                    <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                  </div>
                </div>
              );
            })}

            {/* Empty Space */}
            {totalPercentage < 100 && (
              <div
                className="flex-shrink-0 bg-gray-100 flex items-center justify-center"
                style={{
                  width: `${100 - totalPercentage}%`,
                  minHeight: '120px',
                }}
              >
                <span className="text-xs text-gray-400">Espaço vazio</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🤖 Visibilidade por IA
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Representação realista da visualização da gôndola gerada por inteligência artificial com base nas recomendações de posicionamento.
        </p>
      </div>

      {/* Shelves */}
      <div className="space-y-4">
        {shelves.map(renderShelf)}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-sm mb-3">Legenda de Zonas</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-400"></div>
            <span className="text-xs">Altura dos olhos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-400"></div>
            <span className="text-xs">Altura das mãos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-500"></div>
            <span className="text-xs">Parte de Baixo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GondolaRealisticVisualization;
