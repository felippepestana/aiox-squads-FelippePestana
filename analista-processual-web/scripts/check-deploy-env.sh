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

# --- required infra vars ----------------------------------------------------
step "Variáveis obrigatórias"
for var in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY DATABASE_URL; do
  if [ -n "${!var:-}" ]; then
    ok "$var definida"
  else
    err "$var ausente"
    missing=$((missing + 1))
  fi
done

# --- at least one LLM key ---------------------------------------------------
step "Chave de LLM (basta uma)"
llm_keys=(ANTHROPIC_API_KEY OPENAI_API_KEY GEMINI_API_KEY DEEPSEEK_API_KEY \
          QWEN_API_KEY KIMI_API_KEY MINIMAX_API_KEY)
llm_found=0
for var in "${llm_keys[@]}"; do
  if [ -n "${!var:-}" ]; then
    ok "$var definida"
    llm_found=$((llm_found + 1))
  fi
done
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
