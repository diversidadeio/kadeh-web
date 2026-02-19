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
 * Matrix Logic:
 * - High Margin + High Giro = Eye Level (Premium positioning)
 * - High Margin + Medium Giro = Eye Level (Premium positioning)
 * - Medium Margin + High Giro = Hand Level (Accessible, high volume)
 * - Medium Margin + Medium Giro = Hand Level (Accessible, balanced)
 * - Low Margin + High Giro = Hand Level (Volume sales)
 * - Any Margin + Low Giro = Bottom Shelf (Bulk, heavy items)
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

  // Apply decision matrix
  if (normalizedGiro === 'Low') {
    // Low sales velocity → Bottom shelf (bulk, heavy items)
    return language === 'pt' ? 'Parte de Baixo' : 'Bottom shelf';
  }

  if (normalizedMargin === 'High') {
    // High margin products → Eye level (premium positioning)
    return language === 'pt' ? 'Altura dos olhos' : 'Eye level';
  }

  if (normalizedMargin === 'Medium') {
    // Medium margin products
    if (normalizedGiro === 'High') {
      // High velocity → Hand level (accessible, high volume)
      return language === 'pt' ? 'Altura das mãos' : 'Hand level';
    } else {
      // Medium velocity → Hand level (balanced)
      return language === 'pt' ? 'Altura das mãos' : 'Hand level';
    }
  }

  // Low margin products
  if (normalizedGiro === 'High') {
    // High velocity despite low margin → Hand level (volume sales)
    return language === 'pt' ? 'Altura das mãos' : 'Hand level';
  } else {
    // Low margin + medium velocity → Bottom shelf
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
