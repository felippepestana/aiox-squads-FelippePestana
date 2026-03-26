# CLAUDE.md — Regras do Projeto AIOX Squads

## Sobre o Projeto

Este é o repositório da comunidade para compartilhar, descobrir e contribuir squads para o framework AIOX. Squads são pacotes self-contained de agentes IA especializados.

## Linguagem

- Código, commits e nomes de variáveis: **inglês**
- Documentação voltada ao usuário (README, docs): **português brasileiro**
- Comentários no código: inglês

## Convenções de Código

### Commits

- Prefixos: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Mensagem em inglês, concisa (1 linha), descritiva do "porquê"
- Corpo opcional para detalhes adicionais

### Scripts Bash

- Usar `set -euo pipefail` em todo script
- Funções auxiliares de output: `ok()`, `warn()`, `err()`, `step()`
- Verificar dependências antes de executar operações
- Tratar graciosamente diretórios/arquivos ausentes (warn, não err)

### TypeScript (chatbot)

- Target: ES2022, módulos CommonJS
- Strict mode habilitado
- Dependências em `package.json`, sem instalações globais implícitas

## Estrutura de Squads

Todo squad segue a anatomia de 6 camadas:

```
squads/<nome>/
├── agents/          # Agentes .md com persona, voice_dna, heuristics
├── tasks/           # Tasks executáveis
├── templates/       # Templates de output
├── data/            # Dados de referência
├── config.yml       # Configuração do squad
└── README.md        # Documentação do squad
```

### Cadeia de Comando (Tiers)

- **Tier 0** — Chief: orquestrador que roteia
- **Tier 1** — Masters: especialistas primários
- **Tier 2** — Specialists: especialistas de nicho
- **Tier 3** — Support: utilidades e quality gates

## Segurança

- Nunca commitar API keys, tokens ou credenciais
- `.env` e `credentials.*` devem estar no `.gitignore`
- O devcontainer usa firewall restritivo (allowlist de domínios)
- Scripts de instalação devem verificar dependências, não assumir

## CI/CD

- GitHub Actions configurado em `.github/workflows/claude.yml`
- Trigger: menção `@claude` em issues ou PRs
- Secret necessário: `ANTHROPIC_API_KEY`

## Devcontainer

- Base: Node.js 20, ZSH, ferramentas de dev
- Firewall via iptables (init-firewall.sh)
- Seguro para usar `--dangerously-skip-permissions` dentro do container
- Volumes persistentes para histórico de comandos e config do Claude
