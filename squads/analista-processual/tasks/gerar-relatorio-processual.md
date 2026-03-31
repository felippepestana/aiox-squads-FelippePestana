# Task: Gerar Relatório Processual

**ID:** `ap-gerar-relatorio`
**Executor:** `documentador-processual`
**Tier:** Tier Síntese
**Use Cases:** UC-AP-001, UC-AP-002, UC-AP-003
**Depends On:** `ap-sintetizar-analise`

## Overview

Consolida todos os outputs em relatório final Markdown estruturado e salva no workspace via `Write`. Suporta dois modos: `MODO_PROCESSUAL` para processos genéricos e `MODO_JURIDICO` para processos judiciais.

## Input

- Pacote de síntese do `ap-sintetizar-analise`
- Modo: MODO_PROCESSUAL ou MODO_JURIDICO

## Output

- Arquivo Markdown salvo no workspace
- Nome: `relatorio-[processo-slug]-[AAAA-MM-DD].md`
- Confirmação com caminho do arquivo

## Action Items

1. Detecte o modo (PROCESSUAL ou JURIDICO) pelo pacote recebido
2. **MODO_PROCESSUAL:** Popule template com sumário executivo, mapa de processo, maturidade, Top-5 riscos e roadmap 3 horizontes
3. **MODO_JURIDICO:** Popule template com identificação, resumo executivo, histórico, questões jurídicas, fundamentação, mérito, estratégia, orientações e conclusões
4. Em MODO_JURIDICO, adicione bloco `citacoes` ao final
5. Salve usando `Write` com nome no formato padrão
6. Confirme ao @analista-chefe com o caminho do arquivo salvo

## Acceptance Criteria

- [ ] Arquivo salvo via `Write` (não apenas exibido no chat)
- [ ] Todas as seções do template preenchidas
- [ ] Seções de agentes não ativados marcadas como `[SEÇÃO NÃO APLICÁVEL]`
- [ ] Bloco `citacoes` presente em MODO_JURIDICO
- [ ] Roadmap em 3 horizontes presente em MODO_PROCESSUAL
- [ ] Caminho do arquivo confirmado ao @analista-chefe (QG-AP-004)
