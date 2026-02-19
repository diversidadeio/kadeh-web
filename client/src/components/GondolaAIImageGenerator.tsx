import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
  category: string;
  subCategory: string;
}

interface GondolaAIImageGeneratorProps {
  products: Product[];
  gondolaWidth: number;
  shelves: number;
  shelfDepth: number;
  getRecommendation?: (giro: string, margem: string) => { frentes: number; zone: string; share: number; color: string };
}

interface ProductPlacement {
  name: string;
  frentes: number;
  shelf: number;
  zone: string;
  width: number;
  color: string;
  giro: string;
  margem: string;
}

// Matriz de recomendações padrão
const RECOMMENDATION_MATRIX: Record<string, { frentes: number; zone: string; share: number; color: string }> = {
  "Alto-Alta": { frentes: 1, zone: "Altura dos olhos", share: 35, color: "#10b981" },
  "Alto-Média": { frentes: 2, zone: "Altura dos olhos", share: 25, color: "#10b981" },
  "Alto-Baixa": { frentes: 2, zone: "Altura das mãos", share: 20, color: "#eab308" },
  "Médio-Alta": { frentes: 2, zone: "Altura dos olhos", share: 25, color: "#10b981" },
  "Médio-Média": { frentes: 3, zone: "Altura das mãos", share: 20, color: "#eab308" },
  "Médio-Baixa": { frentes: 4, zone: "Altura das mãos", share: 15, color: "#f97316" },
  "Baixo-Alta": { frentes: 3, zone: "Altura das mãos", share: 20, color: "#eab308" },
  "Baixo-Média": { frentes: 4, zone: "Altura das mãos", share: 15, color: "#f97316" },
  "Baixo-Baixa": { frentes: 5, zone: "Lugar baixo", share: 5, color: "#ef4444" },
};

// Map shelf index to zone
function mapShelfToZone(shelfIndex: number, totalShelves: number): string {
  const topThird = Math.ceil(totalShelves / 3);
  const middleThird = Math.ceil((totalShelves * 2) / 3);

  if (shelfIndex < topThird) return "Altura dos olhos";
  if (shelfIndex < middleThird) return "Altura das mãos";
  return "Lugar baixo";
}

// Calculate product score for vertical distribution
function calculateProductScore(giro: string, margem: string): number {
  const giroScore = giro === "Alto" ? 3 : giro === "Médio" ? 2 : 1;
  const margemScore = margem === "Alta" ? 3 : margem === "Média" ? 2 : 1;
  return giroScore + margemScore;
}

export default function GondolaAIImageGenerator({
  products,
  gondolaWidth,
  shelves,
  shelfDepth,
  getRecommendation,
}: GondolaAIImageGeneratorProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Get recommendation function
  const getRecFunc = getRecommendation || ((giro: string, margem: string) => {
    const key = `${giro}-${margem}`;
    return RECOMMENDATION_MATRIX[key] || { frentes: 1, zone: "Altura das mãos", share: 15, color: "#6b7280" };
  });

  // Calcular posicionamento dos produtos respeitando a matriz
  const calculateProductPlacements = (): ProductPlacement[] => {
    // Get zones available
    const zonesAvailable = new Set<string>();
    for (let i = 0; i < shelves; i++) {
      zonesAvailable.add(mapShelfToZone(i, shelves));
    }

    // Group products by recommended zone
    const productsByZone: { [key: string]: Product[] } = {
      "Altura dos olhos": [],
      "Altura das mãos": [],
      "Lugar baixo": [],
    };

    products.forEach((product) => {
      const rec = getRecFunc(product.giro, product.margem);
      if (!productsByZone[rec.zone]) {
        productsByZone[rec.zone] = [];
      }
      productsByZone[rec.zone].push(product);
    });

    const placements: ProductPlacement[] = [];

    // If all zones available, use recommended zones
    if (zonesAvailable.size === 3) {
      Object.entries(productsByZone).forEach(([zone, zoneProducts]) => {
        zoneProducts.forEach((product) => {
          const rec = getRecFunc(product.giro, product.margem);
          
          // Find shelf for this zone
          for (let i = 0; i < shelves; i++) {
            if (mapShelfToZone(i, shelves) === zone) {
              placements.push({
                name: product.name,
                frentes: rec.frentes,
                shelf: i,
                zone: zone,
                width: (rec.share / 100) * gondolaWidth,
                color: rec.color,
                giro: product.giro,
                margem: product.margem,
              });
              break;
            }
          }
        });
      });
    } else {
      // Distribute vertically - better products to upper shelves
      const sortedProducts = products.sort((a, b) => {
        const scoreA = calculateProductScore(a.giro, a.margem);
        const scoreB = calculateProductScore(b.giro, b.margem);
        return scoreB - scoreA;
      });

      // Create shelf assignments
      const shelfAssignments: { [key: number]: Product[] } = {};
      for (let i = 0; i < shelves; i++) {
        shelfAssignments[i] = [];
      }

      // Assign products to shelves (better products to upper shelves)
      sortedProducts.forEach((product, index) => {
        const shelfIndex = index % shelves;
        shelfAssignments[shelfIndex].push(product);
      });

      // Create placements
      Object.entries(shelfAssignments).forEach(([shelfStr, shelfProducts]) => {
        const shelfIndex = parseInt(shelfStr);
        const zone = mapShelfToZone(shelfIndex, shelves);

        shelfProducts.forEach((product) => {
          const rec = getRecFunc(product.giro, product.margem);
          placements.push({
            name: product.name,
            frentes: rec.frentes,
            shelf: shelfIndex,
            zone: zone,
            width: (rec.share / 100) * gondolaWidth,
            color: rec.color,
            giro: product.giro,
            margem: product.margem,
          });
        });
      });
    }

    return placements;
  };

  // Gerar prompt detalhado para a IA
  const generatePrompt = (): string => {
    const placements = calculateProductPlacements();

    const productDescriptions = placements.map((p) => {
      const zoneHeight = p.zone === "Altura dos olhos" ? "eye level" : p.zone === "Altura das mãos" ? "hand level" : "low level";
      return `${p.name} (${p.frentes} frente(s), Giro: ${p.giro}, Margem: ${p.margem}) on shelf ${shelves - p.shelf} at ${zoneHeight}, occupying ${Math.round(p.width)}cm width`;
    }).join("; ");

    return `Create a photorealistic front view of a retail shelf display (gondola) with the following specifications:
- Shelf width: ${gondolaWidth}cm
- Number of shelves: ${shelves} (numbered from top to bottom)
- Shelf depth: ${shelfDepth}cm
- Product placement: ${productDescriptions}
- Product positioning: Respect the number of frentes (front facing units) for each product
- Style: Professional retail photography, well-lit supermarket environment
- Perspective: Direct front view, straight angle
- Lighting: Bright, professional retail lighting
- Background: Clean supermarket environment
- Include shelf edges, metal frame, and shelf numbers
- Make it look like a real supermarket display with proper product arrangement`;
  };

  const handleGenerateImage = async () => {
    if (products.length === 0) {
      setError("Adicione pelo menos um produto para gerar a visualização");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const prompt = generatePrompt();

      // Simular geração de imagem (em produção, isso chamaria a API de IA)
      // Por enquanto, vamos criar uma representação visual SVG
      const placements = calculateProductPlacements();
      const svgImage = generateSVGPreview(placements);
      setGeneratedImage(svgImage);
    } catch (err) {
      setError("Erro ao gerar visualização. Tente novamente.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Gerar prévia SVG da gôndola
  const generateSVGPreview = (placements: ProductPlacement[]): string => {
    const height = 400;
    const shelfHeight = height / shelves;
    const padding = 40;
    const svgWidth = 900;

    let svg = `<svg width="${svgWidth}" height="${height + padding * 2}" xmlns="http://www.w3.org/2000/svg">`;

    // Fundo
    svg += `<rect width="${svgWidth}" height="${height + padding * 2}" fill="#f5f5f5"/>`;

    // Desenhar prateleiras com números
    for (let i = 0; i < shelves; i++) {
      const y = padding + i * shelfHeight;
      
      // Número da prateleira
      svg += `<text x="${padding - 20}" y="${y + shelfHeight / 2}" font-size="14" font-weight="bold" text-anchor="end" dominant-baseline="middle" fill="#333">Prat. ${shelves - i}</text>`;
      
      // Linha da prateleira
      svg += `<line x1="${padding}" y1="${y + shelfHeight}" x2="${padding + gondolaWidth}" y2="${y + shelfHeight}" stroke="#333" stroke-width="2"/>`;
    }

    // Desenhar estrutura lateral
    svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height + padding}" stroke="#333" stroke-width="3"/>`;
    svg += `<line x1="${padding + gondolaWidth}" y1="${padding}" x2="${padding + gondolaWidth}" y2="${height + padding}" stroke="#333" stroke-width="3"/>`;

    // Desenhar produtos
    placements.forEach((product) => {
      const x = padding + (placements.slice(0, placements.indexOf(product)).reduce((sum, p) => sum + p.width, 0));
      const y = padding + product.shelf * shelfHeight;
      const width = product.width;

      // Retângulo do produto
      svg += `<rect x="${x}" y="${y}" width="${width}" height="${shelfHeight - 2}" fill="${product.color}" stroke="#333" stroke-width="1" opacity="0.85"/>`;

      // Texto do produto
      const fontSize = Math.min(11, width / product.name.length);
      svg += `<text x="${x + width / 2}" y="${y + shelfHeight / 3}" font-size="${fontSize}" text-anchor="middle" fill="#000" font-weight="bold">${product.name.substring(0, 20)}</text>`;

      // Frentes
      svg += `<text x="${x + width / 2}" y="${y + shelfHeight / 2 + 5}" font-size="10" text-anchor="middle" fill="#333" font-weight="bold">${product.frentes} frente(s)</text>`;

      // Zona
      svg += `<text x="${x + width / 2}" y="${y + shelfHeight - 5}" font-size="9" text-anchor="middle" fill="#666">${product.zone}</text>`;
    });

    // Dimensões
    svg += `<text x="${padding + gondolaWidth / 2}" y="${height + padding + 15}" font-size="12" text-anchor="middle" fill="#333" font-weight="bold">Largura: ${gondolaWidth}cm | Profundidade: ${shelfDepth}cm | Prateleiras: ${shelves}</text>`;

    svg += `</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Visualização Realista por IA
        </CardTitle>
        <CardDescription>
          Gere uma visualização realista da gôndola respeitando a Matriz de Recomendação com posicionamento inteligente de produtos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações de Dimensões */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Largura</p>
            <p className="text-xl font-bold">{gondolaWidth}cm</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Prateleiras</p>
            <p className="text-xl font-bold">{shelves}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profundidade</p>
            <p className="text-xl font-bold">{shelfDepth}cm</p>
          </div>
        </div>

        {/* Botão de Geração */}
        <Button
          onClick={handleGenerateImage}
          disabled={isGenerating || products.length === 0}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando visualização...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Gerar Visualização por IA
            </>
          )}
        </Button>

        {/* Mensagem de Erro */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Imagem Gerada */}
        {generatedImage && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Prévia da Gôndola com Números de Prateleiras</h3>
            <img
              src={generatedImage}
              alt="Prévia da gôndola"
              className="w-full border rounded-lg bg-white"
            />
            <p className="text-sm text-gray-600">
              Esta prévia mostra o posicionamento exato dos produtos respeitando o número de frentes recomendado pela Matriz. A versão final por IA será fotorrealista e detalhada.
            </p>
          </div>
        )}

        {/* Legenda de Cores */}
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-sm">Legenda de Cores (Margem × Giro)</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Alto Giro + Alta Margem</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Médio Giro/Margem</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span>Baixo Giro/Margem</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Baixo Giro + Baixa Margem</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
