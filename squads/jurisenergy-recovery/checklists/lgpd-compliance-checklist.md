# Checklist — Conformidade LGPD e Auditoria de IA (QG-JR-007)

Aplicado pelo `lgpd-compliance-auditor` a cada fluxo, prompt ou relatório do squad.

## Identificação de Dados

- [ ] Dados pessoais do fluxo mapeados (nome, CPF/CNPJ, endereço, UC, consumo).
- [ ] Dados sensíveis identificados e sinalizados.
- [ ] Finalidade do tratamento declarada.
- [ ] Base legal presumida registrada (hipótese a validar por jurídico/compliance).

## Minimização

- [ ] Cada campo é necessário à finalidade — o que não é, sai do prompt.
- [ ] Comunicações usam dados mínimos do destinatário.
- [ ] Relatórios executivos sem dados pessoais desnecessários (agregação).

## Acesso e Retenção

- [ ] Controle de acesso por papel definido para o fluxo.
- [ ] Prazo de retenção definido e descarte documentado.
- [ ] Compartilhamento externo avaliado e autorizado.

## Auditoria de Decisões Assistidas por IA

- [ ] Log de entrada, prompt, resposta, revisor e desfecho preservado.
- [ ] Decisões automatizadas com justificativa, fonte e nível de confiança.
- [ ] Classificações rastreáveis ao documento analisado.
- [ ] Trilha de auditoria imutável e consultável.

## Resultado

- [ ] Matriz LGPD do fluxo preenchida.
- [ ] Alertas e bloqueios registrados com mitigação recomendada.
- [ ] Exigência de revisão humana declarada quando aplicável.

> Dado sensível não é liberado sem política e validação jurídica/compliance. Fluxo de IA sem log não entra em produção.
