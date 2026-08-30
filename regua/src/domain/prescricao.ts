// Prescription engine — system rules P1/P2 of docs/regua/05-compliance-e-guardrails.md.
//
// P1 — Five-year prescription (CC/2002, art. 206, §5º, I). Per STJ 3ª Turma,
// REsp 2.086.705/SP (j. 05/03/2024), the anuidade/semestralidade is a single
// obligation split into installments: the prescription term starts at the DUE
// DATE OF THE LAST INSTALLMENT of that anuidade, each anuidade being autonomous.
// When the anuidade grouping is unknown we fall back to the installment's own
// due date, which prescribes EARLIER — the conservative direction (blocks more).
//
// P2 — A signed confissão de dívida / renegotiation restarts the term, counted
// from the due date of the last installment of the new agreement.

import { Acordo, Parcela } from "./types";

export const PRESCRICAO_ANOS = 5;

function addYears(date: Date, years: number): Date {
  const d = new Date(date.getTime());
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * Termo inicial da prescrição de uma parcela: o vencimento da última parcela
 * da sua anuidade (REsp 2.086.705/SP) — ou o próprio vencimento, como fallback
 * conservador, quando o agrupamento por anuidade é desconhecido.
 */
export function termoInicialPrescricao(parcela: Parcela, todasDaCarteira: Parcela[]): Date {
  if (parcela.anuidadeId === null) return parcela.vencimento;
  let ultimo = parcela.vencimento;
  for (const p of todasDaCarteira) {
    if (
      p.contratoId === parcela.contratoId &&
      p.anuidadeId === parcela.anuidadeId &&
      p.vencimento.getTime() > ultimo.getTime()
    ) {
      ultimo = p.vencimento;
    }
  }
  return ultimo;
}

/** Data em que a pretensão de cobrança da parcela prescreve. */
export function dataPrescricao(parcela: Parcela, todasDaCarteira: Parcela[]): Date {
  return addYears(termoInicialPrescricao(parcela, todasDaCarteira), PRESCRICAO_ANOS);
}

/**
 * Rule P1: is the installment prescribed at the reference date?
 * A prescribed installment must be BLOCKED in dunning, simulator, debtor
 * portal, negativação, protesto and pleadings.
 */
export function isPrescrita(parcela: Parcela, todasDaCarteira: Parcela[], referencia: Date): boolean {
  return referencia.getTime() > dataPrescricao(parcela, todasDaCarteira).getTime();
}

/**
 * Rule P2: new prescription date after a signed confissão de dívida —
 * five years from the due date of the LAST installment of the agreement.
 * Returns null if the agreement has no accepted confession (no restart).
 */
export function dataPrescricaoAposAcordo(acordo: Acordo): Date | null {
  if (acordo.confissaoDividaAceitaEm === null) return null;
  return addYears(acordo.vencimentoUltimaParcela, PRESCRICAO_ANOS);
}

/**
 * Guard used by any flow that is about to charge a set of installments.
 * Throws when any installment is prescribed — charging prescribed debt is
 * forbidden (P1); callers must filter first and report, never silently drop.
 */
export function assertNenhumaPrescrita(
  parcelas: Parcela[],
  todasDaCarteira: Parcela[],
  referencia: Date,
): void {
  const prescritas = parcelas.filter((p) => isPrescrita(p, todasDaCarteira, referencia));
  if (prescritas.length > 0) {
    const ids = prescritas.map((p) => p.id).join(", ");
    throw new Error(
      `Cobranca bloqueada: ${prescritas.length} parcela(s) prescrita(s) [${ids}] (regra P1 — art. 206 §5º I CC; REsp 2.086.705/SP)`,
    );
  }
}
