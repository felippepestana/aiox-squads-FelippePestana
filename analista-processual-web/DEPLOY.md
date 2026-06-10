# Deploy — Analista Processual Web (v0.1.0)

Guia passo a passo para colocar a **primeira versão** no ar. Stack: Next.js 15 +
Supabase (PostgreSQL) + Prisma, deploy na **Vercel** (`vercel.json` já configurado).

> O build já está validado e protegido por CI
> (`.github/workflows/analista-processual-web.yml`). Este guia cobre só o que
> depende das suas credenciais.

---

## Variáveis de ambiente

Apenas o conjunto abaixo é **lido pelo código** hoje. Foque nas obrigatórias.

### Obrigatórias

| Variável | Para quê | Onde obter |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente Supabase (browser) | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase (browser) | Supabase → Project Settings → API → `anon` `public` |
| `DATABASE_URL` | Prisma (PostgreSQL) | Supabase → Project Settings → Database → Connection string |
| **≥1 chave de LLM** | Motor de análise | Provider escolhido (ver abaixo) |

Chaves de LLM aceitas (o gateway só ativa as que existirem — basta **uma**):
`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`,
`QWEN_API_KEY`, `KIMI_API_KEY`, `MINIMAX_API_KEY`.

### Opcionais (constam no `.env.example`, mas ainda não são lidas pelo código)

`SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `REDIS_URL`,
`RESEND_API_KEY`, `EMAIL_FROM`, `STORAGE_BUCKET`, `NEXT_PUBLIC_APP_URL`.
Configure conforme for ativando esses recursos.

---

## Passo 1 — Criar o projeto Supabase

1. Crie um projeto em <https://supabase.com/dashboard>.
2. Em **Project Settings → API**, copie `Project URL` e a chave `anon public`.
3. Em **Project Settings → Database → Connection string**, copie:
   - **Session** (porta `5432`) — use para o `prisma db push` (passo 2).
   - **Transaction / pooler** (porta `6543`) — recomendada para o runtime na
     Vercel (serverless); acrescente `?pgbouncer=true&connection_limit=1`.

---

## Passo 2 — Provisionar o schema no banco

Não há migrations versionadas; use `prisma db push`. Rode **localmente** apontando
para o banco de produção (conexão direta, porta `5432`):

```bash
cd analista-processual-web
export DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJECT].supabase.co:5432/postgres"
npm ci
npm run db:push       # prisma db push — cria as tabelas
```

Verifique no Supabase → **Table Editor** que as tabelas (`analyses`, `deadlines`,
…) foram criadas.

> Dica: rode `./scripts/check-deploy-env.sh` antes para conferir as variáveis.

---

## Passo 3 — Importar e configurar na Vercel

1. Em <https://vercel.com/new>, importe o repositório.
2. **Root Directory:** selecione `analista-processual-web` (o app é um subdiretório).
   O framework (Next.js), `installCommand` (`npm install`) e `buildCommand`
   (`npm run build`) vêm do `vercel.json`.
3. Em **Settings → Environment Variables** (Production), adicione as variáveis
   **obrigatórias** acima. Para o `DATABASE_URL` da Vercel, prefira a string do
   **pooler** (porta `6543`, com `?pgbouncer=true&connection_limit=1`).

---

## Passo 4 — Deploy e verificação

1. **Deploy** (botão na Vercel, ou `vercel --prod` via CLI).
2. Após o deploy, valide:
   - A home (`/`) e `/dashboard` carregam.
   - `/dashboard/nova-analise` cria uma análise (exercita o LLM gateway — exige
     a chave de LLM válida).
3. Em caso de erro 500 ligado a banco/Supabase, reconfira `DATABASE_URL` e as
   `NEXT_PUBLIC_SUPABASE_*`.

---

## Passo 5 — (Opcional) Monitoramento

Documentos já existentes na raiz do repositório:
`SENTRY_KEYS_SETUP.md`, `UPTIMEROBOT_QUICK_START.md`, `GA4_QUICK_START.md`.
Não bloqueiam o deploy da v1; configure quando quiser observabilidade.

---

## Notas

- O bloqueador de build (default inválido `urgency @default(NORMAL)` no Prisma)
  já foi corrigido; o CI roda `prisma generate` + `next build` a cada PR para
  impedir que volte.
- O build **não** exige as variáveis em tempo de compilação (as rotas que usam
  Supabase são dinâmicas), então o build da Vercel passa mesmo antes de você
  preencher os segredos — eles são necessários em **runtime**.
