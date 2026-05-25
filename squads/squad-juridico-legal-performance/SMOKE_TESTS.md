# Smoke Tests — Squad Jurídico Legal Performance

Este arquivo define os cenários funcionais mínimos para revisar se o squad está harmonizado, robusto e pronto para evoluir para implementação de produto.

## Como usar

1. Ative `@squad-juridico-legal-performance:legal-performance-chief`.
2. Execute um cenário por vez, usando o input sugerido.
3. Compare a classificação, rota de agentes, quality gates e entregáveis esperados.
4. Registre qualquer divergência como ajuste de arquitetura, agente, task ou template.

## Critério geral de aprovação

- O `legal-performance-chief` classifica o UC correto antes de acionar agentes.
- A rota declarada bate com `config.yaml`.
- Os agentes acionados cobrem o domínio sem duplicidade desnecessária.
- O entregável final declara fontes, lacunas, limitações e necessidade de revisão humana.
- Nenhum fluxo pula `quality-compliance-validator` quando há entrega decisória, relatório, laudo ou design readiness.

---

## Cenário 1 — Análise processual civil

### Objetivo

Validar se o squad integra triagem CPC, auditoria processual, leitura de peças, pesquisa jurídica, estratégia e plano de ação.

### Input sugerido

```text
Preciso analisar uma ação de cobrança em fase de conhecimento. Há petição inicial, contestação e decisão de saneamento. Quero entender riscos CPC, pontos fortes e fracos, cenário provável e próximos passos para o autor.
```

### Classificação esperada

| Campo | Valor esperado |
|---|---|
| UC | `UC-LP-003` |
| Modo | `MODO_JURIDICO` ou `MODO_DIAGNOSTICO` expandido para estratégia |
| Risco principal | Prazos, ônus da prova, nulidades, prescrição/decadência se aplicável |

### Rota esperada

```text
legal-performance-chief
-> process-intake-analyst
-> civil-procedure-classifier
-> procedural-auditor
-> legal-document-reader
-> jurisprudence-researcher
-> litigation-strategist
-> legal-action-advisor
-> legal-report-writer
-> quality-compliance-validator
```

### Quality gates obrigatórios

- `QG-LP-001`: UC e escopo definidos.
- `QG-LP-002`: peças, leis e precedentes rastreados.
- `QG-LP-003`: riscos CPC auditados.
- `QG-LP-004`: cenários somam 100%.
- `QG-LP-006`: revisão humana declarada.
- `QG-LP-008`: relatório completo.

### Entregável esperado

- Relatório com identificação do processo, extrações, riscos CPC, pesquisa jurídica, cenários, plano de ação e bloco `citacoes`.
- Se faltarem documentos, o relatório deve marcar seções como incompletas, não inventar fatos.

### Sinais de falha

- Classificar como pesquisa direta (`UC-LP-006`) e pular auditoria CPC.
- Produzir estratégia sem leitura de peças ou sem pesquisa jurídica.
- Omitir artigo CPC em risco processual relevante.
- Omitir revisão humana.

---

## Cenário 2 — Estratégia recursal

### Objetivo

Validar se o squad separa admissibilidade recursal, mérito, pesquisa jurisprudencial e plano de prazos.

### Input sugerido

```text
Preciso avaliar se vale interpor Recurso Especial contra acórdão do TJSP em ação indenizatória. A decisão contrariou tese do STJ, mas não sei se houve prequestionamento suficiente. Restam 8 dias de prazo.
```

### Classificação esperada

| Campo | Valor esperado |
|---|---|
| UC | `UC-LP-004` |
| Modo | `MODO_RECURSAL` |
| Urgência | Alta, porque restam menos de 10 dias |

### Rota esperada

```text
legal-performance-chief
-> process-intake-analyst
-> civil-procedure-classifier
-> procedural-auditor
-> legal-document-reader
-> jurisprudence-researcher
-> appeals-analyst
-> legal-action-advisor
-> legal-report-writer
-> quality-compliance-validator
```

### Quality gates obrigatórios

- `QG-LP-001`: UC recursal definido.
- `QG-LP-002`: tese STJ, acórdão e dispositivos rastreados.
- `QG-LP-003`: prazo e riscos processuais auditados.
- `QG-LP-006`: revisão humana declarada.
- `QG-LP-008`: relatório recursal completo.

### Entregável esperado

- Checklist de admissibilidade com cabimento, legitimidade, interesse, prazo, preparo, prequestionamento e esgotamento.
- Análise de mérito recursal.
- Recomendação final: interpor, não interpor ou interpor com cautelas.
- Plano de ação com prazo, responsável e documentos necessários.

### Sinais de falha

- Recomendar recurso sem checar prequestionamento.
- Tratar Recurso Especial como mera estratégia genérica.
- Omitir risco de não conhecimento.
- Omitir prazo restante no plano.

---

## Cenário 3 — Planejamento de frontend jurídico

### Objetivo

Validar se o squad consegue sair do domínio jurídico puro e planejar uma experiência de produto antes de acionar implementação frontend.

### Input sugerido

```text
Quero planejar um dashboard jurídico para upload de peças, timeline processual, matriz de riscos, pesquisa jurisprudencial, revisão humana e exportação de relatório. Preciso de uma interface segura, acessível e fácil para advogados e gestores.
```

### Classificação esperada

| Campo | Valor esperado |
|---|---|
| UC | `UC-LP-008` |
| Modo | `MODO_PRODUTO` |
| Handoff futuro | `apex`, somente após brief e checklist aprovados |

### Rota esperada

```text
legal-performance-chief
-> process-intake-analyst
-> legal-ux-architect
-> legal-report-writer
-> quality-compliance-validator
```

### Quality gates obrigatórios

- `QG-LP-001`: escopo e público definidos.
- `QG-LP-007`: jornada, personas, estados, acessibilidade e rastreabilidade definidos antes de frontend.
- `QG-LP-006`: revisão humana visível no fluxo.

### Entregável esperado

- Brief de design com personas, jornadas, arquitetura de informação, componentes críticos, estados de interface, acessibilidade, rastreabilidade e critérios para handoff ao `apex`.
- Checklist `design-readiness-checklist.md` preenchível.

### Sinais de falha

- Pular direto para implementação visual.
- Não explicitar estados de erro, loading, bloqueio por gate e revisão pendente.
- Não mostrar como fontes/evidências aparecem na interface.
- Não exigir WCAG AA.

---

## Resultado da rodada atual

| Cenário | Status esperado | Observação |
|---|---|---|
| Análise processual civil | Coberto | Rota e gates estão definidos em `config.yaml`; este teste formaliza a validação. |
| Estratégia recursal | Coberto | `appeals-analyst` e `UC-LP-004` cobrem admissibilidade e mérito. |
| Frontend jurídico | Coberto com restrição | O fluxo deve gerar brief antes de qualquer handoff ao `apex`. |

## Próximo passo recomendado

Após aprovar estes smoke tests, evoluir para exemplos preenchidos em `examples/`, usando documentos fictícios e outputs esperados para cada cenário.
