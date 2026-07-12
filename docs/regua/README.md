# RÉGUA / Toga Recupera — Planejamento da Solução

> **Status:** 📋 Planejamento (pré-desenvolvimento) · **Origem:** blueprint "Projeto de Solução Legal-Tech para Cobrança de Massa de Carteiras Educacionais"

## O que é

**RÉGUA** (nome técnico interno) / **Toga Recupera** (produto comercial, extensão do brandbook "Toga Noturna") é uma plataforma LegalTech interna para **cobrança em massa de carteiras educacionais**, conduzida por advocacia especializada com tecnologia própria.

### TL;DR do blueprint

- Plataforma interna de uso próprio: monolito modular **Next.js + Supabase/Postgres (RLS)**, **Temporal** como motor de esteira durável, **WhatsApp Cloud API oficial** para massa, PSP **Asaas** (Pix/boleto/negativação Serasa), agentes IA com guardrails jurídicos.
- Diferencial jurídico: a Lei 9.870/1999 impede a escola de aplicar sanções pedagógicas — a cobrança profissional externa (notificação → negativação → protesto → monitória/execução) é a via legítima e eficaz.
- Modelo comercial: **success fee, sem custo fixo à instituição** (padrão de mercado 20–30% sobre o recuperado em dívida antiga extrajudicial).
- Riscos centrais: conflito ético consumerista (a banca defende consumidores), risco reputacional (famílias/menores), banimento de WhatsApp não-oficial, limites do Provimento 205/2021 à publicidade.

## Mapa dos documentos

| Documento | Conteúdo |
|---|---|
| [01-plano-de-desenvolvimento.md](01-plano-de-desenvolvimento.md) | Plano staged: Fase 0 (gate ético) → MVP 8–12 semanas (épicos E1–E7) → V1 → V2, com thresholds de continuidade |
| [02-arquitetura.md](02-arquitetura.md) | Stack, 8 módulos, modelo de dados central e **mapa de reuso** dos ativos já existentes neste repositório |
| [03-backlog-mvp.md](03-backlog-mvp.md) | Épicos do MVP quebrados em user stories com critérios de aceite e sprints S1–S6 |
| [04-claude-design-handoff.md](04-claude-design-handoff.md) | Como usar o **Claude Design** para os 3 portais, com prompts prontos por tela e design tokens "Toga Noturna" |
| [05-compliance-e-guardrails.md](05-compliance-e-guardrails.md) | Requisitos jurídicos como especificação verificável de sistema e guardrails dos agentes IA |

## Squad relacionado

O squad AIOX **[`squads/toga-recupera/`](../../squads/toga-recupera/)** (maturidade DRAFT) operacionaliza a camada de agentes IA deste planejamento: classificação de documentação de carteira, simulação de acordos, geração de notificações extrajudiciais — sempre sob o `compliance-guard`.

## Como usar este planejamento

1. **Antes de qualquer código:** executar a Fase 0 (decisão ética) do documento 01. É um gate, não uma formalidade.
2. **Para desenvolver:** seguir os épicos/sprints do documento 03, com a arquitetura do documento 02.
3. **Para design de telas:** usar o documento 04 como handoff direto para o Claude Design.
4. **Para cada feature:** validar contra os requisitos do documento 05 (compliance é requisito funcional, não anexo).
