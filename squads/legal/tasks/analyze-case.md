# analyze-case

> **Task:** Diagnóstico processual completo de caso jurídico com entrega de Case Brief estruturado
> **Squad:** legal | **Agent:** case-analyst

---

## Task Definition

```yaml
task:
  name: analyze-case
  description: >
    Recebe os fatos brutos de um caso jurídico e executa diagnóstico processual
    completo em 6 etapas, entregando um Case Brief estruturado com tipo de demanda,
    rito processual, competência, cronologia dos fatos, teses jurídicas,
    riscos processuais e recomendação de próximo agente.
  inputs:
    - fatos_brutos: string (narração dos fatos pelo usuário — pode ser desorganizada)
    - tipo_peca_desejada: string (opcional — petição inicial, contestação, recurso, etc.)
    - documentos_mencionados: list (documentos que o usuário menciona ter)
  outputs:
    - case_brief: object (Case Brief completo conforme templates/case-brief-tmpl.md)
    - recommended_agent: string (próximo agente a acionar)
    - recommended_piece: string (tipo de peça a ser redigida)
    - urgency_flag: boolean (se há urgência processual — tutela, prazo correndo)

steps:
  # ─────────────────────────────────────────────────────────
  # ETAPA 1 — INTAKE E VERIFICAÇÃO DE SUFICIÊNCIA
  # ─────────────────────────────────────────────────────────
  - id: E1
    name: Intake e Verificação de Suficiência dos Fatos
    description: >
      Receber os fatos brutos do usuário e verificar se há informações mínimas
      para realizar o diagnóstico completo. Identificar lacunas e solicitar
      complementação antes de prosseguir.
    minimum_required_elements:
      - partes: "Pelo menos identificação parcial de quem é o cliente e quem é a contraparte"
      - fato_gerador: "Qual é o evento que origina a demanda (inadimplemento, ato ilícito, etc.)"
      - objetivo: "O que o cliente quer (ajuizar ação, se defender, recorrer, etc.)"
      - contexto_temporal: "Alguma indicação de data ou período relevante"
    action: |
      1. Ler todos os fatos fornecidos pelo usuário na íntegra
      2. Verificar se os 4 elementos mínimos estão presentes
      3. Se elementos ausentes:
         - Listar especificamente o que falta
         - Solicitar ao usuário de forma objetiva
         - NÃO prosseguir com análise baseada em suposições
      4. Se elementos suficientes: prosseguir para E2
    output: intake_report (elementos presentes / ausentes / solicitação de complementação)

  # ─────────────────────────────────────────────────────────
  # ETAPA 2 — CLASSIFICAÇÃO DA DEMANDA
  # ─────────────────────────────────────────────────────────
  - id: E2
    name: Classificação da Demanda
    description: >
      Identificar o tipo de ação, o rito processual aplicável, a competência do juízo
      e o valor estimado da causa.
    action: |
      2A. TIPO DE AÇÃO
        Classificar quanto ao provimento jurisdicional buscado:
        - Condenatória: pretende condenação do réu a pagar/fazer/não fazer
        - Constitutiva: pretende criar, modificar ou extinguir relação jurídica
        - Declaratória: pretende declarar existência/inexistência de relação jurídica
        - Mandamental: pretende ordem judicial de fazer/não fazer imediata
        - Executiva lato sensu: pretende entrega imediata de bem ou coisa

      2B. MATÉRIA JURÍDICA PRINCIPAL
        Identificar o ramo do direito material:
        - Responsabilidade civil (contratual ou extracontratual)
        - Direito do consumidor (CDC — Lei 8.078/1990)
        - Direito contratual (inadimplemento, nulidade, revisão)
        - Direito de família (alimentos, guarda, divórcio)
        - Execução/cumprimento de sentença
        - Direito empresarial (desconsideração, recuperação, falência)
        - Outros (especificar)

      2C. RITO PROCESSUAL
        Determinar o rito aplicável:
        - Procedimento Comum (art. 318 CPC) — regra geral
        - Procedimento Especial (arts. 539-770 CPC) — se lei especial
        - Juizado Especial Cível (Lei 9.099/95) — até 40 SM + pessoa física/ME/EPP
        - Juizado Especial Federal (Lei 10.259/01) — até 60 SM + entidade federal
        - Cumprimento de Sentença (arts. 523-527 CPC) — título judicial
        - Execução de Título Extrajudicial (arts. 824-925 CPC) — título extrajudicial
        - Execução Fiscal (Lei 6.830/80) — CDA
        - Mandado de Segurança (Lei 12.016/09) — ato ilegal de autoridade
        - Ação Popular (Lei 4.717/65) — ato lesivo ao patrimônio público
        - Habeas Corpus / Habeas Data — direitos fundamentais específicos

      2D. COMPETÊNCIA
        Determinar o juízo competente (usar árvore de decisão abaixo)

      2E. VALOR DA CAUSA
        Estimar o valor da causa:
        - Condenatória: soma dos pedidos (art. 292, I CPC)
        - Declaratória/Constitutiva: valor econômico do bem/direito (art. 292, V CPC)
        - Execução: valor do débito + encargos (art. 292, VII CPC)
        - JEC: verificar se valor ≤ 40 SM (estadual) ou 60 SM (federal)

    output: demanda_metadata (tipo, matéria, rito, competência, valor_estimado)

  # ─────────────────────────────────────────────────────────
  # ÁRVORE DE DECISÃO — COMPETÊNCIA
  # ─────────────────────────────────────────────────────────
  arvore_competencia:
    passo_1_justica_especializada:
      pergunta: "É causa de Justiça especializada?"
      trabalhista: "Relação de emprego/trabalho (art. 114 CF) → Justiça do Trabalho [FORA DO ESCOPO v1.0]"
      eleitoral: "Matéria eleitoral → Justiça Eleitoral [FORA DO ESCOPO]"
      militar: "Crime militar → Justiça Militar [FORA DO ESCOPO]"
      nao: "Prosseguir para Passo 2"

    passo_2_federal_estadual:
      pergunta: "É causa de competência da Justiça Federal? (art. 109 CF)"
      criterios_sim:
        - "Parte: União, autarquia federal, empresa pública federal"
        - "Mandado de segurança contra autoridade federal"
        - "Causa fundada em tratado ou convenção internacional"
        - "Questão indígena (art. 109, XI CF)"
      excecoes_para_estadual:
        - "Acidente de trabalho — Súmula 501 STF (⚠️ VERIFICAR vigência)"
        - "Falência e insolvência civil"
        - "Causas previdenciárias em comarcas sem vara federal (art. 109, § 3º CF)"
      resultado_federal: "Seção Judiciária da Justiça Federal"
      resultado_estadual: "Prosseguir para Passo 3"

    passo_3_juizado_especial:
      pergunta: "Pode tramitar nos Juizados Especiais?"
      jec_estadual:
        valor: "Até 40 SM"
        partes: "Pessoa física, ME, EPP"
        excluidas: "Causas de natureza alimentar, falimentar, fiscal, execução de título extrajudicial"
        advogado: "Facultativo até 20 SM; obrigatório acima"
        nota: "JEC é opcional — cabe ao autor escolher entre JEC e vara cível comum"
      jec_federal:
        valor: "Até 60 SM"
        partes: "Qualquer (exceto incapazes)"
        materia: "Causas contra entidades federais"
      resultado: "Identificar opção e recomendar conforme complexidade e prazo"

    passo_4_vara_especializada:
      pergunta: "Há vara especializada na comarca?"
      familias: "Ações de família (alimentos, divórcio, guarda, tutela, adoção)"
      execucao_fiscal: "Cobrança de tributos — vara de fazenda pública"
      falencias: "Falência, recuperação judicial — vara de falências"
      infancia_juventude: "Causas envolvendo crianças e adolescentes"
      civel_comum: "Demais causas cíveis sem vara especializada"

    passo_5_competencia_territorial:
      pergunta: "Qual o foro competente?"
      regra_geral: "Domicílio do réu (art. 46 CPC)"
      excecoes:
        consumidor: "Domicílio do consumidor/autor (art. 101, I CDC)"
        responsabilidade_civil: "Local do ato ou fato (art. 53, IV CPC)"
        imovel: "Situação do imóvel (art. 47 CPC)"
        alimentar: "Domicílio do alimentando (art. 53, II CPC)"
        contrato: "Local de cumprimento se eleito (art. 63 CPC)"

  # ─────────────────────────────────────────────────────────
  # ETAPA 3 — CRONOLOGIA DOS FATOS
  # ─────────────────────────────────────────────────────────
  - id: E3
    name: Ordenação Cronológica dos Fatos
    description: >
      Reorganizar os fatos fornecidos pelo usuário em ordem cronológica rigorosa,
      identificando a relevância processual de cada fato e os documentos que o comprovam.
    action: |
      1. Extrair todos os fatos mencionados pelo usuário
      2. Atribuir data a cada fato (ou "data não informada")
      3. Ordenar cronologicamente (mais antigo ao mais recente)
      4. Para cada fato, identificar:
         a) Data (ou período)
         b) Descrição objetiva do fato
         c) Relevância processual (alta: elemento do tipo jurídico / média: contexto / baixa: periférico)
         d) Documento comprobatório mencionado (se houver)
      5. Destacar com ⚠️ os fatos que precisam de prova e que o usuário não mencionou ter
      6. Identificar o fato gerador central da demanda
    output: |
      ## Cronologia dos Fatos
      | # | Data | Fato | Relevância | Prova Disponível |
      |---|------|------|------------|-----------------|
      | 1 | {data} | {fato} | Alta/Média/Baixa | {documento ou ⚠️ VERIFICAR} |

  # ─────────────────────────────────────────────────────────
  # ETAPA 4 — IDENTIFICAÇÃO DE TESES JURÍDICAS
  # ─────────────────────────────────────────────────────────
  - id: E4
    name: Identificação e Hierarquização das Teses Jurídicas
    description: >
      Identificar as teses jurídicas viáveis ao caso — tanto para o polo ativo
      quanto para o polo passivo — e hierarquizá-las por força jurídica.
    action: |
      4A. IDENTIFICAR ELEMENTOS DO TIPO JURÍDICO
        Para cada matéria identificada (responsabilidade civil, contrato, etc.):
        - Listar os elementos constitutivos do tipo
        - Verificar quais elementos estão presentes nos fatos narrados
        - Identificar quais precisam ser provados
        Exemplo — Responsabilidade Civil (art. 186 CC):
        □ Ato ilícito — presente nos fatos? Qual?
        □ Dano — presente nos fatos? Qual?
        □ Nexo de causalidade — presente nos fatos? Como demonstrar?

      4B. TESE PRINCIPAL
        Melhor fundamento para o pedido principal:
        - Artigo(s) de lei aplicável(is) — identificar literalmente
        - Princípio jurídico que sustenta a tese (boa-fé, equilíbrio contratual, etc.)
        - Súmula ou enunciado que consolida a tese (se houver — ⚠️ sempre verificar vigência)
        - Força da tese: FORTE / MODERADA / FRACA
        - Nível de consolidação: PACIFICADA NO STJ / CONTROVERTIDA / EM FORMAÇÃO

      4C. TESES SUBSIDIÁRIAS (em ordem decrescente de força)
        Para cada tese subsidiária:
        - Fundamento legal
        - Relação com o pedido principal ou alternativo
        - Força comparativa (mais fraca que a principal, mas viável)

      4D. TESES ADVERSÁRIAS PROVÁVEIS (se usuário for autor)
        Antecipar argumentos do réu:
        - Principal tese defensiva esperada
        - Como refutar cada uma
        - Risco de procedência da tese adversária

      4E. TESES DE DEFESA (se usuário for réu)
        Identificar fundamentos defensivos:
        - Prescrição ou decadência
        - Ausência de elemento do tipo (falta de ato ilícito, dano, nexo)
        - Excludentes de responsabilidade (caso fortuito, força maior, culpa exclusiva)
        - Vícios do processo (incompetência, ilegitimidade, ausência de interesse de agir)

    output: |
      ## Teses Jurídicas
      ### Tese Principal
      - **Fundamento:** art. {X} da {Lei}
      - **Elementos presentes:** {lista}
      - **Força:** FORTE/MODERADA/FRACA
      - **Status:** PACIFICADA/CONTROVERTIDA/EM FORMAÇÃO

      ### Teses Subsidiárias
      1. {descrição} — Fundamento: art. {X} da {Lei} — Força: {nível}
      2. {descrição} — Fundamento: art. {X} da {Lei} — Força: {nível}

  # ─────────────────────────────────────────────────────────
  # ETAPA 5 — MAPEAMENTO DE RISCOS
  # ─────────────────────────────────────────────────────────
  - id: E5
    name: Mapeamento e Avaliação de Riscos Processuais
    description: >
      Identificar todos os riscos processuais relevantes ao caso, avaliando
      probabilidade, impacto e estratégia de mitigação para cada um.
    riscos_a_verificar:
      prescricao_decadencia:
        pergunta: "O prazo prescricional ou decadencial ainda está em curso?"
        verificar:
          - Data do fato gerador (dies a quo)
          - Prazo aplicável (CC art. 205-206, CDC art. 27, CPC art. 975, etc.)
          - Se houve causa interruptiva ou suspensiva
        impacto: ALTO — inadmissibilidade/improcedência

      competencia:
        pergunta: "O juízo escolhido é o competente?"
        tipos:
          absoluta: "Incompetência absoluta — pode ser arguida a qualquer tempo"
          relativa: "Incompetência relativa — deve ser arguida na contestação"
        impacto: MÉDIO a ALTO — remessa ou nulidade

      legitimidade_ativa:
        pergunta: "O cliente tem legitimidade para propor a ação?"
        verificar: "Titularidade do direito material ou substituição processual"
        impacto: ALTO — extinção sem mérito (art. 485, VI CPC)

      legitimidade_passiva:
        pergunta: "O réu escolhido é o responsável pelo direito material?"
        verificar: "Correspondência entre autor do ato ilícito e réu da ação"
        impacto: ALTO — extinção ou reforma

      interesse_de_agir:
        pergunta: "Há necessidade e adequação da via judicial escolhida?"
        verificar:
          - "Necessidade: o cliente já tentou resolver extrajudicialmente?"
          - "Adequação: o tipo de ação é adequado ao direito material?"
        impacto: MÉDIO — extinção sem mérito se ausente

      coisa_julgada:
        pergunta: "Há decisão transitada em julgado sobre o mesmo pedido e causa de pedir?"
        verificar: "Mesmas partes + mesmo pedido + mesma causa de pedir"
        impacto: ALTO — extinção do processo

      ausencia_de_prova:
        pergunta: "O cliente tem provas dos fatos constitutivos do seu direito?"
        verificar: "Documentos, testemunhas, perícias necessárias"
        impacto: ALTO — improcedência por falta de prova

      sumula_385_stj:
        pergunta: "(Se negativação) Há outras inscrições legítimas no cadastro do cliente?"
        verificar: "Súmula 385 STJ — outras negativações afastam o dano in re ipsa"
        impacto: ALTO — improcedência do pedido de dano moral

      urgencia_processual:
        pergunta: "Há situação de urgência que exige tutela imediata?"
        verificar:
          - Prazo de protocolo correndo
          - Bem ou direito em risco de dano irreparável
          - Necessidade de medida liminar/antecipada
        impacto: CRÍTICO — se não identificado, pode gerar perda de direito

    output: |
      ## Tabela de Riscos Processuais
      | Risco | Probabilidade | Impacto | Mitigação Recomendada |
      |-------|---------------|---------|----------------------|
      | {risco} | Alta/Média/Baixa | Alto/Médio/Baixo | {ação concreta} |

  # ─────────────────────────────────────────────────────────
  # ETAPA 6 — ENTREGA DO CASE BRIEF
  # ─────────────────────────────────────────────────────────
  - id: E6
    name: Montagem e Entrega do Case Brief
    description: >
      Compilar todas as análises das etapas anteriores no formato padronizado
      do Case Brief, conforme templates/case-brief-tmpl.md.
    action: |
      1. Montar o Case Brief com todos os campos obrigatórios
      2. Verificar que nenhuma informação foi fabricada
         (campos sem informação → [INSERIR: campo])
      3. Identificar o próximo agente e peça recomendada
      4. Sinalizar urgência se houver (⚠️ flag de urgência)
      5. Indicar documentos ainda necessários
      6. Entregar o Case Brief formatado ao usuário
    output: case_brief_completo (conforme case-brief-tmpl.md)

output_format:
  template: squads/legal/templates/case-brief-tmpl.md
  sections_obrigatorias:
    - identificacao: "Cabeçalho com identificação do caso e data"
    - classificacao: "Tipo, rito, competência, valor"
    - partes: "Polo ativo e passivo com qualificação sumária"
    - cronologia: "Tabela com fatos em ordem cronológica"
    - teses: "Tese principal + subsidiárias com fundamentos legais"
    - riscos: "Tabela de riscos com probabilidade, impacto e mitigação"
    - pedidos: "Pedidos recomendados em ordem de relevância"
    - documentos: "Lista de documentos necessários com status"
    - handoff: "Próximo agente + peça a redigir"

quality_gates:
  - PASS: Case Brief contém todos os campos obrigatórios
  - PASS: Tese principal tem fundamento legal (artigo + lei)
  - PASS: Tabela de riscos preenchida com probabilidade e mitigação
  - PASS: Competência definida com fundamentação legal
  - PASS: Urgência identificada e sinalizada (⚠️) quando presente
  - PASS: Handoff indicado com agente e tipo de peça
  - BLOCK_IF: Fatos fabricados pelo analista (não fornecidos pelo usuário)
  - BLOCK_IF: Tese apresentada sem fundamento legal
  - BLOCK_IF: Campos críticos ausentes sem [INSERIR: campo]
  - WARN_IF: Prazo processual correndo — urgência não sinalizada
  - WARN_IF: Risco de prescrição/decadência não avaliado
```

---

## Guia de Referência — Classificação de Ritos

### Escolha do Rito Processual

| Situação | Rito | Base Legal |
|----------|------|------------|
| Demanda cível geral | Procedimento Comum | art. 318 CPC |
| Consignação em pagamento | Procedimento Especial | arts. 539-549 CPC |
| Possessórias (reintegração, manutenção, interdito) | Procedimento Especial | arts. 554-568 CPC |
| Mandado de segurança | MS | Lei 12.016/09 |
| Até 40 SM — pessoa física | JEC Estadual | Lei 9.099/95 |
| Até 60 SM — entidade federal | JEC Federal | Lei 10.259/01 |
| Cumprimento de sentença | Execução Judicial | arts. 523-527 CPC |
| Execução extrajudicial | Execução Extrajudicial | arts. 824-925 CPC |
| Execução Fiscal | LEF | Lei 6.830/80 |

### Prescrição — Resumo Rápido

| Matéria | Prazo | Base Legal |
|---------|-------|------------|
| Responsabilidade civil extracontratual | 3 anos | art. 206, § 3º, V CC |
| Dívidas em geral | 5 anos | art. 206, § 5º, I CC |
| Regra geral | 10 anos | art. 205 CC |
| Mandado de Segurança | 120 dias | art. 23 Lei 12.016/09 |
| Ação Rescisória | 2 anos | art. 975 CPC |
| CDC — responsabilidade por vício | 5 anos | art. 27 CDC |
