# Roteiro de Teste — Property Data Web v1

> Guia prático para avaliar todas as funcionalidades da plataforma antes do lançamento.

---

## Pré-requisitos

### 1. Criar projeto Supabase (gratuito)
1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
3. Em **Project Settings → Database**, copie:
   - `Connection string (URI)` → `DATABASE_URL`
4. Em **Storage**, crie um bucket chamado `documents` (público)

### 2. Configurar ambiente local
```bash
cd property-data-web
cp .env.example .env
```

Preencha o `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:xxxxx@db.xxxxx.supabase.co:5432/postgres
ANTHROPIC_API_KEY=sk-ant-...
API_KEY_ENCRYPTION_SECRET=$(openssl rand -hex 32)
```

### 3. Iniciar o servidor
```bash
npm install
npx prisma db push    # cria as tabelas no Supabase
npm run dev            # http://localhost:3000
```

---

## Teste 1: Landing Page e Navegação

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 1.1 | Abra http://localhost:3000 | Landing page com hero, 6 cards de features, botão "Começar Agora" |
| 1.2 | Clique "Começar Agora" | Redireciona para /register |
| 1.3 | Acesse /dashboard diretamente | Redireciona para /login (middleware auth) |
| 1.4 | Acesse /api/health | JSON: `{ status: "ok", service: "property-data-web" }` |

---

## Teste 2: Autenticação

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 2.1 | Em /register, crie uma conta (nome, email, senha) | Toast "Conta criada com sucesso" |
| 2.2 | Em /login, entre com as credenciais | Redireciona para /dashboard |
| 2.3 | Verifique o header | Mostra email do usuário + botão "Sair" |
| 2.4 | Clique "Sair" | Volta para /login |

---

## Teste 3: Cadastrar Imóvel

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 3.1 | No dashboard, clique "Novo Imóvel" | Abre /properties/new com wizard |
| 3.2 | **Passo 1 — Endereço:** Preencha CEP `69005-040` | Autocompleta: rua, bairro, cidade (Manaus), UF (AM) |
| 3.3 | Complete: número `123`, tipo `Residencial`, área `250` | Campos preenchidos |
| 3.4 | Clique "Próximo" | Avança para passo 2 |
| 3.5 | **Passo 2 — Documentos:** Arraste um PDF de teste | Arquivo aparece na lista com ícone |
| 3.6 | Arraste uma foto JPG | Aparece com ícone de imagem |
| 3.7 | Clique "Próximo" | Avança para passo 3 |
| 3.8 | **Passo 3 — Análise:** Selecione "Levantamento Completo" | UC-PD-ALL selecionado |
| 3.9 | Clique "Iniciar Análise" | Cria imóvel + análise, redireciona para página de análise |

---

## Teste 4: Pipeline de Análise em Tempo Real

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 4.1 | Na página de análise, clique "Iniciar Análise" | Pipeline inicia, status muda para "running" |
| 4.2 | Observe o painel de progresso | Agentes executam sequencialmente com barras de progresso |
| 4.3 | Primeiro: `leitor-documental` (Tier 0) | Status → running → done (verde) |
| 4.4 | Depois: 5 agentes Tier 1 em sequência | Cada um mostra model badge (ex: "opus-4-6") |
| 4.5 | Depois: 2 agentes Tier 2 | analista-ambiental + analista-condominial |
| 4.6 | Por último: `relator-imobiliario` (Síntese) | Gera relatório final |
| 4.7 | Status final: `done` | Abas de resultado aparecem |

**Tempo estimado:** 3-8 minutos (depende do modelo e volume de dados)

---

## Teste 5: Resultados em 7 Abas

| Aba | Conteúdo Esperado |
|-----|-------------------|
| **Registral** | Dados de matrícula, certidões, cadeia dominial |
| **Legislação** | Tabela de legislação federal/estadual/municipal |
| **Urbanístico** | Zona, índices urbanísticos, usos permitidos |
| **Visual** | Descrição do padrão construtivo, entorno, geolocalização |
| **Avaliação** | Valor estimado em R$, método ABNT, gráfico de comparáveis |
| **Ambiental** | Restrições ambientais (APP, APA) |
| **Condominial** | Dados de condomínio (se aplicável) |

---

## Teste 6: Exportar Relatório

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 6.1 | Na página de análise, vá para seção "Exportar" | ExportWizard aparece |
| 6.2 | Selecione modo "RELATORIO", formato "md" | Opções selecionadas |
| 6.3 | Clique "Gerar Relatório" | Relatório Markdown gerado |
| 6.4 | Teste modo "LAUDO_ABNT" | Laudo no formato ABNT com seções específicas |
| 6.5 | Verifique /reports | Relatórios exportados aparecem na biblioteca |

---

## Teste 7: Gerenciar Chaves de API

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 7.1 | Vá em /settings/api-keys | Página de gerenciamento de chaves |
| 7.2 | Selecione "Anthropic", cole uma chave, clique "Salvar" | Chave aparece mascarada (sk-ant-...xxxx) |
| 7.3 | Adicione chave OpenAI | Segunda chave listada |
| 7.4 | Execute nova análise | Model badge mostra modelo do provedor com chave do usuário |
| 7.5 | Delete uma chave | Removida da lista |

---

## Teste 8: Dashboard e Navegação

| Passo | Ação | Resultado Esperado |
|-------|------|--------------------|
| 8.1 | Volte ao /dashboard | Cards de estatísticas atualizados |
| 8.2 | Card do imóvel mostra contadores | Documentos: 2, Análises: 1 |
| 8.3 | Clique no card do imóvel | Abre /properties/[id] com detalhes |
| 8.4 | Na página do imóvel, veja documentos | Lista de documentos uploadados |
| 8.5 | Clique "Nova Análise" | Inicia novo ciclo de análise |

---

## Checklist Final

- [ ] Landing page renderiza com gradiente e 6 cards
- [ ] Registro + login funcionam com Supabase
- [ ] Middleware protege rotas autenticadas
- [ ] CEP autocompleta via ViaCEP
- [ ] Upload de PDF e imagens funciona
- [ ] Pipeline SSE mostra 10 agentes em tempo real
- [ ] 7 abas de resultado populadas
- [ ] Exportação gera Markdown estruturado
- [ ] Chaves de API criptografadas e gerenciáveis
- [ ] Health check retorna status OK
- [ ] Dashboard mostra estatísticas corretas

---

## Problemas Conhecidos (V1)

| Item | Status | Nota |
|------|--------|------|
| MCP design tools | Stub | Capa HTML gerada, PDF via MCP pendente |
| Mapa interativo | Pendente V2 | Leaflet não integrado |
| Gráfico de comparáveis | Parcial | Recharts renderiza quando dados disponíveis |
| Compartilhamento por link | Pendente V2 | Relatórios são privados |
| Redis/BullMQ | Pendente V2 | Pipeline roda síncrono no request |

---

*Property Data Web v1.0 — Roteiro de Teste*
