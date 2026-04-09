# Skill: deploy-local

Executa build e deploy local do projeto AIOX Squads via Docker Compose.

## Uso
```
/deploy-local [web|chatbot|all]
```
Padrao: `all` (ambos os servicos).

## Instrucoes

Quando o usuario invocar este skill:

1. **Verificar pre-requisitos**:
   - Docker esta rodando (`docker info`)
   - Docker Compose v2 disponivel (`docker compose version`)
   - Arquivo `.env` existe na raiz (se nao, copiar de `.env.example`)
   - `ANTHROPIC_API_KEY` esta definida no `.env`

2. **Determinar perfil**:
   - `web` → `--profile web`
   - `chatbot` → `--profile chatbot`
   - `all` → `--profile web --profile chatbot`

3. **Executar build e deploy**:
   ```bash
   docker compose --profile <perfil> up -d --build
   ```

4. **Verificar saude dos servicos**:
   ```bash
   docker compose ps
   ```
   - Web: `curl -s http://localhost:8787/api/health`
   - Chatbot: `curl -s http://localhost:3000/`

5. **Reportar status**:
   - URLs de acesso
   - Status dos containers
   - Logs se houver erro: `docker compose logs --tail=20`

## Comandos uteis
- Parar: `docker compose --profile web --profile chatbot down`
- Logs: `docker compose logs -f <servico>`
- Rebuild: `docker compose --profile web up -d --build --force-recreate`
