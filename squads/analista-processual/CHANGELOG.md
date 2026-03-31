# Changelog — analista-processual

All notable changes to this squad follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

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
