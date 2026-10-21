# 06 — Requisitos Não Funcionais (RNF)

> **APEX Plataforma de Cursos Livres** · Documento 06 · v1.0 · 21/10/2026 · Status: **Rascunho para validação**
> Todas as metas numéricas são **propostas de partida** (baseadas em práticas de mercado) e serão calibradas por teste de carga, custo e dados reais na Fase 1. Ver também [Doc 11](11-arquitetura-tecnica.md).

**Convenções:** `RNF-<CATEGORIA>-NN` · **P**: M (Must) / S (Should) / C (Could) · Medição indica *como* verificar.

## 1. Desempenho

| ID | Requisito | Meta | Medição | P |
|---|---|---|---|---|
| RNF-PER-01 | Core Web Vitals das páginas públicas (móvel, 4G, p75) | LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 (meta interna: LCP ≤ 1,8 s) | RUM + Lighthouse CI | M |
| RNF-PER-02 | Checkout | Tela interativa ≤ 2 s (p75, 4G); criação de cobrança ≤ 1,5 s (p95) | RUM + APM | M |
| RNF-PER-03 | API (leitura) | p95 ≤ 400 ms · p99 ≤ 1 s | APM | M |
| RNF-PER-04 | API (escrita transacional) | p95 ≤ 800 ms | APM | M |
| RNF-PER-05 | Início de reprodução do vídeo | ≤ 2 s (p95, 4G) · *rebuffering ratio* ≤ 1% | Analytics do player | M |
| RNF-PER-06 | Busca de catálogo | p95 ≤ 300 ms | APM | S |
| RNF-PER-07 | Tutor IA | Primeiro *token* ≤ 2 s (p95) · resposta completa ≤ 10 s (p95) | Telemetria de IA | M |
| RNF-PER-08 | Entrega pós-pagamento | Matrícula criada ≤ 30 s após confirmação do PSP (p99) | Métrica de negócio | M |
| RNF-PER-09 | Orçamento de JS por página pública | ≤ 170 KB comprimido (inicial) | CI (*bundle budget*) | S |
| RNF-PER-10 | Processamento de vídeo | Vídeo de 30 min disponível ≤ 15 min após upload | Pipeline | S |

## 2. Escala e capacidade (dimensionamento inicial)

| ID | Requisito | Meta Fase 1 → Fase 3 | P |
|---|---|---|---|
| RNF-SCA-01 | Alunos ativos/mês | 20 mil → 200 mil | M |
| RNF-SCA-02 | Usuários simultâneos na plataforma | 1 mil → 10 mil | M |
| RNF-SCA-03 | Participantes simultâneos em um webinar | 1 mil (F2) → 10 mil (F3) | M |
| RNF-SCA-04 | Pedidos em pico de lançamento | 100/min → 500/min | M |
| RNF-SCA-05 | Escala horizontal dos serviços sem estado e *autoscaling* por fila/CPU | Sim | M |
| RNF-SCA-06 | Teste de carga antes de cada lançamento relevante, com 2× o pico previsto | Obrigatório | M |
| RNF-SCA-07 | Reserva de vagas/ingressos sem *overselling* (reserva com TTL e transação) | 0 vendas acima da capacidade | M |

## 3. Disponibilidade, resiliência e recuperação

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-AVL-01 | Disponibilidade mensal de checkout, login e player | ≥ 99,9% | M |
| RNF-AVL-02 | Disponibilidade de painéis administrativos | ≥ 99,5% | S |
| RNF-AVL-03 | RPO (perda máxima de dados) | ≤ 5 min (PITR) | M |
| RNF-AVL-04 | RTO (tempo de recuperação) | ≤ 1 h | M |
| RNF-AVL-05 | Degradação graciosa: indisponibilidade de IA, e-mail, WhatsApp ou ao vivo **não** derruba venda e acesso a aulas | Obrigatório | M |
| RNF-AVL-06 | Idempotência, *retries* com recuo exponencial, *circuit breaker* e *bulkheads* em integrações externas | Obrigatório | M |
| RNF-AVL-07 | Backups automáticos, criptografados, com **restauração testada** | Trimestral | M |
| RNF-AVL-08 | Exercício de recuperação de desastre | Semestral | S |
| RNF-AVL-09 | Implantação sem indisponibilidade (*blue/green* ou *rolling*) e migrações compatíveis | Obrigatório | M |
| RNF-AVL-10 | Página de status pública e comunicação de incidentes | Obrigatório | S |

## 4. Segurança

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-SEC-01 | Referência de controles | OWASP ASVS nível 2; OWASP Top 10; OWASP API Top 10; **OWASP Top 10 para LLM** | M |
| RNF-SEC-02 | Criptografia em trânsito e em repouso | TLS ≥ 1.2 (preferir 1.3) · AES-256 · rotação de chaves | M |
| RNF-SEC-03 | Dados de cartão **nunca** tocam os servidores APEX (campos hospedados/tokenização do PSP) | Escopo PCI mínimo (SAQ A) | M |
| RNF-SEC-04 | Segredos em cofre dedicado; nenhum segredo em repositório ou imagem | Verificação em CI (*secret scanning*) | M |
| RNF-SEC-05 | Mínimo privilégio, segregação de funções (quem cria ≠ quem aprova pagamento/repasse) | Obrigatório | M |
| RNF-SEC-06 | MFA obrigatório para equipe e instrutores; *passkeys* recomendadas | Obrigatório | M |
| RNF-SEC-07 | WAF, proteção contra bots/DDoS, *rate limiting*, cabeçalhos de segurança (CSP, HSTS, etc.) | Obrigatório | M |
| RNF-SEC-08 | Isolamento multi-tenant com RLS e testes automatizados de vazamento entre tenants | Obrigatório | M |
| RNF-SEC-09 | SAST, SCA (dependências), varredura de contêineres e IaC em todo PR; DAST periódico | Sem críticas/altas abertas para liberar | M |
| RNF-SEC-10 | Teste de invasão independente antes do lançamento e anualmente | Obrigatório | M |
| RNF-SEC-11 | Logs de auditoria imutáveis (WORM) para ações administrativas, financeiras e de IA | Obrigatório | M |
| RNF-SEC-12 | Defesa contra injeção de prompt, exfiltração por ferramentas e envenenamento de RAG | Testes de *red team* por release de agente | M |
| RNF-SEC-13 | Uploads: validação de tipo/tamanho, varredura de malware, armazenamento isolado | Obrigatório | M |
| RNF-SEC-14 | Proteção contra pirataria de vídeo (assinatura, domínio, DRM, marca d'água) | Conforme RF-MED | S |
| RNF-SEC-15 | Gestão de vulnerabilidades com SLA de correção | Crítica ≤ 72 h · Alta ≤ 7 dias | M |
| RNF-SEC-16 | Programa de divulgação responsável (`security.txt`) | Publicado até o lançamento | S |

## 5. Privacidade e proteção de dados (LGPD) 🛡️

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-PRV-01 | *Privacy by design/default*: minimização, finalidade e necessidade documentadas por campo | Revisão a cada novo dado | M |
| RNF-PRV-02 | Encarregado (DPO) nomeado e canal público | Antes do lançamento | M |
| RNF-PRV-03 | Prazo de atendimento ao titular | Resposta simplificada imediata; completa ≤ 15 dias | M |
| RNF-PRV-04 | Relatório de impacto (RIPD) para IA, dados de menores e perfilamento | Antes de cada lançamento correspondente | M |
| RNF-PRV-05 | Tabela de retenção por categoria, com descarte automático | Publicada e aplicada | M |
| RNF-PRV-06 | Transferência internacional (nuvem/IA) apenas com mecanismo válido e DPA | Registro por fornecedor | M |
| RNF-PRV-07 | Pseudonimização em analytics e ambientes não produtivos (nunca dados reais em *staging*) | Obrigatório | M |
| RNF-PRV-08 | Transparência sobre decisões automatizadas relevantes e canal de revisão humana (LGPD art. 20) | Obrigatório | M |
| RNF-PRV-09 | Guarda dos registros de acesso a aplicações pelo prazo legal (6 meses) com acesso restrito | Obrigatório | M |
| RNF-PRV-10 | Registro de incidentes e prazos de comunicação | Playbook testado semestralmente | M |

## 6. Acessibilidade e usabilidade

| ID | Requisito | Meta | Medição | P |
|---|---|---|---|---|
| RNF-ACC-01 | Conformidade das jornadas do aluno e do checkout | **WCAG 2.2 nível AA** | Auditoria manual + axe | M |
| RNF-ACC-02 | Navegação completa por teclado; foco visível; ordem lógica | 100% das jornadas críticas | Teste manual | M |
| RNF-ACC-03 | Compatibilidade com leitores de tela (NVDA/JAWS/VoiceOver/TalkBack) | Jornadas críticas | Teste manual | M |
| RNF-ACC-04 | Legendas em todos os vídeos; transcrição disponível | 100% dos vídeos publicados | Gate de publicação | M |
| RNF-ACC-05 | Contraste ≥ 4,5:1 (texto) e ≥ 3:1 (componentes e texto grande); `prefers-reduced-motion` respeitado | Tokens validados | Teste automatizado | M |
| RNF-ACC-06 | Alvos de toque ≥ 44 px; leiaute fluido de 320 px a desktop | Sim | Teste | M |
| RNF-ACC-07 | Intérprete de Libras em eventos selecionados e conteúdos institucionais | Conforme RF-LIV-028 | — | S |
| RNF-ACC-08 | Declaração de acessibilidade e canal de feedback | Publicados | — | S |
| RNF-USA-01 | SUS (*System Usability Scale*) das jornadas do aluno | ≥ 80 | Pesquisa | S |
| RNF-USA-02 | Retomar a última aula em ≤ 2 interações a partir do *login* | Sim | Teste | M |
| RNF-USA-03 | Taxa de sucesso de tarefas-chave (comprar, assistir, tirar dúvida, obter certificado) | ≥ 90% | Teste moderado | S |

## 7. Compatibilidade

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-CMP-01 | Navegadores | Últimas 2 versões de Chrome, Safari, Firefox, Edge; Samsung Internet | M |
| RNF-CMP-02 | Sistemas móveis | iOS 16+ e Android 10+ (via navegador/PWA) | M |
| RNF-CMP-03 | Dispositivos de baixo desempenho e redes lentas | Funcionalidade essencial a 1,5 Mbps; modo economia de dados | S |
| RNF-CMP-04 | E-mail | Renderização testada em Gmail, Outlook, Apple Mail e clientes móveis | M |
| RNF-CMP-05 | TVs / *casting* | Chromecast/AirPlay para vídeo | C |

## 8. Observabilidade e operação

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-OBS-01 | Logs estruturados com *correlation id* ponta a ponta (web → API → fila → worker → PSP/IA) | Obrigatório | M |
| RNF-OBS-02 | Métricas, *traces* distribuídos (OpenTelemetry) e painéis de SLO | Obrigatório | M |
| RNF-OBS-03 | Alertas baseados em SLO (*burn rate*), com escalonamento e *runbook* por alerta | Obrigatório | M |
| RNF-OBS-04 | Monitoramento de negócio: aprovação de pagamentos, entregabilidade, funil de checkout | Obrigatório | M |
| RNF-OBS-05 | Observabilidade de IA: custo, latência, taxa de recusa, citações válidas, *thumbs*, escalonamentos | Obrigatório | M |
| RNF-OBS-06 | Rastreamento de erros no cliente e no servidor | Obrigatório | M |
| RNF-OBS-07 | Orçamento de erro (*error budget*) governa o ritmo de lançamentos | Prática do time | S |

## 9. Manutenibilidade e engenharia

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-MNT-01 | Tipagem estática estrita, *lint* e formatação automáticos | Sem erros no CI | M |
| RNF-MNT-02 | Cobertura de testes no domínio crítico (pedidos, ledger, acesso, certificados) | ≥ 85% de linhas · 100% das regras de negócio documentadas com teste | M |
| RNF-MNT-03 | Testes de contrato com PSP, vídeo, ao vivo, e-mail e WhatsApp (sandbox + *mocks* gravados) | Obrigatório | M |
| RNF-MNT-04 | Infraestrutura como código; ambientes reprodutíveis (dev, staging, prod) | Obrigatório | M |
| RNF-MNT-05 | CI/CD com *feature flags* e *rollback* em 1 comando | Obrigatório | M |
| RNF-MNT-06 | ADRs para decisões arquiteturais; documentação viva da API | Obrigatório | M |
| RNF-MNT-07 | Métricas DORA | Implantação diária · *lead time* < 1 dia · falha de mudança < 15% · MTTR < 1 h | S |
| RNF-MNT-08 | Dívida técnica visível, com orçamento de capacidade (≈ 15–20%) | Prática do time | S |

## 10. Portabilidade e independência de fornecedor

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-POR-01 | PSP, vídeo, ao vivo, e-mail, WhatsApp, fiscal e LLM acessados apenas por **interfaces (adapters)** | Troca sem alterar o domínio | M |
| RNF-POR-02 | Exportação completa dos dados da organização em formatos abertos | Sob demanda | M |
| RNF-POR-03 | Nenhuma lógica de negócio crítica em ferramenta *no-code* de terceiros | Regra | M |
| RNF-POR-04 | Contratos com cláusula de saída e portabilidade de dados | Jurídico | S |

## 11. Qualidade da IA

| ID | Requisito | Meta | Medição | P |
|---|---|---|---|---|
| RNF-AI-01 | Fundamentação (*grounding*): respostas do tutor apoiadas em fonte do curso | ≥ 98% no *golden set* | Avaliação automática + amostra humana | M |
| RNF-AI-02 | Erro factual/alucinação | ≤ 2% no *golden set* | Idem | M |
| RNF-AI-03 | Recusa correta quando sem evidência | ≥ 95% dos casos de teste | Idem | M |
| RNF-AI-04 | Segurança: taxa de sucesso de ataques de injeção/jailbreak do conjunto de teste | ≤ 1% | *Red team* contínuo | M |
| RNF-AI-05 | Mudança de modelo/prompt só entra após *evals* sem regressão e aprovação | Obrigatório | Pipeline | M |
| RNF-AI-06 | Satisfação com o tutor (CSAT) | ≥ 4,3/5 | Pesquisa in-app | S |
| RNF-AI-07 | Custo por interação e por aluno ativo dentro do orçamento do agente | Orçamento por agente | FinOps | M |
| RNF-AI-08 | Viés e linguagem: respostas em pt-BR, sem estereótipos; testes específicos | Conjunto de teste | Amostra humana | S |
| RNF-AI-09 | Reprodutibilidade: toda resposta guarda versão de prompt, modelo e contexto recuperado | Obrigatório | Auditoria | M |
| RNF-AI-10 | Agentes de ação (vendas, suporte, operação) com autonomia limitada por política e *HITL* configurável | Obrigatório | Testes de política | M |

## 12. Entregabilidade de comunicação

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-COM-01 | SPF, DKIM e DMARC alinhados; subdomínio dedicado a marketing | Obrigatório | M |
| RNF-COM-02 | Taxa de reclamação de spam | < 0,1% (alerta em 0,2%) | M |
| RNF-COM-03 | Descadastro em 1 clique (cabeçalho `List-Unsubscribe` + página) e supressão global | Obrigatório | M |
| RNF-COM-04 | WhatsApp: apenas contatos com *opt-in*, *templates* aprovados, monitoramento de qualidade do número | Obrigatório | M |
| RNF-COM-05 | Limite de frequência por contato e por canal (cap) | Configurável | M |

## 13. Dados, conformidade e auditoria

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-DAT-01 | Invariantes do ledger: somatório de lançamentos = 0; conciliação diária | Verificação automática | M |
| RNF-DAT-02 | Documentos fiscais e contratos retidos pelo prazo legal (confirmar com contador/jurídico) | Política documentada | M |
| RNF-DAT-03 | Linhagem e dicionário de dados | Atualizados a cada release | S |
| RNF-DAT-04 | Qualidade: testes de esquema e de volume nas tabelas críticas | CI de dados | S |

## 14. Custos (FinOps)

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-FIN-01 | Etiquetagem (*tags*) de custo por módulo/tenant/agente | 100% dos recursos | M |
| RNF-FIN-02 | Orçamentos e alertas (80% / 100%) para IA, vídeo e ao vivo | Obrigatório | M |
| RNF-FIN-03 | Custo unitário monitorado: IA/aluno, vídeo/hora, ao vivo/participante-hora, PSP/pedido | Painel mensal | M |
| RNF-FIN-04 | Política de ciclo de vida de armazenamento (mídia fria) | Obrigatório | S |

## 15. Internacionalização e localização

| ID | Requisito | Meta | P |
|---|---|---|---|
| RNF-I18-01 | Idioma pt-BR, moeda BRL, fuso `America/Sao_Paulo` por padrão; datas/horas exibidas no fuso do usuário | Obrigatório | M |
| RNF-I18-02 | Textos externalizados (i18n) e sem *strings* fixas no código | Obrigatório | S |
| RNF-I18-03 | Suporte a documentos brasileiros (CPF/CNPJ, CEP) com validação | Obrigatório | M |
