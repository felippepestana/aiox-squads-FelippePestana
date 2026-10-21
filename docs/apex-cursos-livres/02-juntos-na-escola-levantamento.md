# 02 — Levantamento do Site de Referência (`juntosnaescola.com.br`)

> **APEX Plataforma de Cursos Livres** · Documento 02 · v1.0 · 21/10/2026
> **Status: ⛔ ANÁLISE PENDENTE — o site não pôde ser acessado. Nenhum dado sobre ele é afirmado neste repositório.**

## 1. O que aconteceu

Foram feitas cinco tentativas de acesso, por caminhos independentes, em 21/10/2026:

| # | Tentativa | Resultado |
|---|---|---|
| 1 | Leitura direta da página (`https://juntosnaescola.com.br/`) pela ferramenta de fetch da sessão | `ENOTFOUND` — o domínio não resolve a partir da ferramenta |
| 2 | `curl` por HTTPS, com e sem `www` | `CONNECT tunnel failed, response 403` — o proxy de saída da sessão **recusou** abrir túnel para o host |
| 3 | `curl` por HTTP / resolução DNS direta | `Could not resolve host` — a sessão não resolve DNS fora do proxy |
| 4 | Cópia arquivada (web.archive.org) | A ferramenta de fetch não permite esse domínio |
| 5 | Busca web por `juntosnaescola`, `"Juntos na Escola" plataforma EAD` e variações | **Nenhuma página do site retornada.** Só apareceram programas homônimos sem relação (p. ex., o programa norte-americano *Juntos*, de extensão universitária) |

**Interpretação correta:** o item 2 indica **política de rede do ambiente** (host fora da lista permitida), e **não** prova que o site não existe ou está fora do ar. Também não foi possível, por busca, descobrir quem mantém o site, qual LMS ele usa ou o que oferece. **Por isso, este repositório não descreve o site — e nenhum documento deve ser lido como se o fizesse.**

## 2. Como destravar (escolha uma ou combine)

| Opção | O que fazer | Esforço |
|---|---|---|
| **A — Liberar o domínio** (recomendada) | No menu do ambiente de nuvem da sessão → *Edit* → **Network access**: usar um nível mais amplo **ou** incluir `juntosnaescola.com.br` (e `www.`) em **Allowed domains**. Passo a passo oficial: <https://code.claude.com/docs/en/cloud-environments#network-access>. Depois, pedir "refaça o levantamento do Doc 02" | 2 min |
| **B — Enviar material** | Anexar *prints* de tela cheia (home, catálogo, página de curso, checkout, área do aluno), PDF da página ("Imprimir → Salvar como PDF") e/ou um vídeo curto navegando. Colocar em `docs/apex-cursos-livres/evidencias/juntos-na-escola/` | 15–30 min |
| **C — Colar texto** | Colar aqui o menu, os títulos das seções, a lista de cursos, preços e textos legais (termos, privacidade, reembolso, certificado) | 10 min |
| **D — Conta de demonstração** | Se o site tiver área logada, informar **uma conta de teste de baixo privilégio** — **nunca** credenciais reais, e preferencialmente por vídeo de tela em vez de senha | variável |

> ⚠️ **Boas práticas e limites legais da análise de concorrente:** usar **apenas informação pública ou conta própria/autorizada**; **não** burlar controles de acesso; **não** copiar textos, imagens, cursos ou identidade visual (direito autoral — Lei 9.610/98 — e concorrência desleal); registrar a data e a origem de cada evidência. A APEX deve **inspirar-se em funcionalidade**, jamais **reproduzir expressão**.

## 3. Protocolo de levantamento (checklist a preencher)

Legenda da coluna **Observado**: ⬜ pendente · ✅ presente · ➖ ausente · ❓ não conclusivo. A coluna **Esperado** vem do benchmark ([Doc 01](01-pesquisa-benchmark.md)) e indica o que plataformas do segmento costumam ter — **não é afirmação sobre o site**.

### Bloco A — Identidade e posicionamento

| ID | Item a levantar | Esperado no segmento | Observado | Evidência |
|---|---|---|---|---|
| A-01 | Quem é a entidade mantenedora (razão social, CNPJ, endereço, responsável) | Rodapé/termos | ⬜ | |
| A-02 | Proposta de valor declarada (slogan, *headline*) | Sim | ⬜ | |
| A-03 | Público-alvo declarado (alunos, escolas, redes de ensino, famílias, professores?) | Sim | ⬜ | |
| A-04 | Natureza do site (institucional, portal de cursos, programa social, marketplace?) | — | ⬜ | |
| A-05 | Modelo econômico (gratuito, pago, assinatura, patrocinado, B2G?) | — | ⬜ | |
| A-06 | Tom de voz e vocabulário | — | ⬜ | |
| A-07 | Parceiros/apoiadores/logotipos de confiança | Sim | ⬜ | |

### Bloco B — Arquitetura de informação e navegação

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| B-01 | Menu principal completo (rótulos e hierarquia) | Sim | ⬜ | |
| B-02 | Rodapé (links, redes sociais, contatos) | Sim | ⬜ | |
| B-03 | Páginas institucionais (sobre, contato, FAQ, blog, imprensa) | Sim | ⬜ | |
| B-04 | Busca no site / filtros de catálogo | Sim | ⬜ | |
| B-05 | Sitemap (`/sitemap.xml`) e `robots.txt` públicos | Sim | ⬜ | |
| B-06 | Idiomas disponíveis | pt-BR | ⬜ | |

### Bloco C — Catálogo e produtos

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| C-01 | Formatos oferecidos (curso gravado, ao vivo, e-book, trilha, webinar, evento…) | Curso gravado | ⬜ | |
| C-02 | Quantidade de cursos e categorias/áreas | — | ⬜ | |
| C-03 | Página de curso: carga horária, ementa/módulos, instrutor, pré-requisitos, nível | Sim | ⬜ | |
| C-04 | Curso tem prova/avaliação? Nota mínima? | 70% (prática de mercado) | ⬜ | |
| C-05 | Certificado: emitido? gratuito/pago? conteúdo do certificado, QR, código de validação | Sim | ⬜ | |
| C-06 | Alegações sobre validade do certificado (MEC, "reconhecido", "válido nacionalmente") | **Risco** — ver Doc 16 §3 | ⬜ | |
| C-07 | Trilhas/programas e pré-requisitos entre cursos | Frequente | ⬜ | |
| C-08 | Preços, parcelamento, cupons, gratuidade | — | ⬜ | |
| C-09 | Prova social: avaliações, depoimentos, nº de alunos | Sim | ⬜ | |

### Bloco D — Aquisição e cadastro

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| D-01 | Página inicial: seções na ordem e CTAs literais | Sim | ⬜ | |
| D-02 | Captura de lead (ebook, newsletter, pop-up, WhatsApp) | Sim | ⬜ | |
| D-03 | Cadastro: campos pedidos, validação de e-mail/CPF, login social | Sim | ⬜ | |
| D-04 | Verificação de idade / menores / responsável legal | **Obrigatório avaliar** (ECA Digital) | ⬜ | |
| D-05 | Consentimentos no cadastro (termos, privacidade, marketing) | LGPD | ⬜ | |
| D-06 | Login: e-mail/senha, 2FA, recuperação, SSO | — | ⬜ | |

### Bloco E — Compra e pagamento

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| E-01 | Há venda? Quem processa o pagamento (PSP/marketplace)? | — | ⬜ | |
| E-02 | Meios de pagamento (Pix, cartão, boleto, carteira) | Pix + cartão + boleto | ⬜ | |
| E-03 | Etapas do checkout (nº de telas, campos) | 1–2 | ⬜ | |
| E-04 | Order bump, upsell, cupom, garantia | Frequente | ⬜ | |
| E-05 | Política de reembolso / arrependimento (prazo, canal) | 7 dias (CDC art. 49) | ⬜ | |
| E-06 | Nota fiscal / recibo | — | ⬜ | |
| E-07 | E-mails transacionais recebidos (boas-vindas, recibo, acesso) | Sim | ⬜ | |

### Bloco F — Área do aluno

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| F-01 | Dashboard (cursos em andamento, próximos passos) | Sim | ⬜ | |
| F-02 | Player de vídeo: velocidade, legendas, retomar de onde parou, marcação de concluída | Sim | ⬜ | |
| F-03 | Materiais complementares, e-books, anexos | Sim | ⬜ | |
| F-04 | Progresso, liberação gradual (drip), pré-requisitos | Sim | ⬜ | |
| F-05 | Avaliações: tipos de questão, tentativas, correção | Sim | ⬜ | |
| F-06 | Comentários/dúvidas por aula; fórum; comunidade | Frequente | ⬜ | |
| F-07 | Gamificação (pontos, selos, ranking) | Frequente | ⬜ | |
| F-08 | Acesso mobile / app / PWA / offline | Frequente | ⬜ | |
| F-09 | Perfil, preferências, histórico, segunda via do certificado | Sim | ⬜ | |
| F-10 | Funcionalidades de IA (tutor, resumo, busca, recomendação) | Crescente | ⬜ | |
| F-11 | Aulas ao vivo / webinars / agenda | Parcial | ⬜ | |

### Bloco G — Comunicação, comunidade e suporte

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| G-01 | Canais de suporte (chat, WhatsApp, e-mail, telefone, ticket) e horário | Sim | ⬜ | |
| G-02 | Central de ajuda / FAQ / base de conhecimento | Sim | ⬜ | |
| G-03 | Chatbot ou agente automatizado | Crescente | ⬜ | |
| G-04 | Notificações (e-mail, push, WhatsApp) e preferências | Sim | ⬜ | |
| G-05 | Pesquisa de satisfação / NPS / avaliação do curso | Frequente | ⬜ | |

### Bloco H — Instrutor e administração (se visível)

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| H-01 | Existe área do instrutor? Como se cadastra? | Depende | ⬜ | |
| H-02 | Fluxo de publicação de curso | — | ⬜ | |
| H-03 | Relatórios disponíveis a gestores (escolas, redes, empresas) | Se B2B/B2G | ⬜ | |
| H-04 | Integrações visíveis (LMS externo, SSO, webhooks, API) | — | ⬜ | |

### Bloco I — Técnico (somente o que é público: DevTools/*view source*)

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| I-01 | Stack aparente (WordPress, Next.js, Moodle, SaaS de EAD…) | — | ⬜ | |
| I-02 | Hospedagem/CDN (cabeçalhos `server`, `via`, `cf-ray`…) | — | ⬜ | |
| I-03 | Player/host de vídeo (YouTube, Vimeo, Panda, Bunny, Mux, próprio) | — | ⬜ | |
| I-04 | Proteção de conteúdo (URL assinada, DRM, marca d'água) | — | ⬜ | |
| I-05 | Analytics e pixels (GA4, Meta Pixel, GTM, Hotjar…) e cookies | — | ⬜ | |
| I-06 | Formulários/CRM/e-mail (RD Station, Mailchimp, etc.) | — | ⬜ | |
| I-07 | Cabeçalhos de segurança (CSP, HSTS, X-Frame-Options) | Recomendado | ⬜ | |
| I-08 | Certificado TLS (emissor, validade) | Sim | ⬜ | |

### Bloco J — SEO e desempenho

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| J-01 | `title`/`description`/OG por página; dados estruturados (`Course`, `Event`, `FAQ`) | Parcial | ⬜ | |
| J-02 | Lighthouse mobile: LCP, INP, CLS, acessibilidade, SEO | — | ⬜ | |
| J-03 | URLs amigáveis, canonical, hreflang, paginação | — | ⬜ | |

### Bloco K — Conformidade

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| K-01 | Termos de Uso (versão, data, foro) | Sim | ⬜ | |
| K-02 | Política de Privacidade (controlador, DPO/encarregado, bases legais, retenção, transferência internacional) | LGPD | ⬜ | |
| K-03 | Banner de cookies e categorias | Sim | ⬜ | |
| K-04 | Tratamento de dados de menores | ECA Digital/LGPD art. 14 | ⬜ | |
| K-05 | Política de reembolso e cancelamento | CDC | ⬜ | |
| K-06 | Declaração de acessibilidade | LBI art. 63 | ⬜ | |

### Bloco L — UX e identidade visual (apenas observação funcional; não copiar)

| ID | Item | Esperado | Observado | Evidência |
|---|---|---|---|---|
| L-01 | Paleta, tipografia e sistema de componentes | — | ⬜ | |
| L-02 | Responsividade e uso móvel | Sim | ⬜ | |
| L-03 | Acessibilidade rápida: contraste, foco de teclado, texto alternativo, legendas | WCAG 2.2 AA | ⬜ | |
| L-04 | Estados vazios, mensagens de erro, microcopy | — | ⬜ | |

## 4. Ficha de achado (um por funcionalidade relevante)

```text
ID do achado:        JNE-0001
Bloco/Item:          (ex.: F-05)
Descrição neutra:    (o que o site faz, em linguagem própria — sem copiar texto)
Evidência:           (arquivo em evidencias/juntos-na-escola/ + URL + data/hora)
Pontos fortes:
Pontos fracos / lacunas:
Requisito APEX relacionado: (ex.: RF-LMS-014)
Decisão:             [ ] Adotar  [ ] Superar  [ ] Evitar  [ ] Fora de escopo
Justificativa:
```

## 5. Matriz de rastreabilidade (preencher após o levantamento)

| Achado | Bloco | Requisito APEX (Doc 05) | Documento a atualizar | Decisão |
|---|---|---|---|---|
| _(vazio)_ | | | | |

## 6. Critérios de conclusão (Definition of Done da análise)

- [ ] Todos os blocos A–L com status diferente de ⬜ (ou justificativa explícita de "não aplicável").
- [ ] Mínimo de **3 fluxos gravados/capturados**: (1) descoberta → cadastro, (2) catálogo → compra (se houver), (3) aula → avaliação → certificado.
- [ ] Evidências arquivadas com data e origem em `docs/apex-cursos-livres/evidencias/juntos-na-escola/`.
- [ ] Textos legais do site (termos, privacidade, reembolso, claims de certificado) **arquivados** para comparação com o Doc 16.
- [ ] Matriz de rastreabilidade preenchida e revisada pelo PM.

## 7. Documentos que serão revisados após a análise

| Documento | O que pode mudar |
|---|---|
| [01 Benchmark](01-pesquisa-benchmark.md) | Nova seção 2.12 com o perfil do site e seu posicionamento no mapa |
| [04 PRD](04-prd.md) / [05 RF](05-requisitos-funcionais.md) | Funcionalidades adicionais ou priorização alterada |
| [07 Formatos de produto](07-catalogo-formatos-produto.md) | Formatos/regras de certificação observados |
| [14 UX](14-ux-jornadas-telas.md) | Jornadas e padrões de navegação |
| [16 Jurídico](16-juridico-compliance.md) | Comparação de termos e claims |

## 8. Impacto no cronograma

A ausência desta análise **não bloqueia** a Fase 0/1: o escopo da APEX foi definido a partir das **referências de mercado** do [Doc 01](01-pesquisa-benchmark.md) (plataformas brasileiras e globais de cursos, comunidades, LMS corporativo e tutores de IA). O risco é de **aderência**: se o site tiver um diferencial específico (p. ex., modelo B2G com escolas/redes públicas), ele **não está contemplado** nos documentos atuais e seria incorporado como épico adicional. Registrado como **risco R-12** no [Doc 19](19-roadmap-backlog-equipe.md).
