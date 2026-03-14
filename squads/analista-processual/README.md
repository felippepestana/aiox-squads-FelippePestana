# ⚖️ Analista Processual Squad

> Análise estruturada de processos judiciais brasileiros — extração de dados, mapeamento de prazos e identificação de riscos com base no CPC/2015.

**Versão:** 1.0.0 | **Domínio:** Direito Processual Civil | **Status:** 🟢 OPERATIONAL | **Score:** 9.2/10

---

## O que este Squad faz

O **Analista Processual** transforma documentos jurídicos brutos (petições, decisões, despachos, sentenças) em informações estruturadas, acionáveis e juridicamente precisas para equipes jurídicas.

**Base intelectual:** Humberto Theodoro Júnior, Ada Pellegrini Grinover, Cássio Scarpinella Bueno e o CPC/2015.

---

## Quando usar

| Situação | Comando |
|----------|---------|
| Novo processo chegou na carteira | `*analisar-processo` |
| Advogado precisa de resumo rápido | `*resumir-processo` |
| Verificar todos os prazos correntes | `*mapear-prazos` |
| Recebeu uma sentença para analisar | `*analisar-sentenca` |
| Identificar riscos do processo | `*riscos` |
| Montar linha do tempo do processo | `*cronologia` |

---

## Agentes

```
Tier 0 — Orquestração
  └── analista-processual (Chief)
      Análise completa, relatórios, coordenação

Tier 1 — Especialistas
  ├── extrator-documentos
  │   Extração estruturada de peças processuais
  ├── calculador-prazos
  │   Cálculo de prazos (CPC/2015 + legislação especial)
  └── mapeador-riscos
      Riscos, vícios, nulidades e pressupostos processuais
```

---

## Quickstart

```bash
# Ativar o agente principal
@analista-processual

# Análise completa de um processo
*analisar-processo

# Só os prazos
*mapear-prazos

# Resumo executivo de 1 página
*resumir-processo

# Analisar sentença recebida
*analisar-sentenca
```

---

## Comandos Disponíveis

| Comando | O que faz |
|---------|-----------|
| `*analisar-processo` | Análise completa: partes, pedidos, cronologia, prazos, riscos |
| `*resumir-processo` | Resumo executivo em 1 página para equipe jurídica |
| `*mapear-prazos` | Tabela de prazos com datas-limite calculadas |
| `*extrair-partes` | Identificação de partes, advogados e representantes |
| `*cronologia` | Linha do tempo de todos os atos processuais |
| `*riscos` | Mapeamento de riscos e vícios processuais |
| `*analisar-sentenca` | Análise estruturada de sentença (relatório, fundamentos, dispositivo) |
| `*analisar-peticao` | Análise de petição inicial ou contestação |

---

## Base Normativa

| Norma | Aplicação |
|-------|-----------|
| **CPC/2015** (Lei 13.105/2015) | Referência primária para prazos e procedimentos |
| **CF/1988** | Garantias processuais fundamentais |
| **CLT** | Processos trabalhistas |
| **CDC** — Lei 8.078/1990 | Processos consumeristas |
| **Lei 6.830/1980** | Execução Fiscal |
| **Lei 9.099/1995** | Juizados Especiais |

---

## Regra de Contagem de Prazos

A partir do CPC/2015 (vigente desde 18/03/2016), **todos os prazos processuais são em dias úteis** (art. 219), salvo disposição expressa em contrário.

```
Intimação em:       {Dia X}
Início do prazo:    {Dia X + 1 dia útil}
Prazo de:           {N dias úteis}
Vencimento:         {data calculada}

Se vencer em dia não útil → prorroga para o próximo dia útil (art. 224, §1º)
```

---

## Sistema de Alertas

| Nível | Símbolo | Descrição |
|-------|---------|-----------|
| CRÍTICO | 🔴 | Prescrição, decadência, nulidade absoluta, prazo fatal iminente |
| ATENÇÃO | 🟡 | Vícios sanáveis, competência questionável, documentação incompleta |
| OBSERVAÇÃO | 🟢 | Informações complementares e boas práticas |

---

## Limitações Importantes

- **Não acessa** sistemas judiciais (PJe, e-SAJ, PROJUDI) diretamente
- **Não emite** pareceres jurídicos — análise factual e processual apenas
- **Não garante** completude quando documentos não são fornecidos integralmente
- **Feriados locais** devem ser informados pelo usuário para cálculo preciso
- **Sempre confirmar** datas no sistema judicial antes de qualquer ato processual

---

## Exemplo de Uso

```
@analista-processual
*analisar-processo

[Sistema solicita número do processo e documentos]

Processo: 1234567-89.2024.8.26.0100
[Cola a petição inicial e a última decisão]

[Sistema gera relatório completo com partes, prazos, cronologia e riscos]
```

---

## Contribuindo

Para melhorar este squad:
1. Abra uma issue descrevendo a melhoria
2. Fork e implemente
3. Abra um PR referenciando a issue

---

*Licença MIT — AIOX Squads Community*
