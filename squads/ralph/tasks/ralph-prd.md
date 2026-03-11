# Task: ralph-prd

```yaml
id: ralph-prd
version: "1.0.0"
title: "Gerar PRD para Ralph"
description: >
  Cria um Product Requirements Document (PRD) estruturado para uma feature,
  com user stories pequenas e verificáveis prontas para execução autônoma pelo Ralph.
  Equivalente à skill /prd do snarktank/ralph, adaptada para AIOX.
elicit: true
owner: ralph-chief
executor: ralph-chief
outputs:
  - tasks/prd-{feature-name}.md
```

---

## Comando

### `*ralph-prd {descrição da feature}`

---

## O Trabalho

1. Receber descrição da feature do usuário
2. Fazer 3-5 perguntas de clarificação essenciais (com opções por letra)
3. Gerar PRD estruturado com user stories pequenas e verificáveis
4. Salvar em `tasks/prd-{feature-name}.md`

**Importante:** NÃO comece a implementar. Apenas crie o PRD.

---

## Passo 1: Perguntas de Clarificação

Faça apenas perguntas críticas onde o prompt inicial é ambíguo. Foque em:

- **Problema/Objetivo:** Que problema isso resolve?
- **Funcionalidade Core:** Quais são as ações principais?
- **Escopo/Limites:** O que NÃO deve fazer?
- **Critérios de Sucesso:** Como saberemos que está pronto?

### Formato das Perguntas:

```
1. Qual é o objetivo principal dessa feature?
   A. Melhorar experiência do usuário
   B. Aumentar retenção
   C. Reduzir carga de suporte
   D. Outro: [especifique]

2. Quem é o usuário-alvo?
   A. Apenas novos usuários
   B. Apenas usuários existentes
   C. Todos os usuários
   D. Apenas admins
```

O usuário pode responder com "1A, 2C" para iteração rápida.

---

## Passo 2: Estrutura do PRD

### 1. Introdução/Visão Geral
Breve descrição da feature e o problema que resolve.

### 2. Objetivos
Objetivos específicos e mensuráveis (lista com bullets).

### 3. User Stories

Cada story precisa:
- **Título:** Nome descritivo curto
- **Descrição:** "Como [usuário], quero [feature] para que [benefício]"
- **Critérios de Aceite:** Checklist verificável do que significa "pronto"

**Tamanho certo de story:**
- Adicionar uma coluna ao banco de dados
- Criar um componente de UI em uma página existente
- Atualizar uma server action com nova lógica
- Adicionar um filtro dropdown a uma lista

**Muito grande (dividir):**
- "Construir o dashboard inteiro" → dividir em: schema, queries, componentes, filtros
- "Adicionar autenticação" → dividir em: schema, middleware, login UI, sessão

**Formato:**
```markdown
### US-001: [Título]
**Descrição:** Como [usuário], quero [feature] para que [benefício].

**Critérios de Aceite:**
- [ ] Critério específico e verificável
- [ ] Outro critério
- [ ] Typecheck passa
- [ ] [Apenas stories com UI] Verificar no browser usando skill dev-browser
```

### 4. Requisitos Funcionais
Lista numerada de funcionalidades específicas:
- "RF-1: O sistema deve permitir que usuários..."
- "RF-2: Quando o usuário clicar em X, o sistema deve..."

### 5. Fora de Escopo (Non-Goals)
O que esta feature NÃO incluirá.

### 6. Considerações Técnicas (Opcional)
- Restrições ou dependências conhecidas
- Pontos de integração com sistemas existentes

### 7. Métricas de Sucesso
Como o sucesso será medido?

---

## Regras para Stories do Ralph

**Stories devem ser completáveis em UMA iteração (um context window).**

Ralph instancia um Claude Code fresco por iteração sem memória de trabalhos anteriores.
Se uma story for grande demais, o LLM esgota o contexto antes de terminar e produz código quebrado.

**Ordenação por dependências:**
1. Mudanças de schema/banco de dados (migrations)
2. Server actions / lógica backend
3. Componentes de UI que usam o backend
4. Views de dashboard/sumário que agregam dados

**Critérios de aceite verificáveis:**
- BONS: "Adicionar coluna `status` na tabela tasks com default 'pending'"
- RUINS: "Funciona corretamente", "Boa UX"
- SEMPRE incluir: "Typecheck passa"
- Para stories com testes: "Testes passam"
- Para stories com UI: "Verificar no browser usando skill dev-browser"

---

## Output

- **Formato:** Markdown (`.md`)
- **Local:** `tasks/`
- **Nome:** `prd-{feature-name}.md` (kebab-case)

---

## Checklist Antes de Salvar

- [ ] Fez perguntas de clarificação com opções por letra
- [ ] Incorporou respostas do usuário
- [ ] Stories são pequenas e específicas (implementáveis em 1 iteração)
- [ ] Stories ordenadas por dependência (schema → backend → UI)
- [ ] Todo story tem "Typecheck passa" como critério
- [ ] Stories com UI têm "Verificar no browser" como critério
- [ ] Critérios de aceite são verificáveis (não vagos)
- [ ] Salvo em `tasks/prd-{feature-name}.md`
