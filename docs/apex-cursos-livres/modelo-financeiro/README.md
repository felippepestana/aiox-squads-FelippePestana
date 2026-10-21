# Modelo financeiro ilustrativo da APEX

Simulador de 24 meses usado no [Doc 17](../17-negocio-financeiro.md).

> **Todas as premissas são ilustrativas** e devem ser substituídas por dados reais (cotações de PSP, fornecedores, salários) e por resultados dos testes da Fase 0. O modelo é um **teste de estresse da estrutura de negócio**, não uma previsão.

```bash
python3 model.py                # imprime as tabelas em Markdown e grava cenario_*.csv
python3 model.py --out ./saida  # escolhe o diretório de saída
```

- Cenários: `conservador`, `base`, `otimista` e `alvo (enxuto)` ("o que precisa ser verdade").
- O script verifica invariantes a cada execução (acumulado = soma corrente, identidade da contribuição, sem receita antes do lançamento, valores finitos).
- Colunas dos CSV (por mês): leads, novos clientes, pedidos, receita bruta, reembolsos e *chargebacks*, receita líquida, impostos, PSP, repasse a instrutores, afiliados, infraestrutura variável, suporte, contribuição, marketing, equipe, outros fixos, resultado operacional, acumulado, base de assinantes, base B2B e alunos ativos.
- Não inclui: *take rate* de marketplace, white-label, API, certificações, sazonalidade, fluxo de caixa financeiro, custo de produção de conteúdo (ver Doc 17 §3 e §8).
