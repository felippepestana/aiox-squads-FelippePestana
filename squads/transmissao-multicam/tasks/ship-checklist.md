# Task: Checklist de Evento (Pré / Durante / Pós)

```yaml
task_name: "Checklist completo de evento ao vivo"
status: pending
responsible_executor: human
execution_type: Hybrid
estimated_time: "depende do evento"
quality_gate: null
dependencies:
  - run-load-test.md

input:
  - "Briefing do evento (data, horário, título, stakeholders)"
  - "Scene pack OBS validado"
  - "Conta Meet pronta"

output:
  - "checklists/pre-event.md preenchido"
  - "Evento ao vivo executado"
  - "checklists/post-event.md preenchido"
  - "Gravação arquivada"
```

## Action Items

### Fase 1: Pré-evento (referência: `checklists/pre-event.md`)

#### 24h antes

- [ ] Ensaio técnico de 30min com cenário do evento
- [ ] Atualização de firmware das câmeras (se houver release nova)
- [ ] Validar links Meet + streaming (se aplicável)
- [ ] Distribuir convites e instruções aos participantes/audiência

#### 2h antes

- [ ] Energizar PC + câmeras (todas em standby, USB conectado)
- [ ] Validar 4 câmeras enumerando como SuperSpeed
- [ ] Smoke rápido: trocar cada cena por 30s, observar drops
- [ ] Validar Meet logado, gravação ON, Studio* OFF
- [ ] Validar OBSBOT Remote pareado e com bateria

#### 30min antes

- [ ] Selecionar STANDBY no programa
- [ ] Configurar cronômetro com tempo-alvo do evento
- [ ] Iniciar Virtual Camera no OBS
- [ ] Entrar em sala Meet com OBS Virtual Camera selecionada
- [ ] Habilitar live streaming (se aplicável) e copiar link público

#### 5min antes

- [ ] Audiência começa a entrar
- [ ] Operador confirma cenas no painel
- [ ] Áudio mixer com faders nos níveis nominais
- [ ] Toggle Auto/Manual definido (default manual nesta release)

### Fase 2: Durante o evento

#### Início

- [ ] Cronômetro chega a zero (ou operador clica GO LIVE)
- [ ] Transição STANDBY → CAM1
- [ ] Producer (humano) assume comando

#### Em PROGRAM

- [ ] Cortes seguindo runbook (`templates/runbook-evento.md`)
- [ ] Slides referenciados → SLIDES_FULL ou SLIDES_PIP conforme protagonismo
- [ ] Demos de software → TELA_PIP
- [ ] Debate/painel → GRID
- [ ] PTZ via Plugin OBSBOT ou OBSBOT Remote
- [ ] Logs de troca registrados (se modo auto, automático; se manual, opcional)

#### Encerramento

- [ ] Sinal do apresentador → transição para ENCERRAMENTO
- [ ] Aguardar 60-90s antes de parar gravação
- [ ] Parar gravação Meet
- [ ] Sair da sala

### Fase 3: Pós-evento (referência: `checklists/post-event.md`)

#### Imediato (30min após)

- [ ] Validar gravação no Drive
- [ ] Arquivar link do streaming
- [ ] Backup local da gravação OBS (se houver)
- [ ] Power down PC e câmeras (modo standby; NÃO desconectar USB)

#### 24h após

- [ ] Coletar feedback do operador (lessons learned)
- [ ] Revisar logs de drops/desconexões
- [ ] Cortar highlights (se aplicável)
- [ ] Distribuir gravação aos stakeholders

#### Semanal

- [ ] Compilar métricas de eventos da semana
- [ ] Atualizar runbook com aprendizados

## Acceptance Criteria

- ✅ `checklists/pre-event.md` 100% verde antes do GO LIVE
- ✅ Evento executado sem desconexão de câmera
- ✅ Gravação salva e validada
- ✅ `checklists/post-event.md` preenchido em até 24h

## Handoff

Após evento, abrir nova iteração se houver melhorias identificadas.
