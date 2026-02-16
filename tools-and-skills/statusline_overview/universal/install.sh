#!/bin/bash
# ============================================
# Claude Statusline — Instalador Universal
# ============================================
# Instala a statusline no Claude Code de qualquer máquina.
# Requer: jq (brew install jq / apt install jq)
# ============================================
set -e

CLAUDE_HOME="$HOME/.claude"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ┌──────────────────────────────────────┐"
echo "  │   Claude Statusline — Instalador     │"
echo "  └──────────────────────────────────────┘"
echo ""

# ========== PRÉ-REQUISITOS ==========
if ! command -v jq &>/dev/null; then
  echo "  [ERRO] 'jq' não encontrado."
  echo ""
  echo "  Instale com:"
  echo "    macOS:  brew install jq"
  echo "    Ubuntu: sudo apt install jq"
  echo "    Arch:   sudo pacman -S jq"
  echo ""
  exit 1
fi
echo "  [OK] jq encontrado"

# ========== CRIAR DIRETÓRIOS ==========
mkdir -p "$CLAUDE_HOME/hooks" "$CLAUDE_HOME/session-cache"
echo "  [OK] Diretórios criados"

# ========== COPIAR SCRIPTS ==========
cp "$SCRIPT_DIR/scripts/statusline.sh" "$CLAUDE_HOME/statusline.sh"
chmod +x "$CLAUDE_HOME/statusline.sh"

cp "$SCRIPT_DIR/scripts/hooks/track-agent.sh" "$CLAUDE_HOME/hooks/track-agent.sh"
chmod +x "$CLAUDE_HOME/hooks/track-agent.sh"

echo "  [OK] Scripts copiados para ~/.claude/"

# ========== BACKUP ==========
SETTINGS="$CLAUDE_HOME/settings.json"
if [ -f "$SETTINGS" ]; then
  BACKUP="$SETTINGS.bak.$(date +%Y%m%d%H%M%S)"
  cp "$SETTINGS" "$BACKUP"
  echo "  [OK] Backup: $(basename "$BACKUP")"
else
  echo '{}' > "$SETTINGS"
  echo "  [OK] settings.json criado"
fi

# ========== CONFIGURAR STATUSLINE ==========
TEMP=$(mktemp)
jq '.statusLine = {"type":"command","command":"bash ~/.claude/statusline.sh","padding":2}' "$SETTINGS" > "$TEMP" && mv "$TEMP" "$SETTINGS"

# ========== CONFIGURAR HOOK ==========
# Preserva hooks existentes do usuário
EXISTING_HOOKS=$(jq '.hooks // {}' "$SETTINGS")

# Verificar se já existe um hook UserPromptSubmit
HAS_HOOK=$(echo "$EXISTING_HOOKS" | jq 'has("UserPromptSubmit")' 2>/dev/null)

if [ "$HAS_HOOK" = "true" ]; then
  # Adicionar nosso hook sem apagar os existentes
  MERGED=$(echo "$EXISTING_HOOKS" | jq '.UserPromptSubmit += [{"hooks":[{"type":"command","command":"bash ~/.claude/hooks/track-agent.sh"}]}]')
else
  MERGED=$(echo "$EXISTING_HOOKS" | jq '.UserPromptSubmit = [{"hooks":[{"type":"command","command":"bash ~/.claude/hooks/track-agent.sh"}]}]')
fi

jq --argjson h "$MERGED" '.hooks = $h' "$SETTINGS" > "$TEMP" && mv "$TEMP" "$SETTINGS"

echo "  [OK] settings.json configurado"

echo ""
echo "  ┌──────────────────────────────────────┐"
echo "  │   Instalação concluída!              │"
echo "  └──────────────────────────────────────┘"
echo ""
echo "  Reinicie o Claude Code para ativar."
echo ""
echo "  O que você verá na barra de status:"
echo "    Modelo | Contexto | Tempo | Squad | Agente | Projeto | Git"
echo ""
echo "  Squad e Agente aparecem quando você usa:"
echo "    @dev, @architect, /meu-squad:README, etc."
echo ""
echo "  Para desinstalar: bash uninstall.sh"
echo ""
