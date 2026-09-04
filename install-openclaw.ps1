#Requires -Version 5.1
<#
.SYNOPSIS
    install-openclaw.ps1 — Garante a instalacao de todos os recursos e
    integracoes locais do OpenClaw (https://openclaw.ai/integrations) no Windows.

.DESCRIPTION
    Script idempotente que prepara um host Windows para rodar o OpenClaw,
    o assistente de IA self-hosted (o "jeito lagosta"). Ele:
      1. Verifica os pre-requisitos (PowerShell 5.1+, Node 22.19+/24, gerenciador de pacotes)
      2. Instala o runtime Node.js se ausente (winget -> Chocolatey -> Scoop -> Node portatil)
      3. Instala / atualiza a CLI do OpenClaw via npm global
      4. Instala o daemon local (Scheduled Task) e roda o onboarding
      5. Roda o doctor e verifica a saude do gateway
      6. Lista os canais/integracoes suportados para conexao no onboarding

    Referencias:
      - Instalacao:  https://docs.openclaw.ai/install
      - Windows:     https://docs.openclaw.ai/platforms/windows
      - Integracoes: https://openclaw.ai/integrations

.PARAMETER Channel
    Canal de release do OpenClaw a ser usado: stable (padrao), beta ou dev.

.PARAMETER SkipDaemon
    Pula a instalacao do daemon/Scheduled Task (apenas instala a CLI).

.PARAMETER SkipOnboard
    Pula o wizard interativo de onboarding (util para CI/instalacao headless).

.PARAMETER NodeMinVersion
    Versao maior minima do Node.js exigida. Padrao: 22.

.EXAMPLE
    .\install-openclaw.ps1

.EXAMPLE
    .\install-openclaw.ps1 -Channel beta -SkipOnboard
#>

[CmdletBinding()]
param(
    [ValidateSet('stable', 'beta', 'dev')]
    [string]$Channel = 'stable',

    [switch]$SkipDaemon,

    [switch]$SkipOnboard,

    [int]$NodeMinVersion = 22
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ── Supported channels / integrations (reference) ─────────────────────────────
# Source: https://openclaw.ai/integrations — connected interactively during onboarding.
$script:SupportedChannels = @(
    'WhatsApp', 'Telegram', 'Slack', 'Discord', 'Google Chat', 'Signal',
    'iMessage', 'IRC', 'Microsoft Teams', 'Matrix', 'Feishu', 'LINE',
    'Mattermost', 'Nextcloud Talk', 'Nostr', 'Synology Chat', 'Tlon',
    'Twitch', 'Zalo', 'WeChat', 'QQ', 'WebChat'
)

# ── Output helpers (mirrors install.sh: ok/warn/err/step) ─────────────────────
function Write-Step { param([string]$Message) Write-Host "`n-> $Message" -ForegroundColor Cyan }
function Write-Ok   { param([string]$Message) Write-Host "[ok]   $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[warn] $Message" -ForegroundColor Yellow }
function Write-Err  { param([string]$Message) Write-Host "[err]  $Message" -ForegroundColor Red; exit 1 }

# Test whether a command is available on PATH.
function Test-Command {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

# Refresh the current process PATH from the Machine + User scopes so freshly
# installed tools become visible without restarting the shell.
function Update-SessionPath {
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user    = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = (@($machine, $user) | Where-Object { $_ } ) -join ';'
}

# ── Pre-flight checks ─────────────────────────────────────────────────────────
function Test-Prerequisites {
    Write-Step "Verificando pre-requisitos do ambiente..."

    Write-Ok "PowerShell $($PSVersionTable.PSVersion)"

    if (-not [Environment]::Is64BitOperatingSystem) {
        Write-Warn "SO 32 bits detectado — o OpenClaw recomenda Windows 64 bits."
    }

    # Execution policy is a frequent blocker for `iex`-style installs.
    $policy = Get-ExecutionPolicy
    if ($policy -in @('Restricted', 'AllSigned')) {
        Write-Warn "ExecutionPolicy '$policy' pode bloquear scripts."
        Write-Warn "  Rode: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned"
    } else {
        Write-Ok "ExecutionPolicy: $policy"
    }
}

# ── Node.js runtime ───────────────────────────────────────────────────────────
function Get-NodeMajorVersion {
    if (-not (Test-Command 'node')) { return 0 }
    try {
        $raw = (node --version) -replace '[^\d.]', ''   # e.g. "v24.3.0" -> "24.3.0"
        return [int]($raw.Split('.')[0])
    } catch {
        return 0
    }
}

# Install Node.js using the first available Windows package manager, falling
# back to an official portable build extracted into %LOCALAPPDATA%.
function Install-Node {
    Write-Step "Instalando runtime Node.js (>= v$NodeMinVersion)..."

    if (Test-Command 'winget') {
        Write-Ok "Usando winget para instalar o Node.js LTS."
        winget install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements -e
    } elseif (Test-Command 'choco') {
        Write-Ok "Usando Chocolatey para instalar o Node.js LTS."
        choco install nodejs-lts -y
    } elseif (Test-Command 'scoop') {
        Write-Ok "Usando Scoop para instalar o Node.js LTS."
        scoop install nodejs-lts
    } else {
        Write-Warn "Nenhum gerenciador de pacotes (winget/choco/scoop) encontrado."
        Install-PortableNode
    }

    Update-SessionPath
}

# Last-resort portable Node: download the official zip and add it to PATH.
function Install-PortableNode {
    Write-Step "Baixando Node.js portatil (oficial nodejs.org)..."

    $arch    = if ([Environment]::Is64BitOperatingSystem) { 'x64' } else { 'x86' }
    $version = 'v22.19.0'   # Pinned LTS that satisfies the OpenClaw floor.
    $zipName = "node-$version-win-$arch.zip"
    $url     = "https://nodejs.org/dist/$version/$zipName"

    $depsDir = Join-Path $env:LOCALAPPDATA 'OpenClaw\deps\portable-node'
    $zipPath = Join-Path $env:TEMP $zipName

    New-Item -ItemType Directory -Force -Path $depsDir | Out-Null

    Write-Ok "Baixando $url"
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
    Expand-Archive -Path $zipPath -DestinationPath $depsDir -Force
    Remove-Item $zipPath -Force

    $nodeHome = Join-Path $depsDir "node-$version-win-$arch"

    # Persist to the user PATH and make it visible in this process.
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($userPath -notlike "*$nodeHome*") {
        [Environment]::SetEnvironmentVariable('Path', "$nodeHome;$userPath", 'User')
    }
    $env:Path = "$nodeHome;$env:Path"

    Write-Ok "Node.js portatil instalado em $nodeHome"
}

function Ensure-Node {
    Write-Step "Verificando Node.js..."

    $major = Get-NodeMajorVersion
    if ($major -ge $NodeMinVersion) {
        Write-Ok "Node.js $(node --version) ja atende ao minimo (v$NodeMinVersion+)."
    } else {
        if ($major -gt 0) {
            Write-Warn "Node.js v$major detectado — abaixo do minimo v$NodeMinVersion. Atualizando..."
        }
        Install-Node

        $major = Get-NodeMajorVersion
        if ($major -lt $NodeMinVersion) {
            Write-Err "Falha ao obter Node.js v$NodeMinVersion+. Instale manualmente em https://nodejs.org/ e rode novamente."
        }
        Write-Ok "Node.js $(node --version) instalado."
    }

    if (-not (Test-Command 'npm')) {
        Write-Err "npm nao encontrado mesmo apos instalar o Node.js. Reabra o terminal e tente de novo."
    }
    Write-Ok "npm $(npm --version)"
}

# ── OpenClaw CLI ──────────────────────────────────────────────────────────────
function Ensure-OpenClaw {
    Write-Step "Instalando / atualizando a CLI do OpenClaw (npm global)..."

    if (Test-Command 'openclaw') {
        Write-Ok "OpenClaw ja presente — garantindo a versao mais recente."
    }

    npm install -g openclaw@latest
    Update-SessionPath

    if (-not (Test-Command 'openclaw')) {
        # npm global bin may not be on PATH yet; surface where it lives.
        $npmBin = (npm prefix -g)
        Write-Warn "Comando 'openclaw' nao visivel nesta sessao."
        Write-Warn "  Adicione ao PATH: $npmBin"
        Write-Err  "Reabra o terminal e rode 'openclaw --version' para confirmar."
    }

    Write-Ok "OpenClaw $(openclaw --version)"

    if ($Channel -ne 'stable') {
        Write-Step "Mudando para o canal de release '$Channel'..."
        openclaw update --channel $Channel
        Write-Ok "Canal '$Channel' selecionado."
    }
}

# ── Daemon + onboarding (local resources + integrations) ──────────────────────
function Invoke-Onboarding {
    if ($SkipOnboard) {
        Write-Warn "Onboarding pulado (-SkipOnboard). Rode 'openclaw onboard' depois para conectar integracoes."
        return
    }

    Write-Step "Instalando recursos locais e iniciando o onboarding..."
    Write-Host "  O wizard configura o provedor de modelo, a API key, o gateway e os canais." -ForegroundColor Gray

    $onboardArgs = @('onboard')
    if (-not $SkipDaemon) {
        # On Windows this registers a Scheduled Task that keeps the gateway up.
        $onboardArgs += '--install-daemon'
        Write-Ok "Daemon local (Scheduled Task) sera instalado."
    } else {
        Write-Warn "Instalacao do daemon pulada (-SkipDaemon)."
    }

    & openclaw @onboardArgs
}

# ── Health checks ─────────────────────────────────────────────────────────────
function Test-Health {
    Write-Step "Validando a instalacao..."

    try {
        openclaw doctor
        Write-Ok "openclaw doctor concluido."
    } catch {
        Write-Warn "openclaw doctor reportou problemas — revise a saida acima."
    }

    try {
        openclaw gateway status
        Write-Ok "Gateway respondendo."
    } catch {
        Write-Warn "Gateway nao esta rodando ainda. Inicie com: openclaw gateway"
    }
}

# ── Integration reference ─────────────────────────────────────────────────────
function Show-Integrations {
    Write-Step "Integracoes / canais suportados (conecte-os no onboarding):"
    foreach ($channel in $script:SupportedChannels) {
        Write-Host "    - $channel" -ForegroundColor Gray
    }
    Write-Host "  Detalhes e novos canais: https://openclaw.ai/integrations" -ForegroundColor Gray
}

function Show-NextSteps {
    Write-Host "`n=====================================================" -ForegroundColor Green
    Write-Host " OpenClaw pronto! Proximos passos:" -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host "  - Conectar mais integracoes : openclaw onboard"
    Write-Host "  - Conversar com o assistente : openclaw agent --message ""Ola"""
    Write-Host "  - Ver saude do gateway       : openclaw gateway status"
    Write-Host "  - Diagnosticar problemas     : openclaw doctor"
    Write-Host "  - Docs                       : https://docs.openclaw.ai/`n"
}

# ── Main ──────────────────────────────────────────────────────────────────────
function Main {
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host " Instalador local do OpenClaw (canal: $Channel)" -ForegroundColor Cyan
    Write-Host "=====================================================" -ForegroundColor Cyan

    Test-Prerequisites
    Ensure-Node
    Ensure-OpenClaw
    Invoke-Onboarding
    Test-Health
    Show-Integrations
    Show-NextSteps
}

try {
    Main
} catch {
    Write-Err "Falha na instalacao: $($_.Exception.Message)"
}
