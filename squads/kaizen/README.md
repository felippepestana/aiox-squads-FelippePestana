# Kaizen Squad

O squad que vigia e melhora todos os outros.

---

## Você sabe responder essas perguntas agora?

- Qual dos seus squads está **gastando mais** e entregando menos?
- Tem alguma competência que **nenhum** dos seus agentes cobre?
- Aquele squad que você criou mês passado — alguém usou?
- O que está travando seu pipeline **neste momento**?
- Quanto custa, em dólares, gerar cada peça de conteúdo?

Se você hesitou em qualquer uma, seu ecossistema está crescendo no escuro.

Não importa se você tem 3 squads ou 30. Não importa se são de conteúdo, código, marketing ou vendas. O problema é o mesmo: **ninguém vigia os squads.**

Squads nascem. Agentes acumulam. Ferramentas empilham. E sem um sistema que monitore tudo, três coisas acontecem sempre:

1. **Custos sobem** sem que ninguém perceba
2. **Gaps aparecem** e só são descobertos quando já travaram o fluxo
3. **Agentes redundantes** coexistem fazendo a mesma coisa de formas diferentes

Quando você percebe, já perdeu semanas. Às vezes meses.

---

## O que o Kaizen faz

Um comando. Seis dimensões do seu ecossistema analisadas. Resposta em minutos.

```text
/kaizen:analyze
```

| Dimensão | A pergunta que responde |
|----------|------------------------|
| **Estrutura** | Seus squads estão organizados da forma certa — ou precisam ser divididos, fundidos, retipados? |
| **Performance** | Quem está entregando rápido com qualidade — e quem está devendo? |
| **Gargalos** | Existe UM ponto que está travando TODO o fluxo? Qual é? |
| **Competências** | Que habilidade está faltando no ecossistema e ainda ninguém percebeu? |
| **Ferramentas** | Que tool deveria ser adotada, testada — ou aposentada de vez? |
| **Custos** | Quanto cada squad consome? O retorno justifica o investimento? |

Cada pergunta é respondida por um agente especialista com um framework validado por décadas de uso em empresas reais.

Não é opinião. É evidência.

---

## Por que funciona

### Não é um dashboard. É um diagnóstico.

Dashboards mostram números. O Kaizen **interpreta** os números, **encontra** a causa raiz e **recomenda** exatamente o que fazer — em ordem de prioridade.

### Não espera você perguntar.

O Kaizen monitora automaticamente. Criou um story novo? Ele verifica se você tem competência para entregar. Modificou um squad? Ele checa o impacto na topologia. Entregou uma feature? Ele mede o custo real.

### Se melhora sozinho.

Toda semana o Kaizen analisa sua própria eficácia. Quais recomendações foram implementadas? Quais foram ignoradas? Alguma heurística precisa de ajuste? Ele se recalibra. Máximo 3 melhorias por ciclo — triviais são auto-aplicadas, destrutivas pedem aprovação.

---

## Os 7 Agentes

```text
                      ORCHESTRATOR
                    kaizen-chief
              (routing, síntese, relatório)
  ─────────────────────────────────────────────
              TIER 0 — Diagnóstico
      topology-analyst  │  performance-tracker
      (Team Topologies)    (DORA + BSC + OKR)
  ─────────────────────────────────────────────
              TIER 1 — Análise
    bottleneck-hunter │ capability-mapper │ tech-radar
    (TOC + OMTM)        (Wardley + 4R)     (Radar + FF)
  ─────────────────────────────────────────────
              TIER 2 — Custos
                    cost-analyst
                  (FinOps + Kaplan)
```

| Agente | A pergunta que responde |
|--------|------------------------|
| **kaizen-chief** | Qual o estado geral? O que merece atenção agora? |
| **topology-analyst** | Esse squad deveria ser dividido, fundido ou retipado? |
| **performance-tracker** | Quem entrega rápido? Quem tem retrabalho alto? |
| **bottleneck-hunter** | Qual é o único gargalo que trava o sistema inteiro? |
| **capability-mapper** | Que competência nenhum agente cobre — e deveria? |
| **tech-radar** | Que ferramenta adotar agora, testar, ou aposentar? |
| **cost-analyst** | Quanto custa cada entrega? O ROI justifica? |

---

## O que você recebe toda semana

Um relatório com no máximo 5 recomendações. Cada uma com:

- **Evidência** — dado real de qual agente detectou o problema
- **Impacto** — HIGH, MEDIUM ou LOW
- **Ação** — exatamente o que fazer
- **Custo** — quanto vai custar resolver
- **ROI** — quanto vai economizar

Se você só fizer a recomendação #1, já valeu a semana.

---

## As 10 Mentes por Trás

O conhecimento de 10 especialistas está codificado nos agentes. Não como referência — como lógica de decisão:

| Mente | O que ensinou ao sistema |
|-------|------------------------|
| **Skelton & Pais** | Quando dividir, fundir ou retipar squads |
| **Eliyahu Goldratt** | Como encontrar o único gargalo que trava tudo |
| **Nicole Forsgren** | As 4 métricas que realmente importam em delivery |
| **Simon Wardley** | Como mapear a evolução de competências no tempo |
| **Martin Fowler** | Como avaliar maturidade de ferramentas sem viés |
| **Kaplan & Norton** | Como equilibrar métricas financeiras e operacionais |
| **John Doerr** | Como alinhar objetivos com resultados mensuráveis |
| **Josh Bersin** | Recrutar, reskill, realocar ou remover — a decisão certa |
| **Neal Ford** | Como validar decisões arquiteturais com fitness functions |
| **Alistair Croll** | A única métrica que importa agora — e como encontrá-la |

---

## Comandos

| Comando | O que faz |
|---------|-----------|
| `*analyze` | Análise completa — 6 dimensões, todos os agentes |
| `*gaps` | Detecta competências e ferramentas que estão faltando |
| `*performance` | Dashboard de métricas (lead time, rework rate, throughput) |
| `*radar` | Atualiza o radar de tecnologias (Adopt / Trial / Assess / Hold) |
| `*cost` | Análise de custo por squad, por entrega, ROI |
| `*report` | Relatório semanal com máx 5 recomendações priorizadas |
| `*self-improve` | O squad analisa a si mesmo e aplica melhorias |

---

## Números

| Métrica | Valor |
|---------|-------|
| Agentes | 7 |
| Frameworks codificados | 11 |
| Heurísticas determinísticas | 35 |
| Mentes elite integradas | 10 |
| Quality gates | 4 (todos blocking) |
| Custo semanal | ~$4.50 |

---

## Ativação

```bash
/kaizen:chief        # Orquestrador interativo
/kaizen:analyze      # Análise completa automática
/kaizen:gaps         # Detectar gaps
/kaizen:performance  # Dashboard de performance
/kaizen:cost         # Análise de custos
/kaizen:self-improve # Auto-melhoria
```

---

## Estrutura

```text
squads/kaizen/
├── agents/       7 agentes (Orchestrator + T0 + T1 + T2)
├── tasks/        8 tasks executáveis
├── workflows/    3 workflows de orquestração
├── templates/    4 templates de output
├── checklists/   3 quality gates
├── rules/        Regras transversais
├── minds/        10 mentes elite
├── data/         Baselines, relatórios, tracking
└── scripts/      Automação (triggers, validação)
```

---

**Status**: ACTIVE | **Cadência**: Semanal (domingo 20:00 BRT) | **Versão**: 1.2.0
