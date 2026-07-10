# Task: Validar Segurança de Negativação

**Executor:** `negativesafe-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Prevenir negativação indevida antes da inscrição e montar dossiê de regularidade para defender negativações regulares.

## Inputs

- CPF/CNPJ, UC, débito, notificação, contestação, pagamento, acordo, data de inscrição e baixa.

## Passos

1. Verificar titularidade: o devedor do débito é o CPF/CNPJ a negativar?
2. Verificar exigibilidade: prescrição, pagamento, acordo vigente e contestação administrativa.
3. Confirmar notificação prévia comprovada.
4. Verificar baixa tempestiva quando houver pagamento ou acordo.
5. Classificar: apto, apto com ressalva, bloqueado ou pendente de saneamento.
6. Em caso judicializado, montar dossiê de regularidade da inscrição.

## Critérios de Aceite

- [ ] Titularidade e exigibilidade verificadas com documento de suporte.
- [ ] Notificação prévia comprovada ou caso bloqueado.
- [ ] Classificação com justificativa e documentos faltantes (QG-JR-005).
- [ ] Prazo de baixa monitorado nos casos pagos.

## Observações de Segurança

- Não efetivar negativação sem política interna, base legal e revisão humana quando houver risco (QG-JR-004).
- Débito prescrito, pago, contestado ou sob acordo vigente nunca é negativado.
