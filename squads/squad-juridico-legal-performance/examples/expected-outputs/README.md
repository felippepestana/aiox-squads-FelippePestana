# Outputs esperados — regressão funcional

Esta pasta contém **entregáveis fictícios completos** alinhados aos smoke tests e aos exemplos em `examples/`. Use-os para comparar saídas reais do squad em revisões de regressão.

## Como usar

1. Execute o cenário em [`SMOKE_TESTS.md`](../../SMOKE_TESTS.md) com o input do exemplo correspondente.
2. Compare a saída gerada com o arquivo desta pasta (estrutura, seções, gates, citações).
3. Registre divergências como ajuste de agente, task ou template — não altere estes arquivos sem revisão de produto.

## Mapeamento

| Smoke test | Exemplo (input/rota) | Output esperado |
|---|---|---|
| Cenário 1 — Análise civil | [`processo-civil-acao-cobranca.md`](../processo-civil-acao-cobranca.md) | [`relatorio-civil-acao-cobranca.md`](relatorio-civil-acao-cobranca.md) |
| Cenário 2 — Recursal | [`estrategia-recursal-resp.md`](../estrategia-recursal-resp.md) | [`relatorio-recursal-resp.md`](relatorio-recursal-resp.md) |
| Cenário 3 — Produto | [`frontend-juridico-dashboard.md`](../frontend-juridico-dashboard.md) | [`brief-dashboard-juridico.md`](brief-dashboard-juridico.md) |

## Critérios de equivalência

- Mesmo **UC**, **modo** e **quality gates** aprovados indicados no rodapé.
- Seções obrigatórias do template preenchidas ou marcadas como incompletas com justificativa.
- Bloco `citacoes` presente; sem fatos inventados além do input fictício.
- Aviso de **revisão humana obrigatória** em relatórios jurídicos.
- Brief de produto **sem** código de implementação; handoff ao `apex` condicionado.
