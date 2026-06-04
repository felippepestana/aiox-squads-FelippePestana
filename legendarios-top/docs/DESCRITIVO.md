# Descritivo do Sistema — Legendários TOP

> **Status**: Levantamento prévio — base para planejamento  
> **Data**: Junho 2026  
> **Versão**: 1.0

---

## 1. Contexto

### O Programa Legendários no Brasil

O **Legendários** é um movimento de transformação de vida para homens, originado na Guatemala em 2015 e presente no Brasil desde 2017. Atua em 18 estados com mais de 25 mil participantes.

O principal produto experiencial do programa no Brasil é o **TOP — Track Outdoor de Potencial**: um retiro de 4 dias em contato com a natureza que combina trekking, prédicas, acampamento e dinâmicas de grupo. Cada edição (ex: TOP 768 Vale da Onça, TOP 1428 Brasília) reúne dezenas a centenas de participantes, chamados **senderistas**.

### O Problema

A operação médica e logística do TOP exige:

- **Triagem médica prévia** de todos os participantes (avaliar aptidão para atividade física em montanha)
- **Validação de exames** (clínico geral, cardiológico, ergométrico) antes do credenciamento
- **Atendimento de campo** durante o evento, offline, em locais sem sinal
- **Comunicação com familiares** sem expor dados dos participantes
- **Credenciamento rápido** no dia do evento (centenas de pessoas)
- **Gestão de presença e atividades** ao longo dos 4 dias

Antes deste sistema, esses processos eram manuais (planilhas, WhatsApp, papel).

### A Plataforma de Ingressos

O Legendários utiliza a plataforma **Ticket And Go** (ticketandgo.com.br) para venda e gestão de ingressos. A plataforma possui inclusive um app de check-in exclusivo para o Legendários (`br.com.ticketandgo.legendary.checkinapp`).

A Ticket And Go **não oferece API pública**. A única forma de integração de dados disponível hoje é a exportação manual de planilha Excel (.xlsx) com 44 colunas de dados dos inscritos.

---

## 2. Visão do Sistema

O **sistema Legendários TOP** é uma plataforma web operacional que digitaliza e integra todo o ciclo de vida do participante em um evento TOP:

```text
ANTES DO EVENTO              NO EVENTO                 DURANTE O EVENTO
────────────────────         ────────────────────       ────────────────────
Inscrição (Ticket And Go)    Credenciamento NFC         Atendimento médico
       ↓                            ↓                          ↓
Triagem médica online        Check-in presencial        Prontuário offline
       ↓                            ↓                          ↓
Upload de exames             Dashboard tempo real       Sincronização nuvem
       ↓                                                       ↓
Validação pela equipe        Mensagens de apoio ←── Família envia remotamente
```

---

## 3. Stakeholders e Personas

### 3.1 Senderista (Participante)

**Quem é**: Homem inscrito em uma edição do TOP via Ticket And Go.

**Jornada**:
1. Recebe link de triagem (ou acessa diretamente)
2. Preenche formulário de saúde online (sem criar conta)
3. Recebe link único para upload de exames médicos
4. Faz upload dos exames exigidos (PDF/JPG/PNG)
5. Aguarda aprovação da equipe Hakuna
6. Comparece ao evento → check-in com TAG NFC
7. Durante o evento: recebe mensagens de apoio da família no slideshow

**Acesso**: Sem autenticação — via tokens únicos por participante.

---

### 3.2 Hakuna (Equipe Operacional)

**Quem é**: Membro da equipe do Legendários responsável pela operação médica e logística do TOP. Pode ser médico, enfermeiro, líder de logística ou coordenador.

**Jornada — Pré-evento**:
1. Importa planilha do Ticket And Go → sistema faz upsert dos senderistas
2. Envia WhatsApp em lote com links de mensagens para cônjuges
3. Valida exames enviados pelos senderistas (aprova ou reprova com motivo)
4. Grava TAGs NFC com dados médicos dos aprovados

**Jornada — Credenciamento**:
1. Acessa `/hakuna/checkin` no celular
2. Aproxima TAG NFC do participante OU busca por nome/CPF
3. Confirma presença + coleta aceite do termo de responsabilidade
4. Entrega crachá/pulseira com TAG gravada

**Jornada — Durante o evento**:
1. Acessa `/campo` no Android (PWA offline)
2. Lê TAG NFC → vê dados médicos completos do participante
3. Registra prontuário (queixas, condutas, fotos)
4. Sistema sincroniza quando há sinal

**Acesso**: Autenticação OTP por e-mail. E-mail deve estar cadastrado na tabela `hakunas`.

---

### 3.3 Família / Cônjuge

**Quem é**: Esposa ou familiar do senderista que quer enviar mensagens de apoio durante o retiro.

**Jornada**:
1. Recebe link único via WhatsApp (enviado pela equipe Hakuna)
2. Acessa portal sem criar conta
3. Envia carta (texto), foto, vídeo ou áudio (até 50 MB)
4. Mensagem fica disponível para exibição durante o evento

**Acesso**: Sem autenticação — via `mensagens_token` único por participante.

---

### 3.4 Admin / Coordenador

**Quem é**: Hakuna com perfil de coordenação que gerencia dados do evento globalmente.

**Capacidades adicionais**:
- Importação em massa de participantes do Ticket And Go
- Envio de WhatsApp em lote
- Gestão de atividades e checkpoints do evento
- Visão consolidada de presença e risco

**Acesso**: Mesma autenticação de Hakuna. Sem roles diferenciados implementados atualmente.

---

## 4. Funcionalidades do Sistema

### 4.1 Triagem Médica Online

**Rota**: `/triagem`  
**Acesso**: Público

Formulário de 4 etapas que coleta dados de saúde e classifica o risco automaticamente:

**Dados coletados**:
- Identificação: nome, CPF (opcional), WhatsApp, data de nascimento
- Saúde: peso, altura, tipo sanguíneo, plano de saúde, comorbidades, restrição alimentar
- Família: cônjuge (nome + WhatsApp), igreja, vai acompanhado
- Revisão: prévia com cálculo de risco em tempo real

**Classificação de risco automática**:

| Idade | Comorbidade | Risco | Exames exigidos |
|-------|------------|-------|-----------------|
| 60+ anos | Qualquer | Alto | Ergométrico + Cardiológico |
| 40–59 anos | Sim | Alto | Ergométrico + Cardiológico |
| 40–59 anos | Não | Moderado | Ergométrico + Clínico geral |
| Até 39 anos | Sim | Moderado | Ergométrico + Clínico geral |
| Até 39 anos | Não | Baixo | Clínico geral |

**Comorbidades reconhecidas**: HAS, DM, Cardiopatia, Asma/DPOC, Obesidade (IMC ≥ 30), DRC, Doença neurológica, Limitação ortopédica severa, Outra.

**Saída**: Link de exames (`/exames/{token}`) + link de mensagens família (`/mensagens/{token}`)

---

### 4.2 Upload e Validação de Exames

**Rota upload**: `/exames/{token}` — Público (token do senderista)  
**Rota validação**: `/hakuna/senderistas/{id}` — Hakuna

**Tipos de exame**:
- `atestado_cg` — Atestado médico clínico geral (apto para montanhismo/trekking)
- `atestado_cardio` — Atestado cardiológico
- `teste_esteira` — Teste ergométrico

**Formatos aceitos**: PDF, JPG, PNG (máx. 10 MB por arquivo)  
**Armazenamento**: Supabase Storage (bucket `exames`, privado, URL assinada com 1h)

**Fluxo de validação** (Hakuna):
1. Visualiza exames enviados com preview
2. Aprova ou reprova individualmente (com motivo)
3. Atualiza status do senderista: `aprovado` ou `reprovado`
4. Pode enviar WhatsApp com orientações ou link de reenvio

---

### 4.3 Importação Ticket And Go

**Rota**: `/hakuna/importar` — Hakuna  
**Endpoint**: `POST /api/admin/importar-ticketgo`

Aceita arquivo `.xlsx` exportado do painel Ticket And Go. Realiza **upsert** de participantes com deduplicação por CPF.

**Dados importados** (44 colunas):
- Identificação e ingresso: ID TG, código, status, valor, data cadastro, origem
- Dados pessoais: nome, CPF, email, telefone, nascimento, estado, cidade, profissão
- Dados do evento: evento, produto, tipo participante (legendário vs senderista), família
- Saúde: peso, altura, condição médica, comorbidades, medicamentos, restrição alimentar
- Rede: cônjuge (nome/WhatsApp/email), acompanhante, vai acompanhado
- Outros: instagram, igreja, tamanho camisa, condição física autorelatada (1–5)

**Enriquecimento automático**: calcula risco + exames exigidos via mesma lógica da triagem.

**Resultado retornado**: `{ imported, updated, skipped, errors[] }`

---

### 4.4 Comunicação WhatsApp

**Endpoint**: `POST /api/admin/whatsapp`  
**Integração**: Evolution API (self-hosted)

**Dois modos**:

**Individual** — Hakuna clica em senderista específico:
- Envia link do portal de mensagens ao cônjuge
- Mensagem personalizada com nome do participante e link

**Lote** — Após importação do Ticket And Go:
- Filtra senderistas com `whatsapp_conjuge` preenchido + `status_ingresso = ativo`
- Envia link de mensagens para todos
- Rate limit: 1 mensagem/segundo

**Configuração necessária**: `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`

---

### 4.5 Credenciamento — Check-in

**Rota**: `/hakuna/checkin` — Hakuna  
**Endpoint**: `PATCH /api/admin/checkin`

**Dois modos de identificação**:
1. **NFC**: aproximar celular Android à TAG do participante
2. **Manual**: busca por nome ou CPF

**Ações no check-in**:
- Marca `status_presenca = presente`
- Coleta aceite do termo de responsabilidade
- Exibe tamanho de camiseta para entrega

---

### 4.6 App de Campo — Prontuário Offline

**Rota**: `/campo` — PWA, Chrome Android  
**Offline**: Sim — IndexedDB + Service Worker

**Fluxo completo**:
1. Voluntário abre `/campo` no Android (funciona sem sinal)
2. Aproxima celular à TAG NFC do senderista
3. Sistema exibe: tipo sanguíneo, peso, altura, IMC, risco, comorbidades
4. Preenche prontuário: queixas, condutas, fotos (câmera)
5. Dados salvos localmente (IndexedDB)
6. Quando online: sincronização automática com Supabase

**Dados gravados na TAG NFC**:

```text
id, nome, tipo_sanguineo, plano_saude, risco,
imc, peso, altura, comorbidades, status, telefone
```

---

### 4.7 Gravação de TAGs NFC

**Rota**: `/hakuna/nfc` — Hakuna, Chrome Android

Permite que Hakuna grave TAGs NFC antes do evento:
- Lista senderistas aprovados ou com exames enviados
- Seleciona participante
- Grava TAG com dados médicos completos

---

### 4.8 Dashboard Hakuna

**Rota**: `/hakuna` — Hakuna

Visão geral de todos os participantes com:
- Estatísticas: total, aguardando exames, enviados, aprovados
- Filtros: por risco (baixo/moderado/alto), status, busca por nome
- Ações rápidas: acessar evento 72h, check-in, importar Ticket And Go, gravar NFC

---

### 4.9 Dashboard Evento 72h

**Rota**: `/hakuna/evento` — Hakuna  
**Auto-refresh**: 30 segundos

**Três abas**:
1. **Geral**: Estatísticas por risco + status médico
2. **Presença**: Lista de participantes com filtro presente/ausente/risco
3. **Atividades**: Checkpoints, prédicas, hidratações com hora planejada/realizada

**Indicadores em tempo real**:
- Total de participantes credenciados
- Presentes por risco (alto/moderado/baixo)
- Mensagens de apoio não lidas
- Taxa de presença (%)

**Gestão de atividades**: criação com tipo, descrição e horário planejado; marcação de hora real.

---

### 4.10 Portal de Mensagens de Apoio

**Rota**: `/mensagens/{token}` — Família (público, sem login)  
**Rota**: `/hakuna/senderistas/{id}/mensagens` — Visualização Hakuna

**Tipos de mensagem aceitos**:

| Tipo | Formato | Tamanho máx. |
|------|---------|-------------|
| Carta | Texto (5.000 chars) | — |
| Foto | JPG, PNG, WEBP, HEIC | 50 MB |
| Vídeo | MP4, MOV, WEBM | 50 MB |
| Áudio | MP3, M4A, OGG, WAV | 50 MB |

**Armazenamento**: Supabase Storage (bucket `mensagens`, privado)  
**Exibição**: Slideshow no painel Hakuna durante o evento

---

## 5. Integrações

### 5.1 Ticket And Go (Ingressos)

| Aspecto | Situação |
|---------|----------|
| Tipo de integração | Importação manual de .xlsx |
| Frequência | Manual, sem automação |
| API pública | Não disponível |
| API privada | Provavelmente existe (usada pelo eNotas) |
| App exclusivo Legendários | `br.com.ticketandgo.legendary.checkinapp` |
| Webhooks | Não disponível |

**Limitação crítica**: toda sincronização de novos inscritos, cancelamentos e atualizações de dados depende de export manual e re-importação.

---

### 5.2 Evolution API (WhatsApp)

| Aspecto | Situação |
|---------|----------|
| Tipo | REST API self-hosted |
| Implementação | Funcional, opcional |
| Funcionalidades | Envio individual + lote, rate limit 1/s |
| Configuração | ENV vars (URL, KEY, INSTANCE) |
| Dependência | Instância Evolution API ativa |

---

### 5.3 NFC (Web NFC API)

| Aspecto | Situação |
|---------|----------|
| Padrão | Web NFC API (W3C) |
| Compatibilidade | Chrome Android exclusivamente |
| Operação | Leitura e escrita de TAGs NDEF |
| Offline | Sim — dados gravados na TAG |

---

### 5.4 Supabase

| Serviço | Uso |
|---------|-----|
| PostgreSQL | Banco principal (todas as tabelas) |
| Auth | OTP por email para Hakunas |
| Storage | Exames, prontuários, mensagens (privado + signed URLs) |
| RLS | Políticas por role (anon, authenticated, service_role) |
| Região | `sa-east-1` (São Paulo) |

---

## 6. Infraestrutura Técnica

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Estilização | Tailwind CSS + Shadcn/ui |
| Formulários | React Hook Form + Zod |
| Offline | Dexie.js (IndexedDB) + Service Worker (next-pwa + Workbox) |
| Backend | Next.js API Routes |
| Banco de dados | Supabase PostgreSQL |
| Autenticação | Supabase Auth (OTP) |
| Storage | Supabase Storage |
| Deploy | Netlify (com `@netlify/plugin-nextjs`) |
| NFC | Web NFC API (Chrome Android) |

### Banco de Dados — Tabelas Principais

| Tabela | Função |
|--------|--------|
| `senderistas` | Participantes (55+ campos) |
| `hakunas` | Equipe operacional autenticada |
| `exames` | Documentos médicos enviados |
| `prontuarios` | Registros de atendimento de campo |
| `mensagens_apoio` | Mensagens da família |
| `atividades_top` | Checkpoints e atividades do evento |
| `participacoes` | Log de passagem por checkpoints |

### PWA e Offline

O app de campo (`/campo`) é um PWA completo:
- Shell cacheado via Service Worker (Workbox)
- APIs em NetworkFirst (10s timeout, fallback cache 24h)
- Prontuários salvos em IndexedDB quando offline
- Sincronização manual ao reconectar

---

## 7. Estado Atual e Gaps

### Funcionalidades Implementadas (MVP)

| Funcionalidade | Estado |
|---------------|--------|
| Triagem médica 4-step | ✅ Completo |
| Classificação de risco automática | ✅ Completo |
| Upload de exames | ✅ Completo |
| Portal de mensagens família | ✅ Completo |
| Importação Ticket And Go (.xlsx) | ✅ Completo |
| WhatsApp (Evolution API) | ✅ Completo |
| Check-in com NFC | ✅ Completo |
| Gravação de TAGs NFC | ✅ Completo |
| App de campo offline + sync | ✅ Completo |
| Dashboard Hakuna | ✅ Completo |
| Dashboard evento 72h | ✅ Completo |
| PWA + Service Worker | ✅ Completo |
| Banco de dados + RLS | ✅ Completo |
| Deploy Netlify | ✅ Configurado |

### Gaps Identificados

#### Críticos (bloqueiam operação ideal)

| # | Gap | Impacto |
|---|-----|---------|
| G1 | Sincronização Ticket And Go manual | Dados sempre desatualizados entre imports; cancelamentos não refletem automaticamente |
| G2 | Validação de exames sem UI completa | Campo `validado` no banco, sem tela para Hakuna marcar aprovado/reprovado individualmente |
| G3 | Rastreamento de checkpoints sem UI | Tabela `participacoes` existe no banco, sem forma de registrar passagem por checkpoint via interface |
| G4 | Sem roles diferenciados em Hakunas | Todos com email cadastrado têm acesso total; sem separação médico / apoio / coordenação |
| G5 | Tokens sem expiração | `upload_token` e `mensagens_token` são vitalícios; família pode enviar mensagens indefinidamente |

#### Moderados (degradam experiência)

| # | Gap | Impacto |
|---|-----|---------|
| G6 | `mensagens.visualizado` não atualizado | Badge "não lidas" no dashboard nunca zera |
| G7 | Fotos de prontuário sem render | Imagens salvas mas não exibidas no detalhe do senderista |
| G8 | Slideshow de mensagens parcial | Rota existe, UI incompleta |
| G9 | `hakuna_id` não salvo em prontuários | Não rastreia qual Hakuna fez o atendimento |
| G10 | ~15 campos coletados sem visualização | `uso_medicamento`, `medicamentos`, `restricao_alimentar`, `cond_fisica`, `tamanho_camisa`, etc. — existem no banco, sem UI |

---

## 8. Pontos em Aberto para o Planejamento

As decisões abaixo são de negócio e determinam o escopo e prioridade do planejamento:

### Ticket And Go

**P1.** Existe contato ou acordo com a Ticket And Go para acesso à API privada?  
*(Define: automação vs. import manual)*

**P2.** Com que frequência ocorre o export manual do .xlsx? Quem realiza?  
*(Define: urgência da automação)*

**P3.** O app Legendários Check-in (da Ticket And Go) continua sendo usado em paralelo, ou será substituído pelo sistema próprio?  
*(Define: se o check-in NFC precisa coexistir ou substituir)*

### Operação do Evento

**P4.** Quantos Hakunas atuam por evento TOP? Quais são os perfis de acesso necessários (médico, coordenador, apoio logístico)?  
*(Define: roles e permissões)*

**P5.** Existem múltiplas edições TOP simultâneas em estados diferentes?  
*(Define: necessidade de isolamento por evento)*

**P6.** Os critérios de risco médico atual foram validados por profissional de saúde?  
*(Define: se pode ser evoluído ou precisa de revisão)*

**P7.** O que acontece com senderistas reprovados — podem recorrer / reenviar exames?  
*(Define: fluxo de reenvio)*

### Comunicação

**P8.** A Evolution API já está em produção para o Legendários? Qual é a instância e o número vinculado?  
*(Define: configuração necessária para WhatsApp funcionar)*

**P9.** Quais mensagens WhatsApp precisam ser automatizadas além do link de mensagens?  
*(Exemplos: aprovação/reprovação de exame, lembrete de upload, confirmação de check-in)*

### Escala e Crescimento

**P10.** Qual é o calendário dos próximos eventos TOP em 2026?  
*(Define: janela de entrega para o planejamento)*

**P11.** Qual é o volume esperado por evento (participantes)?  
*(Define: otimizações necessárias de performance)*

**P12.** Existe demanda para outros eventos Legendários além do TOP?  
*(Define: se o sistema precisa ser multi-evento / multi-programa)*

---

## 9. Glossário

| Termo | Definição |
|-------|-----------|
| **TOP** | Track Outdoor de Potencial — retiro de 4 dias em montanha |
| **Senderista** | Participante inscrito em um TOP |
| **Hakuna** | Membro da equipe operacional/médica do evento |
| **Ticket And Go** | Plataforma de venda de ingressos utilizada pelo Legendários |
| **TAG NFC** | Etiqueta NFC gravada com dados médicos do senderista para uso offline |
| **Evolution API** | Gateway WhatsApp Business self-hosted |
| **Risco** | Classificação de aptidão para atividade física: baixo / moderado / alto |
| **Triagem** | Processo de coleta e avaliação de dados de saúde pré-evento |
| **Prontuário** | Registro de atendimento médico realizado durante o evento |
