# Task: Revisar Qualidade Jurídica

**Executor:** `jurisprudence-quality-reviewer`
**Squad:** `jurisenergy-recovery`

## Objetivo

Revisar a qualidade jurídica das saídas dos agentes (scores, teses, minutas, recomendações) antes da validação humana, com curadoria de jurisprudência e teses.

## Inputs

- Saída do agente de origem, documentos analisados, precedentes locais, súmulas e decisões relevantes.

## Passos

1. Verificar se toda recomendação possui justificativa, fonte e nível de confiança.
2. Checar rastreabilidade dos precedentes citados (número, órgão, data) e sua atualidade.
3. Avaliar coerência entre fatos, provas e tese.
4. Confirmar que a necessidade de validação humana está declarada.
5. Emitir parecer: aprovado, aprovado com ressalvas ou devolvido, com correções objetivas.

## Critérios de Aceite

- [ ] Rastreabilidade verificada em todas as fontes (QG-JR-003).
- [ ] Precedentes desatualizados apontados com substitutos sugeridos.
- [ ] Correções objetivas e acionáveis quando devolvido.
- [ ] Encaminhamento para validação humana registrado (QG-JR-004).

## Observações de Segurança

- O parecer não substitui a aprovação do advogado responsável.
- Improcedências recorrentes alimentam a base de aprendizado com causa raiz.
