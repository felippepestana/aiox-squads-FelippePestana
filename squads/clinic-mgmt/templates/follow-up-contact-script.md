# Template: Script de Contato de Follow-Up

**Squad**: clinic-mgmt | **Agent**: patient-care | **Canal**: Telefone + WhatsApp

---

## SCRIPT DE LIGAÇÃO — FOLLOW-UP PÓS-CONSULTA
**Paciente**: {{patient_name}} | **Data**: {{contact_date}} | **Colaborador**: {{staff_name}}

---

### Abertura (30 segundos)

> "Olá, {{patient_first_name}}! Aqui é {{staff_name}} da Clínica Anmar. Tudo bem?
> Estou ligando para fazer um acompanhamento rápido depois da sua consulta com 
> Dr(a). {{doctor_name}} em {{consultation_date}}. Tem um minutinho?"

**Se não puder atender**: Solicitar melhor horário para retorno.

---

### Verificação de Bem-Estar

> "Como você está se sentindo desde a consulta?"

[ ] Ótimo / Muito bem  
[ ] Bem, sem queixas  
[ ] Com algumas dúvidas  
[ ] Com desconforto (→ **ESCALAR PARA MÉDICO**)  
[ ] Com dor ou reação (→ **ESCALAR URGÊNCIA MÉDICA**)  

**Observações**: _______________________________________________

---

### Verificação de Medicação (se houver prescrição)

**Medicamentos prescritos**: {{prescribed_medications}}

> "Você está conseguindo tomar {{medication_name}} direitinho? {{dose}} {{frequency}}?"

[ ] Sim, sem dificuldades  
[ ] Sim, mas com dificuldade para lembrar  
[ ] Não está tomando — motivo: _______________  
[ ] Sentiu algum efeito indesejado: _______________  

---

### Coleta de Métricas ({{specialty}} — conforme protocolo)

{{#if is_slimming_protocol}}
> "Pode me informar seu peso atual?"
**Peso**: _______ kg (meta: {{target_weight_kg}} kg)

> "Está seguindo as orientações de alimentação?"
[ ] Sim [ ] Parcialmente [ ] Não — motivo: _______________
{{/if}}

{{#if is_hormonal_protocol}}
> "Sentiu alguma diferença de humor, energia ou sono desde o início do tratamento?"
[ ] Melhora significativa [ ] Melhora leve [ ] Sem mudança [ ] Piora — especificar: ___
{{/if}}

---

### Próximo Passo no Protocolo

**Próximo procedimento**: {{next_procedure_name}}  
**Data agendada**: {{next_appointment_date}}

> "Você está confirmado para {{next_procedure_name}} no dia {{next_appointment_date}} 
> às {{next_appointment_time}}. Vou te mandar uma mensagem de lembrete um dia antes, tudo bem?"

[ ] Confirmado [ ] Precisa reagendar — melhor data: _______________

---

### Encerramento

> "Perfeito! Se tiver qualquer dúvida ou sentir algo diferente, pode entrar em contato
> conosco a qualquer momento pelo WhatsApp: {{clinic_whatsapp}}
> Vai ser um prazer continuar cuidando de você! Até a próxima, {{patient_first_name}}!"

---

### Registro (preencher após a ligação)

**Duração da ligação**: _______ minutos  
**Resumo do contato**: _______________________________________________  
**Ações geradas**:  
[ ] Reagendamento necessário  
[ ] Alerta médico enviado  
[ ] Métricas registradas no prontuário  
[ ] Dúvida encaminhada para médico  

**Colaborador**: {{staff_name}} | **Registro em**: {{log_timestamp}}

---

## MENSAGEM WHATSAPP (alternativa ao telefone)

```
Olá, {{patient_first_name}}! 💚

Aqui é a equipe da Clínica Anmar.

Passando para saber como você está se sentindo após sua consulta 
com Dr(a). {{doctor_name}} no dia {{consultation_date}}.

Como você está? 😊

1️⃣ Ótimo, sem queixas
2️⃣ Bem, com algumas dúvidas
3️⃣ Com algum desconforto

Responda com o número ou me conte como está se sentindo!
```
