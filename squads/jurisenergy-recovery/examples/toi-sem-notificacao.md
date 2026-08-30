# Exemplo — TOI com prova material boa e contraditório falho

## Objetivo

Demonstrar a execução esperada do `UC-JE-004` (workflow `wf-toi-review`) para um TOI com fotos e laudo adequados, mas sem comprovante de notificação ao consumidor — cenário clássico de saneamento antes da cobrança.

## Input fictício

```text
TOI 8812, UC comercial em Ariquemes: técnico identificado, fotos do desvio no medidor, laudo assinado, histórico de consumo de 24 meses com queda de 40% no período e memória de cálculo de recuperação de R$ 22.300. Não localizamos o comprovante de notificação ao consumidor nem recurso administrativo. Podemos cobrar?
```

## Classificação esperada

| Campo | Valor |
|---|---|
| Polo | Pré-contencioso / administrativo |
| Tema | TOI / recuperação de consumo |
| UC | `UC-JE-004` |
| Workflow | `wf-toi-review` |
| Validação humana | Obrigatória — o squad nunca declara fraude |

## Rota esperada

```text
juris-orchestrator
-> document-intake-validator
-> toi-legal-builder
-> legal-thesis-curator
-> (recovery-score-analyst somente se a recomendação final for "cobrar")
-> juris-orchestrator (gate QG-JE-004: validação técnica e jurídica humana)
```

## Saída esperada resumida

### 1. Intake documental

Checklist `toi` (data/document-checklists.yaml): notificação ao consumidor é item **obrigatório** — ausência classifica o caso como `pendente de saneamento`, com pendência para o setor de Cobrança.

### 2. Robustez do TOI

| Elemento | Avaliação esperada |
|---|---|
| Fotos, técnico, laudo, assinatura | Adequados (prova material OK) |
| Coerência cálculo × histórico | Queda de 40% coerente com a irregularidade apontada |
| Notificação + contraditório | AUSENTES — robustez rebaixada (faixa média, ~60-70/100) |
| Recomendação | **SANEAR** — obter comprovante ou renotificar antes de qualquer cobrança |

A recomendação de cobrança fica bloqueada enquanto o contraditório administrativo estiver comprometido; o risco de improcedência deve ser declarado alto se cobrado agora.

### 3. Jurisprudência aplicável

O `legal-thesis-curator` deve indicar o entendimento local sobre TOI sem contraditório/notificação (fonte completa) e os requisitos probatórios exigidos pelos julgadores, retroalimentando o checklist documental.

### 4. Não escalonamento indevido

O passo `collection-route` (Recovery Score) **não** deve ser acionado, pois a recomendação é sanear, não cobrar.

## Quality gates esperados

- `QG-JE-002`: caso pendente de saneamento pela ausência de notificação.
- `QG-JE-003`: score de robustez decomposto e rastreável aos anexos.
- `QG-JE-004`: nenhuma cobrança autorizada; validação humana obrigatória.

## Critério de aprovação do exemplo

O exemplo passa se a resposta for "sanear antes de cobrar" com pendência objetiva ao setor responsável, score de robustez decomposto, risco de improcedência declarado e nenhuma afirmação conclusiva de fraude — mesmo com prova material boa.
