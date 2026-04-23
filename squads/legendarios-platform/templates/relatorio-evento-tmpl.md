# Relatório Final — {{NOME_EVENTO}} | {{CIDADE}}/{{ESTADO}}

**Data do Evento:** {{DATA_INICIO}} a {{DATA_FIM}}
**Participantes Inscritos:** {{TOTAL_INSCRITOS}}
**Participantes Presentes (D-day):** {{TOTAL_PRESENTES}}
**Gerado em:** {{DATA_RELATORIO}}

---

## 1. Resumo Executivo

| Métrica | Meta | Realizado | Status |
|---|---|---|---|
| Inscritos Pagos | {{META_INSCRITOS}} | {{REAL_INSCRITOS}} | {{STATUS_INSCRITOS}} |
| Taxa de Ocupação | 80% | {{TAXA_OCUPACAO}}% | {{STATUS_OCUPACAO}} |
| Receita Bruta | R$ {{META_RECEITA}} | R$ {{REAL_RECEITA}} | {{STATUS_RECEITA}} |
| Taxa de Presença | ≥ 88% | {{TAXA_PRESENCA}}% | {{STATUS_PRESENCA}} |
| CPL (Meta Ads) | ≤ R$ 15 | R$ {{CPL_REAL}} | {{STATUS_CPL}} |
| ROAS | ≥ 8:1 | {{ROAS_REAL}}:1 | {{STATUS_ROAS}} |
| Taxa de Depoimento | ≥ 40% | {{TAXA_DEPOIMENTO}}% | {{STATUS_DEPOIMENTO}} |

**Legenda semáforo:** 🟢 ≥ 90% da meta | 🟡 70-89% da meta | 🔴 < 70% da meta

---

## 2. Vendas por Lote

| Lote | Preço | Vagas | Vendidas | Receita | % Vagas |
|---|---|---|---|---|---|
| Pioneiro | R$ 990 | {{VAGAS_L1}} | {{VEND_L1}} | R$ {{REC_L1}} | {{PCT_L1}}% |
| Early Bird | R$ 1.190 | {{VAGAS_L2}} | {{VEND_L2}} | R$ {{REC_L2}} | {{PCT_L2}}% |
| Regular | R$ 1.490 | {{VAGAS_L3}} | {{VEND_L3}} | R$ {{REC_L3}} | {{PCT_L3}}% |
| Final | R$ 1.690 | {{VAGAS_L4}} | {{VEND_L4}} | R$ {{REC_L4}} | {{PCT_L4}}% |
| Last Call | R$ 1.790 | {{VAGAS_L5}} | {{VEND_L5}} | R$ {{REC_L5}} | {{PCT_L5}}% |
| Jovens Solteiros | R$ 450 | {{VAGAS_JOV}} | {{VEND_JOV}} | R$ {{REC_JOV}} | {{PCT_JOV}}% |
| **TOTAL** | Ticket médio: **R$ {{TICKET_MEDIO}}** | **{{TOTAL_VAGAS}}** | **{{TOTAL_VEND}}** | **R$ {{RECEITA_BRUTA}}** | **{{OCUPACAO}}%** |

---

## 3. Financeiro

| Item | Valor |
|---|---|
| Receita Bruta | R$ {{RECEITA_BRUTA}} |
| Taxa Ticket and GO (~8%) | - R$ {{TAXA_PLATAFORMA}} |
| Receita Líquida | R$ {{RECEITA_LIQ}} |
| Custo Operacional Total | - R$ {{CUSTO_OP_TOTAL}} |
| Budget Marketing Realizado | - R$ {{BUDGET_MKT_REAL}} |
| **Resultado Líquido** | **R$ {{RESULTADO_LIQ}}** |
| **Margem** | **{{MARGEM}}%** |
| ROI de Marketing | {{ROI_MKT}}:1 |

---

## 4. Performance de Marketing por Canal

| Canal | Investido | Leads | CPL | Inscritos Atribuídos | CPA |
|---|---|---|---|---|---|
| Meta Ads | R$ {{INV_ADS}} | {{LEADS_ADS}} | R$ {{CPL_ADS}} | {{INSCRITOS_ADS}} | R$ {{CPA_ADS}} |
| WhatsApp Orgânico | R$ 0 | {{LEADS_WA}} | — | {{INSCRITOS_WA}} | — |
| Instagram Orgânico | R$ 0 | {{LEADS_IG}} | — | {{INSCRITOS_IG}} | — |
| Email Marketing | R$ {{INV_EMAIL}} | {{LEADS_EMAIL}} | R$ {{CPL_EMAIL}} | {{INSCRITOS_EMAIL}} | R$ {{CPA_EMAIL}} |
| Influenciadores | R$ {{INV_INF}} | {{LEADS_INF}} | R$ {{CPL_INF}} | {{INSCRITOS_INF}} | R$ {{CPA_INF}} |
| Indicação | R$ 0 | {{LEADS_IND}} | — | {{INSCRITOS_IND}} | — |
| **Total** | **R$ {{INV_TOTAL}}** | **{{LEADS_TOTAL}}** | **R$ {{CPL_MEDIO}}** | **{{INSCRITOS_TOTAL}}** | **R$ {{CPA_MEDIO}}** |

---

## 5. Funil de Conversão

```
Alcance Total (Meta Ads): {{ALCANCE_ADS}} impressões
        ↓ CTR {{CTR_ADS}}%
Cliques na Landing Page: {{CLIQUES}}
        ↓ Taxa opt-in {{TAXA_OPTIN}}%
Leads (WhatsApp + Email): {{LEADS_TOTAL}}
        ↓ Taxa conversão {{TAXA_CONV}}%
Inscrições (Ticket and GO): {{INSCRITOS_TOTAL}}
        ↓ Taxa presença {{TAXA_PRESENCA}}%
Presentes no D-day: {{TOTAL_PRESENTES}}
```

---

## 6. Operação D-day

| Métrica Operacional | Resultado |
|---|---|
| Postos de check-in ativos | {{POSTOS_ATIVOS}} |
| Tempo médio de check-in | {{TEMPO_CHECKIN}} min |
| Incidentes reportados | {{INCIDENTES}} |
| Emergências médicas | {{EMERGENCIAS}} |
| Voluntários presentes | {{VOLUNTARIOS}} / {{VOLUNTARIOS_PLANEJADOS}} |
| NPS do evento | {{NPS}} |
| Nota média satisfação | {{NOTA_SATISFACAO}} / 10 |

---

## 7. Alumni e Pós-evento

| Métrica Alumni | Meta | Realizado | Status |
|---|---|---|---|
| Taxa de depoimento | ≥ 40% | {{TAXA_DEPOIMENTO}}% | {{STATUS_DEPO}} |
| Participação no 1º RPM | ≥ 30% | {{TAXA_RPM}}% | {{STATUS_RPM}} |
| Leads cross-sell REM | {{META_LEADS_REM}} | {{REAL_LEADS_REM}} | — |
| Inscrições cross-sell REM | — | {{REAL_INSCRITOS_REM}} | — |
| Indicações recebidas | — | {{INDICACOES}} | — |
| Inscrições por indicação | — | {{INSCRITOS_IND}} | — |

---

## 8. Comparação com Benchmark TOP Balneário Camboriú

| KPI | Balneário (Ref.) | {{CIDADE}} (Meta) | {{CIDADE}} (Real) | Gap |
|---|---|---|---|---|
| Taxa de ocupação | 95%+ | 80% | {{OCUPACAO}}% | {{GAP_OCUPACAO}}% |
| Ticket médio | R$ 1.620 | R$ {{TICKET_META}} | R$ {{TICKET_MEDIO}} | R$ {{GAP_TICKET}} |
| CPL Meta Ads | ≤ R$ 12 | ≤ R$ 15 | R$ {{CPL_REAL}} | {{GAP_CPL}} |
| ROAS | ≥ 10:1 | ≥ 8:1 | {{ROAS_REAL}}:1 | {{GAP_ROAS}} |
| Taxa de presença | ≥ 92% | ≥ 88% | {{TAXA_PRESENCA}}% | {{GAP_PRESENCA}}% |
| Taxa de depoimento | ≥ 45% | ≥ 40% | {{TAXA_DEPOIMENTO}}% | {{GAP_DEPO}}% |

---

## 9. Recomendações para Próxima Edição

1. {{RECOMENDACAO_1}}
2. {{RECOMENDACAO_2}}
3. {{RECOMENDACAO_3}}
4. {{RECOMENDACAO_4}}
5. {{RECOMENDACAO_5}}

---

*Relatório gerado pelo squad @legendarios-platform | @analytics-reporter*
