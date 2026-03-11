#!/bin/bash
# Ralph Wiggum — Long-running AI agent loop
# Adaptado para AIOX Squads (snarktank/ralph)
#
# Uso: ./ralph.sh [--tool amp|claude] [max_iterations]
#
# Exemplos:
#   ./ralph.sh --tool claude 10
#   ./ralph.sh --tool claude
#   ./ralph.sh 5

set -e

# Parse arguments
TOOL="claude"  # Default para Claude Code no contexto AIOX
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    --help|-h)
      echo "Ralph — Autonomous AI Development Loop (AIOX Edition)"
      echo ""
      echo "Uso: $0 [--tool amp|claude] [max_iterations]"
      echo ""
      echo "Opções:"
      echo "  --tool claude   Usar Claude Code (padrão no AIOX)"
      echo "  --tool amp      Usar Amp CLI"
      echo "  max_iterations  Número máximo de iterações (padrão: 10)"
      echo ""
      echo "Arquivos necessários:"
      echo "  squads/ralph/prd.json     — PRD com user stories"
      echo "  squads/ralph/CLAUDE.md    — Instruções para cada iteração"
      echo "  squads/ralph/progress.txt — Log de progresso (criado automaticamente)"
      echo ""
      echo "Exemplo:"
      echo "  bash squads/ralph/scripts/ralph.sh --tool claude 5"
      exit 0
      ;;
    *)
      # Assume que é max_iterations se for um número
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

# Validar escolha de tool
if [[ "$TOOL" != "amp" && "$TOOL" != "claude" ]]; then
  echo "Erro: Tool inválida '$TOOL'. Deve ser 'amp' ou 'claude'."
  exit 1
fi

# Determinar diretório base do squad ralph
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RALPH_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

PRD_FILE="$RALPH_DIR/prd.json"
PROGRESS_FILE="$RALPH_DIR/progress.txt"
ARCHIVE_DIR="$RALPH_DIR/archive"
LAST_BRANCH_FILE="$RALPH_DIR/.last-branch"

# Verificar dependências
if ! command -v jq &>/dev/null; then
  echo "Erro: jq não encontrado. Instale com: apt-get install jq"
  exit 1
fi

if [[ "$TOOL" == "claude" ]] && ! command -v claude &>/dev/null; then
  echo "Erro: claude CLI não encontrado."
  echo "Instale via: npm install -g @anthropic-ai/claude-code"
  exit 1
fi

if [[ "$TOOL" == "amp" ]] && ! command -v amp &>/dev/null; then
  echo "Erro: amp CLI não encontrado."
  echo "Instale via: npm install -g @sourcegraph/amp"
  exit 1
fi

# Verificar que prd.json existe
if [ ! -f "$PRD_FILE" ]; then
  echo "Erro: prd.json não encontrado em $PRD_FILE"
  echo "Execute *ralph-prd ou *ralph-convert primeiro para criar o PRD."
  exit 1
fi

# Arquivar run anterior se a branch mudou
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    # Remove prefixo "ralph/" do nome da branch para o nome da pasta
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Arquivando run anterior: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Arquivado em: $ARCHIVE_FOLDER"

    # Resetar progress file para novo run
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Iniciado: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Rastrear branch atual
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

# Inicializar progress file se não existe
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Iniciado: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

# Mostrar resumo do PRD
PROJECT=$(jq -r '.project // "Projeto"' "$PRD_FILE" 2>/dev/null || echo "Projeto")
BRANCH=$(jq -r '.branchName // ""' "$PRD_FILE" 2>/dev/null || echo "")
TOTAL_STORIES=$(jq '.userStories | length' "$PRD_FILE" 2>/dev/null || echo "0")
DONE_STORIES=$(jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE" 2>/dev/null || echo "0")
PENDING_STORIES=$((TOTAL_STORIES - DONE_STORIES))

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           RALPH — Autonomous Development Loop               ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Tool: $TOOL"
echo "║  Projeto: $PROJECT"
echo "║  Branch: $BRANCH"
echo "║  Stories: $DONE_STORIES/$TOTAL_STORIES concluídas ($PENDING_STORIES pendentes)"
echo "║  Máx. iterações: $MAX_ITERATIONS"
echo "╚══════════════════════════════════════════════════════════════╝"

if [ "$PENDING_STORIES" -eq 0 ]; then
  echo ""
  echo "✅ Todas as stories já estão concluídas! Nada para fazer."
  exit 0
fi

echo ""
echo "Iniciando Ralph — Tool: $TOOL — Máx. iterações: $MAX_ITERATIONS"

CLAUDE_MD="$RALPH_DIR/CLAUDE.md"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  Ralph Iteração $i de $MAX_ITERATIONS ($TOOL)"
  echo "═══════════════════════════════════════════════════════════════"

  # Executar a tool selecionada com as instruções ralph
  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$RALPH_DIR/prompt.md" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  else
    # Claude Code: --dangerously-skip-permissions para operação autônoma
    OUTPUT=$(claude --dangerously-skip-permissions --print < "$CLAUDE_MD" 2>&1 | tee /dev/stderr) || true
  fi

  # Checar sinal de conclusão
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "✅ Ralph completou todas as tasks!"
    echo "   Concluído na iteração $i de $MAX_ITERATIONS"
    echo ""
    echo "💡 Próximos passos:"
    echo "   @apex *apex-review  — Revisão visual (se houver frontend)"
    echo "   @devops *push       — Criar PR e fazer deploy"
    exit 0
  fi

  echo "Iteração $i concluída. Continuando..."
  sleep 2
done

echo ""
echo "⚠️  Ralph atingiu o máximo de iterações ($MAX_ITERATIONS) sem completar todas as tasks."
echo "   Verifique $PROGRESS_FILE para o status atual."
echo "   Execute novamente para continuar da última story pendente."
exit 1
