# Deploy Vercel — Guia Rápido (3 minutos)

> Deploy do modo demo do property-data-web para testar no iPhone.

## Pré-requisitos (no seu computador)

- Node.js 20+
- Conta Vercel (gratuita) — https://vercel.com/signup
- Git instalado

## Passo 1: Clonar o repositório

```bash
git clone https://github.com/felippepestana/aiox-squads-FelippePestana.git
cd aiox-squads-FelippePestana
git checkout claude/property-data-skill-mIW9q
cd property-data-web
```

## Passo 2: Instalar Vercel CLI (se ainda não tiver)

```bash
npm install -g vercel
```

## Passo 3: Login no Vercel

```bash
vercel login
```

Escolha o método (GitHub/Google/Email) e autorize no navegador.

## Passo 4: Deploy

```bash
vercel --prod
```

Responda o wizard:
- **Set up and deploy?** → Y
- **Which scope?** → Seu usuário
- **Link to existing project?** → N
- **Project name?** → property-data-web (ou deixe default)
- **Directory?** → ./ (pressione Enter)
- **Modify settings?** → N

Aguarde 1-2 minutos. O Vercel vai:
1. Fazer upload do código
2. Executar `npm install` + `prisma generate` + `next build`
3. Deploy para edge network global

## Passo 5: Testar no iPhone

Ao final, você recebe uma URL como:
```
https://property-data-web-xxxx.vercel.app
```

Abra essa URL no **Safari do iPhone**. O modo demo já vem ativado via `vercel.json`.

## Rotas para testar no iPhone

| URL | O que testar |
|-----|-------------|
| `/` | Landing page responsiva |
| `/dashboard` | Dashboard com imóvel demo (Rua Ramos Ferreira, Manaus) |
| `/properties/demo-prop-001` | Detalhes + botão "Iniciar Vistoria" |
| `/properties/demo-prop-001/vistoria` | **📱 Câmera traseira do iPhone** + checklist |
| `/properties/demo-prop-001/analysis/demo-analysis-001` | Pipeline + 7 abas de resultados |
| `/reports` | Biblioteca de relatórios |
| `/settings/api-keys` | Gerenciar chaves (mockado no demo) |

## Funcionalidades Demo (sem Supabase)

✅ Landing page + navegação  
✅ Dashboard com imóvel pré-populado  
✅ Formulário de novo imóvel (salva em memória)  
✅ **Câmera traseira mobile** (`capture="environment"`)  
✅ Checklist de 18 itens (10 fotos + 8 perguntas qualificadoras)  
✅ Pipeline simulado de 10 agentes (SSE animado)  
✅ 7 abas de resultados com dados reais de Manaus/AM  
✅ Exportação Markdown  

❌ Autenticação (bypassada no demo)  
❌ Persistência entre sessões (volta ao estado inicial em cada deploy)  
❌ LLMs reais (dados mockados pré-prontos)  

## Após validar no iPhone

Para converter em produção real:
1. Criar projeto Supabase
2. Configurar env vars reais no Vercel dashboard
3. Desativar `NEXT_PUBLIC_DEMO_MODE` (ou remover)
4. Adicionar chave Anthropic para LLMs reais
5. `vercel --prod` novamente

---

## Troubleshooting

### Build falha com erro de Prisma
```bash
# Executar localmente para testar:
npx prisma generate
npx next build
```

### Deploy bem-sucedido mas página retorna 404
- Verifique se está acessando `/` e não `/index`
- Aguarde 30s para o edge cache propagar

### Câmera não abre no iPhone
- Certifique-se de usar **Safari** (não Chrome para iOS)
- Deve ser HTTPS (Vercel já fornece automático)
- Permita acesso à câmera quando solicitado

---

*Property Data Web — Demo Deploy v1.0*
