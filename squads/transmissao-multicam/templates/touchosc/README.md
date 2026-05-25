# Layouts TouchOSC — `transmissao-multicam`

> Surface físico complementar ao painel web (`operator-panel/`). Comandos
> são roteados para o OBS via bridge OSC do Next.js, definido em
> `data/osc-mapping.yaml`.

## Arquivos

| Arquivo | Caso de uso |
|---|---|
| [`operator.layout.json`](./operator.layout.json) | Layout master — 4 páginas (Cenas / PiP / Áudio / Show Flow) |
| [`debate.layout.json`](./debate.layout.json) | Variante debate 2x2 (GRID destacado, 4 mutes na main) |
| [`apresentacao-corp.layout.json`](./apresentacao-corp.layout.json) | Variante apresentação (SLIDES_PIP destacado, presets PiP rápidos) |

> ⚠️ Os arquivos `.tosc` binários **não** são versionados aqui — TouchOSC
> Editor é proprietário e o formato muda entre versões. Cada `.layout.json`
> descreve a estrutura completa do layout para que um operador possa
> reconstruí-lo no Editor seguindo o spec, ou que um script gerador (ex:
> `scripts/build-tosc.js`, futuro) possa exportar o `.tosc` final.

## Como construir o `.tosc` no TouchOSC Editor

1. Baixar TouchOSC (Hexler) — paid app
   - **Single platform**: ~US$ 14.99 (ex.: só iPad)
   - **Multi-platform**: ~US$ 49.99 (iPad + macOS + Windows)
   - Editor é gratuito: https://hexler.net/touchosc#downloads

2. Abrir o **Editor**, criar novo documento (**File → New**)
   - **Frame**: 1024 × 768 (iPad) ou 1280 × 800 (Android tablet)
   - **Orientation**: Landscape

3. Para cada página em `operator.layout.json` (`pages[]`):
   - Adicionar **Pager** root e criar páginas com os nomes em `pages[].name`
   - Para cada controle em `pages[].controls[]`, adicionar a primitiva
     correspondente (BUTTON / FADER / RADAR / RADIO / etc.) com:
     - **OSC Send** → o `address` declarado
     - **OSC Receive** → o `feedback_address` (para indicador ativo)
     - Cor / label / posição conforme o spec

4. **File → Export → TouchOSC Document (.tosc)**

5. Sincronizar com o tablet:
   - Wi-Fi: TouchOSC Editor → menu **Sync** → escolher device da lista Zeroconf
   - Ou exportar para iCloud / Drive e abrir no app móvel

## Conexão OSC no app TouchOSC

No app móvel/desktop, **Connections** → **OSC**:

| Campo | Valor |
|---|---|
| Host | IP do PC operador (ex.: `192.168.1.50`) |
| Send port | `9300` (porta default do bridge — `OSC_PORT` no `.env.local`) |
| Receive port | `9301` (`OSC_FEEDBACK_PORT`) |
| TCP/UDP | UDP (default) |
| Zeroconf | Pode ativar para descoberta automática |

E no `operator-panel/.env.local`:

```env
OSC_BRIDGE_ENABLED=true
OSC_PORT=9300
OSC_FEEDBACK_HOST=192.168.1.42   # IP do tablet
OSC_FEEDBACK_PORT=9301
OSC_OBS_PASSWORD=<sua-senha-obs>
```

## Mapeamento OSC

A fonte de verdade é `data/osc-mapping.yaml`. Resumo das famílias:

| Família | Address | Tipo |
|---|---|---|
| Cena | `/tx/scene/{cam1..4, grid, slides_full, slides_pip, tela_pip, standby, encerramento}` | trigger |
| PiP câmera | `/tx/pip/camera/{cam1..4}` | trigger |
| PiP canto | `/tx/pip/corner/{top_left, top_right, bottom_left, bottom_right}` | trigger |
| PiP tamanho | `/tx/pip/size/{20, 25, 30}` | trigger |
| Áudio mute | `/tx/audio/mute/{1..4}` | float 0/1 |
| Áudio fader | `/tx/audio/fader/{1..4}` | float 0..1 (mapeado para [-60..+6] dB) |
| Mute master | `/tx/audio/mute_all` | trigger |
| Modo | `/tx/mode/{manual, auto}` | trigger |
| Show flow | `/tx/show/{standby, golive, encerramento}` | trigger |

### Feedback (OBS/engine → TouchOSC)

| Address | Quando dispara | Valor |
|---|---|---|
| `/tx/feedback/scene/<NAME>` | Cena ativa mudou | `1.0` (acende), outros zeram |
| `/tx/feedback/audio/level/<idx>` | InputVolumeMeters | dBFS [-60..0] |
| `/tx/feedback/connected` | OBS WS conn | `1.0` / `0.0` |
| `/tx/feedback/mode` | Engine override | `1.0` manual, `0.0` auto |
| `/tx/feedback/health/<CAMx>` | Câmera dropout | `0.0` perdeu, `1.0` voltou |

## Customização para um novo evento

1. Duplicar `operator.layout.json` → `meu-evento.layout.json`
2. Editar campos de label/cor/visibilidade no JSON
3. Reconstruir no Editor seguindo as alterações
4. Exportar `.tosc` para a pasta de assets do evento (fora do repo)

## Validação — `checklists/touchosc-validation.md`

8 testes funcionais (T1–T8) que compõem a Quality Gate **QG-TOUCHOSC**.
Executar antes de cada evento real ou após qualquer mudança no mapeamento OSC.
