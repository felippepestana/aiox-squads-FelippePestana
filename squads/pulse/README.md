# Pulse — Clima & Engajamento

> 🟡 **Em desenvolvimento (esqueleto).** Este módulo da plataforma [Apex-Talent](../apex-talent/) disponibiliza hoje apenas o agente **Chief** (`pulse-chief`), que faz o intake da área e escopa o fluxo de especialistas a ser construído. Os agentes especialistas, tasks e templates serão adicionados nas próximas iterações.

## Área

**Clima & Engajamento** — parte da suíte de RH AI-native Apex-Talent.

Escuta organizacional contínua: pesquisa de clima, eNPS, pulses, ouvidoria anônima, gamificação, reconhecimento e planos de ação a partir dos dados.

## Funcionalidades-alvo

- Pesquisa de clima organizacional
- eNPS e pulses recorrentes
- Ouvidoria / canal anônimo
- Gamificação e reconhecimento
- Planos de ação a partir de resultados

## Diferencial de IA

Veja o [mapa de oportunidades de IA](../apex-talent/data/ai-opportunity-map.md) para o detalhe da abordagem AI-native desta área.

## Como usar

Selecione `pulse:pulse-chief` no chatbot ou na web.

Comandos do Chief:

- `*design-survey — Build a climate/eNPS/pulse survey`
- `*analyze-results — Theme + sentiment analysis`
- `*action-plan — Prioritized action plan from results`
- `*enps — Compute and interpret eNPS`
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Roadmap

1. **Agora:** Chief (intake + escopo do fluxo). ✅
2. **Próximo:** agentes especialistas (Tier 1/2), tasks e templates da área.
3. **Depois:** workflow `wf-*` e integração de dados com os demais módulos.

## Referência

Baseado em: *eNPS + Gallup Q12 engagement framework*.
