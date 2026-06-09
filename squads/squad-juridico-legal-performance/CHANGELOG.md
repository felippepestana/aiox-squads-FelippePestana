# Changelog — Squad Jurídico Legal Performance

All notable changes to this squad follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

---

## [1.0.0] — 2026-05-25

Squad unificado para atividades jurídicas, processuais, cíveis, recursais, periciais e de produto jurídico.

### Added

**Arquitetura (Tier 0–5):**
- `legal-performance-chief` (Tier 0) como orquestrador, com 8 casos de uso (UC-LP-001 a UC-LP-008) e 8 quality gates (QG-LP-001 a QG-LP-008)

**Agentes (16 total):**
- Tier 1: `process-intake-analyst`, `civil-procedure-classifier`, `procedural-auditor`
- Tier 2: `process-mapper`, `risk-and-maturity-evaluator`, `legal-document-reader`, `jurisprudence-researcher`
- Tier 3: `litigation-strategist`, `appeals-analyst`, `legal-action-advisor`
- Tier 4: `forensic-device-specialist`, `legal-normative-specialist`
- Tier 5: `legal-ux-architect`, `legal-report-writer`, `quality-compliance-validator`

**Tasks (10 total):**
- `classify-legal-demand`, `run-intake-triage`, `map-and-evaluate-process`, `read-and-research-case`, `build-litigation-strategy`, `analyze-appeal-strategy`, `conduct-forensic-assessment`, `design-legal-product-ux`, `generate-final-deliverable`, `validate-legal-output`

**Workflows (3 total):**
- `wf-legal-performance-full` — pipeline completo jurídico-processual (triagem, análise, estratégia, relatório e validação)
- `wf-forensic-assessment` — pipeline pericial técnico-normativo para laudos e quesitos
- `wf-legal-product-design` — pipeline de planejamento de frontend jurídico antes da implementação

**Demais artefatos:**
- 3 templates, 3 checklists, 4 arquivos de dados e 3 exemplos/smoke tests

**Documentação:**
- `DESIGN_GUIDE.md` para orientar o frontend jurídico de alta usabilidade

### Notes

- Consolida e harmoniza os squads `analista-processual`, `analista-estrategista-processual-civil` e `iphone-judicial-assessment`, usando `apex` como referência de design/frontend.
- Os squads de origem permanecem no repositório como histórico, referência e fallback especializado — este squad consolida sem remover.
