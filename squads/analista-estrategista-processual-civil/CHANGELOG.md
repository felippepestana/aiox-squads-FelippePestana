# Changelog — Analista Estrategista Processual Civil

## [1.0.0] — 2026-05-15

### Added
- Squad completo `analista-estrategista-processual-civil` com 9 agentes especializados em CPC 2015
- Pipeline 3-tier: Triagem e Diagnóstico (Tier 0) → Análise Especializada (Tier 1) → Síntese Estratégica
- 5 use cases: UC-AEPC-001 (CPC Completa), UC-AEPC-002 (Diagnóstico), UC-AEPC-003 (Recursal), UC-AEPC-004 (Defesa), UC-AEPC-005 (Execução)
- `chefe-estrategico` — orquestrador com algoritmo de classificação por UC
- `classificador-civel` — Tier 0: 4 dimensões (tipo/fase/polo/competência)
- `auditor-processual` — Tier 0: 6 eixos de risco CPC (prescrição, preclusão, nulidades, etc.)
- `leitor-pecas-civel` — Tier 1: extração de peças civis em 8 categorias
- `pesquisador-cpc` — Tier 1: CPC 2015 + STJ + teses repetitivas + súmulas + doutrina
- `estrategista-civel` — Tier 1: 5 partes + 3 cenários com % + acordo + recomendação
- `analista-recursos` — Tier 1: admissibilidade completa + mérito + recomendação recursal
- `orientador-civel` — Tier 1: plano de ação com prazos CPC + comunicação ao cliente
- `redator-estrategico` — Tier Síntese: relatório dual-mode (COMPLETO/DIAGNOSTICO) + Write
- 2 workflows: `wf-analise-cpc-completa` (6 fases) e `wf-diagnostico-rapido` (3 fases)
- 8 tasks com contratos de input/output e acceptance criteria
- 1 template: `relatorio-estrategico-cpc-tmpl.md` (MODO_COMPLETO)
- 2 checklists: diagnóstico e relatório estratégico completo
- `data/normas-cpc.yaml`: artigos críticos CPC 2015, CC, prazos recursais e fontes autorizadas
- 4 quality gates (QG-AEPC-001 a 004)
- `voice_dna` definido para todos os 9 agentes
