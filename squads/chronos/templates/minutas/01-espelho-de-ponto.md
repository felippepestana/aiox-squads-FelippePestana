# Minuta — Espelho de Ponto

> Fonte canônica. Documento oficial de registro de jornada (CLT Art. 74). A versão web (data-driven, com CSS de impressão) renderiza este espelho a partir dos registros consolidados pelo `time-tracker`. Campos entre `{{ }}` são preenchidos. Toda correção preserva o registro original (trilha de auditoria do `chronos`).

---

**{{empresa_nome}}** — CNPJ {{empresa_cnpj}}
Espelho de Ponto — Competência **{{competencia}}** *(MM/AAAA)* · Filial {{filial}}

| | |
|---|---|
| **Colaborador** | {{colaborador_nome}} |
| **Matrícula** | {{matricula}} |
| **Cargo** | {{cargo}} |
| **Admissão** | {{data_admissao}} |
| **Jornada contratual** | {{jornada_contratual}} *(ex: 44h/sem — 08:00–17:00, 1h intervalo)* |
| **Escala** | {{escala}} |

## Registros do período

| Dia | Entrada | Saída intervalo | Volta intervalo | Saída | Horas normais | Extras | Noturnas | Observação |
|----:|:-------:|:---------------:|:---------------:|:-----:|:-------------:|:------:|:--------:|:-----------|
{{#registros}}
| {{dia}} | {{entrada}} | {{saida_intervalo}} | {{volta_intervalo}} | {{saida}} | {{h_normais}} | {{h_extras}} | {{h_noturnas}} | {{observacao}} |
{{/registros}}

## Totais da competência

| | Horas |
|---|---:|
| **Horas normais** | {{total_normais}} |
| **Horas extras (50%)** | {{total_extras_50}} |
| **Horas extras (100%)** | {{total_extras_100}} |
| **Adicional noturno** | {{total_noturnas}} |
| **Faltas / atrasos** | {{total_faltas}} |
| **DSR sobre extras** | {{total_dsr}} |
| **Saldo p/ banco de horas** | {{saldo_banco}} |

**Fonte dos registros:** {{fontes}} *(biometria / geolocalização / mobile)* · **Cobertura:** {{cobertura_pct}}%

{{#alertas}}
> ⚠️ **Alerta de jornada:** {{alerta}} *(informativo — não bloqueia; ver auditoria de conformidade)*
{{/alertas}}

---

Declaro que os registros acima refletem a minha jornada no período.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**{{colaborador_nome}}** — {{cidade}}, {{data_assinatura}}

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**{{gestor_nome}}** — {{gestor_cargo}}

<small>Base legal: CLT Art. 74 (controle de jornada) e Portaria MTP 671/2021. Registro original imutável; correções logadas com usuário, data e motivo.</small>
