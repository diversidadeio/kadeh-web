/**
 * StoreVisualizationGeneratorV2 Component
 * VERSÃO SINCRONIZADA COM GondolaFrontViewIntelligent
 * 
 * Usa EXATAMENTE a mesma lógica de distribuição do GondolaFrontViewIntelligent
 * para garantir que a imagem IA represente fielmente a visualização frontal.
 * 
 * PRINCÍPIOS:
 * 1. Recebe os dados JÁ PROCESSADOS (mesmos que vão para GondolaFrontViewIntelligent)
 * 2. Usa a mesma função distributeProductsToShelves
 * 3. Prompt descreve CADA prateleira individualmente com produtos e proporções exatas
 * 4. Nenhuma prateleira fica vazia na imagem IA
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

interface Product {
  id: string;
  name: string;
  zone?: string;
  zona?: string;
  share?: number;
  quadrantes?: number;
  largura?: number;
  comprimento?: number;
  giro?: string;
  margem?: string;
  category?: {
    name?: string;
    mainCategory?: string;
    shelfZone?: string;
  };
}

interface StoreVisualizationGeneratorV2Props {
  products: Product[];
  numberOfShelves?: number;
  totalWidth?: number;
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
    success: "Imagem gerada com sucesso!",
  },
  en: {
    generateVisualization: "Generate Store Visualization",
    generating: "Generating image...",
    storeLayout: "Store Layout",
    description: "AI visualization of how the store would look with this configuration",
    noProducts: "Add products to the simulation to generate visualization",
    error: "Error generating visualization. Try again.",
    retry: "Try Again",
    success: "Image generated successfully!",
  },
};

// ============================================================
// EXACT SAME DISTRIBUTION LOGIC AS GondolaFrontViewIntelligent
// ============================================================

function getShelvesForZone(zone: string, totalShelves: number): number[] {
  const bottomCount = 2;
  const handCount = 2;
  const eyeCount = totalShelves - bottomCount - handCount;

  if (zone === "Parte de Baixo") {
    return Array.from({ length: bottomCount }, (_, i) => i + 1);
  } else if (zone === "Altura das mãos") {
    return Array.from({ length: handCount }, (_, i) => bottomCount + i + 1);
  } else {
    return Array.from({ length: Math.max(eyeCount, 0) }, (_, i) => bottomCount + handCount + i + 1);
  }
}

function getZoneForShelf(shelfNumber: number, totalShelves: number): string {
  const bottomCount = 2;
  const handCount = 2;

  if (shelfNumber <= bottomCount) {
    return "Parte de Baixo";
  } else if (shelfNumber <= bottomCount + handCount) {
    return "Altura das mãos";
  } else {
    return "Altura dos olhos";
  }
}

function distributeProductsToShelves(
  products: Product[],
  totalShelves: number
): Map<number, Product[]> {
  const distribution = new Map<number, Product[]>();

  for (let i = 1; i <= totalShelves; i++) {
    distribution.set(i, []);
  }

  if (products.length === 0) {
    return distribution;
  }

  // Group products by zone
  const productsByZone: Record<string, Product[]> = {
    "Altura dos olhos": [],
    "Altura das mãos": [],
    "Parte de Baixo": [],
  };

  products.forEach((p) => {
    const zone = p.zone || p.zona || "Altura das mãos";
    if (zone in productsByZone) {
      productsByZone[zone].push(p);
    }
  });

  // Sort products by share (larger share first)
  Object.keys(productsByZone).forEach((zone) => {
    productsByZone[zone].sort((a, b) => (b.share || 0) - (a.share || 0));
  });

  // Distribute products to their zone shelves
  // Each product gets added to ALL shelves in its zone
  Object.keys(productsByZone).forEach((zone) => {
    const shelvesInZone = getShelvesForZone(zone, totalShelves);
    const productsInZone = productsByZone[zone];

    shelvesInZone.forEach((shelfNumber) => {
      const shelf = distribution.get(shelfNumber) || [];
      productsInZone.forEach((product) => {
        shelf.push(product);
      });
      distribution.set(shelfNumber, shelf);
    });
  });

  // Fill empty space with complementary products from other zones
  distribution.forEach((shelfProducts, shelfNumber) => {
    const zone = getZoneForShelf(shelfNumber, totalShelves);
    const totalShare = shelfProducts.reduce((sum, p) => sum + (p.share || 0), 0);

    if (totalShare < 99.9) {
      let remainingSpace = 100 - totalShare;

      const neighboringZones = zone === "Altura das mãos"
        ? ["Altura dos olhos", "Parte de Baixo"]
        : zone === "Altura dos olhos"
        ? ["Altura das mãos"]
        : ["Altura das mãos"];

      for (const neighborZone of neighboringZones) {
        if (remainingSpace <= 0.1) break;

        const neighborProducts = productsByZone[neighborZone]
          .filter((p) => !shelfProducts.some((sp) => sp.id === p.id));

        for (const product of neighborProducts) {
          if (remainingSpace <= 0.1) break;

          const productShare = product.share || 0;
          if (productShare <= remainingSpace + 0.1) {
            shelfProducts.push(product);
            remainingSpace -= productShare;
          }
        }
      }
    }
  });

  return distribution;
}

// ============================================================
// PROMPT GENERATION - Describes each shelf exactly
// ============================================================

function buildDetailedPrompt(
  products: Product[],
  numberOfShelves: number,
  totalWidth: number,
  language: string
): string {
  const distribution = distributeProductsToShelves(products, numberOfShelves);

  // Get category name from first product
  const categoryName = products.length > 0
    ? (products[0].category?.mainCategory || products[0].category?.name || 'Produtos')
    : 'Produtos';

  // Build detailed description for each shelf (from top to bottom)
  let shelfDetails = '';

  for (let i = numberOfShelves; i >= 1; i--) {
    const shelfProducts = distribution.get(i) || [];
    const zone = getZoneForShelf(i, numberOfShelves);

    const zoneLabelPt: Record<string, string> = {
      'Altura dos olhos': 'Altura dos olhos (TOPO)',
      'Altura das mãos': 'Altura das mãos (MEIO)',
      'Parte de Baixo': 'Parte de Baixo (BASE)',
    };

    const zoneLabel = zoneLabelPt[zone] || zone;

    if (shelfProducts.length > 0) {
      // Calculate total share for normalization
      const totalShare = shelfProducts.reduce((sum, p) => sum + (p.share || 0), 0);

      // Build product list with normalized percentages
      const productDescriptions = shelfProducts.map(p => {
        const normalizedPercent = totalShare > 0
          ? ((p.share || 0) / totalShare * 100).toFixed(0)
          : '0';
        const widthCm = totalShare > 0
          ? ((p.share || 0) / totalShare * totalWidth).toFixed(0)
          : '0';
        return `"${p.name}" ocupando ${normalizedPercent}% da prateleira (${widthCm}cm)`;
      });

      shelfDetails += `PRATELEIRA ${i} - ${zoneLabel}:\n`;
      shelfDetails += `  Produtos (da esquerda para a direita): ${productDescriptions.join(', ')}\n`;
      shelfDetails += `  Utilização total: ${Math.min(totalShare, 100).toFixed(0)}%\n\n`;
    } else {
      shelfDetails += `PRATELEIRA ${i} - ${zoneLabel}:\n`;
      shelfDetails += `  Sem produtos (preencher com produtos das prateleiras adjacentes)\n\n`;
    }
  }

  // Get all unique product names
  const uniqueProducts = Array.from(new Set(products.map(p => p.name)));

  const prompt = `Fotografia profissional e realista de uma gôndola de supermercado vista de frente, categoria "${categoryName}".

A gôndola tem ${numberOfShelves} prateleiras, ${totalWidth}cm de largura total.

DISTRIBUIÇÃO EXATA DOS PRODUTOS POR PRATELEIRA (de cima para baixo):

${shelfDetails}

PRODUTOS QUE DEVEM APARECER NA IMAGEM (SOMENTE ESTES):
${uniqueProducts.map(name => `- ${name}`).join('\n')}

REGRAS VISUAIS OBRIGATÓRIAS:
1. TODAS as ${numberOfShelves} prateleiras devem ter produtos - NENHUMA prateleira vazia
2. Cada produto deve ocupar o espaço proporcional ao seu percentual na prateleira
3. Produtos com maior percentual devem ter MAIS embalagens visíveis
4. Produtos com menor percentual (ex: 5%) devem ter MENOS embalagens, mas ainda visíveis
5. A prateleira ${numberOfShelves} fica no TOPO e a prateleira 1 na BASE
6. As embalagens devem ter rótulos legíveis com o nome do produto
7. Iluminação profissional de supermercado, fundo desfocado de corredor
8. Vista frontal direta da gôndola, sem ângulo
9. Cada prateleira deve ter os produtos na ordem listada (esquerda para direita)
10. Os produtos devem ser claramente diferentes entre si (cores e embalagens distintas)`;

  return prompt;
}

export default function StoreVisualizationGeneratorV2({
  products,
  numberOfShelves = 7,
  totalWidth = 280,
}: StoreVisualizationGeneratorV2Props) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.pt;

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMutation = trpc.system.generateStoreVisualization.useMutation();

  const handleGenerateVisualization = async () => {
    if (products.length === 0) {
      setError(t.noProducts);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = buildDetailedPrompt(products, numberOfShelves, totalWidth, language);

      console.log('[StoreVisualizationV2] Prompt gerado:', prompt);

      const result = await generateMutation.mutateAsync({
        prompt,
      });

      if (result.url) {
        setGeneratedImage(result.url);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
      console.error('Error generating visualization:', err);
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-card p-6 rounded-md border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {language === 'pt' ? 'Layout da Loja' : 'Store Layout'}
        </h3>
        <Button
          onClick={handleGenerateVisualization}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.generating}
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              {t.generateVisualization}
            </>
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{t.description}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Store visualization"
            className="w-full rounded-md border border-border"
          />
        </div>
      )}
    </div>
  );
}
