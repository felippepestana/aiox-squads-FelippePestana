# Task 01 — Initial Assessment (Avaliação Inicial)

## Agent: Chief Coordinator

## Objetivo

Estabelecer o escopo da perícia, verificar a cadeia de custódia do dispositivo Samsung e preparar todas as condições para o início do exame técnico, em conformidade com **CPC/2015, Arts. 465-466**.

## Inputs Necessários

```yaml
required:
  - numero_processo: string
  - vara_comarca: string
  - nome_juiz: string
  - nome_autor: string
  - nome_reu: string
  - advogado_autor: string
  - advogado_reu: string
  - objeto_pericia: string
  - prazo_entrega: date
  - quesitos_autor: list[string]
  - quesitos_reu: list[string]
  - modelo_samsung: string           # ex: Galaxy S24 Ultra SM-S928B/DS
  - imei: string                     # IMEI 1 (15 dígitos)
optional:
  - imei2: string                    # IMEI 2 (dual SIM)
  - numero_serie: string
  - assistente_tecnico_autor: string
  - assistente_tecnico_reu: string
  - documentos_juntados: list[string]
  - historico_relato_autor: string
  - historico_relato_reu: string
  - knox_status_alegado: string      # Status Knox informado pelas partes
```

## Passos de Execução

### Passo 1.1 — Leitura e Análise do Despacho Judicial

Ler integralmente o despacho de nomeação e verificar:
- [ ] Nomeação formal do perito (nome, registro CREA, especialidade)
- [ ] Objeto da perícia claramente definido
- [ ] Prazo para entrega do laudo
- [ ] Quesitos formulados pelas partes
- [ ] Determinação de como/onde o dispositivo será examinado

### Passo 1.2 — Verificação da Cadeia de Custódia

Conforme **ABNT NBR ISO/IEC 27037:2013**, verificar:
- [ ] O dispositivo foi recebido lacrado ou em embalagem inviolável?
- [ ] Há termo de entrega/recebimento assinado?
- [ ] O IMEI/número de série confere com o documentado no processo?
- [ ] Há danos aparentes que possam ter ocorrido durante o transporte?
- [ ] Registrar em ata fotográfica o estado do dispositivo no recebimento

### Passo 1.3 — Identificação do Dispositivo

Verificar e documentar:
```
Marca:                Samsung Electronics
Modelo:               [ex: Galaxy S24 Ultra]
Número de Modelo:     [ex: SM-S928B/DS — modelo brasileiro dual SIM]
SKU Brasil:           [ex: SM-S928BZKPZTO]
IMEI 1:               [15 dígitos]
IMEI 2:               [15 dígitos, se dual SIM]
Número de Série:      [ex: RFXXXXXXXX — verificar na bandeja SIM ou *#06#]
Capacidade:           [ex: 256 GB / 512 GB / 1 TB]
Cor:                  [ex: Titanium Black / Titanium Gray]
Versão One UI / Android: [se acessível]
Garantia Samsung:     [verificar em samsungmembers.com / samsung.com/br/support]
Knox e-FUSE:          [a ser verificado no exame técnico]
```

### Passo 1.4 — Análise dos Quesitos

Para cada quesito recebido:
1. Identificar a natureza (técnica, jurídica, de valor)
2. Verificar se está dentro do escopo da perícia
3. Registrar quesitos fora do escopo para comunicação ao juízo
4. Mapear quais diagnósticos são necessários para responder cada quesito
5. Identificar quesitos que dependem do status Knox e-FUSE

### Passo 1.5 — Agendamento e Comunicação

- [ ] Notificar assistentes técnicos das partes sobre data/hora/local do exame (mínimo 5 dias antes)
- [ ] Confirmar disponibilidade do laboratório e equipamentos calibrados
- [ ] Verificar certificado de calibração dos instrumentos (ABNT NBR ISO/IEC 17025)
- [ ] Confirmar disponibilidade de PC com ADB instalado para diagnóstico de software/Knox
- [ ] Preparar lista de equipamentos necessários com base no diagnóstico previsto

## Outputs

```yaml
- ata_recebimento_dispositivo.md    # Documenta o recebimento e estado inicial
- lista_quesitos_mapeados.md        # Quesitos x diagnósticos necessários
- cronograma_pericia.md             # Datas de exame, notificações, entrega
- identificacao_dispositivo.md      # Ficha técnica completa do dispositivo
```

## Critério de Conclusão

Task concluída quando:
- Cadeia de custódia estabelecida e documentada
- Todos os quesitos mapeados
- Assistentes técnicos notificados
- Equipamentos verificados e disponíveis (incluindo ADB)
- Dispositivo identificado e registrado

## Prazo Típico

1-2 dias úteis após recebimento do despacho judicial
