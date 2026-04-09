# Skill: create-squad

Cria um novo squad AIOX seguindo a anatomia padrao de 6 camadas.

## Uso
```
/create-squad <nome-do-squad>
```

## Instrucoes

Quando o usuario invocar este skill com um nome de squad:

1. **Criar estrutura de diretorios**:
   ```
   squads/<nome>/
   ├── agents/
   ├── tasks/
   ├── templates/
   ├── data/
   ├── workflows/
   ├── config.yaml
   └── README.md
   ```

2. **Gerar config.yaml** com a estrutura padrao:
   ```yaml
   squad:
     name: <nome>
     version: "1.0.0"
     description: "<descricao baseada no nome>"
   agents:
     orchestrator: []
     tier_1: []
     tier_2: []
     tier_3: []
   tasks: []
   workflows: []
   templates: []
   ```

3. **Gerar README.md** em portugues brasileiro seguindo o padrao dos squads existentes. Consultar `squads/education/README.md` ou `squads/apex/README.md` como referencia.

4. **Criar agente Chief (Tier 0)** no arquivo `agents/<nome>-chief.md` com a estrutura:
   ```yaml
   agent:
     name: <Nome> Chief
     id: <nome>-chief
     tier: 0
     role: orchestrator
   persona:
     expertise: [listar areas]
     communication_style: directive
   voice_dna:
     vocabulary: []
     sentence_patterns: []
     anti_patterns: []
   heuristics: []
   examples: []
   handoffs: []
   ```

5. **Validar** que a estrutura segue os padroes do projeto consultando `squads/squad-creator/` para referencia.

6. **Reportar** o que foi criado ao usuario.

## Referencia
- Squad Creator: `squads/squad-creator/`
- Squad Creator Pro: `squads/squad-creator-pro/`
- Anatomia: CLAUDE.md secao "Estrutura de Squads"
