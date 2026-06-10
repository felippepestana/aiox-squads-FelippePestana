#!/usr/bin/env bash
#
# check-deploy-env.sh — Pre-flight check for the analista-processual-web deploy.
# Validates that the environment variables actually read by the app are set.
# Read-only: it does not mutate the database or any remote resource.
#
set -euo pipefail

# --- output helpers ---------------------------------------------------------
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }
err()  { printf '  \033[31m✗\033[0m %s\n' "$1"; }
step() { printf '\n\033[1m%s\033[0m\n' "$1"; }

missing=0
llm_found=0

# check_required NAME VALUE — fails the run if VALUE is empty.
check_required() {
  if [ -n "$2" ]; then
    ok "$1 definida"
  else
    err "$1 ausente"
    missing=$((missing + 1))
  fi
}

# check_llm NAME VALUE — counts the key if VALUE is non-empty.
check_llm() {
  if [ -n "$2" ]; then
    ok "$1 definida"
    llm_found=$((llm_found + 1))
  fi
}

# Values are expanded directly (no indirect ${!var}) so the script stays
# portable across Bash versions and safe under `set -u`.

# --- required infra vars ----------------------------------------------------
step "Variáveis obrigatórias"
check_required NEXT_PUBLIC_SUPABASE_URL      "${NEXT_PUBLIC_SUPABASE_URL:-}"
check_required NEXT_PUBLIC_SUPABASE_ANON_KEY "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"
check_required DATABASE_URL                  "${DATABASE_URL:-}"

# --- at least one LLM key ---------------------------------------------------
step "Chave de LLM (basta uma)"
check_llm ANTHROPIC_API_KEY "${ANTHROPIC_API_KEY:-}"
check_llm OPENAI_API_KEY    "${OPENAI_API_KEY:-}"
check_llm GEMINI_API_KEY    "${GEMINI_API_KEY:-}"
check_llm DEEPSEEK_API_KEY  "${DEEPSEEK_API_KEY:-}"
check_llm QWEN_API_KEY      "${QWEN_API_KEY:-}"
check_llm KIMI_API_KEY      "${KIMI_API_KEY:-}"
check_llm MINIMAX_API_KEY   "${MINIMAX_API_KEY:-}"
if [ "$llm_found" -eq 0 ]; then
  err "nenhuma chave de LLM definida — o motor de análise não funcionará"
  missing=$((missing + 1))
fi

# --- result -----------------------------------------------------------------
step "Resultado"
if [ "$missing" -gt 0 ]; then
  err "$missing item(ns) obrigatório(s) faltando. Veja DEPLOY.md."
  exit 1
fi

ok "Todas as variáveis obrigatórias estão presentes."
warn "Próximo passo: 'npm run db:push' para provisionar o schema (ver DEPLOY.md)."
