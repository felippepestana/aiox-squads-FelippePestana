# Open VSX — Marketplace aberto para IDEs

## O que é o Open VSX?

[Open VSX](https://open-vsx.org/) é um registry aberto de extensões para IDEs baseadas em VS Code (VS Code, Cursor, Antigravity, etc). É uma alternativa open-source ao marketplace proprietário da Microsoft, mantido pela Eclipse Foundation.

## IDEs suportadas

| IDE | CLI | Status |
|-----|-----|--------|
| **VS Code** | `code` | Suportado |
| **Cursor** | `cursor` | Suportado |
| **Antigravity** | `antigravity` | Suportado |

## Instalação rápida

```bash
chmod +x setup-open-vsx.sh
./setup-open-vsx.sh
```

## O que o script faz

1. **Verifica dependências** — `jq` e `curl`
2. **Testa conectividade** com `open-vsx.org`
3. **Detecta IDEs instaladas** — busca `product.json` nos caminhos padrão (Linux, macOS, Windows)
4. **Faz backup** do `product.json` original (sufixo `.bak-TIMESTAMP`)
5. **Patcha `product.json`** — redireciona o Extension Marketplace para `open-vsx.org`
6. **Configura `settings.json`** de cada IDE com as URLs do Open VSX
7. **Instala extensões populares** via CLI (opcional)
8. **Cria script de verificação** em `~/.local/bin/verify-openvsx.sh`

## Opções

```bash
./setup-open-vsx.sh                          # Configuração automática
./setup-open-vsx.sh --custom-path FILE       # Configurar um product.json específico
./setup-open-vsx.sh --skip-extensions        # Não instalar extensões
./setup-open-vsx.sh --help                   # Ajuda
```

## Configuração manual

Se preferir configurar manualmente, edite o `product.json` da IDE:

```json
{
  "extensionsGallery": {
    "serviceUrl": "https://open-vsx.org/vscode/gallery",
    "itemUrl": "https://open-vsx.org/vscode/item",
    "controlUrl": "",
    "nlsBaseUrl": "",
    "publisherUrl": "https://open-vsx.org/api"
  }
}
```

### Caminhos do `product.json` por OS

| OS | VS Code | Cursor | Antigravity |
|----|---------|--------|-------------|
| **Linux** | `/usr/share/code/resources/app/product.json` | `/opt/Cursor/resources/app/product.json` | `/opt/Antigravity/resources/app/product.json` |
| **macOS** | `/Applications/Visual Studio Code.app/Contents/Resources/app/product.json` | `/Applications/Cursor.app/Contents/Resources/app/product.json` | `/Applications/Antigravity.app/Contents/Resources/app/product.json` |
| **Windows** | `%LOCALAPPDATA%\Programs\Microsoft VS Code\resources\app\product.json` | `%LOCALAPPDATA%\Programs\Cursor\resources\app\product.json` | `%LOCALAPPDATA%\Programs\Antigravity\resources\app\product.json` |

## Reverter

Para voltar ao marketplace original, restaure o backup:

```bash
# Exemplo para VS Code no Linux
sudo cp /usr/share/code/resources/app/product.json.bak-* /usr/share/code/resources/app/product.json
```

## Extensões populares no Open VSX

Busque extensões em: https://open-vsx.org/

Extensões instaladas automaticamente pelo script:
- `ms-python.python` — Python
- `esbenp.prettier-vscode` — Prettier
- `dbaeumer.vscode-eslint` — ESLint
- `eamodio.gitlens` — GitLens
- `PKief.material-icon-theme` — Material Icon Theme
- `formulahendry.auto-rename-tag` — Auto Rename Tag
- `bradlc.vscode-tailwindcss` — Tailwind CSS
- `ms-azuretools.vscode-docker` — Docker
