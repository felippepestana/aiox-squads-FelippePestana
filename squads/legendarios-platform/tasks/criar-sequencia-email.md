# Task: Criar Sequência de Email Marketing

**Task ID:** `lp-criar-sequencia-email`
**Versão:** 1.0
**Agente Executor:** `email-marketer`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-001 (subtask)
**Comando:** `*criar-emails [cidade] [data_evento]`

---

## Objetivo

Criar sequência completa de 8 emails de marketing para um evento Legendários,
cobrindo boas-vindas, nutrição, urgência, confirmação, preparação e pós-evento,
com subject lines A/B para emails críticos.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| data_evento | date | Sim | Data de início do evento |
| nome_evento | string | Não | Nome especial do evento |
| link_inscricao | string | Não | URL de inscrição (Ticket and GO) |

## Passos

1. **Mapear timeline** — 8 emails no eixo de 12 semanas pré + pós-evento
2. **Escrever email 1** — Boas-vindas (subject A/B + estrutura completa)
3. **Escrever email 2** — História/storytelling de alumni
4. **Escrever email 3** — Quebra de objeções
5. **Escrever email 4** — Urgência de lote (template dinâmico para % vagas)
6. **Escrever email 5** — Last call (48h antes de encerramento)
7. **Escrever email 6** — Confirmação de inscrição (transacional)
8. **Escrever email 7** — Preparação (D-14)
9. **Escrever email 8** — Pós-evento + cross-sell
10. **Definir links de cancelamento** (LGPD) em todos os emails

## Output

- **Formato:** Markdown com 8 seções (1 por email): timing, subject A/B, preview text, estrutura, CTA
- **Entregue para:** @marketing-master (consolida no pacote)

## Critérios de Aceite

- [ ] 8 emails com timing, subject A/B, preview e estrutura completa
- [ ] Subject lines A/B nos emails de urgência e last call
- [ ] Cada email com 1 único CTA principal
- [ ] Personalização [Nome] em todos
- [ ] Link de cancelamento (LGPD) obrigatório em todo email
- [ ] Segmentação no email 8 (cross-sell casados → REM, pais → LEGADO)
- [ ] Tom Legendários (cristão, transformação, AHU)
