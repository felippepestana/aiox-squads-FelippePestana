# Jurisprudence Gate — Anti-Fabrication

> **Squad:** legal | **Tipo:** checklist de bloqueio
> **Gatilho:** Executar em TODA citação jurisprudencial antes da entrega ao usuário
> **Falha bloqueante:** Qualquer item BLOCK impede a entrega da citação sem resolução prévia

---

## Como usar este gate

1. Para cada citação na peça, executar os itens abaixo **individualmente**
2. Marcar: ✅ PASS | 🚫 BLOCK | ⚠️ VERIFICAR
3. **BLOCK** = não entregar a citação nesse estado; resolver conforme ação prescrita
4. **VERIFICAR** = entregar com marcador `⚠️ VERIFICAR` e aviso B-04
5. Registrar resultado no relatório de saída

---

## GRUPO 1 — Origem dos Dados (Integridade da Fonte)

Estes itens verificam **de onde vieram** os dados da citação. São os mais críticos.

| # | Item | Critério | Resultado | Ação se BLOCK |
|---|------|----------|-----------|---------------|
| G1.1 | Todos os campos vieram do usuário ou de documento anexado? | Sim = PASS; Algum campo veio do treinamento da IA = VERIFICAR; Campo foi inventado = BLOCK | | Ver G1.1-AÇÃO |
| G1.2 | O trecho da ementa é **literal** (copiado do original)? | Sim = PASS; É paráfrase entre aspas = BLOCK; É paráfrase sem aspas com nota = VERIFICAR | | Ver G1.2-AÇÃO |
| G1.3 | O número do processo foi fornecido explicitamente pelo usuário? | Sim = PASS; Inferido do treinamento = VERIFICAR; Ausente = não incluir número fictício | | Ver G1.3-AÇÃO |
| G1.4 | O nome do relator foi fornecido explicitamente pelo usuário? | Sim = PASS; Inferido = VERIFICAR; Ausente = [INSERIR: nome do relator] | | Ver G1.4-AÇÃO |
| G1.5 | As datas (julgamento e publicação) foram fornecidas explicitamente? | Sim = PASS; Inferidas = VERIFICAR; Ausentes = [INSERIR: data] | | Ver G1.5-AÇÃO |

### Ações Corretivas do Grupo 1

**G1.1-AÇÃO (campo inventado):**
Substituir o campo inventado por `[INSERIR: {nome do campo}]`. Nunca substituir por um valor "plausível". Adicionar aviso B-04 à citação.

**G1.2-AÇÃO (paráfrase entre aspas):**
Remover as aspas e transformar em paráfrase sinalizada:
```
Nesse sentido, decidiu o STJ que [paráfrase do entendimento — verificar ementa original]
```
OU substituir por `[INSERIR: trecho literal da ementa]`.

**G1.3-AÇÃO (número ausente):**
Usar `[INSERIR: número do processo]`. PROIBIDO gerar um número que "parece correto".

**G1.4-AÇÃO (relator ausente):**
Usar `[INSERIR: nome do relator]`. PROIBIDO inferir nome de relator frequente daquela turma.

**G1.5-AÇÃO (datas ausentes):**
Usar `[INSERIR: data de julgamento]` e `[INSERIR: data de publicação]`.

---

## GRUPO 2 — Completude da Referência

| # | Item | Critério | Resultado | Ação se BLOCK/VERIFICAR |
|---|------|----------|-----------|-------------------------|
| G2.1 | Tribunal identificado? | Presente = PASS; Ausente = BLOCK | | Solicitar ao usuário ou inserir [INSERIR: tribunal] |
| G2.2 | Órgão julgador identificado (Turma/Câmara/Seção)? | Presente = PASS; Ausente = VERIFICAR | | Marcar ⚠️ VERIFICAR: órgão julgador |
| G2.3 | Tipo e número do recurso/ação presentes? | Ambos presentes = PASS; Algum ausente = BLOCK | | Inserir [INSERIR: tipo] e/ou [INSERIR: número] |
| G2.4 | UF de origem do recurso presente? | Presente = PASS; Ausente = VERIFICAR | | Marcar ⚠️ VERIFICAR: UF de origem |
| G2.5 | Nome do relator presente? | Presente = PASS; Ausente = BLOCK | | Inserir [INSERIR: nome do relator] |
| G2.6 | Data de julgamento presente? | Presente = PASS; Ausente = BLOCK | | Inserir [INSERIR: data de julgamento] |
| G2.7 | Diário de publicação e data de publicação presentes? | Ambos = PASS; Algum ausente = VERIFICAR | | Marcar ⚠️ VERIFICAR: publicação |
| G2.8 | Trecho de ementa ou voto presente? | Presente = PASS; Ausente = BLOCK | | Inserir [INSERIR: trecho literal da ementa] |

---

## GRUPO 3 — Consistência Interna

| # | Item | Critério | Resultado | Ação |
|---|------|----------|-----------|------|
| G3.1 | O tribunal informado é compatível com o tipo de recurso? | STJ + REsp/AREsp = PASS; STF + ARE/RE = PASS; Incompatível = BLOCK | | Corrigir tribunal ou tipo de recurso; alertar usuário |
| G3.2 | O órgão julgador existe nesse tribunal? | Ex: "3ª Turma" existe no STJ = PASS; Órgão fictício = BLOCK | | Substituir por [INSERIR: órgão julgador] |
| G3.3 | A data de publicação é posterior ou igual à data de julgamento? | Sim = PASS; Publicação anterior ao julgamento = BLOCK | | Inverter datas ou inserir [INSERIR] nos campos incorretos |
| G3.4 | A UF de origem é coerente com o tribunal de destino? | Recurso do TJSP indo ao STJ/STF = PASS; Recurso de tribunal federal indo ao TJSP = BLOCK | | Alertar usuário sobre inconsistência |

---

## GRUPO 4 — Autenticidade do Trecho de Ementa

| # | Item | Critério | Resultado | Ação |
|---|------|----------|-----------|------|
| G4.1 | O trecho está entre aspas? | Sim = tratado como literal → verificar G1.2; Não = tratar como paráfrase | | Se paráfrase, não adicionar aspas |
| G4.2 | Se entre aspas: o texto foi fornecido literalmente pelo usuário ou copiado de documento? | Sim = PASS; Não (foi gerado pela IA) = BLOCK | | Remover aspas; apresentar como paráfrase com [⚠️ VERIFICAR ementa original] |
| G4.3 | O conteúdo do trecho é coerente com o tema jurídico citado? | Sim = PASS; Incoerente (ex: ementa de direito tributário em tese de responsabilidade civil) = BLOCK | | Alertar usuário sobre incoerência; não inserir |
| G4.4 | O trecho contém dados pessoais ou sigilosos de partes do processo? | Não = PASS; Sim = VERIFICAR | | Anonimizar conforme art. 189 do CPC e LGPD |

---

## GRUPO 5 — Aviso ao Usuário

| # | Item | Critério | Resultado | Ação |
|---|------|----------|-----------|------|
| G5.1 | A citação tem algum campo ⚠️ VERIFICAR ou [INSERIR]? | Não = PASS (sem aviso adicional necessário); Sim = BLOCK até aviso B-04 ser incluído | | Adicionar aviso B-04 antes de entregar |
| G5.2 | O aviso B-04 foi incluído logo após a citação? | Sim = PASS; Não = BLOCK | | Inserir aviso conforme modelo abaixo |
| G5.3 | O aviso inclui a fonte oficial de verificação do tribunal? | Sim = PASS; Não = VERIFICAR | | Adicionar URL da fonte conforme tabela no citation-integrity-protocol.md |

**Modelo do Aviso B-04:**
```
⚠️ ATENÇÃO: Esta citação contém campos não confirmados (marcados acima).
VERIFIQUE todos os dados marcados antes de protocolar a peça.
Fonte oficial: [URL do tribunal — ver squads/legal/data/citation-integrity-protocol.md]
```

---

## Sumário de Execução

```
Citação analisada: ___________________________________

GRUPO 1 — Origem dos Dados
  G1.1: [ ] PASS  [ ] BLOCK  [ ] VERIFICAR
  G1.2: [ ] PASS  [ ] BLOCK  [ ] VERIFICAR
  G1.3: [ ] PASS  [ ] BLOCK  [ ] VERIFICAR
  G1.4: [ ] PASS  [ ] BLOCK  [ ] VERIFICAR
  G1.5: [ ] PASS  [ ] BLOCK  [ ] VERIFICAR

GRUPO 2 — Completude
  G2.1: [ ] PASS  [ ] BLOCK     G2.5: [ ] PASS  [ ] BLOCK
  G2.2: [ ] PASS  [ ] VERIFICAR G2.6: [ ] PASS  [ ] BLOCK
  G2.3: [ ] PASS  [ ] BLOCK     G2.7: [ ] PASS  [ ] VERIFICAR
  G2.4: [ ] PASS  [ ] VERIFICAR G2.8: [ ] PASS  [ ] BLOCK

GRUPO 3 — Consistência
  G3.1: [ ] PASS  [ ] BLOCK
  G3.2: [ ] PASS  [ ] BLOCK
  G3.3: [ ] PASS  [ ] BLOCK
  G3.4: [ ] PASS  [ ] BLOCK

GRUPO 4 — Autenticidade da Ementa
  G4.1: [ ] PASS  [ ] VERIFICAR
  G4.2: [ ] PASS  [ ] BLOCK
  G4.3: [ ] PASS  [ ] BLOCK
  G4.4: [ ] PASS  [ ] VERIFICAR

GRUPO 5 — Aviso ao Usuário
  G5.1: [ ] PASS  [ ] BLOCK
  G5.2: [ ] PASS  [ ] BLOCK
  G5.3: [ ] PASS  [ ] VERIFICAR

─────────────────────────────────────────
TOTAL BLOCK:     ___
TOTAL VERIFICAR: ___
TOTAL PASS:      ___

RESULTADO FINAL:
  [ ] ✅ LIBERADA — todos os campos PASS; pronta para incluir na peça
  [ ] ⚠️ LIBERADA COM RESSALVAS — tem campos VERIFICAR; incluir com aviso B-04
  [ ] 🚫 BLOQUEADA — tem campos BLOCK; não incluir até resolução dos itens marcados
─────────────────────────────────────────
```

---

## Referência rápida — O que fazer com cada situação

| Situação | O que fazer |
|----------|-------------|
| Usuário forneceu todos os dados do julgado | Formatar e entregar sem aviso adicional |
| Algum dado foi inferido do treinamento da IA | Marcar campo com ⚠️ VERIFICAR + aviso B-04 |
| Algum dado está ausente | Usar [INSERIR: {campo}] + aviso B-04 |
| Ementa foi gerada/parafraseada pela IA | Remover aspas + nota de que é paráfrase, OU usar [INSERIR: trecho literal] |
| Usuário pede citação sobre tema sem fornecer caso | Apresentar as 3 opções (formatar caso que ele forneça / sugerir com VERIFICAR / placeholder) |
| Inconsistência tribunal x tipo de recurso | BLOCK + alertar usuário sobre incoerência antes de continuar |
| Dados sigilosos/dados pessoais de partes | Anonimizar conforme CPC art. 189 antes de incluir |
