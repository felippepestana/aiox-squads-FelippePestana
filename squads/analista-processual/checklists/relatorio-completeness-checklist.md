# Checklist: Completude do Relatório Processual

**ID:** AP-QC-002
**Usado por:** `analista-chefe` antes de entregar o relatório ao usuário
**Quality Gate:** QG-AP-004

---

## MODO_PROCESSUAL

- [ ] Sumário executivo presente (3-5 linhas)
- [ ] Mapa de processo (tabela de etapas) incluído
- [ ] Pontuação de maturidade com justificativa
- [ ] Top-5 riscos com probabilidade, impacto e mitigação
- [ ] Roadmap em 3 horizontes (imediato / 90 dias / longo prazo)
- [ ] Arquivo salvo via `Write`

## MODO_JURIDICO (itens adicionais)

- [ ] Identificação do processo (número, vara, partes, fase)
- [ ] Resumo executivo (até 5 linhas)
- [ ] Histórico processual cronológico
- [ ] Questões jurídicas identificadas (principal + subsidiárias)
- [ ] Fundamentação legal (legislação + jurisprudência)
- [ ] Análise de mérito (pontos fortes/fraquezas/riscos)
- [ ] 3 cenários estratégicos com probabilidades
- [ ] Orientações práticas e plano de ação
- [ ] Conclusões e recomendações
- [ ] Bloco ` ```citacoes``` ` presente com fontes rastreadas
- [ ] Arquivo salvo via `Write`

## Condições de Veto

- Relatório sem bloco `citacoes` em MODO_JURIDICO → **BLOQUEAR** entrega
- Roadmap sem 3 horizontes em MODO_PROCESSUAL → **DEVOLVER** ao documentador
- Arquivo não salvo → **BLOQUEAR** — @documentador-processual DEVE usar `Write`
- Seções vazias sem marcador `[NÃO APLICÁVEL]` → **REJEITAR**
