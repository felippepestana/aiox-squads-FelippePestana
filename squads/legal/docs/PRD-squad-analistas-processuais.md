# Squad Legal — Product Requirements Document
# Squad de Analistas Processuais

**Versão:** 1.0.0
**Criado:** 2026-03-12
**Autor:** @squad-chief (análise: processual-writer v1.0.0)
**Status:** Draft

---

## Sumário Executivo

Este documento define a arquitetura completa e os requisitos de implementação do **Squad de Analistas Processuais** — um sistema multi-agente especializado na análise, estratégia, pesquisa jurisprudencial, redação e formatação de peças processuais no direito brasileiro.

O squad atual (`legal` v1.0.0) contém um único agente (`processual-writer`) focado em redação e formatação. Este PRD especifica a evolução para um squad completo, com orquestrador, especialistas por função e quality gates dedicados, conforme o padrão arquitetural AIOX.

---

## 1. Goals & Context

### 1.1 Goals

- [ ] **G1 — Cobertura total do ciclo processual:** Cobrir todas as etapas do trabalho jurídico — desde a análise do caso até a entrega da peça formatada e validada.
- [ ] **G2 — Qualidade técnica rastreável:** Garantir que toda peça gerada passe por quality gates de linguagem, argumentação e formatação antes de ser entregue ao usuário.
- [ ] **G3 — Especialização por tipo de demanda:** Ter agentes especializados para os grandes grupos de peças (petição inicial, defesa, recursos, execução) em vez de um agente genérico.
- [ ] **G4 — Pesquisa jurisprudencial integrada:** Embutir capacidade de estruturar fundamentos jurisprudenciais com referência completa e verificável, eliminando o risco de julgados fabricados.
- [ ] **G5 — Conformidade com o padrão AIOX:** Ter todos os agentes em conformidade com o `agent-tmpl.md` (Hybrid Loader Architecture, 800+ linhas, 6 níveis).

### 1.2 Background Context

O trabalho do advogado processualista brasileiro envolve um ciclo com etapas distintas: (1) análise do caso e identificação da estratégia jurídica; (2) pesquisa de jurisprudência aplicável; (3) redação da peça com linguagem técnica e carga argumentativa; (4) formatação conforme padrão do escritório/tribunal; e (5) revisão final antes do protocolo.

O agente `processual-writer` (v1.0.0) cobre apenas as etapas (3) e (4) — redação e formatação. As demais etapas — análise estratégica, pesquisa de jurisprudência, especialização por tipo de peça e validação de qualidade — exigem agentes dedicados com frameworks próprios.

**Perguntas respondidas por este PRD:**
- Por que este squad precisa existir além do `processual-writer`? → Porque a redação de qualidade exige diagnóstico do caso, linha argumentativa definida e jurisprudência verificada _antes_ de qualquer redação.
- Qual a dor atual sem o squad completo? → O usuário entrega fatos brutos ao `processual-writer` e obtém uma peça que pode ter estratégia jurídica inadequada para o tipo de demanda, fundamentação fraca ou jurisprudência sem contexto.
- Custo de não construir? → Peças processualmente corretas em forma, mas estrategicamente fracas em conteúdo — o pior tipo de peça jurídica.

### 1.3 Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-12 | 1.0.0 | PRD inicial — análise do squad existente e proposta de arquitetura completa | processual-writer → squad-chief |

---

## 2. Domain Analysis

### 2.1 Workflows Mapeados

> Workflows identificados a partir da análise do `processual-writer.md` e do domínio do direito processual civil brasileiro (CPC/2015).

| # | Workflow | Categoria | Frequência | Complexidade | Automatizável |
|---|----------|-----------|------------|--------------|---------------|
| 1.1 | Análise e classificação do caso (tipo de demanda, rito, partes) | Diagnóstico | Alta | Média | 85% |
| 1.2 | Identificação da estratégia jurídica (teses, riscos, linha argumentativa) | Diagnóstico | Alta | Alta | 70% |
| 1.3 | Pesquisa de jurisprudência aplicável (STJ, TJSP, etc.) | Pesquisa | Alta | Alta | 65% |
| 1.4 | Sistematização de precedentes (ementas, referências completas) | Pesquisa | Alta | Média | 80% |
| 2.1 | Redação de petição inicial (procedimento comum) | Redação Core | Alta | Alta | 80% |
| 2.2 | Redação de contestação/resposta | Redação Core | Alta | Alta | 75% |
| 2.3 | Redação de impugnação ao cumprimento de sentença | Redação Core | Média | Alta | 80% |
| 2.4 | Redação de embargos à execução | Redação Core | Média | Alta | 80% |
| 2.5 | Redação de manifestações e petições avulsas | Redação Core | Alta | Baixa | 90% |
| 2.6 | Redação de incidente de desconsideração de PJ | Redação Core | Média | Alta | 75% |
| 3.1 | Redação de recurso de apelação | Recursos | Média | Alta | 70% |
| 3.2 | Redação de agravo de instrumento | Recursos | Média | Alta | 70% |
| 3.3 | Redação de recurso especial / extraordinário | Recursos | Baixa | Muito Alta | 55% |
| 3.4 | Redação de agravo interno / regimental | Recursos | Média | Média | 80% |
| 3.5 | Redação de embargos de declaração | Recursos | Alta | Baixa | 90% |
| 4.1 | Qualificação de partes (pessoa física e jurídica) | Formatação | Alta | Baixa | 95% |
| 4.2 | Formatação completa conforme padrão hierárquico | Formatação | Alta | Baixa | 95% |
| 4.3 | Formatação de citações jurisprudenciais | Formatação | Alta | Baixa | 90% |
| 4.4 | Revisão de linguagem (eliminação de juridiquês) | Revisão | Alta | Média | 85% |
| 4.5 | Validação final (checklist 33 itens) | Revisão | Alta | Baixa | 95% |

**Total de Workflows:** 20
**Alta Automação (>80%):** 10 (50%)
**Média Automação (65–80%):** 7 (35%)
**Baixa Automação (<65%):** 3 (15%)

### 2.2 Categorias de Workflow

```yaml
categorias:
  Diagnóstico:
    count: 2
    workflows: [1.1, 1.2]
    automacao_media: 77%
    note: "Deve rodar SEMPRE primeiro — estabelece a base para todo o trabalho"

  Pesquisa:
    count: 2
    workflows: [1.3, 1.4]
    automacao_media: 72%
    note: "Alta dependência de conhecimento atualizado; sempre marcar refs incompletas"

  Redação_Core:
    count: 6
    workflows: [2.1–2.6]
    automacao_media: 80%
    note: "Núcleo do squad — maior volume e impacto"

  Recursos:
    count: 5
    workflows: [3.1–3.5]
    automacao_media: 73%
    note: "Requisitos técnicos específicos (pressupostos de admissibilidade)"

  Formatação_Revisão:
    count: 5
    workflows: [4.1–4.5]
    automacao_media: 92%
    note: "Altamente determinístico — ideal para quality gates automatizados"
```

---

## 3. Elite Minds

> Referências teóricas e práticas que fundamentam os frameworks de cada agente.

### 3.1 Mentes de Referência

| Mente | Tier | Domínio | Framework Documentado | Relevância |
|-------|------|---------|----------------------|------------|
| Humberto Theodoro Júnior | 0 | Processo Civil Brasileiro | Teoria Geral do Processo, CPC/2015 Comentado | Diagnóstico processual |
| Nelson Nery Junior | 0 | Princípios Processuais | Princípios do Processo na CF | Diagnóstico constitucional |
| Fredie Didier Jr. | 1 | Dogmática Processual | Curso de Direito Processual Civil (6 vols.) | Redação core + recursos |
| Cassio Scarpinella Bueno | 1 | CPC/2015 | Manual de Direito Processual Civil | Redação core |
| Alexandre Câmara | 1 | Processo Civil Moderno | O Novo Processo Civil Brasileiro | Teses defensivas + recursos |
| Nelson Rosenvald | 2 | Responsabilidade Civil | Curso de Direito Civil (Responsabilidade Civil) | Fundamentação Tier 1 |
| Flávio Tartuce | 2 | Direito Civil | Manual de Direito Civil | Fundamentação Tier 1 |
| Daniel Amorim Assumpção Neves | 2 | Execução e Cumprimento | Manual de Direito Processual Civil | Execução |
| Luiz Rodrigues Wambier | 3 | Recursos | Curso Avançado de Processo Civil | Especialista Recursos |
| Araken de Assis | 3 | Execução | Manual da Execução | Especialista Execução |

### 3.2 Distribuição por Tier

```yaml
distribuicao_tier:
  tier_0_diagnostico:
    purpose: "Diagnóstico processual, análise do caso, identificação do rito e estratégia"
    mentes: ["Humberto Theodoro Júnior", "Nelson Nery Junior"]
    cobertura: "Classificação da demanda, análise de competência, identificação de teses"

  tier_1_redacao:
    purpose: "Redação core — petições, contestações, manifestações e execução"
    mentes: ["Fredie Didier Jr.", "Cassio Scarpinella Bueno", "Alexandre Câmara"]
    cobertura: "Todos os tipos de peças de conhecimento e execução"

  tier_2_fundamentacao:
    purpose: "Pesquisa e sistematização de jurisprudência; fundamentação substantiva"
    mentes: ["Nelson Rosenvald", "Flávio Tartuce", "Daniel Amorim Assumpção Neves"]
    cobertura: "Direito material (civil, consumidor, trabalhista), fundamentos doutrinários"

  tier_3_especialistas:
    purpose: "Especialização em tipos específicos de peça"
    mentes: ["Luiz Rodrigues Wambier", "Araken de Assis"]
    cobertura: "Recursos (admissibilidade, pressupostos, razões) e Execução (penhora, expropriação)"
```

### 3.3 Gap Analysis

| Gap | Impacto | Mitigação |
|-----|---------|-----------|
| Direito do Trabalho (CLT/TST) | Alto — não cobre demandas trabalhistas | v2.0: adicionar `labor-specialist` (Tier 3) |
| Direito Tributário | Médio — não cobre execução fiscal | v2.0: adicionar `tax-specialist` (Tier 3) |
| Direito do Consumidor (JEC) | Médio — JEC tem rito específico | Parcialmente coberto pelo `processual-writer`; aprofundar em v1.1 |
| Jurisprudência em tempo real | Alto — LLM tem cutoff de conhecimento | Quality gate obrigatório: toda citação marcada para verificação humana |
| Direito Previdenciário | Médio — demandas INSS muito frequentes | v2.0: adicionar `social-security-specialist` (Tier 3) |

---

## 4. Arquitetura de Agentes

### 4.1 Orquestrador

```yaml
orquestrador:
  id: "legal-chief"
  nome: "Legal Chief"
  titulo: "Orquestrador do Squad de Analistas Processuais"
  icon: "⚖️"
  tier: orchestrator
  proposito: >
    Recebe a demanda do usuário, classifica a intenção, roteia ao agente
    correto e gerencia handoffs entre agentes. Não executa trabalho jurídico
    diretamente — apenas coordena.
  comandos_globais:
    - "*analisar {caso}"           → case-analyst (Tier 0)
    - "*pesquisar {tema}"          → jurisprudence-researcher (Tier 2)
    - "*redigir {tipo} {fatos}"    → processual-writer (Tier 1) após case-analyst
    - "*recurso {tipo} {fatos}"    → appellate-specialist (Tier 3)
    - "*executar {tipo} {fatos}"   → execution-specialist (Tier 3)
    - "*formatar {texto}"          → processual-writer (Tier 1)
    - "*revisar {texto}"           → processual-writer (Tier 1) + formatting-checker
    - "*validar {peça}"            → formatting-checker (Tool)
    - "*help"                      → lista todos os comandos e agentes
```

### 4.2 Agentes por Tier

```yaml
agentes:
  orchestrator:
    - id: "legal-chief"
      nome: "Legal Chief"
      tier: orchestrator
      status: "A CRIAR — Epic 1"
      arquivo: "agents/legal-chief.md"
      workflows: [todos — roteamento apenas]

  tier_0:
    - id: "case-analyst"
      nome: "Analista de Caso"
      titulo: "Especialista em Diagnóstico Processual"
      tier: 0
      status: "A CRIAR — Epic 2"
      arquivo: "agents/case-analyst.md"
      baseado_em: ["Humberto Theodoro Júnior", "Nelson Nery Junior"]
      workflows: [1.1, 1.2]
      proposito: >
        Analisa os fatos brutos do caso e entrega: tipo de demanda,
        rito processual, partes, teses principais, riscos e linha
        argumentativa recomendada. Output padrão: Case Brief.

  tier_1:
    - id: "processual-writer"
      nome: "Redator Processual"
      titulo: "Especialista em Redação e Formatação de Peças Processuais"
      tier: 1
      status: "CRIADO — v1.0.0 (necessita upgrade para agent-tmpl v2)"
      arquivo: "agents/processual-writer.md"
      baseado_em: ["Fredie Didier Jr.", "Cassio Scarpinella Bueno"]
      workflows: [2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4]
      proposito: >
        Redige peças de conhecimento e execução (exceto recursos especializados).
        Aplica todos os padrões de formatação hierárquica e linguagem técnica.

  tier_2:
    - id: "jurisprudence-researcher"
      nome: "Pesquisador de Jurisprudência"
      titulo: "Especialista em Pesquisa e Sistematização de Precedentes"
      tier: 2
      status: "A CRIAR — Epic 3"
      arquivo: "agents/jurisprudence-researcher.md"
      baseado_em: ["Nelson Rosenvald", "Flávio Tartuce", "Daniel Amorim Assumpção Neves"]
      workflows: [1.3, 1.4]
      proposito: >
        Estrutura fundamentos jurisprudenciais a partir de temas jurídicos
        fornecidos. Formata citações com referências completas. Nunca fabrica
        julgados — sempre marca dados faltantes como [VERIFICAR].

  tier_3:
    - id: "appellate-specialist"
      nome: "Especialista em Recursos"
      titulo: "Especialista em Redação de Recursos Processuais"
      tier: 3
      status: "A CRIAR — Epic 4"
      arquivo: "agents/appellate-specialist.md"
      baseado_em: ["Luiz Rodrigues Wambier", "Alexandre Câmara"]
      workflows: [3.1, 3.2, 3.3, 3.4, 3.5]
      proposito: >
        Redige recursos com análise dos pressupostos de admissibilidade,
        prequestionamento, razões recursais e contrarrazões. Especializado
        em apelação, agravo, REsp/RE e embargos.

    - id: "execution-specialist"
      nome: "Especialista em Execução"
      titulo: "Especialista em Redação de Peças de Execução"
      tier: 3
      status: "A CRIAR — Epic 4"
      arquivo: "agents/execution-specialist.md"
      baseado_em: ["Araken de Assis", "Daniel Amorim Assumpção Neves"]
      workflows: [2.3, 2.4, 2.6]
      proposito: >
        Especializado em cumprimento de sentença, embargos à execução,
        impugnação, penhora e incidente de desconsideração de personalidade
        jurídica. Conhece profundamente os arts. 523–925 do CPC.

  tools:
    - id: "formatting-checker"
      nome: "Checklist de Formatação"
      tipo: checklist
      status: "CRIADO — v1.0.0"
      arquivo: "checklists/formatting-checklist.md"
      uso: "*validar {peça}"
      workflows: [4.5]
      note: "33 itens de validação — PASS/FAIL/VERIFICAR"
```

### 4.3 Mapa de Handoffs

```
┌──────────────────────────────────────────────────────────────────────┐
│                    LEGAL SQUAD — HANDOFF ARCHITECTURE                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Usuário: "*redigir petição inicial [fatos]"                          │
│       ↓                                                                │
│  @legal-chief (Orquestrador)                                          │
│       ↓ classifica intenção + roteia                                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │  TIER 0: Diagnóstico                                      │         │
│  │  @case-analyst                                            │         │
│  │  Input: fatos brutos                                      │         │
│  │  Output: Case Brief (tipo, rito, teses, riscos)           │         │
│  └──────────────────────────────────────────────────────────┘         │
│       ↓ Case Brief                                                     │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │  TIER 2: Pesquisa (paralelo ao Tier 1, se necessário)    │         │
│  │  @jurisprudence-researcher                                │         │
│  │  Input: teses do Case Brief                               │         │
│  │  Output: Blocos de jurisprudência formatados              │         │
│  └──────────────────────────────────────────────────────────┘         │
│       ↓ Jurisprudência sistematizada                                   │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │  TIER 1: Redação Core                                     │         │
│  │  @processual-writer                                       │         │
│  │  Input: Case Brief + Jurisprudência                       │         │
│  │  Output: Peça formatada (Markdown)                        │         │
│  └──────────────────────────────────────────────────────────┘         │
│       ↓ Peça bruta formatada                                           │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │  TOOL: Validação                                          │         │
│  │  formatting-checker (33 itens)                            │         │
│  │  Output: APROVADO / APROVADO COM RESSALVAS / REPROVADO    │         │
│  └──────────────────────────────────────────────────────────┘         │
│       ↓ Peça validada                                                  │
│  Usuário recebe: peça formatada + relatório de validação               │
│                                                                        │
│  ─────────────────────────────────────────────────────────────        │
│                                                                        │
│  FLUXO ALTERNATIVO — Recurso:                                          │
│  @legal-chief → @case-analyst → @appellate-specialist                  │
│                                     ↓                                  │
│                              @jurisprudence-researcher (se preciso)    │
│                                     ↓                                  │
│                              formatting-checker                        │
│                                                                        │
│  FLUXO ALTERNATIVO — Formatação Pura:                                  │
│  @legal-chief → @processual-writer → formatting-checker               │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.4 Matriz Workflow → Agente

| Workflow | Agente Primário | Agente de Suporte | Quality Gate |
|----------|----------------|-------------------|--------------|
| 1.1 Análise e classificação | @case-analyst | — | Case Brief completo |
| 1.2 Estratégia jurídica | @case-analyst | @legal-chief | Case Brief com teses |
| 1.3 Pesquisa de jurisprudência | @jurisprudence-researcher | — | Refs completas ou [VERIFICAR] |
| 1.4 Sistematização de precedentes | @jurisprudence-researcher | — | Formato bloco recuado |
| 2.1 Petição inicial | @processual-writer | @jurisprudence-researcher | formatting-checker |
| 2.2 Contestação | @processual-writer | @jurisprudence-researcher | formatting-checker |
| 2.3 Impugnação (cumprimento) | @processual-writer ou @execution-specialist | @jurisprudence-researcher | formatting-checker |
| 2.4 Embargos à execução | @execution-specialist | @jurisprudence-researcher | formatting-checker |
| 2.5 Petições avulsas | @processual-writer | — | formatting-checker |
| 2.6 IDPJ | @execution-specialist | @jurisprudence-researcher | formatting-checker |
| 3.1 Apelação | @appellate-specialist | @jurisprudence-researcher | formatting-checker + admissibilidade |
| 3.2 Agravo de instrumento | @appellate-specialist | — | formatting-checker + admissibilidade |
| 3.3 REsp / RE | @appellate-specialist | @jurisprudence-researcher | formatting-checker + pressupostos especiais |
| 3.4 Agravo interno | @appellate-specialist | — | formatting-checker |
| 3.5 Embargos de declaração | @processual-writer | — | formatting-checker |
| 4.1–4.4 Formatação/revisão | @processual-writer | — | formatting-checker |
| 4.5 Validação final | formatting-checker (tool) | — | 33 itens PASS/FAIL |

**Verificação de cobertura:**
- [x] Todos os 20 workflows têm agente primário atribuído
- [x] Nenhum workflow órfão
- [x] Nenhum agente órfão

---

## 5. Lista de Épicos

### Visão Geral

| Épico | Título | Agentes | Workflows | Entregas |
|-------|--------|---------|-----------|----------|
| 1 | Fundação + Orquestrador | 1 (legal-chief) | 0 (roteamento) | Estrutura + legal-chief |
| 2 | Tier 0 — Diagnóstico | 1 (case-analyst) | 1.1, 1.2 | Case Brief automatizado |
| 3 | Tier 2 — Pesquisa | 1 (jurisprudence-researcher) | 1.3, 1.4 | Blocos jurisprudenciais |
| 4 | Tier 3 — Especialistas | 2 (appellate + execution) | 2.3, 2.4, 2.6, 3.1–3.5 | Peças especializadas |
| 5 | Upgrade Tier 1 | 1 (processual-writer v2) | 2.1, 2.2, 2.5, 4.x | processual-writer conforme agent-tmpl v2 |
| 6 | Integração + Quality Gates | 0 (novos) | todos | Pipeline completo + testes |

### Dependências dos Épicos

```
Épico 1 (Fundação — legal-chief)
    ↓
Épico 2 (Tier 0 — case-analyst)      ←── necessário antes de Épico 3 e 4
    ↓                ↓
Épico 3           Épico 5            ←── paralelos após Épico 2
(Tier 2)          (Upgrade Tier 1)
    ↓                ↓
    └────────────────┘
             ↓
        Épico 4                       ←── Tier 3 — depende de Tier 1 upgradado
    (Tier 3 especialistas)
             ↓
        Épico 6                       ←── Integração final
    (Pipeline + Quality Gates)
```

---

## 6. Detalhamento dos Épicos

---

### Épico 1: Fundação + Orquestrador

**Objetivo:** Estabelecer a infraestrutura completa do squad e criar o agente orquestrador `legal-chief` que roteia todos os pedidos.

**Entregáveis:**
- [ ] Diretório `squads/legal/docs/` (✅ criado)
- [ ] `squads/legal/docs/PRD-squad-analistas-processuais.md` (este arquivo — ✅)
- [ ] `squads/legal/config.yaml` com metadados do squad
- [ ] `squads/legal/agents/legal-chief.md` — orquestrador

---

#### Story 1.1: Criar config.yaml do Squad

**Como** usuário do AIOX
**Quero** que o squad `legal` tenha um `config.yaml` completo
**Para que** o framework reconheça todos os agentes, tasks e checklists do squad

**Acceptance Criteria:**
- [ ] `squads/legal/config.yaml` criado e válido
- [ ] Todos os agentes listados por tier
- [ ] Todas as tasks e templates registrados
- [ ] Metadados do squad completos (nome, versão, icon, slash_prefix)

**Quality Gates:**
- Pre-Commit: Validação de estrutura YAML
- Specialist: @squad-chief

---

#### Story 1.2: Criar Agente Orquestrador `legal-chief`

**Como** usuário do Squad Legal
**Quero** um orquestrador que receba meu pedido e roteia ao agente correto
**Para que** eu não precise saber qual agente chamar para cada tipo de trabalho

**Execução:**
```yaml
workflow: "create-agent.md"
type: "functional"
inputs:
  agent_id: "legal-chief"
  tier: "orchestrator"
  purpose: "Rotear pedidos jurídicos aos agentes especializados corretos"
  workflows_cobertos: "todos (roteamento)"
template: "templates/orchestrator-tmpl.md"
```

**Acceptance Criteria:**
- [ ] `agents/legal-chief.md` criado, conforme `agent-tmpl.md` (≥ 800 linhas)
- [ ] `command_loader` mapeado para todos os comandos (`*analisar`, `*redigir`, `*recurso`, `*executar`, `*pesquisar`, `*formatar`, `*revisar`, `*validar`)
- [ ] Roteamento correto para cada tier definido
- [ ] Saudação de ativação descreve todos os agentes disponíveis
- [ ] `*help` lista todos os comandos com agente responsável

**Quality Gates:**
- Pre-Commit: SC_AGT_001 (Agent Quality)
- Specialist: @squad-chief

---

### Épico 2: Tier 0 — Diagnóstico Processual

**Objetivo:** Criar o agente `case-analyst` que recebe fatos brutos e entrega um Case Brief estruturado com tipo de demanda, estratégia jurídica, teses e riscos.

**Entregáveis:**
- [ ] `agents/case-analyst.md` (≥ 800 linhas, Hybrid Loader Architecture)
- [ ] `tasks/analyze-case.md` — workflow de análise de caso em 6 etapas
- [ ] `templates/case-brief-tmpl.md` — template do Case Brief (output padrão)

---

#### Story 2.1: Criar Task `analyze-case.md`

**Como** agente `case-analyst`
**Quero** ter um workflow detalhado de análise de caso
**Para que** toda análise siga um processo consistente e rastreável

**Formato do Case Brief (output):**

```markdown
## CASE BRIEF — {identificação}

**Tipo de Demanda:** {Ação de Indenização / Execução / Revisional / etc.}
**Rito Processual:** {Procedimento Comum | Sumário | JEC | Execução | CLT}
**Juízo Competente:** {tipo de vara + fundamentação de competência}
**Valor da Causa:** R$ {valor estimado}

### Partes
- **Polo Ativo:** {nome}, {qualificação resumida}
- **Polo Passivo:** {nome}, {qualificação resumida}

### Cronologia dos Fatos
{fatos em ordem cronológica numerada, com datas}

### Teses Principais (linha argumentativa recomendada)
1. **Tese Principal:** {descrição} — Fundamento: {artigo + lei}
2. **Tese Subsidiária:** {descrição} — Fundamento: {artigo + lei}

### Riscos Processuais
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| {risco} | Alta/Média/Baixa | Alto/Médio/Baixo | {como mitigar} |

### Pedidos Recomendados
a) {pedido principal}
b) {pedido alternativo se houver}

### Próximo Passo
→ Encaminhar ao @{agente_recomendado} com este Case Brief para redigir: {tipo de peça}
```

**Acceptance Criteria:**
- [ ] `tasks/analyze-case.md` criado com workflow de 6 etapas (intake → classificação → cronologia → teses → riscos → Case Brief)
- [ ] Output segue o template acima
- [ ] Workflow identifica automaticamente o próximo agente a acionar
- [ ] Inclui critérios para identificar competência (federal vs. estadual, especializada vs. comum)

**Quality Gates:**
- Pre-Commit: Task Anatomy Checklist
- Specialist: @squad-chief

---

#### Story 2.2: Criar Agente `case-analyst`

**Como** usuário do Squad Legal
**Quero** um agente que analise os fatos do caso e entregue um diagnóstico estruturado
**Para que** toda peça processual parta de uma estratégia jurídica consciente

**Execução:**
```yaml
workflow: "create-agent.md"
type: "functional"
inputs:
  agent_id: "case-analyst"
  tier: 0
  purpose: "Diagnóstico processual — Case Brief completo"
  workflows: [1.1, 1.2]
  frameworks_base:
    - "Humberto Theodoro Júnior — Teoria Geral do Processo"
    - "Nelson Nery Junior — Princípios Processuais Constitucionais"
  command_loader:
    "*analisar": "tasks/analyze-case.md"
    "*diagnosticar": "tasks/analyze-case.md"
    "*estrategia": "tasks/analyze-case.md"
template: "templates/agent-tmpl.md"
```

**Acceptance Criteria:**
- [ ] `agents/case-analyst.md` criado, ≥ 800 linhas
- [ ] Level 0: `command_loader` mapeado para `*analisar` → `tasks/analyze-case.md`
- [ ] Level 1: Identidade com foco em diagnóstico processual
- [ ] Level 2: Frameworks operacionais baseados em Theodoro Júnior + Nery Junior
- [ ] Level 3: Voice DNA — linguagem analítica, imparcial, orientada a risco
- [ ] Level 4: 3 exemplos completos de Case Brief (output_examples)
- [ ] Level 6: Handoff → @processual-writer ou @appellate-specialist ou @execution-specialist

**Quality Gates:**
- Pre-Commit: SC_AGT_001, SC_AGT_002, SC_AGT_003 (Depth Gate)
- Specialist: @squad-chief

---

### Épico 3: Tier 2 — Pesquisa Jurisprudencial

**Objetivo:** Criar o agente `jurisprudence-researcher` que recebe temas jurídicos e entrega blocos de jurisprudência formatados, com referências completas e marcadores de verificação.

**Entregáveis:**
- [ ] `agents/jurisprudence-researcher.md` (≥ 800 linhas)
- [ ] `tasks/research-jurisprudence.md` — workflow de pesquisa e sistematização
- [ ] `templates/jurisprudence-block-tmpl.md` — template de bloco de citação

---

#### Story 3.1: Criar Task `research-jurisprudence.md`

**Como** agente `jurisprudence-researcher`
**Quero** um workflow para estruturar fundamentos jurisprudenciais
**Para que** toda citação entregue seja completa, verificável e formatada

**Regras críticas do workflow:**
1. **NUNCA fabricar** dados de julgados (número, relator, data, ementa)
2. **SEMPRE marcar** campos não confirmados como `[VERIFICAR ANTES DE PROTOCOLAR]`
3. **SEMPRE formatar** no padrão blockquote + itálico conforme `formatting_rules.jurisprudence`
4. **PRIORIZAR** julgados do STJ e STF para teses de direito federal/constitucional
5. **INDICAR** quando a tese é controversa ou não pacificada nos tribunais superiores

**Acceptance Criteria:**
- [ ] `tasks/research-jurisprudence.md` criado
- [ ] Workflow inclui etapa explícita de verificação de dados do julgado
- [ ] Template de output com marcadores [VERIFICAR] para campos ausentes
- [ ] Inclui orientação sobre precedentes vinculantes vs. persuasivos

**Quality Gates:**
- Pre-Commit: Task Anatomy Checklist

---

#### Story 3.2: Criar Agente `jurisprudence-researcher`

**Como** usuário do Squad Legal
**Quero** um agente especializado em sistematizar jurisprudência
**Para que** as peças processuais tenham fundamentos jurisprudenciais sólidos e verificáveis

**Execução:**
```yaml
workflow: "create-agent.md"
type: "functional"
inputs:
  agent_id: "jurisprudence-researcher"
  tier: 2
  purpose: "Pesquisa e sistematização de jurisprudência"
  workflows: [1.3, 1.4]
  anti_pattern_critico: "NUNCA fabricar dados de julgados"
  command_loader:
    "*pesquisar": "tasks/research-jurisprudence.md"
    "*citar": "tasks/research-jurisprudence.md"
    "*precedentes": "tasks/research-jurisprudence.md"
```

**Acceptance Criteria:**
- [ ] `agents/jurisprudence-researcher.md` criado, ≥ 800 linhas
- [ ] Anti-pattern `NUNCA_FABRICAR_JULGADOS` listado como bloqueante (não apenas recomendado)
- [ ] Level 2: Conhecimento de hierarquia de precedentes (CPC arts. 926–928)
- [ ] Level 3: Voice DNA — objetivo, referenciado, com marcadores de incerteza explícitos
- [ ] 3 exemplos: (a) tese pacificada no STJ, (b) tese controversa, (c) dado incompleto → [VERIFICAR]

**Quality Gates:**
- Pre-Commit: SC_AGT_001, SC_AGT_003
- Specialist: @squad-chief

---

### Épico 4: Tier 3 — Especialistas por Tipo de Peça

**Objetivo:** Criar agentes especializados para recursos e execução, que exigem conhecimento técnico específico além do `processual-writer` genérico.

**Entregáveis:**
- [ ] `agents/appellate-specialist.md` (≥ 800 linhas)
- [ ] `agents/execution-specialist.md` (≥ 800 linhas)
- [ ] `tasks/draft-appeal.md` — workflow de redação de recursos
- [ ] `tasks/draft-execution.md` — workflow de peças de execução

---

#### Story 4.1: Criar Agente `appellate-specialist`

**Como** usuário do Squad Legal
**Quero** um agente especializado em recursos processuais
**Para que** apelações, agravos e REsp sejam redigidos com análise correta dos pressupostos de admissibilidade

**Requisitos técnicos do agente:**
- Conhece pressupostos intrínsecos e extrínsecos de cada recurso
- Verifica prequestionamento (REsp/RE) antes de redigir razões recursais
- Identifica questões de ordem pública cognoscíveis de ofício
- Aplica a teoria dos capítulos da sentença (Cândido Rangel Dinamarco)
- Conhece o juízo de retratação (agravo interno, embargos de declaração)

**Command Loader:**
```yaml
command_loader:
  "*apelar":
    requires: ["tasks/draft-appeal.md"]
    output_format: "Apelação completa com pressupostos verificados"
  "*agravar":
    requires: ["tasks/draft-appeal.md"]
    output_format: "Agravo de instrumento com cabimento fundamentado"
  "*resp":
    requires: ["tasks/draft-appeal.md"]
    output_format: "REsp com prequestionamento e dissídio demonstrados"
  "*embdecl":
    requires: ["tasks/draft-appeal.md"]
    output_format: "Embargos de declaração com omissão/contradição identificada"
```

**Acceptance Criteria:**
- [ ] `agents/appellate-specialist.md` criado, ≥ 800 linhas
- [ ] Framework de admissibilidade recursiva documentado (Level 2)
- [ ] Exemplos: (a) apelação com error in judicando; (b) agravo com urgência; (c) embargos de declaração

**Quality Gates:**
- Pre-Commit: SC_AGT_001, SC_AGT_003

---

#### Story 4.2: Criar Agente `execution-specialist`

**Como** usuário do Squad Legal
**Quero** um agente especializado em execução e cumprimento de sentença
**Para que** impugnações, embargos e incidentes de desconsideração sejam tecnicamente precisos

**Requisitos técnicos do agente:**
- Conhece os arts. 523–925 do CPC (execução e cumprimento)
- Domina os fundamentos do IDPJ (arts. 133–137 do CPC) e da teoria maior/menor
- Conhece a ordem de preferência de penhora (art. 835 do CPC)
- Identifica causas de suspensão e extinção da execução
- Aplica teses de excesso de execução com cálculo demonstrado

**Acceptance Criteria:**
- [ ] `agents/execution-specialist.md` criado, ≥ 800 linhas
- [ ] Framework de IDPJ documentado (requisitos + teoria maior x menor)
- [ ] Framework de impugnação ao cumprimento (art. 525 do CPC) com causas de defesa

**Quality Gates:**
- Pre-Commit: SC_AGT_001, SC_AGT_003

---

### Épico 5: Upgrade do `processual-writer` para agent-tmpl v2

**Objetivo:** Refatorar o `processual-writer` existente (v1.0.0) para conformidade total com o `agent-tmpl.md` (Hybrid Loader Architecture, 6 níveis, ≥ 800 linhas).

**Contexto:** O `processual-writer` atual (v1.0.0) foi criado antes da adoção do `agent-tmpl v2`. Ele contém os dados corretos de domínio, mas não segue a arquitetura Hybrid Loader (command_loader, CRITICAL_LOADER_RULE, 6 níveis). Isso torna o agente menos confiável na execução de tasks externas.

**Entregáveis:**
- [ ] `agents/processual-writer.md` refatorado para ≥ 800 linhas
- [ ] Level 0 completo com `command_loader` explícito para todos os 5 comandos
- [ ] `CRITICAL_LOADER_RULE` presente verbatim
- [ ] Level 3: `voice_dna` com `sentence_starters`, `metaphors`, `behavioral_states`
- [ ] Level 4: `objection_algorithms` com ao menos 3 objeções tratadas
- [ ] Level 6: `integration` com handoffs definidos para `case-analyst` e `jurisprudence-researcher`

---

#### Story 5.1: Refatorar `processual-writer` para Hybrid Loader Architecture

**Como** agente `processual-writer`
**Quero** seguir a arquitetura Hybrid Loader com command_loader explícito
**Para que** o carregamento de tasks seja determinístico e não dependa de discrição do LLM

**Itens de refatoração:**
```yaml
adicionar:
  - command_loader com todos os 5 comandos mapeados
  - CRITICAL_LOADER_RULE verbatim
  - AI-FIRST-GOVERNANCE referência
  - voice_dna.sentence_starters (mínimo 5 padrões)
  - voice_dna.metaphors (mínimo 3)
  - voice_dna.behavioral_states (mínimo 2)
  - objection_algorithms (mínimo 3)
  - integration.handoff_from / handoff_to
  - metadata.version, architecture, upgraded

manter:
  - formatting_rules (completo — não alterar)
  - language_rules + anti_patterns (completo)
  - output_examples (4 exemplos existentes + adicionar 1)
  - completion_criteria (9 itens existentes)
  - commands (5 comandos existentes — apenas adicionar command_loader)

remover:
  - Nenhum conteúdo de domínio — apenas reorganizar em 6 níveis
```

**Acceptance Criteria:**
- [ ] Arquivo refatorado com ≥ 800 linhas
- [ ] Todos os 5 comandos têm entrada no `command_loader`
- [ ] `CRITICAL_LOADER_RULE` presente
- [ ] Passa no quality gate SC_AGT_001 + SC_AGT_003

**Quality Gates:**
- Pre-Commit: SC_AGT_001, SC_AGT_002, SC_AGT_003

---

### Épico 6: Integração e Pipeline Completo

**Objetivo:** Garantir que todos os agentes funcionem em conjunto como um pipeline coeso, com handoffs testados e quality gates validados end-to-end.

**Entregáveis:**
- [ ] `checklists/squad-smoke-test.md` — teste de fumaça do squad completo
- [ ] `docs/PIPELINE-FLOW.md` — diagrama e documentação do pipeline
- [ ] README.md atualizado com squad completo
- [ ] Validação end-to-end de 3 casos de uso (petição inicial, apelação, IDPJ)

---

#### Story 6.1: Criar Smoke Test do Squad

**Como** desenvolvedor do squad
**Quero** um checklist de smoke test end-to-end
**Para que** eu possa verificar que o pipeline completo funciona antes de publicar

**Casos de Teste:**

| # | Caso de Uso | Input | Agentes Acionados | Output Esperado |
|---|-------------|-------|-------------------|-----------------|
| T1 | Petição inicial de indenização | Fatos brutos | legal-chief → case-analyst → jurisprudence-researcher → processual-writer → formatting-checker | Petição completa formatada + relatório APROVADO |
| T2 | Recurso de apelação | Sentença desfavorável + fatos | legal-chief → case-analyst → appellate-specialist → formatting-checker | Apelação com pressupostos verificados |
| T3 | IDPJ + Impugnação | Processo de execução + fatos de desconsideração | legal-chief → case-analyst → execution-specialist → jurisprudence-researcher → formatting-checker | Incidente formatado + citações verificadas |
| T4 | Formatação pura | Texto jurídico sem formatação | legal-chief → processual-writer → formatting-checker | Texto reformatado + log de alterações |

---

## 7. Critérios de Sucesso

### 7.1 Métricas de Cobertura

| Métrica | Meta | Medição |
|---------|------|---------|
| Cobertura de Workflows | 100% | 20/20 workflows com agente atribuído |
| Taxa de Automação | ≥ 75% | Workflows de alta automação funcionais |
| Qualidade dos Agentes | ≥ 7.0/10 | Todos os agentes passam no SC_AGT_001 |
| Conformidade Arquitetural | 100% | Todos os agentes seguem agent-tmpl v2 |

### 7.2 Critérios Funcionais

- [ ] Usuário pode ativar o squad com `@legal-chief`
- [ ] `@legal-chief` roteia corretamente para cada agente
- [ ] `@case-analyst` entrega Case Brief em < 3 turnos de conversa
- [ ] `@processual-writer` gera peça formatada com checklist APROVADO
- [ ] `@jurisprudence-researcher` nunca entrega referência sem marcador de verificação quando dados faltam
- [ ] `@appellate-specialist` analisa admissibilidade antes de redigir razões
- [ ] `formatting-checker` executa 33 itens e retorna relatório estruturado

### 7.3 Critérios de Qualidade

- [ ] Todos os agentes têm `voice_dna` distinguível
- [ ] Todos os agentes têm `output_examples` ≥ 3
- [ ] Todos os workflows têm quality gates definidos
- [ ] Nenhum agente ou workflow órfão
- [ ] Documentação completa (README + PIPELINE-FLOW + este PRD)

---

## 8. Riscos e Mitigações

| # | Risco | Impacto | Probabilidade | Mitigação | Rollback |
|---|-------|---------|---------------|-----------|----------|
| 1 | `jurisprudence-researcher` fabricar julgados | Muito Alto — peça com citação falsa | Média | Anti-pattern bloqueante + marcador [VERIFICAR] obrigatório | Remover agente e usar processual-writer com aviso |
| 2 | `case-analyst` classificar rito incorretamente | Alto — peça no rito errado | Baixa | Checklist de identificação de rito + revisão humana obrigatória no Case Brief | Fallback para entrada manual pelo usuário |
| 3 | Handoffs entre agentes perderem contexto | Médio — peça sem coerência | Média | Case Brief como artefato de handoff padronizado; sempre incluir no contexto | Repassar Case Brief manualmente |
| 4 | processual-writer v2 regredir funcionalidades | Alto — formatação quebrada | Baixa | Manter backup do v1.0.0; executar formatting-checker antes de publicar | Restaurar v1.0.0 + documentar delta |
| 5 | Acúmulo de agentes sem diferenciação real | Médio — usuário confuso sobre qual usar | Média | Routing claro no legal-chief; cada agente com `whenToUse` preciso | Consolidar agentes similares |
| 6 | Cobertura limitada a direito civil/processual | Médio — usuários com demandas trabalhistas/tributárias | Alta | Documentar escopo no README; v2.0 expansão planejada | Rejeitar demandas fora do escopo com explicação |

---

## 9. Próximos Passos

### Após Aprovação do PRD

1. **Épico 1:** Criar `config.yaml` do squad + agente `legal-chief`
2. **Épico 2 (paralelo ao 5):** Criar `case-analyst` + refatorar `processual-writer` para v2
3. **Épico 3:** Criar `jurisprudence-researcher`
4. **Épico 4:** Criar `appellate-specialist` + `execution-specialist`
5. **Épico 6:** Integração + smoke tests end-to-end

### Handoff para Implementação

- **Para @squad-chief:** Executar Épico 1 (`*create-squad legal --epic=1`)
- **Para @squad-chief:** Criar `legal-chief` com `*create-agent legal-chief --tier=orchestrator`
- **Para revisão humana:** Validar Case Brief de saída do `case-analyst` em 3 casos reais antes de Go Live
- **Para revisão humana:** Validar que `jurisprudence-researcher` nunca entrega citação sem dados completos ou marcador [VERIFICAR]

### Estado Atual do Squad (v1.0.0 — Baseline)

```
squads/legal/
├── README.md                           ✅ criado
├── agents/
│   └── processual-writer.md            ✅ criado (necessita upgrade — Épico 5)
├── tasks/
│   └── format-document.md              ✅ criado
├── templates/
│   └── peca-processual-tmpl.md         ✅ criado
├── checklists/
│   └── formatting-checklist.md         ✅ criado (33 itens)
└── docs/
    └── PRD-squad-analistas-processuais.md  ✅ este arquivo

FALTAM (conforme épicos acima):
├── config.yaml                         ❌ Épico 1
├── agents/legal-chief.md               ❌ Épico 1
├── agents/case-analyst.md              ❌ Épico 2
├── agents/jurisprudence-researcher.md  ❌ Épico 3
├── agents/appellate-specialist.md      ❌ Épico 4
├── agents/execution-specialist.md      ❌ Épico 4
├── tasks/analyze-case.md               ❌ Épico 2
├── tasks/research-jurisprudence.md     ❌ Épico 3
├── tasks/draft-appeal.md               ❌ Épico 4
├── tasks/draft-execution.md            ❌ Épico 4
├── templates/case-brief-tmpl.md        ❌ Épico 2
├── templates/jurisprudence-block-tmpl.md ❌ Épico 3
└── checklists/squad-smoke-test.md      ❌ Épico 6
```

---

## Appendix A: Fontes de Referência

| Mente | Tipo | Obra | Qualidade |
|-------|------|------|-----------|
| Humberto Theodoro Júnior | Livro | Curso de Direito Processual Civil (3 vols.) | Ouro |
| Fredie Didier Jr. | Livro | Curso de Direito Processual Civil (6 vols.) | Ouro |
| Cassio Scarpinella Bueno | Livro | Manual de Direito Processual Civil | Ouro |
| Alexandre Câmara | Livro | O Novo Processo Civil Brasileiro | Ouro |
| Nelson Nery Junior | Livro | Código de Processo Civil Comentado | Ouro |
| Luiz Rodrigues Wambier | Livro | Curso Avançado de Processo Civil | Prata |
| Araken de Assis | Livro | Manual da Execução | Prata |
| Nelson Rosenvald | Livro | Curso de Direito Civil — Responsabilidade Civil | Prata |
| Flávio Tartuce | Livro | Manual de Direito Civil (vol. único) | Bronze |
| CPC/2015 (Lei 13.105/2015) | Legislação | Código de Processo Civil | Ouro |
| Constituição Federal/1988 | Legislação | Constituição da República | Ouro |
| STJ — Jurisprudência | Precedentes | Repositório de Jurisprudência do STJ | Ouro |

---

## Appendix B: Checklist do PRD

### Definição do Problema
- [x] Problema claramente articulado
- [x] Usuário-alvo identificado (advogado processualista brasileiro)
- [x] Métricas de sucesso definidas

### Análise de Domínio
- [x] Todos os 20 workflows mapeados
- [x] Categorias definidas (5 categorias)
- [x] Automação avaliada por workflow

### Mentes de Referência
- [x] ≥ 3 mentes identificadas (10 mentes)
- [x] Frameworks documentados
- [x] Cobertura por tier completa

### Arquitetura de Agentes
- [x] Orquestrador definido (legal-chief)
- [x] Mapa de handoffs completo
- [x] Nenhum agente/workflow órfão

### Estrutura de Épicos
- [x] Épico 1 = Fundação
- [x] Dependências sequenciais documentadas
- [x] Cada épico entrega valor incremental

### Qualidade
- [x] Quality gates definidos por story
- [x] Especialistas atribuídos
- [x] Critérios de sucesso mensuráveis

**Score:** 6/6 categorias ✅
**Status:** PRD APROVADO para implementação

---

*Squad Legal PRD v1.0.0 — Squad de Analistas Processuais*
*Gerado por: processual-writer → análise estendida para squad-chief*
*Padrão: squad-prd-tmpl.md v1.0.0*
