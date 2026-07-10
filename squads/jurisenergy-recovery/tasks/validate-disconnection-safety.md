# Task: Validar Segurança de Corte e Religação

**Executor:** `cortesafe-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Validar o risco jurídico-regulatório de corte, suspensão e religação antes da execução ou como reconstrução probatória em defesa.

## Inputs

- Débito, notificação, data/hora, pagamentos, feriados, OS, pedido de religação, protocolos e status da UC.

## Passos

1. Confirmar inadimplência real: reconciliar pagamentos antes de tudo.
2. Validar notificação prévia (conteúdo, prazo e comprovação).
3. Checar calendário regulatório: feriados, vésperas e janelas vedadas.
4. Verificar SLA de religação quando aplicável.
5. Avaliar vulnerabilidade da UC (equipamento essencial à vida, hipossuficiência).
6. Classificar: apto, pendente ou bloqueado, com justificativa regulatória e probatória.

## Critérios de Aceite

- [ ] Pagamentos reconciliados antes da classificação.
- [ ] Notificação prévia validada e comprovada.
- [ ] Calendário regulatório checado.
- [ ] Classificação com justificativa (QG-JR-005).

## Observações de Segurança

- Não autorizar corte efetivo sem regra operacional validada e supervisão humana (QG-JR-004).
- Pagamento identificado ou notificação inválida = bloqueado, sem exceção.
