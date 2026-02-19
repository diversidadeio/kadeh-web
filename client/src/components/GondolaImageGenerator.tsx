/**
 * GondolaImageGenerator Component
 * Generates AI-powered gondola visualization respecting width, shelf count, and depth parameters
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

interface GondolaImageGeneratorProps {
  products: Product[];
  gondolaWidth: number;
  shelves: number;
  shelfDepth: number;
  getRecommendation: (giro: string, margem: string) => Recommendation;
}

export default function GondolaImageGenerator({
  products,
  gondolaWidth,
  shelves,
  shelfDepth,
  getRecommendation,
}: GondolaImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateGondolaImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Build detailed prompt with all parameters
      const productDescriptions = products
        .map((p) => {
          const rec = getRecommendation(p.giro, p.margem);
          return `${p.name} (${rec.frentes} quadrante(s), ${rec.zone})`;
        })
        .join(", ");

      const zoneMapping = {
        "Altura dos olhos": "eye level (top shelves)",
        "Altura das mãos": "hand level (middle shelves)",
        "Lugar baixo": "low level (bottom shelf)",
      };

      const prompt = `
Create a realistic retail gondola shelf visualization with these exact specifications:

GONDOLA DIMENSIONS:
- Width: ${gondolaWidth}cm
- Depth: ${shelfDepth}cm
- Number of shelves: ${shelves}
- Shelf arrangement: ${shelves === 1 ? "single shelf" : shelves <= 3 ? "compact" : "full-height"}

PRODUCT LAYOUT:
${products
  .map((p) => {
    const rec = getRecommendation(p.giro, p.margem);
    const zoneLabel = zoneMapping[rec.zone as keyof typeof zoneMapping] || rec.zone;
    return `- ${p.name}: ${rec.frentes} quadrante(s) at ${zoneLabel}, ${rec.label}`;
  })
  .join("\n")}

VISUAL REQUIREMENTS:
- Professional retail environment
- Accurate shelf proportions based on dimensions
- Products clearly visible and organized by zone
- Color-coded zones: green for eye level, yellow for hand level, orange for low level
- Modern supermarket aesthetic
- Proper lighting and shadows
- Show product packages/boxes realistically
- Include shelf edges and structure

Generate a photorealistic gondola shelf display that matches these exact specifications.
      `;

      // Call the image generation API through tRPC
      const response = await fetch("/api/trpc/system.generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      
      if (data.result?.url) {
        setGeneratedImageUrl(data.result.url);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate gondola image"
      );
      console.error("Image generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Visualização Renderizada por IA
      </h3>

      <div className="mb-4 p-4 bg-muted rounded-md border border-border">
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Parâmetros da Gôndola:</strong>
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Largura:</span> {gondolaWidth}cm
          </div>
          <div>
            <span className="font-medium">Profundidade:</span> {shelfDepth}cm
          </div>
          <div>
            <span className="font-medium">Prateleiras:</span> {shelves}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <strong>Erro:</strong> {error}
          </p>
        </div>
      )}

      {generatedImageUrl ? (
        <div className="mb-4">
          <img
            src={generatedImageUrl}
            alt="Gondola visualization"
            className="w-full rounded-md border border-border object-contain"
            style={{ maxHeight: "500px" }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Imagem gerada com base nos parâmetros configurados
          </p>
        </div>
      ) : (
        <div className="mb-4 bg-gray-100 rounded-md border border-border flex items-center justify-center" style={{ height: "300px" }}>
          <p className="text-muted-foreground text-sm">
            Clique no botão abaixo para gerar a visualização
          </p>
        </div>
      )}

      <Button
        onClick={generateGondolaImage}
        disabled={isGenerating || products.length === 0}
        className="w-full flex items-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando visualização...
          </>
        ) : (
          "Gerar Visualização por IA"
        )}
      </Button>

      {products.length === 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          Adicione produtos para gerar a visualização
        </p>
      )}
    </div>
  );
}
