# 21 · Glossário

> **Escopo:** termos de negócio, produto, jurídico e técnico usados nos documentos 00–20 da APEX Plataforma de Cursos Livres.
> **Convenção:** termos em inglês aparecem como são usados no código e na equipe técnica; a explicação é em português. Quando um termo tem decisão própria (ADR, requisito, política), o documento de origem vem na última coluna.

---

## 1. Negócio, produto e educação

| Termo | Definição | Origem |
|---|---|---|
| **APEX** | Nome inicial da plataforma. Risco de marca: colisão com a marca ApeX já existente no repositório e possível anterioridade no INPI (classes 9, 35, 41, 42 — busca **não** realizada). | 15, 16 |
| **Curso livre** | Curso de formação livre (LDB art. 42; Decreto 5.154/2004), sem exigência de autorização do MEC, que **não confere grau acadêmico**. Não usar *MBA*, *pós-graduação*, *diploma* nem "reconhecido pelo MEC". | 16 |
| **Certificado de conclusão** | Documento emitido quando o aluno cumpre os critérios de aprovação do produto (aulas + avaliação, quando houver). | 07 |
| **Certificado de participação** | Documento emitido por presença em evento ao vivo (webinar, workshop), sem avaliação de aprendizagem. | 07 |
| **Carga horária** | Tempo de estudo declarado do produto. Deve ser verificável (soma de mídia + atividades) e nunca inflada. | 07, 16 |
| **Produto** | Item vendável do catálogo, de qualquer um dos 16 formatos. Tem estado (rascunho → publicado → arquivado). | 07 |
| **Formato (F-01…F-16)** | Tipo de produto educacional: curso gravado, turma, trilha, e-book, webinar, workshop, mentoria, assinatura, desafio, comunidade, evento, exame, kit, recursos digitais, cartão-presente, licença B2B. | 07 |
| **Trilha** | Sequência de produtos com ordem e critério de progressão, vendida junto ou separadamente. | 07 |
| **Coorte (turma)** | Grupo de alunos com datas de início/fim comuns e, normalmente, interação ao vivo. | 07 |
| **Evergreen** | Conteúdo ao vivo gravado e reexibido sob demanda como se fosse ao vivo (*webinar evergreen*). Exige rotulagem honesta: não simular "ao vivo" nem escassez falsa. | 07, 09, 16 |
| **APEX Pass** | Assinatura recorrente de acesso a um conjunto de produtos/comunidade (F-08). | 07 |
| **Kit / bundle** | Pacote de produtos vendido com preço único. | 07 |
| **Instrutor** | Autor/professor que cria e (opcionalmente) vende conteúdo na plataforma. Recebe repasse. | 03, 10 |
| **Repasse (payout)** | Parcela da receita devida ao instrutor/afiliado, calculada no ledger e paga conforme calendário. | 10, 12 |
| **Afiliado** | Parceiro que indica compradores por link rastreável e recebe comissão. | 09 |
| **Matrícula** | Vínculo de um aluno a um produto, resultante de um pedido pago (ou concessão). Origem do *entitlement*. | 12 |
| **Assento (seat)** | Vaga de licença B2B atribuída a um colaborador do cliente corporativo. | 07 |
| **Reembolso incondicional de 7 dias** | Política adotada: devolução integral em até 7 dias da compra, independentemente do canal (CDC art. 49 cobre compras fora do estabelecimento; a política vai além do mínimo legal por escolha comercial). | 07, 16 |
| **Escassez falsa** | Prazo/estoque/contagem regressiva que não corresponde à realidade. Proibida pelo Guardião de Compliance. | 09, 16 |

## 2. Métricas e finanças

| Termo | Definição | Origem |
|---|---|---|
| **WAL-P** | *Weekly Active Learners with Progress* — alunos que concluíram ≥ 1 aula/atividade na semana. Métrica-guia (*north star*) de valor entregue. | 04 |
| **RA%** | Receita Automatizada — % da receita de pedidos sem toque humano (compra → pagamento → acesso → nota fiscal). Meta ≥ 90%. | 04, 10 |
| **CAC** | Custo de Aquisição de Cliente. Neste projeto, no canal pago: CPL ÷ conversão lead→compra; "CAC misto" = mídia ÷ novos clientes. | 17 |
| **CPL** | Custo por Lead. | 17 |
| **LTV** | *Lifetime Value* — contribuição acumulada por cliente. No modelo usa-se LTV de 12 meses, em **contribuição** (não em receita). | 17 |
| **LTV/CAC** | Razão entre LTV e CAC. Referência usual de saúde ≥ 3; o modelo ilustrativo fica abaixo de 1,5 em todos os cenários. | 17 |
| **Payback** | Tempo para a contribuição acumulada do cliente cobrir o CAC. | 17 |
| **Margem de contribuição** | Receita menos custos variáveis (gateway, repasse, afiliados, reembolso, impostos sobre a venda), antes de equipe e custos fixos. | 17 |
| **MRR** | *Monthly Recurring Revenue* — receita recorrente mensal (APEX Pass). | 17 |
| **Churn** | Taxa de cancelamento de assinantes no período. | 17 |
| **Ticket médio** | Valor médio do pedido do produto principal. | 17 |
| **Take-rate** | Percentual retido pela plataforma sobre a venda de terceiros (quando há marketplace). | 17 |
| **Chargeback** | Contestação da compra pelo titular do cartão junto ao emissor; gera estorno e tarifa. | 10, 16 |
| **ARPU** | Receita média por usuário. | 17 |
| **Ponto de equilíbrio estático** | Receita bruta mensal necessária para cobrir custos fixos dado um nível de margem de contribuição. | 17 |
| **Gate (G0–G4)** | Critério de passagem entre fases: só avançar/escalar quando as condições mensuráveis forem atendidas. | 17, 18 |
| **Cenário (conservador/base/otimista/alvo)** | Conjunto de premissas do modelo financeiro **ilustrativo**; não é projeção nem promessa. | 17 |

## 3. Marketing, vendas e atendimento

| Termo | Definição | Origem |
|---|---|---|
| **Funil (FN-01…FN-10)** | Fluxo do primeiro contato à compra e ao pós-venda, com gatilhos e métricas. | 09 |
| **Lead** | Pessoa que deixou contato com base legal para comunicação. | 09 |
| **Lead scoring** | Pontuação de propensão de compra a partir de comportamento e perfil; sempre explicável. | 09 |
| **Recuperação (dunning / carrinho)** | Cadência de contato para pagamentos recusados, Pix expirado, boleto vencido e carrinho abandonado. | 09, 10 |
| **Order bump / upsell** | Oferta adicional no checkout (*bump*) ou logo após a compra (*upsell*). | 09 |
| **UTM** | Parâmetros de URL que identificam origem/campanha. | 09 |
| **CAPI** | *Conversions API* — envio server-side de eventos de conversão a plataformas de anúncios, com consentimento. | 09, 13 |
| **SEO / GEO** | Otimização para buscadores / para respostas geradas por IA (*Generative Engine Optimization*). | 09 |
| **Landing page** | Página dedicada a uma oferta ou captura. | 09 |
| **Opt-in / opt-out** | Consentimento/recusa de comunicação. WhatsApp e e-mail marketing exigem opt-in registrado. | 09, 16 |
| **SLA** | Acordo de nível de serviço (prazo de resposta/resolução). | 10 |

## 4. Inteligência Artificial

| Termo | Definição | Origem |
|---|---|---|
| **APEX Intelligence** | Camada de IA da plataforma: gateway, RAG, agentes, aprovações e avaliações. | 08 |
| **Agente de IA (AG-01…AG-15)** | Componente com objetivo, ferramentas permitidas, nível de autonomia e métricas próprias (Tutor, Studio, Guardian, Vendas, Recuperação, Suporte, Ops, Radar, Moderador, Acessibilidade, Trilha, Growth, Finance, Regulatório, Assistentes do Instrutor). | 08 |
| **AI Gateway** | Ponto único de chamada a LLMs: roteamento de modelo, orçamento por tenant/agente, *kill switch*, registro e redação de PII. | 08, 11 |
| **LLM** | *Large Language Model* — modelo de linguagem de grande porte. | 08 |
| **RAG** | *Retrieval-Augmented Generation* — o modelo responde com base em trechos recuperados do conteúdo, com citação da fonte e recusa quando não há base. | 08 |
| **Embedding / pgvector** | Representação numérica de textos para busca por similaridade; armazenada no Postgres com a extensão pgvector. | 08, 12 |
| **ACL por entitlement** | Regra de que a busca do RAG só devolve trechos de produtos que o usuário tem direito de acessar. | 08, 12 |
| **Níveis de autonomia 0–3** | Definidos por **ação**, não por agente: 0 sugere (humano executa); 1 executa com aprovação explícita; 2 executa dentro de limites e notifica (humano pode reverter); 3 executa e audita por amostragem. Algumas ações são **proibidas** a qualquer nível (permissões, exclusão de dados fora de DSAR, contato com menor, parecer personalizado, promessa de resultado). | 08 |
| **HITL** | *Human-in-the-loop* — pessoa aprova/rejeita a ação do agente (caixa de entrada de aprovações). | 08, 10 |
| **Kill switch** | Interruptor que desliga um agente ou toda a IA imediatamente. | 08, 10 |
| **Guardião (Guardian / Guardião de Compliance)** | Agente e *gate* que barra termos proibidos, promessas de resultado, escassez falsa e PII antes de publicar. A publicação é protegida no banco por restrição (`status<>'published' OR compliance_status='approved'`). | 08, 16 |
| **Golden set / eval** | Conjunto fixo de perguntas e respostas esperadas, executado a cada mudança de prompt/modelo para detectar regressão. | 08, 20 |
| **Red team** | Teste adversarial (injeção de prompt, vazamento, jailbreak) conduzido antes de liberar autonomia maior. | 08, 20 |
| **Prompt injection** | Instrução maliciosa embutida em conteúdo que tenta desviar o comportamento do modelo. | 08 |
| **OWASP LLM Top 10** | Lista de riscos de segurança para aplicações com LLM, usada como checklist. | 08 |
| **Alucinação** | Resposta fluente porém sem base factual. Mitigada por RAG, citação obrigatória e recusa. | 08 |

## 5. Arquitetura e engenharia

| Termo | Definição | Origem |
|---|---|---|
| **ADR** | *Architecture Decision Record* — registro curto de uma decisão, alternativas e consequências (ADR-001…018). | 11 |
| **Spike (S-01…S-10)** | Investigação curta e delimitada para reduzir uma incerteza técnica antes de comprometer o desenho. | 11, 19 |
| **Monólito modular** | Uma aplicação implantável com módulos de fronteira clara; evita complexidade de microsserviços na fase inicial. | 11 |
| **Multi-tenant** | Uma instalação atendendo várias escolas/marcas (*tenants*) com dados isolados. | 11, 12 |
| **Tenant** | Cliente/marca isolada dentro da plataforma. | 11 |
| **RLS** | *Row-Level Security* — política do Postgres que filtra linhas por tenant no próprio banco (`platform.current_tenant()`). | 11, 12 |
| **FK composta (tenant_id, id)** | Chave estrangeira que inclui o tenant para impedir referência cruzada entre tenants. | 12 |
| **Outbox transacional** | Padrão em que o evento é gravado na mesma transação do dado e publicado depois, evitando perda ou duplicidade. | 11, 13 |
| **Idempotência** | Propriedade de uma operação que, repetida com a mesma chave, produz o mesmo resultado (webhooks, pagamentos). | 13 |
| **Saga** | Sequência de passos com compensação em caso de falha (ex.: pedido → pagamento → acesso → nota). | 11 |
| **Workflow durável** | Execução de processos longos com estado persistido e retomada (Inngest ou Temporal — decisão em spike). | 11 |
| **Adapter** | Camada que isola um fornecedor externo (PSP, vídeo, e-mail, WhatsApp, fiscal, LLM) atrás de uma interface própria. | 11 |
| **PSP** | *Payment Service Provider* — provedor de pagamento (cartão, Pix, boleto). | 11, 13 |
| **Ledger (razão)** | Registro contábil de partidas dobradas, imutável (*append-only*), com saldo conferido por *constraint* adiada. | 12 |
| **Append-only** | Tabela que só aceita inserção; atualização/remoção bloqueadas por gatilho. | 12 |
| **Entitlement** | Direito de acesso a um recurso (produto, aula, evento), derivado de matrícula, assinatura ou concessão. | 12, 13 |
| **Webhook** | Chamada HTTP enviada de um sistema a outro quando ocorre um evento; os de saída da APEX são assinados por HMAC. | 13 |
| **HMAC** | Código de autenticação de mensagem por chave secreta, usado para assinar webhooks. | 13 |
| **OpenAPI** | Especificação padrão de contratos de API REST (`api/openapi.yaml`, versão 3.1). | 13 |
| **Particionamento** | Divisão de uma tabela grande em partes (ex.: `analytics.events` por período). | 12 |
| **HNSW** | Índice aproximado de vizinhos mais próximos usado na busca vetorial. | 12 |
| **SLO / SLI** | Objetivo / indicador de nível de serviço (disponibilidade, latência, erro). | 06 |
| **RPO / RTO** | Perda máxima de dados aceitável / tempo máximo para restaurar o serviço. | 06 |
| **Runbook** | Procedimento operacional passo a passo para um incidente ou rotina. | 10 |
| **Feature flag** | Chave que liga/desliga um recurso sem nova implantação. | 11, 20 |
| **DoR / DoD** | *Definition of Ready* / *Definition of Done* — critérios de entrada e de conclusão de uma história. | 19 |
| **MoSCoW** | Priorização em Must / Should / Could / Won't (aqui, P=M/S/C). | 04, 05 |
| **Gherkin** | Formato Dado–Quando–Então para critérios de aceite executáveis. | 05, 20 |
| **WCAG 2.2 AA** | Diretrizes internacionais de acessibilidade web, nível AA. | 06, 14 |
| **CVD** | *Color Vision Deficiency* — daltonismo; a paleta de dados foi verificada para ele. | 15 |

## 6. Jurídico, privacidade e fiscal (Brasil)

| Termo | Definição | Origem |
|---|---|---|
| **LDB** | Lei de Diretrizes e Bases da Educação (Lei 9.394/1996); art. 42 trata dos cursos livres. | 16 |
| **CDC** | Código de Defesa do Consumidor (Lei 8.078/1990); art. 49 prevê arrependimento em 7 dias em compra fora do estabelecimento. | 16 |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018). | 16 |
| **ECA Digital** | Lei 15.211/2025 (em vigor em 17/03/2026), proteção de crianças e adolescentes em ambiente digital; autodeclaração de idade isolada pode ser insuficiente — ADR-010 (público 18+) depende de parecer jurídico. | 16 |
| **Marco Civil da Internet** | Lei 12.965/2014; exige guarda de registros de acesso por 6 meses. | 16 |
| **DSAR** | *Data Subject Access Request* — pedido de titular (acesso, correção, eliminação, portabilidade). Prazo operacional adotado: 15 dias. | 16 |
| **DPO / Encarregado** | Pessoa de contato com titulares e a ANPD. | 16 |
| **ANPD** | Autoridade Nacional de Proteção de Dados. | 16 |
| **ROPA** | Registro das operações de tratamento de dados pessoais. | 16 |
| **RIPD** | Relatório de Impacto à Proteção de Dados Pessoais. | 16 |
| **Base legal** | Fundamento da LGPD que autoriza o tratamento (consentimento, contrato, legítimo interesse etc.). | 16 |
| **NFS-e nacional** | Nota Fiscal de Serviço eletrônica no padrão nacional; obrigatória para optantes do Simples a partir de 01/11/2026 (conforme levantamento do Doc 16). | 16 |
| **IBS / CBS** | Novos tributos sobre consumo da reforma tributária, em transição a partir de 2027. | 16, 17 |
| **Simples Nacional** | Regime tributário simplificado; escolha de regime é a Q-04. | 16, 17 |
| **Pix Automático** | Modalidade de Pix para cobranças recorrentes autorizadas pelo pagador. | 09, 13 |
| **LBI** | Lei Brasileira de Inclusão (Lei 13.146/2015); art. 63 trata de acessibilidade em sítios na internet. | 06, 16 |
| **INPI** | Instituto Nacional da Propriedade Industrial (registro de marca). | 15, 16 |
| **Nível de verificação ✅ / 🟡 / ⬜** | ✅ confirmado em fonte primária consultada; 🟡 confirmado em fonte secundária ou com fontes divergentes; ⬜ não verificado — depende de parecer. | 16 |

## 7. Siglas de módulo e identificadores

| Código | Significado |
|---|---|
| **IAM** | Identidade e acesso (contas, papéis, 2FA, consentimentos, verificação de idade) |
| **CAT** | Catálogo e produtos |
| **LMS** | Aprendizagem (cursos, trilhas, turmas, avaliações, certificados) |
| **MED** | Conteúdo e mídia (upload, player, e-book reader, legendas) |
| **LIV** | Ao vivo e eventos (webinars, workshops, replays, presença) |
| **ENG** | Comunidade e engajamento |
| **PAY** | Checkout e pagamentos (pedidos, assinaturas, cupons, reembolsos, split) |
| **MKT** | Marketing e growth |
| **CRM** | CRM e vendas |
| **AIX** | APEX Intelligence (camada de IA) |
| **OPS** | Operações e back-office |
| **DAT** | Dados e analytics |
| **PLT** | Plataforma e integrações (API pública, webhooks, multi-tenant, feature flags) |
| **RF-\<MOD\>-NNN** | Requisito funcional (ex.: `RF-PAY-012`); prioridade P = M/S/C e fase F = 1–4 |
| **RNF-\<CAT\>-NNN** | Requisito não funcional (PER, SCA, AVL, SEC, PRV, ACC, USA, CMP, OBS, MNT, POR, AI, COM, DAT, FIN, I18) |
| **EP-nn** | Épico do PRD |
| **J-nn / S-nnn** | Jornada de usuário / tela (Doc 14) |
| **WF-…** | Workflow operacional (ORD, FIN, SUP, ACA, INS, CON, CMP, GRW, TEC) |
| **R-nn / RJ-nn** | Risco de projeto / risco jurídico |
| **Q-nn** | Questão aberta que depende de decisão do cliente |
| **B-nn** | Ação da Fase 0 (Doc 19) |
| **T-nnn** | Caso de teste crítico (Doc 20) |
| **L-nn** | Documento legal a elaborar (Doc 16) |
| **H-nn** | Hipótese de negócio a validar (Doc 03) |
