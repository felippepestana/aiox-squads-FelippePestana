# Task: Build Instructional Content (build-content)

**Executor:** content-forge
**Elicit:** Learning track, module, criticality of domain
**Mode:** Microlearning generation + SME flagging
**Output:** Course content (Markdown) with SME flags and quizzes

## Inputs Required

- `learning_track`: From design-track
- `module_id`: Módulo a desenvolver
- `domain_criticality`: Domínio é crítico? (jurídico/técnico/médico/financeiro/compliance → exige SME)
- `format`: Formato preferido (texto, roteiro de vídeo, slides)

## Elicitation

Ask user:
1. "Qual módulo desenvolver?"
2. "O domínio é crítico (jurídico, técnico, médico, financeiro, compliance)?"
3. "Formato preferido? (texto/roteiro/slides)"

## Execution Steps

1. **Chunk Content**: Quebrar em blocos de microlearning (5–10 min, 1 conceito cada)
2. **Apply Cognitive Load**: Exemplo concreto antes de abstração; simples → complexo
3. **Flag SME**: Marcar toda afirmação de domínio crítico com `requer_SME`
4. **Create Quiz**: Quiz de verificação de entendimento e aplicação (não decoreba)
5. **Add Application Tie**: Conectar cada bloco ao ponto de aplicação da trilha
6. **Output**: Conteúdo modular com flags e quiz

## Output Format

```markdown
# Módulo: Feedback Estruturado (SBI)
**Trilha:** Primeira Liderança · **Bloco-alvo:** MOD_001 · **Tempo:** ~2h (4 microblocos)

## Bloco 1 — O que é SBI (8 min)
Situação → Comportamento → Impacto. [conceito]
**Exemplo:** "Na reunião de ontem (S), você interrompeu a colega 3 vezes (C);
ela parou de contribuir (I)." [exemplo concreto antes da abstração]

## Bloco 2 — SBI vs. feedback vago (7 min)
...

## ⚠️ Verificação de SME necessária
- [ ] Nenhuma afirmação legal neste módulo (domínio não crítico) — OK
> Para módulos de compliance/jurídico, cada afirmação normativa recebe `requer_SME: true`.

## Quiz de verificação (aplicação, não memorização)
1. Dado o cenário X, reescreva o feedback no modelo SBI. *(aplicar)*
2. Qual destes feedbacks segue SBI e por quê? *(analisar)*

## Conexão com aplicação
Este conteúdo prepara os 1:1 reais das semanas 3–4 (avaliados por rubrica).
```

```yaml
content_meta:
  module_id: "MOD_001"
  built_by: "content-forge"
  timestamp: "2026-06-08T12:00:00Z"
  microblocks: 4
  domain_critical: false
  sme_flags: []        # lista de afirmações marcadas requer_SME (vazio se não-crítico)
  quiz_items: 2
  quiz_levels: ["aplicar", "analisar"]
```

## Veto Conditions

- No VETO na geração, MAS:
- Domínio crítico sem nenhuma flag de SME → o learning-gate VETA na auditoria
- Quiz só de memorização literal → reescrever para aplicação

## Completion Criteria

✅ Conteúdo em microlearning (blocos curtos, 1 conceito cada)
✅ Exemplo antes de abstração (carga cognitiva)
✅ Afirmações críticas marcadas `requer_SME`
✅ Quiz de entendimento/aplicação (não decoreba)
✅ Conexão com o ponto de aplicação
✅ Conteúdo pronto para assessment-master e learning-gate
