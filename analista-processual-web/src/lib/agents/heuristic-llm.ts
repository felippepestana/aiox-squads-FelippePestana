/**
 * Local heuristic LLM fallback for Brazilian legal document analysis.
 * Works without API keys — extracts structured data via regex and rules.
 * Used when LLM_FALLBACK=heuristic|auto and no paid provider is available,
 * or as last-resort fallback after API failures.
 */

type AgentKind = "navigator" | "extractor" | "calculator" | "risk-mapper" | "summary" | "unknown";

interface HeuristicMessage {
  role: string;
  content: string;
}

const PROCESS_NUMBER_RE =
  /\b(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}|\d{20})\b/g;

const CNPJ_RE = /\b(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})\b/g;
const CPF_RE = /\b(\d{3}\.\d{3}\.\d{3}-\d{2})\b/g;

const MONEY_RE = /R\$\s*([\d.,]+)/gi;

const DATE_BR_RE = /\b(\d{1,2})\s+de\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})\b/gi;
const DATE_SLASH_RE = /\b(\d{2})\/(\d{2})\/(\d{4})\b/g;

const MONTHS: Record<string, string> = {
  janeiro: "01",
  fevereiro: "02",
  março: "03",
  marco: "03",
  abril: "04",
  maio: "05",
  junho: "06",
  julho: "07",
  agosto: "08",
  setembro: "09",
  outubro: "10",
  novembro: "11",
  dezembro: "12",
};

function detectAgentKind(messages: HeuristicMessage[]): AgentKind {
  const text = messages.map((m) => m.content).join("\n").toLowerCase();

  if (text.includes("navegador de arquivos") || text.includes("navigationmap")) {
    return "navigator";
  }
  if (text.includes("extrator de documentos") || text.includes("proceduralrequirements")) {
    return "extractor";
  }
  if (text.includes("calculador de prazos") || text.includes("nextdeadline")) {
    return "calculator";
  }
  if (text.includes("mapeador de riscos") || text.includes("overallriskscore")) {
    return "risk-mapper";
  }
  if (text.includes("resumo executivo")) {
    return "summary";
  }
  return "unknown";
}

function extractDocumentBlock(messages: HeuristicMessage[]): string {
  const user = messages.find((m) => m.role === "user")?.content ?? "";
  const docMarkers = ["DOCUMENTOS:", "DOCUMENTOS A PROCESSAR:", "DOCUMENTOS:\n"];
  for (const marker of docMarkers) {
    const idx = user.indexOf(marker);
    if (idx >= 0) return user.slice(idx);
  }
  return user;
}

function parseFilenames(content: string): string[] {
  const names: string[] = [];
  const re = /---\s*(?:DOCUMENTO:\s*)?([^\n-]+?)\s*(?:\(Tipo:|---)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    names.push(m[1].trim());
  }
  if (names.length === 0) {
    const simple = /---\s*([^\n]+)\s*---/g;
    while ((m = simple.exec(content)) !== null) {
      names.push(m[1].trim());
    }
  }
  return names;
}

function stripDocHeaders(content: string): string {
  return content
    .replace(/---\s*(?:DOCUMENTO:\s*)?[^\n]+(?:\(Tipo:[^)]+\))?\s*---/g, "\n")
    .replace(/---\s*[^\n]+\s*---/g, "\n");
}

function parseMoney(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

function extractMoneyValues(text: string): number[] {
  const values: number[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(MONEY_RE.source, "gi");
  while ((m = re.exec(text)) !== null) {
    values.push(parseMoney(m[1]));
  }
  return values;
}

function toIsoDate(day: string, month: string, year: string): string {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function extractDates(text: string): Array<{ date: string; context: string }> {
  const results: Array<{ date: string; context: string }> = [];
  const seen = new Set<string>();

  let m: RegExpExecArray | null;
  const brRe = new RegExp(DATE_BR_RE.source, "gi");
  while ((m = brRe.exec(text)) !== null) {
    const month = MONTHS[m[2].toLowerCase()] ?? "01";
    const iso = toIsoDate(m[1], month, m[3]);
    if (!seen.has(iso)) {
      seen.add(iso);
      const start = Math.max(0, m.index - 40);
      const end = Math.min(text.length, m.index + m[0].length + 60);
      results.push({ date: iso, context: text.slice(start, end).replace(/\s+/g, " ").trim() });
    }
  }

  const slashRe = new RegExp(DATE_SLASH_RE.source, "g");
  while ((m = slashRe.exec(text)) !== null) {
    const iso = toIsoDate(m[1], m[2], m[3]);
    if (!seen.has(iso)) {
      seen.add(iso);
      const start = Math.max(0, m.index - 40);
      const end = Math.min(text.length, m.index + m[0].length + 60);
      results.push({ date: iso, context: text.slice(start, end).replace(/\s+/g, " ").trim() });
    }
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

function extractProcessNumber(text: string): string | undefined {
  const m = text.match(PROCESS_NUMBER_RE);
  return m?.[0];
}

function extractCourt(text: string): string | undefined {
  const patterns = [
    /(?:COMARCA DE|VARA CÍVEL DA COMARCA DE|VARA CÍVEL DE)\s+([^\n,]+)/i,
    /(?:TRIBUNAL DE JUSTIÇA|TJ\/?)[^\n]*/i,
    /(?:TRF|TJ)[A-Z]{0,2}\s*[-—]?\s*[^\n]+/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim().slice(0, 120);
  }
  return undefined;
}

function extractParties(text: string): Array<{
  name: string;
  role: "author" | "defendant" | "third_party";
  document?: string;
  attorney?: string;
}> {
  const parties: Array<{
    name: string;
    role: "author" | "defendant" | "third_party";
    document?: string;
    attorney?: string;
  }> = [];

  const rolePatterns: Array<{ role: "author" | "defendant"; re: RegExp }> = [
    { role: "author", re: /AUTOR[A]?:\s*([^\n]+)/i },
    { role: "defendant", re: /R[ÉE]U[A]?:\s*([^\n]+)/i },
    { role: "author", re: /REQUERENTE:\s*([^\n]+)/i },
    { role: "defendant", re: /REQUERIDO[A]?:\s*([^\n]+)/i },
  ];

  for (const { role, re } of rolePatterns) {
    const m = text.match(re);
    if (m) {
      let name = m[1].trim();
      name = name.replace(/,.*$/, "").trim();
      if (name.length >= 3) {
        const block = text.slice(m.index ?? 0, (m.index ?? 0) + 400);
        const cnpj = block.match(CNPJ_RE)?.[0];
        const cpf = block.match(CPF_RE)?.[0];
        const oab = block.match(/OAB\/[A-Z]{2}\s*n[º°o.]?\s*[\d.]+/i)?.[0];
        parties.push({
          name: name.slice(0, 200),
          role,
          document: cnpj ?? cpf,
          attorney: oab,
        });
      }
    }
  }

  return parties;
}

function extractClaims(text: string, mainValue?: number): Array<{
  type: string;
  description: string;
  value?: number;
  status: "pending" | "granted" | "denied" | "partial";
}> {
  const claims: Array<{
    type: string;
    description: string;
    value?: number;
    status: "pending" | "granted" | "denied" | "partial";
  }> = [];

  const pedidosIdx = text.search(/DOS PEDIDOS|REQUER(?:E|EM):/i);
  const pedidosBlock = pedidosIdx >= 0 ? text.slice(pedidosIdx) : text;

  const itemRe = /(?:^|\n)\s*[a-z]\)\s*([^\n;]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(pedidosBlock)) !== null) {
    const desc = m[1].trim();
    if (desc.length < 5) continue;
    const money = extractMoneyValues(desc)[0];
    let type = "Pedido";
    if (/citação/i.test(desc)) type = "Citação";
    else if (/condenação|pagamento| cobran/i.test(desc)) type = "Condenação";
    else if (/custas|honorários/i.test(desc)) type = "Custas e honorários";
    else if (/prova|testemunh/i.test(desc)) type = "Produção de provas";

    claims.push({
      type,
      description: desc.slice(0, 500),
      value: money ?? (type === "Condenação" ? mainValue : undefined),
      status: "pending",
    });
  }

  if (claims.length === 0 && mainValue) {
    claims.push({
      type: "Condenação",
      description: "Condenação ao pagamento do valor principal da causa",
      value: mainValue,
      status: "pending",
    });
  }

  return claims.slice(0, 20);
}

function extractProceduralRequirements(text: string): string[] {
  const reqs: string[] = [];
  const patterns = [
    /condenação[^.\n]{0,80}custas processuais[^.\n]*/gi,
    /honorários advocatícios[^.\n]*/gi,
    /art\.\s*\d+[^.\n]{0,60}CPC[^.\n]*/gi,
    /art\.\s*\d+[^.\n]{0,60}Código Civil[^.\n]*/gi,
    /depósito[^.\n]{0,60}caução[^.\n]*/gi,
  ];
  for (const p of patterns) {
    let m: RegExpExecArray | null;
    while ((m = p.exec(text)) !== null) {
      const s = m[0].trim();
      if (s.length > 10 && !reqs.includes(s)) reqs.push(s.slice(0, 500));
    }
  }
  return reqs.slice(0, 10);
}

function extractDocuments(text: string): Array<{ type: string; description: string; date?: string }> {
  const docs: Array<{ type: string; description: string; date?: string }> = [];
  const patterns = [
    { type: "contrato", re: /contrato[^.\n]{0,80}/gi },
    { type: "nota fiscal", re: /nota fiscal[^.\n]{0,60}/gi },
    { type: "comprovante", re: /(?:recibo|comprovante)[^.\n]{0,60}/gi },
    { type: "notificação", re: /notifica(?:ção|cao)[^.\n]{0,60}/gi },
  ];
  for (const { type, re } of patterns) {
    const m = text.match(re);
    if (m) {
      docs.push({ type, description: m[0].trim().slice(0, 200) });
    }
  }
  return docs.slice(0, 20);
}

function buildTimeline(text: string): Array<{
  date: string;
  description: string;
  type: "filing" | "decision" | "hearing" | "motion" | "other";
}> {
  const dates = extractDates(text);
  return dates.map(({ date, context }) => {
    let type: "filing" | "decision" | "hearing" | "motion" | "other" = "other";
    const ctx = context.toLowerCase();
    if (/petição|inicial|ajuiz|distribui/i.test(ctx)) type = "filing";
    else if (/sentença|decisão|despacho/i.test(ctx)) type = "decision";
    else if (/audiência/i.test(ctx)) type = "hearing";
    else if (/contestação|recurso|agravo|apelação/i.test(ctx)) type = "motion";
    else if (/celebraram|contrato|entreg|notifica|venc/i.test(ctx)) type = "other";

    return {
      date,
      description: context.slice(0, 200),
      type,
    };
  });
}

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyFromDays(days: number): "low" | "medium" | "high" | "critical" {
  if (days <= 3) return "critical";
  if (days <= 7) return "high";
  if (days <= 15) return "medium";
  return "low";
}

function generateNavigator(docBlock: string, filenames: string[]): string {
  const body = stripDocHeaders(docBlock);
  const processNumber = extractProcessNumber(body);
  const court = extractCourt(body);
  const parties = extractParties(body).map((p) => p.name);
  const primary = filenames[0] ?? "documento-principal";

  const sections: string[] = [];
  if (/DOS FATOS/i.test(body)) sections.push("Dos Fatos");
  if (/DO DIREITO/i.test(body)) sections.push("Do Direito");
  if (/DOS PEDIDOS/i.test(body)) sections.push("Dos Pedidos");

  const keyElements: string[] = [];
  if (processNumber) keyElements.push(`Processo ${processNumber}`);
  if (parties.length) keyElements.push(`${parties.length} partes identificadas`);
  const money = extractMoneyValues(body);
  if (money.length) keyElements.push(`Valor: R$ ${money[0].toLocaleString("pt-BR")}`);

  const structure = filenames.length
    ? filenames.map((fn) => ({
        filename: fn,
        pageCount: Math.max(1, Math.ceil(body.length / 3000)),
        sections: sections.length ? sections : ["Conteúdo principal"],
        keyElements: keyElements.length ? keyElements : ["Documento processual"],
      }))
    : [
        {
          filename: primary,
          pageCount: Math.max(1, Math.ceil(body.length / 3000)),
          sections: sections.length ? sections : ["Conteúdo principal"],
          keyElements: keyElements.length ? keyElements : ["Documento processual"],
        },
      ];

  return JSON.stringify({
    indexed: body.trim().length > 50,
    documentStructure: structure,
    navigationMap: {
      primaryDocument: primary,
      supportingDocuments: filenames.slice(1),
      order: filenames.length ? filenames : [primary],
    },
    metadata: {
      processNumber,
      court,
      parties: parties.length ? parties : undefined,
    },
  });
}

function generateExtractor(docBlock: string): string {
  const body = stripDocHeaders(docBlock);
  const parties = extractParties(body);
  const money = extractMoneyValues(body);
  const mainValue = money.length ? Math.max(...money) : undefined;
  const timeline = buildTimeline(body);
  const claims = extractClaims(body, mainValue);
  const documents = extractDocuments(body);
  const proceduralRequirements = extractProceduralRequirements(body);

  return JSON.stringify({
    success: body.trim().length > 50 && (parties.length > 0 || timeline.length > 0),
    parties,
    timeline,
    claims,
    documents,
    proceduralRequirements,
  });
}

function generateCalculator(messages: HeuristicMessage[]): string {
  const user = messages.find((m) => m.role === "user")?.content ?? "";
  const timelineBlock = user.match(/EVENTOS PROCESSUAIS:([\s\S]*?)(?:REQUISITOS|$)/i)?.[1] ?? "";
  const dates = extractDates(timelineBlock || user);
  const lastDate = dates.length ? new Date(dates[dates.length - 1].date) : new Date();
  const now = new Date();

  const contestacaoDue = addBusinessDays(lastDate, 15);
  const daysRemaining = Math.max(0, daysBetween(now, contestacaoDue));

  const deadlines = [
    {
      description: "Prazo para contestação (estimado)",
      legalBasis: "CPC art. 335",
      dueDate: formatDate(contestacaoDue),
      businessDays: 15,
      calendarDays: daysBetween(lastDate, contestacaoDue),
      urgency: urgencyFromDays(daysRemaining),
      isAutomatic: true,
    },
  ];

  if (dates.length > 1) {
    const replicaDue = addBusinessDays(contestacaoDue, 15);
    deadlines.push({
      description: "Prazo para réplica (estimado, se houver contestação)",
      legalBasis: "CPC art. 350",
      dueDate: formatDate(replicaDue),
      businessDays: 15,
      calendarDays: daysBetween(contestacaoDue, replicaDue),
      urgency: "medium" as const,
      isAutomatic: false,
    });
  }

  const next = deadlines[0];

  return JSON.stringify({
    deadlines,
    nextDeadline: {
      description: next.description,
      dueDate: next.dueDate,
      daysRemaining,
      urgency: urgencyFromDays(daysRemaining),
    },
    criticalPath: dates.slice(-3).map((d) => d.context.slice(0, 80)),
    warnings: [
      "Prazos calculados por heurística local (modo demo). Valide com advogado responsável.",
    ],
  });
}

function generateRiskMapper(messages: HeuristicMessage[]): string {
  const user = messages.find((m) => m.role === "user")?.content ?? "";
  const hasPendingClaims = /status\):\s*pending|pendente/i.test(user) || /Condenação/i.test(user);
  const hasMultipleParties = (user.match(/\(author\)|\(defendant\)/gi) ?? []).length >= 2;
  const valueMatch = user.match(/R\$\s*([\d.,]+)/);
  const value = valueMatch ? parseMoney(valueMatch[1]) : 0;

  const risks: Array<{
    id: string;
    category: "probatory" | "procedural" | "substantive" | "economic" | "tactical";
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: "low" | "medium" | "high";
    mitigation: string;
    opportunity?: string;
  }> = [
    {
      id: "R001",
      category: "economic",
      title: "Exposição financeira da causa",
      description: value
        ? `Valor envolvido estimado em R$ ${value.toLocaleString("pt-BR")}.`
        : "Valor da causa não identificado com precisão.",
      severity: value > 100000 ? "high" : "medium",
      probability: 0.6,
      impact: value > 50000 ? "high" : "medium",
      mitigation: "Quantificar atualização monetária, juros e custas antes de proposta de acordo.",
    },
    {
      id: "R002",
      category: "procedural",
      title: "Risco de preclusão de prazos",
      description: "Prazos processuais dependem de contagem correta em dias úteis.",
      severity: "high",
      probability: 0.4,
      impact: "high",
      mitigation: "Monitorar prazos de contestação, réplica e recursos no sistema do tribunal.",
    },
  ];

  if (hasPendingClaims) {
    risks.push({
      id: "R003",
      category: "substantive",
      title: "Pedidos ainda pendentes de decisão",
      description: "Há pedidos sem status de procedência/defereimento identificado.",
      severity: "medium",
      probability: 0.5,
      impact: "medium",
      mitigation: "Mapear provas necessárias para cada pedido pendente.",
    });
  }

  const score = Math.min(85, 35 + risks.length * 12 + (value > 100000 ? 15 : 0));

  return JSON.stringify({
    risks,
    overallRiskScore: score,
    riskTrend: "stable",
    summary: {
      strengths: hasMultipleParties
        ? ["Partes identificadas com clareza nos autos"]
        : ["Documento indexado para análise"],
      weaknesses: [
        "Análise gerada por heurística local — revisão humana obrigatória",
      ],
      opportunities: [
        "Possibilidade de acordo extrajudicial antes de decisão de mérito",
      ],
      threats: [
        "Inadimplemento prolongado pode aumentar juros e correção",
      ],
    },
    recommendations: [
      {
        priority: "high",
        action: "Validar prazos processuais no calendário forense",
        rationale: "Evitar preclusão e perda de oportunidades recursais",
        timeline: "Imediato",
      },
      {
        priority: "medium",
        action: "Revisar provas documentais citadas na petição",
        rationale: "Fortalecer posição probatória nos pedidos principais",
        timeline: "7 dias",
      },
    ],
  });
}

function generateSummary(messages: HeuristicMessage[]): string {
  const user = messages.find((m) => m.role === "user")?.content ?? "";
  const processType = user.match(/TIPO DE PROCESSO:\s*([^\n]+)/i)?.[1]?.trim() ?? "Civil";

  const partiesSection = user.match(/2\. PARTES IDENTIFICADAS:([\s\S]*?)(?:\n\d+\.|$)/i)?.[1] ?? "";
  const parties = [...partiesSection.matchAll(/-\s*([^\n]+)/g)].map((m) => m[1].trim());

  const risksSection = user.match(/5\. RISCOS IDENTIFICADOS:([\s\S]*?)(?:\n\d+\.|$)/i)?.[1] ?? "";
  const risks = [...risksSection.matchAll(/-\s*([^(]+)\s*\(/g)].map((m) => m[1].trim());

  const p1 =
    `Análise processual (${processType}) concluída em modo heurístico local — sem uso de API externa de LLM. ` +
    `O documento foi indexado e os dados estruturados extraídos por regras determinísticas. ` +
    `Esta versão é adequada para demonstração e triagem inicial, mas não substitui parecer jurídico.`;

  const p2 =
    parties.length > 0
      ? `Partes identificadas: ${parties.join("; ")}. `
      : "As partes processuais foram parcialmente identificadas a partir do texto. ";
  const p3 =
    risks.length > 0
      ? `Principais riscos mapeados: ${risks.slice(0, 3).join("; ")}. `
      : "Riscos procedimentais e econômicos foram estimados com base no conteúdo disponível. ";
  const p4 =
    "Recomenda-se validar prazos no calendário do tribunal, conferir provas documentais citadas " +
    "e, quando possível, repetir a análise com um provedor LLM configurado para maior profundidade.";

  return [p1, p2 + p3, p4].join("\n\n");
}

/**
 * Generates a heuristic response mimicking LLM output for the multi-agent pipeline.
 */
export function generateHeuristicResponse(
  messages: HeuristicMessage[]
): { content: string; promptTokens: number; completionTokens: number } {
  const kind = detectAgentKind(messages);
  const docBlock = extractDocumentBlock(messages);
  const filenames = parseFilenames(docBlock);
  const inputLen = messages.map((m) => m.content).join("").length;

  let content: string;
  switch (kind) {
    case "navigator":
      content = generateNavigator(docBlock, filenames);
      break;
    case "extractor":
      content = generateExtractor(docBlock);
      break;
    case "calculator":
      content = generateCalculator(messages);
      break;
    case "risk-mapper":
      content = generateRiskMapper(messages);
      break;
    case "summary":
      content = generateSummary(messages);
      break;
    default:
      content = JSON.stringify({ note: "heuristic fallback", indexed: false });
  }

  return {
    content,
    promptTokens: Math.ceil(inputLen / 4),
    completionTokens: Math.ceil(content.length / 4),
  };
}

export function isHeuristicFallbackEnabled(): boolean {
  const mode = (process.env.LLM_FALLBACK ?? "auto").toLowerCase();
  return mode === "auto" || mode === "heuristic";
}

export const HEURISTIC_MODEL_ID = "heuristic-local";
