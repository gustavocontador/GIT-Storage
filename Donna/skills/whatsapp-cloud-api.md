# WhatsApp Cloud API — Skill Donna

> Migração para API oficial da Meta. Planejada para quando a Donna migrar para AWS.

---

## Status Atual

| Componente | Status | Notas |
|------------|--------|-------|
| Baileys (WhatsApp Web) | **ATIVO** — em uso no Mac local | OpenClaw v2026.3.13 só suporta Baileys |
| Chakra Chat (BSP) | **CONFIGURADO** — Coexistence ativo | App celular + Baileys coexistem |
| Credenciais Cloud API | **PRONTAS** — salvas no `.env` | Token permanente (System User) |
| Webhook Cloud API | **PENDENTE** — migração AWS | Precisa de IP público / domínio |

## Credenciais (prontas no .env)

```bash
WHATSAPP_API_TOKEN=EAA...   # System User token (permanente, nunca expira)
WHATSAPP_PHONE_ID=1079076681945716
WHATSAPP_BUSINESS_ID=939693555132610
```

## Plano de Migração: Mac Local → AWS

### Fase 1: Mac Local (AGORA)
- WhatsApp via **Baileys** (OpenClaw nativo)
- Chakra Chat com **Coexistence** ativo (protege contra ban)
- Credenciais Cloud API salvas, aguardando

### Fase 2: AWS (FUTURO)
Quando a Donna for para a AWS, a arquitetura muda para:

```
WhatsApp (celular)
    ↕
Meta Cloud API
    ↕
Chakra Chat (BSP)
    ↓
Webhook (HTTPS) → AWS (Donna) → Processa mensagem → Responde via Cloud API
    ↑
    IP público / domínio com SSL
```

#### O que precisa na AWS:
1. **Endpoint HTTPS** — domínio com SSL (ex: `donna.seudominio.com/webhook/whatsapp`)
2. **Webhook receiver** — recebe POST do Meta, valida signature, extrai mensagem
3. **Cloud API sender** — envia respostas via `POST graph.facebook.com/v21.0/{phone_id}/messages`
4. **Verify endpoint** — GET que responde o `hub.verify_token` para o Meta validar

#### Configuração no Meta Developer Portal:
1. App "Donna" → WhatsApp → Configuration
2. Callback URL: `https://donna.seudominio.com/webhook/whatsapp`
3. Verify Token: token customizado (gerar na hora)
4. Webhooks fields: `messages`, `message_status`

## Vantagens da Migração

| | Baileys (Mac local) | Cloud API (AWS) |
|---|---|---|
| Conexão | Desconecta se Mac dorme/reinicia | Permanente (webhook) |
| Ban risk | Baixo (com Coexistence) | Zero (oficial Meta) |
| Dispositivos | Máx 4 linked devices | Ilimitado |
| Escalabilidade | Single machine | Auto-scaling AWS |
| IP/SSL | Tailscale (NAT traversal) | IP público + SSL nativo |
| Rate limit | Web session limits | 250→1K→10K→100K msg/dia |
| Coexistence | Baileys + app celular | API + app celular |

## Chakra Chat (BSP)

- **Dashboard:** https://app.chakrahq.com
- **Plano:** Free (1000 conversas/mês, 3 users)
- **Markup:** Zero sobre Meta fees
- **Coexistence:** Ativo — app no celular + API em paralelo
- **Business Account:** 939693555132610 (Test WhatsApp Business Account)

## Referência: Como foram obtidas as credenciais

### Token permanente (System User):
1. https://business.facebook.com → Business Settings → Users → System Users
2. System user "OpenClaw Agent" (Admin)
3. Token com permissão `whatsapp_business_messaging`

### Phone Number ID + Business Account ID:
1. https://developers.facebook.com → App "Donna" → WhatsApp → API Setup
2. Phone Number ID: `1079076681945716`
3. Business Account ID: `939693555132610`

---

*Donna WhatsApp Cloud API Skill v0.2.0 — atualizado 2026-03-20*
