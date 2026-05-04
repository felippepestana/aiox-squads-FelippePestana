# Task: Provisionar 4 Câmeras OBSBOT (1 a 1)

```yaml
task_name: "Validar 4 câmeras OBSBOT no host"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "2-3h"
quality_gate: QG-USB
dependencies:
  - setup-host-pc.md

input:
  - "PC host provisionado (OBS + Plugin)"
  - "4× OBSBOT Tiny 2 / Tiny 2 Lite com firmware atualizado"
  - "Cabos USB-C originais OBSBOT (≤ 2m)"
  - "Hub backup Anker A7515 alimentado (caso falte porta traseira)"

output:
  - "4 câmeras enumeradas como SuperSpeed UVC"
  - "Banda alocada por root hub < 70%"
  - "0 desconexões em 30 min de smoke test"
  - "3 PTZ presets criados por câmera"
  - "Auto-Track validado em todas"
  - "Mapeamento porta→câmera registrado em data/usb-topology.yaml"
```

## Action Items

### 1. Preparação

- [ ] Conferir `data/usb-topology.yaml` para mapeamento alvo
- [ ] Garantir que nenhuma câmera está plugada inicialmente
- [ ] Garantir que Dell D6000 está conectado APENAS para periféricos

### 2. Para cada câmera (CAM1, CAM2, CAM3, CAM4) — uma de cada vez

#### 2.1 Conectar isoladamente

- [ ] Plugar a câmera N na porta definida em `usb-topology.yaml`
- [ ] Aguardar 10 s para enumeração

#### 2.2 Validar UVC

- **Windows**: Gerenciador de Dispositivos → Câmeras → "OBSBOT Tiny 2"
- **macOS**: System Information → USB → procurar OBSBOT
- [ ] Confirmar negociação SuperSpeed (USB 3.0 / 5 Gbps)

#### 2.3 Validar com USBTreeView (opcional, recomendado)

- [ ] Abrir USBTreeView (Win) ou IORegistryExplorer (Mac)
- [ ] Identificar root hub
- [ ] Anotar banda alocada
- [ ] Confirmar root hub conforme planejado em `usb-topology.yaml`

#### 2.4 Adicionar fonte no OBS

- [ ] Adicionar Fonte → Captura de Vídeo
- [ ] Selecionar OBSBOT Tiny 2 (instância correspondente)
- [ ] Resolução: 1920×1080 @ 30fps, formato MJPEG
- [ ] Renomear fonte para `CAM<N>` (ex.: CAM1, CAM2…)

#### 2.5 Testar PTZ via Plugin

- [ ] Abrir painel OBSBOT lateral
- [ ] Selecionar a câmera N
- [ ] Testar Pan Esquerda/Direita
- [ ] Testar Tilt Cima/Baixo
- [ ] Testar Zoom In/Out
- [ ] Confirmar que movimentos respondem

#### 2.6 Criar 3 presets

- [ ] Posicionar câmera para enquadramento "Wide" → salvar preset 1
- [ ] Posicionar para "Medium" → salvar preset 2
- [ ] Posicionar para "Closeup" → salvar preset 3
- [ ] Renomear presets no painel

#### 2.7 Validar Auto-Track

- [ ] Toggle Auto-Track ON
- [ ] Pessoa entra no campo de visão → câmera segue
- [ ] Toggle Auto-Track OFF → para de seguir

#### 2.8 Anotar resultado

- [ ] Atualizar `data/usb-topology.yaml` com root hub real observado
- [ ] Marcar câmera N como validada

### 3. Smoke test combinado (após as 4)

- [ ] Manter as 4 câmeras conectadas e capturando 1080p30 simultaneamente
- [ ] Rodar OBS por 30 min
- [ ] Observar:
  - [ ] Stats OBS: drops < 0.5%
  - [ ] CPU < 70%
  - [ ] USB: 0 desconexões
- [ ] Rodar `bash scripts/validate_cameras.sh` para snapshot

### 4. Validar via script

- [ ] Executar `python3 scripts/obs-headless-check.py` (após cenas existirem na F2)
  - Nesta task ainda só valida que cada câmera é capturável; o smoke E2E completo vem na F2.

## Acceptance Criteria

- ✅ 4 câmeras enumeradas como SuperSpeed
- ✅ Cada câmera reconhecida no OBS como 1080p30 MJPEG
- ✅ PTZ responsivo via Plugin para todas
- ✅ 3 presets nomeados por câmera
- ✅ Auto-Track validado em todas
- ✅ 30 min smoke sem desconexão
- ✅ `data/usb-topology.yaml` reflete a topologia real

## Quality Gate: QG-USB

Critérios em `config.yaml` → `quality_gates.QG-USB`. Todos os 4 critérios devem passar.

## Handoff

Após QG-USB verde, prosseguir para `build-scene-pack.md`.
