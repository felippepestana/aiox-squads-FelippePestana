# Insights — People Analytics

**Status:** 🟢 ACTIVE (v1.0.0)
**Domain:** People Analytics
**Platform:** Apex-Talent

---

## Propósito

Insights é o módulo capstone de people analytics da plataforma Apex-Talent. Ele **não gera dado primário** — cruza as fontes de verdade dos demais módulos (jornada do chronos, desempenho do performa, clima do pulse, folha/headcount do peopleops) em três entregas: **dashboards determinísticos**, **risco preditivo de turnover/burnout** e **narrativas executivas**.

**Princípio:** predição é alerta precoce para **apoio**, nunca veredito sobre a pessoa. Correlação não é causa, e nenhum insight sai sem passar pelo gate de ética/privacidade.

---

## Funcionalidades-Núcleo

### ✅ Dashboards Determinísticos
- KPIs com fórmula e fonte explícitas (headcount, turnover, absenteísmo, custo, tenure, eNPS)
- Cortes por segmento com supressão de privacidade (n < 5)
- Comparação com benchmark/período anterior em bases normalizadas

### ✅ Risco Preditivo (Turnover & Burnout)
- Combinação cross-sinal (fadiga, desempenho, engajamento) — nunca fonte única
- Risco **agregado por coorte** (>= 5), com confiança declarada
- Drivers acionáveis (o que mudar para baixar o risco)
- Atributos protegidos **nunca** são preditores

### ✅ Auditoria de Diversidade
- Representatividade, equidade de progressão e funil por grupo
- Regra dos 4/5 (impacto desproporcional)
- LGPD: finalidade, minimização e base legal para dado sensível

### ✅ Narrativa Executiva
- Leitura decisão-primeiro com recomendação + confiança
- Correlação ≠ causa marcada em cada afirmação
- Seção "o que este dado NÃO diz" sempre presente

### ✅ Gate de Ética & Privacidade
- Tamanho mínimo de grupo (n >= 5)
- Bloqueio de veredito individual e de atributo protegido como preditor
- Quality gate obrigatório (PASS/VETO), rastreável 100%

---

## Agentes

| Agent | Tier | Responsabilidade |
|-------|------|-----------------|
| **insights-chief** | T0 | Orquestra análise; frame da decisão → dataset → análise → gate → narrativa |
| **data-weaver** | T1 | Montagem do dataset cross-módulo; frescor, cobertura, joins |
| **metric-smith** | T1 | KPIs determinísticos e dashboards (fórmula + fonte) |
| **risk-modeler** | T2 | Risco preditivo agregado de turnover/burnout; drivers e confiança |
| **narrative-author** | T2 | Narrativa executiva; copiloto de dashboard em linguagem natural |
| **ethics-gate** | T3 | Quality gate: privacidade, fairness, LGPD, VETO/PASS |

---

## Workflows

### 📋 wf-analytics-completo

**Gatilho:** `*dashboard`, `*predict-turnover` ou `*diversity-audit` (comando) ou agendado (revisão mensal)

**Fases:**
1. **INTAKE** — Framing da decisão (escopo, janela, segmentos)
2. **DATA_ASSEMBLY** — Dataset cross-módulo (frescor, cobertura, joins)
3. **ANALYSIS** — Métricas + modelagem de risco (paralelo)
4. **ETHICS_GATE** — Auditoria de ética/privacidade (VETO/PASS)
5. **NARRATIVE** — Narrativa executiva (só após PASS)

**Saída:** dashboard, metrics report, risk model, ethics audit, narrativa executiva

---

## Entrada de Dados

```bash
# Montar/consultar dashboard
*dashboard janela:2026-01..2026-06 segmentos:area

# Modelar risco preditivo
*predict-turnover risco:turnover+burnout coorte:area

# Auditar diversidade
*diversity-audit janela:2026-01..2026-06
```

---

## Outputs Principais

### Dashboard
- KPIs com fórmula + fonte; cortes por segmento (n >= 5)
- Qualidade de dado (frescor, cobertura, joins, grupos suprimidos)

### Risk Model
- Risco agregado por coorte com confiança e drivers acionáveis
- Garantia explícita: sem atributo protegido, sem ranking individual

### Ethics Audit
- Verificações (grupo mínimo, protegido, individual, impacto, LGPD, trilha)
- Verdict (PASS → libera narrativa | VETO → bloqueado até remediação)

### Narrativa Executiva
- Recomendação + confiança, evidência, correlação ≠ causa, limites

---

## Integração com Outros Módulos

### ⏱️ chronos
- Super-jornada, fadiga, absenteísmo → drivers de burnout/turnover
- Anomalias HIGH (handoff de alert-warden) → input preditivo

### 📈 performa
- Desempenho, 9-box, progressão → contexto e driver "estagnação"

### 🎤 pulse
- eNPS, engajamento → métrica e driver de turnover

### 💼 peopleops
- Headcount, custo, eventos de turnover, admissão → métricas base

### 🏗️ org-architect
- Drivers de progressão estagnada → revisão de carreira/faixa salarial

---

## Bases & Referências

- **LGPD (Lei 13.709/2018):** finalidade, minimização, dado sensível (Art. 5/7/11)
- **Regra dos 4/5 (EEOC-style):** detecção de impacto desproporcional
- **Maslach (burnout):** exaustão, cinismo, ineficácia como sinais
- **Josh Bersin People Analytics; predictive attrition modeling**

---

## Princípios de Design

### 🎯 Determinismo nas Métricas
Mesma fórmula + mesma janela → mesmo número. Toda métrica é reprodutível e auditável.

### 🔮 Predição é Apoio, Não Veredito
Risco é sinal agregado por coorte para apoiar a tempo — nunca lista de alvos.

### 🧭 Correlação ≠ Causa
Toda afirmação é rotulada. Causa só com desenho que a suporte.

### 🛡️ Privacidade por Padrão
n >= 5, minimização LGPD, atributos protegidos fora dos preditores.

### 🔒 Gate Obrigatório
Nenhum insight sai sem PASS do ethics-gate. VETO bloqueia até remediação.

---

## Como Começar

```bash
# Via chatbot
*insights-chief
"Insights ready. Que decisão estamos informando?"

# Definir a decisão e janela
"Onde concentrar retenção no 2º semestre?" janela:2026-01..2026-06

# Iniciar ciclo
*predict-turnover
```

---

## Referência

- **config.yaml:** Estrutura, agents, tier_structure, scoring_system, workflow
- **agents/*.md:** Chief + 5 especialistas (T1/T2/T3)
- **tasks/*.md:** 5 tasks (assemble-dataset, compute-metrics, model-risk, audit-ethics, generate-narrative)
- **templates/*.yaml|md:** Output schemas (dashboard, metrics, risk model, ethics audit, narrativa)
- **data/*.md:** Glossário de métricas, metodologia preditiva, diversidade/fairness, mapa cross-módulo
- **workflows/wf-analytics-completo.yaml:** Orquestração das 5 fases
- **checklists/ethics-gate.md:** Quality gate obrigatório

---

**Última atualização:** 2026-06-08
**Versão:** 1.0.0
**Maintenance:** People Analytics & Ethics team
