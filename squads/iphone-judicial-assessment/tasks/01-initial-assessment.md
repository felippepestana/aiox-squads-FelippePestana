# Task 01 — Initial Assessment (Avaliação Inicial)

## Agent: Chief Coordinator

## Objetivo

Estabelecer o escopo da perícia, verificar a cadeia de custódia do dispositivo e preparar todas as condições para o início do exame técnico, em conformidade com **CPC/2015, Arts. 465-466**.

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
  - modelo_iphone: string
  - imei: string
  - numero_serie: string
optional:
  - assistente_tecnico_autor: string
  - assistente_tecnico_reu: string
  - documentos_juntados: list[string]
  - historico_relato_autor: string
  - historico_relato_reu: string
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
Marca:                Apple Inc.
Modelo:               [ex: iPhone 16 Pro Max]
Número de Modelo:     [ex: A3293 — modelo brasileiro]
IMEI 1:               [15 dígitos]
IMEI 2:               [15 dígitos, se aplicável]
Número de Série:      [12 caracteres alfanuméricos]
Capacidade:           [ex: 256 GB / 512 GB / 1TB]
Cor:                  [ex: Titânio Natural / Deserto / etc.]
Versão iOS:           [se acessível]
Garantia Apple:       [verificar em checkcoverage.apple.com]
```

### Passo 1.4 — Análise dos Quesitos

Para cada quesito recebido:
1. Identificar a natureza (técnica, jurídica, de valor)
2. Verificar se está dentro do escopo da perícia
3. Registrar quesitos fora do escopo para comunicação ao juízo
4. Mapear quais diagnósticos são necessários para responder cada quesito

### Passo 1.5 — Agendamento e Comunicação

- [ ] Notificar assistentes técnicos das partes sobre data/hora/local do exame (mínimo 5 dias antes)
- [ ] Confirmar disponibilidade do laboratório e equipamentos calibrados
- [ ] Verificar certificado de calibração dos instrumentos (ABNT NBR ISO/IEC 17025)
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
- Equipamentos verificados e disponíveis
- Dispositivo identificado e registrado

## Prazo Típico

1-2 dias úteis após recebimento do despacho judicial
