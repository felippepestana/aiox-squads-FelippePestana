# OSC Bridge Standalone

> **F10 + F10.2 + F10.3 + F10.4 — entregues.** Bridge OSC↔OBS rodando
> como processo Node.js independente, com Dockerfile multi-stage,
> docker-compose e systemd unit, para quando o bridge embutido no
> `operator-panel/` não é apropriado para o deployment.

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

## Deployment

Três caminhos prontos, escolha conforme infra:

### Opção 1 — Docker (mais simples)

Pré-requisito: Docker + Compose v2 no host.

```bash
# A partir de osc-bridge-standalone/
cp .env.example .env
$EDITOR .env             # OBS_WS_HOST, OSC_FEEDBACK_HOST, etc.
docker compose up -d     # build local + start
docker compose logs -f   # acompanhar
```

A imagem final é multi-stage `node:22-alpine` (~50MB). Importante: o
compose usa `network_mode: host` — UDP em bridge NAT do Docker silenciosamente
descarta pacotes fragmentados e não preserva o IP de origem. Sem host mode,
o feedback OSC para o TouchOSC quebra.

### Opção 2 — Docker com imagem pré-buildada (futuro F10.2.1)

A imagem ainda não é publicada em GHCR. Para usar:

1. Build local: `docker build -f osc-bridge-standalone/Dockerfile -t ghcr.io/felippepestana/aiox-squads-felippepestana/osc-bridge:dev ..` (rodar da `squads/transmissao-multicam/`)
2. Atualizar `docker-compose.yml`: comentar o bloco `build:`, descomentar a linha `image:`

Quando um GitHub Actions workflow para publicar em GHCR for adicionado, o
operador só precisa de `docker compose pull && docker compose up -d`.

### Opção 3 — systemd (Raspberry Pi sem Docker)

Pré-requisito: Node 20+ no host (`apt install nodejs`).

```bash
# Build uma vez no Pi
cd /opt && git clone <repo> aiox-squads-felippepestana
cd aiox-squads-felippepestana/squads/transmissao-multicam/osc-bridge-standalone
npm ci && npm run build

# Cria usuário dedicado
sudo useradd --system --no-create-home --shell /usr/sbin/nologin osc-bridge
sudo chown -R osc-bridge:osc-bridge .

# Env file (NÃO versionado — segredos)
sudo mkdir -p /etc/osc-bridge
sudo cp .env.example /etc/osc-bridge/env
sudo chmod 600 /etc/osc-bridge/env
sudo $EDITOR /etc/osc-bridge/env

# Instala e inicia o service
sudo cp deploy/osc-bridge.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now osc-bridge.service
sudo systemctl status osc-bridge
sudo journalctl -u osc-bridge -f
```

O unit (`deploy/osc-bridge.service`) já vem com hardening básico
(`NoNewPrivileges`, `ProtectSystem=strict`, `MemoryMax=256M`) e
`Restart=on-failure` com backoff de 5s.

### Comparativo dos 3 caminhos

| Caminho | Pré-req | Update | Resource cap | Use case |
|---|---|---|---|---|
| Docker compose (build local) | Docker | `docker compose up -d --build` | container limit | dev / testes |
| Docker compose (GHCR pull) | Docker | `docker compose pull && up -d` | container limit | produção replicada |
| systemd bare-metal | Node 20+ | `git pull && npm ci && npm run build && systemctl restart` | `MemoryMax=256M` no unit | Pi headless, low-power |

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
