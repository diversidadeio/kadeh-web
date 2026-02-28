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
    shelfZone?: string;
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
    const productsForDistribution: ProductForDistribution[] = products.map(p => {
      // Use the calculated zone from the product category
      let zone = p.zone || "Altura das mãos";
      if (p.category && p.category.shelfZone) {
        zone = p.category.shelfZone;
      }
      
      return {
        id: p.id,
        name: p.name,
        largura: p.largura || 10,
        comprimento: p.comprimento || 5,
        zone: zone as "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo",
        giro: (p.giro || "Médio") as any,
        margem: (p.margem || "Média") as any,
        share: 10, // Default share
      };
    });

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
      const productNames = eyeLevelProducts.map(p => `${p.name} (${p.fronts} fronts)`).join(", ");
      eyeLevelDesc = `\n**Eye Level (${eyeLevelPercentage}% of space):** ${productNames}`;
    }

    if (handLevelProducts.length > 0) {
      const productNames = handLevelProducts.map(p => `${p.name} (${p.fronts} fronts)`).join(", ");
      handLevelDesc = `\n**Hand Level (${handLevelPercentage}% of space):** ${productNames}`;
    }

    if (bottomLevelProducts.length > 0) {
      const productNames = bottomLevelProducts.map(p => `${p.name} (${p.fronts} fronts)`).join(", ");
      bottomLevelDesc = `\n**Bottom Shelf (${bottomLevelPercentage}% of space):** ${productNames}`;
    }

    const prompt = `Create a realistic photograph of a retail store shelf with the following product arrangement:

**Shelf Dimensions:**
- Width: ${gondolaWidth}cm
- Height between shelves: ${shelfHeight}cm
- Depth: ${shelfDepth}cm
- Total shelves: ${numberOfShelves}

**Product Distribution by Zone:**
${eyeLevelDesc}
${handLevelDesc}
${bottomLevelDesc}

**Shelf Layout Details:**
${shelfDescriptions}

**Requirements:**
- Show a realistic retail environment with proper lighting
- Display products with clear labels and packaging
- Ensure products are positioned correctly by zone (eye level = premium positioning, hand level = accessible, bottom = bulk items)
- Use realistic store shelving and professional retail display
- Include store background and ambient lighting
- Make it look like a real supermarket or retail store

Generate a professional retail shelf photograph that matches this exact product distribution.`;

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
      const result = await generateMutation.mutateAsync({ prompt });

      if (result.url) {
        setGeneratedImage(result.url);
      } else {
        setError(t.error);
      }
    } catch (err) {
      console.error("Error generating visualization:", err);
      setError(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-md border border-border space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{t.storeLayout}</h3>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>

      <Button
        onClick={handleGenerateVisualization}
        disabled={isGenerating || products.length === 0}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.generating}
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4 mr-2" />
            {t.generateVisualization}
          </>
        )}
      </Button>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm">
          {error}
          {error === t.error && (
            <Button
              onClick={handleGenerateVisualization}
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              {t.retry}
            </Button>
          )}
        </div>
      )}

      {generatedImage && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {language === 'pt' ? 'Visualização Gerada:' : 'Generated Visualization:'}
          </p>
          <img
            src={generatedImage}
            alt="Store visualization"
            className="w-full rounded-md border border-border object-cover max-h-96"
          />
        </div>
      )}
    </div>
  );
}
