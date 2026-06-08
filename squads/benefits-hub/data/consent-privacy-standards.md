# Padrões de Consentimento & Privacidade (LGPD)

Referência para `consent-gate` e todos os agentes do módulo. Benefícios lidam com dado de saúde (sensível) e escolhas pessoais — a privacidade e o consentimento são inegociáveis.

---

## 1. Consentimento explícito

- **Consentimento é ação, não silêncio.** Confirmação ativa da pessoa, não pré-marcação.
- **Auto-enroll é proibido** para itens que envolvem dado sensível ou custo ao colaborador.
- A pessoa deve **entender** antes de consentir (custo, coparticipação, carência em linguagem clara).
- O consentimento é **registrado** (método + timestamp) no audit trail.

## 2. Dado de saúde é sensível (LGPD Art. 5, II)

Dado de saúde (condição médica, uso de plano, dependente com condição) é **dado pessoal sensível**:
- **Base legal (Art. 11):** consentimento específico OU hipóteses legais
- **Finalidade estrita:** usar **só** para a adesão consentida
- **Proibido:** usar para recomendação não relacionada, análise de valor individual, compartilhamento, ou qualquer decisão sobre a pessoa
- **Minimização:** coletar/usar o mínimo necessário para a adesão

## 3. Sigilo das escolhas (terceiros)

- A escolha de benefícios de um colaborador **nunca** é revelada a outro.
- Comparações e análises de valor são **agregadas** (value-analyst), nunca individuais.
- Dados de dependentes seguem o mesmo sigilo.

## 4. Escopo de aconselhamento

O módulo explica **como o benefício funciona** — não dá:
- Aconselhamento **fiscal** (ex: "declare isso assim")
- Aconselhamento **jurídico** (ex: "você tem direito a processar")
- Aconselhamento **médico** (ex: "escolha este tratamento")

Questões fora de escopo são **encaminhadas** a especialista. Ultrapassar isso → VETO.

## 5. Princípios LGPD aplicados

| Princípio | Aplicação no benefits-hub |
|-----------|---------------------------|
| Finalidade | Dado usado só para a adesão consentida |
| Minimização | Só o necessário para o benefício |
| Consentimento | Explícito e ativo, registrado |
| Não-discriminação | Dado de saúde nunca usado contra a pessoa |
| Segurança | Residência br-only; acesso restrito |
| Transparência | Pessoa sabe o que é coletado e para quê |

---

## Resumo para o gate

| Verificação | Falha → |
|-------------|---------|
| Consentimento explícito (sem pré-marcação) | VETO |
| Dado de saúde só para a finalidade consentida | VETO |
| Sigilo das escolhas de terceiros | VETO |
| Sem aconselhamento fiscal/jurídico/médico | VETO |
| Audit trail completo | VETO |
