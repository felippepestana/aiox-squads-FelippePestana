/**
 * CNJ unified case-number parsing and tribunal resolution.
 *
 * Implements Resolução CNJ nº 65/2008: NNNNNNN-DD.AAAA.J.TR.OOOO
 *   N (7) sequential | D (2) check digits | A (4) year |
 *   J (1) judiciary segment | TR (2) tribunal | O (4) origin unit
 *
 * Goal: broad coverage ("ampla abrangência") — every segment and tribunal of
 * the Brazilian Judiciary maps to its DATAJUD public-API index alias, derived
 * straight from the case number so no per-tribunal configuration is required.
 */

export type JudiciarySegment =
  | "stf" // 1 - Supremo Tribunal Federal
  | "cnj" // 2 - Conselho Nacional de Justiça
  | "stj" // 3 - Superior Tribunal de Justiça
  | "federal" // 4 - Justiça Federal
  | "trabalho" // 5 - Justiça do Trabalho
  | "eleitoral" // 6 - Justiça Eleitoral
  | "militar-uniao" // 7 - Justiça Militar da União
  | "estadual" // 8 - Justiça dos Estados e do DF
  | "militar-estadual"; // 9 - Justiça Militar Estadual

export interface ParsedCnjNumber {
  /** Normalized 20-digit number (no punctuation). */
  digits: string;
  /** Formatted NNNNNNN-DD.AAAA.J.TR.OOOO. */
  formatted: string;
  sequential: string;
  checkDigits: string;
  year: number;
  /** J field (1-9). */
  segmentCode: number;
  segment: JudiciarySegment;
  /** TR field (0-99). */
  tribunalCode: number;
  originCode: string;
  /** DATAJUD public-API index alias (e.g. "tjsp", "trf1", "trt2", "stj"). */
  datajudAlias: string;
  /** Human-readable tribunal name. */
  tribunalName: string;
}

/** State (UF) codes for the Justiça Estadual TR field, per Resolução 65/2008. */
const ESTADUAL_TR: Record<number, { uf: string; name: string }> = {
  1: { uf: "AC", name: "Tribunal de Justiça do Acre" },
  2: { uf: "AL", name: "Tribunal de Justiça de Alagoas" },
  3: { uf: "AP", name: "Tribunal de Justiça do Amapá" },
  4: { uf: "AM", name: "Tribunal de Justiça do Amazonas" },
  5: { uf: "BA", name: "Tribunal de Justiça da Bahia" },
  6: { uf: "CE", name: "Tribunal de Justiça do Ceará" },
  7: { uf: "DF", name: "Tribunal de Justiça do Distrito Federal e Territórios" },
  8: { uf: "ES", name: "Tribunal de Justiça do Espírito Santo" },
  9: { uf: "GO", name: "Tribunal de Justiça de Goiás" },
  10: { uf: "MA", name: "Tribunal de Justiça do Maranhão" },
  11: { uf: "MT", name: "Tribunal de Justiça de Mato Grosso" },
  12: { uf: "MS", name: "Tribunal de Justiça de Mato Grosso do Sul" },
  13: { uf: "MG", name: "Tribunal de Justiça de Minas Gerais" },
  14: { uf: "PA", name: "Tribunal de Justiça do Pará" },
  15: { uf: "PB", name: "Tribunal de Justiça da Paraíba" },
  16: { uf: "PR", name: "Tribunal de Justiça do Paraná" },
  17: { uf: "PE", name: "Tribunal de Justiça de Pernambuco" },
  18: { uf: "PI", name: "Tribunal de Justiça do Piauí" },
  19: { uf: "RJ", name: "Tribunal de Justiça do Rio de Janeiro" },
  20: { uf: "RN", name: "Tribunal de Justiça do Rio Grande do Norte" },
  21: { uf: "RS", name: "Tribunal de Justiça do Rio Grande do Sul" },
  22: { uf: "RO", name: "Tribunal de Justiça de Rondônia" },
  23: { uf: "RR", name: "Tribunal de Justiça de Roraima" },
  24: { uf: "SC", name: "Tribunal de Justiça de Santa Catarina" },
  25: { uf: "SE", name: "Tribunal de Justiça de Sergipe" },
  26: { uf: "SP", name: "Tribunal de Justiça de São Paulo" },
  27: { uf: "TO", name: "Tribunal de Justiça do Tocantins" },
};

/** Justiça Militar Estadual exists only in MG, RS and SP (same UF codes). */
const MILITAR_ESTADUAL_TR: Record<number, { alias: string; name: string }> = {
  13: { alias: "tjmmg", name: "Tribunal de Justiça Militar de Minas Gerais" },
  21: { alias: "tjmrs", name: "Tribunal de Justiça Militar do Rio Grande do Sul" },
  26: { alias: "tjmsp", name: "Tribunal de Justiça Militar de São Paulo" },
};

const SEGMENT_BY_CODE: Record<number, JudiciarySegment> = {
  1: "stf",
  2: "cnj",
  3: "stj",
  4: "federal",
  5: "trabalho",
  6: "eleitoral",
  7: "militar-uniao",
  8: "estadual",
  9: "militar-estadual",
};

export class CnjNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CnjNumberError";
  }
}

/** Strips punctuation and returns the 20 digits, or throws on malformed input. */
export function normalizeCnjNumber(input: string): string {
  const digits = (input || "").replace(/\D/g, "");
  if (digits.length !== 20) {
    throw new CnjNumberError(
      `Número CNJ inválido: esperado 20 dígitos, recebido ${digits.length}.`
    );
  }
  return digits;
}

/** Formats 20 digits as NNNNNNN-DD.AAAA.J.TR.OOOO. */
export function formatCnjNumber(digits: string): string {
  const d = normalizeCnjNumber(digits);
  return `${d.slice(0, 7)}-${d.slice(7, 9)}.${d.slice(9, 13)}.${d.slice(
    13,
    14
  )}.${d.slice(14, 16)}.${d.slice(16, 20)}`;
}

/**
 * Resolves the DATAJUD index alias and tribunal name for a given segment and
 * TR code. Returns null when DATAJUD has no public index for that combination
 * (e.g. CNJ administrative processes, councils such as CJF/CSJT).
 */
function resolveTribunal(
  segment: JudiciarySegment,
  tr: number
): { alias: string; name: string } | null {
  switch (segment) {
    case "stf":
      return { alias: "stf", name: "Supremo Tribunal Federal" };
    case "stj":
      return { alias: "stj", name: "Superior Tribunal de Justiça" };
    case "cnj":
      // CNJ administrative cases are not exposed by the DATAJUD public API.
      return null;
    case "militar-uniao":
      return { alias: "stm", name: "Superior Tribunal Militar" };

    case "federal": {
      // Councils (CJF) use TR 90 and have no public index.
      if (tr === 90 || tr === 0) return null;
      if (tr < 1 || tr > 6) return null; // TRF1..TRF6
      return { alias: `trf${tr}`, name: `Tribunal Regional Federal da ${tr}ª Região` };
    }

    case "trabalho": {
      if (tr === 0) return { alias: "tst", name: "Tribunal Superior do Trabalho" };
      if (tr === 90) return null; // CSJT
      if (tr < 1 || tr > 24) return null; // TRT1..TRT24
      return { alias: `trt${tr}`, name: `Tribunal Regional do Trabalho da ${tr}ª Região` };
    }

    case "eleitoral": {
      if (tr === 0) return { alias: "tse", name: "Tribunal Superior Eleitoral" };
      const uf = ESTADUAL_TR[tr]?.uf;
      if (!uf) return null;
      return {
        alias: `tre-${uf.toLowerCase()}`,
        name: `Tribunal Regional Eleitoral de ${uf}`,
      };
    }

    case "estadual": {
      const entry = ESTADUAL_TR[tr];
      if (!entry) return null;
      // The Federal District court uses the historical alias "tjdft".
      const alias = entry.uf === "DF" ? "tjdft" : `tj${entry.uf.toLowerCase()}`;
      return { alias, name: entry.name };
    }

    case "militar-estadual": {
      const entry = MILITAR_ESTADUAL_TR[tr];
      return entry ? { alias: entry.alias, name: entry.name } : null;
    }

    default:
      return null;
  }
}

/**
 * Parses a CNJ unified case number into its fields and resolves the DATAJUD
 * index alias. Throws CnjNumberError for malformed numbers or for segments
 * without a public DATAJUD index.
 */
export function parseCnjNumber(input: string): ParsedCnjNumber {
  const digits = normalizeCnjNumber(input);

  const sequential = digits.slice(0, 7);
  const checkDigits = digits.slice(7, 9);
  const year = parseInt(digits.slice(9, 13), 10);
  const segmentCode = parseInt(digits.slice(13, 14), 10);
  const tribunalCode = parseInt(digits.slice(14, 16), 10);
  const originCode = digits.slice(16, 20);

  const segment = SEGMENT_BY_CODE[segmentCode];
  if (!segment) {
    throw new CnjNumberError(
      `Segmento do Judiciário desconhecido (J=${segmentCode}).`
    );
  }

  const tribunal = resolveTribunal(segment, tribunalCode);
  if (!tribunal) {
    throw new CnjNumberError(
      `Sem índice público no DATAJUD para o segmento "${segment}" (TR=${tribunalCode}).`
    );
  }

  return {
    digits,
    formatted: formatCnjNumber(digits),
    sequential,
    checkDigits,
    year,
    segmentCode,
    segment,
    tribunalCode,
    originCode,
    datajudAlias: tribunal.alias,
    tribunalName: tribunal.name,
  };
}

/** Convenience: just the DATAJUD alias for a case number (throws on error). */
export function datajudAliasFor(input: string): string {
  return parseCnjNumber(input).datajudAlias;
}
