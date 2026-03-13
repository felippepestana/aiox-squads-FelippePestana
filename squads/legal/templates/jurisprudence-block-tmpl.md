# Template — Bloco de Citação Jurisprudencial

> **Squad:** legal | **Agent:** jurisprudence-researcher
> **Uso:** Formatação padronizada de citações jurisprudenciais com marcadores de verificação

---

<!-- ═══════════════════════════════════════════════════════════
     AVISO CRÍTICO — REGRAS DE USO DESTE TEMPLATE
     ═══════════════════════════════════════════════════════════ -->

> ⚠️ **REGRAS ABSOLUTAS ANTES DE USAR ESTE TEMPLATE:**
> 1. **NUNCA** inserir dados de julgado gerados pelo LLM sem marcador ⚠️ VERIFICAR
> 2. **NUNCA** colocar entre aspas texto de ementa que não foi fornecido literalmente
> 3. **SEMPRE** executar verify-citations.md antes de formatar qualquer bloco
> 4. Campos ausentes → `[INSERIR: nome do campo]` | Campos não confirmados → ⚠️ VERIFICAR

---

## Sistema de Marcadores

| Status do Campo | Marcador | Ação Obrigatória |
|----------------|---------|-----------------|
| Fornecido literalmente pelo usuário | *(sem marcador)* | Usar exatamente como fornecido |
| Proveniente do treinamento LLM | ⚠️ VERIFICAR | Confirmar no repositório do tribunal |
| Não fornecido e não disponível | `[INSERIR: campo]` | Buscar e completar antes de protocolar |
| Ementa parafraseada (não literal) | *(sem aspas + nota explicativa)* | Localizar texto literal no acórdão |

---

## Bloco 1 — STF (Supremo Tribunal Federal)

### 1A. STF — Tese de Repercussão Geral (Recursos Repetitivos)

```markdown
Sobre o tema, o **Supremo Tribunal Federal** fixou a seguinte tese no julgamento
do Tema nº {{NUMERO_TEMA_RG}} ⚠️ VERIFICAR:

> *"{{TESE_FIXADA_LITERAL}}"*
>
> (STF, Tribunal Pleno, {{TIPO_JULGADO}} nº {{NUMERO}}/{{UF}}, Rel. Min. {{RELATOR}} ⚠️ VERIFICAR,
> j. {{DATA_JULGAMENTO}} ⚠️ VERIFICAR, DJe {{DATA_PUBLICACAO}} ⚠️ VERIFICAR)
```

**Exemplo preenchido — todos os campos confirmados pelo usuário:**
```markdown
Sobre o tema, o **Supremo Tribunal Federal** fixou a seguinte tese no julgamento
do Tema nº 786:

> *"É compatível com a Constituição Federal a Lei 9.656/1998, que dispõe sobre
> os planos e seguros privados de assistência à saúde."*
>
> (STF, Tribunal Pleno, RE nº 880.143/SP, Rel. Min. Edson Fachin,
> j. 15.04.2021, DJe 20.05.2021)
```

**Exemplo com campos parcialmente confirmados:**
```markdown
Sobre o tema, o **Supremo Tribunal Federal** manifestou-se no sentido de que:

> *(paráfrase — localizar texto literal da tese/ementa no repositório do STF)*
>
> (STF, [INSERIR: órgão julgador], [INSERIR: tipo] nº [INSERIR: número]/[INSERIR: UF],
> Rel. Min. ⚠️ VERIFICAR, j. ⚠️ VERIFICAR, DJe ⚠️ VERIFICAR)

⚠️ **AVISO B-04** — Verificar dados antes de protocolar. URL: https://portal.stf.jus.br/jurisprudencia/
```

### 1B. STF — Súmula Vinculante

```markdown
O **Supremo Tribunal Federal** cristalizou o entendimento na **Súmula Vinculante
nº {{NUMERO_SV}} ⚠️ VERIFICAR**, com o seguinte enunciado:

> *"{{ENUNCIADO_LITERAL}}"*
```

**Exemplo:**
```markdown
O **Supremo Tribunal Federal** cristalizou o entendimento na **Súmula Vinculante nº 17**:

> *"Durante o período previsto no parágrafo 1º do artigo 100 da Constituição,
> não incidem juros de mora sobre os precatórios que nele sejam pagos."*
```

---

## Bloco 2 — STJ (Superior Tribunal de Justiça)

### 2A. STJ — Tese de Recurso Repetitivo

```markdown
A matéria encontra-se pacificada no **Superior Tribunal de Justiça**, que fixou
a seguinte tese no Tema nº {{NUMERO_TEMA_STJ}} ⚠️ VERIFICAR:

> *"{{TESE_FIXADA_LITERAL}}"*
>
> (STJ, {{ORGAO_JULGADOR}}, {{TIPO_JULGADO}} nº {{NUMERO}}/{{UF}},
> Rel. Min. {{RELATOR}} ⚠️ VERIFICAR, j. {{DATA_JULGAMENTO}} ⚠️ VERIFICAR,
> {{DIARIO}} {{DATA_PUBLICACAO}} ⚠️ VERIFICAR)
```

### 2B. STJ — Súmula

```markdown
O **Superior Tribunal de Justiça** editou a **Súmula nº {{NUMERO_SUMULA}} ⚠️ VERIFICAR**,
nos seguintes termos:

> *"{{ENUNCIADO_SUMULA_LITERAL}}"*

Referência: STJ, Súmula nº {{NUMERO}}, aprovada em {{DATA}} ⚠️ VERIFICAR, {{DIARIO}}.
```

**Exemplos de súmulas STJ com dados públicos:**
```markdown
O **Superior Tribunal de Justiça** consolidou o entendimento por meio da
**Súmula 469**, segundo a qual:

> *"Aplica-se o Código de Defesa do Consumidor aos contratos de plano de saúde."*
```

```markdown
De acordo com a **Súmula 385 do Superior Tribunal de Justiça**:

> *"Da anotação irregular em cadastro de proteção ao crédito, não cabe indenização
> por dano moral, quando preexistente legítima inscrição, ressalvado o direito ao
> cancelamento."*
```

### 2C. STJ — Acórdão de Turma (campos todos confirmados)

```markdown
Esse entendimento encontra amparo na jurisprudência do **Superior Tribunal de
Justiça**, conforme se depreende do seguinte precedente:

> *"{{TRECHO_LITERAL_EMENTA}}"*
>
> (STJ, {{ORGAO}}, {{TIPO}} nº {{NUMERO}}/{{UF}}, Rel. Min. {{RELATOR}},
> j. {{DATA_JULGAMENTO}}, {{DIARIO}} {{DATA_PUBLICACAO}})
```

### 2D. STJ — Acórdão com Campos Parcialmente Verificados

```markdown
A jurisprudência do **Superior Tribunal de Justiça** é no sentido de que:

> *(paráfrase da tese — texto literal deve ser obtido no repositório do STJ)*
>
> (STJ, ⚠️ VERIFICAR: órgão julgador, [INSERIR: tipo] nº [INSERIR: número]/[INSERIR: UF],
> Rel. [INSERIR: nome do relator], j. [INSERIR: data de julgamento],
> DJe [INSERIR: data de publicação])

⚠️ **AVISO B-04** — Campos marcados devem ser verificados antes de protocolar.
URL: https://processo.stj.jus.br/jurisprudencia/
```

---

## Bloco 3 — TJ (Tribunal de Justiça Estadual)

### 3A. TJ — Acórdão (campos todos confirmados)

```markdown
No âmbito do **Tribunal de Justiça do Estado de {{UF}}**, a orientação é no
mesmo sentido, conforme se verifica do seguinte julgado:

> *"{{TRECHO_LITERAL_EMENTA}}"*
>
> ({{TRIBUNAL}}, {{ORGAO}}, Apelação Cível nº {{NUMERO}}/{{COMARCA}},
> Rel. Des. {{RELATOR}}, j. {{DATA_JULGAMENTO}}, {{DIARIO}} {{DATA_PUBLICACAO}})
```

### 3B. TJ — Acórdão com Campos Parcialmente Verificados

```markdown
A orientação do **Tribunal de Justiça do Estado de {{UF}}** é no sentido de que:

> *(paráfrase — localizar texto literal no CJSG ou repositório equivalente)*
>
> ({{TRIBUNAL}}, [INSERIR: câmara], [INSERIR: tipo] nº [INSERIR: número]/[INSERIR: comarca],
> Rel. Des. ⚠️ VERIFICAR, j. ⚠️ VERIFICAR, DJ ⚠️ VERIFICAR)

⚠️ **AVISO B-04** — Verificar no repositório do tribunal antes de protocolar.
URL TJSP: https://esaj.tjsp.jus.br/cjsg/consultaCompleta.do
```

### 3C. TJ — Súmula Estadual

```markdown
O **Tribunal de Justiça do Estado de {{UF}}** editou a **Súmula nº {{NUMERO}} ⚠️ VERIFICAR**:

> *"{{ENUNCIADO_LITERAL}} ⚠️ VERIFICAR"*
```

---

## Bloco 4 — Blocos Combinados (STJ + TJ)

### 4A. Fundamentação em Dois Níveis

```markdown
O entendimento é pacífico tanto no **Superior Tribunal de Justiça** quanto
nas câmaras do **Tribunal de Justiça do Estado de {{UF}}**:

**Superior Tribunal de Justiça:**

> *"{{TRECHO_STJ}}"*
>
> (STJ, {{ORGAO_STJ}}, {{TIPO}} nº {{NUMERO}}/{{UF}}, Rel. Min. {{RELATOR}},
> j. {{DATA}}, DJe {{DATA_PUB}})

**Tribunal de Justiça — Confirmação Regional:**

> *"{{TRECHO_TJ}}"*
>
> ({{TRIBUNAL}}, {{ORGAO_TJ}}, {{TIPO_TJ}} nº {{NUMERO_TJ}}/{{COMARCA}},
> Rel. Des. {{RELATOR_TJ}}, j. {{DATA_TJ}}, DJ {{DATA_PUB_TJ}})
```

---

## Bloco 5 — Marcadores de Verificação (uso isolado)

### 5A. Aviso B-04 Padrão

```markdown
⚠️ **AVISO B-04 — Citação com Dados Pendentes**
Um ou mais campos desta citação estão marcados como ⚠️ VERIFICAR ou [INSERIR].
**Ação obrigatória antes de protocolar:** acessar o repositório do tribunal
e confirmar/completar os dados marcados.
**Não protocolar peça com citação incompleta ou não verificada.**
```

### 5B. Nota de Paráfrase (ementa não fornecida literalmente)

```markdown
*(Nota: o trecho acima é uma paráfrase baseada no conhecimento do LLM sobre o tema.
Antes de protocolar, localizar o texto literal da ementa no repositório do tribunal
e substituir esta paráfrase pelo texto original, inserindo entre aspas duplas.)*
```

### 5C. Bloco com Todos os Campos Ausentes (placeholder)

```markdown
Sobre o tema, o **{{TRIBUNAL_HIERARQUIA}}** se manifestou no seguinte sentido:

> *"[INSERIR: trecho literal da ementa do julgado]"*
>
> ([INSERIR: tribunal], [INSERIR: órgão julgador], [INSERIR: tipo de recurso]
> nº [INSERIR: número do processo]/[INSERIR: UF de origem], Rel.
> [INSERIR: nome do relator], j. [INSERIR: data de julgamento],
> [INSERIR: diário oficial] [INSERIR: data de publicação])

⚠️ **AVISO B-04** — Todos os campos desta citação devem ser preenchidos
com dados reais pesquisados no repositório do tribunal.
URL de pesquisa: [INSERIR: URL do repositório do tribunal]
```

---

## Bloco 6 — Formatação de Doutrina

### 6A. Citação Doutrinária em Bloco

```markdown
A doutrina processualista, na voz de **{{NOME_AUTOR}}**, ensina que:

> *"{{TRECHO_LITERAL}}"*
>
> ({{SOBRENOME}}, {{NOME}}. **{{TITULO_OBRA}}**. {{EDICAO}} ed. {{LOCAL}}: {{EDITORA}}, {{ANO}}. p. {{PAGINA}}.)
```

**Exemplos com dados verificáveis:**

```markdown
O processualista **Humberto Theodoro Júnior** leciona que:

> *"[INSERIR: trecho literal da obra]"*
>
> (THEODORO JÚNIOR, Humberto. **Curso de Direito Processual Civil**. 60. ed.
> Rio de Janeiro: Forense, 2019. p. [INSERIR: página].)
```

```markdown
Fredie Didier Jr., em sua obra clássica, ensina que:

> *"[INSERIR: trecho literal]"*
>
> (DIDIER JR., Fredie. **Curso de Direito Processual Civil**. v. 1. 22. ed.
> Salvador: JusPodivm, 2020. p. [INSERIR: página].)
```

---

## Guia de Variáveis do Template

### Variáveis de Identificação do Julgado

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `{{TRIBUNAL}}` | Sigla do tribunal | STF, STJ, TJSP, TRF3 |
| `{{ORGAO}}` | Órgão julgador | 3ª Turma, 2ª Câmara de Direito Privado |
| `{{TIPO_JULGADO}}` | Tipo do recurso | REsp, AgInt, AC, AI, RO, ARE |
| `{{NUMERO}}` | Número do processo | 1.234.567 |
| `{{UF}}` | Estado de origem | SP, RJ, MG, RS |
| `{{RELATOR}}` | Nome do relator | Min. Nancy Andrighi / Des. João Silva |
| `{{DATA_JULGAMENTO}}` | Data do julgamento | 15.03.2023 |
| `{{DIARIO}}` | Diário de publicação | DJe, DJ, DOJT, DO |
| `{{DATA_PUBLICACAO}}` | Data de publicação | 20.03.2023 |
| `{{TRECHO_LITERAL_EMENTA}}` | Texto literal da ementa | (copiar do acórdão) |

### Variáveis de Doutrina

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `{{SOBRENOME}}` | Sobrenome do autor | THEODORO JÚNIOR |
| `{{NOME}}` | Nome do autor | Humberto |
| `{{TITULO_OBRA}}` | Título da obra em negrito | Curso de Direito Processual Civil |
| `{{EDICAO}}` | Número da edição | 60 |
| `{{LOCAL}}` | Cidade de publicação | Rio de Janeiro |
| `{{EDITORA}}` | Nome da editora | Forense |
| `{{ANO}}` | Ano de publicação | 2019 |
| `{{PAGINA}}` | Página específica | 123 |

---

## Checklist de Uso do Template

Execute antes de inserir qualquer bloco na peça processual:

| # | Item | Status |
|---|------|--------|
| 1 | verify-citations.md executado para esta citação | ✅ / ❌ |
| 2 | jurisprudence-gate.md grupos G1-G5 executados | ✅ / ❌ |
| 3 | Todos os campos classificados (CONFIRMADO/NAO_CONFIRMADO/AUSENTE) | ✅ / ❌ |
| 4 | Campos NAO_CONFIRMADOS com ⚠️ VERIFICAR | ✅ / ❌ |
| 5 | Campos AUSENTES com [INSERIR: campo] | ✅ / ❌ |
| 6 | Ementa entre aspas SOMENTE se texto literal fornecido pelo usuário | ✅ / ❌ |
| 7 | Aviso B-04 presente (se há campos pendentes) | ✅ / ❌ |
| 8 | URL de verificação do tribunal indicada | ✅ / ❌ |
| 9 | Bloco formatado como blockquote (>) com itálico | ✅ / ❌ |
| 10 | Referência completa na linha seguinte ao bloco | ✅ / ❌ |
