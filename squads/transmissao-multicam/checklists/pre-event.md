# Checklist Pré-Evento

> Marcar cada item antes do GO LIVE. Não avançar com itens vermelhos.

## Identificação

```
Evento: __________________________________________
Data:   ___ / ___ / ______      Horário GO LIVE: __:__
Operador principal: ______________________________
Backup operador: _________________________________
```

## T-24h

### Hardware
- [ ] PC host ligando normalmente
- [ ] 4 câmeras OBSBOT verificadas (sem dano físico)
- [ ] Cabos USB-C (originais ou ativos certificados)
- [ ] Hub Anker A7515 disponível como backup
- [ ] OBSBOT Remote pareado, bateria > 50%
- [ ] 2 monitores conectados (preview + operador)
- [ ] Rede gigabit cabeada testada

### Software
- [ ] OBS Studio versão 30+
- [ ] OBSBOT OBS Plugin instalado
- [ ] obs-advanced-timer instalado
- [ ] OBSBOT Center NÃO instalado
- [ ] obs-websocket habilitado, credenciais em vault

### Ensaio
- [ ] Ensaio técnico de 30min realizado
- [ ] Todas as 10 cenas testadas
- [ ] PiP atualizando em < 300ms
- [ ] Cronômetro com precisão ±1s

### Logística
- [ ] Convites enviados aos participantes
- [ ] Link público (streaming) divulgado se aplicável
- [ ] Backup operador notificado e disponível
- [ ] Plano de contingência distribuído

## T-2h

### Energia + USB
- [ ] PC ligado e estável há ≥ 30min
- [ ] 4 câmeras conectadas DIRETAMENTE no host (NÃO no D6000)
- [ ] USBTreeView aberto, todas as câmeras em SuperSpeed
- [ ] Banda alocada por root hub < 70% (`checklists/usb-bandwidth.md`)

### OBS
- [ ] Scene collection `transmissao-multicam-v1` carregada
- [ ] 10 cenas presentes (visualizar todas em Preview)
- [ ] Studio Mode habilitado
- [ ] Virtual Camera ON
- [ ] Stats OBS aberto: 0 drops em 5min de teste

### Câmeras
- [ ] PTZ via Plugin respondendo em todas as 4
- [ ] Auto-Track validado (toggle ON/OFF)
- [ ] Presets PTZ testados (Wide, Medium, Closeup por câmera)

### Áudio
- [ ] Interface multicanal conectada
- [ ] Microfones testados (todos os canais)
- [ ] Mixer com faders nos níveis nominais
- [ ] VU meters mostrando sinal

### Meet
- [ ] Logado em `transmissao@<domain>`
- [ ] Câmera selecionada: **OBS Virtual Camera**
- [ ] Microfone selecionado: interface multicanal
- [ ] Studio Look: **OFF**
- [ ] Studio Lighting: **OFF**
- [ ] Studio Sound: **OFF**
- [ ] Background blur: **OFF**

## T-30min

### Pré-show
- [ ] Cena STANDBY no programa
- [ ] Imagem branded carregada
- [ ] Cronômetro com tempo-alvo do evento
- [ ] Texto "Próxima sessão: <título>" preenchido
- [ ] Logo visível e centralizado

### Meet
- [ ] Reunião criada
- [ ] Gravação automática iniciando (verificar indicador)
- [ ] Live streaming habilitado (se aplicável)
- [ ] Link de streaming copiado e pronto para distribuir

### Operador
- [ ] Toggle Auto/Manual em **Manual** (default)
- [ ] Atalhos de teclado revisados
- [ ] Runbook do evento à mão (`templates/runbook-evento.md`)

## T-5min

- [ ] Audiência começa a entrar
- [ ] Producer no posto
- [ ] Backup operador ciente
- [ ] PowerPoint/Keynote aberto e pronto
- [ ] Volume monitor de áudio em nível confortável

## GO LIVE

- [ ] Cronômetro zera (ou operador clica GO LIVE manualmente)
- [ ] Transição STANDBY → CAM1
- [ ] Producer assume comando

## Critério de aprovação

**Não fazer GO LIVE com qualquer item desmarcado em T-30min ou T-5min.**

Em caso de bloqueio:
1. Avaliar se é crítico (hardware/software) ou cosmético (texto, logo)
2. Bloqueios críticos: adiar GO LIVE em até 10min, comunicar audiência via Meet
3. Bloqueios cosméticos: GO LIVE com workaround, anotar para post-event
