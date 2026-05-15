# Task: Elaborar Peça Processual

**ID:** `ap-elaborar-peca`
**Executor:** `redator-juridico`
**Tier:** Tier 1
**Use Cases:** UC-AP-005

## Overview

Redige peças processuais e documentos jurídicos completos no padrão do foro brasileiro,
incorporando os fundamentos jurídicos pesquisados pelos demais agentes e salvando o
documento final via Write.

## Input

- Tipo de documento (obrigatório — ver lista abaixo)
- Qualificação das partes (nome completo, CPF/CNPJ, endereço, profissão)
- Descrição dos fatos relevantes
- Pedidos a formular
- Número do processo e juízo de destino (quando existente)
- Valor da causa (quando aplicável)
- Outputs de @leitor-de-pecas, @pesquisador-juridico e @estrategista-processual (quando disponíveis)

## Tipos de Documentos Suportados

### Peças Processuais
| Código | Documento | Prazo Legal |
|--------|-----------|-------------|
| `petição-inicial` | Petição inicial (abertura de processo) | — |
| `contestação` | Defesa do réu | 15 dias úteis (art. 335 CPC) |
| `reconvenção` | Pedido reconvencional do réu | Junto à contestação |
| `réplica` | Resposta do autor à contestação | 15 dias úteis (art. 351 CPC) |
| `apelação` | Recurso de apelação cível | 15 dias úteis (art. 1.003 CPC) |
| `agravo-de-instrumento` | Recurso contra decisão interlocutória | 15 dias úteis (art. 1.003 CPC) |
| `agravo-regimental` | Recurso contra decisão unipessoal | 15 dias úteis |
| `embargos-de-declaração` | Omissão/obscuridade/contradição | 5 dias úteis (art. 1.023 CPC) |
| `recurso-especial` | Recurso ao STJ | 15 dias úteis (art. 1.003 CPC) |
| `recurso-extraordinário` | Recurso ao STF | 15 dias úteis (art. 1.003 CPC) |
| `memorial` | Alegações finais escritas (cível) | Conforme despacho |
| `manifestação` | Manifestação geral em autos | Conforme intimação |
| `impugnação-ao-cumprimento` | Defesa em cumprimento de sentença | 15 dias úteis (art. 525 CPC) |
| `exceção-de-pré-executividade` | Defesa em execução sem penhora | Sem prazo fixo |

### Documentos Extrajudiciais
| Código | Documento |
|--------|-----------|
| `notificação-extrajudicial` | Notificação formal de pessoa ou empresa |
| `contrato` | Contrato civil, comercial ou de prestação de serviços |
| `distrato` | Rescisão consensual de contrato |
| `procuração` | Instrumento de mandato judicial ou extrajudicial |
| `declaração` | Declaração para fins específicos |

## Action Items

1. Identificar o tipo de documento solicitado (se não fornecido, perguntar ao usuário)
2. Verificar se há outputs disponíveis de @leitor-de-pecas, @pesquisador-juridico e @estrategista-processual
3. Coletar os dados obrigatórios (partes, fatos, pedidos, juízo); usar [PREENCHER: X] para dados ausentes
4. Aplicar o template estrutural do tipo de documento conforme o padrão do foro brasileiro
5. Incorporar fundamentos legais e jurisprudência fornecidos pelo @pesquisador-juridico
6. Alinhar os pedidos à estratégia definida pelo @estrategista-processual (se disponível)
7. Revisar a peça: verificar coerência dos pedidos, completude dos fundamentos, linguagem formal
8. Salvar o documento via Write em `output/pecas/[tipo]-[YYYYMMDD]-[identificador].md`
9. Confirmar ao @analista-chefe o caminho do arquivo salvo

## Output

Arquivo Markdown com a peça completa salvo em `output/pecas/`, contendo:
- Cabeçalho com tipo de ação, juízo e partes
- Seção de fatos narrativos (cronológica e objetiva)
- Seção de direito com dispositivos legais e jurisprudência citados
- Seção de pedidos (principal e subsidiários)
- Assinatura e qualificação do advogado
- Dados faltantes sinalizados como `[PREENCHER: descrição]`

## Acceptance Criteria

- [ ] Tipo de documento corretamente identificado
- [ ] Estrutura completa do tipo de peça aplicada
- [ ] Fundamentos legais presentes (ao menos 1 lei + 1 precedente quando disponível)
- [ ] Pedidos formulados com clareza e alinhados aos fatos
- [ ] Dados faltantes sinalizados com [PREENCHER:] (não deixados em branco ou inventados)
- [ ] Documento salvo via Write (não apenas exibido na tela)
- [ ] Caminho do arquivo confirmado ao @analista-chefe
