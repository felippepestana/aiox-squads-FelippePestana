# Task: Gerar PRD Completo do Evento

**Task ID:** `lp-gerar-prd-evento`
**Versão:** 1.0
**Agente Executor:** `legendarios-chief` (coordena todos os masters)
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-007
**Comando:** `*prd [cidade] [tipo_evento] [data] [capacidade]`

---

## Objetivo

Gerar PRD (Product Requirements Document) completo de um evento Legendários,
documentando todos os requisitos de marketing, operação, inscrições, comunidade
e analytics num único documento abrangente.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| tipo_evento | enum | Sim | TOP, REM, LEGADO |
| data | date | Sim | Data prevista do evento |
| capacidade | integer | Sim | Meta de participantes |
| budget_total | decimal | Não | Orçamento total do evento (marketing + operação) |
| nome_evento | string | Não | Nome especial (ex: Destemidos Pioneiros) |

## Precondições

- [ ] QG-LP-001 confirmado (todos os parâmetros)
- [ ] Tipo de evento definido
- [ ] Cidade e data confirmadas

## Passos

1. **Registrar contexto** — briefing completo + missão do evento
2. **Executar lp-criar-campanha-marketing** — pacote de marketing completo
3. **Executar lp-planejar-operacao** — checklist operacional
4. **Executar lp-configurar-inscricoes** — estrutura de lotes e formulário
5. **Executar lp-gestao-pos-evento** — plano alumni e comunidade
6. **Executar lp-gerar-relatorio (projeção)** — projeção financeira em 3 cenários
7. **Consolidar PRD** — montar documento único com todas as seções
8. **Salvar via Write** — `prd-[nome-evento-slug]-[AAAA-MM].md`
9. **Confirmar ao @legendarios-chief** com caminho e resumo executivo

## Output

- **Local:** `prd-[nome-evento-slug]-[AAAA-MM].md`
- **Formato:** PRD completo em Markdown
- **Seções Obrigatórias:**
  1. Visão e Contexto do Evento
  2. Personas (Coordenador Regional, Participante, Voluntário, HQ Brasil)
  3. Escopo do Evento (capacidade, data, local, tipo)
  4. Módulo Marketing Digital (estratégia + canais + KPIs)
  5. Módulo Inscrições e Ticketing (lotes + plataforma + pagamento)
  6. Módulo Operação D-day (equipe + check-in + logística)
  7. Módulo Pós-Evento e Comunidade (alumni + RPM + cross-sell)
  8. Módulo Analytics (métricas + dashboard + benchmarks)
  9. Projeção Financeira (3 cenários)
  10. Cronograma Master (12 semanas pré + 4 semanas pós)
  11. Requisitos Não-Funcionais (LGPD, PIX, multi-cidade)
  12. Glossário Legendários

## Condições de Veto (auto-FAIL)

- Gerar PRD sem todas as 12 seções obrigatórias
- Omitir projeção financeira (mesmo que estimada)
- Não salvar via Write

## Critérios de Aceite

- [ ] Todas as 12 seções obrigatórias presentes
- [ ] Todos os sub-módulos executados e integrados
- [ ] Projeção financeira em 3 cenários incluída
- [ ] Cronograma master completo (semana a semana)
- [ ] Benchmarks de Balneário Camboriú como referência
- [ ] Requisitos LGPD documentados
- [ ] Arquivo salvo via Write
