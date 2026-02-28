/**
 * Calculador de Zona de Prateleira V2
 * 
 * Baseado nas regras de margem e giro dos produtos
 * Tabela de Quadrantes:
 * - Margem Baixa + Giro Baixo = 5 quadrantes
 * - Margem Baixa + Giro Médio = 4 quadrantes
 * - Margem Baixa + Giro Alto = 3 quadrantes
 * - Margem Média + Giro Baixo = 4 quadrantes
 * - Margem Média + Giro Médio = 3 quadrantes
 * - Margem Média + Giro Alto = 2 quadrantes
 * - Margem Alta + Giro Baixo = 3 quadrantes
 * - Margem Alta + Giro Médio = 2 quadrantes
 * - Margem Alta + Giro Alto = 1 quadrante
 * 
 * Tabela de Posicionamento:
 * - Quadrante 1 → Altura dos olhos
 * - Quadrante 2 → Altura dos olhos
 * - Quadrante 3 → Altura das mãos
 * - Quadrante 4 → Altura das mãos
 * - Quadrante 5 → Lugar baixo
 */

export type Margin = "Alta" | "Média" | "Baixa" | "High" | "Medium" | "Low";
export type Velocity = "Alto" | "Médio" | "Baixo" | "High" | "Medium" | "Low";
export type ShelfZone = "Altura dos olhos" | "Altura das mãos" | "Parte de Baixo" | "Eye level" | "Hand level" | "Bottom shelf";

interface QuadrantInfo {
  quadrant: number;
  zone: ShelfZone;
}

/**
 * Normaliza margem para português
 */
function normalizeMargin(margin: Margin): "Alta" | "Média" | "Baixa" {
  const normalized = margin.toLowerCase();
  if (normalized === "alta" || normalized === "high") return "Alta";
  if (normalized === "média" || normalized === "medium") return "Média";
  if (normalized === "baixa" || normalized === "low") return "Baixa";
  return "Média"; // Padrão
}

/**
 * Normaliza velocidade para português
 */
function normalizeVelocity(velocity: Velocity): "Alto" | "Médio" | "Baixo" {
  const normalized = velocity.toLowerCase();
  if (normalized === "alto" || normalized === "high") return "Alto";
  if (normalized === "médio" || normalized === "medium") return "Médio";
  if (normalized === "baixo" || normalized === "low") return "Baixo";
  return "Médio"; // Padrão
}

/**
 * Calcula o número de quadrantes baseado em margem e giro
 */
function calculateQuadrants(margin: "Alta" | "Média" | "Baixa", velocity: "Alto" | "Médio" | "Baixo"): number {
  // Tabela de quadrantes
  const quadrantTable: Record<string, Record<string, number>> = {
    "Baixa": {
      "Baixo": 5,
      "Médio": 4,
      "Alto": 3
    },
    "Média": {
      "Baixo": 4,
      "Médio": 3,
      "Alto": 2
    },
    "Alta": {
      "Baixo": 3,
      "Médio": 2,
      "Alto": 1
    }
  };

  return quadrantTable[margin]?.[velocity] ?? 3;
}

/**
 * Mapeia quadrante para zona de prateleira
 */
function mapQuadrantToZone(quadrant: number, language: "pt" | "en" = "pt"): ShelfZone {
   // Tabela de posicionamento
  // Quadrante 1 → Altura dos olhos
  // Quadrante 2 → Altura dos olhos
  // Quadrante 3 → Altura das mãos
  // Quadrante 4 → Altura das mãos
  // Quadrante 5 → Parte de Baixoxo

  if (quadrant === 1 || quadrant === 2) {
    return language === "en" ? "Eye level" : "Altura dos olhos";
  }
  if (quadrant === 3 || quadrant === 4) {
    return language === "en" ? "Hand level" : "Altura das mãos";
  }
  if (quadrant === 5) {
    return language === "en" ? "Bottom shelf" : "Parte de Baixo";
  }

  // Padrão
  return language === "en" ? "Hand level" : "Altura das mãos";
}

/**
 * Calcula a zona de prateleira baseada em margem e giro
 * 
 * REGRA ESPECIAL: Produtos com Margem Baixa SEMPRE vão para "Parte de Baixo"
 * 
 * @param margin - Margem do produto (Alta, Média, Baixa)
 * @param velocity - Velocidade/Giro do produto (Alto, Médio, Baixo)
 * @param language - Idioma (pt ou en)
 * @returns Zona de prateleira
 */
export function calculateShelfZoneV2(
  margin: Margin,
  velocity: Velocity,
  language: "pt" | "en" = "pt"
): ShelfZone {
  // Normalizar entradas
  const normalizedMargin = normalizeMargin(margin);
  const normalizedVelocity = normalizeVelocity(velocity);

  // REGRA ESPECIAL: Produtos com Margem Baixa SEMPRE vão para "Parte de Baixo"
  if (normalizedMargin === "Baixa") {
    return language === "en" ? "Bottom shelf" : "Parte de Baixo";
  }

  // Para Margem Média e Alta, seguir a tabela de quadrantes
  // Calcular quadrante
  const quadrant = calculateQuadrants(normalizedMargin, normalizedVelocity);

  // Mapear quadrante para zona
  const zone = mapQuadrantToZone(quadrant, language);

  return zone;
}

/**
 * Retorna informações detalhadas sobre o quadrante e zona
 */
export function getQuadrantInfo(
  margin: Margin,
  velocity: Velocity,
  language: "pt" | "en" = "pt"
): QuadrantInfo {
  const normalizedMargin = normalizeMargin(margin);
  const normalizedVelocity = normalizeVelocity(velocity);
  const quadrant = calculateQuadrants(normalizedMargin, normalizedVelocity);
  const zone = mapQuadrantToZone(quadrant, language);

  return {
    quadrant,
    zone
  };
}

/**
 * Distribui produtos em zonas com fallback inteligente
 * 
 * Se não houver produtos em uma zona, usa a próxima na ordem:
 * Olhos → Mãos → Baixo
 */
export function distributeProductsByZone(
  products: Array<{ margin: Margin; velocity: Velocity; name: string }>,
  language: "pt" | "en" = "pt"
): Record<string, Array<{ margin: Margin; velocity: Velocity; name: string }>> {
  const eyeLevelZone = language === "en" ? "Eye level" : "Altura dos olhos";
  const handLevelZone = language === "en" ? "Hand level" : "Altura das mãos";
  const belowZone = language === "en" ? "Bottom shelf" : "Parte de Baixo";

  const distribution: Record<string, Array<{ margin: Margin; velocity: Velocity; name: string }>> = {
    [eyeLevelZone]: [],
    [handLevelZone]: [],
    [belowZone]: []
  };

  // Distribuir produtos nas zonas
  products.forEach(product => {
    const zone = calculateShelfZoneV2(product.margin, product.velocity, language);
    if (distribution[zone]) {
      distribution[zone].push(product);
    }
  });

  // Aplicar fallback inteligente
  // Se não houver produtos em Olhos, usar Mãos
  if (distribution[eyeLevelZone].length === 0 && distribution[handLevelZone].length > 0) {
    const moveCount = Math.ceil(distribution[handLevelZone].length / 2);
    distribution[eyeLevelZone].push(...distribution[handLevelZone].splice(0, moveCount));
  }

  // Se não houver produtos em Mãos, usar Baixo
  if (distribution[handLevelZone].length === 0 && distribution[belowZone].length > 0) {
    const moveCount = Math.ceil(distribution[belowZone].length / 2);
    distribution[handLevelZone].push(...distribution[belowZone].splice(0, moveCount));
  }

  return distribution;
}
