# 04 — Handoff para o Claude Design

Como usar o **Claude Design** (claude.ai) para gerar as telas dos 3 ambientes da plataforma, com prompts prontos derivados do blueprint (seção E).

## Fluxo de trabalho recomendado

1. **Prepare o prompt** — copie o bloco de design tokens abaixo + o prompt da tela desejada (seções seguintes). Cole os dois juntos no Claude Design.
2. **Gere e itere** — refine na conversa ("aumente a densidade da tabela", "estado vazio mais acolhedor no portal do devedor"). Itere uma tela por vez; mantenha a mesma conversa por ambiente para consistência visual.
3. **Valide contra o checklist** — estados (vazio/loading/erro/sucesso), contraste AA, responsividade (obrigatória no portal do devedor).
4. **Importe para o projeto** — o Claude Design gera um link compartilhável do design. Duas rotas:
   - **Vercel/Netlify MCP:** as ferramentas `import-claude-design-from-url` (disponíveis nos conectores Vercel e Netlify desta conta) importam o design direto como projeto/deploy a partir da URL.
   - **Código de referência:** exporte/copar o código gerado e adapte para os componentes do design system do repo (`web/client/src/design-system/`), materializando os tokens abaixo em `tokens.css`.
5. **Ordem sugerida de geração:** Portal do devedor (mais crítico e menor) → Dashboard da instituição → Backoffice (maior superfície).

> Dica: o Claude Design funciona melhor com prompts que descrevem **conteúdo real** (números, nomes de status em português, valores em R$) do que com descrições abstratas. Os prompts abaixo já vêm assim.

## Bloco de design tokens — "Toga Noturna" (colar em TODO prompt)

```text
IDENTIDADE VISUAL — "Toga Noturna" (banca de advocacia, mote "A banca que prova o número"):
- Base escura sóbria: fundo preto/azul-noite (#0A0E1A a #101828), superfícies elevadas em azul-escuro.
- Cores de status: verde (recuperado/quitado), âmbar (em negociação), vermelho sóbrio (judicial/crítico), cinza (prescrito/perda).
- Tipografia: serifada institucional para títulos (autoridade jurídica, ex. estilo Playfair/Source Serif), sans-serif legível para dados e tabelas (ex. Inter).
- Tom: institucional, sóbrio, transmite confiança jurídica — nunca "fintech divertida".
- Acessibilidade: contraste mínimo WCAG AA em todo texto, navegação por teclado, labels ARIA.
- Componentes recorrentes: tabelas densas com ordenação/filtro, cards de KPI, kanban, timeline vertical, badges de status coloridos, gráficos de barras (aging) e linha (recuperação).
- Estados obrigatórios em toda tela: vazio (com CTA), loading (skeletons), erro (mensagem acionável), sucesso (confirmação clara).
- Idioma da interface: português brasileiro.
```

---

## Ambiente 1 — Portal do devedor (mobile-first, PRIORITÁRIO)

> Acrescente ao bloco de tokens: "Este ambiente é MOBILE-FIRST obrigatório — a maioria dos devedores acessa por celular. Aqui o tom é acolhedor e sem julgamento (nunca constranger o devedor), mantendo a sobriedade da marca. Textos simples, sem juridiquês."

**Prompt — Login + Meus débitos:**
```text
Crie as telas mobile de um portal onde responsáveis financeiros negociam mensalidades escolares em atraso:
1) LOGIN: campo único de CPF + botão "Consultar meus débitos"; segunda etapa com código de verificação recebido por WhatsApp. Texto de privacidade curto (LGPD).
2) MEUS DÉBITOS: saudação pelo primeiro nome; card de resumo "Você tem 4 mensalidades em aberto — total atualizado R$ 3.847,20"; lista de parcelas (Colégio Exemplo — mensalidade 03/2025 — venceu há 8 meses — R$ 890,00); CTA primário grande "Simular acordo com desconto"; link secundário "Falar com atendimento (WhatsApp)".
Estados: vazio ("Você não possui débitos — tudo certo!"), loading, erro de CPF não encontrado.
```

**Prompt — Simulador de acordo + Pagamento:**
```text
Crie as telas mobile de simulação e pagamento de acordo:
1) SIMULADOR: valor original vs. valor com desconto em destaque (ex.: de R$ 3.847,20 por R$ 2.692,90 — 30% de desconto à vista); seletor/slider de parcelas (1x a 12x) mostrando valor da parcela e total em tempo real; aviso "desconto válido até 31/08"; botão "Fechar acordo".
2) ACEITE: resumo do acordo + checkbox de aceite eletrônico da confissão de dívida (texto resumido com link para o documento completo).
3) PAGAMENTO: abas Pix (QR code + copia-e-cola com botão copiar) e Boleto (código de barras + baixar PDF); tela de sucesso pós-pagamento com comprovante e próximas parcelas.
Estados: sucesso do pagamento (confirmação verde + comprovante), erro de emissão, loading da simulação.
```

## Ambiente 2 — Portal da instituição (cliente)

**Prompt — Dashboard da carteira:**
```text
Crie um dashboard desktop para o gestor financeiro de uma escola acompanhar a carteira de inadimplência entregue ao escritório:
- Linha de KPIs: Carteira total R$ 412.500 | Recuperado R$ 87.300 (21,2%) | Em negociação R$ 64.000 | Acordos ativos: 37.
- TABELA DE AGING com heatmap: colunas 0–30, 31–60, 61–90, 91–180, 180+, Prescrito; linhas por série/turma; células coloridas por intensidade; drill-down ao clicar.
- Gráfico de linha "Recuperação acumulada (R$) por mês" e gráfico de barras por faixa de aging.
- Lista "Devedores em destaque" com status (badge: notificado / negociando / acordo / negativado).
- Botão "Exportar CSV" e seletor de período.
Estados: carteira vazia (CTA "Aguardando primeira importação"), loading com skeletons.
```

**Prompt — Fila de aprovações de alçada (V1, gerar depois):**
```text
Crie a tela de aprovações: fila de solicitações de desconto que excedem a alçada do escritório. Card por solicitação: devedor (iniciais + CPF mascarado), valor original, desconto proposto (%), justificativa, aging. Ações: Aprovar / Rejeitar / Contrapropor (abre campo de novo %). Histórico de decisões abaixo. Estado vazio: "Nenhuma aprovação pendente".
```

## Ambiente 3 — Backoffice do escritório

**Prompt — Dashboard geral + Kanban da esteira:**
```text
Crie o backoffice de uma operação de cobrança conduzida por advogados:
1) DASHBOARD: KPIs (carteiras ativas, valor sob gestão, recuperado no mês, taxa de CPC, acordos fechados hoje); gráfico de recuperação; alertas (ex.: "12 parcelas prescrevem em 30 dias").
2) KANBAN DA ESTEIRA EXTRAJUDICIAL: colunas Notificado → Negociando → Acordo → Negativado → Protestado → Judicial → Quitado → Prescrito/Perda; cards com nome do devedor, instituição, valor atualizado, aging (badge colorido), próximo prazo; filtros por carteira/instituição/faixa de valor; contadores por coluna.
Estados: loading, coluna vazia.
```

**Prompt — Timeline do devedor + Inbox de negociações:**
```text
Crie duas telas do backoffice:
1) FICHA DO DEVEDOR: dados (CPF mascarado, telefones, e-mail), parcelas com status, e TIMELINE VERTICAL de eventos de cobrança — cada item com ícone do canal (WhatsApp/e-mail/ligação), timestamp, resultado ("mensagem entregue", "CPC — contato com pessoa certa", "recusou proposta"). Esta timeline é prova de conduta correta, então deve ser completa e legível.
2) INBOX DE NEGOCIAÇÕES WHATSAPP: lista de conversas à esquerda (nome, última mensagem, badge de status do acordo), conversa ao centro, painel direito com resumo do débito e botão "Aplicar desconto dentro da alçada" + "Escalar para aprovação".
```

## Checklist de qualidade por tela gerada

- [ ] Estados vazio/loading/erro/sucesso presentes
- [ ] Contraste AA (testar texto sobre fundo escuro)
- [ ] Portal do devedor: usável com uma mão em 375px de largura
- [ ] Nenhum texto que constranja o devedor (revisar contra doc 05, regra CDC art. 42)
- [ ] Valores prescritos aparecem APENAS no backoffice/instituição (nunca como cobráveis ao devedor)
- [ ] Badges de status seguem o mapeamento de cores dos tokens
