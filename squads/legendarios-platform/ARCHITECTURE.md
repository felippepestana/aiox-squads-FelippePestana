# Arquitetura — Legendários Platform

## Visão Geral

O squad **legendarios-platform** implementa uma plataforma full-service de IA para o Movimento Legendários,
cobrindo o ciclo completo de eventos (TOP, REM, LEGADO) desde a concepção até o pós-evento.

---

## Pipeline de Dados

```
INPUT (Briefing do Evento)
       │
       ▼
legendarios-chief ──── QG-LP-001 (Briefing confirmado?)
       │                         │ NÃO → Perguntar usuário
       │ SIM
       ├──────────────────────────────────────────────────┐
       │                          │                        │
UC-LP-001                    UC-LP-002/003            UC-LP-004
(Marketing)                  (Operação)               (Pós-evento)
       │                          │                        │
marketing-master             event-master          community-master
       │                          │                        │
  ┌────┴────┐               check-in-coord          crm-manager
  │   5     │                    │                        │
  │especialistas│           QG-LP-003                QG-LP-004
  └────┬────┘            (Write checklist)          (Write plano)
       │
  QG-LP-002
(Pacote completo?)
       │
       ▼
 analytics-reporter
       │
  QG-LP-005
(Write relatório)
       │
       ▼
legendarios-chief
(Consolida e entrega)
```

---

## Decisões Arquiteturais

### 1. Separação Marketing / Operação / Comunidade
Os 3 Masters (marketing-master, event-master, community-master) são independentes e ativados por UC diferente.
Isso permite uso parcial do squad (ex.: apenas marketing sem operar o evento pelo AIOX).

### 2. Especialistas Tier 2 são paralelos
Dentro do UC-LP-001, os 5 especialistas de marketing são acionados em paralelo pelo marketing-master.
Nenhum depende do outro — todos retornam ao master que consolida o pacote.

### 3. Write obrigatório em QGs críticos
Relatórios e checklists devem ser salvos via Write — não apenas exibidos no chat.
Isso garante persistência do trabalho e rastreabilidade.

### 4. Dados como fonte única de verdade
Os 4 data files (`cidades-br.yaml`, `lotes-preco.yaml`, `canais-marketing.yaml`, `eventos-referencia.yaml`)
são a fonte de dados que todos os agentes referenciam. Atualizar os data files atualiza o comportamento de todos.

### 5. Benchmarks embutidos
Balneário Camboriú (TOP #555, #644) é o benchmark de referência embutido nos prompts dos agentes e nos data files.
Porto Velho usa metas calibradas em 70-80% do benchmark.

---

## Fluxo por Use Case

### UC-LP-001 — Campanha de Marketing

```
legendarios-chief
    └── marketing-master (recebe briefing)
            ├── conteudo-instagram (calendário 12 semanas)
            ├── ads-meta (3 campanhas Meta Ads)
            ├── whatsapp-automator (14 mensagens, 6 fases)
            ├── email-marketer (8 disparos A/B)
            └── influencer-scout (lista ranqueada + briefings)
                    └── marketing-master (consolida tudo)
                            └── Write: pacote-marketing-[cidade]-[data].md
                                    └── QG-LP-002 ✅
```

### UC-LP-002 — Operação D-day

```
legendarios-chief
    └── event-master
            └── check-in-coordinator
                    └── Write: checklist-operacional-[cidade]-[data].md
                                └── QG-LP-003 ✅
```

### UC-LP-004 — Pós-Evento

```
legendarios-chief
    └── community-master
            └── crm-manager (segmentação + scoring)
                    └── community-master (cross-sell + RPM + indicação)
                            └── Write: plano-alumni-[cidade]-[data].md
                                        └── QG-LP-004 ✅
```

### UC-LP-007 — PRD Completo

```
legendarios-chief
    ├── marketing-master (UC-LP-001 completo)
    ├── event-master (UC-LP-002 + UC-LP-003)
    ├── community-master (UC-LP-004)
    └── analytics-reporter (projeção financeira)
            └── legendarios-chief (consolida PRD)
                    └── Write: prd-[evento]-[data].md
```

---

## Model Routing

| Complexidade | Modelo | Tarefas |
|---|---|---|
| Alta | `claude-opus-4-7` | Estratégia de marketing completa, PRD, funil e segmentação |
| Média | `claude-sonnet-4-6` | Copy de posts/emails/WhatsApp, checklists operacionais, relatórios |
| Baixa | `claude-haiku-4-5` | Validações, confirmações, extração de dados de formulários |

---

## Integrações Externas

| Sistema | Tipo | Uso |
|---|---|---|
| **Ticket and GO** | Plataforma de ticketing | Inscrições, lotes, PIX, check-in QR |
| **WhatsApp Business API** | Messaging | Sequências automáticas, broadcasts |
| **Meta Ads** | Advertising | Facebook/Instagram campaigns (Pixel + Conversions API) |
| **Email tool** (ActiveCampaign/RD Station) | Email marketing | Sequências automatizadas |
| **Instagram** | Social media | Conteúdo orgânico |
| **Sympla** | Ticketing secundário | Descoberta + backup |

---

## LGPD Compliance Architecture

```
Formulário de Inscrição (Ticket and GO)
    ├── Consentimento de comunicação (opt-in ativo) ────► WhatsApp + Email
    ├── Consentimento de uso de imagem ─────────────────► Instagram + YouTube
    └── Dados de perfil (casado/solteiro, filhos) ──────► CRM segmentação
              │
              ▼
         CRM Alumni
              │
         Retenção: 6 meses após evento
              │
         Exclusão automática
```

---

## Escalabilidade Multi-Cidade

O squad foi projetado para múltiplas cidades simultâneas:

1. **Parâmetro `cidade`** em todas as tasks — cada execução é por cidade
2. **Data files** com scoring de expansão para novas praças
3. **Benchmarks relativos** — cada cidade tem metas calibradas pela maturidade local
4. **Alumni segmentados por cidade** — sem mistura de bases

**Ordem de expansão sugerida:**
Porto Velho (RO) → Manaus (AM) → Campo Grande (MS) → Belém (PA) → outras capitais Norte/Centro-Oeste

---

## Convenções de Nomenclatura de Arquivos de Output

| Tipo | Padrão |
|---|---|
| Pacote marketing | `pacote-marketing-[cidade-slug]-[AAAA-MM].md` |
| Checklist operacional | `checklist-operacional-[cidade-slug]-[AAAA-MM-DD].md` |
| Config inscrições | `config-inscricoes-[cidade-slug]-[AAAA-MM].md` |
| Plano alumni | `plano-alumni-[cidade-slug]-[AAAA-MM].md` |
| Influenciadores | `influenciadores-[cidade-slug]-[AAAA-MM].md` |
| Relatório semanal | `relatorio-semanal-[cidade-slug]-semana[N]-[AAAA-MM-DD].md` |
| Relatório final | `relatorio-final-[cidade-slug]-[AAAA-MM-DD].md` |
| PRD | `prd-[evento-slug]-[AAAA-MM].md` |

**Slug padrão:** lowercase, sem acentos, hífens (ex: `porto-velho`, `balneario-camboriu`)
