# Task: Configurar STANDBY (Tela de Espera com Cronômetro)

```yaml
task_name: "Configurar cena STANDBY com cronômetro regressivo"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "2h"
quality_gate: QG-STANDBY
dependencies:
  - build-scene-pack.md

input:
  - "Cena STANDBY criada (esqueleto)"
  - "Imagem branded 1920×1080 (PNG/JPG)"
  - "Logo da operação"
  - "Plugin obs-advanced-timer instalado"

output:
  - "STANDBY com fundo + logo + texto + cronômetro + título da sessão"
  - "Cronômetro com precisão ±1s"
  - "Trigger automático STANDBY → CAM1 (configurável)"
  - "Cena ENCERRAMENTO complementar"
```

## Action Items

### 1. Preparar imagem de fundo

- [ ] Receber imagem branded de design (1920×1080, formato PNG ou JPG)
- [ ] Conferir contraste suficiente para texto branco no centro
- [ ] Salvar em pasta de assets do OBS (fora do repo)
- [ ] Especificações em `templates/standby-image-spec.md`

### 2. Compor cena STANDBY

Estrutura visual:

```
┌─────────────────────────────────────┐
│  [Imagem branded 1920×1080]         │
│                                     │
│        LOGO (centralizado)          │
│                                     │
│   "A transmissão iniciará em"       │
│                                     │
│            00:04:32                 │  ← cronômetro
│                                     │
│    Próxima sessão: <título>         │
└─────────────────────────────────────┘
```

- [ ] Adicionar fonte: Imagem (background branded)
- [ ] Adicionar fonte: Imagem (logo) — centralizada
- [ ] Adicionar fonte: Texto (GDI+ ou FreeType2)
  - Texto: "A transmissão iniciará em"
  - Fonte: Sans-serif legível, 64pt, branco
- [ ] Adicionar fonte: **Advanced Timer** (plugin obs-advanced-timer)
  - Cor: branco
  - Fonte: 128pt monoespaçada
  - Formato: `MM:SS`
- [ ] Adicionar fonte: Texto (título da sessão)
  - Variável dinâmica configurável por evento

### 3. Configurar cronômetro

#### Modo absoluto (preferido)

- [ ] Plugin: definir tempo-alvo em hh:mm:ss
- [ ] Cronômetro contagem regressiva até zero

#### Modo relativo (ensaio)

- [ ] Plugin: definir duração em minutos
- [ ] Iniciar manualmente

### 4. Trigger automático STANDBY → CAM1

Opção A — via obs-websocket script:

- [ ] Criar script Python ou Lua que escuta evento `TimerComplete`
- [ ] Disparar `SetCurrentProgramScene CAM1`

Opção B — manual (mais simples para v1):

- [ ] Operador clica GO LIVE quando cronômetro zera
- [ ] Visual feedback: cronômetro pisca ou muda de cor a 30s do fim

> Esta release entrega a Opção B como default e a Opção A como flag opcional.

### 5. Criar cena ENCERRAMENTO

- [ ] Nova cena com imagem branded + texto "Obrigado por participar"
- [ ] Créditos em rodapé
- [ ] Sem cronômetro

### 6. Validar precisão

- [ ] Configurar cronômetro de 5 min
- [ ] Cronometrar com relógio externo
- [ ] Desvio máximo aceitável: ±1 segundo

### 7. Validar transição

- [ ] STANDBY no programa
- [ ] Aguardar zero (ou disparar manual)
- [ ] Confirmar transição limpa para CAM1
- [ ] Sem flicker visual

## Acceptance Criteria

- ✅ Cena STANDBY mostra fundo + logo + texto + cronômetro + título
- ✅ Cronômetro precisão ±1s em 5 min
- ✅ Trigger funcional (manual obrigatório, automático opcional)
- ✅ Cena ENCERRAMENTO criada
- ✅ Transições STANDBY→CAM1 e qualquer→ENCERRAMENTO limpas

## Quality Gate: QG-STANDBY

Critérios em `config.yaml` → `quality_gates.QG-STANDBY`.

## Handoff

Próximo: `configure-meet.md`.
