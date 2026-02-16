#!/bin/bash
# ============================================
# Track Agent & Squad — Hook UserPromptSubmit
# ============================================
# Detecta ativação de agentes e squads em tempo real.
#
# Padrões detectados:
#   Agentes: @<name>, /<qualquer>:agents:<name>
#   Squads:  /<squad>:<qualquer-coisa>
#   Saída:   *exit (limpa agente e squad)
#
# Cache por PPID — cada sessão Claude Code tem PID único.
# Funciona com qualquer sistema de squads/agentes que use esses padrões.
# ============================================

CLAUDE_HOME="$HOME/.claude"
CACHE_DIR="$CLAUDE_HOME/session-cache"
mkdir -p "$CACHE_DIR"

# PPID = processo Claude Code que disparou este hook
SESSION_KEY="$PPID"
AGENT_CACHE="$CACHE_DIR/agent-$SESSION_KEY.json"
SQUAD_CACHE="$CACHE_DIR/squad-$SESSION_KEY.json"

# Ler mensagem do usuário via stdin (formato JSON do Claude Code)
STDIN_DATA=$(cat 2>/dev/null)
USER_MSG=$(echo "$STDIN_DATA" | jq -r '.prompt // empty' 2>/dev/null)
[ -z "$USER_MSG" ] && USER_MSG="${1:-}"
[ -z "$USER_MSG" ] && exit 0

# ========== DETECTAR *exit ==========
# Limpa agente E squad — volta ao estado "idle"
if echo "$USER_MSG" | grep -qE '^\*exit$|^\*exit ' 2>/dev/null; then
  echo '{"agent":"none","status":"idle","ts":'$(date +%s)'}' > "$AGENT_CACHE"
  echo '{"squad":"none","ts":'$(date +%s)'}' > "$SQUAD_CACHE"
  exit 0
fi

# ========== DETECTAR SQUAD ==========
# Padrão: /<squad-name>:<qualquer-coisa>
# Exemplos: /hormozi:README, /dopamine-learning:workflows:quiz
SQUAD=$(echo "$USER_MSG" | grep -oE '/[a-zA-Z][a-zA-Z0-9_-]+:[a-zA-Z]' | head -1 | sed 's|^/||;s|:.*||')

# Ignorar prefixos que não são squads (ex: /AIOS:agents:dev → agente, não squad)
case "$SQUAD" in
  AIOS) SQUAD="" ;;
esac

if [ -n "$SQUAD" ]; then
  echo "{\"squad\":\"$SQUAD\",\"ts\":$(date +%s)}" > "$SQUAD_CACHE"
fi

# ========== DETECTAR AGENTE ==========
AGENT=""

# Padrão 1: /<qualquer>:agents:<name>
# Exemplos: /AIOS:agents:dev, /squad-creator:agents:squad-chief
if [ -z "$AGENT" ]; then
  AGENT=$(echo "$USER_MSG" | grep -oE '/[a-zA-Z0-9_-]+:agents:[a-zA-Z0-9_-]+' | head -1 | sed 's|.*/[^:]*:agents:||')
fi

# Padrão 2: @<name>
# Exemplos: @dev, @architect, @pm
if [ -z "$AGENT" ]; then
  AGENT=$(echo "$USER_MSG" | grep -oE '@[a-zA-Z][a-zA-Z0-9_-]*' | head -1 | sed 's/^@//')
fi

if [ -n "$AGENT" ]; then
  echo "{\"agent\":\"$AGENT\",\"status\":\"active\",\"ts\":$(date +%s)}" > "$AGENT_CACHE"
fi
