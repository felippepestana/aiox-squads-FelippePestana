# Template: Pacote de Marketing — Evento Legendários

**Evento:** {{NOME_EVENTO}}
**Cidade:** {{CIDADE}} / {{ESTADO}}
**Tipo:** {{TIPO_EVENTO}} (TOP | REM | LEGADO)
**Data:** {{DATA_EVENTO}}
**Capacidade:** {{CAPACIDADE}} participantes
**Budget de Marketing:** R$ {{BUDGET_MARKETING}}
**Gerado em:** {{DATA_GERACAO}}

---

## 1. Estratégia e Mensagem Central

### Mensagem Central
> "{{MENSAGEM_CENTRAL}}"

### 3 Pilares da Campanha
| Pilar | Mensagem | Canal Principal |
|---|---|---|
| Transformação | {{MSG_TRANSFORMACAO}} | Instagram Reels / YouTube |
| Urgência | {{MSG_URGENCIA}} | Meta Ads / WhatsApp broadcast |
| Pertencimento | {{MSG_PERTENCIMENTO}} | Instagram Stories / Comunidade |

### Prova Social Nomeada
- **Participantes famosos verificados:** Neymar Sr., Joel Jota, Thiago Nigro, Pablo Marçal, Eliezer, Ronaldo Jacaré
- **Participantes locais/regionais:** {{NOMES_LOCAIS}}
- **Testemunho-âncora da campanha:** {{DESCRICAO_TESTEMUNHO_ANCORA}}

---

## 2. Alocação de Budget

| Canal | Valor | % | Responsável |
|---|---|---|---|
| Meta Ads (Facebook/Instagram) | R$ {{BUDGET_ADS}} | 45% | @ads-meta |
| Produção criativa (fotos/vídeos) | R$ {{BUDGET_CRIATIVO}} | 20% | Coordenador |
| Influenciadores locais | R$ {{BUDGET_INFLUENCIADORES}} | 20% | @influencer-scout |
| WhatsApp Business API + email tools | R$ {{BUDGET_TOOLS}} | 10% | @whatsapp-automator |
| Contingência | R$ {{BUDGET_CONTINGENCIA}} | 5% | Reserva |
| **TOTAL** | **R$ {{BUDGET_TOTAL}}** | **100%** | — |

---

## 3. KPIs por Fase e Canal

| Fase | Semanas | Objetivo | Canal | KPI Meta |
|---|---|---|---|---|
| Awareness | 1-4 | Alcance e reconhecimento | Instagram + Meta Ads | CPM ≤ R$ 8, 50K+ impressões/sem |
| Interesse | 5-7 | Captura de leads | Meta Ads Leads + WhatsApp | CPL ≤ R$ 15, leads/sem crescente |
| Consideração | 8-10 | Nutrição e engajamento | WhatsApp + Email | Abertura ≥ 85% (WA), ≥ 40% (email) |
| Conversão | 11-12 | Inscrições e pagamentos | Remarketing + WhatsApp | ROAS ≥ 8:1, CPA ≤ R$ 125 |
| Pós-evento | 13-16 | Depoimentos + cross-sell | WhatsApp + Email | Depoimentos ≥ 40%, cross-sell ≥ 15% |

---

## 4. Calendário Instagram — 12 Semanas

> **Frequência:** 3 publicações/semana (segunda, quarta, sexta)
> **Formatos:** 40% Reels | 30% Stories | 20% Feed | 10% CTA direto

| Semana | Dia | Formato | Tema / Hook | CTA |
|---|---|---|---|---|
| 1 | Seg | Reels (45s) | {{HOOK_SEM1_SEG}} | Marque um amigo |
| 1 | Qua | Carrossel | "O que acontece em 3 dias no TOP" | Salve este post |
| 1 | Sex | Stories (5fr) | Neymar Sr. no TOP + citação | Link na bio |
| 2 | Seg | Reels (60s) | {{HOOK_SEM2_SEG}} | Comente "QUERO" |
| 2 | Qua | Feed | Citação inspiracional | Compartilhe |
| 2 | Sex | Stories | Countdown abertura inscrições | Ative o sininho |
| ... | ... | ... | {{CONTINUAR_12_SEMANAS}} | ... |

*[Calendário completo gerado pelo @conteudo-instagram]*

---

## 5. Estrutura de Campanhas Meta Ads

### Campanha 1 — AWARENESS (Semanas 1-5)
- **Objetivo:** Alcance
- **Budget:** R$ {{BUDGET_AWARENESS}} (20% do total ads)
- **Público:** Homens 25-55 | {{CIDADE}} + entorno | Interesses: fé cristã, liderança, esportes, empreendedorismo
- **Criativos:** Vídeo 45s (o que é o TOP) + Vídeo 15s (depoimento famoso)
- **KPIs:** CPM ≤ R$ 8 | Alcance: {{META_ALCANCE}}+ únicos | Frequência ≥ 2

### Campanha 2 — TRÁFEGO/LEADS (Semanas 4-9)
- **Objetivo:** Geração de Leads (WhatsApp)
- **Budget:** R$ {{BUDGET_TRAFEGO}} (35% do total ads)
- **Público Frio:** LAL 1% de alumni anteriores
- **Público Quente:** Engajados Instagram 60 dias
- **Criativos:** Vídeo 75s (3 dias no TOP) + Carrossel "7 motivos"
- **KPIs:** CPL ≤ R$ 15 | CTR ≥ 1.5% | Meta leads: {{META_LEADS}}+

### Campanha 3 — CONVERSÃO (Semanas 8-12)
- **Objetivo:** Purchase (inscrição Ticket and GO)
- **Budget:** R$ {{BUDGET_CONVERSAO}} (45% do total ads)
- **Público:** Remarketing site 30d + Lista WA não convertida + LAL inscritos 1%
- **Criativos:** Vídeo urgência (vagas) + Imagem countdown + Vídeo coordenador local
- **KPIs:** ROAS ≥ 8:1 | CPA ≤ R$ 125 | Frequência ≥ 3.5

**Pré-requisito:** Meta Pixel instalado + Conversions API configurada

---

## 6. Sequência WhatsApp Business — 14 Mensagens

*[Sequência completa gerada pelo @whatsapp-automator]*

| # | Fase | Trigger | Delay | Preview da Mensagem |
|---|---|---|---|---|
| 1 | Descoberta | Opt-in | Imediato | "Olá, [Nome]! Bem-vindo ao Movimento Legendários..." |
| 2 | Descoberta | Após SIM | +24h | "Sabia que Neymar pai, Joel Jota e Pablo Marçal já fizeram..." |
| 3 | Interesse | Resp. positiva | Imediato | "O TOP - {{NOME_EVENTO}} vai acontecer em {{CIDADE}}..." |
| 4 | Interesse | Sem resposta 48h | +48h | "O 1º Lote tem apenas 80 vagas a R$ 990..." |
| 5 | Inscrição | Clique link | Imediato | "Ótima decisão! Sua inscrição está sendo processada..." |
| 6 | Inscrição | Sem pagto 1h | +1h | "Sua vaga ainda não foi confirmada. PIX é instantâneo..." |
| 7 | Confirmação | Pagto confirmado | Imediato | "🏔️ CONFIRMADO! Bem-vindo, Lendário [Nome]!" |
| 8 | Preparação | D-21 | D-21 | "Faltam 21 dias! Lista de itens obrigatórios..." |
| 9 | Preparação | D-7 | D-7 | "7 dias, [Nome]! Dica dos veteranos de Balneário..." |
| 10 | Preparação | D-1 | D-1 | "Amanhã começa! Local, horário, celular desligado..." |
| 11 | Pós-evento | D+1 | D+1 | "Você foi! Você é um Destemido Pioneiro..." |
| 12 | Pós-evento | D+3 | D+3 | "Grave um áudio de 60-90s contando o que o TOP..." |
| 13 | Retenção | D+14 | D+14 | "Como está sendo depois do TOP? RPM Porto Velho..." |
| 14 | Retenção | D+21 (casados) | D+21 | "Você mudou. E a sua esposa? REM foi criado para vocês..." |

---

## 7. Sequência de Email Marketing — 8 Disparos

*[Sequência completa gerada pelo @email-marketer]*

| # | Timing | Subject (A) | Subject (B) | KPI Alvo |
|---|---|---|---|---|
| 1 | Opt-in | 🏔️ Bem-vindo, [Nome] — O TOP está chegando a {{CIDADE}} | {{CIDADE}} terá seus primeiros Legendários. Você é um? | Abertura 55%+ |
| 2 | D+2 | A história de um homem que subiu a montanha e voltou diferente | Neymar pai chorou no TOP. Aqui está o que aconteceu. | Abertura 40%+ |
| 3 | D+5 | Você ainda não se inscreveu. Por quê? | 'Não tenho tempo/dinheiro/preparo' — Vamos conversar. | Abertura 35%+ |
| 4 | 75% lote | ⚠️ [Nome], restam apenas X vagas no Lote Atual | Urgente: o preço sobe em [X] dias | Abertura 50%+ |
| 5 | Encerr.-48h | ⏰ Últimas 48h — depois disso não tem mais jeito | [Nome], essa é a última chance de subir a montanha | Abertura 60%+ |
| 6 | Pagto OK | ✅ Confirmado! Você é um Destemido Pioneiro, [Nome] | — (transacional) | Abertura 80%+ |
| 7 | D-14 | 🎒 [Nome], 2 semanas para o TOP — você está preparado? | — | Abertura 65%+ |
| 8 | D+3 | 🏔️ [Nome] — o que veio depois da montanha? | — | Abertura 50%+ |

---

## 8. Influenciadores — Lista e Briefings

*[Lista completa gerada pelo @influencer-scout]*

### Prova Social Gratuita (sem custo)
- Neymar Sr. (@neymarpaizao) — Participante verificado
- Joel Jota (@joeljota) — Participante verificado
- Thiago Nigro (@thiago.nigro) — Participante verificado
- Pablo Marçal (@pablomarcal) — Participante verificado

### Influenciadores Locais/Regionais
| Rank | Nome | Perfil | Tier | Seguidores est. | Budget | Entregáveis |
|---|---|---|---|---|---|---|
| 1 | {{INF1_NOME}} | {{INF1_PERFIL}} | Micro | {{INF1_SEG}} | R$ {{INF1_BUDGET}} | 3 Stories + 1 Reels |
| 2 | {{INF2_NOME}} | {{INF2_PERFIL}} | Micro | {{INF2_SEG}} | R$ {{INF2_BUDGET}} | 2 Stories + 1 Reels |
| 3 | {{INF3_NOME}} | {{INF3_PERFIL}} | Nano | {{INF3_SEG}} | Ingresso VIP | 3 Stories |

---

*Pacote gerado pelo squad @legendarios-platform | Referência: TOP Balneário Camboriú (TOP #555, #644)*
*LGPD: Todos os contatos coletados com consentimento explícito. Opt-out disponível em todas as comunicações.*
