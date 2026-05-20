# Task: Criar e Executar Follow-Up de Paciente

**Squad**: clinic-mgmt  
**Agent**: patient-care  
**UC**: UC-AN-004  
**Pattern**: AN-TASK-004

---

## Input Esperado

```yaml
required:
  - patient_id: UUID
  - trigger_type: post_consultation | periodic | milestone | manual
optional:
  - treatment_id: UUID
  - consultation_id: UUID (para follow-up pós-consulta)
  - custom_message: string
  - override_channel: whatsapp | email | phone | push
```

## Passos de Execução

```
1. CONTEXTO DO PACIENTE:
   ├── Carregar: nome, canal preferido, tratamento ativo, última consulta
   └── Verificar consentimento LGPD para comunicação

2. GERAR RÉGUA (pós-consulta):
   ├── D+1: boas-vindas + instruções pós-consulta
   ├── D+2: check sentimento ("Como você está se sentindo?")
   ├── D+7: verificação medicação domiciliar (se houver prescrição)
   ├── D+14: lembrete procedimento agendado
   └── D+30: NPS + coleta de evolução

3. EXECUTAR CONTATO (canal):
   ├── WhatsApp → delegar para @chatbot-humanized com contexto
   ├── Email → usar template follow-up-contact-script
   └── Telefone → gerar script estruturado para colaborador humano

4. SCRIPT DE LIGAÇÃO (canal telefone):
   ├── Abertura personalizada com nome do paciente
   ├── Perguntas específicas do protocolo (peso, sintomas, medicação)
   ├── Campos de resposta estruturados
   └── Instruções de registro no sistema após ligação

5. REGISTRAR INTERAÇÃO:
   ├── Salvar em followup_schedules (status: sent/completed)
   ├── Salvar resposta em message_threads (se canal digital)
   └── Atualizar prontuário se métricas coletadas

6. ALERTAS:
   ├── SE resposta indica dor/reação → alert URGÊNCIA para médico
   ├── SE 3 tentativas sem resposta → alertar recepcionista
   └── SE métrica fora do esperado → preparar relatório para médico
```

## Output

```yaml
followup_id: UUID
patient_id: UUID
channel_used: string
message_sent: string
status: sent | delivered | read | responded | escalated
response_summary: string
metrics_collected: {weight_kg, symptoms, adherence_pct}
alert_generated: boolean
next_followup_date: DATE
```

## Quality Gate

- [ ] Consentimento LGPD verificado
- [ ] Canal de comunicação preferido utilizado (ou justificativa)
- [ ] Interação registrada no prontuário
- [ ] Alertas disparados para métricas fora do esperado
