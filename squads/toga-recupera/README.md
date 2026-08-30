# ⚖️ Toga Recupera

> **Maturidade:** 🟡 DRAFT · **Domínio:** Cobrança de carteiras educacionais (LegalTech) · **Entry agent:** `chief-recupera`

Squad de agentes IA da plataforma **RÉGUA / Toga Recupera** — cobrança em massa de carteiras educacionais conduzida por advocacia especializada. Este squad operacionaliza a camada de agentes do planejamento em [`docs/regua/`](../../docs/regua/README.md).

## O que este squad faz

| Use case | Descrição |
|---|---|
| UC-TR-001 | **Classificação de documentação de carteira** — contrato assinado? 2 testemunhas? → define a força executiva e a via processual |
| UC-TR-002 | **Cálculo de débito atualizado / simulação de acordo** — engine REPACTUA com memória de cálculo (Tema 474 STJ) e alçadas de desconto |
| UC-TR-003 | **Notificação extrajudicial de mora** — delega a redação ao squad `analista-processual` (UC-AP-005) |
| UC-TR-004 | **Estratégia judicial** — execução (art. 784, III CPC) vs. monitória (art. 700 CPC) vs. cobrança vs. JEC |
| UC-TR-005 | **Triagem de compliance** — prescrição, CDC, LGPD, superendividamento |

## Cadeia de comando

```text
Tier 0  chief-recupera            ⚖️  orquestra e enforça o gate de compliance
Tier 1  negociador-extrajudicial  🤝  réguas, acordos, alçadas
        estrategista-judicial     🏛️  via processual, priorização
Tier 2  classificador-carteira    🗂️  documentação → força executiva
        calculista-repactua       🧮  débito atualizado, memória de cálculo
Tier 3  compliance-guard          🛡️  quality gate com PODER DE VETO
```

**Regra de ouro:** nenhuma saída (mensagem, proposta, minuta, recomendação) é entregue sem passar pelo `compliance-guard`. Ele bloqueia: cobrança de parcela prescrita, linguagem que constranja (CDC arts. 42/71), exposição de dados de menores (LGPD art. 14) e cobrança agressiva de superendividados (Lei 14.181/2021).

## Ativação

```text
@toga-recupera:chief-recupera
```

Exemplos:
- "Classifique esta carteira: 40 contratos, 12 com assinatura e testemunhas"
- "Simule acordo para 4 mensalidades de R$ 890 vencidas há 14 meses, alçada de 30%"
- "Posso cobrar uma mensalidade vencida em março de 2020?" (→ triagem de prescrição)

## Squads relacionados

- [`analista-processual`](../analista-processual/) — redação de notificações e peças (UC-AP-005)
- [`analista-estrategista-processual-civil`](../analista-estrategista-processual-civil/) — fase de execução (UC-AEPC-005)
- [`squad-juridico-legal-performance`](../squad-juridico-legal-performance/) — exemplo trabalhado de ação de cobrança

## Documentação de referência

- Planejamento completo da plataforma: [`docs/regua/`](../../docs/regua/README.md)
- Especificação de compliance (fonte dos guardrails): [`docs/regua/05-compliance-e-guardrails.md`](../../docs/regua/05-compliance-e-guardrails.md)
- Referências legais estruturadas: [`data/referencias-legais.yaml`](data/referencias-legais.yaml)
