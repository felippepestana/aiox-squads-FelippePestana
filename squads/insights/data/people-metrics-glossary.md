# Glossário de Métricas de Pessoas (People Metrics)

Definições e fórmulas canônicas usadas por `metric-smith`. Toda métrica é **determinística**: mesma fórmula + mesma janela → mesmo resultado. Sempre citar a definição usada.

> Fontes de referência: SHRM HR Metrics, Josh Bersin People Analytics, práticas de mercado (Gupy/Feedz/BambooHR). Adaptado ao contexto BR.

---

## Headcount

- **Headcount (pontual):** número de colaboradores ativos numa data.
- **Headcount médio (período):** `(headcount_início + headcount_fim) / 2`. Para maior precisão, média dos headcounts mensais.
- **Fonte:** peopleops.

## Turnover (Rotatividade)

- **Turnover (período):** `desligamentos no período / headcount médio do período`.
- **Anualização:** janela parcial → `× (12 / meses na janela)`. Ex: semestre → ×2.
- **Voluntário vs. involuntário:** sempre separar. Voluntário = pedido do colaborador; involuntário = decisão da empresa.
- **Regra:** nunca reportar turnover único sem dizer janela e tipo.
- **Fonte:** peopleops (eventos de desligamento).

## Absenteísmo

- **Absenteísmo:** `horas de ausência não programada / horas previstas`.
- Exclui férias e licenças programadas; inclui faltas, atrasos e saídas antecipadas não justificadas.
- **Fonte:** chronos (jornada).

## Custo de Pessoal

- **Custo de pessoal (período):** soma de folha + encargos + benefícios no período.
- **Custo por colaborador:** `custo de pessoal / headcount médio`.
- **Fonte:** peopleops.

## Tenure (Tempo de Casa)

- **Tenure médio:** média de `(data de referência − data de admissão)` dos ativos.
- **Tenure no desligamento:** tempo de casa de quem saiu (sinal de retenção precoce).
- **Fonte:** peopleops.

## eNPS (Employee Net Promoter Score)

- **eNPS:** `% promotores − % detratores` (escala 0–10: promotores 9–10, detratores 0–6).
- Faixa: −100 a +100. Agregado respeitando n >= 5.
- **Fonte:** pulse.

## Métricas Derivadas / Cross-Módulo

- **Taxa de super-jornada:** % de colaboradores com jornada > limite recorrente (sinal de fadiga). Fonte: chronos.
- **Progressão estagnada:** % da coorte sem movimentação de cargo/faixa no período. Fonte: performa + org-architect.
- **Tendência de eNPS:** variação do eNPS entre ondas de pesquisa. Fonte: pulse.

---

## Regras de Reporte

1. **Toda métrica vem com fórmula e fonte.** Número solto não entra no dashboard.
2. **Bases comparáveis.** Comparar só métricas com a mesma definição e janela (anualizado com anualizado).
3. **Supressão de privacidade.** Célula com n < 5 → "suprimido (n<5)", nunca o valor.
4. **Determinismo.** Não há aleatoriedade em métrica; mesma entrada → mesma saída.
