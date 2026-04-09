# Skill: validate-squad

Valida que um squad AIOX segue a estrutura obrigatoria e as convencoes do projeto.

## Uso
```
/validate-squad [nome-do-squad]
```
Se nenhum nome for fornecido, valida todos os squads em `squads/`.

## Instrucoes

Quando o usuario invocar este skill:

1. **Verificar estrutura de diretorios obrigatoria**:
   - `squads/<nome>/README.md` (OBRIGATORIO)
   - `squads/<nome>/config.yaml` ou `config.yml` (RECOMENDADO)
   - `squads/<nome>/agents/` (RECOMENDADO)
   - `squads/<nome>/tasks/` (OPCIONAL)
   - `squads/<nome>/templates/` (OPCIONAL)
   - `squads/<nome>/data/` (OPCIONAL)
   - `squads/<nome>/workflows/` (OPCIONAL)

2. **Validar config.yaml** (se existir):
   - Deve ter campos: `squad.name`, `squad.version`, `squad.description`
   - Deve listar agentes com tiers
   - Deve listar tasks

3. **Validar agentes** (arquivos `.md` em `agents/`):
   - Cada agente deve ter secoes: `agent`, `persona`, `heuristics`
   - Campo `agent.tier` deve ser 0-3
   - Deve haver pelo menos 1 agente Tier 0 (orchestrator)

4. **Validar convencoes de linguagem**:
   - README.md em portugues brasileiro
   - Nomes de arquivos e variaveis em ingles
   - Comentarios em ingles

5. **Reportar resultado**:
   - Lista de verificacoes com status PASS/FAIL/WARN
   - Contagem total de agentes, tasks, templates
   - Sugestoes de melhoria

## Referencia
- Workflow CI: `.github/workflows/validate-squads.yml`
- CLAUDE.md: convencoes do projeto
