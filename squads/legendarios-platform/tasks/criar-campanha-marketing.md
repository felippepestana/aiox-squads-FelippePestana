# Task: Criar Campanha de Marketing para Evento

**Task ID:** `lp-criar-campanha-marketing`
**Versão:** 1.0
**Agente Executor:** `marketing-master`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-001
**Comando:** `*criar-campanha [cidade] [tipo_evento] [data] [capacidade] [budget_mkt]`

---

## Objetivo

Criar pacote completo de marketing 360° para um evento Legendários (TOP/REM/LEGADO),
incluindo estratégia geral, Meta Ads, calendário Instagram, sequências WhatsApp e email,
e lista de influenciadores.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento (ex: Porto Velho/RO) |
| tipo_evento | enum | Sim | TOP, REM ou LEGADO |
| data | string | Sim | Data prevista (mês/ano mínimo) |
| capacidade | integer | Sim | Número máximo de participantes |
| budget_mkt | decimal | Sim | Orçamento total de marketing em R$ |
| nome_evento | string | Não | Nome especial (ex: Destemidos Pioneiros) |

## Precondições

- [ ] QG-LP-001 confirmado (briefing completo pelo legendarios-chief)
- [ ] Tipo de evento definido (TOP/REM/LEGADO)
- [ ] Data e cidade confirmadas
- [ ] Budget de marketing disponível e definido

## Passos

1. **Confirmar briefing** — registrar todos os parâmetros e validar completude
2. **Definir mensagem central** — 3 pilares (transformação + urgência + pertencimento)
3. **Calcular alocação de budget** — 45% ads / 20% criativo / 20% influenciadores / 10% tools / 5% contingência
4. **Definir fases de campanha** — Awareness (sem1-4) → Interesse (sem5-7) → Consideração (sem8-10) → Conversão (sem11-12)
5. **Acionar @conteudo-instagram** — calendário 12 semanas com copy pronto
6. **Acionar @ads-meta** — estrutura 3 campanhas (awareness + tráfego + conversão) com públicos e KPIs
7. **Acionar @whatsapp-automator** — sequência 6 fases, 14 mensagens
8. **Acionar @email-marketer** — 8 disparos pré e pós-evento com subject lines A/B
9. **Acionar @influencer-scout** — lista ranqueada + briefings individuais
10. **Consolidar pacote** — reunir todos os outputs num documento único
11. **Salvar via Write** — `pacote-marketing-[cidade-slug]-[AAAA-MM].md`
12. **Retornar ao @legendarios-chief** com caminho do arquivo e resumo

## Output

- **Local:** `pacote-marketing-[cidade-slug]-[AAAA-MM].md`
- **Formato:** Markdown consolidado com todas as seções
- **Seções:**
  - Estratégia e mensagem central
  - Alocação de budget por canal
  - KPIs por fase e canal
  - Calendário Instagram (12 semanas)
  - Estrutura de campanhas Meta Ads
  - Sequência WhatsApp (14 mensagens)
  - Sequência Email (8 disparos)
  - Lista de influenciadores + briefings

## Condições de Veto (auto-FAIL)

- Produzir campanha sem segmentação por gênero e localização
- Omitir canal WhatsApp no contexto brasileiro
- Propor orçamento de ads sem especificar instalação de Pixel/tracking
- Gerar conteúdo que contradiga valores cristãos do Movimento Legendários

## Critérios de Aceite

- [ ] Todos os 5 especialistas acionados e responderam
- [ ] Calendário Instagram com 12 semanas de conteúdo
- [ ] 3 campanhas Meta Ads estruturadas com públicos, criativos e KPIs
- [ ] Sequência WhatsApp com 14 mensagens e timings definidos
- [ ] 8 emails com subject lines A/B para os críticos
- [ ] Lista de influenciadores com budget, entregáveis e briefing
- [ ] Arquivo salvo via Write (QG-LP-002)
- [ ] Tom Legendários (cristão, AHU, transformação) em todos os materiais
