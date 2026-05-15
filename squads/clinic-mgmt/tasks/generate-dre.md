# Task: Gerar DRE Especializada

**Squad**: clinic-mgmt  
**Agent**: financial-intel  
**UC**: UC-AN-005  
**Pattern**: AN-TASK-005

---

## Input Esperado

```yaml
required:
  - period_start: DATE (YYYY-MM-DD)
  - period_end: DATE (YYYY-MM-DD)
  - clinic_id: UUID
optional:
  - granularity: total | by_specialty | by_procedure | by_doctor
  - include_projections: boolean
  - export_to_accounting: boolean  # acionar @accounting-bridge
```

## Passos de Execução

```
1. COLETA DE RECEITAS:
   ├── Query transactions WHERE type='revenue' AND reference_date BETWEEN start/end
   ├── Agrupar por: category (procedure, consultation, program, supplement)
   └── Calcular impostos sobre serviços (ISS + Simples Nacional conforme regime)

2. COLETA DE CUSTOS DIRETOS (CMV):
   ├── Insumos dispensados: stock_movements WHERE type='out_procedure'
   ├── Medicamentos dispensados: stock_movements WHERE type='out_dispensation'
   └── Hora profissional: importar de @accounting-bridge (Tangerino) ou custo manual

3. DESPESAS OPERACIONAIS:
   ├── Query transactions WHERE type='expense' AND reference_date BETWEEN start/end
   └── Agrupar por subcategoria (folha, aluguel, energia, marketing, sistemas, outros)

4. DEPRECIAÇÃO:
   ├── Calcular depreciação mensal por equipamento (valor / vida_útil_meses)
   └── Somar depreciação do período

5. COMPOSIÇÃO DA DRE:
   ├── Receita Bruta = sum(receitas por categoria)
   ├── (-) Impostos
   ├── = Receita Líquida
   ├── (-) CMV = insumos + hora profissional
   ├── = Lucro Bruto / Margem Bruta %
   ├── (-) Despesas Operacionais
   ├── (-) Depreciação
   ├── = EBITDA / Margem EBITDA %
   ├── (-) Resultado financeiro
   ├── = LAIR
   ├── (-) IR/CSLL
   └── = Lucro Líquido / Margem Líquida %

6. ANÁLISE AUTOMÁTICA:
   ├── Comparar com período anterior (MoM) e mesmo período ano anterior (YoY)
   ├── Identificar procedimentos com maior e menor margem
   └── Alertas: margem líquida < 10%, despesas crescendo > receita

7. OUTPUT:
   ├── JSON estruturado para dashboard
   ├── PDF relatório formatado (usar template DRE)
   └── SE export_to_accounting: acionar @accounting-bridge
```

## Output

```yaml
period: {start, end}
currency: BRL
revenue:
  gross: decimal
  by_category: {procedures, consultations, programs, supplements}
  taxes: decimal
  net: decimal
cogs:
  supplies: decimal
  professional_hours: decimal
  total: decimal
gross_profit: decimal
gross_margin_pct: decimal
operating_expenses:
  payroll: decimal
  rent: decimal
  energy: decimal
  marketing: decimal
  systems: decimal
  other: decimal
  depreciation: decimal
  total: decimal
ebitda: decimal
ebitda_margin_pct: decimal
financial_result: decimal
income_before_tax: decimal
taxes_on_profit: decimal
net_profit: decimal
net_margin_pct: decimal
insights:
  top_procedures_by_margin: [{procedure, margin_pct}]
  alerts: [string]
  mom_comparison: {revenue_delta_pct, profit_delta_pct}
report_pdf_url: string
```

## Quality Gate

- [ ] Todas as receitas do período incluídas
- [ ] CMV calculado com insumos reais (não estimados)
- [ ] Margem bruta e líquida calculadas
- [ ] PDF gerado com dados completos
