# Critérios de aceite — MVP Dashboard Jurídico

Projeto: `analista-processual-web`  
Handoff: `squads/squad-juridico-legal-performance/handoff/apex/`

## Globais (todas as telas)

| ID | Critério | Verificação |
|---|---|---|
| G-01 | WCAG AA em componentes novos | `*discover-a11y` ou axe manual em home + caso |
| G-02 | Navegação por teclado | Tab order lógico; drawer fecha com Esc |
| G-03 | Risco não só por cor | Ícone + texto + badge em riscos e gates |
| G-04 | Typecheck e lint passam | `npm run build` no app |
| G-05 | Sem secrets no repo | Apenas `.env.example` |

## Dashboard home

| ID | Critério | Verificação |
|---|---|---|
| H-01 | Cards de prazos, riscos e revisão pendente | Visíveis acima da tabela |
| H-02 | Tabela de casos com colunas fase, risco, prazo, gates | Dados mock ou API existente |
| H-03 | CTA "Nova análise" leva a `/dashboard/nova-analise` | Link funcional |
| H-04 | Filtro por risco ou prazo | Ao menos um filtro aplicável |

## Detalhe do caso

| ID | Critério | Verificação |
|---|---|---|
| C-01 | Abas: visão geral, documentos, timeline, riscos, quality gates | Tabs navegáveis |
| C-02 | Sumário executivo na visão geral | Texto ou placeholder estruturado |
| C-03 | Painel de quality gates com status Aprovado/Bloqueado/Pendente | Estados distintos |
| C-04 | Plano de ação (top itens) na visão geral | Lista ou tabela compacta |

## Human review e exportação

| ID | Critério | Verificação |
|---|---|---|
| R-01 | Banner visível quando revisão pendente | Não removível por CSS overflow |
| R-02 | Botão exportar desabilitado se gate bloqueado | `disabled` + tooltip com ID do gate |
| R-03 | Após marcar "revisado" (mock), exportar habilita | Toggle ou botão de demo |

## Documentos

| ID | Critério | Verificação |
|---|---|---|
| D-01 | Lista com tipo, status de extração, ação revisar | Tabela ou cards |
| D-02 | Wizard em 3 passos ou evolução da página nova-analise | Upload → classificar → lacunas |
| D-03 | Mensagem de erro para arquivo inválido | Tamanho/tipo rejeitado |

## Timeline

| ID | Critério | Verificação |
|---|---|---|
| T-01 | Eventos ordenados por data | Ordem cronológica |
| T-02 | Cada evento exibe origem (documento ou manual) | Label visível |
| T-03 | Ação abre Evidence drawer | Clique abre painel lateral |

## Matriz de riscos

| ID | Critério | Verificação |
|---|---|---|
| K-01 | Colunas probabilidade, impacto, base legal, mitigação | Tabela completa |
| K-02 | Link "evidência" por linha | Abre drawer |

## Evidence drawer

| ID | Critério | Verificação |
|---|---|---|
| E-01 | Campos: fonte, trecho, tipo, confiabilidade | Todos preenchidos no mock |
| E-02 | Fecha com Esc e botão X | A11y focus trap básico |
| E-03 | Reutilizável em timeline e riscos | Mesmo componente |

## Regressão de conteúdo (squad)

| ID | Critério | Verificação |
|---|---|---|
| S-01 | Scripts de baseline passam | `run-smoke-baselines.sh` exit 0 |
| S-02 | Brief não misturado com código TSX no handoff | Revisão manual |

## Definition of Done (MVP)

- [ ] Critérios G-01 a G-05 atendidos
- [ ] Pelo menos 80% dos critérios H/C/R/D/T/K/E implementados ou com TODO explícito no PR
- [ ] README do app atualizado com novas rotas/componentes
- [ ] PR referencia este handoff e o brief `brief-dashboard-juridico.md`
