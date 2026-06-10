# Minuta — Holerite (Demonstrativo de Pagamento)

> Fonte canônica. Demonstrativo de pagamento (contracheque) emitido a partir do cálculo de folha do `peopleops`. A versão web renderiza a partir do `payroll_run`. Campos entre `{{ }}` são preenchidos. Dado sensível não é persistido além do necessário.

---

**{{empresa_nome}}** — CNPJ {{empresa_cnpj}}
Demonstrativo de Pagamento — Competência **{{competencia}}** *(MM/AAAA)*

| | | | |
|---|---|---|---|
| **Colaborador** | {{colaborador_nome}} | **Matrícula** | {{matricula}} |
| **Cargo** | {{cargo}} | **Admissão** | {{data_admissao}} |
| **CBO** | {{cbo}} | **Dependentes (IRRF)** | {{dependentes}} |

## Proventos e descontos

| Cód. | Descrição | Referência | Proventos (R$) | Descontos (R$) |
|:----:|:----------|:----------:|---------------:|---------------:|
{{#proventos}}
| {{codigo}} | {{descricao}} | {{referencia}} | {{valor}} | |
{{/proventos}}
{{#descontos}}
| {{codigo}} | {{descricao}} | {{referencia}} | | {{valor}} |
{{/descontos}}
| | **Totais** | | **{{total_proventos}}** | **{{total_descontos}}** |

### Líquido a receber: **R$ {{liquido}}**

## Bases de cálculo

| | Valor (R$) |
|---|---:|
| **Base INSS** | {{base_inss}} |
| **Base FGTS** | {{base_fgts}} |
| **FGTS do mês (8%)** | {{fgts_mes}} |
| **Base IRRF** | {{base_irrf}} |
| **Faixa IRRF** | {{faixa_irrf}} |

> Descontos legais aplicados: INSS (tabela progressiva), IRRF (após deduções), Vale-Transporte (limitado a 6% do salário — CLT/Lei 7.418), faltas/atrasos quando houver. Explicação detalhada disponível via `peopleops` (`*explain-holerite`).

---

Recibo de pagamento — declaro ter recebido a importância líquida acima.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**{{colaborador_nome}}** — {{cidade}}, {{data_pagamento}}

<small>Base legal: CLT Art. 464 (recibo de pagamento) e Lei 4.923/1965. Valores conferidos no gate de fechamento de folha do peopleops; coerência com banco de horas (chronos) e eventos eSocial (S-1200).</small>
