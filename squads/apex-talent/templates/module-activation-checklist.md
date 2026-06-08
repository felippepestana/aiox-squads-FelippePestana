# Module Activation Checklist — Apex-Talent

> Como promover um módulo apex-talent de **🟡 esqueleto** (Chief-only) para **🟢 ativo** (squad completo).
>
> Baseado nos módulos já ativados: `talent-compass` (flagship), `profiler-dna`, `performa`. Aplique este checklist para `onboard`, `chronos`, `pulse`, `peopleops`, `benefits-hub`, `insights`, `org-architect`, `academy`.

---

## Pré-requisitos

Antes de começar:

- [ ] Domínio do módulo claro (RH, Folha, Benefícios, etc.) — consulte `squads/apex-talent/data/ai-opportunity-map.md`
- [ ] Briefing do escopo: 1 parágrafo descrevendo o que o módulo faz, baseado em metodologia/framework reconhecido
- [ ] Identificar handoffs com outros módulos (ex: `talent-compass` → `onboard` → `performa`)
- [ ] Estado atual confirmado: README com banner `🟡 Em desenvolvimento (esqueleto)` + `agents/<module>-chief.md` existe + nada mais em `agents/`

---

## Fase 1 — Design (planejamento, sem código)

Mapa de agentes seguindo o pattern Tier 0→3 dos ativos:

- [ ] **Tier 0 (1 agente)**: o `<module>-chief` já existe; reler e ajustar se necessário
- [ ] **Tier 1 (2-3 agentes)**: Core Specialists — quem executa o trabalho operacional principal
- [ ] **Tier 2 (2-3 agentes)**: Specialists secundários — apoio, profundidade, integração
- [ ] **Tier 3 (1 agente)**: Quality Gate — calibração, auditoria, fairness check, anti-bias

Mapa de tasks (1 task por capacidade-chave, 5-7 total):

- [ ] Listar comandos `*verb-noun` que o Chief vai expor
- [ ] Cada comando vira 1 task em `tasks/<verb-noun>.md`

Templates necessários (`templates/`):

- [ ] Identificar artefatos que o módulo gera (relatório, plano, checklist...) → 1 template cada

Dados de referência (`data/`):

- [ ] Listar metodologias/frameworks que o módulo aplica → 1 doc por methodology
- [ ] Tabelas/anchors que os agentes vão referenciar

Workflows (`workflows/`):

- [ ] Workflow principal: `wf-<cycle-name>.yaml` — sequência completa do ciclo do módulo

Gates de qualidade (`checklists/`):

- [ ] 1 checklist por gate (ex: `calibration-fairness-gate.md`, `payroll-closure-gate.md`)

> **Cap de design:** se o desenho passar de 7 agents / 7 tasks, parar e justificar — squads enxutos são mais fáceis de manter e roteáveis pelo Chief.

---

## Fase 2 — Build (criar arquivos)

Estrutura final esperada (espelha `squads/performa/`):

```text
squads/<module>/
├── README.md            # sem banner 🟡 mais
├── config.yaml          # status: ACTIVE
├── agents/
│   ├── <module>-chief.md    # Tier 0 (atualizar persona/heuristics)
│   ├── <specialist-1>.md    # Tier 1
│   ├── <specialist-2>.md    # Tier 1
│   ├── <specialist-3>.md    # Tier 2
│   ├── <specialist-4>.md    # Tier 2
│   └── <gate>.md            # Tier 3
├── tasks/<5-7 .md files>
├── templates/<3-5 .yaml ou .md>
├── data/<3-5 .md de methodology>
├── workflows/wf-<cycle>.yaml
└── checklists/<1+ gate>.md
```

Build steps:

- [ ] Criar `agents/<specialist>.md` por agente (usar `agents/<module>-chief.md` existente como base de estilo)
- [ ] Criar `tasks/<task>.md` por capacidade
- [ ] Criar `templates/<artifact>.{yaml,md}` por artefato
- [ ] Criar `data/<methodology>.md` por framework de referência
- [ ] Criar `workflows/wf-<cycle>.yaml`
- [ ] Criar `checklists/<gate>.md`
- [ ] **Atualizar `config.yaml`** (ver Fase 2.5)
- [ ] **Atualizar `README.md`**: REMOVER banner `🟡 Em desenvolvimento (esqueleto)` do topo

### Fase 2.5 — config.yaml ACTIVE (template canônico)

Pattern usado por `performa`, `talent-compass`, `profiler-dna`. Use como starting point:

```yaml
name: <module>
display_name: "<Nome> — <Domínio em PT-BR>"
version: "1.0.0"
domain: <slug-curto>
entry_agent: <module>-chief
description: "<2-3 frases descrevendo capacidades + decisões humanas que ficam preservadas>"

keywords:
  - <termo-1>
  - <termo-2>
  # ... 5-9 keywords

metadata:
  type: module
  status: ACTIVE           # era DEVELOPING; agora ACTIVE
  platform: apex-talent

tier_structure:
  tier_0:
    role: "<Verb> & <Verb>"
    agents: ["<module>-chief"]
  tier_1:
    role: "Core Specialists"
    agents: ["<sp-1>", "<sp-2>"]
  tier_2:
    role: "<área-secundária>"
    agents: ["<sp-3>", "<sp-4>"]
  tier_3:
    role: "<Gate name>"
    agents: ["<gate-agent>"]
```

Mantenha campos específicos do domínio que façam sentido (ex: `performa` tem `rating_model:`, `talent-compass` tem `bias_audit:`).

---

## Fase 3 — Wire no orquestrador (apex-talent)

A ativação não está completa até o orquestrador saber rotear para o módulo:

### 3.1 — `squads/apex-talent/agents/apex-talent-chief.md`

- [ ] **Bloco `delegate_targets`** (ou nome equivalente): adicionar entry para `<module>-chief` com 1 linha do quando-rotear
- [ ] **Tabela "*catalog"** dentro do agente: mover linha do módulo de `🟡 Em desenvolvimento` para `🟢 Ativo`
- [ ] Atualizar exemplos de **routing examples** se o módulo aparece em fluxos cross-lifecycle (ex: "attract→hire→onboard")
- [ ] Atualizar heurística `H_ROUTE_DEVELOPING_HONESTLY` se o módulo era citado lá

### 3.2 — `squads/apex-talent/README.md`

- [ ] Mover linha da tabela de módulos: `🟡 Em desenvolvimento` → `🟢 Ativo`
- [ ] Se aplicável, atualizar diagrama ASCII de lifecycle (linha de status)

### 3.3 — `squads/apex-talent/data/ai-opportunity-map.md`

- [ ] Se o módulo é citado lá, atualizar status/ícone para 🟢

### 3.4 — README raiz do repo (se tiver tabela cross-squad)

- [ ] Buscar referências ao módulo: `grep -rn "<module>" README.md` e ajustar marcadores de status

---

## Fase 4 — QA antes do PR

Validações automatizáveis:

- [ ] `python3 -c "import yaml; yaml.safe_load(open('squads/<module>/config.yaml'))"` → OK
- [ ] Para cada workflow: `python3 -c "import yaml; yaml.safe_load(open('squads/<module>/workflows/<wf>.yaml'))"` → OK
- [ ] Agentes citados no `tier_structure` do config existem como arquivos `.md` em `agents/`
- [ ] Tasks referenciadas em workflows existem em `tasks/`
- [ ] `<module>-chief.md` comandos `*verb` têm tasks correspondentes em `tasks/`

Sanity manual:

- [ ] Cada agente tem `tier:` declarada e bate com `tier_structure` do config
- [ ] README do módulo está coerente com o config (sem banner antigo, descrição alinhada)
- [ ] Apex-talent-chief consegue verbalmente rotear pro módulo (testar o `*catalog` mentalmente)

Lições conhecidas (de PRs passadas):

- [ ] **Workflow input keys batem com outputs upstream** (lição do review do #62 — citado no PR #63)
- [ ] **Fases marcadas como condicionais/standalone** quando não são obrigatórias no ciclo completo
- [ ] **Compliance-first em módulos regulatórios** (peopleops: CLT/eSocial/LGPD; benefits-hub: LGPD): docs sinalizam o que é referência vs. obrigação oficial

---

## Fase 5 — PR

Branch + commit:

```bash
git checkout -b feat/activate-<module>
git add squads/<module>/ squads/apex-talent/
git commit -m "feat: módulo <module> (<Domínio>) completo

[Descreve agentes, tasks, workflow + wiring no apex-talent]
"
```

Template de descrição do PR (espelhar #58 performa, #63 peopleops):

```markdown
## <Module> — <Domínio>

Promove o módulo `<module>` de esqueleto (Chief-only) para uma squad completa e **ativa**, no mesmo padrão dos módulos já construídos.

### O que entra

- **N agentes (T0→T3):** [lista com 1 linha de propósito por agente]
- **N tasks, N templates, N docs de referência, N checklist**(s) de gate
- **Workflow `wf-<cycle>`:** intake → ... → gate
- Chaves de input das tasks **alinhadas** aos outputs upstream
- **Modelo [domínio]:** [decisão humana preservada / compliance / etc.]
- **Wiring:** `<module>` marcado como 🟢 ACTIVE em `apex-talent` (config/README/chief) e no README raiz

### Notas

- [Disclaimers sobre tabelas/percentuais que são referência a confirmar]
- Self-contained: `workspace_integration.level: none`; dados sensíveis não persistidos
```

PR como **draft** primeiro → esperar Gemini / outros bots → corrigir → tirar de draft → squash merge.

---

## Acceptance Criteria

Módulo está oficialmente ATIVO quando:

- ✅ `squads/<module>/` tem todos os 6 subdirs (`agents`, `tasks`, `templates`, `data`, `workflows`, `checklists`)
- ✅ `config.yaml` declara `status: ACTIVE` + `tier_structure` completa
- ✅ README sem banner `🟡`
- ✅ `apex-talent-chief.md` lista o módulo como 🟢 Ativo na tabela `*catalog` + tem entry em `delegate_targets`
- ✅ `apex-talent/README.md` tabela de módulos mostra 🟢
- ✅ Todos os YAMLs parseiam
- ✅ PR mergeado para `main`

---

## Anti-patterns observados

Evitar:

- ❌ Squad com 12+ agentes (muito complexo; Chief não consegue rotear bem)
- ❌ Tasks que duplicam capacidade de outro módulo (ex: `<module>/tasks/run-review.md` competindo com `performa/tasks/run-review.md`)
- ❌ Agentes Tier 1 sem heuristics específicas (= mais "wrapper" do que specialist)
- ❌ Workflows que não passam pelo gate Tier 3 quando o domínio é regulatório
- ❌ Esquecer de atualizar `apex-talent-chief.md` — o módulo fica "ativo" mas inacessível
- ❌ Schema flat de config (`name:` na raiz) sem o bloco `metadata:` + `tier_structure:` — descasa do pattern emergente

---

## Referências

Módulos ativos para clonar pattern:

- [`talent-compass`](../../talent-compass/) — flagship, mais maduro
- [`profiler-dna`](../../profiler-dna/) — transversal (comportamental)
- [`performa`](../../performa/) — most recent — referência mais atualizada do pattern (PR #58)

Módulos pendentes de ativação (ordem sugerida por dependência de lifecycle):

1. `onboard` — recebe handoff do talent-compass
2. `chronos` — controle de ponto, foundation para peopleops
3. `pulse` — clima, pode usar dados de performa
4. `org-architect` — cargos & salários, foundation para tudo
5. `academy` — desenvolvimento, usa gaps do performa
6. `benefits-hub` — benefícios
7. `insights` — analytics, consome dados de todos
