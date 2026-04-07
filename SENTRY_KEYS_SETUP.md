# 🔑 Como Obter Chaves Sentry e Ativar Error Tracking

## Passo 1: Criar Conta Sentry

1. Acesse https://sentry.io/signup/
2. Crie uma conta com GitHub, Google ou email
3. Verifique seu email (se usar email)

## Passo 2: Criar Organização e Projetos

1. Após login, clique em **"Create Organization"**
2. Nome: `AIOX Squad` (ou seu nome)
3. Crie **2 projetos**:
   - **Projeto 1**: `aiox-chat-server`
     - Platform: Node.js
   - **Projeto 2**: `aiox-chat-web`
     - Platform: React

## Passo 3: Obter DSN Keys

Para cada projeto:

1. Vá para **Settings** → **Client Keys (DSN)**
2. Copie o **DSN** (formato: `https://xxxxx@sentry.io/123456`)

### Exemplo:
```
Server DSN:  https://abc123def456@sentry.io/111111
Client DSN:  https://xyz789uvw000@sentry.io/222222
```

## Passo 4: Configurar no Seu Projeto

### Arquivo: `web/.env` (Desenvolvimento)
```
SENTRY_DSN=https://your-server-key@sentry.io/your-server-project
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0
```

### Arquivo: `web/.env.production` (Produção)
```
SENTRY_DSN=https://your-server-key@sentry.io/your-server-project
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

VITE_SENTRY_DSN=https://your-client-key@sentry.io/your-client-project
VITE_SENTRY_ENVIRONMENT=production
```

## Passo 5: Integrar com Slack (Opcional mas Recomendado)

1. Em Sentry, vá para **Settings** → **Integrations**
2. Procure por **Slack**
3. Clique **Install**
4. Autorize sua workspace do Slack
5. Selecione channel: `#alerts` (crie se não existir)
6. Configure regras de alerta:
   - Event Count: 10+ erros em 5 minutos
   - Notificar em: Slack #alerts

## Passo 6: Testar Integração

Após configurar as chaves e refazer build:

```bash
npm run build
npm start

# Em outro terminal, teste:
curl http://localhost:8787/api/health
```

Se configurado corretamente, você verá logs do Sentry no console:
```
Sentry.init() initialized
```

## Passo 7: Simular Um Erro (Teste)

### No Servidor
Crie um endpoint de teste (depois remova):
```typescript
app.get("/api/test-error", (_req, res) => {
  const error = new Error("Teste de erro Sentry");
  Sentry.captureException(error);
  res.status(500).json({ error: "Erro testado" });
});
```

Teste:
```bash
curl http://localhost:8787/api/test-error
```

Verifique em Sentry Dashboard se o erro apareceu!

## ✅ Configuração Completa

- [x] Conta Sentry criada
- [x] Projetos Node.js e React criados
- [x] DSN keys obtidas
- [x] Variáveis de ambiente configuradas
- [x] Slack integrado
- [x] Erro de teste capturado

---

**Próxima etapa:** UptimeRobot para monitorar se o serviço está online
