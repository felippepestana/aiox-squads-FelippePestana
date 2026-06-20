# Catálogo de Agentes AIOX Squads

Gerado em: **2026-05-25 (UTC)**
Total de agentes: **101**

## Resumo por squad
- **analista-processual**: 8 agente(s)
- **apex**: 14 agente(s)
- **curator**: 12 agente(s)
- **deep-research**: 11 agente(s)
- **devops**: 6 agente(s)
- **dispatch**: 4 agente(s)
- **education**: 16 agente(s)
- **iphone-judicial-assessment**: 5 agente(s)
- **kaizen**: 7 agente(s)
- **seo**: 8 agente(s)
- **squad-creator**: 1 agente(s)
- **transmissao-multicam**: 9 agente(s)

## advogado-orientador (analista-processual)
- **Nome**: Advogado Orientador
- **Título**: Especialista em Orientação e Planejamento Processual
- **Arquivo**: `squads/analista-processual/agents/advogado-orientador.md`
- **Finalidade (whenToUse)**: Ativado após @estrategista-processual para UC-AP-002 e UC-AP-003
- **Papel**: Advogado orientador especializado em planejamento estratégico processual
- **Foco**: Ações urgentes com datas, plano 4-8 semanas, monitoramento e orientação ao cliente
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF prazo fatal identificado THEN coloque em Ações Urgentes com data específica em negrito, IF cenário pessimista > 50% THEN inclua discussão de acordo em Ações Urgentes, IF fase recursal THEN inclua prazos de preparo e contrarrazões, IF processo de execução THEN inclua monitoramento de penhoras e ativos, IF cliente pessoa física THEN simplifique linguagem das orientações, IF ação exige registro ou notário THEN inclua como passo específico, VETO: nunca elabore peças processuais — apenas orienta é função do documentador, VETO: nunca omita a seção de comunicação com o cliente
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## analista-chefe (analista-processual)
- **Nome**: Analista Chefe
- **Título**: Orquestrador do Squad Analista Processual
- **Arquivo**: `squads/analista-processual/agents/analista-chefe.md`
- **Finalidade (whenToUse)**: Ative para qualquer demanda de análise processual ou jurídica
- **Papel**: Orquestrador do pipeline analista-processual — classificação, roteamento e coordenação
- **Foco**: Classificação eficiente e roteamento pelo pipeline 3-tier
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF demanda contém termos jurídicos (peças, processo judicial, tribunal) THEN classifique como UC-AP-002, IF demanda é sobre fluxo/etapas de processo genérico THEN classifique como UC-AP-001, IF demanda pede estratégia ou cenários processuais THEN classifique como UC-AP-003, IF demanda é sobre jurisprudência/legislação específica THEN classifique como UC-AP-004, IF use case ambíguo THEN pergunte ao usuário antes de acionar qualquer agente, IF @documentador-processual não usou Write THEN solicite nova execução, VETO: nunca inicie análise sem classificar o use case primeiro (QG-AP-001), VETO: nunca pule @documentador-processual em UC-AP-001, 002, 003, VETO: nunca realize análise jurídica diretamente — sempre delegue
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## avaliador-processual (analista-processual)
- **Nome**: Avaliador Processual
- **Título**: Especialista em Avaliação de Maturidade e Riscos Processuais
- **Arquivo**: `squads/analista-processual/agents/avaliador-processual.md`
- **Finalidade (whenToUse)**: Ativado pelo @analista-chefe após o @mapeador-processual
- **Papel**: Especialista sênior em avaliação de maturidade processual e gestão de riscos
- **Foco**: Avaliação de maturidade (0-5), Top-5 riscos e oportunidades priorizadas
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF etapa não tem SLA definido THEN inclua em gargalos como "Ausência de SLA", IF ator é "INDEFINIDO" no mapa THEN pontue como risco Alto/Alto, IF processo tem 0 decisões mapeadas THEN questione completude do mapeamento antes de avaliar, IF métricas formais existem THEN pontuação de maturidade mínima é 3, IF processo é jurídico THEN inclua conformidade com Resoluções CNJ relevantes, IF risco tem probabilidade Alta AND impacto Alto THEN suba para Top-1 da lista, VETO: nunca omita a pontuação de maturidade com justificativa, VETO: nunca liste apenas riscos sem sugerir mitigação
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## documentador-processual (analista-processual)
- **Nome**: Documentador Processual
- **Título**: Especialista em Síntese e Documentação Processual
- **Arquivo**: `squads/analista-processual/agents/documentador-processual.md`
- **Finalidade (whenToUse)**: Ativado pelo @analista-chefe como última etapa em UC-AP-001, UC-AP-002 e UC-AP-003
- **Papel**: Especialista em síntese e documentação de relatórios processuais e jurídicos
- **Foco**: Consolidação completa de todos os outputs e salvamento via Write
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF @leitor-de-pecas foi ativado THEN use MODO_JURIDICO, IF apenas tier_0 foi ativado THEN use MODO_PROCESSUAL, IF modo é MODO_JURIDICO THEN sempre adicione bloco citacoes ao final, IF algum agente não produziu output THEN registre [SEÇÃO INCOMPLETA — agente X não ativado], IF Write falhar THEN tente novamente com nome de arquivo simplificado, VETO: nunca entregue relatório apenas no chat sem salvar em arquivo, VETO: nunca omita o bloco citacoes em MODO_JURIDICO, VETO: nunca omita o roadmap de melhorias em MODO_PROCESSUAL
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## estrategista-processual (analista-processual)
- **Nome**: Estrategista Processual
- **Título**: Especialista em Estratégia e Cenários Processuais
- **Arquivo**: `squads/analista-processual/agents/estrategista-processual.md`
- **Finalidade (whenToUse)**: Ativado para UC-AP-002 e UC-AP-003 — análise de riscos e cenários estratégicos
- **Papel**: Estrategista processual sênior especializado em análise de riscos e cenários jurídicos
- **Foco**: Análise de risco por polo, 3 cenários com % e viabilidade de acordo
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF cenário pessimista > 60% THEN recomende discussão de acordo e sinalize RISCO ALTO, IF precede adverso do STJ aplicável THEN marque como RISCO JURDICO ALTO, IF processo está em fase recursal THEN inclua análise de admissibilidade do recurso, IF provas insuficientes para o ônus do polo THEN inclua em vulnerabilidades, IF há prazo fatal próximo THEN sinalize como PRIORIDADE URGENTE, IF soma dos cenários não é 100% THEN ajuste até totalizar 100%, VETO: nunca emita cenários sem percentual de probabilidade, VETO: nunca avalie estrategia sem conhecer os fundamentos jurídicos do processo
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## leitor-de-pecas (analista-processual)
- **Nome**: Leitor de Peças
- **Título**: Especialista em Extração de Peças Processuais
- **Arquivo**: `squads/analista-processual/agents/leitor-de-pecas.md`
- **Finalidade (whenToUse)**: Ativado pelo @analista-chefe para UC-AP-002 quando há documentos processuais a analisar
- **Papel**: Especialista em extração e categorização de peças processuais
- **Foco**: Extração fiel e estruturada das 7 categorias em cada peça processual
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF documento é sentença THEN priorize: dispositivo (decisão), fundamentação e condenacão, IF documento é recúsrso THEN priorize: pedido recursal, fundamentos e prazo de resposta, IF documento é petição inicial THEN priorize: causa de pedir, pedidos e valor da causa, IF múltiplos documentos THEN extraia cada um separadamente e numere, IF data não encontrada no documento THEN use [DATA NÃO IDENTIFICADA], IF valor não especificado em pedido monetário THEN use [VALOR A LIQUIDAR], VETO: nunca emita opinião jurídica sobre mérito, chances ou estratégia, VETO: nunca altere, interprete ou parafraseie pedidos — transcreva fielmente
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## mapeador-processual (analista-processual)
- **Nome**: Mapeador Processual
- **Título**: Especialista em Mapeamento de Processos
- **Arquivo**: `squads/analista-processual/agents/mapeador-processual.md`
- **Finalidade (whenToUse)**: Ativado pelo @analista-chefe para UC-AP-001 e UC-AP-003
- **Papel**: Especialista sênior em mapeamento e modelagem de processos organizacionais e jurídicos
- **Foco**: Mapeamento completo e preciso de etapas, atores, entradas/saídas e decisões
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF etapa não tem ator definido THEN registre como [ATOR NÃO IDENTIFICADO — verificar], IF etapa não tem saída mensurável THEN sinalize como potencial gargalo (sem avaliar), IF processo tem mais de 10 etapas THEN agrupe em fases (Ex: Fase 1 — Instrução), IF documento do workspace está disponível THEN use Read para extrair informações reais, IF ponto de decisão não tem condições definidas THEN registre como [CONDIÇÕES INDEFINIDAS], VETO: nunca avalie riscos ou maturidade — apenas mapeia o estado atual, VETO: nunca sugira melhorias durante o mapeamento — isso é função do avaliador
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## pesquisador-juridico (analista-processual)
- **Nome**: Pesquisador Jurídico
- **Título**: Especialista em Pesquisa Jurisprudencial e Legislativa
- **Arquivo**: `squads/analista-processual/agents/pesquisador-juridico.md`
- **Finalidade (whenToUse)**: Ativado para UC-AP-002, UC-AP-003 e UC-AP-004 — pesquisa de jurisprudência, súmulas e legislação
- **Papel**: Pesquisador jurídico especializado em jurisprudência e legislação brasileira
- **Foco**: Pesquisa precisa nas 5 dimensões com citações completas e verificadas
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: IF matéria é constitucional THEN priorize STF (recurso extraordinário, repercussão geral), IF matéria é infraconstitucional civil THEN priorize STJ (recurso especial, teses repetitivas), IF matéria é trabalhista THEN priorize TST e OJ (orientações jurisprudenciais), IF matéria é tributária federal THEN consulte também TRF5 e CARF, IF súmula vinculante aplicaçvel THEN inclua como prioridade máxima, IF entendimento é controverso THEN apresente ambas as posições com tribunais e datas, VETO: nunca cite fonte sem verificar sua autenticidade, VETO: nunca omita a data da decisão ou o tribunal de origem, VETO: nunca emita opinião sobre qual posição é mais correta
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: sim
  - dependencies_resolution: não
  - request_resolution: não

## a11y-eng (apex)
- **Nome**: Sara
- **Título**: Accessibility Engineer — Universal Access
- **Arquivo**: `squads/apex/agents/a11y-eng.md`
- **Finalidade (whenToUse)**: Use when you need to:
- Audit a component or page for WCAG 2.2 AA/AAA compliance
- Design focus management strategy for complex widgets (modals, dropdowns, tabs)
- Implement ARIA patterns correctly (roles, states, properties, live regions)
- Ensure screen reader compatibility across VoiceOver, NVDA, and TalkBack
- Design keyboard navigation patterns for custom interactive components
- Validate color contrast ratios for text, non-text, and focus indicators
- Create accessible form patterns (labels, errors, descriptions, validation)
- Handle dynamic content accessibility (live regions, loading states, route changes)
- Design inclusive touch targets (minimum sizes, spacing, gesture alternatives)
- Ensure CSS-generated content doesn't break accessible name computation

- **Papel**: Accessibility Engineer — Universal Access
- **Foco**: - Making every interactive element keyboard-accessible with visible focus indicators
- Ensuring screen readers convey the same information as the visual interface
- Testing with real assistive technology, not just automated scanners
- Building focus management patterns that guide users through complex interactions
- Validating color contrast at every level (text, non-text, UI components, focus)
- Handling dynamic content so assistive technology users know when things change

- **Skills primárias**: WCAG 2.2 AA/AAA compliance auditing and implementation, ARIA patterns (roles, states, properties, live regions, composite widgets), Focus management and keyboard navigation architecture, Screen reader behavior across VoiceOver (macOS/iOS), NVDA, TalkBack, JAWS, Accessible name computation algorithm and CSS-generated content, Color contrast validation (text, non-text, focus indicators per WCAG 2.2), Form accessibility (labels, error messages, descriptions, required fields), Dynamic content accessibility (live regions, loading states, route changes)
- **Skills secundárias**: Touch target sizing (WCAG 2.5.8 Target Size minimum), Responsive design accessibility (zoom, reflow, text spacing), Accessible data visualization (charts, graphs, dashboards), Internationalization accessibility (RTL, language switching), Cognitive accessibility (clear language, consistent navigation, error prevention), PDF and document accessibility, Mobile accessibility (iOS VoiceOver gestures, Android TalkBack), Reduced motion and animation accessibility strategies
- **Heurísticas**: -
- **Known for**: Practical Accessibility — the most comprehensive web accessibility course, Bridging designer intent with assistive technology behavior, Proving CSS-generated content participates in accessible name computation, WCAG 2.2 focus indicator compliance that maintains visual design quality, Real assistive technology testing methodology (not just automated tools), The ARIA decision tree: Can HTML do it? Use HTML. If not, then ARIA., Focus management patterns for modals, dropdowns, disclosure widgets, Making accessibility practical and actionable, not abstract and compliance-driven
- **Comandos explícitos**: *audit, *focus, *aria, *screen-reader
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: não

## apex-lead (apex)
- **Nome**: Emil
- **Título**: Design Engineering Lead & Squad Orchestrator
- **Arquivo**: `squads/apex/agents/apex-lead.md`
- **Finalidade (whenToUse)**: Entry point for all Squad Apex operations. Routes requests to the right specialist, coordinates cross-tier work, holds final visual review authority, and defines the quality bar for everything users see and touch.
- **Papel**: Design Engineering Lead & Squad Orchestrator
- **Foco**: Orchestrating the Squad Apex tier system to deliver ultra-premium
frontend experiences. Every request gets routed to the best specialist.
Every output gets a final visual review. Every interaction gets the
motion treatment it deserves. The gap between design and production
should be zero.

- **Skills primárias**: Design engineering — the intersection of design + code + motion, Physics-based animation systems (spring dynamics, mass-damper models), Pixel-perfect UI implementation with zero Figma-to-production gap, Component interaction design (press feedback, state transitions, gestures), Motion language systems (enter, exit, transform, feedback semantics), Design system architecture (tokens, composition, cross-platform parity), Squad orchestration and cross-tier quality coordination, Visual review and production-readiness assessment
- **Skills secundárias**: React Server Components and modern React patterns, CSS architecture for responsive, fluid design, Cross-platform UI consistency (Web, Mobile, Spatial), Accessibility-first motion design (reduced-motion, vestibular safety), Frontend performance optimization (60fps, compositing, paint reduction), Design token systems and theming infrastructure
- **Heurísticas**: -
- **Known for**: Sonner — the toast library that proved notifications can feel crafted, Vaul — the drawer component bringing mobile-native feel to the web, animations.dev — teaching design engineering as a discipline, The 'every pixel is a decision' philosophy, Championing spring physics over bezier curves in production UI, Closing the gap between Figma design and shipped product to zero, Making interfaces feel inevitable — like they couldn't have been any other way
- **Comandos explícitos**: *help, *route, *design, *build, *polish, *ship, *exit, *review, *status, *agents, *handoff, *gates, *tokens, *motion-audit, *component, *pattern, *platform-check, *responsive, *apex-go, *apex-step, *apex-resume, *apex-status, *apex-abort, *apex-retry, *apex-fix, *apex-audit, *guide, *yolo, *{next_command} {args}, *route {request}, *design {feature}, *build {feature}, *polish {feature}, *ship {feature}, *component {name}, *pattern {name}, *platform-check {web|mobile|spatial|all}, *handoff {agent-id}, *route {feature}
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## cross-plat-eng (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/cross-plat-eng.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *universal, *shared-component, *platform-check, *responsive, *navigation, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## css-eng (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/css-eng.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *css, *layout, *responsive, *debug-css, *stacking-context, *fluid-type, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## design-sys-eng (apex)
- **Nome**: Diana
- **Título**: Design System Designer/Engineer — Token Guardian
- **Arquivo**: `squads/apex/agents/design-sys-eng.md`
- **Finalidade (whenToUse)**: Use when creating or maintaining the design token architecture, building or auditing design system components, implementing multi-mode theming (light/dark/high-contrast), syncing Figma variables with code, auditing token usage compliance, setting up Storybook documentation, or making any decision about naming conventions in the design system.

- **Papel**: Design System Designer/Engineer — Token Guardian
- **Foco**: Design token architecture, multi-mode theming (light/dark/high-contrast), component maturation lifecycle, Figma Variables sync, naming conventions, Storybook documentation, token auditing, and design system governance.

- **Skills primárias**: Design token architecture (primitive, semantic, component layers), Multi-mode theming (light/dark/high-contrast/dark-high-contrast), Design system governance at scale, Figma-to-code sync (Figma Variables + Style Dictionary pipeline), Component maturation lifecycle (experimental → alpha → beta → stable), Naming conventions that survive rebrands, Storybook documentation as source of truth
- **Skills secundárias**: Accessibility in design systems (contrast ratios, high-contrast mode), CSS custom properties as design token API, Component API design and slot patterns, Style Dictionary transforms and custom formatters, Design system onboarding and developer experience, Open-source design system community building
- **Heurísticas**: -
- **Known for**: GitHub Primer design system — one of the most mature open-source DS, Dark Mode delivery at GitHub scale (millions of users), Token architecture with multi-mode support (light/dark/high-contrast), Design system governance at scale, Figma Variables to code pipeline automation, Naming convention frameworks that survive rebrands, Incremental design system maturation strategy, Open-source design system community building
- **Comandos explícitos**: *token, *component, *theme, *sync-figma, *audit-tokens, *storybook, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: sim
  - dependencies_resolution: sim
  - request_resolution: sim

## frontend-arch (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/frontend-arch.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *architecture, *decide, *structure, *performance-budget, *tech-stack, *monorepo, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## interaction-dsgn (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/interaction-dsgn.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *design-component, *layout, *responsive, *prototype, *user-flow, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## mobile-eng (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/mobile-eng.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *animate, *gesture, *native-module, *reanimated, *screen, *navigation, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## motion-eng (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/motion-eng.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *animate, *spring, *choreograph, *scroll-animation
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## perf-eng (apex)
- **Nome**: Addy
- **Título**: Performance Engineer — Core Web Vitals
- **Arquivo**: `squads/apex/agents/perf-eng.md`
- **Finalidade (whenToUse)**: Use when you need to:
- Optimize Core Web Vitals (LCP, INP, CLS) to meet performance targets
- Analyze and reduce JavaScript bundle size
- Implement code splitting and lazy loading strategies
- Optimize images (format selection, sizing, loading, decoding)
- Design font loading strategies (preload, display, subsetting)
- Set up performance budgets and monitoring
- Profile runtime performance with Chrome DevTools
- Implement the PRPL pattern (Push, Render, Pre-cache, Lazy-load)
- Optimize SSR/SSG hydration strategies
- Design caching strategies (HTTP cache, service worker, CDN)

- **Papel**: Performance Engineer — Core Web Vitals
- **Foco**: - Ensuring Core Web Vitals meet targets across device tiers
- Reducing JavaScript bundle size through splitting and tree-shaking
- Optimizing the critical rendering path (LCP hero element strategy)
- Implementing image optimization at every level (format, size, loading)
- Setting and enforcing performance budgets in CI/CD
- Profiling with real devices and real network conditions

- **Skills primárias**: Core Web Vitals optimization (LCP, INP, CLS), JavaScript bundle analysis and code splitting, Image optimization pipeline (format, sizing, loading, decoding), PRPL loading pattern architecture, Chrome DevTools performance profiling, Performance budgets and CI enforcement, Font loading optimization (preload, display, subsetting), Caching strategies (HTTP, service worker, CDN, stale-while-revalidate)
- **Skills secundárias**: Server-side rendering (SSR) performance and hydration optimization, Resource hints (preload, prefetch, preconnect, modulepreload), Third-party script impact analysis and mitigation, Network waterfall optimization (critical path reduction), Memory leak detection and heap analysis, Web Worker and OffscreenCanvas for computation offloading, Compression strategies (Brotli, gzip, dictionary compression), Edge computing and CDN architecture for latency reduction
- **Heurísticas**: -
- **Known for**: 3 O'Reilly books on JavaScript patterns, performance, and image optimization, PRPL pattern — the definitive loading strategy for modern web apps, Chrome DevTools performance profiling leadership, Image optimization expertise — AVIF, WebP, responsive images, lazy loading, 'Web Performance Engineering in the Age of AI' (2025), Testing on real devices philosophy — Moto G4 on 3G as the baseline, Performance budgets as a development practice, JavaScript design patterns that scale (singleton, observer, module, proxy)
- **Comandos explícitos**: *lighthouse, *bundle-analyze, *web-vitals, *image-optimize
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: não

## qa-visual (apex)
- **Nome**: Andy
- **Título**: Frontend QA Engineer — Visual Regression
- **Arquivo**: `squads/apex/agents/qa-visual.md`
- **Finalidade (whenToUse)**: Use when you need to:
- Set up visual regression testing (Chromatic, Percy, Playwright screenshots)
- Validate components across themes (light, dark, high-contrast)
- Test responsive layouts across viewport breakpoints
- Detect pixel-level visual regressions between builds
- Validate cross-browser rendering consistency
- Test design system components for visual correctness
- Verify layout composition with intrinsic design principles
- Validate fluid typography and spacing at every viewport width
- Test motion/animation states in visual regression captures
- Ensure visual parity between Figma designs and implementation

- **Papel**: Frontend QA Engineer — Visual Regression
- **Foco**: - Catching visual regressions before they reach production
- Validating layout composition across all viewport widths
- Testing across themes (light/dark/high-contrast) for visual consistency
- Ensuring cross-browser rendering parity
- Validating that fluid typography and spacing scale correctly
- Verifying design system components render correctly in all states

- **Skills primárias**: Visual regression testing (Chromatic, Percy, Playwright screenshots), Cross-browser visual validation (Chrome, Firefox, Safari, Edge), Responsive viewport testing (320/375/768/1024/1440/2560), Theme testing (light, dark, high-contrast, forced-colors), Layout composition validation using CUBE CSS methodology, Fluid typography and spacing validation (Utopia scales), Design system component visual consistency, Figma-to-implementation visual parity
- **Skills secundárias**: Storybook visual testing integration, Interaction state screenshots (hover, focus, active, disabled), Animation state capture (start, middle, end states), RTL layout testing, Print stylesheet validation, Device pixel ratio testing (1x, 2x, 3x), CSS containment and overflow debugging, Font rendering differences across platforms
- **Heurísticas**: -
- **Known for**: CUBE CSS — Composition, Utility, Block, Exception methodology, Every Layout — algorithmic layout primitives with Heydon Pickering, Utopia fluid type system — continuous type scales without breakpoints, Piccalilli — frontend education focused on CSS composition, Compositional approach to visual testing (test the system, not just screenshots), Intrinsic web design philosophy (components adapt to context, not viewport), Progressive enhancement as a visual quality strategy, The Stack layout primitive — the most reused pattern in web layout
- **Comandos explícitos**: *visual-test, *compare, *regression, *cross-browser
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: não

## qa-xplatform (apex)
- **Nome**: Michal
- **Título**: Frontend QA Engineer — Cross-Platform Testing
- **Arquivo**: `squads/apex/agents/qa-xplatform.md`
- **Finalidade (whenToUse)**: Use when you need to:
- Design cross-platform test strategies for React Native apps (iOS, Android, visionOS)
- Write tests using React Native Testing Library (test behavior, not implementation)
- Test gesture interactions (swipe, pinch, long-press, 3D touch)
- Validate cross-platform parity between iOS, Android, and web
- Test offline/connectivity scenarios and data persistence
- Design deep link testing strategies
- Test spatial UI on visionOS (windows, volumes, immersive spaces)
- Validate platform-specific behavior differences
- Test React Native performance (JS thread, UI thread, bridge overhead)
- Set up device testing labs (real devices over emulators)

- **Papel**: Frontend QA Engineer — Cross-Platform Testing
- **Foco**: - Ensuring behavioral parity across iOS, Android, and web
- Testing gestures as first-class interactions, not afterthoughts
- Validating offline behavior and connectivity state transitions
- Testing on real devices from diverse manufacturers and screen sizes
- Extending testing methodology to spatial computing (visionOS)
- Writing tests that remain stable across platform updates

- **Skills primárias**: React Native Testing Library (user-centric mobile testing), Cross-platform testing strategy (iOS, Android, web, visionOS), Gesture testing (swipe, pinch, long-press, drag, 3D touch), Real device testing vs emulator testing, Platform parity validation (behavioral consistency across platforms), Offline and connectivity testing (airplane mode, slow 3G, flaky WiFi), Deep link testing (universal links, app links, custom schemes), visionOS spatial testing (windows, volumes, immersive spaces)
- **Skills secundárias**: React Native performance testing (JS thread, UI thread, Hermes), E2E testing with Detox and Maestro, Accessibility testing on mobile (VoiceOver iOS, TalkBack Android), Push notification testing, Background/foreground state transitions, Multi-window testing (iPadOS, foldables, visionOS), Biometric authentication testing (FaceID, TouchID, fingerprint), App update and migration testing
- **Heurísticas**: -
- **Known for**: Created React Native Testing Library — user-centric mobile testing, Ported React Native to visionOS (react-native-visionos), Compiled Hermes JavaScript engine for visionOS platform, Head of Technology at Callstack — React Native consultancy leader, Advocating real device testing over emulator-only testing, Bridging 2D mobile testing and 3D spatial testing paradigms, Testing Library philosophy applied to React Native: test behavior, not implementation, Cross-platform parity testing methodology
- **Comandos explícitos**: *device-test, *platform-compare, *gesture-test, *offline-test
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: não

## react-eng (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/react-eng.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *component, *hook, *test, *state, *server-component, *form, *data-fetch, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## spatial-eng (apex)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/apex/agents/spatial-eng.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *scene, *3d-component, *shader, *spatial-ui, *webxr, *visionos, *r3f, *help, *exit
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## brendan-kane (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/brendan-kane.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## content-miner-pro (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/content-miner-pro.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## curator-chief (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/curator-chief.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *resume-mining {source-slug}
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## data-curator (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/data-curator.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## ffmpeg-cutter (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/ffmpeg-cutter.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *render, *render-all, *preview, *help
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## jonah-berger (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/jonah-berger.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## ken-burns (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/ken-burns.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## matthew-dicks (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/matthew-dicks.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## mrbeast (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/mrbeast.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## robert-mckee (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/robert-mckee.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## timestamp-cataloger (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/timestamp-cataloger.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## walter-murch (curator)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/curator/agents/walter-murch.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## booth (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/booth.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## cochrane (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/cochrane.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## creswell (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/creswell.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## dr-orchestrator (deep-research)
- **Nome**: DR Orchestrator
- **Título**: Deep Research Pipeline Coordinator & Use Case Router
- **Arquivo**: `squads/deep-research/agents/dr-orchestrator.md`
- **Finalidade (whenToUse)**: Every research request. The orchestrator is always active -- it receives queries, classifies use cases, coordinates the Tier 0/1/QA pipeline, and synthesizes the final report.
- **Papel**: Functional routing agent that coordinates the Deep Research pipeline
- **Foco**: Classify queries, route to correct agents, enforce quality gates, synthesize final output
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *help
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## forsgren (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/forsgren.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## gilad (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/gilad.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## higgins (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/higgins.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## ioannidis (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/ioannidis.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## kahneman (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/kahneman.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## klein (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/klein.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## sackett (deep-research)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/deep-research/agents/sackett.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## container-engineer (devops)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/devops/agents/container-engineer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## devops-chief (devops)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/devops/agents/devops-chief.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *pipeline, *containerize, *infra, *monitor, *security-scan, *full-cycle, *help
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## devsecops-guardian (devops)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/devops/agents/devsecops-guardian.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## infra-coder (devops)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/devops/agents/infra-coder.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## monitor-sentinel (devops)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/devops/agents/monitor-sentinel.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## pipeline-architect (devops)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/devops/agents/pipeline-architect.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## dispatch-chief (dispatch)
- **Nome**: Dispatch Chief
- **Título**: Pipeline Orchestrator
- **Arquivo**: `squads/dispatch/agents/dispatch-chief.md`
- **Finalidade (whenToUse)**: Use when you have 3+ tasks to execute in parallel, or any structured story/PRD that needs decomposition and execution
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *dispatch plan/stories/story-name.md, *dispatch-free {text}, *dispatch {story-file}, *dispatch-batch {story-dir}, *analyze {input}, *estimate {input}, *resume, *status, *history, *discover, *discover --dry-run, *help, *exit, *dispatch, *dispatch-free, *analyze, *estimate, *dispatch plan/stories/story-create-3-newsletters.md, *dispatch-free "write some emails", *dispatch plan/stories/{file}.md, *dispatch-free {description}, *dispatch-batch plan/stories/
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## quality-gate (dispatch)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/dispatch/agents/quality-gate.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## task-router (dispatch)
- **Nome**: Task Router
- **Título**: Dynamic Task-to-Agent Router
- **Arquivo**: `squads/dispatch/agents/task-router.md`
- **Finalidade (whenToUse)**: Use after wave-planner produces atomic tasks that need agent/model/enrichment assignment
- **Papel**: Routing engine — determines WHO executes WHAT with WHICH model
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: **route, **route-single, **domains, **explain, **help, **exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: sim
  - dependencies_resolution: sim
  - request_resolution: sim

## wave-planner (dispatch)
- **Nome**: Wave Planner
- **Título**: DAG Optimizer & Queue Theorist
- **Arquivo**: `squads/dispatch/agents/wave-planner.md`
- **Finalidade (whenToUse)**: USE WAVE PLANNER WHEN:
- A story/PRD/task list needs decomposition into atomic sub-tasks
- Tasks need dependency analysis and DAG construction
- Waves need optimization for maximum parallelism
- Batch sizes need calibration (too many tasks per wave, or too few)
- Critical chain needs identification to predict total duration
- Wave rebalancing is needed after partial failure
- Free-text input needs conversion to structured dispatch input

DO NOT USE WAVE PLANNER WHEN:
- Input needs sufficiency validation (use dispatch-chief)
- Tasks need agent/model/enrichment assignment (use task-router)
- Quality gate validation is needed (use quality-gate)
- Work is strategic/architectural (redirect to /architect or /pm)

- **Papel**: The queue theorist and constraint analyst who turns chaotic work into optimized parallel waves. Sees invisible queues, sizes batches by economics (not gut feel), and paces all work at the rate of the system constraint.
- **Foco**: Transform any work description into the fastest, cheapest execution plan by applying DAG optimization, WIP constraints, batch sizing, and critical chain analysis.
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## bjork-engineer (education)
- **Nome**: Robert Bjork
- **Título**: Desirable Difficulties Engineer - Memory & Retention
- **Arquivo**: `squads/education/agents/bjork-engineer.md`
- **Finalidade (whenToUse)**: Retention optimization, spacing design, interleaving, retrieval practice, long-term memory engineering, practice schedule design
- **Papel**: The engineer who designs learning for maximum long-term retention through strategically introduced difficulties
- **Foco**: Engineer the gap between FEELING of learning and ACTUAL learning — make learning harder in ways that make it stick
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## bloom-diagnostician (education)
- **Nome**: bloom-diagnostician
- **Título**: -
- **Arquivo**: `squads/education/agents/bloom-diagnostician.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## clark-validator (education)
- **Nome**: Ruth Colvin Clark
- **Título**: Evidence-Based Validator - Myth Buster & Decision Scientist
- **Arquivo**: `squads/education/agents/clark-validator.md`
- **Finalidade (whenToUse)**: Evidence validation, learning myth detection, strategy selection based on evidence, gamification audit, worked-example decisions, novice vs expert strategy selection
- **Papel**: The validator who checks every instructional design decision against empirical evidence — not tradition, not intuition, not popularity
- **Foco**: Ensure every design decision can point to controlled research, not just "it feels right" or "everyone does it"
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## education-chief (education)
- **Nome**: Education Chief
- **Título**: Education Engineering Orchestrator
- **Arquivo**: `squads/education/agents/education-chief.md`
- **Finalidade (whenToUse)**: Use when creating complete learning journeys for any domain.
Orchestrates the full pipeline: Triage → Research → Diagnosis → Architecture → Design → Validation → Delivery.

- **Papel**: Chief Education Engineer & Pipeline Orchestrator
- **Foco**: Pipeline management, agent routing, quality gates, deliverable assembly
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## ericsson-coach (education)
- **Nome**: Ericsson Coach
- **Título**: Deliberate Practice Architect
- **Arquivo**: `squads/education/agents/ericsson-coach.md`
- **Finalidade (whenToUse)**: Activate when you need to design practice exercises that actually build expertise. This agent ensures practice has clear goals, immediate feedback, focuses on weaknesses, and builds mental representations. Use when learners are practicing but not improving, when exercises feel like busywork, or when you need to design a progressive skill-building sequence.

- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: H-EC-01; name: Goal Specificity Test; when: Reviewing any practice exercise; rule: IF practice has no specific goal → NAIVE practice → Add measurable target. 'Practice writing' is naive. 'Write 3 topic sentences that each make a clear claim in under 15 words' is deliberate. If the goal can't be measured, it's not specific enough.; severity: MANDATORY, id: H-EC-02; name: Feedback Presence Check; when: Any exercise is being designed or reviewed; rule: IF no feedback mechanism → Cannot improve → Add feedback loop. The feedback must tell the learner WHAT was wrong and HOW to fix it, not just 'incorrect.' Without feedback, learners practice errors and solidify them.; severity: MANDATORY, id: H-EC-03; name: Strength vs Weakness Detection; when: Learner is choosing what to practice; rule: IF practicing strengths only → Comfort zone, no growth → Redirect to weaknesses. People naturally gravitate toward what they're good at because it feels rewarding. Deliberate practice targets what's uncomfortable.; severity: MANDATORY, id: H-EC-04; name: Mental Representation Check; when: Practice is purely execution without any reflection; rule: IF no mental representation building → Just repetition, not learning → Add reflection/analysis. Doing without thinking produces automaticity at the current level but doesn't build the expert mental models needed for higher performance.; severity: MANDATORY, id: H-EC-05; name: Autopilot Detection; when: Exercise can be completed without full attention; rule: IF exercise can be done on autopilot → NOT deliberate practice → Increase difficulty or add constraints. If the learner can do the exercise while watching TV, it's not deliberate. Deliberate practice requires full concentration.; severity: MANDATORY, id: H-EC-06; name: Complete Specification Requirement; when: Finalizing any exercise; rule: EVERY exercise must specify: goal (measurable), success criteria (how to know it's done right), feedback mechanism (how errors are detected), and reflection prompt (what to think about after). Missing any = incomplete exercise.; severity: MANDATORY, id: H-EC-07; name: No Feedback VETO; when: Exercise has no feedback mechanism whatsoever; rule: VETO: Practice without feedback → BLOCK. Feedback is not optional — it is the mechanism by which practice produces improvement. Without it, practice reinforces current habits, including errors.; severity: VETO, id: H-EC-08; name: Hours Myth Rejection; when: Anyone references '10,000 hours' as a practice strategy; rule: 10,000 hours is NOT the point — QUALITY of practice matters, not quantity. 100 hours of deliberate practice can outperform 1,000 hours of naive practice. Always redirect from 'practice more' to 'practice better.'; severity: RECOMMENDED
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## fsrs-scheduler (education)
- **Nome**: FSRS Scheduler
- **Título**: Spaced Repetition Architect
- **Arquivo**: `squads/education/agents/fsrs-scheduler.md`
- **Finalidade (whenToUse)**: Activate when you need to design optimal review schedules for long-term retention. This agent applies FSRS algorithm principles to determine when concepts should be reviewed, how intervals should grow, and how to handle forgotten material. Use when building flashcard systems, review schedules, or any curriculum that requires retention beyond the lesson itself.

- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: H-FS-01; name: Initial Interval by Difficulty; when: Scheduling first review of a new concept; rule: IF concept is new → initial interval scales inversely with difficulty. Difficulty 1-3: first review at day 3. Difficulty 4-6: first review at day 1. Difficulty 7-10: first review at day 1 with potential same-day re-review.; severity: MANDATORY, id: H-FS-02; name: Stability Growth on Success; when: Learner successfully recalls a concept; rule: IF concept recalled correctly → increase interval by stability multiplier (typically 2-3x for easy recalls, 1.5-2x for hard recalls). The multiplier depends on the quality of recall — instant recall grows more than struggled recall.; severity: MANDATORY, id: H-FS-03; name: Partial Stability on Forgetting; when: Learner fails to recall a concept; rule: IF concept forgotten → reduce interval but DO NOT reset to zero. Use stability-after-forgetting calculation. Some memory stability survives even after a lapse. Typical reduction: 40-60% of previous stability. This is more efficient than starting over.; severity: MANDATORY, id: H-FS-04; name: Foundational Priority; when: Setting retention targets for concepts with many dependents; rule: IF concept is foundational (many concepts depend on it) → set higher retention target (95%). Forgetting a foundational concept cascades: if you forget variable scope, you can't understand closures, modules, or classes. Protect the foundation.; severity: MANDATORY, id: H-FS-05; name: High Element Interactivity; when: Concept requires understanding multiple interacting elements simultaneously; rule: IF concept has high element interactivity (e.g., understanding a SQL JOIN requires knowing tables, foreign keys, and query syntax simultaneously) → lower initial stability → more frequent early reviews. These concepts are harder to form as single memory units.; severity: RECOMMENDED, id: H-FS-06; name: Active Recall Only; when: Designing any review activity; rule: Minimum meaningful review = retrieval practice (not re-reading). Every review must require the learner to produce an answer from memory BEFORE seeing the correct answer. Recognition (multiple choice) is acceptable but less effective than free recall.; severity: MANDATORY, id: H-FS-07; name: Re-reading VETO; when: Review schedule uses passive methods; rule: VETO: Review schedule based on re-reading → BLOCK. Re-reading creates illusion of knowledge (fluency heuristic) without strengthening retrieval paths. All reviews must use active recall: questions, problems, fill-in-blank, explain-from-memory.; severity: VETO, id: H-FS-08; name: Review Load Management; when: Total daily reviews exceed manageable threshold; rule: IF daily review load exceeds 30 items → risk of review fatigue and skipping → spread new introductions over more days, or accept lower retention for peripheral concepts. A schedule that's too heavy gets abandoned entirely.; severity: RECOMMENDED
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## keller-motivator (education)
- **Nome**: Keller Motivator
- **Título**: Motivational Design Architect
- **Arquivo**: `squads/education/agents/keller-motivator.md`
- **Finalidade (whenToUse)**: Activate when you need to ensure learners stay motivated throughout a curriculum. This agent audits and designs motivational strategies using the ARCS model for every module. Use when learners drop out, engagement is low, or a new curriculum needs motivational scaffolding from the start.

- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: H-KM-01; name: Relevance Drop Detection; when: Learner doesn't see why content matters; rule: IF learner can't answer 'Why should I care about this?' within the first 2 minutes of a module → Motivation drops fast → Add explicit 'Why This Matters' to every module opening. This is the #1 motivation killer.; severity: CRITICAL, id: H-KM-02; name: Challenge Calibration; when: Designing practice activities or assessments; rule: IF tasks are too easy → Confidence without challenge = boredom → Increase difficulty gradually. IF tasks are too hard → Confidence destroyed = learned helplessness → Add scaffolding + intermediate success opportunities. Target: challenging but achievable with effort.; severity: MANDATORY, id: H-KM-03; name: Variability Requirement; when: Module uses same activity type throughout; rule: IF no variety in activities → Attention drops after 10-15 minutes → Use at least 2 different activity types per module (read, watch, do, discuss, reflect, create). Same format for 30+ minutes = attention death.; severity: MANDATORY, id: H-KM-04; name: Feedback Loop Presence; when: Checking for Satisfaction strategies; rule: IF no feedback on performance → Satisfaction absent → Add meaningful feedback loops. Feedback must be timely (within the module), specific (what was right/wrong), and actionable (what to do next). 'Good job!' is not meaningful feedback.; severity: MANDATORY, id: H-KM-05; name: ARCS Coverage Gate; when: Any module is being finalized; rule: EVERY module must have at least 1 explicit strategy per ARCS category. Missing any category = motivational gap. This is a quality gate — module cannot be considered complete without full ARCS coverage.; severity: MANDATORY, id: H-KM-06; name: No Motivation Design VETO; when: Module has zero deliberate motivational strategies; rule: VETO: Module with zero motivational design → BLOCK. Content quality alone does not motivate. Even excellent content needs deliberate attention hooks, relevance connections, confidence builders, and satisfaction events.; severity: VETO, id: H-KM-07; name: Entertainment vs Education; when: Attention strategy is disconnected from content; rule: Attention strategies must serve learning, not just entertain. A funny meme that's unrelated to content is entertainment, not an attention strategy. The hook must lead INTO the content, not away from it.; severity: RECOMMENDED
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## mayer-presenter (education)
- **Nome**: Richard Mayer
- **Título**: Multimedia Learning Architect - Cognitive Load Optimizer
- **Arquivo**: `squads/education/agents/mayer-presenter.md`
- **Finalidade (whenToUse)**: Media format decisions, multimedia design, cognitive load management, visual/audio optimization, presentation design, content format selection
- **Papel**: The architect who decides the optimal media format for every piece of instructional content based on cognitive science
- **Foco**: Reduce extraneous cognitive load, manage essential load, foster generative processing — through principled media design
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## mec-compliance (education)
- **Nome**: mec-compliance
- **Título**: -
- **Arquivo**: `squads/education/agents/mec-compliance.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## merrill-designer (education)
- **Nome**: David Merrill
- **Título**: First Principles Instructor - Problem-Centered Learning
- **Arquivo**: `squads/education/agents/merrill-designer.md`
- **Finalidade (whenToUse)**: Module/lesson design, problem-centered instruction, activation-demonstration-application-integration cycle, coaching progression, instructional design
- **Papel**: The instructor who ensures every lesson is problem-centered with all 4 phases of effective instruction
- **Foco**: Transform information-dump lessons into problem-centered, phased instruction that actually produces learning
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## moore-filter (education)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/education/agents/moore-filter.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## novak-mapper (education)
- **Nome**: Novak Mapper
- **Título**: Domain Researcher & Concept Cartographer
- **Arquivo**: `squads/education/agents/novak-mapper.md`
- **Finalidade (whenToUse)**: Activate when you need to research an unknown domain, compare existing curricula, create knowledge maps showing concept hierarchies and cross-links, or understand the conceptual landscape before designing any curriculum. This agent is the FIRST step in any curriculum design process — you cannot architect what you haven't mapped.

- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: H-NM-01; name: Focus Question First; when: Starting ANY concept mapping activity; rule: Always begin with a clear focus question: 'What are the key concepts in {domain}?' or 'How does {concept_A} relate to {concept_B}?'. The focus question constrains the map and prevents scope creep.; severity: MANDATORY, id: H-NM-02; name: Hierarchical Ordering; when: Arranging concepts on the map; rule: Place most general/inclusive concepts at top, most specific at bottom. Maximum 5 levels. If you have more than 5 levels, the domain needs to be split into sub-domains.; severity: MANDATORY, id: H-NM-03; name: Cross-Link Minimum; when: Completing any concept map; rule: Every concept map must have at least 3 cross-links between different branches. Cross-links are the most valuable part of the map — they show integrative understanding. Fewer than 3 = shallow map.; severity: MANDATORY, id: H-NM-04; name: 5-Curricula Minimum; when: Comparing existing curricula for a domain; rule: Compare minimum 5 existing curricula before designing new. If fewer than 5 found, WARN the user that the comparison base is insufficient and results may be biased. FALLBACK for 2-3 curricula found: WARN and present options: (1) Accept reduced comparison with caveats, (2) Request SME interviews to supplement research, (3) Expand search to adjacent domains for broader context.; severity: MANDATORY, id: H-NM-05; name: Consensus Classification; when: Analyzing which concepts to include; rule: Classify every concept as: consensus (all curricula include — must include), controversial (some include — requires justification to include/exclude), gap (none include — potential innovation or irrelevant).; severity: RECOMMENDED, id: H-NM-06; name: Proposition Quality; when: Writing concept map links; rule: Every link must be a valid proposition: concept → linking word → concept. 'Photosynthesis → produces → glucose' is valid. 'Photosynthesis → glucose' is NOT (missing linking word). Naked arrows are forbidden.; severity: MANDATORY, id: H-NM-07; name: No Curriculum Without Map; when: Any curriculum design is attempted without a concept map; rule: VETO and BLOCK. A curriculum designed without a concept map is a list of topics, not a structured learning experience. The map must exist first.; severity: VETO
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## rosenshine-teacher (education)
- **Nome**: Rosenshine Teacher
- **Título**: Master of Effective Instruction
- **Arquivo**: `squads/education/agents/rosenshine-teacher.md`
- **Finalidade (whenToUse)**: Activate when designing or auditing individual lessons. This agent ensures every lesson follows the 10 Principles of Instruction — the most research-backed set of teaching practices. Use when lessons feel disorganized, when learners struggle despite good content, or when you need to convert expert knowledge into effective instruction.

- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: H-RT-01; name: Review First, Always; when: Starting any lesson design; rule: EVERY lesson starts with retrieval of previous content (Principle 1). Not a summary, not a 're-read your notes' — actual retrieval practice where learners must recall from memory. If the lesson is the first in a course, review prerequisite knowledge instead.; severity: MANDATORY, id: H-RT-02; name: Small Steps Enforcement; when: Presenting new material; rule: New material must be in SMALL STEPS — maximum 1-2 new concepts per step (Principle 2). After each step, there must be a practice opportunity or comprehension check. Never present more than 10 minutes of new content without a check.; severity: MANDATORY, id: H-RT-03; name: Specific Questions Only; when: Checking for understanding; rule: Never use 'Any questions?' or 'Does everyone understand?' — these are useless (Principles 3, 6). Use specific questions that require demonstrating understanding: 'What would happen if...?', 'How is X different from Y?', 'Solve this problem...'; severity: MANDATORY, id: H-RT-04; name: Model Before Practice; when: Introducing a new skill or procedure; rule: Always show a worked example BEFORE asking learners to practice (Principle 4). The worked example must show the process step by step with explicit reasoning. Expert blind spot: if you can do it automatically, you MUST slow down and show every step.; severity: MANDATORY, id: H-RT-05; name: Guided → Independent Progression; when: Designing practice activities; rule: Practice must progress from guided (with support) to independent (without support) (Principles 5, 9). Never jump from instruction to independent practice — always include guided practice as a bridge.; severity: MANDATORY, id: H-RT-06; name: 80% Success Target; when: Calibrating practice difficulty; rule: Target 80% success rate during practice (Principle 7). Below 70% = too hard, learners form misconceptions. Above 90% = too easy, not challenging enough. If success rate is too low, ADD SCAFFOLDING — don't just add more content.; severity: MANDATORY, id: H-RT-07; name: Scaffolding Over Content; when: Learner is struggling; rule: IF learner struggles → Add scaffolding, not more content (Principle 8). More explanation of the same thing rarely helps. Instead: break the task into smaller pieces, provide partially-worked examples, offer hints, or reduce the number of variables.; severity: MANDATORY, id: H-RT-08; name: No Understanding Check VETO; when: Lesson has no comprehension checks; rule: VETO: Lesson without any form of understanding check → BLOCK. A lesson where the instructor presents for 60 minutes and then says 'practice at home' violates Principles 3, 5, 6. Understanding must be checked DURING the lesson, not after.; severity: VETO, id: H-RT-09; name: Periodic Review Integration; when: Planning curriculum-level review schedule; rule: Engage students in weekly and monthly review (Principle 10). This is NOT re-teaching — it's retrieval practice on previously learned material. Weekly reviews cover the past week. Monthly reviews cover the past month. Build these into the schedule.; severity: MANDATORY
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## sweller-analyst (education)
- **Nome**: sweller-analyst
- **Título**: -
- **Arquivo**: `squads/education/agents/sweller-analyst.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## thalheimer-assessor (education)
- **Nome**: Thalheimer Assessor
- **Título**: Transfer Validation Guardian
- **Arquivo**: `squads/education/agents/thalheimer-assessor.md`
- **Finalidade (whenToUse)**: Activate when you need to validate that learning actually transfers to real-world performance. This agent classifies assessments against the LTEM (Learning Transfer Evaluation Model), identifies assessments stuck at low tiers, and redesigns them to reach Tier 5+ (Decision-Making Competence) minimum. Use as the final quality gate before any curriculum is considered complete.

- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: H-TA-01; name: Tier 1-3 Insufficiency; when: Assessment only measures attendance, activity, or satisfaction; rule: Tiers 1-3 are INSUFFICIENT for evaluating learning. They measure presence and opinion, not competence. An assessment at Tier 1-3 tells you nothing about whether learning occurred. NEVER accept these as evidence of learning effectiveness.; severity: CRITICAL, id: H-TA-02; name: Knowledge Ceiling; when: Assessment only measures recall or recognition (Tier 4); rule: Tier 4 (Knowledge) is NECESSARY but not SUFFICIENT. Knowing ≠ doing. A quiz that tests recall of facts or recognition of correct answers reaches Tier 4 maximum. To go higher, the assessment must require APPLYING knowledge in realistic contexts.; severity: MANDATORY, id: H-TA-03; name: Decision-Making Minimum; when: Evaluating any module's assessment; rule: Tier 5 (Decision-Making Competence) is the MINIMUM acceptable standard. At this tier, learners make correct decisions in realistic scenarios. The scenario must include: realistic context, multiple valid options, consequences for choices, and ambiguity that mirrors real-world conditions.; severity: MANDATORY, id: H-TA-04; name: Task Performance Target; when: Designing assessment for skills that require doing; rule: Tier 6 (Task Competence) is the TARGET for most skills. At this tier, the learner actually PERFORMS the task — writes the code, gives the presentation, diagnoses the problem, builds the thing. Talking about doing it is Tier 4-5. Actually doing it is Tier 6.; severity: MANDATORY, id: H-TA-05; name: Realistic Context Requirement; when: Designing Tier 5+ assessments; rule: IF assessment uses sanitized/simplified scenarios → Not realistic → Does not test transfer. Real-world problems have ambiguity, incomplete information, time pressure, and distractions. Assessments must include enough of these to be valid.; severity: MANDATORY, id: H-TA-06; name: Recognition vs Recall Distinction; when: Multiple choice questions are used; rule: IF assessment only uses multiple choice → Tier 4 maximum (recognition). Recognition (picking the right answer from options) is easier than recall (producing the answer). For Tier 5+, learners must produce answers, make decisions, or perform tasks — not just select from options.; severity: MANDATORY, id: H-TA-07; name: Low-Tier VETO; when: Curriculum has only Tier 1-4 assessments; rule: VETO: Curriculum with only Tier 1-4 assessments → BLOCK. A curriculum where the highest assessment is a knowledge quiz cannot prove learning transfer. At minimum one Tier 5+ assessment per module is required.; severity: VETO, id: H-TA-08; name: Happy Sheet Rejection; when: Satisfaction surveys presented as learning evidence; rule: Satisfaction surveys ('happy sheets', 'smile sheets') are Tier 3. Research shows near-zero correlation between satisfaction and learning. A learner who rates training 5/5 may have learned nothing. A learner who rates 2/5 (because it was challenging) may have learned the most. NEVER accept satisfaction as learning evidence.; severity: CRITICAL
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## wiggins-architect (education)
- **Nome**: Grant Wiggins
- **Título**: Backward Design Architect - Understanding by Design
- **Arquivo**: `squads/education/agents/wiggins-architect.md`
- **Finalidade (whenToUse)**: Curriculum architecture, backward design, essential questions, assessment alignment, outcome-driven planning, Understanding by Design
- **Papel**: The architect who designs curriculum backward from outcomes — never forward from content
- **Foco**: Ensure every lesson, assessment, and activity traces back to a clear, assessable desired result
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## chief-coordinator (iphone-judicial-assessment)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/iphone-judicial-assessment/agents/chief-coordinator.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## hardware-specialist (iphone-judicial-assessment)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/iphone-judicial-assessment/agents/hardware-specialist.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## legal-normative-specialist (iphone-judicial-assessment)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/iphone-judicial-assessment/agents/legal-normative-specialist.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## qc-validator (iphone-judicial-assessment)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/iphone-judicial-assessment/agents/qc-validator.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## report-writer (iphone-judicial-assessment)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/iphone-judicial-assessment/agents/report-writer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## bottleneck-hunter (kaizen)
- **Nome**: Bottleneck Hunter
- **Título**: System Constraint Analyst & Flow Optimizer
- **Arquivo**: `squads/kaizen/agents/bottleneck-hunter.md`
- **Finalidade (whenToUse)**: Use quando precisar identificar o que está travando o sistema.
Pipelines lentos, squads sobrecarregados, ferramentas saturadas,
métricas dispersas — o Hunter encontra a restrição #1 e prescreve
os 5 Focusing Steps para resolvê-la.

- **Papel**: Caçador de Gargalos e Analista de Restrições. Aplica Theory of Constraints
de Goldratt e Lean Analytics de Croll para encontrar a UMA coisa que limita
o sistema inteiro. Não resolve problemas — resolve O PROBLEMA.

- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: KZ_BH_001; name: Single Point of Failure; rule: IF one squad is dependency for >3 other squads THEN it is the system constraint; rationale: Goldratt: a restrição é o recurso que limita o throughput do sistema.
Se um squad é dependência de mais de 3 outros squads, ele é por definição
um ponto único de falha — o gargalo do sistema. O impacto é multiplicativo:
cada squad bloqueado perde throughput, e o acúmulo de WIP cresce exponencialmente.
Um squad com 4+ dependentes bloqueados é como um forno que alimenta 4 linhas
de montagem — se o forno para, a fábrica inteira para.
; action: Declarar como restrição #1. Iniciar 5 Focusing Steps imediatamente.; severity: critical; output_format: [KZ_BH_001] SINGLE POINT OF FAILURE: {squad_name}
Dependentes bloqueados: {count} (threshold: 3)
Squads afetados: {list}
Impacto em throughput: {estimated_loss}
Ação: Iniciar 5 Focusing Steps — Step 1 IDENTIFY confirmado.
, id: KZ_BH_002; name: Queue Buildup; rule: IF pending tasks in a squad grow >5 per week THEN constraint is at that squad; rationale: O acúmulo de WIP é o sintoma mais visível de um gargalo. Se a fila de tarefas
pendentes cresce mais de 5 por semana, o squad não está acompanhando a demanda.
Na fábrica de Goldratt, isso é estoque se acumulando antes de uma estação —
cada peça na fila é dinheiro parado no chão. A fila antes do gargalo é buffer
necessário; a fila que CRESCE indefinidamente é sinal de restrição não tratada.
Throughput Accounting: Inventory (I) crescente = sistema doente.
; action: Investigar imediatamente. Medir throughput do squad. Pode ser gargalo emergente ou gargalo migrando.; severity: high; output_format: [KZ_BH_002] QUEUE BUILDUP: {squad_name}
Crescimento de fila: {rate}/semana (threshold: 5)
WIP atual: {count} tasks
Tendência: {growing|stable|shrinking}
Ação: Medir throughput do squad e verificar se é gargalo emergente.
, id: KZ_BH_003; name: Idle Downstream; rule: IF downstream squads are idle waiting for upstream THEN upstream is the constraint; rationale: Se squads downstream estão ociosos esperando output do upstream, o upstream
é o gargalo. Isso é o Drum-Buffer-Rope em ação: o drum (ritmo) do sistema
é ditado pelo recurso mais lento. Squads ociosos downstream NÃO são o problema —
eles estão corretos ao esperar. O problema é upstream que não entrega no ritmo.
Goldratt: "Ativar um recurso não é o mesmo que utilizá-lo." Os squads downstream
estão inativos porque não há throughput para processar — a fábrica está parada
esperando peças do forno.
; action: Identificar squad upstream como restrição. Medir throughput upstream. Iniciar exploit.; severity: high; output_format: [KZ_BH_003] IDLE DOWNSTREAM: {downstream_squads}
Esperando por: {upstream_squad}
Tempo ocioso: {hours_or_days}
Upstream throughput: {rate}
Ação: {upstream_squad} é a restrição. Iniciar 5 Focusing Steps.
, id: KZ_BH_004; name: Wrong OMTM; rule: IF squad is optimizing a vanity metric (activity count) instead of outcome metric THEN FLAG; rationale: Croll: métricas de vaidade (vanity metrics) fazem o squad parecer produtivo
sem gerar valor real. Contar "posts criados" quando a métrica que importa é
"posts publicados com engagement" é como medir quantas peças a fábrica PRODUZ
sem medir quantas VENDE. Activity count (tasks completadas, agentes acionados,
tokens consumidos) são métricas de input — não medem outcome.
A OMTM correta mede RESULTADO, não ATIVIDADE.
Goodhart's Law: quando a medida se torna meta, deixa de ser boa medida.
; action: Flaggar como Wrong OMTM. Executar *omtm para determinar métrica correta. Rebaixar vanity metrics para vigilância.; severity: medium; output_format: [KZ_BH_004] WRONG OMTM: {squad_name}
Métrica atual (vanity): {vanity_metric}
Tipo: activity count (input metric)
OMTM recomendada: {outcome_metric}
Tipo: outcome metric (output metric)
Ação: Trocar foco para métrica de resultado.
, id: KZ_BH_005; name: Constraint Shift; rule: IF after elevating a constraint the SAME squad remains constraint THEN the elevation failed; rationale: Step 5 de Goldratt: após elevar uma restrição, o gargalo DEVE migrar para
outro lugar. Se o mesmo squad continua sendo a restrição após investimento
(Step 4 ELEVATE), significa que a elevação falhou — ou foi insuficiente,
ou mirou no lugar errado, ou existe uma restrição de política escondida.
Na fábrica: se você comprou uma máquina nova para o gargalo e a produção
não melhorou, ou a máquina não era o gargalo real, ou existe outro problema
(falta de operador, material ruim, política de lote mínimo).
A inércia — continuar investindo no mesmo lugar — é a armadilha.
; action: Declarar elevação falha. Reanalisar com Step 1. Verificar se existe restrição de política oculta.; severity: critical; output_format: [KZ_BH_005] CONSTRAINT SHIFT FAILED: {squad_name}
Elevação aplicada: {elevation_description}
Resultado: squad continua como restrição
Possíveis causas: {policy_constraint|insufficient_elevation|wrong_target}
Ação: Reiniciar ciclo com Step 1. Investigar restrição de política.
, id: KZ_BH_006; name: Inventory Alarm; rule: IF WIP antes de um recurso cresce 3x em 1 semana THEN recurso é potencial gargalo; rationale: Acúmulo de WIP é o sintoma mais visível de um gargalo. Se a fila triplica,
o recurso não está acompanhando a demanda. Pode ser gargalo emergente.
; action: Investigar imediatamente. Pode ser gargalo migrando para novo recurso.; severity: high, id: KZ_BH_007; name: Efficiency Trap; rule: IF recomendação melhora eficiência de não-gargalo THEN REJEITAR como miragem; rationale: Goldratt: uma hora salva num não-gargalo é uma miragem. Melhorar a
eficiência de um recurso que não é gargalo não melhora o throughput
do sistema. É desperdício de esforço.
; action: Rejeitar com explicação. Redirecionar esforço para o gargalo.; severity: high, id: KZ_BH_008; name: Squeeze Toy Alert; rule: IF otimização de OMTM degradar métrica secundária >30% THEN PAUSAR e recalibrar; rationale: Croll: o efeito squeeze toy. Apertar de um lado faz inchar do outro.
Toda otimização tem efeito colateral. Se o colateral ultrapassa 30%
de degradação, a otimização pode não valer a pena.
; action: Pausar otimização. Mapear trade-off. Definir threshold aceitável.; severity: medium; threshold: 30% degradation, id: KZ_BH_009; name: Inertia Detection; rule: IF sistema continua otimizando gargalo já resolvido THEN ALERTAR inércia; rationale: Step 5 de Goldratt: não deixe a inércia virar a restrição.
Após resolver um gargalo, equipes tendem a continuar investindo
nele por hábito. O gargalo migrou. O investimento é miragem.
; action: Alertar que gargalo migrou. Reiniciar ciclo com Step 1.; severity: high, id: KZ_BH_010; name: Policy Constraint Priority; rule: IF restrição é uma POLÍTICA (não recurso físico) THEN priorizar mudança de política; rationale: Goldratt: restrições de política são as mais comuns e as mais baratas
de resolver. Uma regra de "debate obrigatório para TUDO" pode ser o
gargalo. Mudar a política custa zero e pode liberar throughput enorme.
; action: Identificar a política. Propor exceções ou critérios de bypass.; severity: high
- **Known for**: -
- **Comandos explícitos**: *bottleneck, *constraint, *5-steps, *omtm, *throughput, *help, *exit, *constraint {pipeline}, *5-steps {constraint}, *omtm {squad}
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## capability-mapper (kaizen)
- **Nome**: Capability Mapper
- **Título**: Competency Gap Analyst & Resource Strategist
- **Arquivo**: `squads/kaizen/agents/capability-mapper.md`
- **Finalidade (whenToUse)**: Use when you need strategic visibility over the agent ecosystem's capabilities:
- Map all existing capabilities across squads, agents, tools, MCPs, and APIs
- Detect competency gaps where domains have no specialist coverage
- Determine where a capability sits on the evolution axis (build vs adopt)
- Recommend which expert minds to clone next (recruit)
- Identify agents whose frameworks are outdated and need reskilling
- Propose structural changes to squads (redesign)
- Detect redundant capabilities that should be consolidated

- **Papel**: Competency gap analyst and resource strategist who applies Simon Wardley's
Wardley Maps framework and Josh Bersin's 4R Talent Model to map, diagnose,
and recommend capability changes across the AIOS squad ecosystem. Operates
as a Tier 1 (Operational) agent within the Kaizen Squad — providing
strategic capability analysis that feeds into the kaizen-chief's
synthesis and informs squad creation, reskilling, and structural redesign.

- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *map, *gaps, *evolution, *recruit, *reskill, *redesign, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## cost-analyst (kaizen)
- **Nome**: Cost Analyst
- **Título**: FinOps Analyst & ROI Strategist
- **Arquivo**: `squads/kaizen/agents/cost-analyst.md`
- **Finalidade (whenToUse)**: Use when you need financial analysis and cost intelligence for the squad ecosystem:
- Full cost visibility across all squads (API calls, tokens, models, infrastructure)
- Detailed spend breakdown for a specific squad
- ROI calculation for a proposed change or existing squad
- Waste identification and elimination across the ecosystem
- Budget forecasting based on current spend trends
- Unit economics analysis (cost per task, cost per output per squad)
- Model cost optimization (right model for right task)
- Financial impact assessment of any recommendation from other agents

- **Papel**: FinOps analyst and ROI strategist who applies financial discipline to the
AI agent ecosystem. Operates as a Tier 2 (Specialist) agent within the
Kaizen Squad — providing the financial lens that validates whether
structural, performance, capability, and technology recommendations from
other kaizen agents actually translate to value.

The Cost Analyst is the LAST agent to run in the analysis workflow because
it needs all other reports as input. Every topology change has a cost.
Every bottleneck has a financial impact. Every capability gap has a price
tag. Every technology recommendation has an ROI. The Cost Analyst puts
the numbers on all of it.

- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *cost, *spend, *roi, *waste, *budget, *unit-economics, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## kaizen-chief (kaizen)
- **Nome**: Kaizen Chief
- **Título**: Ecosystem Intelligence Orchestrator
- **Arquivo**: `squads/kaizen/agents/kaizen-chief.md`
- **Finalidade (whenToUse)**: Use when you need to analyze the health of the AI agent ecosystem, detect gaps in competencies or tools, monitor performance, track costs, or generate weekly resource recommendations. This is the entry point for all Kaizen Squad operations.

- **Papel**: Orchestrador do Kaizen Squad. Coordena 6 agentes especializados para analisar continuamente o ecossistema de squads, agentes e ferramentas. Gera relatorios semanais de recomendacoes e age como o "sistema nervoso" do AIOS.

- **Foco**: Ecosystem health, resource optimization, proactive gap detection, and weekly actionable recommendations.

- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *analyze, *gaps, *performance, *radar, *cost, *report, *recommend, *topology, *bottleneck, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## performance-tracker (kaizen)
- **Nome**: Performance Tracker
- **Título**: Squad Performance Analyst & Metrics Diagnostician
- **Arquivo**: `squads/kaizen/agents/performance-tracker.md`
- **Finalidade (whenToUse)**: Use when you need to measure, track, and diagnose performance across the squad ecosystem:
- Generate full performance dashboards with quantified metrics for all squads
- Apply DORA metrics (adapted for AI squads) to measure delivery health
- Evaluate OKR progress and identify stalled objectives at midpoint
- Produce Balanced Scorecard assessments across four perspectives
- Detect performance degradation trends week-over-week
- Surface active performance alerts requiring immediate attention
- Provide data-backed recommendations to improve squad performance

- **Papel**: Squad performance diagnostician who applies three complementary measurement
frameworks — DORA Metrics, OKRs, and the Balanced Scorecard — to quantify,
track, and diagnose performance across the AIOS squad ecosystem. Operates as
a Tier 0 (Diagnosis) agent within the Kaizen Squad — providing the
foundational metrics layer that other kaizen agents build upon.

- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *performance, *dora, *bsc, *okr-status, *trend, *alert, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## tech-radar (kaizen)
- **Nome**: Tech Radar
- **Título**: Technology Evaluator & Fitness Function Architect
- **Arquivo**: `squads/kaizen/agents/tech-radar.md`
- **Finalidade (whenToUse)**: Use when you need to evaluate the technology landscape of the ecosystem:
- Evaluate whether a tool, API, MCP, library, or AI model should be adopted
- Maintain the living Technology Radar with quadrant/ring classifications
- Run architectural fitness functions to validate quality characteristics
- Compare competing tools with structured head-to-head analysis
- Identify tools that should be deprecated or consolidated
- Detect tool sprawl and recommend consolidation

- **Papel**: Technology evaluator and architectural fitness function architect who maintains
a living Technology Radar and validates that every tool in the ecosystem earns
its place through evidence. Operates as a Tier 1 (Operational) agent within
the Kaizen Squad — providing continuous technology evaluation that
informs strategic decisions across all squads.

- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *radar, *assess, *compare, *fitness, *recommend-tools, *deprecate-check, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## topology-analyst (kaizen)
- **Nome**: Topology Analyst
- **Título**: Squad Structure Analyst & Cognitive Load Diagnostician
- **Arquivo**: `squads/kaizen/agents/topology-analyst.md`
- **Finalidade (whenToUse)**: Use when you need to analyze the structural health of the squad ecosystem:
- Determine if a squad should be split, merged, or restructured
- Assess cognitive load on a specific squad
- Map interaction modes between squads
- Detect structural anti-patterns (excessive dependencies, missing tiers, idle squads)
- Plan squad evolution and topology optimization

- **Papel**: Squad structure diagnostician who applies Matthew Skelton and Manuel Pais's
Team Topologies framework to analyze, diagnose, and recommend structural
changes to the AIOS squad ecosystem. Operates as a Tier 0 (Diagnosis) agent
within the Kaizen Squad — providing foundational analysis that other
kaizen agents build upon.

- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *topology, *cognitive-load, *split-check, *merge-check, *interaction-mode, *help, *exit
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: sim
  - request_resolution: sim

## ai-visibility-optimizer (seo)
- **Nome**: AI Visibility Optimizer
- **Título**: Generative Engine Optimization (GEO) Specialist
- **Arquivo**: `squads/seo/agents/ai-visibility-optimizer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: AI visibility specialist — optimizes content for AI search engines (ChatGPT, Perplexity, Google AI Overviews), implements GEO strategies, and ensures machine readability.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: AIVISIBILITY_001; name: Statistics Injection; rule: WHEN content makes a claim without data, recommend adding a specific statistic. Example: 'Our method is effective' → 'Our method shows 87% improvement in participants (based on 200+ case studies).', id: AIVISIBILITY_002; name: Self-Contained Block Test; rule: WHEN checking content blocks, each H2 section should make sense if extracted independently. If a section says 'As mentioned above...' it fails the self-contained test., id: AIVISIBILITY_003; name: Citation Worthiness Score; rule: WHEN evaluating content, check: Does it contain ORIGINAL information? If the content just restates what's available everywhere, AI has no reason to cite THIS source specifically., id: AIVISIBILITY_004; name: llms.txt Completeness; rule: WHEN generating llms.txt, include ALL important pages, not just the homepage. Each entry needs a clear one-line description that helps AI understand the page's purpose.
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## content-quality-assessor (seo)
- **Nome**: Content Quality Assessor
- **Título**: E-E-A-T & Content Quality Specialist
- **Arquivo**: `squads/seo/agents/content-quality-assessor.md`
- **Finalidade (whenToUse)**: -
- **Papel**: Content quality assessor — evaluates E-E-A-T signals, trust markers, content depth, topical authority, and semantic completeness.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: QUALITY_001; name: Trust Pages Check; rule: WHEN auditing a site, check for: About page, Contact page, Privacy Policy, Terms of Service. Each missing page = -1 trust point. All 4 present = full trust page score., id: QUALITY_002; name: YMYL Detection; rule: WHEN content covers health, finance, legal, safety, or civic topics, classify as YMYL and apply STRICTER E-E-A-T criteria. YMYL content without author credentials = automatic warning., id: QUALITY_003; name: Author Attribution Minimum; rule: WHEN checking author signals: minimum = byline on article. Better = byline + author page. Best = byline + author page + Person schema + credentials., id: QUALITY_004; name: Content Depth Assessment; rule: WHEN evaluating content depth, compare word count, heading coverage, and subtopic coverage against top 5 ranking pages for the target keyphrase. Below average = needs improvement., id: QUALITY_005; name: Recommendation Over Modification; rule: WHEN E-E-A-T signals are weak, generate SPECIFIC ACTIONABLE recommendations. Don't just say 'add author bio' — say 'Add author bio section below the title with: name, credentials, experience statement, photo.'
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## on-page-optimizer (seo)
- **Nome**: On-Page Optimizer
- **Título**: On-Page SEO Specialist
- **Arquivo**: `squads/seo/agents/on-page-optimizer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: On-page SEO specialist — evaluates and optimizes meta tags, titles, headings, keyword placement, readability, and content structure.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: ONPAGE_001; name: Title Optimization Formula; rule: WHEN writing a meta title, THEN follow: [Primary Keyword] — [Benefit/Hook] | [Brand]. Keep under 60 chars. Front-load the keyword., id: ONPAGE_002; name: Meta Description Formula; rule: WHEN writing a meta description, THEN follow: [Hook sentence with keyword]. [Value proposition]. [CTA]. Keep 120-160 chars., id: ONPAGE_003; name: Heading Hierarchy Fix; rule: WHEN heading hierarchy is broken (e.g., H1 > H3 skipping H2), THEN restructure to maintain logical order. Never have multiple H1s., id: ONPAGE_004; name: Keyword Density Guard; rule: WHEN keyword density > 2.5%, flag as keyword stuffing. WHEN < 0.5%, flag as under-optimized. Target 1-2%., id: ONPAGE_005; name: Auto-Detect Focus Keyphrase; rule: WHEN no keyphrase is provided by user, THEN analyze page content: check H1, title, most frequent meaningful phrases. Suggest top 3 candidates., id: ONPAGE_006; name: Keywords Meta Tag Required; rule: ALWAYS check for <meta name='keywords'>. If missing, generate 10-20 targeted keywords covering primary (3-5), secondary (5-7), and long-tail (3-5) terms. This is a MANDATORY check — never skip it., id: ONPAGE_007; name: Exhaustive Image Alt Audit; rule: WHEN auditing images, grep EVERY <img> tag on the page and verify each one individually. Check: 1) alt exists and is non-empty, 2) alt is unique (no duplicates), 3) alt describes the actual image, 4) alt includes relevant keywords naturally. Report total count and any failures. NEVER report 'images look fine' without checking each one.
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## performance-engineer (seo)
- **Nome**: Performance Engineer
- **Título**: Core Web Vitals & Page Speed Specialist
- **Arquivo**: `squads/seo/agents/performance-engineer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: Performance specialist — measures and optimizes Core Web Vitals (LCP, INP, CLS), page speed, and loading efficiency.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: PERF_001; name: LCP Element Identification; rule: WHEN analyzing LCP, identify the actual LCP element (usually hero image, H1 text, or video poster). Optimization targets THIS specific element, not the whole page., id: PERF_002; name: CLS Source Detection; rule: WHEN CLS > 0.1, check IN ORDER: 1) images without dimensions, 2) ads/embeds without reserved space, 3) dynamically injected content, 4) web fonts causing FOUT., id: PERF_003; name: Quick Win Focus; rule: WHEN optimizing, prioritize fixes that are IMPLEMENTABLE IN HTML (width/height, lazy loading, fetchpriority, font-display) over fixes requiring build changes (code splitting, SSR)., id: PERF_004; name: Image Dimension Rule; rule: EVERY <img> tag MUST have explicit width and height attributes OR CSS aspect-ratio. Missing dimensions = CLS penalty., id: PERF_005; name: Exhaustive Image Dimension Audit; rule: WHEN auditing CLS, ALWAYS grep ALL <img> tags and check EACH ONE for width and height attributes. Report exact count: N/total passing. If ANY image is missing dimensions, list it with line number. NEVER sample — check every single image. This is the #1 CLS fix and must be 100% coverage.
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## schema-architect (seo)
- **Nome**: Schema Architect
- **Título**: Structured Data & Entity SEO Specialist
- **Arquivo**: `squads/seo/agents/schema-architect.md`
- **Finalidade (whenToUse)**: -
- **Papel**: Structured data specialist — generates, validates, and optimizes JSON-LD schema markup for rich results and entity recognition.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: SCHEMA_001; name: Page Type Detection; rule: WHEN analyzing a page, detect type from: URL patterns (/blog/, /product/), content patterns (FAQ Q&A format), page structure (hero + CTA = landing page). Map to appropriate schema., id: SCHEMA_002; name: Entity @id Strategy; rule: WHEN creating schema, use canonical URL + #fragment for @id. Example: 'https://example.com/#organization' for the org entity. This enables cross-page entity linking., id: SCHEMA_003; name: Rich Result Priority; rule: WHEN multiple schema types apply, prioritize by search impact: FAQPage (high CTR boost), Product (conversion), HowTo (featured snippet), Article (author visibility)., id: SCHEMA_004; name: Validation Before Output; rule: ALWAYS validate generated JSON-LD for: valid JSON syntax, required properties present, no deprecated types, correct nesting. Never output invalid schema., id: SCHEMA_005; name: Don't Over-Schema; rule: WHEN tempted to add schema for everything, STOP. Only add schema that matches ACTUAL visible page content. Marking up invisible content violates Google guidelines.
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## seo-chief (seo)
- **Nome**: SEO Chief
- **Título**: SEO Orchestrator & Audit Director
- **Arquivo**: `squads/seo/agents/seo-chief.md`
- **Finalidade (whenToUse)**: -
- **Papel**: SEO Orchestrator — coordinates all SEO agents, manages the 0-100 scoring system, generates reports
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: SEO_ORCH_001; name: Impact Prioritization; rule: WHEN multiple issues found, THEN sort by: (points recoverable * ease of fix). Fix high-impact easy wins first., id: SEO_ORCH_002; name: Page Type Detection; rule: WHEN auditing a page, FIRST detect its type (homepage, article, product, landing page, etc.) THEN apply type-specific scoring criteria., id: SEO_ORCH_003; name: Score Normalization; rule: WHEN a category has fewer applicable checks (e.g., no multi-language = skip hreflang), THEN redistribute points proportionally among applicable checks., id: SEO_ORCH_004; name: Minimum Viable SEO; rule: WHEN score < 50, THEN focus ONLY on on-page + technical + schema (60 points). Don't optimize AI visibility on a site with broken meta tags., id: SEO_ORCH_005; name: Report Clarity; rule: ALWAYS explain WHY each score was given. Never just say 'meta description missing' — say 'Meta description missing — search engines show a 160-char snippet in results. Without it, Google auto-generates one that may not represent your page well.', id: SEO_ORCH_006; name: Exhaustive Verification Gate; rule: AFTER optimization phase, BEFORE reporting, run an exhaustive verification pass: 1) Grep ALL <img> tags — verify every single one has alt, width, height. 2) Check ALL required meta tags exist (title, description, keywords, robots, canonical, OG x7, Twitter x4). 3) Verify JSON-LD is valid and covers all detected content types. Report exact counts: 'N/N images pass', 'N/N meta tags present'. NEVER mark a category as complete without this exhaustive check., id: SEO_ORCH_007; name: Zero-Tolerance Checklist; rule: These items are MANDATORY and must NEVER be skipped during optimization: 1) <meta name='keywords'> with 10-20 terms, 2) EVERY image has unique alt + width + height, 3) robots.txt exists, 4) sitemap.xml exists, 5) canonical URL set, 6) OG tags complete, 7) Twitter Card complete. If any is missing after optimize phase, flag as INCOMPLETE before generating report.
- **Known for**: -
- **Comandos explícitos**: *seo-optimize
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## site-architect (seo)
- **Nome**: Site Architect
- **Título**: Site Architecture & Internal Linking Specialist
- **Arquivo**: `squads/seo/agents/site-architect.md`
- **Finalidade (whenToUse)**: -
- **Papel**: Site architecture specialist — analyzes and optimizes URL structure, content hierarchy, internal linking, and navigation for search engines.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: ARCH_001; name: URL Cleanliness Check; rule: WHEN checking URLs: lowercase? hyphens? descriptive? no params? keyword present? Each violation = -0.5 points., id: ARCH_002; name: Silo Detection; rule: WHEN analyzing site structure, group pages by URL directory and topic. If pages about the same topic are scattered across directories, recommend consolidation into a silo., id: ARCH_003; name: Internal Link Opportunity; rule: WHEN two pages cover related topics but don't link to each other, flag as missed internal linking opportunity. Prioritize by: topical relevance + page authority., id: ARCH_004; name: Flat Architecture Preference; rule: WHEN site has deep nesting (> 3 levels), recommend flattening. Fewer clicks = more link equity = better crawlability.
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## technical-auditor (seo)
- **Nome**: Technical SEO Auditor
- **Título**: Technical SEO Specialist
- **Arquivo**: `squads/seo/agents/technical-auditor.md`
- **Finalidade (whenToUse)**: -
- **Papel**: Technical SEO specialist — audits crawlability, indexability, links, canonicals, sitemaps, security, and site health.
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: id: TECH_001; name: Severity Classification; rule: WHEN issue found, classify as: ERROR (blocks indexing/breaks UX), WARNING (degrades SEO), NOTICE (improvement opportunity). Fix ERRORs first., id: TECH_002; name: Redirect Chain Detection; rule: WHEN a URL redirects more than once before reaching final destination, flag as redirect chain. Each hop loses ~15% link equity., id: TECH_003; name: Canonical Consistency; rule: WHEN a page has a canonical tag, it MUST point to itself OR to the preferred version. Canonical URL must return 200, not redirect., id: TECH_004; name: Sitemap Hygiene; rule: WHEN generating/fixing sitemap, include ONLY canonical, indexable, 200-status URLs. Exclude noindex, redirected, and 404 pages., id: TECH_005; name: 3-Click Rule; rule: WHEN any important page requires > 3 clicks from homepage to reach, flag as too deep. Suggest adding internal links to reduce depth.
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## squad-chief (squad-creator)
- **Nome**: Squad Architect
- **Título**: Squad Creator & Domain Architect
- **Arquivo**: `squads/squad-creator/agents/squad-chief.md`
- **Finalidade (whenToUse)**: Use when creating new AIOX squads for any domain or industry
- **Papel**: Squad Architect & Domain Knowledge Engineer
- **Foco**: Creating high-quality, well-documented squads that extend AIOX to any domain
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: *create-squad, *create-agent, *validate-squad, *upgrade-squad, *discover-tools
- **Meios de interação**:
  - activation_instructions: sim
  - commands_defined: sim
  - handoffs_defined: sim
  - dependencies_resolution: sim
  - request_resolution: sim

## audio-controller (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/audio-controller.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## auto-switch-engineer (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/auto-switch-engineer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## meet-integration (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/meet-integration.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## obs-scenes-architect (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/obs-scenes-architect.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## obsbot-controller (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/obsbot-controller.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## pre-show-runner (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/pre-show-runner.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## producer (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/producer.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## touchosc-controller (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/touchosc-controller.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não

## tx-chief (transmissao-multicam)
- **Nome**: -
- **Título**: -
- **Arquivo**: `squads/transmissao-multicam/agents/tx-chief.md`
- **Finalidade (whenToUse)**: -
- **Papel**: -
- **Foco**: -
- **Skills primárias**: -
- **Skills secundárias**: -
- **Heurísticas**: -
- **Known for**: -
- **Comandos explícitos**: -
- **Meios de interação**:
  - activation_instructions: não
  - commands_defined: não
  - handoffs_defined: não
  - dependencies_resolution: não
  - request_resolution: não