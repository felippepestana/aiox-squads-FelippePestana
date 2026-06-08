# Payroll Calculation (reference)

> How the common payroll numbers are built. Tables and rates change every year (and sometimes mid-year) —
> always confirm the current official table/competência before closing. Decision support, not the official source.

## Ordem de cálculo (visão simplificada)

1. **Proventos:** salário-base + variáveis (horas extras, DSR, comissões, bônus).
2. **Base INSS:** soma das verbas que compõem a base de contribuição.
3. **INSS:** alíquota **progressiva por faixas** sobre a base (cada faixa com sua alíquota; resultado é a soma das parcelas por faixa).
4. **Base IRRF:** proventos − INSS − dedução por dependente.
5. **IRRF:** tabela progressiva vigente (alíquota − parcela a deduzir).
6. **FGTS:** 8% da remuneração — **depósito do empregador**, não entra no líquido do empregado.
7. **Líquido:** proventos − descontos (INSS, IRRF e demais descontos legais/autorizados).

## Princípios do módulo

- **Toda verba rastreável:** valor → base → fundamento. Nada de total opaco.
- **Tabela declarada:** sempre nomear a competência/tabela usada e sinalizar confirmação antes do fechamento.
- **FGTS não é desconto:** mostrar explicitamente como depósito do empregador.
- **Variáveis geram DSR:** lembrar do reflexo do DSR sobre horas extras/comissões quando aplicável.

## Anti-erros comuns

- Misturar FGTS no líquido do empregado.
- Aplicar INSS como alíquota única em vez de progressiva por faixas.
- Esquecer deduções por dependente na base de IRRF.
- Fechar a folha sem passar pelo gate de auditoria.
