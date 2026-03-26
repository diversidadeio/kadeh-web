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

    // Calculate percentages for each product using share if available
    const getProductPercentages = (zoneProducts: Product[], zoneWidth: number) => {
      return zoneProducts.map(p => {
        const share = (p as any).share;
        const percentage = share !== undefined ? share : ((p.largura || 10) / zoneWidth * 100);
        return {
          name: p.name,
          width: p.largura || 10,
          percentage: percentage.toFixed(1),
          share: share
        };
      });
    };

    const eyeLevelPercentages = eyeLevelWidth > 0 ? getProductPercentages(eyeLevelProducts, eyeLevelWidth) : [];
    const handLevelPercentages = handLevelWidth > 0 ? getProductPercentages(handLevelProducts, handLevelWidth) : [];
    const bottomLevelPercentages = bottomLevelWidth > 0 ? getProductPercentages(bottomLevelProducts, bottomLevelWidth) : [];

    // Build detailed product specifications
    let eyeLevelSpec = "";
    let handLevelSpec = "";
    let bottomLevelSpec = "";

     if (bottomLevelPercentages.length > 0) {
      bottomLevelSpec = `\n**PRATELEIRA 1 - PARTE DE BAIXO (Bottom Shelf - INFERIOR):**\n`;
      bottomLevelPercentages.forEach((p, idx) => {
        bottomLevelSpec += `${idx + 1}. ${p.name}: ${p.percentage}% da largura (${p.width}cm)\n`;
      });
      bottomLevelSpec += `Total: ${(bottomLevelWidth / gondolaWidth * 100).toFixed(1)}% da largura total\n`;
    }

    if (handLevelPercentages.length > 0) {
      handLevelSpec = `\n**PRATELEIRAS 2-4 - ALTURA DAS MÃOS (Middle Shelves):**\n`;
      handLevelPercentages.forEach((p, idx) => {
        handLevelSpec += `${idx + 1}. ${p.name}: ${p.percentage}% da largura (${p.width}cm)\n`;
      });
      handLevelSpec += `Total: ${(handLevelWidth / gondolaWidth * 100).toFixed(1)}% da largura total\n`;
    }

    if (eyeLevelProducts.length > 0) {
      eyeLevelSpec = `\n**PRATELEIRA 5 - ALTURA DOS OLHOS (Top Shelf - SUPERIOR):**\n`;
      eyeLevelPercentages.forEach((p, idx) => {
        eyeLevelSpec += `${idx + 1}. ${p.name}: ${p.percentage}% da largura (${p.width}cm)\n`;
      });
      eyeLevelSpec += `Total: ${(eyeLevelWidth / gondolaWidth * 100).toFixed(1)}% da largura total\n`;
    }

    // Build visual layout
    let visualLayout = "";
    if (bottomLevelProducts.length > 0) {
      visualLayout += `\n[PARTE DE BAIXO - INFERIOR]\n`;
      bottomLevelProducts.forEach(p => {
        visualLayout += `[${p.name.substring(0, 12).padEnd(12)}]`;
      });
    }
    if (handLevelProducts.length > 0) {
      visualLayout += `\n[ALTURA DAS MÃOS]\n`;
      handLevelProducts.forEach(p => {
        visualLayout += `[${p.name.substring(0, 12).padEnd(12)}]`;
      });
    }
    if (eyeLevelProducts.length > 0) {
      visualLayout += `\n[ALTURA DOS OLHOS - SUPERIOR]\n`;
      eyeLevelProducts.forEach(p => {
        visualLayout += `[${p.name.substring(0, 12).padEnd(12)}]`;
      });
    }

    const prompt = `Você é um merchandiser profissional de varejo. Crie uma fotografia REALISTA de uma gôndola de loja com produtos posicionados EXATAMENTE conforme especificado abaixo.

**REQUISITO CRÍTICO: A imagem gerada DEVE mostrar produtos nas EXATAS posições e percentuais especificados. Esta é uma visualização de planograma.**

**CONFIGURAÇÃO DA GÔNDOLA:**
- Largura Total: ${gondolaWidth}cm
- Altura entre prateleiras: ${shelfHeight}cm
- Profundidade da prateleira: ${shelfDepth}cm
- Total de Prateleiras: 5 (Olhos, Mãos, Mãos, Mãos, Baixo)

**POSICIONAMENTO DE PRODUTOS - SIGA EXATAMENTE:**
${eyeLevelSpec}${handLevelSpec}${bottomLevelSpec}

**DIAGRAMA DE LAYOUT VISUAL:**
${visualLayout}

**REGRAS OBRIGATÓRIAS DE POSICIONAMENTO:**
1. PARTE DE BAIXO (Prateleira 1 - INFERIOR): Produtos da esquerda para direita nesta ordem exata: ${bottomLevelProducts.map(p => p.name).join(' → ')}
2. ALTURA DAS MÃOS (Prateleiras 2-4): Produtos da esquerda para direita nesta ordem exata: ${handLevelProducts.map(p => p.name).join(' → ')}
3. ALTURA DOS OLHOS (Prateleira 5 - SUPERIOR): Produtos da esquerda para direita nesta ordem exata: ${eyeLevelProducts.map(p => p.name).join(' → ')}
4. Cada produto ocupa seu percentual especificado da largura da prateleira
5. Produtos são agrupados por nível de prateleira - NÃO misture produtos entre prateleiras
6. Repita a sequência de produtos horizontalmente para preencher a largura da prateleira
7. NENHUMA prateleira pode estar vazia - preencha completamente com os produtos listados
8. Use APENAS os produtos especificados acima - não adicione produtos fictícios ou genéricos
9. Mantenha aparência profissional de varejo com iluminação adequada

**IMPORTANTE - NÃO FAÇA:**
- Mude a ordem dos produtos
- Coloque produtos em prateleiras erradas
- Use produtos genéricos de placeholder ou fictícios
- Ignore os percentuais especificados
- Gere produtos diferentes dos listados
- Deixe prateleiras vazias ou parcialmente preenchidas
- Adicione produtos que não estão na lista de simulação

**ESTILO VISUAL:**
- Ambiente profissional de supermercado/varejo
- Sistema de prateleiras moderno com 5 prateleiras visíveis
- Iluminação profissional destacando cada prateleira
- Embalagens de produtos e rótulos claramente visíveis
- Fundo realista de loja de varejo
- Estilo de fotografia de produto profissional

Gere uma fotografia profissional de gôndola de varejo que EXATAMENTE corresponda a esta especificação de planograma.`;

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
      }
    } catch (err) {
      console.error("Error generating visualization:", err);
      setError(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-card rounded-lg border border-border">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t.storeLayout}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
      </div>

      <Button
        onClick={handleGenerateVisualization}
        disabled={isGenerating || products.length === 0}
        className="w-full"
        size="lg"
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
        <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <Button
            onClick={handleGenerateVisualization}
            variant="outline"
            size="sm"
          >
            {t.retry}
          </Button>
        </div>
      )}

      {generatedImage && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Visualização Gerada:</p>
          <div className="w-full overflow-x-auto bg-muted rounded-md border border-border p-4">
            <img
              src={generatedImage}
              alt="Store visualization"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
