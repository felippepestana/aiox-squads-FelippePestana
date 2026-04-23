# Task: Configurar Inscrições e Lotes de Preço

**Task ID:** `lp-configurar-inscricoes`
**Versão:** 1.0
**Agente Executor:** `event-master`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-003
**Comando:** `*configurar-inscricoes [cidade] [capacidade] [data_evento]`

---

## Objetivo

Definir estrutura completa de inscrições para um evento Legendários: lotes de preço
com gatilhos automáticos, formulário LGPD-compliant, configuração Ticket and GO,
e métodos de pagamento (PIX primário).

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| capacidade | integer | Sim | Total de vagas |
| data_evento | date | Sim | Data de início do evento |
| tipo_evento | enum | Sim | TOP, REM, LEGADO |
| data_abertura_inscricoes | date | Não | Quando abrir inscrições (padrão: 12 semanas antes) |

## Precondições

- [ ] Capacidade total definida
- [ ] Data do evento confirmada
- [ ] Tipo de evento definido (determina estrutura de preços)

## Passos

1. **Calcular timeline** — data de abertura de inscrições (12 semanas antes do evento)
2. **Definir estrutura de lotes** — 5 lotes padrão TOP com vagas e preços (usar data de evento)
3. **Configurar gatilhos** — quantidade E data (o que vier primeiro) para cada lote
4. **Incluir lote jovens solteiros** — 18-30 anos, solteiros, preço R$ 450, até 30 vagas
5. **Definir formulário de inscrição** — campos obrigatórios + consentimento LGPD
6. **Especificar métodos de pagamento** — PIX (primário), cartão (2-12x), sem boleto
7. **Definir política de cancelamento** — conforme regras do Ticket and GO (7 dias)
8. **Gerar instruções de configuração** — passo a passo para o coordenador configurar no Ticket and GO
9. **Salvar via Write** — `config-inscricoes-[cidade-slug]-[AAAA-MM].md`

## Output

- **Local:** `config-inscricoes-[cidade-slug]-[AAAA-MM].md`
- **Formato:** Markdown com tabelas e instruções
- **Seções:**
  - Estrutura de lotes (tabela: nome, preço, vagas, gatilhos)
  - Timeline de abertura e encerramento
  - Campos do formulário de inscrição
  - Consentimentos LGPD obrigatórios
  - Configuração de pagamento (PIX + cartão)
  - Política de cancelamento
  - Instruções para Ticket and GO

## Condições de Veto (auto-FAIL)

- Configurar lote com mudança manual (sempre gatilho automático)
- Omitir consentimento LGPD no formulário
- Configurar apenas cartão de crédito (PIX é obrigatório como primário)
- Criar mais de 1 gatilho sem data E quantidade (dual trigger obrigatório)

## Critérios de Aceite

- [ ] 5 lotes padrão + lote jovens solteiros definidos
- [ ] Cada lote com 2 gatilhos: quantidade E data
- [ ] PIX configurado como método primário
- [ ] Formulário com campos de segmentação (status conjugal, filhos, cidade, como conheceu)
- [ ] Consentimento LGPD explícito no formulário
- [ ] Política de cancelamento documentada
- [ ] Arquivo salvo via Write
