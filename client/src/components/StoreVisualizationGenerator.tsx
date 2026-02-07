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

    // Build product list with details
    const productList = products
      .map((p) => `${p.name} (${p.category.name})`)
      .join(", ");

    // Determine zone description
    let zoneDescription = "across all shelf zones";
    if (selectedZone === "eyes") {
      zoneDescription = "at eye level";
    } else if (selectedZone === "hands") {
      zoneDescription = "at hand level";
    } else if (selectedZone === "bottom") {
      zoneDescription = "at bottom shelf level";
    }

    // Build exposure type description
    let exposureDescription = "a retail shelf";
    if (exposureType === "terminalGondola") {
      exposureDescription = "a shelf terminal";
    } else if (exposureType === "freezerVertical") {
      exposureDescription = "a vertical freezer";
    } else if (exposureType === "freezerHorizontal") {
      exposureDescription = "a horizontal freezer";
    } else if (exposureType === "bancaFrutas") {
      exposureDescription = "a fruit and vegetable stand";
    }

    const prompt = `Professional retail store photograph showing ${exposureDescription} with the following products displayed ${zoneDescription}: ${productList}. 
    
The shelf is ${gondolaWidth}cm wide, ${shelfDepth}cm deep, and ${shelfHeight}cm tall between shelves. 
The products are neatly organized and well-lit in a modern supermarket setting. 
The image should be realistic, professional, and show how customers would see the products in a real store environment.
High quality, detailed, professional retail photography style.`;

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

      // Call the tRPC endpoint to generate image using AI
      const result = await generateMutation.mutateAsync({
        prompt,
      });

      if (result.success && result.url) {
        setGeneratedImage(result.url);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (err) {
      console.error("Error generating visualization:", err);
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
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateVisualization}
            className="mt-2"
          >
            {t.retry}
          </Button>
        </div>
      )}

      {generatedImage && (
        <div className="mt-4 space-y-2">
          <img
            src={generatedImage}
            alt="Store Visualization"
            className="w-full rounded-lg border border-gray-200 object-cover"
          />
          <p className="text-xs text-gray-500">
            Generated AI visualization based on simulation configuration
          </p>
        </div>
      )}

      {!generatedImage && !error && products.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            Click the button above to generate an AI visualization of your store layout
          </p>
        </div>
      )}
    </div>
  );
}
