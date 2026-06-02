# Checklist — Validação TouchOSC (QG-TOUCHOSC)

> Executar após `setup-touchosc.md` e antes de qualquer evento real.
> Re-executar quando: mudar `data/osc-mapping.yaml`, atualizar layout `.tosc`,
> trocar tablet, ou após qualquer mudança no `osc-bridge.ts`.

## Identificação

```text
Data:           ___ / ___ / ______
Operador:       ____________________________________
Tablet:         iPad / Android / Windows / macOS — modelo: _________________
PC operador:    OS / Versão Next.js: __________________________
IP tablet:      _____._____._____._____
IP PC:          _____._____._____._____
SSID Wi-Fi:     ________________________________________
```

## T1 — UDP listen

- [ ] Iniciar `operator-panel` com `OSC_BRIDGE_ENABLED=true`
- [ ] Console mostra: `[osc-bridge] listening on UDP :9300`
- [ ] `curl http://localhost:3030/api/osc/status` retorna:
  ```json
  { "enabled": true, "listening": true, "port": 9300, ... }
  ```
- **PASS / FAIL**: ____

## T2 — Switch de cena

- [ ] No tablet, tocar CAM2
- [ ] OBS troca para CAM2
- [ ] Latência percebida < 200ms (cronometrar com câmera lenta no celular se necessário)
- [ ] Botão CAM2 no tablet acende; CAM1 apaga (feedback)
- [ ] Repetir para CAM1, CAM3, CAM4, GRID, SLIDES_FULL, SLIDES_PIP, TELA_PIP, STANDBY, ENCERRAMENTO
- [ ] Todas 10 cenas: troca + feedback OK
- **PASS / FAIL**: ____

## T3 — Mute áudio

- [ ] Tocar botão MUTE do canal 1 no tablet
- [ ] OBS: canal 1 mudo (badge vermelho no Audio Mixer)
- [ ] Botão MUTE no tablet acende
- [ ] Tocar de novo: unmute, badge volta ao normal, botão apaga
- [ ] Repetir nos canais 2, 3, 4
- [ ] Tocar **🔇 MUTE TODOS**: todos os canais ficam mudos
- **PASS / FAIL**: ____

## T4 — Fader

- [ ] Mover fader do canal 1 do extremo inferior (0%) ao topo (100%)
- [ ] OBS volume vai de -60 dB a +6 dB linearmente
- [ ] Manter fader em 50%: OBS mostra ~-27 dB
- [ ] Repetir nos canais 2, 3, 4
- **PASS / FAIL**: ____

## T5 — Feedback de cena (caminho reverso)

- [ ] Trocar cena no painel web (`http://localhost:3030`) para CAM3
- [ ] Tablet destaca CAM3 e apaga indicador anterior (cor)
- [ ] Repetir para outras cenas via painel web → tablet acompanha
- **PASS / FAIL**: ____

## T6 — Feedback VU em tempo real

- [ ] Falar no microfone do canal 1 com volume conversacional
- [ ] Tablet mostra VU meter respondendo (RADAR ou meter dependendo do layout)
- [ ] Pico passa do warn (-6 dB) durante fala alta, danger (-3 dB) durante grito
- [ ] Repetir nos outros canais ativos
- **PASS / FAIL**: ____

## T7 — Resiliência

- [ ] Parar Next.js (Ctrl+C no terminal)
- [ ] Tocar botões no tablet → nada acontece no OBS (esperado)
- [ ] Tablet não trava nem mostra erro modal (visualmente operável)
- [ ] Reiniciar Next.js (`npm run dev`)
- [ ] Aguardar log `[osc-bridge] obs-websocket connected`
- [ ] Tablet volta a operar normalmente; indicador `connected` acende
- **PASS / FAIL**: ____

## T8 — Feedback do engine F6 (opcional, requer extra `[osc]`)

> Pular se `python-osc` não está instalado no engine. Não bloqueia o QG.

- [ ] Iniciar engine F6 com `OSC_FEEDBACK_HOST` apontando para o tablet
- [ ] Log do engine mostra: `OSC feedback emitter enabled (TouchOSC tablet)`
- [ ] Forçar fala no canal 1 (palestrante CAM1)
- [ ] Engine decide trocar para CAM1 → log `switch → CAM1 (audio)`
- [ ] Tablet destaca CAM1 sem polling (push direto via OSC)
- [ ] Repetir falando no canal 2 → tablet vai para CAM2
- **PASS / FAIL / SKIP**: ____

## Resultado

```yaml
qg_touchosc:
  date: "____-__-__"
  operator: "_______________"
  tests_passed: __/8
  results:
    T1_udp_listen:        PASS|FAIL
    T2_scene_switch:      PASS|FAIL
    T3_audio_mute:        PASS|FAIL
    T4_fader:             PASS|FAIL
    T5_feedback_scene:    PASS|FAIL
    T6_feedback_vu:       PASS|FAIL
    T7_resilience:        PASS|FAIL
    T8_engine_feedback:   PASS|FAIL|SKIP
  pass_fail: PASS|FAIL
  notes: |
    ____________________________________________________________
    ____________________________________________________________
```

## Em caso de FAIL

| Sintoma | Causa provável | Correção |
|---|---|---|
| `listening: false` | env vars não carregadas; `instrumentationHook: false` | Confirmar `.env.local`, `next.config.js → experimental.instrumentationHook: true`, reiniciar |
| Bridge log diz "package not installed" | `osc` npm package faltando | `cd operator-panel && npm install` |
| Tablet envia mas bridge não recebe | Firewall bloqueando UDP 9300 | Liberar UDP 9300 no firewall do PC |
| Bridge recebe mas `errors_total > 0` | Sessão obs-websocket inválida | Conferir `OSC_OBS_PASSWORD`, `OBS_WS_PORT`; ver log do Next.js |
| Latência > 500ms | Wi-Fi congestionado | Mover tablet para 5GHz, evitar interferência, considerar cabo USB-C → Ethernet |
| Feedback chega no tablet errado | `OSC_FEEDBACK_HOST` aponta para IP errado | Atualizar para o IP atual do tablet (DHCP pode ter mudado) |
| Engine não emite feedback | extra `[osc]` não instalado | `cd auto-switch-engine && pip install -e ".[osc]"` |
