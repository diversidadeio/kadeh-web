/**
 * ImageFidelityValidator Component
 * Validates that AI-generated images match the shelf visualization
 * Compares products and categories between image and visualization
 */

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  category?: {
    name: string;
    mainCategory: string;
  };
}

interface ImageFidelityValidatorProps {
  products: Product[];
  categoryName: string;
  generatedImageUrl?: string;
  onValidationComplete?: (isValid: boolean, issues: ValidationIssue[]) => void;
}

interface ValidationIssue {
  type: "category_mismatch" | "product_missing" | "extra_product" | "warning";
  severity: "error" | "warning" | "info";
  message: string;
}

const TRANSLATIONS = {
  pt: {
    validating: "Validando fidelidade da imagem...",
    validation_complete: "Validação Concluída",
    fidelity_score: "Pontuação de Fidelidade",
    issues_found: "Problemas Encontrados",
    no_issues: "Nenhum problema detectado",
    category_mismatch: "Produtos de categoria diferente detectados",
    product_missing: "Produto esperado não encontrado na imagem",
    extra_product: "Produtos adicionais detectados na imagem",
    expected_products: "Produtos Esperados",
    detected_issues: "Problemas Detectados",
    validation_passed: "Validação Aprovada ✓",
    validation_failed: "Validação com Problemas",
  },
  en: {
    validating: "Validating image fidelity...",
    validation_complete: "Validation Complete",
    fidelity_score: "Fidelity Score",
    issues_found: "Issues Found",
    no_issues: "No issues detected",
    category_mismatch: "Products from different category detected",
    product_missing: "Expected product not found in image",
    extra_product: "Additional products detected in image",
    expected_products: "Expected Products",
    detected_issues: "Detected Issues",
    validation_passed: "Validation Passed ✓",
    validation_failed: "Validation with Issues",
  },
};

/**
 * Simula análise de imagem para detectar produtos
 * Em produção, isso usaria OCR ou análise de imagem com IA
 */
function analyzeImageProducts(imageUrl: string | undefined): string[] {
  // Placeholder: em produção, isso analisaria a imagem real
  // Por enquanto, retorna array vazio para indicar que análise seria feita
  return [];
}

/**
 * Valida fidelidade da imagem comparando com produtos esperados
 */
function validateImageFidelity(
  expectedProducts: Product[],
  categoryName: string,
  detectedProducts: string[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Validar que todos os produtos esperados são da mesma categoria
  const allSameCategory = expectedProducts.every(
    (p) => (p.category?.mainCategory || p.category?.name) === categoryName
  );

  if (!allSameCategory) {
    issues.push({
      type: "category_mismatch",
      severity: "error",
      message: `Nem todos os produtos são da categoria ${categoryName}`,
    });
  }

  // Se há produtos detectados na imagem, validar se correspondem aos esperados
  if (detectedProducts.length > 0) {
    const expectedProductNames = expectedProducts.map((p) =>
      p.name.toLowerCase()
    );

    // Verificar produtos faltando
    expectedProductNames.forEach((name) => {
      const found = detectedProducts.some((detected) =>
        detected.toLowerCase().includes(name)
      );
      if (!found) {
        issues.push({
          type: "product_missing",
          severity: "warning",
          message: `Produto esperado não encontrado: ${name}`,
        });
      }
    });

    // Verificar produtos extras
    detectedProducts.forEach((detected) => {
      const found = expectedProductNames.some((name) =>
        detected.toLowerCase().includes(name)
      );
      if (!found) {
        issues.push({
          type: "extra_product",
          severity: "warning",
          message: `Produto adicional detectado: ${detected}`,
        });
      }
    });
  }

  return issues;
}

/**
 * Calcula pontuação de fidelidade baseada em problemas encontrados
 */
function calculateFidelityScore(issues: ValidationIssue[]): number {
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  // Começar com 100 e descontar por problemas
  let score = 100;
  score -= errorCount * 20; // Erros descontam 20 pontos cada
  score -= warningCount * 5; // Avisos descontam 5 pontos cada

  return Math.max(0, score);
}

export default function ImageFidelityValidator({
  products,
  categoryName,
  generatedImageUrl,
  onValidationComplete,
}: ImageFidelityValidatorProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [isValidating, setIsValidating] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [fidelityScore, setFidelityScore] = useState(0);

  useEffect(() => {
    if (generatedImageUrl) {
      validateImage();
    }
  }, [generatedImageUrl]);

  const validateImage = async () => {
    setIsValidating(true);

    try {
      // Simular análise de imagem
      const detectedProducts = analyzeImageProducts(generatedImageUrl);

      // Validar fidelidade
      const validationIssues = validateImageFidelity(
        products,
        categoryName,
        detectedProducts
      );

      // Calcular pontuação
      const score = calculateFidelityScore(validationIssues);

      setIssues(validationIssues);
      setFidelityScore(score);

      // Chamar callback se fornecido
      if (onValidationComplete) {
        onValidationComplete(validationIssues.length === 0, validationIssues);
      }
    } catch (error) {
      console.error("Erro ao validar imagem:", error);
    } finally {
      setIsValidating(false);
    }
  };

  if (!generatedImageUrl) {
    return null;
  }

  const hasErrors = issues.some((i) => i.severity === "error");
  const hasWarnings = issues.some((i) => i.severity === "warning");

  return (
    <div className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {t.validation_complete}
        </h3>
        <div className="flex items-center gap-2">
          {isValidating ? (
            <div className="animate-spin">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
          ) : hasErrors ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>

      {/* Fidelity Score */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {t.fidelity_score}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  fidelityScore >= 80
                    ? "bg-green-500"
                    : fidelityScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${fidelityScore}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-800">
              {fidelityScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Expected Products */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {t.expected_products} ({products.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {products.map((product) => (
            <span
              key={product.id}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {product.name}
            </span>
          ))}
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {t.detected_issues} ({issues.length})
          </h4>
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-l-4 ${
                  issue.severity === "error"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : issue.severity === "warning"
                      ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                      : "bg-blue-50 border-blue-500 text-blue-700"
                }`}
              >
                <p className="text-sm font-medium">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            ✓ {t.no_issues}
          </p>
        </div>
      )}

      {/* Status Summary */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {hasErrors ? t.validation_failed : t.validation_passed}
        </p>
      </div>
    </div>
  );
}
