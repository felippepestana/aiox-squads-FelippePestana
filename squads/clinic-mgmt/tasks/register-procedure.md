# Task: Cadastrar Procedimento ou Serviço

**Squad**: clinic-mgmt  
**Agent**: intake-coordinator  
**UC**: UC-AN-002  
**Pattern**: AN-TASK-007

---

## Input Esperado

```yaml
required:
  - name: string
  - category: estetica_corporal | estetica_facial | emagrecimento | hormonal | funcional | consulta
  - duration_minutes: integer
  - required_staff_role: doctor | nurse | technician
optional:
  - code: string (código interno)
  - tuss_code: string (código TUSS quando aplicável)
  - equipment_ids: [UUID]
  - room_type: string
  - supply_items: [{item_id: UUID, quantity: decimal}]
  - suggested_price: decimal
  - cost_center: string
```

## Passos de Execução

```
1. VALIDAÇÃO:
   ├── Nome único no catálogo da clínica
   └── Se supply_items: verificar que todos os item_ids existem no inventário

2. CÁLCULO DE CUSTO REAL:
   ├── Soma insumos: sum(qty × item.unit_cost)
   ├── Custo hora profissional: (duration_minutes / 60) × role.hourly_cost
   ├── Overhead proporcional: clinic_overhead / procedures_per_month (estimado)
   └── base_cost = insumos + hora + overhead

3. MARGEM:
   ├── Se suggested_price informado: calcular margem %
   └── Se margem < 15%: alertar para revisão de preço

4. SALVAR:
   ├── Inserir em procedure_catalog
   └── Marcar como active = true

5. NOTIFICAÇÕES:
   ├── @stock-controller: novos insumos associados ao procedimento
   └── @financial-intel: novo item no catálogo com custo real
```

## Output

```yaml
procedure_id: UUID
code: string
name: string
category: string
duration_minutes: integer
base_cost: decimal
suggested_price: decimal
margin_pct: decimal
supply_items_count: integer
active: boolean
```

## Quality Gate

- [ ] Custo real calculado (não zero)
- [ ] Duração definida
- [ ] Profissional responsável configurado
- [ ] Todos os insumos existem no inventário
