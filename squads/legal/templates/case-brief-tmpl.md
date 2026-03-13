# Template — Case Brief

> **Squad:** legal | **Agent:** case-analyst
> **Uso:** Formato padronizado de output do diagnóstico processual

---

<!-- ═══════════════════════════════════════════════════════════
     INSTRUÇÕES DE PREENCHIMENTO
     ═══════════════════════════════════════════════════════════
     - Preencher todos os campos obrigatórios (marcados com *)
     - Campos sem informação: usar [INSERIR: nome do campo]
     - Campos incertos: marcar com ⚠️ VERIFICAR
     - Campos N/A: informar "N/A — {motivo}"
     - NUNCA fabricar fatos ou dados não fornecidos pelo usuário
     ═══════════════════════════════════════════════════════════ -->

---

## CASE BRIEF — {{IDENTIFICACAO_CASO}}

**Preparado por:** @case-analyst v1.0.0
**Data da Análise:** {{DATA_ANALISE}}
**Status:** PRELIMINAR (aguarda confirmação) / FINALIZADO

---

### 1. IDENTIFICAÇÃO E CLASSIFICAÇÃO DA DEMANDA *

| Campo | Valor |
|-------|-------|
| **Tipo de Ação** | {{TIPO_ACAO}} |
| **Natureza do Provimento** | Condenatória / Constitutiva / Declaratória / Mandamental |
| **Matéria Jurídica** | {{MATERIA_JURIDICA}} |
| **Rito Processual** | {{RITO_PROCESSUAL}} |
| **Juízo Competente** | {{JUIZO_COMPETENTE}} |
| **Fundamento da Competência** | {{FUNDAMENTO_COMPETENCIA}} |
| **Valor Estimado da Causa** | {{VALOR_CAUSA}} |
| **⚠️ Urgência Processual** | {{SIM_NÃO — se SIM: descrever}} |

<!-- Exemplos de preenchimento:
TIPO_ACAO: "Ação de Indenização por Danos Morais"
RITO_PROCESSUAL: "Procedimento Comum (art. 318 do CPC)"
JUIZO_COMPETENTE: "Vara Cível Estadual — comarca do domicílio do réu (art. 46 CPC)"
FUNDAMENTO_COMPETENCIA: "Sem parte federal; matéria cível — Justiça Estadual"
VALOR_CAUSA: "R$ 15.000,00 (estimado — parâmetros STJ para negativação indevida)"
-->

---

### 2. PARTES *

#### 2.1 Polo Ativo

| Campo | Valor |
|-------|-------|
| **Nome Completo** | {{NOME_POLO_ATIVO}} |
| **Qualificação** | {{QUALIFICACAO_POLO_ATIVO}} |
| **CPF/CNPJ** | [INSERIR: CPF/CNPJ] |
| **Domicílio** | [INSERIR: endereço] |
| **Representação** | {{ADVOGADO}} (OAB/{{UF}} nº {{NUMERO_OAB}}) |

#### 2.2 Polo Passivo

| Campo | Valor |
|-------|-------|
| **Nome Completo** | {{NOME_POLO_PASSIVO}} |
| **Qualificação** | {{QUALIFICACAO_POLO_PASSIVO}} |
| **CPF/CNPJ** | [INSERIR: CPF/CNPJ] |
| **Sede/Domicílio** | [INSERIR: endereço] |
| **Representação** | [INSERIR: advogado] (a ser citado) |

{{#if TERCEIROS_RELEVANTES}}
#### 2.3 Terceiros Relevantes

| Nome | Qualificação | Relevância para o Caso |
|------|-------------|------------------------|
| {{NOME_TERCEIRO}} | {{QUALIFICACAO}} | {{RELEVANCIA}} |
{{/if}}

---

### 3. CRONOLOGIA DOS FATOS *

> Os fatos abaixo estão organizados em ordem cronológica rigorosa.
> Fatos sem data confirmada estão marcados como [INSERIR: data].
> Documentos mencionados mas não disponibilizados estão marcados com ⚠️ VERIFICAR.

| # | Data | Fato | Relevância Processual | Prova Disponível |
|---|------|------|----------------------|-----------------|
| 1 | {{DATA_1}} | {{FATO_1}} | Alta / Média / Baixa | {{PROVA_1}} |
| 2 | {{DATA_2}} | {{FATO_2}} | Alta / Média / Baixa | {{PROVA_2}} |
| 3 | {{DATA_3}} | {{FATO_3}} | Alta / Média / Baixa | {{PROVA_3}} |
| ... | ... | ... | ... | ... |

**Fato Gerador Central:** {{FATO_GERADOR_CENTRAL}}
**Data do Fato Gerador:** {{DATA_FATO_GERADOR}}

---

### 4. TESES JURÍDICAS *

#### 4.1 Tese Principal

| Campo | Valor |
|-------|-------|
| **Descrição** | {{DESCRICAO_TESE_PRINCIPAL}} |
| **Fundamento Legal** | **{{ART_LEI_PRINCIPAL}}** |
| **Princípio Aplicável** | {{PRINCIPIO}} |
| **Súmula/Enunciado** | {{SUMULA}} (⚠️ verificar vigência) |
| **Força da Tese** | FORTE / MODERADA / FRACA |
| **Status** | PACIFICADA NO STJ / CONTROVERTIDA / EM FORMAÇÃO |

**Elementos constitutivos presentes no caso:**
- ☑ {{ELEMENTO_1}}: {{COMO_DEMONSTRAR}}
- ☑ {{ELEMENTO_2}}: {{COMO_DEMONSTRAR}}
- ☐ {{ELEMENTO_3}}: ⚠️ precisa de prova — {{COMO_OBTER}}

#### 4.2 Teses Subsidiárias

| # | Tese | Fundamento Legal | Força |
|---|------|-----------------|-------|
| 1 | {{TESE_SUBSIDIARIA_1}} | **{{ART_LEI_SUB1}}** | FORTE/MODERADA/FRACA |
| 2 | {{TESE_SUBSIDIARIA_2}} | **{{ART_LEI_SUB2}}** | FORTE/MODERADA/FRACA |

{{#if TESES_DEFENSIVAS}}
#### 4.3 Teses da Parte Contrária (Antecipação)

| # | Tese Adversária Esperada | Como Refutar |
|---|--------------------------|-------------|
| 1 | {{TESE_ADVERSARIA_1}} | {{REFUTACAO_1}} |
| 2 | {{TESE_ADVERSARIA_2}} | {{REFUTACAO_2}} |
{{/if}}

---

### 5. RISCOS PROCESSUAIS *

| Risco | Probabilidade | Impacto | Mitigação Recomendada | Urgente? |
|-------|---------------|---------|----------------------|----------|
| {{RISCO_1}} | Alta/Média/Baixa | Alto/Médio/Baixo | {{MITIGACAO_1}} | Sim/Não |
| {{RISCO_2}} | Alta/Média/Baixa | Alto/Médio/Baixo | {{MITIGACAO_2}} | Sim/Não |
| {{RISCO_3}} | Alta/Média/Baixa | Alto/Médio/Baixo | {{MITIGACAO_3}} | Sim/Não |

#### Análise de Prescrição/Decadência *

| Item | Data/Prazo | Status |
|------|------------|--------|
| Fato gerador (dies a quo) | {{DATA_FATO_GERADOR}} | ✅ / [INSERIR] |
| Prazo prescricional aplicável | {{PRAZO_PRESCRICIONAL}} — base: {{ART_PRESCRICAO}} | ✅ / ⚠️ VERIFICAR |
| Data de eventual prescrição | {{DATA_PRESCRICAO}} | ✅ / ⚠️ VERIFICAR |
| Causas interruptivas/suspensivas | {{CAUSAS_INTERRUPTIVAS}} | N/A / {{descrever}} |
| **Conclusão** | **Ação EM PRAZO** / **PRESCRITA** / **⚠️ VERIFICAR** | |

---

### 6. TUTELA DE URGÊNCIA

{{#if TUTELA_URGENCIA}}
| Campo | Valor |
|-------|-------|
| **Necessária?** | SIM |
| **Tipo** | Antecipada (art. 300 CPC) / Cautelar (art. 305 CPC) |
| **Fundamento** | {{FUNDAMENTO_TUTELA}} |
| **Probabilidade do direito** | {{PROBABILIDADE}} |
| **Perigo na demora** | {{PERIGO_DANO}} |
| **Medida solicitada** | {{MEDIDA_LIMINAR}} |
{{else}}
| Campo | Valor |
|-------|-------|
| **Necessária?** | NÃO |
| **Motivo** | {{MOTIVO_NAO_URGENCIA}} |
{{/if}}

---

### 7. PEDIDOS RECOMENDADOS *

> Pedidos listados em ordem de relevância e prioridade.

a) **Pedido Principal:** {{PEDIDO_PRINCIPAL}}
   - Fundamento: **{{ART_FUNDAMENTO_PRINCIPAL}}**
   - Valor/quantificação: {{VALOR_PEDIDO}}

b) **Pedido Secundário:** {{PEDIDO_SECUNDARIO}}
   - Fundamento: **{{ART_FUNDAMENTO_SECUNDARIO}}**

c) **Pedido de Tutela de Urgência:** {{PEDIDO_TUTELA}} *(se aplicável)*
   - Fundamento: **art. 300 do Código de Processo Civil**

d) **Pedidos Genéricos:**
   - Condenação em custas processuais e honorários advocatícios (**art. 85 CPC**)
   - Produção de todos os meios de prova em direito admitidos

---

### 8. DOCUMENTOS NECESSÁRIOS

| # | Documento | Status | Urgência |
|---|-----------|--------|---------|
| 1 | {{DOCUMENTO_1}} | ✅ Disponível / ⚠️ Pendente / ❌ Indisponível | Alta/Média/Baixa |
| 2 | {{DOCUMENTO_2}} | ✅ Disponível / ⚠️ Pendente / ❌ Indisponível | Alta/Média/Baixa |
| 3 | {{DOCUMENTO_3}} | ✅ Disponível / ⚠️ Pendente / ❌ Indisponível | Alta/Média/Baixa |

**Documentos Críticos sem os quais a ação não deve ser ajuizada:**
{{DOCUMENTOS_CRITICOS}}

---

### 9. JURISPRUDÊNCIA A PESQUISAR

> Temas identificados que precisam de fundamento jurisprudencial.
> Encaminhar ao @jurisprudence-researcher com estes temas.

| # | Tema | Tribunal Prioritário | Urgência |
|---|------|---------------------|---------|
| 1 | {{TEMA_PESQUISA_1}} | STJ / STF / TJ-{{UF}} | Alta/Média/Baixa |
| 2 | {{TEMA_PESQUISA_2}} | STJ / STF / TJ-{{UF}} | Alta/Média/Baixa |

---

### 10. OBSERVAÇÕES E ALERTAS

{{#if ALERTAS}}
> ⚠️ **ALERTAS CRÍTICOS:**
>
> {{ALERTA_1}}
>
> {{ALERTA_2}}
{{/if}}

**Pontos de Atenção:**
- {{OBSERVACAO_1}}
- {{OBSERVACAO_2}}

**Informações Adicionais Necessárias:**
- {{INFO_ADICIONAL_1}} — [INSERIR: descrição]
- {{INFO_ADICIONAL_2}} — [INSERIR: descrição]

---

### 11. HANDOFF — PRÓXIMO AGENTE *

| Campo | Valor |
|-------|-------|
| **Próximo Agente** | @{{AGENTE_RECOMENDADO}} |
| **Peça a Redigir** | {{TIPO_PECA}} |
| **Prioridade** | Alta / Média / Baixa |
| **Prazo de Entrega** | {{PRAZO_ENTREGA}} |
| **Contexto para o Próximo Agente** | {{CONTEXTO_HANDOFF}} |

**Sequência de Execução Recomendada:**
1. *(etapa 1)*
2. *(etapa 2)*
3. *(etapa 3)*

---

<!--
═══════════════════════════════════════════════════════════════
GUIA DE VARIÁVEIS DO CASE BRIEF
═══════════════════════════════════════════════════════════════

SEÇÃO 1 — CLASSIFICAÇÃO
  {{IDENTIFICACAO_CASO}}     → Ex: "Negativação Indevida — Maria da Silva x Banco ABC"
  {{TIPO_ACAO}}              → Ex: "Ação de Indenização por Danos Morais"
  {{MATERIA_JURIDICA}}       → Ex: "Responsabilidade Civil + Direito do Consumidor"
  {{RITO_PROCESSUAL}}        → Ex: "Procedimento Comum (art. 318 CPC)"
  {{JUIZO_COMPETENTE}}       → Ex: "Vara Cível — Justiça Estadual"
  {{FUNDAMENTO_COMPETENCIA}} → Ex: "art. 46 CPC (domicílio do réu); sem parte federal"
  {{VALOR_CAUSA}}            → Ex: "R$ 15.000,00 (estimado)"
  {{DATA_ANALISE}}           → Ex: "13.03.2026"

SEÇÃO 2 — PARTES
  {{NOME_POLO_ATIVO}}        → Nome completo do cliente/autor
  {{QUALIFICACAO_POLO_ATIVO}} → "brasileiro, solteiro, autônomo"
  {{NOME_POLO_PASSIVO}}      → Nome completo do réu
  {{QUALIFICACAO_POLO_PASSIVO}} → "pessoa jurídica de direito privado, CNPJ nº ___"
  {{ADVOGADO}}               → Nome do advogado do cliente
  {{UF}}                     → Estado da OAB

SEÇÃO 3 — CRONOLOGIA
  {{DATA_1}}...              → Datas dos fatos em ordem cronológica
  {{FATO_1}}...              → Descrição objetiva de cada fato
  {{PROVA_1}}...             → Documento comprobatório ou "⚠️ verificar"
  {{FATO_GERADOR_CENTRAL}}   → O fato mais importante para a demanda

SEÇÃO 4 — TESES
  {{DESCRICAO_TESE_PRINCIPAL}} → "Dano moral in re ipsa por negativação indevida"
  {{ART_LEI_PRINCIPAL}}        → "arts. 186 e 927 do Código Civil + art. 14 CDC"
  {{PRINCIPIO}}                → "Boa-fé objetiva; vedação ao enriquecimento ilícito"
  {{SUMULA}}                   → "Súmula 479 STJ (⚠️ verificar número e enunciado)"

SEÇÃO 5 — RISCOS
  {{RISCO_1}}                → "Súmula 385 STJ — outras negativações legítimas"
  {{PROBABILIDADE}}          → "Alta/Média/Baixa"
  {{MITIGACAO_1}}            → "Consultar cadastro de crédito do cliente antes de ajuizar"
  {{PRAZO_PRESCRICIONAL}}    → "3 anos (responsabilidade civil extracontratual)"
  {{ART_PRESCRICAO}}         → "art. 206, § 3º, V do Código Civil"

SEÇÃO 10 — HANDOFF
  {{AGENTE_RECOMENDADO}}     → "processual-writer" / "appellate-specialist" / "execution-specialist"
  {{TIPO_PECA}}              → "Petição Inicial — Ação de Indenização por Danos Morais"
  {{PRAZO_ENTREGA}}          → "Sem urgência imediata" / "URGENTE — 5 dias úteis restantes"
  {{CONTEXTO_HANDOFF}}       → Instrução específica para o próximo agente

═══════════════════════════════════════════════════════════════
TIPOS DE AÇÃO — REFERÊNCIA
═══════════════════════════════════════════════════════════════

RESPONSABILIDADE CIVIL:
  Tipo: Ação de Indenização por Danos Morais e/ou Materiais
  Fundamento: arts. 186, 927 CC + art. 14 CDC (se consumidor)
  Rito: Procedimento Comum ou JEC (≤ 40 SM)

REVISIONAL DE CONTRATO:
  Tipo: Ação Revisional de Contrato Bancário
  Fundamento: arts. 421, 422 CC + Código de Defesa do Consumidor
  Rito: Procedimento Comum

OBRIGAÇÃO DE FAZER:
  Tipo: Ação de Obrigação de Fazer com Pedido de Tutela de Urgência
  Fundamento: art. 497 CPC + art. 300 CPC (tutela)
  Rito: Procedimento Comum

COBRANÇA/EXECUÇÃO:
  Tipo: Ação de Cobrança / Petição de Cumprimento de Sentença
  Fundamento: arts. 397, 398, 406 CC (mora) + arts. 523-527 CPC
  Rito: Procedimento Comum / Cumprimento de Sentença

DECLARATÓRIA:
  Tipo: Ação Declaratória de Inexistência de Débito
  Fundamento: art. 19 CPC (interesse de agir declaratório)
  Rito: Procedimento Comum

═══════════════════════════════════════════════════════════════
-->
