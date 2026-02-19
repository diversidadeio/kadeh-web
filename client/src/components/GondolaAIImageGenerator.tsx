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
}

interface ProductPlacement {
  name: string;
  shelf: number;
  zone: string;
  width: number;
  color: string;
}

export default function GondolaAIImageGenerator({
  products,
  gondolaWidth,
  shelves,
  shelfDepth,
}: GondolaAIImageGeneratorProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Matriz de recomendações
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

  // Calcular posicionamento dos produtos
  const calculateProductPlacements = (): ProductPlacement[] => {
    const placements: ProductPlacement[] = [];
    let currentWidth = 0;
    const totalWidth = gondolaWidth;

    // Definir zonas de prateleira
    const shelfZones = {
      "Altura dos olhos": Math.floor(shelves * 0.4), // 40% das prateleiras no meio
      "Altura das mãos": Math.floor(shelves * 0.4), // 40% das prateleiras
      "Lugar baixo": Math.ceil(shelves * 0.2), // 20% das prateleiras na base
    };

    let eyeLevelShelf = Math.floor(shelves / 2);
    let handLevelShelf = Math.floor(shelves / 3);
    let lowLevelShelf = 0;

    products.forEach((product) => {
      const key = `${product.giro}-${product.margem}`;
      const recommendation = RECOMMENDATION_MATRIX[key] || { frentes: 1, zone: "Altura das mãos", share: 15, color: "#6b7280" };

      // Calcular largura proporcional baseado no share
      const productWidth = (recommendation.share / 100) * totalWidth;

      // Determinar prateleira baseado na zona
      let shelf = eyeLevelShelf;
      if (recommendation.zone === "Altura das mãos") {
        shelf = handLevelShelf;
        handLevelShelf = Math.max(0, handLevelShelf - 1);
      } else if (recommendation.zone === "Lugar baixo") {
        shelf = lowLevelShelf;
        lowLevelShelf = Math.min(shelves - 1, lowLevelShelf + 1);
      } else {
        eyeLevelShelf = Math.max(0, eyeLevelShelf - 1);
      }

      placements.push({
        name: product.name,
        shelf: shelf,
        zone: recommendation.zone,
        width: productWidth,
        color: recommendation.color,
      });

      currentWidth += productWidth;
    });

    return placements;
  };

  // Gerar prompt detalhado para a IA
  const generatePrompt = (): string => {
    const placements = calculateProductPlacements();

    const productDescriptions = placements.map((p) => {
      const zoneHeight = p.zone === "Altura dos olhos" ? "eye level" : p.zone === "Altura das mãos" ? "hand level" : "low level";
      return `${p.name} on shelf ${p.shelf + 1} at ${zoneHeight}, occupying ${Math.round(p.width)}cm width`;
    }).join(", ");

    return `Create a photorealistic front view of a retail shelf display (gondola) with the following specifications:
- Shelf width: ${gondolaWidth}cm
- Number of shelves: ${shelves}
- Shelf depth: ${shelfDepth}cm
- Product placement: ${productDescriptions}
- Style: Professional retail photography, well-lit supermarket environment
- Perspective: Direct front view, straight angle
- Lighting: Bright, professional retail lighting
- Background: Clean supermarket environment
- Include shelf edges and metal frame
- Make it look like a real supermarket display`;
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
    const padding = 20;

    let svg = `<svg width="800" height="${height + padding * 2}" xmlns="http://www.w3.org/2000/svg">`;

    // Fundo
    svg += `<rect width="800" height="${height + padding * 2}" fill="#f5f5f5"/>`;

    // Desenhar prateleiras
    for (let i = 0; i < shelves; i++) {
      const y = padding + i * shelfHeight;
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
      svg += `<rect x="${x}" y="${y}" width="${width}" height="${shelfHeight - 2}" fill="${product.color}" stroke="#333" stroke-width="1" opacity="0.8"/>`;

      // Texto do produto
      const fontSize = Math.min(12, width / product.name.length);
      svg += `<text x="${x + width / 2}" y="${y + shelfHeight / 2}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle" fill="#000" font-weight="bold">${product.name.substring(0, 15)}</text>`;

      // Zona
      svg += `<text x="${x + width / 2}" y="${y + shelfHeight - 5}" font-size="10" text-anchor="middle" fill="#666">${product.zone}</text>`;
    });

    // Dimensões
    svg += `<text x="${padding + gondolaWidth / 2}" y="${height + padding + 15}" font-size="12" text-anchor="middle" fill="#333">Largura: ${gondolaWidth}cm | Profundidade: ${shelfDepth}cm | Prateleiras: ${shelves}</text>`;

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
          Gere uma visualização realista da gôndola com os produtos posicionados de acordo com as recomendações de margem e giro
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
            <h3 className="font-bold text-lg">Prévia da Gôndola</h3>
            <img
              src={generatedImage}
              alt="Prévia da gôndola"
              className="w-full border rounded-lg bg-white"
            />
            <p className="text-sm text-gray-600">
              Esta é uma prévia do posicionamento dos produtos. A versão final por IA será mais realista e detalhada.
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
