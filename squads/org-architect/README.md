# Org-Architect — Cargos, Salários & Org Design

> 🟡 **Em desenvolvimento (esqueleto).** Este módulo da plataforma [Apex-Talent](../apex-talent/) disponibiliza hoje apenas o agente **Chief** (`org-architect-chief`), que faz o intake da área e escopa o fluxo de especialistas a ser construído. Os agentes especialistas, tarefas e modelos serão adicionados nas próximas iterações.

## Área

**Cargos, Salários & Org Design** — parte da suíte de RH AI-native Apex-Talent.

Arquitetura organizacional: descrições de cargo, plano de carreira, faixas salariais, organograma, job architecture skills-based (4R) e equidade salarial.

## Funcionalidades-alvo

- Descrições de cargo e plano de carreira
- Faixas salariais
- Organograma
- Job architecture skills-based (4R)
- Equidade salarial

## Diferencial de IA

Veja o [mapa de oportunidades de IA](../apex-talent/data/ai-opportunity-map.md) para o detalhe da abordagem AI-native desta área.

## Como usar

Selecione `org-architect:org-architect-chief` no chatbot ou na web.

Comandos do Chief:

- `*write-jd — Write a job description`
- `*set-bands — Define/benchmark salary bands`
- `*org-chart — Model the org structure`
- `*pay-equity — Detect pay inequities`
- `*4r — Apply the 4R framework to a role`
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Roteiro

1. **Agora:** Chief (intake + escopo do fluxo). ✅
2. **Próximo:** agentes especialistas (Tier 1/2), tarefas e modelos da área.
3. **Depois:** workflow `wf-*` e integração de dados com os demais módulos.

## Referência

Baseado em: *Josh Bersin 4R (Redesign, Reskill, Retain, Recruit) + skills-based job architecture*.
