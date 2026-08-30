// Portfolio spreadsheet ingestion (US-E1.1): line-by-line validation with an
// error report, normalization (CPF/phone/email) and deduplication by
// cpf + contrato + competencia. Invalid rows never reach persistence.

import { isValidCPF, isValidEmail, onlyDigits } from "../lib/br-docs";
import { normalizePhoneBR } from "../lib/phone";

export interface LinhaCarteira {
  cpf: string;
  nomeDevedor: string;
  telefone: string | null;
  email: string | null;
  contratoExternoId: string;
  /** Competência YYYY-MM. */
  competencia: string;
  /** Anuidade/semestralidade (ex. "2024" ou "2024-2"); vazio = desconhecida. */
  anuidadeId: string | null;
  vencimento: Date;
  valorOriginal: number;
}

export interface ErroLinha {
  linha: number; // 1-based, counting the header as line 1
  campo: string;
  motivo: string;
}

export interface ResultadoIngestao {
  validas: LinhaCarteira[];
  erros: ErroLinha[];
  duplicadasIgnoradas: number;
}

export const COLUNAS_OBRIGATORIAS = [
  "cpf",
  "nome",
  "contrato",
  "competencia",
  "vencimento",
  "valor",
] as const;

const COLUNAS_OPCIONAIS = ["telefone", "email", "anuidade"] as const;

/** Minimal CSV split supporting quoted fields with commas or semicolons. */
function splitCsvLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === sep && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

function detectSeparator(header: string): string {
  return header.split(";").length > header.split(",").length ? ";" : ",";
}

function parseDateBRorISO(v: string): Date | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (iso) {
    const d = new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
    return isNaN(d.getTime()) || d.getUTCMonth() !== Number(iso[2]) - 1 ? null : d;
  }
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (br) {
    const d = new Date(Date.UTC(Number(br[3]), Number(br[2]) - 1, Number(br[1])));
    return isNaN(d.getTime()) || d.getUTCMonth() !== Number(br[2]) - 1 ? null : d;
  }
  return null;
}

function parseValorBR(v: string): number | null {
  // Accepts "1234.56", "1234,56" and "1.234,56"
  const normalized = v.includes(",") ? v.replace(/\./g, "").replace(",", ".") : v;
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

/**
 * Parse a portfolio CSV. Never throws on bad data: every invalid row is
 * reported in `erros` with line number, field and reason (US-E1.1).
 * Reprocessing the same file is idempotent thanks to the dedupe key.
 */
export function parseCarteiraCsv(conteudo: string): ResultadoIngestao {
  const linhas = conteudo.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const erros: ErroLinha[] = [];
  const validas: LinhaCarteira[] = [];
  let duplicadasIgnoradas = 0;

  if (linhas.length === 0) {
    return { validas, erros: [{ linha: 1, campo: "arquivo", motivo: "arquivo vazio" }], duplicadasIgnoradas };
  }

  const sep = detectSeparator(linhas[0]!);
  const header = splitCsvLine(linhas[0]!, sep).map((h) => h.toLowerCase());
  const idx = new Map<string, number>();
  for (const col of [...COLUNAS_OBRIGATORIAS, ...COLUNAS_OPCIONAIS]) {
    const i = header.indexOf(col);
    if (i >= 0) idx.set(col, i);
  }
  const faltantes = COLUNAS_OBRIGATORIAS.filter((c) => !idx.has(c));
  if (faltantes.length > 0) {
    return {
      validas,
      erros: [{ linha: 1, campo: "cabecalho", motivo: `colunas obrigatórias ausentes: ${faltantes.join(", ")}` }],
      duplicadasIgnoradas,
    };
  }

  const vistas = new Set<string>();

  for (let i = 1; i < linhas.length; i++) {
    const numLinha = i + 1;
    const campos = splitCsvLine(linhas[i]!, sep);
    const get = (col: string): string => campos[idx.get(col)!] ?? "";
    const errosLinha: ErroLinha[] = [];

    const cpfRaw = get("cpf");
    if (!isValidCPF(cpfRaw)) errosLinha.push({ linha: numLinha, campo: "cpf", motivo: `CPF inválido: "${cpfRaw}"` });

    const nome = get("nome");
    if (nome.length < 3) errosLinha.push({ linha: numLinha, campo: "nome", motivo: "nome ausente ou muito curto" });

    const contrato = get("contrato");
    if (contrato.length === 0) errosLinha.push({ linha: numLinha, campo: "contrato", motivo: "identificador de contrato ausente" });

    const competencia = get("competencia");
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(competencia)) {
      errosLinha.push({ linha: numLinha, campo: "competencia", motivo: `competência deve ser YYYY-MM: "${competencia}"` });
    }

    const vencimento = parseDateBRorISO(get("vencimento"));
    if (vencimento === null) {
      errosLinha.push({ linha: numLinha, campo: "vencimento", motivo: `data inválida (use DD/MM/AAAA ou AAAA-MM-DD): "${get("vencimento")}"` });
    }

    const valor = parseValorBR(get("valor"));
    if (valor === null) {
      errosLinha.push({ linha: numLinha, campo: "valor", motivo: `valor inválido ou não positivo: "${get("valor")}"` });
    }

    // Optional fields: invalid content is an error (bad data must be visible),
    // but absence is fine.
    let telefone: string | null = null;
    const telRaw = idx.has("telefone") ? get("telefone") : "";
    if (telRaw.length > 0) {
      telefone = normalizePhoneBR(telRaw);
      if (telefone === null) errosLinha.push({ linha: numLinha, campo: "telefone", motivo: `telefone BR inválido: "${telRaw}"` });
    }

    let email: string | null = null;
    const emailRaw = idx.has("email") ? get("email") : "";
    if (emailRaw.length > 0) {
      if (isValidEmail(emailRaw)) email = emailRaw.trim();
      else errosLinha.push({ linha: numLinha, campo: "email", motivo: `e-mail inválido: "${emailRaw}"` });
    }

    if (errosLinha.length > 0) {
      erros.push(...errosLinha);
      continue;
    }

    const chave = `${onlyDigits(cpfRaw)}|${contrato}|${competencia}`;
    if (vistas.has(chave)) {
      duplicadasIgnoradas += 1;
      continue;
    }
    vistas.add(chave);

    validas.push({
      cpf: onlyDigits(cpfRaw),
      nomeDevedor: nome,
      telefone,
      email,
      contratoExternoId: contrato,
      competencia,
      anuidadeId: idx.has("anuidade") && get("anuidade").length > 0 ? get("anuidade") : null,
      vencimento: vencimento!,
      valorOriginal: valor!,
    });
  }

  return { validas, erros, duplicadasIgnoradas };
}
