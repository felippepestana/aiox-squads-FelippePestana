import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import type { MuralBrief, MuralReferenceInput } from "./types.js";

function getGeminiApiKey(): string {
  const key =
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    "";
  if (!key) {
    throw new Error(
      "GOOGLE_API_KEY ou GEMINI_API_KEY não definida (necessária para geração)"
    );
  }
  return key;
}

function geminiModelName(): string {
  return (
    process.env.MURAL_GEMINI_MODEL?.trim() || "gemini-2.0-flash-preview-image-generation"
  );
}

function stripDataUrl(b64: string): string {
  const idx = b64.indexOf(",");
  return idx >= 0 ? b64.slice(idx + 1) : b64;
}

function buildParts(
  brief: MuralBrief,
  references: MuralReferenceInput[]
): Part[] {
  const parts: Part[] = [
    {
      text: `${brief.generationPrompt}\n\nRestrições: ${brief.negativeConstraints.join("; ")}`,
    },
  ];

  for (const ref of references) {
    parts.push({
      inlineData: {
        mimeType: ref.mimeType,
        data: stripDataUrl(ref.dataBase64),
      },
    });
    parts.push({
      text: `[Referência ${ref.id} — papel: ${ref.role}]`,
    });
  }

  return parts;
}

function extractImageBuffers(response: {
  candidates?: Array<{
    content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
  }>;
}): Array<{ buffer: Buffer; mimeType: string }> {
  const out: Array<{ buffer: Buffer; mimeType: string }> = [];
  for (const candidate of response.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.inlineData?.data) {
        out.push({
          buffer: Buffer.from(part.inlineData.data, "base64"),
          mimeType: part.inlineData.mimeType ?? "image/png",
        });
      }
    }
  }
  return out;
}

export async function generateMuralImages(
  brief: MuralBrief,
  references: MuralReferenceInput[],
  variantCount: number
): Promise<Array<{ buffer: Buffer; mimeType: string }>> {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  const model = genAI.getGenerativeModel({
    model: geminiModelName(),
    generationConfig: {
      // @ts-expect-error responseModalities supported on image models
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = buildParts(brief, references);
  const count = Math.min(Math.max(variantCount, 1), 4);
  const all: Array<{ buffer: Buffer; mimeType: string }> = [];

  for (let i = 0; i < count; i++) {
    const variantParts: Part[] = [
      ...parts,
      {
        text:
          count > 1
            ? `Variante ${i + 1} de ${count}: interprete levemente a composição mantendo identity_lock.`
            : "",
      },
    ].filter((p) => !("text" in p && p.text === ""));

    const result = await model.generateContent(variantParts);
    const response = result.response;
    const images = extractImageBuffers(response);

    if (images.length === 0) {
      const text = response.text?.() ?? "";
      throw new Error(
        `Gemini não retornou imagem (variante ${i + 1}). Resposta: ${text.slice(0, 200)}`
      );
    }
    all.push(images[0]);
  }

  return all;
}
