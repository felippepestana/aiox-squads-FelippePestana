# Task: Manage Benefits Catalog (manage-catalog)

**Executor:** catalog-keeper
**Elicit:** Benefit data, category, vendor info
**Mode:** Deterministic catalog maintenance
**Output:** Benefits catalog (YAML) with plain-language descriptions

## Inputs Required

- `benefit`: Benefício a adicionar/atualizar
- `category`: Categoria de Total Rewards (saúde | alimentação | transporte | previdência | bem-estar | educação)
- `vendor`: Fornecedor e condições (custo, cobertura, carência)
- `action`: add | update | flag-outdated

## Elicitation

Ask user:
1. "Qual benefício e categoria?"
2. "Fornecedor, custo, cobertura e carência?"
3. "É inclusão, atualização ou sinalização de desatualizado?"

## Execution Steps

1. **Classify**: Atribuir a categoria de Total Rewards correta
2. **Describe Plainly**: Descrição em linguagem simples + exemplo concreto (sem jargão de apólice)
3. **Record Vendor**: Fornecedor, custo, cobertura, carência verificados
4. **Date It**: Registrar data de atualização e vigência
5. **Flag Stale**: Sinalizar itens sem atualização recente
6. **Output**: Item de catálogo atualizado

## Output Format

```yaml
benefits_catalog:
  updated_by: "catalog-keeper"
  timestamp: "2026-06-08T12:00:00Z"

  benefits:
    - id: "BEN_VR"
      name: "Vale-Refeição"
      category: "alimentação"
      plain_description: "Crédito diário para refeições em restaurantes — cobre o almoço no dia útil."
      example: "R$ 35/dia útil (~R$ 770/mês) em cartão aceito em restaurantes."
      vendor: { name: "Fornecedor X", verified: true }
      conditions: { cost_employer: "R$ 770/mês", cost_employee: "desconto simbólico CCT", carencia: "nenhuma" }
      last_updated: "2026-06-08"
      validity: "2026"
      status: "active"
    - id: "BEN_SAUDE"
      name: "Plano de Saúde"
      category: "saúde"
      plain_description: "Cobertura médica e hospitalar para você e dependentes elegíveis."
      example: "Plano enfermaria/apartamento; coparticipação em consultas."
      vendor: { name: "Operadora Y", verified: true }
      conditions: { cost_employer: "varia por plano", cost_employee: "coparticipação", carencia: "conforme ANS" }
      sensitive_data: true   # adesão envolve dado de saúde → consent-gate
      last_updated: "2026-06-08"
      status: "active"

  flags:
    - benefit_id: "BEN_GYM"
      issue: "sem atualização há 14 meses"
      action: "verificar com fornecedor"
```

## Veto Conditions

- No VETO no catálogo, MAS:
- Descrição em jargão de apólice → reescrever em linguagem clara
- Dado de fornecedor não verificado → ALERT, não publicar como certo

## Completion Criteria

✅ Benefício classificado por categoria
✅ Descrição em linguagem clara + exemplo
✅ Fornecedor e condições verificados
✅ Data de atualização e vigência registradas
✅ Itens desatualizados sinalizados
✅ Catálogo pronto para eligibility-checker e fit-advisor
