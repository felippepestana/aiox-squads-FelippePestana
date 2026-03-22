# Squad Creator — Meta-Squad for Building AIOX Squads

## Single Entry Point

```
@squad-chief *create-squad {domínio}
```

Cria squads de alta qualidade baseados em **elite minds reais** — pessoas com frameworks documentados e skin in the game. Workflow guiado de 6 fases com validação automática.

---

## Workflow de 6 Fases

```
Phase 1          Phase 2          Phase 3          Phase 4          Phase 5          Phase 6
Detect Type  →   Elicit Domain →  Load Templates → Propose Arch  → Create Squad  → Validate
(squad vs      (expert names,    (agent-v3,        (tier structure,  (agents,          (*validate-squad
 agent vs        frameworks,       task-v3,          agent count,      tasks,            score ≥ 7.0)
 task)           tools)            workflow)         commands)         workflows)
```

## Comandos

| Comando | O que faz |
|---------|-----------|
| `*create-squad {domínio}` | Criar squad completo (6 fases guiadas) |
| `*create-agent {expert}` | Criar agente individual com DNA extraction |
| `*create-task {nome}` | Criar task individual |
| `*validate-squad {nome}` | Validar squad (score ≥ 7.0 = DEVELOPING) |
| `*discover-tools {domínio}` | Deep tool discovery (5 sub-agents paralelos) |
| `*extract-sop {transcript}` | Extrair SOPs de transcrições |
| `*download-squad {nome}` | Instalar squad no projeto AIOX atual |
| `*refresh-registry` | Atualizar registro de squads |

## Modos de Criação

### Base Mode (padrão)
- 1 agente (`@squad-chief`), 24 tasks
- Template-driven — você responde 3 perguntas, ele cria
- Fidelidade: 60-75%

### Pro Mode (com squad-creator-pro instalado)
- Auto-detectado quando `squads/squad-creator-pro/` existe
- Adiciona 3 especialistas: `@oalanicolas`, `@pedro-valerio`, `@thiago_finch`
- Mind cloning com Voice DNA + Thinking DNA
- Fidelidade: 85-95%

## Qualidade e Validação

| Score | Nível | Ação |
|-------|-------|------|
| < 7.0 | 🔴 DRAFT | Requer refinamento antes de PR |
| 7.0-8.9 | 🟡 DEVELOPING | Pronto para PR na comunidade |
| ≥ 9.0 | 🟢 OPERATIONAL | Testado em produção |

**Smoke tests:** 3 testes comportamentais obrigatórios por squad

## Discovery de Ferramentas (5 Sub-Agents Paralelos)

```
*discover-tools {domínio}
├── MCP Agent — Model Context Protocol tools
├── API Agent — REST APIs e SDKs
├── CLI Agent — Command-line tools
├── Library Agent — npm, pip, cargo packages
└── GitHub Agent — open-source tools e repos
```

---

*Squad Creator v4.0.0 — Building squads from elite minds*
