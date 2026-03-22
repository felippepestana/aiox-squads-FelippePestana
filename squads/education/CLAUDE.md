# Education Engineer Squad — Course Creation Pipeline

## Single Entry Point

```
@education-chief {domínio de expertise}
```

Transforma expertise de domínio em cursos online pedagogicamente sólidos e legalmente conformes, usando design instrucional baseado em evidências.

---

## Pipeline de Criação de Curso

```
Research        Curriculum        Content          Validation
Domain     →    Design       →    Creation    →    (15 gates)
(Bloom/UbD)     (Backward)        (Mayer/           MEC Brazil
                                  Rosenshine)       compliant
```

## Comandos

| Comando | O que faz |
|---------|-----------|
| `*create-course {domínio}` | Pipeline completo (pesquisa → design → lições → validação) |
| `*design-curriculum {objetivos}` | Estrutura curricular com objetivos de aprendizagem |
| `*create-lesson {tópico}` | Criar lição individual com design multimédia |
| `*create-assessments` | Gerar avaliações formativas e somativas |
| `*validate` | Rodar todos os 15 gates pedagógicos + MEC |
| `*generate-ppc` | Gerar PPC para submissão ao MEC |

## Agentes (16 Total)

| Tier | Agente | Mente Clonada | Especialidade |
|------|--------|---------------|---------------|
| T0 | `@education-chief` | — | Orquestrador |
| T0 | `@bloom-diagnostician` | Benjamin Bloom | Taxonomia e objetivos |
| T0 | `@wiggins-architect` | Grant Wiggins | UbD backward design |
| T0 | `@keller-motivator` | John Keller | ARCS motivation |
| T0 | `@sweller-analyst` | John Sweller | CLT cognitive load |
| T1 | `@mayer-presenter` | Richard Mayer | 12 multimedia principles |
| T1 | `@rosenshine-teacher` | Barak Rosenshine | 10 teaching principles |
| T1 | `@bjork-engineer` | Robert Bjork | Spaced repetition |
| T1 | `@moore-filter` | Cathy Moore | Action mapping |
| T1 | `@clark-validator` | Ruth Clark | Evidence-based design |
| T2 | `@merrill-designer` | M. David Merrill | First Principles |
| T2 | `@novak-mapper` | Joseph Novak | Concept mapping |
| T3 | `@thalheimer-assessor` | Will Thalheimer | Assessment design |
| T3 | `@ericsson-coach` | Anders Ericsson | Deliberate practice |
| T3 | `@fsrs-scheduler` | — | Spaced repetition scheduling |
| T3 | `@mec-compliance` | — | MEC Brazil compliance |

## Quality Gates (15 Total — Todos Bloqueantes)

**Pedagógicos (10):** Bloom alignment, UbD coherence, Cognitive load, Multimedia principles, Spaced practice, Motivation ARCS, Evidence-based methods, Assessment alignment, Concept mapping, Deliberate practice

**MEC Brasil (5):** PPC structure, Learning objectives format, Workload compliance, Assessment diversity, Accessibility requirements

---

*Education Squad v1.0.0 — Evidence-Based Instructional Design | MEC Brazil Compliant*
