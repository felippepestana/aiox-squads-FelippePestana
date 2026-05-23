# Modelo: Quesitos Padrão para Perícia em Dispositivos Android/Samsung

## Instrução de Uso

Este documento apresenta rol de quesitos sugeridos para cada parte em ações
envolvendo dispositivos Android Samsung. Os advogados podem usar como base, adaptando
ao caso concreto. O perito responde a todos os quesitos formulados (CPC, Art. 473, I).

---

## Quesitos Recomendados para o Autor (Consumidor)

### Bloco 1 — Identificação e Estado do Dispositivo
1. O dispositivo periciado é original de fábrica, na configuração comercializada pela Samsung?
2. O número de série e os IMEIs conferem com os documentos de compra juntados?
3. Qual o estado geral de conservação do dispositivo?
4. O dispositivo possui certificação ANATEL válida para comercialização no Brasil?

### Bloco 2 — Diagnóstico do Defeito
5. O dispositivo apresenta defeito(s)? Em caso afirmativo, qual(is) é(são)?
6. O defeito impede o uso normal do produto para a finalidade a que se destina?
7. Qual é a causa técnica do(s) defeito(s) identificado(s)?
8. O defeito é de origem interna (vício do produto) ou externa (uso inadequado, acidente, intervenção)?
9. O carregamento do dispositivo — via cabo USB-C e via carregamento sem fio (wireless) — ocorre normalmente? Em caso negativo, qual(is) modalidade(s) está(ão) com defeito e qual a causa?

### Bloco 3 — Responsabilidade
10. O defeito é compatível com vício de fabricação (defeito intrínseco ao produto)?
11. O defeito poderia ter sido causado ou agravado por intervenção técnica inadequada?
12. Há evidências de que a assistência técnica realizou serviço de forma incorreta ou com ferramentas inadequadas?
13. A assistência técnica que atendeu o produto é Samsung Service Center (SSC) autorizado pela Samsung?
14. O Knox Warranty Void Flag do dispositivo está em 0x0 (intacto) ou 0x1 (acionado)? Em caso de acionamento (0x1), qual a causa provável e há nexo causal entre o acionamento e o defeito em análise?

### Bloco 4 — Reparabilidade e Valor
15. O dispositivo tem conserto? Em caso afirmativo, qual o custo estimado de reparo em Samsung Service Center (SSC) autorizado?
16. Qual o valor de mercado atual do dispositivo em pleno estado de funcionamento?
17. Qual o valor residual do dispositivo no estado atual (para retirada de peças)?
18. O custo de reparo é economicamente viável em comparação ao valor de mercado?

### Bloco 5 — Garantia e Histórico
19. Há registro de serviços anteriores por Samsung Service Center (SSC) autorizado?
20. O período de ocorrência do defeito está dentro do prazo de garantia legal (90 dias — CDC) ou contratual Samsung (12 meses)?
21. O acionamento do Knox Warranty Void Flag (se 0x1) foi causado pelo consumidor ou por terceiro (assistência técnica)?

---

## Quesitos Recomendados para o Réu (Assistência Técnica / Fabricante Samsung)

### Bloco A — Uso pelo Consumidor
A. O dispositivo apresenta evidências de uso inadequado pelo consumidor (queda, imersão em líquido além das especificações IP, uso de acessórios não certificados)?
B. Os danos identificados são compatíveis com desgaste natural pelo uso?
C. Os LDI (Liquid Damage Indicators) estão ativados? Em caso afirmativo, em qual localização e isso implica comprovadamente perda de garantia?
D. O Knox Warranty Void Flag do dispositivo está acionado (0x1)? Em caso afirmativo, há nexo causal demonstrável entre o acionamento do Knox e o defeito em análise?

### Bloco B — Serviço Prestado
E. O serviço descrito na Ordem de Serviço nº [XXX] foi realizado de forma tecnicamente correta, seguindo os procedimentos Samsung?
F. Os procedimentos adotados estão em conformidade com as especificações técnicas do fabricante Samsung?
G. O serviço foi realizado por técnico habilitado como Samsung Service Center (SSC) autorizado?
H. Os componentes utilizados no reparo são originais Samsung (part numbers oficiais)?
I. A ferramenta utilizada para a abertura do dispositivo (parafusos T4 Torx) é a especificada pela Samsung?

### Bloco C — Nexo Causal
J. A falha atual do dispositivo poderia ter ocorrido independentemente do serviço prestado?
K. Há causa alternativa para o defeito que não seja a intervenção técnica realizada?
L. O acionamento do Knox Warranty Void Flag (se 0x1) foi causado exclusivamente pelo serviço realizado, ou o consumidor poderia tê-lo causado previamente?

### Bloco D — Técnico e Normativo
M. O defeito é classificado como "não coberto pela garantia" pelos critérios da Samsung? Por quê?
N. O modelo Samsung periciado possui certificação ANATEL válida para comercialização no Brasil?
O. A exclusão de garantia invocada pela Samsung limita-se à garantia contratual (12 meses) ou também afeta a garantia legal do CDC (90 dias)?

---

## Quesitos de Ofício do Juízo (Sugestões)

I. O defeito poderia ter sido prevenido com inspeção adequada no momento da venda?
II. O consumidor foi informado adequadamente sobre as condições e limitações da garantia, incluindo as implicações do Knox Warranty Void Flag?
III. Qual das hipóteses técnicas (vício de fabricação vs. dano por intervenção) tem maior suporte nas evidências encontradas?
IV. O laudo do assistente técnico do autor/réu é tecnicamente correto? Em que pontos diverge das conclusões do perito?
V. O Knox Warranty Void Flag no estado 0x1 (se aplicável) foi suficientemente analisado pelo perito quanto ao nexo causal com o defeito em análise?

---

## Observações sobre Quesitos Knox

O **Knox Warranty Void Flag** é um dado técnico-jurídico específico do ecossistema Samsung. Ao formular quesitos sobre o Knox, os advogados devem estar cientes de que:

1. **O Knox=0x1 NÃO é automaticamente "culpa do consumidor"** — o perito deve investigar quem e quando acionou o Knox.
2. **O Knox afeta a garantia contratual** (Samsung, 12 meses), mas **NÃO a garantia legal** (CDC, Art. 26, II, 90 dias) se o defeito for de fabricação.
3. **O nexo causal é obrigatório:** Se o defeito é mecânico (ex: conector oxidado), o Knox acionado não tem relação técnica com o defeito, independentemente do valor do flag.
4. **O ônus da prova cabe ao fabricante** (CDC, Art. 12, §3º): a Samsung deve provar que o defeito foi causado pelo desbloqueio — não o consumidor provar que não foi.
