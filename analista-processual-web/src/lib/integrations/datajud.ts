/**
 * DATAJUD public-API client (CNJ — Base Nacional de Dados do Poder Judiciário).
 *
 * REST over Elasticsearch. Read-only metadata: case cover ("capa") and
 * movements ("movimentos", TPU codes). No documents/peças (see MNI/PDPJ in the
 * integration plan). Endpoint per tribunal:
 *   https://api-publica.datajud.cnj.jus.br/api_publica_{alias}/_search
 *
 * Auth: header `Authorization: APIKey <DATAJUD_API_KEY>` (public, free key from
 * datajud-wiki.cnj.jus.br). Disabled gracefully when the key is absent.
 */

import { parseCnjNumber, type ParsedCnjNumber } from "./tribunais";

const DEFAULT_BASE_URL = "https://api-publica.datajud.cnj.jus.br";

export interface DatajudMovement {
  code: number | null;
  description: string;
  date: string | null;
}

export interface DatajudParty {
  name: string;
  role?: string;
  document?: string;
}

export interface DatajudProcess {
  numeroProcesso: string;
  tribunal: string;
  tribunalName: string;
  classeCodigo: number | null;
  classeNome: string | null;
  assuntos: Array<{ codigo: number | null; nome: string }>;
  orgaoJulgador: string | null;
  grau: string | null;
  dataAjuizamento: string | null;
  ultimaAtualizacao: string | null;
  movimentos: DatajudMovement[];
  partes: DatajudParty[];
  /** The raw Elasticsearch `_source` for debugging/export. */
  raw: Record<string, unknown>;
}

export class DatajudError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "DatajudError";
  }
}

/** True when a DATAJUD API key is configured. */
export function isDatajudConfigured(): boolean {
  return Boolean(process.env.DATAJUD_API_KEY);
}

function getConfig() {
  const apiKey = process.env.DATAJUD_API_KEY;
  if (!apiKey) {
    throw new DatajudError(
      "DATAJUD_API_KEY não configurada. Defina a chave pública do DATAJUD (datajud-wiki.cnj.jus.br) para consultar processos."
    );
  }
  const baseUrl = (process.env.DATAJUD_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  return { apiKey, baseUrl };
}

function toArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value == null) return [];
  return [value as T];
}

function str(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function mapMovements(source: Record<string, unknown>): DatajudMovement[] {
  const raw = toArray<Record<string, unknown>>(source.movimentos);
  return raw
    .map((m) => ({
      code: num(m.codigo),
      description:
        str(m.nome) ??
        str((m.complementosTabelados as Record<string, unknown>[] | undefined)?.[0]?.nome) ??
        "Movimento",
      date: str(m.dataHora),
    }))
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return da - db;
    });
}

function mapParties(source: Record<string, unknown>): DatajudParty[] {
  // DATAJUD schemas vary; "partes"/"poloAtivo"/"poloPassivo" may or may not be
  // present and are often suppressed for privacy. Extract defensively.
  const parties: DatajudParty[] = [];
  const polos = [
    ...toArray<Record<string, unknown>>(source.partes),
    ...toArray<Record<string, unknown>>(source.poloAtivo),
    ...toArray<Record<string, unknown>>(source.poloPassivo),
  ];
  for (const p of polos) {
    const name = str(p.nome) ?? str((p.pessoa as Record<string, unknown>)?.nome);
    if (!name) continue;
    parties.push({
      name,
      role: str(p.polo) ?? str(p.tipoParte) ?? undefined,
      document:
        str(p.documento) ??
        str((p.pessoa as Record<string, unknown>)?.numeroDocumentoPrincipal) ??
        undefined,
    });
  }
  return parties;
}

function mapProcess(
  source: Record<string, unknown>,
  parsed: ParsedCnjNumber
): DatajudProcess {
  const classe = (source.classe as Record<string, unknown>) ?? {};
  const orgao = (source.orgaoJulgador as Record<string, unknown>) ?? {};
  const assuntos = toArray<Record<string, unknown>>(source.assuntos).map((a) => ({
    codigo: num(a.codigo),
    nome: str(a.nome) ?? "Assunto não informado",
  }));

  return {
    numeroProcesso: str(source.numeroProcesso) ?? parsed.digits,
    tribunal: parsed.datajudAlias,
    tribunalName: parsed.tribunalName,
    classeCodigo: num(classe.codigo),
    classeNome: str(classe.nome),
    assuntos,
    orgaoJulgador: str(orgao.nome),
    grau: str(source.grau),
    dataAjuizamento: str(source.dataAjuizamento),
    ultimaAtualizacao: str(source["@timestamp"]) ?? str(source.dataHoraUltimaAtualizacao),
    movimentos: mapMovements(source),
    partes: mapParties(source),
    raw: source,
  };
}

/**
 * Fetches a single process by its CNJ number. The tribunal endpoint is derived
 * from the number itself (see tribunais.ts) for broad coverage. Returns null
 * when the process is not found in the tribunal's index.
 */
export async function fetchProcessByNumber(
  cnjNumber: string,
  options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<DatajudProcess | null> {
  const { apiKey, baseUrl } = getConfig();
  const parsed = parseCnjNumber(cnjNumber);

  const url = `${baseUrl}/api_publica_${parsed.datajudAlias}/_search`;
  const body = {
    size: 1,
    query: { match: { numeroProcesso: parsed.digits } },
  };

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 30_000
  );
  const signal = options?.signal ?? controller.signal;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `APIKey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    throw new DatajudError(
      `Falha de rede ao consultar o DATAJUD (${parsed.datajudAlias}): ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 429) {
    throw new DatajudError(
      "DATAJUD: limite de requisições excedido (429). Tente novamente mais tarde.",
      429
    );
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new DatajudError(
      `DATAJUD retornou HTTP ${res.status} para ${parsed.datajudAlias}. ${text.slice(0, 200)}`,
      res.status
    );
  }

  const json = (await res.json().catch(() => null)) as
    | { hits?: { hits?: Array<{ _source?: Record<string, unknown> }> } }
    | null;

  const hit = json?.hits?.hits?.[0]?._source;
  if (!hit) return null;

  return mapProcess(hit, parsed);
}
