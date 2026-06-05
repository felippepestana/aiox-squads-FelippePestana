#!/usr/bin/env node
/**
 * Mural Da Vida Extraordinária — CLI de composição
 * Chama POST /api/mural/compose no portal web.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function usage() {
  console.error(`Uso: mural-compose.mjs [opções]

Opções:
  --prompt <texto>       Prompt da cena (obrigatório)
  --identity <arquivo>   Ref identity (obrigatório, repetível)
  --environment <arquivo>  Ref environment
  --activity <arquivo>   Ref activity
  --body-pose <arquivo>  Ref body_pose
  --style <arquivo>      Ref style
  --location <arquivo>   Ref location
  --variants <n>         1-4 (padrão 1)
  --out <dir>            Diretório para manifesto local
  --base <url>           API base (padrão http://127.0.0.1:8787)
  --async                Job assíncrono (poll até concluir)
  --portal-key <key>     X-Portal-Key se WEB_PORTAL_API_KEY ativo
`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = {
    prompt: "",
    refs: [],
    variants: 1,
    out: "",
    base: process.env.MURAL_API_BASE ?? "http://127.0.0.1:8787",
    async: false,
    portalKey: process.env.WEB_PORTAL_API_KEY ?? process.env.SMOKE_PORTAL_KEY ?? "",
  };

  const roleMap = {
    "--identity": "identity",
    "--environment": "environment",
    "--activity": "activity",
    "--body-pose": "body_pose",
    "--style": "style",
    "--location": "location",
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--async") {
      opts.async = true;
      continue;
    }
    if (a === "--help" || a === "-h") usage();
    if (a === "--prompt") {
      opts.prompt = argv[++i] ?? "";
      continue;
    }
    if (a === "--variants") {
      opts.variants = Number(argv[++i] ?? "1");
      continue;
    }
    if (a === "--out") {
      opts.out = argv[++i] ?? "";
      continue;
    }
    if (a === "--base") {
      opts.base = argv[++i] ?? opts.base;
      continue;
    }
    if (a === "--portal-key") {
      opts.portalKey = argv[++i] ?? "";
      continue;
    }
    const role = roleMap[a];
    if (role) {
      const filePath = argv[++i];
      if (!filePath) usage();
      opts.refs.push({ role, filePath });
    }
  }

  return opts;
}

function mimeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function loadRef(role, filePath, index) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Arquivo não encontrado: ${abs}`);
  }
  const buf = fs.readFileSync(abs);
  const mimeType = mimeForFile(abs);
  return {
    id: `${role}-${index}`,
    role,
    mimeType,
    dataBase64: buf.toString("base64"),
  };
}

async function apiFetch(url, opts) {
  const r = await fetch(url, opts);
  const text = await r.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { error: text };
  }
  if (!r.ok) {
    throw new Error(body.error ?? text ?? `HTTP ${r.status}`);
  }
  return body;
}

async function pollJob(base, jobId, headers) {
  for (let i = 0; i < 120; i++) {
    const job = await apiFetch(`${base}/api/mural/jobs/${jobId}`, { headers });
    if (job.status === "completed" || job.status === "failed") {
      return job;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Timeout aguardando job");
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!opts.prompt.trim()) {
    console.error("Erro: --prompt é obrigatório");
    usage();
  }
  const identityRefs = opts.refs.filter((r) => r.role === "identity");
  if (identityRefs.length === 0) {
    console.error("Erro: ao menos --identity é obrigatório");
    process.exit(1);
  }

  const references = opts.refs.map((r, i) =>
    loadRef(r.role, r.filePath, i)
  );

  const headers = { "Content-Type": "application/json" };
  if (opts.portalKey) headers["X-Portal-Key"] = opts.portalKey;

  const body = {
    prompt: opts.prompt,
    references,
    options: { variants: opts.variants },
  };

  const composeUrl = opts.async
    ? `${opts.base}/api/mural/compose?async=1`
    : `${opts.base}/api/mural/compose`;

  const initial = await apiFetch(composeUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const job = opts.async
    ? await pollJob(opts.base, initial.jobId, headers)
    : initial;

  if (job.status === "failed") {
    console.error("Job falhou:", job.error);
    process.exit(1);
  }

  console.log(JSON.stringify(job, null, 2));

  if (opts.out) {
    fs.mkdirSync(opts.out, { recursive: true });
    const manifestPath = path.join(opts.out, `mural-${job.id}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(job, null, 2));
    console.error(`Manifesto local: ${manifestPath}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
