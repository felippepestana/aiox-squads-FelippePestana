# Task: Gerar Relatório de Analytics e Dashboard

**Task ID:** `lp-gerar-relatorio`
**Versão:** 1.0
**Agente Executor:** `analytics-reporter`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-006
**Comando:** `*relatorio [cidade] [semana|final] [dados...]`

---

## Objetivo

Gerar dashboard de vendas (semanal ou pós-evento) e relatório financeiro consolidado
com métricas semafóricas, benchmarks de Balneário Camboriú e projeção financeira
em 3 cenários.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| tipo_relatorio | enum | Sim | "semanal" ou "final" |
| semana | integer | Se semanal | Número da semana da campanha |
| inscritos_por_lote | objeto | Sim | Vendas por lote até o momento |
| investimento_marketing | objeto | Não | Gasto por canal até o momento |
| leads_por_canal | objeto | Não | Leads gerados por canal |

## Precondições

- [ ] Dados de vendas (inscritos por lote) disponíveis
- [ ] Tipo de relatório definido (semanal ou final)

## Passos

1. **Calcular métricas de vendas** — total inscritos, receita acumulada, % de meta, vagas restantes por lote
2. **Calcular métricas de marketing** — CPL por canal, CPA geral, ROAS estimado
3. **Calcular funil** — leads → inscritos → pagos (taxas de conversão por etapa)
4. **Aplicar semáforo** — verde/amarelo/vermelho para cada métrica vs. meta e benchmark
5. **Comparar com benchmark Balneário Camboriú** — % de atingimento do padrão de referência
6. **Gerar projeção financeira** — pessimista (60%), realista (80%), otimista (95%) de ocupação
7. **Definir alertas e próximas ações** — ações prioritárias para a próxima semana
8. **Salvar via Write** — nome padronizado abaixo
9. **Confirmar ao @legendarios-chief** com caminho e resumo executivo (QG-LP-005)

## Output

- **Local (semanal):** `relatorio-semanal-[cidade-slug]-semana[N]-[AAAA-MM-DD].md`
- **Local (final):** `relatorio-final-[cidade-slug]-[AAAA-MM-DD].md`
- **Formato:** Markdown com tabelas semafóricas e projeções

## Condições de Veto (auto-FAIL)

- Gerar relatório sem salvar via Write
- Omitir semáforo (verde/amarelo/vermelho) nas métricas
- Gerar projeção financeira com apenas 1 cenário
- Não comparar com benchmark Balneário Camboriú

## Critérios de Aceite

- [ ] Tabela de vendas por lote com meta e semáforo
- [ ] Métricas de marketing: CPL, CPA, ROAS por canal
- [ ] Funil de conversão lead → inscrito → pago
- [ ] Semáforo em todas as métricas principais
- [ ] Comparação com benchmark Balneário Camboriú
- [ ] Projeção financeira em 3 cenários (pessimista/realista/otimista)
- [ ] Próximas ações prioritárias
- [ ] Arquivo salvo via Write (QG-LP-005)
