# Changelog — Kaizen Squad

Todas as mudanças notáveis deste squad serão documentadas neste arquivo.

---

## [1.3.0] - 2026-03-06

### Alterado

- `squad.yaml` sincronizado com README — adicionadas seções: templates, checklists, rules, minds, scripts, data, commands, metrics, status, cadence
- Versão bump 1.2.0 → 1.3.0

### Corrigido

- Contagem de tasks no README (dizia "6 tasks" mas existem 8 no filesystem)
- Diacríticos no `squad.yaml` (acentos PT-BR corrigidos)

---

## [1.2.0] - 2026-02-25

### Adicionado

- README.md reescrito com copy comercial (problema → solução → evidência)
- Anti-pattern "similaridade superficial" documentado no kaizen-chief
- Checklist `agent-activation-checklist.md` (KZ-QC-002) — validação pré-ativação de agentes
- Checklist `analysis-quality-checklist.md` (KZ-QC-003) — validação por dimensão da análise
- Quality gate QG-KZ-004 no wf-weekly-report (checkpoint formal antes de entrega)
- Veto conditions em 4 tasks: detect-gaps, performance-dashboard, update-radar, cost-analysis
- Task `audit-output-quality.md` — avaliação qualitativa de outputs de squads
- Task `auto-healing-gate.md` — gate automático de auto-correção

### Corrigido

- Diacríticos (acentos PT-BR) no `recommendation-defensibility.md`
- Diacríticos no CHANGELOG.md

---

## [1.1.0] - 2026-02-15

### Adicionado

- Sistema proativo com 4 triggers via git hook:
  - `planning-phase`: epics, stories, PRDs → detecta gaps antes de começar
  - `squad-change`: novos squads/agentes → verifica sobreposição e radar
  - `feature-complete`: feat( commits → mede impacto e custo
  - `workflow-change`: workflows/tasks → verifica métricas
- Git hook: `.husky/post-commit` → `scripts/kaizen-trigger.sh`
- Workflow `wf-self-improve` — meta-análise e auto-melhoria do squad
- Task `self-improve` (KZ-TP-006) — rastreia recomendações, uso de agentes, saúde dos dados
- Comando `/kaizen:self-improve` — ativa auto-análise sob demanda
- Health check semanal (domingo 20:00 BRT) com entrega via WhatsApp
- Self-improvement semanal (domingo 20:30 BRT) após health check
- Guardrails de auto-melhoria: max 3 por ciclo, nunca remover agentes sem aprovação

### Alterado

- Config atualizado: triggers detalhados com paths, actions e rationale
- Cadência de health check: mensal → semanal (projeto evolui rápido)

---

## [1.0.0] - 2026-02-15

### Adicionado

- Squad completo de inteligência do ecossistema (meta-squad "RH + Ferramentas")
- Arquitetura 3 tiers: Orchestrator → Tier 0 Diagnosis → Tier 1 Operational → Tier 2 Specialist
- 7 agentes: kaizen-chief, topology-analyst, performance-tracker, bottleneck-hunter, capability-mapper, tech-radar, cost-analyst
- 11 frameworks codificados: Team Topologies, DORA Metrics, BSC, OKRs, TOC, OMTM, Wardley Maps, 4R Model, Technology Radar, Fitness Functions, FinOps
- 35 heurísticas determinísticas (KZ_TA_001-005, KZ_PT_001-005, KZ_BH_001-010, KZ_CM_001-005, KZ_TR_001-005, KZ_CA_001-005)
- 10 mentes elite com voice_dna, thinking_dna, heuristics e artifacts
- 5 tasks: detect-gaps, performance-dashboard, update-radar, cost-analysis, generate-recommendations
- 2 workflows: wf-ecosystem-analysis (5 fases), wf-weekly-report
- 4 templates: weekly-report, tech-radar, capability-map, performance-dashboard
- 1 checklist: report-quality (QG-KZ-003)
- Dados baseline: initial-radar.yaml, ecosystem-baseline.yaml
- 6 comandos Claude Code: chief, analyze, gaps, performance, radar, cost
- Registrado no squad-registry.yaml
- Modos de operação: proativo (git triggers) e reativo (on-demand commands)
