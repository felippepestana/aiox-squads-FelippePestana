# handle-execution

> **Task:** Workflow para redação de peças de execução, cumprimento de sentença e defesas executivas
> **Squad:** legal | **Agent:** execution-specialist

---

## Task Definition

```yaml
task:
  name: handle-execution
  description: >
    Recebe informações sobre o processo de execução ou cumprimento de sentença
    e executa workflow de 6 etapas para redigir a peça adequada ao caso:
    requerimento de cumprimento, impugnação, embargos, exceção de pré-executividade
    ou incidente de desconsideração da personalidade jurídica.
  inputs:
    - tipo_execucao: string (cumprimento de sentença / execução extrajudicial / execução fiscal)
    - posicao_cliente: string (credor/exequente ou devedor/executado)
    - titulo_executivo: string (descrição do título — sentença, nota promissória, cheque, CDA, etc.)
    - valor_exequendo: string (valor cobrado pelo exequente)
    - documentos_disponiveis: list (documentos que o usuário tem)
    - fatos: string (narração dos fatos relevantes)
    - case_brief: object (opcional — Case Brief do case-analyst)
  outputs:
    - peca_formatada: string (texto da peça em Markdown)
    - demonstrativo_calculo: string (planilha de cálculo se alegado excesso)
    - analise_titulo: object (resultado da análise do título executivo)
    - alertas_prazo: list (alertas de urgência)
    - relatorio_quality: object (resultado dos quality gates)

steps:
  # ─────────────────────────────────────────────────────────
  # ETAPA 1 — CLASSIFICAÇÃO DO TIPO DE EXECUÇÃO
  # ─────────────────────────────────────────────────────────
  - id: E1
    name: Classificação do Tipo de Execução e Posição do Cliente
    description: >
      Identificar o tipo de execução, a posição do cliente e a peça
      adequada a ser redigida.
    action: |
      1A. TIPO DE TÍTULO EXECUTIVO
        □ Judicial (sentença, acórdão, decisão homologatória) → CUMPRIMENTO DE SENTENÇA
          - Arts. 523-527 CPC (quantia certa)
          - Arts. 536-540 CPC (obrigação de fazer/não fazer/entrega)
        □ Extrajudicial (cheque, nota promissória, contrato, escritura) → EXECUÇÃO EXTRAJUDICIAL
          - Art. 784 CPC — rol de títulos extrajudiciais
          - Arts. 824-925 CPC — procedimento
        □ Fiscal (CDA) → EXECUÇÃO FISCAL
          - Lei 6.830/80 (LEF)
          - Prazo especial de embargos: 30 dias após garantia do juízo

      1B. POSIÇÃO DO CLIENTE
        □ Credor/Exequente → Peças ofensivas:
          - Petição de cumprimento de sentença (art. 523 CPC)
          - Petição inicial de execução extrajudicial (art. 798 CPC)
          - Requerimento de penhora/bloqueio SISBAJUD
          - Pedido de expropriação (adjudicação ou alienação)
        □ Devedor/Executado → Peças defensivas:
          - Impugnação ao cumprimento de sentença (art. 525 CPC)
          - Embargos à execução extrajudicial (art. 915 CPC)
          - Embargos à execução fiscal (art. 16 LEF)
          - Exceção de pré-executividade (doutrina + STJ)
          - IDPJ — defesa do sócio (art. 135 CPC)

      1C. VERIFICAÇÃO DE URGÊNCIA
        □ Prazo de pagamento correndo? (15 dias — art. 523 CPC)
        □ Prazo de embargos/impugnação correndo? (15 dias — arts. 525, 915 CPC)
        □ Prazo de embargos fiscais correndo? (30 dias após garantia — art. 16 LEF)
        □ Bem penhorado em risco de alienação?
        □ Bloqueio SISBAJUD efetivado e gerando dano?
        Se sim a qualquer: sinalizar ⚠️ URGÊNCIA no output

    output: execucao_metadata (tipo, posição, peça recomendada, urgência)

  # ─────────────────────────────────────────────────────────
  # ETAPA 2 — ANÁLISE DO TÍTULO EXECUTIVO
  # ─────────────────────────────────────────────────────────
  - id: E2
    name: Análise do Título Executivo
    description: >
      Verificar a regularidade formal e material do título executivo.
      Identificar vícios que possam ser atacados na defesa executiva.
    requisitos_titulo:
      certeza: "Obrigação certa e determinada (sem condição não implementada)"
      liquidez: "Valor determinado ou determinável por simples cálculo aritmético"
      exigibilidade: "Obrigação vencida e não sujeita a condição ou termo"
      regularidade_formal: |
        Para cada tipo de título, verificar os requisitos formais específicos:
        - Sentença: trânsito em julgado (ou exequibilidade provisória)
        - Nota promissória: elementos do art. 75 da LUG (Lei Uniforme de Genebra)
        - Cheque: elementos do art. 1º Lei 7.357/85 + prazo de apresentação
        - Contrato: firma reconhecida + valor líquido (art. 784, III CPC)
        - CDA: requisitos do art. 202 CTN + art. 2º, § 5º LEF

    vicios_comuns:
      nulidade_titulo:
        exemplos:
          - "Nota promissória sem data de vencimento"
          - "Cheque sem data de emissão ou sem nome do beneficiário"
          - "Contrato sem firma reconhecida (extrajudicial)"
          - "CDA com descrição incorreta do fato gerador"
        defesa: "Exceção de pré-executividade (sem dilação probatória)"

      inexequibilidade:
        exemplos:
          - "Obrigação sujeita a condição não implementada"
          - "Prazo não vencido"
          - "Obrigação já extinta por pagamento, prescrição ou compensação"
        defesa: "Exceção de pré-executividade ou embargos/impugnação"

      prescricao:
        exemplos:
          - "Cheque: 6 meses da apresentação para ação executiva; 2 anos para monitória"
          - "Nota promissória: 3 anos (art. 70 LUG)"
          - "Sentença: 5 anos (art. 206, § 5º, I CC) — ⚠️ verificar prazo específico"
          - "Execução fiscal: 5 anos (art. 174 CTN)"
        defesa: "Exceção de pré-executividade (prescrição é matéria de ordem pública)"

    action: |
      Para o título executivo apresentado:
      1. Identificar o tipo de título
      2. Verificar os 3 requisitos (certeza, liquidez, exigibilidade)
      3. Verificar os requisitos formais específicos do tipo
      4. Identificar vícios atacáveis:
         a) Vícios formais (exceção de pré-executividade)
         b) Vícios de fundo sem dilação probatória (exceção de pré-executividade)
         c) Vícios que exigem prova (embargos ou impugnação)
      5. Verificar prescrição da pretensão executiva

    output: analise_titulo (certeza/liquidez/exigibilidade + vícios identificados + defesa recomendada)

  # ─────────────────────────────────────────────────────────
  # ETAPA 3 — VERIFICAÇÃO DO CÁLCULO
  # ─────────────────────────────────────────────────────────
  - id: E3
    name: Verificação e Elaboração do Cálculo
    description: >
      Verificar a correção do cálculo do exequente (se devedor) ou
      elaborar o demonstrativo de débito (se credor).
    componentes_calculo:
      principal:
        definicao: "Valor original da obrigação (capital)"
        verificar: "Correspondência com o valor do título/sentença"

      correcao_monetaria:
        indices_comuns:
          ipca_e: "Padrão nas relações civis gerais (STJ — ⚠️ verificar julgado)"
          inpc: "Relações de trabalho e alguns contratos"
          tr: "Contratos de financiamento imobiliário (CEF, SBPE)"
          selic: "Execuções fiscais (art. 161, § 1º CTN)"
        verificar: "Qual índice foi determinado na sentença ou no contrato?"
        marco_inicial: "Data do evento danoso (responsabilidade civil) ou vencimento (contratos)"

      juros_mora:
        taxa_legal: "1% ao mês (art. 406 CC c/c art. 161, § 1º CTN)"
        taxa_contratual: "Verificar se há cláusula contratual específica"
        marco_inicial_responsabilidade: "Citação (art. 405 CC)"
        marco_inicial_contratual: "Vencimento da obrigação"
        capitalizacao: "Simples (regra); composta apenas se expressamente prevista"

      multa_contratual:
        verificar: "Há previsão de multa moratória no contrato/título?"
        limite_cdc: "2% para contratos de consumo (art. 52, § 1º CDC)"
        limite_geral: "Verificar se há limitação legal"
        base_calculo: "Sobre qual valor incide a multa?"

      honorarios_advoc:
        sentenca: "Percentual fixado na sentença sobre o valor da condenação"
        cumprimento: "Honorários adicionais de 10% se não pago em 15 dias (art. 523, § 1º CPC)"
        nota: "Verificar se honorários já incluídos na planilha ou calculados separado"

    excesso_de_execucao:
      verificar_planilha_exequente:
        - "Índice de correção monetária está correto?"
        - "Taxa de juros está correta (1% am ou contratual)?"
        - "Data de início da correção e juros está correta?"
        - "Multa calculada sobre base correta e com percentual correto?"
        - "Honorários calculados conforme sentença?"
        - "Há valores inseridos que não constam do título?"
      demonstrativo_obrigatorio: |
        Se alegado excesso: OBRIGATÓRIO apresentar demonstrativo de cálculo próprio
        conforme art. 525, § 4º CPC.
        Formato: memória de cálculo discriminada por componente (principal + correção + juros + multa)

    action: |
      Para devedor:
      1. Comparar planilha do exequente com o título/sentença
      2. Recalcular cada componente com índices corretos
      3. Identificar eventuais excessos com localização precisa
      4. Elaborar demonstrativo de cálculo correto (obrigatório se alegado excesso)

      Para credor:
      1. Calcular o valor atual do débito
      2. Componentes: principal + correção monetária + juros + multa (se houver)
      3. Elaborar demonstrativo de cálculo para instrução da petição

    output: demonstrativo_calculo (planilha discriminada por componente)

  # ─────────────────────────────────────────────────────────
  # ETAPA 4 — ESTRATÉGIA DE DEFESA
  # ─────────────────────────────────────────────────────────
  - id: E4
    name: Estratégia de Defesa Executiva (para devedor)
    description: >
      Selecionar a defesa mais eficiente para o caso concreto.
    arvore_defesa:
      passo_1:
        pergunta: "O vício é formal/de ordem pública sem necessidade de prova?"
        exemplos: "Prescrição, decadência, nulidade formal do título, incompetência absoluta"
        sim:
          recomendacao: "Exceção de Pré-Executividade"
          vantagem: "Não exige garantia do juízo"
          prazo: "Qualquer momento"
          limite: "Apenas matérias cognoscíveis de ofício sem dilação probatória"
        nao: "Prosseguir para Passo 2"

      passo_2:
        pergunta: "É cumprimento de sentença (título judicial)?"
        sim:
          pergunta: "A penhora foi efetivada?"
          penhora_sim:
            recomendacao: "Impugnação ao Cumprimento de Sentença (art. 525 CPC)"
            prazo: "15 dias da intimação do auto de penhora e avaliação"
            hipoteses: "art. 525, § 1º, I a VII CPC"
            nota: "Hipóteses são TAXATIVAS — verificar enquadramento"
          penhora_nao:
            recomendacao: "Aguardar penhora para impugnar / verificar se há urgência"
            alternativa: "Exceção de pré-executividade se há vício formal"
        nao: "Prosseguir para Passo 3"

      passo_3:
        pergunta: "É execução de título extrajudicial?"
        sim:
          recomendacao: "Embargos à Execução (art. 915 CPC)"
          prazo: "15 dias da citação do executado"
          hipoteses: "art. 917, I a VI CPC (mais amplas que a impugnação)"
          nota: "art. 917, VI permite qualquer defesa admissível no processo de conhecimento"
          efeito_suspensivo: "Requer demonstração de risco + garantia do juízo (art. 919, § 1º CPC)"
        fiscal:
          recomendacao: "Embargos à Execução Fiscal (art. 16 LEF)"
          prazo: "30 dias após a garantia do juízo (penhora ou depósito)"
          hipoteses: "Matérias de direito material e processual + vícios da CDA"

      fundamentos_defesa_executiva:
        art_525_cpc:
          inciso_I: "Falta ou nulidade da citação se processo tramitou à revelia"
          inciso_II: "Ilegitimidade de parte"
          inciso_III: "Inexequibilidade do título ou inexigibilidade da obrigação"
          inciso_IV: "Penhora incorreta ou avaliação errônea"
          inciso_V: "Excesso de execução ou cumulação indevida de execuções"
          inciso_VI: "Incompetência absoluta ou relativa do juízo"
          inciso_VII: "Qualquer causa modificativa ou extintiva da obrigação (pagamento, remissão, novação, etc.)"
          nota: "Hipóteses TAXATIVAS para cumprimento de sentença (decisão judicial)"

        art_917_cpc:
          inciso_I: "Inexequibilidade do título ou inexigibilidade da obrigação"
          inciso_II: "Penhora incorreta ou avaliação errônea"
          inciso_III: "Excesso de execução ou cumulação indevida"
          inciso_IV: "Retenção por benfeitorias (obrigação de entrega de coisa)"
          inciso_V: "Incompetência absoluta ou relativa"
          inciso_VI: "Qualquer matéria que lhe seria lícito deduzir em processo de conhecimento"
          nota: "art. 917, VI é ABERTO para títulos extrajudiciais — mais amplo que art. 525"

    idpj_fundamentos:
      teoria_maior_cc:
        base: "art. 50 CC"
        para_desconsideracão_requer:
          - "Abuso da personalidade jurídica"
          - "Desvio de finalidade OU confusão patrimonial"
        para_defesa_do_socio:
          - "Ausência de abuso (mero inadimplemento não basta)"
          - "Separação patrimonial mantida (sem confusão)"
          - "Atividade empresarial regular (sem desvio de finalidade)"
      teoria_menor_cdc:
        base: "art. 28 CDC"
        para_desconsideracao: "Basta o inadimplemento + impossibilidade de satisfação"
        para_defesa: "Verificar se há relação de consumo que justifique a teoria menor"
      defesa_do_socio:
        estrategia: "Atacar os pressupostos da teoria aplicada ao caso"
        documentos: "Balanços, DRE, extratos bancários, declarações IR — separação patrimonial"

  # ─────────────────────────────────────────────────────────
  # ETAPA 5 — REDAÇÃO DA PEÇA
  # ─────────────────────────────────────────────────────────
  - id: E5
    name: Redação da Peça Executiva
    description: >
      Redigir a peça identificada nas etapas anteriores, aplicando todas
      as regras de formatação do processual-writer.
    estruturas:
      impugnacao_cumprimento:
        endereçamento: "AO JUÍZO DA {___} VARA {ESPECIALIDADE} DA COMARCA DE {___}"
        titulo: "IMPUGNAÇÃO AO CUMPRIMENTO DE SENTENÇA"
        secoes:
          - "I. DA ADMISSIBILIDADE (tempestividade + garantia do juízo)"
          - "II. DO(S) FUNDAMENTO(S) (por inciso do art. 525, § 1º CPC)"
          - "   II.A. {Excesso de execução / Penhora incorreta / etc.}"
          - "III. DO PEDIDO (provimento + limitação/extinção/liberação)"
        nota: "Incluir demonstrativo de cálculo em anexo se alegado excesso (art. 525, § 4º)"

      embargos_execucao:
        endereçamento: "AO JUÍZO DA {___} VARA {ESPECIALIDADE} DA COMARCA DE {___}"
        titulo: "EMBARGOS À EXECUÇÃO"
        secoes:
          - "I. DA ADMISSIBILIDADE (tempestividade)"
          - "II. DO(S) FUNDAMENTO(S) (por inciso do art. 917 CPC)"
          - "III. DO PEDIDO LIMINAR DE EFEITO SUSPENSIVO (se aplicável)"
          - "IV. DO PEDIDO PRINCIPAL (extinção/limitação da execução)"

      excecao_pre_executividade:
        titulo: "EXCEÇÃO DE PRÉ-EXECUTIVIDADE"
        secoes:
          - "I. DO CABIMENTO (matéria de ordem pública sem dilação probatória)"
          - "II. DO FUNDAMENTO (vício específico)"
          - "III. DO PEDIDO (extinção da execução)"
        nota_sem_garantia: "Mencionar que não exige garantia do juízo"

      requerimento_cumprimento_credor:
        titulo: "REQUERIMENTO DE CUMPRIMENTO DE SENTENÇA"
        secoes:
          - "I. DO TÍTULO E DO DÉBITO ATUALIZADO"
          - "II. DO DEMONSTRATIVO DE CÁLCULO"
          - "III. DO PEDIDO (citação/intimação do devedor + SISBAJUD/indicação de bens)"
        nota: "Incluir planilha de cálculo atualizada conforme sentença"

      idpj_requerimento:
        titulo: "REQUERIMENTO DE INSTAURAÇÃO DE INCIDENTE DE DESCONSIDERAÇÃO DA PERSONALIDADE JURÍDICA"
        secoes:
          - "I. DOS PRESSUPOSTOS LEGAIS (teoria aplicável)"
          - "II. DOS FATOS INDICATIVOS (confusão / desvio / abuso)"
          - "III. DO PEDIDO (instauração do incidente + citação dos sócios)"

      idpj_defesa:
        titulo: "MANIFESTAÇÃO DO SÓCIO NO INCIDENTE DE DESCONSIDERAÇÃO DA PERSONALIDADE JURÍDICA"
        secoes:
          - "I. DA AUSÊNCIA DOS PRESSUPOSTOS LEGAIS"
          - "   I.A. Da Inexistência de Abuso da Personalidade Jurídica"
          - "   I.B. Da Separação Patrimonial Mantida"
          - "II. DO PEDIDO (extinção do incidente)"

    action: |
      1. Selecionar a estrutura correta conforme E4
      2. Redigir conforme regras de formatação do processual-writer:
         - Endereçamento: NEGRITO + CAIXA ALTA
         - Nome da parte: NEGRITO + CAIXA ALTA
         - Título da peça: NEGRITO + CAIXA ALTA
         - Seções: algarismos romanos, centralizados, NEGRITO + CAIXA ALTA
         - Artigos: NEGRITO (número + nome da lei)
         - Valores: NEGRITO
         - Prazos: NEGRITO
      3. Incluir demonstrativo de cálculo se alegado excesso (art. 525, § 4º CPC)
      4. Fundamentar cada pedido em artigo específico
      5. Usar jurisprudência do jurisprudence-researcher (se disponível)
      6. Aplicar anti-fabricação em todas as citações jurisprudenciais

  # ─────────────────────────────────────────────────────────
  # ETAPA 6 — QUALITY GATE
  # ─────────────────────────────────────────────────────────
  - id: E6
    name: Quality Gate Final
    description: >
      Executar verificação final antes da entrega.
    action: |
      1. Executar squads/legal/checklists/formatting-checklist.md (33 itens)
      2. Executar squads/legal/checklists/qa-final-checklist.md
      3. Executar squads/legal/checklists/jurisprudence-gate.md para citações
      4. Verificar especificamente:
         □ Tipo de execução identificado corretamente (E1)
         □ Título analisado com requisitos verificados (E2)
         □ Tempestividade verificada (E4)
         □ Hipóteses legais de defesa mapeadas por artigo específico (E4)
         □ Demonstrativo de cálculo presente se alegado excesso (E3/E5)
         □ Pedido específico por fundamento (E5)
         □ Prazos de urgência sinalizados (E1)
         □ Nenhum dado de julgado fabricado (anti-fabricação)

output_format:
  structure:
    - peca_formatada: texto completo da peça em Markdown
    - demonstrativo_calculo: planilha discriminada (se excesso alegado)
    - analise_titulo: resultado da análise do título executivo
    - alertas_prazo: lista de urgências (ex: prazo expira em X dias)
    - relatorio_quality: checklist PASS/FAIL dos quality gates

quality_gates:
  - PASS: Tipo de execução identificado (E1)
  - PASS: Título executivo analisado com requisitos (E2)
  - PASS: Tempestividade da defesa verificada (E4)
  - PASS: Hipóteses legais mapeadas por artigo específico (E4)
  - PASS: Demonstrativo de cálculo elaborado quando alegado excesso (E3)
  - PASS: Pedido específico com fundamento legal por item (E5)
  - PASS: Formatação aplicada (E5)
  - PASS: formatting-checklist.md executado (E6)
  - PASS: jurisprudence-gate.md executado para citações (E6)
  - BLOCK_IF: Defesa redigida sem verificar tempestividade
  - BLOCK_IF: Excesso alegado sem demonstrativo de cálculo (art. 525, § 4º CPC)
  - BLOCK_IF: Embargos fiscais sem verificação da garantia do juízo
  - BLOCK_IF: Campo de julgado fabricado sem marcador
  - WARN_IF: Prazo ≤ 3 dias sem sinalizar URGÊNCIA MÁXIMA
  - WARN_IF: IDPJ sem identificar teoria (maior vs. menor)
```

---

## Guia Rápido — Defesas Executivas

### Escolha da Defesa pelo Tipo de Vício

| Tipo de Vício | Defesa Recomendada | Garantia Exigida? | Prazo |
|--------------|-------------------|-------------------|-------|
| Vício formal grave sem prova | Exceção de Pré-Exec. | Não | Qualquer momento |
| Prescrição | Exceção de Pré-Exec. | Não | Qualquer momento |
| Excesso de execução (judicial) | Impugnação art. 525 | Já há penhora | 15 d. pós-penhora |
| Penhora incorreta | Impugnação art. 525 | Já há penhora | 15 d. pós-penhora |
| Defesa ampla (extrajudicial) | Embargos art. 915 | Não obrigatória | 15 d. da citação |
| Defesa fiscal | Embargos LEF art. 16 | Obrigatória | 30 d. da garantia |

### Ordem de Análise para o Especialista

```
Receber o caso de execução
         ↓
Classificar: judicial / extrajudicial / fiscal
         ↓
Verificar tempestividade ← urgência?
         ↓
Analisar o título (certeza, liquidez, exigibilidade)
         ↓
Identificar vícios formais → Exceção de Pré-Executividade?
         ↓
Verificar o cálculo → Excesso?
         ↓
Identificar defesas por artigo (525 ou 917 CPC)
         ↓
Redigir + demonstrativo de cálculo + formatação
         ↓
Quality Gates
```
