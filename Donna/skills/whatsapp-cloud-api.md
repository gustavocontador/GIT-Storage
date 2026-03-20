# WhatsApp Cloud API — Skill Donna

> Conexão oficial da Meta via Chakra Chat (BSP). Substitui o Baileys (WhatsApp Web) por API oficial — zero desconexões, zero risco de ban.

---

## Arquitetura

```
WhatsApp (celular) ←→ Meta Cloud API ←→ Chakra Chat (BSP) ←→ Webhook → OpenClaw → Donna
                                                                          ↓
                                                              message tool (Cloud API)
                                                                          ↓
                                                              WhatsApp (resposta)
```

## Credenciais Necessárias (preencher após Chakra sync)

```bash
# No Meta Developer Portal → App "Donna" → WhatsApp → API Setup
WHATSAPP_API_TOKEN=       # System User token (permanente)
WHATSAPP_PHONE_ID=        # Phone Number ID do seu número
WHATSAPP_BUSINESS_ID=     # WhatsApp Business Account ID

# Webhook (OpenClaw recebe mensagens por aqui)
WHATSAPP_WEBHOOK_URL=     # https://macbook-pro-de-gustavo.tail2e92a6.ts.net/api/channels/whatsapp/webhook
WHATSAPP_VERIFY_TOKEN=    # Token customizado para validar webhook
```

## Configuração OpenClaw (rodar após obter credenciais)

### Passo 1: Configurar provider como Meta Cloud API
```bash
openclaw config set channels.whatsapp.provider "meta-cloud-api"
openclaw config set channels.whatsapp.api.token "$WHATSAPP_API_TOKEN"
openclaw config set channels.whatsapp.api.phoneNumberId "$WHATSAPP_PHONE_ID"
openclaw config set channels.whatsapp.api.businessAccountId "$WHATSAPP_BUSINESS_ID"
```

### Passo 2: Configurar webhook (para receber mensagens)
```bash
openclaw config set channels.whatsapp.webhook.verifyToken "$WHATSAPP_VERIFY_TOKEN"
```

### Passo 3: Desativar Baileys (WhatsApp Web)
```bash
# Só fazer DEPOIS de confirmar que Cloud API funciona
openclaw channels logout --channel whatsapp --account default
```

### Passo 4: Reiniciar gateway
```bash
openclaw gateway restart
```

### Passo 5: Testar
```bash
# Enviar mensagem de teste
openclaw message send --channel whatsapp --target "+5511991461629" --message "🔧 Teste Cloud API — se receber, migração concluída!"
```

## Vantagens vs Baileys

| | Baileys (antes) | Cloud API (agora) |
|---|---|---|
| Conexão | Desconecta frequentemente | Permanente |
| Ban risk | Alto (protocolo não-oficial) | Zero (oficial Meta) |
| Dispositivos | Máx 4 | Ilimitado |
| message tool | Bug globalThis (patch manual) | Nativo, sem patch |
| Contatos | Sem acesso API | API completa |
| Rate limit | Agressivo | 250→1K→10K→100K msg/dia |
| Coexistence | N/A | App + API no mesmo número |

## Chakra Chat (BSP)

- **Dashboard:** https://app.chakrahq.com
- **Plano:** Free (1000 conversas/mês, 3 users)
- **Markup:** Zero sobre Meta fees
- **Coexistence:** Ativo — app no celular + API em paralelo

## Onde obter as credenciais

### Token permanente:
1. https://business.facebook.com → Business Settings → Users → System Users
2. Criar system user "OpenClaw Agent" (Admin)
3. Gerar token → selecionar app "Donna" → copiar

### Phone Number ID + Business Account ID:
1. https://developers.facebook.com → App "Donna" → WhatsApp → API Setup
2. Copiar "Phone number ID" e "WhatsApp Business Account ID"

### Webhook:
1. https://developers.facebook.com → App "Donna" → WhatsApp → Configuration
2. Callback URL: URL do OpenClaw + /api/channels/whatsapp/webhook
3. Verify token: mesmo valor configurado no OpenClaw

---

*Donna WhatsApp Cloud API Skill v0.1.0*
