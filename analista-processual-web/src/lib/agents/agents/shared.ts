import { llmGateway } from "../llm-gateway";
import type { TaskComplexity } from "../llm-gateway";

/**
 * A traceable source backing any conclusion, per DESIGN_GUIDE principle
 * "Confiança antes de estética": every output must show where it came from.
 */
export interface TraceableSource {
  kind: "peça" | "lei" | "jurisprudência" | "norma" | "evidência" | "inferência";
  reference: string;
  detail?: string;
  date?: string;
  reliability: "alta" | "média" | "baixa";
}

/** Runs an LLM prompt and parses a JSON object from the response, with fallback. */
export async function runJsonAgent<T>(opts: {
  complexity: TaskComplexity;
  system: string;
  prompt: string;
  fallback: T;
  temperature?: number;
  maxTokens?: number;
}): Promise<T> {
  const model = llmGateway.selectModel(opts.complexity);
  try {
    const response = await llmGateway.complete({
      model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.prompt },
      ],
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 2000,
    });
    const match = response.content.match(/\{[\s\S]*\}/);
    if (!match) return opts.fallback;
    return { ...opts.fallback, ...(JSON.parse(match[0]) as Partial<T>) } as T;
  } catch (error) {
    console.error("runJsonAgent error:", error);
    return opts.fallback;
  }
}
