/**
 * GondolaFrontView Component
 * Displays front view of shelf with products distributed across zones
 * Zones: Altura dos olhos (top), Altura das mãos (middle), Lugar baixo (bottom)
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

export default function GondolaFrontView({
  products,
  gondolaWidth,
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

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Visualização Frontal da Gôndola</h3>
      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone} className="border border-border rounded-md overflow-hidden">
            {/* Zone Header */}
            <div className={`${ZONE_COLORS[zone as keyof typeof ZONE_COLORS]} px-4 py-2 border-b border-border`}>
              <h4 className={`font-semibold text-sm ${ZONE_LABEL_COLORS[zone as keyof typeof ZONE_LABEL_COLORS]}`}>
                {zone}
              </h4>
            </div>

            {/* Products in Zone */}
            <div className="p-4 bg-white">
              {productsByZone[zone] && productsByZone[zone].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {productsByZone[zone].map((product) => {
                    const rec = getRecommendation(product.giro, product.margem);
                    return (
                      <div
                        key={product.id}
                        className={`${rec.color} p-3 rounded border-l-4 border-l-current`}
                      >
                        <div className="font-medium text-sm text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <div>Giro: {product.giro} | Margem: {product.margem}</div>
                          <div className="text-blue-600 font-medium mt-1">{rec.frentes} frente(s)</div>
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
        ))}
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
