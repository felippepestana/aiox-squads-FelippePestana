# Passivos Trabalhistas & Riscos de Jornada

## Definição

Um **passivo trabalhista** é um débito ou obrigação do empregador decorrente de violação de legislação trabalhista (CLT, convenções coletivas, acordo).

**Contexto chronos:** Passivos de jornada são direitos do empregado relacionados a horas trabalhadas, extras, interjornada, repouso.

---

## Tipos de Passivos (Jornada)

### 1. Extra Não Paga

**Fundamento Legal:** CLT Art. 59 (Horas Extras)

**Definição:** Horas trabalhadas além da jornada contratada (8h/dia, tipicamente) que não foram remuneradas com adicional de 50% nem compensadas com banco.

**Cálculo:**
```
Horas_Extra_Detectadas = (Horas_Registradas - 8h) por dia
Limite_Legal = 2h/dia OU equivalente em banco mensal

Excesso_Não_Compensado = Horas_Extra - Limite_Legal - Horas_Compensadas

Passivo = Excesso × Valor_Hora × 1.50 (50% adicional mínimo)
```

**Exemplo:**
```
EMP001, Junho/2026:
  - Total extra: 40h
  - Limite legal: 2h/dia × 22 dias = 44h
  - Extra dentro limite: 40h
  - Excesso: 0h
  → SEM PASSIVO

EMP002, Junho/2026:
  - Total extra: 60h (violação sistêmica)
  - Limite legal: 44h
  - Excesso: 16h
  - Salário: R$ 3.000/mês (R$ 137.5/h)
  → PASSIVO: 16h × R$ 137.5 × 1.5 = R$ 3.300
```

**Mitigação:**
- Pagar 50% adicional em folha de pagamento
- OU usar banco de horas (compensação com folga)
- OU rebalancear carga de trabalho

**Risco:** Ação trabalhista; condenação + custas

---

### 2. Interjornada Violada (Art. 66)

**Fundamento Legal:** CLT Art. 66 (Intervalo Entre Turnos)

**Definição:** Violação do intervalo mínimo de 11 horas entre término de um turno e início do próximo.

**Cálculo:**
```
Intervalo_Efetivo = Hora_Inicio_Proximo_Turno - Hora_Fim_Turno_Anterior

Se Intervalo_Efetivo < 11h:
  Horas_Deficit = 11h - Intervalo_Efetivo
  
Passivo_Por_Dia = 1 dia salário + 50% adicional (jurisprudência)
```

**Exemplo:**
```
EMP015:
  Jun 10 (S): Saída 22:00
  Jun 11 (D): Entrada 08:30 (próximo turno)
  
  Intervalo: 08:30 - 22:00 = 10h 30min (VIOLAÇÃO)
  Deficit: 11h - 10.5h = 0.5h
  
Passivo: 1 dia salário + 50%
  Se salário: R$ 3.000/mês (R$ 150/dia)
  → PASSIVO: R$ 225
```

**Mitigação:**
- Ajustar horários (ex: iniciar próximo turno 09:00)
- Oferecer compensação
- Documentar excepcionalidade

**Risco:** Indenização + condenação em ação

---

### 3. Repouso Semanal Negado (Art. 67)

**Fundamento Legal:** CLT Art. 67 (Repouso Semanal Remunerado)

**Definição:** Trabalho sem 24h de descanso contínuo por semana, ou > 1 domingo consecutivo sem repouso.

**Cálculo:**
```
Repouso_Semanal = 24h consecutivas (preferência: domingo)

Se Violação:
  Passivo = 1 dia salário × 2 (dobrado, Art. 67 § 2)
  Por cada semana violada
```

**Exemplo:**
```
EMP020: Junho/2026
  Trabalhou: 21 dias úteis + 3 domingos (excepcional por projeto)
  Repouso faltante: 3 dias
  
  Salário: R$ 3.000/mês (R$ 150/dia)
  Passivo: 3 × 150 × 2 = R$ 900
```

**Mitigação:**
- Conceder repouso compensatório em dia útil
- Documentar excepcionalidade + compensação

**Risco:** Indenização dobrada + custas

---

### 4. Mudança de Turno Sem Aviso (Art. 219)

**Fundamento Legal:** CLT Art. 219 (Mudança de Horário/Turno)

**Definição:** Alteração de turno (especialmente para noturno) sem aviso prévio de 30 dias.

**Consequência:**
```
Sem aviso: Caracteriza rescisão indireta (culpa do empregador)
Passivo: Todos os direitos rescisórios (13º, FGTS, indenização)
```

**Exemplo:**
```
EMP030:
  Turno: Diurno (08:00-17:00)
  Mudança: Noturno (22:00-06:00), comunicado com 2 dias de antecedência
  
Violação: Art. 219 (aviso < 30 dias)
Risco: Rescisão indireta; direitos rescisórios completos
```

**Mitigação:**
- Aviso prévio de 30 dias para mudança
- Acordo com colaborador
- Documentar consentimento

**Risco:** Rescisão indireta; perda de causa trabalhista

---

### 5. Trabalho Noturno Sem Adicional (Art. 73)

**Fundamento Legal:** CLT Art. 73 (Trabalho Noturno)

**Definição:** Trabalho entre 22:00-05:00 sem pagamento de adicional de 20% (mínimo).

**Cálculo:**
```
Horas_Noturnas = Σ (Horas entre 22:00-05:00)

Passivo = Horas_Noturnas × Valor_Hora × 0.20 (20% mínimo)
          × (Período_Sem_Pagamento_em_Meses) [atrasado]

Nota: Deve ser pago diferenças cumulativas (atrasado).
```

**Exemplo:**
```
EMP040: Junho-Dezembro/2025 (7 meses)
  Jornada: 22:00-05:00 (7h/dia × 22 dias/mês = 154h/mês)
  Período: 7 meses = 1.078h noturnas
  Salário: R$ 3.000/mês (R$ 137.5/h)
  
Passivo: 1.078h × R$ 137.5 × 0.20 = R$ 29.645 (atrasado)
  
Plus: Direitos rescisórios se houver demissão
```

**Mitigação:**
- Pagar 20% adicional em folha (sempre)
- Documentar jornada noturna
- Cumprir eSocial S-2200

**Risco:** Ação trabalhista por diferenças atrasadas + custas

---

### 6. Falta Não-Autorizada (Descontos)

**Fundamento Legal:** CLT Art. 473 (Faltas Justificadas) e Art. 133 (Descontos)

**Definição:** Ausência não-autorizada do trabalho sem justificativa legal (não é doença, morte na família, etc.).

**Direitos do Empregador:**
```
Desconto = Horas_Falta × Valor_Hora

Limite: Máximo desconto = Salário - Piso Mínimo Legal
```

**Exemplo:**
```
EMP050: Jun 10 (M)
  Falta não-autorizada: 8h (dia completo)
  Salário: R$ 3.000/mês
  Valor hora: R$ 137.5
  
Desconto: 8h × R$ 137.5 = R$ 1.100

Note: Pode ser descontado em folha de pagamento,
      OU negociado com colaborador (ex: trabalhar dia repouso)
```

**Jurisprudência:**
- Desconto deve ser comunicado
- Reincidência (3+ faltas) pode justificar demissão
- Falta isolada (1ª ocorrência) geralmente é perdoada com conversa

**Mitigação:**
- Dialogue com colaborador
- Registrar incidente (data, motivo se explicado)
- Oferecer compensação (dias extra ou outros)

**Risco:** Baixo se isolado; médio se padrão (justifica demissão)

---

## Matriz de Passivos

| Tipo | Artigo | Risco | Valor Típico | Mitigação |
|------|--------|-------|--------------|-----------|
| Extra Não Paga | Art. 59 | ALTO | 50% adicional × meses | Pagar ou compensar banco |
| Interjornada | Art. 66 | ALTO | 1 dia + 50% por violação | Ajustar horários |
| Repouso Negado | Art. 67 | ALTO | 1 dia × 2 por semana | Conceder compensatório |
| Mudança Turno | Art. 219 | CRÍTICO | Rescisão indireta | 30 dias aviso prévio |
| Noturno | Art. 73 | MÉDIO | 20% × horas × meses | Pagar adicional |
| Falta | Art. 133 | BAIXO | Desconto hora | Dialogue, primeira ocorrência |

---

## Fluxo de Detecção & Mitigação (chronos)

```
┌─────────────────────────────────────┐
│ 1. Detecção Automática (alert-warden)│
│    - Padrão de super-jornada?       │
│    - Interjornada < 11h?            │
│    - Falta não-autorizada?          │
│    - Horário noturno?               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 2. Classificação & Contexto         │
│    - Tipo de passivo (ex: extra)    │
│    - Valor estimado                 │
│    - Risco legal (baixo/alto)       │
│    - Causa (excepcional vs. padrão) │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 3. Reporte (bank-manager)           │
│    - Passivos consolidados          │
│    - Segregados por tipo            │
│    - Recomendações de ação          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 4. Conformidade (compliance-gate)   │
│    - Passivos devem estar          │
│      resolvidos/documentados        │
│      antes de liberação de período  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 5. Execução (peopleops)             │
│    - Pagamento em folha, OU         │
│    - Banco de horas, OU             │
│    - Negociação c/ colaborador      │
└─────────────────────────────────────┘
```

---

## Política Recomendada

1. **Detecção Proativa:** chronos audita continuamente
2. **Escalação Rápida:** HIGH-risk → gestor + RH imediatamente
3. **Documentação:** Tudo registrado em audit trail
4. **Comunicação:** Colaborador informado de passivos potenciais
5. **Resolução:** Acordo antes de rescisão
6. **Conformidade:** Nenhum período liberado sem passivos resolvidos/documentados
