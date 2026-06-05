import type {
  MuralBrief,
  MuralComposeRequest,
  MuralReferenceInput,
  ReferenceAnalysis,
} from "./types.js";

export function isMuralDemoMode(): boolean {
  const flag = process.env.MURAL_DEMO_MODE?.trim();
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  // Auto-enable when no generation key is configured.
  const hasGemini =
    !!process.env.GOOGLE_API_KEY?.trim() || !!process.env.GEMINI_API_KEY?.trim();
  return !hasGemini;
}

const ROLE_HINTS: Record<string, { traits: string[]; tokens: Record<string, string> }> = {
  identity: {
    traits: ["rosto reconhecível", "expressão característica", "tom de pele preservado"],
    tokens: { foco: "identidade", preservar: "alto" },
  },
  environment: {
    traits: ["cenário definido", "iluminação ambiente", "elementos de fundo"],
    tokens: { foco: "ambiente" },
  },
  activity: {
    traits: ["ação em movimento", "contexto de atividade"],
    tokens: { foco: "atividade" },
  },
  body_pose: {
    traits: ["postura corporal", "físico de referência"],
    tokens: { foco: "corpo/pose" },
  },
  style: {
    traits: ["paleta de cores", "estética fotográfica"],
    tokens: { foco: "estilo" },
  },
  location: {
    traits: ["geografia reconhecível", "arquitetura local"],
    tokens: { foco: "local" },
  },
};

export function synthesizeAnalyses(
  request: MuralComposeRequest
): ReferenceAnalysis[] {
  return request.references.map((ref) => {
    const hint = ROLE_HINTS[ref.role] ?? {
      traits: ["referência visual"],
      tokens: {},
    };
    return {
      refId: ref.id,
      role: ref.role,
      traits: hint.traits,
      visualTokens: hint.tokens,
      summary: `Referência ${ref.id} (${ref.role}) interpretada em modo demo a partir do papel atribuído.`,
    };
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

const ROLE_COLORS: Record<string, string> = {
  identity: "#f472b6",
  environment: "#34d399",
  activity: "#60a5fa",
  body_pose: "#fbbf24",
  style: "#a78bfa",
  location: "#22d3ee",
};

export function buildDemoSvg(
  brief: MuralBrief,
  references: MuralReferenceInput[],
  variantIndex: number,
  variantCount: number
): Buffer {
  const W = 1024;
  const H = 576;

  const promptLines = wrap(brief.userPrompt, 46).slice(0, 3);
  const identity = brief.identityLock.slice(0, 4);
  const sceneLines = wrap(brief.sceneSpec, 60).slice(0, 3);

  const chipW = 150;
  const chips = references
    .map((ref, i) => {
      const x = 60 + (i % 6) * (chipW + 12);
      const y = 430 + Math.floor(i / 6) * 56;
      const color = ROLE_COLORS[ref.role] ?? "#94a3b8";
      return `
    <g>
      <rect x="${x}" y="${y}" width="${chipW}" height="42" rx="10" fill="${color}" opacity="0.18" stroke="${color}" stroke-width="1.5"/>
      <circle cx="${x + 18}" cy="${y + 21}" r="6" fill="${color}"/>
      <text x="${x + 34}" y="${y + 19}" font-family="Inter, Arial, sans-serif" font-size="13" fill="#e2e8f0">${escapeXml(ref.role)}</text>
      <text x="${x + 34}" y="${y + 34}" font-family="Inter, Arial, sans-serif" font-size="11" fill="#94a3b8">${escapeXml(ref.id)}</text>
    </g>`;
    })
    .join("");

  const identityText = identity
    .map(
      (t, i) =>
        `<text x="60" y="${250 + i * 24}" font-family="Inter, Arial, sans-serif" font-size="15" fill="#fbcfe8">• ${escapeXml(t.slice(0, 70))}</text>`
    )
    .join("");

  const sceneText = sceneLines
    .map(
      (t, i) =>
        `<text x="540" y="${250 + i * 24}" font-family="Inter, Arial, sans-serif" font-size="15" fill="#bbf7d0">${escapeXml(t)}</text>`
    )
    .join("");

  const promptText = promptLines
    .map(
      (t, i) =>
        `<text x="60" y="${120 + i * 34}" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700" fill="#f8fafc">${escapeXml(t)}</text>`
    )
    .join("");

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="0.5" stop-color="#1e1b4b"/>
      <stop offset="1" stop-color="#0b1120"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="18" fill="none" stroke="#334155" stroke-width="1.5"/>
  <text x="60" y="64" font-family="Inter, Arial, sans-serif" font-size="18" letter-spacing="3" fill="#818cf8">MURAL DA VIDA EXTRAORDINÁRIA</text>
  <text x="${W - 60}" y="64" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="14" fill="#64748b">variante ${variantIndex + 1}/${variantCount} · modo demo</text>
  ${promptText}
  <line x1="60" y1="180" x2="${W - 60}" y2="180" stroke="#334155" stroke-width="1"/>
  <text x="60" y="218" font-family="Inter, Arial, sans-serif" font-size="14" letter-spacing="2" fill="#f472b6">IDENTITY LOCK</text>
  <text x="540" y="218" font-family="Inter, Arial, sans-serif" font-size="14" letter-spacing="2" fill="#34d399">CENA</text>
  ${identityText}
  ${sceneText}
  <text x="60" y="408" font-family="Inter, Arial, sans-serif" font-size="14" letter-spacing="2" fill="#94a3b8">REFERÊNCIAS</text>
  ${chips}
</svg>`,
    "utf8"
  );
}
