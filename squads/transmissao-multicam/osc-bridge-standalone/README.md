# OSC Bridge Standalone (roteiro futuro)

> **Status: não implementado.** Stub documental para deployments onde o
> bridge precisa rodar fora do processo Next.js do `operator-panel/`.

## Quando usar

A versão padrão do bridge OSC roda **dentro do `operator-panel`** (Next.js
+ instrumentation hook). Isso é suficiente para 95% dos casos: o painel
web e o bridge compartilham processo, sessão obs-websocket e config.

Casos onde um bridge **standalone** seria preferível:

1. **Painel web hospedado em outro host**: ex. operator-panel em SaaS
   (Vercel) e TouchOSC numa rede local com OBS local. Vercel não roda
   sockets UDP de longa duração.
2. **Múltiplos tablets em redes diferentes**: cada tablet com seu próprio
   bridge na sua sub-rede.
3. **Operador sem PC para o painel web**: apenas iPad + Raspberry Pi
   rodando o bridge. Solução low-power.

## Arquitetura proposta

Implementação Node.js mínima (sem Next.js):

```
osc-bridge-standalone/
├── package.json          # deps: osc, obs-websocket-js, yaml, dotenv
├── src/
│   ├── index.ts          # entry; lê env, conecta OBS, abre UDP
│   ├── bridge.ts         # core logic — port direto de operator-panel/src/server/osc-bridge.ts
│   └── config.ts         # carrega ../data/osc-mapping.yaml e ../data/mic-mapping.yaml
├── tsconfig.json         # ESM, target ES2022
├── Dockerfile            # multi-stage; alpine:node22; ~30MB
├── docker-compose.yml    # serviço único exposto em 9300/udp
└── README.md
```

### Reuso

A maior parte da lógica vive em `operator-panel/src/server/osc-bridge.ts`.
A entrega standalone seria:

1. Extrair `osc-bridge.ts` e `osc-mapping-loader.ts` em um pacote
   compartilhado (`packages/osc-bridge-core/`)
2. `operator-panel` importa do pacote
3. `osc-bridge-standalone` também importa do pacote
4. Mudanças de protocolo afetam ambos automaticamente

### Configuração

Mesmas env vars do `operator-panel/.env.example`:
- `OSC_BRIDGE_ENABLED=true`
- `OSC_PORT`, `OSC_FEEDBACK_HOST`, `OSC_FEEDBACK_PORT`
- `OBS_WS_HOST`, `OBS_WS_PORT`, `OSC_OBS_PASSWORD`
- `MIC_MAPPING_PATH`, `OSC_MAPPING_PATH`

## Roadmap

- [ ] F10 — extrair core para `packages/osc-bridge-core/`
- [ ] F10.1 — implementar `osc-bridge-standalone` consumindo o core
- [ ] F10.2 — Dockerfile + image em GHCR
- [ ] F10.3 — docker-compose para Raspberry Pi 5
- [ ] F10.4 — systemd unit como alternativa ao container

Out of scope desta entrega (F9 = TouchOSC integration). Ficou registrado
para evolução futura quando algum deployment exigir.
