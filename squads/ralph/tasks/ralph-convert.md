# Task: ralph-convert

```yaml
id: ralph-convert
version: "1.0.0"
title: "Converter PRD para prd.json"
description: >
  Converte um PRD existente (arquivo markdown ou texto) para o formato prd.json
  que o Ralph usa para execução autônoma. Equivalente à skill /ralph do snarktank/ralph.
elicit: true
owner: ralph-chief
executor: ralph-chief
outputs:
  - squads/ralph/prd.json
```

---

## Comando

### `*ralph-convert`

---

## O Trabalho

Pegar um PRD (arquivo markdown ou texto) e converter para `squads/ralph/prd.json`.

---

## Formato de Output

```json
{
  "project": "[Nome do Projeto]",
  "branchName": "ralph/[feature-name-kebab-case]",
  "description": "[Descrição da feature do título/intro do PRD]",
  "userStories": [
    {
      "id": "US-001",
      "title": "[Título da Story]",
      "description": "Como [usuário], quero [feature] para que [benefício]",
      "acceptanceCriteria": [
        "Critério 1",
        "Critério 2",
        "Typecheck passa"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

---

## Regra #1: Tamanho de Story

**Cada story deve ser completável em UMA iteração Ralph (um context window).**

### Stories bem dimensionadas:
- Adicionar uma coluna e migration ao banco
- Adicionar um componente de UI a uma página existente
- Atualizar uma server action com nova lógica
- Adicionar filtro dropdown a uma lista

### Muito grandes (dividir):
- "Construir o dashboard inteiro" → schema, queries, componentes UI, filtros
- "Adicionar autenticação" → schema, middleware, login UI, sessão
- "Refatorar a API" → uma story por endpoint ou padrão

**Regra prática:** Se não der para descrever a mudança em 2-3 frases, é grande demais.

---

## Ordenação: Dependências Primeiro

Stories executam em ordem de prioridade. Stories anteriores NÃO podem depender de posteriores.

**Ordem correta:**
1. Mudanças de schema/banco (migrations)
2. Server actions / lógica backend
3. Componentes de UI que usam o backend
4. Views de dashboard/sumário

---

## Critérios de Aceite: Devem Ser Verificáveis

### Bons critérios (verificáveis):
- "Adicionar coluna `status` na tabela tasks com default 'pending'"
- "Filtro dropdown tem opções: Todos, Ativo, Concluído"
- "Clicar em deletar mostra diálogo de confirmação"
- "Typecheck passa"
- "Testes passam"

### Ruins (vagos):
- "Funciona corretamente"
- "Usuário consegue fazer X facilmente"
- "Boa UX"

### Sempre incluir como critério final:
```
"Typecheck passa"
```

### Para stories com lógica testável:
```
"Testes passam"
```

### Para stories que mudam UI:
```
"Verificar no browser usando skill dev-browser"
```

---

## Regras de Conversão

1. **Cada user story vira uma entrada JSON**
2. **IDs**: Sequenciais (US-001, US-002, etc.)
3. **Priority**: Baseado na ordem de dependência, depois ordem no documento
4. **Todas as stories**: `passes: false` e `notes` vazio
5. **branchName**: Derivado do nome da feature, kebab-case, prefixado com `ralph/`
6. **Sempre adicionar**: "Typecheck passa" nos critérios de aceite de cada story

---

## Arquivamento de Runs Anteriores

**Antes de escrever um novo prd.json, verificar se existe um anterior:**

1. Ler o `prd.json` atual se existir
2. Verificar se o `branchName` difere da nova feature
3. Se diferente E `progress.txt` tem conteúdo além do header:
   - Criar pasta de arquivo: `squads/ralph/archive/YYYY-MM-DD-feature-name/`
   - Copiar `prd.json` e `progress.txt` atuais para o arquivo
   - Resetar `progress.txt` com header limpo

**O script ralph.sh faz isso automaticamente** ao ser executado, mas se você atualizar prd.json manualmente entre runs, archive primeiro.

---

## Checklist Antes de Salvar

- [ ] **Run anterior arquivado** (se prd.json existe com branchName diferente)
- [ ] Cada story é completável em uma iteração (pequena o suficiente)
- [ ] Stories ordenadas por dependência (schema → backend → UI)
- [ ] Toda story tem "Typecheck passa" como critério
- [ ] Stories com UI têm "Verificar no browser" como critério
- [ ] Critérios de aceite são verificáveis (não vagos)
- [ ] Nenhuma story depende de uma story posterior
