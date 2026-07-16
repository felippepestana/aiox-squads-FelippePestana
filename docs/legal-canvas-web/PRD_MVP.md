# PRD — LEGAL CANVAS WEB (MVP)

**Versão:** 1.0
**Origem:** BLUEPRINT.md v1.0 (Blueprint Funcional e Técnico — Legal Canvas Web)
**Escopo:** MVP conforme seção 15 do blueprint
**Data-base:** 16 de julho de 2026

---

## 1. CONTEXTO E OBJETIVO

O Legal Canvas Web é uma plataforma de planejamento estratégico e execução operacional para advocacia. O MVP entrega a cadeia central de valor definida no blueprint:

> **Legal Canvas → post-it → iniciativa → workflow → tarefa → agenda → indicador → auditoria.**

Este PRD numera os requisitos funcionais (RF) e não funcionais (RNF) do MVP, define regras de negócio (RN), critérios de aceitação (CA) e prioridade MoSCoW (Must/Should/Could). Tudo que estiver fora deste documento é considerado fora do MVP (ver seção 15.2 do blueprint).

### 1.1 Objetivos de negócio do MVP

| # | Objetivo | Métrica de sucesso |
|---|----------|--------------------|
| O1 | Converter diagnóstico estratégico em plano executável | ≥ 1 post-it convertido em iniciativa por organização ativa |
| O2 | Adoção rápida por usuários não técnicos | Tempo até publicar o primeiro Canvas < 60 min; conclusão de onboarding > 70% |
| O3 | Execução com responsabilidade e prazo | ≥ 80% das tarefas com responsável e vencimento |
| O4 | Governança desde o primeiro dia | 100% das mutações críticas com registro de auditoria |

### 1.2 Não objetivos (fora do MVP)

Integrações com sistemas processuais; faturamento fiscal; contabilidade; CRM completo; IA autônoma; workflows BPMN complexos (paralelismo, gateways condicionais avançados); marketplace; aplicativo nativo; assinatura eletrônica; benchmarking com dados de terceiros; integração de calendário externo (Google/Outlook — Fase 2); SSO (Fase 3); oficina colaborativa com cursores em tempo real (Fase 2 — o MVP entrega sincronização de dados em tempo real, não presença).

---

## 2. PERSONAS ATENDIDAS NO MVP

| Persona | Papel de acesso típico | Necessidade central no MVP |
|---------|------------------------|----------------------------|
| Advogado individual | Proprietário | Montar Canvas sozinho, planejar e executar |
| Sócio gestor | Sócio/gestor | Aprovar iniciativas, ver painel executivo |
| Coordenador jurídico | Editor estratégico | Aplicar workflows, distribuir tarefas |
| Advogado/colaborador | Executor | Ver "Minhas tarefas", registrar evidências |
| Consultor externo | Convidado externo | Facilitar diagnóstico com acesso delimitado |

Papéis do MVP (papéis básicos, conforme 15.1): **Proprietário, Administrador, Editor estratégico, Executor, Leitor, Convidado externo.** Os papéis "Sócio/gestor" e "Auditor/compliance" são mapeados no MVP como Administrador e Leitor com acesso a logs, respectivamente; a granularidade completa fica para a Fase 2.

---

## 3. REQUISITOS FUNCIONAIS

Convenção de identificação: `RF-<domínio>-<nº>`. Domínios: AUT (autenticação/organização), CAN (canvas), PIT (post-it), INI (iniciativa), WKF (workflow), TSK (tarefa), AGD (agenda), NTF (notificação), IND (indicadores), EXP (exportação), HIS (histórico/auditoria), ADM (administração).

### 3.1 AUT — Autenticação, organização, workspace e papéis

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-AUT-01 | O sistema deve permitir cadastro de usuário com e-mail e senha, com verificação de e-mail. | Must |
| RF-AUT-02 | O sistema deve permitir login, logout e recuperação de senha. | Must |
| RF-AUT-03 | O usuário deve poder criar uma organização, tornando-se seu Proprietário. | Must |
| RF-AUT-04 | Uma organização deve poder conter um ou mais workspaces; o MVP cria um workspace padrão na criação da organização. | Must |
| RF-AUT-05 | O Proprietário/Administrador deve poder convidar usuários por e-mail para a organização, atribuindo papel (Administrador, Editor estratégico, Executor, Leitor, Convidado externo). | Must |
| RF-AUT-06 | Convidado externo só acessa os Canvas/workspaces explicitamente compartilhados com ele. | Must |
| RF-AUT-07 | Permissões devem ser aplicadas em interface **e** em API/banco (negação por padrão); nenhum recurso de outra organização pode ser lido ou alterado. | Must |
| RF-AUT-08 | O usuário deve poder alternar entre organizações/workspaces pela barra superior. | Must |
| RF-AUT-09 | O sistema deve oferecer MFA (TOTP) opcional por usuário. | Should |
| RF-AUT-10 | Sessões devem ser revogáveis pelo próprio usuário (lista de sessões ativas). | Should |

**RN-AUT-01:** papéis seguem RBAC com negação por padrão. Matriz resumida do MVP:

| Ação | Proprietário | Admin | Editor estratégico | Executor | Leitor | Convidado externo |
|---|---|---|---|---|---|---|
| Gerir organização/planos | ✔ | — | — | — | — | — |
| Gerir membros e papéis | ✔ | ✔ | — | — | — | — |
| Criar/editar Canvas e post-its | ✔ | ✔ | ✔ | — | — | somente se compartilhado como editor |
| Converter post-it em iniciativa / aplicar workflow | ✔ | ✔ | ✔ | — | — | — |
| Executar/atualizar tarefas próprias | ✔ | ✔ | ✔ | ✔ | — | — |
| Comentar | ✔ | ✔ | ✔ | ✔ | — | ✔ (onde tiver acesso) |
| Ler Canvas/relatórios | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (onde tiver acesso) |
| Ver logs de auditoria | ✔ | ✔ | — | — | — | — |
| Exportar | ✔ | ✔ | ✔ | ✔ | ✔ (se permitido) | — |

**CA-AUT:** um usuário sem permissão não lê nem altera o recurso por interface ou API (critério 3 do blueprint, seção 18). Teste automatizado de isolamento entre organizações é obrigatório antes do release.

### 3.2 CAN — Canvas visual

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-CAN-01 | A tela inicial autenticada é o Legal Canvas do workspace ativo (não uma lista de projetos). | Must |
| RF-CAN-02 | O Canvas deve reproduzir a geometria da matriz Legal Canvas com os 15 blocos: Equipe, Parceiros, Atividades Chave, Ações Estratégicas, Recursos, Espírito, Diferenciais, Modelo de Negócio, Relacionamento com Clientes, Marketing Jurídico, Mercado Jurídico, Produtos e Serviços Jurídicos, Segmento do Cliente, Estrutura de Custo, Fontes de Receita. | Must |
| RF-CAN-03 | O Canvas deve suportar zoom de 50% a 200%, ajuste à tela e tela cheia. | Must |
| RF-CAN-04 | Deve ser possível criar post-it por clique duplo no bloco ou por botão "+" do bloco. | Must |
| RF-CAN-05 | Post-its devem ser arrastáveis dentro do bloco com persistência de posição. | Must |
| RF-CAN-06 | Mover post-it entre blocos exige confirmação (mudança semântica) e registra a mudança no histórico. | Must |
| RF-CAN-07 | Filtros do Canvas: período, responsável, etiqueta, status e confidencialidade. Filtros combinam entre si. | Must |
| RF-CAN-08 | Cores do post-it por escolha manual e por mapeamento automático (categoria, prioridade, status ou responsável) selecionável por Canvas. | Must |
| RF-CAN-09 | Alterações feitas por outros usuários no mesmo Canvas devem aparecer sem recarregar a página (canal em tempo real). | Must |
| RF-CAN-10 | Autosave com indicador de estado (salvando/salvo/erro). | Must |
| RF-CAN-11 | Minimapa e navegação por teclado (setas para focar bloco/post-it, atalhos para criar/abrir). | Should |
| RF-CAN-12 | Agrupamento/empilhamento visual de post-its dentro do bloco. | Should |
| RF-CAN-13 | Modo apresentação (esconde chrome da interface, navegação por bloco). | Could |
| RF-CAN-14 | Cada item da sidebar exibe contador de itens ativos e pendências vencidas. | Should |

**RN-CAN-01:** limite visual recomendado por bloco (padrão: 20 post-its visíveis; excedente colapsa em pilha "+N") — valor configurável por Canvas. *(Decisão de design nº 1 do blueprint: adotado limite recomendado, não bloqueante.)*
**RN-CAN-02:** edição bilateral — alterar post-it no Canvas reflete no módulo lateral e vice-versa, em tempo real (princípio 2 do blueprint).

**CA-CAN:** (1) post-it criado no módulo lateral aparece no bloco correto sem recarregar a página; (2) movimentação persiste posição e histórico; (3) resposta visual de drag-and-drop < 100 ms.

### 3.3 PIT — Post-its

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-PIT-01 | Criação rápida exige apenas título e bloco; cor e status recebem valores padrão. | Must |
| RF-PIT-02 | Campos progressivos no drawer: descrição, hipótese, evidência, impacto, esforço, prioridade, responsável, participantes, início, vencimento, data de revisão, etiquetas, confidencialidade, anexos, comentários, dependências (vínculo com outros post-its), objetivo, KPI vinculado, iniciativa vinculada, checklist. | Must |
| RF-PIT-03 | Estados do post-it: rascunho, em análise, aprovado, planejado, em execução, bloqueado, concluído, descartado, arquivado. Transições livres no MVP, sempre auditadas. | Must |
| RF-PIT-04 | A frente do post-it exibe: título, responsável (avatar), prioridade, vencimento, progresso (quando houver iniciativa/checklist) e ícone de alerta (vencido/revisão pendente). | Must |
| RF-PIT-05 | Clique abre drawer lateral de detalhes; duplo clique edita título in-place; menu contextual oferece duplicar, converter em iniciativa, relacionar, mover, arquivar e excluir. | Must |
| RF-PIT-06 | Comentários com menções `@usuário` (menção gera notificação). | Must |
| RF-PIT-07 | Anexos por upload (limite configurável, padrão 25 MB/arquivo), com validação de tipo e antivírus. | Must |
| RF-PIT-08 | Etiquetas (tags) livres por workspace, com autocomplete e gestão (renomear/mesclar) por Admin. | Must |
| RF-PIT-09 | Confidencialidade por item: `padrão`, `restrito` (somente participantes + gestores), `sigiloso` (somente participantes explícitos). Negação por padrão para `restrito` e `sigiloso`. | Must |
| RF-PIT-10 | Exclusão é lógica (lixeira) com retenção configurável (padrão 30 dias) e restauração. | Must |
| RF-PIT-11 | Campos específicos por módulo (seção 5 do blueprint) implementados como conjunto de campos adicionais por bloco, visíveis no drawer conforme o bloco do post-it. | Should |
| RF-PIT-12 | Relacionamentos entre post-its com tipo (`depende de`, `relaciona-se com`, `deriva de`) e visualização opcional de linhas no Canvas. | Should |

**RN-PIT-01:** um post-it pertence a exatamente um bloco de uma versão de Canvas.
**RN-PIT-02:** post-it `sigiloso` nunca aparece em relatórios/exportações de quem não tem acesso; a contagem agregada pode indicar "N itens restritos".

### 3.4 INI — Iniciativas

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-INI-01 | Converter post-it em iniciativa sem redigitar: título, descrição, responsável, datas e etiquetas são herdados; o vínculo bidirecional post-it ↔ iniciativa é preservado. | Must |
| RF-INI-02 | Iniciativa possui: objetivo, resultado esperado, patrocinador, líder, status, início, fim previsto, progresso (% calculado por tarefas concluídas), riscos (texto) e workflow principal. | Must |
| RF-INI-03 | O progresso da iniciativa atualiza a indicação de progresso do post-it de origem. | Must |
| RF-INI-04 | Lista de iniciativas do workspace com filtros por status, líder e bloco de origem. | Must |
| RF-INI-05 | Iniciativa criada diretamente (sem post-it) é permitida, com opção de vincular a post-it depois. | Should |

**CA-INI:** a conversão preserva vínculo com o post-it original (critério 4); alteração de tarefa atualiza o progresso da iniciativa e a indicação do post-it (critério 6).

### 3.5 WKF — Workflows (lineares no MVP)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-WKF-01 | Motor único de workflows **lineares** (sequência de etapas; sem paralelismo/gateways no MVP). | Must |
| RF-WKF-02 | Templates de workflow por módulo, pré-carregados conforme seção 5 do blueprint (ex.: Parceiros: demanda → due diligence → conflito de interesses → aprovação → contratação → execução → avaliação → renovação). | Must |
| RF-WKF-03 | Etapa pode ser do tipo **tarefa** (responsável, prazo relativo, checklist, critério de conclusão) ou **aprovação** (aprovador, rotas aprovado/reprovado/ajustes). | Must |
| RF-WKF-04 | Aplicar workflow a uma iniciativa instancia as etapas e gera tarefas com responsável/prazo herdados conforme regras do template (prazos relativos à data de início). | Must |
| RF-WKF-05 | Estados do template: rascunho → publicado → arquivado. Estados da instância: ativo → pausado → concluído → cancelado. | Must |
| RF-WKF-06 | Nova versão de template não altera instâncias já iniciadas. | Must |
| RF-WKF-07 | Etapa obrigatória não pode ser pulada sem justificativa registrada e permissão de Editor estratégico ou superior. | Must |
| RF-WKF-08 | Editor visual simples de template (lista ordenável de etapas com campos por etapa). | Must |
| RF-WKF-09 | Gatilhos no MVP: aplicação manual e automação "ao aprovar ação estratégica, criar iniciativa + workflow" (ver RF-NTF-06). Demais gatilhos (data, formulário, webhook) ficam para Fase 2. | Should |

**CA-WKF:** tarefas geradas por workflow herdam responsável/prazo conforme regras (critério 5); pular etapa obrigatória sem justificativa é bloqueado e o bloqueio é auditado.

### 3.6 TSK — Tarefas

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-TSK-01 | Campos: título, origem (workflow/iniciativa/post-it/manual), responsável, participantes, prioridade, status, início, vencimento, estimativa, dependências, checklist, anexos, comentários, evidência de conclusão, recorrência simples (diária/semanal/mensal). | Must |
| RF-TSK-02 | Visualizações: lista, Kanban (por status), calendário e "Minhas tarefas" (todas as origens, ordenada por vencimento). | Must |
| RF-TSK-03 | Estados: a fazer, em andamento, bloqueada, concluída, cancelada. Conclusão pode exigir evidência conforme configuração da etapa/template. | Must |
| RF-TSK-04 | Dependência bloqueia início: tarefa dependente não pode ser movida para "em andamento" enquanto a antecessora não concluir (com override justificado). | Should |
| RF-TSK-05 | Filtro e agrupamento por iniciativa e por bloco de origem. | Must |
| RF-TSK-06 | Tarefa pode gerar evento de agenda com vínculo bidirecional (ver RF-AGD-03). | Must |

### 3.7 AGD — Agenda (calendário interno)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-AGD-01 | Calendário interno com visões diária, semanal e mensal. | Must |
| RF-AGD-02 | Tipos de evento: compromisso, marco, prazo, revisão. Suporte a recorrência simples e lembretes. | Must |
| RF-AGD-03 | Evento originado de tarefa mantém sincronização bidirecional (mudou prazo da tarefa → move o evento; moveu evento → propõe atualizar o prazo) sem duplicação. | Must |
| RF-AGD-04 | Visão consolidada por usuário ("minha agenda") e por workspace. | Must |
| RF-AGD-05 | Fuso horário por usuário; armazenamento em UTC; feriados por calendário configurável (pt-BR padrão). | Must |
| RF-AGD-06 | Visão cronograma (timeline por iniciativa) | Could |

**CA-AGD:** evento originado de tarefa permanece sincronizado sem duplicação (critério 7).

### 3.8 NTF — Notificações e automações

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-NTF-01 | Canais: in-app (central de notificações) e e-mail. | Must |
| RF-NTF-02 | Eventos notificáveis: atribuição de tarefa, menção, vencimento próximo (config. padrão: 3 dias e 1 dia antes), atraso, aprovação pendente/decidida, bloqueio, comentário em item que sigo, alteração crítica em item que sou responsável, revisão periódica de post-it. | Must |
| RF-NTF-03 | Preferências por usuário e por tipo de evento/canal; alertas de segurança não são desativáveis. | Must |
| RF-NTF-04 | Automação: 7 dias antes da data de revisão de um post-it, notificar responsável. | Must |
| RF-NTF-05 | Automação: ao vencer tarefa crítica (prioridade alta), escalar para o líder da iniciativa. | Should |
| RF-NTF-06 | Automação: ao aprovar post-it do bloco Ações Estratégicas, oferecer criação de iniciativa + workflow em um clique. | Should |

### 3.9 HIS — Histórico, versões e auditoria

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-HIS-01 | Toda mutação relevante (criar/editar/mover/excluir/converter/aprovar) gera evento de auditoria com autor, data/hora, entidade, antes/depois e origem (UI/API/automação). | Must |
| RF-HIS-02 | Histórico por item (linha do tempo no drawer) e log geral por workspace (acesso restrito a Admin+). | Must |
| RF-HIS-03 | Logs de auditoria são imutáveis (append-only). | Must |
| RF-HIS-04 | Versionamento otimista: atualização concorrente com versão defasada é rejeitada e a interface oferece recarga/merge manual — nunca sobrescrita silenciosa. | Must |
| RF-HIS-05 | Versões de Canvas: o MVP mantém a versão "Atual" com histórico contínuo e permite **publicar snapshots nomeados** (ex.: "Planejamento 2026-S2") para consulta e comparação simples (lista de diferenças por bloco). Cenários alternativos e comparação visual lado a lado ficam para a Fase 2. | Must |
| RF-HIS-06 | Restauração de item a partir do histórico (reverter para estado anterior) com registro de auditoria. | Should |

**CA-HIS:** concorrência não sobrescreve silenciosamente mudanças de outro usuário (critério 9); toda alteração crítica aparece no log com autor, data e antes/depois (critério 10).

### 3.10 IND — Indicadores essenciais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-IND-01 | Painel executivo com: saúde do Canvas por bloco (itens ativos/vencidos/sem responsável), iniciativas por status, tarefas vencidas, aprovações e revisões pendentes. | Must |
| RF-IND-02 | KPIs manuais: cadastrar KPI (nome, unidade, meta, direção) e registrar medições periódicas; vincular KPI a post-it/iniciativa. | Must |
| RF-IND-03 | Indicadores calculados do MVP: % tarefas no prazo, % post-its com responsável+prazo, nº conversões post-it→iniciativa, tempo médio de conclusão de tarefa. | Must |
| RF-IND-04 | Série histórica simples (gráfico de linha) por KPI. | Should |

### 3.11 EXP — Exportação

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-EXP-01 | Exportar Canvas em PDF vetorial nos formatos A0, A1, A2, A3 e em PNG. | Must |
| RF-EXP-02 | A exportação respeita filtros ativos, snapshot/versão selecionada e dimensões escolhidas. | Must |
| RF-EXP-03 | Exportação tabular (CSV) de tarefas e iniciativas. | Should |
| RF-EXP-04 | Itens `restritos`/`sigilosos` fora do alcance do usuário nunca aparecem na exportação. | Must |

**CA-EXP:** exportação respeita filtros, versão e dimensões escolhidas (critério 8).

### 3.12 ADM — Administração e onboarding

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-ADM-01 | Painel administrativo: membros, papéis, convites pendentes, etiquetas, preferências do workspace, lixeira, uso de armazenamento. | Must |
| RF-ADM-02 | Onboarding guiado (seção 14.1 do blueprint): criar organização → perfil de atuação → Canvas vazio/assistido/modelo → diagnóstico por bloco → revisar post-its sugeridos → priorizar 3 objetivos → converter em iniciativas → responsáveis e datas → agendar primeira revisão → publicar versão inicial. Pode ser pulado e retomado. | Must |
| RF-ADM-03 | Templates iniciais de Canvas por perfil (advogado individual, sociedade, departamento jurídico) com post-its de exemplo. | Must |
| RF-ADM-04 | Exportação de dados da organização (JSON) e exclusão de conta/organização com fluxo de confirmação e prazo de arrependimento (LGPD). | Must |

---

## 4. REQUISITOS NÃO FUNCIONAIS

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-01 | Disponibilidade | 99,5% inicial |
| RNF-02 | Carregamento da tela principal | ≤ 3 s em conexão regular (excluídas exportações) |
| RNF-03 | Resposta visual de drag-and-drop | < 100 ms |
| RNF-04 | Autosave | ≤ 2 s após inatividade de digitação, com indicador de estado |
| RNF-05 | Acessibilidade | WCAG 2.2 AA (navegação por teclado no Canvas incluída) |
| RNF-06 | Navegadores | Versões atuais de Chrome, Edge, Safari e Firefox |
| RNF-07 | Responsividade | Desktop-first; operação funcional em tablet; consulta em celular |
| RNF-08 | Internacionalização | Preparada (i18n); pt-BR no lançamento |
| RNF-09 | Fuso/datas | UTC no armazenamento; exibição no fuso do usuário; decimal + moeda ISO em valores financeiros |
| RNF-10 | Segurança | Criptografia em trânsito (TLS 1.2+) e em repouso; RLS/isolamento por organização testado; menor privilégio; senhas com política mínima; antivírus em anexos |
| RNF-11 | LGPD/sigilo | Consentimento, finalidade, retenção, exportação e exclusão; classificação de confidencialidade; sem conteúdo processual sensível além do necessário |
| RNF-12 | Observabilidade | Logs estruturados, métricas, tracing e correlação de requisições; alertas de erro |
| RNF-13 | Backups | Diários com teste de restauração periódico; RPO ≤ 24 h, RTO ≤ 8 h no MVP |
| RNF-14 | Portabilidade | Exportação completa dos dados da organização em JSON |
| RNF-15 | Lixeira/restauração | Retenção configurável (padrão 30 dias) |

---

## 5. REGRAS DE NEGÓCIO TRANSVERSAIS

1. **RN-T-01 — Cadeia de vínculos:** Canvas → post-it → iniciativa → workflow → tarefa → evento; cada elo mantém referência ao anterior e os vínculos nunca são destruídos por conversão (apenas por exclusão explícita).
2. **RN-T-02 — Negação por padrão:** ausência de permissão explícita = sem acesso; itens sigilosos exigem participação explícita.
3. **RN-T-03 — Auditoria universal:** toda mutação relevante gera AuditEvent; automações registram origem `automation`.
4. **RN-T-04 — Ética profissional:** nenhum texto de interface, template ou automação pode estimular promessa de resultado ou captação indevida; templates de Marketing Jurídico incluem checklist de conformidade obrigatório antes do status "aprovado".
5. **RN-T-05 — Simplicidade progressiva:** todo formulário de criação exige no máximo 2 campos; demais campos aparecem no drawer.

---

## 6. DEPENDÊNCIAS E PREMISSAS

- **Stack de referência:** React/Next.js + TypeScript no frontend; PostgreSQL (Supabase: auth, RLS, realtime, storage) com validação de regras críticas também no servidor; fila para notificações/exportações; busca textual nativa do PostgreSQL no MVP.
- **Premissa de dados financeiros:** o MVP trata custo/receita como **planejamento gerencial** (valores previstos), sem conciliação bancária — pendente de confirmação (decisão nº 6 do blueprint).
- **Identidade visual e nomenclatura definitiva:** pendentes (decisão nº 9); wireframes usam nomenclatura provisória do blueprint.

## 7. RISCOS ESPECÍFICOS DO MVP

| Risco | Mitigação no MVP |
|-------|------------------|
| Canvas ilegível com muitos itens | RN-CAN-01 (limite recomendado + pilhas), filtros e arquivamento |
| Complexidade excessiva | RN-T-05, onboarding guiado, templates |
| Exposição de dados | RLS + testes de isolamento + classificação de confidencialidade |
| Conflito de edição | Realtime + versionamento otimista (RF-HIS-04) |
| Estratégia sem execução | Conversão em 1 clique (RF-INI-01) e automação RF-NTF-06 |

## 8. CRITÉRIOS DE ACEITE DO RELEASE (Definition of Done do MVP)

Todos os 10 critérios da seção 18 do blueprint passam em testes automatizados/manuais documentados, mais:

11. Teste de isolamento entre organizações executado e aprovado (interface, API e banco).
12. Exportação A0–A3/PNG validada em impressão real de ao menos um Canvas de referência.
13. Onboarding completo executável por usuário externo sem suporte, em ambiente de homologação.
14. Fluxo LGPD de exportação e exclusão de dados testado ponta a ponta.
