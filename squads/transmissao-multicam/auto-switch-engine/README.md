# Auto-Switch Engine (F6)

> Motor de troca automática de câmera para o squad transmissao-multicam. Escuta os medidores de áudio do OBS via `obs-websocket v5`, aplica VAD por canal usando os thresholds calibrados em `data/mic-mapping.yaml`, e comanda trocas de cena respeitando **cooldown** e **override manual** disparado pelo painel F5.

**Status:** F6 — scaffold funcional com a lógica central (VAD + cooldown + override) coberta por testes. Integração real com OBS depende de `obs-websocket` ativo no host de produção.

## Arquitetura

```
[OBS audio sources MIC_1..MIC_N]
       │
       ▼  InputVolumeMeters event (~10 Hz)
[obs-websocket v5] ──▶ [auto_switch.engine.SwitchEngine]
                                 │
                                 │ regras: VAD threshold, min_speech, cooldown, override
                                 ▼
                       SetCurrentProgramScene(CAMx)
```

## Setup

```bash
cd squads/transmissao-multicam/auto-switch-engine
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
```

## Configuração

```bash
export OBS_WS_HOST=localhost
export OBS_WS_PORT=4455
export OBS_WS_PASSWORD=<segredo do obs-websocket>
export MIC_MAPPING=../data/mic-mapping.yaml
```

## Uso

```bash
tx-auto-switch                    # roda o motor (Ctrl+C para sair)
tx-auto-switch --dry-run          # imprime decisões sem comandar OBS
tx-auto-switch --log-switches=switches.jsonl
```

## Regras (defaults)

| Parâmetro | Default | Origem |
|---|---|---|
| Cooldown entre trocas | 1500 ms | `mic-mapping.yaml.vad_engine.cooldown_ms` |
| Mínimo de fala contínua | 500 ms | `channels[*].vad_min_speech_ms` |
| Threshold por canal | -32 dBFS (default) | `channels[*].vad_threshold_dbfs` |
| Override manual | 10000 ms | `mic-mapping.yaml.vad_engine.manual_override_ms` |
| Cenas protegidas | SLIDES_*, TELA_PIP, STANDBY, ENCERRAMENTO | `protected_scenes` em `mic-mapping.yaml` (fallback `_DEFAULT_PROTECTED` em `config.py`) |

## Override do operador (F5 ↔ F6)

Quando o operador alterna o painel para Manual, ele dispara um `BroadcastCustomEvent` no OBS:

```json
{ "type": "operator-override", "expires_at": 1735689600000 }
```

O motor escuta `CustomEvent`, marca `override_until = expires_at`, e ignora qualquer trigger de áudio até o tempo passar.

## Testes

```bash
pytest -v
```

Cobre: cooldown, mínimo de fala, override, cena protegida (não força troca), seleção de canal por threshold.
