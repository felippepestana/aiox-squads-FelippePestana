# Compliance Gate Checklist — chronos

## Propósito

O **compliance-gate** é um quality gate obrigatório (T3 — veto) que bloqueia a liberação de qualquer período de jornada sem validação de conformidade legal (CLT + eSocial).

**Resultado:** PASS (liberado para folha) ou VETO (bloqueado até remediação).

---

## Pre-Gate Requirements

Antes de executar o gate, verificar se todos os inputs estão disponíveis:

- [ ] Registration report completo (coverage, anomalias, espelho)
- [ ] Shift schedule validado (conflitos resolvidos ou documentados)
- [ ] Bank calculation finalizado (horas segregadas, passivos identificados)
- [ ] Anomaly report com classificações de risco
- [ ] eSocial setup de peopleops (S-2200, S-2240 mapping)
- [ ] Audit trail 100% completo (timestamps, users, mudanças)

---

## CLT Audit Checklist

### Art. 5 — Jornada Máxima

- [ ] **Jornada diária:** Cada colaborador ≤ 8h/dia (ou contrato)?
  - [ ] Se não: listar violações, causas, contexto
  - [ ] Documentar exceção (projeto, etc.)

- [ ] **Jornada semanal:** Cada colaborador ≤ 44h/semana (ou contrato)?
  - [ ] Se não: listar violações
  - [ ] [ ] Se sistemático (não excepcional): recomendação de rebalanceamento

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### Art. 66 — Interjornada (11h mínimo)

- [ ] Intervalo entre turnos sucessivos ≥ 11h para cada colaborador?
  - [ ] Se não: listar violações (colaborador, datas, intervalo real)
  - [ ] [ ] Aplicável a regime de turno (ex: turnos rotativos)?

- [ ] Se violação detectada:
  - [ ] Documentar causa (mudança de último minuto, excepcional?)
  - [ ] Propor compensação (repouso, extra, etc.)
  - [ ] Obter aprovação gestor + RH

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### Art. 67 — Repouso Semanal (24h + 1 domingo/mês)

- [ ] Cada colaborador teve repouso de 24h contínuas no período?
  - [ ] Se não: listar violações (quem, datas, dias faltantes)

- [ ] Cada colaborador teve mínimo 1 domingo/mês de repouso?
  - [ ] Se não: listar violações
  - [ ] [ ] Documentar se houve projeto excepcional
  - [ ] [ ] Se sistemático: VETO até rebalanceamento

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### Art. 59 — Horas Extras (≤ 2h/dia, compensadas)

- [ ] Horas extras ≤ 2h/dia (ou compensadas em banco autorizado)?
  - [ ] Se não: listar colaboradores, dias, horas excesso
  - [ ] [ ] Verificar se banco de horas foi autorizado

- [ ] Passivos de extra identificados e documentados?
  - [ ] Valor estimado vs. salário?
  - [ ] Plano de compensação (folha, banco, acordo)?

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### Art. 219 — Mudança de Turno (30 dias aviso)

- [ ] Alguma mudança de turno no período sem aviso de 30 dias?
  - [ ] Se sim: VETO — risco de rescisão indireta
  - [ ] [ ] Obter documentação de aviso prévio para futuros períodos

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### Art. 73 — Trabalho Noturno (20% adicional)

- [ ] Colaboradores em jornada noturna (22:00-05:00) recebem 20% adicional?
  - [ ] Se não: listar quem, período, horas noturnas
  - [ ] [ ] Calcular diferença devida (passivo)

**Status:** [ ] PASS [ ] ALERT [ ] VETO

---

## eSocial Audit Checklist

### S-2200 — Conformação da Jornada Base

- [ ] S-2200 enviado/atualizado para cada mudança de jornada?
- [ ] Campos obrigatórios preenchidos:
  - [ ] Horário usual início (ex: 09:00)
  - [ ] Horário usual fim (ex: 17:00)
  - [ ] Dias da semana (seg-sex, ex)
  - [ ] Intervalo intrajornada (ex: 1h para refeição)

- [ ] S-2200 coerente com registration_report (espelho de ponto)?
  - [ ] Se divergência: documentar motivo
  - [ ] [ ] Sincronizar antes de transmissão

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### S-2240 — Eventos de Jornada

- [ ] Todos os eventos (férias, licenças, faltas) mapeáveis a S-2240?

- [ ] Cobertura de eventos (nenhum gap não-explicado):
  - [ ] Férias: [ ] S-2240 02
  - [ ] Licença: [ ] S-2240 04.03
  - [ ] Falta: [ ] S-2240 04.01
  - [ ] Afastamento: [ ] S-2240 04.04

- [ ] Datas consistentes entre banco_report e S-2240?
  - [ ] Se divergência: [ ] Documentar e sincronizar

**Status:** [ ] PASS [ ] ALERT [ ] VETO

### eSocial Transmission Readiness

- [ ] Deadline: 5º dia útil do mês seguinte?
  - [ ] [ ] Hoje é antes do deadline?
  - [ ] [ ] Se não, ALERT urgência

- [ ] Nenhum evento crítico bloqueando transmissão?
  - [ ] [ ] Anomalias não-investigadas HIGH-risk?
  - [ ] [ ] Passivos não-resolvidos?

**Status:** [ ] READY [ ] NOT_READY

---

## Audit Trail Checklist

- [ ] **100% rastreável:** Toda ação tem user, timestamp, reason?
  - [ ] Phase 2 (registration): [ ] Consolidação rastreada
  - [ ] Phase 3 (shifts): [ ] Validação rastreada
  - [ ] Phase 4 (bank): [ ] Cálculo rastreado
  - [ ] Phase 4 (anomalies): [ ] Detecção rastreada
  - [ ] Mudanças post-detection: [ ] Todas documentadas?

- [ ] **Imutabilidade:** Dados originais preservados?
  - [ ] [ ] Correções têm trail (original + novo + reason)
  - [ ] [ ] Nenhuma sobrescrita silenciosa

- [ ] **Sequência lógica:** Ações ocorreram na ordem esperada?
  - [ ] [ ] Registration antes de Bank
  - [ ] [ ] Anomaly detection antes de Gate
  - [ ] [ ] Gate é último check antes de liberação

**Status:** [ ] COMPLETE_100% [ ] INCOMPLETE [ ] GAPS

---

## Coherence Check: Chronos ↔ Peopleops

- [ ] **Banco de horas:** Divergência < 5%?
  - Chronos calculado: [ ] _____ horas
  - Peopleops esperado: [ ] _____ horas
  - Diferença: [ ] _____ (%)
  - [ ] [ ] Se > 5%: ALERT — sincronizar antes de PASS

- [ ] **Motivos de divergência (se houver):**
  - [ ] [ ] Férias contabilizadas diferente?
  - [ ] [ ] Afastamentos (INSS) não sincronizados?
  - [ ] [ ] Setup de extras diferente?
  - [ ] [ ] Proposta de reconciliação: _____

**Status:** [ ] COHERENT [ ] ALERT_DIVERGENCE [ ] VETO_CRITICAL

---

## Anomaly Gate Checklist

### HIGH-Risk Anomalies

- [ ] **Quantos HIGH-risk anomalias detectadas?** [ ] _____

- [ ] Para cada HIGH-risk:
  - [ ] [ ] Tipo: _____
  - [ ] [ ] Colaborador: _____
  - [ ] [ ] Data/período: _____
  - [ ] [ ] Status: [ ] Investigado [ ] Documentado [ ] Resolvido
  - [ ] [ ] Decisão gestor/RH: _____

- [ ] **Nenhum HIGH-risk anomalia fica sem investigação/documentação.**
  - [ ] Se houver não-resolvido: VETO

**Status:** [ ] NO_HIGH_RISK [ ] HIGH_RISK_RESOLVED [ ] HIGH_RISK_UNRESOLVED_VETO

### MEDIUM-Risk Anomalies

- [ ] **Quantos MEDIUM-risk?** [ ] _____

- [ ] Documentar contexto de cada (não é veto, mas é registro)
  - [ ] [ ] Acompanhar padrão futuro

**Status:** [ ] DOCUMENTED

---

## Final Verdict

### VETO Conditions (Any one triggers VETO)

- [ ] **CLT Violation unresolved** (Art. 5, 66, 67, 59, 219, 73)
- [ ] **eSocial unmappable events** (S-2200/S-2240 gap)
- [ ] **Audit trail incomplete** (< 100%)
- [ ] **Coherence divergence > 20%** (Chronos vs. Peopleops)
- [ ] **HIGH-risk anomaly unresolved** (not investigated/documented)

### PASS Conditions (All must be met)

- [ ] **CLT:** PASS all articles (or ALERT with documented resolution)
- [ ] **eSocial:** Ready for transmission (S-2200/S-2240 complete)
- [ ] **Audit Trail:** 100% complete
- [ ] **Coherence:** Divergence < 5% (or < 20% with sync plan documented)
- [ ] **Anomalies:** No unresolved HIGH-risk items

---

## Decision

**Period:** [ ] MM/YYYY  
**Filial:** [ ] CODE  
**Audited by:** [ ] compliance-gate  
**Date:** [ ] YYYY-MM-DD HH:MM  

### Verdict

- [ ] **PASS** — Período liberado para processamento de folha
  - Próxima ação: Transfer to peopleops-chief
  - Deadline eSocial: [ ] YYYY-MM-DD

- [ ] **VETO** — Período bloqueado; remediation required
  - Razão principal: _____
  - Ações necessárias:
    1. [ ] _____
    2. [ ] _____
    3. [ ] _____
  - Resubmit timeline: [ ] YYYY-MM-DD ou "ASAP after remediation"

### Approvals

- **compliance-gate (T3):** [ ] Signature / Timestamp
- **chronos-chief (T0):** [ ] Acknowledgment (if VETO, confirms block)

---

## Post-Gate Actions

### If PASS
- [ ] Transfer all reports to peopleops-chief
- [ ] Initiate payroll processing
- [ ] Queue eSocial transmission (S-2200, S-2240)
- [ ] Archive compliance_audit + all evidence for legal hold

### If VETO
- [ ] Notify chronos-chief of blockers
- [ ] Escalate to RH director + Payroll manager
- [ ] Assign remediation owner + timeline
- [ ] Schedule reaudit after remediation
- [ ] Document all remediation steps

---

## Sign-Off

```
Compliance Gate Executed: ________________
Timestamp: ________________
Verdict: [PASS / VETO]
Reason (if VETO): ________________________________________________
Next Action: ________________________________________________
```

---

## Appendix — Key CLT Articles

- **Art. 5:** Jornada ≤ 8h/day, ≤ 44h/week
- **Art. 66:** Interjornada ≥ 11h
- **Art. 67:** Repouso 24h semanal + 1 domingo/mês
- **Art. 59:** Extras ≤ 2h/day (compensated)
- **Art. 219:** 30 dias aviso turno
- **Art. 73:** Noturno 20% adicional (22h-05h)
