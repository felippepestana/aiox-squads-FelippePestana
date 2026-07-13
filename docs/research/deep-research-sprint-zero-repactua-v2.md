# Deep Research — Fundação Técnica do Sprint Zero (REPACTUA v2)

> Relatório de pesquisa multi-fonte para embasar as decisões do Sprint Zero (blueprint §C1).
> Data da pesquisa: 13/07/2026. Metodologia: 6 frentes de pesquisa paralelas (~160 buscas/fetches no total),
> afirmações cruzadas em ≥2 fontes independentes sempre que possível; itens de fonte única estão marcados.
> Confiança indicada por achado: **alta** / média / baixa.

---

## Sumário executivo

1. **Monorepo:** pnpm workspaces + uv workspaces coexistem sem atrito (planos de controle independentes). Orquestração recomendada: **Turborepo** com `package.json` wrapper nos pacotes Python. **Schema: a fonte única deve ser Zod (TS) → JSON Schema nativo (`z.toJSONSchema()`, Zod v4) → Pydantic v2 via datamodel-code-generator** — é a única direção em que todos os elos são first-party ou ativamente mantidos em 2026 (o caminho JSON Schema → Zod está quebrado: json-schema-to-zod foi arquivado). Dinheiro **sempre como string decimal** no wire.

2. **API → Engine Python:** o caminho recomendado é **Worker (TS) como camada de API/auth/409 chamando via HTTP síncrono um container CPython (FastAPI + engine Decimal)** em Cloud Run/Fly.io (região São Paulo) ou Cloudflare Containers (GA abr/2026, opção "provedor único"). **Python Workers (Pyodide) seguem em open beta** e rodar cálculo bancário correctness-critical sobre CPython-em-Wasm é risco desnecessário; Supabase Edge Functions é só Deno (inviável para Python). **pgmq** (já dentro do Postgres do Supabase) como complemento para recálculos em lote.

3. **LangGraph:** 1.0 GA (out/2025), estável até 2.0 — escolha correta mantida. **Não usar a lib `langgraph-supervisor`** (os próprios mantenedores desaconselham); supervisor hand-rolled com roteamento determinístico por conditional edges, `Send` API para fan-out por documento. HITL via `interrupt()` em **nó dedicado só de aprovação** — side effects sempre em nó posterior (o nó re-executa inteiro no resume). Checkpointer `AsyncPostgresSaver` no Supabase **via session pooler/conexão direta (porta 5432), nunca o transaction pooler (6543)**.

4. **Parâmetros normativos:** bitemporal "leve" — valid time nativo do Postgres 18 (`WITHOUT OVERLAPS`) ou `EXCLUDE USING gist` em PG <18; transaction time via trigger; **snapshot JSONB congelado por cálculo + SHA-256** (a engine lê só do snapshot após o freeze). Golden tests: **pytest-regressions**, comparação byte a byte sobre `Decimal` serializado como string canônica; **Hypothesis** para invariantes. Atenção às atualizações do domínio: Res. CMN 4.881/2020 (CET, revogou a 3.517), Lei 14.905/2024 (nova taxa legal SELIC−IPCA, Res. CMN 5.171/2024) e REsp 2.086.650/MG (2025: capitalização infra-anual vedada no SFI mesmo pactuada).

5. **RLS/auditoria/LGPD:** membership por caso em tabela de junção + função `SECURITY DEFINER` (evita recursão), `(select auth.uid())` nas políticas (initPlan, até 99,9% de ganho), índices nas colunas de política, pgTAP + `supabase test db` como quality gate. Auditoria: trigger genérico próprio (supa_audit foi **arquivado** em fev/2025), REVOKE UPDATE/DELETE + hash chain HMAC + ancoragem externa diária. LGPD: pseudonimização via gateway obrigatório (Presidio + NER LeNER-Br pt-BR + regex CPF/CNPJ/OAB/nº CNJ), tokens estáveis com mapa local sob RLS; **dado pseudonimizado continua dado pessoal** — ZDR + DPA com o provedor de LLM seguem obrigatórios (Recomendação OAB 001/2024: ciência formal do cliente).

6. **DataJud/TPU:** API pública ativa, best-effort, chave pública **rotacionável sem aviso** (tratar como secret externo), limite de 10k por paginação (`search_after` acima disso), rate limit não documentado (~10 req/min piso conservador). **Nenhum cliente OSS maduro — construir cliente próprio fino.** TPU: semear dos **dumps versionados do SGT** (Excel/SQL), não da API; "vertical jurídica" = ancestral nível 1 da árvore de assuntos + tabela própria de mapeamento.

---

## 1. Monorepo poliglota (pnpm + uv) e schema como fonte única

### 1.1 Coexistência pnpm × uv

- uv workspaces e pnpm workspaces **coexistem sem conflito** — manifestos e lockfiles independentes na raiz (`pnpm-workspace.yaml`+`pnpm-lock.yaml`; `pyproject.toml` `[tool.uv.workspace]`+`uv.lock`); `packages/*` pode aparecer nos dois, cada pacote entra só no workspace da sua linguagem. Confiança: **alta**. [pnpm.io/workspaces](https://pnpm.io/workspaces) · [docs.astral.sh/uv/concepts/projects/workspaces](https://docs.astral.sh/uv/concepts/projects/workspaces/) · [uv#10960](https://github.com/astral-sh/uv/issues/10960)
- Pitfalls do uv workspace (confiança **alta**): lockfile único (versões conflitantes entre membros quebram a resolução — usar path dependencies nesses casos); `requires-python` = interseção de todos os membros; `.venv` compartilhado **não isola imports** (phantom dependencies em Python — o que o pnpm evita no lado JS). [pydevtools.com handbook](https://pydevtools.com/handbook/how-to/how-to-set-up-a-python-monorepo-with-uv-workspaces/) · [dev.to/aws uv workspace](https://dev.to/aws/3-things-i-wish-i-knew-before-setting-up-a-uv-workspace-30j6)

### 1.2 Orquestração de tasks

| Opção | Estado 2026 | Trade-off |
|---|---|---|
| **Turborepo** | Orquestra Python via `package.json` wrapper (`"test": "uv run pytest"`); não infere grafo Python — dependências via `workspace:*` e `inputs`/`outputs` manuais no `turbo.json` | Menor atrito em repo TS-dominante; cache exige configurar `inputs` com `**/*.py`, `pyproject.toml`, `uv.lock` |
| Nx + `@nxlv/python` | Suporte mais completo a uv: detecção automática, grafo inferido de `[tool.uv.sources]`, `affected`, Nx Cloud | Complexidade e acoplamento ao ecossistema Nx |
| moonrepo | Poliglota por design, mas toolchain Python/uv ainda `unstable_` | Evitar por ora |
| just/make | Cola simples, sem cache/affected | Complemento, não orquestrador |

Fontes: [turborepo discussão #1077](https://github.com/vercel/turborepo/discussions/1077) · [@nxlv/python](https://www.npmjs.com/package/@nxlv/python) · [moon v1.32](https://moonrepo.dev/blog/moon-v1.32) · [monorepo.tools](https://monorepo.tools/compare). CI: `astral-sh/setup-uv` com `enable-cache: true` + `setup-node` com `cache: pnpm` + remote cache do orquestrador (camadas complementares — confiança **alta**).

### 1.3 Schema única fonte → Pydantic + Zod (o achado mais decisivo)

O tooling 2025-2026 é **assimétrico**:

- **JSON Schema → Pydantic v2: forte.** datamodel-code-generator ativo (v0.68.1, jul/2026), recomendado na doc oficial do Pydantic. Confiança: **alta**. Ressalva: bugs conhecidos com discriminated unions ([#1769](https://github.com/koxudaxi/datamodel-code-generator/issues/1769), [#1921](https://github.com/koxudaxi/datamodel-code-generator/issues/1921), [#1937](https://github.com/koxudaxi/datamodel-code-generator/issues/1937)) — testar as unions geradas.
- **JSON Schema → Zod: quebrado.** [json-schema-to-zod foi arquivado](https://github.com/StefanTerdell/json-schema-to-zod) (~jun/2026); quicktype não gera Pydantic e tem bugs no caminho Zod. Confiança: **alta**.
- **Zod → JSON Schema: nativo e first-party.** Zod v4 `z.toJSONSchema()` (o pacote comunitário zod-to-json-schema foi descontinuado por virar recurso nativo). Confiança: **alta**. [zod.dev/json-schema](https://zod.dev/json-schema)
- **Pydantic como fonte: enfraquecido.** Pitfall crítico: Pydantic v2 emite JSON Schema draft 2020-12 e serializa `Decimal` com constraints como `anyOf: [number, string]` com limites em float ([pydantic#11342](https://github.com/pydantic/pydantic/issues/11342)) — contaminaria o contrato financeiro com float. pydantic-to-typescript está inativo; pydantic2zod é nicho. Confiança: **alta**.
- TypeSpec 1.0 GA existe, mas emitter Zod é third-party e não há emitter Pydantic first-party — DSL extra sem ganho aqui. Confiança: **alta** (GA) / média (emitter).

**Recomendação:** `packages/schema` com **Zod como fonte** → gerar (1) JSON Schema 2020-12 commitado (contrato auditável) e (2) Pydantic v2 via datamodel-code-generator commitado em `packages/engine`, com check de drift no CI (`git diff --exit-code` após regenerar). **Dinheiro como string decimal no wire** (Pydantic v2 já serializa `Decimal` como string em JSON — [#7457](https://github.com/pydantic/pydantic/issues/7457); no Zod, `z.string().regex()` branded `Money`); datas ISO 8601 (`z.iso.date()`). Golden test de round-trip Pydantic↔JSON↔Zod no CI para as unions discriminadas.

---

## 2. Cloudflare Workers → engines Python

### 2.1 Opções avaliadas (estado em jul/2026)

**(a) Cloudflare Python Workers (Pyodide).** Rodam CPython compilado para WebAssembly dentro de um isolate V8, versão pinada por `compatibility_date`. Evoluíram muito: Pydantic, FastAPI e NumPy oficialmente suportados; **stdlib `decimal` disponível com a implementação C (`_decimal`) compilada para Wasm, funcionalidade idêntica ao CPython**; cold start ~1s com memory snapshots (dez/2025); CPU até 5 min no plano pago. **Porém seguem em open beta (sem GA até jul/2026)** — e rodar um motor de cálculo bancário correctness-critical sobre CPython-em-Wasm introduz uma variável de correção desnecessária, além de quebrar a paridade teste local (CPython) × produção (Pyodide). Confiança: **alta** (capacidades) / média (status beta). [how python workers work](https://developers.cloudflare.com/workers/languages/python/how-python-workers-work/) · [python stdlib](https://developers.cloudflare.com/workers/languages/python/stdlib/) · [cold start improvements](https://developers.cloudflare.com/changelog/post/2025-12-08-python-cold-start-improvements/) · [python-workers-examples](https://github.com/cloudflare/python-workers-examples)

**(b) Cloudflare Containers.** **GA desde 13/abr/2026** (beta desde jun/2025). Worker roteia para o container via binding de Durable Object; instance types de `lite` (256 MiB) a `standard-4` (4 vCPU/12 GiB); preço dentro do Workers Paid US$ 5/mês com uso incluso (25 GiB-h memória, 375 vCPU-min; cobrança só com container acordado, dorme via `sleepAfter`). Contras: ~1 ano de GA, conceito DO extra, **sem região garantida no Brasil** (latência até o Supabase). Confiança: **alta**. [containers GA](https://developers.cloudflare.com/changelog/post/2026-04-13-containers-sandbox-ga/) · [pricing](https://developers.cloudflare.com/workers/platform/pricing/)

**(c) Serviço externo containerizado (Cloud Run / Fly.io / Railway / Render).** CPython real, maturidade operacional de anos, deploy trivial de FastAPI, scale-to-zero (Cloud Run nativo; Fly `auto_stop_machines`, cold start ~300ms–2s), **região São Paulo disponível** (Cloud Run `southamerica-east1`, Fly `gru`) — perto do Supabase. Custo ~US$ 0–7/mês em tráfego baixo. O Worker pode aguardar o fetch sem limite de subrequest (espera de I/O não consome CPU time) — **proxy síncrono de cálculo de 1–10s é plenamente suportado**; auth via bearer secret (Workers Secrets) ou Cloudflare Access service token. Confiança: **alta** (limites do Worker) / média (preços/cold starts de PaaS). [workers limits](https://developers.cloudflare.com/workers/platform/limits/) · [comparativo PaaS](https://techsy.io/en/blog/railway-vs-render-vs-fly-io)

**(d) Supabase Edge Functions.** Exclusivamente Deno (TS/JS) — **sem caminho nativo para Python**; descartar (o papel de intermediário o Worker já cumpre). Confiança: **alta**. [supabase functions](https://supabase.com/docs/guides/functions)

**(e) Fila assíncrona.** Cloudflare Queues tem pull consumers HTTP (worker Python externo pode consumir; 5.000 msgs/s, US$ 0,40/milhão). Mas a opção Postgres-nativa **pgmq** (base do Supabase Queues, extensão no próprio Postgres do projeto, com cliente Python) é a mais alinhada ao stack — zero infra nova. Para o fluxo síncrono de 1–10s, fila adiciona latência de polling e complexidade de UX — **complemento** (recálculos em lote, reprocessamento por versão de motor), não caminho principal. Confiança: **alta**. [queues pull consumers](https://developers.cloudflare.com/queues/configuration/pull-consumers/) · [supabase queues/pgmq](https://supabase.com/docs/guides/queues/pgmq)

### 2.2 Determinismo e reprodutibilidade

Containers dão o pinning mais forte: **imagem Docker por digest (sha256) + `uv.lock` + versão exata do CPython no Dockerfile**. Prática para a trilha de auditoria: gravar em cada cálculo `engine_version` (semver), digest da imagem e hash dos inputs — qualquer cálculo antigo é reproduzível bit a bit re-executando a imagem correspondente (complementa o snapshot de parâmetros da §4.1). Python Workers também pinam runtime (`compatibility_date` + vendoring), mas sobre Pyodide. Confiança: **alta**.

### 2.3 Ranking para o REPACTUA v2

1. **Serviço containerizado externo (Cloud Run `southamerica-east1` ou Fly.io `gru`) chamado do Worker via HTTP + bearer secret** — CPython real, zero risco Pyodide, scale-to-zero, região BR. Custo: um segundo provedor no stack.
2. **Cloudflare Containers** — empate técnico próximo; escolher se o time preferir provedor/deploy único (`wrangler deploy` sobe Worker + container, binding direto sem internet pública). Ligeiramente mais arriscado operacionalmente (GA recente, sem região BR).
3. **pgmq como complemento** para lote/reprocessamento, consumindo com o mesmo container.
4. **Python Workers** — reavaliar quando atingir GA.
5. **Supabase Edge Functions** — descartado para Python.

**Arquitetura sugerida:** Worker (TS) = API/auth/**HTTP 409 sem aprovação (RF-130)** → HTTP síncrono → FastAPI + engine `Decimal` em container → engine grava resultado + `engine_version` + digest + hash dos inputs no Supabase → Worker responde. pgmq para reprocessamentos.

---

## 3. LangGraph supervisor-worker com aprovação humana

### 3.1 Versão e padrão de supervisor

- **LangGraph 1.0 GA desde 22/out/2025; sem breaking changes até a 2.0**; `langgraph.prebuilt` deprecado (migrou para `langchain.agents`). Confiança: **alta**. [blog langchain 1.0](https://www.langchain.com/blog/langchain-langgraph-1dot0)
- **A lib `langgraph-supervisor` não é mais o caminho recomendado** — o README oficial diz: *"We now recommend using the supervisor pattern directly via tools rather than this library"*. Problema central: handoff do histórico inteiro a cada worker (estouro de contexto/custo). Confiança: **alta**. [github langgraph-supervisor-py](https://github.com/langchain-ai/langgraph-supervisor-py)
- Padrão recomendado: supervisor **hand-rolled** como `StateGraph`; roteamento **determinístico por conditional edges** onde o tipo de tarefa é conhecido (a maioria em pipeline documental — corta o "imposto do supervisor", que custa ~3× um agente único, número de confiança média); `Command(goto=)` nos nós de decisão; workers como **subgrafos** com I/O tipado; **`Send` API** para fan-out por documento/cláusula (map-reduce). Confiança: **alta**. [Send API map-reduce](https://medium.com/ai-engineering-bootcamp/map-reduce-with-the-send-api-in-langgraph-29b92078b47d) · [docs graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)

### 3.2 Human-in-the-loop (RF-130: aprovação obrigatória)

- Padrão canônico: `interrupt()` no nó + `Command(resume=<decisão>)`, com checkpointer + `thread_id` estável. Decisões: approve/edit/reject/respond, com payloads estruturados. Confiança: **alta**. [docs interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- **GOTCHA crítico de produção:** no resume, o LangGraph **re-executa o nó inteiro desde o início**. Todo side effect (gravação, e-mail, protocolo) deve vir **depois** do interrupt, em nó separado pós-aprovação; código antes do interrupt deve ser puro/idempotente. **Um interrupt por nó; o nó de aprovação não faz nada além de aprovar.** Issues relacionadas: [#6626](https://github.com/langchain-ai/langgraph/issues/6626) (interrupts paralelos), [#6792](https://github.com/langchain-ai/langgraph/issues/6792) (interrupt em subgrafo re-executa tasks) — manter gates no grafo pai, aprovar no nó de reduce, nunca dentro de branches `Send`. Confiança: **alta**.
- Aprovações de longa duração (horas/dias) são suportadas nativamente — estado congelado no checkpointer, retomada de outro processo com o mesmo `thread_id`. Confiança: **alta**.

### 3.3 Persistência no Supabase

- `AsyncPostgresSaver` (`langgraph-checkpoint-postgres` 3.x) é o checkpointer de produção; rodar `.setup()` na migração; `autocommit=True` + `row_factory=dict_row`; setar `LANGGRAPH_STRICT_MSGPACK=true` (restrição de desserialização — relevante para compliance). Confiança: **alta**. [PyPI](https://pypi.org/project/langgraph-checkpoint-postgres/)
- **GOTCHA Supabase:** transaction pooler (porta 6543) não suporta prepared statements — psycopg3/asyncpg quebram. Para o checkpointer: **conexão direta ou session pooler (5432)** com pool psycopg pequeno próprio; transaction pooler fica para o resto da aplicação. Confiança: **alta**. [supabase docs prepared statements](https://supabase.com/docs/guides/troubleshooting/disabling-prepared-statements-qL8lEL)
- Tabelas de checkpoint crescem sem GC — prever job de retenção desde o S0 (em contexto jurídico: **arquivar**, não deletar — checkpoints são trilha de auditoria). Latência ~20–50 ms/checkpoint write (fonte única — validar em benchmark próprio); durabilidade "sync" nos nós que antecedem gates. Confiança: **alta** (crescimento) / média (números).

### 3.4 Testes de contrato de I/O

Pirâmide de 3 camadas (consenso de 4+ fontes, confiança **alta**):
1. **CI todo commit, sem LLM:** contract tests pytest — todo output de worker é modelo Pydantic; grafo com fake LLM (roteamento, interrupts disparando, estado pós-resume). Cálculos ficam em teste unitário clássico — a fronteira LLM→cálculo é exatamente o contrato Pydantic.
2. **CI todo commit, com cassettes:** VCR.py/pytest-recording gravando respostas reais e reproduzindo determinístico.
3. **Nightly/PR relevante:** golden dataset de documentos reais pseudonimizados; asserção exata em campos determinísticos (valores, datas, enums), schema+score com tolerância em texto. Harness: pytest + deepeval (OSS); LangSmith pytest (`@pytest.mark.langsmith`) opcional depois.

Case legal-tech de referência: **Definely** (plugin Word para contratos) migrou de RAG-chatbot para multi-agente LangGraph citando exatamente "auditável passo a passo + humano dono do output final". Confiança: **alta**. [blog langchain/customers-definely](https://www.blog.langchain.com/customers-definely/). Lição convergente de casos de contratos: extração estruturada Pydantic → armazenamento estruturado → consulta determinística, LLM só na extração (alinhado à TRAVA 1). [neo4j agentic graphrag](https://neo4j.com/blog/developer/agentic-graphrag-for-commercial-contracts/)

Alternativas (CrewAI, OpenAI Agents SDK, Pydantic-AI) não superam LangGraph para o requisito checkpointing durável + interrupt/resume como primitivas; usar Pydantic **dentro** do LangGraph (structured output dos workers). Confiança: **alta**.

---

## 4. Parâmetros normativos versionados e golden tests (engine bancária)

### 4.1 Modelagem temporal em Postgres

- Padrão consolidado: **bitemporalidade** = valid time (vigência da norma no mundo real) × transaction time (quando o dado entrou no banco); em Postgres puro, valid time explícito por ranges + transaction time por trigger/audit table. Confiança: **alta**. [grokipedia bitemporal](https://grokipedia.com/page/Bitemporal_modeling) · [xata postgres temporal](https://xata.io/blog/postgres-as-a-temporal-db)
- `daterange` + `EXCLUDE USING gist (chave WITH =, vigencia WITH &&)` (com `btree_gist`) é a forma canônica de impedir vigências sobrepostas no nível do banco, segura sob concorrência. Confiança: **alta**. [postgresql rangetypes](https://www.postgresql.org/docs/current/rangetypes.html)
- **Postgres 18 (2025)** trouxe SQL:2011 nativo para valid time: `PRIMARY KEY (chave, vigencia WITHOUT OVERLAPS)` e FK temporal com `PERIOD`. **Não há system versioning nativo** (transaction time) — usar trigger próprio ou extensão `periods`; a extensão C `temporal_tables` está estagnada (PG ≤15). Confiança: **alta**. [wiki SQL2011Temporal](https://wiki.postgresql.org/wiki/SQL2011Temporal) · [neon PG18 temporal](https://neon.com/postgresql/postgresql-18/temporal-constraints)
- **Snapshot por cálculo:** princípio reconhecido de reprodutibilidade regulatória; forma concreta (coluna JSONB congelada + SHA-256 do JSON canônico) é síntese de práticas convergentes (confiança **alta** no princípio, média na forma).

Esquema de referência (CA-111.2):

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE parametro_normativo (
    id        bigint GENERATED ALWAYS AS IDENTITY,
    chave     text NOT NULL,        -- ex.: 'taxa_media_bacen.sgs_25471'
    vigencia  daterange NOT NULL,   -- valid time
    valor     jsonb NOT NULL,       -- Decimal SEMPRE como string
    fonte_url text NOT NULL,
    PRIMARY KEY (chave, vigencia WITHOUT OVERLAPS)  -- PG18
    -- PG<18: EXCLUDE USING gist (chave WITH =, vigencia WITH &&)
);

CREATE TABLE calculo (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    executado_em        timestamptz NOT NULL DEFAULT now(),
    engine_version      text NOT NULL,
    parametros_snapshot jsonb NOT NULL,   -- cópia CONGELADA de todos os parâmetros
    snapshot_sha256     text NOT NULL,    -- hash do JSON canônico
    entrada             jsonb NOT NULL,
    resultado           jsonb NOT NULL
);
```

Regras de ouro: parâmetro nunca sofre UPDATE de valor (corrigir = fechar vigência + inserir); a engine **só lê do snapshot** após o freeze; o laudo referencia `calculo.id` + `snapshot_sha256`.

### 4.2 Golden tests (CA-110.1: diffs = 0)

- **pytest-regressions** (`data_regression`/`file_regression`; v2.11.0 mai/2026, ativa) como espinha dorsal — um YAML/JSON por caso golden (contrato + planilha Price/SAC/Gauss + CET), regeneração via `--force-regen`, diff legível em review. **syrupy** é alternativa aceitável; **pytest-golden não mostra manutenção — evitar**. Confiança: **alta** / média (pytest-golden, evidência por ausência). [pytest-regressions](https://github.com/ESSS/pytest-regressions) · [syrupy](https://github.com/syrupy-project/syrupy)
- Comparação **byte a byte, nunca tolerância**: engine 100% `Decimal` com `quantize()` explícito nas fronteiras (regra de arredondamento documentada), serialização canônica (`sort_keys=True`, encoder Decimal→string). `json` stdlib recusa Decimal; **nunca `default=float`** (perda silenciosa de precisão). Confiança: **alta**.
- **Hypothesis** como camada de invariantes: saldo final = 0; Σ amortizações = principal; CET ≥ taxa nominal; juros simples ≤ composto; round-trip snapshot→engine→snapshot idempotente. Confiança: **alta**.
- Cada caso golden embute o **snapshot de parâmetros** no mesmo formato do JSONB de produção — o artefato de reprodutibilidade do laudo é o mesmo que alimenta a regressão.

### 4.3 Domínio revisional — padrões vigentes que a engine deve modelar (2025-2026)

| Tema | Norma/precedente vigente | Impacto na engine |
|---|---|---|
| CET | **Res. CMN 4.881/2020** (revogou a 3.517/2007) + IN BCB 83/2021 | Fórmula do CET com todos os fluxos (juros, tributos, tarifas, seguros) |
| Juros remuneratórios | Súm. 596/STF, 382/STJ; **REsp 1.061.530/RS (Tema 27)**: parâmetro = taxa média Bacen da modalidade à época; prática ~1,5× a média, mas exceder patamar por si só não basta (3ª T., 2023+) | Comparação contra série SGS do Bacen (`api.bcb.gov.br/dados/serie/bcdata.sgs.{código}`; ex.: 25471 veículos PF, 25464 crédito pessoal) |
| Capitalização | Súm. 539/541 STJ (SFN, pactuação expressa; tese do duodécuplo); **REsp 2.086.650/MG (fev/2025): vedada no SFI mesmo pactuada** | Flags por regime (SFN×SFI) e por pactuação; tese revisional nova para imobiliário SFI |
| Mora/atualização | **Lei 14.905/2024** (vigor 30/8/2024): juros legais = SELIC − IPCA (zera se negativo), correção = IPCA, juros simples (Res. CMN 5.171/2024), supletiva | "Cenário Devido" na fase de mora; STJ 2025 já aplica SELIC quando sentença omissa |
| Amortização | Price (composto), SAC, **Método de Gauss** (juros simples — adotado por tribunais, ex. TJSP, quando capitalização é afastada) | Engine implementa os três; controvérsia Gauss × equivalência simples documentada (confiança média) |

Fontes: [Res. 4.881 (BCB)](https://www.bcb.gov.br/content/estabilidadefinanceira/especialnor/Resolu%C3%A7%C3%A3o4881.pdf) · [Tema 27 (TJDFT)](https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/precedentes-qualificados-na-visao-do-tjdft/direito-civil/contrato-bancario/tema-27-do-stj-revisao-de-juros-remuneratorios-relacao-de-consumo) · [Súm. 539 (STJ)](https://arquivocidadao.stj.jus.br/index.php/sumula-539-2;isad?sf_culture=pt) · [REsp 2.086.650 (migalhas)](https://www.migalhas.com.br/depeso/455068/capitalizacao-de-juros-no-sistema-financeiro-imobiliario) · [Lei 14.905/2024 (planalto)](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14905.htm) · [SELIC mora (STJ)](https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/12032025-Selic-deve-ser-aplicada-como-juros-moratorios-se-sentenca-nao-determinar-outra-taxa.aspx) · [Gauss TJSP](https://direitoreal.com.br/noticias/tjsp-determina-utilizacao-do-metodo-gauss-em-acao-revisional) · [séries SGS](https://dadosabertos.bcb.gov.br/dataset/25464-taxa-media-mensal-de-juros-das-operacoes-de-credito-com-recursos-livres---pessoas-fisicas---c)

---

## 5. RLS por caso, auditoria imutável e LGPD

### 5.1 RLS por caso (TRAVA 6)

- Padrão canônico: tabela `case_members (case_id, user_id, role_in_case)` + função `user_is_case_member(uuid)` **SECURITY DEFINER STABLE** com `set search_path = ''` — evita a recursão infinita de política que consulta a própria tabela (erro 500 clássico do Supabase). Confiança: **alta**. [supabase discussão #1138](https://github.com/orgs/supabase/discussions/1138)
- Performance (benchmarks oficiais Supabase, confiança **alta**): `(select auth.uid())` nas políticas (initPlan por statement — até 99,94%); índice btree em toda coluna de política (>100×); `TO authenticated` sempre; evitar joins dentro da política (178.000ms → 12ms); repetir filtros no client mesmo com RLS. [supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security) · [rls-performance](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- Papéis globais (admin/advogado/estagiário) via **Custom Access Token Hook** + `authorize()`; **nunca claim JWT para membership de caso** (staleness do token = acesso indevido após remoção). Confiança: **alta**.
- Quality gate: **pgTAP + `supabase test db` + supabase_test_helpers**; `tests.rls_enabled('public')` falhando o build se alguma tabela nascer sem RLS; teste positivo e negativo por tabela (UPDATE/DELETE bloqueados retornam 0 linhas — testar com `is_empty`, não `throws_ok`). Confiança: **alta**. [supabase pgtap](https://supabase.com/docs/guides/local-development/testing/overview)

### 5.2 Trilha de auditoria imutável (TRAVA 2)

- **Não** usar event sourcing (consenso: "se auditoria é o único driver, é a ferramenta errada"); **não** adotar supa_audit (repositório **arquivado em 16/02/2025**) — implementar trigger genérico próprio (~150 linhas, baseado no artigo oficial do Supabase) gravando snapshot JSONB completo + ator + timestamp em `audit.approval_log`. Confiança: **alta**. [supa_audit (arquivado)](https://github.com/supabase/supa_audit) · [postgres auditing 150 lines](https://supabase.com/blog/postgres-audit) · [event-driven.io audit](https://event-driven.io/en/audit_log_event_sourcing/)
- Imutabilidade em 3 camadas: (i) `REVOKE UPDATE, DELETE, TRUNCATE` dos roles de aplicação; (ii) trigger `BEFORE UPDATE OR DELETE` com `RAISE EXCEPTION`; (iii) **hash chain** `prev_hash`/`row_hash` com HMAC-SHA256 (chave fora do banco). **Append-only não é à prova do operador do banco** — só evidência de adulteração; fechar o modelo de ameaça exige **ancoragem externa** (job diário publicando o hash da cabeça fora do Supabase — git de outra conta ou timestamping RFC 3161). Confiança: **alta**. [tamper-evident postgres](https://appmaster.io/blog/tamper-evident-audit-trails-postgresql)
- pgAudit como complemento (DDL/sessão nos logs da plataforma), não substituto.

### 5.3 LGPD e sigilo profissional (TRAVA 6)

- **ANPD ainda sem norma vinculante de IA** (jul/2026): NT 12/2025 e Radar de IA Generativa são orientativos; guia de anonimização/pseudonimização na agenda 2025-2026 com publicação esperada — **projetar pelo texto da lei e monitorar**. Confiança: **alta** (status) / média (prazos). [ANPD tomada de subsídios](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-apresenta-resultados-da-tomada-de-subsidios-sobre-tratamento-automatizado-de-dados-pessoais)
- **Dado pseudonimizado continua sendo dado pessoal** (art. 13, §4º — reversível via "informação adicional mantida separadamente"). Pseudonimizar antes do LLM atende minimização, mas o envio continua sendo tratamento: exige base legal, **DPA e ZDR com o provedor**, ROPA, e Regulamento de Transferências Internacionais (Res. CD/ANPD 19/2024) se aplicável. Confiança: **alta**. [migalhas dado pseudonimizado](https://www.migalhas.com.br/coluna/migalhas-de-protecao-de-dados/332299/o-dado-pseudonimizado-e-um-dado-protegido-pela-lei-geral-de-protecao-de-dados)
- Pipeline prático: **gateway obrigatório** (nenhuma chamada direta ao provedor) com **Microsoft Presidio** + recognizers regex+checksum (CPF, CNPJ, CEP, telefone, e-mail, nº OAB, nº processo CNJ) + NER pt-BR jurídico **BERTimbau/LeNER-Br** (`pierreguillou/ner-bert-base-cased-pt-lenerbr`, F1 PESSOA 0,983); tokens estáveis por caso (`<PESSOA_1>`) com mapa determinístico local sob RLS do caso; des-tokenização só no retorno. NER nunca é 100% — pseudonimização é redução de risco, não garantia. Confiança: **alta**. [presidio](https://github.com/microsoft/presidio) · [LeNER-Br NER](https://huggingface.co/pierreguillou/ner-bert-base-cased-pt-lenerbr)
- Retenção dos provedores (jul/2026): **Anthropic** — sem retenção de conteúdo por padrão, ZDR contratual via vendas (verificado em doc oficial); **OpenAI** — 30 dias padrão, ZDR mediante aprovação; **Google** — tiers pagos sem uso para treino, ZDR por solicitação; **nunca usar tiers gratuitos/consumer**. Confiança: **alta** (Anthropic) / média-alta (demais). [anthropic data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- **Recomendação OAB 001/2024** (11/11/2024): uso de IA não é vedado, mas exige confidencialidade na escolha do fornecedor, supervisão humana e **comunicação formal prévia ao cliente** — incluir cláusula nos contratos de honorários. Art. 34, VII da Lei 8.906/94 (violação de sigilo = infração disciplinar). CNJ Res. 615/2025 sinaliza o padrão do ecossistema. Confiança: **alta**. [OAB recomendações IA](https://www.oab.org.br/noticia/62704/oab-aprova-recomendacoes-para-uso-de-ia-na-pratica-juridica)
- Observabilidade: logar apenas metadados (ids de token, contagens, latência) — o "never log case content" se estende aos traces de LLM.

---

## 6. DataJud (RF-103 e roteamento) e TPU

### 6.1 API Pública DataJud

- **Ativa, gratuita, oficial, best-effort** (sem SLA, sem versionamento formal): `POST https://api-publica.datajud.cnj.jus.br/api_publica_{alias}/_search` com DSL Elasticsearch; ~90 tribunais, **STF fora** (confiança média). Retorna só "capa + andamentos": classe/assuntos/movimentos TPU, órgão julgador, datas — **sem peças, sem busca por CPF/CNPJ, processos sigilosos omitidos** (Portaria CNJ 160/2020). Defasagem de horas a dias conforme o tribunal. Confiança: **alta**. [CNJ API pública](https://www.cnj.jus.br/sistemas/datajud/api-publica/) · [datajud-wiki](https://datajud-wiki.cnj.jus.br/api-publica/)
- **Chave pública única, rotacionável sem aviso** (header `Authorization: APIKey ...`; houve incidente real de rotação com 401/403 — fonte única) — tratar como configuração externa com alerta de rotação, nunca hardcode. Confiança: **alta** (mecanismo) / média (incidente).
- Limites: 10.000 docs por paginação `from`/`size` — acima, **`search_after`** com `sort`; rate limit não documentado (observações divergem: ~30 req/min até ~10 req/min + 2s entre batches — adotar o piso); 429 → backoff curto; 504 → não retentar; **200 com `_shards.failed > 0` pode mascarar dados faltantes** (fonte única). Confiança: **alta** (10k) / média (rate).
- Complemento natural para intimações/publicações: **API DJEN/Comunica** (`https://comunicaapi.pje.jus.br/api/v1`, obrigatória para tribunais desde 2025) — com **geo-bloqueio 403 fora do Brasil** (relevante: infra Cloudflare/engine em região estrangeira; fonte única). [CNJ comunicações](https://www.cnj.jus.br/programas-e-acoes/processo-judicial-eletronico-pje/comunicacoes-processuais/)
- **Clientes OSS: nenhum maduro.** O melhor TS ([busca-processos-judiciais](https://github.com/joaotextor/busca-processos-judiciais), 76★) serve de referência de aliases; pydatajud (PyPI) é embrionário; [skills-datajud-djen](https://github.com/rvsanches/skills-datajud-djen) é a melhor spec operacional (não é cliente). **Build, não adopt.** Confiança: **alta**.

### 6.2 TPU

- 4 tabelas (Classes, Assuntos, Movimentos, Documentos — Res. CNJ 46/2007); é o vocabulário dos campos do DataJud. Obtenção: (1) **dumps versionados Excel/SQL** em `https://www.cnj.jus.br/sgt/versoes.php?tipo_tabela=A|C|M` ← **usar este para seed**; (2) web service SOAP público do SGT (`pesquisarItemPublicoWS`, `getArrayFilhosItemPublicoWS`) como fallback pontual; (3) API REST TPU da PDPJ-Br — **atrás de SSO PDPJ com credencial por chamado, não pública**. Confiança: **alta** / média (auth PDPJ). [SGT webservice](https://www.cnj.jus.br/sgt/infWebService.php) · [versoes.php](https://www.cnj.jus.br/sgt/versoes.php?tipo_tabela=A) · [PDPJ TPU](https://docs.pdpj.jus.br/servicos-estruturantes/tpu/)
- Atualização ~**bimestral** via Boletim de Alterações (últimos: 28/04/2025, 19/09/2025, 30/01/2026, 09/04/2026); itens têm **vigência temporal** (início/fim), não versionamento semântico. Confiança: **alta**. [TPU documentos](https://www.cnj.jus.br/programas-e-acoes/tabela-processuais-unificadas/documentos/)
- Hierarquia: árvore com `codigo` + `cod_item_pai`; nos **Assuntos, o nível 1 = "ramo do direito"** (ex.: 899 DIREITO CIVIL — conferir códigos no dump) — é a terminologia oficial mais próxima de "vertical"; **não existe tabela oficial de verticais**: o mapeamento assunto→vertical do REPACTUA deve ser tabela própria derivada da ancestralidade. Confiança: **alta** (estrutura) / média (códigos).

---

## Decisões recomendadas para o S0

| # | Decisão | Recomendação | Confiança | Fundamento |
|---|---|---|---|---|
| 1 | Layout monorepo | pnpm workspaces + uv workspaces lado a lado; lockfiles independentes na raiz | Alta | §1.1 |
| 2 | Orquestrador de tasks | Turborepo com `package.json` wrapper em pacotes Python; `inputs` explícitos; reavaliar Nx se o lado Python multiplicar | Alta | §1.2 |
| 3 | Fonte única de tipos | **Zod em `packages/schema`** → `z.toJSONSchema()` → datamodel-code-generator → Pydantic; artefatos commitados + check de drift no CI | Alta | §1.3 |
| 4 | Dinheiro no wire | String decimal (nunca `number` JSON); Pydantic `Decimal`, Zod branded string; datas ISO 8601 | Alta | §1.3 |
| 5 | Runtime da engine | Container CPython (FastAPI) em Cloud Run/Fly.io região BR — ou CF Containers se provedor único; Worker TS na frente (auth + 409); nunca Pyodide para cálculo | Alta | §2 |
| 6 | Framework de agentes | LangGraph ≥1.0 (pin 1.x); supervisor hand-rolled, roteamento determinístico, `Send` para fan-out; sem `langgraph-supervisor` lib | Alta | §3.1 |
| 7 | Gate de aprovação (RF-130) | Nó dedicado só com `interrupt()`; side effects em nó posterior; um interrupt por nó; gates no grafo pai | Alta | §3.2 |
| 8 | Checkpointer | `AsyncPostgresSaver` via conexão direta/session pooler (5432), pool próprio; `LANGGRAPH_STRICT_MSGPACK=true`; política de retenção (arquivar) | Alta | §3.3 |
| 9 | Parâmetros normativos (CA-111.2) | Valid time com `WITHOUT OVERLAPS` (PG18) ou `EXCLUDE gist`; correção = nova linha; snapshot JSONB + SHA-256 por cálculo; engine lê só do snapshot | Alta | §4.1 |
| 10 | Regressão da engine (CA-110.1) | pytest-regressions byte a byte sobre Decimal→string canônica + Hypothesis para invariantes; golden embute snapshot de parâmetros | Alta | §4.2 |
| 11 | Domínio a parametrizar | Res. CMN 4.881/2020 (CET); Tema 27/STJ + séries SGS Bacen; Súm. 539/541 + REsp 2.086.650 (SFI); Lei 14.905/2024 (mora) | Alta | §4.3 |
| 12 | RLS | `case_members` + função SECURITY DEFINER; `(select auth.uid())`; índices; roles globais via Auth Hook; pgTAP `rls_enabled` no CI | Alta | §5.1 |
| 13 | Auditoria | Trigger genérico próprio (não supa_audit); REVOKE + trigger + hash chain HMAC; ancoragem externa diária | Alta | §5.2 |
| 14 | Pseudonimização | Gateway obrigatório: Presidio + LeNER-Br + regex BR; tokens estáveis com mapa local sob RLS; ZDR+DPA com provedor; cláusula de ciência do cliente (OAB 001/2024) | Alta | §5.3 |
| 15 | TPU (RF-103) | Seed por dump versionado do SGT (snapshot datado no repo); tabela própria assunto-nível-1→vertical; job bimestral de diff | Alta | §6.2 |
| 16 | DataJud | Cliente próprio fino (TS): chave como secret rotacionável, `search_after`, backoff 429, circuit breaker, tratar failed shards; só enriquecimento/roteamento | Alta | §6.1 |

## Pontos de decisão em aberto para o time

1. **Runtime da engine** (§2) — decisão de maior impacto arquitetural do S0: Cloud Run/Fly.io (região BR, mais maduro, segundo provedor) × Cloudflare Containers (provedor único, GA recente, sem região BR). Ambos defensáveis; o relatório recomenda o primeiro por maturidade + proximidade do Supabase.
2. **Provedor LLM e contrato ZDR/DPA** — iniciar tratativa comercial cedo (Anthropic via sales; OpenAI mediante aprovação); bloqueia o primeiro caso real ponta a ponta (DoD anti-vitrine).
3. **Postgres 18 no Supabase** — confirmar disponibilidade da versão no projeto Supabase; se PG <18, usar `EXCLUDE USING gist` (equivalente funcional).
4. **Geo-bloqueio DJEN** — se a infra de saída não estiver no Brasil, o acesso a `comunicaapi.pje.jus.br` retorna 403; decidir ponto de egress brasileiro se DJEN entrar no escopo.
5. **Ancoragem externa da trilha de auditoria** — escolher o mecanismo (git externo vs timestamping RFC 3161) — barato, mas precisa existir desde o S0 para a trilha nascer íntegra.
