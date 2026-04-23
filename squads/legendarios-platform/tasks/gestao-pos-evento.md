# Task: Gestão Pós-Evento e Comunidade Alumni

**Task ID:** `lp-gestao-pos-evento`
**Versão:** 1.0
**Agente Executor:** `community-master` + `crm-manager`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-004
**Comando:** `*pos-evento [cidade] [data_evento] [num_participantes]`

---

## Objetivo

Criar plano completo de gestão pós-evento: sequência de retenção alumni, segmentação
para cross-sell (REM/LEGADO), programa de indicação, coleta de depoimentos e
estruturação do RPM mensal da cidade.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento realizado |
| data_evento | date | Sim | Data de término do evento |
| num_participantes | integer | Sim | Participantes presentes no D-day |
| segmentacao_disponivel | boolean | Não | Se formulário de inscrição tem dados de perfil |

## Precondições

- [ ] Evento concluído
- [ ] Lista de participantes disponível
- [ ] Dados do formulário de inscrição (status conjugal, filhos) disponíveis
- [ ] QG-LP-001 confirmado (briefing de contexto)

## Passos

1. **Segmentar base** — usar dados do formulário: casado com filhos / casado sem filhos / pai solteiro / solteiro jovem
2. **Criar sequência de retenção** — timeline D+0 a D+90, por segmento
3. **Acionar @crm-manager** — scoring de engajamento, cross-sell detalhado
4. **Definir coleta de depoimentos** — D+3 via WhatsApp (áudio), D+14 via email (texto)
5. **Criar programa de indicação** — "Traga um Lendário" com links UTM individuais
6. **Estruturar RPM local** — data, local, formato, frequência mensal
7. **Definir cross-sell timeline** — REM (D+14-21), LEGADO (D+30-45), próximo TOP (D+60)
8. **Calcular LTV potencial** — por segmento e total da base
9. **Salvar plano via Write** — `plano-alumni-[cidade-slug]-[AAAA-MM].md`
10. **Retornar ao @legendarios-chief** com caminho e resumo

## Output

- **Local:** `plano-alumni-[cidade-slug]-[AAAA-MM].md`
- **Formato:** Markdown com timeline e tabelas
- **Seções:**
  - Segmentação da base (tabela por perfil)
  - Sequência de retenção D+0 a D+90 (mensagens prontas)
  - Cross-sell por segmento (REM, LEGADO, próximo TOP)
  - Programa de indicação (mecânica + benefícios)
  - Plano de coleta de depoimentos
  - Estrutura do RPM mensal
  - LTV potencial estimado da base

## Condições de Veto (auto-FAIL)

- Enviar oferta de REM sem confirmar que participante é casado
- Enviar oferta de LEGADO sem confirmar que participante tem filhos
- Omitir RPM mensal do plano de comunidade
- Coletar depoimentos após D+7 como primeira ação (janela de ouro é D+3)

## Critérios de Aceite

- [ ] Base segmentada em pelo menos 4 grupos com perfis distintos
- [ ] Sequência de retenção de D+0 a D+90 com mensagens prontas
- [ ] Cross-sell apenas para segmentos qualificados
- [ ] Programa de indicação com links UTM e mecânica definida
- [ ] Meta de coleta de depoimentos: 40%+ dos participantes
- [ ] RPM mensal estruturado (data, local, formato)
- [ ] LTV estimado da base calculado
- [ ] Arquivo salvo via Write (QG-LP-004)
