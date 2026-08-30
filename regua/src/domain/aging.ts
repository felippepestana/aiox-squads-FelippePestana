// Aging buckets used by dashboards and dunning policies
// (docs/regua/03-backlog-mvp.md, US-E7.1 / US-E5.1).

import { AgingBucket, Parcela } from "./types";
import { isPrescrita } from "./prescricao";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days elapsed since the due date (negative = not yet due). */
export function diasEmAtraso(parcela: Parcela, referencia: Date): number {
  return Math.floor((referencia.getTime() - parcela.vencimento.getTime()) / MS_PER_DAY);
}

/** Aging bucket of an installment; "prescrito" wins over any age range. */
export function agingBucket(
  parcela: Parcela,
  todasDaCarteira: Parcela[],
  referencia: Date,
): AgingBucket {
  if (isPrescrita(parcela, todasDaCarteira, referencia)) return "prescrito";
  const dias = diasEmAtraso(parcela, referencia);
  if (dias <= 30) return "0-30";
  if (dias <= 60) return "31-60";
  if (dias <= 90) return "61-90";
  if (dias <= 180) return "91-180";
  return "180+";
}

/** Sum of collectable value per bucket ("prescrito" is reported but never collectable). */
export function agingReport(
  parcelas: Parcela[],
  referencia: Date,
): Record<AgingBucket, { quantidade: number; valor: number }> {
  const report: Record<AgingBucket, { quantidade: number; valor: number }> = {
    "0-30": { quantidade: 0, valor: 0 },
    "31-60": { quantidade: 0, valor: 0 },
    "61-90": { quantidade: 0, valor: 0 },
    "91-180": { quantidade: 0, valor: 0 },
    "180+": { quantidade: 0, valor: 0 },
    prescrito: { quantidade: 0, valor: 0 },
  };
  for (const p of parcelas) {
    const bucket = agingBucket(p, parcelas, referencia);
    report[bucket].quantidade += 1;
    report[bucket].valor += p.valorOriginal;
  }
  return report;
}
