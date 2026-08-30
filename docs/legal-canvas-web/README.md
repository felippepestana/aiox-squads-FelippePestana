# Legal Canvas Web — Documentação de Produto

Plataforma de planejamento estratégico e execução operacional para advocacia. O painel central reproduz a matriz **Legal Canvas** (15 blocos), e cada post-it é uma entidade operacional que pode virar iniciativa, workflow, tarefa, evento de agenda e indicador.

**Cadeia de arquitetura:** Legal Canvas → post-it → iniciativa → workflow → tarefa → agenda → indicador → auditoria.

## Artefatos

| Documento | Conteúdo | Estágio |
|-----------|----------|---------|
| [BLUEPRINT.md](./BLUEPRINT.md) | Blueprint funcional e técnico v1.0 — visão, princípios, personas, 15 módulos, motor de workflows, arquitetura, segurança/LGPD, escopo do MVP, fases, épicos e riscos | Fonte de verdade |
| [PRD_MVP.md](./PRD_MVP.md) | PRD detalhado do MVP — requisitos funcionais numerados (RF), não funcionais (RNF), regras de negócio, matriz RBAC, critérios de aceitação e Definition of Done | Artefato derivado nº 1 |
| [FLUXOS_NAVEGACAO.md](./FLUXOS_NAVEGACAO.md) | Mapa de navegação global, 6 jornadas-chave (mermaid), fluxos de erro/concorrência, responsividade e mapa de rotas | Artefato derivado nº 2 |
| [WIREFRAMES.md](./WIREFRAMES.md) | Wireframes low-fidelity das 10 telas principais do MVP com comportamentos anotados | Artefato derivado nº 3 |
| [MODELO_DADOS.md](./MODELO_DADOS.md) | Modelo lógico do banco (PostgreSQL/Supabase) — ERD, dicionário de dados, políticas RLS, integridade e enums | Artefato derivado nº 5 |

## Próximos artefatos (seção 22 do blueprint)

4. Protótipo high-fidelity e design system;
6. especificação OpenAPI;
7. catálogo de eventos e automações;
8. matriz RBAC completa e análise de ameaça/risco;
9. plano de testes e critérios de aceite;
10. backlog técnico por sprint;
11. plano de implantação, suporte e continuidade;
12. documentação de autoria, decisões e versões.

## Decisões pendentes que bloqueiam artefatos futuros

Ver seção 21 do blueprint. As mais urgentes para o protótipo high-fidelity: identidade visual/nomenclatura (nº 9), semântica de cores (nº 2) e presença de dados financeiros reais versus planejamento gerencial (nº 6 — o PRD assume planejamento gerencial como premissa).
