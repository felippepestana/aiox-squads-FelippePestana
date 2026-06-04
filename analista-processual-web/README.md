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

Limitações conhecidas (modo demo):

- **Autenticação ainda não habilitada** — as análises são atribuídas a um perfil
  demo (`demo@analista-processual.local`), criado automaticamente.
- **Extração de texto** cobre formatos textuais (`.txt`, `.md`, `.csv`, `.json`,
  etc.), **PDF** (via `unpdf`) e **DOCX** (via `mammoth`). Formatos legados
  (`.doc`) e imagens exigem OCR e não são extraídos (a análise informa quais
  documentos não tiveram texto extraível).
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

### Desenvolvimento local no macOS (passo a passo)

Pré-requisitos: Node 20+ e Docker Desktop.

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

Teste o fluxo: **Dashboard → Nova Análise**, envie um `.txt`/`.pdf`/`.docx` e
acompanhe o resultado (resumo, partes, prazos e riscos). Para encerrar o banco:
`docker compose down` (use `-v` para apagar os dados).

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
- [x] Upload de documentos + extração de texto (texto, PDF e DOCX)
- [x] Fluxo de análise ponta-a-ponta (criar → processar → visualizar)
- [x] Dashboard e listagem com dados reais
- [ ] Autenticação (Supabase) — substituir o perfil demo
- [ ] OCR para `.doc` legado e imagens
- [ ] Biblioteca de jurisprudência (busca semântica)
- [ ] Fila/worker dedicado para processamento assíncrono

## Licença

MIT
