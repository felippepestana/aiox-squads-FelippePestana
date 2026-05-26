# Task: Configurar Áudio (Mapeamento + Calibração VAD)

```yaml
task_name: "Mapear microfones, calibrar VAD e validar mixer no OBS"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "1.5h"
quality_gate: QG-AUDIO
dependencies:
  - setup-host-pc.md
  - provision-cameras.md

input:
  - "Interface multicanal conectada (Behringer UMC404HD ou equivalente)"
  - "4 microfones físicos em posição final"
  - "Sala silenciosa para medir ruído base"

output:
  - "data/mic-mapping.yaml atualizado para a sala real"
  - "Fontes MIC_1..MIC_N criadas no OBS (Captura de Áudio de Entrada)"
  - "Faders, mute defaults e thresholds VAD calibrados"
```

## Action Items

### 1. Inventariar canais físicos

- [ ] Listar canais ativos da interface
- [ ] Anotar cada canal: número, microfone, sala/papel

### 2. Criar fontes no OBS

Para cada canal:

- [ ] OBS → Adicionar Fonte → Captura de Áudio de Entrada
- [ ] Selecionar canal específico da interface
- [ ] Renomear como `MIC_<n>` (deve bater com `data/mic-mapping.yaml`)

### 3. Atualizar `data/mic-mapping.yaml`

Para cada canal:

- [ ] `obs_source_name`: bater com nome da fonte no OBS
- [ ] `mic_label`: descrição humana
- [ ] `mic_model`: modelo real do microfone
- [ ] `role`: `principal_speaker` | `co_speaker` | `audience` | `ambient`
- [ ] `camera_target`: CAM1..CAM4 ou `null` (ambient)
- [ ] `fader_db`: nível inicial conservador
- [ ] `mute_default`: `true` para canais liberados sob demanda

### 4. Calibrar VAD

#### 4.1 Medir ruído base

- [ ] Sala silenciosa, sem falantes
- [ ] Observar VU meter por 30 s
- [ ] Anotar peak médio em dBFS

#### 4.2 Calcular threshold

- [ ] `threshold = noise_floor + 12 dB`
- [ ] Salvar em `channels[*].vad_threshold_dbfs`

#### 4.3 Validar com fala

- [ ] Pessoa falando em volume conversacional 30 cm do microfone
- [ ] Peak deve ultrapassar threshold consistentemente
- [ ] Se não ultrapassa: subir gain ou abaixar threshold (mas nunca abaixo de noise + 6 dB)

### 5. Configurar atalho de mute global

- [ ] OBS → Configurações → Atalhos
- [ ] Atribuir `Ctrl+Shift+M` para "Mute Master"

### 6. Validar mixer no painel F5 (se já provisionado)

- [ ] Abrir `operator-panel/` em http://localhost:3030
- [ ] Verificar VU meters batem com peaks reais
- [ ] Toggle mute por canal funciona via obs-websocket
- [ ] Fader ajusta gain no OBS ao mover

## Acceptance Criteria

- ✅ `data/mic-mapping.yaml` reflete a sala real
- ✅ Fontes MIC_* criadas e nomeadas no OBS
- ✅ Threshold VAD calibrado por canal
- ✅ Mute global testado
- ✅ Mixer F5 reflete os mesmos níveis (se F5 estiver provisionado)

## Quality Gate: QG-AUDIO

- Todos os canais ativos calibrados
- Trigger VAD validado com fala conversacional
- Override manual via mute funcional

## Handoff

- Próximo: `tasks/run-load-test.md` agora com auto-switch ativo (F6) opcional.
- Para uso de IA: provisionar `auto-switch-engine/` e rodar `tx-auto-switch --dry-run` com este `mic-mapping.yaml`.
