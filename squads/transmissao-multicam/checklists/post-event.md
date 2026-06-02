# Checklist Pós-Evento

> Preencher em até 24h após o encerramento.

## Identificação

```text
Evento: __________________________________________
Data:   ___ / ___ / ______
Duração efetiva: ___ minutos
Operador: ________________________________________
```

## T+30min — Imediato

### Gravação
- [ ] Abrir Drive compartilhado
- [ ] Confirmar arquivo de gravação salvo
- [ ] Reproduzir 3 trechos: 0:00, meio, final-1min
- [ ] Sem corrupção visível
- [ ] Áudio nítido

### Streaming (se aplicável)
- [ ] Arquivar link público
- [ ] Anotar contagem aproximada de espectadores

### Ambiente
- [ ] OBS Virtual Camera parada
- [ ] Sair da sala Meet
- [ ] OBS fechado salvando coleção
- [ ] Câmeras em standby (NÃO desplugar USB)

## T+1h — Coleta de métricas

### Métricas técnicas

```yaml
event_metrics:
  duration_min: __
  obs:
    avg_cpu_pct: __
    max_cpu_pct: __
    drops_pct: __.__
    encoding_lag_ms_max: __
  usb:
    disconnections: __
    cameras_in_superspeed_throughout: yes|no
  meet:
    avg_switch_latency_ms: __
    recording_integrity: ok|degraded|broken
  audience:
    peak_participants: __
    streaming_viewers: __
```

### Logs de auto-switch (se modo auto)

- [ ] Exportar log de trocas
- [ ] Calcular: número total de trocas, ping-pong (trocas < cooldown), distribuição por câmera

## T+24h — Lessons learned

### O que funcionou
- _______________________________________________
- _______________________________________________
- _______________________________________________

### O que falhou ou quase falhou
- _______________________________________________
- _______________________________________________
- _______________________________________________

### Mudanças propostas

| Item | Severidade | Ação | Responsável |
|---|---|---|---|
| | low/med/high | | |

### Atualizações no runbook

- [ ] Modificar `templates/runbook-evento.md` com aprendizados
- [ ] Modificar `data/usb-topology.yaml` se houve troca de porta
- [ ] Modificar `templates/pip-layout.yaml` se houve ajuste de PiP
- [ ] Atualizar firmware mínimo em `data/obsbot-firmware.yaml` se houve incidente

## Distribuição

- [ ] Gravação enviada aos stakeholders (lista no briefing)
- [ ] Resumo enviado à equipe de produção
- [ ] Highlights cortados (se aplicável)
- [ ] Métricas anexadas em pasta do evento

## Arquivamento

- [ ] Renomear arquivo de gravação no Drive: `<data>_<titulo>.mp4`
- [ ] Mover para pasta `Eventos/<ano>/<mês>/`
- [ ] Atualizar planilha de eventos da equipe

## Próximo evento

- [ ] Briefing recebido
- [ ] Data marcada
- [ ] Operador alocado
