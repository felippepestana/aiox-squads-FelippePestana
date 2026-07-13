import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCarteiraCsv } from "./parse";

// CPFs válidos de teste (dígitos verificadores corretos)
const CPF_OK = "529.982.247-25";
const CPF_OK_2 = "111.444.777-35";

const HEADER = "cpf,nome,telefone,email,contrato,competencia,anuidade,vencimento,valor";

test("linha válida é normalizada (CPF só dígitos, telefone 55, valor decimal)", () => {
  const csv = [
    HEADER,
    `${CPF_OK},Maria Silva,(11) 98765-4321,maria@exemplo.com,CT-1,2025-03,2025,10/03/2025,"1.234,56"`,
  ].join("\n");
  const r = parseCarteiraCsv(csv);
  assert.equal(r.erros.length, 0);
  assert.equal(r.validas.length, 1);
  const l = r.validas[0]!;
  assert.equal(l.cpf, "52998224725");
  assert.equal(l.telefone, "5511987654321");
  assert.equal(l.valorOriginal, 1234.56);
  assert.equal(l.anuidadeId, "2025");
  assert.equal(l.vencimento.toISOString().slice(0, 10), "2025-03-10");
});

test("linhas inválidas geram erros com número da linha e campo, e não entram nas válidas", () => {
  const csv = [
    HEADER,
    `123.456.789-00,Fulano,,,CT-1,2025-03,,10/03/2025,100`, // CPF inválido
    `${CPF_OK},Ana,,,CT-2,2025/03,,10/03/2025,100`, // competência errada
    `${CPF_OK_2},Bia,,,CT-3,2025-03,,31/02/2025,100`, // data impossível
    `${CPF_OK_2},Caio,,,CT-4,2025-04,,10/04/2025,-5`, // valor não positivo
  ].join("\n");
  const r = parseCarteiraCsv(csv);
  assert.equal(r.validas.length, 0);
  assert.equal(r.erros.length, 4);
  assert.deepEqual(
    r.erros.map((e) => [e.linha, e.campo]),
    [
      [2, "cpf"],
      [3, "competencia"],
      [4, "vencimento"],
      [5, "valor"],
    ],
  );
});

test("dedupe por cpf+contrato+competencia é idempotente", () => {
  const linha = `${CPF_OK},Maria Silva,,,CT-1,2025-03,,10/03/2025,100`;
  const csv = [HEADER, linha, linha, linha].join("\n");
  const r = parseCarteiraCsv(csv);
  assert.equal(r.validas.length, 1);
  assert.equal(r.duplicadasIgnoradas, 2);
});

test("cabeçalho sem colunas obrigatórias falha com relatório claro", () => {
  const r = parseCarteiraCsv("cpf,nome\n123,x");
  assert.equal(r.validas.length, 0);
  assert.equal(r.erros[0]!.campo, "cabecalho");
  assert.match(r.erros[0]!.motivo, /contrato/);
});

test("suporta separador ponto-e-vírgula e datas ISO", () => {
  const csv = [
    "cpf;nome;contrato;competencia;vencimento;valor",
    `${CPF_OK};Maria;CT-1;2025-03;2025-03-10;890,00`,
  ].join("\n");
  const r = parseCarteiraCsv(csv);
  assert.equal(r.erros.length, 0);
  assert.equal(r.validas[0]!.valorOriginal, 890);
});

test("telefone/e-mail inválidos são erro visível, não descarte silencioso", () => {
  const csv = [HEADER, `${CPF_OK},Maria,999,notanemail,CT-1,2025-03,,10/03/2025,100`].join("\n");
  const r = parseCarteiraCsv(csv);
  assert.equal(r.validas.length, 0);
  assert.deepEqual(r.erros.map((e) => e.campo).sort(), ["email", "telefone"]);
});
