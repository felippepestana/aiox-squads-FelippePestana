# APEX — Plataforma de Cursos Livres

> Pacote de documentação para projetar e desenvolver uma plataforma EAD brasileira que **ensina, vende e opera quase sozinha**, com IA, automação operacional e vendas automáticas.
> Versão 1.0 · 21/10/2026 · Status: **rascunho para decisão do patrocinador**
> Comece pelo [**Resumo Executivo**](00-resumo-executivo.md).

> ⛔ **O site de referência `juntosnaescola.com.br` não foi analisado** (acesso bloqueado pelo ambiente de execução). Nenhum documento descreve esse site. O roteiro de levantamento está pronto em [`02-juntos-na-escola-levantamento.md`](02-juntos-na-escola-levantamento.md); ao concluí-lo, revisar os Docs 04 e 05.

---

## 1. Documentos

| # | Documento | Para quê |
|---|---|---|
| 00 | [Resumo executivo](00-resumo-executivo.md) | Visão geral, achados, o que foi verificado, decisões pendentes |
| 01 | [Pesquisa e benchmark](01-pesquisa-benchmark.md) | Plataformas analisadas, mapa de capacidades C-01…C-19, lacunas de mercado |
| 02 | [Levantamento do site de referência](02-juntos-na-escola-levantamento.md) | **Pendente** — checklist, formas de destravar, matriz de rastreabilidade |
| 03 | [Visão de produto e estratégia](03-visao-produto-estrategia.md) | Visão, pilares, personas, módulos, hipóteses |
| 04 | [PRD](04-prd.md) | Objetivos, KPIs, épicos, fases, riscos, questões abertas |
| 05 | [Requisitos funcionais](05-requisitos-funcionais.md) | 357 requisitos por módulo, com critérios de aceite (Gherkin) |
| 06 | [Requisitos não funcionais](06-requisitos-nao-funcionais.md) | Desempenho, segurança, privacidade, acessibilidade, IA, custo |
| 07 | [Catálogo de formatos](07-catalogo-formatos-produto.md) | 16 formatos de produto, estados, certificação, reembolso |
| 08 | [IA: arquitetura e agentes](08-ia-arquitetura-e-agentes.md) | Gateway, RAG, 15 agentes, autonomia, segurança, avaliações |
| 09 | [Marketing, vendas e captação](09-marketing-vendas-captacao.md) | Funis, recuperação, SEO/GEO, afiliados, integridade comercial |
| 10 | [Gestão operacional](10-gestao-operacional-administracao.md) | Modelo operacional, workflows, torre de controle, runbooks |
| 11 | [Arquitetura técnica](11-arquitetura-tecnica.md) | Visão C4, stack, multi-tenancy, segurança, *spikes*, 18 ADRs |
| 12 | [Modelo de dados](12-modelo-de-dados.md) | Esquemas, regras impostas no banco, retenção |
| 13 | [API e eventos](13-api-e-eventos.md) | Convenções, recursos, catálogo de eventos, webhooks |
| 14 | [UX, jornadas e telas](14-ux-jornadas-telas.md) | Arquitetura de informação, jornadas, mapa de telas, *wireframes* |
| 15 | [Identidade visual](15-identidade-visual-apex.md) | Conceito, logo, cores, tipografia, voz, uso da marca |
| 16 | [Jurídico e compliance](16-juridico-compliance.md) | Obrigações legais, riscos, documentos a produzir, fontes |
| 17 | [Negócio e financeiro](17-negocio-financeiro.md) | Modelo de receita, custos, cenários, "o que precisa ser verdade", portões |
| 18 | [*Go-to-market*](18-go-to-market.md) | Lançamento em etapas, canais, programa de instrutores e afiliados |
| 19 | [Roadmap, backlog e equipe](19-roadmap-backlog-equipe.md) | Fases, backlog da Fase 1, equipe, riscos de execução |
| 20 | [QA, testes e aceite](20-qa-testes-aceite.md) | Estratégia de testes, matriz crítica, IA, Go/No-Go |
| 21 | [Glossário](21-glossario.md) | Termos de negócio, produto, IA, engenharia e legislação |

## 2. Ativos que acompanham os documentos

```text
docs/apex-cursos-livres/
├── 00…21-*.md                  # documentação (pt-BR)
├── sql/
│   ├── 001_schema.sql          # 13 schemas, 124 tabelas, RLS, ledger, auditoria
│   ├── 002_ai_vector.sql       # RAG com pgvector e ACL por entitlement
│   └── verify_001.sql          # 33 verificações comportamentais (transação revertida)
├── api/openapi.yaml            # contrato OpenAPI 3.1
├── brand/
│   ├── assets/*.svg            # logo, símbolo, ícone, favicon (variantes clara/escura/mono)
│   ├── tokens.css|json         # design tokens gerados
│   └── brandboard.html         # prancha da marca (publicada como artefato privado)
├── modelo-financeiro/          # simulador de 24 meses e CSVs por cenário
├── backlog/backlog-fase1.csv   # 63 histórias rastreadas a requisitos
└── scripts/                    # verificação e geração (ver §3)
```

Prancha da marca publicada: <https://claude.ai/artifact/AAF3PDitweqB3kpTZnZHCF> *(privada; compartilhar pelo menu da página)*.

## 3. Como regenerar e verificar

Execute a partir de `docs/apex-cursos-livres/`. Scripts em Python usam só a biblioteca padrão.

| Objetivo | Comando |
|---|---|
| Contar requisitos por módulo/prioridade/fase (tabela do Doc 05 §15) | `python3 scripts/count_rf.py 05-requisitos-funcionais.md` |
| Rodar o modelo financeiro e regravar `cenario_*.csv` | `python3 modelo-financeiro/model.py` |
| Validar backlog × requisitos e comparar esforço × capacidade | `python3 scripts/estimate_backlog.py --engineers 6 --weeks 17` |
| Regerar blocos gerados do Doc 17 (conclusões, linha do tempo, modelo) | `python3 scripts/render_doc17.py` |
| Regerar o bloco de backlog do Doc 19 | `python3 scripts/render_doc19.py` |
| Regerar *tokens* de design | `python3 scripts/gen_tokens.py` |
| Verificar links, IDs (RF/ADR/Q/B) e ponteiros "Doc N §M" | `python3 scripts/check_docs.py` |
| Validar e renderizar todos os diagramas Mermaid | `MERMAID_DIR=… CHROMIUM=… node scripts/validate-mermaid.mjs` (instalação no cabeçalho do script) |
| Validar o esquema SQL em um banco descartável | `DATABASE_URL=postgresql://… scripts/verify-schema.sh` ou `scripts/verify-schema.sh --ephemeral` (**não** executar como root) |
| Lint do contrato da API | `npx @redocly/cli lint api/openapi.yaml` |

> Os blocos entre `<!-- …:START -->` e `<!-- …:END -->` nos Docs 05, 17 e 19 são **gerados**; edite a fonte (tabelas, `model.py`, CSV) e rode o script, não o texto gerado.

## 4. Convenções

- **Idioma:** documentação em português do Brasil; código, comentários, commits e identificadores em inglês.
- **Identificadores:** `RF-<MÓDULO>-NNN` (requisito), `EP-nn` (épico), `ADR-nnn`, `S-nn` (*spike*), `Q-nn` (questão aberta), `B-nn` (ação da Fase 0), `R-nn`/`RJ-nn` (risco), `T-nnn` (teste), `WF-…` (workflow), `AG-nn` (agente), `F-nn` (formato). Ver o [glossário](21-glossario.md) §7.
- **Níveis de verificação jurídica (Doc 16):** ✅ fonte primária consultada · 🟡 fonte secundária ou fontes divergentes · ⬜ não verificado.
- **Todo valor financeiro é ilustrativo** até ser substituído por cotações e dados reais da Fase 0.

## 5. Status da verificação

| Item | Resultado | Observação |
|---|---|---|
| Esquema SQL em PostgreSQL 16 efêmero | ✅ 33/33 verificações | RLS, FKs compostas, ledger balanceado, tabelas *append-only*, publicação condicionada à aprovação do Guardião, busca vetorial com ACL e texto completo |
| OpenAPI 3.1 | ✅ válido no *linter* | Um aviso (resposta 4XX ausente em `GET /events`) foi corrigido |
| Contraste de cores (Doc 15) | ✅ 36 pares calculados | Meta WCAG 2.2 AA; paleta de dados de 5 cores verificada para daltonismo |
| Logo e tokens | ✅ renderizados e conferidos visualmente | Fontes (Sora/Inter) via Google Fonts **não** testadas em produção |
| Modelo financeiro | ✅ invariantes internos | Premissas **não validadas**; é um teste de estresse, não previsão |
| Backlog × requisitos | ✅ 96/96 *Must* e 13/13 *Should* da Fase 1 cobertos | Estimativas grosseiras (S/M/L) |
| Diagramas Mermaid | ✅ 28/28 válidos (análise + renderização) | Uma falha de renderização (dois-pontos em nome de tarefa do Gantt no Doc 04) foi corrigida |
| Links, IDs e ponteiros entre documentos | ✅ sem pendências em `check_docs.py` | 357 RFs, 18 ADRs, 9 questões, 15 ações da Fase 0 |
| Textos legais, prazos e alíquotas | 🟡/⬜ | Pesquisa em fontes públicas, **sem parecer de advogado ou contador** |
| Anterioridade da marca no INPI | ⬜ | Não realizada (B-02) |
| Preços de fornecedores, salários, CPL/conversão | ⬜ | Hipóteses; validar na Fase 0 (B-09, B-14) |
| Site `juntosnaescola.com.br` | ⛔ | Não acessado (B-01) |

## 6. Pendências e decisões

1. **Destravar a análise do site de referência** (B-01/Q-07): liberar `juntosnaescola.com.br` e `www.` em *Allowed domains* do ambiente, ou enviar prints/PDF/texto (Doc 02 §2).
2. **Decidir** Q-01 a Q-09 (lista completa no [Doc 04](04-prd.md) §10 e no [Resumo executivo](00-resumo-executivo.md) §7).
3. **Contratar** busca INPI (B-02), parecer sobre ECA Digital/público 18+ (B-03) e parecer fiscal (B-10) antes de investir em marca, checkout e emissão de notas.
4. **Escolher** entre as opções de prazo × equipe × escopo da Fase 1 (Q-09; Doc 19 §5).
5. **Executar** os *spikes* S-01…S-10 e fechar os ADRs marcados como "a decidir" (Doc 11 §13).

## 7. Relação com o restante do repositório

Esta pasta é independente dos squads. O Doc 08 propõe reaproveitar o squad [`squads/education`](../../squads/education) (frameworks pedagógicos e o checklist `mec-curso-livre-check.md`) como base de regras do APEX Studio e do Guardião, **copiando e versionando as regras dentro do produto** (ADR-016) em vez de depender deste repositório em produção.
