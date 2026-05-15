# Task: Cadastrar Protocolo de Tratamento

**Squad**: clinic-mgmt  
**Agent**: intake-coordinator  
**UC**: UC-AN-002  
**Pattern**: AN-TASK-002

---

## Input Esperado

```yaml
required:
  - name: "Protocolo Slim Hormonal 8 Semanas"
  - specialty: emagrecimento | hormonal | estetica | funcional
  - duration_weeks: integer
  - steps: array de protocol_steps
  - responsible_doctor_id: UUID
optional:
  - description: string
  - target_patient_profile: string
  - estimated_cost: decimal
```

## Estrutura de Step

```yaml
step:
  order: integer (1, 2, 3...)
  name: "Consulta Inicial"
  type: clinic_procedure | home_medication | exam | teleconsult | followup
  week_from_start: integer
  procedure_id: UUID (se type == clinic_procedure)
  medication:               # se type == home_medication
    name: string
    dose: string
    route: string
    frequency: string
    duration_days: integer
  required_staff_role: doctor | nurse | technician
  room_required: boolean
  equipment_ids: [UUID]
  supply_items: [{item_id, quantity}]
  duration_minutes: integer
  patient_instructions: string
  followup_trigger: boolean  # se true, cria follow-up após este step
```

## Passos de Execução

```
1. VALIDAÇÃO DE ENTRADA:
   ├── Verificar que todos os procedure_id referenciados existem no catálogo
   ├── Verificar que todos os supply_items existem no inventário
   └── Verificar que o médico responsável tem CRM válido no sistema

2. CÁLCULO DE CUSTO:
   ├── Para cada step do tipo clinic_procedure:
   │   ├── Somar custo de insumos (qty × unit_cost)
   │   ├── Adicionar custo hora profissional (duration / 60 × hourly_rate)
   │   └── Adicionar overhead proporcional
   └── Retornar custo estimado total do protocolo

3. VALIDAÇÃO DE RECURSOS:
   ├── Verificar disponibilidade de equipamentos referenciados
   └── Verificar que salas com equipamentos corretos existem

4. SALVAR PROTOCOLO:
   ├── Inserir em treatment_protocols com steps como JSONB
   └── Marcar como ativo

5. NOTIFICAÇÕES:
   ├── Notificar @stock-controller: novos insumos necessários no protocolo
   └── Notificar @financial-intel: novo protocolo com custo estimado
```

## Output

```yaml
protocol_id: UUID
name: string
specialty: string
steps_count: integer
estimated_total_cost: decimal
estimated_duration_weeks: integer
supply_requirements: [{item_id, total_quantity_per_protocol}]
created_at: ISO8601
```

## Quality Gate

- [ ] Todos os procedure_ids existem no catálogo
- [ ] Custo estimado calculado
- [ ] Pelo menos 2 steps cadastrados
- [ ] Médico responsável com CRM válido
