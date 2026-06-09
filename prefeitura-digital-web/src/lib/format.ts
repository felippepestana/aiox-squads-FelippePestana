// Formatadores compartilhados (moeda e percentual) em pt-BR.

/** Formata um número como moeda (R$). Retorna "—" quando ausente. */
export function brl(v?: number, opts?: { semCentavos?: boolean }): string {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    ...(opts?.semCentavos ? { maximumFractionDigits: 0 } : {}),
  });
}

/** Formata um número como percentual (ex.: 48.6 → "48,6%"). Retorna "—" quando ausente. */
export function pct(v?: number): string {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}
