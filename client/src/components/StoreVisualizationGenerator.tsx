/**
 * StoreVisualizationGenerator Component
 * Generates AI images representing how the store would look based on Smart Layout simulation
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

interface Product {
  id: string;
  name: string;
  category: {
    name: string;
    mainCategory: string;
  };
  largura?: number;
  comprimento?: number;
  zone?: string;
}

interface StoreVisualizationGeneratorProps {
  products: Product[];
  gondolaWidth: number;
  shelfHeight: number;
  shelfDepth: number;
  exposureType: string;
  selectedZone?: string | null;
}

const TRANSLATIONS = {
  pt: {
    generateVisualization: "Gerar Visualização da Loja",
    generating: "Gerando imagem...",
    storeLayout: "Layout da Loja",
    description: "Visualização em IA de como a loja ficaria com essa configuração",
    noProducts: "Adicione produtos à simulação para gerar visualização",
    error: "Erro ao gerar visualização. Tente novamente.",
    retry: "Tentar Novamente",
  },
  en: {
    generateVisualization: "Generate Store Visualization",
    generating: "Generating image...",
    storeLayout: "Store Layout",
    description: "AI visualization of how the store would look with this configuration",
    noProducts: "Add products to the simulation to generate visualization",
    error: "Error generating visualization. Try again.",
    retry: "Try Again",
  },
};

export default function StoreVisualizationGenerator({
  products,
  gondolaWidth,
  shelfHeight,
  shelfDepth,
  exposureType,
  selectedZone,
}: StoreVisualizationGeneratorProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const generateMutation = trpc.system.generateStoreVisualization.useMutation();

  const generateStorePrompt = (): string => {
    if (products.length === 0) {
      return "";
    }

    // Organize products by zone
    const productsByZone: Record<string, string[]> = {
      eyes: [],
      hands: [],
      bottom: [],
    };

    products.forEach((p) => {
      const zone = p.zone || "Altura das mãos";
      const productName = `${p.name}`;
      
      if (zone === "Altura dos olhos" || zone === "Eye Level") {
        productsByZone.eyes.push(productName);
      } else if (zone === "Altura das mãos" || zone === "Hand Level") {
        productsByZone.hands.push(productName);
      } else if (zone === "Lugar baixo" || zone === "Bottom Shelf") {
        productsByZone.bottom.push(productName);
      }
    });

    // Build detailed zone descriptions
    let zoneDetails = "";
    if (productsByZone.eyes.length > 0) {
      zoneDetails += `\n- TOP SHELF (Eye Level - Premium): ${productsByZone.eyes.join(", ")}`;
    }
    if (productsByZone.hands.length > 0) {
      zoneDetails += `\n- MIDDLE SHELF (Hand Level - Convenient): ${productsByZone.hands.join(", ")}`;
    }
    if (productsByZone.bottom.length > 0) {
      zoneDetails += `\n- BOTTOM SHELF (Heavy/Bulk): ${productsByZone.bottom.join(", ")}`;
    }

    // Build exposure type description
    let exposureDescription = "retail shelf/gondola";
    if (exposureType === "terminalGondola") {
      exposureDescription = "shelf terminal/end cap";
    } else if (exposureType === "freezerVertical") {
      exposureDescription = "vertical freezer";
    } else if (exposureType === "freezerHorizontal") {
      exposureDescription = "horizontal freezer";
    } else if (exposureType === "bancaFrutas") {
      exposureDescription = "fruit and vegetable stand";
    }

    const prompt = `CRITICAL INSTRUCTION: Generate a FRONT-FACING photograph of a retail shelf/gondola. The shelf MUST be viewed directly from the customer's perspective - looking straight at the shelf face. The shelf should be the main focus filling most of the frame.

VIEWPOINT: Straight-on front view ONLY. Customer eye-level perspective looking directly at the shelf. NOT a side view. NOT an angled view. FRONT FACING ONLY.

Retail shelf/gondola with products arranged in three shelf levels:${zoneDetails}

Shelf specifications:
- Width: ${gondolaWidth}cm
- Depth: ${shelfDepth}cm  
- Height between shelves: ${shelfHeight}cm

Product arrangement:
- TOP SHELF: Premium products at eye level, prominently displayed and well-lit
- MIDDLE SHELF: Popular items at convenient hand level, easily accessible
- BOTTOM SHELF: Heavier items, bulk products

Setting: Modern supermarket with professional lighting, clean and organized.
Photography style: Professional retail photography, realistic, high quality, detailed.
Lighting: Bright professional supermarket lighting highlighting all shelf zones clearly.

IMPORTANT: The image must show the shelf from a FRONT-FACING perspective as a customer would see it in a store. The shelf fills the frame. All products are visible and readable.`;

    return prompt;
  };

  const handleGenerateVisualization = async () => {
    if (products.length === 0) {
      setError(t.noProducts);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = generateStorePrompt();
      console.log("Generated prompt:", prompt);

      // Call the tRPC endpoint to generate image using AI
      const result = await generateMutation.mutateAsync({
        prompt,
      });

      console.log("Generation result:", result);
      if (result.success && result.url) {
        setGeneratedImage(result.url);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error generating visualization:", errorMessage);
      setError(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.storeLayout}</h3>
          <p className="text-sm text-gray-600">{t.description}</p>
        </div>
        <Button
          onClick={handleGenerateVisualization}
          disabled={isGenerating || products.length === 0}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.generating}
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              {t.generateVisualization}
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
          <Button
            onClick={handleGenerateVisualization}
            variant="ghost"
            size="sm"
            className="ml-2 text-red-700 hover:text-red-800"
          >
            {t.retry}
          </Button>
        </div>
      )}

      {generatedImage && (
        <div className="space-y-2">
          <img
            src={generatedImage}
            alt={t.storeLayout}
            className="w-full rounded-lg border border-gray-200 object-contain"
          />
          <p className="text-xs text-gray-500">
            {language === "pt"
              ? "Visualização gerada por IA. Clique no botão acima para gerar uma nova imagem."
              : "AI-generated visualization. Click the button above to generate a new image."}
          </p>
        </div>
      )}
    </div>
  );
}
