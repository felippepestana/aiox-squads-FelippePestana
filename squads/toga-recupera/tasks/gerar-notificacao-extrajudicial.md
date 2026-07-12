# Task: gerar-notificacao-extrajudicial

**Agentes responsáveis:** `negociador-extrajudicial` (dados) → delegação ao squad `analista-processual` (redação) → `compliance-guard` (gate) · **Use case:** UC-TR-003

## Objetivo

Gerar notificação extrajudicial de mora que constitui o devedor em mora, abre a via da negativação (Súmula 359 STJ) e prepara o terreno para protesto/judicialização — sem jamais constranger.

## Entradas

- Ficha do caso: instituição credora, responsável financeiro (nome, CPF, endereço), parcelas em aberto (não prescritas), débito atualizado com memória (task `simular-acordo`), canal de resposta (portal/WhatsApp/telefone)

## Passos

1. `negociador-extrajudicial`: montar o dossiê de dados completos do caso e o objetivo da notificação (constituição em mora + convite à negociação).
2. Delegar a redação ao `redator-juridico` do squad `analista-processual` (UC-AP-005 — ver `squads/analista-processual/tasks/elaborar-peca-processual.md`), usando como base o template local `templates/notificacao-extrajudicial-tmpl.md`.
3. `compliance-guard`: validar a minuta (checks P1, C1, C2, L1). Em especial: sem ameaças, sem menção ao aluno como pressão, endereçada exclusivamente ao responsável financeiro.
4. Registrar que a notificação, uma vez enviada com comprovação, habilita a negativação (check N1) — anotar no dossiê.
5. Salvar em `output/notificacoes/` via Write, com dados faltantes marcados `[PREENCHER: ...]`.

## Saída

- Minuta de notificação extrajudicial aprovada pelo gate, pronta para revisão final do advogado.

## Critérios de qualidade (QG-TR-001)

- Identificação clara do escritório e da credora; objeto e valores exatos (com data-base); prazo e canal de resposta; tom respeitoso.
- Nenhuma parcela prescrita mencionada como exigível.
