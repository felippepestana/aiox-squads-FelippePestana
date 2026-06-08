# Academy — Treinamento & Desenvolvimento

**Status:** 🟢 ACTIVE (v1.0.0)
**Domain:** Learning & Development (LMS)
**Platform:** Apex-Talent

---

## Propósito

Academy é o módulo de aprendizagem e desenvolvimento da plataforma Apex-Talent. Ele fecha o ciclo de desenvolvimento: **recebe um gap de competência concreto** (de performa, org-architect ou insights) e **devolve a trilha que o fecha** — desenhada no modelo **70-20-10**, com conteúdo gerado, avaliação focada em aplicação e certificação por competência demonstrada.

**Princípio:** começa pelo gap, não pelo catálogo. Mede aplicação no trabalho, não vaidade de conclusão. E nenhuma trilha é publicada sem passar pelo gate pedagógico.

---

## Funcionalidades-Núcleo

### ✅ Mapeamento de Competências
- Gap difuso → competências observáveis com níveis de proficiência (1–5)
- Objetivos mensuráveis (verbo + condição + critério)
- Fonte do gap rastreada (performa/org-architect/insights)

### ✅ Trilhas 70-20-10
- Blend explícito: experiencial (70), social (20), formal (10)
- Sequência com pré-requisitos e spaced learning
- Ponto de aplicação no trabalho por competência

### ✅ Geração de Conteúdo
- Microlearning (blocos curtos, um conceito cada)
- Quizzes de aplicação (não decoreba)
- Afirmações críticas marcadas para verificação de SME

### ✅ Avaliação & Certificação
- Itens alinhados à taxonomia de Bloom
- Foco em aplicação no trabalho (Kirkpatrick nível 3+)
- Certificação por critério observável + limiar, com rubrica

### ✅ Gate Pedagógico
- Objetivos mensuráveis, SME verificado, foco em aplicação, acessibilidade
- Quality gate obrigatório (PASS/VETO), rastreável 100%

---

## Agentes

| Agent | Tier | Responsabilidade |
|-------|------|-----------------|
| **academy-chief** | T0 | Orquestra do gap à trilha publicada; intake → skills → design → avaliação → gate |
| **skill-mapper** | T1 | Mapeia gap em competências observáveis e objetivos mensuráveis |
| **track-designer** | T1 | Desenha trilha 70-20-10; sequência e pontos de aplicação |
| **content-forge** | T2 | Gera conteúdo microlearning e quizzes; marca flags de SME |
| **assessment-master** | T2 | Avaliação Bloom/Kirkpatrick e critérios de certificação |
| **learning-gate** | T3 | Quality gate pedagógico: SME, mensurabilidade, acessibilidade, VETO/PASS |

---

## Workflows

### 📋 wf-learning-completo

**Gatilho:** `*recommend-track`, `*build-course` (comando) ou push de performa/insights (gap identificado)

**Fases:**
1. **INTAKE** — Framing do gap (público, objetivo de negócio)
2. **SKILL_MAPPING** — Gap → matriz de competências + objetivos mensuráveis
3. **DESIGN** — Trilha 70-20-10 + conteúdo
4. **ASSESSMENT** — Avaliação de aplicação + certificação
5. **LEARNING_GATE** — Auditoria pedagógica (VETO/PASS)

**Saída:** matriz de competências, trilha, conteúdo, avaliação, learning audit

---

## Entrada de Dados

```bash
# Recomendar trilha a partir de um gap
*recommend-track gap:performa coorte:gestores-novos

# Construir curso
*build-course modulo:feedback-sbi

# Mapear competências
*map-skills cargo:gestor
```

---

## Outputs Principais

### Skills Matrix
- Competências observáveis, níveis atual/alvo, fonte e objetivo mensurável

### Learning Track
- Blend 70-20-10 explícito, sequência, pontos de aplicação no trabalho

### Course Content
- Microlearning com flags de SME e quizzes de aplicação

### Assessment
- Itens Bloom/Kirkpatrick, rubrica, critérios de certificação

### Learning Audit
- Verdict (PASS → publica | VETO → bloqueado até remediação)

---

## Integração com Outros Módulos

### 📈 performa
- Recebe gaps por ciclo/9-box e PDI → trilhas; devolve certificação para o PDI

### 🏗️ org-architect
- Matriz de competências por cargo → base do mapeamento de skills

### 📊 insights
- Gaps agregados de coorte (progressão estagnada) → trilhas; mede impacto (Kirkpatrick 4)

### 🚀 onboard
- Trilhas de integração 30/60/90 do novo colaborador

---

## Bases & Referências

- **70-20-10 (Lombardo & Eichinger / CCL):** experiencial / social / formal
- **Taxonomia de Bloom:** níveis cognitivos da avaliação
- **Kirkpatrick:** 4 níveis de efetividade (reação → resultado)
- **ADDIE / microlearning / cognitive load:** design instrucional
- **WCAG:** acessibilidade

---

## Princípios de Design

### 🎯 Começa pelo Gap
Aprendizagem é resposta a uma lacuna concreta e rastreável, não consumo de catálogo.

### 🛤️ 70-20-10
A maior parte do desenvolvimento acontece no trabalho e com os outros, não no curso.

### ✅ Aplicação > Conclusão
Sucesso é mudança de comportamento no trabalho (Kirkpatrick 3+), não taxa de conclusão.

### 📚 Velocidade sem Falsa Autoridade
Conteúdo gerado é rápido, mas o crítico passa por SME antes de publicar.

### 🔒 Gate Obrigatório
Nenhuma trilha é publicada sem PASS do learning-gate. VETO bloqueia até remediação.

---

## Como Começar

```bash
# Via chatbot
*academy-chief
"Academy ready. Que gap estamos fechando?"

# Definir o gap e o público
gap:performa "liderança situacional" coorte:gestores-novos

# Iniciar ciclo
*recommend-track
```

---

## Referência

- **config.yaml:** Estrutura, agents, tier_structure, scoring_system, workflow
- **agents/*.md:** Chief + 5 especialistas (T1/T2/T3)
- **tasks/*.md:** 5 tasks (map-skill-gap, design-track, build-content, assess-learning, audit-learning)
- **templates/*.yaml|md:** Output schemas (skills matrix, track, content, assessment, audit)
- **data/*.md:** 70-20-10, framework de competências, design de avaliação, padrões de conteúdo
- **workflows/wf-learning-completo.yaml:** Orquestração das 5 fases
- **checklists/learning-gate.md:** Quality gate obrigatório

---

**Última atualização:** 2026-06-08
**Versão:** 1.0.0
**Maintenance:** Learning & Development team
