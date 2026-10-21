# 17 — Plano de Negócio e Modelo Financeiro

> **APEX Plataforma de Cursos Livres** · Documento 17 · v1.0 · 21/10/2026 · Status: **Teste de estresse da estrutura de negócio (não é previsão)**
> Código: [`modelo-financeiro/model.py`](modelo-financeiro/model.py) · Dados: [`cenario_*.csv`](modelo-financeiro/) · Receitas: [Doc 03](03-visao-produto-estrategia.md) §3

> ⚠️ **Leia antes de usar qualquer número.** **Todas as premissas deste documento são hipóteses ilustrativas** — nenhuma vem de dados reais da APEX, e **preços de fornecedores, taxas de PSP, salários, CPL e conversões não foram cotados nem medidos**. O modelo serve para (1) explicitar a estrutura do negócio, (2) mostrar quais alavancas importam e (3) dizer **o que precisa ser verdade** para a conta fechar. **Não é um orçamento nem uma projeção.** As únicas referências de mercado usadas são as taxas dos marketplaces publicadas por fontes de terceiros (§2.2), de confiabilidade limitada.

## 1. Conclusões (sob as premissas ilustrativas)

> Esta seção é **gerada** por `scripts/render_doc17.py` a partir do modelo e do backlog; não editar os números à mão.

<!-- CONCLUSIONS:START -->
1. **Nenhum cenário atinge o equilíbrio em 24 meses**, nem o otimista. A necessidade máxima de caixa fica entre **R$ 5,6 a 6,2 mi** nos três cenários genéricos e em **R$ 3,5 mi** no cenário-alvo.
2. **A equipe é o custo dominante:** R$ 4,6 mi dos R$ 5,6 a 6,2 mi (8 a 14 pessoas a R$ 18 mil/mês cada, incluindo a **construção** da plataforma). A **sensibilidade confirma**: ±20% no custo por pessoa move o caixa de pico em R$ 0,9 mi; nenhuma outra alavanca chega perto.
3. **O escopo da Fase 1 não cabe em 17 semanas com a equipe prevista.** O backlog tem 63 histórias e **619 pessoas-dia** (492 só no núcleo da primeira venda). Com 6 engenheiros (fator de foco de 65%) isso leva **~32 semanas** (~25 para o núcleo); fechar em 17 semanas exigiria **~11 engenheiros**. Por isso **a primeira venda ocorre no mês 8**, não no mês 5 ou 6, e **cada 3 meses de atraso adicionam R$ 0,4 mi à necessidade de caixa**.
4. **Curso de ticket baixo vendido a tráfego pago frio não paga o próprio CAC.** No cenário base, o CAC do canal pago é **R$ 333** e a contribuição da 1ª compra é **R$ 80** (LTV de 12 meses: R$ 101; **LTV/CAC = 0,3**). Para a 1ª compra se pagar seria preciso **ticket ≥ R$ 647** ou **conversão lead→compra de 12,5%**.
5. **Mídia paga adicional piora o resultado** enquanto a economia unitária for negativa (no base, +20% de orçamento de mídia custa R$ 12 mil/mês no mês 24). **Escalar tráfego só faz sentido depois de provar CAC ≤ contribuição.**
6. **O cenário-alvo ("o que precisa ser verdade") chega mais perto, mas ainda não empata no mês 24:** a equipe fica nas 8 pessoas que constroem a Fase 1 (sem crescer para 14), ticket de **R$ 297** com *bump* e trilhas, aquisição puxada por **orgânico, webinars e afiliados** (1.500 leads orgânicos/mês, +8% a.m.), conversão de **4,5%**, **APEX Pass** com 8% de adesão e 5% de churn, 2 novos contratos B2B/mês e IA resolvendo 70% dos tickets. Ainda faltam **R$ 84 mil/mês** no mês 24 (a contribuição teria de crescer **1,6×**).
7. **Escala exigida para empatar:** entre **R$ 263 mil e R$ 960 mil de receita bruta mensal**, conforme o tamanho da equipe (4 a 14 pessoas) e a parcela de mídia (§5.3).
8. **O modelo não inclui as alavancas de escala do roadmap** (*take rate* de marketplace, white-label/SaaS e API, na Fase 4), que **não dependem de produzir conteúdo próprio** e são o motivo de a arquitetura ser multi-tenant (ADR-001). Também não trata parte do custo de equipe como **investimento em um ativo reutilizável** (a plataforma pode atender outras marcas do ecossistema). **Estas são perguntas estratégicas para o plano de negócio**, não para o modelo (§7).
<!-- CONCLUSIONS:END -->

> **Implicação prática:** não comprometer a equipe completa antes de **validar as hipóteses H-01…H-06** (Doc 03 §9). Financiar por **estágios com critérios de passagem** (§6).

## 2. Modelo de receita

### 2.1 Fontes (Doc 03 §3.2) e como entram no modelo

| # | Fonte | Fase | No modelo? | Observação |
|---|---|---|---|---|
| R1 | Venda direta (cursos, e-books, workshops, mentorias) + *order bump* e *upsell* | 1 | ✅ | Ticket, *bump*, *upsell*, recompra, reembolso, *chargeback* |
| R2 | **APEX Pass** (assinatura) | 2 | ✅ | A partir da Fase 2: adesão sobre novos clientes e *churn* mensal |
| R3 | **B2B** (licenças) | 3 | ✅ | A partir da Fase 3: novos contratos/mês e MRR por contrato |
| R4 | Certificações/exames | 3 | ❌ | Sem dado para estimar |
| R5 | Créditos de IA | 2–3 | ❌ | Tratado como custo, não como receita |
| R6 | **Marketplace** (take rate sobre terceiros) | 4 | ❌ | **Principal alavanca de escala fora do modelo** |
| R7 | **White-label/SaaS** | 4 | ❌ | Idem |
| R8 | Patrocínio/anúncios | 4 | ❌ | |

### 2.2 Referência de mercado para *take rate* (só para a Fase 4)

Taxas publicadas por **fontes de terceiros** (blogs de comparação/afiliados; **confirmar nas páginas oficiais**):

| Plataforma | Taxa padrão no cartão (venda direta) |
|---|---|
| Hotmart | 9,9% + valor fixo (R$ 2,49 ou R$ 1,00; fontes divergem) |
| Kiwify | 8,99% + R$ 2,49 |
| Eduzz | 4,9% + R$ 2,49 (8,9% + R$ 2,49 via afiliado) |
| Cakto | 4,99% + R$ 2,49; **Pix 0% + R$ 2,49** |
| Greenn | 4,99% + R$ 1,00 (*low ticket*) |

*Leitura:* o mercado cobra **cerca de 5% a 10% mais fixo** por venda. Um *take rate* da APEX na Fase 4 deveria ser calibrado contra essa faixa **e** contra o que a APEX entrega a mais (LMS, ao vivo, IA, operação fiscal). **Não há hipótese de *take rate* no modelo.**

### 2.3 Hipóteses de preço (a testar)

| Produto | Faixa de partida a testar | Racional |
|---|---|---|
| Produto de entrada (e-book, mini-curso, workshop) | R$ 29–97 | Qualificar compradores; **não** pagar CAC sozinho (§1.3) |
| Curso principal | R$ 147–297 | Ticket do modelo: 147 (base) e 297 (alvo, com trilhas) |
| Trilha/programa | R$ 397–997 | Maior contribuição por cliente; exige prova de resultado e certificação |
| APEX Pass | R$ 39,90/mês (anual com desconto) | Receita recorrente; retenção é a variável crítica |
| B2B | R$ 2.500/mês por contrato (exemplo) | Depende do número de assentos |
| *Order bump* | R$ 19–39 | Aumenta o ticket médio com baixo atrito |

## 3. Estrutura de custos

| Categoria | Como é tratada no modelo | Observação |
|---|---|---|
| **Equipe** (inclui construção da plataforma) | Pessoas × custo mensal carregado (R$ 18 mil, ilustrativo); 8→14 (genéricos) ou 5→8 (alvo) | **Custo dominante** |
| **Mídia paga** | Orçamento mensal com crescimento e teto; CPL | Pode ser desligada até provar a economia unitária |
| **Impostos** | % da receita líquida (placeholder de 6%) | **Depende do regime e do enquadramento — definir com o contador (Q-04)** |
| **PSP** | 4,5% + R$ 1,50 por transação (placeholder) | Referência de mercado: 4,9–9,9% + R$ 1–2,49; **cotar** |
| **Repasse a instrutores** | 30% da receita líquida após taxas (25% no alvo) | Mistura de conteúdo próprio e de terceiros |
| **Afiliados** | 20% das vendas × 30% de comissão (a partir da Fase 2) | Só pago após garantia (7 dias) |
| **Infraestrutura variável** | R$ 4,50 por aluno ativo/mês (vídeo + IA + ao vivo) | **Orçamento de IA por aluno é KPI (Doc 08 §11)** |
| **Suporte** | Tickets por aluno ativo × custo por ticket humano × (1 − resolução por IA) | IA resolve 30% antes da Fase 3 e 45–70% depois |
| **Ferramentas e SaaS** | R$ 20 mil/mês | Cotar |
| **Jurídico, contábil e compliance** | R$ 12 mil/mês | DPO terceirizado, contador, advogado |

**Não modelados (levantar na Fase 0):** produção de conteúdo (estúdio, edição, direitos), registro de marca e busca no INPI, *pentest* e auditoria de acessibilidade, seguros, recrutamento, equipamentos, contingência, custo de capital e variação sazonal.

## 4. Premissas por cenário

Os quatro cenários diferem **apenas** pelas premissas abaixo; o resto da estrutura é idêntico (ver `model.py`).

<!-- TIMELINE:START -->
A linha do tempo do modelo **deriva do backlog** (Doc 19): Fase 0 de 6 semanas + Fase 1 de ~32 semanas com 6 engenheiros. A venda começa no **mês 8** (após o núcleo da Fase 1); os recursos da Fase 2 (funis perpétuos, recuperação, afiliados, APEX Pass) entram no **mês 11** e os da Fase 3 (agentes, B2B) no **mês 16**. Equipe por fase (8 a 14 pessoas nos cenários genéricos; **8 fixas** no cenário-alvo): fases 0–1 até o mês 9, fase 2 até o mês 13, fase 3 até o mês 17, fase 4 depois.
<!-- TIMELINE:END -->

- **conservador / base / otimista:** mesma equipe (8→14); variam CPL, conversão, ticket, reembolso, adesão e *churn* do Pass, crescimento orgânico e resolução por IA.
- **alvo (enxuto):** **não é uma previsão.** É o conjunto de condições que o plano **precisa provar** para se aproximar do equilíbrio: equipe que **não cresce** além das 8 pessoas da Fase 1, ticket maior com trilhas, aquisição puxada por orgânico, webinars e afiliados, mais B2B e Pass.

<!-- MODEL:START -->
## 5. Resultados

> Gerados por `model.py` (verificações de consistência: **OK** nos quatro cenários). Valores em R$ nominais, sem inflação.

### 5.1 Resumo por cenário

| Indicador | conservador | base | otimista | alvo (enxuto) |
|---|---:|---:|---:|---:|
| Receita bruta no mês 12 | R$ 7.307 | R$ 20.106 | R$ 47.036 | R$ 78.787 |
| Receita bruta no mês 24 | R$ 25.135 | R$ 69.014 | R$ 166.901 | R$ 247.666 |
| Resultado operacional no mês 12 | -R$ 246.927 | -R$ 241.160 | -R$ 228.374 | -R$ 159.720 |
| Resultado operacional no mês 24 | -R$ 347.687 | -R$ 326.080 | -R$ 276.190 | -R$ 84.454 |
| Margem de contribuição no mês 24 | 52% | 52% | 52% | 57% |
| Mês de equilíbrio (sustentado) | não atinge em 24 meses | não atinge em 24 meses | não atinge em 24 meses | não atinge em 24 meses |
| Necessidade máxima de caixa (pico do déficit acumulado) | R$ 6.157.077 | R$ 5.973.132 | R$ 5.555.273 | R$ 3.540.342 |
| Resultado acumulado em 24 meses | -R$ 6.157.077 | -R$ 5.973.132 | -R$ 5.555.273 | -R$ 3.540.342 |
| Custo de equipe acumulado em 24 meses | R$ 4.644.000 | R$ 4.644.000 | R$ 4.644.000 | R$ 3.456.000 |
| Quantas vezes a contribuição do mês 24 precisaria crescer para empatar | 28,8x | 10,6x | 4,3x | 1,6x |
| Clientes adquiridos em 24 meses | 1.115 | 2.798 | 5.892 | 5.614 |

### 5.2 Economia unitária

| Indicador | conservador | base | otimista | alvo (enxuto) |
|---|---:|---:|---:|---:|
| Contribuição da 1ª compra (após reembolsos, taxas, repasse, afiliados) | R$ 68 | R$ 80 | R$ 92 | R$ 172 |
| CAC do canal pago (CPL ÷ conversão) | R$ 900 | R$ 333 | R$ 154 | R$ 167 |
| LTV em 12 meses (contribuição) | R$ 77 | R$ 101 | R$ 128 | R$ 229 |
| LTV/CAC (canal pago) | 0,1 | 0,3 | 0,8 | 1,4 |
| Payback na 1ª compra (meses; >1 = não paga na 1ª compra) | 13,3 | 4,2 | 1,7 | 1,0 |
| CAC misto no mês 24 (mídia ÷ novos clientes) | R$ 782 | R$ 293 | R$ 135 | R$ 81 |
| Preço mínimo do produto para a 1ª compra pagar o CAC pago | R$ 1.809 | R$ 647 | R$ 286 | R$ 286 |
| Conversão lead→compra necessária para a 1ª compra pagar o CAC pago | 26,6% | 12,5% | 7,5% | 4,3% |

> **Leitura:** a 1ª compra de um produto de ticket baixo **não paga** o CAC do tráfego pago nos cenários genéricos; só o cenário-alvo (ticket e conversão maiores, CPL menor) chega perto de pagá-lo na 1ª compra.

### 5.3 Ponto de equilíbrio estático

Fórmula: receita bruta necessária = custos fixos ÷ (margem de contribuição sobre a receita bruta − mídia como % da receita bruta).
Custos fixos = equipe × custo por pessoa + ferramentas + jurídico/contábil. Margem de contribuição observada no mês 24 de cada cenário.

| Equipe | Custos fixos/mês | Receita bruta necessária (margem do base, mídia 15%) | idem (margem do alvo, mídia 15%) | idem (margem do alvo, mídia 25%) | Primeiras compras/mês equivalentes (ticket do alvo) |
|---:|---:|---:|---:|---:|---:|
| 4 | R$ 104.000 | R$ 301.850 | R$ 262.686 | R$ 351.459 | 835 |
| 6 | R$ 140.000 | R$ 406.336 | R$ 353.616 | R$ 473.117 | 1.125 |
| 8 | R$ 176.000 | R$ 510.823 | R$ 444.546 | R$ 594.776 | 1.414 |
| 12 | R$ 248.000 | R$ 719.796 | R$ 626.406 | R$ 838.094 | 1.992 |
| 14 | R$ 284.000 | R$ 824.282 | R$ 717.335 | R$ 959.752 | 2.281 |

(Margem de contribuição sobre receita bruta no mês 24: base 49%, alvo 55%.)

### 5.4 Sensibilidade

| Alavanca | Resultado m24 com −20% | Resultado m24 com +20% | Caixa de pico com −20% | Caixa de pico com +20% |
|---|---:|---:|---:|---:|
| Custo por pessoa da equipe | +50.400 | -50.400 | -928.800 | +928.800 |
| Atraso de 3 meses em todo o cronograma (+3 meses de equipe antes de vender) | +4.414 | +0 | -445.429 | +0 |
| Orçamento de mídia (início) | +11.582 | -11.582 | -131.426 | +131.426 |
| CPL (custo por lead) | +4.575 | -3.050 | -47.314 | +31.543 |
| Ticket médio do produto | -4.259 | +4.259 | +44.914 | -44.914 |
| Conversão lead→compra | -4.166 | +4.166 | +43.393 | -43.393 |
| Repasse a instrutores | +3.804 | -3.804 | -32.562 | +32.562 |
| Leads orgânicos (início) | -506 | +506 | +5.541 | -5.541 |
| Taxa de reembolso | +349 | -349 | -3.638 | +3.638 |
| Churn do APEX Pass | +102 | -93 | -524 | +487 |

(Valores são diferenças em R$ em relação ao cenário base. Na linha de atraso há só um cenário (+3 meses); a coluna de −20% mostra a diferença e a de +20% fica em zero.)

> **Leitura:** o **custo por pessoa** domina e o **atraso do cronograma** custa caro (cada mês a mais é um mês de equipe sem receita). **Mais orçamento de mídia reduz o resultado** (sinal negativo): enquanto a contribuição da 1ª compra for menor que o CAC, escalar tráfego aprofunda o déficit. **Reembolso e *churn* do Pass quase não mudam o resultado** nestas escalas, porque a base de assinantes ainda é pequena.

### 5.5 Premissas por cenário

| Premissa | conservador | base | otimista | alvo (enxuto) |
|---|---:|---:|---:|---:|
| Equipe (pessoas, fases 1/2/3/4) | 8/10/12/14 | 8/10/12/14 | 8/10/12/14 | 8/8/8/8 |
| CPL (R$/lead pago) | 18 | 12 | 9 | 9 |
| Conversão lead→compra | 2,0% | 3,0% | 4,5% | 4,5% |
| Ticket do produto principal (R$) | 127 | 147 | 167 | 297 |
| Leads orgânicos no início / crescimento mensal | 400 / 3% | 400 / 5% | 400 / 7% | 1.500 / 8% |
| Reembolso (7 dias) | 8% | 6% | 4% | 6% |
| Adesão ao APEX Pass / churn mensal | 2% / 10% | 4% / 7% | 6% / 5% | 8% / 5% |
| Repasse a instrutores | 30% | 30% | 30% | 25% |
| Resolução de tickets por IA (a partir do mês 16) | 45% | 60% | 70% | 70% |

### 5.6 Cenário base: meses selecionados

| Mês | Leads | Novos clientes | Receita bruta | Contribuição | Marketing | Equipe + fixos | Resultado | Acumulado |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 8 | 2.900 | 87 | R$ 13.843 | R$ 7.533 | R$ 30.000 | R$ 176.000 | -R$ 198.467 | -R$ 1.430.467 |
| 11 | 3.441 | 114 | R$ 18.687 | R$ 8.322 | R$ 35.730 | R$ 212.000 | -R$ 239.409 | -R$ 2.107.441 |
| 14 | 4.082 | 135 | R$ 23.165 | R$ 9.785 | R$ 42.556 | R$ 248.000 | -R$ 280.771 | -R$ 2.872.395 |
| 17 | 4.844 | 174 | R$ 35.711 | R$ 16.451 | R$ 50.684 | R$ 248.000 | -R$ 282.234 | -R$ 3.719.047 |
| 20 | 5.749 | 207 | R$ 49.456 | R$ 23.820 | R$ 60.366 | R$ 284.000 | -R$ 320.546 | -R$ 4.678.037 |
| 24 | 7.224 | 260 | R$ 69.014 | R$ 34.130 | R$ 76.211 | R$ 284.000 | -R$ 326.080 | -R$ 5.973.132 |

<!-- MODEL:END -->

## 6. O que precisa ser verdade e como validar

### 6.1 Condições

| # | Condição (cenário-alvo) | Por que importa | Como validar (Fase 0–1) | Hipótese |
|---|---|---|---|---|
| C1 | **CAC pago ≤ contribuição da 1ª compra**, ou LTV 12 m / CAC ≥ 3 | Sem isso, mais mídia piora o resultado (§1.4) | 3 funis de teste (webinar, lead magnet, quiz) com orçamento pequeno, medindo CPL, comparecimento, conversão | H-01 |
| C2 | **Ticket médio por cliente ≥ ~R$ 300** (curso + *bump* + trilha) | Preço mínimo para o canal pago se pagar é alto (§5.2) | Testes de preço e de oferta de trilha; *order bump* | H-01 |
| C3 | **Aquisição orgânica, de afiliados e de webinars** relevante (≥ 1.500 leads/mês no início) | Reduz o CAC médio | SEO, conteúdo, parcerias, afiliados-piloto | H-01 |
| C4 | **Tutor IA e Pass aumentam retenção e receita** (adesão ≥ 8%, churn ≤ 5%) | Receita recorrente é o que paga a equipe | Teste A/B do tutor; piloto de Pass com Pix Automático | H-02, H-05 |
| C5 | **Equipe que não passa de 8 pessoas** sustentada por automação e *buy-over-build* | O custo de equipe domina (§1.2) | Escopo reduzido do MVP; adotar serviços prontos (ADR-003); medir taxa de automação | — |
| C6 | **B2B** (≥ 2 contratos/mês) | Receita de maior valor por contrato | 10 entrevistas e 3 pilotos de RH | H-06 |
| C7 | **Instrutores parceiros** aderem a repasse automático | Amplia catálogo sem custo fixo de conteúdo | Piloto com 5 instrutores | H-04 |
| C8 | **Alavancas de escala da Fase 4** (marketplace/white-label) com *take rate* viável | Receita sem custo de produção de conteúdo | Pesquisa com criadores e instituições; modelo próprio de *take rate* | (novo) |

### 6.2 Portões de decisão por estágio (propostos)

| Portão | Quando | Pergunta | Critério de passagem (a calibrar com o patrocinador) |
|---|---|---|---|
| **G0** | Fim da Fase 0 | Existe demanda a um CAC viável? | Testes de funil mostram **CAC pago ≤ contribuição da 1ª compra** do produto de teste, **ou** caminho claro de aquisição orgânica; marca consultada no INPI; análise do site de referência concluída (Doc 02) |
| **G1** | Fim da Fase 1 (MVP) | O fluxo vende e entrega sozinho? | **RA% ≥ 90%** (receita automatizada); reembolso e NFS-e automáticos; ativação 24 h ≥ 70%; custo de IA por aluno dentro do orçamento |
| **G2** | Fim da Fase 2 | O crescimento é rentável por cliente? | **LTV/CAC ≥ 3** em ao menos um canal; Pass com churn dentro da meta; webinar/evergreen convertendo |
| **G3** | Fim da Fase 3 | A operação é enxuta? | ≥ 60% dos tickets resolvidos por IA; equipe ≤ o orçado; pilotos B2B pagantes |
| **G4** | Antes da Fase 4 | Vale abrir como marketplace/white-label? | Um instrutor externo vende sem intervenção; modelo de *take rate* validado |

## 7. Perguntas estratégicas que o plano precisa responder

1. **Qual é o papel da APEX no ecossistema?** Produto próprio, plataforma compartilhada entre marcas (parte da equipe como investimento reutilizável) ou negócio de *marketplace*/SaaS? (Q-01)
2. **Quanto capital e por quanto tempo?** O modelo indica uma necessidade de caixa de milhões de reais em 24 meses (§1) sob premissas ilustrativas; **qual é o orçamento real** e qual o apetite de risco? (Q-05)
3. **Qual mix de aquisição?** Dependência de mídia paga é incompatível com ticket baixo (§1.3).
4. **Quais áreas de conteúdo têm demanda validada e margem?** (Q-03)
5. **Como equilibrar escopo e prazo?** Reduzir o MVP ao núcleo "vender e entregar" para antecipar receita.

## 8. Limitações e próximos passos

| Limitação | Próximo passo |
|---|---|
| Premissas não vêm de dados reais | Substituir por cotações de PSP, fornecedores e salários; medir CPL/conversão nos testes da Fase 0 |
| Sem *take rate*, white-label, API e certificações | Estender o modelo com receitas da Fase 4 e margens próprias |
| Retenção modelada de forma simples (*churn* único) | Modelar coortes e *churn* por produto |
| Sem sazonalidade e sem efeito de marca | Incluir calendários de lançamento e campanhas |
| Regime tributário genérico | Refazer com o regime e os CNAEs reais (Q-04) |
| Equipe e custo por pessoa uniformes; capacidade de engenharia estimada por pesos grosseiros (S/M/L) | Detalhar por função, regime (CLT/PJ) e fornecedores |
| Sem fluxo de caixa financeiro (prazos de recebimento do PSP, antecipação, capital de giro) | Adicionar prazos de recebimento e repasse |
| Marketing como custo só de mídia | Incluir criativos, ferramentas, agências, produção |

**Como reproduzir:** `python3 docs/apex-cursos-livres/modelo-financeiro/model.py` imprime as tabelas e grava os CSV por cenário; o script **verifica invariantes** (acumulado = soma corrente; identidade da contribuição; sem receita antes do lançamento; valores finitos).
