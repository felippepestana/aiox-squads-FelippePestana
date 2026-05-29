# Exemplo — Análise processual civil

## Objetivo

Demonstrar a execução esperada do `UC-LP-003` para uma ação de cobrança em fase de conhecimento, combinando triagem CPC, auditoria processual, leitura de peças, pesquisa jurídica, estratégia e plano de ação.

## Input fictício

```text
Preciso analisar uma ação de cobrança em fase de conhecimento. O autor, Alfa Serviços Ltda., cobra R$ 86.400,00 de Beta Comércio Ltda. Há petição inicial, contestação e decisão de saneamento. A contestação alega prescrição parcial, ausência de aceite em duas notas fiscais e excesso no cálculo de juros. Quero entender riscos CPC, pontos fortes e fracos, cenário provável e próximos passos para o autor.
```

## Classificação esperada

| Campo | Valor |
|---|---|
| UC | `UC-LP-003` |
| Modo | `MODO_JURIDICO` |
| Prioridade | Alta, se houver prazo probatório aberto |
| Entregável | Relatório Legal Performance |

## Rota esperada

```text
legal-performance-chief
-> process-intake-analyst
-> civil-procedure-classifier
-> procedural-auditor
-> legal-document-reader
-> jurisprudence-researcher
-> litigation-strategist
-> legal-action-advisor
-> legal-report-writer
-> quality-compliance-validator
```

## Saída esperada resumida

### 1. Triagem e classificação

| Dimensão | Resultado esperado |
|---|---|
| Tipo de ação | Processo de conhecimento — ação condenatória de cobrança |
| Fase | Saneamento/instrução, após contestação |
| Polo ativo | Alfa Serviços Ltda. |
| Polo passivo | Beta Comércio Ltda. |
| Próximo foco | Prova documental, eventual prova pericial contábil e manifestação sobre saneamento |

### 2. Auditoria CPC

| Risco | Base | Gravidade | Encaminhamento |
|---|---|---|---|
| Prescrição parcial alegada | CC arts. 205/206; CPC art. 487, II | Alta se notas antigas estiverem fora do prazo | Verificar vencimento de cada nota e causas interruptivas |
| Ônus da prova sobre aceite | CPC art. 373, I | Médio/Alto | Localizar aceite, e-mails, canhotos, ordem de compra ou prova de entrega |
| Juros impugnados | CPC art. 491; CC arts. 389/406 | Médio | Recalcular memória discriminada do débito |

### 3. Extração de peças

O `legal-document-reader` deve extrair, por documento:

- pedidos principais e subsidiários;
- fundamentos legais citados;
- impugnações da contestação;
- pontos controvertidos fixados no saneamento;
- provas deferidas ou pendentes.

### 4. Pesquisa jurídica

O `jurisprudence-researcher` deve pesquisar:

- ônus da prova em ação de cobrança mercantil;
- aceite e comprovação de prestação de serviço;
- critérios de juros e correção monetária;
- precedentes STJ sobre documentos comerciais e prova do débito, com fonte rastreada.

### 5. Estratégia

| Cenário | Probabilidade | Premissas |
|---|---:|---|
| Otimista | 45% | Autor comprova aceite/entrega e recalcula juros sem excesso relevante |
| Realista | 40% | Condenação parcial com exclusão de notas sem aceite ou ajuste de juros |
| Pessimista | 15% | Prescrição parcial relevante e prova insuficiente sobre parte do débito |

### 6. Plano de ação

| Prazo | Ação | Responsável | Objetivo |
|---|---|---|---|
| 3 dias | Conferir vencimento de todas as notas | Jurídico/financeiro do autor | Responder alegação de prescrição |
| 5 dias | Reunir comprovantes de aceite e entrega | Cliente/autor | Reforçar prova do fato constitutivo |
| 7 dias | Revisar memória de cálculo | Contábil/jurídico | Reduzir risco de excesso |
| Antes da instrução | Preparar rol de testemunhas ou prova complementar | Advogado | Cobrir lacunas probatórias |

## Quality gates esperados

- `QG-LP-001`: aprovado com `UC-LP-003`.
- `QG-LP-002`: aprovado se fontes jurídicas e documentos estiverem identificados.
- `QG-LP-003`: aprovado se riscos CPC citarem base legal.
- `QG-LP-004`: aprovado se cenários somarem 100%.
- `QG-LP-006`: aprovado se houver aviso de revisão humana.
- `QG-LP-008`: aprovado se relatório estiver completo.

## Bloco de citações esperado

```citacoes
documento: Petição inicial fictícia Alfa Serviços Ltda. vs. Beta Comércio Ltda.
trecho: Pedido de condenação ao pagamento de R$ 86.400,00 por notas fiscais inadimplidas.
tipo: peca-processual
confiabilidade: media
---
documento: Contestação fictícia Beta Comércio Ltda.
trecho: Alegação de prescrição parcial, ausência de aceite e excesso de juros.
tipo: peca-processual
confiabilidade: media
---
documento: Código de Processo Civil
trecho: CPC art. 373, I — ônus do autor quanto ao fato constitutivo do direito.
tipo: legislacao
confiabilidade: alta
---
```

## Critério de aprovação do exemplo

O exemplo passa se a saída final for um relatório com triagem, auditoria, pesquisa, cenários, plano e citações rastreadas, sem inventar documentos não fornecidos.
