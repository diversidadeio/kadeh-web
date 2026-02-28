/**
 * StoreVisualizationGenerator with Image Validation
 * Enhanced version with automatic validation and retry logic
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  validateGeneratedImage,
  getValidationSummary,
  shouldRegenerateImage,
  type ImageValidationConfig,
} from "@/lib/imageValidationService";

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
    validating: "Validando imagem...",
    storeLayout: "Layout da Loja",
    description: "Visualização em IA de como a loja ficaria com essa configuração",
    noProducts: "Adicione produtos à simulação para gerar visualização",
    error: "Erro ao gerar visualização. Tente novamente.",
    retry: "Tentar Novamente",
    validationPassed: "✅ Validação passou",
    validationFailed: "⚠️ Validação com problemas",
    regenerating: "Regenerando imagem...",
  },
  en: {
    generateVisualization: "Generate Store Visualization",
    generating: "Generating image...",
    validating: "Validating image...",
    storeLayout: "Store Layout",
    description: "AI visualization of how the store would look with this configuration",
    noProducts: "Add products to the simulation to generate visualization",
    error: "Error generating visualization. Try again.",
    retry: "Try Again",
    validationPassed: "✅ Validation passed",
    validationFailed: "⚠️ Validation with issues",
    regenerating: "Regenerating image...",
  },
};

export default function StoreVisualizationGeneratorWithValidation({
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
  const [isValidating, setIsValidating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const generateMutation = trpc.system.generateStoreVisualization.useMutation();

  // Group products by zone
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

  const eyeLevelProducts = productsByZone["Altura dos olhos"];
  const handLevelProducts = productsByZone["Altura das mãos"];
  const bottomLevelProducts = productsByZone["Parte de Baixo"];

  const generateStorePrompt = (): string => {
    if (products.length === 0) {
      return "";
    }

    const eyeLevelWidth = eyeLevelProducts.reduce((sum, p) => sum + (p.largura || 10), 0);
    const handLevelWidth = handLevelProducts.reduce((sum, p) => sum + (p.largura || 10), 0);
    const bottomLevelWidth = bottomLevelProducts.reduce((sum, p) => sum + (p.largura || 10), 0);

    let eyeLevelSpec = "";
    let handLevelSpec = "";
    let bottomLevelSpec = "";

    if (eyeLevelProducts.length > 0) {
      eyeLevelSpec = `\n**PRATELEIRA 1 - ALTURA DOS OLHOS (Top Shelf):**\n`;
      eyeLevelProducts.forEach((p, idx) => {
        const percentage = ((p.largura || 10) / eyeLevelWidth * 100).toFixed(1);
        eyeLevelSpec += `${idx + 1}. ${p.name}: ${percentage}% da largura (${p.largura || 10}cm)\n`;
      });
      eyeLevelSpec += `Total: ${(eyeLevelWidth / gondolaWidth * 100).toFixed(1)}% da largura total\n`;
    }

    if (handLevelProducts.length > 0) {
      handLevelSpec = `\n**PRATELEIRAS 2-4 - ALTURA DAS MÃOS (Middle Shelves):**\n`;
      handLevelProducts.forEach((p, idx) => {
        const percentage = ((p.largura || 10) / handLevelWidth * 100).toFixed(1);
        handLevelSpec += `${idx + 1}. ${p.name}: ${percentage}% da largura (${p.largura || 10}cm)\n`;
      });
      handLevelSpec += `Total: ${(handLevelWidth / gondolaWidth * 100).toFixed(1)}% da largura total\n`;
    }

    if (bottomLevelProducts.length > 0) {
      bottomLevelSpec = `\n**PRATELEIRA 5 - PARTE DE BAIXO (Bottom Shelf):**\n`;
      bottomLevelProducts.forEach((p, idx) => {
        const percentage = ((p.largura || 10) / bottomLevelWidth * 100).toFixed(1);
        bottomLevelSpec += `${idx + 1}. ${p.name}: ${percentage}% da largura (${p.largura || 10}cm)\n`;
      });
      bottomLevelSpec += `Total: ${(bottomLevelWidth / gondolaWidth * 100).toFixed(1)}% da largura total\n`;
    }

    const prompt = `Você é um merchandiser profissional de varejo. Crie uma fotografia REALISTA de uma gôndola de loja com produtos posicionados EXATAMENTE conforme especificado abaixo.

**REQUISITO CRÍTICO: A imagem gerada DEVE mostrar produtos nas EXATAS posições e percentuais especificados.**

**CONFIGURAÇÃO DA GÔNDOLA:**
- Largura Total: ${gondolaWidth}cm
- Altura entre prateleiras: ${shelfHeight}cm
- Profundidade da prateleira: ${shelfDepth}cm

**POSICIONAMENTO DE PRODUTOS:**
${eyeLevelSpec}${handLevelSpec}${bottomLevelSpec}

**REGRAS OBRIGATÓRIAS:**
1. ALTURA DOS OLHOS: ${eyeLevelProducts.map(p => p.name).join(' → ')}
2. ALTURA DAS MÃOS: ${handLevelProducts.map(p => p.name).join(' → ')}
3. PARTE DE BAIXO: ${bottomLevelProducts.map(p => p.name).join(' → ')}
4. Cada produto ocupa seu percentual especificado
5. Produtos são agrupados por nível de prateleira
6. Repita a sequência horizontalmente para preencher a largura

Gere uma fotografia profissional que EXATAMENTE corresponda a esta especificação.`;

    return prompt;
  };

  const handleValidation = async (imageUrl: string) => {
    setIsValidating(true);
    try {
      const config: ImageValidationConfig = {
        expectedProductCount: products.length,
        expectedZones: Object.keys(productsByZone).filter(zone => productsByZone[zone].length > 0),
        minConfidence: 70,
        retryAttempts: MAX_RETRIES,
      };

      const result = await validateGeneratedImage(imageUrl, config);
      setValidationResult(result);

      if (!result.isValid && shouldRegenerateImage(result, MAX_RETRIES) && retryCount < MAX_RETRIES) {
        setRetryCount(retryCount + 1);
        setError(null);
        // Automatically retry
        setTimeout(() => handleGenerateVisualization(), 2000);
      }

      return result;
    } catch (err) {
      console.error("Validation error:", err);
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerateVisualization = async () => {
    if (products.length === 0) {
      setError(t.noProducts);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setValidationResult(null);

    try {
      const prompt = generateStorePrompt();
      const result = await generateMutation.mutateAsync({ prompt });
      
      if (result.url) {
        setGeneratedImage(result.url);
        // Validate the generated image
        await handleValidation(result.url);
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
        disabled={isGenerating || isValidating || products.length === 0}
        className="w-full"
        size="lg"
      >
        {isGenerating || isValidating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isValidating ? t.validating : t.generating}
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
          {retryCount < MAX_RETRIES && (
            <Button
              onClick={handleGenerateVisualization}
              variant="outline"
              size="sm"
            >
              {t.retry}
            </Button>
          )}
        </div>
      )}

      {validationResult && (
        <div className={`p-4 rounded-md border ${
          validationResult.isValid
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}>
          <div className="flex items-start gap-2">
            {validationResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                validationResult.isValid ? "text-green-900" : "text-yellow-900"
              }`}>
                {validationResult.isValid ? t.validationPassed : t.validationFailed}
              </p>
              <p className={`text-xs mt-1 ${
                validationResult.isValid ? "text-green-800" : "text-yellow-800"
              }`}>
                Confiança: {validationResult.confidence.toFixed(0)}%
              </p>
              {validationResult.issues.length > 0 && (
                <ul className="text-xs mt-2 space-y-1">
                  {validationResult.issues.map((issue: string, idx: number) => (
                    <li key={idx} className={validationResult.isValid ? "text-green-800" : "text-yellow-800"}>
                      • {issue}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
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

      {retryCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Tentativa {retryCount} de {MAX_RETRIES}
        </p>
      )}
    </div>
  );
}
