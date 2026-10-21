# 01 — Pesquisa e Benchmark de Plataformas

> **APEX Plataforma de Cursos Livres** · Documento 01 · v1.0 · 21/10/2026 · Status: **Rascunho para validação**

## 0. Como ler este documento

Este benchmark responde à pergunta: *"que plataformas, brasileiras e globais, têm mais recursos — especialmente IA, gestão operacional automatizada e marketing/vendas — e o que a APEX deve copiar, superar ou evitar?"*

**Regras de honestidade adotadas** (aplicam-se a todos os documentos da pasta):

1. Toda afirmação sobre terceiros traz o **nível de evidência**: 🟢 fonte oficial do fornecedor · 🟡 imprensa/review independente · 🔴 blog de concorrente ou afiliado (indício, não prova).
2. Preços e taxas mudam com frequência; os valores abaixo são **fotografias de pesquisa (out/2026)** e devem ser reconfirmados nas páginas oficiais antes de qualquer decisão.
3. **O site de referência `juntosnaescola.com.br` não pôde ser acessado** nesta sessão (rede bloqueada; ver [Doc 02](02-juntos-na-escola-levantamento.md)). Nada neste benchmark descreve esse site. Onde o texto fala em "plataforma de referência", leia-se *"o conjunto de funcionalidades típicas de LMS/EAD de cursos livres observado nas plataformas abaixo"*.
4. Funcionalidades marcadas **"não verificado"** não foram confirmadas pela pesquisa — não significa que não existam.

---

## 1. Panorama do mercado

| Segmento | Exemplos analisados | Foco | Lição para a APEX |
|---|---|---|---|
| **Marketplaces de infoprodutos (BR)** | Hotmart, Kiwify, Eduzz, Cakto, Greenn | Venda + checkout + afiliados + área de membros acoplada | O comércio é o centro do negócio; a entrega é complemento. APEX deve ter **comércio e aprendizagem no mesmo núcleo**. |
| **Áreas de membros / LMS white-label (BR)** | MemberKit, Curseduca, Cademi | Entrega de conteúdo com marca própria, trilhas, certificado | Diferenciam-se por marca própria e trilhas; pouco em automação comercial/IA. |
| **Plataformas "tudo-em-um" para criadores (global)** | Kajabi, LearnWorlds, Teachable/Thinkific (não detalhados), Systeme.io, Kartra, ClickFunnels | Curso + funil + e-mail + automação | Referência de **automação de marketing integrada ao curso**. |
| **Comunidades com cursos** | Skool, Circle, Mighty Networks | Engajamento, gamificação, eventos | Referência de **gamificação e retenção**. |
| **LMS corporativo com IA** | Docebo | IA agêntica para admin, aluno e skills | Referência de **IA para operação/administração**. |
| **Plataformas educacionais com tutor IA** | Coursera (Coach), Khan Academy (Khanmigo) | Tutoria socrática | Referência pedagógica de **tutor IA**. |
| **Iniciativas gratuitas/institucionais (BR)** | Escola Virtual (Fundação Bradesco), Brasil EAD | Cursos livres gratuitos com certificado | Referência de **regras de certificação** (nota mínima 70%) e SEO de cursos livres. |
| **LMS open source** | Moodle, Open edX, Canvas (núcleo AGPL) | Instituições; personalização por código | Alternativa de *build vs. buy* (ver [Doc 11](11-arquitetura-tecnica.md), ADR-003). |

---

## 2. Perfis das plataformas

### 2.1 Hotmart (Brasil) — referência em comércio + IA para criadores

| Item | Achado | Evidência |
|---|---|---|
| Área de membros (**Hotmart Club**) | "Mais de 20 ferramentas" de personalização; entrega automatizada de videoaulas e materiais; player em computador, tablet, TV e celular, inclusive offline | 🟢 hotmart.com/pt-br/club |
| Comunidade/interação | Espaço de socialização e dúvidas; acompanhamento de desempenho de alunos | 🟢 |
| Monetização dentro da área de membros | Anúncios entre conteúdos e módulos extras pagos para quem já comprou (upsell interno) | 🟢 |
| IA — aluno | Sugestões inteligentes de módulos/conteúdos; **Hotmart Tutor** (assistente de IA, nova versão anunciada em 2024) | 🟢/🟡 |
| IA — criador (2025) | Agentes de IA atuando como equipe do criador: vendas, **recuperação de pagamento**, criação de produtos; criadores podem **vender seus próprios agentes de IA** | 🟡 |
| IA — 2026 | **Launchpad**: cria apps, áreas de membros, simuladores, quizzes, calculadoras, sites e páginas de venda por texto/áudio, com pagamentos integrados ("produto que cria produtos") | 🟡 Canaltech |
| Tração de IA | Vendas brutas de produtos digitais de IA somaram R$ 200 mi (ago/2025–jul/2026), +354% vs. dois anos anteriores | 🟡 (dado de imprensa sobre o evento) |
| Recursos citados em review independente | Certificado automático, comentários por aula, app mobile com download offline | 🟡 (confirmar na documentação oficial) |
| Taxa de venda | 9,9% + valor fixo (R$ 2,49 ou R$ 1,00 — fontes divergem) | 🔴/🟡 |

**Lição APEX:** o mercado já trata **IA como equipe** (vendas, recuperação, criação) — não como "chatbot". A APEX deve nascer com agentes em todas as etapas e permitir que instrutores criem os seus.

### 2.2 Kiwify, Eduzz, Cakto, Greenn (Brasil) — referência em taxas e checkout

| Plataforma | Taxa padrão cartão | Observações | Evidência |
|---|---|---|---|
| Kiwify | 8,99% + R$ 2,49 | consistente em várias fontes | 🔴 |
| Eduzz | 4,9% + R$ 2,49 (venda direta); 8,9% + R$ 2,49 (via afiliado) | fontes divergem sobre competitividade p/ público internacional | 🔴 |
| Cakto | 4,99% + R$ 2,49; **Pix 0% + R$ 2,49** | | 🔴 |
| Greenn | 4,99% + R$ 1,00 (low ticket) | | 🔴 |
| Hotmart | 9,9% + fixo | | 🔴/🟡 |

> As fontes (comparativos de afiliados) **não incluem** impostos, parcelamento, antecipação, saque e comissão de afiliado. **Não foram encontradas** informações confiáveis sobre recuperação de carrinho, order bump e regras de afiliados por plataforma → ficam como **funcionalidades de mercado conhecidas, a benchmarkar por demonstração/conta de teste** (ação do Doc 19, item B-04).

**Lição APEX:** o "preço" do concorrente é uma **taxa sobre a venda** de 5% a 10% mais fixo. Se a APEX operar o próprio catálogo (Fase 1), a taxa que importa é a do PSP (custo, não receita). Se virar marketplace (Fase 4), a *take rate* deve ser posicionada em relação a essa faixa (ver [Doc 17](17-negocio-financeiro.md)).

### 2.3 Curseduca, MemberKit, Cademi (Brasil) — white-label

| Plataforma | Achado | Evidência |
|---|---|---|
| Curseduca | Foco em infoprodutores; personalização de marca; trilhas sequenciais; dashboard de desempenho; certificados digitais personalizados; integrações | 🔴 (b2bstack) |
| Curseduca — alerta | Página de terceiro afirma que certificados são "reconhecidos pelo MEC". **Para cursos livres isso é alegação de risco** (ver [Doc 16](16-juridico-compliance.md) §3) — a APEX **não deve reproduzir** esse tipo de claim | 🔴 |
| MemberKit | Área de membros white-label para cursos, e-books, mentorias | 🔴 |
| Cademi | Trilhas de aprendizagem personalizadas para treinamento corporativo | 🔴 |
| Sparkle | Nenhum resultado relevante encontrado | — |

### 2.4 Kajabi (global) — referência em IA + automação para criadores

| Item | Achado | Evidência |
|---|---|---|
| IA de criação | "Cofounder"/MCP: planeja produtos, redige conteúdo, páginas e e-mails; outlines de curso; e-mails de venda | 🔴 (reviews) |
| IA de atendimento | **Expert Agents** que respondem compradores/alunos nas páginas do criador; chatbot AMA | 🔴 |
| IA de mídia | Transcrição, tradução, **dublagem em 100+ idiomas**, resumos de sessões, Creator Studio (reaproveitamento de vídeo) | 🔴 |
| Automação | Construtor visual de automações com ramificação e templates; **afiliados, automações avançadas e coortes ficam em planos superiores** | 🔴 |
| Limitações apontadas | A IA não monta funis/automações completos nem imagens | 🔴 |
| Preço | Fontes divergem (US$ 71 anual / US$ 89 / US$ 179) — **não usar** | 🔴 |
| "Kajabi Genie" | Nome **não confirmado** por nenhuma fonte | — |

**Lição APEX:** o *gap* de Kajabi é "IA que não conclui o funil". A APEX deve ter agentes que **executam** (criam a automação, publicam a página, enviam a mensagem) com aprovação humana configurável, não apenas sugerem texto.

### 2.5 LearnWorlds (global) — referência em IA pedagógica

| Item | Achado | Evidência |
|---|---|---|
| IA de criação | **AI Course Creator/Planner**: outlines, avaliações, e-books; **AI Assessment Designer**; **AI Feedback Generator**; **AI Analytics Q&A**; IA em vídeo interativo | 🟢 learnworlds.com |
| Assistente | AI Assistant em todos os planos; tradução e legendas por IA e vídeo interativo em planos superiores | 🔴/🟡 |
| Aulas ao vivo | **Sem recurso nativo de classe ao vivo evidente** na pesquisa (há webinars de marketing do próprio fornecedor) | 🟡 |

### 2.6 Docebo (global) — referência em IA para administração e operação

| Item | Achado | Evidência |
|---|---|---|
| **Harmony Copilot** (admin) | Sugere próximos passos conforme a página em que o admin está; menu de agentes especializados (Search, Workflow Guidance, Customer Support) | 🟢 docebo.com/whatsnew |
| **Conversational Insights** | Agente de analytics: perguntas em linguagem natural sobre matrículas e conclusões | 🟢 |
| **Harmony Search / Tutor** (aluno) | Respostas a partir de catálogos públicos e do conteúdo do curso | 🟢 |
| **MCP + Companion** | Leva o conteúdo de treinamento aos assistentes de IA que a pessoa já usa; Companion no navegador | 🟢 |
| Skills | Agentes que detectam lacunas de competência e empurram aprendizagem "sem intervenção humana" (declaração de gestão, **não** lista de recursos entregues) | 🟡 |
| Monetização da IA | **Sistema de créditos de IA** (AI Credits) para cobrança de coaching virtual | 🟢 |

**Lição APEX:** (1) agentes **por contexto de tela** para o admin; (2) analytics conversacional; (3) **créditos de IA** como mecanismo de controle de custo e de monetização; (4) expor o conteúdo via **MCP/API** a assistentes externos.

### 2.7 Tutores de IA: Coursera Coach e Khanmigo

| Item | Achado | Evidência |
|---|---|---|
| Coursera Coach | Instrutor configura atividade com **objetivos de aprendizagem, estilo de ensino, critérios de avaliação e arquivos de contexto**; diálogo socrático por texto; Gemini como primeiro LLM (anúncio sem data — verificar o que foi entregue) | 🟢 blog.coursera.org |
| Khanmigo | Método **socrático**: não entrega a resposta, pergunta "qual seria o próximo passo?". Limitações reconhecidas: matemática difícil, alucinações, vieses | 🟡/🔴 |

**Lição APEX:** o Tutor deve ser **configurável pelo instrutor** (objetivos, tom, critérios, base de conhecimento) e operar em **modo socrático por padrão** com opção de "resposta direta" — e **sempre citando a aula-fonte**, com política explícita contra alucinação (ver [Doc 08](08-ia-arquitetura-e-agentes.md)).

### 2.8 Comunidades: Skool, Circle, Mighty Networks

| Item | Skool | Circle | Mighty Networks | Evidência |
|---|---|---|---|---|
| Gamificação (pontos, níveis, ranking) | **Núcleo do produto**; conteúdo liberado por nível | Adicionado recentemente (pontos, níveis, ranking) | Sem equivalente claro | 🔴 |
| Cursos | Básicos (sem quizzes/drip) | Limitados | **Mais fortes** (drip, quizzes, gating) | 🔴 |
| Eventos | Calendário com lembretes e recorrência | Eventos ao vivo + Zoom | Eventos nativos | 🔴 |
| Modelo de preço | Plano único (≈ US$ 99/mês, sem taxa de transação, segundo fontes) | a partir de ≈ US$ 199/mês | ≈ US$ 99–119/mês + 2% | 🔴 |

**Lição APEX:** gamificação ligada a **liberação de conteúdo** é um mecanismo de retenção comprovado no segmento. No Brasil, para menores de 18, precisa passar pelo crivo do ECA Digital (design persuasivo) — ver Doc 16 §5.

### 2.9 Funis e marketing "tudo-em-um": Systeme.io, Kartra, ClickFunnels

| Plataforma | Posicionamento | Evidência |
|---|---|---|
| Systeme.io | Orçamento baixo; funis + e-mail + membership + automação; plano gratuito; ≈ US$ 17/mês | 🔴 |
| Kartra | Suíte ampla: construtor, e-mail, **helpdesk/ticket**, **gestão de afiliados**; US$ 59–99/mês | 🔴 |
| ClickFunnels | Especialista em funis e testes; fraco em e-mail/curso embutidos; US$ 97–127/mês | 🔴 |

**Lição APEX:** a combinação *funil + e-mail + afiliados + helpdesk* é o padrão do "tudo-em-um". A APEX deve entregar isso **nativamente integrado ao LMS** (dado único do aluno) — a vantagem competitiva é o dado compartilhado, não a feature isolada.

### 2.10 Infraestrutura (vídeo, ao vivo, LMS open source, credenciais)

| Tema | Achados | Evidência |
|---|---|---|
| **Vídeo com proteção** | **Bunny Stream** (URLs assinadas, restrição de domínio/geo, bloqueio de download; DRM "MediaCage" — fontes divergem se incluso ou add-on) · **Mux** (multi-DRM com preço público) · **Cloudflare Stream** (tokens assinados; **sem multi-DRM nativo listado**) · **Vimeo** (DRM só no Enterprise). URL assinada isolada pode ser compartilhada → combinar com **restrição de domínio + marca d'água por espectador** | 🔴 |
| **Ao vivo (WebRTC)** | LiveKit, Daily, 100ms, Zoom Video SDK: todos com camada gratuita de ≈ 10 mil min/mês (guia do TRTC). Daily: ≈ US$ 0,004/min-participante após a franquia; LiveKit tende a ficar até ~10× mais barato em 200–500 mil min/mês (fonte comercial, usar como indício). Zoom: sem *interactive live streaming* nativo segundo concorrente | 🔴 |
| **LMS open source** | Moodle (maior base instalada; ≈ 400 mi de usuários, 150 mil sites — comparativo de concorrente); Open edX (escala MOOC, xBlocks, operação pesada); Canvas (núcleo AGPLv3 + SaaS comercial). **Todos difíceis de operar e de personalizar para comércio** | 🔴 |
| **Credenciais** | **Open Badges 3.0** assenta no modelo W3C *Verifiable Credentials* (a prova está na assinatura); **CLR 2.0** agrega várias conquistas (histórico). QR Code só aponta para o verificador — **a autenticidade vem da assinatura**. OB 2.0 segue o mais usado → suportar ambos | 🟡/🔴 |
| **Frappe LMS** | Não coberto pela pesquisa | — |

### 2.11 Iniciativas gratuitas/institucionais (BR) — regras de certificação

| Plataforma | Prática observada | Evidência |
|---|---|---|
| Escola Virtual (Fundação Bradesco) | Certificado de conclusão exige **≥ 70%** na avaliação final; cursos sem prova geram **certificado de participação**; certificado **digital**, com **validade de 2 anos** | 🟢 ev.org.br |
| Brasil EAD | Nota ≥ 70% e outros critérios de conclusão | 🟡 |
| Escola Unidas (EJA online) | Alega registro do certificado no MEC via GDAE/SISTEC — **trata-se de ensino regulado, não curso livre** | 🟡 |

**Lição APEX:** distinguir **"Certificado de Conclusão"** (nota mínima + frequência) de **"Certificado de Participação"** (presença), como a prática de mercado; e **nunca** sugerir equivalência com ensino regulado.

---

## 3. Mapa de capacidades: o que adotar

| # | Capacidade | Referências | Decisão APEX | Fase |
|---|---|---|---|---|
| C-01 | Área de membros multi-dispositivo + offline | Hotmart Club | Adotar (PWA com download offline controlado) | 1–2 |
| C-02 | Vendas de upsell dentro da área de membros | Hotmart | Adotar ("Próximo passo" nativo) | 2 |
| C-03 | Tutor de IA socrático, configurável | Coursera Coach, Khanmigo, Hotmart Tutor, Docebo | **Adotar e superar** (RAG com citação, config do instrutor, métricas) | 1 |
| C-04 | IA de criação de curso/avaliação/e-book | LearnWorlds, Kajabi | **Adotar e superar** (alinhado a frameworks instrucionais, com *gate* de compliance) | 2 |
| C-05 | Agentes de venda e recuperação de pagamento | Hotmart (2025) | **Adotar e superar** (WhatsApp/chat/e-mail, HITL) | 3 |
| C-06 | IA para o administrador (copiloto por tela) | Docebo Harmony | **Adotar** | 3 |
| C-07 | Analytics em linguagem natural | Docebo, LearnWorlds | Adotar | 3 |
| C-08 | Créditos de IA | Docebo | Adotar (controle de custo + monetização) | 2 |
| C-09 | Gamificação ligada a liberação de conteúdo | Skool, Circle | Adotar (com regras p/ menores) | 2 |
| C-10 | Construtor de automação visual com ramificação | Kajabi, Systeme.io | Adotar e unificar com *workflow engine* operacional | 2–3 |
| C-11 | Afiliados nativos e co-produção | Hotmart, Eduzz, Kartra | Adotar | 2 |
| C-12 | Helpdesk integrado | Kartra | Adotar com IA de resolução | 2 |
| C-13 | Webinar/aula ao vivo nativos | (gap em LearnWorlds) Circle/Zoom | **Diferencial**: ao vivo nativo + evergreen | 2 |
| C-14 | Dublagem/tradução/legendas por IA | Kajabi, LearnWorlds | Adotar (legendas na Fase 1 por acessibilidade) | 1–3 |
| C-15 | Vídeo com DRM/marca d'água | Mux, Bunny | Adotar (adapter de provedor) | 1 |
| C-16 | Credenciais verificáveis (Open Badges 3.0) | Padrão W3C | Adotar | 2 |
| C-17 | Pix, boleto, cartão, **Pix Automático** | Mercado BR | Adotar (nativo BR) | 1–2 |
| C-18 | Conteúdo exposto via MCP/API a assistentes externos | Docebo, Kajabi | Adotar (API pública na Fase 4; MCP read-only antes) | 3–4 |
| C-19 | Marketplace de agentes de IA de criadores | Hotmart (2025) | Avaliar | 4 |

---

## 4. Lacunas do mercado → oportunidade APEX

Nenhuma plataforma analisada, **com base nas evidências coletadas**, reúne todos os cinco pilares abaixo:

1. **Comércio + aprendizagem + CRM no mesmo dado** (hoje: marketplace de um lado, área de membros do outro, CRM de terceiros).
2. **IA que executa, com governança** (aprovação humana configurável, trilha de auditoria, orçamento de custo por agente).
3. **Operação administrativa automatizada** (financeiro, fiscal, suporte, secretaria acadêmica, LGPD) — Docebo tem IA para admin, mas é LMS corporativo e não resolve comércio/NFS-e/Pix.
4. **Compliance Brasil nativo** (CDC art. 49, LGPD, ECA Digital, NFS-e nacional, Pix Automático, regras de nomenclatura para cursos livres).
5. **Todos os formatos de produto educacional** (curso, e-book, webinar, workshop, mentoria, assinatura, trilha, evento) sob um catálogo e um checkout.

> **Posicionamento resultante:** *"A plataforma de cursos livres que ensina, vende e opera sozinha — com IA em cada etapa e feita para o Brasil."*

---

## 5. Limitações desta pesquisa

- A pesquisa foi feita por **busca web com resumos**; páginas oficiais de preço/recursos não foram lidas integralmente (o fetch direto de domínios arbitrários é restrito neste ambiente).
- Muitas fontes são **reviews de afiliados ou comparativos de concorrentes** (🔴). Servem como indício; **não** como base para promessas comerciais.
- Não foi possível obter dados de **tamanho de mercado de cursos livres/infoprodutos**; o Censo EAD.BR da ABED existe e deve ser baixado integralmente (ação B-05, Doc 19). Dado antigo (Censo 2014): 79% da oferta de cursos EAD era de cursos livres — **ilustrativo apenas**.
- Itens a **benchmarkar por conta de teste** antes do detalhamento final: checkout/recuperação/order bump da Hotmart e Kiwify; afiliados (cookie, comissão, split); app mobile; certificados; relatórios.
- **O site `juntosnaescola.com.br` não foi analisado.** Ver Doc 02.

---

## 6. Fontes

**Plataformas brasileiras**
- Hotmart Club (oficial): <https://www.hotmart.com/pt-br/club> · <https://hotmart.com/pt-br/blog/hotmart-club-solucao-completa> · <https://hotmart.com/pt-br/blog/novidades-hotmart-club>
- Review Hotmart 2026 (terceiro): <https://guiaferramentasdigitais.com.br/guias/hotmart-review-brasil/>
- Hotmart Fire 2026 / Launchpad (imprensa): <https://canaltech.com.br/mercado/hotmart-fire-2026-com-launchpad-plataforma-aposta-em-ia-que-cria-aplicativos-e-vira-equipe-do-empreendedor>
- Comparativos de taxas: <https://viniensina.com.br/?p=4267> · <https://herospark.com/guias/taxas-e-margem>
- Curseduca: <https://www.b2bstack.com.br/product/curseduca>
- Escola Virtual Fundação Bradesco: <https://www.ev.org.br/> · Brasil EAD: <https://brasilead.com/>

**Plataformas globais**
- Kajabi (reviews): <https://www.learningrevolution.net/kajabi-ai/> · <https://www.heightsplatform.com/blog/does-kajabi-have-ai-features-how-to-create-online-courses-with-ai>
- LearnWorlds AI (oficial): <https://www.learnworlds.com/?p=38933>
- Docebo (oficial): <https://www.docebo.com/whatsnew/2026-april/>
- Coursera Coach (oficial): <https://blog.coursera.org/announcing-ai-powered-capabilities-enabling-educators-to-use-coursera-coach-to-deliver-interactive-personalized-instruction>
- Khanmigo: <https://marylandersonline.umd.edu/resources/ai-tutors-and-study-aids-khanmigo>
- Skool/Circle/Mighty: <https://www.schoolmaker.com/blog/mighty-networks-vs-skool> · <https://www.ruzuku.com/learn/articles/skool-vs-circle>
- Systeme.io/Kartra/ClickFunnels: <https://learnybox.com/blog/systemeio-alternatives/> · <https://schoolmaker.com/blog/kartra-alternatives>

**Infraestrutura e padrões**
- Hospedagem de vídeo/DRM: <https://kinescope.com/blog/best-video-hosting-online-courses> · <https://daveswift.com/bunnystream/>
- SDKs de vídeo ao vivo: <https://trtc.io/blog/details/video-sdk-pricing-comparison-2026> · <https://www.forasoft.com/blog/article/daily-co-alternative>
- LMS open source: <https://fulcrum.rocks/blog/how-to-choose-lms-between-moodle-canvas-openedx> · <https://openeducat.org/comparisons/open-source-lms-comparison/>
- Open Badges 3.0: <https://www.pok.tech/en/digital-credentials/open-badge-3-0> · <https://www.forasoft.com/learn/elearning-video/articles-elearning/certificates-badges-verifiable-credentials>
- Censo EAD.BR (ABED): <https://www.abed.org.br/_libs/dwns/26076.pdf>

**Fontes jurídicas e regulatórias** estão listadas no [Doc 16](16-juridico-compliance.md) §10.
