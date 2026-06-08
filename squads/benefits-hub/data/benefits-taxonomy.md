# Taxonomia de Benefícios (Total Rewards — contexto BR)

Referência para `catalog-keeper` e `fit-advisor`. Organiza os benefícios por categoria de Total Rewards, com o contexto brasileiro.

---

## Categorias

### 1. Saúde
- Plano de saúde (médico/hospitalar) — regulado pela ANS
- Plano odontológico
- Programa de apoio ao colaborador (EAP) — psicológico, jurídico, financeiro
- Telemedicina, programas de bem-estar/saúde mental
- **⚠️ Envolve dado de saúde (sensível, LGPD) → consent-gate sempre**

### 2. Alimentação
- Vale-Refeição (VR) — refeição no dia útil
- Vale-Alimentação (VA) — compras de supermercado
- Regulados pelo PAT (Programa de Alimentação do Trabalhador) quando aplicável

### 3. Transporte
- Vale-Transporte (VT) — obrigatório por lei (Lei 7.418/1985), desconto máx. 6% do salário
- Auxílio combustível / estacionamento (quando aplicável)
- Fretado / mobilidade

### 4. Previdência & Financeiro
- Previdência privada (PGBL/VGBL) — geralmente com carência de tempo de casa
- Seguro de vida em grupo
- Empréstimo consignado, antecipação salarial
- Participação nos Lucros e Resultados (PLR)

### 5. Bem-estar & Qualidade de Vida
- Gympass / academia / wellness
- Day off de aniversário, licenças estendidas
- Auxílio-creche / reembolso-creche (apoio à parentalidade)
- Auxílio home office

### 6. Educação & Desenvolvimento
- Bolsa/reembolso de cursos, graduação, idiomas
- Plataformas de aprendizagem (cruza com academy)
- Certificações

---

## Obrigatórios vs. opcionais

- **Obrigatórios (lei/CCT):** VT (lei), e itens definidos pela Convenção/Acordo Coletivo da categoria (frequentemente VR/VA, seguro de vida)
- **Opcionais (espontâneos):** previdência, gympass, EAP, day off — diferencial competitivo de Total Rewards

> O `eligibility-checker` deve sempre confirmar a CCT/ACT da categoria — ela pode tornar obrigatório o que noutra categoria é opcional.

## Princípio de curadoria

Mais benefícios ≠ melhor pacote. O valor está no **fit com o momento de vida** (fit-advisor) e na **adoção real** (value-analyst), não no tamanho do catálogo.
