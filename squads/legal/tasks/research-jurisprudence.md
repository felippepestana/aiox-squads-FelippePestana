# research-jurisprudence

> **Task:** Pesquisa, sistematização e formatação de precedentes jurisprudenciais
> **Squad:** legal | **Agent:** jurisprudence-researcher

---

## Task Definition

```yaml
task:
  name: research-jurisprudence
  description: >
    Recebe temas jurídicos identificados no Case Brief e executa pesquisa
    sistemática de precedentes, formatando blocos de citação verificados
    com referências completas. Nunca fabrica dados de julgados.
  inputs:
    - temas: list (temas jurídicos a pesquisar — extraídos do Case Brief)
    - tribunal_prioritario: string (opcional — STJ, TJSP, STF, etc.)
    - tipo_peca: string (opcional — para calibrar profundidade da pesquisa)
    - dados_julgados: list (opcional — julgados já identificados pelo usuário)
  outputs:
    - blocos_jurisprudencia: list (blocos formatados conforme jurisprudence-block-tmpl.md)
    - hierarquia_mapeada: object (hierarquia de precedentes por tribunal)
    - status_tese: string (PACIFICADA / CONTROVERTIDA / EM FORMAÇÃO)
    - alertas: list (campos com ⚠️ VERIFICAR + aviso B-04 quando aplicável)

dependencies_obrigatorias:
  - squads/legal/tasks/verify-citations.md       # CARREGAR ANTES DE EXECUTAR
  - squads/legal/checklists/jurisprudence-gate.md
  - squads/legal/data/citation-integrity-protocol.md

steps:
  # ─────────────────────────────────────────────────────────
  # PRÉ-REQUISITO: CARREGAR DEPENDÊNCIAS
  # ─────────────────────────────────────────────────────────
  - id: P0
    name: Carregamento Obrigatório de Dependências
    action: >
      ANTES de qualquer outra etapa, carregar obrigatoriamente:
      1. squads/legal/tasks/verify-citations.md
      2. squads/legal/checklists/jurisprudence-gate.md
      3. squads/legal/data/citation-integrity-protocol.md
      NUNCA pular este passo. NUNCA formatar citação sem executar verify-citations.md.
    bloqueio: "BLOCK_IF: qualquer etapa de formatação executada sem carregar as dependências"

  # ─────────────────────────────────────────────────────────
  # ETAPA 1 — EXTRAÇÃO E MAPEAMENTO DE TEMAS
  # ─────────────────────────────────────────────────────────
  - id: E1
    name: Extração de Temas do Case Brief
    description: >
      Identificar os temas jurídicos que precisam de fundamento jurisprudencial,
      extraídos das teses identificadas no Case Brief.
    action: |
      1. Ler as teses jurídicas identificadas no Case Brief
      2. Para cada tese, extrair o(s) tema(s) jurídico(s) correspondentes
         Exemplo:
         Tese: "Dano moral in re ipsa por negativação indevida"
         Temas: (a) negativação indevida + dano moral, (b) dano in re ipsa, (c) quantum indenizatório
      3. Identificar subtemas relevantes:
         - Há excludentes a refutar? (tema adicional)
         - Há tese adversária a antecipar? (tema adicional)
         - Há questão de admissibilidade processual? (tema adicional)
      4. Priorizar temas por importância argumentativa
      5. Identificar se há súmula/enunciado vinculante sobre cada tema (verificar antes de afirmar)
    output: |
      ## Temas para Pesquisa
      1. Tema Principal: {descrição} — Relevância: ALTA
      2. Tema Secundário: {descrição} — Relevância: MÉDIA
      3. Tema de Suporte: {descrição} — Relevância: BAIXA

  # ─────────────────────────────────────────────────────────
  # ETAPA 2 — MAPEAMENTO DA HIERARQUIA
  # ─────────────────────────────────────────────────────────
  - id: E2
    name: Mapeamento da Hierarquia de Precedentes
    description: >
      Para cada tema, mapear a hierarquia de precedentes disponíveis,
      identificando o nível de vinculação (obrigatório vs. persuasivo)
      e o status da tese em cada tribunal.
    hierarchy_levels:
      nivel_1_vinculante:
        descricao: "Precedentes de observância obrigatória (arts. 926-927 CPC)"
        exemplos:
          - "Súmulas vinculantes do STF (art. 103-A CF)"
          - "Teses fixadas em repercussão geral (STF) — Tema nº XXX"
          - "Teses fixadas em recursos repetitivos (STJ) — Tema nº XXX"
          - "Acórdãos do STF em controle concentrado (ADI, ADC, ADPF)"
          - "IRDR — Incidente de Resolução de Demandas Repetitivas"
          - "IAC — Incidente de Assunção de Competência"
        acao: "SEMPRE pesquisar primeiro — se houver, é o argumento principal"

      nivel_2_persuasivo_forte:
        descricao: "Súmulas dos tribunais superiores (STF e STJ)"
        exemplos:
          - "Súmulas do STF (sem efeito vinculante, mas alta autoridade)"
          - "Súmulas do STJ"
          - "Acórdãos das Turmas do STF/STJ (não em repetitivos)"
        acao: "Usar como segundo nível — alta autoridade nas peças"

      nivel_3_persuasivo_regional:
        descricao: "Jurisprudência dos TJs e TRFs"
        exemplos:
          - "Súmulas dos TJs (TJSP, TJRJ, TJMG, etc.)"
          - "Acórdãos das Câmaras Especializadas dos TJs"
        acao: "Usar para reforço regional — especialmente no TJ da comarca do processo"

      nivel_4_referencial:
        descricao: "Decisões de primeira instância"
        uso: "Apenas como referência contextual — nunca como principal fundamento"
        alerta: "Não usar como representativo de entendimento consolidado"

    action: |
      Para cada tema:
      1. Verificar se há IRDR, recurso repetitivo ou RG sobre o tema
         (se sim → mencionar o Tema nº e a tese fixada, com ⚠️ VERIFICAR)
      2. Verificar se há súmula aplicável (STF ou STJ) — com ⚠️ VERIFICAR
      3. Identificar as turmas do STJ mais prolíficas sobre o tema
         (1ª/2ª Turmas: Direito Público | 3ª/4ª Turmas: Direito Privado)
      4. Identificar câmaras do TJ local mais relevantes (quando aplicável)
      5. Mapear status da tese: PACIFICADA / CONTROVERTIDA / EM FORMAÇÃO
    output: hierarquia_mapeada (por tribunal + status da tese)

  # ─────────────────────────────────────────────────────────
  # ETAPA 3 — ESTRATÉGIA DE PESQUISA POR TRIBUNAL
  # ─────────────────────────────────────────────────────────
  - id: E3
    name: Estratégia de Pesquisa por Tribunal
    description: >
      Definir a estratégia de pesquisa específica para cada tribunal
      relevante ao tema.
    estrategias:
      stf:
        repositorio: "https://portal.stf.jus.br/jurisprudencia/"
        palavras_chave: "Tema + 'repercussão geral' ou 'ADI' ou 'súmula vinculante'"
        filtros: "Tipo: Acórdão / Monocrática; Pesquisar por Tema (nº do Tema RG)"
        preferir: "Teses de repercussão geral fixadas (Tema nº) > Acórdãos do Plenário"
        alerta: "Verificar se o Tema RG foi finalizado (tese fixada) ou apenas reconhecido"

      stj:
        repositorio: "https://processo.stj.jus.br/jurisprudencia/"
        palavras_chave: "Tema + turma relevante + 'repetitivo' se aplicável"
        filtros: "Pesquisar por: Ementa; Tipo: Acórdão; Órgão: Turma relevante"
        preferir: "Recursos Repetitivos (Tema nº) > Súmulas > Acórdãos recentes de Turma"
        turmas_privado: "3ª e 4ª Turmas — direito civil, consumidor, contratos, família"
        turmas_publico: "1ª e 2ª Turmas — direito público, tributário, administrativo"

      tj:
        repositorio_sp: "https://esaj.tjsp.jus.br/cjsg/consultaCompleta.do"
        palavras_chave: "Tema + câmara especializada"
        preferir: "Súmulas do TJ > Acórdãos das câmaras especializadas > Acórdãos gerais"
        filtros: "Câmara: especializada no tema; Data: últimos 5 anos (preferencial)"
        alerta: "Verificar se câmara alterou entendimento recentemente"

    action: |
      Para cada tema identificado em E1:
      1. Definir qual tribunal tem maior autoridade sobre o tema
      2. Indicar palavras-chave e filtros de pesquisa para cada tribunal
      3. Indicar URL específica do repositório
      4. Classificar os julgados a serem pesquisados por ordem de relevância
      NOTA: O pesquisador LLM indica a estratégia e formata os julgados fornecidos
      pelo usuário. Nunca afirma ter pesquisado em repositório online.

  # ─────────────────────────────────────────────────────────
  # ETAPA 4 — FORMATAÇÃO DOS BLOCOS
  # ─────────────────────────────────────────────────────────
  - id: E4
    name: Formatação dos Blocos de Jurisprudência
    description: >
      Formatar cada julgado no padrão blockquote + itálico conforme
      templates/jurisprudence-block-tmpl.md, com marcadores de verificação.
    pre_requisito: "verify-citations.md deve ter sido executado (P0)"
    action: |
      Para cada julgado (fornecido pelo usuário ou do treinamento do LLM):

      PASSO 4A: Classificar cada campo
        Tribunal:         CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Órgão julgador:   CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Tipo do recurso:  CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Número:           CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        UF de origem:     CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Relator:          CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Data julgamento:  CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Data publicação:  CONFIRMADO / NAO_CONFIRMADO / AUSENTE
        Trecho ementa:    LITERAL (usuário forneceu) / PARAFRASEADO / AUSENTE

      PASSO 4B: Executar jurisprudence-gate.md grupos G1-G5

      PASSO 4C: Aplicar formatação conforme resultado
        LIBERADA → bloco limpo sem marcadores
        LIBERADA COM RESSALVAS → bloco com ⚠️ VERIFICAR nos campos não confirmados + aviso B-04
        BLOQUEADA → [INSERIR: campo] nos campos ausentes + aviso B-04 + nunca inventar valor

      PASSO 4D: Formatar no padrão
        > *"{trecho literal da ementa}"*
        >
        > ({Tribunal}, {órgão}, {tipo} nº {número}/{UF}, Rel. {relator},
        > j. {data julgamento}, {publicação} {data publicação})

      REGRAS ABSOLUTAS DE FORMATAÇÃO:
        - Ementa entre aspas SOMENTE se texto foi fornecido literalmente
        - Paráfrase não vai entre aspas — sinalizar como "(paráfrase — localizar texto literal)"
        - Campos NAO_CONFIRMADOS: marcar com ⚠️ VERIFICAR antes do valor
        - Campos AUSENTES: substituir por [INSERIR: nome do campo]
        - NUNCA inventar número de processo, mesmo que "plausível"
        - NUNCA inferir relator por turma frequente sem marcar ⚠️ VERIFICAR

  # ─────────────────────────────────────────────────────────
  # ETAPA 5 — VERIFICAÇÃO ANTI-FABRICAÇÃO
  # ─────────────────────────────────────────────────────────
  - id: E5
    name: Gate de Verificação Anti-Fabricação
    description: >
      Executar verificação completa de integridade de cada citação
      antes da entrega ao agente de redação.
    action: |
      Para cada bloco formatado em E4:

      1. Executar jurisprudence-gate.md grupos G1-G5 (obrigatório — já executado em E4)
      2. Verificar:
         □ Nenhum campo de julgado gerado pela IA sem marcador
         □ Nenhuma ementa inventada ou parafraseada entre aspas
         □ Todos os campos AUSENTES com [INSERIR: campo]
         □ Todos os campos NAO_CONFIRMADOS com ⚠️ VERIFICAR
         □ Aviso B-04 presente em todas as citações com campos pendentes
         □ URL de verificação indicada para cada tribunal com campos NAO_CONFIRMADOS
      3. Se qualquer verificação falhar: corrigir antes da entrega
      4. Se usuário não forneceu nenhum julgado (pediu pesquisa pura):
         - Opção A: Orientar o usuário a pesquisar no repositório (com URL e palavras-chave)
         - Opção B: Apresentar bloco com todos os campos [INSERIR] + aviso B-04
         - Opção C: Se julgado do treinamento LLM: TODOS os campos marcados ⚠️ VERIFICAR
         NUNCA gerar citação com dados puros do LLM sem marcadores

    bloqueios_absolutos:
      - "Campo gerado pela IA sem ⚠️ VERIFICAR ou [INSERIR]"
      - "Ementa entre aspas não fornecida literalmente pelo usuário"
      - "Data inventada como 'provável'"
      - "Relator inferido por turma sem marcador"
      - "Aviso B-04 ausente em citação com campos pendentes"

  # ─────────────────────────────────────────────────────────
  # ETAPA 6 — ENTREGA DO BLOCO SISTEMATIZADO
  # ─────────────────────────────────────────────────────────
  - id: E6
    name: Entrega do Bloco Sistematizado
    description: >
      Compilar os blocos verificados e organizá-los para entrega ao
      agente de redação (processual-writer, appellate-specialist ou execution-specialist).
    action: |
      1. Organizar os blocos por hierarquia:
         (a) STF — vinculante (teses de RG, ADI/ADC, súmulas vinculantes)
         (b) STJ — alta persuasão (repetitivos, súmulas, turmas)
         (c) TJs — persuasão regional
      2. Para cada bloco, incluir:
         - Contexto de aplicação ("Sobre o tema X, o STJ entende que...")
         - O bloco formatado
         - Nota de verificação (⚠️ campos a confirmar + URL)
      3. Incluir síntese:
         - Status geral da tese (pacificada / controvertida)
         - Pontos de atenção para o redator
         - Recomendação: incluir como argumento principal ou subsidiário
      4. Entregar ao agente de redação com handoff estruturado
    output: |
      ## Blocos de Jurisprudência — {tema}
      **Status da Tese:** PACIFICADA / CONTROVERTIDA / EM FORMAÇÃO
      **Tribunais pesquisados:** STF / STJ / TJ-{UF}

      ### STF (se aplicável)
      {bloco formatado}

      ### STJ — Entendimento Principal
      {bloco formatado}

      ### TJ — Reforço Regional (se aplicável)
      {bloco formatado}

      ### Síntese para o Redator
      - **Usar como:** argumento principal / subsidiário
      - **Campos a verificar antes de protocolar:** {lista}
      - **URL de verificação:** {links por tribunal}

output_format:
  structure:
    - blocos_jurisprudenciais: lista de blocos formatados por tema
    - hierarquia_mapeada: mapa de precedentes por tribunal
    - status_teses: status de cada tese (pacificada/controvertida)
    - alertas_verificacao: lista de campos marcados para verificação
    - urls_tribunais: URLs dos repositórios para verificação dos campos NAO_CONFIRMADOS

quality_gates:
  # ── GATES OBRIGATÓRIOS ──────────────────────────────────
  - PASS: verify-citations.md executado antes de qualquer formatação (P0)
  - PASS: jurisprudence-gate.md grupos G1-G5 executados para cada citação (E4)
  - PASS: Hierarquia de precedentes mapeada (E2)
  - PASS: Status da tese informado (E2)
  - PASS: Blocos formatados no padrão blockquote + itálico (E4)
  # ── BLOQUEIOS ABSOLUTOS ─────────────────────────────────
  - BLOCK_IF: campo de julgado gerado pela IA sem ⚠️ VERIFICAR ou [INSERIR]
  - BLOCK_IF: ementa entre aspas não é texto literal fornecido pelo usuário
  - BLOCK_IF: aviso B-04 ausente em citação com campos pendentes
  - BLOCK_IF: verify-citations.md não carregado (P0 pulado)
  - BLOCK_IF: número de processo inventado sem [INSERIR]
  - BLOCK_IF: relator inferido sem ⚠️ VERIFICAR
  # ── WARNINGS ────────────────────────────────────────────
  - WARN_IF: URL de verificação não indicada para campos NAO_CONFIRMADOS
  - WARN_IF: Apenas 1 julgado para tese principal (recomendável ≥ 2)
  - WARN_IF: Todos os julgados do mesmo tribunal (recomendável diversidade)
```

---

## Guia de Aplicação — Marcadores de Verificação

### Sistema de Classificação de Campos

| Status do Campo | Origem | Marcador | Ação do Redator |
|----------------|--------|---------|-----------------|
| **CONFIRMADO** | Fornecido literalmente pelo usuário | *(sem marcador)* | Usar como está |
| **NAO_CONFIRMADO** | Treinamento do LLM, não confirmado | ⚠️ VERIFICAR | Confirmar no repositório do tribunal |
| **AUSENTE** | Não fornecido e não disponível | [INSERIR: campo] | Pesquisar e completar antes de protocolar |
| **EMENTA PARAFRASEADA** | Resumo não literal | *(sem aspas + nota)* | Localizar texto literal no acórdão |

### Aviso B-04 — Texto Padrão

```
⚠️ AVISO B-04 — Citação com Dados Pendentes
Um ou mais campos desta citação estão marcados como ⚠️ VERIFICAR ou [INSERIR].
Ação obrigatória antes de protocolar: acessar o repositório do tribunal e confirmar/completar.
Não protocolar peça com citação incompleta ou não verificada.
```

### URLs dos Repositórios Judiciais

| Tribunal | URL |
|----------|-----|
| STF | https://portal.stf.jus.br/jurisprudencia/ |
| STJ | https://processo.stj.jus.br/jurisprudencia/ |
| TJSP | https://esaj.tjsp.jus.br/cjsg/consultaCompleta.do |
| TJRJ | https://www3.tjrj.jus.br/ejud/ConsultaProcesso.aspx |
| TJMG | https://www5.tjmg.jus.br/jurisprudencia/ |
| TRF1 | https://portal.trf1.jus.br/portaltrf1/jurisprudencia |
| TRF3 | https://www.trf3.jus.br/trf3r/index.php/modules/cjurisprudencia/ |
| TST | https://jurisprudencia.tst.jus.br/ |
