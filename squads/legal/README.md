# Squad Legal — Analistas Processuais v2.0.0

**Status:** Produção · **Atualizado:** 2026-03-13 · **Agentes:** 10

Sistema multi-agente para análise, estratégia, pesquisa jurisprudencial, redação e formatação de peças processuais no direito brasileiro (CPC/2015).

---

## Arquitetura

```
             ┌──────────────────────────────┐
             │        @legal-chief          │
             │  Orquestrador & Roteamento   │
             └────────────┬─────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
  @case-analyst   @jurisprudence-   @metric-validator
  Diagnóstico     researcher        Probabilidade
  Case Brief      Anti-fabricação   Estratégia
          │               │
          └───────┬────────┘
                  ▼
    ┌─────────────────────────────────┐
    │        REDATORES                │
    │  @processual-writer  (petições) │
    │  @appellate-specialist(recursos)│
    │  @execution-specialist(execução)│
    └──────────────┬──────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
  @legal-strategy        @ralph
  Precedentes hier.     Qualidade
  Ganchos ao julgador   Auditoria
```

---

## Agentes (10)

| ID | Nome | Tier | Função Principal |
|----|------|------|-----------------|
| `legal-chief` | Chefe Jurídico | chief | Orquestra e roteia casos |
| `case-analyst` | Analista Processual | 0 | Case Brief + estratégia |
| `jurisprudence-researcher` | Pesquisador Jurisprudencial | 1 | Jurisprudência verificada |
| `processual-writer` | Redator Processual | 0 | Petições, contestações, manifestações |
| `appellate-specialist` | Especialista em Recursos | 1 | Apelação, AI, ED, REsp, RE |
| `execution-specialist` | Especialista em Execução | 1 | Cumprimento de sentença, execução |
| `legal-strategy` | Estrategista Jurídico | 1 | Cadeia hierárquica + ganchos ao julgador |
| `metric-validator` | Validador Métrico | 1 | Probabilidade de êxito (%) |
| `ralph` | Ralph — Guardião | guardian | Auditoria de qualidade (score 0-10) |
| `devops` | DevOps | infra | Infraestrutura e deploy |

---

## Fluxo do Ciclo Processual

```
Fatos brutos → @case-analyst (*analisar)
                    │ Case Brief
                    ▼
              @jurisprudence-researcher (*pesquisar)
                    │ Blocos verificados
                    ▼
         ┌──────────┼──────────┐
    petição     recurso     execução
         │          │          │
  @processual @appellate @execution
   -writer   -specialist -specialist
         └──────────┼──────────┘
                    │
              @legal-strategy (opcional — casos complexos)
                    │ Seção argumentativa com precedentes hierárquicos
                    ▼
              @ralph (*qualidade)
                    │ Quality Report
                    ▼
              PEÇA VALIDADA
```

---

## Comandos Principais

| Agente | Comando | O que entrega |
|--------|---------|---------------|
| `@legal-chief` | `*analisar {fatos}` | Ciclo completo automatizado |
| `@case-analyst` | `*analisar {fatos}` | Case Brief estruturado |
| `@jurisprudence-researcher` | `*pesquisar {tema} {tribunal}` | Blocos de jurisprudência verificados |
| `@processual-writer` | `*redigir {tipo} {fatos}` | Peça completa formatada |
| `@appellate-specialist` | `*apelar {sentenca}` | Apelação completa |
| `@execution-specialist` | `*executar {titulo}` | Cumprimento de sentença |
| `@legal-strategy` | `*cadeia-hierarquica {caso}` | Cadeia de precedentes + ganchos |
| `@metric-validator` | `*probabilidade {caso}` | Estimativa de êxito (%) com intervalo |
| `@ralph` | `*qualidade {peca}` | Score multidimensional (0-10 por eixo) |

---

## Regra Anti-Fabricação (TODOS os agentes — ABSOLUTA)

- ❌ **NUNCA** inventar número de processo, relator, data ou ementa não fornecidos pelo usuário
- ✅ Dados não confirmados: `⚠️ VERIFICAR`
- ✅ Campos ausentes: `[INSERIR: {campo}]`
- ✅ Permitido: referenciar tendências gerais sem dados específicos

---

## Estrutura de Arquivos

```
squads/legal/
├── agents/        (10 agentes)
├── tasks/         (6 workflows)
├── templates/     (3 templates)
├── checklists/    (3 checklists — 64+ itens no QA final)
├── data/          (legal-kb.md — CPC, prazos, súmulas)
└── docs/          (PRD)
```

---

## Changelog

| Versão | Data | Descrição |
|--------|------|-----------|
| 2.0.0 | 2026-03-13 | Squad completo: 10 agentes, 6 tasks, 3 templates, 3 checklists, KB |
| 1.0.0 | 2026-03-12 | Squad inicial: processual-writer + formatação |
