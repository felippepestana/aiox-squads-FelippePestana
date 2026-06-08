# Task: Instruir/Tramitar Processo Administrativo (SEI)

**ID:** `pd-instruir-processo`
**Executor:** `gestor-processo-adm`
**Tier:** Tier 1
**Use Cases:** UC-PD-001

## Overview
Estrutura o trâmite de um processo administrativo no padrão SEI: etapas, atores, prazos, despachos e checklist de instrução.

## Input
- Tipo de processo e secretaria responsável
- Documentos já existentes no workspace (Glob/Read)

## Output
- Mapa de tramitação (etapas × unidade × entrada/saída × prazo × decisão)
- Despachos necessários (template despacho-processual-tmpl.md)
- Checklist de instrução por tipo de processo

## Action Items
1. Classifique o tipo de processo e identifique a unidade competente (consultor-secretarias)
2. Monte o mapa de tramitação em ordem cronológica
3. Insira pontos de verificação orçamentária (controlador-orcamentario) e de publicação (editor-diario-oficial) quando aplicáveis
4. Redija os despachos de encaminhamento/instrução/decisão
5. Marque etapas com informação incompleta com [PREENCHER:]

## Acceptance Criteria
- [ ] Mapa de tramitação completo com atores e prazos
- [ ] Checklist de instrução adequado ao tipo de processo
- [ ] Pontos de orçamento e publicidade sinalizados
