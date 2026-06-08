# ApeX — Identidade Visual (Brand Book v1.0)

> Fonte: [`ApeX-Brandbook-v1.0.pdf`](ApeX-Brandbook-v1.0.pdf) — Manual de Identidade Visual · v1.0 · 2026.
> Este documento traduz o brand book para os tokens do design system web (`web/client/src/design-system/`).

## Conceito

A **ApeX** nasce do conceito de *ápice* — o ponto mais alto de competência e compatibilidade comportamental. Estética **premium escura** com **acentos laranja vibrantes**, comunicando alta performance, precisão técnica nos dados e vanguarda em RH.

- **Alta performance** — velocidade e resultado mensurável; energia sem ruído.
- **Precisão técnica** — dados comportamentais com rigor matemático (refletido no uso de fontes monoespaçadas).
- **Vanguarda em RH** — inteligência DISC e análise de tom em tempo real, visual imersivo.

## Paleta oficial

| Nome | Hex | Uso | Token DS |
|------|-----|-----|----------|
| Carbono Profundo | `#020202` | Fundo principal, imersão, foco | `--ds-bg` |
| Grafite de Interface I | `#0A0A0A` | Cartões e painéis | `--ds-panel` |
| Grafite de Interface II | `#171717` | Divisores, bordas, hover | `--ds-panel-2` / `--ds-border` |
| Laranja Elétrico | `#FF6B00` | **Ações primárias**, destaques, ícones ativos | `--ds-accent` |
| Âmbar de Transição | `#F59E0B` | Progresso intermediário, alertas suaves | `--ds-warn` |
| Branco Puro | `#FFFFFF` | Texto corrido, alto contraste | `--ds-text` |
| Vermelho de Alerta | `#E5484D` | Erros / estados destrutivos | `--ds-danger` |

**Proporção de uso:** 60% carbono · 20% grafite I · 8% grafite II · 7% laranja · 2% âmbar · 3% branco.
O **laranja é reservado exclusivamente à ação** — nunca usar âmbar em botões primários.

## Tipografia

| Nível | Fonte | Peso | Tamanho / entrelinha | Uso |
|-------|-------|------|----------------------|-----|
| H1 | Space Grotesk | 700 | 56–104px / 1.05 | Títulos de página e capas |
| H2 | Space Grotesk | 700 | 32–40px / 1.15 | Seções e cards de destaque |
| Body | Inter | 400–600 | 15–17px / 1.6 | Texto corrido, formulários |
| Data | JetBrains Mono | 500–700 | 12–34px / 1.3 | KPIs, scores, timestamps, labels |
| Overline | JetBrains Mono | 500 | 12–13px / tracking 0.3–0.4em | Kickers e categorias |

- **Display:** Space Grotesk Bold (alternativa: Outfit) → `--ds-font-display`
- **Interface/leitura:** Inter → `--ds-font`
- **Dados/métricas:** JetBrains Mono → `--ds-font-mono`

## Sistema UI

- **Cantos arredondados generosos** (`rounded-xl`, raio 14–16px) — `--ds-radius-lg`.
- Superfícies **grafite sobre carbono**; o **laranja reservado à ação**.
- **Botões:** raio 14–16px · texto `#020202` sobre laranja · nunca âmbar em primários.
- **Tags/estados:** Laranja = concluído/ativo · Âmbar = progresso intermediário · Grafite = neutro.
- **Campo de entrada:** foco sinalizado por **borda laranja + halo suave (15% de opacidade)**.
- **Barra de progresso:** transição âmbar → laranja indica aproximação do ápice.

## Aplicação no projeto

Os tokens acima estão implementados em:

- `web/client/src/design-system/tokens.css` — variáveis de cor, tipografia e raio.
- `web/client/src/design-system/components.css` — botões, campos, badges, stepper.
- `web/client/src/styles.css` — tema base do app (chat, sidebar, composer).
- `web/client/index.html` — carregamento das fontes (Space Grotesk, Inter, JetBrains Mono).

Tema escuro é o padrão (estética premium escura). O tema claro (`data-theme="light"`) preserva o laranja como cor de ação sobre fundos claros para as minutas/impressos.
