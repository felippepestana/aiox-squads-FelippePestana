# Especificação Visual — Cena STANDBY

## Visão geral

A cena STANDBY é a primeira impressão da audiência. Aparece antes do GO LIVE
e exibe um cronômetro regressivo até o início da transmissão.

## Dimensões

- Canvas: 1920×1080 px
- Formato: PNG (preferido) ou JPG (qualidade 90+)
- Cor: RGB (sem alpha; se usar PNG com alpha, renderizar sobre fundo da identidade)

## Layout

```
┌──────────────────────────────────────────────┐  1920px
│                                              │
│              [LOGO 400×200]                  │
│                                              │
│        A transmissão iniciará em             │
│                                              │
│             ┌──────────┐                     │
│             │  04:32   │  ← cronômetro       │
│             └──────────┘                     │
│                                              │
│       Próxima sessão: <título>               │
│                                              │
└──────────────────────────────────────────────┘  1080px
```

### Zonas reservadas (não cobrir com gráficos do fundo)

| Zona | Coordenadas (x,y - w×h) | Conteúdo |
|---|---|---|
| LOGO | 760, 220 — 400×200 | Logo da operação |
| TEXTO_TOPO | 460, 470 — 1000×80 | "A transmissão iniciará em" |
| CRONÔMETRO | 760, 580 — 400×140 | Timer regressivo (renderizado pelo plugin) |
| TEXTO_BASE | 460, 760 — 1000×60 | "Próxima sessão: {título}" |

### Regra de contraste

- Fundo dessas zonas deve ter luminância ≤ 30% para texto branco
- OU
- Fundo claro com texto escuro (cor primária da marca)

## Tipografia

- Família: Sans-serif legível (Inter, Roboto, Source Sans 3, ou da marca)
- Texto-topo: 64pt, peso 500
- Cronômetro: 128pt, peso 700, **monoespaçado** (Roboto Mono, JetBrains Mono)
- Texto-base: 48pt, peso 400

## Cores

Definir antes de gerar a imagem:

- Primária da marca: `#______`
- Secundária da marca: `#______`
- Fundo: `#______` (geralmente escuro)
- Texto principal: `#FFFFFF` (se fundo escuro)

## Elementos opcionais

- Padrão sutil no fundo (geometria, gradiente leve) — sem competir com texto
- Marca d'água da operação no rodapé direito (16pt, opacity 40%)
- Logos de patrocinadores no rodapé (alinhados horizontalmente, máx. 4)

## Entregas para o operador

Pasta de assets do evento deve conter:

- `standby_bg_<evento>.png` (1920×1080) — fundo
- `logo.png` — logo principal
- `título_da_sessão.txt` — texto a ser carregado dinamicamente

Pasta NÃO está versionada no repo (assets de marca).

## Variantes

- **STANDBY_DEFAULT**: fundo padrão da operação
- **STANDBY_<evento>**: fundo específico de evento (opcional)

## Checklist de validação

- [ ] Imagem 1920×1080
- [ ] Zonas reservadas livres de gráficos competidores
- [ ] Contraste suficiente para texto branco/escuro
- [ ] Logo legível a 720p (algumas câmeras de audiência podem ver assim)
- [ ] Cronômetro renderiza sobre fundo limpo
- [ ] Versão clara e versão escura disponíveis (opcional)
