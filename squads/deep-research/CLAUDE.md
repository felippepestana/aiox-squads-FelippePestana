# Deep Research Squad — Evidence-Based Research Pipeline

## Single Entry Point

```
@dr-orchestrator {questão de pesquisa}
```

O orquestrador classifica a questão, seleciona a metodologia certa, e roteia para os especialistas corretos.

---

## Pipeline de Pesquisa

```
PICO/SALSA          Methodology         5 Parallel          QA Sequential
Formulation    →    Selection      →    Agents         →    (Ioannidis + Kahneman)
(Sackett/Booth)     (14 types)          Execute             Evidence + Bias Audit
```

## Comandos

| Comando | Metodologia |
|---------|-------------|
| `*research {questão}` | Pipeline completo (auto-seleciona metodologia) |
| `*technical {questão}` | Technical deep dive (DORA/SPACE + benchmarks) |
| `*strategic {questão}` | Strategic research (mercado, competição) |
| `*competitive {empresa}` | Competitive intelligence (CI/OSINT) |
| `*synthesize` | Síntese de evidências com níveis de confiança |
| `*audit` | Auditoria de confiabilidade + vieses cognitivos |

## Agentes

| Agente | Mente Clonada | Especialidade |
|--------|---------------|---------------|
| `@dr-orchestrator` | — | Roteamento e coordenação |
| `@sackett` | David Sackett | PICO formulation (T0) |
| `@booth` | Andrew Booth | SALSA methodology (T0) |
| `@creswell` | John Creswell | Mixed methods (T0) |
| `@forsgren` | Nicole Forsgren | DORA/SPACE metrics (T1) |
| `@cochrane` | Cochrane Collaboration | PRISMA reviews (T1) |
| `@higgins` | Eliot Higgins | OSINT/Bellingcat (T1) |
| `@klein` | Gary Klein | NDM/RPD decision (T1) |
| `@gilad` | Ben Gilad | Competitive intel/SCIP (T1) |
| `@ioannidis` | John Ioannidis | Evidence reliability (QA) |
| `@kahneman` | Daniel Kahneman | Cognitive bias audit (QA) |

## Quality Gates (Todos Bloqueantes)

- QG-001: Question Quality (PICO/SALSA válidos, escopo claro)
- QG-002: Methodology Fit (metodologia adequada ao tipo de questão)
- QG-003: Evidence Reliability (GRADE, fontes verificadas)
- QG-004: Decision Quality (recomendações rastreáveis, vieses auditados)

## Níveis de Confiança

Toda conclusão inclui nível de confiança explícito:
- **HIGH** — múltiplas fontes concordantes, evidência forte
- **MEDIUM** — evidência moderada, alguma inconsistência
- **LOW** — evidência limitada, alta incerteza
- **SPECULATIVE** — hipótese, sem evidência direta

---

*Deep Research Squad v1.0.0 — Every conclusion earns its confidence level*
