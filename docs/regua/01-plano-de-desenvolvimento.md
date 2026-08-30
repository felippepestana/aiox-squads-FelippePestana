# 01 — Plano de Desenvolvimento

Plano staged derivado do blueprint. Cada fase tem **critérios de saída (gates)** — não avançar sem cumpri-los.

## Visão geral das fases

```text
Fase 0 (gate ético) → MVP (8–12 sem) → [threshold ≥15–20% recuperação] → V1 (3–4 meses) → [gate LGPD/ética] → V2 (escala)
```

---

## Fase 0 — Decisão ética (antes de qualquer código)

**Objetivo:** formalizar a política interna de gestão do **conflito consumerista** — a banca defende consumidores em revisional bancária e pretende atuar em superendividamento, e passaria a cobrar consumidores pessoas físicas.

**Entregáveis (documentos internos da banca, fora deste repo):**

1. **Política da "muralha":** a banca cobra pessoas físicas por conta de instituições, mantendo triagem obrigatória de superendividamento e sem práticas que contradigam sua atuação consumerista.
2. **Conflict-check:** processo de verificação no CRM contra a base de clientes-consumidores da banca antes de cobrar qualquer devedor.
3. **Política de mínimo existencial:** não cobrar de forma agressiva quem esteja com o mínimo existencial comprometido (Lei 14.181/2021 / Decreto 11.150/2022) — direcionar à repactuação.
4. **Decisão de estrutura de marca:** avaliar manter cobrança e defesa do consumidor sob marcas/estruturas separadas.

**Gate de saída:** política aprovada e assinada pelos sócios. **Threshold que muda a decisão:** se a análise concluir que o conflito é reputacionalmente insustentável → **pivotar para cobrança B2B/institucional apenas** ou restringir a inadimplentes de alta capacidade — e revisar este plano antes do MVP.

---

## MVP (8–12 semanas)

**Objetivo:** validar recuperação extrajudicial com 1–2 carteiras-piloto (escolas conhecidas). **Esforço estimado (blueprint):** 1 dev full-stack + o usuário, ~400–500h.

**Stack:** Next.js + Supabase + Asaas + WhatsApp Cloud API + Temporal (ou Trigger.dev) — detalhes e mapa de reuso em [02-arquitetura.md](02-arquitetura.md).

### Épicos

| Épico | Nome | Depende de | Reuso no repo |
|---|---|---|---|
| E1 | Ingestão de carteira (planilha) | — | `web/server/validation/br-docs.ts` (CPF/CNPJ) |
| E2 | Régua de cobrança WhatsApp oficial + e-mail | E1 | padrão de cliente WhatsApp em `legendarios-top/src/lib/whatsapp.ts` |
| E3 | Simulador de acordo + Pix/boleto (Asaas) | E1, E7 | `analista-processual-web/src/lib/agents/calculator.ts` (base do REPACTUA) |
| E4 | Portal do devedor básico (mobile-first) | E3 | design system `web/client/src/design-system/` |
| E5 | Dashboard da instituição básico | E1 | idem + padrão `web/server/db/repositories.ts` |
| E6 | Negativação Serasa (via Asaas) | E2, E7 | — |
| E7 | Compliance mínimo (transversal) | — | squad `squads/toga-recupera/` (compliance-guard) |

### Critérios de aceite por épico

**E1 — Ingestão de carteira**
- Upload de planilha (CSV/XLSX) com validação linha a linha e relatório de erros.
- Higienização: CPF válido, telefone normalizado (padrão BR), e-mail válido; deduplicação por CPF+contrato.
- Modelo de dados persistido: Instituicao → Carteira → Contrato → Devedor → Parcela (ver documento 02).
- Cálculo de aging por parcela e **flag automática de prescrição** (5 anos, regra do doc 05).

**E2 — Régua multicanal (extrajudicial)**
- Workflow durável (Temporal/Trigger.dev) por devedor: notificação inicial → lembretes → escalonamento, parametrizado por faixa de aging.
- WhatsApp **Cloud API oficial** com templates aprovados; e-mail transacional; throttling via fila (BullMQ).
- Estratégia de custo: maximizar a janela de serviço de 24h (respostas gratuitas); mensagens utility em vez de marketing quando aplicável.
- Todo contato registrado em `EventoCobranca` (canal, timestamp, resultado, CPC) — trilha anti-abuso.
- Respeito a horários e frequência limitada (regras do doc 05 configuráveis).

**E3 — Simulador de acordo + pagamentos**
- Engine **REPACTUA**: cálculo determinístico de débito atualizado (principal, juros, correção, multa) com **memória de cálculo** exportável.
- Políticas de desconto por aging com **alçadas**; desconto acima da alçada → fila de aprovação (mínimo viável: aprovação manual no backoffice).
- Geração de cobrança Pix/boleto via API Asaas; parcelamento; baixa automática via webhook.
- Acordo gera **confissão de dívida** (aceite eletrônico) — reinicia prescrição.

**E4 — Portal do devedor (mobile-first)**
- Login por CPF (+ validação por token via WhatsApp/SMS).
- Telas: meus débitos → simular acordo → escolher parcelamento → pagar (Pix copia-e-cola/boleto) → comprovantes/2ª via.
- Parcelas prescritas **nunca aparecem como cobráveis**.

**E5 — Dashboard da instituição**
- Visão da carteira: total, aging (0–30/31–60/61–90/91–180/180+/prescrito), recuperado, taxa de sucesso.
- Exportação CSV. Multi-tenant lógico via RLS (instituição só vê a própria carteira).

**E6 — Negativação Serasa**
- Via integração Asaas; **bloqueio sistêmico:** só negativa após notificação prévia comprovada (Súmula 359 STJ) e nunca parcela prescrita.
- Baixa automática de negativação após pagamento/acordo.

**E7 — Compliance mínimo (transversal, começa na semana 1)**
- Motor de prescrição bloqueando parcelas prescritas em qualquer fluxo (cobrança, régua, portal, negativação).
- Triagem de superendividamento: sinalização do devedor → sai da régua automática → fila de tratamento humano/repactuação.
- Logs imutáveis de todos os contatos e consentimentos; contrato de operador LGPD com a instituição (modelo jurídico).

### Métricas do MVP

- **Taxa de recuperação por faixa de aging** (meta do gate: ≥15–20% da carteira antiga em 90 dias).
- **CPC** (contato com pessoa certa), custo por acordo, tempo médio de negociação, custo WhatsApp por acordo.

**Gate de saída do MVP:** recuperação extrajudicial ≥ 15–20% da carteira antiga em 90 dias justifica investir na esteira judicial (V1). Abaixo disso: revisar régua/segmentação antes de judicializar.

---

## V1 (3–4 meses adicionais) — resumo

1. **Esteira judicial:** motor de decisão pela documentação (contrato assinado + 2 testemunhas → execução; contrato/boletos sem testemunhas → monitória; documentação frágil/valor baixo → JEC/cobrança) + geração de petições em massa por template (com memória de cálculo REPACTUA — Tema 474 STJ) + revisão obrigatória por advogado + acompanhamento via **API DataJud/CNJ**.
2. **Protesto extrajudicial** (Lei 9.492/1997 — emolumentos pagos pelo devedor).
3. **Agente negociador WhatsApp** com guardrails (doc 05) e escalonamento a humano (Chatwoot).
4. **Alçadas/aprovações** no portal da instituição (fila de aprovação de descontos).
5. **Auditoria LGPD completa** + conciliação CNAB.

**Gate de saída:** unit economics validados (success fee cobre operação + WhatsApp + protesto) e auditoria LGPD sem pendências críticas.

## V2 (escala) — resumo

- Analytics preditivo (score de recuperabilidade por aging/perfil).
- Integrações diretas com ERPs escolares (Sponte, TOTVS).
- RPA de peticionamento por tribunal (gargalo conhecido: não há API pública unificada de peticionamento — PJe/e-Proc/Projudi/ESAJ variam por tribunal).
- Portal da instituição avançado.

**Gate de entrada:** só escalar após auditoria LGPD e revisão ética do agente negociador.

---

## Riscos e mitigações (resumo executivo)

| Risco | Mitigação no plano |
|---|---|
| Conflito ético consumerista | Fase 0 como gate; triagem de superendividamento no E7; conflict-check |
| Reputacional (famílias/menores) | Cobrança só ao responsável financeiro; canais privados; guardrails (doc 05) |
| Banimento WhatsApp | Cloud API oficial desde o MVP; Evolution/Baileys só para fluxos internos de baixo volume |
| Custo per-message da Cloud API | Segmentação rigorosa + janela de serviço gratuita (E2) |
| Cobrar dívida prescrita | Bloqueio automático no motor (E7) — requisito de sistema, não de processo |
| Custas judiciais em massa | Priorizar JEC e extrajudicial; judicializar seletivamente por recuperabilidade (V1) |
| Peticionamento em massa sem API | Assumido como gargalo; RPA só em V2, por tribunal, com fallback humano |
