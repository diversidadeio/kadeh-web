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
import ImageFidelityValidator from "./ImageFidelityValidator";
import ImageRegenerationFeedback from "./ImageRegenerationFeedback";
import PlanogramVersionHistory from "./PlanogramVersionHistory";
import { v4 as uuidv4 } from "uuid";

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
  const [versions, setVersions] = useState<any[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const generateMutation = trpc.system.generateStoreVisualization.useMutation();

  const generateStorePrompt = (): string => {
    if (products.length === 0) {
      return "";
    }

    // Filtrar apenas produtos da categoria selecionada
    const categoryName = products.length > 0 ? (products[0].category?.mainCategory || products[0].category?.name || 'Produtos') : 'Produtos';
    const filteredProducts = products.filter(p => 
      (p.category?.mainCategory || p.category?.name) === categoryName
    );

    if (filteredProducts.length === 0) {
      return "";
    }

    // Usar mesma lógica de distribuição do GondolaFrontView
    const { shelf1, shelves2to4, shelf5 } = distributeProductsToShelves(filteredProducts);

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

    // Lista exata de nomes de produtos para reforçar na IA
    const allProductNames = [...shelf1, ...shelves2to4, ...shelf5].map(p => p.name);
    const uniqueProductNames = Array.from(new Set(allProductNames));
    
    const prompt = `INSTRUÇÃO CRÍTICA: Você é um especialista em visual merchandising. Crie uma fotografia profissional de uma gôndola de varejo com APENAS os produtos especificados abaixo.

**RESTRIÇÃO ABSOLUTA - LEIA COM ATENÇÃO:**
Esta gôndola contém SOMENTE produtos da categoria: ${categoryName}
Produtos permitidos APENAS: ${uniqueProductNames.join(', ')}
NÃO adicione, substitua ou modifique nenhum produto.
NÃO inclua produtos de outras categorias.
NÃO use produtos genéricos ou similares.

**CONFIGURAÇÃO TÉCNICA DA GÔNDOLA:**
- Largura: ${gondolaWidth}cm
- Altura entre prateleiras: ${shelfHeight}cm
- Profundidade: ${shelfDepth}cm
- Total de Prateleiras: 5 (numeradas 1-5, sendo 1 na base e 5 no topo)

**DISTRIBUIÇÃO EXATA DE PRODUTOS:**
${shelf1Spec}${shelves2to4Spec}${shelf5Spec}

**LAYOUT VISUAL (de baixo para cima):**
${visualLayout}

**INSTRUÇÕES DE POSICIONAMENTO - OBRIGATÓRIO:**
1. PRATELEIRA 1 (BASE): ${shelf1.map(p => p.name).join(' | ')}
2. PRATELEIRAS 2-4 (MEIO): ${shelves2to4.map(p => p.name).join(' | ')}
3. PRATELEIRA 5 (TOPO): ${shelf5.map(p => p.name).join(' | ')}

Cada produto ocupa exatamente o percentual especificado. Repita os produtos horizontalmente para preencher 100% da prateleira.

**RESTRIÇÕES ABSOLUTAS - VIOLAÇÕES RESULTAM EM FALHA:**
❌ NÃO adicione produtos não listados
❌ NÃO mude a ordem dos produtos
❌ NÃO coloque produtos em prateleiras erradas
❌ NÃO misture categorias
❌ NÃO deixe prateleiras vazias
❌ NÃO use produtos similares ou substitutos
❌ NÃO ignore os percentuais especificados

**ESTILO VISUAL:**
Fotografia frontal profissional de gôndola de varejo com iluminação adequada, embalagens claras e visíveis, fundo realista de loja.

Gere uma fotografia que mostre EXATAMENTE esta configuração com APENAS estes produtos: ${uniqueProductNames.join(', ')}.`;

    return prompt;
  };

  const handleGenerateVisualization = async (feedback?: string) => {
    if (products.length === 0) {
      setError(t.noProducts);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let prompt = generateStorePrompt();
      
      // Se há feedback, adicionar ao prompt
      if (feedback) {
        prompt += `\n\n**FEEDBACK DO USUÁRIO PARA MELHORIA:**\n${feedback}\n\nPor favor, corrija os problemas mencionados acima.`;
      }
      
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

  const handleSaveVersion = () => {
    if (!generatedImage) return;
    
    const categoryName = products.length > 0 ? (products[0].category?.mainCategory || products[0].category?.name || 'Produtos') : 'Produtos';
    
    const newVersion = {
      id: uuidv4(),
      timestamp: new Date(),
      categoryName,
      productCount: products.length,
      shelfConfiguration: {
        width: gondolaWidth,
        height: shelfHeight,
        depth: shelfDepth,
      },
      imageUrl: generatedImage,
      isCurrent: true,
    };
    
    setVersions(prev => [
      ...prev.map(v => ({ ...v, isCurrent: false })),
      newVersion
    ]);
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setGeneratedImage(version.imageUrl);
      setVersions(prev => prev.map(v => ({
        ...v,
        isCurrent: v.id === versionId
      })));
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    setVersions(prev => prev.filter(v => v.id !== versionId));
  };

  const handleCompareVersions = (versionId1: string, versionId2: string) => {
    console.log(`Comparando versões: ${versionId1} vs ${versionId2}`);
    // Implementar comparação visual entre versões
  };

  return (
    <div className="w-full space-y-6 p-6 bg-card rounded-lg border border-border">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t.storeLayout}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
      </div>

      <Button
        onClick={() => handleGenerateVisualization()}
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
            onClick={() => handleGenerateVisualization()}
            variant="outline"
            size="sm"
          >
            {t.retry}
          </Button>
        </div>
      )}

      {generatedImage && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Visualização Gerada:</p>
          <div className="w-full overflow-x-auto bg-muted rounded-md border border-border p-4">
            <img
              src={generatedImage}
              alt="Store visualization"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Image Fidelity Validator */}
          <ImageFidelityValidator
            products={products}
            categoryName={products.length > 0 ? (products[0].category?.mainCategory || products[0].category?.name || 'Produtos') : 'Produtos'}
            generatedImageUrl={generatedImage}
          />

          {/* Image Regeneration Feedback */}
          <ImageRegenerationFeedback
            isGenerating={isGenerating}
            onRegenerate={handleGenerateVisualization}
            onDiscard={() => {
              setGeneratedImage(null);
              setError(null);
            }}
            categoryName={products.length > 0 ? (products[0].category?.mainCategory || products[0].category?.name || 'Produtos') : 'Produtos'}
          />

          {/* Save Version Button */}
          <Button
            onClick={handleSaveVersion}
            variant="outline"
            className="w-full"
          >
            Salvar Versão
          </Button>

          {/* Version History Toggle */}
          {versions.length > 0 && (
            <Button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              variant="outline"
              className="w-full"
            >
              {showVersionHistory ? "Ocultar" : "Ver"} Histórico de Versões ({versions.length})
            </Button>
          )}
        </div>
      )}

      {/* Planogram Version History */}
      {showVersionHistory && versions.length > 0 && (
        <PlanogramVersionHistory
          versions={versions}
          currentVersion={versions.find(v => v.isCurrent)}
          onRestore={handleRestoreVersion}
          onDelete={handleDeleteVersion}
          onCompare={handleCompareVersions}
        />
      )}
    </div>
  );
}
