# Referência de Diversidade, Equidade & Fairness (BR + LGPD)

Base para `ethics-gate` e para a auditoria de diversidade. Define atributos protegidos no contexto brasileiro, a regra de impacto desproporcional e os limites de privacidade.

---

## 1. Atributos protegidos (contexto BR)

- **Raça/cor** — categorias IBGE: branca, preta, parda, amarela, indígena
- **Gênero** / identidade de gênero
- **Idade** — discriminação etária vedada (CF Art. 7º, XXX)
- **Pessoa com Deficiência (PCD)** — Lei 8.213/91 (cotas) e Lei 13.146/2015 (LBI)
- **Estado de saúde** / condição médica
- **Religião**, **orientação sexual**, **estado civil**, **maternidade/paternidade**, **origem/nacionalidade**

> Esses atributos **nunca** são preditores de modelo. Aparecem **só** em auditoria de equidade, com finalidade declarada.

## 2. LGPD (Lei 13.709/2018)

- **Dado pessoal sensível (Art. 5, II):** origem racial/étnica, convicção religiosa, dado de saúde, vida sexual, dado genético/biométrico, etc.
- **Base legal para sensível (Art. 11):** consentimento específico OU hipóteses legais (ex: cumprimento de obrigação legal/regulatória, como cotas PCD).
- **Princípios aplicados aqui:**
  - **Finalidade:** tratamento só para a finalidade declarada (ex: auditoria de equidade).
  - **Minimização (necessidade):** só os dados necessários à decisão.
  - **Não-discriminação (Art. 6, IX):** vedado tratamento para fins discriminatórios ilícitos.
- **Residência:** dados br-only (ver config `data_residency`).

## 3. Impacto desproporcional — Regra dos 4/5 (4/5ths rule)

Adaptação da prática EEOC para detectar *adverse impact* em decisões de pessoal (seleção, promoção, desligamento):

```
taxa_grupo = selecionados_no_grupo / total_no_grupo
ratio = taxa_grupo_protegido / taxa_do_grupo_de_maior_taxa
```

- **ratio >= 0,80 (80%):** sem indício de impacto desproporcional.
- **ratio < 0,80:** *adverse impact* — flag e VETO até justificativa de **validade** (a métrica realmente prediz desempenho no cargo?) e ausência de alternativa menos adversa.

**Exemplo:**
- Taxa de promoção homens: 30%. Mulheres: 18%. Ratio = 18/30 = 0,60 < 0,80 → adverse impact → VETO até justificativa.

## 4. Privacidade — tamanho mínimo de grupo

- **n >= 5** em todo corte exibido (k-anonimato básico).
- Grupos menores → **agregar** (juntar categorias) ou **suprimir** a célula.
- Cuidado com **reidentificação por cruzamento**: combinação de filtros (área + gênero + faixa etária) pode isolar uma pessoa mesmo com n agregado aparente.

## 5. Métricas de diversidade (quando autorizado)

- **Representatividade:** % de cada grupo vs. base/mercado/meta.
- **Equidade de promoção/progressão:** taxa por grupo (sujeita à regra dos 4/5).
- **Equidade salarial:** gap salarial ajustado por cargo/senioridade (handoff a org-architect).
- **Funil de R&S por grupo:** taxa de avanço por etapa (handoff a talent-compass / fairness-gate).

> Toda métrica de diversidade respeita n >= 5 e finalidade declarada. Resultado é insumo de **ação de equidade**, nunca de desvantagem.

---

## Resumo operacional para o gate

| Verificação | Limite | Falha → |
|-------------|--------|---------|
| Tamanho de grupo | n >= 5 | VETO |
| Atributo protegido como preditor | proibido | VETO |
| Impacto desproporcional | ratio >= 0,80 | VETO sem justificativa |
| Dado sensível | base legal + finalidade | VETO se ausente |
| Veredito individual punitivo | proibido | VETO |
