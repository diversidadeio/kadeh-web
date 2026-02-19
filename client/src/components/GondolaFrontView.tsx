/**
 * GondolaFrontView Component
 * Displays front view of shelf with products distributed across zones
 * Respects gondola width, number of shelves, and shelf depth parameters
 * Zones: Altura dos olhos (top), Altura das mãos (middle), Lugar baixo (bottom)
 */

interface Product {
  id: string;
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
  category: string;
  subCategory: string;
  largura?: number;
  comprimento?: number;
}

interface Recommendation {
  frentes: number;
  zone: string;
  share: number;
  label: string;
  color: string;
}

interface GondolaFrontViewProps {
  products: Product[];
  gondolaWidth: number;
  shelves: number;
  shelfDepth: number;
  getRecommendation: (giro: string, margem: string) => Recommendation;
}

const ZONE_COLORS = {
  "Altura dos olhos": "bg-green-100 border-green-300",
  "Altura das mãos": "bg-yellow-100 border-yellow-300",
  "Lugar baixo": "bg-orange-100 border-orange-300",
};

const ZONE_LABEL_COLORS = {
  "Altura dos olhos": "text-green-700",
  "Altura das mãos": "text-yellow-700",
  "Lugar baixo": "text-orange-700",
};

const ZONE_ORDER = {
  "Altura dos olhos": 0,
  "Altura das mãos": 1,
  "Lugar baixo": 2,
};

export default function GondolaFrontView({
  products,
  gondolaWidth,
  shelves,
  shelfDepth,
  getRecommendation,
}: GondolaFrontViewProps) {
  // Group products by zone
  const productsByZone: { [key: string]: Product[] } = {
    "Altura dos olhos": [],
    "Altura das mãos": [],
    "Lugar baixo": [],
  };

  products.forEach((product) => {
    const rec = getRecommendation(product.giro, product.margem);
    if (!productsByZone[rec.zone]) {
      productsByZone[rec.zone] = [];
    }
    productsByZone[rec.zone].push(product);
  });

  const zones = ["Altura dos olhos", "Altura das mãos", "Lugar baixo"];

  // Calculate shelf height based on number of shelves
  const SHELF_HEIGHT = 60; // pixels per shelf
  const SHELF_SPACING = 8; // pixels between shelves
  const totalGondolaHeight = shelves * SHELF_HEIGHT + (shelves - 1) * SHELF_SPACING;

  // Calculate width per cm for visual representation
  const PIXELS_PER_CM = (gondolaWidth > 0) ? 2 : 0; // 2 pixels per cm
  const visualGondolaWidth = gondolaWidth * PIXELS_PER_CM;

  // Determine zone heights based on number of shelves
  const getZoneShelfIndices = () => {
    if (shelves === 1) return { "Altura dos olhos": [0], "Altura das mãos": [], "Lugar baixo": [] };
    if (shelves === 2) return { "Altura dos olhos": [0], "Altura das mãos": [1], "Lugar baixo": [] };
    if (shelves === 3) return { "Altura dos olhos": [0], "Altura das mãos": [1], "Lugar baixo": [2] };
    if (shelves === 4) return { "Altura dos olhos": [0, 1], "Altura das mãos": [2], "Lugar baixo": [3] };
    if (shelves === 5) return { "Altura dos olhos": [0, 1], "Altura das mãos": [2, 3], "Lugar baixo": [4] };
    // For 6+ shelves
    const eyeLevel = Math.floor(shelves * 0.4);
    const handLevel = Math.floor(shelves * 0.4);
    const lowLevel = shelves - eyeLevel - handLevel;
    const eyeIndices = Array.from({ length: eyeLevel }, (_, i) => i);
    const handIndices = Array.from({ length: handLevel }, (_, i) => eyeLevel + i);
    const lowIndices = Array.from({ length: lowLevel }, (_, i) => eyeLevel + handLevel + i);
    return { "Altura dos olhos": eyeIndices, "Altura das mãos": handIndices, "Lugar baixo": lowIndices };
  };

  const zoneShelfIndices = getZoneShelfIndices();

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Visualização Frontal da Gôndola</h3>
      
      {/* Gondola Specifications */}
      <div className="mb-6 p-4 bg-muted rounded-md border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Dimensões da Gôndola:</strong> {gondolaWidth}cm (largura) × {shelfDepth}cm (profundidade) × {shelves} prateleira(s)
        </p>
      </div>

      {/* Visual Gondola Representation */}
      <div className="mb-8 overflow-x-auto">
        <div className="inline-block" style={{ minWidth: `${Math.max(visualGondolaWidth, 400)}px` }}>
          {/* Shelves */}
          <div style={{ width: `${visualGondolaWidth}px`, position: "relative" }}>
            {Array.from({ length: shelves }).map((_, shelfIndex) => {
              const shelfTop = shelfIndex * (SHELF_HEIGHT + SHELF_SPACING);
              
              // Determine which zone this shelf belongs to
              let zoneColor = "bg-gray-200";
              let zoneLabel = "";
              for (const [zone, indices] of Object.entries(zoneShelfIndices)) {
                if (indices.includes(shelfIndex)) {
                  zoneColor = ZONE_COLORS[zone as keyof typeof ZONE_COLORS];
                  zoneLabel = zone;
                  break;
                }
              }

              return (
                <div
                  key={shelfIndex}
                  className={`${zoneColor} border border-border rounded`}
                  style={{
                    position: "absolute",
                    top: `${shelfTop}px`,
                    left: 0,
                    width: "100%",
                    height: `${SHELF_HEIGHT}px`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* Products on this shelf */}
                  <div style={{ display: "flex", gap: "4px", width: "100%", height: "100%" }}>
                    {products
                      .filter((product) => {
                        const rec = getRecommendation(product.giro, product.margem);
                        return zoneShelfIndices[rec.zone]?.includes(shelfIndex);
                      })
                      .map((product, idx) => {
                        const rec = getRecommendation(product.giro, product.margem);
                        const productWidth = product.largura || 10;
                        const visualProductWidth = Math.max(productWidth * PIXELS_PER_CM, 20);
                        
                        return (
                          <div
                            key={`${product.id}-${shelfIndex}-${idx}`}
                            className={`${rec.color} border border-current rounded flex items-center justify-center text-xs font-medium text-foreground`}
                            style={{
                              width: `${visualProductWidth}px`,
                              minWidth: `${visualProductWidth}px`,
                              height: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              padding: "2px",
                            }}
                            title={`${product.name} (${rec.frentes} quadrante(s))`}
                          >
                            <span style={{ fontSize: "10px" }}>{rec.frentes}q</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ height: `${totalGondolaHeight}px` }}></div>
        </div>
      </div>

      {/* Zone Details */}
      <div className="space-y-4 mb-6">
        {zones.map((zone) => {
          const shelfIndices = zoneShelfIndices[zone as keyof typeof zoneShelfIndices] || [];
          return (
            <div key={zone} className="border border-border rounded-md overflow-hidden">
              {/* Zone Header */}
              <div className={`${ZONE_COLORS[zone as keyof typeof ZONE_COLORS]} px-4 py-2 border-b border-border`}>
                <h4 className={`font-semibold text-sm ${ZONE_LABEL_COLORS[zone as keyof typeof ZONE_LABEL_COLORS]}`}>
                  {zone} (Prateleira(s): {shelfIndices.map(i => i + 1).join(", ")})
                </h4>
              </div>

              {/* Products in Zone */}
              <div className="p-4 bg-white">
                {productsByZone[zone] && productsByZone[zone].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {productsByZone[zone].map((product) => {
                      const rec = getRecommendation(product.giro, product.margem);
                      const productsPerShelf = product.comprimento && shelfDepth 
                        ? Math.floor(shelfDepth / product.comprimento) 
                        : 0;
                      const totalCapacity = rec.frentes * productsPerShelf * shelfIndices.length;
                      
                      return (
                        <div
                          key={product.id}
                          className={`${rec.color} p-3 rounded border-l-4 border-l-current`}
                        >
                          <div className="font-medium text-sm text-foreground">{product.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <div>Giro: {product.giro} | Margem: {product.margem}</div>
                            <div className="text-blue-600 font-medium mt-1">{rec.frentes} quadrante(s)</div>
                            {product.largura && product.comprimento && (
                              <div className="text-gray-600 mt-1">
                                Dimensões: {product.largura}cm × {product.comprimento}cm
                              </div>
                            )}
                            {productsPerShelf > 0 && (
                              <div className="text-green-600 font-medium mt-1">
                                Capacidade: {totalCapacity} unid. ({productsPerShelf} por quadrante)
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhum produto nesta zona</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-muted rounded-md border border-border">
        <h4 className="font-semibold text-sm text-foreground mb-3">Legenda de Zonas:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mt-0.5"></div>
            <div className="text-xs">
              <div className="font-medium text-green-700">Altura dos olhos</div>
              <div className="text-muted-foreground">Melhor visibilidade</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mt-0.5"></div>
            <div className="text-xs">
              <div className="font-medium text-yellow-700">Altura das mãos</div>
              <div className="text-muted-foreground">Acesso fácil</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded mt-0.5"></div>
            <div className="text-xs">
              <div className="font-medium text-orange-700">Lugar baixo</div>
              <div className="text-muted-foreground">Menor visibilidade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
