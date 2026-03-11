# Task: ralph-run

```yaml
id: ralph-run
version: "1.0.0"
title: "Executar Loop Autônomo Ralph"
description: >
  Executa o loop autônomo de desenvolvimento Ralph via scripts/ralph.sh.
  O loop instancia Claude Code iterativamente, implementando uma user story
  por vez até todas terem passes: true ou atingir o limite de iterações.
elicit: false
owner: ralph-chief
executor: ralph-chief
dependencies:
  - squads/ralph/scripts/ralph.sh
  - squads/ralph/CLAUDE.md
  - squads/ralph/prd.json
outputs:
  - Código implementado e commitado
  - squads/ralph/progress.txt atualizado
  - squads/ralph/prd.json com passes: true por story concluída
```

---

## Comando

### `*ralph-run` ou `*ralph-run --iterations {n}`

---

## Pré-requisitos

Antes de executar, verificar:

1. **prd.json existe** em `squads/ralph/prd.json`
   - Se não: executar `*ralph-prd` ou `*ralph-convert` primeiro
2. **Stories pendentes existem** (alguma story com `passes: false`)
   - Se não: run já está completo
3. **Branch do projeto** corresponde ao `branchName` no prd.json
   - Se não: checkout ou criar a branch antes

---

## Como Executar

### Via Script Shell (Recomendado)

```bash
# Executar com padrão (10 iterações, Claude Code)
bash squads/ralph/scripts/ralph.sh --tool claude

# Executar com limite personalizado
bash squads/ralph/scripts/ralph.sh --tool claude 5

# Verificar help
bash squads/ralph/scripts/ralph.sh --help
```

### Via Claude Code Diretamente (Modo Manual)

Se o usuário preferir não usar o script shell, Ralph pode executar manualmente:

1. Ler `squads/ralph/prd.json`
2. Ler `squads/ralph/progress.txt` (seção Codebase Patterns primeiro)
3. Verificar que está na branch correta (`branchName` do prd.json)
4. Selecionar a story com maior prioridade onde `passes: false`
5. Implementar a story
6. Executar quality checks (typecheck, lint, teste)
7. Se passar: commit com `feat: [Story ID] - [Story Title]`
8. Atualizar `prd.json` — setar `passes: true` na story concluída
9. Atualizar `progress.txt` com progresso e learnings
10. Verificar se todas as stories estão com `passes: true`
    - Se sim: sinalizar COMPLETE
    - Se não: continuar para próxima iteração

---

## Fluxo do Loop

```
┌─────────────────────────────────────────────┐
│              RALPH LOOP                     │
│                                             │
│  1. Ler prd.json                            │
│  2. Ler progress.txt (patterns first)       │
│  3. Checkout branch correta                 │
│  4. Selecionar story mais prioritária       │
│     (passes: false)                         │
│  5. Implementar story                       │
│  6. Rodar quality checks                    │
│     ├── typecheck ✓                         │
│     ├── lint ✓                              │
│     └── testes ✓                            │
│  7. Commit: feat: US-00X - Título           │
│  8. Atualizar prd.json (passes: true)       │
│  9. Atualizar progress.txt                  │
│  10. Todas stories done?                    │
│      ├── SIM → <promise>COMPLETE</promise>  │
│      └── NÃO → próxima iteração             │
└─────────────────────────────────────────────┘
```

---

## Formato do Relatório de Progresso

Sempre ANEXAR ao progress.txt (nunca substituir):

```
## [Data/Hora] - [Story ID]
- O que foi implementado
- Arquivos modificados
- **Learnings para iterações futuras:**
  - Padrões descobertos (ex: "esse codebase usa X para Y")
  - Gotchas encontrados (ex: "não esquecer de atualizar Z ao mudar W")
  - Contexto útil (ex: "o painel de avaliação está no componente X")
---
```

### Consolidar Padrões

Se descobrir um **padrão reutilizável** que iterações futuras devem saber, adicionar na seção `## Codebase Patterns` no TOPO do progress.txt:

```
## Codebase Patterns
- Exemplo: Usar template `sql<number>` para agregações
- Exemplo: Sempre usar `IF NOT EXISTS` para migrations
- Exemplo: Exportar types de actions.ts para componentes UI
```

---

## Sinais de Conclusão

O loop termina quando:
- Todas as stories têm `passes: true` → sinalizar `<promise>COMPLETE</promise>`
- Limite de iterações atingido → verificar progress.txt para status
- Erro irrecuperável → registrar em progress.txt e alertar usuário

---

## Integração AIOX — Handoffs Pós-Conclusão

Após conclusão bem-sucedida do loop:

### Para features com frontend (handoff para @apex):
```
Todas as stories implementadas.
Sugiro revisão visual com @apex antes de fazer push.
Execute: @apex *apex-review
```

### Para deploy (handoff para @devops):
```
Todas as stories implementadas e commitadas.
Execute: @devops *push para criar PR e fazer deploy.
```

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| prd.json não encontrado | Executar *ralph-convert primeiro |
| Branch errada | Fazer checkout do branchName do prd.json |
| Typecheck falha | Verificar erros e corrigir antes de próxima iteração |
| Story muito grande | Dividir em sub-stories menores no prd.json |
| Loop infinito sem progresso | Verificar progress.txt para padrão de falha |
