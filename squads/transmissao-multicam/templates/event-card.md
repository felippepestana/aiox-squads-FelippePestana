# Event Card — Imprimir A4 frente e verso

> **Preencher antes do evento. Imprimir. Manter ao lado do teclado.**
> Substitui ter que abrir o runbook digital sob estresse.

---

## FRENTE — Identificação + Atalhos + Show Flow

### Evento

| Campo | Valor |
|---|---|
| **Evento** | __________________________________________ |
| **Data / GO LIVE** | ___ / ___ / ______  às  __ : __ |
| **Operador principal** | __________________________________________ |
| **Backup operador** | __________________________________________ |
| **Sala Meet** | __________________________________________ |
| **Link streaming** | __________________________________________ |

### Atalhos de teclado (OBS configurado)

| Atalho | Cena | Atalho | Cena |
|---|---|---|---|
| **Ctrl+1** | CAM1 | **Ctrl+6** | SLIDES_FULL |
| **Ctrl+2** | CAM2 | **Ctrl+7** | SLIDES_PIP |
| **Ctrl+3** | CAM3 | **Ctrl+8** | TELA_PIP |
| **Ctrl+4** | CAM4 | **Ctrl+0** | STANDBY |
| **Ctrl+5** | GRID | **Ctrl+-** | ENCERRAMENTO |

### Decisões padrão de switching

| Situação | Cena |
|---|---|
| Apresentador falando, sem slide | **CAM1** |
| Slide referenciado + apresentador secundário | **SLIDES_PIP** |
| Slide protagonista + apresentador comenta | **SLIDES_FULL** |
| Demo de software | **TELA_PIP** |
| Pergunta da plateia | **CAM2** por 3-5s, depois **CAM1** |
| Debate / 2+ pessoas em diálogo | **GRID** |

> Cooldown entre cortes em sequência: **~3 segundos**.

---

## VERSO — Recovery + Escalation

### 🚨 Recovery rápido (decorar)

#### Câmera caiu (desconectou)
1. Trocar IMEDIATAMENTE para outra câmera no programa
2. Verificar cabo USB → trocar de porta se persistir (ainda traseira)
3. NÃO entrar em pânico; público não percebe troca rápida

#### CPU > 85%
1. Fechar tudo exceto OBS + Meet
2. Reduzir resolução das câmeras (1080p → 720p) se crítico
3. Último caso: parar a câmera menos usada

#### Slides travaram
1. Trocar para CAM1
2. Apresentador continua sem slide
3. Resolver janela em paralelo

#### Áudio com eco/microfonia
1. Mute imediato no canal problemático
2. Localizar mic causador
3. Reduzir gain antes de unmute

#### Meet caiu
1. Continuar gravando localmente no OBS
2. Avisar audiência via canal alternativo (Slack/WhatsApp)
3. Reentrar em sala nova; redistribuir link
4. Retomar transmissão

#### OBS crashou
1. Reabrir OBS — Scene Collection carrega automaticamente
2. Virtual Camera reativar manualmente
3. Reentrar no Meet selecionando OBS Virtual Camera
4. Tempo total esperado: ~60-90s
5. Se demorar mais que 2min: trocar para sala Meet de backup

#### Rede caiu totalmente
1. Verificar cabo gigabit (LED do switch)
2. Tentar tethering 4G/5G do celular como fallback emergencial
3. Avisar audiência via canal alternativo
4. Decidir adiar ou continuar quando rede voltar

#### Toggle Auto/Manual não está respondendo (F6 engine offline)
1. Forçar **modo manual** no painel
2. Operar 100% via atalhos de teclado
3. Avisar producer
4. Pós-evento: investigar logs do `tx-auto-switch`

### 📞 Escalation tree

| Severidade | Quando | Quem | Como |
|---|---|---|---|
| **P0** | Tudo caiu / não consegue iniciar | Owner técnico | _telefone:_ ____________ |
| **P1** | Show degradado mas no ar | Backup operador | _telefone:_ ____________ |
| **P2** | 1 câmera, cosmético | Anotar para post-event | nada agora |

### ✅ Quick verify (10 segundos)

Antes do GO LIVE, olhar:

- [ ] Cena **STANDBY** no programa
- [ ] Cronômetro contando regressivo
- [ ] Virtual Camera **ON** (ponto verde no OBS)
- [ ] Meet mostrando a tela de espera
- [ ] Toggle **Manual** no painel
- [ ] VU meters dos mics com sinal

### Pós-evento (30 minutos depois)

- [ ] Confirmar gravação no Drive (`Eventos/<ano>/<mes>/`)
- [ ] Sair do Meet
- [ ] Parar Virtual Camera
- [ ] Câmeras em standby (**NÃO desplugar USB**)
- [ ] Preencher `checklists/post-event.md` em 24h

---

## Versão para impressão

Render PDF com:

```bash
pandoc templates/event-card.md -o event-card.pdf \
  --pdf-engine=wkhtmltopdf \
  -V geometry:margin=1.5cm \
  -V papersize:a4
```

Ou abrir no editor markdown preferido e Print → Save as PDF (frente e verso).

> **Última atualização desta entrega:** ver `git log -1 --follow templates/event-card.md`
