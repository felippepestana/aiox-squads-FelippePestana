# Task: Análise Visual de Evolução do Paciente

**Squad**: clinic-mgmt  
**Agent**: visual-analyst  
**UC**: UC-AN-003  
**Pattern**: AN-TASK-006

---

## Input Esperado

```yaml
required:
  - patient_id: UUID
  - analysis_type: baseline | prediction | evolution_compare | body_metrics
optional:
  - photo_ids: [UUID]  # para evolution_compare
  - treatment_id: UUID
  - measurements: {weight_kg, bmi, body_fat_pct, muscle_pct, water_pct, visceral_fat}
```

## Passos de Execução

```
1. VERIFICAÇÕES:
   ├── Consentimento LGPD + consentimento específico para análise de IA em imagens
   └── Verificar que photos são do paciente correto

2. ANÁLISE DE FOTO BASELINE:
   ├── Verificar qualidade: resolução, iluminação, posicionamento
   ├── Processar com skill:visual-body-analysis (OpenAI Vision)
   ├── Armazenar análise como JSONB (nunca modificar foto original)
   └── Marcar para aprovação do médico antes de compartilhar

3. PREDIÇÃO DE RESULTADO:
   ├── Input: foto baseline + protocolo selecionado
   ├── Processar: OpenAI Vision com prompt especializado por especialidade
   ├── Incluir disclaimer médico obrigatório no output
   ├── Armazenar resultado como draft (status: pending_approval)
   └── Notificar médico para aprovação antes de liberar ao paciente

4. COMPARAÇÃO DE EVOLUÇÃO:
   ├── Carregar fotos por ângulo em ordem cronológica
   ├── Calcular score de evolução (IA)
   ├── Gerar comparativo deslizante (before/after)
   └── Mapear marcos de procedimentos na timeline

5. MÉTRICAS CORPORAIS:
   ├── Registrar medições em body_measurements
   ├── Calcular delta desde baseline e metas
   ├── Gerar gráficos de evolução temporal
   └── Alertas: métricas fora da trajetória esperada

6. RELATÓRIO:
   ├── Gerar relatório PDF de evolução (usar template visual-evolution-report)
   └── Incluir: fotos selecionadas, gráficos, score de evolução, observações
```

## Output

```yaml
analysis_id: UUID
analysis_type: string
score_evolution_pct: decimal  # % de melhora detectada
photo_comparison_url: string  # URL do comparativo gerado
prediction_url: string       # URL da predição (se solicitado)
prediction_status: pending_approval | approved | rejected
body_metrics_delta:
  weight_delta_kg: decimal
  body_fat_delta_pct: decimal
  muscle_delta_pct: decimal
alerts: [string]
report_pdf_url: string
doctor_approval_required: boolean
```

## Quality Gate

- [ ] Consentimento de uso de IA para imagens verificado
- [ ] Predição marcada como pending_approval (nunca auto-aprovada)
- [ ] Disclaimer médico presente em toda predição
- [ ] Fotos armazenadas com URL assinada (acesso restrito)
