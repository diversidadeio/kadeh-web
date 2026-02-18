import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  color: string;
  price: number;
}

interface GondolaVisualization3DProps {
  width: number;
  depth: number;
  shelfHeight: number;
  numberOfShelves: number;
  products: Product[];
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
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  // Distribuir produtos nas prateleiras
  const productsPerShelf = Math.ceil(products.length / numberOfShelves);
  const shelves = Array.from({ length: numberOfShelves }, (_, i) => {
    const start = i * productsPerShelf;
    return products.slice(start, start + productsPerShelf);
  });

  const getShelfLabel = (index: number) => {
    if (index === 1) return t.eyeLevel;
    if (index === 2) return t.handLevel;
    if (index === numberOfShelves - 1) return t.bottomLevel;
    return `${t.shelf} ${index + 1}`;
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
                {shelves.map((shelfProducts, shelfIndex) => (
                  <div
                    key={shelfIndex}
                    className={`flex items-center gap-2 px-4 py-3 border-b border-gray-200 ${
                      shelfIndex === 1 ? "bg-yellow-50" : ""
                    }`}
                    style={{
                      minHeight: `${Math.max(60, shelfHeight / 2)}px`,
                    }}
                  >
                    {/* Shelf Label */}
                    <div className="min-w-32 text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {getShelfLabel(shelfIndex)}
                    </div>

                    {/* Products on Shelf */}
                    <div className="flex gap-1 flex-1 overflow-x-auto">
                      {shelfProducts.map((product, productIndex) => (
                        <div
                          key={`${shelfIndex}-${productIndex}`}
                          className="flex-shrink-0 rounded transition-transform hover:scale-110 cursor-pointer shadow-md"
                          style={{
                            width: "45px",
                            height: `${Math.max(45, shelfHeight / 3)}px`,
                            backgroundColor: product.color,
                            opacity: 0.9,
                          }}
                          title={`${product.name} - $${product.price}`}
                        >
                          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold text-center p-1 overflow-hidden">
                            <span className="truncate">{product.name.substring(0, 3)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-foreground mb-4">{t.products}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                >
                  <div
                    className="w-6 h-6 rounded flex-shrink-0"
                    style={{ backgroundColor: product.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-600">💡 {t.eyeLevel}:</span> A
              prateleira no nível dos olhos tem a melhor visibilidade e deve conter
              produtos de maior margem.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
