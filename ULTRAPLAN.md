# ULTRAPLAN — Plano Mestre de Reestruturação AIOX Squads

> **Versão:** 2.0.0  
> **Data:** 2026-04-07  
> **Branch:** `claude/restructure-aiox-planning-72LPT`  
> **Status:** Sprint 1 concluído

### Progresso

| Iniciativa | Status | Commit |
|-----------|--------|--------|
| F1.1 — Promoção de squads | **DONE** | 9/10 squads OPERATIONAL |
| F1.2 — Completar DevOps/SEO | **DONE** | +30 artefatos criados |
| F1.3 — Limpeza do registry | **DONE** | Keywords, descriptions, domain_index |
| F2.1 — Testes automatizados | **DONE** | 43 testes, Vitest configurado |
| F2.2 — Segurança (Zod + TTL) | **DONE** | Validação + SessionManager |
| F3.1 — ARCHITECTURE.md | **DONE** | Diagrama de arquitetura completo |
| F1.4 — Validação CI | Pendente | — |
| F2.3 — Shared package | Pendente | — |
| F2.4 — CI/CD completo | Pendente | — |
| F2.5 — Persistência | Pendente | — |
| F3.2 — README sync | **DONE** | Badges sincronizados |
| F3.3 — Templates contribuição | Pendente | — |
| F4.1 — Novos squads | Pendente | — |
| F4.2 — Marketplace | Pendente | — |

---

## Sumário Executivo

O ecossistema AIOX Squads possui **10 squads, 87 agentes e 189 tasks** — uma base sólida. Porém, a análise profunda revela que **100% dos squads estão em DEVELOPING** (nenhum OPERATIONAL), a infraestrutura tem **zero testes automatizados**, e existem gaps críticos em segurança, persistência e CI/CD.

Este ULTRAPLAN define **4 frentes estratégicas** com **18 iniciativas** priorizadas para levar o projeto de "protótipo funcional" para "plataforma de produção".

---

## Diagnóstico Atual

### Scorecard do Ecossistema

| Métrica | Valor | Meta |
|---------|-------|------|
| Squads totais | 10 | 15+ |
| Squads OPERATIONAL | **0** | 8+ |
| Squads DEVELOPING | 10 | ≤ 2 |
| Agentes totais | 87 | 100+ |
| Tasks totais | 189 | 250+ |
| Testes automatizados | **0** | 100+ |
| Cobertura de testes | **0%** | 80%+ |
| Squads com `validated: true` | **0** | 10 |
| Squads sem changelog | 2 (dispatch, seo) | 0 |
| Squads sem description | 2 (curator, dispatch) | 0 |

### Scores por Squad

| Squad | Score | Maturity | Gaps Críticos |
|-------|-------|----------|---------------|
| apex | 10.0 | DEVELOPING | Não validado, sem promoção |
| curator | 10.0 | DEVELOPING | Sem description no registry |
| education | 10.0 | DEVELOPING | Não validado |
| deep-research | 9.5 | DEVELOPING | Não validado |
| kaizen | 9.1 | DEVELOPING | Não validado |
| analista-processual | 9.0 | DEVELOPING | Recém-adicionado |
| devops | 9.0 | DEVELOPING | 0 workflows, 0 templates, 0 checklists |
| dispatch | 9.0 | DEVELOPING | Sem changelog, sem description |
| squad-creator | 7.5 | DEVELOPING | Score abaixo de 9.0 |
| seo | **6.5** | DEVELOPING | Score mais baixo, sem changelog, 3 tasks apenas |

### Inconsistências Detectadas

1. **README vs Registry:** README mostra 8 squads como 🟢 (OPERATIONAL), mas registry mostra todos como DEVELOPING
2. **Scores altos mas não promovidos:** 3 squads com score 10.0 continuam DEVELOPING
3. **Keywords de baixa qualidade:** Muitas keywords genéricas ("que", "todos", "for", "into") sem valor semântico
4. **Código duplicado:** `agents.ts`, `files.ts`, `chatSession.ts` duplicados entre web/ e chatbot/
5. **DevOps squad incompleto:** Squad de DevOps com 0 workflows/templates/checklists — irônico para um squad de automação

---

## Frente 1: Qualidade dos Squads

**Objetivo:** Promover 8+ squads para OPERATIONAL, corrigir gaps estruturais.

### 1.1 — Pipeline de Promoção DEVELOPING → OPERATIONAL

**Prioridade:** P0 | **Esforço:** Médio | **Impacto:** Crítico

Nenhum squad está OPERATIONAL apesar de 3 terem score 10.0. O pipeline de promoção está quebrado ou inexistente.

**Ações:**
- [ ] Definir critérios explícitos de promoção (score ≥ 9.0 + validated + changelog + description)
- [ ] Criar script `scripts/promote-squad.sh` que valida e promove automaticamente
- [ ] Promover imediatamente: **apex**, **curator**, **education** (score 10.0)
- [ ] Promover após validação: **deep-research** (9.5), **kaizen** (9.1), **analista-processual** (9.0), **devops** (9.0), **dispatch** (9.0)
- [ ] Atualizar `ecosystem-registry.yaml` com `maturity: OPERATIONAL` e `validated: true`
- [ ] Sincronizar badges do README com o registry (fonte única de verdade)

### 1.2 — Completar Squads Incompletos

**Prioridade:** P0 | **Esforço:** Grande | **Impacto:** Alto

**DevOps Squad (9.0 mas estruturalmente incompleto):**
- [ ] Criar pelo menos 2 workflows (CI/CD pipeline, infra provisioning)
- [ ] Adicionar templates de output (Dockerfile, docker-compose, terraform)
- [ ] Criar checklists de segurança e deploy
- [ ] Adicionar data files de referência (best practices, patterns)

**SEO Squad (6.5 — score mais baixo):**
- [ ] Aumentar de 3 para 8+ tasks
- [ ] Criar changelog
- [ ] Adicionar templates (SEO audit report, schema markup)
- [ ] Adicionar data files (ranking factors, Core Web Vitals thresholds)
- [ ] Meta: elevar score para ≥ 9.0

**Dispatch Squad:**
- [ ] Criar CHANGELOG.md
- [ ] Adicionar description no registry

**Curator Squad:**
- [ ] Adicionar description no registry

### 1.3 — Limpeza do Registry

**Prioridade:** P1 | **Esforço:** Pequeno | **Impacto:** Médio

- [ ] Remover keywords genéricas sem valor semântico ("que", "todos", "for", "into", "cada", etc.)
- [ ] Adicionar keywords de domínio relevantes (ex: curator → "video", "transcription", "editing", "highlights")
- [ ] Preencher `description` vazias (curator, dispatch)
- [ ] Melhorar `example_use` genéricos ("Use X for X tasks" → exemplos concretos)
- [ ] Recriar `domain_index` com keywords limpas
- [ ] Atualizar `metadata.total_squads` conforme necessário

### 1.4 — Validação Automatizada de Qualidade

**Prioridade:** P1 | **Esforço:** Médio | **Impacto:** Alto

O CI atual (`validate-squads.yml`) só verifica presença de arquivos, não qualidade.

- [ ] Validar YAML frontmatter de cada agente (campos obrigatórios: name, id, tier, persona)
- [ ] Verificar que cada agente tem voice_dna, heuristics e examples (≥ 3)
- [ ] Validar que config.yml tem todos os campos requeridos
- [ ] Verificar score mínimo por maturity (DEVELOPING ≥ 7.0, OPERATIONAL ≥ 9.0)
- [ ] Adicionar lint de markdown para formatação consistente
- [ ] Bloquear merge de PRs com squads abaixo do threshold

---

## Frente 2: Infraestrutura & Código

**Objetivo:** Hardening de produção — testes, segurança, observabilidade.

### 2.1 — Testes Automatizados (Zero → Cobertura)

**Prioridade:** P0 | **Esforço:** Grande | **Impacto:** Crítico

O projeto tem **zero testes**. Isso é o gap mais crítico.

**Backend (web/server):**
- [ ] Configurar Vitest como test runner
- [ ] Testes unitários: `agents.ts` (loader, fallback), `authPortal.ts` (auth flow), `files.ts` (upload, MIME validation)
- [ ] Testes de integração: API endpoints (squads list, chat flow, session lifecycle)
- [ ] Testes de streaming: SSE chunking, timeout handling, error recovery
- [ ] Meta: 40+ testes, 80% cobertura dos módulos server

**Chatbot CLI:**
- [ ] Testes unitários: agent loading, file handling
- [ ] Desacoplar readline para testabilidade
- [ ] Meta: 15+ testes

**Squads (validação estrutural):**
- [ ] Script de teste que carrega cada squad e verifica integridade
- [ ] Verificação de handoffs (agente A referencia agente B que existe)
- [ ] Meta: 1 teste por squad

**CI Integration:**
- [ ] Adicionar step de testes em `web.yml` e `validate-squads.yml`
- [ ] Bloquear merge se testes falham
- [ ] Relatório de cobertura como comentário em PRs

### 2.2 — Segurança & Hardening

**Prioridade:** P0 | **Esforço:** Médio | **Impacto:** Crítico

- [ ] **Input validation:** Adicionar Zod schemas para todos endpoints da API
- [ ] **Session TTL:** Implementar expiração de sessão (15min default) com cleanup automático
- [ ] **Rate limiting por sessão:** Não só por IP — limitar requests por sessionId
- [ ] **CORS hardening:** Configurar origins permitidas para produção (não `origin: true`)
- [ ] **Structured logging:** Pino ou Winston com contexto (sessionId, squadId, agentId)
- [ ] **Timeout de streaming:** Abortar chat requests após 5min sem resposta
- [ ] **File upload hardening:** Validar content-type real (não só extensão), limitar tipos

### 2.3 — Eliminação de Código Duplicado

**Prioridade:** P1 | **Esforço:** Grande | **Impacto:** Alto

`agents.ts`, `files.ts` e lógica de chat são duplicados entre web/ e chatbot/.

- [ ] Criar pacote compartilhado `packages/aiox-chat-core/`
- [ ] Extrair: agent loader, file handler, chat session, Anthropic client wrapper
- [ ] Configurar npm workspaces ou turborepo para monorepo
- [ ] web/ e chatbot/ importam de `@aiox/chat-core`
- [ ] Um bug fix = uma correção, não duas

**Estrutura proposta:**
```
packages/
  aiox-chat-core/
    src/
      agents.ts      # Shared agent loader
      files.ts       # Shared file handler
      chatSession.ts # Shared chat session
      types.ts       # Shared types
    package.json
web/                 # imports @aiox/chat-core
chatbot/             # imports @aiox/chat-core
```

### 2.4 — CI/CD Completo

**Prioridade:** P1 | **Esforço:** Médio | **Impacto:** Alto

- [ ] **Linting:** Adicionar ESLint + Prettier check no CI (hoje não existe)
- [ ] **TypeScript strict:** Verificar type errors no CI
- [ ] **Security scanning:** `npm audit` automático, dependabot alerts
- [ ] **Deploy gates:** Remover `continue-on-error: true` do deploy.yml — smoke test deve bloquear
- [ ] **Preview environments:** Deploy de preview para PRs (Cloudflare Workers preview)
- [ ] **Rollback documentado:** Playbook de rollback para deploy com falha

### 2.5 — Persistência & Escalabilidade

**Prioridade:** P2 | **Esforço:** Grande | **Impacto:** Médio

Sessões são in-memory — restart = perda total.

- [ ] **Fase 1:** File-based session store (JSON no disco, zero dependências extras)
- [ ] **Fase 2:** Redis para sessões distribuídas (quando escalar para múltiplas instâncias)
- [ ] **Fase 3:** PostgreSQL/SQLite para histórico de chat persistente
- [ ] Chat export (JSON, Markdown) — feature do portal web

---

## Frente 3: Documentação & Developer Experience

**Objetivo:** Onboarding de contribuidores < 15 min, documentação completa.

### 3.1 — Documentação Técnica

**Prioridade:** P1 | **Esforço:** Médio | **Impacto:** Alto

- [ ] **ARCHITECTURE.md** (raiz): Diagrama de arquitetura (squads ↔ web portal ↔ chatbot ↔ Anthropic API)
- [ ] **DEPLOYMENT.md**: Checklist de produção, scaling guide, disaster recovery
- [ ] **SECURITY.md**: Threat model, security assumptions, vulnerability disclosure
- [ ] **TESTING.md**: Como rodar testes, targets de cobertura, convenções
- [ ] **API.md** (web/): Referência completa com error codes, exemplos curl, rate limits

### 3.2 — Melhoria do README & Catalog

**Prioridade:** P1 | **Esforço:** Pequeno | **Impacto:** Médio

- [ ] Sincronizar badges de maturidade (🟢/🟡/🔴) com registry real (hoje README mente)
- [ ] Adicionar contagem de agentes/tasks por squad na tabela
- [ ] Adicionar seção "Roadmap" público com status das frentes
- [ ] Atualizar FAQ com perguntas sobre o web portal e chatbot

### 3.3 — Templates de Contribuição

**Prioridade:** P2 | **Esforço:** Pequeno | **Impacto:** Médio

- [ ] Issue templates: bug report, feature request, new squad proposal
- [ ] PR template com checklist (score, validation, changelog updated)
- [ ] CONTRIBUTING.md para o web portal (hoje só existe para squads)

---

## Frente 4: Expansão do Ecossistema

**Objetivo:** Novos squads estratégicos, marketplace, comunidade.

### 4.1 — Squads Estratégicos Faltantes

**Prioridade:** P2 | **Esforço:** Grande | **Impacto:** Alto

Domínios com alta demanda sem squad:

| Squad Proposto | Domínio | Justificativa |
|----------------|---------|---------------|
| **copywriting** | Marketing | Referenciado no README como exemplo, mas não existe |
| **data-engineering** | Dados | ETL, pipelines, qualidade de dados — sem cobertura |
| **security** | Segurança | Pentesting, OWASP, threat modeling — sem cobertura |
| **product** | Produto | PRD, discovery, roadmap — sem cobertura |
| **backend** | Engenharia | APIs, databases, microservices — complementa apex (frontend) |

### 4.2 — Squad Marketplace (Longo Prazo)

**Prioridade:** P3 | **Esforço:** Muito Grande | **Impacto:** Alto

- [ ] Registry API: endpoint para buscar/filtrar squads programaticamente
- [ ] Install CLI: `aiox install squad-name` com resolução de dependências
- [ ] Versioning: semantic versioning + lock file para squads instalados
- [ ] Rating system: comunidade avalia squads

---

## Cronograma de Execução

### Sprint 1 (Semana 1-2): Fundação

| # | Iniciativa | Frente | Prioridade |
|---|-----------|--------|------------|
| 1 | Pipeline de promoção + promover 3 squads score 10 | F1.1 | P0 |
| 2 | Completar DevOps squad (workflows, templates) | F1.2 | P0 |
| 3 | Limpeza do registry (keywords, descriptions) | F1.3 | P1 |
| 4 | Setup Vitest + 20 testes unitários (web/server) | F2.1 | P0 |
| 5 | Input validation com Zod nos endpoints | F2.2 | P0 |

### Sprint 2 (Semana 3-4): Hardening

| # | Iniciativa | Frente | Prioridade |
|---|-----------|--------|------------|
| 6 | Completar SEO squad (tasks, templates, score → 9.0) | F1.2 | P0 |
| 7 | Session TTL + rate limiting por sessão | F2.2 | P0 |
| 8 | ESLint + Prettier + TypeScript strict no CI | F2.4 | P1 |
| 9 | 20 testes de integração + cobertura no CI | F2.1 | P0 |
| 10 | ARCHITECTURE.md + DEPLOYMENT.md | F3.1 | P1 |

### Sprint 3 (Semana 5-6): Consolidação

| # | Iniciativa | Frente | Prioridade |
|---|-----------|--------|------------|
| 11 | Extrair pacote compartilhado @aiox/chat-core | F2.3 | P1 |
| 12 | Validação automatizada de qualidade no CI | F1.4 | P1 |
| 13 | Promover squads restantes (5 squads → OPERATIONAL) | F1.1 | P0 |
| 14 | Deploy gates + preview environments | F2.4 | P1 |
| 15 | SECURITY.md + TESTING.md + templates de contribuição | F3.1/3.3 | P1 |

### Sprint 4+ (Semana 7+): Expansão

| # | Iniciativa | Frente | Prioridade |
|---|-----------|--------|------------|
| 16 | File-based session persistence | F2.5 | P2 |
| 17 | Novos squads: copywriting, backend, security | F4.1 | P2 |
| 18 | Registry API / Marketplace foundation | F4.2 | P3 |

---

## Métricas de Sucesso

| KPI | Baseline (Hoje) | Meta Sprint 2 | Meta Sprint 4 |
|-----|-----------------|---------------|---------------|
| Squads OPERATIONAL | 0 | 3 | 8+ |
| Testes automatizados | 0 | 40 | 100+ |
| Cobertura de testes | 0% | 60% | 80%+ |
| Squads validated | 0 | 5 | 10 |
| CI checks passando | parcial | completo | completo |
| Tempo de onboarding | indefinido | < 30 min | < 15 min |
| Session persistence | in-memory | in-memory + TTL | file-based |
| Bugs em produção | desconhecido | monitorado | < 1/semana |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Promoção de squads sem testes reais de produção | Alta | Médio | Definir "validated" como testado em ao menos 1 caso real |
| Monorepo com npm workspaces quebrando builds | Média | Alto | Testar setup em branch isolada antes de mergear |
| Refactor de código duplicado introduzindo regressões | Média | Alto | Escrever testes ANTES do refactor |
| Community PRs não seguindo padrões | Alta | Baixo | Issue/PR templates + CI gates bloqueantes |
| Anthropic API rate limits em produção | Média | Alto | Circuit breaker + retry com backoff |

---

## Próximos Passos Imediatos

1. **Agora:** Iniciar Sprint 1 — promoção de squads + setup de testes
2. **Esta semana:** Completar DevOps squad e limpar registry
3. **Próxima semana:** Zod validation + session hardening

---

*Este documento é vivo. Atualizar a cada sprint com progresso e ajustes.*
