# format-document

> **Task:** Aplicar padrão de formatação a peças processuais
> **Squad:** legal | **Agent:** processual-writer

---

## Task Definition

```yaml
task:
  name: format-document
  description: >
    Aplica as diretrizes completas de formatação jurídica a uma peça
    processual, garantindo hierarquia visual clara, destaques corretos
    e linguagem técnica sem arcaísmos.
  inputs:
    - raw_text: string (texto da peça, com ou sem formatação prévia)
    - peca_type: string (tipo da peça — opcional, usado para ajustar estrutura)
  outputs:
    - formatted_document: string (peça formatada em Markdown)
    - change_log: list (lista de alterações aplicadas)

steps:
  # ─────────────────────────────────────────
  # FASE 1 — ANÁLISE ESTRUTURAL
  # ─────────────────────────────────────────
  - id: S1
    name: Identificar estrutura existente
    action: >
      Mapear as seções presentes no texto:
      endereçamento, informações do processo, qualificação das partes,
      título da peça, seções de mérito, pedidos, fecho.
    output: mapa_estrutural (dict com seções identificadas)

  - id: S2
    name: Identificar tipo de peça e rito
    action: >
      Determinar o tipo de peça (petição inicial, contestação, recurso,
      impugnação, incidente, manifestação, etc.) e o rito processual aplicável
      (Procedimento Comum CPC, Execução CPC, CLT, JEC, etc.).
      Se não identificável, usar estrutura genérica.
    output: peca_metadata (tipo, rito, base_legal_principal)

  # ─────────────────────────────────────────
  # FASE 2 — FORMATAÇÃO DO CABEÇALHO
  # ─────────────────────────────────────────
  - id: S3
    name: Formatar endereçamento
    action: >
      Localizar o endereçamento (destinatário: juízo, tribunal, etc.).
      Converter para: NEGRITO + CAIXA ALTA, alinhamento justificado,
      linha exclusiva sem ponto final.
    rule: formatting_rules.structure.endereçamento
    example_before: "Exmo. Sr. Juiz de Direito da 3ª Vara Cível"
    example_after: "**AO JUÍZO DA 3ª VARA CÍVEL DA COMARCA DE ___**"

  - id: S4
    name: Formatar informações do processo
    action: >
      Identificar e formatar o bloco de identificação do processo:
      número, classe, partes. Aplicar rótulos em negrito, alinhamento à esquerda.
    rule: formatting_rules.structure.informacoes_processo
    template: |
      **Processo nº:** {número}
      **Classe:** {classe}
      **{Polo ativo}:** {nome}
      **{Polo passivo}:** {nome}

  - id: S5
    name: Formatar qualificação das partes
    action: >
      Identificar o parágrafo de qualificação. Converter o nome da parte
      para NEGRITO + CAIXA ALTA. Manter o restante da qualificação
      em texto justificado normal.
    rule: formatting_rules.structure.qualificacao_partes

  # ─────────────────────────────────────────
  # FASE 3 — FORMATAÇÃO DE TÍTULOS
  # ─────────────────────────────────────────
  - id: S6
    name: Formatar título da peça
    action: >
      Identificar o título do requerimento (ex: "PETIÇÃO INICIAL",
      "IMPUGNAÇÃO AO CUMPRIMENTO DE SENTENÇA"). Aplicar:
      NEGRITO + CAIXA ALTA + linha exclusiva + espaçamento acima e abaixo.
    rule: formatting_rules.headings.titulo_requerimento

  - id: S7
    name: Formatar seções de nível 1
    action: >
      Identificar todos os títulos de seção principal.
      Converter para: algarismos romanos, centralizado, NEGRITO + CAIXA ALTA.
      Padrão: **{NUMERAL}. {TÍTULO}**
    rule: formatting_rules.headings.secao_nivel_1
    examples:
      - before: "1. DOS FATOS" | after: "**I. DOS FATOS**"
      - before: "FUNDAMENTOS" | after: "**II. DO DIREITO**"
      - before: "PEDIDOS"     | after: "**III. DOS PEDIDOS**"

  - id: S8
    name: Formatar subseções de nível 2
    action: >
      Identificar títulos de subseção. Converter para:
      alinhamento à esquerda, negrito, Title Case.
      Padrão: **{ROMANO}.{LETRA}. {Título em Title Case}**
    rule: formatting_rules.headings.subsecao_nivel_2
    examples:
      - before: "a) Da responsabilidade da ré"
        after: "**I.A. Da Responsabilidade da Ré**"
      - before: "1.1 Do dano moral"
        after: "**II.A. Do Dano Moral**"

  # ─────────────────────────────────────────
  # FASE 4 — DESTAQUES NO CORPO DO TEXTO
  # ─────────────────────────────────────────
  - id: S9
    name: Destacar legislação
    action: >
      Identificar todas as referências a artigos de lei, incisos, parágrafos,
      súmulas e resoluções. Aplicar NEGRITO ao número do dispositivo
      E ao nome da lei.
    rule: formatting_rules.emphasis.legislacao
    patterns:
      - regex: "art(igo)?\.?\s*\d+[\w,\s°§ºª]*da\s+(?:Lei|Código|Constituição|Decreto|Resolução)[^,\n]*"
        action: wrap_bold
    examples:
      - before: "conforme art. 523 do CPC"
        after: "conforme **art. 523 do Código de Processo Civil**"
      - before: "nos termos do artigo 186 do Código Civil"
        after: "nos termos do **art. 186 do Código Civil**"

  - id: S10
    name: Destacar dados críticos (valores, prazos, diagnósticos)
    action: >
      Identificar e aplicar negrito em:
      - Valores monetários (R$ X,XX)
      - Prazos expressos em dias/meses/anos com numerais
      - Nomes de doenças e condições médicas
      - Percentuais relevantes
    rule: formatting_rules.emphasis.fatos_dados
    patterns:
      - tipo: valores → "R$\s[\d.,]+" → bold
      - tipo: prazos  → "\d+\s*\([\w\s]+\)\s*dias" → bold
      - tipo: doenças → nomes de CID / diagnósticos → BOLD + CAIXA ALTA

  - id: S11
    name: Destacar nomes de terceiros em listas
    action: >
      Identificar listas de terceiros/suscitados (1., 2., 3. ou a), b), c)).
      Converter o nome da entidade/pessoa para NEGRITO + CAIXA ALTA
      no início de cada item.
    rule: formatting_rules.emphasis.terceiros_suscitados

  - id: S12
    name: Destacar conclusões argumentativas
    action: >
      Identificar frases de conclusão jurídica central do argumento.
      Aplicar negrito para criar mapa de leitura rápida.
    rule: formatting_rules.emphasis.destaques_argumentativos
    signal_phrases:
      - "resta demonstrado"
      - "resta caracterizada"
      - "não há que se falar em"
      - "é inequívoco que"
      - "é incontroverso que"
      - "resta comprovado"

  # ─────────────────────────────────────────
  # FASE 5 — CITAÇÕES DE JURISPRUDÊNCIA
  # ─────────────────────────────────────────
  - id: S13
    name: Formatar blocos de jurisprudência
    action: >
      Identificar citações de decisões judiciais (acórdãos, súmulas, teses).
      Converter para: bloco recuado (blockquote ">"), itálico, aspas na ementa,
      referência completa em linha separada.
    rule: formatting_rules.jurisprudence
    format: |
      > *"{ementa}"*
      >
      > ({Tribunal}, {Órgão}, {Tipo} nº {Número}/{UF}, Rel. {Relator},
      > j. {data}, {publicação} {data_pub})
    warning: >
      Se a referência estiver incompleta (sem número, sem data, sem relator),
      inserir marcador [VERIFICAR REFERÊNCIA COMPLETA ANTES DE PROTOCOLAR].

  # ─────────────────────────────────────────
  # FASE 6 — REVISÃO DE LINGUAGEM
  # ─────────────────────────────────────────
  - id: S14
    name: Eliminar juridiquês arcaico
    action: >
      Varrer o texto e substituir expressões arcaicas conforme lista
      de anti-patterns. Registrar cada substituição no change_log.
    substitutions:
      - from: "vem mui respeitosamente"         to: "vem, respeitosamente,"
      - from: "DD. Juiz"                        to: "Juízo" (ou "Vossa Excelência")
      - from: "MM. Juiz"                        to: "Juízo" (ou "Vossa Excelência")
      - from: "data venia"                      to: "com a devida vênia"
      - from: "nesta senda"                     to: "nesse sentido"
      - from: "dessarte"                        to: "portanto"
      - from: "destarte"                        to: "portanto"
      - from: "mister se faz"                  to: "é necessário"
      - from: "hialino"                         to: "claro"
      - from: "cristalino"                      to: "evidente"
      - from: "medular"                         to: "central"
      - from: "insofismável"                    to: "incontestável"
      - from: "hodiernamente"                   to: "atualmente"
      - from: "sufragado"                       to: "confirmado"
      - from: "escólio"                         to: "lição"
      - from: "cediço"                          to: "pacífico"
      - from: "in verbis"                       to: "nos seguintes termos:"
      - from: "ex vi"                           to: "por força de"
      - from: "ut supra"                        to: "conforme acima"
      - from: "v.g."                            to: "por exemplo,"

  # ─────────────────────────────────────────
  # FASE 7 — FECHO E PEDIDOS
  # ─────────────────────────────────────────
  - id: S15
    name: Formatar seção de pedidos
    action: >
      Garantir que os pedidos estejam em lista numerada (a), b), c) ou 1., 2., 3.),
      cada um em parágrafo próprio, específico e com fundamento legal.
      Verificar ausência de pedido genérico não fundamentado.
    rule: formatting_rules.closing.pedidos

  - id: S16
    name: Formatar fecho
    action: >
      Verificar fórmula de encerramento. Substituir fórmulas antiquadas
      por "Termos em que, pede deferimento." ou variação adequada ao tipo de peça.
      Garantir local, data e assinatura formatados.
    rule: formatting_rules.closing

  # ─────────────────────────────────────────
  # FASE 8 — VALIDAÇÃO FINAL
  # ─────────────────────────────────────────
  - id: S17
    name: Aplicar checklist de validação
    action: >
      Executar checklist de formatação (squads/legal/checklists/formatting-checklist.md).
      Marcar cada item como PASS / FAIL / N/A.
      Listar qualquer FAIL com localização e sugestão de correção.
    output: validation_report

  - id: S18
    name: Gerar change_log
    action: >
      Compilar lista de todas as alterações aplicadas:
      - Tipo de alteração (estrutural, linguística, de ênfase, de citação)
      - Localização (seção/parágrafo)
      - Texto original → Texto modificado
    output: change_log (list of dicts)

output_format:
  structure:
    - formatted_document: texto completo da peça formatada em Markdown
    - separator: "---"
    - section_title: "## Relatório de Formatação"
    - validation_results: checklist com PASS/FAIL/N/A por item
    - change_log: lista de alterações aplicadas com localização
    - warnings: lista de alertas (referências incompletas, itens a verificar)

quality_gates:
  - PASS: Endereçamento em NEGRITO + CAIXA ALTA
  - PASS: Seções numeradas com algarismos romanos centralizados
  - PASS: Subseções com {ROMANO}.{LETRA}. em negrito
  - PASS: Artigos de lei em negrito (número + nome)
  - PASS: Citações de jurisprudência em bloco recuado com itálico
  - PASS: Ausência de juridiquês listados nos anti-patterns
  - PASS: Pedidos específicos em lista numerada/letrada
  - WARNING_IF: Referência de jurisprudência incompleta → marcar [VERIFICAR]
  - BLOCK_IF: Texto original está vazio ou ilegível
```
