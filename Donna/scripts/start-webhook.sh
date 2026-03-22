#!/bin/bash
# Donna WhatsApp Cloud API — Start webhook server + Tailscale Funnel
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
WEBHOOK_DIR="$PROJECT_DIR/webhook"

echo "[donna] Starting WhatsApp Cloud API webhook..."

# Check bun
if ! command -v bun &>/dev/null; then
  echo "[donna] ERROR: bun not found. Install: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

# Check tailscale
if ! command -v tailscale &>/dev/null; then
  echo "[donna] ERROR: tailscale not found."
  exit 1
fi

# Start webhook server
echo "[donna] Starting webhook server on :3001..."
cd "$WEBHOOK_DIR"
bun run server.ts &
WEBHOOK_PID=$!
echo "[donna] Webhook PID: $WEBHOOK_PID"

# Wait for server to be ready
sleep 2
if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
  echo "[donna] WARNING: Health check failed, server may not be ready yet"
fi

# Configure Tailscale serve + funnel
echo "[donna] Configuring Tailscale Funnel..."
tailscale serve --bg --set-path /webhook http://localhost:3001
tailscale funnel on

echo ""
echo "[donna] WhatsApp Cloud API webhook is live!"
echo "[donna] Local:  http://localhost:3001/webhook"
echo "[donna] Public: https://macbook-pro-de-gustavo.tail2e92a6.ts.net/webhook"
echo ""
echo "[donna] To stop: kill $WEBHOOK_PID"
