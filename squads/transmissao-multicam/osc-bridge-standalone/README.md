# OSC Bridge Standalone

> **F10 — entregue.** Bridge OSC↔OBS rodando como processo Node.js
> independente, para quando o bridge embutido no `operator-panel/`
> não é apropriado para o deployment.

## Quando usar

A versão padrão do bridge OSC roda **dentro do `operator-panel/`**
(Next.js + `instrumentation.ts`). Isso cobre 95% dos casos: painel
web e bridge no mesmo processo, mesma sessão obs-websocket, mesma
config.

Use este **standalone** quando:

1. **Painel web hospedado em SaaS** (Vercel, Netlify) — esses runtimes
   não aceitam sockets UDP de longa duração. TouchOSC + OBS vivem na
   LAN; rode o bridge em um host local da LAN.
2. **Múltiplos tablets em redes diferentes** — cada sub-rede com seu
   próprio bridge.
3. **Operador sem PC para o painel web** — apenas iPad + Raspberry Pi
   rodando o bridge. Solução low-power.

## Setup (5 minutos)

```bash
cd squads/transmissao-multicam/osc-bridge-standalone

# 1. Instalar deps (Node 20+)
npm install

# 2. Configurar
cp .env.example .env
$EDITOR .env   # ver "Configuração" abaixo

# 3. Build + start
npm run build
npm start
```

Saída esperada:

```text
[bridge] listening on UDP :9300, feedback → 192.168.1.42:9301
[bridge] obs-websocket connected
[index] bridge running on UDP :9300
```

## Configuração

Variáveis de ambiente (ver `.env.example`):

| Variável | Default | Descrição |
|---|---|---|
| `OSC_PORT` | `9300` | UDP que o bridge escuta (TouchOSC manda aqui) |
| `OSC_FEEDBACK_HOST` | `127.0.0.1` | IP do tablet onde o TouchOSC está |
| `OSC_FEEDBACK_PORT` | `9301` | Porta UDP do TouchOSC para receber feedback |
| `OBS_WS_HOST` | `localhost` | Host do OBS WebSocket |
| `OBS_WS_PORT` | `4455` | Porta do OBS WebSocket |
| `OSC_OBS_PASSWORD` | _(vazia)_ | Senha do obs-websocket (se houver) |
| `MIC_MAPPING_PATH` | `../../data/mic-mapping.yaml` | Path do mapeamento de canais |
| `OSC_MAPPING_PATH` | `../../data/osc-mapping.yaml` | Path do mapeamento OSC |

Os arquivos de mapping são lidos **diretamente** do squad
(`data/mic-mapping.yaml` e `data/osc-mapping.yaml`) — single source
of truth compartilhada com o operator-panel e com o engine F6.

## Protocolo OSC

O addressing OSC é definido em `data/osc-mapping.yaml`. Não
documentamos addresses aqui para evitar drift: leia o YAML.
Resumo:

- **TouchOSC → bridge**: `/tx/scene/<name>`, `/tx/pip/{camera,corner,size}/*`, `/tx/audio/{mute,fader}/<idx>`, `/tx/mode/{manual,auto}`, `/tx/show/{standby,golive,encerramento}`
- **bridge → TouchOSC**: `/tx/feedback/scene/<name>`, `/tx/feedback/audio/level/<idx>`, `/tx/feedback/connected`

A layout pronta para importar no TouchOSC Editor está em
`../templates/touchosc/` (operator.tosc + variantes).

## Verificação (smoke test)

Com OBS + TouchOSC rodando:

- [ ] **T1 — Boot**: `npm start` mostra `[bridge] obs-websocket connected`
- [ ] **T2 — Sem OBS**: `npm start` com OBS desligado → warning no log, processo permanece vivo
- [ ] **T3 — Switch cena**: botão CAM2 no TouchOSC → OBS troca para CAM2
- [ ] **T4 — Mute**: botão MUTE → OBS muta o canal
- [ ] **T5 — Feedback cena**: trocar cena via OBS UI → TouchOSC pisca indicador
- [ ] **T6 — VU meter**: falar no mic → TouchOSC mostra dB em tempo real
- [ ] **T7 — Shutdown**: Ctrl+C → log "shutting down"

Equivalente ao QG-TOUCHOSC do operator-panel
(`../checklists/touchosc-validation.md`).

## Manutenção

A lógica do bridge é **portada 1:1** de
`operator-panel/src/server/osc-bridge.ts` (a versão canônica).
Mudanças no protocolo OSC devem ser feitas lá primeiro e portadas
para `src/bridge.ts` no **mesmo PR**.

Arquivos espelhados:

| Standalone | Origem no operator-panel |
|---|---|
| `src/bridge.ts` | `src/server/osc-bridge.ts` |
| `src/config-loader.ts` | `src/server/osc-mapping-loader.ts` + `src/lib/mic-loader.ts` |
| `src/types.ts` | `src/lib/osc-types.ts` + `src/lib/mic-config.ts` + tipos PiP de `src/lib/scenes.ts` |
| `src/scenes.ts` | `src/lib/scenes.ts` (apenas PiP) |

## Roadmap futuro

Esta entrega cobre **F10 + F10.1** (código Node.js standalone). As
próximas evoluções ficam como roteiro:

### F10.2 — Dockerfile

Multi-stage com `node:22-alpine`. Image final ~30MB:

```dockerfile
# (roteiro — não implementado nesta entrega)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build && npm prune --production

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ../data ../data
ENV NODE_ENV=production
EXPOSE 9300/udp
CMD ["node", "dist/index.js"]
```

Publicar em GHCR via `.github/workflows/`.

### F10.3 — docker-compose para Raspberry Pi 5

```yaml
# (roteiro)
services:
  osc-bridge:
    image: ghcr.io/felippepestana/aiox-squads/osc-bridge:latest
    network_mode: host   # essencial: UDP precisa enxergar a LAN
    environment:
      OSC_FEEDBACK_HOST: 192.168.1.42   # IP do tablet
      OBS_WS_HOST: 192.168.1.10         # IP do PC com OBS
    restart: unless-stopped
```

### F10.4 — systemd unit

Para deployment direto no Pi sem Docker:

```ini
# (roteiro — /etc/systemd/system/osc-bridge.service)
[Unit]
Description=Transmissao Multicam OSC bridge
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/node /opt/osc-bridge/dist/index.js
EnvironmentFile=/etc/osc-bridge/env
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Comparativo com o bridge embutido

|  | Embutido (`operator-panel`) | Standalone |
|---|---|---|
| Stack | Next.js + React + Supabase + obs-websocket | Apenas Node + obs-websocket + osc |
| Bundle | ~516MB com node_modules | ~50MB com node_modules |
| Toggle | `OSC_BRIDGE_ENABLED=true` | Sempre ligado (o processo só existe pra isso) |
| Auth OBS | `OSC_OBS_PASSWORD` | `OSC_OBS_PASSWORD` |
| UI | Sim (settings + métricas) | Não (logs em stdout) |
| Hot reload | `npm run dev` no painel | `npm run dev` (tsc --watch + node --watch) |
| Use case | Operador em PC com painel web | iPad + Pi, ou painel em SaaS |
