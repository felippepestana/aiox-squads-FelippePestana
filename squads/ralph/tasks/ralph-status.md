# Task: ralph-status

```yaml
id: ralph-status
version: "1.0.0"
title: "Status do Ralph — PRD e Progresso"
description: >
  Exibe o status atual do prd.json e progress.txt. Mostra quais stories
  foram completadas, quais estão pendentes e os últimos learnings registrados.
elicit: false
owner: ralph-chief
executor: ralph-chief
dependencies:
  - squads/ralph/prd.json
  - squads/ralph/progress.txt
outputs:
  - Relatório de status formatado para o usuário
```

---

## Comando

### `*ralph-status`

---

## O Que Mostrar

### 1. Status do PRD

Se `squads/ralph/prd.json` existe:

```
📋 PRD: {project} — {description}
🌿 Branch: {branchName}

Stories:
| ID      | Título                    | Prioridade | Status |
|---------|---------------------------|------------|--------|
| US-001  | Add priority field to DB  | 1          | ✅ DONE |
| US-002  | Display priority badge    | 2          | ⏳ PENDING |
| US-003  | Add priority selector     | 3          | ⏳ PENDING |
| US-004  | Filter tasks by priority  | 4          | ⏳ PENDING |

Progresso: 1/4 stories concluídas (25%)
```

Se `squads/ralph/prd.json` não existe:
```
⚠️ prd.json não encontrado.
Execute *ralph-prd para criar um PRD ou *ralph-convert para converter um PRD existente.
```

### 2. Status do Progress Log

Se `squads/ralph/progress.txt` existe, mostrar:
- Número de iterações registradas
- Última iteração: story ID + data/hora
- Codebase Patterns descobertos (se houver)

### 3. Runs Arquivados

Se `squads/ralph/archive/` tem subpastas:
```
📦 Runs arquivados:
- 2026-03-10-task-priority (4 stories)
- 2026-02-28-user-auth (6 stories)
```

### 4. Próximo Passo Sugerido

Baseado no estado atual:

| Situação | Sugestão |
|----------|----------|
| Nenhum prd.json | `*ralph-prd` ou `*ralph-convert` |
| prd.json com stories pendentes | `*ralph-run` |
| Todas as stories concluídas | `@devops *push` para criar PR |
| Loop em execução | Aguardar conclusão ou verificar logs |

---

## Formato Completo de Saída

```
🔄 RALPH STATUS — [timestamp]
═══════════════════════════════════════

📋 PRD: {project}
   Feature: {description}
   Branch: {branchName}

   Stories ({done}/{total} concluídas):
   ✅ US-001 — {title} [P1]
   ⏳ US-002 — {title} [P2]
   ⏳ US-003 — {title} [P3]

📝 Progress Log:
   Última atualização: {timestamp}
   Iterações: {count}
   Último: {last_story_id} — {last_story_title}

   Codebase Patterns:
   {patterns if any}

📦 Arquivo: {count} runs anteriores

💡 Próximo passo: {suggestion}
```
