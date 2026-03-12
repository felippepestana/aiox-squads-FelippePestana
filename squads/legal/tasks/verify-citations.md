# verify-citations

> **Task:** Verificar e classificar todas as citações jurisprudenciais de uma peça
> **Squad:** legal | **Agent:** processual-writer
> **Gatilho automático:** Executar ANTES de qualquer citação ser entregue ao usuário

---

## Task Definition

```yaml
task:
  name: verify-citations
  description: >
    Varre todas as citações jurisprudenciais presentes ou a serem inseridas
    numa peça processual, classifica cada campo por origem (CONFIRMADO /
    NÃO CONFIRMADO / AUSENTE), aplica o jurisprudence-gate.md e formata
    a saída com marcadores apropriados.
  trigger:
    - Automático ao executar *redigir (sempre que houver citação)
    - Automático ao executar *citar
    - Automático ao executar *formatar (se o texto contiver citações)
    - Manual: *verificar-citacoes {texto}
  inputs:
    - text_with_citations: string (peça ou trecho contendo citações a verificar)
    - user_provided_data: dict (dados de julgados explicitamente fornecidos pelo usuário)
  outputs:
    - verified_citations: list (citações com classificação e marcadores)
    - gate_report: dict (resultado do jurisprudence-gate.md por citação)
    - action_required: list (itens que o usuário precisa confirmar/preencher)
  dependencies:
    - squads/legal/checklists/jurisprudence-gate.md  [CARREGAR ANTES DE EXECUTAR]
    - squads/legal/data/citation-integrity-protocol.md [CARREGAR ANTES DE EXECUTAR]
```

---

## Protocolo de Execução

### PRÉ-REQUISITO OBRIGATÓRIO

```
ANTES de executar qualquer etapa desta task:
1. Carregar: squads/legal/checklists/jurisprudence-gate.md
2. Carregar: squads/legal/data/citation-integrity-protocol.md
3. Confirmar que ambos foram lidos na íntegra
4. Somente então prosseguir para o Passo 1

⚠️ FALHA NO CARREGAMENTO = NÃO EXECUTAR A TASK
```

---

### PASSO 1 — Identificar e Inventariar Citações

**Ação:**
Varrer o texto e identificar toda referência a julgados, acórdãos, súmulas, teses e enunciados. Listar cada uma numerada.

**Tipos de referência a identificar:**
- Referência completa: `(STJ, 3ª Turma, REsp nº ..., Rel. ..., j. ..., DJe ...)`
- Referência parcial: `(STJ, REsp nº ...)` ou `(TJSP, j. 15.03.2023)`
- Referência apenas por nome/tema: `"o STJ entende que..."` sem número
- Súmula: `Súmula nº 385 do STJ`
- Tese repetitiva: `Tese fixada no Tema 1047 do STJ`
- Enunciado: `Enunciado nº 550 da VI Jornada de Direito Civil`

**Output do Passo 1:**
```yaml
citacoes_identificadas:
  - id: C1
    tipo: referencia_completa | parcial | tema | sumula | tese | enunciado
    texto_original: "{trecho como aparece no texto}"
    campos_presentes: [lista de campos identificados]
    campos_ausentes: [lista de campos não encontrados]
```

---

### PASSO 2 — Classificar a Origem de Cada Campo

Para cada citação identificada no Passo 1, classificar CADA campo segundo o sistema de três níveis:

**Classificação:**

| Nível | Código | Definição |
|-------|--------|-----------|
| 🟢 | CONFIRMADO | Campo fornecido literalmente pelo usuário nesta conversa ou em documento anexado |
| 🟡 | NAO_CONFIRMADO | Campo inferido do conhecimento de treinamento da IA — não fornecido pelo usuário |
| 🔴 | AUSENTE | Campo não presente e sem base para inferência |

**Regra de ouro para classificar:**
> "Eu, agente, consigo apontar exatamente a mensagem do usuário ou o trecho do documento onde este valor aparece?"
> - Sim → 🟢 CONFIRMADO
> - Não, mas reconheço o caso pelo treinamento → 🟡 NAO_CONFIRMADO
> - Não, e não tenho base para inferir → 🔴 AUSENTE

**Output do Passo 2:**
```yaml
classificacao:
  C1:
    tribunal:         CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    orgao:            CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    tipo:             CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    numero:           CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    uf_origem:        CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    relator:          CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    data_julgamento:  CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    diario:           CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    data_publicacao:  CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    ementa_trecho:    CONFIRMADO | NAO_CONFIRMADO | AUSENTE
    ementa_eh_literal: true | false  # true apenas se copiado do original
```

---

### PASSO 3 — Executar o Jurisprudence Gate

Para cada citação, executar os 5 grupos do `jurisprudence-gate.md`:

```
Para cada citação (C1, C2, ...):
  → Executar Grupo 1 (Origem dos Dados)
  → Executar Grupo 2 (Completude)
  → Executar Grupo 3 (Consistência)
  → Executar Grupo 4 (Autenticidade da Ementa)
  → Executar Grupo 5 (Aviso ao Usuário)
  → Determinar resultado: LIBERADA | LIBERADA COM RESSALVAS | BLOQUEADA
```

**Output do Passo 3:**
```yaml
gate_results:
  C1:
    g1_resultado: PASS | BLOCK | VERIFICAR
    g2_resultado: PASS | BLOCK | VERIFICAR
    g3_resultado: PASS | BLOCK | VERIFICAR
    g4_resultado: PASS | BLOCK | VERIFICAR
    g5_resultado: PASS | BLOCK | VERIFICAR
    resultado_final: LIBERADA | LIBERADA_COM_RESSALVAS | BLOQUEADA
    itens_block: [lista de itens que causaram BLOCK]
    itens_verificar: [lista de itens que causaram VERIFICAR]
```

---

### PASSO 4 — Aplicar Marcadores e Reformatar

Reformatar cada citação conforme o resultado do gate:

#### Para citações LIBERADAS (todos PASS):

```markdown
> *"Trecho literal da ementa."*
>
> (Tribunal, Órgão, Tipo nº Número/UF, Rel. Nome Relator,
> j. DD.MM.AAAA, Diário DD.MM.AAAA)
```
*Nenhum marcador adicional. Nenhum aviso.*

---

#### Para citações LIBERADAS COM RESSALVAS (algum VERIFICAR):

Substituir cada campo `NAO_CONFIRMADO` por:
```
⚠️ VERIFICAR: {valor inferido} — confirmar em {URL do tribunal}
```

Exemplo de campo não confirmado:
```markdown
> *"Trecho literal da ementa."*
>
> (STJ, 3ª Turma, REsp nº ⚠️ VERIFICAR: 1.234.567 — confirmar em scon.stj.jus.br/SP,
> Rel. ⚠️ VERIFICAR: Min. Nancy Andrighi — confirmar relator,
> j. ⚠️ VERIFICAR: 15.03.2023, DJe ⚠️ VERIFICAR: 20.03.2023)

⚠️ ATENÇÃO: Esta citação contém campos não confirmados (marcados acima).
VERIFIQUE todos os dados marcados antes de protocolar a peça.
Fonte oficial: https://scon.stj.jus.br/SCON/
```

---

#### Para citações BLOQUEADAS (algum BLOCK):

Substituir cada campo `AUSENTE` ou inválido por `[INSERIR: {campo}]`.
Substituir ementa não literal (entre aspas) por `[INSERIR: trecho literal da ementa]`.

```markdown
> *"[INSERIR: trecho literal da ementa — buscar no repositório do tribunal]"*
>
> ([INSERIR: tribunal], [INSERIR: órgão julgador],
> [INSERIR: tipo] nº [INSERIR: número]/[INSERIR: UF],
> Rel. [INSERIR: nome do relator],
> j. [INSERIR: data de julgamento], [INSERIR: diário] [INSERIR: data de publicação])

⚠️ ATENÇÃO: Esta citação está incompleta. Preencha todos os campos [INSERIR]
com os dados reais do julgado antes de protocolar a peça.
```

---

#### Para ementa parafraseada (não literal) com aspas — BLOCK G4.2:

**Nunca entregar paráfrase com aspas como se fosse texto literal.**

Converter para:
```markdown
Nesse sentido é o entendimento do {Tribunal}: {paráfrase sem aspas}.
[⚠️ VERIFICAR: buscar ementa original em {URL} para incluir trecho literal]
```

---

### PASSO 5 — Tratar o Caso "Sem Julgado Específico"

Se o usuário solicitou citação sobre um tema **sem fornecer nenhum caso específico**:

**Ação obrigatória — apresentar as 3 opções antes de gerar qualquer dado:**

```
Para incluir jurisprudência sobre "{tema}", preciso de um julgado específico.
Posso:

(a) **Formatar um julgado que você me forneça** — informe tribunal, número,
    relator, data e o trecho da ementa que deseja citar.

(b) **Sugerir julgados que conheço** — com TODOS os dados marcados como
    ⚠️ VERIFICAR para que você confirme antes de protocolar.

(c) **Inserir bloco de placeholder** — estrutura completa com [INSERIR] em
    todos os campos para você preencher após pesquisa nas fontes oficiais.

Qual prefere? (a), (b) ou (c)?
```

**PROIBIDO:** Gerar diretamente uma citação com número, relator e data sem que o usuário tenha escolhido a opção (b) ou fornecido os dados.

---

### PASSO 6 — Gerar Relatório de Verificação

Ao final da execução, incluir no output:

```markdown
## Relatório de Verificação de Citações

| Citação | Resultado | Campos VERIFICAR | Campos [INSERIR] |
|---------|-----------|------------------|------------------|
| C1: {identificação resumida} | ✅ LIBERADA / ⚠️ COM RESSALVAS / 🚫 BLOQUEADA | {lista} | {lista} |
| C2: ... | ... | ... | ... |

### Ações Necessárias Antes do Protocolo
{lista numerada de campos que o usuário precisa verificar/preencher}

### Fontes de Verificação
{lista de URLs por tribunal, conforme citation-integrity-protocol.md}
```

---

## Casos Especiais

### Súmulas

Súmulas têm número e tribunal definidos, mas o enunciado precisa ser verificado:

```yaml
sumula_protocol:
  numero: fornecido pelo usuário → CONFIRMADO
  tribunal: fornecido pelo usuário → CONFIRMADO
  enunciado:
    - se fornecido literalmente → CONFIRMADO
    - se inferido do treinamento → NAO_CONFIRMADO → ⚠️ VERIFICAR
  formato_saída: "Súmula nº {número} do {Tribunal}: ⚠️ VERIFICAR: {enunciado inferido}"
```

### Temas Repetitivos (STJ/STF)

```yaml
tema_protocol:
  numero_tema: fornecido → CONFIRMADO
  tribunal: fornecido → CONFIRMADO
  tese_fixada:
    - se fornecida literalmente → CONFIRMADO
    - se inferida → NAO_CONFIRMADO → ⚠️ VERIFICAR
  formato_saída: |
    Conforme tese fixada no Tema nº {número} do {Tribunal}:
    ⚠️ VERIFICAR: "{tese inferida — confirmar na fonte oficial}"
```

### Enunciados de Jornada

```yaml
enunciado_protocol:
  numero: fornecido → CONFIRMADO
  jornada: fornecida → CONFIRMADO
  texto:
    - se fornecido literalmente → CONFIRMADO
    - se inferido → ⚠️ VERIFICAR
```

---

## Quality Gates da Task

```yaml
quality_gates:
  - BLOCK_IF: alguma citação tem campo gerado pela IA sem marcador ⚠️ VERIFICAR ou [INSERIR]
  - BLOCK_IF: ementa parafraseada está entre aspas sem nota de que é paráfrase
  - BLOCK_IF: número de processo ausente e campo não foi substituído por [INSERIR]
  - BLOCK_IF: relator ausente e campo não foi substituído por [INSERIR]
  - BLOCK_IF: data de julgamento ausente e campo não foi substituído por [INSERIR]
  - BLOCK_IF: citação com BLOCK no gate foi incluída na peça sem resolução
  - BLOCK_IF: jurisprudence-gate.md não foi carregado antes da execução
  - BLOCK_IF: citation-integrity-protocol.md não foi carregado antes da execução
  - WARN_IF: citação não tem URL de verificação sugerida
  - WARN_IF: usuário solicitou citação sobre tema sem julgado específico e a task não apresentou as 3 opções
```
