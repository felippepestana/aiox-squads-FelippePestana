# 03 — Backlog do MVP (8–12 semanas, sprints quinzenais S1–S6)

Convenções: **US-Ex.y** = user story do épico Ex. Critérios de aceite (CA) são verificáveis. Prioridade: tudo aqui é MVP; cortar pelo fim de cada épico se necessário.

## S1 — Fundação + Ingestão (E1, E7 início)

- **US-E1.1** Como operador do backoffice, importo uma planilha (CSV/XLSX) de carteira e recebo relatório de validação linha a linha.
  - CA: linhas inválidas listadas com motivo (CPF inválido, telefone impossível, valor ausente); nenhuma linha inválida persiste; reprocessamento idempotente (dedupe por CPF+contrato+parcela).
- **US-E1.2** Como sistema, persisto o modelo Instituicao→Carteira→Contrato→Devedor→Aluno→Parcela com RLS por instituição.
  - CA: migration Supabase aplicada; teste de RLS provando que instituição A não lê carteira de B; dados do aluno menor limitados a nome/vínculo (minimização LGPD).
- **US-E7.1** Como sistema, calculo aging e **prescrição** de cada parcela na ingestão e recálculo diário.
  - CA: parcela com vencimento > 5 anos marcada `prescrita=true`; regra de anuidade (última parcela da anuidade — REsp 2.086.705/SP) documentada no código; parcela prescrita excluída de qualquer soma "cobrável".
- **US-E7.2** Como compliance, tenho trilha de auditoria imutável (quem ingeriu, quando, o quê).
  - CA: tabela `TrilhaAuditoria` append-only; evento de ingestão registrado.

## S2 — Régua extrajudicial (E2)

- **US-E2.1** Como sistema, inicio um workflow durável por devedor ao ativar a carteira, parametrizado por faixa de aging.
  - CA: workflow sobrevive a restart do worker; estados visíveis no backoffice (notificado → lembrete 1 → lembrete 2 → escalonado).
- **US-E2.2** Como devedor, recebo notificação inicial por WhatsApp (template oficial aprovado) com link para o portal, e lembretes por e-mail.
  - CA: template aprovado na Meta; envio via fila com throttling; falha de envio → retry com backoff → fallback e-mail; custo por mensagem registrado.
- **US-E2.3** Como compliance, todo contato gera `EventoCobranca` e a régua respeita janelas de horário e frequência máxima.
  - CA: nenhum envio fora de 8h–20h (configurável); máximo N contatos/semana por devedor (configurável); devedor marcado "superendividamento" ou "não perturbe" sai da régua automática.

## S3 — REPACTUA + Acordos (E3)

- **US-E3.1** Como sistema, calculo o débito atualizado de qualquer conjunto de parcelas com memória de cálculo exportável.
  - CA: engine determinística (mesma entrada → mesma saída) com testes unitários; memória de cálculo em PDF/MD listando parcela a parcela: principal, correção, juros, multa; parcelas prescritas rejeitadas com erro explícito.
- **US-E3.2** Como operador, configuro política de desconto por aging com alçadas.
  - CA: desconto dentro da alçada aplica direto; acima → status "pendente aprovação" (aprovação manual no backoffice neste MVP).
- **US-E3.3** Como devedor, simulo acordo (à vista/parcelado), aceito eletronicamente a confissão de dívida e recebo Pix/boleto (Asaas).
  - CA: aceite registrado com IP/timestamp/hash do documento; cobrança criada via API Asaas; webhook de pagamento dá baixa automática na parcela e no acordo.

## S4 — Portal do devedor (E4)

- **US-E4.1** Como devedor, entro com CPF + token (WhatsApp/SMS) e vejo apenas meus débitos.
  - CA: RLS/escopo testado; parcela prescrita nunca listada como cobrável; mobile-first (ver [04-claude-design-handoff.md](04-claude-design-handoff.md)).
- **US-E4.2** Como devedor, acesso simulador, pagamento e comprovantes/2ª via.
  - CA: fluxo completo primeiro contato → acordo pago sem intervenção humana; estados vazio/loading/erro/sucesso implementados.

## S5 — Portal da instituição (E5) + Negativação (E6)

- **US-E5.1** Como gestor da instituição, vejo dashboard da carteira: totais, aging (0–30/31–60/61–90/91–180/180+/prescrito), recuperado, taxa de sucesso, e exporto CSV.
  - CA: números batem com queries de conferência; acesso restrito à própria carteira (RLS).
- **US-E6.1** Como operador, aciono negativação Serasa (via Asaas) apenas para devedores elegíveis.
  - CA: bloqueio sistêmico sem notificação prévia comprovada (Súmula 359 STJ) ou parcela prescrita; baixa automática pós-pagamento; evento registrado na trilha.

## S6 — Hardening + Piloto (E7 conclusão)

- **US-E7.3** Como compliance, executo checklist pré-piloto: triagem de superendividamento ativa, guardrails de linguagem nos templates (doc 05), contrato de operador LGPD assinado com a instituição-piloto.
- **US-MVP.1** Como equipe, rodo o piloto com 1–2 carteiras reais e painel de métricas: recuperação por aging, CPC, custo por acordo, custo WhatsApp.
  - CA: métricas coletadas automaticamente; relatório de 90 dias alimenta o gate de decisão do V1 (≥15–20% de recuperação da carteira antiga).

## Fora do MVP (registrado para V1)

Esteira judicial e motor de decisão processual, protesto, agente negociador IA no WhatsApp (no MVP a negociação é via simulador self-service + humano), aprovação de alçada pela instituição no portal dela, conciliação CNAB, MCPs DataJud/OAB/jurisprudência, Chatwoot.
