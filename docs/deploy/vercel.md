# Deploy na Vercel

Este guia documenta o caminho recomendado para publicar os projetos web deste repositório na Vercel.

## Estado atual

| Projeto | Stack | Status para Vercel | Recomendação |
|---|---|---|---|
| `analista-processual-web` | Next.js 15 + App Router + Prisma + Supabase | Adequado para Vercel | Usar como projeto Vercel principal. |
| `web` | Express + Vite + SSE + upload | Requer adaptação | Manter em Docker/VPS ou refatorar API para rotas serverless antes de migrar. |
| `landing-pages/*` | Vite estático | Adequado para Vercel | Criar projetos separados se forem páginas públicas independentes. |

## Projeto recomendado: `analista-processual-web`

### Configuração na Vercel

Ao importar o repositório na Vercel:

| Campo | Valor |
|---|---|
| Framework Preset | `Next.js` |
| Root Directory | `analista-processual-web` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

O arquivo [`analista-processual-web/vercel.json`](../../analista-processual-web/vercel.json) fixa os comandos principais para evitar autodetecção incorreta.

## Variáveis de ambiente

Cadastre na Vercel em **Project Settings > Environment Variables**. Não commite valores reais.

### Obrigatórias

| Variável | Ambiente | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Preview + Production | URL pública do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Preview + Production | Chave anon pública do Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Preview + Production | Secret server-side; nunca expor no cliente. |
| `DATABASE_URL` | Preview + Production | Conexão Postgres usada pelo Prisma. |
| `NEXT_PUBLIC_APP_URL` | Preview + Production | URL pública do app; em produção usar domínio Vercel/custom domain. |
| `NEXTAUTH_SECRET` | Preview + Production | Gerar com `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Production | URL canônica de produção. |

### Conforme provedores habilitados

| Variável | Quando usar |
|---|---|
| `OPENAI_API_KEY` | Quando OpenAI estiver habilitado. |
| `ANTHROPIC_API_KEY` | Quando Anthropic estiver habilitado. |
| `DEEPSEEK_API_KEY` | Quando DeepSeek estiver habilitado. |
| `QWEN_API_KEY` | Quando Qwen estiver habilitado. |
| `KIMI_API_KEY` | Quando Kimi estiver habilitado. |
| `MINIMAX_API_KEY` | Quando MiniMax estiver habilitado. |
| `GEMINI_API_KEY` | Quando Gemini estiver habilitado. |
| `RESEND_API_KEY` | Quando envio de e-mail estiver habilitado. |
| `EMAIL_FROM` | Quando envio de e-mail estiver habilitado. |
| `STORAGE_BUCKET` | Quando armazenamento de documentos estiver habilitado. |
| `REDIS_URL` | Apenas se filas/background jobs forem usadas em runtime. |

## Deploy via Git Integration

Fluxo recomendado:

1. Conecte o repositório GitHub na Vercel.
2. Configure `Root Directory = analista-processual-web`.
3. Cadastre as variáveis de ambiente.
4. Faça push para uma branch para gerar Preview Deployment.
5. Valide o preview.
6. Faça merge em `main` para deploy de produção.

## Deploy via CLI

Use a CLI apenas depois de autenticar a conta/time correto:

```bash
cd analista-processual-web
vercel link
vercel pull --yes
vercel build
vercel deploy --prebuilt
```

Produção:

```bash
cd analista-processual-web
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

## CI com Vercel CLI

Se for necessário deploy por GitHub Actions, configure os secrets:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Padrão seguro:

```yaml
- name: Pull Vercel Environment
  run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

- name: Build
  run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

- name: Deploy
  run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Observação sobre o projeto `web`

O projeto [`web`](../../web/) é um servidor Express que também serve o bundle Vite e usa streaming SSE/upload. Esse formato roda bem em Docker/VPS, mas não é automaticamente equivalente a um app Vercel serverless.

Antes de migrar `web` para Vercel, escolha uma das abordagens:

1. **Refatorar API para Next.js/App Router** dentro de `analista-processual-web`.
2. **Criar funções serverless em `api/*`** e manter o frontend Vite como estático.
3. **Manter `web` em Docker/VPS** e usar Vercel apenas para o frontend público.

Para evitar regressões, não configure `web` como projeto Vercel de produção até essa decisão arquitetural ser feita.

## Checklist antes de produção

- [ ] Projeto Vercel aponta para `analista-processual-web`.
- [ ] Variáveis obrigatórias cadastradas em Preview e Production.
- [ ] `NEXT_PUBLIC_APP_URL` e `NEXTAUTH_URL` apontam para URLs corretas.
- [ ] `npm run build` passa localmente.
- [ ] Prisma gera client no build (`postinstall` já executa `prisma generate`).
- [ ] Preview deployment validado manualmente.
- [ ] Nenhuma chave real foi commitada.

## Limitação atual de automação

O MCP da Vercel precisa estar autenticado para que agentes consigam consultar ou alterar projetos diretamente. Para habilitar:

1. Autentique o servidor MCP Vercel no Cursor.
2. Reexecute a ação desejada.
3. Depois disso, será possível consultar projetos/deploys e validar status diretamente pela integração.
