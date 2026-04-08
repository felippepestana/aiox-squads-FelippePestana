# Task: Elaborar Avaliação do Imóvel

**ID:** `pd-elaborar-avaliacao`
**Executor:** `avaliador-imovel`
**Tier:** Tier 1
**Use Cases:** UC-PD-006, UC-PD-ALL

## Overview

Elabora Laudo de Avaliação Imobiliária conforme ABNT NBR 14653, selecionando o método adequado, pesquisando dados de mercado, aplicando fatores de homogeneização e determinando o valor do imóvel com grau de fundamentação e precisão.

## Input

- Dados do imóvel (endereço, área, tipo, padrão construtivo, idade)
- Dados do leitor-documental (matrícula, IPTU, habite-se)
- Análise visual do analista-visual (estado de conservação, materiais, entorno)
- Dados registrais do pesquisador-registral (quando disponíveis)

## Output

Laudo de avaliação com:
- Método utilizado e justificativa
- Pesquisa de mercado (mínimo 3 dados comparáveis)
- Tabela de homogeneização com fatores aplicados
- Cálculo de depreciação (quando método evolutivo)
- Especificação: grau de fundamentação e precisão (ABNT)
- Valor final com intervalo de confiança

## Action Items

1. Selecione o método de avaliação conforme dados disponíveis:
   - Se ≥3 dados comparáveis: Método Comparativo Direto
   - Se dados insuficientes: Método Evolutivo (terreno + benfeitoria - depreciação)
   - Se imóvel de renda: considere Capitalização da Renda
2. Pesquise dados de mercado via WebSearch (portais imobiliários, FipeZap)
3. Para cada comparável: registre endereço, tipo, área, valor, fonte, data
4. Aplique fatores de homogeneização: oferta, localização, área, padrão, idade
5. Se método evolutivo: calcule depreciação Ross-Heidecke
6. Determine valor unitário (R$/m²) e valor total
7. Especifique grau de fundamentação (I/II/III) e precisão conforme NBR 14653-2
8. Declare data-base da avaliação e ressalvas

## Acceptance Criteria

- [ ] Método declarado com justificativa
- [ ] Mínimo 3 dados de mercado comparáveis (para método comparativo)
- [ ] Fatores de homogeneização aplicados e justificados
- [ ] Grau de fundamentação e precisão especificados (ABNT)
- [ ] Valor final com intervalo de confiança
- [ ] Data-base declarada
- [ ] Ressalvas e limitações documentadas
