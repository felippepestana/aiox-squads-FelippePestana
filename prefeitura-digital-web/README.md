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
- **Orçamento (ativo):** **execução orçamentária (RREO)** no SICONFI, **painel da LRF** (Despesa com
  Pessoal / RGF) com semáforo frente aos limites (54% da RCL) e **despesa por função** (Saúde/Educação,
  Anexo 02) — execução, não o mínimo constitucional.
- **Transparência (ativo):** **diagnóstico de conformidade** gerado por IA a partir de um checklist
  interativo (LAI/LC131/SIAFIC/PNTP/EBT/WCAG) + plano de reconstrução.
- **RH (ativo):** geração de **atos de pessoal** (nomeação, exoneração, designação de FG, gratificação,
  licença, férias, aposentadoria RPPS, PAD) com fundamento legal e **checagem automática da LRF** (RGF
  ao vivo) para atos que aumentam a folha.
- **Persistência e login (opcional):** com Supabase configurado, é possível **entrar** (magic link por
  e-mail; gov.br OIDC no roadmap) e **salvar artefatos** em *Meus artefatos*, isolados por usuário (RLS).
- **Integrações públicas (sem credencial):** PNCP, SICONFI (RREO do ente, ex.: Porto Velho 1100205) e IBGE.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS
- IA: API Anthropic (modelo padrão `claude-sonnet-4-6`, configurável). Sem chave, o app opera em
  **modo rascunho** (devolve o template para preenchimento).
- Persistência/auth: Supabase (`@supabase/ssr`). **Opcional** — sem as variáveis, o app roda sem login
  nem salvamento, e a geração de documentos continua funcionando.

## Rodando localmente

```bash
cd prefeitura-digital-web
cp .env.example .env.local      # opcional: ANTHROPIC_API_KEY (IA) e SUPABASE_* (persistência/login)
npm install
npm run dev                     # http://localhost:3000
```

### Habilitando persistência e login (opcional)

1. Crie um projeto no Supabase e defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `.env.local`.
2. Aplique a migração `supabase/migrations/0001_artefatos.sql` (tabela `artefatos` + RLS por usuário).
3. O login usa **magic link por e-mail** (Supabase Auth). O provedor **gov.br (OIDC)** entra como
   provider externo no roadmap.

## Rotas de API

| Método | Rota | Função | Fonte |
|--------|------|--------|-------|
| POST | `/api/etp` | Gera ETP/TR/PB | Anthropic |
| POST | `/api/diario-oficial` | Gera ato oficial por tipo/caderno | Anthropic |
| GET | `/api/precos?q=` | Pesquisa de preços | PNCP |
| GET | `/api/orcamento?ente=&exercicio=&periodo=` | Execução orçamentária (RREO) | SICONFI |
| GET | `/api/fiscal/pessoal?ente=&exercicio=&periodo=` | Despesa com Pessoal (LRF) | RGF/SICONFI |
| GET | `/api/fiscal/funcoes?ente=&exercicio=&periodo=` | Despesa por função (Saúde/Educação) | RREO Anexo 02/SICONFI |
| POST | `/api/rh` | Gera ato de pessoal + checagem LRF | Anthropic + SICONFI |
| POST | `/api/transparencia` | Diagnóstico de conformidade + plano | Anthropic |
| GET/POST | `/api/artefatos` | Lista/salva artefatos do usuário | Supabase |
| DELETE | `/api/artefatos/[id]` | Exclui artefato do usuário | Supabase |

## Limites e próximos passos

- **Minutas de apoio:** os documentos gerados não substituem parecer jurídico (PGM) nem decisão da
  autoridade competente.
- **Feito nas últimas iterações:** editor do Diário Oficial, dashboard de orçamento (RREO), **persistência
  e login** (Supabase + RLS, magic link), **painel da LRF** (RGF) e **RH interativo** com checagem fiscal.
- **Roadmap:** login **gov.br (OIDC)**, mínimos de saúde/educação (RREO anexos 08/12), integração viva ao
  **SEI** (mod-wssei), **Diário Oficial
  eletrônico** (assinatura ICP-Brasil + biblioteca pesquisável), reconstrução do **Portal da
  Transparência** (dados abertos/CKAN, dashboards), módulos de RH (eSocial/SIPREV) e cruzamento
  SIOPS/SIOPE com alertas de mínimos e LRF.
