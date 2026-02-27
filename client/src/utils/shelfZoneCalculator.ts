/**
 * Shelf Zone Calculator
 * Determines optimal shelf zone (Altura dos Olhos, Altura das Mãos, Parte de Baixo)
 * based on product margin and sales velocity (giro)
 */

export type MarginLevel = 'Alta' | 'Média' | 'Baixa' | 'High' | 'Medium' | 'Low';
export type GiroLevel = 'Alto' | 'Médio' | 'Baixo' | 'High' | 'Medium' | 'Low';
export type ShelfZone = 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo' | 'Eye level' | 'Hand level' | 'Bottom shelf';

/**
 * Calculates the optimal shelf zone based on product margin and sales velocity
 * 
 * Matrix Logic (CORRECTED):
 * - Low Margin (ANY Giro) = Bottom Shelf (SEMPRE na parte de baixo)
 * - High Margin + High Giro = Eye Level (Premium positioning)
 * - High Margin + Medium Giro = Hand Level (Premium but accessible)
 * - Medium Margin + High Giro = Eye Level (High velocity)
 * - Medium Margin + Medium Giro = Hand Level (Balanced)
 * - Medium Margin + Low Giro = Bottom Shelf (Low velocity)
 * 
 * @param margin - Product margin level (Alta/Média/Baixa or High/Medium/Low)
 * @param giro - Product sales velocity (Alto/Médio/Baixo or High/Medium/Low)
 * @param language - Language for zone names ('pt' or 'en')
 * @returns Optimal shelf zone
 */
export function calculateShelfZone(
  margin: MarginLevel,
  giro: GiroLevel,
  language: 'pt' | 'en' = 'pt'
): ShelfZone {
  // Normalize inputs to English for processing
  const normalizedMargin = normalizeMargin(margin);
  const normalizedGiro = normalizeGiro(giro);

  // REGRA PRINCIPAL: Produtos com Margem Baixa SEMPRE ficam na Parte de Baixo
  if (normalizedMargin === 'Low') {
    return language === 'pt' ? 'Parte de Baixo' : 'Bottom shelf';
  }

  // Para produtos com Margem Alta ou Média, aplicar regras baseadas em Giro
  if (normalizedMargin === 'High') {
    // High margin products
    if (normalizedGiro === 'High') {
      // High margin + High giro → Eye level (premium, best positioning)
      return language === 'pt' ? 'Altura dos olhos' : 'Eye level';
    } else if (normalizedGiro === 'Medium') {
      // High margin + Medium giro → Hand level (accessible)
      return language === 'pt' ? 'Altura das mãos' : 'Hand level';
    } else {
      // High margin + Low giro → Bottom shelf (low velocity)
      return language === 'pt' ? 'Parte de Baixo' : 'Bottom shelf';
    }
  }

  // Medium margin products
  if (normalizedGiro === 'High') {
    // Medium margin + High giro → Eye level (high velocity)
    return language === 'pt' ? 'Altura dos olhos' : 'Eye level';
  } else if (normalizedGiro === 'Medium') {
    // Medium margin + Medium giro → Hand level (balanced)
    return language === 'pt' ? 'Altura das mãos' : 'Hand level';
  } else {
    // Medium margin + Low giro → Bottom shelf (low velocity)
    return language === 'pt' ? 'Parte de Baixo' : 'Bottom shelf';
  }
}

/**
 * Normalizes margin input to standard English format
 */
function normalizeMargin(margin: MarginLevel): 'High' | 'Medium' | 'Low' {
  const normalizedMargin = margin.toLowerCase();
  
  if (normalizedMargin === 'alta' || normalizedMargin === 'high') {
    return 'High';
  } else if (normalizedMargin === 'média' || normalizedMargin === 'medium') {
    return 'Medium';
  } else if (normalizedMargin === 'baixa' || normalizedMargin === 'low') {
    return 'Low';
  }
  
  // Default to Medium if unclear
  return 'Medium';
}

/**
 * Normalizes giro input to standard English format
 */
function normalizeGiro(giro: GiroLevel): 'High' | 'Medium' | 'Low' {
  const normalizedGiro = giro.toLowerCase();
  
  if (normalizedGiro === 'alto' || normalizedGiro === 'high') {
    return 'High';
  } else if (normalizedGiro === 'médio' || normalizedGiro === 'medium') {
    return 'Medium';
  } else if (normalizedGiro === 'baixo' || normalizedGiro === 'low') {
    return 'Low';
  }
  
  // Default to Medium if unclear
  return 'Medium';
}

/**
 * Gets the zone color for visual representation
 */
export function getZoneColor(zone: ShelfZone): string {
  switch (zone) {
    case 'Altura dos olhos':
    case 'Eye level':
      return '#10b981'; // Green - Premium positioning
    case 'Altura das mãos':
    case 'Hand level':
      return '#f59e0b'; // Amber - Accessible positioning
    case 'Parte de Baixo':
    case 'Bottom shelf':
      return '#6b7280'; // Gray - Bulk/Heavy items
    default:
      return '#9ca3af';
  }
}

/**
 * Gets the zone priority (1 = highest, 3 = lowest)
 */
export function getZonePriority(zone: ShelfZone): number {
  switch (zone) {
    case 'Altura dos olhos':
    case 'Eye level':
      return 1;
    case 'Altura das mãos':
    case 'Hand level':
      return 2;
    case 'Parte de Baixo':
    case 'Bottom shelf':
      return 3;
    default:
      return 2;
  }
}
