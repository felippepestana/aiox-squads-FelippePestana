# Operator Panel (F5)

> Painel web para o operador da transmissão. Conecta ao OBS via `obs-websocket v5` e expõe controles de cena, layout, PiP, mixer de microfones e show flow.

**Status:** F5 — scaffold funcional. Conexão obs-websocket, troca de cena, mixer de áudio com fader/mute/VU e toggle Auto/Manual implementados. Refinamentos visuais e atalhos avançados ficam como follow-up.

## Pré-requisitos

- Node.js 20+
- OBS Studio com `obs-websocket` v5 habilitado (porta 4455 default)
- Pacote de cenas montado conforme `tasks/build-scene-pack.md`
- `data/mic-mapping.yaml` preenchido para sua sala

## Setup

```bash
cd squads/transmissao-multicam/operator-panel
cp .env.example .env.local      # editar com credenciais reais do OBS
npm install
npm run dev                     # http://localhost:3030
```

## Estrutura

```
operator-panel/
├── src/
│   ├── app/
│   │   ├── page.tsx        # painel principal (1 rota)
│   │   ├── layout.tsx      # shell HTML + estilos globais
│   │   └── globals.css     # estilos básicos
│   ├── components/
│   │   ├── SceneSwitcher.tsx
│   │   ├── LayoutControls.tsx
│   │   ├── PipControls.tsx
│   │   ├── ModeToggle.tsx
│   │   ├── ShowFlowControls.tsx
│   │   ├── AudioMixer.tsx
│   │   └── ConnectionStatus.tsx
│   └── lib/
│       ├── obs.ts          # singleton client + helpers
│       ├── store.ts        # zustand store (mode, pipState, mute, levels…)
│       └── scenes.ts       # constantes do scene pack
├── package.json
├── tsconfig.json
└── next.config.js
```

## Funcionalidades

| Bloco | UI | OBS commands |
|---|---|---|
| Câmeras | Botões CAM1–CAM4, GRID, atalhos numéricos | `SetCurrentProgramScene` |
| Conteúdo | SLIDES_FULL, SLIDES_PIP, TELA_PIP | `SetCurrentProgramScene` |
| PiP | Toggle, seletor de câmera no PiP, canto, tamanho | `SetInputSettings` (Source Mirror) + transforms |
| Show flow | STANDBY, GO LIVE, ENCERRAMENTO | `SetCurrentProgramScene` + studio-mode |
| Modo | Toggle Auto/Manual (suspende motor F6 por 10 s ao ir manual) | broadcast via `BroadcastCustomEvent` |
| Mixer | Fader (dB), mute, VU por canal, mute master | `SetInputVolume`, `SetInputMute`, evento `InputVolumeMeters` |

## Integração com o motor F6 (auto-switch)

- Em modo **Auto**, o painel apenas reflete decisões do motor.
- Em modo **Manual**, comandos do operador disparam um `BroadcastCustomEvent` com `{type: "operator-override", expires_at: <epoch+10s>}` que o motor escuta para suspender troca automática.
- Override expira automaticamente; Auto retoma sem ação extra.

## Limitações (scope F5 inicial)

- Sem autenticação — assume rede local da operação.
- Preview de câmeras não embute vídeo no painel (ficaria mais leve manter no OBS preview). Futuro: Picture-in-Picture HTML5 via WebRTC do OBS.
- Persistência do estado é via `localStorage` (zustand persist) — sem servidor.
- Atalhos de teclado: implementação inicial cobre cenas (Ctrl+1 a Ctrl+8 para CAM1..GRID..TELA_PIP e Ctrl+0 para STANDBY). Atalhos avançados de PiP/canto ficam para iteração.
