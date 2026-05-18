# 📊 Google Analytics 4 Quick Setup (30 minutos)

## ✅ Status: Pronto para Integração

Você precisa de:
1. Conta Google (ou criar)
2. Adicionar 1 variable de ambiente
3. Instalar pacote `web-vitals`

---

## 🚀 Setup Rápido

### 1️⃣ Criar Propriedade GA4 (5 min)

1. Acesse: https://analytics.google.com/
2. Clique **Start measuring** ou **Create property**
3. Preena formulário:
   - **Property name**: `AIOX Chat`
   - **Timezone**: Seu fuso
   - **Currency**: USD
4. Aceite termos
5. Clique **Create**

### 2️⃣ Criar Data Stream (3 min)

1. Na tela de setup → **Create data stream**
2. Selecione **Web**
3. Preencha:
   - **Website URL**: `https://seu-dominio.com`
   - **Stream name**: `aiox-chat-web`
4. Clique **Create stream**
5. **Copie o Measurement ID** (formato: `G-XXXXXXXXXX`)

### 3️⃣ Adicionar ao Seu Projeto (5 min)

No arquivo `web/.env.production`:
```
VITE_GA_ID=G-XXXXXXXXXX
```

### 4️⃣ Instalar web-vitals (2 min)

```bash
npm install web-vitals
npm run build
```

### 5️⃣ Verificar Funcionamento (5 min)

1. Faça build: `npm run build`
2. Inicie servidor: `npm start`
3. Abra browser: `http://localhost:8787`
4. Em GA4 → **Real-time** → Verifique "1 user"

---

## 📈 Métricas Capturadas

✅ **Core Web Vitals** (automático):
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

✅ **User Behavior**:
- Page views
- Session duration
- Bounce rate

✅ **Custom Events** (opcional):
- Message sent
- Feature used
- Errors

---

## 🎯 Criar Dashboard

1. Em GA4 → **Dashboards**
2. Clique **Create dashboard**
3. Adicione widgets:
   - Real-time users
   - Core Web Vitals
   - Top pages
   - Errors (se configurado)
4. Salve como "Production Dashboard"

---

## 🚨 Alertas (Opcional)

Para ser notificado de problemas:

1. GA4 → **Linked products** → **BigQuery** (setup)
2. Ou configure manual em **Settings** → **Custom alerts**
3. Exemplo:
   - "Alert se erro rate > 1%"
   - "Alert se CLS > 0.1"

---

**Resultado:** Dashboard mostrando performance dos usuários em tempo real

---

**Próxima etapa:** Team Training e Incident Response Simulation
