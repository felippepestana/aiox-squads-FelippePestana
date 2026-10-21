#!/usr/bin/env bash
# Loads docs/apex-cursos-livres/sql/001_schema.sql into a DISPOSABLE PostgreSQL database
# and runs the behavioural checks in verify_001.sql (RLS, ledger, guards...).
# 002_ai_vector.sql is applied only when the pgvector extension is available.
#
# Usage:
#   DATABASE_URL=postgresql://postgres@localhost:5432/apex_verify ./verify-schema.sh
#   ./verify-schema.sh --ephemeral      # starts a throw-away local cluster (must NOT run as root)
set -euo pipefail

SQL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../sql" && pwd)"
EPHEMERAL=0
WORKDIR=""

ok()   { printf '\033[32m[ok]\033[0m   %s\n' "$*"; }
warn() { printf '\033[33m[warn]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[31m[err]\033[0m  %s\n' "$*" >&2; }
step() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

cleanup() {
  if [[ -n "${WORKDIR}" && -d "${WORKDIR}" ]]; then
    if [[ -n "${PG_CTL:-}" ]]; then "${PG_CTL}" -D "${WORKDIR}/data" -m immediate stop >/dev/null 2>&1 || true; fi
    rm -rf "${WORKDIR}"
  fi
}
trap cleanup EXIT

for arg in "$@"; do
  case "${arg}" in
    --ephemeral) EPHEMERAL=1 ;;
    -h|--help) sed -n '2,10p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) err "unknown argument: ${arg}"; exit 2 ;;
  esac
done

command -v psql >/dev/null 2>&1 || { err "psql not found (install the PostgreSQL client)"; exit 1; }

if [[ "${EPHEMERAL}" -eq 1 ]]; then
  step "Starting a throw-away PostgreSQL cluster"
  if [[ "${EUID}" -eq 0 ]]; then err "PostgreSQL refuses to run as root; run this script as a normal user"; exit 1; fi
  PG_BIN="$(pg_config --bindir 2>/dev/null || true)"
  if [[ -z "${PG_BIN}" ]]; then PG_BIN="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1 || true)"; fi
  [[ -x "${PG_BIN}/initdb" && -x "${PG_BIN}/pg_ctl" ]] || { err "initdb/pg_ctl not found (set PATH or install postgresql-server)"; exit 1; }
  PG_CTL="${PG_BIN}/pg_ctl"
  WORKDIR="$(mktemp -d)"
  PORT="$(( 20000 + RANDOM % 20000 ))"
  "${PG_BIN}/initdb" -D "${WORKDIR}/data" -A trust -U postgres -E UTF8 >/dev/null
  "${PG_CTL}" -D "${WORKDIR}/data" -o "-p ${PORT} -k ${WORKDIR} -c listen_addresses=" -l "${WORKDIR}/pg.log" -w start >/dev/null
  "${PG_BIN}/createdb" -h "${WORKDIR}" -p "${PORT}" -U postgres apex_verify
  export PGHOST="${WORKDIR}" PGPORT="${PORT}" PGUSER="postgres"
  PSQL=(psql -d apex_verify)
  ok "cluster ready (port ${PORT})"
else
  [[ -n "${DATABASE_URL:-}" ]] || { err "set DATABASE_URL to a disposable database, or use --ephemeral"; exit 1; }
  PSQL=(psql "${DATABASE_URL}")
fi

step "Safety check: target database must be empty"
exists="$("${PSQL[@]}" -Atqc "SELECT count(*) FROM information_schema.schemata WHERE schema_name = 'platform'")"
if [[ "${exists}" != "0" ]]; then
  err "schema 'platform' already exists in the target database; refusing to continue"
  exit 1
fi
ok "empty database"

step "Applying 001_schema.sql"
"${PSQL[@]}" -v ON_ERROR_STOP=1 -q -f "${SQL_DIR}/001_schema.sql" >/dev/null
ok "schema loaded"

step "Applying 002_ai_vector.sql (optional)"
has_vector="$("${PSQL[@]}" -Atqc "SELECT count(*) FROM pg_available_extensions WHERE name = 'vector'")"
if [[ "${has_vector}" == "1" ]]; then
  "${PSQL[@]}" -v ON_ERROR_STOP=1 -q -f "${SQL_DIR}/002_ai_vector.sql" >/dev/null
  ok "pgvector migration applied"
else
  warn "pgvector extension not available; skipping 002_ai_vector.sql"
fi

step "Running behavioural checks"
output="$("${PSQL[@]}" -v ON_ERROR_STOP=1 -q -f "${SQL_DIR}/verify_001.sql" 2>&1)" || { printf '%s\n' "${output}" >&2; err "verification failed"; exit 1; }
printf '%s\n' "${output}" | grep -E 'NOTICE:  ok|PASSED' | sed 's/^.*NOTICE:  //'
passed="$(printf '%s\n' "${output}" | grep -c 'NOTICE:  ok' || true)"
ok "${passed} checks passed"
