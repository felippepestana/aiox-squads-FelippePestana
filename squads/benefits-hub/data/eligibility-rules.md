# Framework de Regras de Elegibilidade

Referência para `eligibility-checker`. As regras são **determinísticas**: mesma situação → mesma elegibilidade. Toda regra é citada no resultado.

---

## Dimensões de elegibilidade

| Dimensão | Exemplos de regra |
|----------|-------------------|
| **Tipo de vínculo** | CLT, PJ, estágio, aprendiz, temporário — cada um com benefícios distintos |
| **Tempo de casa** | Previdência exige >= X meses; alguns benefícios têm carência de adesão |
| **Dependentes** | Plano de saúde: cônjuge, filhos até 21 (ou 24 universitário), conforme regra do plano |
| **Carga horária** | Parcial vs. integral pode afetar proporção de VR/VT |
| **Localidade** | VT e fretado variam por região/unidade |
| **CCT/ACT** | Convenção coletiva pode tornar benefícios obrigatórios |

## CLT & CCT

- **VT (Vale-Transporte):** obrigatório por lei (Lei 7.418/1985); desconto do empregado limitado a 6% do salário básico.
- **CCT/ACT:** a Convenção Coletiva da categoria frequentemente define benefícios obrigatórios (VR/VA, seguro de vida, auxílios). **Sempre confirmar a CCT vigente** — varia por categoria/sindicato.
- CCT desconhecida → ALERT; confirmar com `peopleops` antes de concluir elegibilidade.

## Carências

Declarar SEMPRE, antes da adesão:
- **Plano de saúde:** carências da ANS (ex: urgência/emergência 24h; parto a termo 300 dias; doenças preexistentes até 24 meses)
- **Previdência:** carência de tempo de casa para adesão/contrapartida
- **Seguro de vida:** geralmente sem carência

> Carência escondida em letra miúda é anti-padrão. Transparência antes da adesão.

## Determinismo

- Mesma situação (vínculo + tempo + dependentes + CCT) → mesma elegibilidade, sempre.
- Sem aleatoriedade, sem exceção não documentada.
- Cada veredito traz o `rule_trace` (a regra que o sustenta).

## Eventos de vida (janelas especiais)

Alguns eventos abrem janela de adesão fora do período regular:
- Nascimento/adoção de filho → incluir dependente (prazo típico 30 dias)
- Casamento/união estável → incluir cônjuge
- Mudança de endereço → recalcular VT/fretado

O `fit-advisor` usa esses eventos como âncora de recomendação; o `eligibility-checker` confirma a janela.
