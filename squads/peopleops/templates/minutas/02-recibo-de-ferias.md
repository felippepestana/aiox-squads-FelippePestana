# Minuta — Recibo de Férias

> Fonte canônica. Aviso e recibo de férias emitidos pelo `peopleops`. A versão web renderiza a partir dos dados do evento de férias. Campos entre `{{ }}` são preenchidos.

---

**{{empresa_nome}}** — CNPJ {{empresa_cnpj}}
Aviso e Recibo de Férias

| | |
|---|---|
| **Colaborador** | {{colaborador_nome}} |
| **Matrícula** | {{matricula}} |
| **Cargo** | {{cargo}} |
| **Período aquisitivo** | {{periodo_aquisitivo}} *(início – fim)* |
| **Período de gozo** | {{periodo_gozo}} *({{dias_gozo}} dias)* |
| **Retorno ao trabalho** | {{data_retorno}} |
| **Abono pecuniário** | {{abono}} *(venda de até 1/3 — opcional)* |

## Cálculo da remuneração de férias

| Descrição | Valor (R$) |
|:----------|---------:|
| Remuneração de férias ({{dias_gozo}} dias) | {{remuneracao_ferias}} |
| Adicional de 1/3 constitucional | {{terco_constitucional}} |
{{#abono_pecuniario}}
| Abono pecuniário ({{dias_abono}} dias) | {{valor_abono}} |
| 1/3 sobre o abono | {{terco_abono}} |
{{/abono_pecuniario}}
| **(–) INSS sobre férias** | {{desconto_inss}} |
| **(–) IRRF sobre férias** | {{desconto_irrf}} |
| **Líquido de férias** | **{{liquido_ferias}}** |

> **Prazos legais:** o pagamento das férias e do 1/3 deve ocorrer até **2 dias antes** do início do gozo (CLT Art. 145); o aviso ao colaborador, com **30 dias** de antecedência (Art. 135).

---

Recebi o aviso e a importância líquida de férias acima discriminada.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**{{colaborador_nome}}** — {{cidade}}, {{data_pagamento}}

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**{{empresa_nome}}** *(empregador)*

<small>Base legal: CLT Arts. 129–145 (férias), Art. 7º XVII CF (1/3 constitucional). Evento eSocial S-2230 (afastamento) mapeado pelo peopleops.</small>
