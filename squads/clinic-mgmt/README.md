# Squad: clinic-mgmt — Clínica Anmar

**Gestão Inteligente para Clínica de Estética, Emagrecimento e Qualidade de Vida**

> Nome provisório: **Clínica Anmar** — a marca receberá rebranding e novo visual identity.

---

## O que este squad faz

Squad completo de orquestração IA para clínicas de estética, emagrecimento e saúde hormonal. Cobre toda a operação: atendimento médico assistido por voz, análise visual de evolução de pacientes, follow-up humanizado via WhatsApp, gestão financeira com DRE especializada e integração contábil automática com Conta Azul/Omie.

**Diferencial**: 9 agentes IA especializados eliminam burocracia, aumentam qualidade do cuidado e protegem contra os 60% de falências de clínicas por má gestão financeira.

---

## Quando usar

```
@clinic-chief [descrição em linguagem natural]
```

| Situação | Use Case | Agentes |
|---------|----------|---------|
| Abrir atendimento médico | UC-AN-001 | medical-ops + stock-controller |
| Cadastrar protocolo ou procedimento | UC-AN-002 | intake-coordinator |
| Ver evolução visual de paciente | UC-AN-003 | visual-analyst |
| Enviar follow-up / contato pós-consulta | UC-AN-004 | patient-care + chatbot-humanized |
| Gerar DRE ou relatório financeiro | UC-AN-005 | financial-intel + accounting-bridge |
| Controle de estoque / insumos | UC-AN-006 | stock-controller |
| Exportar para Conta Azul / emitir NF-e | UC-AN-007 | accounting-bridge |
| Cadastrar novo paciente | UC-AN-008 | intake-coordinator + patient-care |

---

## Agentes

### 🏥 clinic-chief (Tier 0 — Orquestrador)
Router central. Classifica use cases, verifica compliance LGPD, aciona agentes certos.  
**Ativar**: `@clinic-chief`

### 📋 intake-coordinator (Tier 1)
Cadastros: colaboradores, protocolos de tratamento, procedimentos, onboarding de pacientes.  
Calcula custo real de cada procedimento automaticamente.

### 🩺 medical-ops (Tier 1)
Consulta médica com transcrição de voz (Whisper). Preenche prontuário automaticamente.  
Compliance CFM 1821/2007. Assinatura digital ICP-Brasil.

### 💚 patient-care (Tier 1)
Follow-up personalizado por canal (WhatsApp, email, telefone). Régua de comunicação pós-consulta.  
Gera scripts para ligações. Alerta urgências para médico.

### 💰 financial-intel (Tier 1)
DRE especializada para clínica (por categoria, por procedimento, por médico).  
KPIs: ticket médio, CAC, margem por procedimento. Alertas de inadimplência e caixa.

### 📷 visual-analyst (Tier 2)
Análise de fotos corporais, comparativo before/after, predição visual de resultado.  
Dashboard de bioimpedância e métricas corporais. Relatório de evolução em PDF.

### 🔗 accounting-bridge (Tier 2)
Sincronização sem duplicatas com Conta Azul/Omie. Importa horas do Tangerino.  
Emissão de NF-e via NFe.io. Relatório para escritório de contabilidade.

### 📦 stock-controller (Tier 2)
Inventário de insumos e medicamentos. Dispensação rastreada (ANVISA).  
Baixa automática por procedimento. Projeção de compras por agenda.

### 💬 chatbot-humanized (Tier 3)
"Ana" — assistente digital da Clínica Anmar para WhatsApp/Web.  
Acompanha pacientes, coleta métricas, agenda consultas, escala para humano quando necessário.

---

## Skills

| Skill | Tecnologia | Agente |
|-------|-----------|--------|
| `voice-transcription` | OpenAI Whisper | medical-ops |
| `visual-body-analysis` | OpenAI Vision + GPT-4o | visual-analyst |
| `whatsapp-send` | Meta Graph API v19+ | chatbot-humanized, patient-care |
| `protocol-recommender` | Claude API | intake-coordinator |
| `dre-builder` | Claude API | financial-intel |
| `schedule-optimizer` | Claude API | clinic-chief |
| `stock-forecast` | Claude API | stock-controller |
| `lgpd-validator` | Claude API | clinic-chief |
| `digital-signature` | ICP-Brasil | medical-ops |
| `accounting-sync` | Conta Azul API | accounting-bridge |

---

## Integrações Necessárias

### Obrigatórias para Operação

| Serviço | Finalidade | Custo Aproximado |
|---------|-----------|-----------------|
| WhatsApp Business API (Meta) | Follow-up e chatbot | R$ 0,10-0,25/conversa |
| OpenAI API (Whisper + Vision) | Voz + análise visual | Pay-per-use ~U$ 0,01/min |
| Claude API (Anthropic) | Todos os agentes IA | Pay-per-token |
| Conta Azul ou Omie | Contabilidade/ERP | R$ 149-499/mês |
| Asaas ou Pagar.me | Gateway pagamento | % por transação |
| NFe.io | Emissão NF-e | R$ 0,15-0,50/NF |

### Opcionais

| Serviço | Finalidade |
|---------|-----------|
| Tangerino (Sólides) | Ponto eletrônico → custo hora |
| Firebase FCM | Push notifications mobile |
| SERPRO Integra Contador | Consulta CPF/CNPJ fiscal |

---

## Compliance

| Regulação | Status |
|-----------|--------|
| LGPD (Lei 13.709/2018) | ✅ Consentimento + RLS + auditoria |
| CFM Resolução 1821/2007 | ✅ Prontuário + assinatura digital |
| ANVISA | ✅ Rastreabilidade medicamentos por lote |
| ICP-Brasil | ✅ Assinatura digital prontuário |
| Sigilo Médico | ✅ Row Level Security no Supabase |

---

## Estrutura de Arquivos

```
squads/clinic-mgmt/
├── agents/
│   ├── clinic-chief.md          # Tier 0: Orquestrador
│   ├── intake-coordinator.md    # Tier 1: Cadastros
│   ├── medical-ops.md           # Tier 1: Atendimento médico
│   ├── patient-care.md          # Tier 1: Follow-up
│   ├── financial-intel.md       # Tier 1: Financeiro
│   ├── visual-analyst.md        # Tier 2: Análise visual
│   ├── accounting-bridge.md     # Tier 2: Contabilidade
│   ├── stock-controller.md      # Tier 2: Estoque
│   └── chatbot-humanized.md     # Tier 3: Chatbot paciente
├── tasks/
│   ├── open-medical-consultation.md
│   ├── register-treatment-protocol.md
│   ├── register-staff.md
│   ├── register-procedure.md
│   ├── follow-up-patient.md
│   ├── analyze-visual-evolution.md
│   ├── schedule-procedure.md
│   ├── generate-dre.md
│   └── integrate-accounting.md
├── templates/
│   ├── medical-consultation-summary.md
│   ├── financial-dre-template.md
│   ├── follow-up-contact-script.md
│   ├── patient-protocol-report.md
│   └── visual-evolution-report.md
├── data/
│   ├── brazilian-compliance.yaml
│   ├── integration-catalog.yaml
│   ├── procedure-taxonomy.yaml
│   └── financial-metrics.yaml
├── config.yaml
└── README.md
```

---

## Design Completo

Ver `DESIGN-CLINICA.md` na raiz do projeto para especificação completa da plataforma:
- Stack tecnológico (Next.js 15 + Supabase + React Native)
- Schema do banco de dados
- Módulos desktop e mobile
- Fases de implementação
- Métricas de sucesso

---

## Desenvolvimento

Squad desenvolvido com base em pesquisa de cases brasileiros de sucesso:
Belle Software, Belasis, QuarkClinic, Gestek, Ninsaúde Clinic, GestãoDS e Enkad.

Framework: **AIOX Squads v1.0** | Domínio: Healthcare Operations | Idioma: pt-BR
