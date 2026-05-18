# Production Launch - Week 1 Task List

## Siga Esta Ordem

### 1. Setup Sentry (45 min)
- Status: Not Started
- Time: 09:00 - 09:45
- Owner: [Your Name]

Tasks:
- [ ] Criar conta em https://sentry.io/signup/
- [ ] Criar organização "AIOX Squad"
- [ ] Criar projeto "aiox-chat-server" (Node.js)
- [ ] Criar projeto "aiox-chat-web" (React)
- [ ] Obter DSN do servidor
- [ ] Obter DSN do cliente
- [ ] Adicionar SENTRY_DSN em web/.env
- [ ] Adicionar SENTRY_DSN em web/.env.production
- [ ] Adicionar VITE_SENTRY_DSN em web/.env.production
- [ ] Executar: npm run build
- [ ] Executar: npm start
- [ ] Testar com: curl http://localhost:8787/api/health
- [ ] Verificar Sentry Dashboard

---

### 2. Setup UptimeRobot (20 min)
- Status: Not Started
- Time: 09:45 - 10:05
- Owner: [Your Name]

Tasks:
- [ ] Criar conta em https://uptimerobot.com/
- [ ] Criar Monitor HTTP(s)
- [ ] Adicionar URL: https://seu-dominio.com/api/health
- [ ] Definir intervalo: 5 minutos
- [ ] Definir timeout: 10 segundos
- [ ] Ir em Settings → Integrations → Slack
- [ ] Autorizar com Slack
- [ ] Selecionar canal #alerts
- [ ] Testar notificação
- [ ] Criar Status Page
- [ ] Compartilhar link com team

---

### 3. Setup Google Analytics 4 (40 min)
- Status: Not Started
- Time: 10:05 - 10:45
- Owner: [Your Name]

Tasks:
- [ ] Acessar https://analytics.google.com/
- [ ] Criar propriedade: "AIOX Chat"
- [ ] Criar data stream (Web)
- [ ] Adicionar website URL: https://seu-dominio.com
- [ ] Copiar Measurement ID (G-XXXXXXXX)
- [ ] Adicionar VITE_GA_ID em web/.env.production
- [ ] Executar: npm run build
- [ ] Executar: npm start
- [ ] Abrir http://localhost:8787 no browser
- [ ] Verificar Real-time Users em GA4
- [ ] Criar dashboard com Core Web Vitals
- [ ] Salvar dashboard

---

### 4. Documentação & Atualização (20 min)
- Status: Not Started
- Time: 10:45 - 11:05
- Owner: [Your Name]

Tasks:
- [ ] Atualizar PRODUCTION_LAUNCH_STATUS.md
- [ ] Marcar todas boxes como [x]
- [ ] Atualizar status para 🟢
- [ ] Criar INCIDENT_CONTACTS.md
- [ ] Adicionar On-call Lead
- [ ] Adicionar Backup
- [ ] Adicionar Engineering Manager

---

### 5. Team Training (90 min)
- Status: Not Started
- Time: 11:05 - 12:35
- Owner: [Your Name]

Tasks:
- [ ] Convocar time (Slack message)
- [ ] Apresentar Overview Sentry (5 min)
- [ ] Demo Sentry Dashboard (10 min)
- [ ] Apresentar Overview UptimeRobot (5 min)
- [ ] Demo Status Page (5 min)
- [ ] Apresentar Overview GA4 (5 min)
- [ ] Demo Dashboards GA4 (10 min)
- [ ] Explicar fluxo de incident response (15 min)
- [ ] Q&A (20 min)
- [ ] Documentar feedback
- [ ] Enviar resumo para team

---

### 6. Testes Finais (40 min)
- Status: Not Started
- Time: 12:35 - 13:15
- Owner: [Your Name]

Tasks:
- [ ] Teste endpoint /api/health
- [ ] Teste endpoint /api/auth/status
- [ ] Teste endpoint /api/squads
- [ ] Verificar respostas JSON
- [ ] Testar UptimeRobot monitor
- [ ] Testar GA4 real-time
- [ ] Marcar checklist final
- [ ] Documento de sucesso assinado

---

## ✅ Success Criteria

- [ ] Todas as tasks completadas
- [ ] Todos os endpoints respondendo
- [ ] Sentry capturando erros
- [ ] UptimeRobot notificando
- [ ] GA4 coletando dados
- [ ] Team treinado
- [ ] On-call rotation definido
- [ ] Documentação atualizada

---

## 📊 Progress Tracking

| Bloco | Status | % Completo |
|-------|--------|-----------|
| Sentry | 🔴 Not Started | 0% |
| UptimeRobot | 🔴 Not Started | 0% |
| GA4 | 🔴 Not Started | 0% |
| Documentação | 🔴 Not Started | 0% |
| Team Training | 🔴 Not Started | 0% |
| Testes | 🔴 Not Started | 0% |
| **TOTAL** | 🔴 Not Started | **0%** |

---

## 📞 Support Links

- Sentry Docs: https://docs.sentry.io
- UptimeRobot Help: https://uptimerobot.com/help
- GA4 Setup: https://support.google.com/analytics
- Project Docs: C:\aiox-squads-FelippePestana\

---

**Created:** 27-03-2026
**Target Completion:** 27-03-2026 13:00
**Owner:** [Your Name]
