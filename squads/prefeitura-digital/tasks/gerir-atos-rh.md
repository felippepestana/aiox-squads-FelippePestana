# Task: Atos e Rotinas de Recursos Humanos

**ID:** `pd-gerir-atos-rh`
**Executor:** `gestor-rh`
**Tier:** Tier 1
**Use Cases:** UC-PD-008

## Overview
Automatiza atos de pessoal e rotinas de RH (nomeação, férias, licenças, progressão, PAD, aposentadoria), com conformidade legal e integração às obrigações federais.

## Input
- Procedimento de pessoal e dados do servidor/cargo
- Regras locais (regime jurídico do servidor municipal)

## Output
- Ato de pessoal no template ato-pessoal-tmpl.md, salvo em output/rh/, e/ou orientação procedimental

## Action Items
1. Identifique o procedimento e a base normativa
2. Calcule prazos (estágio probatório, posse, férias, licenças, aposentadoria)
3. Gere o ato (portaria) a partir dos dados mínimos
4. Acione controlador-orcamentario (impacto na folha e LRF)
5. Encaminhe a publicação ao editor-diario-oficial quando exigível
6. Observe LGPD e registre obrigações (eSocial/SIPREV/TCE-RO)

## Acceptance Criteria
- [ ] Ato fundamentado e com prazos corretos
- [ ] Impacto fiscal (LRF) verificado
- [ ] Publicação e obrigações sinalizadas
- [ ] Dados pessoais minimizados (LGPD)
