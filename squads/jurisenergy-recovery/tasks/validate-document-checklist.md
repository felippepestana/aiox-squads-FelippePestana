# Task: Validar Checklist Documental

**Executor:** `document-intake-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Validar se os documentos enviados pelos setores são suficientes para cobrança ou defesa, devolvendo pendências objetivas antes da análise de mérito.

## Inputs

- Uploads, faturas, TOI, notificações, protocolos, laudos, histórico de consumo, ordens de serviço e dados de UC.

## Passos

1. Selecionar o checklist conforme o tipo de demanda (`documentary-evidence-checklist.md`).
2. Listar documentos presentes, ausentes e inconsistentes.
3. Calcular score documental do caso.
4. Classificar: apto, pendente de saneamento ou bloqueado, com justificativa objetiva.
5. Abrir pendência por documento faltante com setor responsável e prazo sugerido.

## Critérios de Aceite

- [ ] Checklist do tipo de demanda aplicado integralmente.
- [ ] Cada pendência tem documento, setor responsável e justificativa (QG-JR-002).
- [ ] Score documental registrado.
- [ ] Classificação rastreável aos documentos analisados.

## Observações de Segurança

- Não aprovar judicialização sem revisão jurídica quando houver risco alto ou crítico.
- Caso bloqueado não avança para nenhum squad de mérito.
