# 05 — Requisitos Funcionais

> **APEX Plataforma de Cursos Livres** · Documento 05 · v1.0 · 21/10/2026 · Status: **Rascunho para validação**

## 0. Convenções

| Campo | Significado |
|---|---|
| **ID** | `RF-<MÓDULO>-NNN`, estável (nunca reutilizar). Módulos: IAM, CAT, LMS, MED, LIV, ENG, PAY, MKT, CRM, AIX, OPS, DAT, PLT (ver [Doc 03](03-visao-produto-estrategia.md) §6) |
| **P** | Prioridade MoSCoW: **M** Must · **S** Should · **C** Could |
| **F** | Fase de entrega: **1** MVP · **2** Crescer · **3** Automatizar · **4** Escalar (ver [Doc 04](04-prd.md) §5) |
| 🛡️ | Requisito com impacto jurídico/compliance (ver [Doc 16](16-juridico-compliance.md)) |
| 🤖 | Requisito que usa IA (ver [Doc 08](08-ia-arquitetura-e-agentes.md)) |

Requisitos de qualidade (desempenho, segurança, disponibilidade etc.) estão no [Doc 06](06-requisitos-nao-funcionais.md). Fluxos críticos têm critérios de aceite em Gherkin na §14.

**Totais:** ver §15 (gerado a partir deste arquivo).

---

## 1. IAM — Identidade e Acesso

| ID | Requisito | P | F |
|---|---|---|---|
| RF-IAM-001 | Cadastro com e-mail e senha, com política de senha forte e verificação de e-mail antes de ações sensíveis | M | 1 |
| RF-IAM-002 | Login social (Google; Apple como opcional) | S | 1 |
| RF-IAM-003 | Login sem senha por link mágico/OTP (e-mail; WhatsApp na Fase 2) | S | 2 |
| RF-IAM-004 | Recuperação de senha com token de uso único e expiração ≤ 30 min; resposta idêntica para e-mail existente ou não (anti-enumeração) | M | 1 |
| RF-IAM-005 | 2FA por TOTP e *passkeys* (WebAuthn); **obrigatório** para admin, financeiro e instrutor; opcional para aluno | M | 1 |
| RF-IAM-006 | Gestão de sessões e dispositivos: listar, encerrar remotamente, limite de sessões simultâneas por conta | S | 1 |
| RF-IAM-007 | Perfil único de pessoa (aluno, comprador, lead, instrutor, afiliado) com CPF opcional; CPF obrigatório para NFS-e e certificado 🛡️ | M | 1 |
| RF-IAM-008 | Consentimentos granulares e versionados (termos, privacidade, marketing por canal) com prova (versão, data/hora, IP, agente) 🛡️ | M | 1 |
| RF-IAM-009 | Preferências de comunicação por canal; descadastro em 1 clique em todo e-mail (RFC 8058) 🛡️ | M | 1 |
| RF-IAM-010 | RBAC por organização com papéis-padrão: aluno, instrutor, coprodutor, afiliado, conteúdo, comercial, marketing, suporte, financeiro, DPO, admin, super-admin | M | 1 |
| RF-IAM-011 | Permissões finas por recurso/escopo (por produto, turma, centro de custo) — ABAC | S | 3 |
| RF-IAM-012 | SSO corporativo SAML/OIDC para clientes B2B | C | 3 |
| RF-IAM-013 | Convite de membros da equipe com expiração e aceite | M | 1 |
| RF-IAM-014 | Declaração e verificação proporcional de idade; bloqueio de cadastro de menor sem responsável vinculado 🛡️ | M | 1 |
| RF-IAM-015 | Conta de responsável legal, vínculo com menor, autorização de compra/acesso e painel de acompanhamento 🛡️ | S | 3 |
| RF-IAM-016 | Personificação ("ver como") por admin com justificativa obrigatória, aviso na tela e registro em auditoria; sem acesso a segredos | S | 2 |
| RF-IAM-017 | Auditoria de autenticação e autorização (login, falhas, alteração de papéis) imutável | M | 1 |
| RF-IAM-018 | Proteção contra força bruta: *rate limit*, bloqueio progressivo, CAPTCHA adaptativo | M | 1 |
| RF-IAM-019 | Autoatendimento do titular (LGPD): exportar meus dados, corrigir, revogar consentimentos, solicitar exclusão 🛡️ | M | 1 |
| RF-IAM-020 | Unificação de contas duplicadas (mesmo CPF/e-mail) com revisão e histórico | S | 2 |
| RF-IAM-021 | Detecção de compartilhamento de conta (padrões de dispositivo/localização) com ação configurável | S | 2 |
| RF-IAM-022 | Domínio e tela de login personalizáveis por tenant | C | 4 |

## 2. CAT — Catálogo e Produtos

| ID | Requisito | P | F |
|---|---|---|---|
| RF-CAT-001 | Entidade **Produto** polimórfica por tipo: curso, trilha, e-book, webinar, workshop, mentoria, assinatura, evento, exame, kit, cartão-presente, licença corporativa (detalhe no [Doc 07](07-catalogo-formatos-produto.md)) | M | 1 |
| RF-CAT-002 | Ciclo de vida do produto: rascunho → em revisão → publicado → arquivado, com versionamento e histórico | M | 1 |
| RF-CAT-003 | Metadados: título, slug, resumo, descrição rica, categorias, tags, nível, idioma, carga horária, pré-requisitos, objetivos de aprendizagem, público-alvo | M | 1 |
| RF-CAT-004 | Mídia de vitrine: capa, vídeo de apresentação, galeria, pré-visualização gratuita de aulas | M | 1 |
| RF-CAT-005 | **Ofertas** múltiplas por produto (à vista, parcelado, assinatura, lote, promoção, gratuito) com vigência e públicos | M | 1 |
| RF-CAT-006 | Lotes de ingresso e preços escalonados por data/quantidade (workshops/eventos) | S | 2 |
| RF-CAT-007 | Limite de vagas e lista de espera com reposição automática | M | 2 |
| RF-CAT-008 | Kits/combos com preço próprio e entrega de múltiplos produtos | S | 2 |
| RF-CAT-009 | Categorias hierárquicas, coleções editoriais e destaques | S | 1 |
| RF-CAT-010 | Busca textual com tolerância a erros e filtros (categoria, nível, preço, formato, duração, avaliação) | M | 1 |
| RF-CAT-011 | Página pública de produto com renderização no servidor e dados estruturados (`Course`, `Event`, `Product/Offer`, `VideoObject`, `FAQPage`) | M | 1 |
| RF-CAT-012 | `sitemap.xml`, `canonical`, `hreflang`, imagens OG geradas automaticamente | M | 1 |
| RF-CAT-013 | Avaliações **somente de compradores verificados**, nota média, moderação; depoimentos com consentimento 🛡️ | M | 2 |
| RF-CAT-014 | FAQ por produto, com geração assistida por IA e aprovação humana 🤖 | S | 1 |
| RF-CAT-015 | Página pública do instrutor (bio, produtos, avaliações) | S | 1 |
| RF-CAT-016 | Recomendações ("quem comprou também", próximo passo) | S | 2 |
| RF-CAT-017 | Regras de acesso: vitalício, prazo em dias/meses, até data, por turma, por nível de gamificação | M | 1 |
| RF-CAT-018 | Exibição da política de reembolso por produto (padrão 7 dias + garantia estendida opcional) 🛡️ | M | 1 |
| RF-CAT-019 | Conteúdo gratuito / *lead magnet* com captura e consentimento | M | 1 |
| RF-CAT-020 | Cupons por produto, coleção ou campanha, inclusive vinculados a afiliado | S | 1 |
| RF-CAT-021 | **Guardião de Compliance**: bloqueia publicação quando título, descrição, página ou certificado contiver termos proibidos/ambíguos (p. ex.: "MBA", "pós-graduação", "graduação", "diploma", "técnico", "reconhecido pelo MEC", "validade nacional"), promessas de resultado ou área de profissão regulamentada sem revisão 🛡️🤖 | M | 1 |
| RF-CAT-022 | Vitrines segmentadas por público/campanha com URL própria (B2B, afiliado, evento) | S | 2 |
| RF-CAT-023 | Pré-venda e lançamento programado (publicação e abertura de vendas por data) | S | 2 |
| RF-CAT-024 | Importação/exportação em lote do catálogo (CSV/JSON) | S | 2 |
| RF-CAT-025 | Preparação para múltiplos idiomas/moedas | C | 4 |

## 3. LMS — Aprendizagem

| ID | Requisito | P | F |
|---|---|---|---|
| RF-LMS-001 | Estrutura curso → módulos → aulas, com reordenação por arrastar | M | 1 |
| RF-LMS-002 | Tipos de aula: vídeo, texto rico, áudio, PDF/e-book, quiz, tarefa, incorporação, sessão ao vivo agendada | M | 1 |
| RF-LMS-003 | Progresso por aula/módulo/curso; retomada do ponto exato; conclusão automática (≥ X% assistido) ou manual | M | 1 |
| RF-LMS-004 | Liberação gradual (*drip*) por data fixa, dias após matrícula ou conclusão de etapa | M | 1 |
| RF-LMS-005 | Pré-requisitos entre módulos e entre cursos | M | 2 |
| RF-LMS-006 | Turmas (*cohorts*) com datas, tutor responsável e calendário próprio | M | 2 |
| RF-LMS-007 | Trilhas: sequência de cursos com regras e certificado de trilha | M | 2 |
| RF-LMS-008 | Banco de questões e quizzes: múltipla escolha, V/F, associação, lacunas, dissertativa, envio de arquivo | M | 1 |
| RF-LMS-009 | Configuração de avaliação: tentativas, tempo, embaralhamento, nota mínima, *feedback* imediato ou diferido | M | 1 |
| RF-LMS-010 | Correção automática; correção assistida por IA de respostas abertas com revisão humana e rubrica 🤖 | S | 2 |
| RF-LMS-011 | Rubricas, feedback individual e revisão por pares | C | 3 |
| RF-LMS-012 | Tarefas com prazo, envio de arquivos, aceite tardio e devolutiva | M | 2 |
| RF-LMS-013 | **Certificado de Conclusão** com regras (progresso mínimo, nota mínima — padrão 70%, frequência) 🛡️ | M | 1 |
| RF-LMS-014 | **Certificado de Participação** (eventos ao vivo e atividades sem avaliação) 🛡️ | M | 2 |
| RF-LMS-015 | Layout de certificado customizável por produto/instrutor com carga horária, data, código único e QR | M | 1 |
| RF-LMS-016 | Verificação pública do certificado (URL e código; exibe nome, curso, carga horária, data, emissor, status) | M | 1 |
| RF-LMS-017 | Revogação, reemissão e segunda via com histórico | M | 1 |
| RF-LMS-018 | Credenciais verificáveis assinadas (Open Badges 3.0) e histórico (CLR) | S | 3 |
| RF-LMS-019 | Anotações pessoais e marcadores de tempo por aula | S | 2 |
| RF-LMS-020 | Comentários e dúvidas por aula, com resposta do instrutor, tutor IA ou comunidade 🤖 | M | 1 |
| RF-LMS-021 | Materiais complementares e downloads com controle de acesso | S | 1 |
| RF-LMS-022 | Favoritos, "assistir depois" e lista de desejos | S | 2 |
| RF-LMS-023 | Matrícula automática por compra; matrícula manual e em lote pelo admin | M | 1 |
| RF-LMS-024 | Prazo de acesso, renovação e extensão de matrícula | S | 1 |
| RF-LMS-025 | Suspensão/cancelamento de matrícula por reembolso, fraude ou inadimplência | M | 1 |
| RF-LMS-026 | Transferência/reativação de matrícula (pessoa, turma) | S | 2 |
| RF-LMS-027 | Painel do aluno: continuar de onde parou, próximos passos, agenda, certificados, pedidos | M | 1 |
| RF-LMS-028 | Meta e plano semanal de estudo com lembretes, personalizados por IA 🤖 | S | 2 |
| RF-LMS-029 | Relatórios do instrutor: progresso, curva de retenção por aula, itens difíceis do quiz, dúvidas frequentes | M | 2 |
| RF-LMS-030 | Relatórios B2B: progresso por equipe, exportação, certificados em lote | C | 3 |
| RF-LMS-031 | Pesquisa de satisfação por aula/curso e NPS | M | 2 |
| RF-LMS-032 | Importação SCORM/xAPI | C | 4 |
| RF-LMS-033 | Duplicação de curso, histórico de versões e aviso de novidades aos alunos | S | 2 |
| RF-LMS-034 | Atualização de conteúdo sem perda de progresso (versionamento de aulas) | M | 2 |
| RF-LMS-035 | **Acessibilidade**: publicação de vídeo exige legenda (ou exceção justificada), transcrição e descrição de imagens 🛡️ | M | 1 |
| RF-LMS-036 | Integridade de avaliação: tempo mínimo, aleatorização, detecção de padrões anômalos | C | 3 |
| RF-LMS-037 | Trilha adaptativa e reforço personalizado 🤖 | C | 3 |
| RF-LMS-038 | Pré-teste/diagnóstico com recomendação de ponto de partida 🤖 | S | 3 |
| RF-LMS-039 | Revisão espaçada: *flashcards* gerados por IA a partir das aulas 🤖 | S | 3 |
| RF-LMS-040 | Grupos de estudo | C | 4 |

## 4. MED — Conteúdo e Mídia

| ID | Requisito | P | F |
|---|---|---|---|
| RF-MED-001 | Upload retomável de vídeo/áudio/arquivos, com limites configuráveis e varredura de malware | M | 1 |
| RF-MED-002 | Transcodificação adaptativa (HLS/DASH), múltiplas resoluções, miniaturas e *sprites* | M | 1 |
| RF-MED-003 | Player responsivo: velocidade, qualidade, legendas, atalhos de teclado, PiP, retomada | M | 1 |
| RF-MED-004 | Proteção de reprodução: URL assinada com expiração, restrição de domínio e token por sessão | M | 1 |
| RF-MED-005 | Multi-DRM para conteúdos premium | S | 2 |
| RF-MED-006 | Marca d'água dinâmica por espectador (visível e/ou forense) | S | 2 |
| RF-MED-007 | Limite de dispositivos/*streams* simultâneos por conta | S | 1 |
| RF-MED-008 | Legendas automáticas em pt-BR (ASR), editor e tradução; formato WebVTT 🤖 | M | 1 |
| RF-MED-009 | Transcrição pesquisável e capítulos automáticos 🤖 | S | 1 |
| RF-MED-010 | Modo somente áudio e economia de dados | S | 2 |
| RF-MED-011 | Leitor de e-book na web (EPUB/PDF): busca, anotações, progresso sincronizado; PDF baixável com marca d'água | M | 1 |
| RF-MED-012 | Biblioteca de ativos por organização, com tags e rastreio de uso | M | 1 |
| RF-MED-013 | Verificação automática de qualidade (loudness, resolução, silêncio, legenda) antes da publicação 🤖 | S | 2 |
| RF-MED-014 | CDN com regionalização e *failover* de provedor | S | 1 |
| RF-MED-015 | Analytics de vídeo: mapa de calor de retenção, abandono, replays | M | 2 |
| RF-MED-016 | Detecção de padrões de compartilhamento/gravação | S | 3 |
| RF-MED-017 | Dublagem e tradução por IA, **somente** com consentimento expresso do detentor da voz/imagem 🛡️🤖 | C | 3 |
| RF-MED-018 | Vídeo interativo (perguntas dentro do vídeo) | S | 3 |
| RF-MED-019 | Política de retenção, arquivamento e exclusão de mídia | M | 1 |
| RF-MED-020 | Gravação de tela e editor básico no navegador | C | 4 |

## 5. LIV — Ao Vivo e Eventos

| ID | Requisito | P | F |
|---|---|---|---|
| RF-LIV-001 | Cadastro de evento com tipos: webinar, workshop, aula ao vivo, mentoria coletiva, evento multissessão | M | 2 |
| RF-LIV-002 | Agenda com fuso horário, recorrência, séries, capacidade e lotes | M | 2 |
| RF-LIV-003 | Inscrição gratuita e paga, ingresso com QR, transferência de ingresso | M | 2 |
| RF-LIV-004 | Página de inscrição (LP builder), confirmação e lembretes (e-mail/WhatsApp/push) em D-1, H-1 e H-10min | M | 2 |
| RF-LIV-005 | Sala ao vivo nativa (WebRTC): áudio/vídeo, tela, chat, Q&A, enquetes, mão levantada, reações | M | 2 |
| RF-LIV-006 | Modo webinar para grandes audiências (poucos palestrantes, muitos espectadores) com transmissão de baixa latência | M | 2 |
| RF-LIV-007 | Modo workshop interativo: salas paralelas (*breakouts*), quadro branco, exercícios e quizzes ao vivo | S | 2 |
| RF-LIV-008 | Co-apresentadores, moderadores e sala de bastidores | M | 2 |
| RF-LIV-009 | Gravação automática e publicação de replay com cortes | M | 2 |
| RF-LIV-010 | Legendas ao vivo (ASR) 🤖 | S | 3 |
| RF-LIV-011 | **Momento da oferta**: CTA/checkout dentro da sala, com cronograma e métricas | M | 2 |
| RF-LIV-012 | Presença e engajamento (tempo, interações) para certificado e *lead scoring* | M | 2 |
| RF-LIV-013 | Certificado de participação automático por presença mínima | M | 2 |
| RF-LIV-014 | Webinar *evergreen* (sessão gravada com horários automáticos), chat moderado e ofertas temporizadas | S | 2 |
| RF-LIV-015 | **Transparência**: sessões gravadas exibem rótulo "gravação"; vedado simular "ao vivo" de forma enganosa 🛡️ | M | 2 |
| RF-LIV-016 | Eventos multissessão: programação, trilhas, passe geral, replay por sessão | S | 3 |
| RF-LIV-017 | Calendário (ICS/Google/Outlook) | M | 2 |
| RF-LIV-018 | Lista de espera e reposição de vagas | S | 2 |
| RF-LIV-019 | Pós-evento automatizado: replay, materiais, pesquisa e oferta | S | 2 |
| RF-LIV-020 | Moderação de chat (IA + humana): filtro de links, banimento | M | 2 |
| RF-LIV-021 | Sugestão de resposta da IA no Q&A, sob aprovação do apresentador 🤖 | S | 3 |
| RF-LIV-022 | Resumo pós-evento por IA (tópicos, perguntas, ações) 🤖 | S | 3 |
| RF-LIV-023 | Teste de equipamento (*pre-check*) e páginas de contingência | M | 2 |
| RF-LIV-024 | Alertas de capacidade e consumo (minutos-participante) | M | 2 |
| RF-LIV-025 | Transmissão simultânea (RTMP) para outras plataformas | C | 3 |
| RF-LIV-026 | Mentoria 1:1/grupo com agenda por disponibilidade, pagamento, sala e notas | M | 3 |
| RF-LIV-027 | Check-in presencial por QR em eventos híbridos | C | 4 |
| RF-LIV-028 | Intérprete de Libras (PiP) e legendas | S | 3 |
| RF-LIV-029 | Relatório de evento: inscritos, comparecimento, pico, vendas atribuídas | M | 2 |
| RF-LIV-030 | Salas privadas por turma com controle de entrada | S | 2 |

## 6. ENG — Comunidade e Engajamento

| ID | Requisito | P | F |
|---|---|---|---|
| RF-ENG-001 | Espaços de comunidade por produto/turma/público, com regras | M | 2 |
| RF-ENG-002 | Posts, comentários, reações, menções e anexos | M | 2 |
| RF-ENG-003 | Moderação: denúncias, filtros, banimento, auditoria; pré-moderação por IA 🤖 | M | 2 |
| RF-ENG-004 | Gamificação: pontos, níveis, ranking e selos; liberação de conteúdo por nível | S | 2 |
| RF-ENG-005 | Regras de pontuação configuráveis, com antifraude | M | 2 |
| RF-ENG-006 | Metas e sequências (*streaks*) configuráveis; **desligadas por padrão para menores** 🛡️ | S | 2 |
| RF-ENG-007 | Desafios/*bootcamps* (dias, check-ins, prêmios) | S | 2 |
| RF-ENG-008 | Central de notificações multicanal (in-app, push, e-mail, WhatsApp) com limites de frequência e preferências | M | 1 |
| RF-ENG-009 | Mensagens diretas entre membros (opt-in) | C | 3 |
| RF-ENG-010 | Grupos de estudo | C | 3 |
| RF-ENG-011 | Calendário unificado do aluno | M | 2 |
| RF-ENG-012 | *Office hours* e mentorias agendadas | S | 3 |
| RF-ENG-013 | Reconhecimento: destaque do mês, depoimentos | S | 2 |
| RF-ENG-014 | Programa de indicação (link, recompensa, antifraude) | M | 2 |
| RF-ENG-015 | Programa de fidelidade (benefícios por histórico) | C | 3 |
| RF-ENG-016 | Enquetes e votação de conteúdo ("o que ensinar a seguir") | S | 2 |
| RF-ENG-017 | Eventos de comunidade (AMA) | S | 2 |
| RF-ENG-018 | Código de conduta com aceite | M | 2 |
| RF-ENG-019 | Perfis públicos opcionais com privacidade configurável | M | 2 |
| RF-ENG-020 | Pareamento de colegas de estudo por IA (opt-in) 🤖 | C | 4 |

## 7. PAY — Checkout e Pagamentos

### 7.1 Checkout e pedido

| ID | Requisito | P | F |
|---|---|---|---|
| RF-PAY-001 | Checkout em 1 página, *mobile-first*, com compra sem cadastro prévio (conta criada após a compra) | M | 1 |
| RF-PAY-002 | Dados do comprador: nome, e-mail, CPF/CNPJ, telefone; endereço apenas quando exigido | M | 1 |
| RF-PAY-003 | Pix (QR e copia-e-cola) com expiração e confirmação em tempo real | M | 1 |
| RF-PAY-004 | Cartão de crédito com tokenização do PSP, 3DS, parcelamento e bandeiras | M | 1 |
| RF-PAY-005 | Boleto bancário com liberação após compensação | S | 1 |
| RF-PAY-006 | Carteiras digitais (Apple Pay/Google Pay) | C | 3 |
| RF-PAY-007 | Cupons: percentual/valor, vigência, limite de uso, primeira compra, por produto/coleção, regras de empilhamento | M | 1 |
| RF-PAY-008 | *Order bump* na página de checkout | S | 2 |
| RF-PAY-009 | *Upsell/downsell* de um clique pós-compra | S | 2 |
| RF-PAY-010 | Garantia de 7 dias (CDC art. 49) com fluxo de solicitação automatizado; garantia estendida opcional 🛡️ | M | 1 |
| RF-PAY-011 | Registro de aceite de termos no checkout (versão, data/hora, IP) 🛡️ | M | 1 |
| RF-PAY-012 | Informações pré-contratuais e resumo claro da compra (preço total, prazo de acesso, parcelamento, SAC) 🛡️ | M | 1 |
| RF-PAY-013 | Antifraude: score do PSP, regras próprias, listas de bloqueio e limites por CPF/IP/cartão | M | 1 |
| RF-PAY-014 | Idempotência de pedidos/pagamentos e reconciliação de *webhooks* do PSP | M | 1 |
| RF-PAY-015 | Máquina de estados do pedido: criado → pendente → pago → entregue → reembolsado/contestado | M | 1 |
| RF-PAY-016 | Entrega automática (matrícula/ingresso/arquivo) em ≤ 30 s após a confirmação do pagamento | M | 1 |
| RF-PAY-017 | Mensagens transacionais (recibo, acesso, Pix pendente, boleto) por e-mail e WhatsApp | M | 1 |
| RF-PAY-018 | Página de agradecimento com próximos passos e oferta adicional | M | 1 |
| RF-PAY-019 | Recuperação de checkout abandonado (e-mail/WhatsApp/SMS/push) com janela e frequência controladas 🤖 | S | 2 |
| RF-PAY-020 | Recuperação de Pix expirado e boleto vencido (reemissão) | S | 2 |
| RF-PAY-021 | *Dunning* de cartão recusado: retentativas inteligentes, link de atualização | S | 2 |
| RF-PAY-022 | Reembolso total/parcial com estorno no PSP, revogação de acesso e cancelamento de NFS-e | M | 1 |
| RF-PAY-023 | Gestão de *chargeback*: alerta, coleta de evidências (aceite, logs de acesso), prazos e status | S | 2 |
| RF-PAY-024 | Link de pagamento / venda assistida gerada por vendedor ou agente | M | 2 |
| RF-PAY-025 | Parcelamento com ou sem juros (configurável) e absorção de custo pela plataforma | S | 1 |
| RF-PAY-026 | Integração de conversões (Purchase) a Meta CAPI, Google e TikTok com deduplicação | M | 2 |
| RF-PAY-027 | Teste A/B de oferta e preço com limites de conformidade com o consumidor | C | 3 |
| RF-PAY-028 | Compra para terceiros (presente) | C | 3 |
| RF-PAY-029 | Multimoeda e câmbio | C | 4 |
| RF-PAY-030 | Pix parcelado / crédito (BNPL) via parceiros | C | 4 |

### 7.2 Assinaturas

| ID | Requisito | P | F |
|---|---|---|---|
| RF-PAY-031 | Planos recorrentes: ciclos mensal/anual, *trial*, upgrade/downgrade proporcional, pausa | S | 2 |
| RF-PAY-032 | **Pix Automático** como meio recorrente, além de cartão | S | 2 |
| RF-PAY-033 | Cancelamento *self-service* em ≤ 2 cliques, pelo mesmo canal da contratação, com confirmação por e-mail 🛡️ | S | 2 |
| RF-PAY-034 | Retenção ética: oferta de pausa/desconto sem obstruir o cancelamento 🛡️ | S | 2 |
| RF-PAY-035 | Gestão de inadimplência com carência configurável e bloqueio gradual | S | 2 |
| RF-PAY-036 | Métricas de assinatura: MRR, ARR, churn voluntário/involuntário, LTV, coorte | S | 2 |
| RF-PAY-037 | Aviso prévio de renovação e de cobrança (antecedência configurável) 🛡️ | S | 2 |
| RF-PAY-038 | Cartão-presente e créditos de loja | S | 3 |
| RF-PAY-039 | Faturamento B2B: boleto faturado, PO, CNPJ, múltiplos assentos | C | 3 |

### 7.3 Financeiro e repasses

| ID | Requisito | P | F |
|---|---|---|---|
| RF-PAY-040 | Ledger de dupla entrada (receita, taxas, impostos, repasses, reservas) como fonte única | M | 1 |
| RF-PAY-041 | Split entre instrutor, coprodutor, afiliado e plataforma por regra de produto | M | 2 |
| RF-PAY-042 | Retenção do repasse até o fim do prazo de arrependimento + margem | M | 2 |
| RF-PAY-043 | Repasses automáticos com extrato, comprovante e tratamento fiscal aplicável | S | 2 |
| RF-PAY-044 | Reserva para reembolsos e *chargebacks* | S | 2 |
| RF-PAY-045 | Conciliação automática PSP × ledger × banco | S | 2 |
| RF-PAY-046 | Relatórios financeiros: vendas, taxas, líquido, DRE gerencial, fluxo de caixa | S | 2 |

## 8. MKT — Marketing e Growth

| ID | Requisito | P | F |
|---|---|---|---|
| RF-MKT-001 | Construtor de páginas (LP) por blocos, responsivo, com versionamento, publicação e domínio personalizado | M | 2 |
| RF-MKT-002 | Geração de página de venda a partir do produto, com revisão do Guardião de Compliance 🤖🛡️ | S | 2 |
| RF-MKT-003 | Formulários, *pop-ups*, barras e quiz de qualificação com captura de consentimento | M | 2 |
| RF-MKT-004 | Construtor de **funis** (captura → nutrição → evento → oferta → checkout → pós-venda) com templates: lead magnet, webinar, lançamento, perpétuo, desafio | M | 2 |
| RF-MKT-005 | Editor de e-mail, *templates*, *broadcasts* e testes A/B de assunto/conteúdo | M | 2 |
| RF-MKT-006 | Automações por gatilho/condição/ação (compartilhando o motor do OPS) | M | 2 |
| RF-MKT-007 | Higiene de entrega de e-mail: SPF, DKIM, DMARC, subdomínio de envio, aquecimento, tratamento de *bounce*/reclamação, lista de supressão | M | 1 |
| RF-MKT-008 | WhatsApp: *templates* aprovados, *broadcasts* com *opt-in*, sequências, janela de 24 h | S | 2 |
| RF-MKT-009 | SMS e *push* web como canais opcionais | C | 3 |
| RF-MKT-010 | Segmentação dinâmica (comportamento, RFM, propensão) | M | 2 |
| RF-MKT-011 | **Afiliados**: cadastro e aprovação, links e cupons, janela de *cookie*, modelo de atribuição, comissão (%, fixa, recorrente, escalonada), materiais, painel e ranking | M | 2 |
| RF-MKT-012 | Antifraude de afiliados (autocompra, abuso de cupom, *brand bidding*) e termos de afiliação 🛡️ | M | 2 |
| RF-MKT-013 | Coprodução com divisão de receita | S | 2 |
| RF-MKT-014 | UTMs persistidas e atribuição *first/last/multi-touch* por canal, campanha e criativo | M | 2 |
| RF-MKT-015 | Integração Meta CAPI, Google Ads (conversões aprimoradas) e TikTok Events API; sincronização de públicos | M | 2 |
| RF-MKT-016 | Criação assistida de campanhas e relatórios de ROAS; regras automáticas (p. ex., pausar anúncio com CPA alto) sob aprovação 🤖 | S | 3 |
| RF-MKT-017 | Gerador de criativos e copy por IA, com revisão de compliance (CDC/CONAR) 🤖🛡️ | S | 3 |
| RF-MKT-018 | Blog e páginas de conteúdo, interligação interna sugerida por IA, e otimização para busca e para respostas de IA (FAQ estruturado, `llms.txt`) 🤖 | S | 2 |
| RF-MKT-019 | Banner e gestão de consentimento de *cookies* com *Consent Mode* 🛡️ | M | 1 |
| RF-MKT-020 | Framework de experimentos A/B com significância estatística e *guardrails* | S | 2 |
| RF-MKT-021 | Contagem regressiva e escassez **apenas** quando baseadas em condição real (data/estoque verdadeiros) 🛡️ | M | 2 |
| RF-MKT-022 | Solicitação automática de avaliação após marco de progresso | S | 2 |
| RF-MKT-023 | Calendário de campanhas e lançamentos | S | 2 |
| RF-MKT-024 | Agendador de redes sociais | C | 3 |
| RF-MKT-025 | Programa de indicação integrado (ver RF-ENG-014) | M | 2 |

## 9. CRM — CRM e Vendas

| ID | Requisito | P | F |
|---|---|---|---|
| RF-CRM-001 | Contatos unificados (lead, aluno, cliente, afiliado, instrutor) com linha do tempo completa | M | 2 |
| RF-CRM-002 | Empresas/contas para B2B e vínculo de contatos | S | 3 |
| RF-CRM-003 | Campos customizados, *tags*, listas e deduplicação | M | 2 |
| RF-CRM-004 | Origem/UTM, base legal e consentimentos visíveis em cada contato 🛡️ | M | 2 |
| RF-CRM-005 | *Lead scoring*: regras + modelo preditivo explicável 🤖 | S | 2 |
| RF-CRM-006 | Estágio do ciclo de vida (lead → MQL → oportunidade → cliente → promotor) | M | 2 |
| RF-CRM-007 | Pipelines (B2C assistido, B2B, parcerias) com negociações, valores e motivos de perda | M | 2 |
| RF-CRM-008 | Tarefas, SLAs e lembretes | M | 2 |
| RF-CRM-009 | Cadências multicanal (e-mail, WhatsApp, ligação) | S | 3 |
| RF-CRM-010 | **Caixa de entrada omnichannel**: WhatsApp, Instagram DM, e-mail, chat do site, formulários | M | 2 |
| RF-CRM-011 | Roteamento (rodízio, por habilidade, por produto, por horário), filas e atribuição | S | 2 |
| RF-CRM-012 | Notas internas, macros e respostas rápidas | M | 2 |
| RF-CRM-013 | Propostas/orçamentos B2B com assinatura eletrônica e link de pagamento | S | 3 |
| RF-CRM-014 | Previsão de vendas (*forecast*) | C | 3 |
| RF-CRM-015 | Relatórios de funil e conversão por etapa/canal/vendedor | M | 2 |
| RF-CRM-016 | Registro e transcrição de ligações, com aviso e consentimento 🛡️🤖 | C | 4 |
| RF-CRM-017 | Enriquecimento de dados somente com base legal | C | 3 |
| RF-CRM-018 | "Esquecer contato" (anonimização) integrado ao DSAR 🛡️ | M | 2 |
| RF-CRM-019 | Comissionamento e metas da equipe comercial | C | 3 |

## 10. AIX — APEX Intelligence

### 10.1 Plataforma de IA

| ID | Requisito | P | F |
|---|---|---|---|
| RF-AIX-001 | **Gateway de IA** com roteamento por tarefa/custo/latência, *fallback* entre provedores e política de uso por agente | M | 1 |
| RF-AIX-002 | Orçamentos e limites por agente, tenant e usuário; alerta e bloqueio ao atingir limite | M | 1 |
| RF-AIX-003 | Registro de chamadas (prompt, resposta, custo, latência) com **redação de dados pessoais** e retenção definida 🛡️ | M | 1 |
| RF-AIX-004 | Versionamento de *prompts*/configurações de agentes com *rollback* | M | 1 |
| RF-AIX-005 | Avaliações (*evals*) offline e online com *golden sets* por agente; barreira de qualidade antes de liberar versão | M | 1 |
| RF-AIX-006 | *Guardrails*: injeção de prompt, vazamento de dados, PII, toxicidade, fora de escopo, recusa quando sem evidência | M | 1 |
| RF-AIX-007 | Transparência: identificação de que o usuário interage com IA; canal para falar com humano 🛡️ | M | 1 |
| RF-AIX-008 | Controles de privacidade: não usar dados de alunos para treinar modelos; contratos de retenção zero quando disponíveis 🛡️ | M | 1 |
| RF-AIX-009 | **RAG** sobre conteúdo (aulas, transcrições, PDFs, FAQ) com *chunking* estrutural e reindexação incremental | M | 1 |
| RF-AIX-010 | **Controle de acesso no RAG**: o aluno só recupera conteúdo dos produtos a que tem direito | M | 1 |
| RF-AIX-011 | Citações obrigatórias com link e marca de tempo da aula-fonte | M | 1 |
| RF-AIX-012 | Cache semântico e reutilização de respostas para reduzir custo | S | 2 |
| RF-AIX-013 | **Créditos de IA**: carteira, consumo, pacotes, extrato e alertas | S | 2 |
| RF-AIX-014 | Registro de agentes (inventário), classificação de risco e aprovações de mudanças | M | 2 |
| RF-AIX-015 | *Kill switch* por agente e por tenant | M | 1 |

### 10.2 Agentes — aluno e conteúdo

| ID | Requisito | P | F |
|---|---|---|---|
| RF-AIX-016 | **APEX Tutor**: modos socrático, resposta direta, revisão, quiz e plano de estudo; contexto da aula atual | M | 1 |
| RF-AIX-017 | Tutor configurável pelo instrutor (objetivos, tom, critérios, materiais de apoio, limites) | S | 2 |
| RF-AIX-018 | Tutor encaminha para humano quando não há evidência, quando há sofrimento/risco ou quando solicitado | M | 1 |
| RF-AIX-019 | Memória de aprendizagem (nível, dúvidas) **somente com consentimento** e com opção de apagar 🛡️ | S | 3 |
| RF-AIX-020 | **APEX Studio**: roteiro de curso, objetivos, módulos, roteiros de aula, slides, quizzes, e-book, legendas, capas e descrição de venda 🤖 | S | 2 |
| RF-AIX-021 | Revisão pedagógica automática (alinhamento objetivo-avaliação, carga cognitiva, taxonomia de Bloom) | S | 2 |
| RF-AIX-022 | Verificação de originalidade e direitos autorais do conteúdo gerado/enviado 🛡️ | S | 2 |
| RF-AIX-023 | Revisão humana **obrigatória** antes de publicar conteúdo gerado por IA; rotulagem interna de origem | M | 2 |
| RF-AIX-024 | **APEX Guardian** (compliance): termos proibidos, promessas de resultado, dados pessoais, direitos autorais, depoimentos e peças publicitárias 🛡️ | M | 1 |
| RF-AIX-025 | **Acessibilidade por IA**: legendas, descrição de imagens, resumos em linguagem simples | S | 2 |
| RF-AIX-026 | Recomendação e personalização de trilha | S | 3 |
| RF-AIX-027 | Previsão de risco de evasão e intervenção automatizada | S | 3 |

### 10.3 Agentes — vendas, atendimento e operação

| ID | Requisito | P | F |
|---|---|---|---|
| RF-AIX-028 | **APEX Vendas** (SDR/closer) em WhatsApp, chat e e-mail: qualificação, dúvidas comerciais, objeções, link de pagamento, agendamento e *handoff* | S | 3 |
| RF-AIX-029 | Agente de vendas usa **apenas** ofertas válidas do catálogo; não promete resultados, preços ou prazos fora da política | M | 3 |
| RF-AIX-030 | Agente de vendas respeita *opt-in*, horário, frequência e escopo do canal (atendimento comercial, não assistente geral) 🛡️ | M | 3 |
| RF-AIX-031 | **Agente de recuperação** de pagamento (carrinho, Pix, boleto, cartão) | S | 3 |
| RF-AIX-032 | **APEX Suporte**: resolve tickets com base de conhecimento e ferramentas (consultar pedido, reenviar acesso, iniciar reembolso dentro da política) | S | 3 |
| RF-AIX-033 | **Copiloto de operação**: comandos em linguagem natural (relatório, criar fluxo, ajustar cupom) com aprovação | S | 3 |
| RF-AIX-034 | **APEX Radar** (analista): perguntas em linguagem natural sobre dados, via camada semântica segura | S | 3 |
| RF-AIX-035 | Relatórios semanais automáticos escritos por IA e alertas de anomalia | S | 3 |
| RF-AIX-036 | Níveis de autonomia por agente (0 sugere · 1 executa com aprovação · 2 executa e notifica · 3 executa e audita) e *HITL* configurável | M | 3 |
| RF-AIX-037 | Simulação (*sandbox*) de agentes com dados fictícios antes de ativar | M | 3 |
| RF-AIX-038 | Auditoria completa de ações de agentes (quem, o quê, por quê, evidência) | M | 3 |
| RF-AIX-039 | Monitor regulatório (alterações de lei/norma relevantes) com resumo ao jurídico 🛡️ | C | 4 |
| RF-AIX-040 | Construtor de assistentes de instrutor (base de conhecimento própria, tom e regras) | C | 4 |
| RF-AIX-041 | Servidor MCP somente leitura para expor catálogo/progresso a assistentes externos, com *opt-in* | C | 4 |

## 11. OPS — Operações e Back-office

### 11.1 Motor de fluxos (workflow engine)

| ID | Requisito | P | F |
|---|---|---|---|
| RF-OPS-001 | Motor de fluxos com gatilhos (evento, agenda, *webhook*, manual), condições, ações (e-mail, WhatsApp, CRM, tarefa, API, **agente de IA**, esperar, ramificar) | M | 1* |
| RF-OPS-002 | Execução durável: tentativas, idempotência, retomada após falha, filas e prioridades | M | 1 |
| RF-OPS-003 | Aprovações humanas como etapa de fluxo, com fila central ("Caixa de aprovações do Admin") | M | 2 |
| RF-OPS-004 | Versionamento, simulação e *rollback* de fluxos | S | 3 |
| RF-OPS-005 | Construtor visual de fluxos | S | 3 |
| RF-OPS-006 | Biblioteca de modelos de automação (catálogo do [Doc 10](10-gestao-operacional-administracao.md) §3) | S | 3 |
| RF-OPS-007 | Logs, métricas e auditoria por execução; alertas de falha | M | 2 |
| RF-OPS-008 | Permissões por fluxo (quem cria, edita, executa, aprova) | M | 2 |

\* Na Fase 1 como motor interno (código); interface visual na Fase 3.

### 11.2 Financeiro e fiscal

| ID | Requisito | P | F |
|---|---|---|---|
| RF-OPS-009 | Emissão automática de **NFS-e (padrão nacional)** no pagamento confirmado, com cancelamento no reembolso e envio ao cliente 🛡️ | M | 1 |
| RF-OPS-010 | Regras fiscais por tipo de produto (serviço de ensino, e-book, assinatura, ingresso) definidas com o contador 🛡️ | M | 1 |
| RF-OPS-011 | Preparação para **IBS/CBS** (campos, destaque e cálculo configuráveis) 🛡️ | S | 2 |
| RF-OPS-012 | Exportação contábil (planos de contas, lançamentos, notas) | S | 2 |
| RF-OPS-013 | Gestão de inadimplência (*aging*), cobrança e acordos | S | 2 |
| RF-OPS-014 | Painel financeiro: caixa, previsão, repasses pendentes, reservas, indicadores | S | 2 |
| RF-OPS-015 | Retenções e informes de rendimento a instrutores/afiliados quando aplicável 🛡️ | S | 3 |

### 11.3 Suporte e sucesso do aluno

| ID | Requisito | P | F |
|---|---|---|---|
| RF-OPS-016 | Helpdesk com tickets de todos os canais, categorias, prioridades e SLAs | M | 2 |
| RF-OPS-017 | Central de ajuda (autoatendimento) e base de conhecimento viva, com sugestão de artigos por IA a partir de tickets 🤖 | M | 2 |
| RF-OPS-018 | Macros, filas, escalonamento e CSAT | M | 2 |
| RF-OPS-019 | Régua de sucesso do aluno (onboarding, inatividade, risco de evasão) | S | 3 |
| RF-OPS-020 | Painel de insights de produto a partir dos tickets | S | 3 |
| RF-OPS-021 | Página de status de incidentes | S | 2 |

### 11.4 Secretaria acadêmica e instrutores

| ID | Requisito | P | F |
|---|---|---|---|
| RF-OPS-022 | Ficha acadêmica do aluno e histórico de cursos/certificados | M | 1 |
| RF-OPS-023 | Declarações (matrícula, conclusão), segunda via e validação de certificados | M | 2 |
| RF-OPS-024 | Solicitações do aluno (cancelamento, transferência, correção de dados) com prazos | M | 2 |
| RF-OPS-025 | Onboarding de instrutor: KYC/KYB, contrato eletrônico, dados bancários, termos de cessão de direitos 🛡️ | M | 2 |
| RF-OPS-026 | Painel do instrutor: vendas, repasses, avaliações, alunos, dúvidas | M | 2 |
| RF-OPS-027 | Pipeline de produção de conteúdo (briefing → roteiro → gravação → edição → legenda → revisão → compliance → publicação) com checklists | S | 2 |
| RF-OPS-028 | Aprovação de conteúdo e histórico de revisões | M | 2 |

### 11.5 Compliance, administração e monitoramento

| ID | Requisito | P | F |
|---|---|---|---|
| RF-OPS-029 | **DSAR** automatizado: verificação de identidade, coleta, entrega, exclusão/anonimização com exceções legais, prazo e prova 🛡️ | M | 1 |
| RF-OPS-030 | Registro das operações de tratamento (ROPA) e inventário de dados 🛡️ | M | 2 |
| RF-OPS-031 | Gestão de incidentes de segurança com playbook, linha do tempo e comunicação a ANPD/titulares quando aplicável 🛡️ | M | 2 |
| RF-OPS-032 | Retenção e descarte por categoria de dado; guarda de registros de acesso a aplicações pelo prazo legal (6 meses) 🛡️ | M | 1 |
| RF-OPS-033 | Revisão periódica de acessos (recertificação) | S | 3 |
| RF-OPS-034 | Gestão de operadores/fornecedores (DPA, localização de dados, transferência internacional) 🛡️ | M | 2 |
| RF-OPS-035 | Configurações globais, modelos de mensagens, feature flags e calendário operacional | M | 1 |
| RF-OPS-036 | Monitoramento operacional: taxa de aprovação de pagamentos, entregabilidade, filas, custo de IA, uso de vídeo/ao vivo | M | 2 |
| RF-OPS-037 | Auditoria amostral de atendimentos por IA | S | 3 |
| RF-OPS-038 | Contratos e renovações B2B com lembretes | C | 3 |
| RF-OPS-039 | Portal do operador em dispositivo móvel (aprovações e alertas) | C | 4 |

## 12. DAT — Dados e Analytics

| ID | Requisito | P | F |
|---|---|---|---|
| RF-DAT-001 | Esquema único de eventos de produto (nomenclatura, propriedades, versão) com coleta *first-party* respeitando consentimento 🛡️ | M | 1 |
| RF-DAT-002 | Armazém de dados e camada de métricas padronizadas (uma definição por métrica) | M | 2 |
| RF-DAT-003 | Painéis por perfil: executivo, comercial, marketing, pedagógico, financeiro, suporte, IA | M | 2 |
| RF-DAT-004 | Funil, coorte e retenção; LTV, CAC e payback | M | 2 |
| RF-DAT-005 | Atribuição de receita por canal/campanha/afiliado | M | 2 |
| RF-DAT-006 | Previsão de receita e de evasão | S | 3 |
| RF-DAT-007 | Alertas de anomalia (queda de conversão, pico de reembolso, falha de entrega) | S | 2 |
| RF-DAT-008 | Relatórios agendados (PDF/e-mail) e exportações | S | 2 |
| RF-DAT-009 | Qualidade de dados: contratos, testes e linhagem | S | 3 |
| RF-DAT-010 | Pseudonimização/mascaramento por papel de acesso 🛡️ | M | 2 |
| RF-DAT-011 | BI autoatendido com perguntas em linguagem natural 🤖 | C | 3 |
| RF-DAT-012 | *Benchmarks* internos entre cursos, instrutores e turmas | C | 3 |

## 13. PLT — Plataforma e Integrações

| ID | Requisito | P | F |
|---|---|---|---|
| RF-PLT-001 | Multi-tenancy: organizações isoladas por identificador e políticas de linha (RLS) desde a Fase 1, mesmo operando um único tenant | M | 1 |
| RF-PLT-002 | API REST versionada, documentada em OpenAPI, com autenticação OAuth2/chaves e escopos | S | 3 |
| RF-PLT-003 | *Webhooks* de saída: assinatura HMAC, *retries* com recuo exponencial, repetição manual e painel de entregas | M | 2 |
| RF-PLT-004 | Catálogo de eventos de domínio estável (ver [Doc 13](13-api-e-eventos.md)) | M | 1 |
| RF-PLT-005 | Limites de taxa e cotas por chave/tenant | M | 3 |
| RF-PLT-006 | Conectores Zapier/Make | C | 3 |
| RF-PLT-007 | **Importadores** de alunos e conteúdo de outras plataformas (Hotmart, Kiwify, Eduzz, MemberKit etc.) | S | 2 |
| RF-PLT-008 | Exportação de dados do instrutor (portabilidade) | S | 2 |
| RF-PLT-009 | Domínios personalizados e *white-label* (tema, logo, e-mails) | C | 4 |
| RF-PLT-010 | Billing da plataforma (planos SaaS, medição de uso) | C | 4 |
| RF-PLT-011 | *Feature flags* e configuração por tenant | M | 1 |
| RF-PLT-012 | Observabilidade: logs estruturados, métricas, rastreamento distribuído | M | 1 |
| RF-PLT-013 | Backups automáticos, restauração testada e recuperação de desastre | M | 1 |
| RF-PLT-014 | Migrações de banco sem indisponibilidade | M | 1 |
| RF-PLT-015 | i18n/L10n (pt-BR padrão; estrutura para outros idiomas) | S | 2 |
| RF-PLT-016 | PWA instalável com notificações *push* | S | 2 |
| RF-PLT-017 | Aplicativos nativos iOS/Android | C | 3 |
| RF-PLT-018 | Marketplace de integrações | C | 4 |

---

## 14. Critérios de aceite dos fluxos críticos (Gherkin)

```gherkin
Funcionalidade: Compra com Pix libera o acesso automaticamente   # RF-PAY-003, 014, 015, 016, RF-OPS-009
  Cenário: Pix confirmado
    Dado um visitante no checkout do curso "X" com oferta válida
    Quando ele paga o Pix e o PSP envia o webhook de confirmação
    Então o pedido muda para "pago" e depois "entregue" em até 30 segundos
    E a matrícula é criada e o e-mail/WhatsApp de acesso é enviado
    E a NFS-e é emitida e anexada ao pedido
    E o ledger registra receita, taxa do PSP e repasse pendente

  Cenário: Webhook duplicado
    Dado um pedido já pago
    Quando o PSP reenvia o mesmo webhook
    Então nenhuma segunda matrícula, nota ou lançamento é criado

Funcionalidade: Reembolso de 7 dias (arrependimento)   # RF-PAY-010, 022, RF-LMS-025
  Cenário: Pedido dentro do prazo, mesmo com aulas assistidas
    Dado um pedido pago há 5 dias com 30% de progresso
    Quando o aluno solicita o reembolso pelo painel
    Então o reembolso integral é aprovado automaticamente
    E o estorno é solicitado ao PSP, o acesso é revogado e a NFS-e é cancelada
    E o repasse do instrutor e a comissão do afiliado são estornados no ledger

Funcionalidade: Guardião de Compliance bloqueia termos proibidos   # RF-CAT-021
  Cenário: Título com "MBA"
    Dado um curso livre em rascunho com o título "MBA em Gestão"
    Quando o instrutor solicita a publicação
    Então a publicação é bloqueada com a explicação e sugestões de alternativa
    E o evento é registrado na auditoria

Funcionalidade: Tutor responde apenas com evidência   # RF-AIX-009, 010, 011, 018
  Cenário: Pergunta fora do conteúdo
    Dado um aluno matriculado no curso "X"
    Quando ele pergunta algo que não consta em nenhuma aula acessível a ele
    Então o tutor informa que não encontrou no curso, não inventa e oferece falar com um humano

  Cenário: Conteúdo de curso não comprado
    Dado um aluno sem matrícula no curso "Y"
    Quando ele pergunta sobre um tema exclusivo de "Y"
    Então nenhum trecho de "Y" é recuperado ou citado

Funcionalidade: Agente de vendas respeita a política   # RF-AIX-028…030
  Cenário: Pedido de promessa de resultado
    Dado um lead no WhatsApp perguntando "vou ganhar X reais com esse curso?"
    Quando o agente responde
    Então ele não promete resultado financeiro
    E descreve o que o curso entrega, com base na página do produto

  Cenário: Lead sem opt-in
    Dado um contato sem consentimento para WhatsApp de marketing
    Quando uma automação tenta enviar uma mensagem promocional
    Então o envio é bloqueado e registrado

Funcionalidade: Certificado verificável   # RF-LMS-013, 015, 016
  Cenário: Conclusão e validação pública
    Dado um aluno com progresso 100% e nota ≥ nota mínima
    Quando o sistema emite o certificado
    Então o certificado traz código único e QR
    E a página pública de verificação mostra "válido" com nome, curso, carga horária e data
    Quando o certificado é revogado
    Então a página passa a mostrar "revogado"

Funcionalidade: Atendimento ao titular (LGPD)   # RF-IAM-019, RF-OPS-029
  Cenário: Solicitação de exclusão
    Dado um titular autenticado
    Quando ele solicita a exclusão dos seus dados
    Então um DSAR é aberto com prazo e responsável
    E os dados sem obrigação legal de guarda são excluídos/anonimizados
    E os dados com guarda obrigatória (fiscal, logs) são retidos com justificativa registrada

Funcionalidade: Cancelamento de assinatura   # RF-PAY-033
  Cenário: Cancelar em até 2 cliques
    Dado um assinante no painel
    Quando ele escolhe "Cancelar assinatura" e confirma
    Então a assinatura é encerrada ao fim do ciclo pago e não há nova cobrança
    E um e-mail de confirmação é enviado

Funcionalidade: Presença em webinar   # RF-LIV-012, 013
  Cenário: Certificado de participação
    Dado um inscrito que permaneceu 75% ou mais da duração
    Quando o evento termina
    Então o certificado de participação é emitido automaticamente

Funcionalidade: Chargeback   # RF-PAY-023
  Cenário: Contestação recebida
    Dado uma contestação aberta no PSP
    Quando o sistema recebe o aviso
    Então um pacote de evidências (aceite de termos, logs de acesso, entrega) é montado
    E um responsável é notificado antes do prazo do PSP
```

## 15. Contagem por módulo

> Gerada por script a partir das tabelas deste arquivo (`scripts/count_rf.py`); IDs sem duplicidade nem lacunas.

<!-- COUNTS:START -->
| Módulo | Total | Must | Should | Could | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| IAM | 22 | 12 | 8 | 2 | 14 | 4 | 3 | 1 |
| CAT | 25 | 14 | 10 | 1 | 16 | 8 | 0 | 1 |
| LMS | 40 | 23 | 11 | 6 | 17 | 14 | 7 | 2 |
| MED | 20 | 9 | 9 | 2 | 11 | 5 | 3 | 1 |
| LIV | 30 | 18 | 10 | 2 | 0 | 22 | 7 | 1 |
| ENG | 20 | 9 | 7 | 4 | 1 | 14 | 4 | 1 |
| PAY | 46 | 20 | 20 | 6 | 18 | 21 | 5 | 2 |
| MKT | 25 | 14 | 9 | 2 | 2 | 19 | 4 | 0 |
| CRM | 19 | 10 | 5 | 4 | 0 | 12 | 6 | 1 |
| AIX | 41 | 22 | 16 | 3 | 15 | 9 | 14 | 3 |
| OPS | 39 | 23 | 14 | 2 | 8 | 21 | 9 | 1 |
| DAT | 12 | 6 | 4 | 2 | 1 | 7 | 4 | 0 |
| PLT | 18 | 8 | 5 | 5 | 6 | 5 | 4 | 3 |
| **Total** | **357** | **188** | **128** | **41** | **109** | **161** | **70** | **17** |
<!-- COUNTS:END -->

> **Leitura:** a Fase 1 tem 109 requisitos (dos quais a maioria *Must*), concentrados em IAM, CAT, LMS, MED, PAY, OPS (fiscal/compliance) e no núcleo de IA. O ao vivo (LIV), marketing (MKT) e CRM entram na Fase 2 — o MVP **vende e entrega** antes de **crescer e automatizar**.
