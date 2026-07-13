# 05 — Compliance e Guardrails (requisitos verificáveis de sistema)

Cada fundamento jurídico do blueprint vira uma **regra de sistema** (bloqueio/validação automática) e/ou um **guardrail de agente IA**. Nada aqui é "boa prática opcional" — é requisito funcional com teste.

## P — Prescrição

| ID | Fundamento | Regra de sistema | Verificação |
|---|---|---|---|
| P1 | Prescrição quinquenal — art. 206, §5º, I, CC/2002, contada do vencimento de cada parcela; para anuidade/semestralidade, termo inicial no vencimento da última parcela da anuidade, cada anuidade autônoma (STJ 3ª T., REsp 2.086.705/SP, j. 05/03/2024) | `Parcela.prescrita` calculada na ingestão e recalculada diariamente; parcela prescrita **bloqueada** em régua, simulador, portal do devedor, negativação, protesto e petições | Teste unitário do cálculo (incl. regra da anuidade); teste de integração provando bloqueio em cada fluxo |
| P2 | Confissão de dívida/renegociação reinicia o prazo a partir da última parcela do novo acordo | Ao gerar `Acordo` com confissão aceita, novo termo prescricional registrado nas parcelas do acordo | Teste: acordo sobre parcela a 4 anos do vencimento → novo prazo corre do acordo |

## C — Conduta de cobrança (CDC)

| ID | Fundamento | Regra de sistema / guardrail | Verificação |
|---|---|---|---|
| C1 | CDC art. 42: não expor o devedor a ridículo, constrangimento ou ameaça; art. 71 (crime): ameaça, coação, afirmações falsas, interferência no trabalho/lazer | **Guardrail de agente e de template:** linguagem respeitosa, identificação clara do escritório e da dívida, sem ameaças ou urgência falsa; revisão jurídica obrigatória de todo template de mensagem antes de ativar | Checklist de aprovação de template; testes adversariais do agente negociador (V1) tentando induzir linguagem vedada |
| C2 | Cobrança direcionada apenas ao responsável financeiro; sem exposição da dívida a terceiros | Mensagens só para os contatos do `Devedor` (responsável financeiro); conteúdo sensível só após verificação de identidade (token) no portal | Teste: notificação nunca enviada a contato do aluno; primeiro contato não revela valores antes da verificação |
| C3 | Frequência e horários limitados | Régua com janela 8h–20h (configurável) e máximo de contatos/semana; contador por devedor | Teste de agendamento fora da janela → reprogramado |
| C4 | Lei 9.870/1999 + CDC: nunca abordar o menor, nunca via escola (agenda, recado) | Canais limitados a telefone/e-mail do responsável; dados do `Aluno` minimizados e nunca usados como canal | Revisão de schema: `Aluno` sem campos de contato |

## N — Negativação e protesto

| ID | Fundamento | Regra de sistema | Verificação |
|---|---|---|---|
| N1 | Súmula 359 STJ: negativação exige notificação prévia | Negativação bloqueada sem `EventoCobranca` de notificação prévia entregue/comprovada | Teste: tentativa sem notificação → erro |
| N2 | Baixa rápida após pagamento | Webhook de pagamento dispara baixa de negativação automaticamente; protesto: orientar devedor sobre cancelamento (ônus dele) e fornecer carta de anuência | Teste do fluxo pagamento → baixa |
| N3 | Nunca negativar/protestar parcela prescrita | Herda o bloqueio P1 | Coberto por P1 |

## L — LGPD

| ID | Fundamento | Regra de sistema | Verificação |
|---|---|---|---|
| L1 | Art. 14 (dados de menores no melhor interesse; Enunciado CD/ANPD 1/2023: bases dos arts. 7º/11 aplicáveis) | Dados do aluno menor **minimizados** (nome, vínculo, série — nada além do necessário); cobrança recai sobre o responsável | Revisão de schema + teste de exportação (dados do menor nunca em mensagens/relatórios à instituição além do vínculo) |
| L2 | Base legal: execução de contrato / exercício regular de direitos / legítimo interesse | Registro da base legal por tratamento no inventário de dados; trilha de acessos | `TrilhaAuditoria` cobre leitura/exportação de dados pessoais |
| L3 | Responsabilidade solidária credor/operador — contrato de operador obrigatório | Onboarding de instituição exige contrato de operador assinado antes de ativar a carteira | Gate no fluxo de ativação de carteira |
| L4 | Retenção/eliminação | Política de retenção por entidade; rotina de eliminação/anonimização pós-encerramento | Job de retenção testado |

## S — Superendividamento (Lei 14.181/2021)

| ID | Fundamento | Regra de sistema | Verificação |
|---|---|---|---|
| S1 | Superendividado (mínimo existencial — Decreto 11.150/2022, alterado pelo 11.567/2023) deve ser direcionado à repactuação, não à cobrança agressiva | Flag `superendividamento` no `Devedor`: sai imediatamente da régua automática → fila humana de repactuação; agente IA instruído a detectar sinais (relato de desemprego, dívidas múltiplas, comprometimento de subsistência) e escalar | Teste: flag ativada → zero envios automáticos subsequentes; testes de detecção do agente (V1) |
| S2 | Conflict-check contra a base consumerista da banca (Fase 0) | Verificação de CPF contra base de clientes da banca antes do primeiro contato; hit → bloqueio + revisão humana | Teste do bloqueio |

## A — Alçadas e integridade financeira

| ID | Regra | Verificação |
|---|---|---|
| A1 | Desconto acima da alçada configurada nunca aplicado sem aprovação registrada (quem, quando) | Teste de fluxo de aprovação |
| A2 | Memória de cálculo (CPC art. 700, §2º, I; Tema 474 STJ) gerada e arquivada para todo valor cobrado judicialmente; engine REPACTUA determinística | Testes unitários da engine; snapshot da memória vinculado à petição |

## M — Marketing e prospecção (Provimento 205/2021 CFOAB)

Aplica-se ao material comercial (fora do escopo deste repo, mas o sistema deve suportar):
- Material de **prospecção B2B informativa** a instituições — não publicidade de massa; sem promessa de resultado, sem "melhor/garantido", sem honorários como isca, **sem divulgar resultados de casos concretos**.
- O portal de transparência ("prova o número") mostra dados **da própria carteira do cliente** — permitido; nunca usar dados de um cliente como case público para outro sem os limites do Provimento.

## Guardrails do agente negociador IA (V1) — resumo operacional

Prompt de sistema do agente deve conter, no mínimo (mantido em `squads/toga-recupera/agents/compliance-guard.md` e `data/referencias-legais.yaml`):
1. NUNCA ameaçar, constranger, mentir ou criar urgência falsa (C1).
2. NUNCA negociar parcela prescrita (P1) — se o sistema fornecer só parcelas válidas, o agente ainda deve recusar se o devedor mencionar dívida antiga não listada.
3. NUNCA falar com terceiros sobre a dívida; verificar identidade antes de revelar valores (C2).
4. Respeitar alçada recebida; acima disso, escalar (A1).
5. Detectar sinais de superendividamento e escalar para humano imediatamente (S1).
6. Sempre se identificar como assistente do escritório; transferir para humano quando solicitado.
