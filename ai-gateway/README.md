# AI Gateway

Exemplo mínimo de uso do [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
com o [AI SDK](https://ai-sdk.dev). Ao passar um `model` como string no formato
`creator/model` (ex.: `openai/gpt-5.5`), o AI SDK roteia a requisição
automaticamente pelo AI Gateway.

## Pré-requisitos

- Node.js 20.6+ (este exemplo usa a flag `--env-file`)
- Conta na Vercel com AI Gateway habilitado
- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`

## Setup

```bash
cd ai-gateway

# 1. Instalar dependências
npm install

# 2. Vincular o projeto à Vercel (apenas na primeira vez)
vercel link

# 3. Baixar as variáveis de ambiente da Vercel
#    Isso traz o VERCEL_OIDC_TOKEN — não é necessária chave de API do AI Gateway.
vercel env pull .env.local

# 4. Executar
npm start
# equivalente a: node --env-file=.env.local index.mjs
```

> O `VERCEL_OIDC_TOKEN` baixado por `vercel env pull` tem validade curta.
> Rode `vercel env pull .env.local` novamente quando ele expirar.

## Autenticação sem OIDC

Fora do ambiente Vercel você pode usar uma chave de API do AI Gateway em vez do
token OIDC. Defina `AI_GATEWAY_API_KEY` no `.env.local` (veja
`.env.local.example`).

## Arquivos

- `index.mjs` — script de exemplo (`streamText`)
- `.env.local.example` — modelo das variáveis de ambiente
- `.env.local` — **não versionado**; gerado por `vercel env pull`
