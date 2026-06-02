# Task 05 — QC Validation (Validação de Qualidade)

## Agent: QC Validator

## Objetivo

Realizar a revisão final do laudo técnico pericial antes da assinatura digital e entrega ao juízo, verificando sistematicamente a completude, consistência técnica, conformidade jurídica e adequação formal do documento, mediante checklist de 30 itens.

## Inputs Necessários

```yaml
required:
  - laudo_tecnico_pericial_v1.md       # Laudo redigido pelo Report Writer
  - registro_knox_flag.md              # Registro formal do Knox Flag
  - lista_quesitos_mapeados.md         # Para verificar que todos os quesitos foram respondidos
  - identificacao_dispositivo.md       # Para cruzar dados com o laudo
```

## Protocolo de Validação

### Etapa 5.1 — Leitura Integral do Laudo

Ler o laudo completo de uma vez, anotando inconsistências, campos não preenchidos e pontos de dúvida antes de iniciar o checklist formal.

**Pontos de atenção especial Android/Samsung:**
- Knox Flag: está documentado com método, valor e interpretação?
- LDI: localizações, estados e fotos estão presentes?
- Protocolo de carregamento: SFC+/SFC/AFC ou apenas "carregador Samsung"?
- Parafusos: T4 Torx mencionados (não "Pentalobe" ou genérico)?
- SSC: a diferença entre Samsung Service Center autorizado e assistência não autorizada está clara?

### Etapa 5.2 — Execução do Checklist de 30 Itens

Para cada item: registrar **APROVADO**, **REPROVADO** (com descrição do problema) ou **N/A**.

#### Bloco A — Completude Estrutural (CPC/2015, Art. 473)

```
[ ] A.01  Número do processo correto e consistente em todas as páginas
[ ] A.02  Identificação completa do perito (nome, CREA, especialidade)
[ ] A.03  Identificação completa das partes (autor, réu, advogados)
[ ] A.04  Objeto da perícia claramente definido
[ ] A.05  Histórico do caso documentado
[ ] A.06  Lista de documentos analisados presente
[ ] A.07  Metodologia de exame descrita com norma de referência
[ ] A.08  Resultados de todos os testes documentados com valores
[ ] A.09  Todos os quesitos do Autor respondidos
[ ] A.10  Todos os quesitos do Réu respondidos
[ ] A.11  Quesitos do Juízo respondidos (se houver) / N/A
[ ] A.12  Conclusão clara, direta e sem ambiguidades
[ ] A.13  Local, data por extenso e identificação do perito no encerramento
[ ] A.14  Número de registro CREA visível
```

#### Bloco B — Qualidade Técnica Android/Samsung (ABNT NBR ISO/IEC 17025:2017)

```
[ ] B.01  Equipamentos de medição identificados (marca, modelo, número de série)
[ ] B.02  Certificados de calibração referenciados (quando aplicável)
[ ] B.03  Todas as medições com unidades de medida (V, A, W, Ω, °C)
[ ] B.04  Fotos numeradas sequencialmente e referenciadas no texto
[ ] B.05  Hipóteses de falha baseadas em evidências — não em suposições
[ ] B.06  Terminologia técnica Samsung correta (AFC/SFC/SFC+ distinguidos; "T4 Torx"; "SSC")
[ ] B.07  Resultados de testes em tabela (não apenas texto corrido)
[ ] B.08  Limitações do exame declaradas (se houver) / N/A
[ ] B.09  Knox Warranty Void Flag documentado: valor obtido + comando ADB utilizado
[ ] B.10  LDI: localizações verificadas por modelo, estado registrado, foto referenciada
[ ] B.11  Parafusos T4 Torx: estado documentado (evidência ou ausência de abertura)
[ ] B.12  Protocolo de carregamento negociado identificado (SFC+ / SFC / AFC / 5V / falha total)
```

#### Bloco C — Qualidade Jurídica (CPC/2015 + CDC)

```
[ ] C.01  Enquadramento no CDC correto (Art. 12 vs. Art. 18 vs. Art. 14)
[ ] C.02  Responsabilidades atribuídas com embasamento normativo
[ ] C.03  Nexo causal estabelecido de forma lógica e documentada
[ ] C.04  Linguagem das respostas acessível a não-técnicos (CPC Art. 473, §2º)
[ ] C.05  Perito não emitiu opinião jurídica além da competência técnica
[ ] C.06  Perito não ultrapassou os limites da designação (CPC Art. 467)
[ ] C.07  Imparcialidade mantida — linguagem não favorece nenhuma das partes
[ ] C.08  Knox=0x1: análise CDC Art. 12 §3º presente + nexo causal avaliado
```

#### Bloco D — Conformidade Formal (ABNT NBR ISO/IEC 17025:2017 + ICP-Brasil)

```
[ ] D.01  Formato PDF/A (padrão arquivístico para processos judiciais)
[ ] D.02  Assinatura digital ICP-Brasil válida (verificar em validar.iti.gov.br)
[ ] D.03  Certificado digital: e-CPF A1 ou A3, vigente, não revogado
[ ] D.04  Tamanho do arquivo dentro do limite do sistema judicial (≤ 25 MB)
[ ] D.05  Paginação sequencial correta
[ ] D.06  Número do processo no cabeçalho ou rodapé de todas as páginas
[ ] D.07  Fotos legíveis em resolução adequada (mínimo 300 DPI)
[ ] D.08  Anexos numerados e referenciados no corpo do laudo
```

### Etapa 5.3 — Verificações Especiais Android/Samsung

```
VERIFICAÇÃO DO KNOX WARRANTY VOID FLAG:
[ ] O laudo registra o valor exato obtido: "ro.boot.warranty_bit = 0" ou "= 1"
[ ] O comando ADB (ou método alternativo) está documentado
[ ] A interpretação técnica do Knox está presente na seção 7 (Discussão Técnica)
[ ] Se Knox=0x1: análise CDC Art. 12, §3º está na seção jurídica / respostas aos quesitos
[ ] Knox=0x1 não foi assumido automaticamente como "culpa do consumidor" sem nexo causal

VERIFICAÇÃO DOS LDI (LIQUID DAMAGE INDICATORS):
[ ] Localizações específicas para o modelo periciado estão documentadas
[ ] Estado de cada LDI registrado (branco/prata = não ativado; vermelho/rosa = ativado)
[ ] Foto do LDI presente nos Anexos com identificação
[ ] LDI ativado (se for o caso) não foi automaticamente interpretado como "perda de garantia"
    sem análise complementar do nexo causal

VERIFICAÇÃO DO SISTEMA DE CARREGAMENTO:
[ ] Carregador Samsung original testado (não apenas genérico)
[ ] Protocolo máximo negociado identificado (SFC+ 45W / SFC 25W / AFC 15W / 5V / falha)
[ ] Resultado da carga wireless (Qi2) documentado separadamente da carga via cabo
[ ] Tabela de medições elétricas com V, A, W para cada combinação testada

VERIFICAÇÃO DE CONFORMIDADE SAMSUNG:
[ ] ANATEL: número de homologação verificado e registrado
[ ] Modelo SM-XXXXX/DS ou variante corretamente identificado no laudo
[ ] Samsung Service Center (SSC) diferenciado de assistência técnica genérica
[ ] Garantia Samsung: vigência verificada (samsung.com/br/support/warranty)
```

### Etapa 5.4 — Classificação e Decisão

| Categoria | Itens | Impacto | Ação |
|---|---|---|---|
| **Crítico** | A.01–A.14, D.01–D.04 | Invalida o laudo | Bloquear entrega |
| **Relevante Técnico** | B.01–B.12 | Compromete qualidade técnica | Retornar ao Report Writer |
| **Relevante Jurídico** | C.01–C.08 | Compromete qualidade jurídica | Retornar ao Report Writer |
| **Formal** | D.05–D.08 | Impacto operacional | Corrigir antes da entrega |

### Etapa 5.5 — Emissão do Resultado

**Modelo de resultado APROVADO:**
```
RESULTADO DA VALIDAÇÃO — LAUDO Nº [NÚMERO]/[ANO]
Data/Hora: [DD/MM/AAAA HH:MM]

RESULTADO GERAL: APROVADO

CHECKLIST: 30/30 itens APROVADOS (ou N/A para itens não aplicáveis ao caso)

VERIFICAÇÕES ESPECIAIS:
- Knox Warranty Void Flag: DOCUMENTADO (valor: [0x0/0x1], método: ADB)
- LDI: DOCUMENTADO ([N] indicadores verificados)
- Protocolo de carregamento: DOCUMENTADO ([protocolo negociado])

RECOMENDAÇÃO: Laudo apto para assinatura digital ICP-Brasil e peticionamento no
sistema judicial eletrônico.
Prazo de entrega ao juízo: [DATA]
```

**Modelo de resultado REPROVADO:**
```
RESULTADO DA VALIDAÇÃO — LAUDO Nº [NÚMERO]/[ANO]
Data/Hora: [DD/MM/AAAA HH:MM]

RESULTADO GERAL: REPROVADO

ITENS REPROVADOS:
[ITEM]: [DESCRIÇÃO DO PROBLEMA] → [CORREÇÃO NECESSÁRIA]
[ITEM]: [DESCRIÇÃO DO PROBLEMA] → [CORREÇÃO NECESSÁRIA]

PRAZO PARA RE-SUBMISSÃO: [DATA]
RESPONSÁVEL PELA CORREÇÃO: Report Writer
```

## Outputs

```yaml
- relatorio_validacao_qc.md          # Checklist preenchido + resultado geral
- laudo_aprovado_para_entrega.md     # Laudo validado (se APROVADO)
```

## Critério de Conclusão

Task concluída quando:
- Checklist de 30 itens completamente preenchido (nenhum item em branco)
- Resultado emitido: APROVADO ou REPROVADO
- Se REPROVADO: lista detalhada de itens a corrigir entregue ao Report Writer
- Se APROVADO: laudo encaminhado ao Chief Coordinator para assinatura digital

## Prazo Típico

1 dia útil

## Comunicação ao Chief Coordinator

Ao concluir a validação, notificar o Chief Coordinator:
- Se APROVADO: "Laudo Nº [X] validado — pronto para assinatura digital ICP-Brasil"
- Se REPROVADO: "Laudo Nº [X] retornado ao Report Writer — [N] itens a corrigir — prazo: [data]"
- Se prazo judicial em risco: alertar imediatamente para solicitação de prorrogação (CPC, Art. 476)
