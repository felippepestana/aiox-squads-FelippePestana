# Checklist de Documentos — Admissão (referência Brasil)

Referência de documentos comuns na admissão (CLT) para o `checklist-runner` coordenar a **coleta** e a **assinatura de contrato**. O **processamento** (admissão digital, eSocial, folha) é responsabilidade do módulo **peopleops** — o onboard apenas coordena a experiência e a coleta, com consentimento e privacidade.

> ⚠️ Coletar **apenas o necessário**, tratar como dado sensível (LGPD) e nunca expor. Confirmar consentimento antes de coletar.

## Documentos usuais (varia por empresa/cargo)
- Documento de identificação com foto (RG/CNH) e CPF
- Carteira de Trabalho (CTPS digital — número/qualificação)
- Comprovante de residência
- Dados bancários (para folha — via peopleops)
- Título de eleitor / certidão (quando aplicável)
- Comprovante de escolaridade / registros profissionais (quando exigido pelo cargo)
- Dados de dependentes (se houver benefícios aplicáveis — via benefits-hub)
- Exame médico admissional (ASO) — agendamento/coleta do resultado
- Foto (crachá/sistema), quando aplicável

## Itens de contrato / formalização
- Contrato de trabalho / proposta assinada
- Termos e políticas (código de conduta, segurança da informação)
- Termo de consentimento LGPD (tratamento de dados)

## Fluxo
1. `checklist-runner` solicita documentos (mínimo necessário) + assinatura, com consentimento.
2. Itens bloqueantes → flag com responsável e prazo.
3. **Admissão/eSocial/folha → handoff para `peopleops`.**
4. Benefícios/elegibilidade → `benefits-hub`.

*Esta é uma referência operacional; sempre validar exigências legais vigentes com DP/jurídico.*
