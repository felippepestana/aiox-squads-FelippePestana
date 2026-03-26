#!/usr/bin/env node
/**
 * Smoke test da API do portal (health, auth/status, squads).
 * Uso: servidor a correr em SMOKE_BASE_URL (padrão http://127.0.0.1:8787)
 *
 *   npm run test:smoke
 *
 * Se WEB_PORTAL_API_KEY estiver ativa no servidor, defina a mesma chave em
 * SMOKE_PORTAL_KEY ou WEB_PORTAL_API_KEY para validar /api/squads.
 */

const base = (process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:8787").replace(
  /\/$/,
  ""
);
const portalKey = (
  process.env.SMOKE_PORTAL_KEY ?? process.env.WEB_PORTAL_API_KEY ?? ""
).trim();

async function mustOk(res, label) {
  const text = await res.text();
  if (!res.ok) {
    console.error(`${label}: HTTP ${res.status} ${text.slice(0, 200)}`);
    process.exit(1);
  }
  return text;
}

async function main() {
  const health = await fetch(`${base}/api/health`);
  await mustOk(health, "/api/health");
  console.log("ok /api/health");

  const auth = await fetch(`${base}/api/auth/status`);
  const authBody = await mustOk(auth, "/api/auth/status");
  console.log("ok /api/auth/status", authBody);

  const squadHeaders = portalKey ? { "X-Portal-Key": portalKey } : {};
  const squads = await fetch(`${base}/api/squads`, { headers: squadHeaders });

  if (squads.status === 401) {
    if (portalKey) {
      console.error("/api/squads: 401 mesmo com SMOKE_PORTAL_KEY");
      process.exit(1);
    }
    const fakeSession = "00000000-0000-4000-8000-000000000000";
    const sessNoKey = await fetch(`${base}/api/sessions/${fakeSession}`);
    if (sessNoKey.status !== 401) {
      console.error(
        `/api/sessions/:id sem chave: com portal ativo esperado 401, recebido ${sessNoKey.status}`
      );
      process.exit(1);
    }
    console.log(
      "skip /api/squads (portal protegido; defina SMOKE_PORTAL_KEY para testar rotas completas)"
    );
    console.log("ok /api/sessions/:id (401 sem chave quando portal ativo)");
    return;
  }

  const squadsText = await mustOk(squads, "/api/squads");
  const data = JSON.parse(squadsText);
  if (!Array.isArray(data)) {
    console.error("/api/squads: resposta não é array");
    process.exit(1);
  }
  console.log(`ok /api/squads (${data.length} squad(s))`);

  const fakeSession = "00000000-0000-4000-8000-000000000000";
  const sessProbe = await fetch(`${base}/api/sessions/${fakeSession}`, {
    headers: squadHeaders,
  });
  if (sessProbe.status !== 404) {
    console.error(
      `/api/sessions/:id (inexistente): esperado 404, recebido ${sessProbe.status}`
    );
    process.exit(1);
  }
  console.log("ok /api/sessions/:id (404 para UUID inexistente)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
