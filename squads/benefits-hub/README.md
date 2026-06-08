# Benefits-Hub — Benefícios

**Status:** 🟢 ACTIVE (v1.0.0)
**Domain:** Benefits / Total Rewards
**Platform:** Apex-Talent

---

## Propósito

Benefits-Hub é o módulo de gestão e curadoria de benefícios (Total Rewards) da plataforma Apex-Talent. Mantém o catálogo e as regras de elegibilidade, **recomenda por momento de vida** (não empurra o catálogo), conduz a adesão em linguagem clara e analisa **custo vs. adoção** — tudo protegido por um gate de consentimento e privacidade.

**Princípio:** o melhor benefício é o que cabe na vida da pessoa agora. Cobertura que ninguém entende é cobertura que ninguém usa. Nenhuma adesão acontece sem consentimento explícito.

---

## Funcionalidades-Núcleo

### ✅ Catálogo & Fornecedores
- Benefícios por categoria de Total Rewards (saúde, alimentação, transporte, previdência, bem-estar, educação)
- Descrição em linguagem clara + exemplo concreto (sem jargão de apólice)
- Dados de fornecedor verificados; itens desatualizados sinalizados

### ✅ Elegibilidade Determinística
- Regras por vínculo, tempo de casa, dependentes e CCT/ACT
- Mesma situação → mesma elegibilidade, com rule trace
- Carências e janelas declaradas antes da adesão

### ✅ Recomendação por Momento de Vida
- Fit por perfil e momento (parentalidade, mudança, saúde, finanças)
- Poucos e certos (anti-overselling), com o "porquê cabe agora"
- Respeita consentimento ao usar contexto pessoal

### ✅ Análise de Custo & Adoção
- Custo cruzado com adoção real e valor percebido
- Vereditos keep / revise / expand
- Agregado (sem adesão individual), sem métrica de vaidade

### ✅ Gate de Consentimento
- Consentimento explícito antes de inscrever
- Minimização de dado de saúde (LGPD), sigilo das escolhas de terceiros
- Quality gate obrigatório (PASS/VETO), rastreável 100%

---

## Agentes

| Agent | Tier | Responsabilidade |
|-------|------|-----------------|
| **benefits-hub-chief** | T0 | Orquestra catálogo → recomendação → valor → gate → adesão |
| **catalog-keeper** | T1 | Mantém catálogo e fornecedores em linguagem clara |
| **eligibility-checker** | T1 | Elegibilidade determinística e condução da adesão |
| **fit-advisor** | T2 | Recomendação por momento de vida (anti-overselling) |
| **value-analyst** | T2 | Custo vs. adoção vs. valor percebido (agregado) |
| **consent-gate** | T3 | Quality gate: consentimento, privacidade de saúde, VETO/PASS |

---

## Workflows

### 📋 wf-benefits-completo

**Gatilho:** `*catalog`, `*recommend`, `*enrollment` (comando) ou evento de vida (push de peopleops)

**Fases:**
1. **INTAKE** — Framing da necessidade e contexto de vida
2. **CATALOG_ELIGIBILITY** — Catálogo + elegibilidade determinística
3. **ANALYSIS** — Recomendação por fit + análise de valor (paralelo)
4. **CONSENT_GATE** — Auditoria de consentimento/privacidade (VETO/PASS)
5. **ENROLLMENT** — Adesão guiada (só após PASS + consentimento)

**Saída:** catálogo, resultado de elegibilidade, recomendação, análise de valor, consent audit

---

## Entrada de Dados

```bash
# Consultar/gerenciar catálogo
*catalog categoria:saúde

# Recomendar por momento de vida
*recommend momento:parentalidade

# Conduzir adesão (após consentimento)
*enrollment beneficio:plano-saude

# Analisar custo e adoção
*cost-analysis periodo:2026-01..2026-06
```

---

## Outputs Principais

### Benefits Catalog
- Itens por categoria, linguagem clara, fornecedor verificado, flag de dado sensível

### Eligibility Result
- Elegibilidade determinística com rule trace, carência e janela

### Recommendation
- Poucos e relevantes por momento de vida, com o "porquê cabe agora"

### Value Analysis
- Custo vs. adoção vs. valor, vereditos keep/revise/expand (agregado)

### Consent Audit
- Verdict (PASS → adesão liberada | VETO → bloqueado até remediação)

---

## Integração com Outros Módulos

### 💼 peopleops
- Vínculo, salário, dependentes → elegibilidade e custo
- Adesão efetivada → desconto em folha e registro

### 📊 insights
- Custo/adoção agregados → people analytics cross-módulo

### 🧬 profiler-dna
- Contexto comportamental (advisory, opcional)

---

## Bases & Referências

- **Total Rewards (WorldatWork):** taxonomia de benefícios
- **LGPD (Lei 13.709/2018):** dado de saúde sensível (Art. 5/11), consentimento
- **CLT / CCT / ACT:** elegibilidade e obrigatoriedade por convenção
- **Choice architecture:** curadoria anti-overselling

---

## Princípios de Design

### 🎯 Fit com o Momento de Vida
O melhor benefício é o que cabe na vida da pessoa agora — não o catálogo inteiro.

### 🗣️ Linguagem Clara
Cobertura que ninguém entende é cobertura que ninguém usa.

### 📊 Adoção, não Brochura
Sucesso é uso e valor percebido, não tamanho do catálogo.

### 🔐 Consentimento & Privacidade
Dado de saúde é sensível, minimizado e usado só para a adesão consentida. Sigilo absoluto das escolhas.

### 🔒 Gate Obrigatório
Nenhuma adesão sem PASS do consent-gate e consentimento explícito. VETO bloqueia até remediação.

---

## Como Começar

```bash
# Via chatbot
*benefits-hub-chief
"Benefits-Hub ready. Qual a necessidade e o contexto?"

# Definir momento de vida
momento:parentalidade

# Iniciar recomendação
*recommend
```

---

## Referência

- **config.yaml:** Estrutura, agents, tier_structure, scoring_system, workflow
- **agents/*.md:** Chief + 5 especialistas (T1/T2/T3)
- **tasks/*.md:** 5 tasks (manage-catalog, check-eligibility, recommend-benefits, analyze-value, audit-consent)
- **templates/*.yaml|md:** Output schemas (catálogo, elegibilidade, recomendação, valor, consent audit)
- **data/*.md:** Taxonomia de benefícios, regras de elegibilidade, momentos de vida, padrões de consentimento/privacidade
- **workflows/wf-benefits-completo.yaml:** Orquestração das 5 fases
- **checklists/consent-gate.md:** Quality gate obrigatório

---

**Última atualização:** 2026-06-08
**Versão:** 1.0.0
**Maintenance:** Total Rewards & Privacy team
