import { describe, it, expect } from "vitest";

/**
 * Testes para ImageFidelityValidator
 * Valida fidelidade de imagens IA comparando com produtos esperados
 */

interface Product {
  id: string;
  name: string;
  category?: {
    name: string;
    mainCategory: string;
  };
}

interface ValidationIssue {
  type: "category_mismatch" | "product_missing" | "extra_product" | "warning";
  severity: "error" | "warning" | "info";
  message: string;
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

  let score = 100;
  score -= errorCount * 20;
  score -= warningCount * 5;

  return Math.max(0, score);
}

describe("ImageFidelityValidator", () => {
  describe("validateImageFidelity", () => {
    it("deve retornar sem problemas quando todos os produtos são da mesma categoria", () => {
      const products: Product[] = [
        {
          id: "1",
          name: "Arroz Branco",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
        {
          id: "2",
          name: "Arroz Integral",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
      ];

      const issues = validateImageFidelity(products, "Grãos", [
        "Arroz Branco",
        "Arroz Integral",
      ]);

      expect(issues).toHaveLength(0);
    });

    it("deve detectar erro quando produtos são de categorias diferentes", () => {
      const products: Product[] = [
        {
          id: "1",
          name: "Arroz Branco",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
        {
          id: "2",
          name: "Feijão Preto",
          category: { name: "Feijão", mainCategory: "Legumes" },
        },
      ];

      const issues = validateImageFidelity(products, "Grãos", []);

      expect(issues).toContainEqual(
        expect.objectContaining({
          type: "category_mismatch",
          severity: "error",
        })
      );
    });

    it("deve detectar produtos faltando na imagem", () => {
      const products: Product[] = [
        {
          id: "1",
          name: "Arroz Branco",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
        {
          id: "2",
          name: "Arroz Integral",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
      ];

      const issues = validateImageFidelity(products, "Grãos", ["Arroz Branco"]);

      expect(issues).toContainEqual(
        expect.objectContaining({
          type: "product_missing",
          severity: "warning",
        })
      );
    });

    it("deve detectar produtos extras na imagem", () => {
      const products: Product[] = [
        {
          id: "1",
          name: "Arroz Branco",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
      ];

      const issues = validateImageFidelity(products, "Grãos", [
        "Arroz Branco",
        "Feijão Preto",
      ]);

      expect(issues).toContainEqual(
        expect.objectContaining({
          type: "extra_product",
          severity: "warning",
        })
      );
    });

    it("deve ser case-insensitive ao comparar nomes de produtos", () => {
      const products: Product[] = [
        {
          id: "1",
          name: "Arroz Branco",
          category: { name: "Arroz", mainCategory: "Grãos" },
        },
      ];

      const issues = validateImageFidelity(products, "Grãos", ["ARROZ BRANCO"]);

      expect(issues).toHaveLength(0);
    });
  });

  describe("calculateFidelityScore", () => {
    it("deve retornar 100 quando não há problemas", () => {
      const issues: ValidationIssue[] = [];
      const score = calculateFidelityScore(issues);

      expect(score).toBe(100);
    });

    it("deve descontar 20 pontos por erro", () => {
      const issues: ValidationIssue[] = [
        {
          type: "category_mismatch",
          severity: "error",
          message: "Teste",
        },
      ];
      const score = calculateFidelityScore(issues);

      expect(score).toBe(80);
    });

    it("deve descontar 5 pontos por aviso", () => {
      const issues: ValidationIssue[] = [
        {
          type: "product_missing",
          severity: "warning",
          message: "Teste",
        },
      ];
      const score = calculateFidelityScore(issues);

      expect(score).toBe(95);
    });

    it("deve nunca retornar score negativo", () => {
      const issues: ValidationIssue[] = Array(10).fill({
        type: "category_mismatch",
        severity: "error",
        message: "Teste",
      });
      const score = calculateFidelityScore(issues);

      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("deve combinar múltiplos problemas corretamente", () => {
      const issues: ValidationIssue[] = [
        {
          type: "category_mismatch",
          severity: "error",
          message: "Erro 1",
        },
        {
          type: "product_missing",
          severity: "warning",
          message: "Aviso 1",
        },
        {
          type: "extra_product",
          severity: "warning",
          message: "Aviso 2",
        },
      ];
      const score = calculateFidelityScore(issues);

      // 100 - 20 (1 erro) - 5 (2 avisos) = 75
      expect(score).toBe(75);
    });
  });
});
