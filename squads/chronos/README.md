# Chronos — Controle de Ponto & Jornada

**Status:** 🟢 ACTIVE (v1.0.0)  
**Domain:** Time & Attendance Management  
**Platform:** Apex-Talent  

---

## Propósito

Chronos é o sistema inteligente de controle de ponto e gestão de jornada da plataforma Apex-Talent. Consolida registros de múltiplas fontes (biometria, geolocalização, mobile), calcula banco de horas com precisão legal, detecta anomalias de jornada (fadiga, padrões, inconsistências) e audita conformidade com CLT + eSocial antes de qualquer liberação.

**Princípio:** Toda decisão de jornada é rastreável, legal e auditável.

---

## Funcionalidades-Núcleo

### ✅ Registro de Ponto (Multimodal)
- Consolidação de biometria, geolocalização e mobile
- Validação de cobertura (gap detection)
- Geração de espelho de ponto (PDF oficial)

### ✅ Gestão de Escalas
- Definição/atualização de horários por colaborador
- Detecção de overlaps e violações de interjornada (Art. 66)
- Sugestões de rebalanceamento

### ✅ Cálculo de Banco de Horas
- Segregação de horas (normal, extra, noturna, falta, férias, afastamentos)
- Cálculo determinístico de banco (crédito/débito)
- Identificação automática de passivos trabalhistas

### ✅ Detecção de Anomalias
- Padrões de horário (máquina viciada?)
- Super-jornadas (sinal de fadiga/burnout)
- Faltas não-autorizadas
- Inconsistências de geo/timestamp

### ✅ Auditoria de Conformidade
- Validação contra CLT (Art. 5, 59, 66, 67, 73, 219)
- Mapping para eSocial (S-2200, S-2240)
- Quality gate obrigatório (PASS/VETO)
- Rastreamento 100% auditável

---

## Agentes

| Agent | Tier | Responsabilidade |
|-------|------|-----------------|
| **chronos-chief** | T0 | Orquestra período completo; coordena intake → registro → análise → gate |
| **shift-officer** | T1 | Gestão de escalas; detecção de conflitos |
| **time-tracker** | T1 | Consolidação de ponto; validação de cobertura |
| **bank-manager** | T2 | Cálculo de banco de horas; identificação de passivos |
| **alert-warden** | T2 | Detecção de anomalias; classificação por risco |
| **compliance-gate** | T3 | Quality gate: auditoria CLT + eSocial, VETO/PASS |

---

## Workflows

### 📋 wf-jornada-completa

**Gatilho:** `*register-ponto` (comando) ou agendado (5º dia útil)

**Fases:**
1. **INTAKE** — Framing do período (mês, filial, escopo)
2. **REGISTRATION** — Consolidação de ponto
3. **SCHEDULING** — Validação de escalas
4. **ANALYSIS** — Cálculo de banco + detecção de anomalias (paralelo)
5. **COMPLIANCE_GATE** — Auditoria final (CLT + eSocial + VETO/PASS)

**Saída:** Espelho de ponto, banco de horas, anomaly report, compliance verdict

---

## Entrada de Dados

```bash
# Iniciar ciclo de jornada
*register-ponto período:06/2026 filial:SP

# Ou validar escalas específicas
*manage-shifts período:06/2026 action:validate

# Ou auditar conformidade imediatamente
*audit-compliance período:06/2026
```

---

## Outputs Principais

### Espelho de Ponto
- PDF oficial com resumo de ponto por colaborador
- Assinatura digital de chronos-chief

### Banco de Horas Report
- Segregação detalhada (normal, extra, noturna, falta, férias)
- Passivos identificados (extra não-paga, interjornada violada, etc.)
- Coerência com setup de payroll (peopleops)

### Anomaly Report
- Padrões detectados (tipo, frequência, risco)
- Contexto de cada anomalia (comparação com baseline, interpretação)
- HIGH-risk items escalados para compliance-gate

### Compliance Audit
- Validação CLT (Art. 5, 59, 66, 67, 73, 219)
- eSocial readiness (S-2200, S-2240 mapping)
- Verdict (PASS → libera para folha | VETO → bloqueado até remediation)

---

## Integração com Outros Módulos

### 📊 insights
- Super-jornadas, padrões de fadiga → Input para turnover/burnout preditivo
- Dados de jornada → Correlação com feedback anônimo (pulse)

### 📈 performa
- Assiduidade (faltas, padrões) → Contexto para avaliação
- Super-jornada → Impacto em desempenho

### 💼 peopleops
- Banco de horas → Base para folha de pagamento
- eSocial mapping → Transmission (S-2200, S-2240)
- Passivos → Desconto de salário ou compensação em banco

### 🎤 pulse
- Anomalias de jornada → Sinal indireto de pressão/satisfação

---

## Legislação Subjacente

- **CLT Art. 5, 58-67, 73, 219:** Jornada, extras, interjornada, repouso, noturno
- **Lei 9601/1998:** Banco de horas
- **eSocial S-2200/S-2240:** Conformação de jornada + eventos
- **ISO 18001:** Saúde e segurança ocupacional (contexto para detecção de fadiga)

---

## Princípios de Design

### 🎯 Determinismo
Mesmo input → Mesmo output. Todas as cálculos são reprodutíveis e auditáveis.

### 🔒 Legalidade Obrigatória
Nenhuma decisão sai sem auditoria CLT. Gate é veto absoluto até remediação.

### 📍 Rastreabilidade 100%
Toda ação tem user, timestamp e reason. Dados originais preservados (imutáveis).

### ⚠️ Transparência de Risco
Anomalias não acusam; alertam com contexto. Interpretação humana é sempre necessária.

### 🔄 Coerência Cross-Module
Banco de horas sincroniza com payroll. eSocial mapping é automático e validado.

---

## Como Começar

```bash
# Via chatbot
*chronos-chief
"Chronos ready. Qual período vamos fechar?"

# Registrar período: 06/2026, filial São Paulo
período:06/2026 filial:SP

# Iniciar ciclo automático
*register-ponto
```

---

## Referência

- **config.yaml:** Estrutura, agents, tier_structure, scoring_system, workflow
- **agents/*.md:** Chief + 5 especialistas (T1/T2/T3)
- **tasks/*.md:** 5 tasks (registration, shifts, bank, anomalies, compliance)
- **templates/*.yaml:** Output schemas (shifts, registration, bank, anomalies, compliance)
- **data/*.md:** Legislação CLT, metodologia de cálculo, padrões de anomalia, passivos
- **workflows/wf-jornada-completa.yaml:** Orquestração das 5 fases
- **checklists/compliance-gate.md:** Quality gate obrigatório

---

**Última atualização:** 2026-06-08  
**Versão:** 1.0.0  
**Maintenance:** RH & Compliance team
