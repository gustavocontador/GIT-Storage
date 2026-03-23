# WhatsApp Cloud API — Skill Donna

> WhatsApp via API oficial da Meta + Tailscale Funnel no Mac local.

---

## Status Atual

| Componente | Status | Notas |
|------------|--------|-------|
| Baileys (WhatsApp Web) | **DESATIVADO** | Substituído por Cloud API |
| Chakra Chat (BSP) | **CONFIGURADO** — Coexistence ativo | App celular + API coexistem |
| Credenciais Cloud API | **PRONTAS** — salvas no `webhook/.env` | Token permanente (System User) |
| Webhook Cloud API | **ATIVO** — `webhook/server.ts` | Bun server em :3001 |
| Tailscale Funnel | **ATIVO** | `https://macbook-pro-de-gustavo.tail2e92a6.ts.net/webhook` |
| App Secret Meta | **CONFIGURADO** | HMAC validation ativo |
| Meta Webhook Config | **CONFIGURADO** | Callback URL + Verify Token + messages field |
| LaunchAgent (auto-start) | **ATIVO** — `com.donna.webhook.plist` | Reinicia com o Mac |

## Arquitetura

```
Celular (usuario envia msg WhatsApp)
         |
    Meta Cloud API
         |
    Tailscale Funnel (HTTPS publico)
    https://macbook-pro-de-gustavo.tail2e92a6.ts.net/webhook
         |
    Mac local :3001
         |
    webhook/server.ts (Bun)
    ├── GET  /webhook → Meta verification
    ├── POST /webhook → Recebe msg, valida HMAC, forwarda
    |       └── POST localhost:18789/api/v1/agent/message
    └── Cloud API sender → graph.facebook.com/v21.0/{phone_id}/messages
```

## Credenciais

```bash
# webhook/.env (NÃO commitado)
WHATSAPP_API_TOKEN=EAA...         # System User token (permanente)
WHATSAPP_PHONE_ID=1079076681945716
WHATSAPP_BUSINESS_ID=939693555132610
WHATSAPP_VERIFY_TOKEN=94caaea4...  # Token para Meta handshake
WHATSAPP_APP_SECRET=9f44...        # HMAC validation
```

## Comandos

```bash
# Iniciar manualmente
bun run webhook/server.ts

# Iniciar com Funnel
scripts/start-webhook.sh

# Testar health
curl http://localhost:3001/health

# LaunchAgent (auto-start no boot)
launchctl load ~/Library/LaunchAgents/com.donna.webhook.plist
launchctl unload ~/Library/LaunchAgents/com.donna.webhook.plist

# Logs
tail -f ~/Library/Logs/donna-webhook.log
tail -f ~/Library/Logs/donna-webhook.err

# Tailscale Funnel status
tailscale funnel status
```

## Chakra Chat (BSP)

- **Dashboard:** https://app.chakrahq.com
- **Plano:** Free (1000 conversas/mês, 3 users)
- **Markup:** Zero sobre Meta fees
- **Coexistence:** Ativo — app no celular + API em paralelo
- **Business Account:** 939693555132610 (Test WhatsApp Business Account)

## Vantagens vs Baileys

| | Baileys (antigo) | Cloud API (atual) |
|---|---|---|
| Conexão | Desconecta se Mac dorme/reinicia | Permanente (webhook + launchd) |
| Ban risk | Baixo (com Coexistence) | Zero (oficial Meta) |
| Dispositivos | Máx 4 linked devices | Ilimitado |
| IP/SSL | Tailscale (NAT traversal) | Funnel (HTTPS público automático) |
| Rate limit | Web session limits | 250→1K→10K→100K msg/dia |

---

*Donna WhatsApp Cloud API Skill v1.1.0 — atualizado 2026-03-22*
