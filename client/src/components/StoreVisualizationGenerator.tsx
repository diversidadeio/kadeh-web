/**
 * StoreVisualizationGenerator Component
 * Generates AI images representing how the store would look based on Smart Layout simulation
 * Uses the same distribution logic as GondolaFrontView to ensure fidelity
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
    shelfZone?: string;
  };
  largura?: number;
  comprimento?: number;
  zone?: string;
  giro?: string;
  margem?: string;
  share?: number;
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

/**
 * Distribui produtos nas prateleiras respeitando percentuais recomendados
 * Se houver espaço sobrando na Parte de Baixo, preenche com produtos de Altura das Mãos
 */
function distributeProductsToShelves(products: Product[]): {
  shelf1: Product[];
  shelves2to4: Product[];
  shelf5: Product[];
} {
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.category?.shelfZone) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.category?.shelfZone) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.category?.shelfZone) === 'Parte de Baixo'),
  };

  // Calcular espaço utilizado na Parte de Baixo
  const bottomShare = productsByZone['Parte de Baixo'].reduce((sum, p) => sum + (p.share || 0), 0);
  const spaceRemaining = 100 - bottomShare;

  // Se há espaço sobrando na Parte de Baixo, preencher com produtos de Altura das Mãos
  let shelf1Products = [...productsByZone['Parte de Baixo']];
  let handLevelProducts = [...productsByZone['Altura das mãos']];

  if (spaceRemaining > 0 && handLevelProducts.length > 0) {
    // Adicionar produtos de Altura das Mãos à Parte de Baixo até preencher 100%
    let remainingSpace = spaceRemaining;
    const productsToAdd: Product[] = [];
    
    for (const product of handLevelProducts) {
      if (remainingSpace <= 0) break;
      
      const productShare = product.share || 0;
      if (productShare <= remainingSpace) {
        productsToAdd.push(product);
        remainingSpace -= productShare;
      }
    }

    shelf1Products = [...shelf1Products, ...productsToAdd];
    handLevelProducts = handLevelProducts.filter(p => !productsToAdd.includes(p));
  }

  return {
    shelf1: shelf1Products,
    shelves2to4: handLevelProducts,
    shelf5: productsByZone['Altura dos olhos'],
  };
}

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

    // Usar mesma lógica de distribuição do GondolaFrontView
    const { shelf1, shelves2to4, shelf5 } = distributeProductsToShelves(products);

    // Build detailed product specifications for each shelf
    let shelf1Spec = "";
    let shelves2to4Spec = "";
    let shelf5Spec = "";

    // Prateleira 1 - Parte de Baixo
    if (shelf1.length > 0) {
      shelf1Spec = `\n**PRATELEIRA 1 - PARTE DE BAIXO (Bottom Shelf - INFERIOR):**\n`;
      shelf1.forEach((p, idx) => {
        const share = p.share || 0;
        shelf1Spec += `${idx + 1}. ${p.name}: ${share.toFixed(1)}% da largura\n`;
      });
      const totalShare1 = shelf1.reduce((sum, p) => sum + (p.share || 0), 0);
      shelf1Spec += `Total: ${totalShare1.toFixed(1)}% da largura total\n`;
    }

    // Prateleiras 2-4 - Altura das Mãos
    if (shelves2to4.length > 0) {
      shelves2to4Spec = `\n**PRATELEIRAS 2-4 - ALTURA DAS MÃOS (Middle Shelves):**\n`;
      shelves2to4.forEach((p, idx) => {
        const share = p.share || 0;
        shelves2to4Spec += `${idx + 1}. ${p.name}: ${share.toFixed(1)}% da largura\n`;
      });
      const totalShare2to4 = shelves2to4.reduce((sum, p) => sum + (p.share || 0), 0);
      shelves2to4Spec += `Total: ${totalShare2to4.toFixed(1)}% da largura total\n`;
    }

    // Prateleira 5 - Altura dos Olhos
    if (shelf5.length > 0) {
      shelf5Spec = `\n**PRATELEIRA 5 - ALTURA DOS OLHOS (Top Shelf - SUPERIOR):**\n`;
      shelf5.forEach((p, idx) => {
        const share = p.share || 0;
        shelf5Spec += `${idx + 1}. ${p.name}: ${share.toFixed(1)}% da largura\n`;
      });
      const totalShare5 = shelf5.reduce((sum, p) => sum + (p.share || 0), 0);
      shelf5Spec += `Total: ${totalShare5.toFixed(1)}% da largura total\n`;
    }

    // Build visual layout diagram
    let visualLayout = "";
    if (shelf1.length > 0) {
      visualLayout += `\n[PRATELEIRA 1 - PARTE DE BAIXO - INFERIOR]\n`;
      shelf1.forEach(p => {
        const share = p.share || 0;
        visualLayout += `[${p.name.substring(0, 10).padEnd(10)} ${share.toFixed(1)}%]`;
      });
    }
    if (shelves2to4.length > 0) {
      visualLayout += `\n[PRATELEIRAS 2-4 - ALTURA DAS MÃOS]\n`;
      shelves2to4.forEach(p => {
        const share = p.share || 0;
        visualLayout += `[${p.name.substring(0, 10).padEnd(10)} ${share.toFixed(1)}%]`;
      });
    }
    if (shelf5.length > 0) {
      visualLayout += `\n[PRATELEIRA 5 - ALTURA DOS OLHOS - SUPERIOR]\n`;
      shelf5.forEach(p => {
        const share = p.share || 0;
        visualLayout += `[${p.name.substring(0, 10).padEnd(10)} ${share.toFixed(1)}%]`;
      });
    }

    const prompt = `Você é um merchandiser profissional de varejo. Crie uma fotografia REALISTA de uma gôndola de loja com produtos posicionados EXATAMENTE conforme especificado abaixo.

**REQUISITO CRÍTICO: A imagem gerada DEVE mostrar produtos nas EXATAS posições, prateleiras e percentuais especificados. Esta é uma visualização de planograma profissional.**

**CONFIGURAÇÃO DA GÔNDOLA:**
- Largura Total: ${gondolaWidth}cm
- Altura entre prateleiras: ${shelfHeight}cm
- Profundidade da prateleira: ${shelfDepth}cm
- Total de Prateleiras: 5 (numeradas de 1 a 5, sendo 1 na base e 5 no topo)

**POSICIONAMENTO EXATO DE PRODUTOS POR PRATELEIRA:**
${shelf1Spec}${shelves2to4Spec}${shelf5Spec}

**DIAGRAMA DE LAYOUT VISUAL:**
${visualLayout}

**REGRAS OBRIGATÓRIAS DE POSICIONAMENTO:**
1. PRATELEIRA 1 (INFERIOR - Parte de Baixo): Produtos da esquerda para direita: ${shelf1.map(p => p.name).join(' → ')}
   - Cada produto ocupa exatamente seu percentual especificado
2. PRATELEIRAS 2-4 (MEIO - Altura das Mãos): Produtos da esquerda para direita: ${shelves2to4.map(p => p.name).join(' → ')}
   - Cada produto ocupa exatamente seu percentual especificado
3. PRATELEIRA 5 (SUPERIOR - Altura dos Olhos): Produtos da esquerda para direita: ${shelf5.map(p => p.name).join(' → ')}
   - Cada produto ocupa exatamente seu percentual especificado
4. ORDEM VERTICAL: Prateleira 1 na base, Prateleira 5 no topo (visão frontal)
5. Produtos são agrupados por prateleira - NÃO misture produtos entre prateleiras
6. Repita a sequência de produtos horizontalmente para preencher a largura da prateleira
7. NENHUMA prateleira pode estar vazia - preencha completamente com os produtos listados
8. Use APENAS os produtos especificados acima - não adicione produtos fictícios
9. Mantenha aparência profissional de varejo com iluminação adequada

**IMPORTANTE - NÃO FAÇA:**
- Mude a ordem dos produtos dentro de uma prateleira
- Coloque produtos em prateleiras erradas
- Use produtos genéricos de placeholder
- Ignore os percentuais especificados
- Gere produtos diferentes dos listados
- Deixe prateleiras vazias ou parcialmente preenchidas
- Adicione produtos que não estão na lista

**ESTILO VISUAL:**
- Fotografia frontal profissional de gôndola de varejo
- Sistema de prateleiras moderno com 5 prateleiras visíveis e numeradas
- Iluminação profissional destacando cada prateleira
- Embalagens de produtos e rótulos claramente visíveis
- Fundo realista de loja de varejo
- Estilo de fotografia de produto profissional

Gere uma fotografia profissional de gôndola de varejo que EXATAMENTE corresponda a esta especificação de planograma com as prateleiras numeradas de 1 a 5 (1 na base, 5 no topo).`;

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
