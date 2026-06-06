# Legendários Saúde

Squad de apoio à triagem médica para os eventos **TOP** do programa Legendários — atividades de alta intensidade outdoor (montanhismo, trekking).

## Propósito

Apoiar a equipe Hakuna em:
- Classificação de risco por idade e comorbidades
- Validação de exames médicos (atestados e teste ergométrico)
- Composição de mensagens personalizadas para senderistas

> O squad **apoia** — nunca substitui — o julgamento do profissional de saúde presente.

---

## Agentes

| Agente | Tier | Foco |
|--------|------|------|
| 🏥 `triagem-chefe` | 0 | Orquestração, roteamento, emergências de campo |
| ⚕️ `classificador-risco` | 1 | Classificação de risco por perfil clínico |
| 📋 `avaliador-exames` | 1 | Validação de atestados e teste ergométrico |
| 💬 `compositor-mensagem` | 2 | Mensagens WhatsApp para senderistas |

---

## Protocolo de Triagem

| Faixa etária | Comorbidades | Risco | Exames |
|---|---|---|---|
| ≤ 39 anos | Sem | 🟢 Baixo | Atestado CG (alta intensidade) |
| ≤ 39 anos | Com | 🟡 Moderado | Esteira + Atestado CG |
| 40–59 anos | Sem | 🟡 Moderado | Esteira + Atestado CG |
| 40–59 anos | Com | 🔴 Alto | Esteira + Atestado Cardiologista |
| ≥ 60 anos | Qualquer | 🔴 Alto | Esteira + Atestado Cardiologista |

---

## Ativação

```
@legendarios:triagem-chefe

Preciso classificar o risco de um senderista de 48 anos com HAS.
```

---

## Web App

O sistema operacional completo está em [`legendarios-top/`](../../legendarios-top/) — Next.js 15 com:
- Formulário de triagem (público)
- Portal de upload de exames (tokenizado)
- Painel Hakuna (autenticado)
- App de campo PWA com NFC offline

---

## Validade de Exames

- **Atestados médicos**: máximo 90 dias da emissão
- **Teste ergométrico**: máximo 12 meses da realização
