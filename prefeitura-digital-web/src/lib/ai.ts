// Cliente mínimo da API Anthropic (server-side) via fetch — sem SDK para evitar
// acoplamento de versão. Degrada graciosamente quando a chave não está configurada.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export interface GenerateResult {
  text: string;
  model: string;
  degraded: boolean; // true quando gerado sem IA (fallback de template)
  aviso?: string; // motivo da degradação quando a IA falhou (não apenas chave ausente)
}

/**
 * Gera texto com Claude. Degrada graciosamente para o fallback (rascunho do
 * template) com degraded=true em dois casos:
 *  - ANTHROPIC_API_KEY ausente (sem aviso — modo rascunho padrão);
 *  - falha de rede ou resposta não-OK da API (com aviso explicando o motivo).
 * Assim, uma indisponibilidade transitória da IA exibe o rascunho em vez de erro.
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

  try {
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
      return {
        text: opts.fallback,
        model: "fallback",
        degraded: true,
        aviso: `Geração assistida indisponível no momento (IA retornou ${res.status}). Exibindo rascunho do template.`,
      };
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
  } catch {
    return {
      text: opts.fallback,
      model: "fallback",
      degraded: true,
      aviso: "Geração assistida indisponível no momento (falha de conexão com a IA). Exibindo rascunho do template.",
    };
  }
}
