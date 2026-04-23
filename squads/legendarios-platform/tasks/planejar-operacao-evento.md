# Task: Planejar Operação do Evento

**Task ID:** `lp-planejar-operacao`
**Versão:** 1.0
**Agente Executor:** `event-master` + `check-in-coordinator`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-002
**Comando:** `*planejar-operacao [cidade] [data] [capacidade]`

---

## Objetivo

Gerar checklist operacional completo para um evento Legendários (TOP/REM/LEGADO),
incluindo protocolo de check-in, briefing de voluntários por função, comunicação D-day
e protocolo de emergências.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| data | date | Sim | Data do evento (início) |
| capacidade | integer | Sim | Número de participantes confirmados |
| tipo_evento | enum | Sim | TOP (3-4 dias), REM (2 dias), LEGADO |
| local_evento | string | Não | Endereço/nome do local (preencher quando confirmado) |

## Precondições

- [ ] QG-LP-001 confirmado (briefing completo)
- [ ] Capacidade de participantes definida
- [ ] Data do evento confirmada

## Passos

1. **Calcular equipe** — ratio 1 voluntário por 20 participantes; calcular por função
2. **Definir estrutura de check-in** — número de postos, dispositivos, impressoras
3. **Acionar @check-in-coordinator** — protocolo detalhado de check-in e D-day
4. **Gerar briefings por função** — Recepção, Trilha, Alimentação, Oração, Mídia, Coord. Geral
5. **Mapear protocolo de emergências** — SAMU, Bombeiros, hospital de referência local
6. **Criar cronograma D-day** — horários de chegada voluntários, abertura, atividades, encerramento
7. **Definir comunicação D-day** — sequência de broadcasts WhatsApp (D-7, D-1, D-day)
8. **Salvar via Write** — `checklist-operacional-[cidade-slug]-[AAAA-MM-DD].md`
9. **Confirmar ao @legendarios-chief** com caminho do arquivo (QG-LP-003)

## Output

- **Local:** `checklist-operacional-[cidade-slug]-[AAAA-MM-DD].md`
- **Formato:** Markdown com checklists e tabelas
- **Seções:**
  - Equipe necessária (tabela por função, qtd, horário, materiais)
  - Setup de check-in (postos, dispositivos, fluxo)
  - Briefing de voluntários por função
  - Protocolo de emergências (contatos locais)
  - Cronograma D-day hora a hora
  - Comunicação D-day (mensagens prontas para WhatsApp)
  - Lista de materiais e equipamentos

## Condições de Veto (auto-FAIL)

- Gerar checklist sem protocolo de emergências com contatos locais
- Omitir app Ticket and GO / Legendários - Check-in do protocolo de check-in
- Calcular equipe de voluntários abaixo do ratio mínimo (1:20)
- Gerar checklist de TOP sem protocolo de celulares na entrada

## Critérios de Aceite

- [ ] Tabela de equipe com funções, quantidades, horários e materiais
- [ ] Protocolo de check-in com postos calculados pela capacidade
- [ ] Briefing escrito para cada função de voluntário
- [ ] Protocolo de emergências com contatos locais (SAMU, Bombeiros, hospital)
- [ ] Cronograma D-day com horários definidos
- [ ] Mensagens WhatsApp D-7, D-1 e D-day prontas
- [ ] Arquivo salvo via Write (QG-LP-003)
