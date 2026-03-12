# Protocolo de Integridade de Citações Jurisprudenciais

> **Squad:** legal
> **Versão:** 1.0.0
> **Tipo:** data — protocolo permanente
> **Status:** ATIVO — aplicar em TODA citação jurisprudencial gerada

---

## Por que este protocolo existe

Protocolar uma peça processual com citação de julgado fabricada ou incorreta constitui falta ética grave e pode configurar:

- **Induzimento do magistrado a erro** — a parte adversa e o juiz podem verificar o julgado e não encontrá-lo, comprometendo a credibilidade de toda a argumentação;
- **Violação ao Código de Ética e Disciplina da OAB** (arts. 2º e 34, inciso XIV) — uso de meios fraudulentos na defesa dos interesses do cliente;
- **Potencial nulidade do ato** — em casos extremos, o vício na fundamentação pode ser arguido como cerceamento ao contraditório.

**A IA não tem acesso a bancos de dados jurisprudenciais em tempo real.** Todo dado de julgado que não seja literalmente fornecido pelo usuário é uma inferência — e inferências sobre julgados NUNCA devem ser convertidas em afirmações.

---

## Definições

### Campos obrigatórios de um julgado

Para que uma citação seja considerada **completa e utilizável**, todos os campos abaixo devem estar presentes com fonte confirmada:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `tribunal` | Sigla do tribunal de origem | STJ, TJSP, TST, STF |
| `orgao` | Turma, câmara ou seção que julgou | 3ª Turma, 2ª Câmara de Direito Privado |
| `tipo` | Classe processual do recurso/ação | REsp, AgInt, AREsp, AC, RO, ARE |
| `numero` | Número completo do processo | 1.234.567 ou 1234567 |
| `uf_origem` | UF de onde veio o recurso | SP, RJ, MG |
| `relator` | Nome completo do relator | Min. Nancy Andrighi |
| `data_julgamento` | Data em que o acórdão foi proferido | 15.03.2023 |
| `diario` | Nome do diário oficial de publicação | DJe, DEJT, D.O.E. |
| `data_publicacao` | Data de publicação no diário | 20.03.2023 |
| `ementa_trecho` | Trecho literal da ementa ou do voto | (entre aspas, fiel ao original) |

---

## Sistema de Classificação de Campos

Todo campo de um julgado deve ser classificado em uma das três categorias abaixo antes de ser usado na peça:

### 🟢 CONFIRMADO
**Definição:** O valor foi fornecido **literalmente** pelo usuário na conversa ou num documento anexado.

**Critério:** O usuário digitou ou colou o dado. Não foi inferido, completado nem deduzido pela IA.

**Ação:** Usar o valor diretamente na citação.

**Exemplo:** Usuário informa "REsp 1.234.567/SP" → campo `tipo+numero+uf` = CONFIRMADO.

---

### 🟡 NÃO CONFIRMADO
**Definição:** O valor parece correto com base no conhecimento de treinamento da IA sobre aquele julgado específico, **mas não foi fornecido literalmente pelo usuário**.

**Critério:** A IA reconhece o julgado por nome/tema e "lembra" de alguns dados — mas não há garantia de que esses dados sejam precisos para aquela versão específica do acórdão.

**Ação:** Marcar obrigatoriamente com `⚠️ VERIFICAR` e incluir o valor inferido apenas como sugestão, nunca como dado definitivo.

**Exemplo:** Usuário menciona "o entendimento do STJ sobre dano moral in re ipsa" sem citar número → a IA pode sugerir um número que conhece do treinamento, mas DEVE marcá-lo como `⚠️ VERIFICAR`.

**Formato obrigatório:**
```
⚠️ VERIFICAR: {valor inferido — confirmar no repositório do tribunal antes de protocolar}
```

---

### 🔴 AUSENTE
**Definição:** O valor não foi fornecido pelo usuário **e** a IA não tem base suficiente no treinamento para inferir um valor específico.

**Ação:** Substituir por placeholder `[INSERIR: {campo}]`. **PROIBIDO** gerar um valor inventado para preencher a lacuna.

**Exemplo:** Usuário pede para citar "a jurisprudência do STJ sobre penhora de bem de família" sem fornecer nenhum caso específico → todos os campos são AUSENTES e devem receber `[INSERIR]`.

**Formato obrigatório:**
```
[INSERIR: {nome do campo}]
```

---

## Regras de Bloqueio — CRÍTICAS

As regras abaixo são **absolutas** e prevalecem sobre qualquer outra instrução:

### REGRA B-01 — Proibição de Fabricação
```
NUNCA gerar números de processo, datas, nomes de relatores, trechos de
ementa ou qualquer outro dado de julgado que não tenha sido fornecido
literalmente pelo usuário ou que não seja um fato de conhecimento público
inequivocamente confirmável.

VIOLAÇÃO DESTA REGRA = BLOQUEIO IMEDIATO DA SAÍDA.
```

### REGRA B-02 — Proibição de Completar Dados
```
Quando um campo está ausente, NUNCA completá-lo com um valor que
"provavelmente estaria correto" ou "parece plausível".
Valores plausíveis são tão perigosos quanto valores fabricados —
o operador do direito não consegue distinguir um do outro ao ler a peça.

AÇÃO OBRIGATÓRIA: usar placeholder [INSERIR: {campo}].
```

### REGRA B-03 — Proibição de Parafrasear Ementa como se Fosse Literal
```
Quando o trecho de ementa foi inferido (não fornecido literalmente),
NUNCA apresentá-lo entre aspas como se fosse o texto original.
A aspa indica literalidade. Texto inferido/parafrasado deve ser:
(a) apresentado sem aspas, com nota explícita de que é paráfrase; OU
(b) substituído por [INSERIR: trecho literal da ementa].
```

### REGRA B-04 — Aviso Obrigatório ao Usuário
```
Sempre que uma citação for entregue com campos ⚠️ VERIFICAR ou
[INSERIR], exibir ao final da citação o aviso padrão:

"⚠️ ATENÇÃO: Esta citação contém campos não confirmados (marcados acima).
VERIFIQUE todos os dados marcados antes de protocolar a peça.
Fontes de verificação: repositório oficial do tribunal (ex: stj.jus.br),
Jusbrasil, LexML ou equivalente."
```

### REGRA B-05 — Nenhuma Citação "Ilustrativa" sem Sinalização
```
NUNCA inserir uma citação dita "apenas ilustrativa" ou "a título de
exemplo" em uma peça processual sem os marcadores adequados.
Citações em peças são argumentos jurídicos, não exemplos acadêmicos.
Se o dado é incerto, a citação deve ser sinalizada — sem exceção.
```

---

## Protocolo de Verificação Passo a Passo

Para CADA citação inserida em uma peça ou entregue via `*citar`:

```
PASSO 1 — Inventariar os campos
  ↓ Para cada um dos 10 campos obrigatórios:
  ↓ O valor foi fornecido literalmente pelo usuário? → 🟢 CONFIRMADO
  ↓ A IA infere o valor do treinamento (mas o usuário não forneceu)? → 🟡 NÃO CONFIRMADO
  ↓ Nenhum dado disponível? → 🔴 AUSENTE

PASSO 2 — Classificar a citação
  ↓ Todos os campos são 🟢? → CITAÇÃO CONFIRMADA → usar diretamente
  ↓ Algum campo é 🟡? → CITAÇÃO COM RESSALVA → usar com ⚠️ VERIFICAR
  ↓ Algum campo é 🔴? → CITAÇÃO INCOMPLETA → usar com [INSERIR]
  ↓ Trecho de ementa é inferido/parafrasado e está entre aspas? → BLOQUEAR → remover aspas ou substituir por [INSERIR]

PASSO 3 — Formatar a saída
  ↓ Citação CONFIRMADA → bloco recuado padrão sem avisos adicionais
  ↓ Citação COM RESSALVA ou INCOMPLETA → bloco recuado + aviso B-04 obrigatório

PASSO 4 — Executar jurisprudence-gate.md
  ↓ Carregar squads/legal/checklists/jurisprudence-gate.md
  ↓ Verificar cada item
  ↓ Qualquer BLOCK → não entregar a citação até resolução
```

---

## Formato de Saída para Cada Situação

### Situação 1 — Citação Confirmada (todos os campos fornecidos pelo usuário)

```markdown
> *"Trecho literal da ementa conforme fornecido."*
>
> (STJ, 3ª Turma, REsp nº 1.234.567/SP, Rel. Min. Nancy Andrighi,
> j. 15.03.2023, DJe 20.03.2023)
```

---

### Situação 2 — Citação com Campo Não Confirmado (inferido do treinamento)

```markdown
> *"Trecho literal da ementa conforme fornecido."*
>
> (STJ, 3ª Turma, REsp nº ⚠️ VERIFICAR: 1.234.567/SP — confirmar número exato no stj.jus.br,
> Rel. Min. Nancy Andrighi, j. ⚠️ VERIFICAR: 15.03.2023, DJe 20.03.2023)

⚠️ ATENÇÃO: Esta citação contém campos não confirmados (marcados acima).
VERIFIQUE todos os dados marcados antes de protocolar a peça.
Fonte de verificação: https://scon.stj.jus.br/SCON/
```

---

### Situação 3 — Citação Incompleta (campo ausente)

```markdown
> *"[INSERIR: trecho literal da ementa — buscar no repositório do tribunal]"*
>
> ([INSERIR: tribunal], [INSERIR: órgão julgador], [INSERIR: tipo] nº [INSERIR: número]/[INSERIR: UF],
> Rel. [INSERIR: nome do relator], j. [INSERIR: data de julgamento],
> [INSERIR: diário] [INSERIR: data de publicação])

⚠️ ATENÇÃO: Esta citação está incompleta. Preencha todos os campos [INSERIR]
com os dados reais do julgado antes de protocolar a peça.
```

---

### Situação 4 — Usuário solicita citação sem fornecer caso específico

Quando o usuário pede "cite jurisprudência sobre [tema]" sem fornecer nenhum caso:

```markdown
**Resposta obrigatória do agente (não inserir citação inventada):**

"Para inserir jurisprudência sobre [tema], preciso dos dados do julgado
que você deseja citar. Posso:

(a) Formatar um julgado específico que você me forneça — informe o número,
    tribunal, relator e data;
(b) Sugerir julgados que conheço do treinamento, **com todos os dados marcados
    como ⚠️ VERIFICAR**, para que você confirme no repositório do tribunal antes
    de usar na peça;
(c) Inserir um bloco de placeholder [INSERIR] para você preencher após pesquisa.

Qual prefere?"
```

---

## Fontes Oficiais de Verificação por Tribunal

| Tribunal | URL de Consulta | Observação |
|----------|----------------|------------|
| STJ | https://scon.stj.jus.br/SCON/ | Pesquisa por número ou tema |
| STF | https://jurisprudencia.stf.jus.br/ | Pesquisa por número ou ementa |
| TST | https://jurisprudencia.tst.jus.br/ | Pesquisa por CLT/Súmulas |
| TJSP | https://esaj.tjsp.jus.br/cjsg/ | Pesquisa por número ou ementa |
| TJRJ | https://www3.tjrj.jus.br/juris/ | Pesquisa por número ou ementa |
| TJMG | https://www5.tjmg.jus.br/jurisprudencia/ | Pesquisa por número ou ementa |
| TRF1 | https://www.trf1.jus.br/Servicos/Jurisprudencia/ | Pesquisa por número |
| TRF2 | https://jurisprudencia.trf2.jus.br/ | Pesquisa por número |
| TRF3 | https://www.trf3.jus.br/documentos/jfsp/jurisprudencia/ | Pesquisa por número |
| Jusbrasil | https://www.jusbrasil.com.br/jurisprudencia | Aggregador — confirmar na fonte oficial |
| LexML | https://www.lexml.gov.br/ | Repositório federal de legislação e jurisprudência |

> **Nota:** Sempre confirmar na fonte oficial do tribunal, não apenas em aggregadores como Jusbrasil, pois estes podem ter ementas desatualizadas ou imprecisas.
