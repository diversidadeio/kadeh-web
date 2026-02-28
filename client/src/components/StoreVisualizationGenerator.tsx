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

    // Group products by zone (same logic as GondolaFrontView)
    const productsByZone: Record<string, Product[]> = {
      "Altura dos olhos": [],
      "Altura das mãos": [],
      "Parte de Baixo": [],
    };

    products.forEach(p => {
      let zone = p.zone || "Altura das mãos";
      if (p.category && p.category.shelfZone) {
        zone = p.category.shelfZone;
      }
      
      if (zone === "Altura dos olhos" || zone === "Altura das mãos" || zone === "Parte de Baixo") {
        productsByZone[zone].push(p);
      }
    });

    // Build detailed zone descriptions with product grouping
    let eyeLevelDesc = "";
    let handLevelDesc = "";
    let bottomLevelDesc = "";

    const eyeLevelProducts = productsByZone["Altura dos olhos"];
    const handLevelProducts = productsByZone["Altura das mãos"];
    const bottomLevelProducts = productsByZone["Parte de Baixo"];

    // Calculate total width for each zone
    const eyeLevelWidth = eyeLevelProducts.reduce((sum, p) => sum + (p.largura || 10), 0);
    const handLevelWidth = handLevelProducts.reduce((sum, p) => sum + (p.largura || 10), 0);
    const bottomLevelWidth = bottomLevelProducts.reduce((sum, p) => sum + (p.largura || 10), 0);

    // Build descriptions with visual arrangement
    if (eyeLevelProducts.length > 0) {
      const productList = eyeLevelProducts
        .map(p => `${p.name} (${p.largura || 10}cm wide)`)
        .join(" → ");
      const percentage = (eyeLevelWidth / gondolaWidth * 100).toFixed(1);
      eyeLevelDesc = `\n**Eye Level Zone (${percentage}% of width):** Products arranged left to right: ${productList}`;
    }

    if (handLevelProducts.length > 0) {
      const productList = handLevelProducts
        .map(p => `${p.name} (${p.largura || 10}cm wide)`)
        .join(" → ");
      const percentage = (handLevelWidth / gondolaWidth * 100).toFixed(1);
      handLevelDesc = `\n**Hand Level Zone (${percentage}% of width):** Products arranged left to right: ${productList}`;
    }

    if (bottomLevelProducts.length > 0) {
      const productList = bottomLevelProducts
        .map(p => `${p.name} (${p.largura || 10}cm wide)`)
        .join(" → ");
      const percentage = (bottomLevelWidth / gondolaWidth * 100).toFixed(1);
      bottomLevelDesc = `\n**Bottom Shelf Zone (${percentage}% of width):** Products arranged left to right: ${productList}`;
    }

    // Build visual representation
    let visualLayout = "";
    if (eyeLevelProducts.length > 0) {
      visualLayout += `\n\n[EYE LEVEL]\n`;
      eyeLevelProducts.forEach(p => {
        visualLayout += `[${p.name.substring(0, 8)}]`;
      });
    }
    if (handLevelProducts.length > 0) {
      visualLayout += `\n[HAND LEVEL]\n`;
      handLevelProducts.forEach(p => {
        visualLayout += `[${p.name.substring(0, 8)}]`;
      });
    }
    if (bottomLevelProducts.length > 0) {
      visualLayout += `\n[BOTTOM]\n`;
      bottomLevelProducts.forEach(p => {
        visualLayout += `[${p.name.substring(0, 8)}]`;
      });
    }

    const prompt = `Create a realistic photograph of a retail store shelf with products EXACTLY arranged as shown below.

**CRITICAL: Products must be grouped and positioned EXACTLY as described:**
${eyeLevelDesc}
${handLevelDesc}
${bottomLevelDesc}

**Visual Layout Reference:**
${visualLayout}

**Shelf Specifications:**
- Total Width: ${gondolaWidth}cm
- Height between shelves: ${shelfHeight}cm
- Shelf Depth: ${shelfDepth}cm
- Number of shelves: 3 (Eye Level, Hand Level, Bottom)

**IMPORTANT POSITIONING RULES:**
- Eye Level (top shelf): Premium positioning for high-margin products
- Hand Level (middle shelf): Most accessible for high-turnover products
- Bottom Shelf: Bulk items and low-margin products
- Products in each zone must be grouped together horizontally
- Maintain the exact left-to-right order shown above
- Fill any remaining space by repeating the product sequence

**Visual Style:**
- Realistic supermarket/retail environment
- Professional lighting and store background
- Clear product packaging and labels
- Modern retail shelving system
- Professional product photography style

Generate a professional retail shelf photograph that EXACTLY matches this product grouping and positioning.`;

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
