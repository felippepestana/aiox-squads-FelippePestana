# Task: Ensaio Automatizado

```yaml
task_name: "Ensaio simulado end-to-end com auto-switch e métricas"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "1h"
quality_gate: QG-LIVE-READY
dependencies:
  - configure-meet.md
  - configure-audio.md

input:
  - "Squad provisionado (F1–F4 + F5 + F6)"
  - "Pelo menos 2 falantes de teste OU áudio gravado roteado para os canais MIC_*"
  - "data/mic-mapping.yaml calibrado"

output:
  - "Relatório de ensaio com métricas de switch, drops e ping-pong"
  - "Confiança de que o motor de IA está dentro dos limites operacionais"
```

## Action Items

### 1. Preparar ambiente

- [ ] OBS aberto, scene collection carregada, Virtual Camera ON
- [ ] 4 câmeras conectadas (ou números de teste com Tiny 2)
- [ ] Conta `transmissao@<domain>` logada no Meet
- [ ] Painel operador rodando (`npm run dev` em `operator-panel/`)
- [ ] Motor de IA pronto: `tx-auto-switch --dry-run --log-switches=rehearsal.jsonl`

### 2. Iniciar coleta de métricas

- [ ] Motor com flag `--metrics-port=9099`
- [ ] Verificar `curl http://localhost:9099/metrics` retorna texto Prometheus
- [ ] Importar dashboard `templates/grafana-dashboard.json` no Grafana e apontar para o exporter

### 3. Roteiro do ensaio (45 min)

| Bloco | Duração | Modo | Estímulo |
|---|---|---|---|
| STANDBY com cronômetro 5min | 5m | n/a | Imagem branded |
| Falante 1 sozinho (CAM1) | 5m | auto | leitura de texto em volume normal |
| Alternar Falante 1 ↔ Falante 2 (CAM1↔CAM2) | 10m | auto | turn-taking com pausas curtas |
| Slides + PiP | 5m | auto | apresentação enquanto fala |
| Override manual via painel | 3m | manual | operador troca cenas livremente |
| Voltar para auto + 3 falantes | 7m | auto | painel/debate |
| Cena protegida (SLIDES_FULL) | 3m | auto | confirmar IA não força saída |
| Falha simulada de câmera | 3m | auto | desplugar uma câmera; engine deve falhar para alternativa |
| Encerramento | 4m | n/a | cena ENCERRAMENTO |

### 4. Coletar e analisar métricas

Após o ensaio, ler `rehearsal.jsonl` e `curl /metrics`:

```yaml
rehearsal_report:
  date: "____-__-__"
  duration_min: 45
  metrics:
    switches_total: __
    pingpong_total: __        # esperar < 5% de switches_total
    overrides_total: __
    failovers_total: __
    motion_triggers_total: __ # 0 a menos que F8 enabled
  switches_by_target:
    CAM1: __
    CAM2: __
    CAM3: __
    CAM4: __
  obs:
    drops_pct: __.__
  result: PASS | FAIL
```

### 5. Critérios de aceite (PASS)

- ✅ `pingpong_total / switches_total < 5%` (motor não oscila)
- ✅ `failovers_total >= 1` no bloco de falha simulada (failover funcionou)
- ✅ Override manual reduziu `switches_total` no bloco manual a zero
- ✅ Cena SLIDES_FULL não foi forçada a sair pelo motor
- ✅ Drops OBS < 0.5%
- ✅ Gravação Meet íntegra de 45 min

### 6. Em caso de FAIL

- Pingue-pongue alto → aumentar `cooldown_ms` em mic-mapping.yaml
- Failover não acionou → revisar `health.timeout_ms`, conferir InputActiveStateChanged sendo recebido
- Override ignorado → conferir BroadcastCustomEvent chegando no motor (logs)
- Drops > 0.5% → revisar QG-USB

## Handoff

Após PASS, prosseguir para evento real conforme `ship-checklist.md`.
