# Template: Relatório de Progresso do Protocolo

**Squad**: clinic-mgmt | **Agent**: patient-care + visual-analyst | **Formato**: PDF para paciente

---

## RELATÓRIO DE EVOLUÇÃO — {{protocol_name}}
**Clínica Anmar** | **Paciente**: {{patient_name}} | **Período**: {{period_label}}

---

### Seu Progresso em Números

| Métrica | Início | Hoje | Evolução |
|---------|--------|------|---------|
| Peso | {{baseline_weight}} kg | {{current_weight}} kg | {{weight_delta}} kg |
| % Gordura Corporal | {{baseline_fat_pct}}% | {{current_fat_pct}}% | {{fat_delta}} p.p. |
| % Massa Muscular | {{baseline_muscle_pct}}% | {{current_muscle_pct}}% | {{muscle_delta}} p.p. |
| IMC | {{baseline_bmi}} | {{current_bmi}} | {{bmi_delta}} |

**Score de Evolução**: {{evolution_score}}/100 {{evolution_badge}}

---

### Procedimentos Realizados

| Data | Procedimento | Resultado |
|------|-------------|---------|
{{#each completed_procedures}}
| {{date}} | {{name}} | {{notes}} |
{{/each}}

---

### Próximos Passos no Seu Protocolo

| Etapa | Procedimento | Data Prevista |
|-------|-------------|--------------|
{{#each upcoming_steps}}
| {{step_number}} | {{name}} | {{scheduled_date}} |
{{/each}}

---

### Evolução Visual

*[Seção visível apenas com consentimento explícito do paciente]*

{{#if photos_authorized}}
**Antes → Agora** *({{days_elapsed}} dias de tratamento)*

[Comparativo fotográfico inserido automaticamente]

*As fotos são de uso estritamente privado e armazenadas com segurança.*
{{/if}}

---

### Mensagem do Seu Médico

> "{{doctor_message}}"
> 
> — Dr(a). {{doctor_name}}

---

### Próximo Agendamento

📅 **{{next_appointment_procedure}}**  
🗓️ {{next_appointment_date}} às {{next_appointment_time}}  
📍 {{clinic_name}} — {{clinic_address}}

---

*Dúvidas? Fale com nossa equipe: {{clinic_whatsapp}}*  
*Clínica Anmar — Cuidando da sua evolução com ciência e cuidado.*
