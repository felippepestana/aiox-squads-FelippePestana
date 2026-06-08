# Changelog — analista-processual

All notable changes to this squad follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

---

## [1.1.0] — 2026-05-15

### Added

**Agent (1 new, 9 total):**
- `redator-juridico` (Tier 1) — Elaboração de peças processuais (petição inicial, contestação, recursos, embargos) e documentos jurídicos (contratos, notificações, procurações)

**Use Case (1 new, 5 total):**
- UC-AP-005 — Elaboração de Peça Processual ou Documento Jurídico (modo `ELABORACAO_PECA`); roteia para `redator-juridico`, com `leitor-de-pecas` e `pesquisador-juridico` opcionais

**Quality Gate (1 new, 5 total):**
- QG-AP-005: Peça processual salva via `Write` em `output/pecas/`, dados faltantes sinalizados com `[PREENCHER:]`

### Changed

- `analista-chefe` — Algoritmo de classificação verifica UC-AP-005 antes de UC-AP-002, com desambiguação "analisar vs. elaborar"
- Centralização de fontes canônicas: `config.yaml > pipeline.use_cases` (classificação/roteamento) e `templates/relatorio-processual-tmpl.md` (estrutura de relatório); demais arquivos passam a espelhar essas fontes
- `ARCHITECTURE.md` sincronizado com os 5 use cases, modos de documentação e quality gates

### Removed

- `templates/relatorio-juridico-tmpl.md` — consolidado no template dual-mode canônico `relatorio-processual-tmpl.md`, que absorveu as subseções de maior amplitude (Jurisprudência dos Tribunais Superiores, Jurisprudência de TJs/TRFs, Orientações Jurisprudenciais)

---

## [1.0.0] — 2026-03-28

### Added

**Agents (8 total):**
- `analista-chefe` — Orchestrator com classificação de 4 use cases e pipeline 3-tier
- `mapeador-processual` (Tier 0) — Mapeamento pseudo-BPMN de etapas, atores e decisões
- `avaliador-processual` (Tier 0) — Maturidade 0-5, gargalos, Top-5 riscos
- `leitor-de-pecas` (Tier 1) — Extração estruturada de peças processuais em 7 categorias
- `pesquisador-juridico` (Tier 1) — Pesquisa em 5 dimensões via WebSearch
- `estrategista-processual` (Tier 1) — 3 cenários com % e viabilidade de acordo
- `advogado-orientador` (Tier 1) — Plano de ação com prazos e orientação ao cliente
- `documentador-processual` (Tier Síntese) — Relatório dual-mode + bloco `citacoes`

**Tasks (9 total):**
- `ap-classificar-demanda`, `ap-mapear-processo`, `ap-avaliar-conformidade`
- `ap-ler-peca`, `ap-pesquisar-jurisprudencia`, `ap-analisar-estrategia`
- `ap-planejar-acao`, `ap-sintetizar-analise`, `ap-gerar-relatorio`

**Workflows (2 total):**
- `wf-analise-completa` — Pipeline completo com todos os tiers (UC-AP-002, ~15-40 min)
- `wf-mapeamento-rapido` — Tier 0 apenas, MODO_PROCESSUAL (UC-AP-001, ~5-15 min)

**Quality Gates (4):**
- QG-AP-001: Classificação da demanda
- QG-AP-002: Mapeamento completo
- QG-AP-003: Avaliação fundamentada
- QG-AP-004: Relatório salvo

**Checklists (2):** `AP-QC-001` (mapeamento), `AP-QC-002` (completude relatório)

**Template (1):** `relatorio-processual-tmpl.md` (suporte dual-mode)

**Data (1):** `fontes-juridicas.yaml` (7 fontes autorizadas com regras de uso)

### Architecture

- Entry agent: `analista-chefe` com 4 use cases (UC-AP-001 a 004)
- Tier 0 (Intake): `mapeador-processual` → `avaliador-processual` (sequencial)
- Tier 1 (Jurídico): `leitor-de-pecas`, `pesquisador-juridico`, `estrategista-processual`, `advogado-orientador` (paralelo)
- Tier Síntese: `documentador-processual` (sempre último)
- Dual-mode: `MODO_PROCESSUAL` para processos genéricos, `MODO_JURIDICO` para judiciais
- Citation tracking: bloco ` ```citacoes``` ` em todos os relatórios MODO_JURIDICO

### Migration

- Migrado de `felippepestana/skill`: `squads/analista-processual/squad.py` (3 agentes genéricos)
- Migrado de `felippepestana/skill`: `analista_processual/squad.py` (5 agentes jurídicos)
- `documentador` + `relator-processual` fundidos em `documentador-processual` (dual-mode)
- `coordenador` (system prompt) promovido a agente orquestrador completo (`analista-chefe`)
- Formato migrado de Python `AgentDefinition` para AIOX YAML+Markdown
