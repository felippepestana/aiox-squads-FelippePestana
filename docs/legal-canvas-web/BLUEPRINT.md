# BLUEPRINT FUNCIONAL E TÉCNICO — LEGAL CANVAS WEB

**Versão:** 1.0  
**Natureza:** Blueprint de produto, experiência, operação e arquitetura  
**Objetivo:** orientar UX/UI, PRD, modelagem de dados, desenvolvimento, testes e implantação  
**Data-base:** 16 de julho de 2026

## 1. VISÃO EXECUTIVA

O Legal Canvas Web será uma plataforma de planejamento estratégico e execução operacional para advocacia. Seu painel central reproduzirá visualmente a matriz Legal Canvas reconstruída, com os blocos: Equipe, Parceiros, Atividades Chave, Ações Estratégicas, Recursos, Espírito, Diferenciais, Modelo de Negócio, Relacionamento com Clientes, Marketing Jurídico, Mercado Jurídico, Produtos e Serviços Jurídicos, Segmento do Cliente, Estrutura de Custo e Fontes de Receita.

A solução não será um quadro estático. Cada informação registrada em um bloco será uma entidade operacional — visualizada como post-it — capaz de conter responsável, prioridade, status, etiquetas, datas, anexos, comentários, vínculos, indicadores e automações. Um post-it poderá ser promovido a iniciativa; uma iniciativa poderá conter workflow; e cada workflow poderá gerar tarefas, prazos e eventos de agenda.

O sistema deverá atender escritórios individuais, sociedades de advocacia, departamentos jurídicos e estruturas jurídico-tecnológicas, com segregação por organização, unidades e equipes. A experiência deve ser acessível a usuários sem formação técnica e, simultaneamente, fornecer governança, histórico e indicadores suficientes para gestão profissional.

### 1.1 Resultado esperado

- converter diagnóstico estratégico em plano executável;
- representar mudanças imediatamente no Canvas;
- conectar estratégia, projetos, tarefas, agenda, documentos e indicadores;
- permitir versões e cenários sem apagar o histórico;
- criar ritos de revisão semanal, mensal, trimestral e anual;
- produzir relatórios executivos e exportações para PDF/impressão;
- observar sigilo profissional, proteção de dados, ética e publicidade na advocacia.

## 2. PRINCÍPIOS DE PRODUTO

1. **Canvas como centro:** a tela inicial autenticada é o Legal Canvas, e não uma lista genérica de projetos.
2. **Edição bilateral:** alterar um post-it no Canvas atualiza o módulo lateral; alterar no módulo atualiza o Canvas em tempo real.
3. **Estratégia executável:** todo item estratégico pode originar iniciativa, workflow, tarefa, prazo e indicador.
4. **Rastreabilidade:** o sistema registra autor, data, versão, motivo e relações de cada decisão.
5. **Simplicidade progressiva:** o cadastro inicial exige poucos campos; detalhes aparecem conforme o item amadurece.
6. **Governança por padrão:** permissões, auditoria, versionamento, revisão e arquivamento são nativos.
7. **Visual antes do tabular:** post-its, estados, relações e alertas são prioritários; tabelas servem à análise e administração.
8. **Adequação jurídica:** nenhuma funcionalidade deve estimular captação indevida, promessa de resultado ou exposição de dado sigiloso.

## 3. PERSONAS E PAPÉIS

### 3.1 Personas

- **Advogado individual:** estrutura posicionamento, serviços, custos, relacionamento e agenda pessoal.
- **Sócio gestor:** define cenários, aprova iniciativas, acompanha indicadores e capacidade da equipe.
- **Coordenador jurídico:** transforma decisões em workflows, distribui tarefas e acompanha prazos.
- **Advogado ou colaborador:** executa tarefas, atualiza post-its e registra evidências.
- **Marketing/BD:** opera conteúdo, eventos, relacionamento e oportunidades sob regras éticas.
- **Financeiro/administrativo:** mantém estrutura de custos, receitas, orçamento e recursos.
- **Consultor externo:** facilita diagnóstico e planejamento com acesso delimitado.

### 3.2 Papéis de acesso

- Proprietário da organização;
- Administrador;
- Sócio/gestor;
- Editor estratégico;
- Executor;
- Leitor;
- Convidado externo;
- Auditor/compliance.

As permissões devem ser configuráveis por organização, workspace, Canvas, bloco, iniciativa e item sensível. O sistema deve adotar RBAC com regras adicionais por recurso, mantendo negação por padrão para conteúdos sigilosos.

## 4. ARQUITETURA DA EXPERIÊNCIA

### 4.1 Estrutura da aplicação

**Barra superior:** organização, workspace, cenário/versão, pesquisa global, notificações, botão “Criar”, ajuda e perfil.

**Sidebar esquerda recolhível:**

1. Visão Geral — Legal Canvas;
2. Equipe;
3. Parceiros;
4. Atividades Chave;
5. Ações Estratégicas;
6. Recursos;
7. Espírito;
8. Diferenciais;
9. Modelo de Negócio;
10. Relacionamento com Clientes;
11. Marketing Jurídico;
12. Mercado Jurídico;
13. Produtos e Serviços Jurídicos;
14. Segmento do Cliente;
15. Estrutura de Custo;
16. Fontes de Receita;
17. Workflows;
18. Tarefas;
19. Agenda;
20. Indicadores;
21. Relatórios;
22. Arquivos;
23. Configurações.

Cada item da sidebar exibirá contador de itens ativos, pendências vencidas e alertas de revisão. Em telas menores, a sidebar se converte em drawer; o Canvas admite zoom, pan e modo foco.

### 4.2 Dashboard Legal Canvas

O dashboard deverá reproduzir a geometria do quadro vetorial e permitir:

- zoom de 50% a 200%, ajuste à tela e tela cheia;
- criação por clique duplo ou botão “+” em cada bloco;
- arrastar e soltar post-its dentro do bloco;
- mover itens entre blocos, exigindo confirmação quando houver mudança semântica;
- cores por categoria, prioridade, status, responsável ou escolha manual;
- filtros por período, responsável, equipe, etiqueta, objetivo, status e confidencialidade;
- agrupamento e empilhamento de post-its;
- linhas de relacionamento opcionais entre itens;
- minimapa e navegação por teclado;
- visualização “estratégica”, “execução”, “riscos” e “indicadores”;
- exportação em A0, A1, A2, A3, PNG e PDF vetorial;
- modo apresentação e modo oficina colaborativa.

### 4.3 Anatomia do post-it

Campos mínimos: título, bloco, cor e status. Campos progressivos: descrição, hipótese, evidência, impacto, esforço, prioridade, responsável, participantes, início, vencimento, revisão, etiquetas, confidencialidade, anexos, comentários, dependências, objetivo, KPI, iniciativa, workflow e checklist.

Estados sugeridos: rascunho, em análise, aprovado, planejado, em execução, bloqueado, concluído, descartado e arquivado.

A frente do post-it exibe título, responsável, prioridade, vencimento, progresso e alertas. O clique abre drawer lateral; o duplo clique permite edição rápida; o menu contextual oferece duplicar, converter, relacionar, mover, arquivar e excluir.

## 5. MÓDULOS DO LEGAL CANVAS

### 5.1 EQUIPE

**Finalidade:** mapear capacidade humana, papéis, competências, disponibilidade, liderança e necessidades de desenvolvimento.

**Perguntas orientadoras:** Quem executa e decide? Quais competências são críticas? Onde existem sobrecarga ou lacunas? Qual capacidade está disponível?

**Campos específicos:** pessoa/função, vínculo, unidade, senioridade, especialidades, competências, capacidade semanal, custo estimado, líder, substituto, status e plano de desenvolvimento.

**Funcionalidades:** mapa de competências; matriz responsabilidade x processo; capacidade por período; organograma; alertas de sobrecarga; plano de desenvolvimento; indicação de sucessão.

**Workflow padrão:** identificar necessidade → definir perfil → aprovar alocação/contratação → selecionar pessoa → integrar → revisar desempenho/capacidade.

**Indicadores:** utilização, capacidade livre, tarefas vencidas, concentração de conhecimento, horas de capacitação e custo por equipe.

### 5.2 PARCEIROS

**Finalidade:** gerir correspondentes, associações, fornecedores, consultores, escritórios parceiros e redes institucionais.

**Campos específicos:** tipo, contato, escopo, território, especialidade, SLA, documentos, conflito de interesses, avaliação, vigência e responsável interno.

**Workflow padrão:** demanda → due diligence → conflito de interesses → aprovação → contratação/credenciamento → execução → avaliação → renovação.

**Indicadores:** SLA, qualidade, custo, recorrência, incidentes e cobertura territorial.

### 5.3 ATIVIDADES CHAVE

**Finalidade:** registrar atividades essenciais para entrega da proposta jurídica e funcionamento do modelo.

**Campos específicos:** atividade, processo relacionado, frequência, entrada, saída, responsável, SLA, criticidade, padrão de qualidade e automação possível.

**Workflow padrão:** mapear → priorizar → documentar → designar → executar → controlar qualidade → melhorar.

**Indicadores:** lead time, retrabalho, cumprimento de SLA, custo, volume e nível de automação.

### 5.4 AÇÕES ESTRATÉGICAS

**Finalidade:** transformar objetivos em iniciativas mensuráveis.

**Campos específicos:** objetivo, resultado-chave, hipótese, escopo, patrocinador, líder, orçamento, marcos, riscos, impacto e esforço.

**Workflow padrão:** proposta → avaliação impacto/esforço → aprovação → planejamento → execução → monitoramento → encerramento → lições aprendidas.

**Indicadores:** avanço, marcos cumpridos, orçamento, benefícios realizados, riscos e aderência ao objetivo.

### 5.5 RECURSOS

**Finalidade:** mapear infraestrutura, tecnologia, dados, finanças, conhecimento, instalações e ativos necessários.

**Campos específicos:** recurso, categoria, proprietário, disponibilidade, capacidade, custo, criticidade, fornecedor, validade/licença e plano de contingência.

**Workflow padrão:** solicitação → análise → aprovação → aquisição/configuração → disponibilização → manutenção → renovação/descarte.

**Indicadores:** disponibilidade, custo, incidentes, utilização, licenças a vencer e dependência de fornecedor.

### 5.6 ESPÍRITO

**Finalidade:** consolidar propósito, valores, princípios de conduta e cultura desejada.

**Campos específicos:** declaração, comportamento observável, prática associada, evidência, guardião e periodicidade de revisão.

**Workflow padrão:** proposta → consulta → aprovação → comunicação → incorporação em ritos → aferição → revisão.

**Indicadores:** aderência cultural, participação, incidentes éticos, percepção da equipe e ações de cultura.

### 5.7 DIFERENCIAIS

**Finalidade:** registrar capacidades ou atributos percebidos como superiores, comprováveis e juridicamente comunicáveis.

**Campos específicos:** diferencial, público beneficiado, problema resolvido, evidência, comparabilidade, barreira de imitação, validade e autorização de uso.

**Workflow padrão:** hipótese → coleta de evidência → validação interna/cliente → aprovação ética → comunicação → mensuração → revisão.

**Indicadores:** evidências válidas, percepção, conversão atribuível, retenção e diferenciais sem comprovação.

### 5.8 MODELO DE NEGÓCIO

**Finalidade:** definir como valor jurídico é criado, entregue, operado e remunerado.

**Campos específicos:** modalidade (padronizada, customizada, especializada ou híbrida), proposta de valor, canal, capacidade, unidade econômica, riscos e premissas.

**Workflow padrão:** hipótese → desenho → validação jurídica/financeira → piloto → análise → escala, ajuste ou encerramento.

**Indicadores:** margem, tempo de entrega, previsibilidade, satisfação, repetibilidade e aderência ao segmento.

### 5.9 RELACIONAMENTO COM CLIENTES

**Finalidade:** estruturar jornada, comunicação, governança, atendimento, fidelização e cross-selling ético.

**Campos específicos:** etapa da jornada, tipo de relacionamento, canal, cadência, responsável, SLA de resposta, expectativa, consentimento e satisfação.

**Workflow padrão:** entrada → qualificação → conflito → reunião → proposta → contratação → onboarding → atendimento → revisão → encerramento/relacionamento.

**Indicadores:** tempo de resposta, satisfação, retenção, recorrência, reclamações e oportunidades qualificadas.

### 5.10 MARKETING JURÍDICO

**Finalidade:** planejar conteúdo, eventos, presença digital, capital intelectual, imprensa e relacionamento, respeitando as normas aplicáveis.

**Campos específicos:** campanha/conteúdo, objetivo educativo, público, canal, formato, responsável, pauta, base jurídica, revisão ética, consentimentos, agenda e métricas.

**Workflow padrão:** pauta → pesquisa → redação/produção → revisão jurídica → revisão ética → aprovação → publicação → distribuição → mensuração → arquivamento.

**Controles obrigatórios:** checklist de publicidade; vedação de promessa de resultado; proteção de identidade e dados; registro da versão aprovada; trilha de consentimento; bloqueio de publicação sem aprovação quando configurado.

**Indicadores:** alcance qualificado, salvamentos, tempo de consumo, leads consentidos, reuniões originadas e conformidade.

### 5.11 MERCADO JURÍDICO

**Finalidade:** monitorar ambiente regulatório, econômico, tecnológico, concorrencial e jurisprudencial.

**Campos específicos:** sinal/tendência, fonte, data, região, área, impacto, probabilidade, horizonte, confiabilidade e resposta sugerida.

**Workflow padrão:** captura → classificação → validação → avaliação de impacto → decisão → ação → monitoramento.

**Indicadores:** sinais novos, riscos críticos, oportunidades, tempo de resposta e decisões relacionadas.

### 5.12 PRODUTOS E SERVIÇOS JURÍDICOS

**Finalidade:** estruturar portfólio jurídico com escopo, entrega, operação, preço e controle de qualidade.

**Campos específicos:** nome, área, problema, público, entregáveis, exclusões, requisitos, SLA, responsável técnico, fluxo padrão, riscos, preço e documentos-modelo.

**Workflow padrão:** oportunidade → desenho → validação técnica/ética/financeira → piloto → lançamento → operação → avaliação → revisão.

**Indicadores:** demanda, receita, margem, prazo, retrabalho, satisfação, êxito técnico sem promessa comercial e incidentes.

### 5.13 SEGMENTO DO CLIENTE

**Finalidade:** caracterizar públicos atendidos sem misturar pessoas, necessidades e jornadas incompatíveis.

**Campos específicos:** segmento, perfil, localização, porte, setor, dores, necessidades jurídicas, maturidade, riscos, critérios de qualificação e canais adequados.

**Workflow padrão:** hipótese → pesquisa → validação → priorização → proposta específica → acompanhamento → revisão.

**Indicadores:** tamanho estimado, aderência, ciclo, retenção, ticket, custo de atendimento e risco.

### 5.14 ESTRUTURA DE CUSTO

**Finalidade:** planejar e acompanhar tributos, equipe jurídica, marketing, estrutura, despesas de cliente e reservas.

**Campos específicos:** categoria, centro de custo, natureza fixa/variável, competência, valor previsto, realizado, recorrência, responsável, documento e rateio.

**Workflow padrão:** solicitação/previsão → aprovação → compromisso → pagamento → conciliação → análise de variação.

**Indicadores:** previsto x realizado, custo fixo, custo variável, custo por serviço, caixa, reserva e desvios.

### 5.15 FONTES DE RECEITA

**Finalidade:** modelar receita por partido/mensalidade, êxito, pontual e valor-hora, admitindo modalidades adicionais configuráveis.

**Campos específicos:** modalidade, serviço, segmento, gatilho, base de cálculo, faixa, recorrência, condições, previsão, realizado, risco e contrato associado.

**Workflow padrão:** oportunidade → simulação → revisão → proposta → negociação → contratação → faturamento → recebimento → conciliação.

**Indicadores:** receita recorrente, receita por modalidade, ticket, inadimplência, margem, concentração e previsibilidade.

## 6. MOTOR DE WORKFLOWS

### 6.1 Conceito

Cada módulo terá templates próprios, mas todos utilizarão um motor único. O workflow poderá ser manual, baseado em template ou disparado por evento. Um item do Canvas pode ter vários workflows, desde que exista um principal.

### 6.2 Componentes

- gatilho: criação, mudança de status, data, aprovação, formulário, integração ou ação manual;
- etapas: sequenciais ou paralelas;
- tarefa: responsável, prazo, prioridade, checklist, evidência e critério de conclusão;
- decisão: condição, aprovador e rotas de aprovado/reprovado/ajustes;
- espera: tempo ou evento;
- automação: notificação, criação de tarefa, atualização de campo, evento ou webhook;
- SLA: tempo útil ou corrido, calendário e escalonamento;
- encerramento: resultado, evidência, lições aprendidas e atualização de KPI.

### 6.3 Estados e regras

Rascunho → publicado → ativo → pausado → concluído → arquivado. Novas versões não alteram instâncias já iniciadas, salvo migração explícita. Etapas obrigatórias não podem ser ignoradas sem justificativa e permissão. Toda alteração fica no log.

### 6.4 Tarefas

Visualizações: lista, Kanban, calendário, “Minhas tarefas”, por iniciativa e por bloco. Campos: título, origem, responsável, participantes, prioridade, status, início, vencimento, estimativa, tempo apontado opcional, dependências, checklist, anexos, comentários, evidência e recorrência.

### 6.5 Agenda

O calendário terá visão diária, semanal, mensal e cronograma. Deverá suportar compromissos, marcos, prazos, revisões, recorrências, lembretes e disponibilidade. Eventos podem nascer de tarefas ou workflows e manter vínculo bidirecional. Integrações futuras: Google Calendar e Outlook Calendar, mediante consentimento e escopo mínimo.

## 7. CENÁRIOS, VERSÕES E COLABORAÇÃO

- Canvas “Atual”, “Proposto” e cenários alternativos;
- duplicação integral ou seletiva;
- comparação visual entre versões;
- histórico temporal e restauração;
- comentários, menções e reações;
- oficina colaborativa com cursores e presença;
- bloqueio temporário de edição de item;
- submissão para aprovação e publicação de versão oficial;
- registro de decisão: contexto, alternativas, decisão, responsável e data de revisão.

## 8. INDICADORES E RELATÓRIOS

### 8.1 Painel executivo

- saúde do Canvas por bloco;
- itens sem responsável, prazo ou revisão;
- iniciativas por status e objetivo;
- tarefas vencidas e capacidade;
- riscos e bloqueios;
- orçamento e receita;
- KPIs estratégicos;
- revisões pendentes;
- histórico de evolução.

### 8.2 Relatórios

Canvas completo; resumo executivo; plano de ação; portfólio de iniciativas; matriz de responsáveis; agenda consolidada; indicadores; custos e receitas; conformidade de marketing; auditoria; comparação entre versões. Exportações: PDF, XLSX/CSV e JSON, conforme permissão.

## 9. MODELO DE DADOS CONCEITUAL

Entidades principais: Organization, Workspace, User, Membership, Role, Canvas, CanvasVersion, CanvasBlock, Note, Tag, NoteRelation, Objective, KeyResult, Initiative, WorkflowTemplate, WorkflowVersion, WorkflowInstance, WorkflowStep, Task, ChecklistItem, CalendarEvent, Reminder, KPI, KPIRecord, Comment, Attachment, Approval, DecisionLog, CostItem, RevenueItem, Partner, Service, ClientSegment, AuditEvent, Notification e IntegrationConnection.

Relações essenciais:

- Organization possui Workspaces e Memberships;
- Workspace possui Canvases;
- Canvas possui Versions; cada Version possui Notes distribuídas em Blocks;
- Note pode se vincular a Objective, Initiative, Workflow, Task, KPI e outras Notes;
- WorkflowInstance nasce de WorkflowVersion e contém Steps/Tasks;
- Task pode gerar CalendarEvent;
- toda mutação relevante gera AuditEvent.

### 9.1 Campos transversais

id UUID, organization_id, workspace_id, created_at, created_by, updated_at, updated_by, deleted_at, version, confidentiality_level, retention_policy e metadata JSON controlado. Valores financeiros em decimal e moeda ISO; datas armazenadas em UTC e exibidas no fuso do usuário.

## 10. ARQUITETURA TÉCNICA RECOMENDADA

### 10.1 Aplicação

- frontend web responsivo em React/Next.js e TypeScript;
- Canvas com biblioteca de interação gráfica que suporte drag-and-drop, zoom e acessibilidade;
- backend modular com API tipada;
- PostgreSQL como banco transacional;
- armazenamento de objetos para anexos;
- fila para notificações, automações, exportações e integrações;
- canal em tempo real para colaboração e sincronização;
- mecanismo de busca textual e filtros;
- observabilidade com logs, métricas, tracing e alertas.

A implementação pode utilizar Supabase para PostgreSQL, autenticação, políticas por linha, realtime e storage, desde que as regras críticas também sejam validadas no servidor e testadas contra acesso entre organizações.

### 10.2 Domínios do backend

Identidade e acesso; Canvas; estratégia; workflows; tarefas; calendário; portfólio; finanças gerenciais; conteúdo/marketing; arquivos; indicadores; relatórios; integrações; auditoria e administração.

### 10.3 API

Preferência por API REST tipada ou camada RPC bem documentada. Operações de mutação devem aceitar idempotency key quando houver risco de duplicidade. Atualizações concorrentes devem usar versionamento otimista. Webhooks devem ser assinados, repetíveis e auditáveis.

## 11. SEGURANÇA, PRIVACIDADE E CONFORMIDADE

- segregação lógica por organização e workspace;
- autenticação multifator configurável;
- sessões revogáveis e registro de dispositivos;
- criptografia em trânsito e em repouso;
- política de senhas e SSO em planos avançados;
- princípio do menor privilégio;
- logs de auditoria imutáveis para eventos críticos;
- classificação de confidencialidade;
- prevenção de acesso cruzado entre organizações;
- antivírus e validação de anexos;
- backups, teste de restauração e plano de continuidade;
- consentimento, finalidade, retenção, exportação e exclusão conforme aplicáveis;
- resposta a incidentes e registro de violações;
- proteção específica ao sigilo profissional e dados de clientes.

O MVP deve evitar armazenar conteúdo processual sensível além do necessário. Integrações externas precisam informar escopos, finalidade, dados transmitidos e procedimento de revogação.

## 12. REQUISITOS NÃO FUNCIONAIS

- disponibilidade-alvo inicial de 99,5%, evoluindo conforme criticidade;
- carregamento da tela principal em até 3 segundos em conexão regular, excluídas exportações;
- resposta visual de drag-and-drop inferior a 100 ms;
- autosave com indicação de estado;
- acessibilidade alinhada a WCAG 2.2 AA;
- compatibilidade com versões atuais de Chrome, Edge, Safari e Firefox;
- desktop-first com operação funcional em tablet e consulta em celular;
- internacionalização preparada, com pt-BR inicial;
- fuso horário por usuário e calendário de feriados configurável;
- observabilidade e correlação de requisições;
- exportação e portabilidade dos dados;
- restauração de versões e lixeira com retenção configurável.

## 13. NOTIFICAÇÕES E AUTOMAÇÕES

Canais iniciais: in-app e e-mail. Eventos: atribuição, menção, vencimento, atraso, aprovação, bloqueio, comentário, alteração crítica e revisão periódica. O usuário controla preferências, exceto alertas obrigatórios de segurança.

Automações exemplificativas:

- ao aprovar ação estratégica, criar iniciativa e workflow;
- sete dias antes da revisão de um post-it, notificar responsável;
- ao vencer tarefa crítica, escalar para coordenador;
- ao publicar conteúdo, criar tarefa de mensuração em sete e trinta dias;
- ao aprovar serviço, gerar checklist de lançamento;
- ao registrar custo recorrente, projetar competências futuras;
- ao alterar fonte de receita, solicitar revisão financeira.

## 14. ONBOARDING E RITOS DE GESTÃO

### 14.1 Onboarding guiado

1. Criar organização e workspace;
2. selecionar perfil de atuação;
3. escolher Canvas vazio, assistido ou modelo;
4. responder diagnóstico orientado por bloco;
5. revisar post-its sugeridos;
6. priorizar três objetivos;
7. converter ações em iniciativas;
8. atribuir responsáveis e datas;
9. agendar primeira revisão;
10. publicar versão inicial.

### 14.2 Ritos

- semanal: tarefas, impedimentos e próximos prazos;
- mensal: KPIs, capacidade, custos, receitas e iniciativas;
- trimestral: revisão completa do Canvas e cenários;
- anual: planejamento, orçamento, portfólio e versão oficial.

## 15. ESCOPO DO MVP

### 15.1 Incluído

- autenticação, organização, workspace e papéis básicos;
- Canvas visual com 15 blocos;
- post-its, cores, filtros, drag-and-drop e autosave;
- drawer de detalhes, comentários e anexos;
- iniciativas, workflows lineares, tarefas e calendário interno;
- notificações in-app/e-mail;
- histórico de alterações;
- templates iniciais por módulo;
- indicadores essenciais;
- exportação PDF A0–A3 e PNG;
- painel administrativo e logs básicos.

### 15.2 Fora do MVP

Integrações profundas com sistemas processuais; faturamento fiscal; contabilidade; CRM completo; IA autônoma; workflows BPMN complexos; marketplace; aplicativo nativo; assinatura eletrônica; benchmarking com dados de terceiros.

## 16. EVOLUÇÃO POR FASES

**Fase 0 — Descoberta e UX (3–5 semanas):** entrevistas, jornadas, wireframes, protótipo navegável, taxonomia, regras e testes de usabilidade.

**Fase 1 — MVP (10–14 semanas):** fundação, Canvas, post-its, workflows lineares, tarefas, agenda, exportação e auditoria básica.

**Fase 2 — Gestão avançada (8–12 semanas):** cenários, capacidade, indicadores, aprovações, automações, relatórios e integrações de calendário.

**Fase 3 — Inteligência e escala:** assistente de diagnóstico, sugestões explicáveis, comparação de cenários, integrações jurídicas, multiunidade, SSO e analytics avançado.

## 17. ÉPICOS E HISTÓRIAS-CHAVE

### ÉPICO A — CANVAS VISUAL

- Como gestor, quero visualizar todos os blocos e post-its em uma tela para compreender o modelo.
- Como editor, quero criar, mover e editar post-its para atualizar a estratégia.
- Como usuário, quero filtrar por responsável, status e período para focar no que importa.
- Como gestor, quero exportar o Canvas em A0–A3 para reuniões presenciais.

### ÉPICO B — EXECUÇÃO

- Como gestor, quero converter post-it em iniciativa sem redigitar informações.
- Como coordenador, quero aplicar workflow e distribuir tarefas.
- Como executor, quero visualizar minhas tarefas e registrar evidências.
- Como responsável, quero receber alertas antes do vencimento.

### ÉPICO C — GOVERNANÇA

- Como administrador, quero controlar quem acessa cada workspace.
- Como auditor, quero saber quem alterou uma decisão e quando.
- Como gestor, quero comparar versões e restaurar conteúdo.
- Como responsável por privacidade, quero exportar e excluir dados conforme regras aplicáveis.

## 18. CRITÉRIOS DE ACEITAÇÃO ESSENCIAIS

1. Um post-it criado no módulo lateral aparece no bloco correto sem recarregar a página.
2. Uma movimentação no Canvas persiste posição e histórico.
3. Um usuário sem permissão não lê nem altera o recurso por interface ou API.
4. A conversão em iniciativa preserva vínculo com o post-it original.
5. Tarefas geradas por workflow herdam responsável/prazo conforme regras.
6. Alteração de tarefa atualiza o progresso da iniciativa e a indicação do post-it.
7. Evento originado de tarefa permanece sincronizado sem duplicação.
8. Exportação respeita filtros, versão e dimensões escolhidas.
9. Concorrência não sobrescreve silenciosamente mudanças de outro usuário.
10. Toda alteração crítica aparece no log com autor, data e antes/depois.

## 19. MÉTRICAS DE SUCESSO DO PRODUTO

- tempo até publicar o primeiro Canvas;
- percentual de organizações que retornam à revisão semanal;
- post-its convertidos em iniciativas;
- iniciativas com responsável, prazo e KPI;
- tarefas concluídas no prazo;
- usuários ativos semanais por organização;
- taxa de conclusão do onboarding;
- exportações e apresentações realizadas;
- satisfação do usuário e taxa de recomendação;
- incidentes de permissão, perda de dados ou sincronização.

## 20. RISCOS E MITIGAÇÕES

- **Complexidade excessiva:** cadastro progressivo, templates e modos básico/avançado.
- **Canvas ilegível:** zoom, filtros, agrupamento, arquivamento e limite visual por bloco.
- **Estratégia sem execução:** conversão orientada para iniciativa e ritos automáticos.
- **Exposição de dados:** classificação, RBAC, políticas por linha, auditoria e testes de isolamento.
- **Adoção baixa:** onboarding assistido, exemplos por perfil e valor entregue na primeira sessão.
- **Conflito de edição:** colaboração em tempo real, versionamento otimista e histórico.
- **Uso inadequado em marketing:** checklists, aprovações e registro de conformidade.
- **Dependência de integrações:** núcleo funcional independente e conectores desacoplados.

## 21. DECISÕES DE DESIGN A VALIDAR

1. Post-its livres ou limite recomendado por bloco;
2. cores livres ou semântica institucional;
3. workflow simples próprio ou notação BPMN em fase futura;
4. granularidade de permissão por bloco no MVP;
5. calendário próprio versus integração já no MVP;
6. presença de dados financeiros reais ou apenas planejamento gerencial;
7. modelos de Canvas por área e porte;
8. requisitos de residência e retenção de dados;
9. identidade visual e nomenclatura definitiva;
10. posicionamento comercial: SaaS, consultoria assistida ou híbrido.

## 22. ARTEFATOS DERIVADOS RECOMENDADOS

Este blueprint deverá originar, em sequência:

1. PRD do MVP com requisitos funcionais numerados;
2. mapa de jornadas e fluxos de navegação;
3. wireframes low-fidelity;
4. protótipo high-fidelity e design system;
5. modelo lógico do banco e dicionário de dados;
6. especificação OpenAPI;
7. catálogo de eventos e automações;
8. matriz RBAC e ameaça/risco;
9. plano de testes e critérios de aceite;
10. backlog técnico por sprint;
11. plano de implantação, suporte e continuidade;
12. documentação de autoria, decisões e versões para proteção dos ativos intelectuais.

## 23. DEFINIÇÃO DE PRONTO DO BLUEPRINT

O blueprint estará validado quando representantes das personas principais conseguirem: compreender a proposta; completar um Canvas inicial; converter pelo menos uma ação em iniciativa; executar um workflow; receber tarefa e prazo; visualizar o compromisso em agenda; acompanhar um indicador; comparar uma versão; e exportar o quadro, sem ambiguidade funcional relevante.

---

**Síntese de arquitetura:** o Legal Canvas é a interface estratégica; os post-its são objetos de domínio; as iniciativas organizam execução; os workflows coordenam etapas; as tarefas materializam responsabilidade; a agenda materializa tempo; os indicadores medem resultado; e a auditoria preserva governança.
