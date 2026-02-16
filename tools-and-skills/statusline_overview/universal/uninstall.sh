#!/bin/bash
# ============================================
# Claude Statusline — Desinstalador Universal
# ============================================
set -e

CLAUDE_HOME="$HOME/.claude"
SETTINGS="$CLAUDE_HOME/settings.json"

echo ""
echo "  ┌──────────────────────────────────────┐"
echo "  │   Claude Statusline — Desinstalador  │"
echo "  └──────────────────────────────────────┘"
echo ""

# Remover scripts
rm -f "$CLAUDE_HOME/statusline.sh"
rm -f "$CLAUDE_HOME/hooks/track-agent.sh"
echo "  [OK] Scripts removidos"

# Limpar settings.json
if [ -f "$SETTINGS" ] && command -v jq &>/dev/null; then
  TEMP=$(mktemp)

  # Remover statusLine
  jq 'del(.statusLine)' "$SETTINGS" > "$TEMP" && mv "$TEMP" "$SETTINGS"

  # Remover apenas o nosso hook (preservar outros hooks do usuário)
  jq '.hooks.UserPromptSubmit = [.hooks.UserPromptSubmit[]? | select(.hooks[]?.command != "bash ~/.claude/hooks/track-agent.sh")]' "$SETTINGS" > "$TEMP" && mv "$TEMP" "$SETTINGS"

  # Se UserPromptSubmit ficou vazio, remover a chave
  UPS_COUNT=$(jq '.hooks.UserPromptSubmit | length' "$SETTINGS" 2>/dev/null || echo "0")
  if [ "$UPS_COUNT" = "0" ]; then
    jq 'del(.hooks.UserPromptSubmit)' "$SETTINGS" > "$TEMP" && mv "$TEMP" "$SETTINGS"
  fi

  # Se hooks ficou vazio, remover a chave
  HOOKS_COUNT=$(jq '.hooks | length' "$SETTINGS" 2>/dev/null || echo "0")
  if [ "$HOOKS_COUNT" = "0" ]; then
    jq 'del(.hooks)' "$SETTINGS" > "$TEMP" && mv "$TEMP" "$SETTINGS"
  fi

  echo "  [OK] settings.json limpo"
fi

# Limpar cache de sessão
rm -f "$CLAUDE_HOME/session-cache/agent-"*.json 2>/dev/null
rm -f "$CLAUDE_HOME/session-cache/squad-"*.json 2>/dev/null
echo "  [OK] Cache limpo"

echo ""
echo "  ┌──────────────────────────────────────┐"
echo "  │   Desinstalação concluída!           │"
echo "  └──────────────────────────────────────┘"
echo ""
echo "  Reinicie o Claude Code para aplicar."
echo ""
