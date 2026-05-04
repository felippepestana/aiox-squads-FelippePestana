# 📡 Transmissão Multicam Squad

> Squad AIOX para transmissões ao vivo com **até 4 câmeras OBSBOT Tiny 2 / Tiny 2 Lite**, saída pelo **Google Meet (Workspace Enterprise Plus)** via OBS Virtual Camera. Inclui composições com slides + câmera em PiP, tela de espera com cronômetro regressivo, e fundação para troca automática (IA por áudio + movimento) ou manual pelo operador.

**Versão:** `1.0.0`
**Status desta release:** F1 → F6 entregues (bancada → show flow → painel operador Next.js → motor de auto-switch Python com testes). Hardening (F7) e detecção de movimento (F8) ficam no roadmap.

---

## 📚 Sumário

- [Quando usar](#-quando-usar)
- [Arquitetura](#-arquitetura)
- [Hardware](#-hardware)
- [Software](#-software)
- [Pacote de cenas](#-pacote-de-cenas)
- [Show flow](#-show-flow)
- [Anatomia do squad](#-anatomia-do-squad)
- [Como executar](#-como-executar)
- [Quality gates](#-quality-gates)
- [Restrições críticas](#-restrições-críticas)
- [Roadmap](#-roadmap)
- [Suporte](#-suporte)

---

## 🎯 Quando usar

Use este squad quando precisar:

- Transmitir um evento via Google Meet com **2 a 4 câmeras OBSBOT** simultâneas.
- Combinar **slides + câmera ao vivo em PiP** sem comprometer a leitura do conteúdo.
- Exibir uma **tela de espera com cronômetro regressivo** antes do início.
- Operar com **toggle automático/manual** de troca de câmeras.
- Hospedar audiência de **até 300 participantes ativos** (Workspace Enterprise Plus permite até 1.000).

**NÃO use** quando:

- Audiência > 1.000 ativos: avaliar live streaming dedicado.
- Fluxo de produção precisa de multicâmera **dentro** do Meet (não existe — uma câmera por participante é o limite).
- Câmera principal não é OBSBOT Tiny 2 / Tiny 2 Lite: este squad é otimizado para esse modelo.

---

## 🏗 Arquitetura

```
[4× OBSBOT Tiny 2 / Tiny 2 Lite]
         │
         ▼ USB 3.0 (direto no host — NÃO no Dell D6000)
[OBS Studio + OBSBOT OBS Plugin]
         │
         ├─ Cenas pré-prontas (10): STANDBY, CAM1-4, GRID, SLIDES_FULL, SLIDES_PIP, TELA_PIP, ENCERRAMENTO
         ├─ Source Mirror dinâmica (PiP segue câmera ativa)
         ├─ obs-advanced-timer (cronômetro regressivo)
         └─ obs-websocket v5 (F5 painel + F6 engine + F9 TouchOSC bridge)
         │
         ▼
[OBS Virtual Camera] ──▶ [Google Meet (Workspace Enterprise Plus)]
                                    │
                                    ├─ Gravação automática na nuvem
                                    ├─ Live streaming in-domain (até 100k)
                                    └─ Captions + Gemini (Take notes)
```

### 🎛️ TouchOSC (F9) — surface físico complementar

Operadores podem usar um **iPad/tablet com TouchOSC** lado-a-lado com o
painel web. Comandos viajam por OSC/UDP até um bridge que roda dentro do
processo Next.js do `operator-panel/`:

```
┌─────────────────────┐         ┌──────────────────────────┐
│  TouchOSC iPad/PC   │  OSC    │  OSC Bridge (Next.js)    │
│  operator.tosc      │◄──UDP──►│  /api/osc no panel       │
└─────────────────────┘  :9300  │   - dgram socket         │
                         :9301  │   - obs-websocket client │
                                └─────────────┬────────────┘
                                              │ obs-websocket v5
                                              ▼
                                        [OBS Studio]
```

- **Layouts**: `templates/touchosc/operator.layout.json` (master) +
  variantes `debate.layout.json` e `apresentacao-corp.layout.json`. Spec
  textual completa em `templates/touchosc/README.md`.
- **Protocolo**: `data/osc-mapping.yaml` é a fonte de verdade
  (TouchOSC → OBS comandos + OBS/engine → TouchOSC feedback).
- **Bridge**: `operator-panel/src/server/osc-bridge.ts`, ativado via
  `OSC_BRIDGE_ENABLED=true` no `.env.local`.
- **Engine F6** opcionalmente emite feedback OSC quando troca cena
  automaticamente — instalar com `pip install -e ".[osc]"` e configurar
  `OSC_FEEDBACK_HOST` apontando para o IP do tablet.
- **Validação**: `checklists/touchosc-validation.md` (QG-TOUCHOSC, 8 testes).

---

## 🔌 Hardware

| Item | Especificação | Quantidade |
|---|---|---|
| **PC host** | Win 11, CPU 8c+, GPU NVENC, 32 GB RAM | 1 |
| **Câmeras** | OBSBOT Tiny 2 ou Tiny 2 Lite | 4 |
| **Conexão** | USB-A/USB-C **traseiras** do host | direto |
| **Hub backup** | USB 3.2 Gen1 alimentado (Anker A7515) | 1 |
| **Controle físico** | OBSBOT Remote (Bluetooth) | 1 |
| **Áudio** | Interface multicanal + lapelas | conforme cenário |
| **Dell D6000** | **Apenas periféricos** (NÃO câmeras) | 1 |

> 🚨 **D6000 é DisplayLink.** Câmeras OBSBOT NUNCA vão nele. Detalhes em `data/usb-topology.yaml`.

Especificação completa em `data/hardware-spec.yaml`.

---

## 💻 Software

| Camada | Ferramenta | Versão |
|---|---|---|
| Mixer | OBS Studio | 30+ |
| Controle câmeras | OBSBOT OBS Plugin | latest |
| Cronômetro | obs-advanced-timer | latest |
| Automação remota | obs-websocket | 5+ (built-in OBS 28+) |
| Saída | OBS Virtual Camera | built-in |
| Plataforma | Google Workspace Enterprise Plus + Gemini | — |

> ⚠️ **OBSBOT Center NÃO é instalado** na máquina de transmissão. Usado apenas em bancada para atualizar firmware das câmeras, depois desinstalado. Detalhes em `data/obsbot-firmware.yaml`.

---

## 🎬 Pacote de cenas

10 cenas pré-configuradas (canvas 1920×1080 @ 30fps):

| Cena | Função |
|---|---|
| **STANDBY** | Pré-show com cronômetro regressivo + logo + título |
| **CAM1** | Palco principal (câmera cheia) |
| **CAM2** | Plateia (câmera cheia) |
| **CAM3** | Closeup (câmera cheia) |
| **CAM4** | Geral (câmera cheia) |
| **GRID** | Mosaico 2×2 das 4 câmeras |
| **SLIDES_FULL** | Slides ocupam canvas inteiro |
| **SLIDES_PIP** | Slides + câmera ativa em PiP no canto inferior direito (25%) |
| **TELA_PIP** | Tela inteira (qualquer app) + câmera em PiP |
| **ENCERRAMENTO** | Créditos finais |

### Detalhe do PiP

- **Posição padrão**: canto inferior direito (x=1410, y=780)
- **Tamanho padrão**: 480×270 (25% do canvas)
- **Borda**: 2 px branca + drop shadow
- **Atualização**: Source Mirror dinâmica reflete a câmera ativa em < 300 ms
- **Alternativas**: 20% / 25% / 30% de tamanho, 4 cantos disponíveis

Especificação completa em `templates/pip-layout.yaml`.

---

## 🎯 Show flow

```
STANDBY ──(cronômetro=0 ou GO LIVE manual)──▶ CAM1 ──▶ PROGRAM ──▶ ENCERRAMENTO ──▶ POST
   │                                                       │
   └─ tela de espera                                       └─ producer humano comanda cenas
```

5 estados:

1. **STANDBY** — Audiência entra, vê cronômetro, gravação Meet inicia.
2. **GO LIVE** — Trigger automático (cronômetro=0) ou clique manual.
3. **PROGRAM** — Operação ao vivo (manual ou auto na F6).
4. **ENCERRAMENTO** — Créditos, audiência sai, gravação para.
5. **POST** — Validar gravação, lessons learned.

Runbook completo em `templates/runbook-evento.md`.

---

## 📁 Anatomia do squad

```
squads/transmissao-multicam/
├── config.yaml                 # Metadata, tiers, pattern library (TM), quality gates
├── README.md                   # (este arquivo)
├── agents/                     # 8 agentes especialistas
│   ├── tx-chief.md             # Tier 0 — orquestrador
│   ├── producer.md             # Tier 1 — comando de cena ao vivo
│   ├── auto-switch-engineer.md # Tier 1 — regras de IA
│   ├── obs-scenes-architect.md # Tier 2 — composição de cenas e PiP
│   ├── obsbot-controller.md    # Tier 2 — PTZ, presets, Auto-Track
│   ├── meet-integration.md     # Tier 2 — Workspace + Virtual Cam
│   ├── audio-controller.md     # Tier 2 — mapeamento de mic e calibração VAD
│   └── pre-show-runner.md      # Tier 3 — cronômetro e GO LIVE
├── tasks/                      # 10 tasks executáveis (F1 → F6 + ensaio)
│   ├── setup-host-pc.md
│   ├── provision-cameras.md
│   ├── build-scene-pack.md
│   ├── configure-pip.md
│   ├── configure-standby.md
│   ├── configure-meet.md
│   ├── configure-audio.md
│   ├── run-load-test.md
│   ├── run-rehearsal.md
│   └── ship-checklist.md
├── templates/
│   ├── obs-scene-collection.json   # Skeleton de coleção de cenas
│   ├── pip-layout.yaml             # Posições/tamanhos do PiP
│   ├── standby-image-spec.md       # Specs da tela de espera
│   └── runbook-evento.md           # Roteiro operacional do evento
├── data/
│   ├── hardware-spec.yaml      # PC host, câmeras, hub, cabos
│   ├── usb-topology.yaml       # Mapeamento porta→câmera
│   ├── meet-settings.yaml      # Workspace Enterprise Plus
│   └── obsbot-firmware.yaml    # Versões mínimas de firmware
├── checklists/
│   ├── pre-event.md            # T-24h, T-2h, T-30min, T-5min
│   ├── usb-bandwidth.md        # Validação USBTreeView
│   └── post-event.md           # 30min, 1h, 24h após
├── scripts/
│   ├── validate_cameras.sh     # Detecção UVC + SuperSpeed
│   └── obs-headless-check.py   # Smoke E2E via obs-websocket
├── operator-panel/             # F5 — painel Next.js (App Router + obs-websocket-js)
│   ├── src/app/
│   ├── src/components/         # Scenes, Layout, PiP, Mode, ShowFlow, AudioMixer
│   ├── src/lib/                # obs.ts, store.ts, scenes.ts, mic-config.ts
│   └── package.json            # Next 14, React 18, obs-websocket-js 5
└── auto-switch-engine/         # F6 — motor Python
    ├── src/auto_switch/
    │   ├── config.py           # Carrega mic-mapping.yaml em dataclasses
    │   ├── engine.py           # Lógica pura: VAD + cooldown + override
    │   └── main.py             # Glue obs-websocket + decisão
    ├── tests/                  # 10 testes pytest (cobre cooldown, override, protected)
    └── pyproject.toml
```

Agentes incluem `audio-controller` (Tier 2) responsável por mapeamento de microfones e calibração de VAD. Dados em `data/mic-mapping.yaml` consumidos por F5 e F6.

Estrutura segue a anatomia padrão dos squads AIOX (tiers, pattern library, quality gates). Convenções em `CLAUDE.md` (idioma pt-BR para docs, inglês para código).

---

## 🚀 Como executar

### Ativação do squad

Comando do entry agent:

```
@tx-chief
```

A partir daí, comandos disponíveis:

| Comando | Função |
|---|---|
| `*setup` | Provisionar PC host (OBS, plugin, drivers) |
| `*cameras` | Validar 4 câmeras 1 a 1 |
| `*scenes` | Criar pacote de 10 cenas |
| `*pip` | Configurar PiP (Source Mirror, canto, tamanho) |
| `*standby` | Configurar STANDBY com cronômetro |
| `*meet` | Configurar Workspace Enterprise Plus |
| `*load-test` | Rodar teste de carga 60 min |
| `*ship` | Checklist completo de evento |

Cada comando carrega a task correspondente em `tasks/`.

### Sequência F1 → F4 (provisionamento desta release)

```
F1 — Bancada (1 sem)        → setup-host-pc + provision-cameras (2 câmeras)
F2 — Multicam (2 sem)       → provision-cameras (4 câmeras) + build-scene-pack
F3 — PiP modes (2 sem)      → configure-pip
F4 — Show flow (1 sem)      → configure-standby + configure-meet + run-load-test
```

Aprovação: todas as 5 quality gates verdes.

---

## ✅ Quality gates

| ID | Nome | Critério-chave |
|---|---|---|
| **QG-USB** | Banda USB validada | 4 câmeras SuperSpeed, < 70% por root hub, 0 desconexões em 30 min |
| **QG-SCENES** | Pacote de cenas pronto | 10 cenas, transições Cut/Fade, presets PTZ |
| **QG-PIP** | PiP legível | Source Mirror < 300 ms, slides legíveis com PiP a 25% |
| **QG-STANDBY** | Show flow pronto | Cronômetro ±1 s, trigger configurável |
| **QG-AUDIO** | Áudio mapeado e calibrado | Canais ↔ câmeras, threshold VAD (ruído + 12 dB), mute master configurado |
| **QG-LIVE-READY** | Smoke E2E | Virtual Cam no Meet, Studio* OFF, gravação ON, load test 60 min OK |
| **QG-TOUCHOSC** | Surface TouchOSC ativo (não-bloqueante) | Bridge UDP escuta, 10/10 cenas trocam < 200 ms via tablet, feedback chega |

Detalhes em `config.yaml` → `quality_gates`.

---

## 🚨 Restrições críticas

1. **Câmeras NUNCA no Dell D6000** — DisplayLink conflita com isócrono UVC.
2. **OBSBOT Center desinstalado** da máquina de transmissão — usar apenas para flash de firmware em bancada separada.
3. **Studio Look / Lighting / Sound desligados** na conta de transmissão Meet — câmera virtual entrega tratada.
4. **Background blur desligado** na conta de transmissão.
5. **Conta dedicada** `transmissao@<domain>` com licença Enterprise Plus + Gemini.
6. **Cooldown mínimo 1.5 s** entre trocas automáticas de câmera (regras em F6).
7. **Operador humano sempre tem override** sobre qualquer automação.

---

## 🛣 Roadmap

### Entregue v1 (esta release)

- ✅ F1 — Bancada com 2 câmeras + OBS + Virtual Cam no Meet
- ✅ F2 — 4 câmeras + cenas base (CAM1-4, GRID)
- ✅ F3 — PiP modes (SLIDES_FULL, SLIDES_PIP, TELA_PIP) com Source Mirror
- ✅ F4 — Show flow (STANDBY com cronômetro + ENCERRAMENTO + Meet integration)
- ✅ F5 — Painel operador (Next.js 14 + obs-websocket-js v5, mixer com VU + fader + mute por canal e mute master)
- ✅ F6 — Motor de auto-switch (Python, regras puras testadas: VAD por canal, cooldown 1.5s, min_speech 0.5s, override 10s, cenas protegidas)
- ✅ F9 — TouchOSC bridge (operator-panel ↔ tablet via OSC/UDP, layouts versionados em `templates/touchosc/`, feedback do engine F6 opcional)
- ✅ Audio mapping & VAD calibration (`audio-controller` agent + `data/mic-mapping.yaml` + `tasks/configure-audio.md`)

### Futuro

- ⏳ **F7 — Hardening** (failover, métricas Grafana, ensaios automatizados)
- ⏳ **F8 — Detecção de movimento por IA** (OpenCV + Auto-Track OBSBOT como fallback quando ninguém fala)

---

## 📞 Suporte

- **Issues**: abrir issue no repositório com template `transmissao-multicam`.
- **Discussão**: thread `@claude` em PR ou issue.
- **Documentação relacionada**: `CLAUDE.md` (raiz do repo) para convenções gerais.

---

## 📄 Licença

Mesmo licenciamento do repositório AIOX Squads. Veja `LICENSE` na raiz.
