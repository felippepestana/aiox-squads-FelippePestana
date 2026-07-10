# Task: Validar Checklist Documental

**Executor:** `document-intake-validator`
**Squad:** `jurisenergy-recovery`

## Objetivo

Validar se os documentos enviados pelos setores são suficientes para o tipo de demanda, devolvendo pendências objetivas antes de cobrança ou defesa.

## Inputs

- Uploads, faturas, TOI, notificações, protocolos, laudos, histórico de consumo e dados de UC.
- Tipo de demanda definido pelo orquestrador.

## Passos

1. Carregar o checklist do tipo de demanda (data/document-checklists.yaml).
2. Classificar cada documento como presente, ausente ou inconsistente (OCR quando necessário).
3. Calcular score documental e comparar com o mínimo do tipo de demanda.
4. Classificar o caso: apto, pendente de saneamento ou bloqueado — com justificativa.
5. Gerar pendências com documento, setor responsável e impacto.

## Critérios de Aceite

- [ ] Checklist aplicado item a item com status.
- [ ] Caso classificado com justificativa objetiva.
- [ ] Pendências atribuídas a setores responsáveis.
- [ ] Score documental registrado.

## Observações de Segurança

- Documento ilegível conta como ausente até saneamento.
- Não aprovar judicialização sem revisão jurídica quando o risco for alto ou crítico.
