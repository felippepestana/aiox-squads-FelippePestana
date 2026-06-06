# Talent-Compass — Recrutamento, Seleção & Entrevistas

> 🟢 **Squad flagship** da plataforma [Apex-Talent](../apex-talent/). Conduz o ciclo completo de Recrutamento & Seleção **por evidência**, não por intuição.

Talent-Compass transforma um "precisamos de alguém" em uma decisão **defensável**: define a vaga por objetivos de performance, monta um roteiro de entrevista estruturado (BARS + STAR), conduz a entrevista, pontua por evidência (scorecard 0–100), compara candidatos e aplica uma **auditoria de viés obrigatória** antes de qualquer recomendação.

**Princípio central:** competência decide; personalidade é contexto. DISC e Eneagrama entram **apenas como contexto de desenvolvimento, com peso 0** na pontuação — e há um *quality gate* com poder de veto para garantir isso.

## Cadeia de comando (tiers)

| Tier | Agente | Papel |
|------|--------|-------|
| 0 | `talent-compass-chief` | Orquestra o ciclo e é dono do scorecard 0–100 |
| 1 | `role-architect` | Define vaga por objetivos de performance → competências → scorecard |
| 1 | `guide-builder` | Roteiro estruturado BARS + STAR (um por vaga) |
| 1 | `ai-interviewer` | Conduz a entrevista adaptativa, captura evidência |
| 2 | `behavior-analyst` | Lente DISC de estilo de trabalho (contexto, peso 0) |
| 2 | `enneagram-coach` | Lente Eneagrama de desenvolvimento (contexto, peso 0) |
| 2 | `evidence-scorer` | Pontua por âncoras BARS; ranqueia candidatos |
| 3 | `fairness-gate` | Auditoria de viés/compliance — **veto obrigatório** |

## Scorecard (0–100)

| Área | Peso |
|------|------|
| Competências técnicas | 40 |
| Competências comportamentais (STAR) | 35 |
| Motivação & fit com a vaga | 25 |
| Estilo comportamental (DISC/Eneagrama) | **0 (contexto)** |

Conceitos: A+ (90+), A (80+), B (70+), C (55+), D (40+), F (0+).

## Fluxo (workflow `wf-hire-full-cycle`)

```text
DEFINIR ─▶ TRIAR ─▶ ROTEIRO ─▶ ENTREVISTAR ─▶ PONTUAR ─▶ AUDITAR VIÉS ─▶ DECIDIR
role-      evidence- guide-     ai-           evidence-   fairness-       chief +
architect  scorer    builder    interviewer   scorer      gate (veto)     relatório/minutas
```

## Como usar

Selecione `talent-compass:talent-compass-chief` no chatbot ou abra a feature **🎤 Entrevista** na web.

Comandos do Chief:

- `*run-hire-cycle` — ciclo completo de 7 fases
- `*define-role` — objetivos de performance + scorecard
- `*screen-resumes` — triagem e ranking de currículos
- `*build-guide` — roteiro estruturado (BARS+STAR)
- `*conduct-interview` — conduzir a entrevista
- `*score-candidate` — scorecard 0–100 por evidência
- `*fairness-audit` — gate de viés/compliance
- `*compare-candidates` — comparar finalistas
- `*generate-report` — relatório do candidato + minutas

## Adaptável a qualquer atividade

O `role-architect` faz um intake **role-agnóstico**: deriva competências, âncoras BARS e perguntas a partir dos **objetivos de performance** da vaga (não de um template fixo), reusando a [biblioteca de competências](data/competency-library.md). Funciona para qualquer cargo ou segmento.

## Minutas (impressos)

Documentos imprimíveis gerados a partir do processo (fonte canônica em [`templates/minutas/`](templates/minutas/)):

1. Carta de convocação para entrevista
2. Parecer/relatório de avaliação do candidato
3. Carta-proposta de emprego
4. Termo de consentimento LGPD
5. Carta de feedback ao candidato não aprovado

## Referências

- Lou Adler — *Performance-based Hiring*
- Google re:Work — *Structured Interviewing*
- Schmidt & Hunter — validade preditiva de métodos de seleção
- Ver também [`data/star-bars-methodology.md`](data/star-bars-methodology.md)
