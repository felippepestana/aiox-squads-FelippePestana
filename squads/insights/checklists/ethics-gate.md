# Checklist: Ethics & Privacy Gate (insights)

**Executor:** ethics-gate (T3)
**Quando:** Antes de liberar QUALQUER insight, dashboard, predição ou narrativa
**Veredito:** PASS (sem achados) ou VETO (com remediação). Nunca "PASS com ressalva" diante de violação dura.

> Princípio: o cruzamento cross-módulo amplia poder analítico e risco de uso indevido na mesma medida. Este gate é a última barreira entre análise e dano.

---

## 1. Privacidade — Tamanho Mínimo de Grupo

- [ ] Todo corte/segmento exibido tem **n >= 5**
- [ ] Grupos com n < 5 foram **suprimidos ou agregados** (não exibidos)
- [ ] Nenhuma combinação de filtros permite reidentificar indivíduo (k-anonimato)

**VETO se:** qualquer célula exibida tem n < 5.

## 2. Atributos Protegidos

- [ ] Raça/cor, gênero, idade, PCD, estado de saúde, religião **NÃO** foram usados como preditores no modelo
- [ ] Atributo protegido aparece **somente** em auditoria de equidade, com finalidade declarada (LGPD Art. 11)
- [ ] Nenhum atributo protegido foi usado como filtro de desvantagem

**VETO se:** atributo protegido usado como preditor ou filtro de desvantagem.

## 3. Veredito Individual

- [ ] Nenhuma predição **nominal/individual** de saída/risco com propósito não-apoio
- [ ] Risco apresentado por **coorte agregada** (>= 5), enquadrado como sinal de apoio
- [ ] Recomendações de risco são de **apoio** (1:1, carreira, carga), nunca corte direto por predição

**VETO se:** predição individual com propósito punitivo/seletivo.

## 4. Impacto Desproporcional (quando afeta seleção/promoção/desligamento)

- [ ] Aplicabilidade avaliada (o insight afeta decisão de pessoal?)
- [ ] Regra dos 4/5 rodada: taxa do grupo protegido **>= 80%** da maior taxa
- [ ] Se < 80%: adverse impact flagado e **justificativa de validade** exigida

**VETO se:** adverse impact (< 80%) sem justificativa de validade documentada.

## 5. LGPD

- [ ] Finalidade do tratamento **declarada** e compatível com o uso
- [ ] **Minimização** aplicada (só dados necessários à decisão)
- [ ] Dado sensível (se houver) tem **base legal** (Art. 7/11) e finalidade explícita
- [ ] Residência de dados **br-only** respeitada

**VETO se:** dado sensível sem base legal ou finalidade não declarada.

## 6. Rastreabilidade (Audit Trail 100%)

- [ ] Fontes-módulo de cada número registradas
- [ ] Fórmulas das métricas documentadas
- [ ] Features e pesos do modelo documentados
- [ ] Confiança declarada em toda predição
- [ ] Timestamp + user em cada etapa

**VETO se:** audit trail incompleto.

## 7. Correlação ≠ Causa

- [ ] Toda afirmação rotulada como **correlação** ou **causa**
- [ ] Causa afirmada **apenas** com desenho que a suporte
- [ ] Limites ("o que o dado NÃO diz") presentes na saída

**VETO se:** correlação apresentada como causa em recomendação de decisão.

---

## Condição de PASS (todas obrigatórias)

✅ Grupos >= 5 · ✅ Sem atributo protegido como preditor/filtro · ✅ Sem veredito individual ·
✅ Sem adverse impact não justificado · ✅ LGPD conforme · ✅ Audit trail 100% · ✅ Correlação ≠ causa respeitada

## Condição de VETO (qualquer uma bloqueia)

⛔ Grupo n < 5 exibido · ⛔ Atributo protegido como preditor/filtro · ⛔ Predição individual punitiva ·
⛔ Adverse impact sem justificativa · ⛔ Dado sensível sem base legal · ⛔ Trilha incompleta · ⛔ Correlação vendida como causa

**No bypass.** VETO retorna razão + remediação + reapresentação.
