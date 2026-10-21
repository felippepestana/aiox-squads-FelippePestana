# 15 — Identidade Visual APEX

> **APEX Plataforma de Cursos Livres** · Documento 15 · v1.0 · 21/10/2026 · Status: **Proposta criada, pendente de busca de marca (INPI) e revisão de designer**
> **Brandboard visual (artefato):** <https://claude.ai/artifact/AAF3PDitweqB3kpTZnZHCF> *(privado; compartilhar pelo menu da página)*
> Arquivos: [`brand/`](brand/) — logotipos SVG, [`tokens.css`](brand/tokens.css), [`tokens.json`](brand/tokens.json), [`brandboard.html`](brand/brandboard.html)

## 1. Contexto e decisões

| Decisão | Escolha | Motivo | Estado |
|---|---|---|---|
| **Nome** | **APEX Plataforma de Cursos Livres** (nome completo) · **APEX** (uso corrente) · **APEX Cursos Livres** (descritor em peças formais) | Nome pedido pelo patrocinador; "ápice" traduz a promessa de chegar ao ponto mais alto | Definido |
| **Relação com a marca "ApeX" existente** | **Família compatível, marca própria.** Mantém o **laranja `#FF6B00`**, as fontes **Inter** e **JetBrains Mono** e o conceito de ápice; troca o fundo carbono por **índigo + claro como padrão** e a fonte de títulos por **Sora** | O repositório já contém o brandbook "ApeX" (portal de RH, estética escura, laranja de ação). A nova marca é educacional (claro, acolhedora) mas pode conviver no mesmo ecossistema | **Proposta — depende da decisão Q-06** |
| **Conceito** | O **ponto mais alto de quem aprende**: um pico (Λ) com um ponto laranja acima, que também lê como uma **pessoa de braços erguidos** | Uma forma, duas leituras (trajetória + pessoa) | Definido |
| **Tagline** | **"Seu ápice começa aqui."** | Curta, promissora sem prometer resultado | Proposta |

> ⚠️ **Risco de marca (R-10):** "APEX/Apex" é um nome **muito comum**, inclusive em software e tecnologia, e já existe a marca "ApeX" neste projeto. **Nenhuma busca de anterioridade no INPI foi feita.** Antes de investir em domínio, mídia ou registro, é necessário consultar as classes **9** (software), **35** (comércio/publicidade), **41** (educação) e **42** (SaaS/tecnologia), idealmente com um advogado de propriedade intelectual. Disponibilidade de domínio e perfis em redes **não foi verificada**; sugestões como `apexcursoslivres.com.br` são apenas ideias a conferir no Registro.br.

## 2. Arquitetura de marca

```text
APEX Plataforma de Cursos Livres        ← marca-mãe (produto: a plataforma)
├── APEX Pass            assinatura do catálogo
├── APEX Certificados    emissão e verificação pública
├── APEX Tutor           tutor de IA do aluno
├── APEX Studio          criação de cursos com IA (instrutor)
├── APEX Radar           analytics conversacional (gestão)
├── APEX Vendas          assistente comercial de IA
├── APEX Guardian        compliance (interno; aparece ao instrutor como "Verificação de conformidade")
└── APEX para Empresas   licenças corporativas (B2B)
```

Regra de nomenclatura: **"APEX" + palavra funcional em português do Brasil, sem criar siglas novas**. Agentes de IA sempre exibem o selo **IA**.

## 3. Logotipo

### 3.1 Construção

- **Símbolo:** um traço em Λ (pico) de espessura 9 em um quadro 64×64, juntas e terminais arredondados, com um **ponto de diâmetro 13** acima do vértice, em laranja. Arquivo: `apex-symbol.svg`.
- **Logotipo (wordmark):** as letras **A, P, E, X** desenhadas com o **mesmo traço (espessura 8)** e terminais arredondados; o **A é o próprio pico, sem a barra**, com o ponto flutuando acima. Desenhado em traços geométricos (sem fonte), portanto **independente de fontes instaladas**.
- **Ícone de app:** quadrado arredondado (raio 28/128) em **índigo**, símbolo branco e ponto laranja. Arquivo: `apex-app-icon.svg`.
- **Favicon:** versão com traço mais grosso para 32 e 16 px. Arquivo: `apex-favicon.svg`.

### 3.2 Versões e uso

| Arquivo | Uso |
|---|---|
| `apex-logo.svg` | Principal: letras índigo `#4338CA` + ponto laranja, sobre claro |
| `apex-logo-reverse.svg` | Sobre fundos escuros (letras brancas, ponto laranja) |
| `apex-logo-mono-ink.svg` | Uma cor, sobre claro (Ink `#0B1020`) — documentos, carimbos, impressão P&B |
| `apex-logo-mono-white.svg` | Uma cor, sobre fundos coloridos (branco) |
| `apex-symbol.svg` / `apex-symbol-reverse.svg` | Símbolo isolado (avatar, selo, marca d'água) |
| `apex-app-icon.svg`, `apex-favicon.svg` | Aplicativos, navegador |

- **Área de respiro:** margem **x** em todos os lados, com **x = diâmetro do ponto** (11,2 unidades na grade do logotipo).
- **Tamanho mínimo:** logotipo **72 px** de largura (digital) ou **20 mm** (impresso); símbolo **16 px**.
- **Não fazer:** letras em laranja · esticar ou comprimir · adicionar a barra do A · versão colorida sobre índigo (contraste baixo) · efeitos, sombras e degradês · recolorir fora das versões oficiais · redesenhar.

### 3.3 Verificação feita

Os oito SVGs foram **renderizados em Chromium** sobre fundos claro, escuro, índigo e cinza, e vistos nos tamanhos normal, de app e de favicon (32 e 16 px). Um defeito foi encontrado e corrigido durante a verificação do brandboard: ao reutilizar o logotipo via `<symbol>`, a origem do `viewBox` cortava a barra inferior do "E" (parecia "F"); os arquivos `.svg` isolados nunca tiveram o problema.

> **Limites:** o desenho das letras é uma proposta construída por geometria; **não passou por revisão de um designer nem por teste de reconhecimento**. Recomenda-se refino tipográfico profissional antes do registro.

## 4. Cor

### 4.1 Paleta principal

| Nome | Hex | Papel | Observação |
|---|---|---|---|
| **Índigo Cume** | `#4338CA` | Ação principal, links, logotipo | Texto branco sobre ele: **7,90:1** |
| **Laranja Ápice** | `#FF6B00` | Ponto do símbolo, conclusão, botão de compra | **Sempre com texto Ink (6,63:1)**; **nunca** como texto sobre claro |
| **Ink** | `#0B1020` | Texto principal, fundo escuro | 18,93:1 sobre branco |
| **Névoa** | `#F6F7FB` | Fundo de página | Neutro com viés azul |
| **Laranja 700** | `#B84700` | Único laranja permitido para **texto** sobre claro | 5,33:1 sobre branco |
| **Índigo claro** | `#9A9CFF` | Ação e links no **tema escuro** | 8,07:1 sobre `#070A14` |

Escala completa (índigo 50–950, laranja, neutros) em [`brand/tokens.css`](brand/tokens.css) e [`tokens.json`](brand/tokens.json), **gerados a partir de uma única fonte** (`scripts/gen_tokens.py`), com verificação de que CSS e JSON coincidem.

### 4.2 Papéis semânticos (claro / escuro)

| Papel | Claro | Escuro |
|---|---|---|
| Fundo / superfície | `#F6F7FB` / `#FFFFFF` | `#070A14` / `#0F1426` |
| Texto / texto secundário | `#0B1020` / `#4B5470` | `#EDEFF7` / `#A9B0CC` |
| Primário / sobre primário | `#4338CA` / `#FFFFFF` | `#9A9CFF` / `#070A14` |
| Acento / sobre acento | `#FF6B00` / `#0B1020` | `#FF7A1A` / `#070A14` |
| Sucesso (texto / fundo) | `#0E7C3A` / `#E6F6EC` | `#3DD68C` / `#0E2A1E` |
| Alerta | `#9A5B00` / `#FFF4DB` | `#FBBF24` / `#2B2208` |
| Erro | `#C4271B` / `#FDECEA` | `#FF8A80` / `#2E1513` |
| Informação | `#1D5FD1` / `#E8F0FD` | `#7FB2FF` / `#0F1F3A` |

### 4.3 Contraste verificado (WCAG 2.2)

**36 pares de texto e fundo** (18 por tema) foram calculados e **todos passam em AA** (≥ 4,5:1); o menor valor é **4,73:1**. Destaques:

| Par | Razão | Resultado |
|---|---|---|
| Ink sobre branco | 18,93:1 | AA |
| Índigo `#4338CA` sobre branco / branco sobre índigo | 7,90:1 | AA |
| Ink sobre laranja `#FF6B00` | 6,63:1 | AA |
| **Laranja `#FF6B00` sobre branco (texto)** | **2,86:1** | **Reprova — não usar** |
| **Branco sobre laranja** | **2,86:1** | **Reprova — não usar** |
| Laranja 700 sobre branco | 5,33:1 | AA |
| Texto `#EDEFF7` sobre `#070A14` | 17,21:1 | AA |
| Índigo claro sobre `#070A14` | 8,07:1 | AA |

### 4.4 Regras de uso

1. **Proporção proposta:** neutros ~70% · índigo ~20% · laranja ≤ 5% · semânticas ~5%.
2. **Um laranja por tela** (o ponto, o botão de compra ou o selo de conclusão).
3. **Estado nunca é só cor:** sempre cor + texto ou ícone.
4. **Sem degradês de marca**; cores entram chapadas.
5. **Tema escuro é de primeira classe:** o índigo clareia (`#9A9CFF`) e o laranja sobe para `#FF7A1A`.

### 4.5 Paleta para gráficos (verificada para daltonismo)

Cores categóricas **para até 5 séries**, escolhidas por busca entre candidatos de marca, medindo a distância de cor (ΔE CIE76) **entre todos os pares**, no olhar normal e simulando protanopia, deuteranopia e tritanopia (matrizes de Machado et al., 2009):

| Série | Hex | Contraste gráfico sobre branco (≥ 3:1) |
|---|---|---|
| 1 Índigo | `#4338CA` | 7,90:1 |
| 2 Azul-céu | `#1D8FD1` | 3,56:1 |
| 3 Rosa | `#E0457B` | 3,96:1 |
| 4 Ink | `#0B1020` | 18,93:1 |
| 5 Dourado | `#B7791F` | 3,64:1 |

**Pior distância entre qualquer par, em qualquer tipo de visão: ΔE ≈ 29,9** (com 4 séries: 37,0). Uma primeira tentativa com 6 cores, incluindo laranja e dourado juntos, **falhou** (ΔE 4,3 entre laranja e dourado na protanopia) e foi descartada.

Regras: **máximo 5 séries**; rótulo direto na linha/barra sempre que possível; o **laranja da marca fica reservado ao destaque** (a série que a pessoa deve olhar). **Não validado:** variantes dessas cores para o tema escuro (Ink some sobre fundo noite) — definir e testar na implementação.

## 5. Tipografia

| Papel | Fonte | Pesos | Uso |
|---|---|---|---|
| **Display e títulos** | **Sora** | 600–700 | Títulos, números de destaque, nomes de produto |
| **Texto e interface** | **Inter** | 400–600 | Corpo, formulários, tabelas |
| **Dados e rótulos** | **JetBrains Mono** | 400–500 | Códigos (certificado, pedido), KPIs, sobretítulos, marcas de tempo |

Inter e JetBrains Mono são as mesmas da marca ApeX (continuidade); Sora dá aos títulos geometria aberta próxima à do logotipo. As três são de **licença livre (SIL OFL)** e carregadas pelo Google Fonts, com pilha de *fallback* (`system-ui`, etc.).

**Escala:** Display `clamp(40–64px)/1,05` · H1 `32–44px/1,1` · H2 `28px/1,2` · H3 `20px/1,3` · Corpo-L `18/1,6` · Corpo `16/1,6` · Pequeno `14/1,5` · Legenda `12/1,4` · Sobretítulo `12px`, caixa-alta, espaçamento `0,14em`. Largura de leitura máxima ~65 caracteres. Números tabulares onde há colunas.

> **Não verificado:** o carregamento das fontes no navegador do viewer (a pré-visualização feita aqui não alcança o Google Fonts). A pilha de *fallback* garante legibilidade se falhar.

## 6. Dispositivo gráfico: "picos aninhados"

A forma do símbolo repetida em **picos concêntricos de traço fino** (curvas de nível) é o motivo gráfico da marca: aparece em capas de curso, fundo do herói, moldura do certificado e estados vazios. O pico mais recente (progresso atual) ganha o índigo; o **ponto laranja** marca o topo. Usar com traços finos e baixa opacidade; **nunca** sobre texto corrido.

## 7. Interface (fundamentos)

| Item | Regra |
|---|---|
| **Raio** | 8 px (pequeno) · **12 px (controles)** · **16 px (superfícies)** · 24 px (destaques) |
| **Espaço** | Base 4 px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 |
| **Elevação** | Bordas sutis e superfícies planas; sombra só em camadas flutuantes (menus, diálogos) |
| **Alvos de toque** | ≥ 44 px |
| **Foco** | Anel de 2 px em índigo (claro) / índigo claro (escuro), deslocamento de 2 px — sempre visível |
| **Movimento** | 120/200/320 ms; curva "ascensão" `cubic-bezier(0.2, 0.8, 0.2, 1)`; microcelebração de conclusão discreta; `prefers-reduced-motion` desliga |
| **Progresso** | Barra índigo com **marcador laranja no ponto atual** (o "ápice" do aluno) |
| **Ícones** | Traço 1,75 px, cantos arredondados, grade 24 px (conjunto aberto, ex.: Lucide) |
| **Imagens** | Pessoas reais e diversas do Brasil, em situações de estudo/trabalho; evitar banco de imagens genérico; texto alternativo sempre |

Componentes de referência (cartão de curso, progresso, tutor, resumo de compra, certificado) estão no brandboard.

## 8. Aplicações

### 8.1 Certificado (modelo)

Elementos **obrigatórios** (derivados do checklist `squads/education/checklists/mec-curso-livre-check.md` e das regras do Guardião):

1. Marca APEX e **nome do certificado** ("Certificado de Conclusão" ou "de Participação").
2. Selo textual **"CURSO LIVRE"**.
3. Nome da pessoa, nome do curso e **carga horária**; data.
4. Texto: *"Este é um certificado de curso livre e não equivale a ensino regulamentado."*
5. **Código único + QR** para a página pública de verificação.
6. **Proibidos:** brasão/logotipo do MEC ou de órgãos públicos, expressões "reconhecido pelo MEC", "validade nacional", "diploma", e equivalência com graduação, pós ou técnico.

### 8.2 E-mail, redes e peças

- **E-mail:** cabeçalho com logotipo (versão principal), corpo em 16 px, um botão de ação por e-mail, rodapé com CNPJ, endereço, **descadastro em um clique** e canal de atendimento.
- **Redes:** fundo Névoa ou Ink, logotipo no canto, uma frase de impacto em Sora, um laranja por peça. Cortes de aula com legenda.
- **Página de venda:** herói com promessa **sem garantia de resultado**, prova social verificada, garantia de 7 dias, preço final.

### 8.3 Identidade dos agentes de IA

| Agente | Avatar | Rótulo | Tom |
|---|---|---|---|
| APEX Tutor | Símbolo em círculo `primary-soft` | **IA** sempre visível | Paciente, socrático, cita a fonte |
| APEX Vendas | Símbolo em círculo `surface-2` | **IA** + "Assistente virtual" | Claro, sem pressão, sem promessas |
| APEX Studio / Guardian | Ícone de ferramenta (sem rosto) | "Assistente de IA" | Técnico, objetivo |

Sem avatares humanos fictícios e sem nomes de pessoa para agentes: evitar a impressão de que se fala com um humano.

## 9. Voz e tom

Português do Brasil, tratamento por **"você"**. Direta, calorosa, sem exagero. Dizemos o que acontece e o que fazer. **Não** prometemos resultado, **não** pressionamos e **não** sugerimos que o certificado vale mais do que vale.

| Diga | Evite |
|---|---|
| Você assistiu 62% do curso. Faltam 3 aulas. | Parabéns, campeão! Não pare agora!!! |
| Reembolso em até 7 dias, direto no painel. | Garantia total de sucesso. |
| Curso livre com certificado de conclusão. | Certificado reconhecido pelo MEC. |
| Não encontrei isso no curso. Quer falar com a equipe? | Desculpe, não entendi. |
| O Pix expirou. Gere um novo código para continuar. | Erro 504: falha na transação. |
| Faltam 12 vagas para esta turma. *(se for verdade)* | Últimas vagas! Corra! *(quando não é verdade)* |

## 10. Acessibilidade da marca

Contraste AA em todos os pares de tokens (§4.3) · foco visível · tema escuro e claro · `prefers-reduced-motion` · alvos de 44 px · texto alternativo no logotipo (`<title>`/`aria-label`: "APEX") · estado nunca apenas por cor · paleta de gráficos verificada para daltonismo (§4.5).

## 11. Entregáveis e pendências

| Entregável | Estado |
|---|---|
| 8 arquivos SVG (logotipos, símbolo, ícone, favicon) | ✅ criados e renderizados |
| `tokens.css` e `tokens.json` (claro/escuro) | ✅ gerados e consistentes |
| Brandboard visual (HTML + artefato) | ✅ publicado (privado) |
| Busca de anterioridade no INPI (classes 9, 35, 41, 42) | ⬜ **pendente** |
| Verificação de domínio e perfis | ⬜ **pendente** |
| Decisão sobre a relação com a marca ApeX (Q-06) | ⬜ **pendente** |
| Revisão do desenho do logotipo por designer; testes de reconhecimento | ⬜ recomendada |
| Variantes da paleta de gráficos para o tema escuro | ⬜ a definir |
| Modelos de e-mail, redes e apresentação | ⬜ Fase 1–2 |
| Biblioteca de ilustrações/ícones e fotografia | ⬜ Fase 1–2 |
