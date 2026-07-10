# Task: Auditar Conformidade LGPD

**Executor:** `lgpd-compliance-auditor`
**Squad:** `jurisenergy-recovery`

## Objetivo

Auditar um fluxo, documento ou interação de IA quanto ao tratamento de dados pessoais: minimização, base legal, permissões, retenção e trilha de auditoria.

## Inputs

- Fluxos, documentos, campos, logs, permissões, prompts e respostas de IA.

## Passos

1. Identificar dados pessoais e sensíveis presentes no fluxo.
2. Declarar finalidade e base legal presumida (marcando validação pendente).
3. Aplicar minimização: remover dados desnecessários à finalidade.
4. Verificar controle de acesso, retenção e descarte.
5. Registrar trilha de auditoria de prompts e respostas de IA.
6. Emitir matriz LGPD com alertas, bloqueios e medidas de mitigação.

## Critérios de Aceite

- [ ] Matriz LGPD preenchida com sensibilidade classificada.
- [ ] Base legal presumida declarada por tratamento.
- [ ] Riscos críticos bloqueados até decisão humana.
- [ ] Trilha de auditoria registrada.

## Observações de Segurança

- Não liberar uso de dados sensíveis sem política e validação jurídica/compliance.
- Consentimento não é presumido como base legal padrão.
