# Task: Sincronizar com Sistema Contábil

**Squad**: clinic-mgmt  
**Agent**: accounting-bridge  
**UC**: UC-AN-007  
**Pattern**: AN-TASK-009

---

## Input Esperado

```yaml
required:
  - provider: conta_azul | omie | tangerino | nfe_io
  - sync_type: transactions | payroll | invoice | full
  - period_start: DATE
  - period_end: DATE
optional:
  - force_resync: boolean  # false por padrão — respeita idempotência
  - dry_run: boolean       # simular sem enviar
```

## Passos de Execução

```
1. PRÉ-VERIFICAÇÃO DE IDEMPOTÊNCIA (QG-AN-004):
   ├── Para cada transação no período:
   │   ├── Verificar se UUID já existe em accounting_exports (por provider)
   │   └── Marcar como: pending | already_exported | error_retry
   └── Relatório pré-sync: N transações novas, M já exportadas

2. DRY RUN (se solicitado):
   ├── Simular chamadas de API sem enviar
   └── Retornar preview do que seria exportado

3. SINCRONIZAÇÃO CONTA AZUL:
   ├── Receitas → POST /v1/financial-accounts/entries (tipo: RECEITA)
   ├── Despesas → POST /v1/financial-accounts/entries (tipo: DESPESA)
   ├── Mapeamento de categorias: procedure_revenue → "Receita de Serviços"
   └── Response: registrar em accounting_exports (status + external_id)

4. EMISSÃO NF-e (NFe.io):
   ├── Para cada transaction com invoice_required=true e status=paid
   ├── POST /v2/companies/{id}/serviceinvoices
   ├── Aguardar aprovação prefeitura (async webhook)
   └── Salvar XML + PDF no Storage + vincular à transaction

5. IMPORTAÇÃO TANGERINO:
   ├── GET horas trabalhadas por colaborador no período
   ├── Calcular custo total de horas por centro de custo
   └── Enviar para @financial-intel para composição de CMV

6. RECONCILIAÇÃO:
   ├── Comparar totais: Anmar vs. sistema externo
   ├── Alertar em caso de divergência > R$ 0,01
   └── Log detalhado de cada item reconciliado

7. RELATÓRIO FINAL:
   ├── Exportados com sucesso: N
   ├── Já existiam (skip): M
   ├── Erros: K (com detalhes)
   └── Salvar em accounting_exports com timestamp
```

## Output

```yaml
sync_id: UUID
provider: string
period: {start, end}
results:
  exported: integer
  skipped_duplicate: integer
  errors: integer
  total_amount_exported: decimal
invoices_issued: integer
errors: [{transaction_id, error_code, message}]
reconciliation_status: ok | divergence_detected
report_summary: string
```

## Quality Gate

- [ ] Idempotência verificada (zero duplicatas)
- [ ] Todos os erros documentados com transaction_id
- [ ] Reconciliação executada
- [ ] Accounting_exports atualizado para auditoria
