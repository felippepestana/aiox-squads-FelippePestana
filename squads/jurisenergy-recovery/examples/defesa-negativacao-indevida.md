# Exemplo — Defesa passiva por negativação após pagamento

## Objetivo

Demonstrar a execução esperada do `UC-JE-003` (workflow `wf-passive-defense`) para uma ação de dano moral por negativação supostamente indevida, combinando intake, verificação NegativeSafe, estratégia defensiva, teses locais e validação humana.

## Input fictício

```text
Chegou uma ação da comarca de Porto Velho: a autora pede R$ 15.000 de dano moral alegando que pagou a fatura em atraso no dia 10 e foi negativada no dia 25 do mesmo mês, com liminar deferida para baixa da inscrição. Temos a petição inicial, o comprovante de pagamento anexado por ela e nossos registros internos de cobrança. Preciso da estratégia: contestar ou propor acordo?
```

## Classificação esperada

| Campo | Valor |
|---|---|
| Polo | Passivo |
| Tema | Negativação + dano moral |
| UC | `UC-JE-003` |
| Workflow | `wf-passive-defense` |
| Prioridade | Alta (liminar deferida — alerta de astreintes) |

## Rota esperada

```text
juris-orchestrator
-> document-intake-validator
-> negativesafe-validator (regularidade do ato contestado)
-> passive-defense-strategist
-> legal-thesis-curator
-> lgpd-compliance-auditor
-> juris-orchestrator (gate QG-JE-004: advogado decide contestação ou acordo)
```

## Saída esperada resumida

### 1. Verificação NegativeSafe (subsídio da defesa)

| Verificação | Resultado esperado |
|---|---|
| Data do pagamento vs. data da inscrição | Determinante: pagamento ANTES da inscrição = falha interna confirmada |
| Baixa após pagamento | Se em atraso, alerta de agravamento do dano |
| Notificação prévia | Verificada com documento-fonte |

### 2. Estratégia defensiva

| Cenário fático | Recomendação esperada |
|---|---|
| Pagamento confirmado antes da inscrição | Risco ALTO — acordo mitigador com faixa de valor fundamentada em precedentes locais |
| Inscrição anterior ao pagamento + baixa tempestiva | Tese de exercício regular de direito, com minuta assistida (`templates/defense-strategy-tmpl.md`) |
| Pagamento não localizado internamente | Lacuna declarada + pendência ao setor financeiro — sem hipótese tratada como fato |

Fatos comprovados, hipóteses e lacunas devem aparecer em seções separadas; cada pedido da inicial mapeado com risco individual.

### 3. Teses e precedentes

O `legal-thesis-curator` deve trazer o entendimento local sobre negativação pós-pagamento (tribunal, número, data), a faixa indenizatória praticada na comarca e os requisitos probatórios exigidos — nunca precedente sem fonte verificável.

### 4. Gate de validação humana

- A minuta é assistida, não peça final; o protocolo é decisão exclusiva do advogado.
- Reconhecimento de falha da empresa só com advogado responsável.

## Quality gates esperados

- `QG-JE-001`: liminar identificada e priorizada na triagem.
- `QG-JE-002`: documentos internos verificados antes da tese.
- `QG-JE-003`: risco e tese com justificativa, fonte e confiança.
- `QG-JE-004`: contestação/acordo condicionados ao advogado.
- `QG-JE-005`: dados da autora tratados com minimização.

## Critério de aprovação do exemplo

O exemplo passa se a estratégia depender explicitamente da cronologia pagamento × inscrição verificada em documento, separar fato de hipótese, citar precedentes com fonte e terminar no gate humano — sem o squad "decidir" a defesa sozinho.
