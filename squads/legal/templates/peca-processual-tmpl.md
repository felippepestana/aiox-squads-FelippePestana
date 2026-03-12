# Template — Peça Processual

> **Squad:** legal | **Agent:** processual-writer
> **Uso:** Template base para geração e formatação de peças processuais

---

<!-- ═══════════════════════════════════════════════════════════
     BLOCO 1 — ENDEREÇAMENTO
     Alinhamento: justificado | Estilo: NEGRITO + CAIXA ALTA
     ═══════════════════════════════════════════════════════════ -->

**{{ENDERECAMENTO_JUIZO}}**

<!-- Exemplos:
  AO JUÍZO DA {{NUMERO_VARA}}ª VARA {{ESPECIALIDADE}} DA COMARCA DE {{COMARCA}}/{{UF}}
  AO EXCELENTÍSSIMO TRIBUNAL DE JUSTIÇA DO ESTADO DE {{UF}} — {{CAMARA}}ª CÂMARA {{ESPECIALIDADE}}
  AO COLENDO SUPERIOR TRIBUNAL DE JUSTIÇA
-->

---

<!-- ═══════════════════════════════════════════════════════════
     BLOCO 2 — INFORMAÇÕES DO PROCESSO
     Alinhamento: esquerda | Rótulos: negrito
     ═══════════════════════════════════════════════════════════ -->

**Processo nº:** {{NUMERO_PROCESSO}}
**Classe:** {{CLASSE_PROCESSUAL}}
**{{POLO_ATIVO_LABEL}}:** {{NOME_POLO_ATIVO}}
**{{POLO_PASSIVO_LABEL}}:** {{NOME_POLO_PASSIVO}}

---

<!-- ═══════════════════════════════════════════════════════════
     BLOCO 3 — QUALIFICAÇÃO DA PARTE
     Alinhamento: justificado | Nome da parte: NEGRITO + CAIXA ALTA
     ═══════════════════════════════════════════════════════════ -->

**{{NOME_PARTE_CAIXA_ALTA}}**, {{QUALIFICACAO_CIVIL}}, portador(a) {{DOCUMENTO_IDENTIDADE}}, inscrito(a) no CPF sob nº {{CPF}}, residente e domiciliado(a) na {{ENDERECO_COMPLETO}}, por meio de seu advogado que esta subscreve (OAB/{{UF_OAB}} nº {{NUMERO_OAB}}), com escritório profissional situado na {{ENDERECO_ESCRITORIO}}, vem, respeitosamente, à presença de Vossa Excelência, com fundamento {{FUNDAMENTO_LEGAL_CABECALHO}}, apresentar a presente

<!-- ───────────────────────────────────────────────────────────
     TÍTULO DA PEÇA
     Alinhamento: justificado (ou centralizado) | NEGRITO + CAIXA ALTA
     Linha em branco antes e depois
     ─────────────────────────────────────────────────────────── -->

**{{TITULO_PECA}}**

{{#if POLO_PASSIVO_QUALIFICACAO}}
em face de **{{NOME_POLO_PASSIVO_CAIXA_ALTA}}**, {{QUALIFICACAO_POLO_PASSIVO}}, pelos fatos e fundamentos a seguir expostos.
{{/if}}

---

<!-- ═══════════════════════════════════════════════════════════
     SEÇÃO I — DOS FATOS
     Alinhamento: centralizado | NEGRITO + CAIXA ALTA
     ═══════════════════════════════════════════════════════════ -->

**I. DOS FATOS**

<!-- Subseção I.A — Primeira subseção de fatos -->
**I.A. {{TITULO_SUBSECAO_1A}}**

{{FATOS_SUBSECAO_1A}}

<!-- Subseção I.B — Segunda subseção de fatos (se necessário) -->
{{#if FATOS_SUBSECAO_1B}}
**I.B. {{TITULO_SUBSECAO_1B}}**

{{FATOS_SUBSECAO_1B}}
{{/if}}

---

<!-- ═══════════════════════════════════════════════════════════
     SEÇÃO II — DO DIREITO
     ═══════════════════════════════════════════════════════════ -->

**II. DO DIREITO**

**II.A. {{TITULO_TESE_PRINCIPAL}}**

{{DESENVOLVIMENTO_TESE_PRINCIPAL}}

<!-- Bloco de jurisprudência — padrão: bloco recuado + itálico -->
{{#if JURISPRUDENCIA_1}}
> *"{{EMENTA_JULGADO_1}}"*
>
> ({{TRIBUNAL_1}}, {{ORGAO_1}}, {{TIPO_JULGADO_1}} nº {{NUMERO_JULGADO_1}}/{{UF_JULGADO_1}}, Rel. {{RELATOR_1}}, j. {{DATA_JULGAMENTO_1}}, {{DIARIO_1}} {{DATA_PUBLICACAO_1}})
{{/if}}

{{#if TESE_SECUNDARIA}}
**II.B. {{TITULO_TESE_SECUNDARIA}}**

{{DESENVOLVIMENTO_TESE_SECUNDARIA}}

{{#if JURISPRUDENCIA_2}}
> *"{{EMENTA_JULGADO_2}}"*
>
> ({{TRIBUNAL_2}}, {{ORGAO_2}}, {{TIPO_JULGADO_2}} nº {{NUMERO_JULGADO_2}}/{{UF_JULGADO_2}}, Rel. {{RELATOR_2}}, j. {{DATA_JULGAMENTO_2}}, {{DIARIO_2}} {{DATA_PUBLICACAO_2}})
{{/if}}
{{/if}}

{{#if TESE_TERCIARIA}}
**II.C. {{TITULO_TESE_TERCIARIA}}**

{{DESENVOLVIMENTO_TESE_TERCIARIA}}
{{/if}}

---

<!-- ═══════════════════════════════════════════════════════════
     SEÇÃO III — DOS PEDIDOS
     ═══════════════════════════════════════════════════════════ -->

**III. DOS PEDIDOS**

{{FRASE_INTRODUCAO_PEDIDOS}}

{{#each PEDIDOS}}
{{@index_letter}}) {{this.texto_pedido}}
{{/each}}

Requer, ainda, a produção de todos os meios de prova em direito admitidos, especialmente a prova documental já acostada{{#if PROVA_ADICIONAL}}, {{PROVA_ADICIONAL}}{{/if}}.

Atribui à causa o valor de **{{VALOR_CAUSA}}** ({{VALOR_CAUSA_EXTENSO}}).

{{FORMULA_ENCERRAMENTO}}

{{CIDADE}}, {{DATA_EXTENSO}}.

{{NOME_ADVOGADO}}
OAB/{{UF_OAB}} nº {{NUMERO_OAB}}

---

<!--
═══════════════════════════════════════════════════════════════
GUIA DE VARIÁVEIS DO TEMPLATE
═══════════════════════════════════════════════════════════════

BLOCO 1 — ENDEREÇAMENTO
  {{ENDERECAMENTO_JUIZO}}          → Ex: "AO JUÍZO DA 3ª VARA CÍVEL DA COMARCA DE SÃO PAULO/SP"
  {{NUMERO_VARA}}                  → Número ordinal da vara (3, 5, etc.)
  {{ESPECIALIDADE}}                → Especialidade (CÍVEL, CRIMINAL, FAMÍLIA, TRABALHO, etc.)
  {{COMARCA}}                      → Cidade da comarca
  {{UF}}                           → Estado (SP, RJ, MG, etc.)

BLOCO 2 — INFORMAÇÕES DO PROCESSO
  {{NUMERO_PROCESSO}}              → Número CNJ (NNNNNNN-DD.AAAA.J.TT.OOOO)
  {{CLASSE_PROCESSUAL}}            → Ex: "Procedimento Comum (art. 318 do CPC)"
  {{POLO_ATIVO_LABEL}}             → Ex: "Requerente", "Autor", "Exequente", "Recorrente"
  {{POLO_PASSIVO_LABEL}}           → Ex: "Requerido", "Réu", "Executado", "Recorrido"
  {{NOME_POLO_ATIVO}}              → Nome da parte autora
  {{NOME_POLO_PASSIVO}}            → Nome da parte ré

BLOCO 3 — QUALIFICAÇÃO
  {{NOME_PARTE_CAIXA_ALTA}}        → Nome da parte em CAIXA ALTA (já sem negrito no template — aplicar **__)
  {{QUALIFICACAO_CIVIL}}           → Ex: "brasileiro, casado, engenheiro"
  {{DOCUMENTO_IDENTIDADE}}         → Ex: "do RG nº 12.345.678-9 SSP/SP"
  {{CPF}}                          → Ex: "123.456.789-00"
  {{ENDERECO_COMPLETO}}            → Logradouro, nº, bairro, cidade/UF, CEP
  {{UF_OAB}}                       → Estado da OAB (SP, RJ, etc.)
  {{NUMERO_OAB}}                   → Número da OAB
  {{ENDERECO_ESCRITORIO}}          → Endereço profissional do advogado
  {{FUNDAMENTO_LEGAL_CABECALHO}}   → Ex: "no art. 319 do Código de Processo Civil"
  {{TITULO_PECA}}                  → Ex: "PETIÇÃO INICIAL", "IMPUGNAÇÃO AO CUMPRIMENTO DE SENTENÇA"
  {{NOME_POLO_PASSIVO_CAIXA_ALTA}} → Nome do réu/executado em CAIXA ALTA
  {{QUALIFICACAO_POLO_PASSIVO}}    → Ex: "pessoa jurídica de direito privado, inscrita no CNPJ sob nº ___"

SEÇÃO I — FATOS
  {{TITULO_SUBSECAO_1A}}           → Ex: "Da Relação Contratual e do Inadimplemento"
  {{FATOS_SUBSECAO_1A}}            → Texto dos fatos da primeira subseção
  {{TITULO_SUBSECAO_1B}}           → Ex: "Das Consequências do Ato Ilícito" (opcional)
  {{FATOS_SUBSECAO_1B}}            → Texto dos fatos da segunda subseção (opcional)

SEÇÃO II — DIREITO
  {{TITULO_TESE_PRINCIPAL}}        → Ex: "Da Configuração do Dano Moral In Re Ipsa"
  {{DESENVOLVIMENTO_TESE_PRINCIPAL}} → Texto argumentativo da tese principal
  {{EMENTA_JULGADO_1}}             → Trecho da ementa do julgado (entre aspas no template)
  {{TRIBUNAL_1}}                   → Ex: "STJ", "TJSP", "TST"
  {{ORGAO_1}}                      → Ex: "3ª Turma", "2ª Câmara de Direito Privado"
  {{TIPO_JULGADO_1}}               → Ex: "REsp", "AgInt no AREsp", "AC", "RO"
  {{NUMERO_JULGADO_1}}             → Número do processo (somente números)
  {{UF_JULGADO_1}}                 → UF de origem do recurso
  {{RELATOR_1}}                    → Ex: "Min. Nancy Andrighi"
  {{DATA_JULGAMENTO_1}}            → Ex: "15.03.2023"
  {{DIARIO_1}}                     → Ex: "DJe", "DJ", "DEJT"
  {{DATA_PUBLICACAO_1}}            → Ex: "20.03.2023"

SEÇÃO III — PEDIDOS
  {{FRASE_INTRODUCAO_PEDIDOS}}     → Ex: "Ante o exposto, requer-se a Vossa Excelência:"
  {{PEDIDOS}}                      → Array de objetos {texto_pedido: "..."}
  {{PROVA_ADICIONAL}}              → Ex: "prova testemunhal e perícia técnica" (opcional)
  {{VALOR_CAUSA}}                  → Ex: "R$ 15.000,00"
  {{VALOR_CAUSA_EXTENSO}}          → Ex: "quinze mil reais"
  {{FORMULA_ENCERRAMENTO}}         → Ex: "Termos em que, pede deferimento."
  {{CIDADE}}                       → Cidade onde a peça é assinada
  {{DATA_EXTENSO}}                 → Ex: "12 de março de 2026"
  {{NOME_ADVOGADO}}                → Nome completo do advogado subscritor

═══════════════════════════════════════════════════════════════
TIPOS DE PEÇA — TÍTULOS E CLASSES COMUNS
═══════════════════════════════════════════════════════════════

Petição Inicial:
  TITULO_PECA: "AÇÃO DE {{TIPO}} (PROCEDIMENTO COMUM)"
  CLASSE_PROCESSUAL: "Procedimento Comum (art. 318 do CPC)"
  POLO_ATIVO_LABEL: "Requerente" / "Autor"
  POLO_PASSIVO_LABEL: "Requerido" / "Réu"

Contestação:
  TITULO_PECA: "CONTESTAÇÃO"
  CLASSE_PROCESSUAL: (copiar do processo)
  POLO_ATIVO_LABEL: "Réu/Contestante"

Impugnação ao Cumprimento de Sentença:
  TITULO_PECA: "IMPUGNAÇÃO AO CUMPRIMENTO DE SENTENÇA"
  CLASSE_PROCESSUAL: "Cumprimento de Sentença (art. 523 do CPC)"
  POLO_ATIVO_LABEL: "Executado/Impugnante"
  POLO_PASSIVO_LABEL: "Exequente"

Embargos à Execução:
  TITULO_PECA: "EMBARGOS À EXECUÇÃO"
  CLASSE_PROCESSUAL: "Execução de Título Extrajudicial (art. 824 do CPC)"

Incidente de Desconsideração de Personalidade Jurídica:
  TITULO_PECA: "INSTAURAÇÃO DE INCIDENTE DE DESCONSIDERAÇÃO DE PERSONALIDADE JURÍDICA"
  CLASSE_PROCESSUAL: "Incidente Processual (arts. 133 a 137 do CPC)"

Recurso de Apelação:
  TITULO_PECA: "RECURSO DE APELAÇÃO"
  ENDERECAMENTO_JUIZO: "AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE {{UF}}"

Agravo de Instrumento:
  TITULO_PECA: "AGRAVO DE INSTRUMENTO"
  ENDERECAMENTO_JUIZO: "AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE {{UF}}"

Recurso Especial:
  TITULO_PECA: "RECURSO ESPECIAL"
  ENDERECAMENTO_JUIZO: "AO COLENDO SUPERIOR TRIBUNAL DE JUSTIÇA"

═══════════════════════════════════════════════════════════════
DESTAQUES OBRIGATÓRIOS — CHECKLIST RÁPIDO
═══════════════════════════════════════════════════════════════

  ☐ Endereçamento: **NEGRITO + CAIXA ALTA**
  ☐ Nome da parte: **NEGRITO + CAIXA ALTA**
  ☐ Título da peça: **NEGRITO + CAIXA ALTA**
  ☐ Seções (I, II, III...): **NEGRITO + CAIXA ALTA** + centralizado
  ☐ Subseções (I.A., I.B...): **Negrito + Title Case** + esquerda
  ☐ Artigos de lei: **art. X da Lei Y** → ambos em negrito
  ☐ Valores: **R$ X,XX** → negrito
  ☐ Prazos: **X (extenso) dias/meses** → negrito
  ☐ Doenças: **NOME DA DOENÇA** → negrito + caixa alta
  ☐ Terceiros em listas: **NOME DA ENTIDADE** → negrito + caixa alta
  ☐ Jurisprudência: bloco recuado (>) + *itálico* + referência completa

-->
