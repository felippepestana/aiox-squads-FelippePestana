# Task: ralph-archive

```yaml
id: ralph-archive
version: "1.0.0"
title: "Arquivar Run Atual e Resetar"
description: >
  Arquiva o prd.json e progress.txt atuais, criando um snapshot histórico
  do run anterior. Prepara o estado para uma nova feature.
elicit: true
owner: ralph-chief
executor: ralph-chief
outputs:
  - squads/ralph/archive/{date}-{feature}/ (snapshot arquivado)
  - squads/ralph/progress.txt (resetado com header limpo)
```

---

## Comando

### `*ralph-archive`

---

## Quando Usar

- Antes de criar um PRD para uma nova feature diferente da atual
- Para preservar histórico de um run concluído antes de iniciar outro
- Ao trocar de feature sem concluir a atual (snapshot do progresso)

---

## O Que Fazer

### Passo 1: Verificar Estado Atual

Ler `squads/ralph/prd.json` se existir:
- Capturar `branchName` e `project`
- Verificar quantas stories estão `passes: true` vs `passes: false`
- Ler `squads/ralph/progress.txt` para confirmar que há conteúdo além do header

### Passo 2: Confirmar com o Usuário

```
📦 Arquivando run atual:
   Projeto: {project}
   Branch: {branchName}
   Stories: {done}/{total} concluídas

   Isso irá preservar prd.json e progress.txt em:
   squads/ralph/archive/{YYYY-MM-DD}-{feature-name}/

   O progress.txt será resetado para o próximo run.
   Confirma? (sim/não)
```

### Passo 3: Executar Arquivo

1. Criar diretório: `squads/ralph/archive/YYYY-MM-DD-{feature-name}/`
   - `feature-name` derivado do `branchName` (removendo prefixo `ralph/`)
2. Copiar `squads/ralph/prd.json` → `squads/ralph/archive/{pasta}/prd.json`
3. Copiar `squads/ralph/progress.txt` → `squads/ralph/archive/{pasta}/progress.txt`
4. Resetar `squads/ralph/progress.txt`:
   ```
   # Ralph Progress Log
   Started: {datetime}
   ---
   ```

### Passo 4: Confirmar

```
✅ Run arquivado em: squads/ralph/archive/{pasta}/
   progress.txt resetado para novo run.

💡 Próximo passo: *ralph-prd ou *ralph-convert para nova feature.
```

---

## Estrutura de Archive

```
squads/ralph/archive/
├── 2026-03-10-task-priority/
│   ├── prd.json
│   └── progress.txt
├── 2026-02-28-user-auth/
│   ├── prd.json
│   └── progress.txt
└── ...
```

---

## Notas

- O prd.json original NÃO é deletado automaticamente — apenas copiado
- O usuário pode deletar o prd.json manualmente após o arquivo se quiser
- O script `ralph.sh` faz arquivamento automático quando detecta mudança de branch
