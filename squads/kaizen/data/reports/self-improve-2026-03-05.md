# Self-Improvement Report — 2026-03-05

## Trigger

Incidente real: ao analisar o squad `squad-desafio-aiox`, o sistema (eu) declarou 80%+ de sobreposicao com squads existentes baseado em NOMES DE CATEGORIA. Apos questionamento do usuario, investigacao profunda revelou que os metodos sao complementares, nao redundantes.

## RCA — 5 Whys

1. Por que julguei como sobreposicao? Nomes de capacidades eram parecidos ("espiao" vs "instagram-spy")
2. Por que comparei por nome? Heuristica de similaridade — atalho mental mais rapido
3. Por que nao comparei metodos? Nao li os agentes dos squads existentes antes de concluir
4. Por que nao li? Assumi que "analise de canal" = "analise de canal" independente do como
5. **Causa raiz**: Vies de similaridade superficial — julgar equivalencia pelo "o que" sem investigar o "como"

## Padrao Sistemico Identificado

LLMs tem vies natural para categorizacao por rotulo. Dois squads na mesma categoria ("analise de concorrentes") parecem redundantes na superficie, mas podem usar frameworks completamente diferentes:

| Squad | Categoria | Metodo | Persona |
|-------|-----------|--------|---------|
| instagram-spy | Analise concorrentes | 8 agentes, 5Fs, Re-hook, Wardley | Avancado |
| AIOX espiao | Analise concorrentes | Scan rapido, metricas basicas | Iniciante |

Mesma categoria. Metodos opostos. Complementares.

## Melhorias Aplicadas (2/2 auto-aplicadas)

### 1. Anti-pattern no Kaizen Chief

- **Arquivo**: `squads/kaizen/agents/kaizen-chief.md`
- **Tipo**: ANTI-PATTERN + RED FLAG
- **O que**: Adicionado anti-pattern "Judge squad overlap by CATEGORY NAME instead of METHOD" com 5 dimensoes obrigatorias de comparacao
- **Red flag**: Quando analise conclui "redundancia", HALT e aplicar Method Comparison Protocol
- **Esforco**: P (pequeno)
- **Destrutivo**: Nao

### 2. Memoria do projeto

- **Arquivo**: `memory/MEMORY.md`
- **Tipo**: PADRAO CONFIRMADO
- **O que**: Registrado "Vies de Similaridade Superficial" com regra de 5 dimensoes, causa raiz e exemplo real
- **Esforco**: P (pequeno)
- **Destrutivo**: Nao

## Method Comparison Protocol (novo)

Antes de declarar redundancia entre squads, OBRIGATORIO comparar:

1. **Framework/Metodologia**: Qual framework cada um usa? (ex: PVSS vs scan simples)
2. **Tipo de Input**: O que cada um recebe? (ex: video pronto vs @handle de concorrente)
3. **Granularidade do Output**: Quao profundo e o resultado? (ex: 26 pecas rapidas vs playbook estrategico)
4. **Persona-Alvo**: Pra quem e? (ex: iniciante vs criador sofisticado)
5. **Integracao com Ferramentas**: Usa tooling real? (ex: Remotion, render.ts vs texto puro)

**Regra**: So declarar redundancia quando TODAS as 5 dimensoes sao iguais. Se pelo menos 2 diferem, sao complementares.

## Impacto Esperado

- Previne descarte prematuro de squads que parecem duplicados
- Melhora qualidade das recomendacoes do Kaizen em analises futuras
- Abre possibilidade de A/B testing entre abordagens diferentes no mesmo dominio

## Licao Meta

O usuario fez a pergunta certa: "sao sobreposicoes mesmo ou usam metodos diferentes?" — isso forcou uma re-analise que revelou valor oculto. A melhoria nao e so no sistema, e no PROCESSO DE JULGAMENTO.

---

*Kaizen Self-Improvement Report — Gerado automaticamente*
