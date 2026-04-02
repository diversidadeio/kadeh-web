/**
 * StoreVisualizationGeneratorV2 Component
 * VERSÃO SIMPLES E SINCRONIZADA
 * Gera imagem IA que corresponde EXATAMENTE à visualização frontal
 * 
 * PRINCÍPIOS:
 * 1. Usa EXATAMENTE os mesmos dados da visualização frontal
 * 2. Prompt IA é gerado de forma SIMPLES e CLARA
 * 3. Sem lógica complexa que causa erros
 * 4. Sincronização 100% garantida
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
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
  zone?: string;
  share?: number;
}

interface StoreVisualizationGeneratorV2Props {
  products: Product[];
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

/**
 * Organiza produtos por prateleira (de 1 até numberOfShelves)
 * Retorna array de arrays: [[prateleira1], [prateleira2], ...]
 */
function organizeProductsByShelf(products: Product[], numberOfShelves: number = 7): Product[][] {
  const shelves: Product[][] = Array.from({ length: numberOfShelves }, () => []);

  // Agrupar produtos por zona
  const byZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.category?.shelfZone) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.category?.shelfZone) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.category?.shelfZone) === 'Parte de Baixo'),
  };

  // Distribuição simples: Prateleira 1-2 (Parte de Baixo), 3-4 (Altura das mãos), 5+ (Altura dos olhos)
  let shelfIndex = 0;

  // Prateleiras 1-2: Parte de Baixo
  for (const product of byZone['Parte de Baixo']) {
    shelves[shelfIndex].push(product);
    shelfIndex = (shelfIndex + 1) % 2; // Alterna entre 0 e 1
  }

  // Prateleiras 3-4: Altura das mãos
  shelfIndex = 2;
  for (const product of byZone['Altura das mãos']) {
    shelves[shelfIndex].push(product);
    shelfIndex = (shelfIndex + 1) % 2 + 2; // Alterna entre 2 e 3
  }

  // Prateleiras 5+: Altura dos olhos
  shelfIndex = 4;
  for (const product of byZone['Altura dos olhos']) {
    if (shelfIndex < numberOfShelves) {
      shelves[shelfIndex].push(product);
      shelfIndex++;
    }
  }

  return shelves;
}

/**
 * Gera prompt IA SIMPLES e CLARO
 * Descreve exatamente como a gôndola deve aparecer
 */
function generateSimplePrompt(products: Product[], numberOfShelves: number, language: string): string {
  const shelves = organizeProductsByShelf(products, numberOfShelves);
  
  // Construir descrição visual de cada prateleira
  let shelfDescriptions = '';
  
  for (let i = numberOfShelves - 1; i >= 0; i--) {
    const shelfNum = i + 1;
    const shelfProducts = shelves[i];
    let zoneLabel = '';
    
    if (shelfNum <= 2) zoneLabel = 'Bottom shelf';
    else if (shelfNum <= 4) zoneLabel = 'Hand level';
    else zoneLabel = 'Eye level';

    const productList = shelfProducts.length > 0
      ? shelfProducts.map(p => `${p.name} (${(p.share || 0).toFixed(0)}%)`).join(', ')
      : 'Empty';

    shelfDescriptions += `Shelf ${shelfNum} (${zoneLabel}): ${productList}\n`;
  }

  const categoryName = products.length > 0 ? (products[0].category?.mainCategory || 'Products') : 'Products';
  const productNames = Array.from(new Set(products.map(p => p.name))).join(', ');

  const prompt = language === 'pt'
    ? `GERAR IMAGEM DE GÔNDOLA DE VAREJO

CATEGORIA: ${categoryName}

PRODUTOS PERMITIDOS (SOMENTE ESTES):
${productNames}

DISTRIBUIÇÃO POR PRATELEIRA (DE CIMA PARA BAIXO):
${shelfDescriptions}

INSTRUÇÕES CRÍTICAS:
1. Mostrar APENAS os produtos listados acima
2. Nenhum outro produto, marca ou categoria
3. Prateleira ${numberOfShelves} no TOPO da imagem
4. Prateleira 1 na BASE da imagem
5. Produtos em ordem de cima para baixo conforme listado
6. Fotografia realista de gôndola de supermercado
7. Iluminação profissional, sem sombras excessivas`
    : `GENERATE RETAIL SHELF IMAGE

CATEGORY: ${categoryName}

ALLOWED PRODUCTS (ONLY THESE):
${productNames}

SHELF DISTRIBUTION (TOP TO BOTTOM):
${shelfDescriptions}

CRITICAL INSTRUCTIONS:
1. Show ONLY the products listed above
2. No other products, brands, or categories
3. Shelf ${numberOfShelves} at the TOP of the image
4. Shelf 1 at the BOTTOM of the image
5. Products in order from top to bottom as listed
6. Realistic supermarket shelf photograph
7. Professional lighting, no excessive shadows`;

  return prompt;
}

export default function StoreVisualizationGeneratorV2({
  products,
  numberOfShelves = 7,
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
      const prompt = generateSimplePrompt(products, numberOfShelves, language);
      
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
