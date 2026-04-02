/**
 * Fidelity Validator - Compares gondola visualization with AI-generated image
 * Validates that products are positioned correctly and alerts on discrepancies
 */

export interface ShelfProduct {
  name: string;
  percentage: number;
  zone: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  shelfIndex: number;
}

export interface ShelfLayout {
  shelves: ShelfProduct[][];
  totalWidth: number;
  numberOfShelves: number;
}

export interface ValidationResult {
  isValid: boolean;
  discrepancies: ValidationDiscrepancy[];
  warnings: ValidationWarning[];
  score: number; // 0-100, where 100 is perfect fidelity
}

export interface ValidationDiscrepancy {
  type: 'missing_product' | 'wrong_position' | 'wrong_percentage' | 'empty_shelf';
  product?: string;
  expectedShelf?: number;
  actualShelf?: number;
  expectedPercentage?: number;
  actualPercentage?: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
}

export interface ValidationWarning {
  type: 'low_shelf_occupancy' | 'high_shelf_occupancy' | 'zone_imbalance';
  shelf?: number;
  occupancy?: number;
  message: string;
}

/**
 * Validates the fidelity between gondola visualization and AI-generated image
 * @param visualizationData - The structured gondola visualization data
 * @param aiImageData - Extracted data from AI-generated image (product positions)
 * @returns ValidationResult with discrepancies and warnings
 */
export function validateFidelity(
  visualizationData: ShelfLayout,
  aiImageData: ShelfLayout
): ValidationResult {
  const discrepancies: ValidationDiscrepancy[] = [];
  const warnings: ValidationWarning[] = [];
  let matchedProducts = 0;
  let totalProducts = 0;

  // Check each shelf
  for (let shelfIndex = 0; shelfIndex < visualizationData.shelves.length; shelfIndex++) {
    const vizShelf = visualizationData.shelves[shelfIndex];
    const aiShelf = aiImageData.shelves[shelfIndex] || [];

    // Check shelf occupancy
    const vizOccupancy = vizShelf.reduce((sum, p) => sum + p.percentage, 0);
    const aiOccupancy = aiShelf.reduce((sum, p) => sum + p.percentage, 0);

    if (vizOccupancy < 80) {
      warnings.push({
        type: 'low_shelf_occupancy',
        shelf: shelfIndex + 1,
        occupancy: vizOccupancy,
        message: `Shelf ${shelfIndex + 1} has low occupancy: ${vizOccupancy.toFixed(1)}%`
      });
    }

    if (vizOccupancy > 100) {
      warnings.push({
        type: 'high_shelf_occupancy',
        shelf: shelfIndex + 1,
        occupancy: vizOccupancy,
        message: `Shelf ${shelfIndex + 1} exceeds capacity: ${vizOccupancy.toFixed(1)}%`
      });
    }

    // Check product positions
    for (const vizProduct of vizShelf) {
      totalProducts++;
      const aiProduct = aiShelf.find(p => p.name === vizProduct.name);

      if (!aiProduct) {
        discrepancies.push({
          type: 'missing_product',
          product: vizProduct.name,
          expectedShelf: shelfIndex + 1,
          severity: 'high',
          message: `Product "${vizProduct.name}" not found in AI image on shelf ${shelfIndex + 1}`
        });
      } else {
        // Check if percentage is close (within 5%)
        const percentageDiff = Math.abs(vizProduct.percentage - aiProduct.percentage);
        if (percentageDiff > 5) {
          discrepancies.push({
            type: 'wrong_percentage',
            product: vizProduct.name,
            expectedPercentage: vizProduct.percentage,
            actualPercentage: aiProduct.percentage,
            severity: 'medium',
            message: `Product "${vizProduct.name}" percentage mismatch: expected ${vizProduct.percentage.toFixed(1)}%, got ${aiProduct.percentage.toFixed(1)}%`
          });
        } else {
          matchedProducts++;
        }

        // Check if zone is correct
        if (vizProduct.zone !== aiProduct.zone) {
          discrepancies.push({
            type: 'wrong_position',
            product: vizProduct.name,
            severity: 'critical',
            message: `Product "${vizProduct.name}" in wrong zone: expected ${vizProduct.zone}, got ${aiProduct.zone}`
          });
        }
      }
    }

    // Check for extra products in AI image
    for (const aiProduct of aiShelf) {
      if (!vizShelf.find(p => p.name === aiProduct.name)) {
        discrepancies.push({
          type: 'missing_product',
          product: aiProduct.name,
          severity: 'high',
          message: `Extra product "${aiProduct.name}" found in AI image on shelf ${shelfIndex + 1}`
        });
      }
    }
  }

  // Calculate fidelity score
  const criticalDiscrepancies = discrepancies.filter(d => d.severity === 'critical').length;
  const highDiscrepancies = discrepancies.filter(d => d.severity === 'high').length;
  const mediumDiscrepancies = discrepancies.filter(d => d.severity === 'medium').length;
  const lowDiscrepancies = discrepancies.filter(d => d.severity === 'low').length;

  const score = Math.max(0, 100 - (criticalDiscrepancies * 25 + highDiscrepancies * 10 + mediumDiscrepancies * 5 + lowDiscrepancies * 1));

  return {
    isValid: discrepancies.length === 0 && warnings.length === 0,
    discrepancies,
    warnings,
    score: Math.round(score)
  };
}

/**
 * Extracts product position data from gondola visualization
 * @param shelves - Array of shelf arrays with products
 * @returns ShelfLayout with structured data
 */
export function extractVisualizationData(
  shelves: ShelfProduct[][],
  totalWidth: number,
  numberOfShelves: number
): ShelfLayout {
  return {
    shelves,
    totalWidth,
    numberOfShelves
  };
}

/**
 * Generates a human-readable validation report
 * @param result - ValidationResult from validateFidelity
 * @returns Formatted report string
 */
export function generateValidationReport(result: ValidationResult): string {
  let report = `# Fidelity Validation Report\n\n`;
  report += `**Overall Score: ${result.score}/100**\n`;
  report += `**Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}\n\n`;

  if (result.discrepancies.length > 0) {
    report += `## Discrepancies Found (${result.discrepancies.length})\n\n`;
    const bySeverity = {
      critical: result.discrepancies.filter(d => d.severity === 'critical'),
      high: result.discrepancies.filter(d => d.severity === 'high'),
      medium: result.discrepancies.filter(d => d.severity === 'medium'),
      low: result.discrepancies.filter(d => d.severity === 'low')
    };

    for (const [severity, items] of Object.entries(bySeverity)) {
      if (items.length > 0) {
        report += `### ${severity.toUpperCase()} (${items.length})\n`;
        for (const item of items) {
          report += `- ${item.message}\n`;
        }
        report += '\n';
      }
    }
  }

  if (result.warnings.length > 0) {
    report += `## Warnings (${result.warnings.length})\n\n`;
    for (const warning of result.warnings) {
      report += `- ${warning.message}\n`;
    }
    report += '\n';
  }

  return report;
}
