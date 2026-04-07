# ⏰ UptimeRobot Quick Start (5 minutos)

## ✅ Status: Pronto para Usar

**O endpoint de health check já existe:**
```
GET https://sua-domain.com/api/health
```

Resposta esperada:
```json
{"ok":true,"service":"aiox-squads-web"}
```

---

## 🚀 Configuração Rápida

### 1️⃣ Criar Conta (2 minutos)

- Acesse: https://uptimerobot.com/
- Clique **Sign Up**
- Use email ou Google
- Verifique email (se necessário)

### 2️⃣ Criar Monitor (2 minutos)

**Clique em: Add Monitor**

| Campo | Valor |
|-------|-------|
| Monitor Type | **HTTP(s)** |
| URL | `https://seu-dominio.com/api/health` |
| Friendly Name | AIOX Chat - Health Check |
| Check Interval | **5 minutes** |
| Timeout | **10 seconds** |
| HTTP Method | GET |

**Salve o monitor**

### 3️⃣ Configurar Notificações no Slack (1 minuto)

1. Em UptimeRobot → **Settings** → **Integrations**
2. Clique em **Slack**
3. **Authorize** com sua workspace
4. Selecione canal: `#alerts` (crie se não existir)
5. Pronto! Será notificado quando cair

### 4️⃣ Criar Status Page Público (opcional)

1. No monitor → **Status Page**
2. Compartilhe com: `https://aiox-squad.uptimerobot.com`
3. Mostre ao time: "Assim vocês veem o status em tempo real"

---

## 📊 Esperado Após Setup

✅ Monitor ativo checando a cada 5 minutos
✅ Notificação no Slack quando cair
✅ Dashboard mostrando uptime %
✅ Histórico de incidents

---

## 🧪 Teste (Opcional)

1. Desligue seu servidor: `npm stop`
2. Aguarde 5-10 minutos
3. Veja alert no Slack
4. Religue servidor: `npm start`
5. Alert de "Recovered" deve chegar

---

**Próxima etapa:** Google Analytics 4 para medir performance dos usuários
