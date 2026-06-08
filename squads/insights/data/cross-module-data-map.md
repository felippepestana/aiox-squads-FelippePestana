# Mapa de Dados Cross-Módulo (Cross-Module Data Map)

Referência para `data-weaver`. Define quais sinais o insights consome de cada módulo-fonte, a chave de junção e o frescor esperado. Insights **não gera dado primário** — cruza as fontes de verdade dos demais módulos.

---

## Chave de junção canônica

`employee_id` + `periodo` (MM/YYYY) + `filial`

- Match alvo: **>= 95%**. Abaixo disso, ALERT. Abaixo de 80%, BLOCK.

---

## Sinais por módulo-fonte

### chronos (Controle de Ponto & Jornada)
| Sinal | Uso em insights |
|-------|-----------------|
| `horas_extra`, `super_jornada_flag` | Driver de fadiga/burnout |
| `absenteismo` | Métrica + sinal de risco |
| `anomaly_report (HIGH risk)` | Input direto de risco (handoff de alert-warden) |
| **Frescor esperado** | diário / fechamento mensal |

### performa (Gestão de Desempenho)
| Sinal | Uso em insights |
|-------|-----------------|
| `nota_ciclo`, `posicao_9box` | Contexto de desempenho |
| `progressao` | Driver "progressão estagnada" |
| **Frescor esperado** | por ciclo (trimestral/semestral) |

### pulse (Clima & Engajamento)
| Sinal | Uso em insights |
|-------|-----------------|
| `enps`, `engajamento_trend` | Métrica + driver de turnover |
| sinais de pesquisa aberta | Sinal de burnout (exaustão) |
| **Frescor esperado** | por onda de pesquisa |

### peopleops (DP & Folha)
| Sinal | Uso em insights |
|-------|-----------------|
| `headcount`, `custo_pessoal` | Métricas base |
| `evento_turnover` (vol/invol) | Cálculo de turnover |
| `data_admissao` | Tenure |
| **Frescor esperado** | diário / fechamento mensal |

### onboard (Integração)
| Sinal | Uso em insights |
|-------|-----------------|
| progresso `30/60/90` | Sinal de retenção precoce |
| **Frescor esperado** | por marco do novo colaborador |

---

## Handoffs de entrada (push de outros módulos)

- **chronos → insights:** `alert-warden` envia anomalias HIGH (fadiga/padrão) para input preditivo.
- **pulse → insights:** sinais de queda de engajamento alimentam alerta precoce.

## Handoffs de saída (insights informa)

- **insights → org-architect:** drivers de progressão estagnada → revisão de carreira/faixa.
- **insights → performa:** contexto de coorte para calibração.
- **insights → apex-talent-chief:** narrativa executiva cross-módulo.

---

## Regras de minimização (LGPD)

1. Trazer **só os sinais necessários** à decisão declarada.
2. Atributo sensível (raça, gênero, saúde) **só** quando a decisão for auditoria de diversidade, com finalidade explícita.
3. Pseudonimizar identificadores quando o cruzamento não exigir identificação direta.
4. Declarar **frescor** e **cobertura** por fonte; nunca concluir sobre dado STALE sem avisar.
