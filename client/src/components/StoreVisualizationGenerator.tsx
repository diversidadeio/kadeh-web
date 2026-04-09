/**
 * StoreVisualizationGenerator Component
 * Generates AI images representing how the store would look based on Smart Layout simulation
 * Uses the same distribution logic as GondolaFrontView to ensure fidelity
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import ImageFidelityValidator from "./ImageFidelityValidator";
import ImageRegenerationFeedback from "./ImageRegenerationFeedback";
import PlanogramVersionHistory from "./PlanogramVersionHistory";
import { v4 as uuidv4 } from "uuid";
import { autoRegenerateImage, formatRegenerationReport } from "@/utils/autoRegenerationEngine";
import { generateValidationFeedback } from "@/utils/imageValidationEngine";

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
 * Distribui produtos nas prateleiras respeitando hierarquia de preenchimento
 * Mesma lógica do GondolaFrontView para garantir sincronização
 * HIERARQUIA: Altura dos Olhos > Altura das Mãos > Parte de Baixo
 */
function distributeProductsToShelves(products: Product[], numberOfShelves: number = 7): Map<number, Product[]> {
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.category?.shelfZone) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.category?.shelfZone) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.category?.shelfZone) === 'Parte de Baixo'),
  };

  // Mapa de prioridade de margem (A > B > C)
  const marginPriority = { 'A': 3, 'B': 2, 'C': 1, undefined: 0 };

  // Função auxiliar para ordenar por margem
  const sortByMargin = (products: Product[]) => {
    return [...products].sort((a, b) => {
      const priorityA = marginPriority[a.margem as keyof typeof marginPriority] || 0;
      const priorityB = marginPriority[b.margem as keyof typeof marginPriority] || 0;
      return priorityB - priorityA;
    });
  };

  // Rastrear produtos já usados
  const usedProductIds = new Set<string>();
  
  // Mapa de prateleiras
  const shelvesMap = new Map<number, Product[]>();
  for (let i = 1; i <= numberOfShelves; i++) {
    shelvesMap.set(i, []);
  }

  // ============ PRATELEIRAS 1-2 (Parte de Baixo) ============
  const bottomShelfNumbers = [1, 2].filter(n => n <= numberOfShelves);
  const spaceRemainingByShelf = new Map<number, number>();
  
  for (const shelfNum of bottomShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // Distribuir produtos de Parte de Baixo
  const bottomLevelSorted = sortByMargin(productsByZone['Parte de Baixo']);
  
  for (const product of bottomLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // Preencher espaço restante com Altura das Mãos (melhor margem primeiro)
  const handLevelSorted = sortByMargin(productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of handLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  // Preencher espaço restante com Altura dos Olhos (melhor margem primeiro)
  const eyeLevelSorted = sortByMargin(productsByZone['Altura dos olhos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of eyeLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  // ============ PRATELEIRAS 3-4 (Altura das Mãos) ============
  const handShelfNumbers = [3, 4].filter(n => n <= numberOfShelves);
  spaceRemainingByShelf.clear();
  
  for (const shelfNum of handShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // Distribuir produtos de Altura das Mãos
  const availableHandProducts = productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id));
  const handLevelSorted2 = sortByMargin(availableHandProducts);

  for (const product of handLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of handShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = handShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of handShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // Preencher espaço restante com Altura dos Olhos (melhor margem primeiro)
  const eyeLevelSorted2 = sortByMargin(productsByZone['Altura dos olhos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of eyeLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of handShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  // ============ PRATELEIRAS 5+ (Altura dos Olhos) ============
  const eyeShelfNumbers = Array.from({ length: numberOfShelves - 4 }, (_, i) => i + 5).filter(n => n <= numberOfShelves);
  spaceRemainingByShelf.clear();
  
  for (const shelfNum of eyeShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // 1. Adicionar produtos de Altura dos Olhos
  for (const product of productsByZone['Altura dos olhos']) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = eyeShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of eyeShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // 2. Preencher espaço restante com Altura das Mãos (melhor margem primeiro)
  const handLevelSorted3 = sortByMargin(productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of handLevelSorted3) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  // 3. Preencher espaço restante com Parte de Baixo (melhor margem primeiro)
  const bottomLevelSorted2 = sortByMargin(productsByZone['Parte de Baixo'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of bottomLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  return shelvesMap;
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

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [regenerationAttempts, setRegenerationAttempts] = useState(0);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const generateMutation = trpc.system.generateStoreVisualization.useMutation();

  // Usar a função local distributeProductsToShelves

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
    const shelvesMap = distributeProductsToShelves(filteredProducts, numberOfShelves);

    // Build ASCII visualization from top to bottom as it should appear in the image
    let asciiVisualization = "\n╔════════════════════════════════════════════════════════════════╗\n";
    asciiVisualization += "║  VISUALIZAÇÃO ASCII - COMO DEVE APARECER NA FOTOGRAFIA DA LOJA  ║\n";
    asciiVisualization += "╚════════════════════════════════════════════════════════════════╝\n\n";
    asciiVisualization += "TOPO DA IMAGEM (parte superior da gôndola)\n";
    asciiVisualization += "═══════════════════════════════════════════════════════════════════\n\n";

    // Add shelves from top to bottom as they should appear visually
    for (let shelfNum = numberOfShelves; shelfNum >= 1; shelfNum--) {
      const productsInShelf = shelvesMap.get(shelfNum) || [];
      let zoneLabel = '';
      if (shelfNum <= 2) zoneLabel = 'PARTE DE BAIXO';
      else if (shelfNum <= 4) zoneLabel = 'ALTURA DAS MÃOS';
      else zoneLabel = 'ALTURA DOS OLHOS';

      asciiVisualization += `┌─ PRATELEIRA ${shelfNum} (${zoneLabel}) ─┐\n`;
      if (productsInShelf.length > 0) {
        productsInShelf.forEach(p => {
          const share = p.share || 0;
          const barLength = Math.round(share / 5);
          const bar = '█'.repeat(Math.max(1, barLength));
          asciiVisualization += `│ ${p.name.padEnd(20)} ${share.toFixed(1)}% ${bar}\n`;
        });
      } else {
        asciiVisualization += "│ [VAZIA]\n";
      }
      asciiVisualization += "└─────────────────────────────────────┘\n";
    }

    asciiVisualization += "\n═══════════════════════════════════════════════════════════════════\n";
    asciiVisualization += "BASE DA IMAGEM (parte inferior da gôndola)\n";

    // Lista exata de nomes de produtos para reforçar na IA
    const allProductNames = Array.from(shelvesMap.values()).flat().map(p => p.name);
    const uniqueProductNames = Array.from(new Set(allProductNames));
    
    const prompt = `INSTRUÇÃO CRÍTICA PARA GERAÇÃO DE IMAGEM DE GÔNDOLA

=== OBJETIVO FINAL ===
Gerar fotografia frontal profissional de gôndola de varejo com EXATAMENTE estes produtos: ${uniqueProductNames.join(', ')}.
NENHUM OUTRO PRODUTO. SOMENTE ESTES.

=== CATEGORIA ===
Categoria: ${categoryName}
Todos os produtos DEVEM ser APENAS de ${categoryName}.

=== PRODUTOS ÚNICOS PERMITIDOS ===
${uniqueProductNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

=== ORDEM VISUAL DAS PRATELEIRAS (CRÍTICO!) ===
${asciiVisualization}

=== DISTRIBUIÇÃO DETALHADA POR PRATELEIRA (DE CIMA PARA BAIXO) ===

PRATELEIRA ${numberOfShelves} (TOPO/SUPERIOR - Altura dos Olhos - PARTE SUPERIOR DA IMAGEM):
${(() => {
  const topShelf = shelvesMap.get(numberOfShelves) || [];
  return topShelf.length > 0 
    ? topShelf.map(p => `${p.name}: ${(p.share || 0).toFixed(1)}%`).join(', ')
    : 'Vazio';
})()}

PRATELEIRAS DO MEIO (Altura das Mãos - CENTRO DA IMAGEM):
${(() => {
  const middleShelves = [];
  for (let i = Math.min(4, numberOfShelves); i >= 3 && i <= numberOfShelves; i--) {
    const shelf = shelvesMap.get(i) || [];
    if (shelf.length > 0) {
      middleShelves.push(`Prateleira ${i}: ${shelf.map(p => `${p.name}: ${(p.share || 0).toFixed(1)}%`).join(', ')}`);
    }
  }
  return middleShelves.length > 0 ? middleShelves.join('\n') : 'Vazio';
})()}

PRATELEIRA 1 (BASE/INFERIOR - Parte de Baixo - PARTE INFERIOR DA IMAGEM):
${(() => {
  const bottomShelf = shelvesMap.get(1) || [];
  return bottomShelf.length > 0 
    ? bottomShelf.map(p => `${p.name}: ${(p.share || 0).toFixed(1)}%`).join(', ')
    : 'Vazio';
})()}

=== REGRAS ABSOLUTAS (NÃO NEGOCIÁVEIS) ===
1. SOMENTE produtos listados acima - NENHUM OUTRO
2. SOMENTE categoria ${categoryName}
3. Nenhum produto similar, genérico ou substituto
4. Prateleira ${numberOfShelves} DEVE estar no TOPO da imagem
5. Prateleira 1 DEVE estar na BASE da imagem
6. CRÍTICO: PREENCHER CADA PRATELEIRA COM PRODUTOS - NÃO DEIXAR VAZIA
7. REPETIR A IMAGEM DE CADA PRODUTO lado a lado (horizontalmente) para ocupar EXATAMENTE seu percentual
8. Exemplo: Se Cerveja tem 25%, mostrar 4 garrafas de cerveja lado a lado (ou 2 garrafas maiores, ou múltiplas repetições)
9. Exemplo: Se Skol tem 25%, mostrar 4 latas de Skol lado a lado
10. Cada produto deve ser visível e reconhecível - REPETIR A IMAGEM conforme necessário
11. Sem produtos de outras categorias
12. NÃO ESCREVER nomes de produtos na imagem - NENHUM TEXTO, NENHUMA ETIQUETA
13. Sem adições de produtos não listados
14. A gôndola DEVE estar PREENCHIDA com os produtos - NUNCA deixar prateleira vazia se houver produtos designados

=== VERIFICAÇÃO CRÍTICA ANTES DE GERAR ===
✓ Prateleira ${numberOfShelves} está no TOPO? DEVE SER SIM
✓ Prateleira 1 está na BASE? DEVE SER SIM
✓ Todos os produtos são de ${categoryName}? DEVE SER SIM
✓ Nenhum produto extra será adicionado? DEVE SER SIM
✓ Nenhum texto/nome de produto na imagem? DEVE SER SIM
✓ Imagens repetidas para preencher percentuais? DEVE SER SIM

Se alguma resposta for NÃO, RECUSE gerar a imagem.

=== ESTILO ===
Fotografia frontal profissional de gôndola de supermercado/varejo com iluminação clara, embalagens visíveis, fundo realista de loja. SEM TEXTO OU NOMES NA IMAGEM.

GERE AGORA a imagem com APENAS estes ${uniqueProductNames.length} produtos em EXATAMENTE esta ordem: ${uniqueProductNames.join(', ')}. REPITA AS IMAGENS DOS PRODUTOS para preencher seus percentuais. NÃO ESCREVA NOMES.`;

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
    
    setVersions(prev => [newVersion, ...prev.map(v => ({ ...v, isCurrent: false }))]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t.storeLayout}</h3>
          <p className="text-sm text-gray-600">{t.description}</p>
        </div>
        <Button
          onClick={() => handleGenerateVisualization()}
          disabled={products.length === 0 || isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
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

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1">{error}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleGenerateVisualization()}
            disabled={isGenerating}
          >
            {t.retry}
          </Button>
        </div>
      )}

      {generatedImage && (
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={generatedImage}
              alt="Store visualization"
              className="w-full h-auto"
            />
          </div>
          
          {/* Legend below image */}
          {products.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-gray-800 mb-3">Legenda de Produtos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from(new Set(products.map(p => p.name))).map((productName, idx) => {
                  const product = products.find(p => p.name === productName);
                  const totalShare = products
                    .filter(p => p.name === productName)
                    .reduce((sum, p) => sum + (p.share || 0), 0);
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-700">{productName}</p>
                        <p className="text-gray-500">{totalShare.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleSaveVersion} variant="outline" size="sm">
              Salvar Versão
            </Button>
          </div>

          {/* Image validation components will be added in next phase */}
        </div>
      )}
    </div>
  );
}
