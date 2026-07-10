# Task: Triar e Rotear Caso

**Executor:** `juris-recovery-chief`
**Squad:** `jurisenergy-recovery`

## Objetivo

Receber o caso, identificar polo da Energisa, classificar o tema, listar documentos obrigatórios, acionar os squads corretos e abrir a trilha de auditoria.

## Inputs

- Caso, documentos, metadados, UC, processo, débito, TOI, setor de origem e histórico.

## Passos

1. Identificar polo da Energisa: ativo, passivo, pré-contencioso ou administrativo.
2. Classificar tema: cobrança, TOI, corte, negativação, religação, dano elétrico, infraestrutura ou ação coletiva.
3. Selecionar o UC-JR e a rota de agentes correspondente.
4. Listar documentos obrigatórios por tipo de demanda e abrir pendências.
5. Registrar risco preliminar e declarar necessidade de validação humana.
6. Abrir trilha de auditoria do caso (template `case-triage-report-tmpl.md`).

## Critérios de Aceite

- [ ] Polo e tema identificados com justificativa.
- [ ] UC-JR e squads acionados declarados.
- [ ] Checklist inicial e pendências registrados.
- [ ] Necessidade de validação humana declarada (QG-JR-001, QG-JR-004).

## Observações de Segurança

- Nenhum ato jurídico sensível (judicialização, corte, negativação, defesa) segue sem validação humana.
- Toda decisão automatizada registra justificativa, fonte e nível de confiança.
