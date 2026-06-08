# Task: Audit Learning Quality Gate (audit-learning)

**Executor:** learning-gate
**Elicit:** All prior outputs (skills matrix, track, content, assessment)
**Mode:** Deterministic pedagogical audit
**Output:** Learning verdict (YAML) — PASS or VETO with remediation

## Inputs Required

- `skills_matrix`: From map-skill-gap
- `learning_track`: From design-track
- `content_meta`: From build-content (com flags de SME)
- `assessment`: From assess-learning
- `sme_status`: Conteúdo crítico foi verificado por SME? (sim/não/n.a.)

## Elicitation

Ask user (se necessário):
1. "O conteúdo crítico (se houver) foi verificado por SME?"
2. "A trilha será publicada para qual público (acessibilidade)?"

## Execution Steps

1. **Objectives Measurable**: Confirmar que todo objetivo tem critério observável
2. **SME Verification**: Confirmar que conteúdo crítico foi verificado (flags resolvidas)
3. **Application Focus**: Confirmar que a avaliação mede aplicação (Kirkpatrick 3+), não só conclusão
4. **Accessibility**: Verificar alternativas de canal (transcrição, texto alternativo, legibilidade)
5. **Audit Trail**: Confirmar trilha 100% (fonte do gap, objetivos, SME, Kirkpatrick, timestamp, user)
6. **Verdict**: Emitir PASS ou VETO com razão + remediação

## Output Format

```yaml
learning_audit:
  audited_by: "learning-gate"
  timestamp: "2026-06-08T12:00:00Z"
  track_ref: "Primeira Liderança"

  checks:
    objectives_measurable:
      all_have_criteria: true
      passed: true
    sme_verification:
      critical_content_present: false
      flags_resolved: true
      passed: true
    application_focus:
      assessment_kirkpatrick_max: 3
      measures_only_completion: false
      passed: true
    accessibility:
      alt_channels_present: true
      readability_ok: true
      passed: true
    audit_trail:
      complete: true
      passed: true

  verdict: "PASS"
  clearance_statement: "Trilha pedagogicamente sólida e publicável. Mede aplicação no trabalho."
  next_action: "Publish track; handoff progress signals to performa/insights"

  # --- Exemplo de VETO ---
  # verdict: "VETO"
  # reasons:
  #   - "Módulo de compliance com 3 afirmações legais sem verificação de SME"
  #   - "Avaliação mede só conclusão (Kirkpatrick 2) num objetivo de aplicação"
  #   - "Vídeo sem transcrição (barreira de acessibilidade)"
  # remediation_steps:
  #   - "Submeter afirmações legais à revisão jurídica (SME)"
  #   - "Reescrever avaliação para Kirkpatrick 3 (aplicação por rubrica)"
  #   - "Adicionar transcrição ao vídeo"
  # resubmit: "Reapresente após remediação"
```

## Veto Conditions (mandatory — no bypass)

- Objetivo não mensurável (sem critério observável) → **VETO**
- Conteúdo crítico sem verificação de SME → **VETO**
- Avaliação que mede só conclusão/satisfação num objetivo de aplicação → **VETO**
- Barreira de acessibilidade (canal único essencial sem alternativa) → **VETO**
- Audit trail incompleto → **VETO**
- Diante de erro de conteúdo ou objetivo não mensurável: é **VETO**, nunca "PASS com ressalva"

## Completion Criteria

✅ Objetivos mensuráveis confirmados
✅ Verificação de SME confirmada (conteúdo crítico)
✅ Foco em aplicação validado (Kirkpatrick 3+)
✅ Acessibilidade auditada
✅ Audit trail 100% validado
✅ Veredito PASS ou VETO com remediação emitido
