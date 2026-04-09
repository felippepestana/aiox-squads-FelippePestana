# Skill: deploy-vps

Prepara e executa deploy para VPS Hostinger (ou qualquer VPS Linux com Docker).

## Uso
```
/deploy-vps [bootstrap|deploy|status]
```
- `bootstrap` — Primeira configuracao do VPS (instala Docker, Caddy, firewall)
- `deploy` — Envia codigo e reinicia servicos
- `status` — Verifica saude dos servicos remotos

## Instrucoes

### Modo: bootstrap

1. Verificar que as variaveis estao definidas:
   - `VPS_HOST` — IP ou dominio do VPS
   - `VPS_USER` — Usuario SSH (padrao: root)

2. Copiar e executar `scripts/vps-bootstrap.sh` no VPS:
   ```bash
   scp scripts/vps-bootstrap.sh ${VPS_USER}@${VPS_HOST}:/tmp/
   ssh ${VPS_USER}@${VPS_HOST} 'bash /tmp/vps-bootstrap.sh'
   ```

3. Copiar `deploy/Caddyfile` para o VPS:
   ```bash
   scp deploy/Caddyfile ${VPS_USER}@${VPS_HOST}:/etc/caddy/Caddyfile
   ssh ${VPS_USER}@${VPS_HOST} 'sudo systemctl reload caddy'
   ```

4. Lembrar o usuario de configurar DNS apontando para o IP do VPS.

### Modo: deploy

1. Executar `scripts/deploy-vps.sh`:
   ```bash
   VPS_HOST=<ip> VPS_USER=<user> bash scripts/deploy-vps.sh
   ```

2. Verificar que os servicos subiram:
   ```bash
   ssh ${VPS_USER}@${VPS_HOST} 'docker compose -f /opt/aiox-squads/docker-compose.yml ps'
   ```

### Modo: status

1. Verificar saude remota:
   ```bash
   ssh ${VPS_USER}@${VPS_HOST} 'docker compose -f /opt/aiox-squads/docker-compose.yml ps'
   ssh ${VPS_USER}@${VPS_HOST} 'curl -s http://localhost:8787/api/health'
   ssh ${VPS_USER}@${VPS_HOST} 'curl -s http://localhost:3000/'
   ```

2. Verificar certificado SSL:
   ```bash
   curl -sI https://<dominio> | head -5
   ```

## Pre-requisitos
- Acesso SSH ao VPS configurado (chave SSH)
- VPS com Ubuntu 22.04 LTS
- Dominio apontando para o IP do VPS (para HTTPS)

## Arquivos relacionados
- `scripts/vps-bootstrap.sh` — Bootstrap do VPS
- `scripts/deploy-vps.sh` — Script de deploy
- `deploy/Caddyfile` — Configuracao do reverse proxy
- `deploy/docker-compose.prod.yml` — Compose otimizado para producao
- `.github/workflows/deploy-vps.yml` — CI/CD automatico
