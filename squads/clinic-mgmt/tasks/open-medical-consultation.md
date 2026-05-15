# Task: Abrir Consulta Médica com Assistente de Voz

**Squad**: clinic-mgmt  
**Agent**: medical-ops  
**UC**: UC-AN-001  
**Pattern**: AN-TASK-001

---

## Input Esperado

```yaml
required:
  - patient_id: UUID do paciente
  - doctor_id: UUID do médico autenticado
  - appointment_id: UUID do agendamento (ou null para consulta avulsa)
optional:
  - treatment_id: UUID do tratamento ativo (para contexto)
  - consultation_type: initial | followup | urgency
```

## Passos de Execução

```
1. PRÉ-CHECKS:
   ├── Verificar consentimento LGPD do paciente [QG-AN-003]
   ├── Verificar autenticação do médico (PIN + sessão ativa)
   └── Carregar histórico resumido (últimas 3 consultas + tratamento ativo)

2. INTERFACE DE ATENDIMENTO:
   ├── Exibir ficha rápida do paciente (painel lateral)
   ├── Exibir alertas: alergias, medicamentos em uso, última consulta
   └── Apresentar botão "Iniciar Gravação"

3. GRAVAÇÃO E TRANSCRIÇÃO:
   ├── Médico ativa gravação de voz
   ├── skill:voice-transcription processa em streaming
   └── Transcrição exibida em tempo real na interface

4. ESTRUTURAÇÃO AUTOMÁTICA (durante gravação):
   ├── Extrair: queixa principal, exame clínico, diagnóstico
   ├── Extrair: plano terapêutico, prescrições, procedimentos solicitados
   └── Destacar em azul os campos auto-preenchidos

5. REVISÃO PELO MÉDICO:
   ├── Editor com campos pré-preenchidos pela IA
   ├── Alertas de contraindicação cruzando com histórico
   └── Médico edita/aprova cada seção

6. ASSINATURA DIGITAL:
   ├── Médico confirma prontuário final
   ├── skill:digital-signature aplica hash + timestamp
   └── Prontuário salvo como imutável

7. PRÓXIMOS PASSOS (janela final):
   ├── Listar procedimentos solicitados na consulta
   ├── Sugerir datas baseadas no protocolo ativo
   ├── Médico seleciona/ajusta datas
   └── Confirmar → acionar stock-controller para reservar insumos

8. FINALIZAÇÃO:
   ├── Prontuário salvo no banco (consultation + structured_data)
   ├── Notificar @patient-care para criar régua de follow-up
   └── Notificar @stock-controller para reservar insumos dos procedimentos agendados
```

## Output

```yaml
consultation_id: UUID
patient_id: UUID
doctor_id: UUID
transcript: text
structured_data:
  chief_complaint: string
  physical_exam: string
  diagnosis: string
  treatment_plan: string
  prescriptions: [{drug, dose, route, frequency, duration}]
  procedures_requested: [procedure_id]
  exams_requested: [string]
  patient_instructions: string
digital_signature:
  hash: string
  timestamp: ISO8601
  doctor_crm: string
appointments_created: [appointment_id]
```

## Quality Gate

- [ ] Prontuário contém todos os campos obrigatórios CFM
- [ ] Assinatura digital presente com hash válido
- [ ] Pelo menos 1 campo de conduta preenchido
- [ ] Insumos reservados para procedimentos agendados
