# Dossiê de Planejamento — Solução para Prefeituras (Prefeitura Digital)

> Documento de estratégia e arquitetura para uma solução de gestão municipal voltada ao poder
> executivo, usando a **Prefeitura de Porto Velho/RO** como caso de referência. Consolida a pesquisa
> realizada e fundamenta o squad `prefeitura-digital` e a evolução para um app web companheiro.
>
> **Data:** 2026-06-08 · **Status:** Planejamento (Fase 1) · As referências normativas e de APIs têm
> caráter de subsídio; confirmar a vigência junto às fontes oficiais.

---

## 1. Contexto e objetivo

Prefeituras precisam fazer mais com menos, sob forte exigência legal e de controle. A proposta é uma
solução **altamente intuitiva** que automatiza funções por secretaria, com foco em dois pilares —
(A) processo administrativo (padrão SEI) e (B) contratações (ETP, TR, Projeto Básico) — e cobertura
ampla das demais áreas, **organizada em torno do orçamento**, já que todo ato administrativo depende de
provisão e execução orçamentária.

A solução materializa-se primeiro como um **squad AIOX** (`prefeitura-digital`) que entrega inteligência,
elaboração de documentos e verificação de conformidade; e, na Fase 2, como um **app web** que realiza as
integrações vivas e hospeda os portais (Diário Oficial e Transparência).

## 2. Caso de referência — Porto Velho/RO

- **Site oficial:** https://www.portovelho.ro.gov.br/ · **IBGE:** 1100205 · **População:** ~517 mil.
- **Estrutura (LC nº 1.000/2025 + Decreto nº 21.133/2025, vigência jul/2025):** 12 secretarias
  (Semtran, Semdec, Semtel, Semad, Semias, Semagric, Semusa, Semed, Seinfra, Semec, Secom, SMCL) +
  PGM (procuradoria), CGM (controladoria) e **IPAM** (RPPS, ~27 mil segurados). Detalhes em
  `data/secretarias-porto-velho.yaml`.
- **Maturidade digital:** já utiliza **SEI** (`sei.portovelho.ro.gov.br`); Portal da Transparência com
  nota CGU **~9,4/10** e selo **Diamante** (PNTP); e-SIC ativo.
- **Orçamento 2026:** LOA = **Lei nº 3.351/2025**, total **~R$ 2,82 bilhões**, em execução parcial
  (acompanhamento via SICONFI e Portal da Transparência).

## 3. Os seis módulos da solução

### Módulo A — Processo administrativo (SEI)
Tomar o SEI como mecanismo de referência (uso direto ou via API). Integração técnica pelo módulo REST
`mod-wssei` e pelo `mod-sei-pen`/barramento **Tramita GOV.br** (GitHub `pengovbr`). O squad mapeia o
trâmite, monta o checklist de instrução e redige despachos; o app (Fase 2) integra-se ao SEI.

### Módulo B — Contratações (Lei 14.133/2021)
- **ETP** com os 13 elementos do art. 18 (5 sempre obrigatórios: I, IV, VI, VIII, XIII).
- **Termo de Referência** (art. 6º, XXIII) e **Projeto Básico** (art. 6º, XXV) seguindo os
  **modelos da AGU** (atualizados 2025/26) e a referência de automação do **Ger@AGU**.
- **Pesquisa de preços** combinando fontes (art. 23; IN SEGES 65/2021), com **PNCP** e Painel de Preços.
- Orientações de estrutura no **Portal TCU "Licitações e Contratos"**.

### Módulo Orçamento (eixo transversal)
- Instrumentos: **PPA, LDO, LOA** (CF 165-169; Lei 4.320/1964; LRF LC 101/2000 — anexos de metas e riscos).
- Execução: estágios da despesa (empenho → liquidação → pagamento); créditos adicionais
  (suplementar/especial/extraordinário).
- Mínimos e limites: **saúde 15%** (LC 141/2012; SIOPS), **educação 25% + FUNDEB** (art. 212; SIOPE),
  **pessoal LRF** (Executivo 54% RCL; prudencial 51,3%).
- Dados: **SICONFI** (`apidatalake.tesouro.gov.br/docs/siconfi/`, ente 1100205), **SIOPS**, **SIOPE**.

### Módulo Diário Oficial
- Fundamentos: publicidade (CF 37), LAI (12.527/2011), Governo Digital (14.129/2021), **assinatura
  ICP-Brasil** (Lei 14.063/2020; MP 2.200-2/2001), publicações exigidas pela Lei 14.133.
- **Benchmark: AROM** — Diário Oficial dos Municípios de RO na plataforma **SIGPub**
  (`diariomunicipal.com.br/arom`): PDF assinado, autonomia de publicação por município, biblioteca de
  consulta pública e verificação de autenticidade.
- O squad elabora atos por **tipo × caderno** a partir de informações mínimas
  (ver `data/tipos-atos-do.md`) e prepara metadados para a biblioteca; o app (Fase 2) publica e indexa.

### Módulo Recursos Humanos (Semad)
- Processos: ingresso (concurso/nomeação/posse), estágio probatório (3 anos), folha, ponto, férias,
  licenças, progressão, CC/FG, **PAD** (Manual CGU), aposentadoria via **RPPS/IPAM** (EC 103/2019).
- Obrigações: **eSocial** (entes públicos — conformidade prevista para 30/09/2026), **SIPREV**, envio ao
  TCE-RO; limites da LRF; assinatura eletrônica (Lei 14.063).
- Automação: geração de atos de pessoal, cálculo de prazos, conferência de folha, triagem de processos
  e PAD, atendimento ao servidor (chatbot), gestão documental com OCR.

### Módulo Transparência
- Normas: LAI, LC 131/2009 (tempo real), LRF art. 48/48-A, **Decreto 10.540/2020 (SIAFIC)**, Governo
  Digital, **LGPD**.
- Avaliação: **EBT** e **PNTP** (selos Prata/Ouro/Diamante); acessibilidade **WCAG 2.1 AA / ABNT NBR
  17225:2025**.
- **Cases:** Niterói/RJ, Sobral/CE, São Paulo/SP (API/CKAN, dashboards, dados abertos).
- **Porto Velho:** já bem avaliado; lacunas a endereçar — API formalmente documentada, dashboards
  interativos, conformidade WCAG, linguagem cidadã e busca transversal.

## 4. Mapa de fontes, APIs e serviços

Catálogo operacional em `data/fontes-gov.yaml`. Resumo:

| Serviço | Órgão | API | Uso |
|---------|-------|-----|-----|
| SEI / mod-wssei / Tramita GOV.br | MGI/PEN | parcial | Processo administrativo |
| PNCP | MGI | aberta | Contratações, preços, publicação |
| Modelos AGU / Ger@AGU | AGU | docs/ferramenta | TR, PB, editais |
| SICONFI | STN | aberta | RREO/RGF/DCA/MSC (ente 1100205) |
| SIOPS / SIOPE | MS / FNDE | aberta | Mínimos saúde/educação |
| Portal Transparência (federal) | CGU | token | Convênios, sanções |
| IBGE Localidades | IBGE | aberta | Dados do município |
| TCE-RO / SIGAP | TCE-RO | parcial | Prestação de contas, dados abertos |
| SIGPub / AROM | AROM | — | Benchmark de Diário Oficial |
| EBT / PNTP | CGU | — | Avaliação de transparência |
| Conecta gov.br | MGI | restrito a estados | Roadmap (CPF/CNPJ) |

## 5. Arquitetura da solução (squad)

13 agentes em 5 camadas, com o eixo orçamentário transversal. Detalhes em `../ARCHITECTURE.md` e
`../README.md`. Resumo do fluxo de uma contratação:

```
necessidade → pesquisa de preços → ETP → dotação (controlador) → TR/PB → conformidade → publicação → consolidação
```

## 6. Roadmap por fases

- **Fase 1 — Squad `prefeitura-digital` (esta entrega):** agentes de elaboração, orientação e
  conformidade; templates de ETP/TR/PB, PPA/LDO/LOA, atos do DO e atos de pessoal; checklists; dados de
  referência; dossiê.
- **Fase 2 — App web `prefeitura-digital-web`** (espelhando `analista-processual-web/`, Next.js +
  Supabase + multi-LLM): integração viva ao SEI (mod-wssei), PNCP, SICONFI/SIOPS/SIOPE e eSocial;
  **Diário Oficial eletrônico** (publicação assinada ICP-Brasil + biblioteca pesquisável, inspirado no
  SIGPub/AROM); **reconstrução do Portal da Transparência** (API OpenAPI, dados abertos/CKAN,
  dashboards, WCAG AA, linguagem cidadã); login **gov.br**; **Conecta gov.br** quando liberado a
  municípios.
- **Fase 3 — Escala/multi-município:** parametrização da estrutura por município; onboarding de novas
  prefeituras; integração com TCEs estaduais.

## 7. Riscos, premissas e LGPD

- **Disponibilidade de APIs a municípios:** parte do Conecta gov.br ainda é restrita a estados —
  mitigar com fontes abertas (PNCP, SICONFI) e integração estadual.
- **Validade jurídica:** os artefatos são **minutas de apoio**; a decisão e o parecer jurídico (PGM)
  permanecem com a autoridade competente.
- **LGPD:** minimizar dados pessoais em RH e na transparência ativa; base legal e ausência de dados
  sensíveis desnecessários (CPF completo, conta bancária).
- **Mudanças normativas/estruturais:** reformas administrativas alteram a estrutura — manter
  `data/secretarias-porto-velho.yaml` e `data/normas-legais.yaml` atualizados.
- **Dependência de dados locais:** valores de orçamento/execução devem ser confirmados em SICONFI e no
  Portal da Transparência do município.

## 8. Fontes (seleção)

Legislação (Planalto): Lei 4.320/1964; LC 101/2000; LC 131/2009; LC 141/2012; Lei 14.133/2021;
Lei 12.527/2011; Lei 14.129/2021; Lei 14.063/2020; Lei 13.709/2018 (LGPD); Decreto 10.540/2020.
Órgãos e plataformas: pncp.gov.br; apidatalake.tesouro.gov.br/docs/siconfi/; gov.br/saude (SIOPS);
gov.br/fnde (SIOPE); licitacoesecontratos.tcu.gov.br; gov.br/agu (modelos) e cgu.agu.gov.br/edital
(Ger@AGU); tcero.tc.br e transparencia.tce.ro.gov.br; diariomunicipal.com.br/arom (AROM/SIGPub);
gov.br/cgu (EBT/PNTP); softwarepublico.gov.br/social/sei e github.com/pengovbr (SEI/PEN);
portovelho.ro.gov.br, sei.portovelho.ro.gov.br e transparencia.portovelho.ro.gov.br.
