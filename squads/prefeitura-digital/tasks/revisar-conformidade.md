# Task: Revisão de Conformidade (gate transversal)

**ID:** `pd-revisar-conformidade`
**Executor:** `revisor-conformidade`
**Tier:** Tier Suporte
**Use Cases:** UC-PD-010 (e gate em UC-PD-002/003/006/007/008)

## Overview
Aplica o checklist adequado e emite parecer de conformidade legal/fiscal antes da conclusão ou publicação de um artefato.

## Input
- Artefato a revisar e seu tipo

## Output
- Parecer de conformidade no template relatorio-conformidade-tmpl.md

## Action Items
1. Identifique o tipo de artefato e o checklist aplicável
2. Aplique o checklist item a item, citando a base legal
3. Distinga pendências obrigatórias (bloqueiam) de recomendações
4. Verifique anexação do parecer orçamentário em atos com despesa
5. Cheque LGPD quando houver divulgação/dado pessoal
6. Conclua: CONFORME / COM RESSALVAS / NÃO CONFORME

## Acceptance Criteria
- [ ] Checklist correto aplicado
- [ ] Não conformidades com base legal citada
- [ ] Conclusão clara; pendências obrigatórias destacadas
