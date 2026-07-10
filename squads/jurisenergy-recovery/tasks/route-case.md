# Task: Rotear Caso

**Executor:** `juris-orchestrator`
**Squad:** `jurisenergy-recovery`

## Objetivo

Receber um caso novo, identificar polo da Energisa (ativo, passivo, pré-contencioso, administrativo), classificar o tema e definir a rota de frentes com checklist inicial e trilha de auditoria.

## Inputs

- Caso, documentos, metadados, UC, processo, débito, TOI, setor de origem e histórico.

## Passos

1. Identificar polo da Energisa e tema (cobrança, TOI, corte, negativação, religação, dano elétrico, infraestrutura, ação coletiva).
2. Selecionar o caso de uso UC-JE e as frentes a acionar.
3. Listar documentos obrigatórios do tipo de demanda (data/document-checklists.yaml).
4. Calcular risco preliminar e declarar nível de confiança da classificação.
5. Registrar plano de ação, pendências e necessidade de validação humana na trilha de auditoria.

## Critérios de Aceite

- [ ] Polo e tema identificados com justificativa e confiança.
- [ ] Frentes acionadas e checklist inicial gerado.
- [ ] Atos sensíveis marcados como dependentes de validação humana.
- [ ] Trilha de auditoria registrada.

## Observações de Segurança

- O orquestrador não executa ato jurídico: judicialização, corte, negativação e defesa exigem advogado responsável.
- Documento faltante gera pendência objetiva para o setor responsável, nunca suposição.
