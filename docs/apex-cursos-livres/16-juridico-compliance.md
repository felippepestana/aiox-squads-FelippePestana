# 16 — Jurídico e Compliance

> **APEX Plataforma de Cursos Livres** · Documento 16 · v1.0 · 21/10/2026 · Status: **Rascunho técnico-jurídico para revisão de advogado, contador e DPO**
> **Este documento não é parecer jurídico.** Organiza obrigações, riscos e decisões para o produto. Toda conclusão deve ser **confirmada no texto vigente das normas** por profissional habilitado antes de ser aplicada.

## 0. Como ler: níveis de verificação

| Marca | Significado |
|---|---|
| ✅ **Fonte consultada** | Confirmado em ao menos uma fonte lida nesta pesquisa (cada fonte é listada no §12). Fontes secundárias (artigos, escritórios, imprensa) **não substituem** o texto legal |
| 🟡 **Conhecimento geral** | Citado a partir do conhecimento geral do redator, **sem fonte consultada nesta sessão**: confirmar no texto legal |
| ⬜ **Não verificado** | Lacuna da pesquisa; exige consulta direta |

> **Lacunas importantes:** não foram lidos diretamente os textos da LDB, do Decreto 5.154/2004, do CDC, do Decreto 7.962/2013, da LGPD, da Lei 15.211/2025 nem das resoluções da ANPD; **nenhuma jurisprudência** foi consultada; a pesquisa não encontrou norma do MEC sobre a validade de certificados de cursos livres.

## 1. Resumo para decisão

| # | Conclusão operacional | Nível |
|---|---|---|
| 1 | A APEX oferece **cursos livres** (formação inicial e continuada de livre oferta). Certificado **não** confere grau acadêmico e **não** pode ser apresentado como equivalente a ensino regulamentado | ✅ (pareceres de conselhos) |
| 2 | O novo marco do EaD (**Decreto 12.456/2025**) trata de **graduação por instituições de educação superior**; pelas fontes lidas, **não** disciplina cursos livres. Confirmar escopo | ✅ / 🟡 |
| 3 | **Reembolso de 7 dias** (CDC art. 49) vale para compras online de cursos e e-books; a controvérsia é se o acesso ao conteúdo limita o direito. **Política recomendada: 7 dias incondicional**, mesmo com aulas assistidas | ✅ (norma) · ⬜ (jurisprudência) |
| 4 | **ECA Digital (Lei 15.211/2025)** está em vigor desde **17/03/2026**, com alcance amplo a produtos digitais acessíveis a menores, e **não aceita autodeclaração como único método de verificação etária**. A decisão de "público 18+" (ADR-010) **precisa de parecer específico** | ✅ (fontes secundárias) |
| 5 | **LGPD**: consentimento granular e versionado, encarregado (DPO), ROPA, RIPD para IA e menores, atendimento ao titular, retenção por categoria | 🟡 |
| 6 | **IA**: o **PL 2338/2023 ainda não é lei** (fontes divergem sobre o andamento). Política da Meta para IA no WhatsApp está em disputa no Brasil; manter agentes no escopo de **atendimento comercial/suporte** é seguro em qualquer cenário | ✅ |
| 7 | **NFS-e padrão nacional** passa a ser obrigatória para optantes do Simples em **01/11/2026**; **IBS/CBS** no documento fiscal a partir de **01/01/2027** (Simples). Tratamento de cursos, e-books e assinaturas **a definir com contador** | ✅ (fontes secundárias) |
| 8 | **Marca "APEX"**: risco de colisão **alto** (nome comum, uso em software, marca ApeX existente). **Busca no INPI pendente** | ⬜ |

## 2. Mapa de obrigações × produto

| Tema | Norma / fonte | O que o produto faz | Requisitos | Nível |
|---|---|---|---|---|
| Natureza de curso livre | LDB art. 42; Decreto 5.154/2004 | Nomenclatura controlada; certificado com selo "CURSO LIVRE" | RF-CAT-021, RF-LMS-013, 015 | ✅ |
| Profissão regulamentada | Competência dos conselhos (ex.: COFEN) | Fila de revisão jurídica para áreas reguladas | RF-CAT-021 | ✅ |
| Direito de arrependimento | CDC art. 49 | Reembolso automático em 7 dias | RF-PAY-010, 022 | ✅ |
| Informação e comércio eletrônico | CDC; Decreto 7.962/2013 | Resumo de compra, SAC, confirmação, arrependimento facilitado | RF-PAY-012 | 🟡 |
| Publicidade | CDC arts. 36–38; CONAR | Guardião de publicidade; sem escassez falsa | RF-MKT-021, RF-AIX-024 | 🟡 |
| Assinaturas e cancelamento | Sem lei geral federal identificada; Decreto 11.034/2022 (setorial); PL 4.983/2026 | Cancelar em ≤ 2 cliques, pelo mesmo canal | RF-PAY-033 | ✅ |
| Proteção de dados | LGPD | Consentimento, DSAR, ROPA, RIPD, DPO | RF-IAM, RF-OPS-029…034 | 🟡 |
| Dados de crianças/adolescentes | LGPD art. 14; Enunciado CD/ANPD 1/2023; ECA Digital | Público 18+, conta de responsável (Fase 3), design sem manipulação | RF-IAM-014, 015; RF-ENG-006 | ✅ |
| Registros de acesso | Marco Civil da Internet (art. 15) | Guarda de logs por 6 meses | RF-OPS-032 | 🟡 |
| Fiscal | NFS-e nacional; LC 214/2025 | Emissão automática, preparação IBS/CBS | RF-OPS-009…011 | ✅ / ⬜ |
| IA | PL 2338/2023 (tramitando); LGPD art. 20 | Transparência, HITL, inventário de agentes | RF-AIX | ✅ / 🟡 |
| WhatsApp | Termos da Meta; decisão do CADE | Opt-in, escopo de atendimento | RF-MKT-008, RF-AIX-030 | ✅ |
| Acessibilidade | LBI (Lei 13.146/2015) art. 63 | WCAG 2.2 AA; legendas | RNF-ACC | ✅ (resumo) |
| Direitos autorais | Lei 9.610/1998 | Contrato de cessão/licença; originalidade; voz/imagem com consentimento | RF-AIX-022, 023; RF-OPS-025 | 🟡 |
| Marca | LPI (Lei 9.279/1996); INPI | Busca antes de investir; classes 9/35/41/42 | — | ⬜ |

## 3. Cursos livres, certificados e nomenclatura

### 3.1 O que as fontes confirmam

- **Base legal:** a LDB (art. 42) prevê **cursos especiais abertos à comunidade**, de livre oferta, **sem exigir escolaridade prévia**; o **Decreto 5.154/2004** inclui a **formação inicial e continuada** entre as modalidades da educação profissional ✅.
- **Certificado:** instituições de cursos livres **podem emitir certificado**, que **não confere grau acadêmico**; a emissão **não é obrigatória**; esses cursos **não têm carga horária pré-estabelecida** ✅ (pareceres de conselhos profissionais, COFEN/COREN-DF).
- **Validade:** não foi localizada norma do MEC que regule a "validade" de certificados de cursos livres. Alegações como "válido em todo o território nacional" aparecem em **material comercial** e **não devem ser reproduzidas** ✅.
- **Novo marco do EaD (Decreto 12.456/2025; Portarias MEC 381 e 506/2025):** disciplina a oferta de EaD por **IES em graduação** (inclui exigência de carga presencial mínima e regras de transição) ✅. **Não** foi encontrada aplicação a cursos livres; **confirmar no texto**.
- **Profissões regulamentadas:** conselhos profissionais já emitiram pareceres tratando **cursos livres em áreas reguladas** (ex.: enfermagem). Um curso livre **não habilita** ao exercício da profissão ✅.

### 3.2 Regras de produto decorrentes

| Regra | Aplicação |
|---|---|
| **Vocabulário bloqueado** em cursos livres: graduação, pós-graduação, MBA, mestrado, doutorado, curso técnico, diploma, "reconhecido pelo MEC", "validade nacional/em todo o território" | Guardião L1/L2 bloqueia a publicação (Doc 07 §4.2) |
| **Fila de revisão jurídica** para termos como "habilita", "credencia", "licencia" e para áreas de profissão regulamentada | Guardião L4 |
| **Certificado:** "Certificado de Conclusão/Participação", selo **"CURSO LIVRE"**, carga horária, código + QR, **frase padrão**: *"Este é um certificado de curso livre e não equivale a ensino regulamentado."* | Doc 15 §8.1; RF-LMS-015 |
| **Sem símbolos** do MEC, de governo ou aparência oficial | Checklist `mec-curso-livre-check` (veto) |
| **Resultados proporcionais à carga horária** (curso de 8 h não promete competências de graduação) | Revisão pedagógica (Studio) |
| **Sem equivalência** com ensino técnico, graduação ou pós em material de venda | Guardião L2 |

> Nota: o squad `squads/education` do repositório já traz o checklist `mec-curso-livre-check.md` (selo "curso livre", sem símbolos, horas documentadas, resultados proporcionais, **sem alegação de equivalência**, com vetos automáticos). As regras acima são **consistentes** com ele (ADR-016).

## 4. Consumidor, comércio eletrônico e publicidade

### 4.1 Direito de arrependimento (CDC art. 49)

- ✅ Compra **fora do estabelecimento** (online): **7 dias corridos** para desistir, contados da contratação/recebimento; valores pagos devem ser **devolvidos de imediato, monetariamente atualizados** (parágrafo único). Fontes secundárias aplicam a regra a **cursos online e e-books**, sem distinção entre físico e digital.
- ⬜ **Controvérsia:** empresas negam reembolso quando o aluno assistiu a aulas, e termos de uso que condicionam o direito à "não fruição" são contestados com base no art. 51 do CDC (nulidade de cláusulas que restrinjam direitos). **Nenhuma jurisprudência (STJ/TJs) foi consultada.**
- **Decisão de produto (ADR-013):** **7 dias incondicional**, mesmo com progresso, reembolso **automático** e **imediato** na solicitação; **garantia estendida** (15/30 dias) como alavanca comercial, com critérios claros e exibidos **antes** da compra. É a posição de **menor risco jurídico e de *chargeback***.
- **Operação:** a devolução ao consumidor é **imediata**; o prazo de **crédito efetivo** depende do PSP/banco/fatura — comunicar com clareza (RF-PAY-022; WF-ORD-03).

### 4.2 Comércio eletrônico (Decreto 7.962/2013) 🟡

Confirmar no texto: informações claras e ostensivas (preço total, forma e custos de pagamento, **prazo de acesso**, identificação do fornecedor com CNPJ), **atendimento facilitado ao consumidor** (SAC), **confirmação imediata do recebimento do pedido**, e **meio facilitado de exercício do arrependimento** com confirmação. O checkout e o painel (Doc 14 §8) já foram desenhados para esses pontos.

### 4.3 Publicidade e práticas comerciais 🟡

- Vedada a publicidade **enganosa ou abusiva** (CDC arts. 36–38); **identificação** da natureza publicitária (influenciadores, patrocinados); observar o **Código do CONAR**.
- **Promessas de renda/emprego/aprovação:** bloqueadas pelo Guardião (RF-AIX-024).
- **Escassez e contagem regressiva falsas, preço "de/por" não praticado e depoimentos inventados** são práticas a vedar por política (RF-MKT-021; Doc 09 §13).
- **Webinar evergreen:** exibir **rótulo de gravação**; não simular "ao vivo" de forma enganosa (RF-LIV-015).
- **Vendas por WhatsApp/telefone:** o contrato pode ser **fora do estabelecimento**: o arrependimento de 7 dias também se aplica.

### 4.4 Assinaturas e renovação automática

- ✅ Não foi identificada **lei federal geral** que obrigue o cancelamento pelo mesmo canal da contratação para todos os serviços recorrentes; o **Decreto 11.034/2022** é **setorial** (SAC de telecom, bancos, planos de saúde etc.) e há **projeto de lei** em tramitação (PL 4.983/2026) e propostas estaduais. **Acompanhar.**
- **Política de produto (independente de lei):** cancelamento em **≤ 2 interações**, pelo mesmo canal, **confirmação por e-mail**, **aviso prévio de renovação**, consentimento expresso para recorrência e retenção sem obstrução (RF-PAY-033, 034, 037).
- **Pix Automático:** lançado pelo Banco Central em **16/06/2025**; o pagador autoriza uma vez e define limites; aviso prévio ao pagador antes da cobrança ✅.

### 4.5 Cláusulas e contratos de adesão 🟡

Evitar cláusulas que **limitem indevidamente a responsabilidade**, **renunciem a direitos do consumidor** ou **exijam foro distante** (CDC arts. 51 e 54). Termos em linguagem clara, com destaque às cláusulas restritivas, aceite ativo e versionado (RF-PAY-011).

## 5. Menores de idade e ECA Digital

### 5.1 O que as fontes indicam ✅ (secundárias)

- A **Lei 15.211/2025 (ECA Digital)** entrou em vigor em **17/03/2026**, aplica-se a **produtos e serviços digitais acessíveis a menores de 18 anos** (alcance amplo, **extraterritorial**), e **proíbe aceitar a autodeclaração como único método de verificação etária**; a implementação da verificação é **escalonada**, com requisitos técnicos a cargo da **ANPD** (que fixou requisitos mínimos de proporcionalidade e precisão).
- Em **18/03/2026** foram assinados **três decretos** de regulamentação (inclui vedação de **design manipulativo**), e a **ANPD** passou a ter perfil de **agência reguladora** (Lei 15.352/2026). Multas de **até R$ 50 milhões por infração** foram noticiadas.
- **LGPD art. 14 e Enunciado CD/ANPD nº 1/2023:** o tratamento de dados de crianças e adolescentes pode se apoiar em bases legais dos arts. 7º e 11 (**não só consentimento**), sempre observado o **melhor interesse**, avaliado caso a caso.

### 5.2 Implicações e decisão

| Ponto | Posição proposta |
|---|---|
| **Público-alvo** | **18+ no lançamento** (ADR-010) |
| **Risco** | Declarar "18+" **pode não bastar** se o serviço for **provavelmente acessado por menores** (cursos de entrada, jovens de 16–17 anos). **Obter parecer** sobre: (a) se a APEX está no escopo do ECA Digital; (b) qual método de verificação etária é **proporcional** ao risco; (c) quando a conta de responsável passa a ser exigida |
| **Fases** | F1: declaração de maioridade **+ sinais** (ex.: validação de CPF/data de nascimento, meio de pagamento) conforme parecer · F2–3: **conta de responsável** (RF-IAM-015) |
| **Design** | Sem *loot boxes*, *streaks* e contagens de pressão para menores (**desligados por padrão**, RF-ENG-006); sem perfilamento comportamental nem publicidade direcionada a menores; sem interação autônoma de IA com menores (Doc 08 §12) |
| **Dados** | Minimização; retenção reduzida; **RIPD obrigatório** antes de abrir a menores |

## 6. Proteção de dados (LGPD) 🟡

> Os artigos citados vêm do conhecimento geral do redator: **confirmar no texto**.

### 6.1 Papéis e bases legais por atividade (proposta)

| Atividade | Base legal sugerida | Observação |
|---|---|---|
| Cadastro e acesso ao curso | Execução de contrato | Dados mínimos |
| Pagamento, NFS-e, repasses | Execução de contrato; obrigação legal/regulatória | Retenção fiscal |
| Certificado e verificação pública | Execução de contrato; legítimo interesse (verificação de autenticidade) | Expor o mínimo (nome, curso, carga, data) |
| Tutor de IA (responder dúvidas) | Execução de contrato | Sem treinamento de modelos com dados de alunos |
| **Memória de aprendizagem** | **Consentimento** (revogável) | Painel "o que o tutor lembra" |
| E-mail de marketing a clientes | Legítimo interesse (com descadastro) **ou** consentimento | Definir com o DPO |
| **WhatsApp/SMS de marketing** | **Consentimento** específico por canal | Opt-in provado |
| Analytics e cookies não essenciais | **Consentimento** | Banner e *Consent Mode* |
| Antifraude e segurança | Legítimo interesse; prevenção à fraude | Registro de balanceamento |
| Logs de acesso | Obrigação legal | 6 meses (Marco Civil) |
| Contato comercial B2B | Legítimo interesse | |

**Papéis:** a APEX é **controladora** dos dados de alunos e leads; PSP, emissor fiscal, provedores de vídeo/e-mail/WhatsApp e IA atuam como **operadores** (ou controladores independentes, no caso de PSP/bancos — classificar). Contrato com **DPA** (ou cláusulas equivalentes) para cada um (RF-OPS-034).

### 6.2 Obrigações a operacionalizar

| Obrigação | Como no produto | Requisito |
|---|---|---|
| **Direitos do titular** (confirmação, acesso, correção, anonimização/exclusão, portabilidade, informação, revogação) | Autoatendimento + fluxo DSAR; resposta simplificada imediata e **declaração completa em até 15 dias** | RF-IAM-019, RF-OPS-029, RNF-PRV-03 |
| **Encarregado (DPO)** nomeado, canal público | Antes do lançamento | RNF-PRV-02 |
| **Registro das operações (ROPA)** | `ops.processing_activities` | RF-OPS-030 |
| **Relatório de impacto (RIPD)** para IA, menores e perfilamento | Antes de cada lançamento correspondente | RNF-PRV-04 |
| **Incidentes de segurança** | Playbook; **comunicação à ANPD e aos titulares** quando houver risco relevante, no prazo regulamentar (**verificar a resolução vigente**) | RF-OPS-031 |
| **Transferência internacional** (nuvem, IA) | Mecanismo válido (ex.: cláusulas-padrão — **verificar regulamento da ANPD**), registro por fornecedor | RNF-PRV-06 |
| **Decisões automatizadas** (art. 20) | Transparência e **revisão humana** (HITL) | RF-AIX-036, RNF-PRV-08 |
| **Cookies** | Banner por categoria; sem cookies não essenciais antes do consentimento | RF-MKT-019 |
| **Segurança** (art. 46) | Controles do Doc 06 §4 | RNF-SEC |
| **Retenção e descarte** | Tabela do Doc 12 §6 | RF-OPS-032 |

### 6.3 Certificado × exclusão de dados

Ver Doc 12 §6.3: manter o **mínimo necessário** quando houver fundamento legal; **anonimizar o nome** quando não houver; informar o titular do que foi mantido e por quê. **Decisão do DPO/jurídico.**

## 7. Inteligência artificial, canais e conteúdo

### 7.1 Regulação de IA

- ✅ O **PL 2338/2023** (marco legal da IA) **não é lei**: tramita na Câmara, e **fontes divergem** sobre o estágio (uma indica que o parecer ainda não havia sido apresentado em out/2026; outra, que foi apresentado em maio/2026). **Consultar a ficha de tramitação na Câmara dos Deputados.**
- **Arquitetura antecipa obrigações prováveis:** inventário de agentes, classificação de risco, transparência, avaliação, supervisão humana, registros (Doc 08 §3, 5, 9).
- **LGPD + IA:** transparência, minimização, base legal, RIPD, revisão humana, não treinar modelos com dados de alunos sem base e informação (RF-AIX-008).

### 7.2 WhatsApp e agentes de IA

- ✅ A Meta passou a **proibir, na API do WhatsApp Business, assistentes de IA de propósito geral** (vigência prevista em 15/01/2026), **mantendo permitido** o uso de IA para **atendimento ao cliente**. Após ordem do **CADE**, a regra foi **suspensa para números brasileiros (+55)**; a investigação segue aberta e **a situação pode mudar**.
- **Decisão:** agentes no WhatsApp ficam **estritamente no escopo comercial/suporte da APEX**, com **opt-in**, janela de 24 h, "parar" e acesso a humano. É seguro em qualquer desfecho (RF-AIX-030).

### 7.3 Direitos autorais, voz e imagem 🟡

- **Instrutores:** contrato de **licença/cessão** (escopo, prazo, território, mídias, exclusividade, reversão, **uso para treinamento/assistentes de IA**, remuneração), declaração de **autoria e licenças** de terceiros (músicas, imagens, fontes).
- **Conteúdo gerado por IA:** revisão humana, verificação de originalidade (RF-AIX-022), rotulagem interna; titularidade e licenças do provedor de IA a revisar.
- **Dublagem/avatar:** **consentimento expresso e específico** do titular da voz/imagem (RF-MED-017).
- **Conteúdo de terceiros em comunidade:** política de uso, **canal de denúncia** e remoção; **verificar o entendimento atual do STF sobre a responsabilidade de plataformas (art. 19 do Marco Civil)**, que foi objeto de julgamento recente ⬜.

## 8. Fiscal e tributário (validar com contador)

| Tema | O que as fontes indicam | Ação |
|---|---|---|
| **NFS-e padrão nacional** | ✅ Obrigatória para **optantes do Simples a partir de 01/11/2026** (Resolução CGSN 191/2026, que revogou a 189/2026 e adiou de setembro); até 31/10/2026, emissão nos sistemas municipais; emissão pelo **Emissor Nacional** (web ou API) | Confirmar regime da operadora (Q-04) e integrar emissor (S-02) |
| **IBS/CBS** | ✅ Para optantes do Simples, obrigatoriedade/destaque no documento fiscal a partir de **01/01/2027** | Parametrizar campos (RF-OPS-011) |
| **Alíquotas e regime para educação (LC 214/2025)** | ⬜ **Não confirmado** nesta pesquisa | Parecer do contador |
| **ISS sobre cursos** | 🟡 Serviço de ensino/instrução (item da lista da LC 116/2003 — **confirmar o subitem**) | Confirmar município e subitem |
| **E-books** | 🟡 Tratamento de **livros digitais** (imunidade constitucional de livros) **a confirmar**; difere de curso | Classificar por produto (RF-OPS-010) |
| **Assinatura, ingressos, kits** | ⬜ Rateio por item em *bundles*; tratamento de ingressos | Regra por produto com contador |
| **Repasses a instrutores/afiliados** | 🟡 Retenções (INSS, IRRF, ISS) conforme tipo de beneficiário (PF/PJ/MEI); emissão de nota pelo beneficiário | Definir fluxo documental |
| **Guarda de documentos** | 🟡 Prazo fiscal (referência usual de 5 anos) | Confirmar |

## 9. Marca, propriedade intelectual e acessibilidade

### 9.1 Marca "APEX"

- ⬜ **Busca de anterioridade no INPI** nas classes **9, 35, 41 e 42** (e correlatas), com análise de **colidência e risco de diluição**; "Apex" é palavra comum e há uso amplo em **software** e a marca **ApeX** já existente no projeto.
- Decidir: **registrar** (marca nominativa + mista), **coexistência** com a marca existente, ou **alternativa de nome** (Q-06).
- Domínio, perfis em redes, e-mail corporativo: **não verificados**.

### 9.2 Acessibilidade ✅/🟡

- A **LBI (art. 63)** torna obrigatória a acessibilidade em sítios da internet mantidos por **empresas e órgãos públicos** (resumo de fonte secundária ✅). **Não** foi localizada obrigação normativa específica de WCAG 2.2 AA ou de Libras/legendas em todo curso EaD; projetos de lei tramitam. **Meta do produto: WCAG 2.2 AA, legendas e transcrição** (RNF-ACC).

### 9.3 Análise de concorrentes

Usar **apenas informação pública**; não burlar controles de acesso; **não copiar conteúdo, identidade visual ou cursos** (Lei 9.610/1998; concorrência desleal). Ver Doc 02 §2.

## 10. Documentos legais a produzir

| # | Documento | Pontos obrigatórios / decisões | Responsável | Fase |
|---|---|---|---|---|
| L-01 | **Termos de Uso** | Natureza de **curso livre**; licença pessoal e intransferível; proibição de compartilhar acesso; comunidade; **IA**: limitações e "não substitui profissional"; alterações com aviso; foro compatível com o CDC | Jurídico | 0–1 |
| L-02 | **Política de Privacidade** | Controlador, DPO, finalidades e bases por atividade (§6.1), compartilhamentos, **transferência internacional**, retenção, direitos do titular, cookies, **IA** | Jurídico/DPO | 0–1 |
| L-03 | **Política de Reembolso e Garantia** | 7 dias **incondicional**; como pedir; devolução imediata; garantia estendida; evento cancelado; assinatura | Jurídico | 0–1 |
| L-04 | **Condições de Compra** | Preço final, parcelamento, acesso, meios de pagamento, NFS-e, SAC | Jurídico | 1 |
| L-05 | **Política de Cookies** e banner | Categorias; consentimento prévio | DPO | 1 |
| L-06 | **Política de Uso de IA** | Transparência, limites, supervisão humana, dados, memória | Jurídico/DPO | 1 |
| L-07 | **Política de Comunidade** | Conduta, moderação, denúncias, remoção | Jurídico | 2 |
| L-08 | **Contrato de Instrutor** | Licença/cessão, repasse, KYC/KYB, exclusividade, IA, rescisão, propriedade de dados de alunos | Jurídico | 2 |
| L-09 | **Termos de Afiliados e Coprodutores** | Comissões, atribuição, proibições (autocompra, *brand bidding*), pagamento após garantia, estorno | Jurídico | 2 |
| L-10 | **Contrato B2B + DPA** | Papéis LGPD (controlador/operador), SLA, assentos, renovação | Jurídico | 3 |
| L-11 | **DPAs com operadores** (PSP, vídeo, e-mail, WhatsApp, IA, nuvem) | Não treinamento, retenção, localização, subprocessadores | DPO | 0–1 |
| L-12 | **Política de Segurança e Plano de Incidentes** | Papéis, prazos, comunicação | CTO/DPO | 1 |
| L-13 | **Política de Retenção** | Tabela do Doc 12 §6.2 validada | DPO/Contador | 1 |
| L-14 | **ROPA e RIPD** (IA; menores) | Modelos | DPO | 1–2 |
| L-15 | **Política de Certificados e Verificação** | Texto padrão, revogação, dados expostos | Jurídico | 1 |
| L-16 | **Declaração de Acessibilidade** | Metas, canal | Produto | 1 |
| L-17 | **Código de Conduta do Marketing** | Regras do Doc 09 §13; CONAR; influenciadores | Marketing/Jurídico | 2 |

## 11. Matriz de riscos jurídicos (resumo)

| ID | Risco | Prob. | Impacto | Mitigação | Responsável |
|---|---|---|---|---|---|
| RJ-01 | Alegação indevida de validade/equivalência de certificado | Média | Alto | Guardião L1–L4; texto padrão; revisão jurídica | Jurídico/Conteúdo |
| RJ-02 | Acesso de menores sem verificação adequada (ECA Digital) | Média | Muito alto | Parecer; verificação proporcional; conta de responsável | Jurídico/DPO |
| RJ-03 | Recusa de reembolso dentro de 7 dias | Média | Alto | 7 dias incondicional automático | Financeiro |
| RJ-04 | Dados pessoais enviados a provedores de IA/nuvem sem base/transferência | Média | Alto | DPAs; no training; RIPD; redação de PII | DPO/CTO |
| RJ-05 | Colisão de marca APEX | Média/Alta | Alto | Busca INPI antes de investir | Jurídico |
| RJ-06 | Publicidade enganosa (escassez falsa, resultado) | Média | Alto | Guardião L6; política de integridade | Marketing |
| RJ-07 | Mensagens sem opt-in (WhatsApp/e-mail) | Média | Médio/Alto | Consentimento por canal; bloqueio no envio | Growth |
| RJ-08 | Direitos autorais de conteúdo de instrutores/IA | Média | Médio/Alto | Contrato; verificação de originalidade | Jurídico/Conteúdo |
| RJ-09 | Erro fiscal (NFS-e, tributos de repasse) | Média | Médio | Contador desde a Fase 0; automação com revisão | Financeiro |
| RJ-10 | Vazamento de dados | Baixa/Média | Muito alto | RNF-SEC; incident response; seguro cibernético (avaliar) | CTO/DPO |
| RJ-11 | Mudança regulatória (IA, ECA Digital, reforma tributária) | Alta | Médio | Monitor regulatório; arquitetura configurável | Jurídico |
| RJ-12 | Responsabilidade por conteúdo de terceiros em comunidade | Média | Médio | Política, denúncia, remoção, revisão do entendimento do STF | Jurídico |

## 12. Fontes consultadas nesta pesquisa

> Todas **secundárias** (artigos, escritórios, imprensa, pareceres de conselhos). **Nenhuma** substitui o texto legal.

**Cursos livres, EaD e certificados**
- Decreto 5.154/2004 (PDF institucional): <https://www.ifsudestemg.edu.br/documentos-institucionais/unidades/reitoria/pro-reitorias/ensino/educacao-basica-e-profissional/legislacao/dec5154_04.pdf>
- Parecer COFEN (cursos livres): <https://coren-df.gov.br/wp-content/uploads/2024/08/SEI_COFEN-0299377-Parecer.pdf>
- Parecer COREN-DF: <https://coren-df.gov.br/wp-content/uploads/2018/10/PARECER_TeCNICO_PALESTRA_FINAL_-29-9-18.pdf>
- Artigo sobre certificados em EaD: <https://jus.com.br/artigos/83758/o-que-a-lei-diz-sobre-os-certificados-para-ensino-a-distancia-em-plataformas-ead>
- Decreto 12.456/2025 — análise: <https://jus.com.br/artigos/116124/o-novo-marco-regulatorio-da-educacao-a-distancia-ead-no-brasil-impactos-juridicos-educacionais-e-sociais-a-partir-do-decreto-n-12-456-2025> · FAQ ABMES: <https://abmes.org.br/documentos/detalhe/1084/faq-novo-marco-regulatorio-ead> · Portaria MEC 381/2025: <https://anec.org.br/wp-content/uploads/2025/05/PORTARIA-MEC-No-381-DE-20-DE-MAIO-DE-2025.pdf>

**Consumidor**
- Direito de arrependimento em ambiente digital: <https://turivius.com/portal/direito-de-arrependimento-no-ambiente-digital/> · <https://www.projuris.com.br/blog/direito-de-arrependimento-2/> · <https://herospark.com/blog/tempo-de-garantia-para-curso-online/>
- Cancelamento de assinaturas (PL 4.983/2026 e normas setoriais): <https://www.bandab.com.br/nacional/cancelamento-de-assinatura-de-streaming-fica-mais-facil-e-sem-renovacao-automatica-sem-aviso-propoe-projeto-de-lei-na-camara-dos-deputados/amp/> · <https://www.guardardinheiro.com.br/blog/como-cancelar-assinaturas-direitos>

**Menores e dados**
- ECA Digital: <https://canaltech.com.br/internet/pontos-para-entender-o-eca-digital-que-entra-em-vigor-nesta-terca-17/> · <https://confidata.com.br/blog/eca-digital-o-que-muda-empresas> · <https://www.machadomeyer.com.br/images/ebooks/Factsheet_ECA_Digital.pdf>
- Enunciado CD/ANPD nº 1/2023: <https://www.felsberg.com.br/importante-anpd-publica-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes/>

**IA e canais**
- PL 2338/2023: <https://confidata.com.br/blog/regulamentacao-ia-brasil-protecao-dados> · <https://teletime.com.br/16/12/2025/pl-de-inteligencia-artificial-fica-para-fevereiro-de-2026/>
- WhatsApp e IA: <https://techcrunch.com/2026/01/13/brazil-orders-meta-to-suspend-policy-banning-third-party-ai-chatbots-from-whatsapp> · <https://exame.com/tecnologia/whatsapp-volta-atras-e-deixa-que-empresas-brasileiras-usem-ias-para-atender-clientes/> · <https://canaltech.com.br/apps/whatsapp-desiste-de-bloquear-outros-chatbots-de-ia-no-brasil-revela-portal/>

**Fiscal e pagamentos**
- NFS-e nacional: <https://coad.com.br/home/noticias-detalhe/139271/nfs-e-nacional-sera-obrigatoria-para-optantes-do-simples-nacional-a-partir-de-1-11-2026> · <https://documentacao.senior.com.br/exigenciaslegais/noticias/federal/2026/2026-08-11-simples-nacional-resolucao-cgsn-no-191-2026-utilizacao-do-emissor-da-nfs-e-de-padrao-nacional-sera-a-partir-de-novembro>
- Pix Automático: <https://genyo.com.br/pix-automatico/> · <https://www.folhavitoria.com.br/economia/banco-central-lanca-pix-automatico/>

**Acessibilidade**
- LBI art. 63 (resumo): <https://catracalivre.com.br/cidadania/lei-obriga-acessibilidade-na-internet/>

**Não consultado (ação da Fase 0):** texto da LDB, CDC, Decreto 7.962/2013, LGPD, Marco Civil, Lei 15.211/2025 e decretos de 18/03/2026, resoluções da ANPD (incidentes, transferência internacional, cookies), LC 214/2025, LC 116/2003, jurisprudência (STJ/TJs/STF) sobre arrependimento em cursos online e responsabilidade de plataformas, busca no INPI.
