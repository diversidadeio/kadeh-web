/**
 * Motor de validação de imagens IA
 * Valida se a imagem contém apenas produtos da categoria especificada
 */

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100
  detectedProducts: string[];
  expectedProducts: string[];
  missingProducts: string[];
  extraProducts: string[];
  issues: string[];
  recommendations: string[];
}

/**
 * Valida se a imagem IA contém apenas produtos da categoria esperada
 * Usa análise de texto e padrões visuais para detectar produtos
 */
export async function validateImageFidelity(
  imageUrl: string,
  expectedProducts: string[],
  categoryName: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    confidence: 100,
    detectedProducts: [],
    expectedProducts: expectedProducts,
    missingProducts: [],
    extraProducts: [],
    issues: [],
    recommendations: []
  };

  try {
    // Simular análise de imagem (em produção, usar OCR ou API de visão)
    // Por enquanto, usamos heurística baseada em padrões conhecidos
    
    const detectedProducts = await detectProductsInImage(imageUrl, categoryName);
    result.detectedProducts = detectedProducts;

    // Verificar produtos esperados
    const expectedSet = new Set(expectedProducts.map(p => normalizeProductName(p)));
    const detectedSet = new Set(detectedProducts.map(p => normalizeProductName(p)));

    // Encontrar produtos faltantes
    result.missingProducts = expectedProducts.filter(
      p => !detectedSet.has(normalizeProductName(p))
    );

    // Encontrar produtos extras (não esperados)
    result.extraProducts = detectedProducts.filter(
      p => !expectedSet.has(normalizeProductName(p))
    );

    // Calcular confiança
    const totalExpected = expectedProducts.length;
    const foundExpected = expectedProducts.length - result.missingProducts.length;
    const confidenceScore = (foundExpected / totalExpected) * 100;

    result.confidence = Math.round(confidenceScore);

    // Validar resultado
    if (result.missingProducts.length > 0) {
      result.isValid = false;
      result.issues.push(
        `Produtos faltantes: ${result.missingProducts.join(', ')}`
      );
      result.recommendations.push(
        'Regenerar imagem com foco nos produtos faltantes'
      );
    }

    if (result.extraProducts.length > 0) {
      result.isValid = false;
      result.issues.push(
        `Produtos não esperados detectados: ${result.extraProducts.join(', ')}`
      );
      result.recommendations.push(
        `Regenerar imagem com restrição absoluta à categoria ${categoryName}`
      );
    }

    // Validação de confiança mínima
    if (result.confidence < 80) {
      result.isValid = false;
      result.recommendations.push(
        'Confiança de detecção baixa - regenerar imagem'
      );
    }

    return result;
  } catch (error) {
    result.isValid = false;
    result.issues.push(`Erro na validação: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    result.confidence = 0;
    return result;
  }
}

/**
 * Detecta produtos na imagem usando análise de padrões
 * Em produção, usar OCR ou API de visão computacional
 */
async function detectProductsInImage(
  imageUrl: string,
  categoryName: string
): Promise<string[]> {
  // Simular detecção de produtos
  // Em produção, integrar com Google Vision API, Azure Computer Vision, etc.
  
  const detectedProducts: string[] = [];

  // Padrões conhecidos para diferentes categorias
  const categoryPatterns: Record<string, string[]> = {
    'Arroz': ['arroz', 'rice', 'branco', 'integral', 'parboilizado', 'arbóreo', 'selvagem'],
    'Feijão': ['feijão', 'bean', 'carioca', 'preto', 'branco', 'vermelho'],
    'Macarrão': ['macarrão', 'pasta', 'espaguete', 'penne', 'fusilli'],
    'Óleo': ['óleo', 'oil', 'soja', 'girassol', 'milho', 'azeite'],
    'Leite': ['leite', 'milk', 'integral', 'desnatado', 'semidesnatado']
  };

  // Simular detecção baseada em categoria
  // Em produção, usar OCR real
  if (categoryPatterns[categoryName]) {
    // Retornar alguns produtos simulados da categoria
    detectedProducts.push(...categoryPatterns[categoryName].slice(0, 3));
  }

  return detectedProducts;
}

/**
 * Normaliza nome de produto para comparação
 */
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Gera feedback estruturado sobre validação
 */
export function generateValidationFeedback(result: ValidationResult): string {
  let feedback = '';

  if (result.isValid) {
    feedback = `✅ Imagem validada com sucesso! Confiança: ${result.confidence}%\n`;
    feedback += `Produtos detectados: ${result.detectedProducts.length}/${result.expectedProducts.length}`;
  } else {
    feedback = `❌ Validação falhou. Confiança: ${result.confidence}%\n\n`;
    
    if (result.issues.length > 0) {
      feedback += `Problemas:\n`;
      result.issues.forEach(issue => {
        feedback += `• ${issue}\n`;
      });
    }

    if (result.recommendations.length > 0) {
      feedback += `\nRecomendações:\n`;
      result.recommendations.forEach(rec => {
        feedback += `• ${rec}\n`;
      });
    }
  }

  return feedback;
}

/**
 * Calcula score de fidelidade (0-100)
 */
export function calculateFidelityScore(result: ValidationResult): number {
  let score = result.confidence;

  // Penalizar por produtos extras
  score -= result.extraProducts.length * 5;

  // Penalizar por produtos faltantes
  score -= result.missingProducts.length * 10;

  return Math.max(0, Math.min(100, score));
}
