# Integração AIOX Squads — Análise Processual Jurídica

**Data:** 14.05.2026  
**Squad:** analista-processual v1.0.0  
**Modo:** JURIDICO (Análise Estratégica + Minutas Defensivas)  
**Casos:** 3 processos (Cobrança, Trabalhista, Responsabilidade Civil)

---

## 📋 Visão Geral

Este documento descreve como usar o squad **analista-processual** (AIOX) para análise automatizada dos 3 processos judiciais com data final 14.05 e geração de estratégias defensivas.

**Squad disponível em:** `/squads/analista-processual/`

### Arquitetura do Squad

```
                    analista-chefe (Orchestrator)
                           |
              ┌───────────────┬─────────────┐
              |              |              |
         TIER 0         TIER 1        TIER SÍNTESE
              |              |
    - Mapeamento      - Leitura de peças
    - Avaliação       - Pesquisa jurídica
                     - Estratégia
                     - Orientação
                                           |
                              - Documentação
```

---

## 🎯 Agentes Disponíveis (8 total)

| Tier | Agente | Especialidade | Tarefas |
|------|--------|---------------|---------|
| **Orchestrator** | `analista-chefe` | Classificação, roteamento, quality gates | UC-AP-002 |
| **Tier 0** | `mapeador-processual` | Mapeamento BPMN: etapas, atores, decisões | Mapeamento |
| **Tier 0** | `avaliador-processual` | Avaliação: maturidade 0-5, Top-5 riscos | Avaliação |
| **Tier 1** | `leitor-de-pecas` | Extração: 7 categorias estruturadas | Leitura |
| **Tier 1** | `pesquisador-juridico` | Jurisprudência STF/STJ/TST, súmulas | Pesquisa |
| **Tier 1** | `estrategista-processual` | 3 cenários (pessimista/realista/otimista) | Estratégia |
| **Tier 1** | `advogado-orientador` | Ações urgentes, plano 4-8 semanas | Orientação |
| **Síntese** | `documentador-processual` | Relatório + minutas + citações | Documentação |

---

## 🚀 Como Usar

### Opção 1: Ativar o Orchestrator (Recomendado)

```
@analista-processual:analista-chefe

Demanda:
Analisar os 3 processos com data final 14.05.2026:
1. Ação de Cobrança (comercial)
2. Rescisão Indireta (trabalhista — CRÍTICO)
3. Responsabilidade Civil (acidente)

Modo: JURIDICO
Objetivo: Estratégias defensivas + minutas de contestação
```

### Opção 2: Agentes Específicos

#### Apenas Mapeamento
```
@analista-processual:mapeador-processual
Mapear os 3 processos judiciais em formato BPMN
```

#### Apenas Pesquisa Jurídica
```
@analista-processual:pesquisador-juridico
Pesquisar jurisprudência sobre:
- Ações de cobrança (prazos, defesas cabíveis)
- Rescisão indireta (direitos do empregado)
- Responsabilidade civil (culpa compartilhada)
```

#### Apenas Estratégia
```
@analista-processual:estrategista-processual
Desenvolver 3 cenários (% de sucesso) para cada processo
```

---

## 📊 Casos de Exemplo (14-05-2026)

### Caso 1: Ação de Cobrança (Comercial)

**Dados:**
- Valor reclamado: R$ 45.000,00 (+ juros/correção)
- Contrato: Serviço de consultoria, não finalizado
- Defesa possível: Vício do serviço, CC 476

**Análise esperada:**
- Mapeamento: 5 etapas (propositura → citação → contestação → prova → sentença)
- Risco: 2/5 (defesa viável)
- Estratégia: Impugnar débito, propor acordo R$ 20.000

---

### Caso 2: Rescisão Indireta (Trabalhista)

**Dados:**
- Salários atrasados: 3 meses
- CTPS não registrada
- Jornadas excessivas (sem EPI)

**Análise esperada:**
- Mapeamento: 6 etapas (protocolo → reclamação → audiência → decisão)
- Risco: ⚠️ **4.5/5 CRÍTICO** (jurisprudência desfavorável)
- Estratégia: Acordo R$ 60-70k (CTPS + retroativo)

---

### Caso 3: Responsabilidade Civil (Acidente)

**Dados:**
- Dano material: R$ 35.000,00
- Dano moral: R$ 45.000,00
- Culpa compartilhada: 30% (defesa) / 70% (terceiro)

**Análise esperada:**
- Mapeamento: 4 etapas (ação → resposta → prova → sentença)
- Risco: 2.5/5 (jurisprudência favorável para culpa compartilhada)
- Estratégia: Impugnar danos morais, reduzir a R$ 15.000 (STJ)

---

## 🔄 Workflow Completo (UC-AP-002)

**Fases Automáticas:**

| Fase | Executor | Ação | Tempo |
|------|----------|------|-------|
| PHASE-1 | analista-chefe | Classificar como UC-AP-002 | 2 min |
| PHASE-2 | (Paralelo) | Ler peças + Pesquisar jurisprudência | 10 min |
| PHASE-3 | (Sequencial) | Estratégia + Plano de ação | 10 min |
| PHASE-4 | analista-chefe | Consolidar outputs | 3 min |
| PHASE-5 | documentador-processual | Gerar relatório + minutas | 5 min |

**Tempo Total Estimado:** 15-40 minutos

---

## 📄 Outputs Esperados

### 1. Relatório Jurídico (MODO_JURIDICO)
- Resumo executivo
- Análise de risco (0-5)
- Jurisprudência aplicável (mín. 5 fontes)
- 3 cenários com probabilidades
- Plano de ação 4-8 semanas
- Bloco de citações rastreadas

### 2. Minutas Defensivas (Automaticamente Geradas)
- `MINUTA-01-CONTESTACAO-COBRANCA.md` (Preliminares + Mérito)
- `MINUTA-02-CONTESTACAO-TRABALHISTA.md` (5 pontos + Proposta)
- `MINUTA-03-CONTESTACAO-RESPONSABILIDADE-CIVIL.md` (Culpa + Danos)

### 3. Checklists de Execução
- Prazos processuais
- Documentos necessários
- Contatos (tribunal, partes)
- Próximas ações

---

## ✅ Quality Gates

| Gate | Critério | Responsável |
|------|----------|-------------|
| QG-AP-001 | UC-AP-002 definido | analista-chefe |
| QG-AP-002 | Mapeamento completo (etapas + atores) | mapeador-processual |
| QG-AP-003 | Score 0-5 + Top-5 riscos | avaliador-processual |
| QG-AP-004 | Relatório salvo + citações rastreadas | documentador-processual |

---

## 🛠️ Integração com Aplicação Web

### API de Análise

```typescript
// /api/analises/[id]/aiox-analise
POST /api/analises/{analysisId}/aiox-analise

Request:
{
  "processType": "cobranca|trabalhista|civil",
  "documents": ["doc1", "doc2"],
  "mode": "JURIDICO",
  "workflowId": "wf-analise-completa"
}

Response:
{
  "status": "PROCESSING",
  "jobId": "job-14-05-001",
  "estimatedTime": "20-40 min",
  "phases": [
    { "id": "PHASE-1", "status": "COMPLETED" },
    { "id": "PHASE-2", "status": "IN_PROGRESS" },
    ...
  ]
}
```

### Página de Análise AIOX

```
/dashboard/analises/[id]/aiox-analysis

Seções:
- Timeline do workflow (5 fases)
- Relatório jurídico (expandível)
- 3 cenários (tabs)
- Minutas geradas (download)
- Quality gates (checklist)
- Próximas ações
```

---

## 📞 Contato & Suporte

- **Squad:** `analista-processual` v1.0.0
- **Orchestrator:** `analista-chefe`
- **Config:** `/squads/analista-processual/config.yaml`
- **Docs:** `/squads/analista-processual/ARCHITECTURE.md`

---

## 📌 Próximos Passos

1. ✅ Usar orchestrator com casos 14-05-2026
2. ✅ Gerar relatórios jurídicos automáticos
3. ✅ Integrar API com `/dashboard/analises/[id]`
4. ⏳ Adicionar modo PROCESSUAL para análise operacional
5. ⏳ Dashboard de métricas (taxa de sucesso, tempo, custos)

---

**Última atualização:** 14.05.2026  
**Status:** Pronto para uso  
**Próxima revisão:** 21.05.2026
