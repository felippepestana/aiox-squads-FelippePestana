# Anomalia de Jornada — Padrões de Detecção

## Definição

Uma **anomalia** é um padrão ou evento de jornada que se desvio significativamente de:
1. Jornada contratada / padrão do grupo
2. Legislação (CLT)
3. Padrões históricos do colaborador

**Importância:** Anomalias sinalizam riscos legais, saúde ocupacional ou fraude.

---

## Categorias de Anomalia

### 1. Padrão de Horário (Pattern Anomaly)

**Definição:** Entrada/saída em horários excessivamente repetitivos ou mecanicistas.

**Padrão a Detectar:**
- Mesmo horário ±5 minutos por 20+ ocorrências
- Variação < 2 minutos (exceção: ±15 segundos tolerância para relógio eletrônico)

**Causas Prováveis:**
- Máquina de ponto defeituosa/viciada (registra sempre mesma hora)
- Colaborador com vício de horário (chega sempre 8:57, sai sempre 17:03)
- Manipulação de sistema

**Risco:**
- **Baixo se isolado:** Máquina em local fixo, padrão natural
- **Médio/Alto se sistemático:** Sugere manipulação ou máquina não calibrada

**Ação:**
- Auditar máquina (recalibrar ou revisar?)
- Conferir com colaborador (padrão natural ou manipulado?)

---

### 2. Super-Jornada (Fatigue Signal)

**Definição:** Acúmulo de horas que sinaliza risco de fadiga, burnout ou pressão excessiva.

**Padrão a Detectar:**
- Horas trabalhadas > 10h em um dia
- Média > 50h/semana por 2+ semanas
- 5+ dias consecutivos com 10h+ (sem descanso)
- Trabalho em dias que deveriam ser repouso

**Causas Prováveis:**
- Projeto com deadline
- Pressão/expectativa não expressa
- Colaborador em risco de burnout
- Fraude (reportando horas que não trabalhou)

**Risco:**
- **Alto:** Saúde ocupacional (fadiga, erro, acidente)
- **Alto:** Jurisprudência (jornada efetiva > contrato)
- **Médio:** Fraude se não há justificativa

**Ação:**
- Contatar gestor: projeto excepcional ou padrão?
- Se padrão: requerer rebalanceamento ou compensação
- Integrar com insights (turnover/burnout preditivo)

**Exemplo:**
```
EMP020: Jun 3-7 (M-S)
  Jun 3: 10.5h
  Jun 4: 11.0h
  Jun 5: 10.8h
  Jun 6: 11.2h
  Jun 7: 10.5h
  Total: 54h (team median: 40h)
  
Anomalia: SUPER_JORNADA (5 dias 10h+, 54h/week)
Risco: HIGH (burnout signal, jornada efetiva violação)
```

---

### 3. Falta Isolada (Absence Anomaly)

**Definição:** Ausência sem registro de ponto e sem licença marcada.

**Padrão a Detectar:**
- Nenhum ponto registrado em dia útil
- Sem férias, INSS, ou licença marcada no HR
- Padrão isolado (primeira ocorrência) ou recorrente

**Causas Prováveis:**
- Esquecimento (colaborador não marcou ponto)
- Sistema offline (ponto não transmitido)
- Falha de comunicação (licença não registrada em HR)
- Falta não-autorizada

**Risco:**
- **Baixo se isolado:** Pode ser erro administrativo
- **Médio se recorrente:** Sugere desorganização ou intencional

**Ação:**
- Contatar colaborador: motivo?
- Sincronizar com HR: ferias/licença marcada?
- Se não-autorizada: registrar para payroll (débito)

**Exemplo:**
```
EMP015: Jun 10 (M)
  Sem ponto registrado
  Sem férias/licença em HR
  Colega trabalhou normalmente (não é feriado)
  
Anomalia: FALTA_ISOLADA
Risco: MEDIUM (unauthorized absence, primeira ocorrência)
```

---

### 4. Inconsistência de Geolocalização (Geo Anomaly)

**Definição:** Ponto registrado fora do geofence esperado ou distância improvável.

**Padrão a Detectar:**
- Ponto de entrada a X km da filial esperada (ex: > 5km)
- Saída em localização inconsistente (ex: registra saída em filial A, entrada filial B 5 min depois — 50km distância)

**Causas Prováveis:**
- Trabalho remoto/externo (reunião cliente, evento, home office)
- Erro de GPS (sinal fraco, localização falsa)
- Fraude (outro registrando em seu lugar)

**Risco:**
- **Baixo se isolado:** Pode ser home office ou reunião externa
- **Médio se padrão:** Sugere erro de sistema ou manipulação

**Ação:**
- Sem ação imediata se isolado
- Se padrão: auditar GPS ou revisar política de trabalho remoto
- Se suspeita de fraude: investigação de segurança

**Exemplo:**
```
EMP005: Jun 15 09:05
  Geo: -23.562°, -46.656° (18km do escritório São Paulo esperado)
  Padrão: Isolado (primeira ocorrência)
  
Anomalia: GEO_ANOMALY (LOW)
Contexto: Pode ser reunião externa, home office, ou erro GPS
```

---

### 5. Inconsistência de Timestamp (Timing Anomaly)

**Definição:** Sequência de timestamps impossível ou ilógica.

**Padrão a Detectar:**
- Entrada às 10h, saída às 09h (violação monotônica)
- Intervalo intrajornada < 20 min (Art. 71)
- Jornada descontinuada (ex: clock_in, clock_out às 9h, depois clock_in 9:05 — intervalo de 5 min)

**Causas Prováveis:**
- Erro de sistema (timestamps invertidos)
- Fraude (manipulação de registros)
- Sincronização de relógio (mudança de horário, DST)

**Risco:**
- **Alto:** Integridade de dados comprometida
- **Alto:** Possível fraude

**Ação:**
- Auditar timestamps (validar monotonia)
- Se erro sistemático: corrigir dados com trail
- Se fraude suspeita: investigação

---

## Matriz de Detecção

| Tipo | Assinatura | Frequência > Anomalia | Risco | Ação |
|------|-----------|-----|-----|-----|
| Pattern Time | ±5min, 20+ ocorrências | Daily | MEDIUM | Auditar máquina |
| Super-Jornada | >10h/dia, >50h/week | 2+ weeks | HIGH | Gestor review, rebalance |
| Falta Isolada | Sem ponto, sem licença | 1st occurrence | MEDIUM | Contact, sync HR |
| Geo Anomaly | >5km distância | Isolado | LOW | Monitor padrão |
| Timestamp | Out-of-order, gaps <20min | 1+ violation | HIGH | Audit, investigate fraud |

---

## Contexto & Interpretação

**Princípio:** Anomalia ≠ Culpa. Sempre fornecer contexto.

### Exemplo: "Mesmo horário 9:00 AM"

```
Interpretação 1 (Máquina):
  "Máquina de ponto localizada em portaria fixa. 
   Colaborador sempre passa às 9:00am (prédio aberto desde 8:30).
   Padrão consistente com funcionamento normal."
  → Risco: LOW

Interpretação 2 (Manipulação):
  "Timestamps exatamente 9:00:00, múltiplos colaboradores, 
   mesma máquina, sequência rígida (9:00:00, 9:00:00, ...).
   Máquina configurada errado ou manipulada."
  → Risco: HIGH
```

---

## Integração com Outros Módulos

### insights
- Super-jornadas → Input para modelo de turnover/burnout preditivo
- Padrão de fadiga → Correlação com feedback anônimo (pulse)

### performa
- Super-jornadas → Contexto para avaliação (pode impactar desempenho)
- Falta não-autorizada → Resgistro de assiduidade

### peopleops
- Falta não-autorizada → Desconto de folha
- Super-jornada → Possível passivo (extra não paga)

---

## Checklist de Detecção (alert-warden)

- [ ] Padrão de horário repetitivo detectado?
- [ ] Super-jornada identificada (10h+, 50h/week)?
- [ ] Falta isolada ou recorrente?
- [ ] Geo inconsistência fora de tolerância?
- [ ] Timestamp out-of-order ou gap < 20min?
- [ ] Classificar por risco (LOW/MEDIUM/HIGH)?
- [ ] Fornecer contexto (frequência, comparação, interpretação)?
- [ ] Passar HIGH-risk para compliance-gate?
