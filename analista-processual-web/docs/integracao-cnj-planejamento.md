# Planejamento de Integração com Fontes Oficiais do CNJ

> **Análise aprofundada de APIs, MNIs e MCPs do Poder Judiciário brasileiro e cruzamento com as funcionalidades do `analista-processual-web`.**

| Campo | Valor |
|-------|-------|
| **Documento** | Plano de integração CNJ × Analista Processual |
| **Versão** | 1.0 |
| **Data** | 2026-06-08 |
| **Status** | Proposta para validação |
| **Metodologia** | Deep Research (OSINT + síntese de evidências) + Design Research Plan |
| **Escopo** | DATAJUD, MNI, PDPJ/Jus.br, DJEN, Domicílio Judicial Eletrônico, BNP, MCPs |

---

## 1. Sumário executivo

O `analista-processual-web` hoje opera de forma **fechada**: o usuário faz upload manual de PDFs/imagens e o pipeline multiagente extrai dados, calcula prazos e mapeia riscos. Todo o valor depende de o usuário **trazer o documento**.

A integração com as fontes oficiais do CNJ muda o modelo: a aplicação passa a **buscar o processo sozinha** a partir de um número CNJ, CPF ou CNPJ, e a **monitorar** publicações e intimações em tempo quase real. Isso transforma a ferramenta de um "analisador de upload" em um **assistente processual ativo**.

Existem **seis classes de recursos oficiais** relevantes, com graus muito distintos de acessibilidade:

| Recurso | Acesso | Dados | Tempo real | Esforço de integração |
|---------|--------|-------|------------|----------------------|
| **DATAJUD (API Pública)** | Imediato (API Key pública) | Metadados (sem peças) | Lag oficial ~30 dias | **Baixo** |
| **DJEN / Comunica API** | Cadastro Corporativo CNJ | Publicações/intimações | Diário (D+0/D+1) | **Médio** |
| **MNI 2.2.2** | Credencial por tribunal | Metadados + **peças** | Tempo real | **Alto** (SOAP, por tribunal) |
| **PDPJ / Jus.br** | OAuth2 (Keycloak), institucional | Consulta unificada + peticionamento | Tempo real | **Alto** (acesso restrito) |
| **Domicílio Judicial Eletrônico** | e-CNPJ + credencial API | Citações/intimações pessoais | Tempo real | **Médio-Alto** |
| **MCPs de terceiros** | Varia (chave própria) | Agregam as fontes acima | Varia | **Baixo** (consumo) |

**Recomendação de sequência:** começar por **DATAJUD** (ganho imediato, sem fricção de credenciamento), seguir por **DJEN/Comunica** (monitoramento de prazos — o recurso de maior valor para o produto) e, por fim, avaliar **MNI/PDPJ** (acesso a peças completas, com maior barreira regulatória).

---

## 2. Catálogo de recursos do CNJ

Cada recurso abaixo segue a mesma anatomia: **finalidade → critérios de funcionamento → meios técnicos → dados e tempo real → limitações**.

### 2.1. DATAJUD — Base Nacional de Dados do Poder Judiciário

**Base normativa:** Resolução CNJ nº 331/2020; Portaria CNJ nº 119/2021; Portaria nº 160/2020.

**Finalidade.** Centralizar os **metadados** de processos de todos os segmentos da Justiça brasileira (estadual, federal, trabalhista, eleitoral, militar) em uma base única e consultável. Mais de 80 milhões de processos em ~90 tribunais.

**Critérios de funcionamento.**
- API REST pública, gratuita, sobre **Elasticsearch**.
- Autenticação por **API Key pública** (a mesma chave para todos; pode ser rotacionada pelo CNJ) — obtida na [datajud-wiki.cnj.jus.br](https://datajud-wiki.cnj.jus.br/).
- Header: `Authorization: APIKey <chave>`.
- Rate limit por perfil de acesso; erros típicos `429` (rate limit) e `400` (DSL inválida).

**Meios técnicos.**
- Endpoint por tribunal: `https://api-publica.datajud.cnj.jus.br/api_publica_{sigla}/_search` (ex.: `api_publica_tjsp`, `api_publica_trf1`, `api_publica_stj`).
- Método `POST`, corpo em **Elasticsearch Query DSL** (JSON).
- Resposta no formato Elasticsearch (`hits.hits[]`); cada documento traz `numeroProcesso`, `classe`, `assuntos`, `movimentos` (códigos das Tabelas Processuais Unificadas — TPU), `orgaoJulgador`, datas.
- Paginação: `from`/`size` (limite 10.000); acima disso, `search_after`.

```bash
curl -X POST "https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search" \
  -H "Authorization: APIKey <chave>" \
  -H "Content-Type: application/json" \
  -d '{"query":{"match":{"numeroProcesso":"10012345620268260100"}}}'
```

**Dados e tempo real.** Apenas **metadados** — **não inclui peças/documentos**. Atualização com **lag oficial de 30 dias** (na prática varia por tribunal). Adequado para **enriquecimento cadastral** e **linha do tempo de movimentações**, **não** para alertas de prazo em tempo real.

**Limitações.** Sem peças; latência alta; exige domínio de Elasticsearch DSL; cobertura e atualização heterogêneas entre tribunais.

---

### 2.2. DJEN — Diário de Justiça Eletrônico Nacional (API Comunica/PCP)

**Base normativa:** Resolução CNJ nº 234/2016; Resolução nº 455/2022 (e alterações 569/2024, 624/2025).

**Finalidade.** Instrumento **oficial** de publicação dos atos judiciais, substituindo os diários eletrônicos locais. É o **meio de intimação dos advogados**. Para o produto, é a fonte para **detectar publicações e disparar a contagem de prazos**.

**Critérios de funcionamento.**
- API REST com operações de **autenticação, envio e consulta** de comunicações e emissão de **certidões de recebimento (PDF)**.
- Autenticação por **usuário/senha** do sistema **Corporativo do CNJ**, solicitada por um Administrador Regional do tribunal.
- Documentação Swagger: [app.swaggerhub.com/apis-docs/cnj/pcp/1.0.0](https://app.swaggerhub.com/apis-docs/cnj/pcp/1.0.0).

**Meios técnicos.**
- Produção: `https://comunicaapi.pje.jus.br/api/v1`
- Homologação: `https://hcomunicaapi.cnj.jus.br/api/v1`
- Consulta pública de publicações também via portal [comunica.pje.jus.br](https://comunica.pje.jus.br/).
- Recurso de maior interesse para nós: **consulta de comunicações** por OAB/advogado, parte ou número de processo.

**Dados e tempo real.** Publicações disponibilizadas **a partir das 00h do dia indicado** como data de disponibilização. Atualização **diária** (D+0/D+1 em relação à expedição no PJe). É o recurso mais próximo de "tempo real" com **valor jurídico** para prazos.

**Limitações.** Envio de comunicações é por sistema de origem (não nos interessa); na 1ª versão não há envio em lote; consulta exige credencial Corporativo (fricção de credenciamento institucional).

---

### 2.3. MNI — Modelo Nacional de Interoperabilidade (v2.2.2)

**Base normativa:** Termo de Cooperação Técnica nº 58/2009 (STF, CNJ, STJ, CJF, TST, CSJT, AGU, PGR).

**Finalidade.** Padrão técnico para **intercâmbio de informações processuais** entre sistemas, inclusive **conteúdo de peças e documentos**. É o canal clássico de integração com o PJe e congêneres.

**Critérios de funcionamento.**
- **Web Services SOAP** descritos por **WSDL**, com esquemas **XSD** (`tipos-2.2.2.xsd`, `intercomunicacao-2.2.2`).
- Cada tribunal publica seu **próprio endpoint WSDL** e credencia usuários (`idConsultante`/`senhaConsultante`).
- Operações principais:
  1. `consultarProcesso` — metadados + documentos do processo (por nº CNJ);
  2. `consultarAvisosPendentes` — intimações sem ciência;
  3. `consultarTeorComunicacao` — conteúdo da comunicação (e chave de documentos cifrados);
  4. `entregarManifestacaoProcessual` — peticionamento;
  5. `consultarAlteracao` / `confirmarRecebimento`.

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <consultarProcesso xmlns="http://www.cnj.jus.br/servicos-mni">
      <idConsultante>USUARIO</idConsultante>
      <senhaConsultante>SENHA</senhaConsultante>
      <numeroProcesso>0000000-00.0000.0.00.0000</numeroProcesso>
      <incluirDocumentos>true</incluirDocumentos>
    </consultarProcesso>
  </soap:Body>
</soap:Envelope>
```

**Dados e tempo real.** Acesso **em tempo real** e a **peças completas** (petição inicial, contestação, decisões), respeitando o nível de sigilo. É o caminho para **OCR/extração sobre o documento oficial** em vez de upload manual.

**Limitações.** **SOAP por tribunal** (não há endpoint único): cada TJ/TRF/TRT exige credenciamento e tem variações de implementação. Geralmente requer que o consultante seja **habilitado/representante** para ver peças sigilosas. Alto custo de manutenção (N integrações). O CNJ disponibiliza uma **biblioteca cliente do MNI** que reduz parte do esforço.

---

### 2.4. PDPJ-Br / Jus.br — Plataforma Digital e Portal de Serviços

**Base normativa:** Resolução CNJ nº 335/2020 (PDPJ); Resolução nº 455/2022 (Portal de Serviços); critérios técnicos (Ato 3582); Res. 574/2024 (interface única).

**Finalidade.** **Consolidar e unificar** o processo eletrônico nacional. O **Jus.br** é o portal único que permite, num só lugar: consulta unificada de processos conectados, **peticionamento** inicial/intercorrente, **citações/intimações**, acesso ao DJEN e tramitação de ofícios/cartas.

**Critérios de funcionamento.**
- Arquitetura de **microsserviços** atrás de um **API Gateway**.
- Autenticação **OAuth2 / Single Sign-On com Keycloak** (RFC 6749).
- APIs **REST padronizadas** com **OpenAPI 3.0** e serviço de **discovery**.
- Serviços estruturantes de dados: Tabelas Processuais Unificadas, Cabeçalho Processual, Pessoas, Endereços, Organizacional.
- Documentação: [docs.pdpj.jus.br](https://docs.pdpj.jus.br/).

**Dados e tempo real.** Consulta **unificada e em tempo real** dos sistemas conectados; peticionamento e comunicações. É o **futuro consolidado** do acesso (substitui gradualmente N integrações MNI por uma fachada única).

**Limitações.** Acesso às APIs é **institucional/restrito** (contato `integracao@cnj.jus.br`), voltado a tribunais e parceiros credenciados. Adoção ainda **gradual** entre tribunais. Não é um "API key e use" como o DATAJUD.

---

### 2.5. Domicílio Judicial Eletrônico (DJE)

**Base normativa:** Resolução CNJ nº 455/2022 (art. 15) e nº 569/2024; Programa Justiça 4.0.

**Finalidade.** Endereço eletrônico oficial de cada **pessoa jurídica/física** para receber **citações e intimações pessoais** (que exigem vista pessoal), substituindo cartas e oficiais de justiça.

**Critérios de funcionamento.**
- Plataforma: `https://domicilio-eletronico.pdpj.jus.br` (apenas cadastrados).
- Acesso via **e-CNPJ** (PJ) / **e-CPF ou gov.br nível prata/ouro** (PF).
- **Integração por API** disponível, com **novo modelo de autenticação obrigatório a partir de 31/03/2026** (geração de nova credencial; Manual de Integração em `docs.pdpj.jus.br`).
- Regra crítica de prazo: ciência se aperfeiçoa ao acessar o conteúdo; citação não lida em 3 dias úteis gera registro automático (art. 246 CPC).

**Dados e tempo real.** Citações/intimações **pessoais** em tempo real — relevante para clientes que sejam **partes** (PJ). Complementa o DJEN (que cobre intimações de advogados).

**Limitações.** Foco em quem é **destinatário** (parte/empresa), não consulta de terceiros. Exige certificado digital e credenciamento. Migração obrigatória de autenticação em 03/2026 — qualquer integração precisa já nascer no novo modelo.

---

### 2.6. BNP — Banco Nacional de Precedentes (e jurisprudência)

**Finalidade.** Base de **precedentes qualificados** (súmulas, IRDR, repercussão geral, teses, temas repetitivos) — insumo direto para o agente de pesquisa jurisprudencial.

**Critérios e meios.** Exposto principalmente **via PDPJ/DataLake** e consumido hoje por MCPs de terceiros (ver 2.7) e pelos portais de jurisprudência dos tribunais superiores (STF/STJ/TST). Para o produto, no curto prazo o caminho realista é **WebSearch dirigida** às fontes já catalogadas em `data/fontes-juridicas.yaml` e/ou MCP agregador.

---

### 2.7. MCPs (Model Context Protocol) de terceiros

Servidores MCP que **agregam** as fontes oficiais e as expõem como ferramentas para LLMs — atalho de integração quando não se quer construir cada conector do zero.

| MCP | O que entrega | Acesso | Observação |
|-----|---------------|--------|------------|
| **mcp-brasil** (open source) | `datajud` (7 tools), `jurisprudencia` STF/STJ/TST (6 tools) + 60 APIs públicas | `DATAJUD_API_KEY` (gratuita) | Python/`uvx`; ótimo para metadados + jurisprudência |
| **TecJustiça MCP Lite** | 27 tools `pdpj_*`: processos por CNJ/CPF/CNPJ, **peças**, timeline, partes, **precedentes BNP**, via DataLake PDPJ/DataJud/PJe | Chave `mcp_...` (sob contato) | HTTP stateless; acesso a **peças em tempo real** sem montar MNI por tribunal |
| **PJe MCP / DJEN MCP** (diversos) | Consulta PJe (cert. A1/A3), padronização DJEN | Varia | Mais especializados |

**Implicação estratégica.** Um MCP como o **TecJustiça Lite** pode entregar, num único conector, o que exigiria dezenas de integrações MNI — útil para um **MVP de "buscar processo por número"** sem credenciamento tribunal a tribunal. Em contrapartida, cria **dependência de terceiro** e tem modelo de acesso sob convite.

---

## 3. Cruzamento com as funcionalidades da solução

### 3.1. Estado atual da solução (linha de base)

Pipeline multiagente (`src/lib/agents/`) com persistência Prisma:

| Componente atual | Papel | Fonte de dados hoje |
|------------------|-------|---------------------|
| `navigator` | Indexa documentos, extrai nº processo/tribunal/partes | **Upload manual** |
| `extractor` | Partes, cronologia, pedidos, valores, requisitos | **Upload manual** |
| `calculator` | Prazos (CPC, dias úteis) | Datas do **documento enviado** |
| `risk-mapper` | Riscos, score, recomendações | Dados extraídos |
| `chief` | Orquestra + resumo executivo | Agrega o acima |
| `document-extraction` | OCR (imagens/PDF escaneado) | Arquivo do usuário |
| Modelos Prisma | `Analysis`, `Document`, `Deadline`, `LibraryItem`, `AnalysisEvent` | Banco local |

**Lacuna central:** nada entra no sistema sem o usuário fazer upload. Não há **descoberta**, **enriquecimento** nem **monitoramento** automáticos.

### 3.2. Matriz recurso × funcionalidade

| Funcionalidade da solução | Recurso CNJ que habilita | Ganho | Tempo real? |
|---------------------------|--------------------------|-------|-------------|
| **Buscar processo por nº CNJ** (sem upload) | DATAJUD (metadados) → MNI/PDPJ/MCP (peças) | Elimina upload manual | DATAJUD: não · MNI/PDPJ: sim |
| **Enriquecer `Analysis`** (classe, assuntos, órgão, partes) | DATAJUD; Cabeçalho Processual (PDPJ) | Preenche `processClass`, `court`, partes | Parcial |
| **Linha do tempo real de movimentações** | DATAJUD (`movimentos` + TPU) | Substitui cronologia inferida por dados oficiais | Lag ~30d |
| **Disparo automático de prazos** | **DJEN/Comunica** (publicações) + DJE (intimações pessoais) | Calcula prazo a partir da **publicação oficial** | Sim (diário) |
| **Monitoramento contínuo** (novas publicações por OAB/parte) | DJEN/Comunica; Domicílio Judicial | Alertas, vira "assistente ativo" | Sim |
| **Extração/OCR sobre peça oficial** | MNI `consultarProcesso` (documentos); MCP Lite | OCR sobre fonte oficial, não upload | Sim |
| **Pesquisa de precedentes** (`risk-mapper`, biblioteca) | BNP via PDPJ; jurisprudência via mcp-brasil | Fundamentação com precedentes qualificados | Sim |
| **Peticionamento** (futuro) | MNI `entregarManifestacao`; PDPJ/Jus.br | Fecha o ciclo (analisar → peticionar) | Sim |
| **Biblioteca (`LibraryItem`)** | DATAJUD + jurisprudência MCP | Popula automaticamente | — |

### 3.3. Impacto no modelo de dados (Prisma)

Mudanças sugeridas (incrementais, retrocompatíveis):

- **`Analysis`**: adicionar `source` (`UPLOAD` | `DATAJUD` | `MNI` | `PDPJ` | `MCP`), `tribunalSigla`, `lastSyncedAt`.
- **Novo `ProcessMovement`**: `analysisId`, `code` (TPU), `description`, `date`, `raw` — linha do tempo oficial.
- **Novo `Publication`**: `analysisId?`, `oab?`, `tribunal`, `disponibilizacaoDate`, `content`, `source` (`DJEN`|`DJE`), `prazoTriggered` — base do monitoramento de prazos.
- **Novo `IntegrationCredential`** (reuso do padrão `ApiKey`): credenciais por provedor/tribunal, **cifradas** (já há `encryptedKey`).
- **`Deadline`**: adicionar `sourcePublicationId?` para rastrear a publicação que originou o prazo.

### 3.4. Onde plugar no código

- **Nova camada `src/lib/integrations/`** espelhando o padrão de `llm-gateway.ts`: um **`court-data-gateway`** com provedores plugáveis (`datajud`, `djen`, `mni`, `pdpj`, `mcp`) selecionados por configuração — mesma filosofia de degradação graciosa já usada para LLM e fila.
- **Rota nova** `POST /api/analyses/from-process-number` → dispara busca + cria `Analysis` + enfileira pipeline (reusa BullMQ).
- **Worker de sincronização** (`src/worker.ts`): job periódico de **polling do DJEN** por OAB/parte cadastrada → cria `Publication` → recalcula `Deadline`.
- **Reuso do fallback heurístico**: quando a fonte oficial estiver indisponível, manter o fluxo de upload + heurística já implementado.

---

## 4. Roadmap de implementação

Faseamento por **razão risco/valor** (não por tempo): cada fase entrega valor isolado e desbloqueia a seguinte.

### Fase 0 — Fundação de integração (pré-requisito) ✅ implementada
- `src/lib/integrations/court-data-gateway.ts` (interface `CourtDataProvider` + seleção por configuração, espelhando o LLM gateway).
- `src/lib/integrations/tribunais.ts` — parsing da numeração única (Res. 65/2008) e resolução do alias DATAJUD para **todos os segmentos** (cobertura ampla).
- Migração Prisma: `Analysis.source`/`tribunalSigla`/`lastSyncedAt` + modelo `ProcessMovement`.
- **Status:** entregue e testado (`npm run test:tribunais`, offline).

### Fase 1 — DATAJUD (enriquecimento) ✅ implementada
- Provedor `datajud` (`src/lib/integrations/datajud.ts`, REST + ES DSL); busca por nº CNJ; mapeia `movimentos` (TPU) → `ProcessMovement`.
- Rota `POST /api/analyses/from-process-number` (cria `Analysis` enriquecida sem upload; metadados viram documento sintético consumido pelo pipeline).
- **Validado ao vivo** contra a API Pública do DATAJUD (TJSP), com `COMPLETED` ponta a ponta via pipeline + fila.
- **Limite conhecido:** lag de atualização (~30d) e ausência de peças/partes (suprimidas por privacidade) — endereçado nas Fases 3/4.

### Fase 2 — DJEN/Comunica (monitoramento de prazos) ⭐ maior valor de produto
- Provedor `djen` (consulta por OAB/parte/processo); modelo `Publication`.
- Worker de polling diário → cria `Publication` → `calculator` recalcula `Deadline` a partir da **data de disponibilização oficial**.
- Notificações (e-mail/in-app) de novas publicações e prazos.
- **Valor:** transforma o produto em assistente ativo; **Risco:** médio (credencial Corporativo CNJ).

### Fase 3 — Peças completas (MNI e/ou MCP)
- **Opção A (rápida):** consumir **TecJustiça MCP Lite** para trazer peças/timeline/precedentes por número — MVP sem credenciar tribunal a tribunal (dependência de terceiro).
- **Opção B (soberana):** provedor `mni` SOAP usando a **biblioteca cliente do MNI**, começando por 1–2 tribunais piloto (ex.: TJSP, TRF da região-alvo).
- Pipeline de OCR/extração passa a rodar sobre a **peça oficial**.
- **Valor:** análise completa sem upload; **Risco:** alto (SOAP por tribunal / dependência de MCP).

### Fase 4 — PDPJ/Jus.br + Domicílio Judicial (consolidação)
- Provedor `pdpj` (OAuth2/Keycloak) quando o acesso institucional for viável — substitui gradualmente N integrações MNI por fachada única.
- Domicílio Judicial para clientes-parte (PJ) com o **novo modelo de credencial (obrigatório desde 31/03/2026)**.
- Avaliar **peticionamento** (fecha o ciclo analisar → minutar → peticionar, conectando ao squad `redator-juridico`).
- **Valor:** ciclo completo; **Risco:** alto (acesso restrito, regulatório).

### Resumo visual

```text
Fase 0 ── Fundação (gateway + schema)
   │
Fase 1 ── DATAJUD ......... enriquecimento + busca por nº (baixo risco) ⭐
   │
Fase 2 ── DJEN/Comunica ... prazos automáticos + monitoramento (alto valor) ⭐
   │
Fase 3 ── MNI / MCP Lite .. peças completas + OCR oficial
   │
Fase 4 ── PDPJ / DJE ...... consulta unificada + peticionamento
```

---

## 5. Arquitetura proposta (alto nível)

```text
┌────────────────────────────────────────────────────────────┐
│                    analista-processual-web                    │
│                                                              │
│  UI (Next.js)                                                 │
│   └─ "Analisar por nº de processo"  ──┐                       │
│                                       ▼                       │
│  /api/analyses/from-process-number   ──► court-data-gateway   │
│                                            │ (seleção por env)│
│         ┌──────────────┬─────────────┬─────┴──────┬─────────┐ │
│         ▼              ▼             ▼            ▼         ▼ │
│      datajud         djen          mni         pdpj       mcp │
│     (REST/ES)     (REST/Comunica) (SOAP)    (OAuth2)   (HTTP) │
│         │              │             │            │         │ │
│         └──────────────┴──────┬──────┴────────────┴─────────┘ │
│                               ▼                               │
│              Normalização → Analysis / ProcessMovement /      │
│                              Publication / Document            │
│                               ▼                               │
│      Pipeline multiagente (navigator→extractor→calculator→    │
│              risk-mapper→chief)  +  fila BullMQ + worker       │
│                               ▼                               │
│        Postgres (Prisma)  +  notificações de prazo            │
└────────────────────────────────────────────────────────────┘
```

**Princípios reaproveitados do código atual:**
- **Degradação graciosa** (como no LLM gateway e na fila): se a fonte oficial faltar, cai para upload + heurística.
- **Seleção por configuração** (`*_API_KEY`/`*_ENABLED`), sem acoplar a UI a um provedor.
- **Processamento assíncrono** via BullMQ/worker já existente para sync periódico.

---

## 6. Segurança, conformidade e operação

| Tema | Diretriz |
|------|----------|
| **LGPD** | Metadados processuais podem conter dados pessoais e segredo de justiça. Tratar `Publication`/`Document` com base legal, minimização e retenção definida. DATAJUD já filtra por sigilo; respeitar. |
| **Sigilo processual** | MNI só retorna peças conforme nível de sigilo e habilitação do consultante. Nunca contornar; registrar em `AuditLog` (modelo já existe). |
| **Credenciais** | Cifrar todas (`IntegrationCredential`/`ApiKey.encryptedKey`). Nunca commitar. Domicílio Judicial exige **novo modelo de autenticação desde 31/03/2026**. |
| **Rate limiting** | DATAJUD retorna `429`; implementar backoff exponencial (padrão já usado em git/redes). Cachear metadados (lag de 30d torna cache barato e seguro). |
| **Custo de manutenção** | MNI = N integrações SOAP. Preferir PDPJ/MCP quando possível para reduzir superfície. |
| **Auditoria** | Toda consulta a fonte oficial → `AuditLog` (`action`, `resourceType`, `resourceId`, `ipAddress`). |
| **Resiliência** | Tratar fontes oficiais como **instáveis**; toda integração assíncrona, idempotente e com fallback. |

---

## 7. Decisões em aberto (para validação)

1. **MVP de peças: MCP Lite (rápido, terceiro) vs MNI próprio (soberano, lento)?** Recomendação: MCP Lite para validar valor, MNI para produção soberana.
2. **Quais tribunais piloto** para MNI/Domicílio? (sugestão: maior volume da base de usuários — ex.: TJSP + 1 TRF/TRT).
3. **Modelo de credenciamento DJEN**: usar credencial institucional única ou credencial por escritório/usuário (impacta multi-tenant).
4. **Escopo de peticionamento** na Fase 4 (integra com o squad `redator-juridico`)?
5. **Política de retenção** de peças baixadas (LGPD) e de cache de metadados.

---

## 8. Próximos passos imediatos

- [ ] Validar este plano e priorização (Fases 1 e 2 como foco).
- [ ] Solicitar **API Key do DATAJUD** (gratuita, imediata) e credencial **Corporativo CNJ** para DJEN (institucional).
- [ ] Implementar **Fase 0 + Fase 1** (gateway + provedor DATAJUD + rota `from-process-number` + `ProcessMovement`).
- [ ] PoC de consulta DJEN por OAB para desenhar o monitoramento de prazos.
- [ ] Avaliar contato com TecJustiça MCP Lite para a Fase 3.

---

## Apêndice A — Fontes consultadas

- DATAJUD — Wiki oficial: `datajud-wiki.cnj.jus.br`; Portal CNJ `/sistemas/datajud`; Res. CNJ 331/2020; Portaria 119/2021.
- DJEN/Comunica — Portal CNJ "Comunicações Processuais"; Swagger `app.swaggerhub.com/apis-docs/cnj/pcp/1.0.0`; Res. 455/2022 (569/2024, 624/2025).
- MNI — Portal CNJ "Modelo Nacional de Interoperabilidade"; especificação `interoperabilidade_2.2.2.pdf`; TCT 58/2009.
- PDPJ/Jus.br — `docs.pdpj.jus.br`; Res. 335/2020; Ato 3582; Res. 455/2022 e 574/2024; `jus.br`.
- Domicílio Judicial Eletrônico — FAQ CNJ Justiça 4.0; `domicilio-eletronico.pdpj.jus.br`; alerta de migração 31/03/2026.
- MCPs — `github.com/mcp-brasil/mcp-brasil`; `github.com/marcosmarf27/tecjustica` (MCP Lite); newsletter TecJustiça.

## Apêndice B — Metodologia

Pesquisa conduzida com a abordagem do squad **`deep-research`** (investigação OSINT + síntese de evidências, com atenção a fontes primárias normativas do CNJ) e estruturação no formato do **Design Research Plan**. O cruzamento com a solução partiu da leitura direta do código (`src/lib/agents/`, `prisma/schema.prisma`, rotas de API) e do squad **`analista-processual`**, garantindo que cada recurso externo fosse mapeado a uma funcionalidade concreta e a uma mudança de dados verificável.
