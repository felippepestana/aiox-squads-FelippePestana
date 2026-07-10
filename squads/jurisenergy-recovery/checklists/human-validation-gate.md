# Checklist — Gate de Validação Humana (QG-JE-004)

Aplicado pelo `juris-orchestrator` antes de liberar qualquer ato jurídico sensível.

## Atos que NUNCA prosseguem sem advogado responsável

- [ ] Ajuizamento de ação (judicialização).
- [ ] Protocolo de contestação ou defesa.
- [ ] Autorização de corte ou suspensão de fornecimento.
- [ ] Efetivação de negativação em cadastro restritivo.
- [ ] Reconhecimento de falha da empresa.
- [ ] Acordo com valores ou condições fora da política interna.
- [ ] Comunicação externa sensível em caso de alto risco.

## Antes de submeter à validação

- [ ] Recomendação consolidada com justificativa, fontes e nível de confiança.
- [ ] Checklist documental do tipo de demanda apto (QG-JE-002).
- [ ] Pendências abertas listadas com setor responsável.
- [ ] Guardrails do agente executor respeitados (data/agent-guardrails.yaml).
- [ ] Trilha de auditoria completa e imutável.

## Registro da decisão humana

- [ ] Identificação do advogado responsável.
- [ ] Decisão: validado / ajustado / bloqueado.
- [ ] Justificativa do ajuste ou bloqueio registrada.
- [ ] Resultado alimenta a base de aprendizado e os KPIs.
