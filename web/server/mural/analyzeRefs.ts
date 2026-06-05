import Anthropic from "@anthropic-ai/sdk";
import type { MuralComposeRequest, ReferenceAnalysis } from "./types.js";
import { isImageRole } from "./types.js";
import { isMuralDemoMode, synthesizeAnalyses } from "./demo.js";

function stripDataUrl(b64: string): string {
  const idx = b64.indexOf(",");
  return idx >= 0 ? b64.slice(idx + 1) : b64;
}

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    identity: "identidade pessoal (rosto, traços, expressão)",
    environment: "ambiente e cenário",
    activity: "atividade e contexto de ação",
    body_pose: "corpo, pose e físico",
    style: "estilo visual, iluminação e paleta",
    location: "local e geografia",
  };
  return labels[role] ?? role;
}

export async function analyzeReferences(
  anthropic: Anthropic | null,
  request: MuralComposeRequest
): Promise<ReferenceAnalysis[]> {
  for (const ref of request.references) {
    if (!isImageRole(ref.role)) {
      throw new Error(`Papel inválido: ${ref.role}`);
    }
  }

  if (!anthropic || isMuralDemoMode()) {
    return synthesizeAnalyses(request);
  }

  const results: ReferenceAnalysis[] = [];

  for (const ref of request.references) {
    const mediaType = ref.mimeType.startsWith("image/")
      ? (ref.mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp")
      : "image/jpeg";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: stripDataUrl(ref.dataBase64),
              },
            },
            {
              type: "text",
              text: `Analise esta imagem de referência para composição criativa.
Papel atribuído: ${ref.role} (${roleLabel(ref.role)}).
Prompt do usuário para a cena final: ${request.prompt}

Responda APENAS com JSON válido (sem markdown):
{
  "traits": ["lista de traços visuais observáveis"],
  "visualTokens": { "chave": "valor curto" },
  "summary": "parágrafo curto em português"
}`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "{}";
    let parsed: {
      traits?: string[];
      visualTokens?: Record<string, string>;
      summary?: string;
    };
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      parsed = JSON.parse(cleaned) as typeof parsed;
    } catch {
      parsed = {
        traits: [raw.slice(0, 500)],
        visualTokens: {},
        summary: raw.slice(0, 300),
      };
    }

    results.push({
      refId: ref.id,
      role: ref.role,
      traits: Array.isArray(parsed.traits) ? parsed.traits : [],
      visualTokens:
        parsed.visualTokens && typeof parsed.visualTokens === "object"
          ? parsed.visualTokens
          : {},
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
    });
  }

  return results;
}
