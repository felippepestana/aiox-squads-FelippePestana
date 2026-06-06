# PeopleOps — Departamento Pessoal & Folha

> 🟡 **Em desenvolvimento (esqueleto).** Este módulo da plataforma [Apex-Talent](../apex-talent/) disponibiliza hoje apenas o agente **Chief** (`peopleops-chief`), que faz o intake da área e escopa o fluxo de especialistas a ser construído. Os agentes especialistas, tarefas e modelos serão adicionados nas próximas iterações.

## Área

**Departamento Pessoal & Folha** — parte da suíte de RH AI-native Apex-Talent.

Departamento pessoal e folha: admissão digital, gestão de documentos, folha de pagamento, eSocial, férias, afastamentos e rescisão.

## Funcionalidades-alvo

- Admissão digital e gestão de documentos
- Folha de pagamento
- eSocial
- Férias, afastamentos e rescisão
- Holerite e base compartilhada RH ↔ DP

## Diferencial de IA

Veja o [mapa de oportunidades de IA](../apex-talent/data/ai-opportunity-map.md) para o detalhe da abordagem AI-native desta área.

## Como usar

Selecione `peopleops:peopleops-chief` no chatbot ou na web.

Comandos do Chief:

- `*digital-admission — Guide digital admission`
- `*run-payroll — Assist payroll preparation`
- `*check-esocial — Plain-language eSocial/CLT compliance check`
- `*manage-leave — Handle vacations and leaves`
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Roteiro

1. **Agora:** Chief (intake + escopo do fluxo). ✅
2. **Próximo:** agentes especialistas (Tier 1/2), tarefas e modelos da área.
3. **Depois:** workflow `wf-*` e integração de dados com os demais módulos.

## Referência

Baseado em: *CLT + eSocial compliance practices*.
