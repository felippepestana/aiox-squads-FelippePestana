# Task: Teste de Carga 60min

```yaml
task_name: "Teste de carga end-to-end 60min com 4 câmeras + slides + gravação"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "1.5h"
quality_gate: QG-LIVE-READY
dependencies:
  - configure-pip.md
  - configure-standby.md
  - configure-meet.md

input:
  - "PC host completo (OBS + cenas + Meet)"
  - "4 câmeras conectadas e validadas"
  - "scripts/obs-headless-check.py"

output:
  - "Relatório de carga: CPU, GPU, USB, drops, latência"
  - "Resultado smoke E2E: todas as 10 cenas OK"
  - "Gravação Meet íntegra de 60min"
```

## Action Items

### 1. Preparar ambiente

- [ ] Fechar todos os apps não essenciais
- [ ] Confirmar: OBS aberto, Meet logado em `transmissao@<domain>`, 4 câmeras conectadas

### 2. Iniciar monitoramento

- [ ] Abrir Gerenciador de Tarefas (Win) → aba Desempenho
- [ ] Abrir USBTreeView → ver alocação por root hub
- [ ] Abrir OBS → menu Ver → Estatísticas

### 3. Iniciar transmissão

- [ ] Selecionar cena `STANDBY` no programa
- [ ] Iniciar Câmera Virtual no OBS
- [ ] Entrar em sala Meet de teste
- [ ] Selecionar OBS Virtual Camera
- [ ] Iniciar gravação Meet (deve auto-iniciar)
- [ ] Cronometrar início

### 4. Sequência durante 60min

**0-5 min**: STANDBY com cronômetro de 5min
**5-10 min**: CAM1 (palestrante simulado)
**10-20 min**: SLIDES_FULL (apresentação real)
**20-30 min**: SLIDES_PIP (alternar câmera ativa do PiP a cada 30s)
**30-40 min**: GRID 2x2
**40-50 min**: TELA_PIP (demo de software)
**50-58 min**: CAM2 ↔ CAM3 ↔ CAM4 (rotação manual)
**58-60 min**: ENCERRAMENTO

### 5. Coletar métricas

A cada 10 min, registrar:

- [ ] CPU geral (%)
- [ ] GPU (%) e GPU encode (%)
- [ ] RAM (GB usados)
- [ ] USB bandwidth por root hub (%)
- [ ] OBS Stats: drops (%), CPU OBS (%), latência render
- [ ] Latência percebida no Meet (cronometrar troca de cena)

### 6. Smoke E2E via script

- [ ] Em paralelo (último 10min) rodar:
  ```
  python3 scripts/obs-headless-check.py
  ```
- [ ] Script trocará por cada uma das 10 cenas e medirá tempo de resposta
- [ ] Validar OK em todas

### 7. Encerrar

- [ ] Selecionar ENCERRAMENTO
- [ ] Aguardar 60s
- [ ] Parar gravação Meet
- [ ] Sair da sala
- [ ] Parar Virtual Camera no OBS

### 8. Validar gravação

- [ ] Acessar Drive compartilhado
- [ ] Confirmar arquivo de gravação ~60min
- [ ] Reproduzir trechos: 0min, 30min, 59min — sem corrupção

### 9. Compilar relatório

Template do relatório:

```yaml
load_test_report:
  date: "<YYYY-MM-DD>"
  duration_min: 60
  metrics:
    cpu_max_pct: <n>
    cpu_avg_pct: <n>
    gpu_encode_max_pct: <n>
    ram_max_gb: <n>
    usb_max_bw_pct_per_root: {hub_a: <n>, hub_b: <n>}
    obs_drops_pct: <n>
    meet_switch_latency_ms_avg: <n>
  smoke_e2e:
    scenes_ok: <n>/10
  recording:
    duration_min: <n>
    integrity: <ok|degraded|broken>
  pass_fail: <PASS|FAIL>
```

Salvar em `output/load-tests/<date>.yaml` (fora do repo, ou junto se for aprovado).

## Acceptance Criteria

- ✅ CPU médio < 70%, máx < 85%
- ✅ Frame drops OBS < 0.5%
- ✅ Latência Meet < 500ms
- ✅ USB bandwidth < 70% por root hub
- ✅ Smoke E2E: 10/10 cenas OK
- ✅ Gravação 60min íntegra

## Quality Gate: QG-LIVE-READY (final)

Esta task fecha os critérios de load test e smoke E2E.

## Handoff

Após PASS, prosseguir para `ship-checklist.md` (operação de evento real).
Após FAIL, abrir issue, classificar regressão e voltar ao step que falhou.
