# Task: Validar Segurança de Negativação

**Executor:** `negativesafe-validator`
**Squad:** `jurisenergy-recovery`

## Objetivo

Prevenir negativação indevida validando titularidade, exigibilidade e requisitos formais antes da inscrição, e apoiar defesa de negativações regulares.

## Inputs

- CPF/CNPJ, UC, débito, notificação, contestação, pagamento, acordo, data de inscrição e baixa.

## Passos

1. Verificar titularidade contra o CPF/CNPJ a negativar.
2. Verificar exigibilidade: prescrição, pagamento, acordo vigente.
3. Verificar contestação administrativa pendente (PROCON, ouvidoria, ANEEL).
4. Validar notificação prévia à inscrição.
5. Para negativações ativas: conferir baixa após pagamento e gerar alerta de prazo.
6. Emitir veredito: apto, apto com ressalva, bloqueado ou pendente de saneamento.

## Critérios de Aceite

- [ ] Veredito com justificativa e documentos faltantes.
- [ ] Bloqueios aplicados para pagamento, acordo, contestação ou prescrição.
- [ ] Alertas de baixa em atraso gerados.

## Observações de Segurança

- Efetivação de negativação exige política interna, base legal e revisão humana quando houver risco.
- Na dúvida, bloquear.
