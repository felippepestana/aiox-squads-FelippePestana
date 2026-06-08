# Analista Processual Web

Plataforma web de análise processual jurídica brasileira potenciada por multiagentes IA.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 3, componentes estilo shadcn/ui (Radix)
- **State:** Zustand, TanStack Query
- **Database:** PostgreSQL via Prisma (compatível com Supabase)
- **LLM Gateway:** OpenAI por padrão; provedores compatíveis com OpenAI
  (DeepSeek, Qwen, Kimi, MiniMax) habilitáveis via `*_API_KEY` + `*_BASE_URL`

## Estado atual (modo demo)

A plataforma funciona ponta-a-ponta para o fluxo principal: **criar análise →
enviar documentos → pipeline multiagente → visualizar resultado** (resumo,
partes, cronologia, pedidos, prazos e riscos).

A **autenticação (Supabase) é opcional e com degradação graciosa**:

- **Sem Supabase configurado → modo demo:** sem login; as análises são
  atribuídas a um perfil demo (`demo@analista-processual.local`), criado
  automaticamente. Ideal para desenvolvimento local e para o smoke test.
- **Com `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` → auth real:**
  o middleware protege as rotas `/dashboard`, as rotas de API exigem sessão
  (401 sem login) e as análises/prazos são atribuídos e filtrados pelo usuário
  autenticado. O login/cadastro fica em `/login`.

Limitações conhecidas (modo demo):

- **Extração de texto** cobre formatos textuais (`.txt`, `.md`, `.csv`, `.json`,
  etc.), **PDF com camada de texto** (via `unpdf`), **DOCX** (via `mammoth`),
  **imagens** (`.png`, `.jpg`, `.jpeg`, `.webp`, `.tiff`, `.bmp`) e **PDFs
  escaneados** via **OCR** (`tesseract.js` + rasterização com `@napi-rs/canvas`,
  idiomas `por+eng`). Formatos legados (`.doc`) ainda não são extraídos (a
  análise informa quais documentos não tiveram texto extraível, via
  `metadata.extractionMethod` / `metadata.needsOcr`).
- **Biblioteca de jurisprudência** ainda é placeholder.
- O processamento é executado de forma síncrona na rota `/api/analyses/[id]/process`
  (sem fila/worker dedicado).

## Arquitetura

### Agentes Especializados

| Agente | Função |
|--------|--------|
| Navegador | Indexa e organiza documentos |
| Extrator | Extrai dados estruturados |
| Calculador | Computa prazos processuais |
| Mapeador | Identifica riscos e oportunidades |
| Analista Chief | Consolida resultados |

### LLM Gateway

Sistema inteligente de seleção de modelos baseado em complexidade:

| Tier | Modelos | Uso |
|------|---------|-----|
| Budget | DeepSeek V3, Qwen, MiniMax | Tarefas simples |
| Standard | Kimi, GPT-4o-mini | Análise padrão |
| Premium | Claude 3.5, GPT-4o, Gemini 2.0 | Análise complexa |

## Getting Started

### 1. Clone e Instale

```bash
git clone https://github.com/felippepestana/analista-processual-web.git
cd analista-processual-web
npm install
```

### 2. Configure Ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas chaves
```

### 3. Configure Banco de Dados

```bash
npx prisma generate
npx prisma db push
npm run db:seed   # cria o perfil demo
```

### 4. Execute

```bash
npm run dev
```

> Defina ao menos `OPENAI_API_KEY` no `.env.local` para que o pipeline de
> análise execute. Sem provedor configurado, a análise é marcada como `FAILED`
> com uma mensagem explicativa (a aplicação não quebra).

### Desenvolvimento local (passo a passo)

Pré-requisitos em qualquer sistema: **Node 20+** e **Docker Desktop** (para o
Postgres local). Os passos são idênticos no macOS e no Windows — muda apenas a
sintaxe de como você define as variáveis de ambiente no terminal.

#### macOS / Linux (bash/zsh)

```bash
# 1. Subir um Postgres local (Docker Desktop)
docker compose up -d

# 2. Variáveis de ambiente
cp .env.example .env.local
# Em .env.local, defina:
#   DATABASE_URL="postgresql://analista:analista@localhost:5432/analista_processual"
#   OPENAI_API_KEY="sk-..."

# 3. Instalar e preparar o banco
npm install
npm run db:push
npm run db:seed

# 4. Rodar
npm run dev   # http://localhost:3000
```

#### Windows (PowerShell — Alienware)

```powershell
# 1. Subir um Postgres local (Docker Desktop para Windows precisa estar aberto)
docker compose up -d

# 2. Variáveis de ambiente
Copy-Item .env.example .env.local
# Edite .env.local (ex.: notepad .env.local) e defina:
#   DATABASE_URL="postgresql://analista:analista@localhost:5432/analista_processual"
#   OPENAI_API_KEY="sk-..."

# 3. Instalar e preparar o banco
npm install
npm run db:push
npm run db:seed

# 4. Rodar
npm run dev   # http://localhost:3000
```

> No Windows, use o **PowerShell** (não o `cmd.exe`). Se preferir o WSL2, siga as
> instruções de macOS/Linux dentro do WSL. O Docker Desktop precisa estar em
> execução antes do `docker compose up -d`.

Teste o fluxo manualmente: **Dashboard → Nova Análise**, envie um
`.txt`/`.pdf`/`.docx` e acompanhe o resultado (resumo, partes, prazos e riscos).
Para encerrar o banco: `docker compose down` (use `-v` para apagar os dados).

### Smoke test ponta-a-ponta (macOS e Windows)

Com o servidor rodando (`npm run dev`) em um terminal, execute em **outro
terminal** — o comando é o mesmo nos dois sistemas:

```bash
npm run test:smoke
```

O script (`scripts/smoke-test.mjs`, Node puro, sem dependências) exercita o fluxo
real contra `http://localhost:3000`:

1. cria a análise (`POST /api/analyses`);
2. envia um processo fictício de exemplo e extrai o texto
   (`scripts/fixtures/processo-exemplo.txt`);
3. roda o pipeline multiagente (`POST /api/analyses/:id/process`);
4. lê o resultado persistido (`GET /api/analyses/:id`).

Resultados possíveis:

- **PASS** — o pipeline concluiu (`COMPLETED`); imprime resumo, partes, riscos e score.
- **PASS (plumbing)** — criação/upload/extração/persistência OK, mas o pipeline
  foi marcado `FAILED` por falta de `OPENAI_API_KEY`. Útil para validar a
  infraestrutura sem consumir a API.
- **FAIL** — servidor inacessível, erro HTTP ou falha inesperada do pipeline.

Opções úteis:

```bash
npm run test:smoke -- --require-completed        # exige COMPLETED (requer chave LLM)
npm run test:smoke -- --base-url=http://host:porta
npm run test:smoke -- --file=./caminho/para/seu-processo.pdf
```

> No PowerShell o `--` extra do npm também funciona:
> `npm run test:smoke -- --require-completed`.

### Habilitando autenticação (Supabase)

Por padrão o app roda em modo demo. Para habilitar login real:

1. Crie um projeto no [Supabase](https://supabase.com) e habilite o provedor
   **Email/Password** em *Authentication → Providers*.
2. No `.env.local`, defina:
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (em *Project
     Settings → API*);
   - `DATABASE_URL` apontando para o Postgres do Supabase (ou seu Postgres local).
3. Reinicie o `npm run dev`. A partir daí:
   - rotas `/dashboard/*` exigem sessão (redirecionam para `/login`);
   - as rotas de API respondem `401` sem sessão;
   - cada usuário vê apenas as próprias análises e prazos.

O perfil é sincronizado automaticamente na tabela `profiles` no primeiro acesso
(o `id` do perfil espelha o `id` do usuário no Supabase). Sem essas variáveis, o
app volta ao modo demo sem nenhuma mudança de código.

## Deploy

### Hostinger VPS

1. Configure VPS com Docker
2. Clone o repositório
3. Execute `docker-compose up -d`
4. Configure Nginx como reverse proxy
5. Configure SSL com Let's Encrypt

### Vercel

Este app também está preparado para deploy na Vercel como projeto Next.js. Ao importar o repositório, configure:

- **Root Directory:** `analista-processual-web`
- **Framework Preset:** `Next.js`
- **Build Command:** `npm run build`

Veja o guia completo em [`../docs/deploy/vercel.md`](../docs/deploy/vercel.md), incluindo variáveis de ambiente e checklist de produção.

## Roadmap

- [x] Setup do projeto
- [x] Configuração de banco de dados (Prisma)
- [x] LLM Gateway com seleção de modelo ciente do provedor
- [x] Agentes implementados (Navegador, Extrator, Calculador, Mapeador, Chief)
- [x] Upload de documentos + extração de texto (texto, PDF, DOCX)
- [x] OCR para imagens e PDFs escaneados (tesseract.js + @napi-rs/canvas)
- [x] Fluxo de análise ponta-a-ponta (criar → processar → visualizar)
- [x] Dashboard e listagem com dados reais
- [x] Smoke test E2E cross-platform (`npm run test:smoke`, macOS e Windows)
- [x] Autenticação (Supabase) opcional com degradação graciosa — login/cadastro,
      proteção de rotas, atribuição/filtragem por usuário (fallback para modo demo)
- [ ] OCR para `.doc` legado (requer conversão prévia)
- [ ] Biblioteca de jurisprudência (busca semântica)
- [ ] Fila/worker dedicado para processamento assíncrono

## Licença

MIT
