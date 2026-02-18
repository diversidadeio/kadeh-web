import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, AlertCircle } from "lucide-react";

interface ProductData {
  id: string;
  name: string;
  zone: string; // "Altura dos olhos", "Altura das mãos", "Lugar baixo"
  quadrantes: number;
  largura?: number;
  comprimento?: number;
  color?: string;
}

interface GondolaVisualization3DProps {
  width: number;
  depth: number;
  shelfHeight: number;
  numberOfShelves: number;
  products: ProductData[];
  language: string;
  imageUrl?: string;
}

export default function GondolaVisualization3D({
  width,
  depth,
  shelfHeight,
  numberOfShelves,
  products,
  language,
  imageUrl,
}: GondolaVisualization3DProps) {
  const [rotation, setRotation] = useState(0);

  const texts = {
    pt: {
      visualization: "Visualização 3D da Gôndola",
      dimensions: "Dimensões",
      width: "Largura",
      depth: "Profundidade",
      shelfHeight: "Altura entre Prateleiras",
      numberOfShelves: "Número de Prateleiras",
      products: "Produtos",
      rotate: "Girar",
      shelf: "Prateleira",
      cm: "cm",
      eyeLevel: "Nível dos Olhos (Melhor Visibilidade)",
      handLevel: "Nível das Mãos",
      bottomLevel: "Nível Baixo",
      aiVisualization: "Visualização com IA",
      productLayout: "Disposição dos Produtos",
      dimensionsNote: "💡 Nota Importante",
      dimensionsText: "Para uma simulação mais próxima da realidade, é essencial informar as dimensões (largura e profundidade) de cada produto. As dimensões afetam diretamente a quantidade de produtos que podem ser posicionados em cada prateleira e a precisão do layout.",
      noProducts: "Nenhum produto adicionado",
      quadrants: "Quadrantes",
    },
    en: {
      visualization: "3D Gondola Visualization",
      dimensions: "Dimensions",
      width: "Width",
      depth: "Depth",
      shelfHeight: "Shelf Height",
      numberOfShelves: "Number of Shelves",
      products: "Products",
      rotate: "Rotate",
      shelf: "Shelf",
      cm: "cm",
      eyeLevel: "Eye Level (Best Visibility)",
      handLevel: "Hand Level",
      bottomLevel: "Bottom Level",
      aiVisualization: "AI Visualization",
      productLayout: "Product Layout",
      dimensionsNote: "💡 Important Note",
      dimensionsText: "For a simulation closer to reality, it is essential to inform the dimensions (width and depth) of each product. Dimensions directly affect the number of products that can be positioned on each shelf and the accuracy of the layout.",
      noProducts: "No products added",
      quadrants: "Facings",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  // Organizar produtos por zona e posicioná-los nas prateleiras corretas
  const organizedShelves = useMemo(() => {
    const shelves: ProductData[][] = Array.from({ length: numberOfShelves }, () => []);

    // Mapear zonas para índices de prateleira
    // Para gôndola com 5 prateleiras:
    // Prateleira 0 (topo) - Nível dos olhos (melhor visibilidade)
    // Prateleira 1 - Nível dos olhos (melhor visibilidade)
    // Prateleira 2 - Nível das mãos
    // Prateleira 3 - Nível das mãos
    // Prateleira 4 (fundo) - Nível baixo

    products.forEach((product) => {
      let shelfIndex = -1;

      if (product.zone === "Altura dos olhos" || product.zone === "Eye Level") {
        // Distribuir entre as 2 prateleiras superiores (índices 0-1)
        shelfIndex = Math.random() < 0.5 ? 0 : 1;
      } else if (product.zone === "Altura das mãos" || product.zone === "Hand Level") {
        // Distribuir entre as 2 prateleiras intermediárias (índices 2-3)
        shelfIndex = Math.random() < 0.5 ? 2 : 3;
      } else if (product.zone === "Lugar baixo" || product.zone === "Bottom Shelf") {
        // Última prateleira (índice 4)
        shelfIndex = numberOfShelves - 1;
      }

      if (shelfIndex >= 0 && shelfIndex < numberOfShelves) {
        shelves[shelfIndex].push(product);
      }
    });

    return shelves;
  }, [products, numberOfShelves]);

  const getShelfLabel = (index: number) => {
    if (index === 0 || index === 1) return t.eyeLevel;
    if (index === 2 || index === 3) return t.handLevel;
    return t.bottomLevel;
  };

  const getShelfColor = (index: number) => {
    if (index === 0 || index === 1) return "bg-green-50";
    if (index === 2 || index === 3) return "bg-yellow-50";
    return "bg-red-50";
  };

  // Cores padrão para produtos
  const defaultColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#6C5CE7", "#A29BFE", "#74B9FF", "#81ECEC", "#55EFC4",
  ];

  const getProductColor = (index: number) => {
    return defaultColors[index % defaultColors.length];
  };

  return (
    <div className="space-y-8">
      {/* AI Generated Image */}
      {imageUrl && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t.aiVisualization}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Gondola 3D Visualization"
                className="w-full h-auto object-contain max-h-96"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive 3D Visualization */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t.productLayout}</span>
            <Button
              onClick={() => setRotation((prev) => (prev + 15) % 360)}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RotateCw className="w-4 h-4" />
              {t.rotate}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 3D Visualization */}
          {products.length > 0 ? (
            <div className="flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 min-h-96">
              <div
                className="relative"
                style={{
                  perspective: "1000px",
                  transform: `rotateY(${rotation}deg)`,
                  transition: "transform 0.6s ease-out",
                }}
              >
                {/* Gondola Frame */}
                <div className="relative bg-white border-4 border-gray-300 rounded-lg shadow-2xl overflow-hidden">
                  {/* Shelves */}
                  {organizedShelves.map((shelfProducts, shelfIndex) => (
                    <div
                      key={shelfIndex}
                      className={`flex items-center gap-2 px-4 py-3 border-b border-gray-200 ${getShelfColor(
                        shelfIndex
                      )}`}
                      style={{
                        minHeight: `${Math.max(60, shelfHeight / 2)}px`,
                      }}
                    >
                      {/* Shelf Label */}
                      <div className="min-w-32 text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {getShelfLabel(shelfIndex)}
                      </div>

                      {/* Products on Shelf */}
                      <div className="flex gap-1 flex-1 overflow-x-auto items-center">
                        {shelfProducts.length > 0 ? (
                          shelfProducts.map((product, productIndex) => {
                            const productWidth = Math.max(
                              35,
                              (product.largura || 5) * 2
                            );
                            return (
                              <div
                                key={`${shelfIndex}-${productIndex}`}
                                className="flex-shrink-0 rounded transition-transform hover:scale-110 cursor-pointer shadow-md flex flex-col items-center justify-center"
                                style={{
                                  width: `${productWidth}px`,
                                  height: `${Math.max(45, shelfHeight / 3)}px`,
                                  backgroundColor: product.color || getProductColor(productIndex),
                                  opacity: 0.9,
                                }}
                                title={`${product.name} - ${product.quadrantes} quadrantes`}
                              >
                                <div className="w-full h-full flex flex-col items-center justify-center text-white text-xs font-bold text-center p-1 overflow-hidden">
                                  <span className="truncate text-[10px] leading-tight">
                                    {product.name.substring(0, 8)}
                                  </span>
                                  {product.quadrantes && (
                                    <span className="text-[9px] leading-tight">
                                      {product.quadrantes}x
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-gray-400 text-xs italic">
                            {t.noProducts}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-12 min-h-96">
              <p className="text-gray-500 text-center">{t.noProducts}</p>
            </div>
          )}

          {/* Dimensions Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">{t.width}</p>
              <p className="text-2xl font-bold text-blue-600">
                {width} <span className="text-sm">{t.cm}</span>
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 font-semibold">{t.depth}</p>
              <p className="text-2xl font-bold text-green-600">
                {depth} <span className="text-sm">{t.cm}</span>
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 font-semibold">{t.shelfHeight}</p>
              <p className="text-2xl font-bold text-purple-600">
                {shelfHeight} <span className="text-sm">{t.cm}</span>
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 font-semibold">{t.numberOfShelves}</p>
              <p className="text-2xl font-bold text-orange-600">{numberOfShelves}</p>
            </div>
          </div>

          {/* Products Summary */}
          {products.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-foreground mb-4">
                {t.products} ({products.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200"
                  >
                    <div
                      className="w-6 h-6 rounded flex-shrink-0 mt-1"
                      style={{ backgroundColor: product.color || getProductColor(idx) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.quadrantes} {t.quadrants}
                      </p>
                      {product.largura && product.comprimento && (
                        <p className="text-xs text-gray-400">
                          {product.largura}×{product.comprimento}{t.cm}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions Note */}
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">{t.dimensionsNote}</p>
              <p className="text-sm text-amber-800">{t.dimensionsText}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
