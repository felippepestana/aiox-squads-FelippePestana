# Template: Projeção Financeira — Evento Legendários

**Evento:** {{NOME_EVENTO}}
**Cidade:** {{CIDADE}} / {{ESTADO}}
**Tipo:** {{TIPO_EVENTO}}
**Data:** {{DATA_EVENTO}}
**Capacidade Total:** {{CAPACIDADE}} vagas
**Gerado em:** {{DATA_GERACAO}}

---

## 1. Estrutura de Lotes e Preços

| Lote | Nome | Preço | Vagas | Receita Máx. |
|---|---|---|---|---|
| 1 | Lote Pioneiro | R$ 990 | {{VAGAS_L1}} | R$ {{RECEITA_L1}} |
| 2 | Early Bird | R$ 1.190 | {{VAGAS_L2}} | R$ {{RECEITA_L2}} |
| 3 | Regular | R$ 1.490 | {{VAGAS_L3}} | R$ {{RECEITA_L3}} |
| 4 | Final | R$ 1.690 | {{VAGAS_L4}} | R$ {{RECEITA_L4}} |
| 5 | Last Call | R$ 1.790 | {{VAGAS_L5}} | R$ {{RECEITA_L5}} |
| E | Jovens Solteiros | R$ 450 | {{VAGAS_JOVENS}} | R$ {{RECEITA_JOVENS}} |
| **TOTAL** | — | **Ticket médio ponderado: R$ {{TICKET_MEDIO}}** | **{{CAPACIDADE}}** | **R$ {{RECEITA_MAXIMA}}** |

---

## 2. Cenários de Projeção

### Cenário Pessimista — 60% de Ocupação

| Métrica | Valor |
|---|---|
| Participantes | {{PARTICIPANTES_60}} |
| Receita Bruta | R$ {{RECEITA_60}} |
| Taxa Plataforma (Ticket and GO ~8%) | - R$ {{TAXA_60}} |
| Receita Líquida | R$ {{RECEITA_LIQ_60}} |
| Custo Operacional (estimado) | - R$ {{CUSTO_OP_60}} |
| Budget Marketing | - R$ {{BUDGET_MKT}} |
| **Resultado Líquido** | **R$ {{RESULTADO_60}}** |
| **Margem** | **{{MARGEM_60}}%** |
| ROI Marketing | {{ROI_MKT_60}}:1 |

### Cenário Realista — 80% de Ocupação *(referência de planejamento)*

| Métrica | Valor |
|---|---|
| Participantes | {{PARTICIPANTES_80}} |
| Receita Bruta | R$ {{RECEITA_80}} |
| Taxa Plataforma (Ticket and GO ~8%) | - R$ {{TAXA_80}} |
| Receita Líquida | R$ {{RECEITA_LIQ_80}} |
| Custo Operacional (estimado) | - R$ {{CUSTO_OP_80}} |
| Budget Marketing | - R$ {{BUDGET_MKT}} |
| **Resultado Líquido** | **R$ {{RESULTADO_80}}** |
| **Margem** | **{{MARGEM_80}}%** |
| ROI Marketing | {{ROI_MKT_80}}:1 |

### Cenário Otimista — 95% de Ocupação

| Métrica | Valor |
|---|---|
| Participantes | {{PARTICIPANTES_95}} |
| Receita Bruta | R$ {{RECEITA_95}} |
| Taxa Plataforma (Ticket and GO ~8%) | - R$ {{TAXA_95}} |
| Receita Líquida | R$ {{RECEITA_LIQ_95}} |
| Custo Operacional (estimado) | - R$ {{CUSTO_OP_95}} |
| Budget Marketing | - R$ {{BUDGET_MKT}} |
| **Resultado Líquido** | **R$ {{RESULTADO_95}}** |
| **Margem** | **{{MARGEM_95}}%** |
| ROI Marketing | {{ROI_MKT_95}}:1 |

---

## 3. Estimativa de Custos Operacionais

| Item | Custo Estimado | Base de Cálculo |
|---|---|---|
| Local / Venue | R$ {{CUSTO_LOCAL}} | Contrato ou estimativa |
| Alimentação (café, almoço, jantar × dias × participantes) | R$ {{CUSTO_ALIMENTACAO}} | R$ 80-120/pessoa/dia |
| Kits de participante (mochila, crachá, guia) | R$ {{CUSTO_KITS}} | R$ 50-80/kit |
| Logística e transporte | R$ {{CUSTO_LOGISTICA}} | Estimativa local |
| Equipamentos (rádios, kit primeiros socorros) | R$ {{CUSTO_EQUIPAMENTOS}} | — |
| Equipe de voluntários (transporte + alimentação) | R$ {{CUSTO_VOLUNTARIOS}} | — |
| Certificados digitais + comunicação | R$ {{CUSTO_DIGITAL}} | — |
| Contingência operacional (5%) | R$ {{CUSTO_CONTINGENCIA}} | — |
| **Total Operacional** | **R$ {{TOTAL_OPERACIONAL}}** | — |

---

## 4. Ponto de Equilíbrio (Break-even)

| Métrica | Valor |
|---|---|
| Custo total (operacional + marketing) | R$ {{CUSTO_TOTAL}} |
| Ticket médio ponderado | R$ {{TICKET_MEDIO}} |
| **Participantes mínimos para break-even** | **{{BREAK_EVEN_PARTICIPANTES}}** |
| **% de ocupação mínima** | **{{BREAK_EVEN_PCT}}%** |

---

## 5. LTV Potencial da Base Alumni

| Segmento | Estimativa | Cross-sell | LTV por Pessoa | Total Estimado |
|---|---|---|---|---|
| Casado + filhos (50%) | {{ALU_CASADO_FILHOS}} | REM + LEGADO | R$ 8.580 | R$ {{TOTAL_CASADO_FILHOS}} |
| Casado + sem filhos (10%) | {{ALU_CASADO_SEM}} | REM | R$ 4.580 | R$ {{TOTAL_CASADO_SEM}} |
| Pai solteiro (15%) | {{ALU_PAI}} | LEGADO | R$ 2.990 | R$ {{TOTAL_PAI}} |
| Solteiro jovem (15%) | {{ALU_SOLTEIRO}} | Próximo TOP | R$ 2.980 | R$ {{TOTAL_SOLTEIRO}} |
| Sem dados (10%) | {{ALU_SEM_DADOS}} | Reengajamento | R$ 1.490 | R$ {{TOTAL_SEM_DADOS}} |
| **Total LTV potencial** | — | — | — | **R$ {{TOTAL_LTV}}** |

---

## 6. Benchmark TOP Balneário Camboriú

| KPI | Balneário (Referência) | {{CIDADE}} (Meta) | {{CIDADE}} (Realizado) |
|---|---|---|---|
| Taxa de ocupação | 95%+ | 80% | — |
| Ticket médio | R$ 1.620 | R$ {{TICKET_MEDIO}} | — |
| CPL Meta Ads | ≤ R$ 12 | ≤ R$ 15 | — |
| ROAS | ≥ 10:1 | ≥ 8:1 | — |
| Taxa de presença | ≥ 92% | ≥ 88% | — |
| Taxa de depoimento | ≥ 45% | ≥ 40% | — |
| Taxa cross-sell REM | ≥ 20% | ≥ 15% | — |

*Nota: Porto Velho (1ª edição) — metas calibradas para 70-80% do benchmark de Balneário Camboriú.*

---

*Projeção gerada pelo squad @legendarios-platform | @analytics-reporter*
*Valores são estimativas baseadas em benchmarks. Custos operacionais devem ser validados localmente.*
