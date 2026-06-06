# Planejamento — Legendários TOP

> **Base**: Levantamento prévio `DESCRITIVO.md` v1.0  
> **Data**: Junho 2026  
> **Horizonte**: ~8 semanas (4 sprints de 2 semanas)  
> **Critério de urgência**: próximo evento TOP estimado em 60 dias

---

## 1. Premissas Adotadas

As questões em aberto do DESCRITIVO.md foram tratadas com as premissas abaixo. Onde há risco alto de estar errado, o item é marcado com **⚠ revisar**.

| Questão | Premissa adotada | Risco |
|---------|-----------------|-------|
| P1 — API Ticket And Go | Sem API pública; continua manual com .xlsx | Baixo |
| P2 — Frequência do export | Import manual feito uma vez por semana pelo coordenador | Médio |
| P3 — App Check-in próprio vs TG | Sistema próprio (NFC) substitui progressivamente o app TG | **⚠ Médio** |
| P4 — Perfis de Hakuna | 3 roles: `médico`, `coordenador`, `apoio`; 5–15 hakunas por evento | Baixo |
| P5 — Edições simultâneas | Há edições em múltiplos estados; um evento ativo por vez no painel | **⚠ Médio** |
| P6 — Critérios de risco validados | Critérios atuais são provisórios; aguardando validação médica | Baixo |
| P7 — Reenvio de exames | Senderista reprovado pode reenviar novos exames até aprovação | Baixo |
| P8 — Evolution API | Instância já existe ou será configurada; número vinculado ao Legendários | **⚠ Alto** |
| P9 — Automações WhatsApp | Prioridade: (1) link família, (2) aprovação/reprovação, (3) lembrete | Baixo |
| P10 — Calendário 2026 | Próximo evento em ~60 dias; outros a cada 30–45 dias | Médio |
| P11 — Volume por evento | 100–300 senderistas por edição | Baixo |
| P12 — Outros programas | Apenas TOP por ora; arquitetura multi-evento mas não multi-programa | Médio |

---

## 2. Gaps Priorizados

Priorização derivada do DESCRITIVO.md seção 7 (Gaps), ordenada por impacto operacional:

| # | Gap | Prioridade | Sprint |
|---|-----|-----------|--------|
| G2 | Validação de exames sem UI completa | **CRÍTICO** | 1 |
| G9 | `hakuna_id` não salvo em prontuários | **CRÍTICO** | 1 |
| G6 | Badge "não lidas" nunca zera | **CRÍTICO** | 1 |
| G7 | Fotos de prontuário sem render | Alto | 1 |
| G8 | Slideshow de mensagens parcial | Alto | 2 |
| G10 | ~15 campos coletados sem visualização | Alto | 2 |
| G5 | Tokens sem expiração | Alto (segurança) | 2 |
| G3 | Checkpoints sem UI | Médio | 3 |
| G4 | Sem roles diferenciados | Médio | 3 |
| G1 | Sync Ticket And Go manual | Baixo (estrutural) | 4 |

---

## 3. Roadmap por Sprint

### Sprint 1 — Completar Validação e Prontuário (semanas 1–2)

**Objetivo**: garantir que o ciclo triagem → exames → aprovação → campo funcione sem gaps críticos.

#### 3.1 Validação de Exames com UI (G2)

**Problema**: o campo `validado` e `motivo_reprovacao` existem no banco (`exames`), mas não há interface para o Hakuna aprovar ou reprovar cada exame individualmente.

**Solução**:
- Tela `/hakuna/senderistas/[id]`: adicionar botões "Aprovar" / "Reprovar" por exame
- Reprovar abre modal com campo de texto para motivo
- Ao aprovar/reprovar todos os exames obrigatórios:
  - Sistema avalia se todos aprovados → `status = "aprovado"`, ou qualquer reprovado → `status = "reprovado"`
- Botão "Notificar via WhatsApp" (stub se Evolution não configurada): envia mensagem de resultado

**Endpoints**:
```http
PATCH /api/exames/[exameId]/validar
  body: { validado: boolean, motivo_reprovacao?: string }
```

**Migration**: nenhuma (campos já existem)

---

#### 3.2 Salvar Hakuna em Prontuários (G9)

**Problema**: tabela `prontuarios` tem coluna `hakuna_id` mas o app de campo não a envia, perdendo rastreabilidade.

**Solução**:
- No app de campo (`/campo`), recuperar a sessão do usuário autenticado antes de salvar prontuário
- Incluir `hakuna_id` no payload enviado à API de prontuários
- `lib/offline-db.ts`: adicionar campo `hakuna_id` ao schema local do Dexie.js

**Obs**: o `/campo` usa PWA sem sessão de usuário atualmente. Para rastrear o Hakuna de campo, adicionar um passo de identificação no início da sessão do app campo (e-mail OTP ou seleção de hakuna por lista).

---

#### 3.3 Marcar Mensagens como Lidas (G6)

**Problema**: campo `visualizado` na tabela `mensagens_apoio` existe mas nunca é atualizado, então o badge de "não lidas" no dashboard nunca zera.

**Solução**:
- Ao abrir `/hakuna/senderistas/[id]/mensagens`, marcar todas as mensagens do senderista como visualizadas
- Endpoint: `PATCH /api/admin/mensagens/[senderista_id]/marcar-lidas` (sem body)
- No dashboard, recalcular contagem apenas de mensagens com `visualizado = false`

---

#### 3.4 Renderizar Fotos no Prontuário (G7)

**Problema**: imagens de prontuário são salvas no Supabase Storage mas não aparecem na tela de detalhe do senderista.

**Solução**:
- Endpoint `GET /api/prontuarios/[prontuarioId]/fotos`: retorna URLs assinadas (1h) das fotos
- Componente de galeria na tela `/hakuna/senderistas/[id]` abaixo da lista de prontuários
- UI simples: thumbnails com lightbox ao clicar

---

### Sprint 2 — Completar Experiência e Segurança (semanas 3–4)

**Objetivo**: fechar todos os gaps de experiência e endereçar o risco de segurança dos tokens.

#### 3.5 Slideshow de Mensagens Completo (G8)

**Problema**: rota `/hakuna/senderistas/[id]/mensagens/slideshow` existe mas UI está incompleta.

**Solução**:
- Slideshow exibe: carta (texto grande), foto (fullscreen), vídeo (player nativo), áudio (player)
- Navegação por setas ou toque (swipe no Android)
- Autoplay opcional: avança automaticamente a cada 15s
- Indicador de progresso (1 de N mensagens)
- Botão de impressão para cartas

---

#### 3.6 Exibir Todos os Campos Coletados (G10)

**Problema**: ~15 campos existem no banco mas não aparecem em nenhuma tela.

**Campos a exibir**:

| Campo | Onde exibir |
|-------|-------------|
| `uso_medicamento`, `medicamentos` | Tela senderista + TAG NFC |
| `restricao_alimentar` | Tela senderista + TAG NFC + credencial |
| `cond_fisica` (1–5) | Tela senderista + dashboard |
| `tamanho_camisa` | Tela check-in (para entrega) |
| `profissao`, `instagram`, `estado`, `cidade` | Tela senderista (expansível) |
| `codigo_inscricao`, `id_ticketgo` | Tela senderista (admin) |
| `tipo_participante` | Badge no dashboard |

**Ajuste na TAG NFC**: incluir `medicamentos` e `restricao_alimentar` nos dados gravados.

---

#### 3.7 Expiração de Tokens (G5)

**Problema**: `upload_token` e `mensagens_token` são vitalícios — família pode enviar mensagens indefinidamente.

**Solução**:

**Opção A (recomendada)**: expiração por data do evento
- Adicionar coluna `evento_data` em `senderistas`
- Upload de exames: aceitar até `evento_data - 3 dias`
- Mensagens de família: aceitar até `evento_data + 1 dia` (dia final do TOP)

**Opção B** (mais simples): expiração fixa de 30 dias após criação

**Migration**:
```sql
ALTER TABLE senderistas ADD COLUMN evento_data DATE;
```

**API**: validar expiração nas rotas `/api/exames/[token]` e `/api/mensagens/[token]`

---

### Sprint 3 — Operações Avançadas (semanas 5–6)

**Objetivo**: melhorar rastreabilidade, permissões e visibilidade de checkpoints.

#### 3.8 Checkpoints com Interface (G3)

**Problema**: tabela `participacoes` e `atividades_top` existem mas não há forma de registrar passagem por checkpoint via UI.

**Solução**:
- Tela `/campo`: ao abrir prontuário de um senderista, exibir lista de atividades do evento
- Checkbox por atividade: marcar participação (cria registro em `participacoes`)
- Hakuna pode ver quais atividades o senderista já fez
- Dashboard evento (`/hakuna/evento`) aba "Atividades": mostra % de participação por atividade

---

#### 3.9 Roles Diferenciados (G4)

**Premissa adotada**: 3 perfis — `médico`, `coordenador`, `apoio`.

**Solução**:

```sql
-- Migration
ALTER TABLE hakunas ADD COLUMN role TEXT DEFAULT 'apoio' 
  CHECK (role IN ('médico', 'coordenador', 'apoio'));
```

**Permissões por role**:

| Ação | médico | coordenador | apoio |
|------|--------|-------------|-------|
| Ver exames | ✅ | ✅ | ❌ |
| Aprovar/reprovar exames | ✅ | ✅ | ❌ |
| Ver prontuários | ✅ | ✅ | ❌ |
| Criar prontuários | ✅ | ❌ | ✅ |
| Importar Ticket And Go | ❌ | ✅ | ❌ |
| Enviar WhatsApp em lote | ❌ | ✅ | ❌ |
| Gravar NFC | ✅ | ✅ | ✅ |
| Check-in | ✅ | ✅ | ✅ |
| Gerenciar hakunas | ❌ | ✅ | ❌ |

**Implementação**: middleware no `hakuna/layout.tsx` que verifica role; botões condicionais por role.

---

#### 3.10 WhatsApp Automatizado (P9)

**Dependência**: Evolution API configurada e instância ativa (P8).

**Mensagens a automatizar**:

1. **Exames aprovados**: "Olá [nome], seus exames foram aprovados! Você está liberado para o TOP. Qualquer dúvida, responda esta mensagem."
2. **Exames reprovados**: "Olá [nome], identificamos uma pendência nos seus exames: [motivo]. Por favor, refaça o upload em: [link]"
3. **Lembrete de upload** (3 dias antes do prazo): "Olá [nome], seus exames ainda não foram enviados. O prazo é [data]. Acesse: [link]"
4. **Confirmação de check-in**: "Bem-vindo ao TOP, [nome]! Sua presença foi confirmada. Que Deus abençoe sua jornada!"

**Configuração necessária**:
```env
EVOLUTION_API_URL=https://...
EVOLUTION_API_KEY=...
EVOLUTION_INSTANCE=legendarios
```

---

### Sprint 4 — Automação e Escala (semanas 7–8)

**Objetivo**: reduzir fricção operacional e preparar para múltiplos eventos.

#### 3.11 Isolamento Multi-evento

**Contexto**: sistema atual opera sem conceito de "evento ativo". Ao importar novo .xlsx, senderistas de diferentes eventos se misturam.

**Solução**:

```sql
-- Migration
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  estado TEXT,
  capacidade INTEGER,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'encerrado')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE senderistas ADD COLUMN evento_id UUID REFERENCES eventos(id);
```

**Dashboard**: filtro por evento ativo no topo da tela Hakuna; stats segmentadas por evento.

---

#### 3.12 Automação Ticket And Go (G1)

**Status atual**: dependente da resposta a P1 (existe API privada?).

**Cenário A — sem API** (mais provável):
- Agendamento manual: tela de importação mostra "Última sincronização: há X dias"
- Notificação ao Hakuna coordenador quando > 7 dias sem importar

**Cenário B — com API privada** (requer acordo com Ticket And Go):
- Webhook ou polling a cada 1h via Supabase Edge Function
- Captura novos inscritos, cancelamentos, atualizações de dados
- Reconciliação automática com `senderistas`

---

## 4. Melhorias de Infraestrutura (transversais)

### 4.1 Testes Automatizados

**Prioridade**: alta, antes de novas funcionalidades de validação.

Cobrir com testes unitários:
- `lib/triage.ts` — regras de classificação de risco
- `lib/whatsapp.ts` — formato de mensagens
- APIs críticas: triagem, validação de exames, check-in

Stack sugerida: **Vitest** + **@testing-library/react** para componentes.

---

### 4.2 Variáveis de Ambiente

**Situação atual**: `.env.example` existe mas não documenta todos os campos.

**Campos necessários e ainda não documentados**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# WhatsApp (Evolution API)
EVOLUTION_API_URL=
EVOLUTION_API_KEY=
EVOLUTION_INSTANCE=
```

---

### 4.3 Monitoramento de Erros

**Situação atual**: erros de API logados apenas no console do servidor.

**Solução**: integrar **Sentry** (gratuito para pequenos volumes) nas API routes:
```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";
```

---

## 5. Critérios de Pronto por Sprint

| Sprint | Critério |
|--------|---------|
| Sprint 1 | Hakuna consegue aprovar/reprovar exame individual com registro de motivo; prontuário salva hakuna_id; badge de não lidas zera; fotos de prontuário renderizam |
| Sprint 2 | Slideshow completo (texto/foto/vídeo/áudio); tamanho de camiseta visível no check-in; tokens expiram conforme data do evento |
| Sprint 3 | Hakunas com role `coordenador` não acessam prontuários; checkpoints registráveis no campo; WhatsApp de aprovação/reprovação funcional |
| Sprint 4 | Importação filtra por evento; dashboard segmentado por evento; sync automático (se API disponível) |

---

## 6. Dependências Críticas (caminho crítico)

```text
Resposta P8 (Evolution API) ──► Sprint 3 item 3.10 (WhatsApp automatizado)
Resposta P1 (API TicketGo)  ──► Sprint 4 item 3.12 (automação sync)
Resposta P4 (roles Hakunas) ──► Sprint 3 item 3.9 (confirmação da tabela de permissões)
Resposta P5 (multi-edição)  ──► Sprint 4 item 3.11 (validação do modelo de dados)
Validação médica (P6)       ──► Critérios de risco estão corretos? (afeta triagem e NFC)
```

**Ação recomendada**: antes de iniciar Sprint 3, confirmar P4, P6 e P8. Antes de Sprint 4, confirmar P1 e P5.

---

## 7. Resumo de Entregas

| Sprint | Semanas | Entregas principais |
|--------|---------|---------------------|
| 1 | 1–2 | Validação de exames com UI, fotos prontuário, badge mensagens |
| 2 | 3–4 | Slideshow completo, todos os campos visíveis, tokens expiram |
| 3 | 5–6 | Roles diferenciados, checkpoints, WhatsApp automático |
| 4 | 7–8 | Multi-evento, automação TicketGo, testes |

---

## 8. Perguntas a Responder Antes de Começar

Para iniciar o Sprint 1 **imediatamente**, nenhuma resposta é necessária — todos os 4 itens são técnicos e sem bloqueadores.

Para Sprint 3 e 4, as respostas abaixo desbloqueiam funcionalidades específicas:

| Pergunta | Impacto de não responder |
|----------|-------------------------|
| **P8** — Evolution API configurada? | Sprint 3 item 3.10 fica como stub |
| **P4** — Quantos roles de Hakuna? | Sprint 3 item 3.9 pode precisar ajuste |
| **P6** — Critérios de risco validados? | Critérios atuais são assumidos como corretos |
| **P1** — API TicketGo disponível? | Sprint 4 item 3.12 segue Cenário A (manual) |
| **P5** — Edições simultâneas? | Sprint 4 item 3.11 pode precisar de mais isolamento |
| **P10** — Data do próximo evento? | Define urgência real de cada sprint |
