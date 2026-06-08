# Ativar a persistência Supabase (Apex-Talent / talent-compass)

A feature de entrevista (`web/`) funciona **sem banco** — a persistência é *best-effort* e opcional. Para gravar de verdade (jobs, candidates, applications, interviews, scorecards, documents/minutas), basta configurar 2 variáveis de ambiente no **servidor**.

> ⚠️ **Nunca** commite a `service_role` key. Ela é secreta e dá acesso total (bypass de RLS). Use os mecanismos de *secret* da sua plataforma de deploy.

## Variáveis

| Variável | Onde usar | Valor | Segredo? |
|----------|-----------|-------|----------|
| `SUPABASE_URL` | servidor | `https://hlwdnwqcctslwjlzhfsz.supabase.co` | não |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor | Dashboard → Project Settings → **API** → `service_role` | **SIM** |
| `SUPABASE_ANON_KEY` | (opcional) | Dashboard → API → `anon`/publishable | não |

O servidor lê essas variáveis em [`web/server/db/client.ts`](server/db/client.ts). Se ausentes, `getDb()` retorna `null` e tudo segue funcionando sem gravar (`/api/interview/status` informa `dbEnabled: false`).

## Onde obter a `service_role` key

Supabase Dashboard → projeto **aiox-squads-FelippePestana** (`hlwdnwqcctslwjlzhfsz`) → **Project Settings → API** → seção *Project API keys* → `service_role` (clique em *Reveal*).

## Onde definir

### Local (dev)
Copie `web/.env.example` para `web/.env` e preencha:
```bash
SUPABASE_URL=https://hlwdnwqcctslwjlzhfsz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<cole_aqui>
```
`web/.env` está no `.gitignore` — não será commitado.

### Cloudflare Workers (deploy de produção)
Apenas a `service_role` é segredo; a URL é uma variável comum.
```bash
# na pasta web/ — somente a service_role como SECRET:
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```
A `SUPABASE_URL` (não-secreta) vai como `[vars]` no `wrangler.toml`:
```toml
[vars]
SUPABASE_URL = "https://hlwdnwqcctslwjlzhfsz.supabase.co"
```
Ou pelo dashboard: Workers & Pages → projeto → **Settings → Variables and Secrets**:
- `SUPABASE_URL` → tipo **Variable** (texto)
- `SUPABASE_SERVICE_ROLE_KEY` → tipo **Secret** (use exatamente esse nome)

### Railway
Project → **Variables** → `New Variable` para `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.

## Verificar que ativou

1. **Endpoint de status:** `GET /api/interview/status` deve retornar `{"dbEnabled": true}`.
2. **Fluxo real:** abra a feature 🎤 Entrevista, rode Vaga → Roteiro → Entrevista → Scorecard. A resposta de `/api/interview/score` traz `persisted: true` e `applicationId`/`scorecardId`.
3. **Confirme no banco** (SQL ou MCP):
   ```sql
   select count(*) from public.apex_talent_scorecards;
   select count(*) from public.apex_talent_documents;
   ```

## Segurança (já configurada na migration)

- **RLS org-scoped** em todas as tabelas `apex_talent_*` (via `apex_talent_current_org_id()`).
- `apex_talent_profiles`: usuários `authenticated` só editam `full_name` (sem pivot de `org_id`/`role`).
- Buckets de storage privados `apex-resumes` / `apex-documents`, namespaced por `org_id`.
- O servidor usa a `service_role` (bypass de RLS) e aplica o escopo de org explicitamente nos repositórios ([`web/server/db/repositories.ts`](server/db/repositories.ts)).
