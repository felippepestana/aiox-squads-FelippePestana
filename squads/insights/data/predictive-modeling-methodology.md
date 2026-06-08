# Metodologia de Modelagem Preditiva (Turnover & Burnout)

Referência para `risk-modeler`. Princípio central: **predição é alerta precoce para apoio, nunca veredito sobre a pessoa.** Sempre agregado, sempre com confiança declarada, sempre cross-sinal.

> Bases: predictive attrition modeling (people analytics); sinais de burnout (Maslach — exaustão, cinismo, ineficácia); early-warning analytics. Adaptado com guardrails éticos.

---

## 1. Por que cross-sinal (e não fonte única)

Uma fonte isolada gera falso sinal. Ex: super-jornada sozinha pode ser projeto pontual; combinada com queda de eNPS e estagnação, vira sinal real de risco.

- **Regra:** exigir **>= 2 fontes-módulo**. Fonte única → recusar com ALERT "validade insuficiente".

## 2. Sinais por tipo de risco

### Turnover (risco de saída)
- Queda de eNPS / engajamento (pulse)
- Progressão estagnada / nota de ciclo em queda (performa)
- Super-jornada recorrente / absenteísmo crescente (chronos)
- Tenure curto em coorte (peopleops)

### Burnout (risco de esgotamento)
- Super-jornada recorrente (>10h/dia ou >50h/semana) (chronos)
- Queda de engajamento + sinais de exaustão em pesquisa aberta (pulse)
- Absenteísmo crescente (chronos)

## 3. Features — o que NUNCA entra

**Atributos protegidos são proibidos como preditores:** raça/cor, gênero, idade, PCD, estado de saúde, religião, orientação sexual, estado civil, maternidade/paternidade.

- Eles entram **somente** na auditoria de viés do resultado (ethics-gate), nunca como input do modelo.
- Usar idade como preditor de saída, por exemplo, é discriminação algorítmica — VETO garantido.

## 4. Agregação obrigatória

- Risco é computado por **coorte** (área, função, tempo de casa), nunca por indivíduo.
- Coorte mínima: **n >= 5**. Coorte menor → agregar ou não reportar.
- Proibido ranking nominal de "quem vai sair".

## 5. Confiança (declaração obrigatória)

| Confiança | Quando |
|-----------|--------|
| **high** | >= 2 fontes concordantes, n grande, padrão estável |
| **medium** | >= 2 fontes, n moderado, ou alguma sazonalidade não controlada |
| **low** | sinais conflitantes, n pequeno, janela curta → "não decida só com isto" |

## 6. Drivers acionáveis (não rótulos)

Todo risco deve vir com **drivers acionáveis** — o que mudar para baixá-lo:
- super-jornada → rebalancear carga (chronos)
- progressão estagnada → plano de carreira (org-architect)
- queda de eNPS → 1:1 estruturado + ação de clima (pulse/performa)

Risco sem driver acionável é alarme sem saída — não entregar.

## 7. Limites (sempre declarar)

- **Correlação, não causa:** drivers são associações; só experimento/controle prova causa.
- **Sazonalidade:** janelas curtas podem confundir efeito sazonal com tendência.
- **Deriva do modelo:** revalidar periodicamente; padrão de ontem pode não valer amanhã.

---

## Fluxo determinístico do modelo

1. Receber dataset cross-módulo (>= 2 fontes) do data-weaver
2. Selecionar features acionáveis (excluir protegidos)
3. Pontuar risco por coorte (>= 5)
4. Declarar features, pesos, amostra e confiança
5. Apontar drivers acionáveis
6. Declarar limites
7. Encaminhar ao ethics-gate (VETO se nominal/protegido/n<5)
