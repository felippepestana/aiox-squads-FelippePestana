# Arquitetura — Prefeitura Digital

## Princípio organizador: o eixo orçamentário

Todo o trabalho do executivo municipal é vinculado ao orçamento. Por isso o squad não trata o orçamento
como mais um módulo, e sim como um **eixo transversal**: qualquer ato com impacto financeiro
(contratação, nomeação, progressão, gratificação, aditivo) só se conclui após o parecer do
`controlador-orcamentario` e o gate do `revisor-conformidade`.

```
Demanda → chefe-de-gabinete (classifica UC + secretaria)
        → núcleo funcional (gera artefato)
        → controlador-orcamentario (dotação/execução/mínimos/LRF)   [se houver despesa]
        → revisor-conformidade (legalidade/LGPD/controle externo)
        → editor-diario-oficial (publicação)                        [se exigir publicidade]
        → documentador (consolida e salva em output/)
```

## Os seis módulos

| Módulo | Agentes principais | Núcleo normativo | Fontes/APIs |
|--------|--------------------|------------------|-------------|
| A. Processo administrativo | gestor-processo-adm | CF art. 37; padrão SEI/PEN | mod-wssei, Tramita GOV.br |
| B. Contratações | pesquisador-contratacoes, elaborador-etp, elaborador-tr-pb | Lei 14.133/2021 | PNCP, modelos AGU, Ger@AGU, TCU |
| Orçamento (eixo) | controlador-orcamentario, planejador-orcamentario | CF 165-169, Lei 4.320, LRF, LC 141 | SICONFI, SIOPS, SIOPE |
| Diário Oficial | editor-diario-oficial | CF 37, LAI, Lei 14.063, ICP-Brasil | SIGPub/AROM (benchmark), PNCP |
| Recursos Humanos | gestor-rh | regime jurídico, EC 103, LRF, Lei 14.063 | eSocial, SIPREV, IPAM, TCE-RO |
| Transparência | arquiteto-transparencia | LAI, LC 131, Decreto 10.540, LGPD | EBT/PNTP (CGU), CKAN, WCAG |

## Fluxo de uma contratação (exemplo integrado)

```
necessidade (Semusa)
  → pesquisador-contratacoes  (soluções + cesta de preços via PNCP)
  → elaborador-etp            (ETP — 13 elementos)
  → controlador-orcamentario  (dotação da saúde, mínimo 15%)
  → elaborador-tr-pb          (Termo de Referência)
  → revisor-conformidade      (checklist Lei 14.133)
  → editor-diario-oficial     (aviso/edital — DOM + PNCP)
  → documentador              (consolida em output/contratacoes/)
```

## Decisões de design

- **Cobertura ampla com baixo custo de manutenção:** as 12 secretarias são tratadas por **um**
  `consultor-secretarias` apoiado por `data/secretarias-porto-velho.yaml`, em vez de 12 agentes.
- **Conformidade como gate, não como sugestão:** `revisor-conformidade` é etapa obrigatória antes de
  concluir/publicar artefatos sensíveis.
- **Parametrização por município:** a estrutura de Porto Velho está em `data/`; outros municípios são
  atendidos ajustando esses arquivos.
- **Separação squad × app:** o squad produz inteligência e minutas; integrações e portais ficam no
  app web companheiro (Fase 2).

## Roadmap (resumo)

- **Fase 1 (este squad):** agentes de elaboração, orientação e conformidade + dossiê.
- **Fase 2 (app `prefeitura-digital-web`):** Next.js + Supabase, integração viva (SEI/PNCP/SICONFI/eSocial),
  Diário Oficial eletrônico (assinatura + biblioteca), reconstrução do Portal da Transparência, login gov.br.

Detalhes completos em `docs/DOSSIE-PLANEJAMENTO.md`.
