# Deploy — Legendários TOP (v0.1.0)

Sistema operacional de triagem médica para eventos. Stack: Next.js 15 (App
Router) + Supabase (PostgreSQL/Storage), deploy na **Netlify** (`netlify.toml`
já configurado, com `@netlify/plugin-nextjs`).

> O build já foi validado localmente. Este guia cobre o que depende das suas
> credenciais.

---

## Variáveis de ambiente

| Variável | Obrigatória? | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Cliente Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Cliente Supabase (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Uploads em buckets privados (server-only — nunca expor) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Links de WhatsApp, e-mail e QR codes |
| `EVOLUTION_API_URL` | ⬜ opcional | WhatsApp via Evolution API |
| `EVOLUTION_API_KEY` | ⬜ opcional | WhatsApp via Evolution API |
| `EVOLUTION_INSTANCE` | ⬜ opcional | Instância da Evolution API |

Sem as variáveis `EVOLUTION_*`, os envios de WhatsApp são ignorados
silenciosamente — o resto do app funciona normalmente. Referência completa em
[`.env.example`](.env.example).

---

## Passo 1 — Supabase

1. Crie um projeto em <https://supabase.com/dashboard>.
2. Em **Project Settings → API**, copie `Project URL`, a chave `anon public` e a
   `service_role` (secreta).
3. Aplique o schema. As migrations versionadas estão em
   [`supabase/migrations/`](supabase/migrations/). Com a [Supabase CLI](https://supabase.com/docs/guides/cli):

   ```bash
   cd legendarios-top
   supabase link --project-ref <project-ref>
   supabase db push        # aplica supabase/migrations/*.sql em ordem
   ```

   Alternativa sem CLI: cole o conteúdo de cada arquivo `supabase/migrations/*.sql`
   (na ordem numérica) no **SQL Editor** do Supabase.
4. Confirme no **Storage** que o bucket privado de exames existe (criado pela
   migration `006_private_storage.sql`).

---

## Passo 2 — Netlify

1. Em <https://app.netlify.com>, **Add new site → Import an existing project** e
   selecione o repositório.
2. **Base directory:** `legendarios-top` (o app é um subdiretório do monorepo).
   O `netlify.toml` já define `command = npm run build`, `publish = .next`,
   `NODE_VERSION = 20` e o plugin `@netlify/plugin-nextjs`.
3. Em **Site settings → Environment variables**, adicione as variáveis
   **obrigatórias** acima (e as `EVOLUTION_*` se for usar WhatsApp).
4. **Deploy**.

---

## Passo 3 — (Opcional) WhatsApp via Evolution API

Se for enviar mensagens aos senderistas, provisione uma instância da
[Evolution API](https://doc.evolution-api.com/) e configure `EVOLUTION_API_URL`,
`EVOLUTION_API_KEY` e `EVOLUTION_INSTANCE`.

---

## Passo 4 — Verificação

- A home (`/`) e a triagem pública (`/triagem`) carregam.
- O portal Hakuna (`/hakuna/login`) autentica.
- Upload de exame (`/exames/[token]`) grava no bucket (exige
  `SUPABASE_SERVICE_ROLE_KEY`).

---

## Nota

O build estava bloqueado por um conflito de dependências (`next@15.0.3` não
aceitava `react@19` estável). Resolvido subindo `next`/`eslint-config-next` para
`^15.1.0`; `npm install` e `next build` passam.
