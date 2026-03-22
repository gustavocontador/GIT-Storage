# WhatsApp Cloud API — Skill Donna

> Migração para API oficial da Meta via Tailscale Funnel no Mac local.

---

## Status Atual

| Componente | Status | Notas |
|------------|--------|-------|
| Baileys (WhatsApp Web) | **ATIVO** — desativar após validação | `openclaw channels logout --channel whatsapp --account default` |
| Chakra Chat (BSP) | **CONFIGURADO** — Coexistence ativo | App celular + API coexistem |
| Credenciais Cloud API | **PRONTAS** — salvas no `webhook/.env` | Token permanente (System User) |
| Webhook Cloud API | **IMPLEMENTADO** — `webhook/server.ts` | Bun server em :3001 |
| Tailscale Funnel | **PENDENTE** — precisa habilitar ACL + funnel on | URL: `https://macbook-pro-de-gustavo.tail2e92a6.ts.net/webhook` |
| App Secret Meta | **PENDENTE** — Gustavo precisa copiar do portal | Settings → Basic → Show |
| Meta Webhook Config | **PENDENTE** — Gustavo configura no portal | Callback URL + Verify Token |
| LaunchAgent (auto-start) | **CRIADO** — `com.donna.webhook.plist` | `launchctl load` após validação |

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
WHATSAPP_VERIFY_TOKEN=94caaea4...  # Token gerado para Meta handshake
WHATSAPP_APP_SECRET=               # PENDENTE — pegar no Meta Developer Portal
```

## Comandos

```bash
# Iniciar manualmente
bun run webhook/server.ts

# Iniciar com Funnel
scripts/start-webhook.sh

# Testar health
curl http://localhost:3001/health

# Testar verificação Meta
curl "http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=TOKEN&hub.challenge=test123"

# LaunchAgent (auto-start no boot)
launchctl load ~/Library/LaunchAgents/com.donna.webhook.plist
launchctl unload ~/Library/LaunchAgents/com.donna.webhook.plist

# Desativar Baileys (após validação completa)
openclaw channels logout --channel whatsapp --account default
```

## Passos Pendentes (Gustavo no browser)

1. **App Secret:** https://developers.facebook.com → App "Donna" → Settings → Basic → Show
2. **Tailscale Funnel:** Habilitar na ACL ou `tailscale funnel 3001`
3. **Meta Webhook:** App "Donna" → WhatsApp → Configuration → Edit
   - Callback URL: `https://macbook-pro-de-gustavo.tail2e92a6.ts.net/webhook`
   - Verify Token: `94caaea4181639d466d4261fc56aac98a433a902cc9d37b79489d5afdc84027c`
   - Webhook fields: `messages`

## Chakra Chat (BSP)

- **Dashboard:** https://app.chakrahq.com
- **Plano:** Free (1000 conversas/mês, 3 users)
- **Markup:** Zero sobre Meta fees
- **Coexistence:** Ativo — app no celular + API em paralelo
- **Business Account:** 939693555132610 (Test WhatsApp Business Account)

## Vantagens da Migração

| | Baileys (Mac local) | Cloud API (Tailscale Funnel) |
|---|---|---|
| Conexão | Desconecta se Mac dorme/reinicia | Permanente (webhook + launchd) |
| Ban risk | Baixo (com Coexistence) | Zero (oficial Meta) |
| Dispositivos | Máx 4 linked devices | Ilimitado |
| IP/SSL | Tailscale (NAT traversal) | Funnel (HTTPS público automático) |
| Rate limit | Web session limits | 250→1K→10K→100K msg/dia |

---

*Donna WhatsApp Cloud API Skill v1.0.0 — atualizado 2026-03-22*
