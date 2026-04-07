# Changelog — SEO Expert Squad

All notable changes to this squad will be documented in this file.

## [1.1.0] - 2026-04-07

### Added
- 7 agent-specific audit tasks (audit-on-page, audit-technical, audit-schema, audit-content-quality, audit-performance, audit-ai-visibility, audit-site-architecture)
- `templates/` directory with SEO report template, JSON-LD templates, and llms.txt template
- `data/` directory with scoring rubric, Core Web Vitals thresholds, and agent registry
- CHANGELOG.md

### Changed
- Task count increased from 3 to 10 (covering all 7 audit categories + 3 orchestration tasks)
- Squad now has complete 6-layer anatomy (agents, tasks, templates, data, checklists, workflows)

## [1.0.0] - 2026-03-31

### Added
- Initial squad with 8 agents across 3 tiers
- 3 core tasks (evaluate-seo, optimize-seo, generate-seo-report)
- 1 workflow (wf-seo-full-cycle)
- 2 checklists (optimization-quality-gate, seo-score-checklist)
- Scoring system (0-100 with 7 weighted categories)
- README with squad documentation
