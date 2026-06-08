/**
 * Court-data gateway: pluggable access to official Brazilian Judiciary data
 * sources, mirroring the design of the LLM gateway (provider selection by
 * configuration, graceful degradation).
 *
 * Phase 1 ships the DATAJUD provider (public metadata). Future providers
 * (DJEN, MNI, PDPJ, MCP) implement the same `CourtDataProvider` contract — see
 * docs/integracao-cnj-planejamento.md.
 */

import {
  fetchProcessByNumber,
  isDatajudConfigured,
  type DatajudProcess,
} from "./datajud";
import { parseCnjNumber, CnjNumberError, type ParsedCnjNumber } from "./tribunais";

export type CourtDataSource = "datajud" | "djen" | "mni" | "pdpj" | "mcp";

export interface NormalizedProcess {
  source: CourtDataSource;
  numeroProcesso: string;
  formattedNumber: string;
  tribunalSigla: string;
  tribunalName: string;
  court: string | null;
  processClass: string | null;
  subjects: string[];
  grau: string | null;
  filedAt: string | null;
  lastUpdate: string | null;
  movements: Array<{ code: number | null; description: string; date: string | null }>;
  parties: Array<{ name: string; role?: string; document?: string }>;
  raw: Record<string, unknown>;
}

export interface CourtDataProvider {
  readonly source: CourtDataSource;
  isConfigured(): boolean;
  fetchByNumber(
    cnjNumber: string,
    options?: { signal?: AbortSignal; timeoutMs?: number }
  ): Promise<NormalizedProcess | null>;
}

function normalizeDatajud(p: DatajudProcess): NormalizedProcess {
  return {
    source: "datajud",
    numeroProcesso: p.numeroProcesso,
    formattedNumber: p.numeroProcesso,
    tribunalSigla: p.tribunal,
    tribunalName: p.tribunalName,
    court: p.orgaoJulgador ?? p.tribunalName,
    processClass: p.classeNome,
    subjects: p.assuntos.map((a) => a.nome).filter(Boolean),
    grau: p.grau,
    filedAt: p.dataAjuizamento,
    lastUpdate: p.ultimaAtualizacao,
    movements: p.movimentos,
    parties: p.partes,
    raw: p.raw,
  };
}

class DatajudProvider implements CourtDataProvider {
  readonly source = "datajud" as const;

  isConfigured(): boolean {
    return isDatajudConfigured();
  }

  async fetchByNumber(
    cnjNumber: string,
    options?: { signal?: AbortSignal; timeoutMs?: number }
  ): Promise<NormalizedProcess | null> {
    const process = await fetchProcessByNumber(cnjNumber, options);
    return process ? normalizeDatajud(process) : null;
  }
}

class CourtDataGateway {
  private providers: CourtDataProvider[] = [new DatajudProvider()];

  /** True when at least one court-data provider is configured. */
  isConfigured(): boolean {
    return this.providers.some((p) => p.isConfigured());
  }

  /** Validates a CNJ number and returns its parsed fields (throws on error). */
  parseNumber(cnjNumber: string): ParsedCnjNumber {
    return parseCnjNumber(cnjNumber);
  }

  /**
   * Fetches a process from the first configured provider that returns data.
   * Returns null when no provider has the process.
   */
  async fetchByNumber(
    cnjNumber: string,
    options?: { source?: CourtDataSource; signal?: AbortSignal; timeoutMs?: number }
  ): Promise<NormalizedProcess | null> {
    const candidates = options?.source
      ? this.providers.filter((p) => p.source === options.source)
      : this.providers;

    const configured = candidates.filter((p) => p.isConfigured());
    if (configured.length === 0) {
      throw new CnjNumberError(
        "Nenhuma fonte de dados processuais configurada. Defina DATAJUD_API_KEY para consultar processos por número."
      );
    }

    let lastError: unknown = null;
    for (const provider of configured) {
      try {
        const result = await provider.fetchByNumber(cnjNumber, options);
        if (result) return result;
      } catch (error) {
        lastError = error;
      }
    }
    if (lastError) throw lastError;
    return null;
  }
}

export const courtDataGateway = new CourtDataGateway();

/**
 * Renders a normalized process as plain text suitable for the multi-agent
 * pipeline (navigator/extractor expect document content). This lets official
 * metadata flow through the exact same analysis pipeline as uploaded files.
 */
export function processToDocumentText(p: NormalizedProcess): string {
  const lines: string[] = [];
  lines.push(`PROCESSO Nº ${p.formattedNumber}`);
  lines.push(`TRIBUNAL: ${p.tribunalName} (${p.tribunalSigla.toUpperCase()})`);
  if (p.court) lines.push(`ÓRGÃO JULGADOR: ${p.court}`);
  if (p.grau) lines.push(`GRAU: ${p.grau}`);
  if (p.processClass) lines.push(`CLASSE: ${p.processClass}`);
  if (p.subjects.length) lines.push(`ASSUNTOS: ${p.subjects.join("; ")}`);
  if (p.filedAt) lines.push(`DATA DE AJUIZAMENTO: ${p.filedAt}`);
  lines.push(`FONTE: ${p.source.toUpperCase()} (metadados oficiais)`);

  if (p.parties.length) {
    lines.push("");
    lines.push("PARTES:");
    for (const party of p.parties) {
      lines.push(
        `- ${party.name}${party.role ? ` (${party.role})` : ""}${
          party.document ? ` — ${party.document}` : ""
        }`
      );
    }
  }

  if (p.movements.length) {
    lines.push("");
    lines.push("MOVIMENTAÇÕES PROCESSUAIS:");
    for (const m of p.movements) {
      const date = m.date ? m.date.slice(0, 10) : "sem data";
      lines.push(`- ${date}: ${m.description}${m.code ? ` [TPU ${m.code}]` : ""}`);
    }
  }

  return lines.join("\n");
}
