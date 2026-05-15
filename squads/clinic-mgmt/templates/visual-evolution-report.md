# Template: Relatório de Análise Visual de Evolução

**Squad**: clinic-mgmt | **Agent**: visual-analyst | **Formato**: PDF (uso clínico)

---

## RELATÓRIO DE ANÁLISE VISUAL
**Clínica Anmar** | **Paciente**: {{patient_name}} | **Gerado em**: {{generated_date}}

---

### Identificação

| Campo | Dados |
|-------|-------|
| Paciente | {{patient_name}} — CPF: {{patient_cpf_masked}} |
| Médico Responsável | Dr(a). {{doctor_name}} — CRM {{doctor_crm}} |
| Protocolo Ativo | {{protocol_name}} |
| Início do Tratamento | {{treatment_start_date}} |
| Dias em Tratamento | {{days_elapsed}} dias |

---

### Score de Evolução Visual

**{{evolution_score}}/100** — {{evolution_label}}

*Score calculado por análise computacional de imagens. Sujeito a validação clínica.*

---

### Análise Comparativa

#### Período: {{baseline_date}} → {{current_date}}

| Ângulo | Baseline | Atual | Observação IA |
|--------|---------|-------|--------------|
| Frontal | [foto] | [foto] | {{obs_frontal}} |
| Perfil Direito | [foto] | [foto] | {{obs_profile_right}} |
| Perfil Esquerdo | [foto] | [foto] | {{obs_profile_left}} |

---

### Métricas Corporais — Evolução

```
Peso:          {{baseline_weight}} kg → {{current_weight}} kg ({{weight_delta}} kg)
% Gordura:     {{baseline_fat}}% → {{current_fat}}% ({{fat_delta}} p.p.)
% Músculo:     {{baseline_muscle}}% → {{current_muscle}}% ({{muscle_delta}} p.p.)
% Água:        {{baseline_water}}% → {{current_water}}%
Gordura Visc.: {{baseline_visceral}} → {{current_visceral}}
Metab. Basal:  {{baseline_bmr}} kcal → {{current_bmr}} kcal
```

---

### Observações da Análise de IA

{{ai_observations}}

**AVISO OBRIGATÓRIO**: Esta análise foi gerada por inteligência artificial com fins de
acompanhamento evolutivo. Não substitui avaliação clínica. Resultados variam individualmente
conforme genética, adesão ao protocolo e fatores de saúde.

---

### Validação Médica

[ ] Análise revisada e aprovada pelo médico responsável  
[ ] Liberada para visualização pelo paciente  
[ ] Ajuste de protocolo necessário  

**Observações do médico**: {{doctor_observations}}

**Assinatura**: Dr(a). {{doctor_name}} — CRM {{doctor_crm}} — {{approval_date}}

---

*Imagens armazenadas com segurança em conformidade com LGPD.*  
*Acesso restrito: médico responsável e paciente (mediante consentimento).*
