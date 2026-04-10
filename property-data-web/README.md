# Property Data Web — Plataforma de Levantamento Imobiliario

## Sobre

Property Data Web e a interface web da squad **Property Data** do framework AIOX. A plataforma permite realizar levantamentos imobiliarios completos, orquestrando 10 agentes de IA especializados que analisam documentacao, legislacao, aspectos urbanisticos, ambientais e mercadologicos de um imovel, gerando relatorios profissionais em formato PDF/Markdown.

## Stack Tecnologico

- **Framework:** Next.js 15 (App Router)
- **Estilizacao:** Tailwind CSS 4
- **Autenticacao e Storage:** Supabase (Auth + Storage)
- **ORM:** Prisma
- **Multi-LLM:** Suporte a Anthropic (Claude), OpenAI (GPT), Google (Gemini) e DeepSeek
- **Linguagem:** TypeScript (ES2022, strict mode)

## Pre-requisitos

- Node.js 20+ (recomendado: 22 LTS)
- Projeto Supabase configurado (Auth habilitado, bucket de storage criado)
- Pelo menos uma API key de LLM (Anthropic, OpenAI, Gemini ou DeepSeek)
- Docker e Docker Compose (para deploy em producao)

## Configuracao

Copie o arquivo `.env.example` para `.env.local` e preencha as variaveis:

| Variavel | Descricao |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anonima (anon key) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de servico do Supabase (server-side apenas) |
| `DATABASE_URL` | String de conexao PostgreSQL (Supabase ou externo) |
| `API_KEY_ENCRYPTION_SECRET` | Segredo para encriptar API keys dos usuarios |
| `ANTHROPIC_API_KEY` | API key da Anthropic (Claude) |
| `OPENAI_API_KEY` | API key da OpenAI (opcional) |
| `GEMINI_API_KEY` | API key do Google Gemini (opcional) |
| `DEEPSEEK_API_KEY` | API key do DeepSeek (opcional) |
| `SQUADS_ROOT` | Caminho para o diretorio de squads (padrao: `../squads`) |

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Aplicar schema do banco de dados
npx prisma db push

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor estara disponivel em `http://localhost:3000`.

## Producao

### Docker

O deploy em producao utiliza Docker com standalone output do Next.js:

```bash
# Na raiz do repositorio
docker compose --profile property-web up -d --build
```

A aplicacao estara disponivel na porta configurada em `PROPERTY_WEB_PORT` (padrao: 3001).

### Health Check

O endpoint `/api/health` retorna o status do servico e e utilizado pelo Docker para monitoramento automatico.

## Funcionalidades

- **Upload de documentos** — Envie matriculas, IPTU, escrituras e outros documentos do imovel
- **Analise multi-agente** — Pipeline de 10 agentes especializados processam os dados em paralelo
- **Relatorios profissionais** — Geracao de relatorios em Markdown/PDF com template personalizavel
- **Suporte multi-LLM** — Escolha entre Claude, GPT, Gemini ou DeepSeek para cada analise
- **Gerenciamento de propriedades** — Dashboard para acompanhar todas as analises em andamento
- **Modo LAUDO ABNT** — Geracao de laudos de avaliacao seguindo normas ABNT NBR 14653
- **Autenticacao completa** — Login, registro e protecao de rotas via Supabase Auth

## Arquitetura

O pipeline de analise e orquestrado pelo agente **Chief (Tier 0)** e executa os seguintes agentes em sequencia:

1. **Leitor Documental** (Tier 1) — Extrai dados estruturados dos documentos enviados
2. **Pesquisador Registral** (Tier 1) — Consulta e valida informacoes registrais
3. **Analista Legislativo** (Tier 1) — Identifica legislacao aplicavel ao imovel
4. **Analista Urbanistico** (Tier 1) — Avalia parametros urbanisticos e zoneamento
5. **Analista Visual** (Tier 2) — Processa imagens satelite e dados geoespaciais
6. **Avaliador de Imovel** (Tier 1) — Estima valor de mercado com metodologia ABNT
7. **Analista Ambiental** (Tier 2) — Verifica restricoes e passivos ambientais
8. **Analista Condominial** (Tier 2) — Analisa documentacao condominial quando aplicavel
9. **Relator Imobiliario** (Tier 1) — Consolida todos os dados em relatorio final
10. **Quality Gate** (Tier 3) — Valida consistencia e completude do relatorio

## Licenca

Este projeto faz parte do ecossistema AIOX Squads. Consulte o arquivo `LICENSE` na raiz do repositorio para detalhes.
