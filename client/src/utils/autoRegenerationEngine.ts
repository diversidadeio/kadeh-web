/**
 * Motor de regeneração automática de imagens IA
 * Tenta regenerar até 3 vezes se validação falhar
 */

import { validateImageFidelity, generateValidationFeedback, ValidationResult } from './imageValidationEngine';

export interface RegenerationAttempt {
  attemptNumber: number;
  imageUrl: string;
  validationResult: ValidationResult;
  feedback: string;
  timestamp: Date;
  success: boolean;
}

export interface RegenerationResult {
  success: boolean;
  finalImageUrl?: string;
  attempts: RegenerationAttempt[];
  totalAttempts: number;
  finalValidation?: ValidationResult;
  message: string;
}

/**
 * Tenta regenerar imagem até 3 vezes se validação falhar
 */
export async function autoRegenerateImage(
  generateImageFn: (feedback?: string) => Promise<string>,
  expectedProducts: string[],
  categoryName: string,
  maxAttempts: number = 3
): Promise<RegenerationResult> {
  const attempts: RegenerationAttempt[] = [];
  let lastValidation: ValidationResult | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[AutoRegen] Tentativa ${attempt}/${maxAttempts}`);

      // Gerar imagem (com feedback das tentativas anteriores)
      const feedback = attempt > 1 
        ? generateFeedbackForNextAttempt(attempts[attempt - 2])
        : undefined;

      const imageUrl = await generateImageFn(feedback);

      // Validar imagem
      const validation = await validateImageFidelity(
        imageUrl,
        expectedProducts,
        categoryName
      );

      const feedbackText = generateValidationFeedback(validation);

      const attemptRecord: RegenerationAttempt = {
        attemptNumber: attempt,
        imageUrl,
        validationResult: validation,
        feedback: feedbackText,
        timestamp: new Date(),
        success: validation.isValid
      };

      attempts.push(attemptRecord);
      lastValidation = validation;

      console.log(`[AutoRegen] Tentativa ${attempt} - Válida: ${validation.isValid}, Confiança: ${validation.confidence}%`);

      // Se validação passou, retornar sucesso
      if (validation.isValid) {
        return {
          success: true,
          finalImageUrl: imageUrl,
          attempts,
          totalAttempts: attempt,
          finalValidation: validation,
          message: `✅ Imagem validada com sucesso na tentativa ${attempt}/${maxAttempts}`
        };
      }

      // Se confiança está acima de 85%, aceitar mesmo com pequenas discrepâncias
      if (validation.confidence >= 85) {
        return {
          success: true,
          finalImageUrl: imageUrl,
          attempts,
          totalAttempts: attempt,
          finalValidation: validation,
          message: `✅ Imagem aceita com confiança ${validation.confidence}% (acima do limiar de 85%)`
        };
      }
    } catch (error) {
      console.error(`[AutoRegen] Erro na tentativa ${attempt}:`, error);

      const attemptRecord: RegenerationAttempt = {
        attemptNumber: attempt,
        imageUrl: '',
        validationResult: {
          isValid: false,
          confidence: 0,
          detectedProducts: [],
          expectedProducts,
          missingProducts: expectedProducts,
          extraProducts: [],
          issues: [error instanceof Error ? error.message : 'Erro desconhecido'],
          recommendations: ['Tentar novamente']
        },
        feedback: `❌ Erro ao gerar imagem: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        timestamp: new Date(),
        success: false
      };

      attempts.push(attemptRecord);
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  return {
    success: false,
    attempts,
    totalAttempts: maxAttempts,
    finalValidation: lastValidation,
    message: `❌ Falha ao gerar imagem válida após ${maxAttempts} tentativas. Confiança máxima: ${lastValidation?.confidence || 0}%`
  };
}

/**
 * Gera feedback específico para próxima tentativa baseado em falha anterior
 */
function generateFeedbackForNextAttempt(previousAttempt: RegenerationAttempt): string {
  const { validationResult } = previousAttempt;
  let feedback = 'FEEDBACK DA TENTATIVA ANTERIOR:\n\n';

  if (validationResult.extraProducts.length > 0) {
    feedback += `❌ PROBLEMA: Produtos não esperados foram adicionados: ${validationResult.extraProducts.join(', ')}\n`;
    feedback += `✅ SOLUÇÃO: REMOVA completamente estes produtos e use APENAS os produtos listados.\n\n`;
  }

  if (validationResult.missingProducts.length > 0) {
    feedback += `❌ PROBLEMA: Produtos esperados não foram incluídos: ${validationResult.missingProducts.join(', ')}\n`;
    feedback += `✅ SOLUÇÃO: INCLUA estes produtos exatamente como especificado.\n\n`;
  }

  feedback += `Confiança anterior: ${validationResult.confidence}%\n`;
  feedback += 'Tente novamente com ABSOLUTA RESTRIÇÃO à categoria especificada.';

  return feedback;
}

/**
 * Formata relatório de regeneração para exibição ao usuário
 */
export function formatRegenerationReport(result: RegenerationResult): string {
  let report = '';

  report += `${'='.repeat(60)}\n`;
  report += `RELATÓRIO DE REGENERAÇÃO DE IMAGEM\n`;
  report += `${'='.repeat(60)}\n\n`;

  report += `Status: ${result.success ? '✅ SUCESSO' : '❌ FALHA'}\n`;
  report += `Tentativas: ${result.totalAttempts}/${result.attempts.length}\n`;
  report += `Mensagem: ${result.message}\n\n`;

  report += `HISTÓRICO DE TENTATIVAS:\n`;
  report += `${'-'.repeat(60)}\n`;

  result.attempts.forEach((attempt, index) => {
    report += `\nTentativa ${attempt.attemptNumber}:\n`;
    report += `  Status: ${attempt.success ? '✅ Válida' : '❌ Inválida'}\n`;
    report += `  Confiança: ${attempt.validationResult.confidence}%\n`;
    
    if (attempt.validationResult.issues.length > 0) {
      report += `  Problemas:\n`;
      attempt.validationResult.issues.forEach(issue => {
        report += `    • ${issue}\n`;
      });
    }

    if (attempt.validationResult.recommendations.length > 0) {
      report += `  Recomendações:\n`;
      attempt.validationResult.recommendations.forEach(rec => {
        report += `    • ${rec}\n`;
      });
    }
  });

  report += `\n${'='.repeat(60)}\n`;

  return report;
}
