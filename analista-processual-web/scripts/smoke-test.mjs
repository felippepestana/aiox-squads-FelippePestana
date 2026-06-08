#!/usr/bin/env node
/**
 * Cross-platform end-to-end smoke test for analista-processual-web.
 *
 * Exercises the real flow against a running dev/prod server:
 *   1. POST /api/analyses                       -> create (PENDING)
 *   2. POST /api/analyses/:id/documents         -> upload + text extraction
 *   3. POST /api/analyses/:id/process           -> run multi-agent pipeline
 *   4. GET  /api/analyses/:id                   -> fetch persisted result
 *
 * Runs identically on macOS and Windows (Node 18+ provides global fetch,
 * FormData and Blob). No shell-specific syntax, no external dependencies.
 *
 * Usage:
 *   node scripts/smoke-test.mjs [options]
 *   npm run test:smoke
 *
 * Options:
 *   --base-url=<url>     Server base URL (default: $SMOKE_BASE_URL or http://localhost:3000)
 *   --file=<path>        Document to upload (default: scripts/fixtures/processo-exemplo.txt)
 *   --require-completed  Fail unless the pipeline reaches COMPLETED (needs an LLM key)
 *   --timeout=<ms>       Per-request timeout in ms (default: 300000)
 *   --help               Show this help
 *
 * Exit codes:
 *   0  success (COMPLETED, or plumbing OK + FAILED only because no LLM key)
 *   1  failure (unreachable server, HTTP error, or unexpected pipeline failure)
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { basename } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── arg parsing ──────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const opts = {};
  for (const arg of argv) {
    const match = /^--([^=]+)(?:=(.*))?$/.exec(arg);
    if (!match) continue;
    opts[match[1]] = match[2] === undefined ? true : match[2];
  }
  return opts;
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(
    [
      "Cross-platform E2E smoke test for analista-processual-web.",
      "",
      "Usage: node scripts/smoke-test.mjs [options]",
      "",
      "  --base-url=<url>     default: $SMOKE_BASE_URL or http://localhost:3000",
      "  --file=<path>        default: scripts/fixtures/processo-exemplo.txt",
      "  --require-completed  fail unless pipeline reaches COMPLETED (needs LLM key)",
      "  --timeout=<ms>       per-request timeout (default: 300000)",
      "  --help               show this help",
    ].join("\n")
  );
  process.exit(0);
}

const BASE_URL = (
  args["base-url"] ||
  process.env.SMOKE_BASE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const FILE_PATH = args.file
  ? resolve(process.cwd(), args.file)
  : resolve(__dirname, "fixtures", "processo-exemplo.txt");

const REQUIRE_COMPLETED = Boolean(args["require-completed"]);
const TIMEOUT = Number(args.timeout) || 300_000;

// ── output helpers (ANSI is safe on modern macOS/Windows terminals) ──────────
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, s) => (useColor ? `\u001b[${code}m${s}\u001b[0m` : s);
const green = (s) => paint("32", s);
const red = (s) => paint("31", s);
const yellow = (s) => paint("33", s);
const dim = (s) => paint("2", s);

let step = 0;
const stepLog = (msg) => console.log(`${dim(`[${++step}]`)} ${msg}`);
const ok = (msg) => console.log(`  ${green("OK")}   ${msg}`);
const warn = (msg) => console.log(`  ${yellow("WARN")} ${msg}`);
const fail = (msg) => console.log(`  ${red("FAIL")} ${msg}`);

async function request(method, path, { body, headers } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      body,
      headers,
      signal: controller.signal,
    });
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    return { res, json, text };
  } finally {
    clearTimeout(timer);
  }
}

function bail(message, hint) {
  fail(message);
  if (hint) console.log(`\n${dim(hint)}`);
  process.exit(1);
}

async function main() {
  console.log(`\nSmoke test — analista-processual-web`);
  console.log(dim(`base URL: ${BASE_URL}`));
  console.log(dim(`document: ${FILE_PATH}\n`));

  // ── preflight: server reachable ────────────────────────────────────────────
  stepLog("Verificando se o servidor está no ar…");
  try {
    await fetch(`${BASE_URL}/api/analyses?limit=1`, {
      signal: AbortSignal.timeout(10_000),
    });
    ok(`servidor respondeu em ${BASE_URL}`);
  } catch {
    bail(
      `não foi possível conectar a ${BASE_URL}`,
      "Inicie o servidor primeiro (em outro terminal):\n  npm run dev\n" +
        "Ou aponte para outra URL:  node scripts/smoke-test.mjs --base-url=http://host:porta"
    );
  }

  // ── load fixture ─────────────────────────────────────────────────────────
  let fileBuffer;
  try {
    fileBuffer = await readFile(FILE_PATH);
  } catch {
    bail(`documento não encontrado: ${FILE_PATH}`);
  }

  // ── 1. create analysis ─────────────────────────────────────────────────────
  stepLog("Criando análise…");
  const create = await request("POST", "/api/analyses", {
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      processNumber: "1001234-56.2026.8.26.0100",
      court: "TJSP — 1ª Vara Cível de São Paulo",
      processClass: "Procedimento Comum Cível",
    }),
  });
  if (create.res.status !== 201 || !create.json?.analysisId) {
    bail(
      `criação falhou (HTTP ${create.res.status}): ${create.text?.slice(0, 200)}`
    );
  }
  const analysisId = create.json.analysisId;
  ok(`análise criada: ${analysisId}`);

  // ── 2. upload document ─────────────────────────────────────────────────────
  stepLog("Enviando documento e extraindo texto…");
  const form = new FormData();
  const blob = new Blob([fileBuffer], { type: "text/plain" });
  form.append("file", blob, basename(FILE_PATH));
  const upload = await request("POST", `/api/analyses/${analysisId}/documents`, {
    body: form,
  });
  if (upload.res.status !== 201 || !upload.json?.data?.id) {
    bail(
      `upload falhou (HTTP ${upload.res.status}): ${upload.text?.slice(0, 200)}`
    );
  }
  const textExtracted = upload.json.data?.metadata?.textExtracted;
  ok(`documento salvo: ${upload.json.data.filename}`);
  if (textExtracted) {
    ok("texto extraído com sucesso");
  } else {
    warn("nenhum texto extraível neste documento");
  }

  // ── 3. run pipeline (sync) or enqueue (async) ──────────────────────────────
  stepLog("Executando o pipeline multiagente (pode levar até alguns minutos)…");
  const process_ = await request("POST", `/api/analyses/${analysisId}/process`, {
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ processType: "Cobrança" }),
  });
  if (!process_.res.ok) {
    bail(
      `processamento falhou (HTTP ${process_.res.status}): ${process_.text?.slice(
        0,
        200
      )}`
    );
  }
  let status = process_.json?.status;
  let message = process_.json?.message;

  // Async mode: the route enqueues and returns QUEUED — poll until terminal.
  if (process_.json?.queued || status === "QUEUED" || status === "PROCESSING") {
    ok("análise enfileirada (modo assíncrono) — aguardando o worker…");
    const deadline = Date.now() + TIMEOUT;
    let polls = 0;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 2000));
      polls += 1;
      const poll = await request("GET", `/api/analyses/${analysisId}`);
      const cur = (poll.json?.data ?? poll.json)?.status;
      if (cur === "COMPLETED" || cur === "FAILED") {
        status = cur;
        const res = (poll.json?.data ?? poll.json)?.result;
        message = res?.error ?? message;
        break;
      }
      if (polls % 5 === 0) {
        console.log(dim(`  …ainda processando (status atual: ${cur})`));
      }
    }
    if (status === "QUEUED" || status === "PROCESSING") {
      bail("tempo esgotado aguardando o worker concluir a análise");
    }
  }

  ok(`pipeline retornou status: ${status}`);

  // ── 4. fetch persisted result ──────────────────────────────────────────────
  stepLog("Buscando resultado persistido…");
  const detail = await request("GET", `/api/analyses/${analysisId}`);
  if (!detail.res.ok) {
    bail(`leitura falhou (HTTP ${detail.res.status})`);
  }
  const analysis = detail.json?.data ?? detail.json;
  const result = analysis?.result ?? null;

  console.log("");
  // ── evaluate outcome ───────────────────────────────────────────────────────
  if (status === "COMPLETED") {
    ok("pipeline concluído com sucesso (COMPLETED)");
    if (result) {
      console.log(dim("  resumo:   ") + (result.summary ?? "—"));
      console.log(dim("  partes:   ") + (result.partiesCount ?? 0));
      console.log(dim("  riscos:   ") + (result.risksCount ?? 0));
      console.log(dim("  score:    ") + (result.score ?? "—"));
    }
    console.log(`\n${green("PASS")} — fluxo ponta-a-ponta validado.`);
    process.exit(0);
  }

  const noLlm =
    typeof message === "string" &&
    /provedor llm|openai_api_key/i.test(message);

  if (status === "FAILED" && noLlm && !REQUIRE_COMPLETED) {
    warn("pipeline marcado como FAILED por falta de provedor LLM");
    console.log(dim(`  mensagem: ${message}`));
    console.log(
      `\n${yellow("PASS (plumbing)")} — criação, upload, extração e persistência` +
        ` OK.\n  Defina ${green("OPENAI_API_KEY")} no .env.local para validar o` +
        ` pipeline completo (ou use --require-completed para exigir COMPLETED).`
    );
    process.exit(0);
  }

  fail(`estado terminal inesperado: ${status}`);
  if (message) console.log(dim(`  mensagem: ${message}`));
  if (result?.error) console.log(dim(`  erro: ${result.error}`));
  console.log(`\n${red("FAIL")} — o fluxo não concluiu como esperado.`);
  process.exit(1);
}

main().catch((error) => {
  fail(`erro inesperado: ${error?.message ?? error}`);
  process.exit(1);
});
