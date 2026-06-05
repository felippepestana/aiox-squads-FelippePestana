import type {
  MuralBrief,
  MuralComposeRequest,
  ReferenceAnalysis,
} from "./types.js";

export function validateComposeRequest(req: MuralComposeRequest): string | null {
  if (!req.prompt?.trim()) return "Campo prompt é obrigatório";
  if (!Array.isArray(req.references) || req.references.length === 0) {
    return "Pelo menos uma imagem de referência é obrigatória";
  }
  const hasIdentity = req.references.some((r) => r.role === "identity");
  if (!hasIdentity) {
    return "É obrigatória ao menos uma referência com papel identity";
  }
  for (const ref of req.references) {
    if (!ref.id?.trim()) return "Cada referência precisa de id";
    if (!ref.dataBase64?.trim()) return `Referência ${ref.id}: dataBase64 vazio`;
    if (!ref.mimeType?.startsWith("image/")) {
      return `Referência ${ref.id}: mimeType deve ser image/*`;
    }
  }
  return null;
}

export function buildBrief(
  request: MuralComposeRequest,
  analyses: ReferenceAnalysis[]
): MuralBrief {
  const identity = analyses.filter((a) => a.role === "identity");
  const scene = analyses.filter((a) => a.role !== "identity");

  const identityLock: string[] = [];
  for (const a of identity) {
    identityLock.push(...a.traits);
    if (a.summary) identityLock.push(a.summary);
  }

  const sceneParts: string[] = [];
  for (const a of scene) {
    if (a.summary) sceneParts.push(`${a.role}: ${a.summary}`);
    sceneParts.push(...a.traits.map((t) => `${a.role} — ${t}`));
  }

  const sceneSpec =
    sceneParts.length > 0
      ? sceneParts.join(". ")
      : "Cena derivada exclusivamente do prompt do usuário.";

  const identityBlock =
    identityLock.length > 0
      ? `Preserve fielmente a identidade: ${identityLock.slice(0, 12).join("; ")}.`
      : "Preserve coerência visual da referência de identidade.";

  const generationPrompt = [
    "Crie uma imagem fotorealista de alta qualidade.",
    request.prompt.trim(),
    identityBlock,
    `Ambiente e cena: ${sceneSpec}`,
    "Não altere etnia, gênero ou idade aparente sem instrução explícita.",
    "Evite texto ilegível, membros duplicados ou artefatos de IA.",
  ].join(" ");

  const negativeConstraints = [
    "Sem distorção facial",
    "Sem texto watermark",
    "Sem anatomia incorreta",
    "Sem mudança não solicitada de identidade",
  ];

  const qualityChecks = [
    "Identidade reconhecível em relação à referência identity",
    "Cena coerente com ambiente, atividade e pose das referências",
    "Iluminação e composição harmoniosas",
    "Sem artefatos visíveis (dedos, olhos, bordas)",
  ];

  return {
    userPrompt: request.prompt.trim(),
    identityLock: [...new Set(identityLock)].slice(0, 20),
    sceneSpec,
    generationPrompt,
    negativeConstraints,
    qualityChecks,
    referenceAnalyses: analyses,
  };
}
