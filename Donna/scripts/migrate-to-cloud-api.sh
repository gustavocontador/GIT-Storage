#!/bin/bash
# ============================================
# Donna — Migração Baileys → WhatsApp Cloud API
# ============================================
# Uso: bash scripts/migrate-to-cloud-api.sh
# Pré-requisito: Chakra Chat sincronizado + credenciais da Meta
# ============================================

set -e

echo ""
echo "=========================================="
echo "  Donna — Migração para Cloud API"
echo "=========================================="
echo ""

# --- Credenciais ---
read -p "WHATSAPP_API_TOKEN (token permanente): " WHATSAPP_API_TOKEN
read -p "WHATSAPP_PHONE_ID (Phone Number ID): " WHATSAPP_PHONE_ID
read -p "WHATSAPP_BUSINESS_ID (Business Account ID): " WHATSAPP_BUSINESS_ID

VERIFY_TOKEN=$(openssl rand -hex 16)
echo ""
echo "Verify token gerado: $VERIFY_TOKEN"
echo ""

# --- Validar credenciais ---
echo "Validando token com a Meta API..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_ID" \
  -H "Authorization: Bearer $WHATSAPP_API_TOKEN")

if [ "$RESPONSE" != "200" ]; then
  echo "❌ Token inválido ou Phone ID incorreto (HTTP $RESPONSE)"
  echo "   Verifique as credenciais e tente novamente."
  exit 1
fi
echo "✅ Credenciais válidas!"
echo ""

# --- Salvar credenciais ---
echo "Salvando credenciais em ~/.openclaw/workspace/.env..."
cat >> ~/.openclaw/workspace/.env <<EOL

# WhatsApp Cloud API - Donna (Meta Official)
WHATSAPP_API_TOKEN=$WHATSAPP_API_TOKEN
WHATSAPP_PHONE_ID=$WHATSAPP_PHONE_ID
WHATSAPP_BUSINESS_ID=$WHATSAPP_BUSINESS_ID
WHATSAPP_VERIFY_TOKEN=$VERIFY_TOKEN
EOL
echo "✅ Credenciais salvas"
echo ""

# --- Configurar OpenClaw ---
echo "Configurando OpenClaw para Cloud API..."
openclaw config set channels.whatsapp.provider "meta-cloud-api" 2>/dev/null
openclaw config set channels.whatsapp.api.token "$WHATSAPP_API_TOKEN" 2>/dev/null
openclaw config set channels.whatsapp.api.phoneNumberId "$WHATSAPP_PHONE_ID" 2>/dev/null
openclaw config set channels.whatsapp.api.businessAccountId "$WHATSAPP_BUSINESS_ID" 2>/dev/null
openclaw config set channels.whatsapp.webhook.verifyToken "$VERIFY_TOKEN" 2>/dev/null
echo "✅ OpenClaw configurado"
echo ""

# --- Desativar Baileys ---
echo "Desativando conexão Baileys (WhatsApp Web)..."
openclaw channels logout --channel whatsapp --account default 2>/dev/null || true
echo "✅ Baileys desativado"
echo ""

# --- Reiniciar gateway ---
echo "Reiniciando gateway..."
openclaw gateway restart 2>/dev/null
sleep 5
echo "✅ Gateway reiniciado"
echo ""

# --- Testar ---
echo "Enviando mensagem de teste..."
RESULT=$(openclaw message send --channel whatsapp --target "+5511991461629" --message "🔧 Donna Cloud API ativa! Migração concluída com sucesso." 2>&1)

if echo "$RESULT" | grep -q "Sent"; then
  echo "✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!"
  echo ""
  echo "=========================================="
  echo "  Donna agora usa WhatsApp Cloud API"
  echo "  Conexão oficial Meta — zero desconexões"
  echo "=========================================="
else
  echo "⚠️ Mensagem de teste falhou. Verifique:"
  echo "   - Webhook configurado no Meta Developer Portal"
  echo "   - Callback URL apontando para o OpenClaw"
  echo "   - Verify token: $VERIFY_TOKEN"
  echo ""
  echo "Resultado: $RESULT"
fi
echo ""
