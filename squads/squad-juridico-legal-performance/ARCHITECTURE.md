# Arquitetura — Squad Jurídico Legal Performance

## Objetivo

Unificar, harmonizar e governar os recursos jurídicos/processuais existentes no repositório em uma arquitetura multiagentes hierárquica, sem destruir os squads de origem.

## Fontes consolidadas

- `analista-processual`: análise processual ampla e relatórios rastreados.
- `analista-estrategista-processual-civil`: especialização CPC 2015, recursos e execução.
- `iphone-judicial-assessment`: perícia judicial técnica de iPhone e laudos normativos.
- `apex`: referência para design system, acessibilidade e frontend premium.

## Modelo hierárquico

```text
legal-performance-chief
  |
  +-- Tier 1: process-intake-analyst
  |           civil-procedure-classifier
  |           procedural-auditor
  |
  +-- Tier 2: process-mapper
  |           risk-and-maturity-evaluator
  |           legal-document-reader
  |           jurisprudence-researcher
  |
  +-- Tier 3: litigation-strategist
  |           appeals-analyst
  |           legal-action-advisor
  |
  +-- Tier 4: forensic-device-specialist
  |           legal-normative-specialist
  |
  +-- Tier 5: legal-ux-architect
              legal-report-writer
              quality-compliance-validator
```

## Fluxo de decisão

1. O `legal-performance-chief` classifica a demanda em UC-LP.
2. O `process-intake-analyst` coleta escopo e lacunas.
3. A rota é escolhida conforme domínio: processual, civil, recursal, pericial ou produto.
4. Agentes especialistas trabalham com handoffs explícitos.
5. O `legal-report-writer` consolida o entregável.
6. O `quality-compliance-validator` aprova ou bloqueia a entrega.

## Roteamento por domínio

| Domínio | Agentes principais |
|---|---|
| Diagnóstico processual | `process-intake-analyst`, `civil-procedure-classifier`, `procedural-auditor` |
| Análise jurídica completa | `legal-document-reader`, `jurisprudence-researcher`, `litigation-strategist`, `legal-action-advisor` |
| CPC civil | `civil-procedure-classifier`, `procedural-auditor`, `appeals-analyst`, `litigation-strategist` |
| Recursos | `appeals-analyst`, `jurisprudence-researcher`, `legal-action-advisor` |
| Perícia técnica | `legal-normative-specialist`, `forensic-device-specialist`, `quality-compliance-validator` |
| Produto jurídico | `legal-ux-architect`, `quality-compliance-validator`, handoff futuro para `apex` |

## Smoke tests funcionais

Os cenários mínimos de validação estão em [`SMOKE_TESTS.md`](SMOKE_TESTS.md). Eles existem para confirmar que a arquitetura unificada não apenas lista agentes, mas também roteia corretamente demandas reais:

| Cenário | UC esperado | Objetivo arquitetural |
|---|---|---|
| Análise processual civil | `UC-LP-003` | Confirmar integração entre classificação CPC, auditoria, leitura de peças, pesquisa, estratégia e relatório. |
| Estratégia recursal | `UC-LP-004` | Confirmar separação entre admissibilidade recursal, mérito, prazos e recomendação. |
| Frontend jurídico | `UC-LP-008` | Confirmar que produto e usabilidade geram brief antes de qualquer implementação visual. |

## Quality gates

| Gate | Finalidade | Bloqueia quando |
|---|---|---|
| QG-LP-001 | Classificação e escopo | Não há UC-LP definido. |
| QG-LP-002 | Rastreabilidade | Fonte crítica está sem origem. |
| QG-LP-003 | Auditoria CPC | Fluxo civil não auditou riscos processuais. |
| QG-LP-004 | Estratégia quantificada | Cenários não somam 100%. |
| QG-LP-005 | Validação pericial | Cadeia de custódia ou normas faltam no laudo. |
| QG-LP-006 | Revisão humana | Saída não declara responsabilidade profissional. |
| QG-LP-007 | Design antes do frontend | Frontend não tem brief e checklist aprovados. |
| QG-LP-008 | Entregável completo | Relatório/laudo tem seção obrigatória ausente. |

## Decisões arquiteturais

### Por que criar um novo squad?

A opção de novo squad evita múltiplos pontos de entrada para demandas jurídicas relacionadas e permite uma governança única de fontes, templates, handoffs e validação.

### Por que manter os squads de origem?

Eles permanecem como histórico, referência e fallback especializado. O novo squad não apaga conteúdo anterior; ele consolida e harmoniza.

### Por que incluir `legal-ux-architect`?

A futura interface precisa traduzir complexidade jurídica em confiança operacional. Esse agente garante que design, rastreabilidade, acessibilidade e revisão humana sejam definidos antes da implementação frontend.

## Modos de saída

- `MODO_DIAGNOSTICO`: status, fase, riscos CPC e prazos.
- `MODO_JURIDICO`: peças, fundamentos, jurisprudência, estratégia e plano.
- `MODO_RECURSAL`: admissibilidade, mérito e recomendação.
- `MODO_PERICIAL`: laudo, quesitos, normas e cadeia de custódia.
- `MODO_PROCESSUAL`: mapa, maturidade, gargalos e roadmap.
- `MODO_PRODUTO`: brief de design, jornadas, IA e critérios de frontend.
