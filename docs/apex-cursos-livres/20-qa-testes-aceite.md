# 20 — Plano de QA, Testes e Aceite

> **APEX Plataforma de Cursos Livres** · Documento 20 · v1.0 · 21/10/2026 · Status: **Rascunho para validação**
> Requisitos: [Doc 05](05-requisitos-funcionais.md) (inclui Gherkin dos fluxos críticos, §14) · Qualidade: [Doc 06](06-requisitos-nao-funcionais.md) · Critérios de lançamento: [Doc 04](04-prd.md) §9

## 1. Estratégia

| Princípio | Aplicação |
|---|---|
| **Qualidade orientada a risco** | Testar mais onde há dinheiro, dados pessoais, menores, IA e promessas comerciais |
| **Pirâmide de testes** | Muitos testes de unidade e de regras de domínio; menos de integração; poucos e2e nos fluxos críticos |
| **Shift-left** | Critérios de aceite (Gherkin) escritos antes do desenvolvimento; revisão de testes no PR |
| **Provedores simulados e reais** | *Mocks* gravados + *sandbox* de PSP, vídeo, e-mail e fiscal; **testes de contrato** (RNF-MNT-03) |
| **Banco real nos testes** | Integração com PostgreSQL em contêiner (RLS e restrições testadas de verdade, como em `verify_001.sql`) |
| **Automação como portão de CI** | Nada é promovido sem testes verdes, sem achados críticos/altos de segurança e sem regressão de IA |
| **Dados sintéticos** | Nunca dados reais fora de produção (RNF-PRV-07) |

## 2. Níveis e ferramentas candidatas

| Nível | Foco | Ferramentas candidatas (a confirmar na Fase 0) | Cobertura-alvo |
|---|---|---|---|
| **Unidade e domínio** | Regras de pedido, ledger, acesso, certificado, preços, Guardião | Vitest/Jest | ≥ 85% no domínio crítico (RNF-MNT-02) |
| **Integração** | API + banco real + fila/outbox; RLS; migrações | Testcontainers + Postgres | Fluxos principais |
| **Contrato** | PSP, fiscal, vídeo, ao vivo, e-mail, WhatsApp; OpenAPI | Pact/Schemathesis/Dredd + *mocks* gravados | 100% das integrações |
| **Banco** | Restrições de negócio, RLS, *append-only* | `sql/verify_001.sql` (**33 verificações já existentes**) + novas por migração | Toda migração |
| **E2E** | Jornadas J-01…J-06 em navegador real e mobile | Playwright | Fluxos críticos |
| **Visual** | Regressão do design system e telas-chave | Storybook + *snapshots* | Componentes e telas críticas |
| **Desempenho** | Checkout, API, player, busca, tutor | k6 / Lighthouse CI | Metas do Doc 06 §1 |
| **Carga e resiliência** | Lançamento, webinar, falha de provedor | k6, *chaos* controlado | RNF-SCA, RNF-AVL |
| **Segurança** | SAST, SCA, *secrets*, DAST, pentest | CodeQL/Semgrep, Dependabot/OSV, gitleaks, ZAP, pentest independente | RNF-SEC |
| **Acessibilidade** | WCAG 2.2 AA | axe-core + auditoria manual + leitores de tela | RNF-ACC |
| **IA** | Fundamentação, recusa, injeção, segurança, custo | *Golden sets*, LLM-juiz calibrado, *red team* | RNF-AI |
| **Compatibilidade** | Navegadores, iOS/Android, redes lentas, e-mail | BrowserStack ou equivalente; Litmus/Email on Acid | RNF-CMP |

## 3. Matriz de testes dos fluxos críticos

> `T-<área>-NN`. **P**: prioridade (1 = bloqueia lançamento). **Auto**: automatizado no CI (✔) ou manual/exploratório.

### 3.1 Comércio e acesso

| ID | Cenário | Tipo | Requisitos | P | Auto |
|---|---|---|---|:-:|:-:|
| T-PAY-01 | Compra com Pix confirmada libera acesso em ≤ 30 s, com e-mail/WhatsApp, NFS-e e ledger | E2E + integração | RF-PAY-003, 016, RF-OPS-009 | 1 | ✔ |
| T-PAY-02 | **Webhook duplicado** não cria segunda matrícula, nota ou lançamento | Integração | RF-PAY-014 | 1 | ✔ |
| T-PAY-03 | Pix expirado: pedido vai a "expirado"; reemissão funciona | E2E | RF-PAY-003, 020 | 1 | ✔ |
| T-PAY-04 | Cartão recusado: mensagem segura; trocar para Pix sem refazer dados | E2E | RF-PAY-004 | 1 | ✔ |
| T-PAY-05 | Cartão com 3DS e parcelamento corretos | E2E (sandbox) | RF-PAY-004, 025 | 1 | ✔ |
| T-PAY-06 | Preço calculado só no servidor: adulterar valor no cliente não muda a cobrança | Segurança/API | RF-PAY-001, 012 | 1 | ✔ |
| T-PAY-07 | **Reembolso ≤ 7 dias com 30% de progresso** é automático, estorna no PSP, revoga acesso, cancela NFS-e e estorna repasse | E2E + integração | RF-PAY-010, 022 | 1 | ✔ |
| T-PAY-08 | Reembolso fora do prazo vai à caixa de aprovações | Integração | RF-PAY-022, RF-OPS-003 | 2 | ✔ |
| T-PAY-09 | Aceite de termos gravado com versão, data/hora e IP | Integração | RF-PAY-011 | 1 | ✔ |
| T-PAY-10 | *Ledger*: toda transação balanceada; correção só por lançamento reverso | Banco | RF-PAY-040 | 1 | ✔ |
| T-PAY-11 | Idempotência: repetir `placeOrder` com a mesma `Idempotency-Key` devolve o mesmo pedido | API | RF-PAY-014 | 1 | ✔ |
| T-PAY-12 | Cupom: limites, validade, empilhamento e primeira compra | Integração | RF-PAY-007 | 2 | ✔ |
| T-PAY-13 | Reserva de vagas: sem *overselling* sob concorrência | Carga/integração | RNF-SCA-07 | 1 | ✔ |
| T-PAY-14 | Falha de NFS-e não revoga acesso; vira tarefa/retentativa | Integração | RNF-AVL-05, WF-FIN-07 | 1 | ✔ |
| T-PAY-15 | Cancelamento de assinatura em ≤ 2 interações; sem nova cobrança | E2E | RF-PAY-033 | 2 | ✔ |
| T-PAY-16 | *Chargeback*: pacote de evidências montado antes do prazo | Integração | RF-PAY-023 | 2 | ✔ |

### 3.2 Aprendizagem e certificado

| ID | Cenário | Tipo | Requisitos | P | Auto |
|---|---|---|---|:-:|:-:|
| T-LMS-01 | Progresso salva e retoma o ponto exato; funciona em rede instável | E2E | RF-LMS-003 | 1 | ✔ |
| T-LMS-02 | Quiz: tentativas, nota mínima, embaralhamento e correção | Integração/E2E | RF-LMS-008, 009 | 1 | ✔ |
| T-LMS-03 | Certificado emitido só com critérios cumpridos; código único e QR | Integração | RF-LMS-013, 015 | 1 | ✔ |
| T-LMS-04 | Verificação pública mostra válido; após revogação, mostra revogado | E2E | RF-LMS-016, 017 | 1 | ✔ |
| T-LMS-05 | Certificado contém selo "CURSO LIVRE", carga horária e frase padrão; sem símbolos de governo | Conteúdo/visual | Doc 15 §8.1 | 1 | ✔ |
| T-LMS-06 | Publicação de vídeo sem legenda é bloqueada | Integração | RF-LMS-035 | 1 | ✔ |
| T-MED-01 | URL de vídeo assinada expira; não funciona fora do domínio permitido | Segurança | RF-MED-004 | 1 | ✔ |
| T-MED-02 | Limite de *streams* simultâneos por conta | Integração | RF-MED-007 | 2 | ✔ |
| T-MED-03 | Início de reprodução ≤ 2 s (p95, 4G) | Desempenho | RNF-PER-05 | 2 | ✔ |

### 3.3 Conformidade, identidade e privacidade

| ID | Cenário | Tipo | Requisitos | P | Auto |
|---|---|---|---|:-:|:-:|
| T-CAT-01 | **Título com "MBA" bloqueia a publicação** com explicação e sugestão | Integração | RF-CAT-021 | 1 | ✔ |
| T-CAT-02 | Termos proibidos em descrição, página e certificado (lista em dado, não em código) | Integração | RF-CAT-021, RF-AIX-024 | 1 | ✔ |
| T-CAT-03 | Produto não publica sem `compliance_status = approved` (restrição do banco) | Banco | Doc 12 §5 | 1 | ✔ |
| T-IAM-01 | Cadastro com política de senha, verificação de e-mail e proteção contra força bruta | E2E | RF-IAM-001, 018 | 1 | ✔ |
| T-IAM-02 | 2FA obrigatório para equipe e instrutores | Integração | RF-IAM-005 | 1 | ✔ |
| T-IAM-03 | Consentimentos granulares, **não pré-marcados**, com prova | E2E | RF-IAM-008 | 1 | ✔ |
| T-IAM-04 | Cadastro bloqueia menor sem responsável | E2E | RF-IAM-014 | 1 | ✔ |
| T-IAM-05 | **Isolamento entre tenants**: nenhuma consulta vê dados de outro tenant; sem tenant ⇒ sem linhas | Banco/Segurança | RF-PLT-001 | 1 | ✔ |
| T-IAM-06 | **BOLA**: acessar pedido/matrícula/certificado de outra pessoa é negado | API/Segurança | RNF-SEC | 1 | ✔ |
| T-OPS-01 | **DSAR**: exportação e exclusão com exceções legais registradas, no prazo | E2E | RF-IAM-019, RF-OPS-029 | 1 | ✔ |
| T-OPS-02 | Retenção e descarte por categoria; guarda de logs | Integração | RF-OPS-032 | 2 | ✔ |
| T-OPS-03 | Auditoria imutável de ações administrativas e financeiras | Banco | RNF-SEC-11 | 1 | ✔ |
| T-MKT-01 | Descadastro em 1 clique; supressão global; **sem opt-in não envia WhatsApp de marketing** | Integração | RF-IAM-009, RF-MKT-008 | 1 | ✔ |
| T-MKT-02 | Cookies não essenciais só após consentimento | E2E | RF-MKT-019 | 1 | ✔ |

### 3.4 IA

| ID | Cenário | Tipo | Requisitos | P | Auto |
|---|---|---|---|:-:|:-:|
| T-AIX-01 | Tutor responde **com citação** válida (aula e tempo) em ≥ 98% do *golden set* | Eval | RNF-AI-01 | 1 | ✔ |
| T-AIX-02 | Pergunta fora do conteúdo: **recusa** e oferece humano (≥ 95%) | Eval | RNF-AI-03 | 1 | ✔ |
| T-AIX-03 | **Controle de acesso**: aluno sem matrícula não recupera nem cita conteúdo de outro curso | Integração/Eval | RF-AIX-010 | 1 | ✔ |
| T-AIX-04 | **Injeção de prompt** (direta e indireta via conteúdo/PDF): taxa de sucesso do ataque ≤ 1% | *Red team* | RNF-AI-04 | 1 | ✔ |
| T-AIX-05 | Tutor encaminha a humano em risco/sofrimento, pedido do aluno ou reclamação comercial | Eval | RF-AIX-018 | 1 | ✔ |
| T-AIX-06 | Rótulo de IA presente em toda resposta; memória só com consentimento | E2E | RF-AIX-007, 019 | 1 | ✔ |
| T-AIX-07 | Orçamento por agente: ao atingir o teto, alerta e bloqueio; *kill switch* efetivo | Integração | RF-AIX-002, 015 | 1 | ✔ |
| T-AIX-08 | Dados pessoais redigidos nos registros de chamadas | Integração | RF-AIX-003 | 1 | ✔ |
| T-AIX-09 | **Agente de vendas** (Fase 3): não promete resultado, usa só ofertas ativas, respeita opt-in, horário e "parar" | Eval/*red team* | RF-AIX-028…030 | 1 | ✔ |
| T-AIX-10 | Mudança de prompt/modelo só promovida sem regressão nos *evals* | Pipeline | RF-AIX-005, RNF-AI-05 | 1 | ✔ |

### 3.5 Ao vivo e operação (Fase 2+)

| ID | Cenário | Tipo | Requisitos | P | Auto |
|---|---|---|---|:-:|:-:|
| T-LIV-01 | Inscrição, lembretes (D-1, H-1, H-10 min) e ICS | E2E | RF-LIV-004, 017 | 1 | ✔ |
| T-LIV-02 | Sala com 1.000 participantes; transmissão para 5.000 com latência baixa | Carga | RNF-SCA-03 | 1 | ✔ |
| T-LIV-03 | Webinar *evergreen* exibe rótulo de gravação; oferta com prazo real | E2E/Conteúdo | RF-LIV-015 | 1 | ✔ |
| T-LIV-04 | Presença ≥ 75% emite certificado de participação | Integração | RF-LIV-012, 013 | 2 | ✔ |
| T-OPS-10 | Fluxo de workflow retomado após falha; sem duplicar efeitos | Integração | RF-OPS-002 | 1 | ✔ |
| T-OPS-11 | Conciliação PSP × ledger × banco aponta divergências | Integração | RF-PAY-045 | 2 | ✔ |
| T-OPS-12 | Repasse só após garantia; dupla aprovação acima do limite | Integração | RF-PAY-042, 043 | 2 | ✔ |

## 4. Testes não funcionais

### 4.1 Desempenho e carga

| Cenário | Alvo | Critério |
|---|---|---|
| Lançamento: 100 pedidos/min (Fase 1) e 500/min (Fase 3), com teste a **2× o pico previsto** | RNF-SCA-04, 06 | Sem erro de pedido; p95 de API dentro do alvo; sem *overselling* |
| Navegação pública (CWV) | RNF-PER-01 | LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1 (p75, móvel) |
| Player e CDN sob pico | RNF-PER-05 | Início ≤ 2 s; *rebuffering* ≤ 1% |
| Tutor sob carga | RNF-PER-07 | Primeiro *token* ≤ 2 s; resposta ≤ 10 s (p95) |
| Webinar: 1.000 → 5.000 participantes | RNF-SCA-03 | Sem queda de sala; custo por participante dentro do orçamento |

### 4.2 Resiliência e recuperação

- **Falha de PSP, e-mail, WhatsApp, IA, vídeo ou ao vivo:** a venda e o acesso às aulas continuam (RNF-AVL-05); comunicação e fila de reprocessamento funcionam.
- **Restauração de banco** a partir de backup/PITR com medição de RPO/RTO (RNF-AVL-03, 04); trimestral.
- **Exercício de recuperação de desastre** semestral; **teste de incidente** (vazamento simulado) semestral.
- **Falha no meio da saga de compra:** reprocessar sem duplicar efeitos.

### 4.3 Segurança

| Atividade | Escopo | Quando |
|---|---|---|
| SAST/SCA/*secret scanning* | Todo PR | Contínuo |
| DAST | Ambiente de *staging* | Semanal/por release |
| **Teste de invasão independente** | Web, API, autenticação, checkout, vídeo, IA (OWASP Top 10, API Top 10, **LLM Top 10**) | **Antes do lançamento** e anual |
| Revisão de arquitetura e modelagem de ameaças | Fluxos críticos (Doc 11 §8.2) | Por mudança relevante |
| Gestão de vulnerabilidades | SLA: crítica ≤ 72 h; alta ≤ 7 dias | Contínuo |
| Programa de divulgação responsável | `security.txt` | Antes do lançamento |

### 4.4 Privacidade

- Testes automatizados de **DSAR** (exportar, corrigir, excluir/anonimizar com exceções).
- Verificação de **retenção** (descartes agendados) e de que **ambientes não produtivos não têm dados reais**.
- Revisão de **consentimentos** (versionamento, não pré-marcação, canais separados).
- Conferência de **DPAs** e localização de dados por fornecedor antes de cada integração em produção.

### 4.5 Acessibilidade

- **axe-core** automatizado no CI para as telas do design system e jornadas críticas.
- **Auditoria manual** WCAG 2.2 AA (teclado, foco, contraste, formulários, erros) e **teste com leitores de tela** (NVDA/JAWS, VoiceOver, TalkBack) nas jornadas J-01…J-06.
- Verificação de **legendas e transcrição** em 100% dos vídeos publicados (portão de publicação).
- Teste de `prefers-reduced-motion` e de tema escuro.

### 4.6 Compatibilidade

- Últimas 2 versões de Chrome, Safari, Firefox, Edge e Samsung Internet; iOS 16+ e Android 10+; **rede lenta (1,5 Mbps) e modo economia de dados**.
- E-mails em Gmail, Outlook, Apple Mail e clientes móveis; verificação de SPF/DKIM/DMARC e taxa de reclamação (< 0,1%).

## 5. Estratégia de testes de IA

| Elemento | Prática |
|---|---|
| ***Golden set* por curso** | 30–100 perguntas com resposta e fonte esperadas; criado no *onboarding* do curso (o Studio gera, humano valida) |
| **Categorias de casos** | `qa` (perguntas do conteúdo), `refusal` (fora do conteúdo), `injection` (ataques), `policy` (promessas, preço, certificado), `tone` (linguagem e acolhimento) |
| **Métricas** | Ancoragem ≥ 98%; erro factual ≤ 2%; recusa correta ≥ 95%; injeção bem-sucedida ≤ 1%; CSAT ≥ 4,3 |
| **LLM-juiz** | Calibrado contra amostra humana (concordância mínima definida); revisão humana semanal por amostragem |
| ***Red team*** | Conjunto crescente de ataques; executa a cada mudança de *prompt*/modelo; inclui injeção indireta por PDF, comentários e mensagens |
| **Portão de release** | Sem regressão nas métricas; aprovação do dono do agente; *rollout* gradual com *feature flag* |
| **Testes de política do agente de vendas** | Bateria de conversas adversariais (pedido de promessa, de desconto inexistente, de dado de cartão, "parar", horário) |
| **Custo** | Teste de orçamento e de *kill switch*; relatório de custo por interação nos *evals* |

> Os esquemas de dados que sustentam isso (`ai.eval_sets`, `ai.eval_cases`, `ai.eval_runs`) já existem no [Doc 12](12-modelo-de-dados.md).

## 6. Ambientes e dados de teste

| Ambiente | Uso | Dados | Provedores |
|---|---|---|---|
| **Local/dev** | Desenvolvimento | Sintéticos | *Mocks*/*sandbox* |
| **Preview por PR** | Revisão visual e funcional | Sintéticos | *Sandbox* |
| **Staging** | Integração, carga, UAT, pentest | **Sintéticos/anonimizados** | *Sandbox*/modo teste; PSP com cartões de teste |
| **Produção** | Uso real | Reais | Produção; **testes de fumaça** após cada release |

**Dados sintéticos:** pessoas, CPFs de teste válidos, cursos e cenários de edge (progresso parcial, reembolso, chargeback, assinatura em atraso, menor sem responsável, DSAR).

## 7. UAT e *beta*

- **Pilotos fechados** (instrutores e convidados) antes da primeira venda: roteiros por persona, medição de tarefas e registro de feedback.
- **Critérios de aceite do patrocinador** (Doc 19 §8): demonstração dos fluxos de negócio e dos portões.
- **Compras reais de baixo valor** em produção, com acompanhamento manual dos primeiros pedidos (G1).

## 8. Critérios de lançamento (Go/No-Go da Fase 1) e evidências

| Critério (Doc 04 §9) | Evidência de teste |
|---|---|
| Fluxo ponta a ponta em produção com compras reais de baixo valor | T-PAY-01, 03, 04; relatório do piloto |
| Reembolso de 7 dias automatizado | T-PAY-07 |
| NFS-e emitida automaticamente | T-PAY-01, T-PAY-14 |
| DSAR executável em ≤ 15 dias | T-OPS-01 |
| Teste de invasão sem achados críticos/altos | Relatório do pentest e correções verificadas |
| Monitoramento, alertas e *runbooks*; backup restaurado em teste | Relatório de restauração; painel de alertas |
| Documentos legais publicados e revisados | Checklist jurídico (Doc 16 §10) |
| Acessibilidade WCAG 2.2 AA nas jornadas críticas | Relatório axe + auditoria manual + leitores de tela |
| Tutor IA aprovado nos *evals* e testes de segurança | T-AIX-01…08 |
| Isolamento entre tenants e BOLA | T-IAM-05, T-IAM-06 |

## 9. Gestão de defeitos

| Severidade | Definição | Ação |
|---|---|---|
| **S1 — Crítica** | Perda de dinheiro, vazamento de dados, indisponibilidade de checkout/acesso, violação legal | Bloqueia release; correção imediata; *postmortem* |
| **S2 — Alta** | Fluxo principal quebrado com contorno difícil; falha de segurança média; erro de conformidade | Corrigir antes do lançamento ou com mitigação aprovada |
| **S3 — Média** | Falha em fluxo secundário ou usabilidade importante | Planejar em até 2 sprints |
| **S4 — Baixa** | Cosmético ou melhoria | Backlog |

Métricas: **taxa de escape** (defeitos achados em produção ÷ total), **tempo de correção por severidade**, **cobertura de requisitos por teste**, estabilidade do CI, tempo de *pipeline*.

## 10. Rastreabilidade

Cada requisito *Must* da Fase 1 deve ter ao menos um teste associado. O backlog já tem **cobertura 96/96** de requisitos por histórias ([Doc 19](19-roadmap-backlog-equipe.md) §4); na Fase 1 será criada a **matriz RF → teste** (gerada a partir de anotações nos testes, como o script de cobertura do backlog) e acompanhada como indicador de qualidade.

## 11. Responsabilidades

| Papel | Responsabilidade de qualidade |
|---|---|
| **QA + DevOps/SRE** | Estratégia, automação, CI, carga, observabilidade, ambientes |
| **Engenheiros** | Testes de unidade/integração/contrato junto do código; revisão de testes |
| **Tech Lead** | Portões técnicos, segurança, *pentest*, arquitetura |
| **PM** | Critérios de aceite, UAT, priorização de defeitos |
| **UX** | Testes de usabilidade e de acessibilidade com usuários |
| **Jurídico/DPO** | Revisão de textos legais, DSAR, RIPD, regras do Guardião |
| **Financeiro/Contador** | Validação de NFS-e, ledger e repasses |
