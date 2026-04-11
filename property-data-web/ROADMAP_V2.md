# Roadmap V2 — Property Data Web: Otimização e Escala

> Planejamento pós-V1 para otimizar, escalar e expandir a plataforma de levantamento imobiliário.

---

## Visão V2

Transformar o Property Data Web de uma plataforma funcional (V1) em uma **ferramenta profissional escalável** que atende corretores, avaliadores, escritórios de advocacia imobiliária e empresas de due diligence. Foco em: performance, custo, alcance geográfico e qualidade visual dos entregáveis.

---

## Eixo 1: Performance e Escalabilidade

### 1.1 Pipeline Assíncrono (BullMQ + Redis)
**Problema V1:** Pipeline roda síncrono no request HTTP — timeout em análises longas.
**Solução:**
- Instalar Redis + BullMQ
- Criar worker separado que consome jobs de análise
- API route apenas enfileira job e retorna `202 Accepted`
- SSE endpoint lê status do Redis (pub/sub)
- Suporta múltiplas análises simultâneas

**Arquivos:**
- `lib/queue/worker.ts` — BullMQ worker
- `lib/queue/producer.ts` — enfileirar análise
- `app/api/analyses/[id]/stream/route.ts` — refatorar para Redis pub/sub

### 1.2 Cache de Agentes e Prompts
**Problema V1:** Cada análise re-lê os arquivos .md do disco.
**Solução:**
- Cache em memória (Map) com TTL de 5 minutos
- Invalidação via file watcher ou manual
- Reduz I/O e melhora latência

### 1.3 Prisma Connection Pooling
**Problema V1:** Cada API route cria `new PrismaClient()`.
**Solução:**
- Singleton global `lib/prisma.ts`
- Usar `PrismaClient` com `$connect()` no startup
- Supabase connection pooling via PgBouncer

### 1.4 Rate Limiting por Usuário
**Problema V1:** Sem rate limiting.
**Solução:**
- Middleware com upstash/ratelimit ou custom Redis counter
- Limites: 10 análises/hora (free), 100/hora (pro)

---

## Eixo 2: Otimização de Custos LLM

### 2.1 Roteamento Inteligente por Complexidade Real
**Problema V1:** Complexidade fixa por agente.
**Solução:**
- Analisar input do usuário antes de rotear
- Inputs curtos (< 500 tokens) → haiku
- Inputs com documentos/imagens → opus (multimodal)
- Pesquisa textual simples → sonnet
- Registrar custo real por análise no DB

### 2.2 Cache de Resultados (Prompt Caching)
**Solução:**
- Se mesmo endereço + mesmos documentos → reutilizar resultados de agentes que não dependem de dados novos
- Cache de pesquisa registral por matrícula (válido 30 dias)
- Cache de legislação por município (válido 90 dias)

### 2.3 Batch Processing para Tier 1
**Solução:**
- Executar agentes Tier 1 em paralelo (Promise.allSettled)
- Reduz tempo total do pipeline de ~8 min para ~3 min
- Agentes independentes não precisam esperar uns pelos outros

### 2.4 Dashboard de Custos
**Solução:**
- Tabela `usage_logs`: user_id, analysis_id, agent_id, model, tokens_in, tokens_out, cost_usd
- Página /settings/usage com gráficos (Recharts)
- Alertas quando custo mensal ultrapassa threshold

---

## Eixo 3: Expansão de Áreas

### 3.1 Imóveis Rurais (INCRA + CAR)
**Agentes novos/adaptações:**
- `pesquisador-registral`: adicionar pesquisa INCRA (CCIR) e CAR
- `avaliador-imovel`: ativar NBR 14653-3 (rurais)
- `analista-ambiental`: expansão para Reserva Legal, APP em área rural
- Templates: laudo rural com módulo fiscal, produtividade

### 3.2 Imóveis Comerciais e Industriais
**Agentes novos/adaptações:**
- `avaliador-imovel`: método da capitalização da renda (renda mensal/anual)
- `analista-urbanistico`: atividades permitidas por CNAE na zona
- Templates: laudo comercial com análise de retorno sobre investimento

### 3.3 Loteamentos e Condomínios de Lotes
**Agentes novos/adaptações:**
- `analista-condominial`: expansão para loteamentos (Lei 6.766/79)
- Novo template: memorial descritivo de loteamento
- Parcelamento do solo com análise de viabilidade

### 3.4 Multi-Município
**Problema V1:** Legislação municipal pesquisada genericamente.
**Solução:**
- Base de dados de legislação municipal (YAML/JSON) por cidade
- Prioridade: Manaus, São Paulo, Rio, Brasília, Belo Horizonte, Recife
- API de consulta de plano diretor por município
- Zoneamento georreferenciado quando disponível

---

## Eixo 4: Interface e Experiência

### 4.1 Mapa Interativo (Leaflet)
**Implementação:**
- Componente `components/map/PropertyMap.tsx`
- Leaflet + OpenStreetMap tiles
- Pin do imóvel com popup de resumo
- Camadas: zoneamento municipal (quando disponível)
- Geocoding via ViaCEP + Nominatim

### 4.2 Gráfico de Comparáveis Avançado
**Implementação:**
- Recharts ScatterChart com comparáveis plotados (R$/m² × área)
- Linha de tendência com regressão linear
- Tooltip com detalhes de cada comparável
- Filtros por bairro, tipo, período

### 4.3 Compartilhamento por Link Público
**Implementação:**
- Tabela `shared_reports`: analysis_id, token, expires_at, views
- Rota `/share/[token]` — página pública com relatório read-only
- Botão "Compartilhar" gera link com expiração (7/30/90 dias)
- Contador de visualizações

### 4.4 Histórico e Comparação Temporal
**Implementação:**
- Múltiplas análises do mesmo imóvel comparáveis lado a lado
- Timeline de alterações (valor, documentos, legislação)
- Gráfico de evolução de valor ao longo do tempo

### 4.5 Notificações e Alertas
**Implementação:**
- Email via Resend quando análise concluir
- Webhook para integração com sistemas externos
- Alerta de vencimento de certidões (30/60/90 dias)

---

## Eixo 5: Design e Relatórios Visuais

### 5.1 Integração MCP Design (Freepik/Canva)
**Quando MCP server conectado:**
- `generate-design-structured` → capa profissional com foto do imóvel
- `upload-asset-from-url` → inserir fotos na capa
- `list-brand-kits` → consistência visual por escritório
- `get-assets` → ícones temáticos imobiliários
- `export-design` → PDF A4 profissional
- `resize-design` → versão card para social media

### 5.2 PDF Nativo (Puppeteer ou React-PDF)
**Fallback sem MCP:**
- Renderizar HTML da capa via Puppeteer → PNG
- Combinar capa + relatório Markdown → PDF via `md-to-pdf`
- Adicionar dependência: `md-to-pdf` ou `puppeteer`
- Endpoint: POST /api/exports/[id]/pdf → retorna URL do PDF

### 5.3 Templates Visuais por Tipo
- Template residencial (tons verdes, ícone casa)
- Template comercial (tons azuis, ícone prédio)
- Template rural (tons terrosos, ícone fazenda)
- Template laudo ABNT (formal, cabeçalho institucional)

---

## Eixo 6: Segurança e Compliance

### 6.1 Audit Log
- Tabela `audit_logs`: user_id, action, resource, details, ip, timestamp
- Registrar: login, criação/deleção de imóvel, análise, export, alteração de chaves

### 6.2 Row Level Security (RLS)
- Ativar RLS no Supabase para todas as tabelas
- Políticas: usuário só acessa seus próprios dados
- Service role key apenas no backend

### 6.3 LGPD Compliance
- Endpoint para exportar dados do usuário (JSON)
- Endpoint para deletar conta e todos os dados
- Política de privacidade na landing page

---

## Priorização (MoSCoW)

### Must Have (Sprint V2.1)
1. Prisma singleton
2. Pipeline paralelo (Tier 1 agents)
3. Mapa interativo (Leaflet)
4. PDF export nativo (Puppeteer)
5. Dashboard de custos

### Should Have (Sprint V2.2)
6. BullMQ async pipeline
7. Cache de resultados
8. Compartilhamento por link
9. Imóveis rurais (INCRA/CAR)
10. Audit log

### Could Have (Sprint V2.3)
11. MCP design integration
12. Multi-município (base de legislação)
13. Imóveis comerciais
14. Comparação temporal
15. Notificações por email

### Won't Have (V3)
16. App mobile (React Native)
17. API pública para terceiros
18. Marketplace de squads
19. IA conversacional (chat com o relatório)

---

## Métricas de Sucesso V2

| Métrica | V1 (Atual) | Meta V2 |
|---------|-----------|---------|
| Tempo médio de análise | ~8 min | < 3 min |
| Custo médio por análise | ~$2.50 | < $0.80 |
| Tipos de imóvel suportados | Urbano residencial | + Rural + Comercial |
| Municípios com legislação | Genérico | 6 capitais |
| Formato de export | Markdown | PDF + Markdown + Link |
| Análises simultâneas | 1 (síncrono) | 10+ (async) |
| Uptime | Dev local | 99.5% (Docker + health checks) |

---

*Property Data Web — Roadmap V2 | Abril 2026*
