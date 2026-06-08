# Banco de Horas — Metodologia de Cálculo

## Fundação Legal

**Lei 9601/1998** (Banco de Horas) + jurisprudência (CLT Art. 59)

---

## Componentes Básicos

### 1. Horas Registradas vs. Contratuais

```
Horas Registradas = Σ (clock_out - clock_in, excluindo intervalos)
Horas Contratuais = jornada_por_dia × dias_úteis_no_período

Saldo Diário = Horas Registradas - Horas Contratuais
```

### 2. Categorização de Horas

Toda hora deve ser categorizada em:

| Categoria | Definição | Cálculo | Impacto no Banco |
|-----------|-----------|---------|------------------|
| **Normal** | Dentro da jornada contratada (8h/dia, tipicamente) | Até 8h/dia | Saldo = 0 |
| **Extra** | Acima de 8h/dia (ou contrato) | Acima de 8h/dia | +1h extra = +1h no banco |
| **Noturna** | Entre 22:00-05:00 (reduzida a 7h20) | Ver Art. 73 | +adicional 20% |
| **Falta** (não-autorizada) | Nenhum registro; sem licença | Desconto completo do dia | -8h (típica) no banco |
| **Férias** | Autorizado; pago, não trabalho | Contagem como normal | Crédito especial (accrual) |
| **Afastamento** | Licença INSS, maternidade, etc. | Depende da legislação | Preserva banco (não debita) |

---

## Fórmula de Cálculo

### Banco de Horas Mensal

```
Saldo_Mês = (Horas_Registradas - Horas_Contratuais) 
          - Horas_Utilizadas_Banco_Anterior
          + Créditos_Férias
          + Créditos_Licença_Especial

Novo_Saldo = Saldo_Anterior + Saldo_Mês
```

### Exemplo Prático

```
Colaborador: EMP001
Período: Junho/2026
Jornada Contratada: 8h/dia × 22 dias úteis = 176h

Horas Registradas (junho):
  - Normal: 160h
  - Extra (24h+): 16h
  - Falta (não-autorizada, 1 dia): -8h
  Total Registradas: 168h

Cálculo:
  Horas Extras: 16h (acima de 8h/dia)
  Banco Anterior: 0h
  Banco Débito (falta): -8h

Saldo_Junho = 168 - 176 + 0 = -8h (débito)

OU (segregado):
  Crédito: +16h (extra)
  Débito: -8h (falta)
  Saldo Líquido: +8h (crédito)
```

---

## Regras Especiais

### 1. Intrajornada (Art. 71)
- **Intervalo de refeição (1-2h):** Descontado da jornada
- **Registro prático:** Sistema de ponto deve descontar automaticamente

### 2. Horas Noturnas (Art. 73)
- **Horário:** 22:00-05:00
- **Duração reduzida:** 7h20 = 52min30seg por "hora"
- **Cálculo:** 1h noturna = 1.15h de banco (se compensação em banco)
- **Adicional:** 20% sobre salário (se pago, não banco)

### 3. Férias (Art. 130)
- **Accrual:** 1/12 de dias úteis por mês (tipicamente 1.67 dias/mês)
- **Banco de Férias:** Separado do banco de horas
- **Não deduz:** Férias usadas não debitam banco de horas

### 4. Afastamentos (INSS, Maternidade, etc.)
- **INSS:** Contribuição contínua; não afeta banco
- **Maternidade:** 120 dias (CLT Art. 392); não afeta banco
- **Outras licenças:** Depende de acordo; tipicamente não afeta banco

### 5. Banco Negativo
- **Permitido:** Sim, com limite (jurisprudência varia por estado)
- **Limite típico:** -50h a -100h (dependendo de legislação local)
- **Compensação:** Deverá ser trabalhado/compensado antes de rescisão

### 6. Passivos Trabalhistas

#### Extra Não Paga
```
Excesso_Extra = (Extra_Trabalhado - Extra_Compensada_Banco) - 2h/dia
Passivo = Excesso_Extra × Taxa_Adicional (50%)
Exemplo: 5h extra/mês × 50% = 2.5h de direto (ação trabalhista)
```

#### Falta Não Compensada
```
Falta = Horas_Ausentes_Não_Autorizadas
Passivo = Falta (débito de salário OU banco, per contrato)
```

#### Interjornada Violada
```
Se Intervalo < 11h entre turnos:
Passivo = 1 dia de salário + 50% adicional (Art. 66)
```

---

## Integração com Payroll (peopleops)

### Campos eSocial Relacionados

- **S-2200:** Jornada base (deve coerência com banco calculado)
- **S-2240:** Eventos (férias, licenças, faltas não-autorizadas)
- **Base de Cálculo:** Folha de pagamento = salário × (dias_trabalhados/dias_úteis) ± banco_compensação

### Coerência: chronos ↔ peopleops

```
Banco_chronos (calculado) ~= Banco_payroll (peopleops)
Tolerância: ±5% (rounding + timing)

Se divergência > 5%:
  → Investigar: setup diferente (férias, afastamentos)?
  → Sincronizar antes de liberar para payroll
```

---

## Exemplo de Fechamento Mensal

```yaml
Período: Junho/2026
Filial: São Paulo

Colaborador: EMP020
Contrato: 8h/dia, 20 dias úteis = 160h

Registros:
  - Jun 1-5: 40h (normal)
  - Jun 6: Falta não-autorizada (-8h)
  - Jun 7-10: 32h + 2h extra (10h/dia)
  - Jun 11-20: 72h (9h/dia × 8 dias) = 8h extra
  - Jun 21-30: 48h (8h/dia × 6 dias)
  
Total Registrado: 192h
Extra Detectado: 2 + 8 = 10h
Falta: -8h

Banco_Junho = 192 - 160 = +32h (bruto)
Menos Falta: +32 - 8 = +24h (líquido)
OU Extra: +10h, Falta: -8h, Saldo: +2h

Passivo: Extra de 10h; limite 2h/dia × 20 dias = 40h/mês
  → 10h está DENTRO do limite → SEM passivo
  → Pode ser acumulado em banco ou pago 50% adicional

Novo_Banco_Anterior: 0h
Saldo_Novo: +2h (ou +10h - 8h conforme modelo)
```

---

## Determinismo & Auditabilidade

**Regra:** Mesmo input (período, registros, setup) → Mesmo output (banco)

**Validação chronos:**
1. Inputs: Registros consolidados, contratos, setup de férias/afastamentos
2. Processamento: Aplicar categorizações, fórmulas
3. Output: Banco determinístico, rastreável
4. Audit Trail: Timestamp, user, mudanças, razão

**Quality Gate:** compliance-gate valida determinismo & coerência com payroll
