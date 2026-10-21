# 00 — Resumo Executivo

> **APEX Plataforma de Cursos Livres** · Documento 00 · v1.0 · 21/10/2026 · Status: **Rascunho para decisão do patrocinador**
> Índice completo e comandos de regeneração: [README](README.md)

## 1. Em uma frase

A **APEX** é uma plataforma brasileira de educação livre que **ensina, vende e opera quase sozinha**: vende cursos, trilhas, e-books, webinars, workshops ao vivo, mentorias, assinaturas, desafios, eventos, exames e licenças corporativas; usa **agentes de IA** para tutoria, criação de conteúdo, vendas, recuperação de receita, suporte e operação; e automatiza financeiro, fiscal, atendimento e compliance com aprovação humana onde a lei ou o risco exigem.

## 2. Aviso sobre o site de referência

> ⛔ **O site `juntosnaescola.com.br` NÃO foi analisado.** O ambiente em que este trabalho foi feito bloqueou o acesso ao domínio (resolução de DNS e túnel do proxy recusados; sem cópia arquivada; sem resultados em busca). **Nenhum documento afirma qualquer coisa sobre esse site.** O levantamento está estruturado e pronto para ser preenchido no [Doc 02](02-juntos-na-escola-levantamento.md) (checklist de ~80 itens, matriz de rastreabilidade e quatro formas de destravar).
>
> O escopo foi ampliado, como pedido, com base em **pesquisa de outras plataformas** (Doc 01), com nível de evidência indicado por item. Quando o Doc 02 for concluído, ele pode **acrescentar ou alterar requisitos** — essa é a pendência B-01 da Fase 0.

## 3. O que foi produzido

| Camada | Entregáveis | Tamanho |
|---|---|---|
| **Estratégia e produto** | Benchmark, visão, PRD, 357 requisitos funcionais, requisitos não funcionais, catálogo de 16 formatos | Docs 01–07 |
| **IA, vendas e operação** | 15 agentes de IA e governança, funis e venda automática, modelo operacional com workflows | Docs 08–10 |
| **Engenharia** | Arquitetura, 18 ADRs, 10 *spikes*, modelo de dados, API e eventos | Docs 11–13 + `sql/` + `api/` |
| **Experiência e marca** | Jornadas, telas e *wireframes*; identidade visual completa (logo, cores, tipografia, *tokens*) | Docs 14–15 + `brand/` |
| **Negócio e execução** | Jurídico/compliance, modelo financeiro, *go-to-market*, roadmap e backlog, QA | Docs 16–20 + `modelo-financeiro/` + `backlog/` |
| **Apoio** | Glossário, este resumo e o índice | Docs 21, 00, README |

**Em números:** 13 módulos · 17 épicos · **357 requisitos** (188 *Must*, 128 *Should*, 41 *Could*; **109 na Fase 1**) · 15 agentes de IA · 16 formatos de produto · **13 schemas / 124 tabelas** no banco · 63 histórias no backlog da Fase 1 · 18 ADRs · 10 *spikes*.

**Marca:** conceito **"ápice"** (Λ de pico com ponto laranja), família compatível com a marca ApeX já existente no repositório; logo em SVG (6 variantes + ícones), paleta com contraste verificado, paleta de dados segura para daltonismo e *brandboard* publicado como artefato privado.

## 4. Decisões de arquitetura propostas (resumo)

- **Monólito modular** em TypeScript, **multi-tenant com RLS no Postgres**, eventos por *outbox*, fornecedores atrás de *adapters* (ADR-002, 014).
- **Construir** o que diferencia (catálogo, aprendizagem, pedido/ledger, CRM-lite, workflow, IA); **comprar** o que é *commodity* (pagamento, vídeo, ao vivo, e-mail, WhatsApp, fiscal) — ADR-003.
- **IA com gateway próprio** (orçamento, *kill switch*, redação de PII), RAG com **citação obrigatória e recusa**, agentes com níveis de autonomia **por ação** e caixa de aprovações (ADR-009).
- **Guardião de Compliance** como portão de publicação, **imposto no banco de dados**, não só na interface — barra "MBA", "pós-graduação", "diploma", "reconhecido pelo MEC", promessa de resultado e escassez falsa (ADR-016).
- **Reembolso incondicional de 7 dias** e **público 18+ no lançamento** (ADR-013, 010) — ambos dependem de revisão jurídica.

## 5. Conclusões que exigem atenção

1. **O escopo da Fase 1 não cabe em 17 semanas.** O backlog soma **619 pessoas-dia**; com 6 engenheiros são **~32 semanas** (~25 até a primeira venda). Para 17 semanas seriam ~11 engenheiros. O roadmap foi reestimado: **~94 semanas (~22 meses) até a Fase 4** (Doc 19).
2. **O modelo financeiro ilustrativo não fecha em 24 meses** em nenhum cenário. A equipe é o custo dominante e **curso de ticket baixo vendido a tráfego pago frio não paga o próprio CAC** (LTV/CAC de 0,1 a 0,8 nos cenários genéricos). O cenário "o que precisa ser verdade" depende de ticket maior, orgânico/webinar/afiliados, *Pass* e B2B (Doc 17). **As premissas são hipóteses, não previsão.**
3. **Risco jurídico principal: ECA Digital** (Lei 15.211/2025, em vigor desde 17/03/2026). Autodeclaração de idade pode não bastar; é preciso parecer antes de fechar o público 18+ (RJ-02).
4. **Risco de marca:** "APEX" é nome comum e pode ter anterioridade no INPI nas classes 9, 35, 41 e 42; **a busca ainda não foi feita** (RJ-05).
5. **Janela fiscal:** NFS-e nacional e reforma tributária (IBS/CBS) exigem contador desde a Fase 0 (RJ-09, Q-04).

## 6. O que foi verificado — e o que não foi

| Item | Situação |
|---|---|
| Esquema SQL (`sql/001`, `002`) | ✅ Executado em PostgreSQL 16 efêmero; **33 de 33 verificações** passaram (RLS, FKs compostas, ledger, *append-only*, busca vetorial com ACL) |
| Contrato da API (`api/openapi.yaml`) | ✅ OpenAPI 3.1 validado por *linter* |
| Cores e contraste (Doc 15) | ✅ 36 pares calculados; paleta de dados checada para daltonismo |
| Modelo financeiro | ✅ Invariantes internos verificados a cada execução; **premissas não validadas** |
| Backlog × requisitos | ✅ Cobertura de 96/96 *Must* e 13/13 *Should* da Fase 1 (script) |
| Contagem de requisitos | ✅ Gerada por script, sem IDs duplicados ou lacunas |
| Diagramas Mermaid | Ver [README](README.md) §5 (status da validação) |
| Carregamento das fontes da marca (Sora/Inter) em produção | ⬜ Não verificado |
| Textos legais e prazos regulatórios | 🟡/⬜ Pesquisados em fontes públicas, **sem parecer de advogado** — nível por item no Doc 16 |
| Anterioridade da marca (INPI) | ⬜ Não realizada |
| Preços de fornecedores e salários | ⬜ Hipóteses; exigem cotação |
| Site de referência | ⛔ Não acessado |

## 7. Decisões que dependem de você

| ID | Pergunta | Impacto | Quando |
|---|---|---|---|
| Q-01 | Operação própria, marketplace ou white-label? | Escopo e arquitetura | Fim da Fase 0 |
| Q-02 | Público inicial 18+ ou inclui menores? | Jurídico, EP-17 | **Início da Fase 0** |
| Q-03 | Quais áreas/cursos iniciais? | Catálogo e GTM | Fase 0 |
| Q-04 | Regime tributário e CNAE da operadora | Fiscal | Fase 0 |
| Q-05 / Q-09 | Orçamento, equipe, prazo e escopo da Fase 1 (opções a/b/c no Doc 04) | Cronograma e caixa | Fase 0 |
| Q-06 | Ligar a APEX à marca/ecossistema "ApeX" existente? | Identidade, domínio, INPI | Fase 0 |
| Q-07 | Liberar o site de referência (ou enviar prints/PDF/texto) | Escopo | Fase 0 |
| Q-08 | Outros idiomas/moedas no curto prazo? | Arquitetura | Fase 0 |

## 8. Próximos passos (primeiras semanas)

1. **Destravar o Doc 02** (B-01): liberar `juntosnaescola.com.br` e `www.` em *Allowed domains* ou enviar material.
2. **Encomendar** busca INPI (B-02), parecer ECA Digital/18+ (B-03) e parecer fiscal (B-10).
3. **Decidir** Q-05/Q-09 e montar a equipe (B-13); sem isso, as datas do roadmap não são compromisso.
4. **Executar os *spikes*** S-01…S-10 e fechar os ADRs "a decidir" (B-08).
5. **Testar demanda antes de construir** (B-07, B-14): 3 temas, páginas e webinars de teste, medir CPL, comparecimento e conversão — esses números alimentam o portão **G0**.
6. **Só então** abrir a Fase 1 (Doc 19), com portões G0–G4 ligando investimento a evidência (Docs 17 e 18).

## 9. Como ler a documentação

| Perfil | Comece por |
|---|---|
| Patrocinador / diretoria | Este resumo → Doc 17 (§1, §6) → Doc 19 (§1) → Doc 16 (§1) |
| Produto | Docs 03, 04, 05, 07 → Doc 14 |
| Tecnologia | Docs 11, 12, 13 → `sql/` e `api/` → Doc 06 |
| IA | Doc 08 → Doc 16 (§7) → Doc 20 (§5, testes de IA) |
| Marketing e vendas | Docs 09, 18 → Doc 17 (§2) |
| Operações / financeiro | Doc 10 → Doc 16 (§8, fiscal) → Doc 17 |
| Jurídico / DPO | Doc 16 → Doc 07 (§4.2–4.4) → Doc 13 (eventos e dados) |
| Design | Docs 15, 14 → `brand/` |
| QA | Doc 20 → Doc 05 (§14, Gherkin) |
