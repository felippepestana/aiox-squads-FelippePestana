# Task: Validar Segurança de Corte

**Executor:** `cortesafe-validator`
**Squad:** `jurisenergy-recovery`

## Objetivo

Validar o risco jurídico-regulatório de corte, suspensão ou religação antes da execução, ou apoiar a defesa em corte contestado.

## Inputs

- Débito, notificação, data/hora prevista, pagamentos, feriados, OS, pedido de religação, status da UC e protocolos.

## Passos

1. Verificar exigibilidade do débito e pagamento identificado.
2. Validar notificação prévia (existência, validade, prazo).
3. Checar calendário: feriados, vésperas e janelas permitidas.
4. Verificar flags de serviço essencial e vulnerabilidade.
5. Para religação: conferir SLA e gerar alerta de passivo se excedido.
6. Emitir veredito: apto (com supervisão), pendente ou bloqueado, com justificativa regulatória e probatória.

## Critérios de Aceite

- [ ] Todas as checagens registradas com documento-fonte.
- [ ] Veredito com justificativa e nível de confiança.
- [ ] Casos de vulnerabilidade escalados para análise humana.

## Observações de Segurança

- O agente nunca autoriza corte efetivo — execução exige regra operacional validada e supervisão humana.
- Pagamento identificado = bloqueio sem exceção automatizada.
