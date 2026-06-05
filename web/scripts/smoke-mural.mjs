#!/usr/bin/env node
/**
 * Smoke test rotas Mural (validação, sem chaves de IA).
 * Requer servidor: npm run dev:server
 */
const base = (process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:8787").replace(
  /\/$/,
  ""
);
const portalKey = (
  process.env.SMOKE_PORTAL_KEY ?? process.env.WEB_PORTAL_API_KEY ?? ""
).trim();

const headers = {
  "Content-Type": "application/json",
  ...(portalKey ? { "X-Portal-Key": portalKey } : {}),
};

async function main() {
  const health = await fetch(`${base}/api/health`);
  if (!health.ok) {
    console.error("Servidor indisponível. Inicie com npm run dev:server");
    process.exit(1);
  }

  const bad = await fetch(`${base}/api/mural/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt: "", references: [] }),
  });
  if (bad.status !== 500 && bad.status !== 400) {
    const t = await bad.text();
    console.error(`analyze vazio: esperado 4xx/5xx, got ${bad.status} ${t}`);
    process.exit(1);
  }
  console.log("ok /api/mural/analyze rejeita payload inválido");

  const noIdentity = await fetch(`${base}/api/mural/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt: "test",
      references: [
        {
          id: "e1",
          role: "environment",
          mimeType: "image/png",
          dataBase64: "iVBORw0KGgo=",
        },
      ],
    }),
  });
  if (noIdentity.ok) {
    console.error("analyze sem identity deveria falhar");
    process.exit(1);
  }
  console.log("ok /api/mural/analyze exige identity");

  const fakeJob = await fetch(`${base}/api/mural/jobs/00000000-0000-4000-8000-000000000000`, {
    headers: portalKey ? { "X-Portal-Key": portalKey } : {},
  });
  if (fakeJob.status !== 404) {
    console.error(`job inexistente: esperado 404, got ${fakeJob.status}`);
    process.exit(1);
  }
  console.log("ok /api/mural/jobs/:id (404)");

  const squads = await fetch(`${base}/api/squads`, {
    headers: portalKey ? { "X-Portal-Key": portalKey } : {},
  });
  if (squads.ok) {
    const list = await squads.json();
    const mural = list.find((s) => s.id === "mural-vida-extraordinaria");
    if (!mural) {
      console.error("squad mural-vida-extraordinaria não listado");
      process.exit(1);
    }
    console.log("ok mural-vida-extraordinaria em /api/squads");
  } else if (squads.status !== 401) {
    console.error(`/api/squads: ${squads.status}`);
    process.exit(1);
  } else {
    console.log("skip squad list (portal auth)");
  }

  console.log("smoke-mural: all checks passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
