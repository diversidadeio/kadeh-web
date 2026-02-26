/**
 * StoreVisualizationGenerator Component
 * Generates AI images representing how the store would look based on Smart Layout simulation
 * Now uses the intelligent cascading distribution algorithm to ensure 100% shelf occupancy
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { distributeProductsAcrossShelves, type ProductForDistribution } from "@/utils/shelfDistributor";

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
  giro?: string;
  margem?: string;
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

    // Convert products to distribution format
    const productsForDistribution: ProductForDistribution[] = products.map(p => ({
      id: p.id,
      name: p.name,
      largura: p.largura || 10,
      comprimento: p.comprimento || 5,
      zone: (p.zone || "Altura das mãos") as "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo",
      giro: (p.giro || "Médio") as any,
      margem: (p.margem || "Média") as any,
      share: 10, // Default share
    }));

    // Use intelligent cascading distribution
    const distribution = distributeProductsAcrossShelves(
      productsForDistribution,
      gondolaWidth,
      numberOfShelves
    );

    // Build detailed shelf descriptions with actual product distribution
    let shelfDescriptions = "";
    distribution.shelves.forEach((shelf, idx) => {
      const zoneLabel = {
        "Altura dos olhos": language === "pt" ? "Altura dos Olhos (Eye Level)" : "Eye Level",
        "Altura das mãos": language === "pt" ? "Altura das Mãos (Hand Level)" : "Hand Level",
        "Parte de Baixo": language === "pt" ? "Parte de Baixo (Bottom)" : "Bottom Shelf",
      }[shelf.zone];

      const productList = shelf.products
        .map(p => `${p.name} (${p.fronts} fronts)`)
        .join(", ");

      shelfDescriptions += `\n**Shelf ${shelf.shelfNumber} (${zoneLabel}):** ${productList} - ${shelf.utilizationPercent.toFixed(1)}% occupied`;
    });

    // Organize products by zone with actual distribution
    const productsByZone: Record<string, { name: string; fronts: number }[]> = {
      "Altura dos olhos": [],
      "Altura das mãos": [],
      "Parte de Baixo": [],
    };

    distribution.shelves.forEach((shelf) => {
      shelf.products.forEach((p) => {
        const existing = productsByZone[shelf.zone].find(prod => prod.name === p.name);
        if (existing) {
          existing.fronts += p.fronts;
        } else {
          productsByZone[shelf.zone].push({
            name: p.name,
            fronts: p.fronts,
          });
        }
      });
    });

    // Build zone descriptions with actual product distribution
    let eyeLevelDesc = "";
    let handLevelDesc = "";
    let bottomLevelDesc = "";

    const eyeLevelProducts = productsByZone["Altura dos olhos"];
    const handLevelProducts = productsByZone["Altura das mãos"];
    const bottomLevelProducts = productsByZone["Parte de Baixo"];

    const eyeLevelPercentage = (eyeLevelProducts.reduce((sum, p) => sum + p.fronts, 0) / distribution.totalProducts * 100).toFixed(1);
    const handLevelPercentage = (handLevelProducts.reduce((sum, p) => sum + p.fronts, 0) / distribution.totalProducts * 100).toFixed(1);
    const bottomLevelPercentage = (bottomLevelProducts.reduce((sum, p) => sum + p.fronts, 0) / distribution.totalProducts * 100).toFixed(1);

    if (eyeLevelProducts.length > 0) {
      const productList = eyeLevelProducts.map(p => `${p.name} (${p.fronts} fronts)`).join(", ");
      eyeLevelDesc = `\n**Altura dos Olhos (Eye Level - Premium Placement):**\n${productList}\nThese products are positioned at customer eye level (approximately 1.5m high) for maximum visibility. This zone represents ${eyeLevelPercentage}% of total display space with ${eyeLevelProducts.length} product types.`;
    }

    if (handLevelProducts.length > 0) {
      const productList = handLevelProducts.map(p => `${p.name} (${p.fronts} fronts)`).join(", ");
      handLevelDesc = `\n**Altura das Mãos (Hand Level - Convenient Reach):**\n${productList}\nThese products are positioned at convenient hand reach (approximately 0.9-1.2m high) for easy access. This zone represents ${handLevelPercentage}% of total display space with ${handLevelProducts.length} product types.`;
    }

    if (bottomLevelProducts.length > 0) {
      const productList = bottomLevelProducts.map(p => `${p.name} (${p.fronts} fronts)`).join(", ");
      bottomLevelDesc = `\n**Parte de Baixo (Bottom Shelf - Base Products):**\n${productList}\nThese products are positioned at the bottom shelf (approximately 0-0.5m high). This zone represents ${bottomLevelPercentage}% of total display space with ${bottomLevelProducts.length} product types.`;
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

    const prompt = `Professional retail store photograph showing ${exposureDescription} with ${numberOfShelves} shelves displaying ${products.length} products strategically positioned by exposure zones. ALL SHELVES ARE 100% OCCUPIED with intelligent product distribution and cascading.${zoneDetails}

**Detailed Shelf Distribution (100% Occupancy - Intelligent Cascading):**
${shelfDescriptions}

**Key Distribution Metrics:**
- Total Products: ${products.length}
- Total Fronts: ${distribution.totalProducts}
- Total Space Used: ${distribution.totalUsedWidth}cm / ${distribution.totalAvailableWidth}cm
- Utilization: ${distribution.utilizationPercentage.toFixed(1)}%
- Average Fronts per Shelf: ${(distribution.totalProducts / numberOfShelves).toFixed(1)}
- All ${numberOfShelves} shelves are 100% occupied

**Shelf Specifications:**
- Width: ${gondolaWidth}cm
- Depth: ${shelfDepth}cm
- Height between shelves: ${shelfHeight}cm
- Total shelves: ${numberOfShelves}
- Shelf 1-${Math.ceil(numberOfShelves * 0.30)} (Top): Altura dos Olhos (Eye Level) - Premium placement zone
- Shelf ${Math.ceil(numberOfShelves * 0.30) + 1}-${Math.ceil(numberOfShelves * 0.70)} (Middle): Altura das Mãos (Hand Level) - Convenient reach zone
- Shelf ${Math.ceil(numberOfShelves * 0.70) + 1}-${numberOfShelves} (Bottom): Parte de Baixo (Bottom Shelf) - Base products zone

${exposureTypeDetail}

**CRITICAL Visual Requirements:**
- EVERY SHELF MUST BE 100% FULL with products - NO EMPTY SHELVES
- Products at eye level are prominently displayed with excellent lighting
- Products at hand level are easily accessible and well-organized
- Products at bottom shelf are clearly visible and properly arranged
- The display shows intelligent cascading distribution where products overflow from their primary zones to fill adjacent zones
- Each shelf is completely filled from left to right with no gaps
- The display is neatly organized in a modern supermarket setting with professional, warm lighting
- Clear shelf dividers and zone markers visible
- Realistic product placement showing actual retail merchandising standards
- High quality, detailed, professional retail photography style
- Show how customers would naturally see and interact with the products in a real store environment
- Each shelf zone should be clearly distinguishable with proper lighting and organization
- Product distribution across shelves should show 100% occupancy with realistic spacing`;

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
            Generated AI visualization based on intelligent cascading distribution with 100% shelf occupancy
          </p>
        </div>
      )}

      {!generatedImage && !error && products.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            Click the button above to generate an AI visualization of your store layout with 100% shelf occupancy
          </p>
        </div>
      )}
    </div>
  );
}
