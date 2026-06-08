# Legislação de Jornada (CLT)

## Referência: Artigos do Código de Trabalho Brasileiro (CLT) — Jornada & Horário

### Art. 5 — Jornada Máxima
- **Jornada diária máxima:** 8 horas
- **Jornada semanal máxima:** 44 horas
- **Excepção:** Contrato pode estipular jornada inferior; nunca superior sem compensação
- **Interpretação:** A "jornada de trabalho" é o tempo entre início e fim do dia (com intervalos intrajornada excluídos)

### Art. 58 — Computação da Jornada
- **Início da jornada:** Quando o empregado está à disposição do empregador
- **Término:** Quando a disposição cessa
- **Intervalo:** Descontos de refeição/descanso (Art. 71) são EXCLUÍDOS da contagem

### Art. 59 — Horas Extras
- **Limite:** Máximo 2 horas por dia (Art. 59, caput)
- **Compensação:** Pode ser paga com adicional de 50% (mínimo) OU compensada com folga no mesmo período
- **Banco de Horas:** Lei 9601/1998 permite banco de horas para compensação (com acordo)
- **Cálculo:** Extra = tempo trabalhado além de 8h/dia (ou contrato)
- **Aviso:** Extras systemáticas (padrão) têm implicações de "jornada efetiva" (jurisprudência)

### Art. 66 — Interjornada (Intervalo Entre Turnos)
- **Mínimo obrigatório:** 11 horas de descanso entre o término de um turno e início do próximo
- **Aplicação:** Mesmo para empregados em regime de turno
- **Violação:** Gera direito a compensação/indenização
- **Exceção:** CLT não prevê exceção; jurisprudência aceita em casos excepcionais documentados

### Art. 67 — Repouso Semanal
- **Descanso:** 24 horas consecutivas (mínimo) por semana
- **Preferência:** Domingo, mas pode ser outro dia com acordo
- **Limite:** Máximo 1 ausência de domingo por mês (ou compensação)
- **Implicação:** Violação gera direito a adicional de 100% do dia (dobrado)

### Art. 71 — Intervalo Intrajornada
- **Refeição:** Mínimo 1 hora, máximo 2 horas (entre 11h e 14h, preferencialmente)
- **Descanso:** Mínimo 1 hora (jornadas > 6h)
- **Exclusão da Jornada:** Estes intervalos NÃO são contados como trabalho
- **Nota:** Se intervalo não é respeitado, empregador é responsável por compensação

### Art. 468 — Mudança de Horário / Turno
- **Consentimento:** Qualquer alteração no contrato requer consentimento mútuo (não pode prejudicar o empregado)
- **Aviso prévio:** Recomendado 30 dias de antecedência para mudança de turno (especialmente para noturno)
- **Sem consentimento:** Pode caracterizar rescisão indireta (culpa do empregador)
- **Jurisprudência:** Aplicável também a mudanças de local de trabalho

### Art. 73 — Trabalho Noturno
- **Horário noturno:** 22:00 às 05:00
- **Duração:** 7 horas (reduzida vs. 8h diurna; 1h noturna = 52min30seg)
- **Adicional:** Mínimo 20% sobre o salário base
- **Nota:** Cálculo de hora noturna = 52 min 30 seg (em vez de 60 min)

---

## eSocial Mapping — Eventos Relacionados a Jornada

### S-2200 — Conformação Jornada Base
- **Campo obrigatório:** Horário usual início/fim, dias semana
- **Frequência:** Enviado quando há mudança
- **Validação:** Deve coerência com registros de ponto (espelho de ponto)

### S-2240 — Eventos de Jornada (Alterações)
- **S-2240 01:** Mudança de turno
- **S-2240 04.01:** Ausência (falta)
- **S-2240 04.02:** Férias
- **S-2240 04.03:** Licença (INSS, maternidade, etc.)
- **Cada evento:** Deve ser mapeado a um registro/razão de banco de horas

---

## Legislação Complementar

- **Lei 9601/1998:** Banco de horas
- **Lei 10.101/2000:** Compensação de jornada
- **Jurisprudência**: Súmula 85 (TST) — Jornada efetiva reconhecida por prova da execução
- **ISO 18001:** Saúde e segurança ocupacional (contextual para detecção de fadiga)

---

## Violações Comuns & Riscos

| Violação | Artigo | Risco Legal | Compensação Típica |
|----------|--------|-------------|-------------------|
| Jornada > 8h sem compensação | Art. 5, 59 | Passivo (ação trabalhista) | 50% adicional + 13º |
| Interjornada < 11h | Art. 66 | Indenização | 1 dia + 50% |
| Falta de repouso semanal | Art. 67 | Indenização + dobro | 1 dia + 100% |
| Turno mudado sem aviso | Art. 219 | Rescisão indireta | Multa FGTS + aviso |
| Trabalho noturno sem adicional | Art. 73 | Diferenças + atrasado | 20% × período |

---

## Aplicação em chronos

1. **Validação:** chronos deve checar compliance de todas as jornadas contra Art. 5, 59, 66, 67, 73, 219
2. **Audit Trail:** Toda violação detectada deve ser documentada com evidência (artigo, dados, contexto)
3. **Passivos:** Computation automático de direitos (ex: extra 24h+ = 50% adicional)
4. **eSocial:** Mapping obrigatório a S-2200/S-2240 eventos
5. **Gate:** compliance-gate bloqueia saída se violações não resolvidas/documentadas
