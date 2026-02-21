/**
 * StoreVisualizationGenerator Component
 * Generates AI images representing how the store would look based on Smart Layout simulation
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { generateShelfDescription, calculateZonePercentages } from "@/utils/gondolaDistribution";

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
  numberOfShelves?: number;
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
  numberOfShelves = 5,
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

    // Calculate zone percentages and shelf distribution
    const zonePercentages = calculateZonePercentages(
      products.map(p => ({
        zone: p.zone || "Altura das mãos",
        share: 1, // Equal weight for all products
      }))
    );

    // Generate detailed shelf description
    const shelfDescription = generateShelfDescription(
      products.map(p => ({
        id: p.id,
        name: p.name,
        zone: p.zone || "Altura das mãos",
        share: 1,
        category: p.category,
      })),
      numberOfShelves,
      language as 'pt' | 'en'
    );

    // Organize products by zone for additional context
    const productsByZone: Record<string, string[]> = {
      eyes: [],
      hands: [],
      bottom: [],
    };

    products.forEach((p) => {
      const zone = p.zone || "Altura das mãos";
      const productName = `${p.name} (${p.category.name})`;
      
      if (zone === "Altura dos olhos" || zone === "eyes") {
        productsByZone.eyes.push(productName);
      } else if (zone === "Altura das mãos" || zone === "hands") {
        productsByZone.hands.push(productName);
      } else if (zone === "Parte de Baixo" || zone === "bottom") {
        productsByZone.bottom.push(productName);
      }
    });

    // Build detailed zone descriptions with Portuguese and English
    let eyeLevelDesc = "";
    let handLevelDesc = "";
    let bottomLevelDesc = "";

    if (productsByZone.eyes.length > 0) {
      eyeLevelDesc = `\n**Altura dos Olhos (Eye Level - Premium Placement):**\n${productsByZone.eyes.join(", ")}\nThese products are positioned at customer eye level (approximately 1.5m high) for maximum visibility and premium placement. This zone represents ${zonePercentages.eyeLevel.toFixed(1)}% of total shelf space.`;
    }
    if (productsByZone.hands.length > 0) {
      handLevelDesc = `\n**Altura das Mãos (Hand Level - Convenient Reach):**\n${productsByZone.hands.join(", ")}\nThese products are positioned at convenient hand reach (approximately 0.9-1.2m high) for easy access and frequent purchase. This zone represents ${zonePercentages.handLevel.toFixed(1)}% of total shelf space.`;
    }
    if (productsByZone.bottom.length > 0) {
      bottomLevelDesc = `\n**Parte de Baixo (Bottom Shelf - Heavy/Bulk Items):**\n${productsByZone.bottom.join(", ")}\nThese products are positioned at the bottom shelf (approximately 0-0.5m high) for bulk items, heavy products, and promotional displays. This zone represents ${zonePercentages.bottomLevel.toFixed(1)}% of total shelf space.`;
    }

    const zoneDetails = eyeLevelDesc + handLevelDesc + bottomLevelDesc;

    // Build exposure type description
    let exposureDescription = "a retail shelf";
    let exposureTypeDetail = "";
    if (exposureType === "terminalGondola") {
      exposureDescription = "a shelf terminal (end-cap display)";
      exposureTypeDetail = "This is a high-traffic end-cap display at the end of an aisle.";
    } else if (exposureType === "freezerVertical") {
      exposureDescription = "a vertical freezer";
      exposureTypeDetail = "This is a vertical freezer display with multiple shelves.";
    } else if (exposureType === "freezerHorizontal") {
      exposureDescription = "a horizontal freezer";
      exposureTypeDetail = "This is a horizontal freezer display with top-opening access.";
    } else if (exposureType === "bancaFrutas") {
      exposureDescription = "a fruit and vegetable stand";
      exposureTypeDetail = "This is a fresh produce display stand with tiered presentation.";
    } else {
      exposureTypeDetail = "This is a standard retail shelf display.";
    }

    // Calculate number of fronts per shelf
    const productsPerZone = {
      eyes: productsByZone.eyes.length,
      hands: productsByZone.hands.length,
      bottom: productsByZone.bottom.length,
    };
    
    const frontsPerShelf = Math.ceil(products.length / numberOfShelves);
    const shelfDistribution = [
      `Shelf 1 (Top - Eye Level): ${Math.ceil(productsPerZone.eyes / 1)} fronts`,
      `Shelves 2-3 (Middle - Hand Level): ${Math.ceil(productsPerZone.hands / 2)} fronts each`,
      `Shelves 4+ (Bottom): ${Math.ceil(productsPerZone.bottom / (numberOfShelves - 3))} fronts each`,
    ].join('\n');

    const prompt = `Professional retail store photograph showing ${exposureDescription} with ${numberOfShelves} shelves displaying products strategically positioned by exposure zones. Total of ${products.length} products distributed across ${frontsPerShelf} average fronts per shelf.${zoneDetails}

**Detailed Shelf Distribution:**
${shelfDescription}

**Product Front Distribution:**
${shelfDistribution}

**Shelf Specifications:**
- Width: ${gondolaWidth}cm
- Depth: ${shelfDepth}cm
- Height between shelves: ${shelfHeight}cm
- Total shelves: ${numberOfShelves}
- Average fronts per shelf: ${frontsPerShelf}
- Shelf 1 (Top): Altura dos Olhos (Eye Level) - Premium placement zone - ${productsPerZone.eyes} product fronts
- Shelves 2-3 (Middle): Altura das Mãos (Hand Level) - Convenient reach zone - ${productsPerZone.hands} product fronts
- Shelves 4+ (Bottom): Parte de Baixo (Bottom Shelf) - Bulk and heavy items zone - ${productsPerZone.bottom} product fronts

${exposureTypeDetail}

**Visual Requirements:**
- Products at eye level (Altura dos Olhos) are prominently displayed with excellent lighting and visibility - representing ${zonePercentages.eyeLevel.toFixed(1)}% of shelf space
- Products at hand level (Altura das Mãos) are easily accessible and well-organized - representing ${zonePercentages.handLevel.toFixed(1)}% of shelf space
- Products at bottom shelf (Parte de Baixo) are clearly visible and properly arranged - representing ${zonePercentages.bottomLevel.toFixed(1)}% of shelf space
- The display is neatly organized in a modern supermarket setting with professional, warm lighting
- Clear shelf dividers and zone markers visible
- Realistic product placement showing actual retail merchandising standards
- High quality, detailed, professional retail photography style
- Show how customers would naturally see and interact with the products in a real store environment
- Each shelf zone should be clearly distinguishable with proper lighting and organization
- Product distribution across shelves should match the percentages specified above`;

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
