# Task: classificar-documentacao-carteira

**Agente responsável:** `classificador-carteira` · **Use case:** UC-TR-001

## Objetivo

Classificar a documentação de cada contrato de uma carteira educacional para determinar a força executiva e a via processual recomendável.

## Entradas

- Documentos da carteira (contratos, confissões, boletos, fichas de matrícula) — PDF/TXT via Read
- Planilha/lista de parcelas com vencimentos e valores

## Passos

1. Para cada contrato, preencher a ficha de classificação (ver `agents/classificador-carteira.md`): assinatura do devedor, 2 testemunhas, confissão de dívida, documentos acessórios, responsável financeiro identificado.
2. Citar página/trecho que evidencia cada "sim"; sem evidência localizável → "não confirmado".
3. Flagar parcelas com vencimento superior a 5 anos como possível prescrição e reportar ao `compliance-guard` (regra P1 de `docs/regua/05-compliance-e-guardrails.md`).
4. Atribuir a classificação final: `TITULO_EXECUTIVO` | `PROVA_MONITORIA` | `DOCUMENTACAO_FRAGIL`.
5. Consolidar tabela da carteira (contagem por classificação, valor por categoria) e salvar via Write em `output/classificacao/`.

## Saída

- Tabela consolidada + fichas individuais com evidências.

## Critérios de qualidade (QG-TR-003 upstream)

- Nenhum "sim" sem evidência citada.
- Toda parcela potencialmente prescrita sinalizada.
- Handoff pronto para `estrategista-judicial`.
