/**
 * @jest-environment node
 */
jest.mock("@/lib/agents/llm-gateway", () => ({
  llmGateway: {
    selectModel: jest.fn(() => "gpt-4o-mini"),
    complete: jest.fn(),
  },
}));

import { calculatorAgent } from "@/lib/agents/agents/calculator";
import { llmGateway } from "@/lib/agents/llm-gateway";

const mockedComplete = jest.mocked(llmGateway.complete);

function deadline(overrides: Record<string, unknown>) {
  return {
    description: "prazo",
    legalBasis: "",
    dueDate: "2026-01-31",
    businessDays: 10,
    calendarDays: 0,
    urgency: "low",
    isAutomatic: false,
    ...overrides,
  };
}

function llmResponse(content: string) {
  return {
    content,
    model: "gpt-4o-mini",
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    cost: 0,
  };
}

function respondWith(payload: Record<string, unknown>) {
  mockedComplete.mockResolvedValue(llmResponse(JSON.stringify(payload)));
}

const baseTimeline = [
  { date: "2026-01-01", description: "Distribuição", type: "filing" as const },
];

describe("CalculatorAgent — deterministic post-processing", () => {
  afterEach(() => mockedComplete.mockReset());

  it("recomputes urgency from businessDays thresholds (ignoring the LLM value)", async () => {
    respondWith({
      deadlines: [
        deadline({ dueDate: "2026-01-06", businessDays: 2 }), // <= 3  -> critical
        deadline({ dueDate: "2026-01-12", businessDays: 6 }), // <= 7  -> high
        deadline({ dueDate: "2026-01-20", businessDays: 12 }), // <= 15 -> medium
        deadline({ dueDate: "2026-02-15", businessDays: 30 }), // > 15  -> low
      ],
      nextDeadline: { description: "p", dueDate: "2026-01-06", daysRemaining: 5, urgency: "low" },
      criticalPath: [],
      warnings: [],
    });

    const out = await calculatorAgent.execute({
      timeline: baseTimeline,
      proceduralRequirements: [],
      processType: "Civil",
    });

    expect(out.deadlines.map((d) => d.urgency)).toEqual([
      "critical",
      "high",
      "medium",
      "low",
    ]);
  });

  it("computes calendarDays from the last timeline event to the due date", async () => {
    respondWith({
      deadlines: [deadline({ dueDate: "2026-01-11", businessDays: 5, calendarDays: 999 })],
      nextDeadline: { description: "p", dueDate: "2026-01-11", daysRemaining: 10, urgency: "low" },
      criticalPath: [],
      warnings: [],
    });

    const out = await calculatorAgent.execute({
      timeline: baseTimeline, // last event 2026-01-01
      proceduralRequirements: [],
      processType: "Civil",
    });

    expect(out.deadlines[0].calendarDays).toBe(10); // 2026-01-01 -> 2026-01-11
  });

  it("returns a safe fallback when the response has no JSON", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedComplete.mockResolvedValue(llmResponse("sem json aqui"));

    const out = await calculatorAgent.execute({
      timeline: [],
      proceduralRequirements: [],
      processType: "Civil",
    });

    expect(out.deadlines).toEqual([]);
    expect(out.warnings).toContain("Erro ao processar prazos");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
