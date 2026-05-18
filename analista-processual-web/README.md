# Analista Processual Web

Plataforma web de análise processual jurídica brasileira potenciada por multiagentes IA.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, Shadcn/UI
- **State:** Zustand, TanStack Query
- **Database:** Supabase (PostgreSQL)
- **LLM Gateway:** Multi-provider (OpenAI, Anthropic, DeepSeek, Qwen, Kimi, MiniMax, Gemini)

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
```

### 4. Execute

```bash
npm run dev
```

## Deploy

### Hostinger VPS

1. Configure VPS com Docker
2. Clone o repositório
3. Execute `docker-compose up -d`
4. Configure Nginx como reverse proxy
5. Configure SSL com Let's Encrypt

## Roadmap

- [x] Setup do projeto
- [x] Configuração de banco de dados
- [x] LLM Gateway com seleção inteligente
- [x] Agente Navegador implementado
- [ ] Agentes restantes (Extrator, Calculador, Mapeador)
- [ ] Upload de documentos
- [ ] Interface de análise
- [ ] Biblioteca de jurisprudência
- [ ] Deploy em produção

## Licença

MIT
