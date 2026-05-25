# Task: Setup TouchOSC (Surface Físico do Operador)

```yaml
task_name: "Provisionar TouchOSC + bridge OSC↔OBS"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "1h (após operator-panel funcional)"
quality_gate: QG-TOUCHOSC
dependencies:
  - setup-host-pc.md
  - configure-audio.md
  - build-scene-pack.md

input:
  - "Tablet (iPad ou Android, ≥ 10\")"
  - "TouchOSC app instalado (paid)"
  - "TouchOSC Editor instalado no PC operador (free)"
  - "PC operador rodando operator-panel (Next.js)"
  - "Tablet e PC operador na mesma rede (preferencialmente cabo + 5GHz dedicado)"

output:
  - "Tablet com layout `operator.tosc` carregado e conectado ao bridge"
  - "Operator-panel com OSC_BRIDGE_ENABLED=true e bridge listening"
  - "QG-TOUCHOSC verde (8/8 testes)"
  - "Engine F6 emitindo feedback OSC (se [osc] extra instalado)"
```

## Action Items

### 1. Validar pré-requisitos

- [ ] `operator-panel` rodando em `http://localhost:3030`
- [ ] OBS WebSocket habilitado e password anotada
- [ ] Mapeamento de áudio em `data/mic-mapping.yaml` (canais 1..N têm `obs_source_name` correto)
- [ ] Cenas OBS criadas conforme `config.yaml → scene_pack.scenes`
- [ ] Tablet e PC na mesma sub-rede (verificar com `ping`)

### 2. Configurar bridge no operator-panel

- [ ] Editar `operator-panel/.env.local`:
  ```env
  OSC_BRIDGE_ENABLED=true
  OSC_PORT=9300
  OSC_FEEDBACK_HOST=<IP_DO_TABLET>      # ex: 192.168.1.50
  OSC_FEEDBACK_PORT=9301
  OSC_OBS_PASSWORD=<senha_obs_websocket>
  ```
- [ ] `cd operator-panel && npm install` (instala dep `osc`)
- [ ] Reiniciar Next.js (`npm run dev`)
- [ ] Console deve mostrar: `[osc-bridge] listening on UDP :9300, feedback → <IP>:9301`
- [ ] Acessar `http://localhost:3030/api/osc/status` → `enabled: true, listening: true`
- [ ] No painel web, header mostra pill `🎛️ TouchOSC :9300`

### 3. Construir o layout TouchOSC no Editor

- [ ] Abrir `templates/touchosc/README.md` para o spec
- [ ] Abrir `templates/touchosc/operator.layout.json` (descritor)
- [ ] No TouchOSC Editor, criar novo documento (1024×768 landscape)
- [ ] Reproduzir as 4 páginas (Cenas / PiP / Áudio / Show Flow)
- [ ] Para cada controle, configurar:
  - **OSC Send** → o `send_address` do JSON
  - **OSC Receive** → o `feedback_address` (quando aplicável)
  - Cor / label conforme palette do JSON
- [ ] **File → Export → operator.tosc**

### 4. Sincronizar layout com o tablet

- [ ] Tablet e PC na mesma rede; abrir TouchOSC no tablet
- [ ] No Editor PC: **Sync** → device do tablet aparece via Zeroconf → escolher
- [ ] Confirmar import no tablet (deve aparecer "operator.tosc" na lista)
- [ ] Alternativa: AirDrop / iCloud / Drive → abrir o `.tosc` no app

### 5. Configurar conexão OSC no tablet

- [ ] No app móvel, **Connections** → **OSC**
- [ ] Adicionar conexão:
  - Host: `<IP_DO_PC>` (ex: 192.168.1.42)
  - Send port: `9300`
  - Receive port: `9301`
  - Protocol: UDP
  - (Opcional) Zeroconf: ON
- [ ] Salvar e voltar ao layout

### 6. Smoke test

Para cada teste, observar tanto o tablet quanto o OBS preview:

- [ ] Tocar CAM1 no tablet → OBS troca para CAM1 + botão CAM1 no tablet acende
- [ ] Tocar todos 10 botões de cena, todos respondem em < 200 ms
- [ ] Tocar MUTE no canal 1 → OBS canal vai para mudo + botão MUTE acende
- [ ] Mover fader 1 do extremo inferior ao topo → OBS muda volume linearmente
- [ ] Trocar cena via painel web → indicador no tablet acompanha
- [ ] Falar no microfone do canal 1 → VU meter no tablet responde
- [ ] Parar Next.js → comandos OSC viram no-op (tablet permanece operável visualmente); religar Next.js → bridge volta automaticamente
- [ ] (opcional, requer F6 com `[osc]`) Engine decide auto-switch CAM1→CAM2 → tablet destaca CAM2 sem polling

> Para o QG-TOUCHOSC completo com numeração canônica T1–T8, ver
> `checklists/touchosc-validation.md`. Os T-numbers naquele arquivo são a
> referência durante incidentes; os bullets acima são a versão livre de
> rotulagem para evitar conflito.

### 7. Habilitar feedback do engine F6 (opcional)

Apenas se quiser que decisões da IA apareçam no tablet:

- [ ] `cd auto-switch-engine && pip install -e ".[osc]"` (instala `python-osc`)
- [ ] No `.env` do engine adicionar:
  ```env
  OSC_FEEDBACK_HOST=<IP_DO_TABLET>
  OSC_FEEDBACK_PORT=9301
  ```
- [ ] Reiniciar engine
- [ ] Log do engine deve mostrar: `OSC feedback emitter enabled (TouchOSC tablet)`

## Acceptance Criteria

- ✅ Bridge listening on UDP :9300 (`/api/osc/status` confirma)
- ✅ Tablet conectado e mostrando indicador "OBS conectado"
- ✅ Todos 10 botões de cena trocam o programa OBS
- ✅ Mute + fader em todos canais funcionam
- ✅ Feedback de cena, VU e conexão chegam no tablet
- ✅ Bridge sobrevive a reconexão obs-websocket
- ✅ QG-TOUCHOSC: 8/8 testes verdes (`checklists/touchosc-validation.md`)

## Quality Gate: QG-TOUCHOSC

Esta task fecha o quality gate. Ver `checklists/touchosc-validation.md`.

## Handoff

Após acceptance criteria atendidos, prosseguir para `run-load-test.md` para
validar bridge sob carga real de evento.

Em caso de FAIL:
- Bridge não escuta → ver logs do Next.js, confirmar OSC_BRIDGE_ENABLED=true e que `next.config.js` tem `instrumentationHook: true`
- Tablet não envia → confirmar IP/porta na conexão TouchOSC, testar com `nc -ul 9300` no PC
- Feedback não chega → confirmar OSC_FEEDBACK_HOST aponta para IP do tablet (não do PC), porta 9301 livre no firewall
