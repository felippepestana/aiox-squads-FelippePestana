# Template: DRE — Demonstrativo de Resultado do Exercício

**Squad**: clinic-mgmt | **Agent**: financial-intel | **Formato**: Markdown + PDF

---

## DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO
**Clínica Anmar** | Período: `{{period_start}}` a `{{period_end}}`

---

### RECEITAS

| Categoria | Valor (R$) | % da Receita Bruta |
|-----------|-----------|-------------------|
| Procedimentos Estéticos | {{revenue_aesthetic}} | {{pct_aesthetic}}% |
| Procedimentos Corporais/Emagrecimento | {{revenue_slimming}} | {{pct_slimming}}% |
| Reposição Hormonal | {{revenue_hormonal}} | {{pct_hormonal}}% |
| Consultas Médicas | {{revenue_consultations}} | {{pct_consultations}}% |
| Programas/Protocolos | {{revenue_programs}} | {{pct_programs}}% |
| Medicamentos/Suplementos | {{revenue_supplements}} | {{pct_supplements}}% |
| **RECEITA BRUTA** | **{{revenue_gross}}** | **100%** |
| (-) Impostos e Tributos | ({{taxes}}) | ({{pct_taxes}}%) |
| **= RECEITA LÍQUIDA** | **{{revenue_net}}** | **{{pct_net}}%** |

---

### CUSTO DOS SERVIÇOS PRESTADOS (CMV)

| Item | Valor (R$) |
|------|-----------|
| Insumos e materiais utilizados | {{cogs_supplies}} |
| Medicamentos dispensados | {{cogs_medications}} |
| Custo hora profissional | {{cogs_labor}} |
| **TOTAL CMV** | **{{cogs_total}}** |

**LUCRO BRUTO**: R$ {{gross_profit}} | Margem Bruta: **{{gross_margin_pct}}%**

---

### DESPESAS OPERACIONAIS

| Categoria | Valor (R$) |
|-----------|-----------|
| Folha de pagamento (administrativo) | {{opex_payroll}} |
| Aluguel e condomínio | {{opex_rent}} |
| Energia, água e utilidades | {{opex_utilities}} |
| Marketing e publicidade | {{opex_marketing}} |
| Sistemas e tecnologia | {{opex_systems}} |
| Manutenção de equipamentos | {{opex_maintenance}} |
| Outras despesas | {{opex_other}} |
| Depreciação de equipamentos | {{depreciation}} |
| **TOTAL DESPESAS OPERACIONAIS** | **{{opex_total}}** |

**EBITDA**: R$ {{ebitda}} | Margem EBITDA: **{{ebitda_pct}}%**

---

### RESULTADO FINAL

| | Valor (R$) | Margem |
|-|-----------|--------|
| EBITDA | {{ebitda}} | {{ebitda_pct}}% |
| (-) Resultado financeiro | ({{financial_result}}) | |
| = LAIR | {{income_before_tax}} | |
| (-) IR/CSLL | ({{income_tax}}) | |
| **= LUCRO LÍQUIDO** | **{{net_profit}}** | **{{net_margin_pct}}%** |

---

### Análise por Procedimento (Top 5 Margem)

| Procedimento | Receita | CMV | Margem |
|-------------|---------|-----|--------|
{{#each top_procedures}}
| {{name}} | {{revenue}} | {{cogs}} | {{margin_pct}}% |
{{/each}}

---

### Alertas e Observações

{{#each alerts}}
⚠️ {{this}}
{{/each}}

---

### Comparativo

| KPI | {{current_period}} | {{previous_period}} | Variação |
|-----|-------------------|---------------------|---------|
| Receita Bruta | {{revenue_gross}} | {{prev_revenue}} | {{revenue_delta}}% |
| Margem Líquida | {{net_margin_pct}}% | {{prev_net_margin}}% | {{margin_delta}} p.p. |
| EBITDA | {{ebitda}} | {{prev_ebitda}} | {{ebitda_delta}}% |

---

*Gerado automaticamente pelo squad clinic-mgmt | Clínica Anmar — {{generated_at}}*
*Dados sincronizados com {{accounting_provider}}*
