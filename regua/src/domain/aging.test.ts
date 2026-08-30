import { test } from "node:test";
import assert from "node:assert/strict";
import { Parcela } from "./types";
import { agingBucket, agingReport, diasEmAtraso } from "./aging";

function parcela(id: string, vencimentoIso: string, valor = 100): Parcela {
  return {
    id,
    contratoId: "c1",
    competencia: "2025-01",
    anuidadeId: null,
    vencimento: new Date(`${vencimentoIso}T00:00:00Z`),
    valorOriginal: valor,
    status: "em_aberto",
  };
}

const ref = new Date("2026-07-12T00:00:00Z");

test("diasEmAtraso conta dias corridos desde o vencimento", () => {
  assert.equal(diasEmAtraso(parcela("p", "2026-07-02"), ref), 10);
  assert.equal(diasEmAtraso(parcela("p", "2026-07-22"), ref), -10);
});

test("buckets de aging respeitam os limites 30/60/90/180", () => {
  const casos: Array<[string, string]> = [
    ["2026-06-20", "0-30"],
    ["2026-05-20", "31-60"],
    ["2026-04-20", "61-90"],
    ["2026-02-01", "91-180"],
    ["2025-06-01", "180+"],
  ];
  for (const [venc, esperado] of casos) {
    const p = parcela("p", venc);
    assert.equal(agingBucket(p, [p], ref), esperado, `vencimento ${venc}`);
  }
});

test("parcela prescrita cai no bucket 'prescrito', nunca em faixa etária", () => {
  const p = parcela("p", "2019-01-10");
  assert.equal(agingBucket(p, [p], ref), "prescrito");
});

test("agingReport soma quantidade e valor por bucket", () => {
  const parcelas = [
    parcela("a", "2026-06-20", 100),
    parcela("b", "2026-06-25", 150),
    parcela("c", "2025-06-01", 200),
    parcela("d", "2019-01-10", 999),
  ];
  const report = agingReport(parcelas, ref);
  assert.deepEqual(report["0-30"], { quantidade: 2, valor: 250 });
  assert.deepEqual(report["180+"], { quantidade: 1, valor: 200 });
  assert.deepEqual(report["prescrito"], { quantidade: 1, valor: 999 });
});
