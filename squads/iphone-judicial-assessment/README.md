# Squad: iPhone Judicial Assessment — Avaliação Técnica Pericial Judicial

## Visão Geral

Este squad fornece um modelo estruturado e normatizado para a elaboração de **laudos técnicos periciais judiciais** em dispositivos iPhone, destinado ao uso por **perito judicial habilitado** perante o Poder Judiciário brasileiro.

O squad cobre todo o ciclo pericial: desde o recebimento do objeto até a entrega do laudo assinado, em conformidade com o **Código de Processo Civil (CPC/2015)**, o **Código de Defesa do Consumidor (CDC)** e as **normas técnicas ABNT/NBR** aplicáveis.

---

## Qualificação Técnica Exigida

Conforme **CPC/2015, Art. 156** e **Resolução CFT nº 1.010/2005**:

| Requisito | Especificação |
|---|---|
| Formação | Engenheiro Eletricista, Engenheiro Eletrônico ou Tecnólogo em Eletrônica |
| Registro Profissional | CREA ativo (modalidade Engenharia Elétrica/Eletrônica) |
| Especialização Apple | ACMT ou ACiT (recomendado) |
| Pós-graduação | Perícia Judicial ou Engenharia Forense (recomendado) |
| Experiência mínima | 3 anos em diagnóstico/reparo de dispositivos Apple |
| Habilitação judicial | Cadastro no TJ do estado de atuação |

---

## Fluxo do Squad (Cadeia de Comando)

```
[ENTRADA: Despacho Judicial + Objeto]
         │
    ┌────▼────────────────────────────────┐
    │   TIER 0 — Chief Coordinator        │
    │   Orquestra o processo pericial     │
    └────┬──────────────────┬─────────────┘
         │                  │
    ┌────▼──────┐     ┌─────▼───────────────┐
    │  TIER 1   │     │       TIER 1         │
    │ Hardware  │     │  Legal-Normative     │
    │Specialist │     │    Specialist        │
    └────┬──────┘     └─────┬───────────────┘
         │                  │
    ┌────▼──────────────────▼────┐
    │     TIER 2 — Report Writer │
    │   Redige o laudo pericial  │
    └────────────┬───────────────┘
                 │
    ┌────────────▼───────────────┐
    │  TIER 3 — QC Validator     │
    │  Valida antes da assinatura│
    └────────────┬───────────────┘
                 │
    [SAÍDA: Laudo Técnico Pericial]
```

---

## Normas Aplicáveis

### Normas Jurídicas
- **CPC/2015** (Lei 13.105/2015) — Arts. 156-187 (perito), 464-480 (prova pericial)
- **CDC** (Lei 8.078/1990) — Arts. 12 (responsabilidade), 18 (vícios), 26 (prazos)
- **Resolução CFT nº 1.010/2005** — Atribuições profissionais do engenheiro
- **Código de Ética do CREA** — Deveres do profissional técnico

### Normas Técnicas ABNT/NBR
- **ABNT NBR ISO/IEC 17025:2017** — Competência de laboratórios de ensaio e calibração
- **ABNT NBR ISO/IEC 27037:2013** — Evidência digital: identificação, coleta e preservação
- **ABNT NBR 5410:2004** — Instalações elétricas de baixa tensão
- **IEC 62368-1:2018** — Segurança de equipamentos de TI/AV
- **IEC 60068-2** — Ensaios ambientais (temperatura, umidade, vibração)

### Padrões Fabricante
- **Apple Service Fundamentals (ASF)**
- **Apple Global Service Exchange (GSX)** — base de diagnóstico
- **Apple MFi Program** — certificação de acessórios de carga

---

## Como Usar

```bash
# 1. Preencha os inputs obrigatórios em config.yml
# 2. Execute o Chief Coordinator com os dados do processo
aiox run squads/iphone-judicial-assessment \
  --input numero_processo="0001234-56.2024.8.26.0000" \
  --input modelo_dispositivo="iPhone 16 Pro Max A3293" \
  --input imei="35XXXXXXXXXXXXXX" \
  --input descricao_defeito="Não carrega via cabo USB-C; apenas carrega por indução; parou de funcionar após intervenções"

# 3. O squad produz automaticamente:
#    - laudo-tecnico-completo.md
#    - resumo-executivo.md
#    - respostas-quesitos.md
```

---

## Estrutura de Arquivos

```
squads/iphone-judicial-assessment/
├── agents/
│   ├── chief-coordinator.md
│   ├── hardware-specialist.md
│   ├── legal-normative-specialist.md
│   └── report-writer.md
├── tasks/
│   ├── 01-initial-assessment.md
│   ├── 02-hardware-diagnosis.md
│   ├── 03-legal-framework.md
│   ├── 04-report-generation.md
│   └── 05-qc-validation.md
├── templates/
│   ├── laudo-tecnico.md          ← Modelo completo com exemplo iPhone 16 Pro Max
│   └── quesitos-padrao.md
├── data/
│   ├── nbr-references.md
│   ├── iphone-diagnostics.md
│   └── legal-definitions.md
├── config.yml
└── README.md
```

---

## Aviso Legal

> Este squad é uma ferramenta de **apoio técnico** ao perito judicial habilitado.  
> O laudo final deve ser **assinado digitalmente pelo perito** com certificado ICP-Brasil (e-CPF A3 ou A1).  
> O uso desta ferramenta não substitui o julgamento técnico e a responsabilidade legal do profissional.  
> Laudos gerados sem revisão e assinatura de perito habilitado **não têm validade jurídica**.
