# Task: Executar Auditoria LGPD e Compliance

**Executor:** `lgpd-compliance-auditor`
**Squad:** `jurisenergy-recovery`

## Objetivo

Auditar fluxos, prompts e respostas de IA quanto a dados pessoais, minimização, base legal, permissões, retenção e trilha de auditoria.

## Inputs

- Fluxos, documentos, campos, logs, permissões, prompts e respostas IA.

## Passos

1. Identificar dados pessoais e dados sensíveis em cada fluxo.
2. Registrar finalidade e base legal presumida (hipótese a validar).
3. Aplicar minimização: remover dados desnecessários à finalidade.
4. Verificar controle de acesso, retenção e risco de compartilhamento.
5. Confirmar trilha de auditoria das decisões assistidas por IA (entrada, prompt, resposta, revisor, desfecho).
6. Emitir checklist LGPD (`lgpd-compliance-checklist.md`), alertas, bloqueios e mitigação.

## Critérios de Aceite

- [ ] Matriz LGPD do fluxo preenchida (QG-JR-007).
- [ ] Minimização aplicada ou justificada.
- [ ] Trilha de auditoria completa e preservada.
- [ ] Bloqueios e mitigações registrados.

## Observações de Segurança

- Não liberar uso de dados sensíveis sem política e validação jurídica/compliance (QG-JR-004).
- Fluxo de IA sem log não entra em produção.
