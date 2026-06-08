# Privacy & LGPD (reference)

> Personnel and payroll data is among the most sensitive a company holds. The peopleops module treats it as
> sensitive by default and minimizes exposure at every step.

## Princípios

- **Minimização:** coletar e manter apenas o que a tarefa (admissão, folha, eSocial) exige.
- **Finalidade:** usar o dado só para o fim declarado (ex.: dependente → IRRF/salário-família).
- **Sem segredos no claro:** nunca logar credenciais, tokens ou documentos completos.
- **Referência, não cópia:** trabalhar com `employee_ref` em vez de carregar documentos/CPF completos no artefato.
- **Retenção:** o módulo não persiste dados sensíveis além da conversa; artefatos usam campos minimizados.

## Aplicação por agente

- **admission-officer:** coleta o checklist mínimo; não armazena imagens de documentos.
- **payroll-analyst:** trabalha com refs e bases; não expõe dados pessoais desnecessários.
- **payroll-auditor:** **VETA** o fechamento se houver segredo, documento completo ou dado sensível não minimizado.

## Gate de privacidade no fechamento

Antes de fechar a folha, o `payroll-auditor` verifica:

- [ ] Nenhum segredo/credencial no artefato.
- [ ] Nenhum documento completo exposto.
- [ ] Dados sensíveis minimizados (refs, não cópias).
- [ ] Base legal/finalidade coerente com o uso.

Falha em qualquer item → **VETO** até remediar.
