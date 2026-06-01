import { describe, it, expect } from "vitest";
import { classifyByKeywords } from "../legal-performance-router";
import { evaluateQualityGates } from "../quality-gates";
import { USE_CASES } from "../use-cases";
import type { HarmonizeContext } from "../legal-performance-types";

describe("classifyByKeywords", () => {
  const cases: Array<{ text: string; expected: keyof typeof USE_CASES }> = [
    { text: "Preciso diagnosticar o status do processo e verificar prazos", expected: "UC-LP-001" },
    { text: "Analisar autos: petição inicial, sentença e acórdão", expected: "UC-LP-002" },
    { text: "Ação cível sob o CPC com contestação e execução", expected: "UC-LP-003" },
    { text: "Cabe recurso especial (REsp) com prequestionamento?", expected: "UC-LP-004" },
    { text: "Quero mapear o processo, o fluxo e os gargalos (BPMN)", expected: "UC-LP-005" },
    { text: "Pesquisar jurisprudência do STJ e súmula aplicável", expected: "UC-LP-006" },
    { text: "Perícia em iPhone: IMEI, cadeia de custódia e quesitos", expected: "UC-LP-007" },
    { text: "Preciso do design da interface e dashboard do produto jurídico", expected: "UC-LP-008" },
  ];

  for (const c of cases) {
    it(`classifies "${c.text.slice(0, 30)}..." as ${c.expected}`, () => {
      const result = classifyByKeywords({ text: c.text });
      expect(result.useCase).toBe(c.expected);
      expect(result.score).toBeGreaterThan(0);
    });
  }

  it("is accent-insensitive", () => {
    const result = classifyByKeywords({ text: "pesquisar jurisprudencia e sumula" });
    expect(result.useCase).toBe("UC-LP-006");
  });
});

describe("evaluateQualityGates", () => {
  it("always includes classification and human-review gates", () => {
    const ctx: HarmonizeContext = {
      input: { demand: "teste" },
      classification: {
        useCase: USE_CASES["UC-LP-001"],
        confidence: 0.8,
        method: "keyword",
        matchedPatterns: [],
        rationale: "",
      },
    };
    const gates = evaluateQualityGates(ctx);
    const ids = gates.map((g) => g.id);
    expect(ids).toContain("QG-LP-001");
    expect(ids).toContain("QG-LP-006");
    expect(gates.find((g) => g.id === "QG-LP-001")?.passed).toBe(true);
  });

  it("flags missing sources for research routes", () => {
    const ctx: HarmonizeContext = {
      input: { demand: "pesquisa" },
      classification: {
        useCase: USE_CASES["UC-LP-006"],
        confidence: 0.8,
        method: "keyword",
        matchedPatterns: [],
        rationale: "",
      },
    };
    const gates = evaluateQualityGates(ctx);
    const sourceGate = gates.find((g) => g.id === "QG-LP-002");
    expect(sourceGate).toBeDefined();
    expect(sourceGate?.passed).toBe(false);
  });
});
