/**
 * Offline test for CNJ number parsing / DATAJUD alias resolution.
 * Validates broad coverage ("ampla abrangência") across every Judiciary
 * segment without any network access.
 *
 * Run: npx tsx scripts/test-tribunais.ts   (exit 0 ok, 1 on failure)
 */

import { parseCnjNumber, CnjNumberError } from "../src/lib/integrations/tribunais";

type Case = [num: string, alias: string, segment: string];

const cases: Case[] = [
  ["1001234-56.2026.8.26.0100", "tjsp", "estadual"],
  ["0000001-02.2024.8.13.0024", "tjmg", "estadual"],
  ["0000001-02.2024.8.19.0001", "tjrj", "estadual"],
  ["0000001-02.2024.8.21.0001", "tjrs", "estadual"],
  ["0000001-02.2024.8.07.0001", "tjdft", "estadual"], // DF -> tjdft
  ["0000001-02.2024.8.05.0001", "tjba", "estadual"],
  ["0000001-02.2024.8.24.0001", "tjsc", "estadual"],
  ["0000001-02.2024.8.25.0001", "tjse", "estadual"],
  ["0000001-02.2024.8.27.0001", "tjto", "estadual"],
  ["0000001-02.2024.4.01.3400", "trf1", "federal"],
  ["0000001-02.2024.4.06.3800", "trf6", "federal"],
  ["0000001-02.2024.5.02.0001", "trt2", "trabalho"],
  ["0000001-02.2024.5.15.0001", "trt15", "trabalho"],
  ["0000001-02.2024.5.00.0000", "tst", "trabalho"],
  ["0000001-02.2024.6.26.0001", "tre-sp", "eleitoral"],
  ["0000001-02.2024.6.00.0000", "tse", "eleitoral"],
  ["0000001-02.2024.1.00.0000", "stf", "stf"],
  ["0000001-02.2024.3.00.0000", "stj", "stj"],
  ["0000001-02.2024.7.00.0000", "stm", "militar-uniao"],
  ["0000001-02.2024.9.13.0001", "tjmmg", "militar-estadual"],
  ["0000001-02.2024.9.21.0001", "tjmrs", "militar-estadual"],
  ["0000001-02.2024.9.26.0001", "tjmsp", "militar-estadual"],
];

let failures = 0;

for (const [num, alias, segment] of cases) {
  try {
    const p = parseCnjNumber(num);
    if (p.datajudAlias === alias && p.segment === segment) {
      console.log(`ok   ${num} -> ${p.datajudAlias} (${p.tribunalName})`);
    } else {
      failures++;
      console.error(
        `FAIL ${num} -> alias ${p.datajudAlias} seg ${p.segment} (expected ${alias} ${segment})`
      );
    }
  } catch (e) {
    failures++;
    console.error(`FAIL ${num} threw ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Negative cases: malformed numbers and segments without a public index.
const negatives = ["123", "abc", "0000001-02.2024.2.00.0000" /* CNJ admin */];
for (const num of negatives) {
  try {
    parseCnjNumber(num);
    failures++;
    console.error(`FAIL ${num} should have thrown`);
  } catch (e) {
    if (e instanceof CnjNumberError) {
      console.log(`ok   rejected ${num}`);
    } else {
      failures++;
      console.error(`FAIL ${num} threw unexpected ${String(e)}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log("\nAll tribunal-resolution cases passed.");
