import { llmGateway } from "./llm-gateway";
import {
  USE_CASES,
  DEFAULT_USE_CASE,
  type UseCaseId,
  type UseCaseDefinition,
} from "./use-cases";

export interface ClassificationInput {
  /** Free-text description of the demand (goal, question, context). */
  text: string;
  /** Optional document filenames/types to enrich the signal. */
  documentHints?: string[];
}

export interface ClassificationResult {
  useCase: UseCaseDefinition;
  confidence: number;
  method: "keyword" | "llm" | "fallback";
  matchedPatterns: string[];
  rationale: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Fast deterministic classification using the trigger patterns declared in the
 * squad config. Returns the best-scoring use case and the patterns it matched.
 */
export function classifyByKeywords(input: ClassificationInput): {
  useCase: UseCaseId;
  score: number;
  matched: string[];
} {
  const haystack = normalize(
    [input.text, ...(input.documentHints ?? [])].join(" ")
  );

  let best: { useCase: UseCaseId; score: number; matched: string[] } = {
    useCase: DEFAULT_USE_CASE,
    score: 0,
    matched: [],
  };

  for (const uc of Object.values(USE_CASES)) {
    const matched = uc.triggerPatterns.filter((p) =>
      haystack.includes(normalize(p))
    );
    const score = matched.length;
    if (score > best.score) {
      best = { useCase: uc.id, score, matched };
    }
  }

  return best;
}

/**
 * Classifies a legal demand into a UC-LP use case. Tries keyword matching first
 * (deterministic, free); only falls back to the LLM when the signal is weak and
 * an LLM client is configured.
 */
export async function classifyLegalDemand(
  input: ClassificationInput
): Promise<ClassificationResult> {
  const keyword = classifyByKeywords(input);

  if (keyword.score >= 2) {
    return {
      useCase: USE_CASES[keyword.useCase],
      confidence: Math.min(0.6 + keyword.score * 0.1, 0.95),
      method: "keyword",
      matchedPatterns: keyword.matched,
      rationale: `Classificação por correspondência de ${keyword.matched.length} padrão(ões) de gatilho.`,
    };
  }

  try {
    const llm = await classifyByLLM(input);
    if (llm) return llm;
  } catch (error) {
    console.error("LegalPerformanceRouter: LLM classification failed:", error);
  }

  if (keyword.score === 1) {
    return {
      useCase: USE_CASES[keyword.useCase],
      confidence: 0.55,
      method: "keyword",
      matchedPatterns: keyword.matched,
      rationale: "Classificação por um único padrão de gatilho.",
    };
  }

  return {
    useCase: USE_CASES[DEFAULT_USE_CASE],
    confidence: 0.4,
    method: "fallback",
    matchedPatterns: [],
    rationale: "Sinal insuficiente; aplicada análise jurídica completa como padrão.",
  };
}

async function classifyByLLM(
  input: ClassificationInput
): Promise<ClassificationResult | null> {
  const model = llmGateway.selectModel("simple");

  const catalog = Object.values(USE_CASES)
    .map((uc) => `- ${uc.id}: ${uc.name} (gatilhos: ${uc.triggerPatterns.join(", ")})`)
    .join("\n");

  const prompt = `Classifique a demanda jurídica abaixo em UM dos use cases do Squad Jurídico Legal Performance.

USE CASES DISPONÍVEIS:
${catalog}

DEMANDA:
${input.text}
${input.documentHints?.length ? `\nDOCUMENTOS: ${input.documentHints.join(", ")}` : ""}

Retorne APENAS JSON: {"useCase": "UC-LP-00X", "confidence": 0.0-1.0, "rationale": "motivo curto"}`;

  const response = await llmGateway.complete({
    model,
    messages: [
      {
        role: "system",
        content:
          "Você é o orquestrador Legal Performance. Classifique demandas jurídicas em use cases. Responda só com JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 200,
  });

  const match = response.content.match(/\{[\s\S]*\}/);
  if (!match) return null;

  const parsed = JSON.parse(match[0]) as {
    useCase?: string;
    confidence?: number;
    rationale?: string;
  };

  const ucId = parsed.useCase as UseCaseId;
  if (!ucId || !USE_CASES[ucId]) return null;

  return {
    useCase: USE_CASES[ucId],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
    method: "llm",
    matchedPatterns: [],
    rationale: parsed.rationale || "Classificação por modelo de linguagem.",
  };
}
