# DESIGN-CLINICA.md — Clínica Anmar: Plataforma de Gestão Inteligente

> **Nota**: "Anmar" é nome provisório. A marca receberá rebranding e novo visual identity em momento futuro. Todos os textos usam este placeholder até a definição oficial.

---

## 1. Conceito & Visão

**Plataforma completa de gestão para clínica de estética, emagrecimento e qualidade de vida, potencializada por multi-agentes IA.** Sistema integrado que conecta operações clínicas, atendimento médico, acompanhamento de pacientes, gestão financeira e análise visual — em uma única plataforma escalável, com desktop (browser), mobile para equipe e módulo humanizado para o paciente.

**Inspiração**: Cases brasileiros de sucesso analisados — Belle Software (Estética Hollywood), Belasis, QuarkClinic, Gestek, Ninsaúde Clinic, GestãoDS e Enkad — combinados com melhores práticas internacionais.

**Feeling**: Premium médico + SaaS moderno. Confiança clínica com calor humano. Dados ricos com interface limpa.

**Diferencial central**: Agentes IA orquestrados pelo framework AIOX que automatizam consultas, follow-up, análise visual, finanças e contabilidade — reduzindo trabalho manual e aumentando qualidade do cuidado.

---

## 2. Nomenclatura & Posicionamento

### Nome Provisório
**Clínica Anmar** — aguarda rebranding e novo visual identity.

### Taglines sugeridas (para validação com rebranding)
- "Sua evolução, cuidada com precisão."
- "Tecnologia que cuida de verdade."
- "Resultados visíveis. Ciência por trás."

### Público-alvo
- **Pacientes**: Adultos 28-55 anos, classe A/B, buscando emagrecimento, estética e bem-estar com respaldo médico
- **Operadores**: Médicos, enfermeiras, biomédicos, recepcionistas — uso diário na clínica
- **Gestores**: Sócios/diretores — visão financeira e estratégica

---

## 3. Cases de Sucesso — Referências Brasil

| Sistema | Diferencial | Insight aproveitado |
|---------|-------------|---------------------|
| **Belle Software** | Franquias estéticas (Estética Hollywood) | Módulo multi-unidade desde o início |
| **Belasis** | LGPD + ANVISA RDC nativo, WhatsApp automático | Compliance integrado, não adicionado depois |
| **QuarkClinic** | 210+ funcionalidades, contratos digitais | Orçamento e contrato no mesmo fluxo |
| **Ninsaúde Clinic** | API aberta, integração ERP real-time | API-first desde o design |
| **GestãoDS** | Prontuário endocrinologia (glicose, hormônios) | Campos especializados por especialidade |
| **Enkad** | Software para clínica de emagrecimento específico | Workflow emagrecimento/bioimpedância |
| **Clínica nas Nuvens** | Automação do agendamento ao prontuário | UX fluida sem fricção operacional |

**Insight crítico**: 60% das clínicas médicas fecham em 5 anos por má gestão financeira. A plataforma prioriza DRE e fluxo de caixa como cidadãos de primeira classe.

---

## 4. Design Language

### Estilo Visual
Inspiração: **Apple Health meets Linear** — precisão clínica com calor humano. Dados ricos, interface minimalista, hierarquia visual clara.

### Paleta de Cores
```css
:root {
  /* Brand — aguarda rebranding */
  --brand-primary: #0EA5A8;       /* Verde-aqua saúde */
  --brand-primary-dark: #0C8587;
  --brand-primary-light: #D0F0F0;
  --brand-gold: #C9A84C;          /* Dourado — premium */
  --brand-gold-light: #F5E6C3;

  /* Neutros */
  --gray-900: #0F172A;
  --gray-800: #1E293B;
  --gray-600: #475569;
  --gray-400: #94A3B8;
  --gray-200: #E2E8F0;
  --gray-100: #F1F5F9;
  --gray-50: #FAFAFA;

  /* Semântico */
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
  --purple: #8B5CF6;             /* Módulo hormonal */

  /* Backgrounds */
  --bg-app: #F8FAFC;
  --bg-card: #FFFFFF;
  --bg-sidebar: #0F172A;
  --bg-sidebar-active: rgba(14,165,168,0.15);
}
```

### Tipografia
- **Headings**: Inter 700/600 — autoridade e clareza
- **Body**: Inter 400/500 — leitura confortável
- **Dados clínicos**: JetBrains Mono — IDs, valores, códigos
- **Escala**: 12 / 14 / 16 / 18 / 24 / 32 / 40 / 48px

### Spatial System
- Base: 4px
- Escala: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 6px (sm), 8px (md), 12px (lg), 20px (xl), 9999px (pill)
- Card padding: 24px — Card padding compact: 16px
- Sidebar width: 260px (expandida), 72px (colapsada)

### Iconografia
- Biblioteca: **Lucide React** — consistência com shadcn/ui
- Módulos com ícone próprio na sidebar
- Status: badges pill com cores semânticas

### Motion
- Micro: 150ms ease-out
- Standard: 250ms ease-out
- Page transition: fade + translateY 8px→0, 300ms
- Loading: skeleton shimmer com gradiente sutil
- Feedback IA: pulse animation durante processamento

---

## 5. Arquitetura da Plataforma

### Diagrama de Alto Nível

```
┌──────────────────────────────────────────────────────────────────┐
│                         ANMAR PLATFORM                            │
│                                                                    │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────────────┐ │
│  │  WEB APP     │  │  STAFF MOBILE  │  │  PATIENT APP (PWA)    │ │
│  │  Next.js 15  │  │  React Native  │  │  Next.js PWA          │ │
│  │  Desktop+    │  │  Expo          │  │  Chat + Evolução       │ │
│  └──────┬───────┘  └───────┬────────┘  └──────────┬────────────┘ │
│         └─────────────────┬┴──────────────────────┘             │
│                            ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    API GATEWAY (tRPC + REST)                  │  │
│  │              Rate limiting • Auth • Validation               │  │
│  └────────────────────────┬────────────────────────────────────┘  │
│                            ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              AIOX AGENT ORCHESTRATOR (clinic-chief)          │  │
│  │  intake • medical-ops • patient-care • financial • visual    │  │
│  └────────────────────────┬────────────────────────────────────┘  │
│                            ↓                                       │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────────┐  │
│  │  Supabase    │  │  Redis Cache  │  │  Integrations Layer     │  │
│  │  DB+Auth+    │  │  + BullMQ     │  │  WhatsApp • Conta Azul │  │
│  │  Storage     │  │  Queue        │  │  Omie • Tangerino      │  │
│  └──────────────┘  └───────────────┘  └────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Plataformas

| Plataforma | Stack | Usuários |
|-----------|-------|----------|
| Web Desktop | Next.js 15 + React 19 | Médicos, enfermeiras, recepcionistas, gestores |
| Mobile Staff | React Native + Expo | Médicos e colaboradores em movimento |
| Patient PWA | Next.js PWA + Chat | Pacientes — acesso simplificado e humanizado |

---

## 6. Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 15 (App Router) • React 19 • TypeScript 5          │
│  Tailwind CSS 4 • Shadcn/UI • Lucide Icons                  │
│  TanStack Query • Zustand • React Hook Form + Zod           │
│  Recharts (dashboards) • React-PDF • React Native (Expo)    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  tRPC + Next.js API Routes • WebSocket (Supabase Realtime)  │
│  Zod schemas • Rate limiting (upstash/ratelimit)            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  AIOX AGENT RUNTIME                          │
│  Claude API (claude-sonnet-4-6) + LLM Gateway               │
│  OpenAI Whisper (transcrição voz)                           │
│  OpenAI Vision / AWS Rekognition (análise visual)           │
│  BullMQ + Redis (task queue)                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                               │
│  Supabase (Auth + PostgreSQL + Storage + Realtime)          │
│  Redis (Cache + Queue) • Cloudflare R2 (fotos/docs)         │
│  Resend (email) • Firebase FCM (push mobile)                │
│  NFe.io (NF-e) • Asaas ou Pagar.me (pagamentos)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Estrutura de Páginas & Layout

### Navegação Principal (Sidebar)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo Anmar]                                  [Perfil ▼]   │
├─────────────────────────────────────────────────────────────┤
│  SIDEBAR                    │  MAIN CONTENT                 │
│  ─────────────────          │                               │
│  ⊞  Dashboard               │  [Page Header + actions]      │
│  👥  Pacientes              │                               │
│  📅  Agenda                 │  [Content Area]               │
│  🩺  Atendimento            │                               │
│  📋  Protocolos             │                               │
│  📷  Análise Visual         │                               │
│  💊  Estoque                │                               │
│  ─────────────────          │                               │
│  💰  Financeiro             │                               │
│  📊  Relatórios             │                               │
│  ─────────────────          │                               │
│  ⚙️  Configurações          │                               │
│  👤  Colaboradores          │                               │
└─────────────────────────────────────────────────────────────┘
```

### Páginas Principais

#### Dashboard (`/`)
- KPIs: pacientes ativos, consultas hoje, receita mês, estoque crítico
- Próximos agendamentos (próximas 4h)
- Alertas: vencimentos, estoques, follow-ups pendentes
- Gráficos: receita semana, evolução de pacientes, procedimentos mais realizados
- Atividade recente

#### Pacientes (`/pacientes`)
- Lista com busca, filtros (tratamento, status, médico)
- Card do paciente: foto, nome, tratamento atual, próximo agendamento
- `/pacientes/[id]` — prontuário completo + tabs

#### Prontuário do Paciente (`/pacientes/[id]`)
```
Tabs: Resumo | Histórico | Tratamento | Análise Visual | Financeiro | Documentos
```
- **Resumo**: dados pessoais, anamnese, alertas, próximos procedimentos
- **Histórico**: timeline de consultas, procedimentos, contatos
- **Tratamento**: protocolo ativo, progresso, procedimentos pendentes/realizados
- **Análise Visual**: galeria de fotos com timeline, gráfico bioimpedância
- **Financeiro**: contratos, pagamentos, pendências
- **Documentos**: prontuários assinados, exames, receitas

#### Agenda (`/agenda`)
- Calendário semanal com drag-and-drop
- Multi-recurso: médico + sala + equipamento
- Filtros por profissional / sala / tipo de procedimento
- Quick-add de consulta/procedimento
- Integração com disponibilidade em tempo real

#### Atendimento Médico (`/atendimento/[id]`)
- Modo imersivo (full-screen)
- Assistente IA de voz (transcriçao ao vivo)
- Editor de prontuário com campos auto-preenchidos pela IA
- Revisão pré-assinatura
- Janela final: agendamento de próximos procedimentos

#### Análise Visual (`/visual`)
- Upload de foto + associação com paciente
- Predição visual de resultado (AI)
- Comparativo before/after deslizante
- Dashboard de métricas corporais (bioimpedância)

#### Estoque (`/estoque`)
- Inventário com alertas de mínimo
- Entrada/saída com rastreabilidade
- Projeção de compra baseada em agenda
- Histórico de dispensação por paciente

#### Financeiro (`/financeiro`)
- Fluxo de caixa (gráfico + tabela)
- A pagar / A receber
- DRE por período
- Centro de custo por procedimento
- Exportação para contabilidade

#### Configurações (`/configuracoes`)
- Clínica: dados cadastrais, brandings, horários
- Integrações: WhatsApp, Conta Azul/Omie, Tangerino, Gateway pagamento
- Agentes IA: configuração de comportamento, prompts
- Usuários/permissões
- Backup e LGPD

---

## 8. Módulos — Especificação Detalhada

### M1.2.1.1 — Cadastro de Colaboradores

**Objetivo**: Gestão completa do quadro de pessoal com controle de acesso granular.

**Dados cadastrais**:
- Pessoais: nome, CPF, RG, data nascimento, foto, endereço, contato
- Profissionais: cargo, especialidade, CRM/COREN/registro profissional, data admissão
- Acesso: nível de permissão, autenticação 2FA, horário de trabalho
- Contábil: vinculação Tangerino (ponto eletrônico), centro de custo, salário

**Níveis de acesso**:

| Nível | Módulos liberados |
|-------|-----------------|
| Admin | Tudo + configurações + contábil |
| Médico | Atendimento + prontuário + agenda própria + análise visual |
| Enfermeira | Agenda + estoque + follow-up + parte do prontuário |
| Recepcionista | Agenda + cadastro paciente + financeiro (recebimentos) |
| Visualizador | Apenas relatórios (read-only) |

**Integrações**: Tangerino (ponto) → centro de custo por hora trabalhada → DRE

---

### M1.2.1.2 — Cadastro de Tratamentos e Protocolos

**Objetivo**: Construção de trilhas/workflows de tratamento personalizáveis.

**Conceito de Protocolo**:
```
Protocolo "Emagrecimento Premium 12 Semanas"
├── Consulta inicial (Médico) — Semana 0
├── Avaliação corporal + bioimpedância (Enfermeira) — Semana 0
├── Coleta de exames — Semana 0 a 2 (domiciliar)
├── Aplicação de ozônio (Sala 2, 60min) — Semana 1, 3, 5...
├── Procedimento laser corporal (Equipamento A) — Semana 2, 4, 6...
├── Consulta de retorno (Médico) — Semana 4, 8, 12
└── Consulta de encerramento + fotos finais — Semana 12
```

**Tipos de step no protocolo**:
- `clinic_procedure` — procedimento na clínica (agenda + sala + equipamento + insumos)
- `home_medication` — medicamento administrado pelo paciente (notificação + rastreio)
- `exam` — exame laboratorial ou diagnóstico
- `teleconsult` — consulta remota
- `followup` — contato de acompanhamento

**Editor de protocolo**: Interface drag-and-drop com timeline visual.

**Configurações por step**:
- Duração / Intervalo sugerido
- Profissional responsável
- Sala/equipamento necessário
- Insumos (linked ao estoque)
- Medicamentos (dose, via, frequência)
- Custo estimado (auto-calculado)

---

### M1.2.1.2b — Cadastro de Procedimentos e Serviços

**Objetivo**: Base de dados mestre de todos os procedimentos comercializados.

**Ficha do Procedimento**:
```yaml
Procedimento: "Criolipólise Abdominal"
Categoria: Estética Corporal
Código interno: PROC-EST-001
Duração: 60 minutos
Sala/Equipamento: Sala 2 + CoolSculpting Elite
Profissional: Médico ou Enfermeira (configurável)
Insumos: [gel condutor 100ml, comp. gaze 2un, capa criolipólise 1un]
Custo real: R$ 85,00 (calculado de insumos + hora profissional + overhead)
Preço venda sugerido: R$ 450,00
Centro de custo: ESTÉTICA-CORPORAL
```

**Vinculações**:
- Financeiro: receita por procedimento → DRE
- Estoque: baixa automática de insumos ao realizar
- Agenda: bloqueio de recursos (sala + equipamento)
- Compras: projeção de necessidade baseada em agenda futura

---

### M1.2.1.3 — Módulo de Acompanhamento (Follow-Up)

**Objetivo**: Interação humanizada e contínua com o paciente após consulta.

**Fluxo de Follow-Up**:
```
Consulta finalizada
      ↓
[chatbot-humanized agent] cria régua de follow-up personalizada
      ↓
Dia 2: WhatsApp automático — "Como está se sentindo após a consulta?"
Dia 7: WhatsApp — check de medicação domiciliar + foto de evolução
Dia 14: Notificação para agendar próximo procedimento
Dia 30: Relatório de evolução + NPS
      ↓
Para pacientes que preferem telefone:
[patient-care agent] gera script personalizado para ligação
      ↓
Recepcionista realiza ligação + registra no prontuário
      ↓
Histórico completo no prontuário do paciente
```

**Canal preferido** (configurado pelo paciente):
- WhatsApp (bot + humano em escalada)
- Email
- Telefone (script IA para o colaborador)
- Push notification (app)

**Chatbot humanizado**:
- Personalidade adaptada ao DNA da clínica
- Escalada inteligente para humano quando necessário
- Reconhece contexto do paciente (tratamento, procedimentos realizados)
- Coleta métricas: peso, sintomas, satisfação
- Registra tudo automaticamente no prontuário

**Relatório de Follow-Up** (gerado pelo agente):
- Pacientes sem contato há N dias
- Respostas coletadas automaticamente
- Alertas: paciente reportando problema/dor → urgência para médico

---

### M1.2.1.4 — Módulo de Análise Visual

**Objetivo**: Visualização científica da evolução do paciente, predição de resultados e comparação before/after.

**Funcionalidades**:

#### Foto Baseline (Consulta Inicial)
- Protocolo de captura: frente, perfil D/E, detalhe
- Câmera integrada no app mobile (com guias visuais de posicionamento)
- Upload de foto pelo paciente (com validação de qualidade pela IA)
- Privacidade: acesso restrito (médico + paciente com consentimento LGPD)

#### Predição Visual de Resultado
- Input: foto baseline + protocolo selecionado
- Processamento: OpenAI Vision + modelos de referência públicos
- Output: imagem de resultado aproximado esperado
- Disclaimer médico obrigatório na visualização
- Uso: motivação do paciente + alinhamento de expectativas

#### Timeline de Evolução
- Comparação deslizante before/after
- Galeria cronológica com marcação de data e procedimento realizado
- Overlay de marcos do tratamento na linha do tempo
- Relatório PDF de evolução com fotos selecionadas

#### Métricas Corporais (Bioimpedância e afins)
- Campos: peso, IMC, % gordura, % músculo, % água, gordura visceral, metabolismo basal
- Gráficos de evolução temporal
- Alertas de meta atingida / fora da trajetória esperada
- Exportável para prontuário

---

### M1.2.1.5 — Módulo de Atendimento Médico

**Objetivo**: Consulta médica assistida por IA — transcrição automática, prontuário inteligente, agendamento integrado.

**Fluxo da Consulta**:
```
1. Médico abre consulta (autenticação PIN + paciente confirmado)
   ↓
2. [medical-ops agent] carrega histórico resumido do paciente
   ↓
3. Médico inicia gravação de voz (botão visível)
   ↓
4. [Whisper] transcreve em tempo real
   ↓
5. [medical-ops agent] extrai estruturadamente:
   - Queixas principais
   - Exame clínico
   - Hipóteses diagnósticas
   - Plano terapêutico
   - Medicações prescritas
   - Procedimentos solicitados
   ↓
6. Médico revisa e edita no editor (como Google Docs com AI suggestions)
   ↓
7. Médico assina digitalmente (ICP-Brasil ou assinatura avançada)
   ↓
8. Janela de "Próximos Passos":
   - Lista de procedimentos recomendados com datas sugeridas
   - Médico seleciona/ajusta
   - Agendamento automático (sala + equipamento + insumos)
   - Medicações domiciliares → régua de follow-up criada
   ↓
9. Prontuário salvo + histórico atualizado + estoque reservado
```

**Funcionalidades do Editor de Prontuário**:
- Template adaptativo por tipo de consulta (inicial, retorno, urgência)
- Campos especializados: hormonal, emagrecimento, estética, geral
- AI inline suggestions ("o paciente mencionou...")
- Alertas de contraindicações (cruzamento com histórico)
- Assinatura digital com timestamp e hash imutável
- Export PDF com cabeçalho da clínica (modelo CFM/TISS)

---

### M1.3.1 — Gestão Financeira

**Objetivo**: Visibilidade financeira completa e DRE especializada para clínica de saúde/estética.

**Módulos financeiros**:

#### Contas a Receber
- Contratos por paciente (parcelamento, recorrência)
- Gateway: Asaas ou Pagar.me (boleto, PIX, cartão)
- Alertas de vencimento e inadimplência
- Link de pagamento para paciente (WhatsApp/email)

#### Contas a Pagar
- Fornecedores de insumos
- Locação de equipamentos
- Folha (integrada com Tangerino)
- Impostos e obrigações

#### Centros de Custo por Procedimento
```
Receita bruta de "Criolipólise"
  - (-) Insumos utilizados
  - (-) Hora profissional (Tangerino → custo/hora)
  - (-) Overhead proporcional (aluguel, energia, equipamento)
  = Margem por procedimento
```

#### DRE Especializada (Demonstrativo de Resultado)
```
(+) Receita de Procedimentos Estéticos
(+) Receita de Consultas Médicas
(+) Receita de Medicamentos/Suplementos
(+) Receita de Programas/Protocolos
= RECEITA BRUTA

(-) Impostos sobre serviços (ISS/Simples)
= RECEITA LÍQUIDA

(-) CMV — Custo das Mercadorias/Serviços Vendidos
  (-) Insumos
  (-) Medicamentos dispensados
  (-) Hora profissional (médico + técnico)
= LUCRO BRUTO

(-) Despesas Operacionais
  (-) Folha administrativa
  (-) Aluguel
  (-) Energia + água
  (-) Marketing
  (-) Manutenção equipamentos
  (-) Sistemas/Software
(-) Depreciação de Equipamentos
= EBITDA

(-) Resultado financeiro (juros)
= LAIR

(-) IR/CSLL
= LUCRO LÍQUIDO
```

#### Dashboard Executivo
- Receita por tipo de serviço (gráfico pizza)
- Evolução mensal receita x despesa (gráfico linha)
- Ticket médio por paciente
- Custo de aquisição de paciente (CAC)
- Procedimentos mais rentáveis (margem %)
- Alertas: caixa abaixo de mínimo, inadimplência > N%

---

### M1.3.2 — Integração Contábil

**Objetivo**: Sincronização automática com ferramentas contábeis, eliminando lançamentos manuais.

**Integrações disponíveis**:

| Serviço | Função | API |
|---------|--------|-----|
| **Conta Azul** | ERP/contabilidade (recomendado para PME) | REST API com OAuth2 |
| **Omie** | ERP completo (alternativa enterprise) | REST API com chaves |
| **Tangerino (Sólides)** | Ponto eletrônico → custo hora | REST API |
| **NFe.io** | Emissão NF-e/NFS-e automatizada | REST API |
| **SERPRO Integra Contador** | Dados fiscais oficiais | OAuth2 gov |

**Regras de sincronização**:
- Idempotência: cada transação tem UUID interno — sem lançamentos duplicados
- Frequência: webhook em tempo real + reconciliação diária
- Mapeamento: plano de contas Anmar → plano de contas Conta Azul/Omie
- Auditoria: log de cada envio com status e response

**Relatório para Contabilidade**:
- Exportação mensal em formato padrão (CSV/XML)
- Conciliação bancária automatizada
- DRE em PDF para o escritório de contabilidade

---

## 9. AIOX Squad Architecture

### Squad: `clinic-mgmt`

```
squads/clinic-mgmt/
├── agents/
│   ├── clinic-chief.md        # Tier 0 — Orquestrador
│   ├── intake-coordinator.md  # Tier 1 — Cadastros + onboarding
│   ├── medical-ops.md         # Tier 1 — Atendimento médico + IA de voz
│   ├── patient-care.md        # Tier 1 — Follow-up + acompanhamento
│   ├── financial-intel.md     # Tier 1 — Financeiro + DRE
│   ├── visual-analyst.md      # Tier 2 — Análise visual + predição
│   ├── accounting-bridge.md   # Tier 2 — APIs contábeis externas
│   ├── stock-controller.md    # Tier 2 — Estoque + dispensação
│   └── chatbot-humanized.md   # Tier 3 — Chatbot paciente
├── tasks/ (9 tasks)
├── templates/ (5 templates)
├── data/ (4 arquivos)
├── config.yaml
└── README.md
```

### Tiers e Responsabilidades

```
Tier 0 — Orchestrator
  clinic-chief: Router principal, QA gates, síntese de módulos

Tier 1 — Masters (especializados por domínio)
  intake-coordinator: Cadastro colaboradores, protocolos, procedimentos
  medical-ops: Consulta médica com IA de voz, prontuário auto-preenchido
  patient-care: Follow-up humanizado, chatbot escalado, prontuário histórico
  financial-intel: Fluxo de caixa, DRE, alertas financeiros, contratos

Tier 2 — Specialists (foco técnico)
  visual-analyst: Análise foto, predição resultado, comparação evolução
  accounting-bridge: Sync com Conta Azul/Omie/Tangerino, NF-e
  stock-controller: Inventário, dispensação, projeção de compras

Tier 3 — Support (suporte transversal)
  chatbot-humanized: Bot WhatsApp/Web com escalonamento humano
```

### Skills do Squad

| Skill ID | Descrição | Agente principal |
|----------|-----------|-----------------|
| `voice-transcription` | Transcrição voz→texto via Whisper | medical-ops |
| `visual-body-analysis` | Análise foto corporal + predição | visual-analyst |
| `whatsapp-send` | Envio via WhatsApp Business API | chatbot-humanized |
| `protocol-recommender` | Sugestão de próximos procedimentos | intake-coordinator |
| `dre-builder` | Composição automática de DRE | financial-intel |
| `schedule-optimizer` | Otimização de agenda e recursos | clinic-chief |
| `stock-forecast` | Projeção de necessidade de insumos | stock-controller |
| `lgpd-validator` | Validação de conformidade LGPD | clinic-chief |
| `digital-signature` | Assinatura digital prontuário (ICP-Brasil) | medical-ops |
| `accounting-sync` | Sincronização com APIs contábeis | accounting-bridge |

### Use Cases Principais

| UC | Nome | Agentes ativados |
|----|------|-----------------|
| UC-AN-001 | Nova Consulta Médica | clinic-chief → medical-ops → stock-controller |
| UC-AN-002 | Cadastrar Protocolo | clinic-chief → intake-coordinator |
| UC-AN-003 | Análise Visual de Evolução | clinic-chief → visual-analyst |
| UC-AN-004 | Follow-up de Paciente | clinic-chief → patient-care → chatbot-humanized |
| UC-AN-005 | Gerar DRE | clinic-chief → financial-intel → accounting-bridge |
| UC-AN-006 | Controle de Estoque | clinic-chief → stock-controller |
| UC-AN-007 | Sincronização Contábil | clinic-chief → accounting-bridge |
| UC-AN-008 | Onboarding Paciente | clinic-chief → intake-coordinator → patient-care |

---

## 10. APIs & Integrações

### Mapa de Integrações

```
ANMAR PLATFORM
│
├── COMUNICAÇÃO
│   ├── WhatsApp Business API (Meta Graph API v19+)
│   │   └── Twilio como fallback/simplicidade
│   └── Firebase Cloud Messaging (push mobile)
│
├── FINANCEIRO
│   ├── Asaas API (pagamentos: PIX, boleto, cartão)
│   │   └── Pagar.me como alternativa
│   ├── NFe.io API (emissão NF-e / NFS-e)
│   └── SERPRO Integra Contador (dados fiscais)
│
├── CONTÁBIL / ERPS
│   ├── Conta Azul API (ERP contábil — recomendado)
│   └── Omie API (alternativa enterprise)
│
├── RH / PONTO
│   └── Tangerino API (ponto eletrônico → custo hora)
│
├── AI / MACHINE LEARNING
│   ├── Claude API (claude-sonnet-4-6) — agentes principais
│   ├── OpenAI Whisper API — transcrição voz consulta
│   └── OpenAI Vision API — análise fotos corporais
│
└── INFRA
    ├── Supabase (DB + Auth + Storage + Realtime)
    ├── Cloudflare R2 (storage fotos/documentos)
    └── Redis (cache + queues BullMQ)
```

### MCPs Utilizados

| MCP | Servidor | Uso |
|-----|---------|-----|
| Supabase MCP | já configurado | Database, auth, storage |
| Cloudflare MCP | já configurado | Deploy, CDN, R2 |
| GitHub MCP | já configurado | CI/CD |
| WhatsApp MCP | a configurar | Mensagens automáticas |
| Accounting MCP | a configurar | Bridge Conta Azul/Omie |

---

## 11. Banco de Dados — Schema Principal

```sql
-- ============================================================
-- CONFIGURAÇÃO DA CLÍNICA
-- ============================================================
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  settings JSONB DEFAULT '{}',  -- branding, integrações
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  name TEXT NOT NULL,
  address JSONB,
  active BOOLEAN DEFAULT true
);

-- ============================================================
-- USUÁRIOS E PERMISSÕES
-- ============================================================
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  clinic_id UUID REFERENCES clinics(id),
  branch_id UUID REFERENCES branches(id),
  full_name TEXT NOT NULL,
  cpf TEXT,
  professional_register TEXT,  -- CRM, COREN, etc.
  role TEXT NOT NULL,  -- admin, doctor, nurse, receptionist, viewer
  specialties TEXT[],
  tangerino_id TEXT,  -- integração ponto eletrônico
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PACIENTES
-- ============================================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  full_name TEXT NOT NULL,
  cpf TEXT,
  birth_date DATE,
  gender TEXT,
  contact JSONB,  -- phone, email, address, preferred_channel
  lgpd_consent BOOLEAN DEFAULT false,
  lgpd_consent_date TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patient_anamnesis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  data JSONB NOT NULL,  -- formulário customizável por especialidade
  filled_by UUID REFERENCES staff_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROCEDIMENTOS E PROTOCOLOS
-- ============================================================
CREATE TABLE procedure_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,  -- estética, emagrecimento, hormonal, funcional
  duration_minutes INTEGER,
  requires_doctor BOOLEAN DEFAULT false,
  equipment_ids UUID[],
  supply_items JSONB,  -- [{item_id, qty}]
  base_cost DECIMAL(10,2),
  suggested_price DECIMAL(10,2),
  cost_center TEXT,
  active BOOLEAN DEFAULT true
);

CREATE TABLE treatment_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  name TEXT NOT NULL,
  description TEXT,
  specialty TEXT,  -- emagrecimento, hormonal, estética
  duration_weeks INTEGER,
  steps JSONB NOT NULL,  -- array de protocol_steps
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES staff_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PACIENTE × PROTOCOLO (TRATAMENTOS ATIVOS)
-- ============================================================
CREATE TABLE patient_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  protocol_id UUID REFERENCES treatment_protocols(id),
  doctor_id UUID REFERENCES staff_profiles(id),
  start_date DATE,
  expected_end_date DATE,
  status TEXT DEFAULT 'active',  -- active, paused, completed, abandoned
  customizations JSONB,  -- ajustes individuais no protocolo
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INFRAESTRUTURA CLÍNICA (salas e equipamentos)
-- ============================================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  name TEXT NOT NULL,
  type TEXT,  -- consultation_room, procedure_room, recovery_room
  capacity INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true
);

CREATE TABLE equipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  name TEXT NOT NULL,
  category TEXT,  -- laser_energy, body_contouring, diagnostic, infusion
  model TEXT,
  serial_number TEXT,
  last_maintenance_at DATE,
  active BOOLEAN DEFAULT true
);

-- ============================================================
-- AGENDA
-- ============================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  patient_id UUID REFERENCES patients(id),
  treatment_id UUID REFERENCES patient_treatments(id),
  staff_id UUID REFERENCES staff_profiles(id),
  room_id UUID REFERENCES rooms(id),
  equipment_id UUID REFERENCES equipments(id),
  type TEXT,  -- consultation, procedure, followup
  procedure_id UUID REFERENCES procedure_catalog(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'scheduled',  -- scheduled, confirmed, in_progress, done, cancelled, no_show
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ATENDIMENTO MÉDICO / PRONTUÁRIO
-- ============================================================
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES staff_profiles(id),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  transcript TEXT,  -- transcrição bruta Whisper
  structured_data JSONB,  -- dados extraídos pela IA (anamnese, plano, prescrição)
  final_notes TEXT,  -- revisado pelo médico
  digital_signature TEXT,  -- hash ICP-Brasil
  signature_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANÁLISE VISUAL
-- ============================================================
CREATE TABLE patient_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  treatment_id UUID REFERENCES patient_treatments(id),
  photo_type TEXT,  -- baseline, evolution, final, prediction
  view_angle TEXT,  -- front, side_right, side_left, back, detail
  storage_path TEXT NOT NULL,
  taken_by UUID REFERENCES staff_profiles(id),
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  ai_analysis JSONB,  -- resultado da análise automática
  approved_by UUID REFERENCES staff_profiles(id)
);

CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  treatment_id UUID REFERENCES patient_treatments(id),
  measured_at DATE NOT NULL,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,1),
  bmi DECIMAL(4,2),
  body_fat_pct DECIMAL(4,2),
  muscle_mass_pct DECIMAL(4,2),
  water_pct DECIMAL(4,2),
  visceral_fat INTEGER,
  basal_metabolism INTEGER,
  raw_data JSONB,  -- dados completos da balança/bioimpedância
  recorded_by UUID REFERENCES staff_profiles(id)
);

-- ============================================================
-- ESTOQUE
-- ============================================================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  code TEXT,
  name TEXT NOT NULL,
  category TEXT,  -- medication, supply, equipment_consumable
  unit TEXT,
  current_stock DECIMAL(10,3) DEFAULT 0,
  min_stock DECIMAL(10,3),
  unit_cost DECIMAL(10,4),
  supplier_info JSONB,
  anvisa_register TEXT,  -- rastreabilidade ANVISA
  active BOOLEAN DEFAULT true
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory_items(id),
  movement_type TEXT,  -- in, out_procedure, out_dispensation, adjustment
  quantity DECIMAL(10,3) NOT NULL,
  reference_id UUID,  -- appointment_id ou purchase_order_id
  reference_type TEXT,  -- 'appointment' | 'purchase_order' (discriminador para referência polimórfica)
  patient_id UUID REFERENCES patients(id),
  moved_by UUID REFERENCES staff_profiles(id),
  unit_cost DECIMAL(10,4),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FOLLOW-UP / COMUNICAÇÃO
-- ============================================================
CREATE TABLE followup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  treatment_id UUID REFERENCES patient_treatments(id),
  trigger_type TEXT,  -- post_consultation, periodic, milestone
  scheduled_at TIMESTAMPTZ,
  channel TEXT,  -- whatsapp, email, phone, push
  status TEXT DEFAULT 'pending',
  message_template TEXT,
  sent_at TIMESTAMPTZ,
  response JSONB,
  recorded_by UUID REFERENCES staff_profiles(id)
);

CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  channel TEXT,
  external_id TEXT,  -- ID no WhatsApp/email
  messages JSONB,  -- array de mensagens com timestamp, sender, content
  last_message_at TIMESTAMPTZ,
  handled_by UUID REFERENCES staff_profiles(id)
);

-- ============================================================
-- FINANCEIRO
-- ============================================================
CREATE TABLE financial_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  treatment_id UUID REFERENCES patient_treatments(id),
  total_amount DECIMAL(12,2),
  payment_plan JSONB,  -- parcelas, datas, forma de pagamento
  gateway_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  type TEXT,  -- revenue, expense
  category TEXT,
  subcategory TEXT,
  amount DECIMAL(12,2) NOT NULL,
  reference_date DATE NOT NULL,
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'pending',  -- pending, paid, overdue, cancelled
  description TEXT,
  cost_center TEXT,
  patient_id UUID REFERENCES patients(id),
  procedure_id UUID REFERENCES procedure_catalog(id),
  gateway_id TEXT,
  accounting_export_id UUID,  -- controle de sync contábil
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounting_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT,  -- conta_azul, omie
  period TEXT,  -- YYYY-MM
  exported_at TIMESTAMPTZ,
  status TEXT,
  response_data JSONB,
  error_log TEXT
);
```

---

## 12. Módulo Mobile

### Staff Mobile (React Native + Expo)

**Funcionalidades prioritárias**:
- Agenda do dia (view simplificada)
- Abertura de atendimento médico (voz + prontuário)
- Consulta de prontuário do paciente
- Estoque: entrada/saída rápida com câmera (código de barras)
- Notificações de alertas urgentes

**Stack**: React Native New Architecture + Expo SDK 52 + tRPC client

### Patient PWA (Next.js)

**Funcionalidades prioritárias**:
- Meus agendamentos e histórico
- Chat com a clínica (chatbot IA + escalada humana)
- Minhas fotos de evolução (galeria privada)
- Métricas corporais e gráficos
- Documentos e prontuários (com consentimento)
- Notificações de follow-up e lembretes

**Stack**: Next.js 15 PWA + Service Worker + Web Push + IndexedDB (offline)

---

## 13. Compliance & Segurança

| Regulação | Como atendemos |
|-----------|---------------|
| **LGPD** | Consentimento explícito, direito de exclusão, log de acessos, DPO configurável |
| **CFM Res. 1821/2007** | Prontuário eletrônico com hash imutável, assinatura digital, retenção 20 anos |
| **ANVISA** | Rastreabilidade de insumos/medicamentos por lote e paciente |
| **CFM** | Campos obrigatórios de prontuário, impossibilidade de edição pós-assinatura |
| **Simples Nacional** | Cálculo automático de impostos, DAS, relatórios DEFIS |

**Segurança técnica**:
- Criptografia AES-256 dados em repouso
- TLS 1.3 em trânsito
- Row Level Security (RLS) no Supabase por clínica/usuário
- Audit trail imutável (tabela append-only)
- Backup automático diário, retenção 5 anos
- 2FA obrigatório para médicos e administradores

---

## 14. Fases de Implementação

### Fase 1 — Fundação (Semanas 1-3)
- [ ] Next.js 15 setup + TypeScript + Tailwind + Shadcn
- [ ] Supabase: schema base + autenticação + RLS
- [ ] Design system: tokens, componentes base, sidebar, layout
- [ ] Módulo Cadastro de Colaboradores (M1.2.1.1)
- [ ] CI/CD pipeline GitHub Actions

### Fase 2 — Núcleo Clínico (Semanas 4-7)
- [ ] Cadastro de Procedimentos e Serviços (M1.2.1.2b)
- [ ] Cadastro de Tratamentos e Protocolos (M1.2.1.2)
- [ ] Agenda integrada (recursos: sala + equipamento + profissional)
- [ ] Controle de estoque básico

### Fase 3 — Atendimento Inteligente (Semanas 8-10)
- [ ] Módulo de Atendimento Médico com IA de voz (M1.2.1.5)
- [ ] Prontuário eletrônico com assinatura digital
- [ ] Módulo de Análise Visual — fotos + bioimpedância (M1.2.1.4)
- [ ] Predição visual de resultado (OpenAI Vision)

### Fase 4 — Engajamento & Financeiro (Semanas 11-13)
- [ ] Chatbot humanizado + WhatsApp Business API
- [ ] Módulo de Follow-Up (M1.2.1.3)
- [ ] Gestão Financeira + DRE (M1.3.1)
- [ ] Integração Conta Azul / Omie (M1.3.2)
- [ ] Emissão NF-e via NFe.io

### Fase 5 — Mobile & Polish (Semanas 14-16)
- [ ] Staff Mobile App (React Native + Expo)
- [ ] Patient PWA com chat e evolução
- [ ] Performance optimization (Core Web Vitals)
- [ ] Acessibilidade WCAG AA
- [ ] Testes E2E (Playwright)

### Fase 6 — Deploy & Go-Live (Semanas 17-18)
- [ ] Docker + Nginx + VPS (Hostinger ou Railway)
- [ ] SSL/TLS + CDN (Cloudflare)
- [ ] Monitoramento: Sentry + UptimeRobot + logs
- [ ] Treinamento da equipe da clínica
- [ ] Go-live com dados reais

### Fase 2 da Solução (Futuro — pós go-live)
- **M1.4 — Marketing & Mídia**: CRM, jornada do paciente, campanhas, ROI, captação
- **M1.5 — Ferramentas de Interação**: portal paciente avançado, telemedicina, comunidade

---

## 15. Métricas de Sucesso

| Métrica | Meta | Medição |
|---------|------|---------|
| Tempo de abertura de consulta | < 30s | Média end-to-end |
| Acurácia do prontuário automático | > 90% | Revisão pelo médico |
| Taxa de abertura de follow-up (WhatsApp) | > 70% | Mensagens abertas |
| Redução tempo administrativo | > 40% | Survey com equipe |
| DRE disponível em | < 1 minuto | Tempo de geração |
| Uptime | > 99.5% | Monitoring |
| NPS do paciente | > 70 | In-app survey |
| Sincronização contábil | 0 erros de duplicata | Audit log |

---

## 16. Estrutura de Diretórios (Projeto)

```
anmar-platform/
├── apps/
│   ├── web/                    # Next.js 15 — desktop
│   ├── mobile/                 # React Native + Expo — staff
│   └── patient/                # Next.js PWA — paciente
├── packages/
│   ├── ui/                     # Design system compartilhado
│   ├── db/                     # Supabase types + client
│   ├── agents/                 # AIOX agent runtime
│   │   ├── clinic-chief.md
│   │   ├── intake-coordinator.md
│   │   ├── medical-ops.md
│   │   ├── patient-care.md
│   │   ├── financial-intel.md
│   │   ├── visual-analyst.md
│   │   ├── accounting-bridge.md
│   │   ├── stock-controller.md
│   │   └── chatbot-humanized.md
│   └── integrations/
│       ├── whatsapp/
│       ├── conta-azul/
│       ├── omie/
│       ├── tangerino/
│       ├── nfe-io/
│       └── asaas/
├── infra/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── .github/workflows/
└── docs/
    └── DESIGN-CLINICA.md      # Este arquivo
```

---

*DESIGN-CLINICA.md — Clínica Anmar — Squad AIOX clinic-mgmt — v1.0.0*
*Desenvolvido com framework AIOX Squads | Cases: Belle Software, Belasis, QuarkClinic, Gestek, Enkad*
