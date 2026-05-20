# Task: Agendar Procedimento Clínico

**Squad**: clinic-mgmt  
**Agent**: clinic-chief (coordena medical-ops + stock-controller)  
**UC**: UC-AN-001  
**Pattern**: AN-TASK-008

---

## Input Esperado

```yaml
required:
  - patient_id: UUID
  - procedure_id: UUID
  - treatment_id: UUID
  - preferred_dates: [DATE]  # 1-3 opções
  - responsible_staff_id: UUID
optional:
  - preferred_time_start: TIME
  - preferred_room_id: UUID
  - notes: string
```

## Passos de Execução

```
1. VERIFICAR DISPONIBILIDADE:
   ├── Profissional: sem conflito em appointments
   ├── Sala/equipamento: sem conflito para o período
   └── Estoque: insumos necessários disponíveis (via @stock-controller)

2. SUGERIR HORÁRIOS:
   ├── Encontrar 3 slots disponíveis mais próximos das datas preferidas
   └── Considerar duração do procedimento + tempo de limpeza da sala

3. CONFIRMAR COM PACIENTE:
   ├── Enviar opções via canal preferido (@chatbot-humanized ou @patient-care)
   └── Aguardar confirmação

4. CRIAR AGENDAMENTO:
   ├── Inserir em appointments
   ├── Bloquear recurso (staff + room + equipment)
   └── Reservar insumos em estoque

5. NOTIFICAÇÕES:
   ├── Paciente: confirmação + lembrete D-1 e D0 (2h antes)
   ├── Profissional: notificação de novo agendamento
   └── @stock-controller: reservar insumos para a data
```

## Output

```yaml
appointment_id: UUID
scheduled_at: ISO8601
staff_id: UUID
room_id: UUID
status: confirmed
supplies_reserved: [{item_id, quantity}]
reminders_scheduled: [ISO8601]
patient_notified: boolean
```

## Quality Gate

- [ ] Sem conflito de agenda (profissional + sala)
- [ ] Insumos disponíveis para a data
- [ ] Paciente notificado da confirmação
- [ ] Lembretes agendados (D-1 e 2h antes)
