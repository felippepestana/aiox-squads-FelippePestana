# Runbook Operacional — Evento Ao Vivo

> Referência rápida para o operador durante a transmissão.
> Imprimir em A4, manter ao lado do teclado.

## Identificação do evento

```
Evento: __________________________________________
Data:   ___ / ___ / ______      Horário GO LIVE: __:__
Operador: ________________________________________
Backup operador: _________________________________
Sala Meet: _______________________________________
Streaming público: _______________________________
```

## Topologia (preencher na bancada)

| Câmera | Papel | Porta USB | Root hub | Preset principal |
|---|---|---|---|---|
| CAM1 | Palco | _____________ | _____ | _________ |
| CAM2 | Plateia | _____________ | _____ | _________ |
| CAM3 | Closeup | _____________ | _____ | _________ |
| CAM4 | Geral | _____________ | _____ | _________ |

## Atalhos OBS (default)

| Atalho | Ação |
|---|---|
| Ctrl+1..4 | CAM1..CAM4 |
| Ctrl+5 | GRID |
| Ctrl+6 | SLIDES_FULL |
| Ctrl+7 | SLIDES_PIP |
| Ctrl+8 | TELA_PIP |
| Ctrl+0 | STANDBY |
| Ctrl+- | ENCERRAMENTO |
| F1 | Toggle PiP On/Off |
| F2 | PiP corner: bottom_right |
| F3 | PiP corner: bottom_left |
| F4 | PiP corner: top_right |

> Estes atalhos são sugestões. Configurar em OBS → Configurações → Atalhos.

## Show flow

### T-30 min — Setup final

- [ ] PC + 4 câmeras energizados, USB conectado
- [ ] OBS aberto, scene collection carregada
- [ ] Meet logado em conta de transmissão
- [ ] Virtual Camera ON
- [ ] Cronômetro com tempo-alvo configurado
- [ ] Microfones testados em mesa de áudio
- [ ] OBSBOT Remote pareado e com bateria

### T-5 min — Audiência entra

- [ ] Cena STANDBY no programa
- [ ] Audiência vê tela de espera + cronômetro
- [ ] Toggle Auto/Manual: **manual** (default)
- [ ] Producer pronto

### T-0 — GO LIVE

- [ ] Cronômetro zera (ou operador clica GO LIVE manualmente)
- [ ] Transição STANDBY → CAM1
- [ ] Apresentador inicia

### Durante PROGRAM

Decisões padrão:

- **Apresentador falando, sem slide**: CAM1 (palco)
- **Slide referenciado, apresentador secundário**: SLIDES_PIP
- **Slide protagonista, apresentador comenta**: SLIDES_FULL
- **Demo de software**: TELA_PIP
- **Pergunta da plateia**: CAM2 (plateia) por 3-5s, depois CAM1
- **Debate / 2+ pessoas em diálogo**: GRID
- **Closeup pedido**: CAM3 com preset Closeup

Cooldown manual sugerido: ~3 segundos entre cortes em sequência.

### T+90 min — Encerramento

- [ ] Sinal do apresentador → transição ENCERRAMENTO
- [ ] Aguardar 60-90s
- [ ] Parar gravação Meet
- [ ] Sair da sala

## Procedimentos de exceção

### Câmera caiu (desconectou)

1. Trocar imediatamente para outra câmera no programa
2. Verificar cabo USB
3. Se persistir: trocar de porta (ainda traseira)
4. NÃO entrar em pânico; público não percebe troca rápida

### CPU > 85%

1. Confirmar que apenas OBS + Meet estão rodando
2. Reduzir resolução de input das câmeras (1080p → 720p) se crítico
3. Em último caso: parar uma das câmeras menos usadas

### Slides travaram

1. Trocar para CAM1 imediatamente
2. Apresentador continua sem slide
3. Resolver janela em paralelo
4. Voltar a SLIDES_PIP quando OK

### Áudio com eco/microfonia

1. Mute imediato no canal problemático
2. Localizar microfone causador
3. Reduzir gain
4. Validar com mixer antes de unmute

### Meet caiu

1. Continuar gravando localmente no OBS (se configurado)
2. Avisar audiência via outro canal (Slack, WhatsApp)
3. Reentrar em sala nova; redistribuir link
4. Retomar transmissão

## Pós-evento

- [ ] Validar gravação Drive
- [ ] Backup local OBS (se houver)
- [ ] Notas do operador → `checklists/post-event.md`
- [ ] Power down (câmeras em standby; NÃO desplugar USB)
