// Cliente mínimo da API Anthropic (server-side) via fetch — sem SDK para evitar
// acoplamento de versão. Degrada graciosamente quando a chave não está configurada.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export interface GenerateResult {
  text: string;
  model: string;
  degraded: boolean; // true quando gerado sem IA (fallback de template)
}

/**
 * Gera texto com Claude. Se ANTHROPIC_API_KEY não estiver definida, retorna o
 * fallback fornecido (rascunho baseado no template) com degraded=true.
 */
export async function generate(opts: {
  system: string;
  prompt: string;
  fallback: string;
  maxTokens?: number;
}): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { text: opts.fallback, model: "fallback", degraded: true };
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? 4096,
      system: opts.system,
      messages: [{ role: "user", content: opts.prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text || "")
    .join("\n")
    .trim();

  return { text: text || opts.fallback, model: DEFAULT_MODEL, degraded: false };
}
