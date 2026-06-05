---
name: analista-processual-web
description: Use ao desenvolver, rodar localmente, depurar ou fazer deploy do app analista-processual-web (Next.js 15 + Prisma + pipeline multiagente de análise jurídica brasileira). Cobre setup local no macOS (Postgres via Docker), variáveis de ambiente, o fluxo criar→upload→processar→visualizar, o LLM Gateway multi-provedor e armadilhas conhecidas (enum Prisma Urgency, conflito de rota '/', runtime dos parsers PDF/DOCX, provedores LLM, perfil demo).
---

# analista-processual-web

Plataforma Next.js (App Router) de análise processual jurídica brasileira com pipeline multiagente de IA. Esta skill resume como trabalhar no app com segurança.

## Quando usar
- Configurar/rodar o app localmente (macOS) ou depurar build/deploy.
- Alterar o fluxo de análise, rotas de API, extração de documentos ou o LLM Gateway.

## Arquitetura
- **Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind 3, Prisma → PostgreSQL (compatível com Supabase). Deploy alvo: Vercel.
- **Pipeline multiagente** (`src/lib/agents/`): Navegador → Extrator → Calculador → Mapeador → Chief (orquestrador). A saída rica é normalizada em `src/lib/analysis-runner.ts` para a forma que a UI lê (`summary`, `score`, `partiesCount`, `risksCount`, `risks[]`, `extractedData`).
- **LLM Gateway** (`src/lib/agents/llm-gateway.ts`): OpenAI por padrão; DeepSeek/Qwen/Kimi/MiniMax habilitáveis via `*_API_KEY` + `*_BASE_URL`. `selectModel` só escolhe modelos cujo provedor foi inicializado; `isConfigured()` evita falha silenciosa.

## Fluxo ponta-a-ponta
1. `POST /api/analyses` — cria a análise (status `PENDING`) e resolve o dono via perfil demo (`lib/demo-user.ts`, `resolveUserId`).
2. `POST /api/analyses/[id]/documents` — armazena o documento e extrai texto: `.txt`/textuais, **PDF** (via `unpdf`), **DOCX** (via `mammoth`). Runtime `nodejs`.
3. `POST /api/analyses/[id]/process` — roda o pipeline a partir dos documentos persistidos e grava `result`/`deadlines`/`events` dentro da request (seguro para serverless; `maxDuration=300`).
4. Página de detalhe faz **polling** enquanto `PENDING/PROCESSING` e mostra resultado, prazos, riscos e estado de falha.

## Setup local (macOS)
1. `docker compose up -d` (Postgres local via `docker-compose.yml`).
2. `cp .env.example .env.local` e defina:
   - `DATABASE_URL=postgresql://analista:analista@localhost:5432/analista_processual`
   - `OPENAI_API_KEY=sk-...`
3. `npm install && npm run db:push && npm run db:seed` (o seed cria o perfil demo).
4. `npm run dev` → http://localhost:3000. Teste em **Dashboard → Nova Análise** (envie .txt/.pdf/.docx).

## Deploy (Vercel)
- **Root Directory:** `analista-processual-web`. Configure `DATABASE_URL`, `OPENAI_API_KEY` e demais env. Rode `prisma db push` + seed contra o banco de produção.

## Armadilhas conhecidas (não repetir)
- **Enum Prisma:** `Deadline.urgency` deve ter default válido (`MEDIUM`); `NORMAL` não existe no enum `Urgency` e quebra `prisma generate`/build.
- **Conflito de rota:** não recriar `src/app/(dashboard)/page.tsx` — resolve para `/` junto com `src/app/page.tsx` (erro fatal no `next build`).
- **Parsers PDF/DOCX:** manter a rota de documentos no runtime `nodejs` e `serverExternalPackages: ["unpdf","mammoth"]` no `next.config.js`.
- **Sem provedor LLM:** a análise é marcada `FAILED` com mensagem clara — defina ao menos `OPENAI_API_KEY`.
- **Auth ainda não habilitada:** análises vão para o perfil demo; ao implementar Supabase, substituir `resolveUserId`.
- **Formatos não suportados:** `.doc` legado e imagens precisam de OCR (não extraídos) — documento é salvo e marcado como não-extraído.

## Validação antes de commitar
Execute e garanta que passam: `npx prisma generate` · `npx tsc --noEmit` · `next build`.
