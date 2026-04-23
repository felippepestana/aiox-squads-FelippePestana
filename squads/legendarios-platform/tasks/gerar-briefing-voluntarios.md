# Task: Gerar Briefing de Voluntários

**Task ID:** `lp-gerar-briefing-voluntarios`
**Versão:** 1.0
**Agente Executor:** `check-in-coordinator`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-002 (subtask)
**Comando:** `*briefing-voluntarios [num_participantes] [cidade] [data]`

---

## Objetivo

Gerar briefings escritos por função para toda a equipe de voluntários de um evento
Legendários, com responsabilidades, materiais, horários e protocolos de cada cargo.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| num_participantes | integer | Sim | Participantes esperados |
| cidade | string | Sim | Cidade do evento |
| data | date | Sim | Data do evento |
| tipo_evento | enum | Sim | TOP (3-4 dias), REM (2 dias), LEGADO |

## Passos

1. **Calcular equipe** — 1 voluntário por 20 participantes, distribuir por funções
2. **Gerar briefing: Recepção e Check-in** — funções, materiais, fluxo do app, protocolo de erro
3. **Gerar briefing: Segurança de Trilha** (apenas TOP) — percurso, rádio, kit primeiros socorros
4. **Gerar briefing: Logística e Alimentação** — cardápio, quantidades, restrições alimentares
5. **Gerar briefing: Oração e Suporte Espiritual** — disponibilidade 24h, protocolo de crise emocional
6. **Gerar briefing: Mídia e Comunicação** — protocolo de fotos, sem publicação durante evento
7. **Gerar briefing: Coordenador Geral** — cronograma, escalada de problemas, comunicação com liderança
8. **Incluir protocolo de emergências** — SAMU, Bombeiros, hospital local com números

## Output

- **Formato:** Markdown com seção por função (tabela + texto de briefing)
- **Entregue para:** @event-master (integra no checklist operacional)

## Critérios de Aceite

- [ ] Tabela geral da equipe com funções, quantidades, horários e materiais
- [ ] Briefing escrito para cada uma das 6 funções
- [ ] Ratio de voluntários calculado (1:20)
- [ ] Protocolo de emergências com contatos locais
- [ ] Protocolo do app Legendários - Check-in para equipe de recepção
- [ ] Horário de chegada de voluntários (2h antes dos participantes)
