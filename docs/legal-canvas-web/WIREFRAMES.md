# WIREFRAMES LOW-FIDELITY — LEGAL CANVAS WEB (MVP)

**Versão:** 1.0
**Origem:** BLUEPRINT.md v1.0 + PRD_MVP.md + FLUXOS_NAVEGACAO.md
**Objetivo:** referência estrutural (não visual) para o protótipo high-fidelity e o design system. Nomenclatura provisória — identidade visual pendente (decisão nº 9 do blueprint).

---

## W-01 — DASHBOARD LEGAL CANVAS (home autenticada)

A geometria segue a matriz Legal Canvas de 15 blocos. Linha superior: parcerias e operação; centro: Espírito/Diferenciais/Modelo de Negócio; direita: mercado e cliente; base: custo e receita.

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ [☰] LegalCanvas  [Org ▾][Workspace ▾][Versão: Atual ▾]   [🔍 Busca]  [🔔3] [+ Criar ▾] [👤] │
├──────────┬───────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR  │  [Filtros: Período ▾ Responsável ▾ Etiqueta ▾ Status ▾ Confid. ▾]  [⛶][−][100%][+] │
│          │ ┌──────────┬──────────┬──────────┬───────────┬──────────┬───────────────┐ │
│ ▣ Visão  │ │ EQUIPE   │ ATIVID.  │ AÇÕES    │ ESPÍRITO  │ RELAC.   │ SEGMENTO      │ │
│   Geral  │ │ (4) [+]  │ CHAVE(6) │ ESTRAT.  │ (2) [+]   │ CLIENTES │ DO CLIENTE    │ │
│ ● Equipe4│ │ ▬▬▬ ▬▬▬  │ [+]      │ (5)❗[+]  │ ▬▬▬       │ (3) [+]  │ (2) [+]       │ │
│ ● Parcei2│ │ ▬▬▬ ▬▬▬  │ ▬▬▬ ▬▬▬  │ ▬▬▬ ▬▬▬  │ ▬▬▬       │ ▬▬▬ ▬▬▬  │ ▬▬▬ ▬▬▬       │ │
│ ● Ativ. 6│ ├──────────┤ ▬▬▬ ▬▬▬  │ ▬▬▬ ▬▬▬  ├───────────┤ ▬▬▬      │               │ │
│ ● Ações5❗│ │ PARCEIROS│ ▬▬▬ [+2] │ ▬▬▬      │ DIFERENC. ├──────────┤               │ │
│ ● Recur.3│ │ (2) [+]  ├──────────┴──────────┤ (3) [+]   │ MARKETING│               │ │
│ ● Espír.2│ │ ▬▬▬ ▬▬▬  │ RECURSOS (3) [+]    │ ▬▬▬ ▬▬▬   │ JURÍDICO │               │ │
│ ● Difer.3│ │          │ ▬▬▬ ▬▬▬ ▬▬▬         │ ▬▬▬       │ (4)❗[+]  │               │ │
│ ● Modelo1│ │          │                     ├───────────┤ ▬▬▬ ▬▬▬  ├───────────────┤ │
│ ● Relac.3│ │          │                     │ MODELO DE │ ▬▬▬ ▬▬▬  │ MERCADO       │ │
│ ● Mktg 4❗│ │          │                     │ NEGÓCIO(1)├──────────┤ JURÍDICO      │ │
│ ● Merc. 2│ │          │                     │ [+]  ▬▬▬  │ PRODUTOS │ (2) [+]       │ │
│ ● Prod. 5│ │          │                     │           │ E SERV.  │ ▬▬▬ ▬▬▬       │ │
│ ● Segm. 2│ │          │                     │           │ (5) [+]  │               │ │
│ ● Custo 4│ ├──────────┴─────────────────────┴───────────┴──────────┴───────────────┤ │
│ ● Recei.3│ │ ESTRUTURA DE CUSTO (4) [+]        │ FONTES DE RECEITA (3) [+]         │ │
│ ─────────│ │ ▬▬▬ ▬▬▬ ▬▬▬ ▬▬▬                   │ ▬▬▬ ▬▬▬ ▬▬▬                       │ │
│ ⚙ Workfl.│ └───────────────────────────────────┴───────────────────────────────────┘ │
│ ☑ Tarefas│   [Minimapa ▦]                    Autosave: ✓ salvo às 14:32               │
│ 📅 Agenda │                                                                           │
│ 📈 Indic. │                                                                           │
│ 📄 Relat. │                                                                           │
│ 🗂 Arquiv.│                                                                           │
│ ⚙ Config.│                                                                           │
└──────────┴───────────────────────────────────────────────────────────────────────────┘
Legenda: ▬▬▬ = post-it · (N) = contagem de itens ativos · ❗ = pendência vencida/alerta
         [+2] = pilha colapsada (RN-CAN-01) · [+ Criar ▾] = post-it/iniciativa/tarefa/evento
```

**Comportamentos-chave:** duplo clique no bloco cria post-it (RF-CAN-04); arrastar reposiciona com persistência (RF-CAN-05); arrastar para outro bloco abre modal de confirmação (RF-CAN-06); clique no post-it abre W-02.

---

## W-02 — POST-IT + DRAWER DE DETALHES

```text
Post-it (frente, no Canvas):              Drawer lateral (480px, sobre o Canvas):
┌───────────────────────┐   ┌─────────────────────────────────────────────┐
│ ● Alta   ⚠ vence 2d   │   │ [✕]  AÇÕES ESTRATÉGICAS · Em execução ▾     │
│ Lançar consultoria    │   │ ─────────────────────────────────────────── │
│ tributária p/ PMEs    │   │ Lançar consultoria tributária p/ PMEs  [✎] │
│ ▓▓▓▓▓░░░░░ 45%        │   │                                             │
│ [👤AB]        [🏷 2]   │   │ [Detalhes] [Atividade] [Comentários (3)]    │
└───────────────────────┘   │                                             │
                            │ Descrição      [.......................]    │
Menu contextual (botão ⋮ /  │ Responsável    [👤 Ana B. ▾]                │
clique direito):            │ Participantes  [👤👤 +2]                     │
┌──────────────────┐        │ Prioridade     [Alta ▾]   Cor [🟨 ▾]        │
│ Duplicar         │        │ Início [01/07/26]  Vencim. [30/09/26]       │
│ Converter em     │        │ Revisão em     [15/08/26]  🔔 -7d           │
│  iniciativa    → │        │ Etiquetas      [tributário][pme][+ ]        │
│ Relacionar…      │        │ Confidencial.  [Padrão ▾]                   │
│ Mover para…      │        │ Impacto [Alto▾]  Esforço [Médio▾]           │
│ Arquivar         │        │ Hipótese       [.......................]    │
│ Excluir          │        │ Evidência      [.......................]    │
└──────────────────┘        │ ─── Vínculos ─────────────────────────────  │
                            │ 🚀 Iniciativa: Consultoria PME (45%)   [→]  │
                            │ 🎯 KPI: Receita recorrente          [+ ]    │
                            │ 🔗 Depende de: "Contratar tributarista" [→] │
                            │ ─── Checklist (2/5) ──────────────────────  │
                            │ ☑ Validar escopo  ☐ Precificar  ☐ ...       │
                            │ ─── Anexos (1) ── [+ Anexar]                │
                            │ 📎 pesquisa-mercado.pdf                     │
                            │ ─────────────────────────────────────────── │
                            │ [Converter em iniciativa]  [Arquivar] [⋮]   │
                            └─────────────────────────────────────────────┘
Aba "Atividade" = linha do tempo de auditoria do item (RF-HIS-02).
Campos específicos do bloco (seção 5 do blueprint) aparecem em grupo próprio em "Detalhes".
```

---

## W-03 — MODAL DE CONVERSÃO EM INICIATIVA (RF-INI-01)

```text
┌───────────────────────────────────────────────┐
│ Converter post-it em iniciativa          [✕]  │
│ ───────────────────────────────────────────── │
│ Título      [Lançar consultoria tributária…]  │  ← herdado, editável
│ Líder       [👤 Ana B. ▾]      (herdado)      │
│ Patrocinador[👤 selecionar ▾]                 │
│ Início      [01/07/26]  Fim previsto [30/09]  │
│ Objetivo    [.............................]   │
│ Workflow    [Template: Ação Estratégica ▾]    │
│   └ Pré-visualização: 8 etapas → 8 tarefas    │
│     1. Proposta (Ana, D+3) 2. Avaliação…      │
│ ───────────────────────────────────────────── │
│ ℹ O post-it permanece no Canvas e passa a     │
│   exibir o progresso da iniciativa.           │
│              [Cancelar]  [Criar iniciativa]   │
└───────────────────────────────────────────────┘
```

---

## W-04 — DETALHE DA INICIATIVA COM WORKFLOW

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ← Iniciativas   Consultoria tributária p/ PMEs      [Em execução ▾]  │
│ Origem: post-it "Lançar consultoria…" (Ações Estratégicas) [→]       │
│ Líder 👤Ana · Patrocinador 👤Caio · 01/07–30/09 · ▓▓▓▓░░░░ 45%       │
├──────────────────────────────────────────────────────────────────────┤
│ [Workflow] [Tarefas] [Agenda] [KPIs] [Atividade]                     │
│                                                                      │
│ WORKFLOW: Ação Estratégica v2 (linear)              [⏸ Pausar]       │
│  ✔ 1. Proposta                Ana      concluída 03/07               │
│  ✔ 2. Avaliação impacto       Caio     concluída 08/07               │
│  ✔ 3. Aprovação  ★obrigatória Caio     aprovada  10/07               │
│  ● 4. Planejamento            Ana      em andamento · vence 20/07    │
│  ○ 5. Execução                equipe   D+30                          │
│  ○ 6. Monitoramento           Ana      D+60                          │
│  ○ 7. Encerramento ★          Caio     D+85                          │
│  ○ 8. Lições aprendidas       todos    D+90                          │
│                                                                      │
│ ★ = etapa obrigatória: pular exige justificativa (RF-WKF-07)         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## W-05 — TAREFAS ("MINHAS TAREFAS" + KANBAN)

```text
Minhas tarefas (lista):
┌──────────────────────────────────────────────────────────────────────┐
│ TAREFAS   [Lista][Kanban][Calendário][Minhas ✓]   [Filtros ▾] [+ ]   │
│ ⚠ VENCIDAS (2)                                                       │
│  ☐ Revisar contrato modelo      · Inic.: Consultoria PME · 12/07 ⚠   │
│  ☐ Enviar proposta X            · Bloco: Relacionamento  · 14/07 ⚠   │
│ HOJE (1)                                                             │
│  ☐ Precificar pacote PME ★evid. · Workflow: Ação Estr. 4 · hoje      │
│ PRÓXIMOS 7 DIAS (3)  ─ agrupado por vencimento ─                     │
│  ☐ …                                                                 │
└──────────────────────────────────────────────────────────────────────┘
Kanban (por status):
┌ A fazer ────┐┌ Em andamento ┐┌ Bloqueada ──┐┌ Concluída ──┐
│ ▬▬▬ ▬▬▬ ▬▬▬ ││ ▬▬▬ ▬▬▬      ││ ▬▬▬ 🔒dep.  ││ ▬▬▬ ▬▬▬     │
└─────────────┘└──────────────┘└─────────────┘└─────────────┘
Detalhe da tarefa = drawer análogo ao W-02, com: origem (workflow/iniciativa/post-it),
checklist, dependências, estimativa, evidência obrigatória na conclusão quando exigida
(RF-TSK-03) e botão "Agendar" → cria evento vinculado (RF-AGD-03).
```

---

## W-06 — AGENDA

```text
┌──────────────────────────────────────────────────────────────────────┐
│ AGENDA   [Dia][Semana ✓][Mês]   [Minha ✓ | Workspace]   [+ Evento]   │
│           seg 14   ter 15   qua 16   qui 17   sex 18                 │
│ 09:00              ┌──────┐                                          │
│ 10:00              │Reun. │          ┌────────┐                      │
│ 11:00              │revisão│         │Prazo:  │  ← evento de tarefa: │
│ 12:00              └──────┘          │proposta│    ícone ☑ + link    │
│ ...                                  └────────┘    bidirecional      │
│ Marcos/prazos do dia aparecem em faixa superior por dia              │
│ 🔁 recorrência · 🔔 lembrete · fuso do usuário (RF-AGD-05)           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## W-07 — PAINEL EXECUTIVO (INDICADORES)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ INDICADORES                                  [Período: 30 dias ▾]    │
│ ┌ Saúde do Canvas ────────────┐ ┌ Execução ─────────────────────┐    │
│ │ Bloco          ativos ⚠ s/rsp│ │ Tarefas no prazo      82% ▲   │    │
│ │ Ações Estrat.    5   1   0  │ │ Tarefas vencidas       4      │    │
│ │ Marketing Jur.   4   1   2  │ │ Iniciativas ativas     6      │    │
│ │ Equipe           4   0   0  │ │ Conversões post-it→inic. 3    │    │
│ │ … (15 blocos)               │ │ Tempo médio conclusão 5,2d    │    │
│ └─────────────────────────────┘ └───────────────────────────────┘    │
│ ┌ Pendências ────────────────────────────────────────────────────┐   │
│ │ ⚠ 3 revisões pendentes · 1 aprovação aguardando · 2 s/ prazo   │   │
│ └────────────────────────────────────────────────────────────────┘   │
│ ┌ KPIs (manuais) ────────────────────────────────────────────────┐   │
│ │ Receita recorrente  R$ 42k / meta 60k   [gráfico linha ∿]      │   │
│ │ [+ Novo KPI] [+ Registrar medição]                             │   │
│ └────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## W-08 — EXPORTAÇÃO DO CANVAS (RF-EXP)

```text
┌───────────────────────────────────────────────┐
│ Exportar Canvas                          [✕]  │
│ Formato   (•) PDF vetorial  ( ) PNG           │
│ Tamanho   ( )A0 ( )A1 (•)A2 ( )A3             │
│ Conteúdo  (•) Versão atual com filtros ativos │
│           ( ) Snapshot: [Planej. 2026-S2 ▾]   │
│ ☑ Incluir legenda de cores e contagens        │
│ ℹ Itens restritos fora do seu acesso não      │
│   serão incluídos (RF-EXP-04).                │
│                 [Cancelar]  [Gerar exportação]│
└───────────────────────────────────────────────┘
Geração assíncrona (fila) → notificação in-app com link de download.
```

---

## W-09 — ONBOARDING GUIADO (passo do diagnóstico)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Configuração inicial ─ passo 4 de 10            [Fazer depois]       │
│ ●●●●○○○○○○                                                           │
│ Diagnóstico: SEGMENTO DO CLIENTE                                     │
│ "Quem são os clientes que você quer atender?"                        │
│ [ Ex.: pequenas empresas do setor de saúde da região de Campinas ]   │
│ Sugestões geradas viram post-its de rascunho para sua revisão.       │
│                                   [← Voltar]        [Continuar →]    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## W-10 — CONFIGURAÇÕES / MEMBROS (RF-ADM-01)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ CONFIGURAÇÕES  [Membros ✓][Etiquetas][Lixeira][Auditoria][LGPD]      │
│ Membros (5)                                    [+ Convidar membro]   │
│ 👤 Ana B.      ana@…       Proprietária           —                  │
│ 👤 Caio M.     caio@…      [Administrador ▾]      [Remover]          │
│ 👤 Duda R.     duda@…      [Executor ▾]           [Remover]          │
│ ✉ pendente     leo@…       Editor estratégico     [Reenviar][Cancelar]│
│ 👤 Consultor X ext@…       Convidado externo · Canvas: Atual [Gerir] │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Observações para o protótipo high-fidelity

1. **Acessibilidade (RNF-05):** todos os fluxos acima devem ser operáveis por teclado; o Canvas precisa de ordem de foco por bloco → post-it e equivalente em lista (página de módulo) como alternativa acessível ao drag-and-drop.
2. **Estados vazios:** cada bloco/página deve ter estado vazio com CTA educativo (perguntas orientadoras da seção 5 do blueprint).
3. **Densidade:** post-it exibe no máximo 5 elementos na frente (RF-PIT-04); tudo além vai ao drawer.
4. **Mobile (< 768px):** substituir W-01 por lista de blocos com contadores; manter W-05 "Minhas tarefas" e W-06 como telas principais.
