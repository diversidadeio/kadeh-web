import { describe, expect, it } from "vitest";
import {
  calculateShelfZone,
  getZoneColor,
  getZonePriority,
  type MarginLevel,
  type GiroLevel,
  type ShelfZone,
} from "./shelfZoneCalculator";
import {
  calculateShelfZoneV2,
  getQuadrantInfo,
  distributeProductsByZone,
  type Margin,
  type Velocity,
} from "./shelfZoneCalculatorV2";
import { getRecommendationByABCCurves } from "@/data/categories";

// ============================================================
// 1. getRecommendationByABCCurves — Matriz ABC completa
// ============================================================
describe("getRecommendationByABCCurves", () => {
  const expectedMatrix: Record<
    string,
    { quadrantes: number; zone: string; share: number }
  > = {
    "A-A": { quadrantes: 1, zone: "Altura dos olhos", share: 35 },
    "A-B": { quadrantes: 2, zone: "Altura dos olhos", share: 25 },
    "A-C": { quadrantes: 2, zone: "Altura das mãos", share: 20 },
    "B-A": { quadrantes: 2, zone: "Altura dos olhos", share: 25 },
    "B-B": { quadrantes: 3, zone: "Altura das mãos", share: 20 },
    "B-C": { quadrantes: 4, zone: "Altura das mãos", share: 15 },
    "C-A": { quadrantes: 2, zone: "Altura das mãos", share: 20 },
    "C-B": { quadrantes: 4, zone: "Altura das mãos", share: 15 },
    "C-C": { quadrantes: 5, zone: "Parte de Baixo", share: 5 },
  };

  const curves: Array<"A" | "B" | "C"> = ["A", "B", "C"];

  // Testa todas as 9 combinações de curvas ABC
  for (const faturamento of curves) {
    for (const lucratividade of curves) {
      const key = `${faturamento}-${lucratividade}`;
      const expected = expectedMatrix[key];

      it(`${key}: zona "${expected.zone}", ${expected.quadrantes} quadrante(s), share ${expected.share}%`, () => {
        const result = getRecommendationByABCCurves(faturamento, lucratividade);
        expect(result.zone).toBe(expected.zone);
        expect(result.quadrantes).toBe(expected.quadrantes);
        expect(result.share).toBe(expected.share);
      });
    }
  }

  it("retorna fallback para combinação inválida", () => {
    // @ts-expect-error - testando entrada inválida
    const result = getRecommendationByABCCurves("X", "Y");
    expect(result).toEqual({ quadrantes: 3, zone: "Altura das mãos", share: 15 });
  });
});

// ============================================================
// 2. Regras de negócio das zonas ABC
// ============================================================
describe("Regras de negócio das zonas ABC", () => {
  it("produtos A-A (alto faturamento + alta lucratividade) ficam na Altura dos olhos", () => {
    const rec = getRecommendationByABCCurves("A", "A");
    expect(rec.zone).toBe("Altura dos olhos");
    expect(rec.quadrantes).toBe(1); // mínimo de quadrantes = produto premium
  });

  it("produtos C-C (baixo faturamento + baixa lucratividade) ficam na Parte de Baixo", () => {
    const rec = getRecommendationByABCCurves("C", "C");
    expect(rec.zone).toBe("Parte de Baixo");
    expect(rec.quadrantes).toBe(5); // máximo de quadrantes = produto de baixo giro
  });

  it("produtos com alta lucratividade (coluna A) nunca ficam na Parte de Baixo", () => {
    const highProfitCombinations: Array<"A" | "B" | "C"> = ["A", "B", "C"];
    for (const faturamento of highProfitCombinations) {
      const rec = getRecommendationByABCCurves(faturamento, "A");
      expect(rec.zone).not.toBe("Parte de Baixo");
    }
  });

  it("somente C-C fica na Parte de Baixo", () => {
    const curves: Array<"A" | "B" | "C"> = ["A", "B", "C"];
    for (const fat of curves) {
      for (const luc of curves) {
        const rec = getRecommendationByABCCurves(fat, luc);
        if (fat === "C" && luc === "C") {
          expect(rec.zone).toBe("Parte de Baixo");
        } else {
          expect(rec.zone).not.toBe("Parte de Baixo");
        }
      }
    }
  });

  it("share diminui conforme a combinação piora (A-A > B-B > C-C)", () => {
    const aa = getRecommendationByABCCurves("A", "A");
    const bb = getRecommendationByABCCurves("B", "B");
    const cc = getRecommendationByABCCurves("C", "C");
    expect(aa.share).toBeGreaterThan(bb.share);
    expect(bb.share).toBeGreaterThan(cc.share);
  });

  it("quadrantes aumentam conforme a combinação piora (A-A < B-B < C-C)", () => {
    const aa = getRecommendationByABCCurves("A", "A");
    const bb = getRecommendationByABCCurves("B", "B");
    const cc = getRecommendationByABCCurves("C", "C");
    expect(aa.quadrantes).toBeLessThan(bb.quadrantes);
    expect(bb.quadrantes).toBeLessThan(cc.quadrantes);
  });
});

// ============================================================
// 3. calculateShelfZone (V1) — Margem x Giro descritivo
// ============================================================
describe("calculateShelfZone (V1)", () => {
  const ptCases: Array<{ margin: MarginLevel; giro: GiroLevel; expected: ShelfZone }> = [
    { margin: "Alta", giro: "Alto", expected: "Altura dos olhos" },
    { margin: "Alta", giro: "Médio", expected: "Altura das mãos" },
    { margin: "Alta", giro: "Baixo", expected: "Parte de Baixo" },
    { margin: "Média", giro: "Alto", expected: "Altura dos olhos" },
    { margin: "Média", giro: "Médio", expected: "Altura das mãos" },
    { margin: "Média", giro: "Baixo", expected: "Parte de Baixo" },
    { margin: "Baixa", giro: "Alto", expected: "Parte de Baixo" },
    { margin: "Baixa", giro: "Médio", expected: "Parte de Baixo" },
    { margin: "Baixa", giro: "Baixo", expected: "Parte de Baixo" },
  ];

  for (const { margin, giro, expected } of ptCases) {
    it(`PT: Margem ${margin} + Giro ${giro} → ${expected}`, () => {
      expect(calculateShelfZone(margin, giro, "pt")).toBe(expected);
    });
  }

  const enCases: Array<{ margin: MarginLevel; giro: GiroLevel; expected: ShelfZone }> = [
    { margin: "High", giro: "High", expected: "Eye level" },
    { margin: "High", giro: "Medium", expected: "Hand level" },
    { margin: "High", giro: "Low", expected: "Bottom shelf" },
    { margin: "Medium", giro: "High", expected: "Eye level" },
    { margin: "Medium", giro: "Medium", expected: "Hand level" },
    { margin: "Medium", giro: "Low", expected: "Bottom shelf" },
    { margin: "Low", giro: "High", expected: "Bottom shelf" },
    { margin: "Low", giro: "Medium", expected: "Bottom shelf" },
    { margin: "Low", giro: "Low", expected: "Bottom shelf" },
  ];

  for (const { margin, giro, expected } of enCases) {
    it(`EN: Margin ${margin} + Velocity ${giro} → ${expected}`, () => {
      expect(calculateShelfZone(margin, giro, "en")).toBe(expected);
    });
  }

  it("margem baixa SEMPRE retorna Parte de Baixo independente do giro", () => {
    const giros: GiroLevel[] = ["Alto", "Médio", "Baixo"];
    for (const giro of giros) {
      expect(calculateShelfZone("Baixa", giro, "pt")).toBe("Parte de Baixo");
    }
  });

  it("valores ABC ('A','B','C') caem no default Medium (bug documentado)", () => {
    // Este teste documenta o comportamento que causava o bug original:
    // Quando "A", "B", "C" são passados, normalizeMargin/normalizeGiro
    // não os reconhece e retorna "Medium" como default.
    // @ts-expect-error - testando entrada inválida (curvas ABC)
    const result = calculateShelfZone("A", "B", "pt");
    // "A" → default Medium margin, "B" → default Medium giro → "Altura das mãos"
    expect(result).toBe("Altura das mãos");
  });
});

// ============================================================
// 4. calculateShelfZoneV2 — Baseado em quadrantes
// ============================================================
describe("calculateShelfZoneV2", () => {
  const ptCases: Array<{ margin: Margin; velocity: Velocity; expected: string }> = [
    { margin: "Alta", velocity: "Alto", expected: "Altura dos olhos" },   // Q1
    { margin: "Alta", velocity: "Médio", expected: "Altura dos olhos" },  // Q2
    { margin: "Alta", velocity: "Baixo", expected: "Altura das mãos" },   // Q3
    { margin: "Média", velocity: "Alto", expected: "Altura dos olhos" },  // Q2
    { margin: "Média", velocity: "Médio", expected: "Altura das mãos" },  // Q3
    { margin: "Média", velocity: "Baixo", expected: "Altura das mãos" },  // Q4
    { margin: "Baixa", velocity: "Alto", expected: "Parte de Baixo" },    // Regra especial
    { margin: "Baixa", velocity: "Médio", expected: "Parte de Baixo" },   // Regra especial
    { margin: "Baixa", velocity: "Baixo", expected: "Parte de Baixo" },   // Regra especial
  ];

  for (const { margin, velocity, expected } of ptCases) {
    it(`PT: Margem ${margin} + Giro ${velocity} → ${expected}`, () => {
      expect(calculateShelfZoneV2(margin, velocity, "pt")).toBe(expected);
    });
  }

  it("margem baixa SEMPRE retorna Parte de Baixo (regra especial V2)", () => {
    const velocities: Velocity[] = ["Alto", "Médio", "Baixo"];
    for (const v of velocities) {
      expect(calculateShelfZoneV2("Baixa", v, "pt")).toBe("Parte de Baixo");
    }
  });

  it("aceita entradas em inglês", () => {
    expect(calculateShelfZoneV2("High", "High", "en")).toBe("Eye level");
    expect(calculateShelfZoneV2("Low", "High", "en")).toBe("Bottom shelf");
  });
});

// ============================================================
// 5. getQuadrantInfo — Informações detalhadas de quadrantes
// ============================================================
describe("getQuadrantInfo", () => {
  it("Alta + Alto → quadrante 1 (Altura dos olhos)", () => {
    const info = getQuadrantInfo("Alta", "Alto", "pt");
    expect(info.quadrant).toBe(1);
    expect(info.zone).toBe("Altura dos olhos");
  });

  it("Alta + Médio → quadrante 2 (Altura dos olhos)", () => {
    const info = getQuadrantInfo("Alta", "Médio", "pt");
    expect(info.quadrant).toBe(2);
    expect(info.zone).toBe("Altura dos olhos");
  });

  it("Média + Médio → quadrante 3 (Altura das mãos)", () => {
    const info = getQuadrantInfo("Média", "Médio", "pt");
    expect(info.quadrant).toBe(3);
    expect(info.zone).toBe("Altura das mãos");
  });

  it("Baixa + Baixo → quadrante 5 (Parte de Baixo)", () => {
    // Nota: V2 tem regra especial que Baixa SEMPRE vai para Parte de Baixo
    // mas getQuadrantInfo calcula o quadrante normalmente
    const info = getQuadrantInfo("Baixa", "Baixo", "pt");
    expect(info.quadrant).toBe(5);
    expect(info.zone).toBe("Parte de Baixo");
  });
});

// ============================================================
// 6. distributeProductsByZone — Distribuição com fallback
// ============================================================
describe("distributeProductsByZone", () => {
  it("distribui produtos corretamente nas 3 zonas", () => {
    const products = [
      { margin: "Alta" as Margin, velocity: "Alto" as Velocity, name: "Premium" },
      { margin: "Média" as Margin, velocity: "Médio" as Velocity, name: "Regular" },
      { margin: "Baixa" as Margin, velocity: "Baixo" as Velocity, name: "Econômico" },
    ];

    const distribution = distributeProductsByZone(products, "pt");

    expect(distribution["Altura dos olhos"].map((p) => p.name)).toContain("Premium");
    expect(distribution["Altura das mãos"].map((p) => p.name)).toContain("Regular");
    expect(distribution["Parte de Baixo"].map((p) => p.name)).toContain("Econômico");
  });

  it("aplica fallback quando zona dos olhos está vazia", () => {
    const products = [
      { margin: "Média" as Margin, velocity: "Médio" as Velocity, name: "Regular1" },
      { margin: "Média" as Margin, velocity: "Médio" as Velocity, name: "Regular2" },
      { margin: "Baixa" as Margin, velocity: "Baixo" as Velocity, name: "Econômico" },
    ];

    const distribution = distributeProductsByZone(products, "pt");

    // Fallback: se olhos vazio, move metade de mãos para olhos
    expect(distribution["Altura dos olhos"].length).toBeGreaterThan(0);
  });

  it("funciona em inglês", () => {
    const products = [
      { margin: "High" as Margin, velocity: "High" as Velocity, name: "Premium" },
    ];

    const distribution = distributeProductsByZone(products, "en");
    expect(distribution["Eye level"].map((p) => p.name)).toContain("Premium");
  });
});

// ============================================================
// 7. Funções auxiliares — cores e prioridades
// ============================================================
describe("getZoneColor", () => {
  it("retorna verde para Altura dos olhos", () => {
    expect(getZoneColor("Altura dos olhos")).toBe("#10b981");
    expect(getZoneColor("Eye level")).toBe("#10b981");
  });

  it("retorna âmbar para Altura das mãos", () => {
    expect(getZoneColor("Altura das mãos")).toBe("#f59e0b");
    expect(getZoneColor("Hand level")).toBe("#f59e0b");
  });

  it("retorna cinza para Parte de Baixo", () => {
    expect(getZoneColor("Parte de Baixo")).toBe("#6b7280");
    expect(getZoneColor("Bottom shelf")).toBe("#6b7280");
  });
});

describe("getZonePriority", () => {
  it("Altura dos olhos tem prioridade 1 (mais alta)", () => {
    expect(getZonePriority("Altura dos olhos")).toBe(1);
    expect(getZonePriority("Eye level")).toBe(1);
  });

  it("Altura das mãos tem prioridade 2", () => {
    expect(getZonePriority("Altura das mãos")).toBe(2);
    expect(getZonePriority("Hand level")).toBe(2);
  });

  it("Parte de Baixo tem prioridade 3 (mais baixa)", () => {
    expect(getZonePriority("Parte de Baixo")).toBe(3);
    expect(getZonePriority("Bottom shelf")).toBe(3);
  });
});

// ============================================================
// 8. Consistência entre V1, V2 e ABC
// ============================================================
describe("Consistência entre calculadoras", () => {
  // Mapeamento de curvas ABC para níveis descritivos
  const abcToDescriptive: Record<string, { margin: MarginLevel; giro: GiroLevel }> = {
    A: { margin: "Alta", giro: "Alto" },
    B: { margin: "Média", giro: "Médio" },
    C: { margin: "Baixa", giro: "Baixo" },
  };

  it("ABC A-A e V1 Alta+Alto concordam na zona premium", () => {
    const abc = getRecommendationByABCCurves("A", "A");
    const v1 = calculateShelfZone("Alta", "Alto", "pt");
    expect(abc.zone).toBe(v1);
  });

  it("ABC C-C e V1 Baixa+Baixo concordam na zona inferior", () => {
    const abc = getRecommendationByABCCurves("C", "C");
    const v1 = calculateShelfZone("Baixa", "Baixo", "pt");
    expect(abc.zone).toBe(v1);
  });

  it("todas as zonas retornadas são válidas", () => {
    const validZones = [
      "Altura dos olhos",
      "Altura das mãos",
      "Parte de Baixo",
    ];
    const curves: Array<"A" | "B" | "C"> = ["A", "B", "C"];

    for (const fat of curves) {
      for (const luc of curves) {
        const rec = getRecommendationByABCCurves(fat, luc);
        expect(validZones).toContain(rec.zone);
      }
    }
  });

  it("quadrantes estão no intervalo válido (1 a 5)", () => {
    const curves: Array<"A" | "B" | "C"> = ["A", "B", "C"];
    for (const fat of curves) {
      for (const luc of curves) {
        const rec = getRecommendationByABCCurves(fat, luc);
        expect(rec.quadrantes).toBeGreaterThanOrEqual(1);
        expect(rec.quadrantes).toBeLessThanOrEqual(5);
      }
    }
  });

  it("share está no intervalo válido (1 a 100)", () => {
    const curves: Array<"A" | "B" | "C"> = ["A", "B", "C"];
    for (const fat of curves) {
      for (const luc of curves) {
        const rec = getRecommendationByABCCurves(fat, luc);
        expect(rec.share).toBeGreaterThanOrEqual(1);
        expect(rec.share).toBeLessThanOrEqual(100);
      }
    }
  });
});
