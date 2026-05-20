# Template: Resumo de Consulta Médica

**Squad**: clinic-mgmt | **Agent**: medical-ops | **Formato**: Markdown + PDF

---

## PRONTUÁRIO DE CONSULTA MÉDICA
**Clínica Anmar** | Data: `{{consultation_date}}` | Hora: `{{consultation_time}}`

---

### Identificação

| Campo | Dados |
|-------|-------|
| **Paciente** | {{patient_name}} |
| **Data de Nascimento** | {{patient_birth_date}} |
| **Prontuário Nº** | {{medical_record_number}} |
| **Médico** | Dr(a). {{doctor_name}} — CRM {{doctor_crm}} |
| **Tipo de Consulta** | {{consultation_type}} |

---

### 1. Queixa Principal / Motivo da Consulta

{{chief_complaint}}

---

### 2. História da Doença Atual (HDA)

{{history_of_present_illness}}

---

### 3. Antecedentes Relevantes

**Patologias**: {{medical_history}}  
**Medicamentos em uso**: {{current_medications}}  
**Alergias**: {{allergies}}  
**Cirurgias anteriores**: {{previous_surgeries}}

---

### 4. Exame Clínico

{{physical_exam}}

**Dados Vitais**:
- Peso: {{weight_kg}} kg | IMC: {{bmi}}
- PA: {{blood_pressure}} | FC: {{heart_rate}} bpm
- Temperatura: {{temperature}} °C

---

### 5. Hipótese Diagnóstica

{{diagnosis}}

CID-10: {{cid10_code}} — {{cid10_description}}

---

### 6. Plano Terapêutico

{{treatment_plan}}

---

### 7. Prescrições

{{#each prescriptions}}
- **{{drug_name}}** {{dose}} — {{route}} — {{frequency}} — por {{duration}}
{{/each}}

---

### 8. Procedimentos Solicitados

{{#each procedures_requested}}
- {{procedure_name}} — previsto para {{scheduled_date}}
{{/each}}

---

### 9. Exames Complementares

{{exams_requested}}

---

### 10. Orientações ao Paciente

{{patient_instructions}}

---

### 11. Retorno

{{return_instructions}}

---

### Assinatura Digital

```
Médico: Dr(a). {{doctor_name}} | CRM: {{doctor_crm}}
Hash: {{digital_signature_hash}}
Timestamp: {{signature_timestamp}}
```

*Este documento foi gerado eletronicamente e é válido nos termos da Resolução CFM 1821/2007.*

---
*Clínica Anmar — CNPJ: {{clinic_cnpj}} | {{clinic_address}}*
