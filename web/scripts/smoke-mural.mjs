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

  // Functional compose check: in demo mode (no AI keys) this returns a real asset.
  const demoMode =
    process.env.MURAL_DEMO_MODE === "1" ||
    process.env.MURAL_DEMO_MODE === "true" ||
    (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY);
  if (demoMode) {
    const pixel =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const compose = await fetch(`${base}/api/mural/compose`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt: "Smoke demo: identidade na praia ao amanhecer",
        references: [
          { id: "x", role: "identity", mimeType: "image/png", dataBase64: pixel },
          { id: "y", role: "environment", mimeType: "image/png", dataBase64: pixel },
        ],
        options: { variants: 1 },
      }),
    });
    if (!compose.ok) {
      console.error(`compose demo: HTTP ${compose.status} ${await compose.text()}`);
      process.exit(1);
    }
    const job = await compose.json();
    if (job.status !== "completed" || !job.assets?.length) {
      console.error(`compose demo: status=${job.status} assets=${job.assets?.length}`);
      process.exit(1);
    }
    const asset = await fetch(`${base}${job.assets[0].url}`, {
      headers: portalKey ? { "X-Portal-Key": portalKey } : {},
    });
    if (!asset.ok) {
      console.error(`asset demo: HTTP ${asset.status}`);
      process.exit(1);
    }
    console.log(`ok /api/mural/compose (demo) gerou ${job.assets.length} asset(s)`);
  } else {
    console.log("skip compose funcional (chaves de IA presentes; evita custo)");
  }

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
