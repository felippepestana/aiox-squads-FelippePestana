# Task: Criar Sequência WhatsApp Business

**Task ID:** `lp-criar-sequencia-whatsapp`
**Versão:** 1.0
**Agente Executor:** `whatsapp-automator`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-001 (subtask)
**Comando:** `*criar-whatsapp [cidade] [data_evento] [fase]`

---

## Objetivo

Criar sequência completa de mensagens WhatsApp Business para todas as 6 fases
do relacionamento com o participante: descoberta → interesse → inscrição →
preparação → D-day → pós-evento → retenção.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| data_evento | date | Sim | Data de início do evento |
| tipo_evento | enum | Sim | TOP, REM, LEGADO |
| fase | string | Não | Fase específica ou "completa" (padrão: completa) |

## Passos

1. **Definir fases** — 6 fases com triggers e timings
2. **Escrever 14 mensagens** — 2-3 por fase com conteúdo e CTAs binários
3. **Definir timings** — delays precisos (imediato, 24h, D-21, D-7, D-1, D+1, D+3, D+14)
4. **Segmentar mensagem pós-evento** — variação para casados (cross-sell REM) vs. solteiros
5. **Incluir opt-out** — em todas as mensagens iniciais e finais (LGPD)
6. **Especificar formato** — emojis, negrito, parágrafos curtos (mobile-first)

## Output

- **Formato:** Markdown com 14 mensagens numeradas, fase, trigger e delay
- **Entregue para:** @marketing-master (consolida no pacote)

## Critérios de Aceite

- [ ] 6 fases cobertas (descoberta → interesse → inscrição → preparação → pós-evento → retenção)
- [ ] 14 mensagens com timing definido para cada
- [ ] Cada mensagem ≤ 200 palavras
- [ ] CTA binário em toda mensagem que precisa de resposta
- [ ] Opt-in explícito na fase 1 (LGPD compliance)
- [ ] Opt-out claro disponível
- [ ] Segmentação pós-evento (casados vs. solteiros)
- [ ] Tom Legendários com emojis coerentes com o movimento
