# Checklist: Qualidade do Mapeamento Processual

**ID:** AP-QC-001
**Usado por:** `analista-chefe` após `mapeador-processual`
**Quality Gate:** QG-AP-002

---

## Completude do Mapeamento

- [ ] Todas as etapas listadas em ordem cronológica
- [ ] Cada etapa tem ator responsável identificado
- [ ] Cada etapa tem entradas (inputs) definidas
- [ ] Cada etapa tem saídas (outputs) definidas
- [ ] Cada etapa tem critério de conclusão
- [ ] Pontos de decisão (gateways) mapeados com condições verdadeiro/falso
- [ ] Sistemas e ferramentas identificados por etapa (quando aplicável)

## Avaliação de Maturidade (QG-AP-003)

- [ ] Gargalos identificados com tipo e impacto estimado
- [ ] Top-5 riscos com probabilidade + impacto + mitigação
- [ ] Pontuação de maturidade (0-5) atribuída com justificativa
- [ ] Oportunidades de melhoria priorizadas por impacto

## Condições de Veto (bloquear entrega se qualquer item verdadeiro)

- Etapas sem atores identificados → **DEVOLVER** ao @mapeador-processual
- Pontuação de maturidade sem justificativa → **REJEITAR**
- Riscos sem probabilidade/impacto/mitigação → **DEVOLVER** para reprocessamento
- Nenhum gargalo identificado em processo > 5 etapas → **QUESTIONAR** completude
