# Chronos — Controle de Ponto

> 🟡 **Em desenvolvimento (esqueleto).** Este módulo da plataforma [Apex-Talent](../apex-talent/) disponibiliza hoje apenas o agente **Chief** (`chronos-chief`), que faz o intake da área e escopa o fluxo de especialistas a ser construído. Os agentes especialistas, tasks e templates serão adicionados nas próximas iterações.

## Área

**Controle de Ponto** — parte da suíte de RH AI-native Apex-Talent.

Controle de ponto e jornada: registro (biometria/geo/mobile), banco de horas, escalas, alertas de jornada e espelho de ponto.

## Funcionalidades-alvo

- Registro de ponto (biometria facial / geo / mobile)
- Banco de horas
- Escalas e jornadas
- Alertas de jornada e espelho de ponto
- Equipes externas / home office

## Diferencial de IA

Veja o [mapa de oportunidades de IA](../apex-talent/data/ai-opportunity-map.md) para o detalhe da abordagem AI-native desta área.

## Como usar

Selecione `chronos:chronos-chief` no chatbot ou na web.

Comandos do Chief:

- `*register-time — Support a time registration`
- `*close-timebank — Reconcile the time bank`
- `*audit-journey — Detect inconsistencies and liability risk`
- `*manage-shifts — Build/adjust shift schedules`
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Roadmap

1. **Agora:** Chief (intake + escopo do fluxo). ✅
2. **Próximo:** agentes especialistas (Tier 1/2), tasks e templates da área.
3. **Depois:** workflow `wf-*` e integração de dados com os demais módulos.

## Referência

Baseado em: *CLT jornada rules + time-bank practices*.
