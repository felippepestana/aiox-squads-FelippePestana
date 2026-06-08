# Task: Pre-flight Checks (T-2h automatizado)

```yaml
task_name: "Bateria automatizada de smoke tests antes do evento"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "5min"
quality_gate: QG-LIVE-READY
dependencies:
  - setup-host-pc.md
  - provision-cameras.md
  - build-scene-pack.md
  - configure-meet.md

input:
  - "Squad provisionado (F1–F4 + F5 + F6 mínimo)"
  - "OBS rodando com Scene Collection do squad carregada"
  - "obs-websocket habilitado, OBS_WS_PASSWORD anotada"
  - "4 câmeras OBSBOT conectadas direto no host"

output:
  - "Saída do script run-preflight.sh com PASS/FAIL"
  - "GO/NO-GO para iniciar checklists/pre-event.md fase T-30min"
```

## Quando executar

**T-2h antes do evento.** Esta task substitui a checagem manual item-por-item
da seção T-2h do `checklists/pre-event.md` para os pontos que são
programaticamente verificáveis (USB, scene pack, OSC bridge). Os itens
não-automatizáveis (Studio Look OFF, áudio testado, etc.) continuam na
checklist e devem ser feitos em paralelo.

## Action Items

### 1. Configurar credenciais OBS

```bash
# OBS → Tools → WebSocket Server Settings → "Show Connect Info"
export OBS_WS_HOST=localhost
export OBS_WS_PORT=4455
export OBS_WS_PASSWORD=<copy from OBS>
```

Opcional (se usar TouchOSC):
```bash
export OSC_PORT=9300
```

### 2. Rodar a bateria

```bash
cd squads/transmissao-multicam
bash scripts/run-preflight.sh
```

A saída roda 3 sub-checks em sequência:

1. **USB cameras** (`validate_cameras.sh`):
   - Detecta as 4 câmeras OBSBOT
   - Confirma todas em SuperSpeed (5 Gbps+)
   - Avisa sobre Dell D6000 conectado

2. **OBS scene pack** (`obs-headless-check.py`):
   - Conecta no obs-websocket
   - Itera as 10 cenas, ativa cada uma por 2s
   - Reporta tempo de resposta por cena

3. **OSC bridge** (se `OSC_PORT` setado):
   - Confirma processo bridge escutando na porta UDP
   - Skipped se `OSC_PORT` não setado (operador não usa TouchOSC)

### 3. Interpretar resultado

#### PASS (exit 0)
- Sub-checks todos OK
- Pode prosseguir para `checklists/pre-event.md` fase **T-30min**
- Avisos (WARN) podem ser aceitáveis — revisar antes de seguir

#### FAIL (exit 1)
- Pelo menos 1 sub-check falhou
- **NÃO GO LIVE**. Diagnosticar conforme abaixo.

### 4. Diagnóstico de falhas comuns

| Sintoma | Causa provável | Ação |
|---|---|---|
| Apenas 1-2 câmeras detectadas | Cabos USB danificados ou portas com baixa banda | Trocar cabo, plugar em USB traseira marcada SS/SS10 |
| Câmeras em Hi-Speed (480M) ao invés de SuperSpeed | Hub/cabo USB 2.0 ou D6000 | Eliminar intermediários; conectar direto na traseira |
| obs-headless: "Connection refused" | obs-websocket não habilitado | OBS → Tools → WebSocket Server Settings → Enable |
| obs-headless: "AuthError" | `OBS_WS_PASSWORD` errada | Copiar de novo do OBS Show Connect Info |
| Cenas faltando no scene pack | Scene collection errada | OBS → Scene Collection → trocar para `transmissao-multicam-v1` |
| OSC bridge não está escutando | Bridge não iniciado | `cd osc-bridge-standalone && docker compose up -d` (ou systemctl start osc-bridge) |
| DisplayLink/D6000 detectado | Câmera plugada errada no dock | Replugar direto no host. **PARAR e replanejar topologia.** |

## Acceptance Criteria

- ✅ `bash scripts/run-preflight.sh` retorna **exit 0**
- ✅ Saída mostra `PRE-FLIGHT PASS`
- ✅ Avisos (se houver) revisados pelo operador

## Handoff

Após PASS, prosseguir para `checklists/pre-event.md` fase **T-30min**.

Se FAIL, **abortar** o GO LIVE até resolver. Se a janela do evento for crítica
e a falha for cosmética (ex: 1 câmera em Hi-Speed mas as outras OK), avaliar
operação degradada com o backup operador antes de seguir.
