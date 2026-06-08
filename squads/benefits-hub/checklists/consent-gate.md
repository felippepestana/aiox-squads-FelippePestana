# Checklist: Consent & Privacy Gate (benefits-hub)

**Executor:** consent-gate (T3)
**Quando:** Antes de efetivar QUALQUER adesão a benefício
**Veredito:** PASS (sem achados) ou VETO (com remediação). Nunca "PASS com ressalva" diante de uso indevido de dado sensível ou ausência de consentimento.

> Princípio: benefícios lidam com dado de saúde e escolhas pessoais. Este gate protege o consentimento e a privacidade da pessoa antes de qualquer adesão.

---

## 1. Consentimento Explícito

- [ ] Há consentimento **explícito e ativo** para a adesão
- [ ] Nenhuma opção foi **pré-marcada** ou **auto-inscrita**
- [ ] A pessoa entendeu custo/coparticipação antes de confirmar (linguagem clara)

**VETO se:** consentimento ausente, presumido ou por pré-marcação.

## 2. Minimização de Dado de Saúde (LGPD)

- [ ] Dado de saúde (se usado) serviu **só** à adesão consentida
- [ ] Não foi usado para recomendação não relacionada, análise ou compartilhamento
- [ ] Base legal e finalidade registradas (LGPD Art. 11 — dado sensível)

**VETO se:** dado de saúde usado além da finalidade consentida.

## 3. Sigilo de Terceiros

- [ ] Nenhuma escolha de benefício de **outro colaborador** foi exposta
- [ ] Dados de dependentes tratados com o mesmo sigilo
- [ ] Comparações/recomendações não revelam eleições alheias

**VETO se:** escolha de terceiro exposta.

## 4. Escopo de Aconselhamento

- [ ] Não foi dado aconselhamento **fiscal, jurídico ou médico**
- [ ] Questões fora de escopo foram **encaminhadas** a especialista
- [ ] Explicações limitam-se a como o benefício funciona (não a "o que você deve fazer")

**VETO se:** aconselhamento fiscal/jurídico/médico fora de escopo.

## 5. Rastreabilidade (Audit Trail 100%)

- [ ] Consentimento registrado (método + timestamp)
- [ ] Finalidade do uso de dado registrada
- [ ] Base legal documentada
- [ ] User + timestamp em cada etapa

**VETO se:** audit trail incompleto.

---

## Condição de PASS (todas obrigatórias)

✅ Consentimento explícito · ✅ Dado de saúde minimizado · ✅ Sigilo de terceiros ·
✅ Sem aconselhamento fora de escopo · ✅ Audit trail 100%

## Condição de VETO (qualquer uma bloqueia)

⛔ Sem consentimento / pré-marcação · ⛔ Dado de saúde além da finalidade ·
⛔ Escolha de terceiro exposta · ⛔ Aconselhamento fora de escopo · ⛔ Trilha incompleta

**No bypass.** VETO retorna razão + remediação + reapresentação.
