# Template: Sequência WhatsApp Business — Evento Legendários

**Evento:** {{NOME_EVENTO}}
**Cidade:** {{CIDADE}}
**Plataforma:** WhatsApp Business API
**Total de Mensagens:** 14
**Fases:** 6

---

## FASE 1 — DESCOBERTA

**Trigger:** Usuário envia mensagem para o número Business (ou salva o contato após campanha)

### Mensagem 1 — Boas-vindas e Opt-in
**Delay:** Imediato
**Tipo:** Resposta automática / Template HSM

```
Olá, [Nome]! 🏔️

Bem-vindo ao Movimento Legendários — {{CIDADE}}.

Aqui você vai receber informações sobre o *{{NOME_EVENTO}}*, o evento que já transformou mais de 85.000 homens em 170 cidades.

O que é o TOP? Um retiro de 3 dias que testa e transforma quem você é como homem.

👆 Responda com *SIM* para continuar recebendo informações ou *NÃO* para não receber mais mensagens.

_(LGPD: seus dados são usados apenas para comunicação deste evento. Você pode sair a qualquer momento respondendo SAIR.)_
```

### Mensagem 2 — Prova Social
**Delay:** 24h após SIM
**Tipo:** Template HSM

```
[Nome], sabia que *Neymar pai, Joel Jota e Pablo Marçal* já fizeram o TOP? 💪

3 dias. Sem celular. Com desafios físicos e espirituais que testam quem você realmente é.

Homens que sobem a montanha descem diferentes. Garantido.

Quer saber mais? Responda *QUERO* 👇
```

---

## FASE 2 — INTERESSE

**Trigger:** Resposta positiva na Fase 1

### Mensagem 3 — Detalhes do Evento
**Delay:** Imediato após QUERO

```
Perfeito, [Nome]! 🔥

O *{{NOME_EVENTO}}* vai acontecer em *{{CIDADE}}/{{ESTADO}}* — {{DATA_EVENTO}}.

📌 *O que esperar:*
• 3 dias em natureza (quinta à noite → domingo)
• Trilha e desafios físicos
• Reflexão e transformação espiritual
• Sem celular — foco total
• Preço: a partir de *R$ 990* (1º Lote)

Quer garantir sua vaga no 1º lote antes de todos?
Responda *LOTE1* 👇
```

### Mensagem 4 — Urgência de Lote
**Delay:** 48h sem resposta

```
[Nome], o 1º Lote do {{NOME_EVENTO}} tem apenas *80 vagas* a R$ 990.

Após o 1º Lote, o preço sobe para R$ 1.190. Sem exceção.

Quer garantir o menor preço? É agora. 👇
[LINK_INSCRICAO]
```

---

## FASE 3 — INSCRIÇÃO

**Trigger:** Clique no link de inscrição ou resposta de intenção de compra

### Mensagem 5 — Suporte à Inscrição
**Delay:** Imediato após clique detectado

```
Ótima decisão, [Nome]! 💪

Sua inscrição no *{{NOME_EVENTO}}* está sendo processada.

👆 *Próximo passo:* Conclua o pagamento via PIX no link que você acessou.

💡 PIX é instantâneo — sua vaga será confirmada em segundos.

Dúvidas? Responda esta mensagem — nossa equipe responde em até 2h.
```

### Mensagem 6 — Recuperação de Abandono
**Delay:** 1h sem confirmação de pagamento

```
[Nome], sua vaga ainda não foi confirmada.

PIX é instantâneo — clique no link e finalize em 2 minutos:
[LINK_INSCRICAO]

⚠️ Vagas do Lote 1 estão quase esgotando.
```

---

## FASE 4 — PREPARAÇÃO

**Trigger:** Pagamento confirmado no Ticket and GO

### Mensagem 7 — Confirmação Celebratória
**Delay:** Imediato após confirmação

```
🏔️ CONFIRMADO! Bem-vindo, Lendário [Nome]!

Você é um dos *{{NOME_EVENTO}}* de {{CIDADE}}!

Nos próximos dias, vou te enviar o *guia de preparação completo* — o que levar, como se preparar física e espiritualmente.

AHU! 🤜🤛
```

### Mensagem 8 — Preparação D-21
**Delay:** D-21

```
[Nome], faltam *21 dias* para o {{NOME_EVENTO}}! 🏔️

📋 *Lista de itens obrigatórios:*
• Mochila (40-60L)
• Tênis de trilha
• Roupas para frio e chuva
• Lanterna com pilhas extras
• Bíblia ou devocional
• Medicamentos pessoais

Lista completa foi enviada para seu email cadastrado. 📧
```

### Mensagem 9 — Dica D-7
**Delay:** D-7

```
7 dias, [Nome]! 🔥

Dica de ouro dos Legendários veteranos: *durma bem esta semana* e faça pelo menos 3 caminhadas de 5km com a mochila carregada.

A montanha respeita quem se prepara. AHU! 💪
```

### Mensagem 10 — Lembrete D-1
**Delay:** D-1

```
Amanhã começa, [Nome]! 🏔️

*Lembrete:*
📍 Local de encontro: {{LOCAL_EVENTO}}
🕐 Chegada: {{HORA_CHEGADA}}
🚫 Celular: desligado/entregue na entrada

Durma cedo. Amanhã você sobe. AHU! 🤜🤛
```

---

## FASE 5 — PÓS-EVENTO

**Trigger:** D+1 após fim do evento

### Mensagem 11 — Celebração D+1
**Delay:** D+1

```
[Nome], você foi! 💪

Você é agora um *Lendário {{NOME_EVENTO}}* — sempre será.

Uma coisa: o que você viveu nesses 3 dias... *grave na memória*. Isso é seu.

Nos próximos dias vou te enviar algo importante. Fique atento. 🏔️
```

### Mensagem 12 — Pedido de Depoimento D+3
**Delay:** D+3

```
[Nome], um pedido especial 🙏

Grave um *áudio de 60-90 segundos* contando o que o {{NOME_EVENTO}} significou para você.

Esse depoimento vai ajudar outros homens a tomarem a mesma decisão que você tomou.

Envie aqui mesmo, no WhatsApp. Obrigado. AHU!
```

---

## FASE 6 — RETENÇÃO

### Mensagem 13 — RPM e Comunidade D+14
**Delay:** D+14

```
[Nome], como está sendo a semana depois do TOP? 💪

Muitos Legendários passam por um período de 're-entrada' — é normal.

💡 *Dica:* Encontre outros Legendários da sua cidade. Comunidade mantém a chama viva.

O *RPM {{CIDADE}}* começa no 1º sábado do próximo mês, às 7h. Você vai? Responda *SIM* ou *NÃO*.
```

### Mensagem 14 — Cross-sell REM (casados) D+21
**Delay:** D+21 | **Segmento:** Apenas casados (dados do formulário de inscrição)

```
[Nome], você mudou na montanha. 🏔️

E a sua esposa? O que ela está sentindo com essa mudança em você?

O *REM* (Retiro de Empoderamento Matrimonial) foi criado para os dois irem juntos para o próximo nível.

Alumni do TOP têm *10% de desconto*. Quer saber mais? Responda *REM* 👇
```

---

## Configurações Técnicas

| Configuração | Valor |
|---|---|
| Plataforma | WhatsApp Business API |
| Templates HSM | Obrigatório para mensagens em massa (aprovação Meta prévia) |
| Opt-in | Confirmado na Mensagem 1 (SIM) — obrigatório antes de qualquer envio |
| Opt-out | SAIR a qualquer momento → remover em até 24h (LGPD) |
| Frequência máxima | 2 mensagens/semana por contato sem resposta |
| Personalização | [Nome] obrigatório em toda mensagem |
| Segmentação M14 | Casados apenas (verificar base de dados antes de enviar) |

---

*Template gerado pelo squad @legendarios-platform | @whatsapp-automator*
