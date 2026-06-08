# Prefeitura Digital — Web (Fase 2 / MVP)

App web companheiro do squad [`prefeitura-digital`](../squads/prefeitura-digital/). Materializa a
Fase 2 descrita no [dossiê de planejamento](../squads/prefeitura-digital/docs/DOSSIE-PLANEJAMENTO.md):
uma interface intuitiva para a gestão do executivo municipal, com geração assistida de documentos e
integração às APIs públicas do governo.

## Escopo deste MVP

- **Contratações (ativo):** geração de **ETP**, **Termo de Referência** e **Projeto Básico** via IA
  (Claude), alinhada à Lei 14.133/2021, com **pesquisa de preços no PNCP** e checagem orçamentária.
- **Diário Oficial (ativo):** **editor de atos** por tipo/caderno (lei, decreto, portaria, extrato,
  aviso, atos de pessoal) com geração assistida e metadados para a biblioteca.
- **Orçamento (ativo):** consulta à **execução orçamentária (RREO)** no SICONFI por ente/exercício/bimestre.
- **Transparência (ativo):** checklist de conformidade (LAI/LC131/SIAFIC/PNTP/EBT/WCAG).
- **RH (vitrine):** página com a estrutura e o roadmap.
- **Integrações públicas (sem credencial):** PNCP, SICONFI (RREO do ente, ex.: Porto Velho 1100205) e IBGE.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS
- IA: API Anthropic (modelo padrão `claude-sonnet-4-6`, configurável). Sem chave, o app opera em
  **modo rascunho** (devolve o template para preenchimento).

## Rodando localmente

```bash
cd prefeitura-digital-web
cp .env.example .env.local      # opcional: defina ANTHROPIC_API_KEY para geração assistida
npm install
npm run dev                     # http://localhost:3000
```

## Rotas de API

| Método | Rota | Função | Fonte |
|--------|------|--------|-------|
| POST | `/api/etp` | Gera ETP/TR/PB | Anthropic |
| POST | `/api/diario-oficial` | Gera ato oficial por tipo/caderno | Anthropic |
| GET | `/api/precos?q=` | Pesquisa de preços | PNCP |
| GET | `/api/orcamento?ente=&exercicio=&periodo=` | Execução orçamentária (RREO) | SICONFI |

## Limites e próximos passos

- **Minutas de apoio:** os documentos gerados não substituem parecer jurídico (PGM) nem decisão da
  autoridade competente.
- **Roadmap:** persistência (Supabase), autenticação **gov.br**, integração viva ao **SEI** (mod-wssei),
  **Diário Oficial eletrônico** (assinatura ICP-Brasil + biblioteca), reconstrução do **Portal da
  Transparência** (dados abertos/CKAN, dashboards), módulos de RH (eSocial/SIPREV) e dashboards de
  orçamento (SICONFI/SIOPS/SIOPE) com alertas de mínimos e LRF.
