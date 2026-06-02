# Task 03 — Legal Framework (Enquadramento Jurídico-Normativo)

## Agent: Legal-Normative Specialist

## Objetivo

Analisar o enquadramento jurídico-normativo do caso, identificando responsabilidades, classificando o tipo de defeito conforme o CDC e verificando a conformidade do produto e dos serviços prestados com as normas aplicáveis.

## Procedimento

### Passo 3.1 — Classificação do Defeito (CDC)

Com base no diagnóstico do Hardware Specialist, enquadrar o defeito em uma das categorias:

**Categoria A — Vício de Fabricação (CDC, Art. 12)**
- Defeito intrínseco ao produto, presente desde a fabricação
- Responsabilidade: Fabricante (Apple Inc.) e/ou Importador (Apple Brasil)
- Prazo de reclamação: 90 dias (CDC, Art. 26, II — produto durável)
- Prescritivo de reparação: 5 anos (CDC, Art. 27)

**Categoria B — Vício por Inadequação ao Uso Normal (CDC, Art. 18)**
- Produto ficou inadequado ao uso a que se destina
- Responsabilidade solidária da cadeia: fabricante + distribuidor + varejista
- Direitos do consumidor: reparo (30/90 dias), substituição ou devolução com correção

**Categoria C — Dano por Fato do Produto (CDC, Art. 12)**
- Produto causou dano ao consumidor por defeito de segurança
- Responsabilidade objetiva independente de culpa

**Categoria D — Dano por Uso Inadequado / Caso Fortuito**
- Dano resultante de uso fora das especificações (ex: submersão além do limite IP68)
- Exclui responsabilidade do fabricante (CDC, Art. 12, §3º, III)

**Categoria E — Dano por Intervenção de Terceiro (CDC, Art. 12, §3º, II)**
- Dano causado por reparo realizado por assistência não autorizada
- Pode excluir responsabilidade do fabricante
- Responsabilidade pode recair sobre quem realizou o reparo indevido

### Passo 3.2 — Verificação de Conformidade do Produto

Verificar se o dispositivo periciado possui:
```
[ ] Certificação ANATEL (número na tampa traseira/caixa)
     - Resolução ANATEL nº 680/2017
     - Base: https://sistemas.anatel.gov.br/sch/
[ ] Certificação INMETRO (quando aplicável)
[ ] Garantia contratual Apple (1 ano padrão + eventual AppleCare+)
     - CDC, Art. 50: garantia contratual é complementar à legal
[ ] Manual e documentação em português (CDC, Art. 31)
[ ] Informações de segurança elétrica (IEC 62368-1)
```

### Passo 3.3 — Verificação de Conformidade do Serviço de Reparo

Se houve intervenção anterior por assistência técnica, verificar:
```
[ ] A assistência é Apple Authorized Service Provider (AASP)?
     - Verificar em locate.apple.com
[ ] Documentação do serviço realizado (nota fiscal, ordem de serviço)?
[ ] Os componentes utilizados são originais Apple?
[ ] O técnico possui certificação ACMT/ACiT?
[ ] Houve perda de garantia após o reparo?
     - CDC, Art. 18, §5º: a substituição do produto não rompe a garantia
```

### Passo 3.4 — Análise de Nexo Causal

Estabelecer o nexo causal entre:
1. O defeito identificado no diagnóstico de hardware
2. A causa alegada (vício de fabricação, uso inadequado, reparo indevido)
3. O dano sofrido pelo consumidor (impossibilidade de uso do produto)

Fórmula de análise:
```
CAUSA → MECANISMO → EFEITO → DANO

Exemplo:
Falha no Tigris IC (causa) → impossibilidade de negociação USB PD (mecanismo) 
→ não carregamento via cabo (efeito) → impossibilidade de uso do produto (dano)
```

### Passo 3.5 — Análise dos Quesitos sob Perspectiva Jurídica

Para cada quesito formulado, identificar:
- Qual norma jurídica ampara a questão
- Qual norma técnica fundamenta a resposta
- Se a resposta é dentro ou fora da competência técnica do perito
- Se há necessidade de complementação jurídica (fora do escopo da perícia técnica)

### Passo 3.6 — Avaliação de Danos Materiais

Conforme orientação do juízo, calcular (se solicitado):
```
Valor de mercado atual do dispositivo: R$ X,XX
  - Base: tabela FIPE, preço médio em 3 varejistas, data de referência

Custo de reparo (orçamento técnico): R$ X,XX
  - Fonte: AASP autorizado / tabela Apple

Depreciação aplicável:
  - Vida útil estimada do iPhone: 5-7 anos (base Apple support e mercado)
  - Percentual de depreciação por período

Valor residual (sem conserto): R$ X,XX
  - Base: mercado de peças usadas / dispositivo para retirada de peças
```

## Outputs

```yaml
- enquadramento_juridico.md          # Classificação do defeito + responsabilidades
- conformidade_produto.md            # Checklist de certificações e conformidade
- analise_nexo_causal.md             # Cadeia causal documentada
- avaliacao_danos_materiais.md       # Cálculo de valores (se solicitado)
- mapa_quesitos_normas.md            # Quesito → norma aplicável
```

## Critério de Conclusão

Task concluída quando:
- Defeito classificado conforme CDC
- Responsabilidades identificadas e embasadas
- Conformidade do produto verificada
- Nexo causal estabelecido
- Todos os quesitos mapeados com fundamentação normativa

## Prazo Típico

1-2 dias úteis
