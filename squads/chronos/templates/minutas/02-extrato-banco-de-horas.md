# Minuta — Extrato de Banco de Horas

> Fonte canônica. Demonstrativo do saldo de banco de horas, calculado de forma determinística pelo `bank-manager`. A versão web renderiza a partir do `bank_calculation`. Campos entre `{{ }}` são preenchidos.

---

**{{empresa_nome}}** — CNPJ {{empresa_cnpj}}
Extrato de Banco de Horas — Competência **{{competencia}}** · Filial {{filial}}

| | |
|---|---|
| **Colaborador** | {{colaborador_nome}} |
| **Matrícula** | {{matricula}} |
| **Regime de banco** | {{regime_banco}} *(acordo individual / CCT)* |
| **Validade de compensação** | {{validade_compensacao}} *(individual até 6 meses; CCT até 12 meses)* |

## Movimentação do período

| Data | Tipo | Descrição | Crédito | Débito |
|:----:|:----:|:----------|--------:|-------:|
{{#movimentos}}
| {{data}} | {{tipo}} | {{descricao}} | {{credito}} | {{debito}} |
{{/movimentos}}

## Saldo

| | Horas |
|---|---:|
| **Saldo anterior** | {{saldo_anterior}} |
| **(+) Créditos no período** | {{creditos}} |
| **(−) Débitos no período** | {{debitos}} |
| **(=) Saldo atual** | **{{saldo_atual}}** |

{{#passivos}}
> ⚠️ **Passivo identificado:** {{passivo}} *(ex: horas extras acima do limite diário; banco negativo a expirar). Encaminhado a peopleops para conciliação com a folha.)*
{{/passivos}}

**Horas a expirar até {{data_expiracao}}:** {{horas_a_expirar}} — *após o prazo de compensação, devem ser pagas como extras (não compensadas).*

---

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**{{colaborador_nome}}** — {{cidade}}, {{data_emissao}}

<small>Base legal: CLT Art. 59 §§ 2º e 5º (banco de horas) e Lei 13.467/2017. Cálculo determinístico e auditável; sincronizado com a folha (peopleops).</small>
