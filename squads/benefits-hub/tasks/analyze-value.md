# Task: Analyze Cost vs. Adoption & Value (analyze-value)

**Executor:** value-analyst
**Elicit:** Program data, adoption rates, perceived value
**Mode:** Aggregate cost-benefit analysis
**Output:** Value analysis (YAML) — keep/revise/expand verdicts

## Inputs Required

- `benefits_cost`: Custo por benefício (de peopleops)
- `adoption_data`: Taxa de adoção/uso agregada (de insights/peopleops)
- `perceived_value`: Sinais de valor percebido (eNPS de benefícios, pesquisa)
- `period`: Janela de análise

## Elicitation

Ask user:
1. "Qual o custo por benefício e a janela?"
2. "Há dados de adoção/uso (agregados)?"
3. "Há sinal de valor percebido (pesquisa, eNPS)?"

## Execution Steps

1. **Cross Cost × Adoption**: Cruzar custo com adoção real (% que usa)
2. **Add Perceived Value**: Considerar valor percebido (não só uso)
3. **Classify**: keep (bom fit) | revise (caro + baixa adoção) | expand (alto valor/baixo custo)
4. **Protect Privacy**: Somente agregado; nunca adesão individual; sem dado de saúde individual
5. **Avoid Vanity**: Focar adoção e valor, não tamanho do catálogo
6. **Output**: Análise de valor com vereditos

## Output Format

```yaml
value_analysis:
  period: "2026-01..2026-06"
  analyzed_by: "value-analyst"
  timestamp: "2026-06-08T12:00:00Z"
  privacy: "agregado; sem adesão individual; sem dado de saúde individual"

  benefits:
    - benefit_id: "BEN_VR"
      monthly_cost: 770
      adoption_pct: 99
      perceived_value: "alto"
      verdict: "keep"
      note: "Quase universal e valorizado; manter."
    - benefit_id: "BEN_GYM"
      monthly_cost: 120
      adoption_pct: 12
      perceived_value: "médio"
      verdict: "revise"
      note: "Custo razoável mas baixa adoção. Avaliar: barreira de uso? comunicação? Antes de cortar, checar valor percebido por quem usa."
    - benefit_id: "BEN_EAP"
      monthly_cost: 30
      adoption_pct: 8
      perceived_value: "alto"
      verdict: "keep"
      note: "Baixa adoção mas alto valor simbólico/retenção (apoio em crise). Não cortar por número isolado."
    - benefit_id: "BEN_EDU"
      monthly_cost: 50
      adoption_pct: 45
      perceived_value: "alto"
      verdict: "expand"
      note: "Alto valor por baixo custo; candidato a ampliar."

  summary:
    total_monthly_cost: 970
    keep: 2
    revise: 1
    expand: 1
    headline_vanity_avoided: "Foco em adoção e valor, não em 'temos N benefícios'."
```

## Veto Conditions

- No VETO na análise, MAS:
- Exposição de adesão individual → corrigir (só agregado)
- Recomendação de corte sem olhar valor percebido → revisar
- Uso de dado de saúde individual → proibido

## Completion Criteria

✅ Custo cruzado com adoção real
✅ Valor percebido considerado (não só uso)
✅ Vereditos keep/revise/expand fundamentados
✅ Privacidade preservada (agregado, sem saúde individual)
✅ Métricas de vaidade evitadas
✅ Análise pronta para o chief/decisão de programa
