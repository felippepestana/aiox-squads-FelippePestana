# Exemplo — Estratégia recursal em Recurso Especial

## Objetivo

Demonstrar a execução esperada do `UC-LP-004` para avaliar admissibilidade e conveniência de Recurso Especial ao STJ.

## Input fictício

```text
Preciso avaliar se vale interpor Recurso Especial contra acórdão do TJSP em ação indenizatória. A decisão manteve condenação por dano moral, mas ignorou tese de violação ao art. 944 do Código Civil e divergiu de precedentes do STJ sobre proporcionalidade do quantum. Houve embargos de declaração parcialmente rejeitados. Restam 8 dias úteis de prazo.
```

## Classificação esperada

| Campo | Valor |
|---|---|
| UC | `UC-LP-004` |
| Modo | `MODO_RECURSAL` |
| Prioridade | Alta |
| Entregável | Relatório recursal com recomendação |

## Rota esperada

```text
legal-performance-chief
-> process-intake-analyst
-> civil-procedure-classifier
-> procedural-auditor
-> legal-document-reader
-> jurisprudence-researcher
-> appeals-analyst
-> legal-action-advisor
-> legal-report-writer
-> quality-compliance-validator
```

## Saída esperada resumida

### 1. Admissibilidade

| Requisito | Resultado esperado | Observação |
|---|---|---|
| Cabimento | A verificar/apto em tese | REsp exige violação de lei federal ou divergência jurisprudencial |
| Legitimidade | Apto | Parte sucumbente possui legitimidade |
| Interesse recursal | Apto | Condenação mantida gera interesse |
| Tempestividade | Apto com urgência | Restam 8 dias úteis |
| Preparo | A verificar | Conferir custas/porte de remessa se aplicável |
| Prequestionamento | Ponto crítico | Embargos parcialmente rejeitados podem indicar tentativa de prequestionamento |
| Revolvimento de fatos | Risco crítico | STJ não reexamina prova; tese deve ser de direito |

### 2. Pesquisa jurídica

O `jurisprudence-researcher` deve buscar:

- STJ sobre revisão de quantum indenizatório apenas quando irrisório ou exorbitante;
- aplicação do CC art. 944;
- Súmula 7/STJ como risco de não conhecimento;
- precedentes recentes sobre proporcionalidade em dano moral.

### 3. Recomendação esperada

```text
INTERPOR COM CAUTELAS, se a tese puder ser formulada como violação de lei federal e divergência jurisprudencial, sem depender de reexame probatório. O ponto crítico é demonstrar prequestionamento suficiente do art. 944 do Código Civil e afastar incidência da Súmula 7/STJ.
```

### 4. Plano de ação

| Prazo | Ação | Responsável | Objetivo |
|---|---|---|---|
| 24h | Revisar acórdão e embargos | Advogado | Confirmar prequestionamento |
| 48h | Selecionar precedentes STJ similares | Pesquisa jurídica | Construir dissídio e tese federal |
| 72h | Validar risco de Súmula 7/STJ | Advogado sênior | Evitar recurso inadmissível |
| Até D-2 | Fechar minuta e preparo | Jurídico | Protocolar com margem de segurança |

## Quality gates esperados

- `QG-LP-001`: aprovado com `UC-LP-004`.
- `QG-LP-002`: aprovado se acórdão, embargos e precedentes estiverem rastreados.
- `QG-LP-003`: aprovado se prazo e riscos processuais forem auditados.
- `QG-LP-006`: aprovado se revisão humana for obrigatória.
- `QG-LP-008`: aprovado se o relatório contiver admissibilidade, mérito, riscos e recomendação.

## Bloco de citações esperado

```citacoes
documento: Acórdão fictício TJSP — ação indenizatória
trecho: Manutenção de condenação por dano moral com discussão sobre quantum.
tipo: peca-processual
confiabilidade: media
---
documento: Embargos de declaração fictícios
trecho: Tentativa de prequestionamento do art. 944 do Código Civil.
tipo: peca-processual
confiabilidade: media
---
documento: Código Civil
trecho: Art. 944 — a indenização mede-se pela extensão do dano.
tipo: legislacao
confiabilidade: alta
---
documento: STJ
trecho: Jurisprudência sobre revisão de dano moral apenas quando valor for irrisório ou exorbitante.
tipo: jurisprudencia
confiabilidade: alta
---
```

## Critério de aprovação do exemplo

O exemplo passa se a saída não prometer provimento, tratar prequestionamento e Súmula 7/STJ como riscos centrais e terminar com recomendação condicionada e plano de prazo.
