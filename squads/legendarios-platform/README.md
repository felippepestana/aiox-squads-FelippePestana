# Legendários Platform

> Plataforma full-service de IA para o ciclo completo dos eventos do Movimento Legendários — do primeiro anúncio ao último RPM.

**Versão:** 1.0.0 | **Criado:** 2026-04-23 | **Agentes:** 12 | **Tasks:** 10 | **Templates:** 7

---

## O que é este Squad

O **Legendários Platform** é um squad AIOX que orquestra todos os aspectos de um evento Legendários (TOP, REM, LEGADO):

- **Marketing Digital 360°** — Meta Ads, Instagram, WhatsApp Business, email marketing, influenciadores
- **Gestão de Inscrições** — Ticket and GO, lotes automáticos, PIX, LGPD compliance
- **Operação D-day** — check-in digital, briefing de voluntários, protocolo de emergências
- **Pós-evento e Comunidade** — alumni, RPM mensal, cross-sell REM/LEGADO, indicações
- **Analytics** — dashboard de vendas, ROI de marketing, projeção financeira

**Referência primária:** TOP Balneário Camboriú (TOP #555, #644, 500+ participantes)
**Evento alvo:** TOP - Destemidos Pioneiros | Porto Velho/RO

---

## Ativar o Orchestrator

```
@legendarios-platform:legendarios-chief
```

---

## Arquitetura do Squad

```
legendarios-chief (Tier 0 — Orchestrator)
         │
         ├── marketing-master (Tier 1)
         │        ├── conteudo-instagram (Tier 2)
         │        ├── ads-meta (Tier 2)
         │        ├── whatsapp-automator (Tier 2)
         │        ├── email-marketer (Tier 2)
         │        └── influencer-scout (Tier 2)
         │
         ├── event-master (Tier 1)
         │        └── check-in-coordinator (Tier 2)
         │
         ├── community-master (Tier 1)
         │        └── crm-manager (Tier 2)
         │
         └── analytics-reporter (Tier 3)
```

---

## Agentes

| Tier | Agente | Foco | Tools |
|------|--------|------|-------|
| Tier 0 | `legendarios-chief` | Orquestração, classificação UC, quality gates | — |
| Tier 1 | `marketing-master` | Estratégia de marketing 360° | WebSearch |
| Tier 1 | `event-master` | Logística, inscrições, checklist operacional | Read, Write |
| Tier 1 | `community-master` | Pós-evento, alumni, RPM, cross-sell | Read, Write |
| Tier 2 | `conteudo-instagram` | Calendário e copy Instagram (12 semanas) | Write |
| Tier 2 | `ads-meta` | Campanhas Meta Ads (3 fases + públicos) | Write |
| Tier 2 | `whatsapp-automator` | Sequências WhatsApp Business (6 fases, 14 msgs) | Write |
| Tier 2 | `email-marketer` | Email marketing (8 disparos pré e pós) | Write |
| Tier 2 | `influencer-scout` | Descoberta e briefings de influenciadores locais | WebSearch, Write |
| Tier 2 | `check-in-coordinator` | Protocolo D-day, briefing voluntários | Write |
| Tier 2 | `crm-manager` | Segmentação alumni, cross-sell, indicação | Read, Write |
| Tier 3 | `analytics-reporter` | Dashboard, ROI, projeção financeira | Read, Write |

---

## Use Cases

| UC | Trigger | Módulos | Output |
|----|---------|---------|--------|
| **UC-LP-001** | "criar campanha TOP [cidade]" | marketing-master + 5 especialistas | Pacote de marketing completo |
| **UC-LP-002** | "planejar operação [cidade]" | event-master + check-in-coordinator | Checklist operacional |
| **UC-LP-003** | "configurar inscrições [cidade]" | event-master | Config lotes + formulário LGPD |
| **UC-LP-004** | "pós-evento [cidade]" | community-master + crm-manager | Plano alumni + cross-sell |
| **UC-LP-005** | "influenciadores [cidade]" | influencer-scout | Lista ranqueada + briefings |
| **UC-LP-006** | "relatório [cidade]" | analytics-reporter | Dashboard + ROI + projeção |
| **UC-LP-007** | "PRD completo [cidade]" | todos os módulos | PRD abrangente do evento |

---

## Quick Start — Exemplos de Uso

```
# Campanha de marketing completa
"Criar campanha para TOP Porto Velho — 400 participantes, agosto/2026, budget R$ 25.000"

# Operação do evento
"Planejar operação TOP Porto Velho com 350 participantes confirmados"

# Configurar inscrições
"Configurar inscrições para TOP Porto Velho — 400 vagas, abertura em maio"

# Gestão pós-evento
"TOP Porto Velho encerrado com 380 presentes — criar plano pós-evento"

# Buscar influenciadores
"Encontrar influenciadores para TOP Porto Velho — budget R$ 5.000"

# Dashboard de vendas
"Relatório semanal TOP Porto Velho — semana 8, 280 inscritos de 400"

# PRD completo
"Gerar PRD completo para TOP Destemidos Pioneiros — Porto Velho, agosto/2026"
```

---

## Quality Gates

| ID | Gate | Agente | Critério |
|----|------|--------|----------|
| QG-LP-001 | Briefing Confirmado | legendarios-chief | Cidade + tipo + data + capacidade + budget definidos |
| QG-LP-002 | Pacote Marketing Completo | marketing-master | Todos os 5 especialistas retornaram outputs |
| QG-LP-003 | Checklist Operacional Salvo | event-master | Write executado com arquivo salvo |
| QG-LP-004 | Plano Alumni Salvo | community-master | Write executado + segmentação + cross-sell |
| QG-LP-005 | Relatório Rastreado | analytics-reporter | Write + semáforo + benchmark Balneário |

---

## Contexto — Movimento Legendários

| Dado | Valor |
|---|---|
| Fundado | 23 jul 2015 — Guatemala (Pastor Chepe Putzu, Igreja Casa de Dios) |
| Brasil desde | 2017 (Pastor Ricardo Bernardes) |
| Sede BR | Igreja Embaixada, Balneário Camboriú/SC |
| Membros globais | 85.000+ |
| Brasil | 25.000+ participantes, 18 estados |
| Crescimento BR | 30%+/ano |
| Cidades | 170+ em 20 países |
| Eventos | TOP, REM, LEGADO, RPM |
| Plataforma | Ticket and GO + app "Legendários - Check-in" |
| Preço TOP | R$ 990–R$1.790 (padrão) |

---

## Estrutura de Arquivos

```
squads/legendarios-platform/
├── config.yaml
├── README.md
├── ARCHITECTURE.md
├── agents/
│   ├── legendarios-chief.md       (Tier 0)
│   ├── marketing-master.md        (Tier 1)
│   ├── event-master.md            (Tier 1)
│   ├── community-master.md        (Tier 1)
│   ├── conteudo-instagram.md      (Tier 2)
│   ├── ads-meta.md                (Tier 2)
│   ├── whatsapp-automator.md      (Tier 2)
│   ├── email-marketer.md          (Tier 2)
│   ├── influencer-scout.md        (Tier 2)
│   ├── check-in-coordinator.md    (Tier 2)
│   ├── crm-manager.md             (Tier 2)
│   └── analytics-reporter.md     (Tier 3)
├── tasks/                         (10 tasks)
├── templates/                     (7 templates)
├── data/                          (4 data files)
└── checklists/                    (2 checklists)
```

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de agentes | 12 |
| Tier 0 (Orchestrator) | 1 |
| Tier 1 (Masters) | 3 |
| Tier 2 (Specialists) | 7 |
| Tier 3 (Support) | 1 |
| Tasks | 10 |
| Templates | 7 |
| Data files | 4 |
| Checklists | 2 |
| Use Cases | 7 |
| Quality Gates | 5 |
