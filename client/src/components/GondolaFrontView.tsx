/**
 * GondolaFrontView Component
 * Displays front view of shelf with products distributed across zones and prateleiras
 * Respects matrix recommendations for frentes and implements intelligent vertical distribution
 */

interface Product {
  id: string;
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
  category: string;
  subCategory: string;
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
  numShelves: number;
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

// Map prateleiras to zones
function mapShelfToZone(shelfIndex: number, totalShelves: number): string {
  const topThird = Math.ceil(totalShelves / 3);
  const middleThird = Math.ceil((totalShelves * 2) / 3);

  if (shelfIndex < topThird) return "Altura dos olhos";
  if (shelfIndex < middleThird) return "Altura das mãos";
  return "Lugar baixo";
}

// Calculate product score for vertical distribution (higher = better placement)
function calculateProductScore(giro: string, margem: string): number {
  const giroScore = giro === "Alto" ? 3 : giro === "Médio" ? 2 : 1;
  const margemScore = margem === "Alta" ? 3 : margem === "Média" ? 2 : 1;
  return giroScore + margemScore;
}

export default function GondolaFrontView({
  products,
  gondolaWidth,
  numShelves,
  getRecommendation,
}: GondolaFrontViewProps) {
  // Get zones available based on number of shelves
  const zonesAvailable = new Set<string>();
  for (let i = 0; i < numShelves; i++) {
    zonesAvailable.add(mapShelfToZone(i, numShelves));
  }

  // Group products by their recommended zone
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

  // If not all zones are available, redistribute products vertically
  // Privileging better products (higher margin + giro) to upper shelves
  let redistributedProducts: { [key: number]: Product[] } = {};

  if (zonesAvailable.size < 3) {
    // Sort all products by score (descending) - best products first
    const sortedProducts = products.sort((a, b) => {
      const scoreA = calculateProductScore(a.giro, a.margem);
      const scoreB = calculateProductScore(b.giro, b.margem);
      return scoreB - scoreA;
    });

    // Distribute products across available shelves
    // Upper shelves get better products
    for (let i = 0; i < numShelves; i++) {
      redistributedProducts[i] = [];
    }

    sortedProducts.forEach((product, index) => {
      const shelfIndex = index % numShelves;
      redistributedProducts[shelfIndex].push(product);
    });
  }

  // Create shelf view
  const shelves = Array.from({ length: numShelves }, (_, i) => i);

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Visualização Frontal da Gôndola</h3>

      {/* Shelf Display */}
      <div className="space-y-3 mb-6 border border-border rounded-md overflow-hidden">
        {shelves.map((shelfIndex) => {
          const zone = mapShelfToZone(shelfIndex, numShelves);
          const shelfProducts = zonesAvailable.size < 3
            ? redistributedProducts[shelfIndex] || []
            : productsByZone[zone] || [];

          return (
            <div key={shelfIndex} className="flex items-stretch border-b border-border last:border-b-0">
              {/* Shelf Number */}
              <div className="w-16 bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-700 border-r border-border">
                Prat. {numShelves - shelfIndex}
              </div>

              {/* Zone Indicator */}
              <div className={`w-32 flex items-center justify-center text-xs font-semibold border-r border-border ${ZONE_COLORS[zone as keyof typeof ZONE_COLORS]}`}>
                <span className={ZONE_LABEL_COLORS[zone as keyof typeof ZONE_LABEL_COLORS]}>
                  {zone}
                </span>
              </div>

              {/* Products on Shelf */}
              <div className="flex-1 p-3 bg-white flex gap-2 overflow-x-auto">
                {shelfProducts.length > 0 ? (
                  shelfProducts.map((product) => {
                    const rec = getRecommendation(product.giro, product.margem);
                    const productWidth = (rec.frentes / 10) * 100; // Assume max 10 frentes per shelf

                    return (
                      <div
                        key={product.id}
                        className={`${rec.color} p-2 rounded border-l-4 border-l-current flex-shrink-0`}
                        style={{ minWidth: `${Math.max(80, productWidth)}px` }}
                      >
                        <div className="font-medium text-xs text-foreground truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          <div className="truncate">{product.giro} | {product.margem}</div>
                          <div className="text-blue-600 font-bold">{rec.frentes} frente(s)</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground italic">Sem produtos</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Legend */}
      <div className="p-4 bg-muted rounded-md border border-border">
        <h4 className="font-semibold text-sm text-foreground mb-3">Legenda de Zonas:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mt-0.5 flex-shrink-0"></div>
            <div className="text-xs">
              <div className="font-medium text-green-700">Altura dos olhos</div>
              <div className="text-muted-foreground">Melhor visibilidade</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mt-0.5 flex-shrink-0"></div>
            <div className="text-xs">
              <div className="font-medium text-yellow-700">Altura das mãos</div>
              <div className="text-muted-foreground">Acesso fácil</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded mt-0.5 flex-shrink-0"></div>
            <div className="text-xs">
              <div className="font-medium text-orange-700">Lugar baixo</div>
              <div className="text-muted-foreground">Menor visibilidade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Info */}
      {zonesAvailable.size < 3 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            <strong>Distribuição Vertical Inteligente:</strong> Como nem todas as zonas estão disponíveis, os produtos com melhor margem e giro foram priorizados nas prateleiras superiores.
          </p>
        </div>
      )}
    </div>
  );
}
