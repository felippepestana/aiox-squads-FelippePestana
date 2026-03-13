# draft-appeal

> **Task:** Redação de recursos processuais com análise de admissibilidade e estratégia recursal
> **Squad:** legal | **Agent:** appellate-specialist

---

## Task Definition

```yaml
task:
  name: draft-appeal
  description: >
    Recebe a decisão judicial impugnada, o Case Brief recursal e as razões de
    inconformismo, e executa workflow de redação do recurso adequado ao caso.
    Verifica obrigatoriamente os pressupostos de admissibilidade antes de redigir
    as razões, evitando recurso inadmissível.
  inputs:
    - decisao_impugnada: string (texto ou descrição da sentença/decisão a recorrer)
    - tipo_recurso: string (opcional — apelação / AI / agravo interno / ED / REsp / RE)
    - case_brief: object (Case Brief entregue pelo case-analyst)
    - motivos_inconformismo: string (razões do cliente para recorrer)
    - data_intimacao: string (data da intimação da decisão — para verificar prazo)
  outputs:
    - recurso_formatado: string (texto do recurso em Markdown, formatado)
    - analise_admissibilidade: object (resultado da verificação de admissibilidade)
    - alertas_prazo: list (alertas de urgência se prazo curto)
    - relatorio_quality: object (resultado dos quality gates)

steps:
  # ─────────────────────────────────────────────────────────
  # ETAPA 1 — CLASSIFICAÇÃO DO TIPO DE RECURSO
  # ─────────────────────────────────────────────────────────
  - id: E1
    name: Classificação do Tipo de Recurso Cabível
    description: >
      Identificar o recurso processual adequado à decisão impugnada,
      verificando o enquadramento legal antes de prosseguir.
    action: |
      1. Identificar o tipo de ato judicial impugnado:
         a) Sentença (mérito ou terminativa) → Apelação (art. 1.009 CPC)
         b) Decisão interlocutória → Verificar rol do art. 1.015 CPC (AI ou preclusão)
         c) Decisão monocrática do relator → Agravo Interno (art. 1.021 CPC)
         d) Qualquer decisão com vício (omissão/contradição/obscuridade) → ED (art. 1.022 CPC)
         e) Acórdão TJ — questão de direito federal → REsp (art. 105, III CF)
         f) Acórdão TJ — questão constitucional → RE (art. 102, III CF)

      2. Para Agravo de Instrumento: verificar rol TAXATIVO art. 1.015 CPC:
         I. Tutelas provisórias            VIII. Litisconsórcio (limitação)
         II. Mérito do processo            IX. Intervenção de terceiros
         III. Arbitragem                   X. Efeito suspensivo em embargos
         IV. IDPJ                          XI. Ônus da prova
         V. Gratuidade                     XIII. Outros casos expressos em lei
         VI. Exibição de doc/coisa
         VII. Exclusão de litisconsorte
         → Se decisão NÃO está no rol: alertar o usuário sobre inadmissibilidade do AI
         → Alternativa: impugnar em preliminar de apelação (art. 1.009, § 1º CPC)

      3. Para ED: identificar o vício:
         - Omissão (art. 1.022, I CPC) — ponto não apreciado
         - Contradição (art. 1.022, II CPC) — fundamento x dispositivo
         - Obscuridade (art. 1.022, III CPC) — decisão ininteligível
         - Erro material (art. 1.022, IV CPC) — erro de cálculo ou escrita
         - Finalidade adicional: prequestionamento (art. 1.025 CPC)

      4. Para REsp: verificar prequestionamento (ver E3)
      5. Para RE: verificar prequestionamento constitucional + repercussão geral

    output: tipo_recurso_identificado (com fundamentação do cabimento)

  # ─────────────────────────────────────────────────────────
  # ETAPA 2 — VERIFICAÇÃO DE ADMISSIBILIDADE
  # ─────────────────────────────────────────────────────────
  - id: E2
    name: Verificação dos Pressupostos de Admissibilidade
    description: >
      Verificar todos os pressupostos de admissibilidade antes de redigir
      as razões recursais. Recurso inadmissível não será analisado no mérito.
    pressupostos_intrinsecos:
      cabimento:
        verificar: "Recurso está previsto em lei para o ato judicial impugnado?"
        resultado_negativo: "BLOQUEIO — alertar usuário e sugerir alternativa"

      legitimidade:
        verificar: "Quem recorre é parte, terceiro prejudicado ou MP? (art. 996 CPC)"
        verificar_tb: "Há sucumbência do recorrente (ao menos parcial)?"
        resultado_negativo: "Alertar ausência de legitimidade"

      interesse_recursal:
        verificar: "O recurso é útil ao recorrente? Há sucumbência real?"
        resultado_negativo: "Sem interesse recursal — não interpor"

    pressupostos_extrinsecos:
      tempestividade:
        verificar: "Prazo remanescente (em dias úteis)?"
        prazos:
          apelacao: "15 dias úteis da intimação da sentença (art. 1.003, § 5º CPC)"
          agravo_instrumento: "15 dias úteis da intimação da decisão interlocutória"
          agravo_interno: "15 dias úteis da intimação da decisão monocrática"
          embargos_declaracao: "5 dias úteis (art. 1.023 CPC)"
          resp_re: "15 dias úteis da intimação do acórdão"
        calculo: |
          - Prazo em DIAS ÚTEIS (art. 219 CPC) — exceto ED (dias corridos? ⚠️ verificar)
          - Início: dia seguinte à intimação (publicação no DJe)
          - Suspensão: feriados, recesso, férias coletivas
          - Dobro: Fazenda Pública e MP (art. 183 CPC) — verificar se aplicável
        urgencia: "Se ≤ 5 dias úteis: sinalizar URGÊNCIA MÁXIMA"
        resultado_negativo: "BLOQUEIO — prazo expirado; alertar sobre possibilidade de tempestividade tardia"

      preparo:
        verificar: "Custas de preparo calculadas e comprovante disponível?"
        regra: "Comprova-se no ato da interposição (art. 1.007 CPC)"
        excecoes: ["Fazenda Pública", "MP", "beneficiário da gratuidade"]
        deserção: "Falta ou insuficiência → deserção → não conhecimento"
        resultado_negativo: "Alertar e calcular valor estimado para preparo"

      regularidade_formal:
        verificar:
          - "Assinatura do advogado com poderes de recorrer"
          - "Peça identificando o recurso, o recorrente, o recorrido e o processo"
          - "Razões recursais presentes (exceto ED oral em audiência)"

    output: |
      ## Análise de Admissibilidade
      | Pressuposto | Status | Observação |
      |-------------|--------|------------|
      | Cabimento | ✅ PASS / ❌ FAIL | {obs} |
      | Legitimidade | ✅ PASS / ❌ FAIL | {obs} |
      | Interesse recursal | ✅ PASS / ❌ FAIL | {obs} |
      | Tempestividade | ✅ PASS / ❌ FAIL / ⚠️ URGENTE | {obs + prazo remanescente} |
      | Preparo | ✅ PASS / ❌ FAIL | {obs + valor estimado} |
      | Regularidade formal | ✅ PASS / ❌ FAIL | {obs} |
      **Conclusão:** ADMISSÍVEL / INADMISSÍVEL / ADMISSÍVEL COM RESSALVAS

  # ─────────────────────────────────────────────────────────
  # ETAPA 3 — VERIFICAÇÃO DE PREQUESTIONAMENTO (REsp/RE)
  # ─────────────────────────────────────────────────────────
  - id: E3
    name: Verificação de Prequestionamento (obrigatório para REsp/RE)
    description: >
      Para REsp e RE, verificar se a matéria federal ou constitucional foi
      debatida e decidida no acórdão recorrido (prequestionamento).
    applicability: "OBRIGATÓRIO para REsp (art. 105, III CF) e RE (art. 102, III CF)"
    action: |
      1. Ler o acórdão recorrido na íntegra (fornecido pelo usuário)
      2. Identificar se o artigo de lei federal (REsp) ou constitucional (RE)
         foi mencionado ou debatido no acórdão
      3. Classificar o prequestionamento:
         - EXPLÍCITO: tribunal cita e decide expressamente o artigo de lei
         - IMPLÍCITO: tribunal decide a questão sem citar o artigo
           (STJ aceita; STF tem divergência interna — ⚠️ verificar)
         - AUSENTE: questão não foi debatida no acórdão
      4. Se AUSENTE:
         - Verificar se cabe ED prequestionador (art. 1.025 CPC)
         - Orientar: opor ED apontando a omissão antes do REsp/RE
         - Informar: art. 1.025 CPC — considera-se prequestionado se opostos ED
      5. Se PRESENTE: prosseguir para E4

    output: prequestionamento_status (EXPLÍCITO / IMPLÍCITO / AUSENTE + recomendação)

  # ─────────────────────────────────────────────────────────
  # ETAPA 4 — MAPEAMENTO DOS ARGUMENTOS RECURSAIS
  # ─────────────────────────────────────────────────────────
  - id: E4
    name: Mapeamento dos Argumentos Recursais
    description: >
      Identificar e hierarquizar os argumentos que sustentarão o recurso,
      distinguindo error in judicando de error in procedendo.
    action: |
      4A. IDENTIFICAR OS CAPÍTULOS DA DECISÃO IMPUGNADA
        Para cada capítulo autônomo da sentença/acórdão:
        - Identificar o conteúdo (mérito, custas, honorários, tutela, etc.)
        - Verificar se o cliente tem interesse em impugnar aquele capítulo
        - Capítulo não impugnado → faz coisa julgada parcial → NÃO reabrir

      4B. CLASSIFICAR O TIPO DE ERRO DE CADA CAPÍTULO IMPUGNADO
        Error in Judicando (erro no julgamento):
        - Equívoco na apreciação do direito material aplicável
        - Aplicação de lei errada ao caso concreto
        - Ignorância de jurisprudência vinculante (súmula, repetitivo, IRDR)
        - Avaliação incorreta das provas (valoração das provas)
        → PEDIDO: REFORMA da decisão

        Error in Procedendo (erro processual):
        - Cerceamento de defesa (indeferimento de prova essencial)
        - Julgamento ultra petita (além do pedido)
        - Julgamento extra petita (fora do pedido)
        - Julgamento citra petita (aquém do pedido — deixou de julgar)
        - Falta de fundamentação (art. 93, IX CF + art. 489 CPC)
        - Violação ao contraditório
        → PEDIDO: ANULAÇÃO da decisão (com retorno ao primeiro grau)

      4C. HIERARQUIZAR OS ARGUMENTOS
        1º. Argumento mais forte (mais diretamente fatal à decisão)
        2º. Argumentos de mérito complementares
        3º. Argumentos processuais (se houver)
        4º. Teses subsidiárias

      4D. IDENTIFICAR JURISPRUDÊNCIA NECESSÁRIA
        Para cada argumento:
        - Há súmula/repetitivo/IRDR aplicável? (identificar sem inventar)
        - Há acórdão do STJ/STF sobre o tema? (indicar para pesquisa — ver jurisprudence-researcher)
        - A tese é consolidada ou controversa?

    output: mapa_argumentos (por capítulo + tipo de erro + pedido + jurisprudência necessária)

  # ─────────────────────────────────────────────────────────
  # ETAPA 5 — REDAÇÃO DO RECURSO
  # ─────────────────────────────────────────────────────────
  - id: E5
    name: Redação do Recurso
    description: >
      Redigir o recurso conforme o tipo identificado, com estrutura padronizada
      e aplicando todas as regras de formatação do processual-writer.
    estruturas_por_tipo:
      apelacao:
        secoes:
          - "I. DA ADMISSIBILIDADE (tempestividade, preparo, legitimidade)"
          - "II. DAS RAZÕES RECURSAIS {por capítulo impugnado}"
          - "   II.A. {Primeiro capítulo impugnado}"
          - "   II.B. {Segundo capítulo impugnado} (se houver)"
          - "III. DO PEDIDO"
        endereçamento: "AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE {UF}"
        titulo_peca: "RECURSO DE APELAÇÃO"
        formula_pedido: "seja conhecido e provido, para reformar/anular a sentença recorrida"

      agravo_instrumento:
        secoes:
          - "I. DA ADMISSIBILIDADE (cabimento no rol do art. 1.015 + tempestividade)"
          - "II. DA URGÊNCIA (se pedido de efeito suspensivo/tutela recursal)"
          - "III. DAS RAZÕES (erro da decisão impugnada)"
          - "IV. DO PEDIDO (efeito suspensivo + conhecimento e provimento)"
        endereçamento: "AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE {UF}"
        titulo_peca: "AGRAVO DE INSTRUMENTO"
        formula_pedido: "concessão de efeito suspensivo e conhecimento e provimento"
        peças_obrigatorias:
          - "Cópia da decisão agravada"
          - "Cópia das principais peças do processo"
          - "Certidão de intimação"
          art_1017: "Verificar art. 1.017 CPC — documentação obrigatória do AI"

      agravo_interno:
        secoes:
          - "I. DA ADMISSIBILIDADE"
          - "II. DO FUNDAMENTO — DECISÃO MONOCRÁTICA CONTRÁRIA À JURISPRUDÊNCIA DO COLEGIADO"
          - "III. DO PEDIDO (que o colegiado aprecie e reforme)"
        titulo_peca: "AGRAVO INTERNO"
        formula_pedido: "que o recurso seja levado ao colegiado e provido"

      embargos_declaracao:
        secoes:
          - "I. DA ADMISSIBILIDADE"
          - "II. DA OMISSÃO/CONTRADIÇÃO/OBSCURIDADE/ERRO (conforme caso)"
          - "III. DO PEDIDO"
        titulo_peca: "EMBARGOS DE DECLARAÇÃO"
        formula_pedido: "recebimento e provimento para suprir {vício}"
        alerta_multa: "Advertir sobre risco de multa por ED protelatórios (art. 1.026, § 2º CPC)"

      resp:
        secoes:
          - "I. DA ADMISSIBILIDADE (cabimento, tempestividade, prequestionamento)"
          - "II. DO FUNDAMENTO DO RECURSO (violação de lei federal / divergência)"
          - "III. DAS RAZÕES DE MÉRITO"
          - "IV. DO PEDIDO"
        endereçamento: "AO COLENDO SUPERIOR TRIBUNAL DE JUSTIÇA"
        titulo_peca: "RECURSO ESPECIAL"
        hipoteses: "art. 105, III, a (nega vigência), b (declara inconstitucional), c (divergência)"
        nota_dissidio: "Se por divergência (alínea c): juntar certidão de acórdão divergente ou indicar repositório oficial"

      re:
        secoes:
          - "I. DA ADMISSIBILIDADE (cabimento constitucional + repercussão geral)"
          - "II. DA REPERCUSSÃO GERAL (demonstração obrigatória — art. 1.035 CPC)"
          - "III. DAS RAZÕES DE MÉRITO (violação da CF)"
          - "IV. DO PEDIDO"
        endereçamento: "AO EXCELSO SUPREMO TRIBUNAL FEDERAL"
        titulo_peca: "RECURSO EXTRAORDINÁRIO"
        repercussao_geral:
          obrigatorio: true
          fundamento: "art. 1.035 CPC"
          critérios: "relevância econômica, política, social ou jurídica que transcenda o interesse das partes"

    action: |
      1. Definir a estrutura correta conforme o tipo de recurso
      2. Redigir o endereçamento em NEGRITO + CAIXA ALTA
      3. Redigir o bloco de informações do processo
      4. Redigir a qualificação do recorrente com nome em NEGRITO + CAIXA ALTA
      5. Redigir o título da peça em NEGRITO + CAIXA ALTA
      6. Redigir I. DA ADMISSIBILIDADE — fundamentado nos arts. específicos do CPC
      7. Redigir II. DAS RAZÕES — por capítulo, com fundamentos em lei + jurisprudência
         (usar blocos de jurisprudência do jurisprudence-researcher se disponíveis)
      8. Redigir III. DO PEDIDO — específico: conhecer + prover + reforma/anulação
      9. Aplicar todas as regras de formatação do processual-writer:
         - NEGRITO + CAIXA ALTA: endereçamento, nome da parte, título da peça, seções
         - Negrito + Title Case: subseções
         - Negrito: artigos de lei, valores, prazos, conclusões jurídicas
         - Bloco recuado: citações de jurisprudência

  # ─────────────────────────────────────────────────────────
  # ETAPA 6 — QUALITY GATE
  # ─────────────────────────────────────────────────────────
  - id: E6
    name: Quality Gate — Formatação e Admissibilidade
    description: >
      Executar verificação final de qualidade antes da entrega.
    action: |
      1. Executar squads/legal/checklists/formatting-checklist.md (33 itens)
      2. Executar squads/legal/checklists/jurisprudence-gate.md para todas as citações
      3. Verificar:
         □ Admissibilidade verificada explicitamente na seção I
         □ Para AI: rol do art. 1.015 indicado expressamente
         □ Para REsp/RE: prequestionamento demonstrado
         □ Para ED: vício identificado com precisão
         □ Capítulos da sentença identificados e impugnados individualmente
         □ Tipo de erro (in judicando vs. in procedendo) identificado
         □ Pedido recursal específico (conhecer + prover + reforma/anulação)
         □ Prazo de urgência sinalizado (se ≤ 5 dias úteis)
      4. Retornar relatório: APROVADO / APROVADO COM RESSALVAS / REPROVADO

output_format:
  structure:
    - analise_admissibilidade: tabela com status de cada pressuposto
    - recurso_formatado: texto completo em Markdown
    - alertas_prazo: lista de urgências de prazo
    - relatorio_quality: resultado dos quality gates
    - campos_verificar: lista de dados de julgados a confirmar

quality_gates:
  - PASS: Admissibilidade verificada antes das razões (E2)
  - PASS: Para AI — rol do art. 1.015 verificado (E1)
  - PASS: Para REsp/RE — prequestionamento verificado (E3)
  - PASS: Capítulos da sentença identificados (E4)
  - PASS: Tipo de erro classificado (in judicando / in procedendo) (E4)
  - PASS: Pedido recursal específico (E5)
  - PASS: Formatação conforme formatting_rules (E5)
  - PASS: formatting-checklist.md executado (E6)
  - PASS: jurisprudence-gate.md executado para citações (E6)
  - BLOCK_IF: Recurso redigido sem verificação de admissibilidade (E2)
  - BLOCK_IF: REsp/RE sem verificação de prequestionamento (E3)
  - BLOCK_IF: AI interposto sobre decisão não listada no art. 1.015 sem alertar usuário
  - BLOCK_IF: campo de julgado fabricado sem marcador (anti-fabricação)
  - WARN_IF: Prazo ≤ 5 dias úteis sem sinalizar URGÊNCIA
  - WARN_IF: ED sem alertar sobre risco de multa por embargos protelatórios
```

---

## Guia Rápido — Tipos de Recurso

### Cabimento por Tipo de Decisão

| Decisão Judicial | Recurso Cabível | Prazo | Art. CPC |
|-----------------|----------------|-------|----------|
| Sentença de mérito | Apelação | 15 d. úteis | 1.009 |
| Sentença terminativa | Apelação | 15 d. úteis | 1.009 |
| Dec. interlocutória (rol) | Agravo de Instrumento | 15 d. úteis | 1.015 |
| Dec. monocrática relator | Agravo Interno | 15 d. úteis | 1.021 |
| Qualquer decisão com vício | Embargos de Declaração | 5 d. úteis | 1.022 |
| Acórdão TJ — questão federal | REsp | 15 d. úteis | 1.029 |
| Acórdão TJ — questão const. | RE | 15 d. úteis | 1.029 |

### Estrutura Mínima de Toda Peça Recursal

```
ENDEREÇAMENTO (NEGRITO + CAIXA ALTA)

QUALIFICAÇÃO DO RECORRENTE (nome em NEGRITO + CAIXA ALTA)

TÍTULO DO RECURSO (NEGRITO + CAIXA ALTA)

I. DA ADMISSIBILIDADE
   - Cabimento (por que esse recurso)
   - Tempestividade (prazo + contagem)
   - Preparo (se aplicável)
   - Legitimidade (parte sucumbente)

II. DAS RAZÕES RECURSAIS
   II.A. {Primeiro argumento — capítulo da sentença}
   II.B. {Segundo argumento} (se houver)

III. DO PEDIDO
   - Conhecimento do recurso
   - Provimento
   - Reforma ou Anulação + provimento do pedido original

Termos em que, pede deferimento.
{cidade, data, assinatura}
```
