#!/usr/bin/env bash
# setup-ollama.sh — Configures Ollama + Claude Code integration
# Based on: https://docs.ollama.com/claude-code

set -euo pipefail

OLLAMA_VERSION="v0.17.7"
ARCH="$(uname -m)"
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"

# ── Install Ollama ────────────────────────────────────────────────────────────
install_ollama() {
  if command -v ollama &>/dev/null; then
    echo "✓ Ollama already installed: $(ollama --version 2>/dev/null || true)"
    return
  fi

  echo "→ Installing Ollama ${OLLAMA_VERSION} for ${OS}/${ARCH}..."

  case "${OS}" in
    linux)
      case "${ARCH}" in
        x86_64)  ASSET="ollama-linux-amd64.tar.zst" ;;
        aarch64) ASSET="ollama-linux-arm64.tar.zst" ;;
        *) echo "Unsupported architecture: ${ARCH}"; exit 1 ;;
      esac
      TMPDIR="$(mktemp -d)"
      curl -fL "https://github.com/ollama/ollama/releases/download/${OLLAMA_VERSION}/${ASSET}" \
        -o "${TMPDIR}/${ASSET}"
      tar -I zstd -xf "${TMPDIR}/${ASSET}" -C "${TMPDIR}"
      install -m 755 "${TMPDIR}/bin/ollama" /usr/local/bin/ollama
      rm -rf "${TMPDIR}"
      ;;
    darwin)
      if command -v brew &>/dev/null; then
        brew install ollama
      else
        echo "Install Homebrew first: https://brew.sh"
        exit 1
      fi
      ;;
    *)
      echo "Unsupported OS: ${OS}"
      exit 1
      ;;
  esac

  echo "✓ Ollama installed: $(ollama --version 2>/dev/null || true)"
}

# ── Install Claude Code ───────────────────────────────────────────────────────
install_claude_code() {
  if command -v claude &>/dev/null; then
    echo "✓ Claude Code already installed: $(claude --version 2>/dev/null || true)"
    return
  fi

  echo "→ Installing Claude Code..."
  curl -fsSL https://claude.ai/install.sh | bash
  echo "✓ Claude Code installed"
}

# ── Configure environment variables ──────────────────────────────────────────
configure_env() {
  SHELL_RC=""
  if [ -f "${HOME}/.bashrc" ]; then
    SHELL_RC="${HOME}/.bashrc"
  elif [ -f "${HOME}/.zshrc" ]; then
    SHELL_RC="${HOME}/.zshrc"
  fi

  MARKER="# Ollama + Claude Code"
  if [ -n "${SHELL_RC}" ] && ! grep -q "${MARKER}" "${SHELL_RC}"; then
    cat >> "${SHELL_RC}" <<'EOF'

# Ollama + Claude Code
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
EOF
    echo "✓ Environment variables added to ${SHELL_RC}"
  else
    echo "✓ Environment variables already configured (or no shell rc found)"
  fi

  # Export for current session
  export ANTHROPIC_AUTH_TOKEN=ollama
  export ANTHROPIC_API_KEY=""
  export ANTHROPIC_BASE_URL=http://localhost:11434
}

# ── Start Ollama service ──────────────────────────────────────────────────────
start_ollama() {
  if ollama list &>/dev/null; then
    echo "✓ Ollama service already running"
    return
  fi

  echo "→ Starting Ollama service in background..."
  ollama serve &>/tmp/ollama.log &
  sleep 2
  echo "✓ Ollama service started (PID: $!)"
}

# ── Pull recommended models ───────────────────────────────────────────────────
pull_models() {
  echo ""
  echo "Recommended models for Claude Code:"
  echo "  kimi-k2.5:cloud      (cloud)"
  echo "  glm-5:cloud          (cloud)"
  echo "  minimax-m2.5:cloud   (cloud)"
  echo "  qwen3.5:cloud        (cloud)"
  echo "  glm-4.7-flash        (local)"
  echo "  qwen3.5              (local)"
  echo ""
  read -rp "Pull a model now? Enter model name or press Enter to skip: " MODEL
  if [ -n "${MODEL}" ]; then
    ollama pull "${MODEL}"
    echo "✓ Model ${MODEL} ready"
  fi
}

# ── Usage instructions ────────────────────────────────────────────────────────
print_usage() {
  cat <<'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Ollama + Claude Code — Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick setup (uses ollama launcher):
  ollama launch claude
  ollama launch claude --model kimi-k2.5:cloud

Manual setup (set env vars then run):
  export ANTHROPIC_AUTH_TOKEN=ollama
  export ANTHROPIC_API_KEY=""
  export ANTHROPIC_BASE_URL=http://localhost:11434
  claude --model qwen3.5

Scheduled tasks with /loop:
  /loop 30m Check my open PRs and summarize their status
  /loop 1h  Research the latest AI news and summarize key developments

Context length: Ollama requires at least 64k tokens context.
See: https://docs.ollama.com/context-length
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo "=== Ollama + Claude Code Setup ==="
  install_ollama
  install_claude_code
  configure_env
  start_ollama
  pull_models
  print_usage
}

main "$@"
