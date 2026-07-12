# Task: simular-acordo

**Agentes responsáveis:** `calculista-repactua` → `negociador-extrajudicial` → `compliance-guard` · **Use case:** UC-TR-002

## Objetivo

Produzir débito atualizado com memória de cálculo e cenários de acordo dentro da alçada.

## Entradas

- Parcelas (vencimento, valor original) e parâmetros contratuais (juros, multa ≤ 2% CDC, índice de correção)
- Alçada de desconto da carteira e faixa de aging

## Passos

1. `calculista-repactua`: excluir parcelas prescritas (listar em seção "PRESCRITAS — NÃO COBRÁVEIS", nunca somar) e calcular o débito atualizado com memória de cálculo parcela a parcela (Tema 474 STJ). Parâmetro ausente → `[PREENCHER: ...]`, nunca inventar.
2. `calculista-repactua`: gerar cenários — à vista e parcelado — com desconto por faixa de aging, marcando cada cenário como "dentro da alçada" ou "REQUER APROVAÇÃO".
3. `negociador-extrajudicial`: transformar o cenário escolhido em proposta estruturada + minuta de mensagem (estrutura obrigatória do agente; tom CDC-safe), lembrando que todo acordo exige confissão de dívida (reinicia prescrição — P2).
4. `compliance-guard`: validar (checks P1, C1, C2, A1). Vetado → corrigir e re-submeter.
5. Salvar memória de cálculo em `output/calculos/` e proposta em `output/propostas/` via Write.

## Saída

- Memória de cálculo auditável + proposta/minuta aprovada pelo gate.

## Critérios de qualidade (QG-TR-001, QG-TR-002)

- Cálculo reproduzível (mesma entrada → mesma saída), índices com fonte.
- Nenhuma parcela prescrita no total.
- Nenhum desconto acima da alçada sem marcação de aprovação.
