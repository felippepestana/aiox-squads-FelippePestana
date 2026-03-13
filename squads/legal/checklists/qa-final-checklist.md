# QA Final Checklist — Revisão Integrada de Peças Processuais

> **Squad:** legal | **Agente:** legal-chief (coordena) | **Executado por:** todos os agentes antes da entrega
> **Uso:** Validação final integrada antes de entregar qualquer peça ao usuário

---

## Instruções de Uso

Execute cada item e marque: ✅ PASS | ❌ FAIL | ⚠️ VERIFICAR | N/A

Este checklist é complementar ao `formatting-checklist.md` (33 itens de formatação).
O qa-final-checklist avalia **completude estrutural**, **qualidade argumentativa**,
**integridade jurisprudencial** e **conformidade com os pedidos**.

---

## Módulo 1 — Completude Estrutural

*Verifica se todos os elementos obrigatórios da peça estão presentes.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 1.1 | Endereçamento | Juízo destinatário identificado e formatado corretamente | | |
| 1.2 | Informações do processo | Número, classe, partes — bloco de identificação presente | | |
| 1.3 | Qualificação do autor/requerente | Nome, dados civis, CPF, endereço, advogado | | |
| 1.4 | Qualificação do réu/requerido | Nome e qualificação básica na inicial | | |
| 1.5 | Título da peça | Identificado em linha exclusiva, NEGRITO + CAIXA ALTA | | |
| 1.6 | Seção de fatos | Presente e com narrativa cronológica | | |
| 1.7 | Seção de direito | Presente com fundamentos legais | | |
| 1.8 | Seção de pedidos | Presente com pedidos específicos | | |
| 1.9 | Fecho e assinatura | Fórmula de encerramento + local + data + OAB | | |
| 1.10 | Valor da causa | Atribuído com fundamentação (art. 292 CPC) | | |

---

## Módulo 2 — Verificação dos Fundamentos Legais

*Verifica se os artigos de lei citados existem e são aplicáveis ao caso.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 2.1 | Existência dos artigos | Artigos citados existem nas leis referenciadas | | |
| 2.2 | Aplicabilidade | Artigos aplicam-se ao tipo de demanda e à matéria | | |
| 2.3 | Vigência | Dispositivos legais estão em vigor (não revogados) | | |
| 2.4 | Completude de citação | Artigo + lei completos (ex: "art. 186 do Código Civil") | | |
| 2.5 | Tese sem fundamento | Nenhuma afirmação jurídica sem artigo ou precedente | | |
| 2.6 | Coerência tese-pedido | Cada pedido tem fundamento legal específico | | |
| 2.7 | Fundamento da competência | Artigo que justifica a competência do juízo escolhido | | |

---

## Módulo 3 — Integridade das Citações Jurisprudenciais

*Verifica integridade anti-fabricação de todas as citações.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 3.1 | verify-citations.md executado | Task de verificação executada para CADA citação | | |
| 3.2 | jurisprudence-gate.md executado | Gate G1-G5 executado para CADA citação | | |
| 3.3 | Nenhum campo fabricado | Sem número, relator ou data gerados pelo LLM sem marcador | | |
| 3.4 | Ementa autêntica | Texto entre aspas fornecido literalmente (não parafraseado) | | |
| 3.5 | Campos NAO_CONFIRMADOS marcados | Todos com ⚠️ VERIFICAR e URL do tribunal | | |
| 3.6 | Campos AUSENTES marcados | Todos com [INSERIR: campo] — nunca com valor inventado | | |
| 3.7 | Aviso B-04 presente | Presente em TODA citação com campos pendentes | | |
| 3.8 | Referência completa | Tribunal, órgão, tipo, número, UF, relator, datas | | |
| 3.9 | Formato blockquote | Citação em bloco recuado (>) com itálico | | |
| 3.10 | Hierarquia indicada | Nível do precedente informado (vinculante/persuasivo) | | |

---

## Módulo 4 — Qualidade da Argumentação

*Verifica a coerência e completude da linha argumentativa.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 4.1 | Fluxo argumentativo | Tese → Fatos → Direito → Jurisprudência → Conclusão | | |
| 4.2 | Nexo fatos-fundamentos | Cada fato narrado conecta-se a pelo menos um fundamento | | |
| 4.3 | Nexo fundamentos-pedidos | Cada pedido tem fundamento legal e fático | | |
| 4.4 | Tese principal desenvolvida | Argumento central plenamente desenvolvido | | |
| 4.5 | Teses subsidiárias presentes | Argumentos alternativos quando recomendado | | |
| 4.6 | Antecipação de teses adversárias | Teses prováveis da parte contrária antecipadas (quando pertinente) | | |
| 4.7 | Ausência de contradição interna | Sem afirmações contraditórias entre si na peça | | |
| 4.8 | Relevância dos fatos narrados | Apenas fatos com relevância processual incluídos | | |

---

## Módulo 5 — Completude dos Pedidos

*Verifica se os pedidos estão completos, específicos e fundamentados.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 5.1 | Pedido principal específico | Identificada concretamente a providência judicial almejada | | |
| 5.2 | Pedidos secundários específicos | Cada pedido identifica a providência concreta | | |
| 5.3 | Ausência de pedido genérico puro | Sem "tudo o mais que de direito" sem especificação | | |
| 5.4 | Tutela de urgência (se necessário) | Pedido liminar/antecipação incluído quando pertinente | | |
| 5.5 | Custas e honorários | Pedido de condenação em custas e honorários (art. 85 CPC) | | |
| 5.6 | Gratuidade (se necessário) | Pedido de justiça gratuita incluído se aplicável | | |
| 5.7 | Produção de provas | Requerimento de produção de provas incluído | | |
| 5.8 | Valor da causa atribuído | Valor específico atribuído à causa (art. 292 CPC) | | |
| 5.9 | Correção monetária | Índice e data de início indicados nos pedidos condenatórios | | |
| 5.10 | Juros moratórios | Taxa e data de início indicados (art. 405 ou 406 CC) | | |

---

## Módulo 6 — Qualificação das Partes

*Verifica a completude e correção da qualificação das partes.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 6.1 | Nome da parte em CAIXA ALTA | Polo ativo com nome em NEGRITO + CAIXA ALTA | | |
| 6.2 | Dados civis completos (PF) | Nacionalidade, estado civil, profissão, RG, CPF | | |
| 6.3 | Dados empresariais (PJ) | Tipo jurídico, CNPJ, sede, representante legal | | |
| 6.4 | Endereço completo | Logradouro, nº, complemento, bairro, cidade, UF, CEP | | |
| 6.5 | Representação processual | Advogado identificado com OAB | | |
| 6.6 | Qualificação do réu (inicial) | Qualificação básica do polo passivo presente | | |
| 6.7 | Capacidade processual | Verificação de capacidade (incapaz exige representação/assistência) | | |

---

## Módulo 7 — Verificação Processual Específica por Tipo de Peça

*Marcar apenas os itens aplicáveis ao tipo de peça revisada.*

### 7A. Petição Inicial

| # | Item | Critério | Status |
|---|------|----------|--------|
| 7A.1 | Causa de pedir remota | Fatos e fundamentos jurídicos (art. 319, III CPC) | |
| 7A.2 | Causa de pedir próxima | Fundamento jurídico da pretensão | |
| 7A.3 | Pedido determinado | Especificado o bem da vida pretendido (art. 322 CPC) | |
| 7A.4 | Documentos essenciais | Mencionados os documentos a instruir a inicial (art. 320 CPC) | |
| 7A.5 | Endereço do réu | Indicado para citação (art. 319, II CPC) | |

### 7B. Recurso (Apelação / AI / ED / REsp)

| # | Item | Critério | Status |
|---|------|----------|--------|
| 7B.1 | Seção de admissibilidade | Seção I da peça trata da admissibilidade | |
| 7B.2 | Tempestividade demonstrada | Prazo verificado e demonstrado na peça | |
| 7B.3 | Capítulos identificados | Para apelação: capítulos da sentença impugnados | |
| 7B.4 | Tipo de erro classificado | Error in judicando vs. in procedendo identificado | |
| 7B.5 | Pedido recursal específico | Conhecer + prover + reforma/anulação | |
| 7B.6 | Prequestionamento (REsp/RE) | Demonstrado no acórdão recorrido | |
| 7B.7 | Rol AI verificado | Para AI: enquadramento no art. 1.015 CPC demonstrado | |

### 7C. Peça de Execução / Cumprimento

| # | Item | Critério | Status |
|---|------|----------|--------|
| 7C.1 | Tipo de execução identificado | Judicial vs. extrajudicial vs. fiscal | |
| 7C.2 | Tempestividade da defesa | Prazo de impugnação/embargos verificado | |
| 7C.3 | Fundamentos por inciso | Art. 525 ou 917 CPC citados por inciso | |
| 7C.4 | Demonstrativo de cálculo | Presente quando alegado excesso de execução | |
| 7C.5 | Garantia do juízo | Verificada para embargos fiscais (obrigatória) | |

---

## Módulo 8 — Linguagem e Redação

*Verifica conformidade com as regras de linguagem do squad.*

| # | Item | Critério | Status | Observação |
|---|------|----------|--------|------------|
| 8.1 | Ausência de juridiquês arcaico | Nenhum termo da lista de anti-patterns (processual-writer) | | |
| 8.2 | "Vem mui respeitosamente" ausente | Substituído por forma contemporânea | | |
| 8.3 | "DD." e "MM." ausentes | Não utilizados na peça | | |
| 8.4 | Conectivos lógicos adequados | "portanto", "com efeito", "nesse sentido" usados corretamente | | |
| 8.5 | Conclusões jurídicas em negrito | Conclusões centrais do argumento destacadas | | |
| 8.6 | Ausência de redundâncias | Sem frases de preenchimento sem conteúdo | | |
| 8.7 | Períodos adequados | Frases não excessivamente longas e complexas | | |

---

## Resumo da Validação Final

```
MÓDULO 1 (Estrutural):         ___/10 PASS
MÓDULO 2 (Fundamentos legais): ___/7  PASS
MÓDULO 3 (Jurisprudência):     ___/10 PASS
MÓDULO 4 (Argumentação):       ___/8  PASS
MÓDULO 5 (Pedidos):            ___/10 PASS
MÓDULO 6 (Qualificação):       ___/7  PASS
MÓDULO 7 (Tipo específico):    ___/5  PASS (N/A os não aplicáveis)
MÓDULO 8 (Linguagem):          ___/7  PASS

TOTAL:                         ___/64 PASS (excluídos N/A)

Status geral:
[ ] APROVADO            — todos os itens PASS ou N/A; pronto para protocolo
[ ] APROVADO COM RESSALVAS — itens ⚠️ VERIFICAR pendentes; não bloqueia, mas exige atenção
[ ] REPROVADO           — um ou mais itens FAIL críticos; NÃO protocolar antes de corrigir

Itens FAIL que impedem protocolo:
[ ] Módulo 3 — qualquer FAIL em 3.1–3.10 (integridade de citação)
[ ] Módulo 5 — 5.1 ou 5.2 FAIL (pedido ausente ou genérico demais)
[ ] Módulo 1 — 1.6, 1.7 ou 1.8 FAIL (seção crítica ausente)
```

---

## Itens FAIL ou VERIFICAR — Ações Necessárias

> *(Preencher apenas os itens com status FAIL ou VERIFICAR)*

| # do Item | Módulo | Localização na Peça | Problema | Ação Necessária |
|-----------|--------|--------------------|---------|--------------------|
| | | | | |

---

## Alertas Especiais — Sempre Verificar antes de Protocolar

> ⚠️ **VERIFICAÇÃO HUMANA OBRIGATÓRIA:**
> - Números de processos e CNPJs das partes
> - Datas de julgamento dos precedentes citados
> - Nomes dos relatores dos acórdãos
> - Vigência e redação atual das súmulas citadas
> - Vigência dos dispositivos legais citados
> - Valor das custas de preparo (recursos)
> - Prazo remanescente para protocolo (dias úteis)

---

## Resultado dos Quality Gates de Integridade

> *(Executar verify-citations.md + jurisprudence-gate.md para cada citação)*

| # | Citação | Resultado do Gate | Campos Pendentes |
|---|---------|------------------|-----------------|
| 1 | {identificação} | LIBERADA / COM RESSALVAS / BLOQUEADA | {lista de campos} |
| 2 | {identificação} | LIBERADA / COM RESSALVAS / BLOQUEADA | {lista de campos} |
