import { test } from "node:test";
import assert from "node:assert/strict";
import { Acordo, Parcela } from "./types";
import {
  assertNenhumaPrescrita,
  dataPrescricao,
  dataPrescricaoAposAcordo,
  isPrescrita,
  termoInicialPrescricao,
} from "./prescricao";

function parcela(overrides: Partial<Parcela> & { id: string; vencimento: Date }): Parcela {
  return {
    contratoId: "c1",
    competencia: "2020-03",
    anuidadeId: null,
    valorOriginal: 890,
    status: "em_aberto",
    ...overrides,
  };
}

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

test("P1 fallback: sem anuidade, termo inicial é o próprio vencimento (conservador)", () => {
  const p = parcela({ id: "p1", vencimento: d("2020-03-10") });
  assert.equal(termoInicialPrescricao(p, [p]).getTime(), d("2020-03-10").getTime());
  assert.equal(isPrescrita(p, [p], d("2025-03-10")), false); // exatamente 5 anos: ainda não
  assert.equal(isPrescrita(p, [p], d("2025-03-11")), true);
});

test("P1 anuidade (REsp 2.086.705/SP): termo inicial é a última parcela da anuidade", () => {
  const marco = parcela({ id: "mar", vencimento: d("2020-03-10"), anuidadeId: "2020" });
  const dezembro = parcela({ id: "dez", vencimento: d("2020-12-10"), anuidadeId: "2020" });
  const todas = [marco, dezembro];
  assert.equal(termoInicialPrescricao(marco, todas).getTime(), d("2020-12-10").getTime());
  // Em 2025-06, a parcela de março de 2020 ainda NÃO está prescrita (termo corre de dez/2020)
  assert.equal(isPrescrita(marco, todas, d("2025-06-01")), false);
  assert.equal(isPrescrita(marco, todas, d("2025-12-11")), true);
});

test("P1 anuidades autônomas: parcela de outra anuidade não estende o termo", () => {
  const a2019 = parcela({ id: "a", vencimento: d("2019-11-10"), anuidadeId: "2019" });
  const a2020 = parcela({ id: "b", vencimento: d("2020-12-10"), anuidadeId: "2020" });
  const todas = [a2019, a2020];
  assert.equal(termoInicialPrescricao(a2019, todas).getTime(), d("2019-11-10").getTime());
  assert.equal(isPrescrita(a2019, todas, d("2024-11-11")), true);
});

test("P1 anuidade em contratos diferentes não se mistura", () => {
  const c1 = parcela({ id: "x", vencimento: d("2020-03-10"), anuidadeId: "2020", contratoId: "c1" });
  const c2 = parcela({ id: "y", vencimento: d("2020-12-10"), anuidadeId: "2020", contratoId: "c2" });
  assert.equal(termoInicialPrescricao(c1, [c1, c2]).getTime(), d("2020-03-10").getTime());
});

test("P2: confissão de dívida reinicia o prazo a partir da última parcela do acordo", () => {
  const acordo: Acordo = {
    id: "ac1",
    parcelaIds: ["p1"],
    desconto: 0.2,
    vencimentoUltimaParcela: d("2026-06-15"),
    confissaoDividaAceitaEm: d("2026-01-10"),
  };
  assert.equal(dataPrescricaoAposAcordo(acordo)!.getTime(), d("2031-06-15").getTime());
  assert.equal(dataPrescricaoAposAcordo({ ...acordo, confissaoDividaAceitaEm: null }), null);
});

test("guard: assertNenhumaPrescrita lança erro citando as parcelas bloqueadas", () => {
  const ok = parcela({ id: "ok", vencimento: d("2024-01-10") });
  const velha = parcela({ id: "velha", vencimento: d("2018-01-10") });
  const todas = [ok, velha];
  assert.throws(
    () => assertNenhumaPrescrita([ok, velha], todas, d("2026-07-12")),
    /velha.*prescrita|prescrita.*velha/s,
  );
  assert.doesNotThrow(() => assertNenhumaPrescrita([ok], todas, d("2026-07-12")));
});

test("dataPrescricao soma exatamente 5 anos ao termo inicial", () => {
  const p = parcela({ id: "p", vencimento: d("2021-02-28") });
  assert.equal(dataPrescricao(p, [p]).getTime(), d("2026-02-28").getTime());
});
