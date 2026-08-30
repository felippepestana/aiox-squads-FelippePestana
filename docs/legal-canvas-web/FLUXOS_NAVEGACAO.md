# FLUXOS DE NAVEGAÇÃO — LEGAL CANVAS WEB (MVP)

**Versão:** 1.0
**Origem:** BLUEPRINT.md v1.0 + PRD_MVP.md
**Objetivo:** mapear jornadas e fluxos de navegação para orientar wireframes, protótipo e testes de usabilidade.

---

## 1. MAPA DE NAVEGAÇÃO GLOBAL

```mermaid
flowchart TD
    LOGIN[Login / Cadastro] --> ONB{Primeira vez?}
    ONB -- sim --> WIZARD[Onboarding guiado]
    ONB -- não --> CANVAS[Dashboard Legal Canvas]
    WIZARD --> CANVAS

    subgraph SHELL[Aplicação autenticada]
        TOPBAR[Barra superior: org/workspace · versão · busca · notificações · Criar · perfil]
        SIDEBAR[Sidebar: Visão Geral + 15 módulos + Workflows · Tarefas · Agenda · Indicadores · Relatórios · Arquivos · Configurações]
    end

    CANVAS --> DRAWER[Drawer do post-it]
    CANVAS --> MODULO[Página de módulo - lista do bloco]
    MODULO --> DRAWER
    DRAWER --> INICIATIVA[Detalhe da iniciativa]
    INICIATIVA --> WKF[Instância de workflow]
    WKF --> TAREFA[Detalhe da tarefa]
    SIDEBAR --> TAREFAS[Tarefas: lista/Kanban/calendário/minhas]
    SIDEBAR --> AGENDA[Agenda]
    SIDEBAR --> IND[Indicadores]
    SIDEBAR --> REL[Relatórios/Exportação]
    SIDEBAR --> CFG[Configurações/Admin]
    TAREFAS --> TAREFA
    TAREFA --> AGENDA
```

**Regra de ouro (princípio 1 do blueprint):** após o login, o usuário sempre cai no **Canvas** do último workspace ativo.

---

## 2. JORNADA 1 — PRIMEIRO ACESSO E ONBOARDING (RF-ADM-02)

**Persona:** advogado individual ou sócio gestor. **Objetivo:** publicar o primeiro Canvas em < 60 min.

```mermaid
flowchart LR
    A[Cadastro + verificação de e-mail] --> B[Criar organização]
    B --> C[Selecionar perfil de atuação]
    C --> D{Tipo de Canvas}
    D -->|Vazio| E[Canvas em branco]
    D -->|Assistido| F[Diagnóstico orientado por bloco]
    D -->|Modelo| G[Template por perfil com exemplos]
    F --> H[Revisar post-its sugeridos]
    G --> H
    E --> I
    H --> I[Priorizar 3 objetivos]
    I --> J[Converter ações em iniciativas]
    J --> K[Atribuir responsáveis e datas]
    K --> L[Agendar primeira revisão]
    L --> M[Publicar versão inicial]
    M --> N[Dashboard Legal Canvas]
```

**Pontos de saída:** o wizard pode ser pulado em qualquer passo ("fazer depois") e retomado por banner persistente no Canvas até a publicação da versão inicial.

---

## 3. JORNADA 2 — CADEIA CENTRAL: POST-IT → INICIATIVA → WORKFLOW → TAREFA → AGENDA

A jornada que materializa a síntese de arquitetura do blueprint.

```mermaid
flowchart TD
    A[Canvas: duplo clique no bloco Ações Estratégicas] --> B[Post-it criado: título + defaults]
    B --> C[Clique: drawer de detalhes]
    C --> D[Preencher responsável, prazo, prioridade]
    D --> E[Status: aprovado]
    E --> F{Automação RF-NTF-06:\nCriar iniciativa?}
    F -->|sim| G[Iniciativa criada com dados herdados\nvínculo bidirecional preservado]
    F -->|não| C2[Permanece post-it]
    G --> H[Aplicar template de workflow]
    H --> I[Etapas instanciadas:\ntarefas com responsável e prazo relativos]
    I --> J[Executor vê em Minhas tarefas]
    J --> K[Tarefa com prazo gera evento na Agenda\nvínculo bidirecional]
    K --> L[Conclusão com evidência]
    L --> M[Progresso da iniciativa recalculado]
    M --> N[Indicação de progresso no post-it original]
    N --> O[Indicadores e auditoria atualizados]
```

**Estados críticos de interface:**
- Conversão em iniciativa: modal de 1 passo, campos pré-preenchidos, botão único "Criar iniciativa" (RF-INI-01).
- Aplicação de workflow: seleção de template → pré-visualização das tarefas que serão geradas (responsáveis/prazos calculados) → confirmar.
- Bloqueio de etapa obrigatória: tentativa de pular exige modal de justificativa (RF-WKF-07).

---

## 4. JORNADA 3 — EXECUTOR NO DIA A DIA

```mermaid
flowchart LR
    A[Login] --> B[Canvas]
    B --> C[Sidebar: Tarefas → Minhas tarefas]
    C --> D[Ordenadas por vencimento; badge de vencidas]
    D --> E[Abrir tarefa]
    E --> F{Dependência pendente?}
    F -->|sim| G[Início bloqueado - override justificado]
    F -->|não| H[Em andamento]
    H --> I[Checklist + comentários + anexos]
    I --> J{Etapa exige evidência?}
    J -->|sim| K[Anexar evidência → Concluir]
    J -->|não| L[Concluir]
    K --> M[Notificação ao líder; progresso propagado]
    L --> M
```

---

## 5. JORNADA 4 — APROVADOR (SÓCIO GESTOR)

```mermaid
flowchart LR
    A[Notificação: aprovação pendente] --> B[Central de notificações ou e-mail]
    B --> C[Etapa de aprovação no workflow]
    C --> D[Contexto: item, evidências, comentários]
    D --> E{Decisão}
    E -->|Aprovar| F[Workflow avança; auditoria registra]
    E -->|Reprovar| G[Workflow encerra rota; notifica líder]
    E -->|Ajustes| H[Retorna à etapa anterior com comentário obrigatório]
```

---

## 6. JORNADA 5 — REVISÃO PERIÓDICA E SNAPSHOT

```mermaid
flowchart LR
    A[Automação: 7 dias antes da revisão] --> B[Notificação ao responsável]
    B --> C[Canvas filtrado: revisões pendentes]
    C --> D[Atualizar post-its: status, evidências, datas]
    D --> E[Painel executivo: saúde por bloco]
    E --> F[Publicar snapshot nomeado ex.: Revisão mensal jul/2026]
    F --> G[Comparação simples com snapshot anterior]
    G --> H[Exportar PDF A3 para reunião]
```

---

## 7. JORNADA 6 — ADMINISTRAÇÃO E CONVITES

```mermaid
flowchart LR
    A[Configurações] --> B[Membros e papéis]
    B --> C[Convidar por e-mail + papel]
    C --> D[Convidado recebe e-mail → cadastro/login]
    D --> E{Papel}
    E -->|Interno| F[Acesso ao workspace conforme papel]
    E -->|Convidado externo| G[Acesso somente ao Canvas compartilhado]
```

---

## 8. FLUXOS DE ERRO E CONCORRÊNCIA

| Situação | Comportamento |
|----------|---------------|
| Edição concorrente (versão defasada) | Salvamento rejeitado; banner "Este item foi alterado por [usuário]"; opções: recarregar / comparar / sobrescrever com confirmação explícita (RF-HIS-04) |
| Queda de conexão durante edição | Indicador de autosave em "erro"; alterações retidas localmente; retentativa automática ao reconectar |
| Mover post-it entre blocos | Modal de confirmação com aviso de mudança semântica (RF-CAN-06) |
| Exclusão | Envio à lixeira com toast "Desfazer"; restauração em Configurações → Lixeira |
| Acesso negado (link direto a item restrito) | Tela 403 sem vazar título/existência do item sigiloso |
| Sessão expirada | Redirect a login com retorno à URL original após autenticação |

---

## 9. NAVEGAÇÃO RESPONSIVA

| Breakpoint | Comportamento |
|------------|---------------|
| Desktop ≥ 1280px | Sidebar fixa recolhível; Canvas com zoom/pan/minimapa; drawer lateral 480px |
| Tablet 768–1279px | Sidebar em drawer; Canvas com pan por toque e pinch-zoom; drawer em tela cheia parcial |
| Celular < 768px | Somente consulta: lista de blocos → lista de post-its → detalhe; Minhas tarefas e Agenda funcionais; edição limitada a status/comentários |

## 10. MAPA DE ROTAS (referência para desenvolvimento)

```
/login, /signup, /recover
/onboarding/*                       # wizard (passos 1–10)
/:org/:workspace                    # Canvas (home autenticada)
/:org/:workspace/blocks/:blockKey   # página do módulo (lista do bloco)
/:org/:workspace/notes/:noteId      # deep-link → Canvas com drawer aberto
/:org/:workspace/initiatives[/:id]
/:org/:workspace/workflows[/:id]        # templates
/:org/:workspace/workflow-runs/:id      # instâncias
/:org/:workspace/tasks[?view=list|kanban|calendar|mine]
/:org/:workspace/calendar
/:org/:workspace/kpis
/:org/:workspace/reports
/:org/:workspace/files
/:org/:workspace/settings/*         # membros, etiquetas, lixeira, auditoria, LGPD
/:org/:workspace/snapshots[/:id]
```
