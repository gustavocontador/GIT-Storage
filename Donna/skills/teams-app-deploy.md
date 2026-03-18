# Donna Teams App — Deploy & Setup

> Donna como app no celular via Microsoft Teams. Chat pessoal, comandos, notificações push.

---

## Status Atual

- **Bot Framework:** Endpoint ativo em `localhost:3978/api/messages`
- **Manifest:** Pronto em `teams-app/manifest.json`
- **Package:** `donna-teams-app.zip` pronto para upload
- **Tailscale:** Exposto via `wss://macbook-pro-de-gustavo.tail2e92a6.ts.net`
- **Extensão OpenClaw:** msteams v2026.3.13 instalada

## Comandos no Teams

| Comando | Descrição |
|---------|-----------|
| `/status` | Painel executivo do dia |
| `/agenda` | Agenda de hoje e próximos compromissos |
| `/followups` | Follow-ups pendentes e cobranças |

## Deploy — Passo a Passo

### 1. Garantir Tailscale Funnel ativo (expor bot para internet)

```bash
# Verificar status
tailscale status

# Ativar funnel para o bot endpoint
tailscale funnel 3978
```

### 2. Upload do app no Teams Admin Center

1. Acessar: https://admin.teams.microsoft.com
2. Menu: **Teams apps** → **Manage apps** → **Upload new app**
3. Fazer upload de `teams-app/donna-teams-app.zip`
4. Aprovar o app para o tenant

### 3. Sideload direto (alternativa mais rápida)

1. Abrir Microsoft Teams (desktop ou celular)
2. Menu lateral: **Apps** → **Manage your apps**
3. **Upload a custom app** → selecionar `donna-teams-app.zip`
4. **Add** para instalar no chat pessoal

### 4. Verificar conexão

```bash
# Status do OpenClaw
openclaw status

# Logs do Teams plugin
openclaw logs --follow | grep msteams
```

## Configuração Azure

| Item | Valor |
|------|-------|
| App ID | `65260b5c-ec87-43eb-a889-6be55cdc61af` |
| Tenant ID | `e2ca8fb6-ad2d-45bb-8552-069bf3b79a39` |
| Bot Endpoint | `https://macbook-pro-de-gustavo.tail2e92a6.ts.net/api/messages` |
| Scopes | personal, team, groupChat |

## Troubleshooting

- **"Unauthorized"**: Verificar app password em `openclaw.json → channels.msteams.appPassword`
- **Sem resposta**: Verificar se Tailscale funnel está ativo (`tailscale funnel status`)
- **Erro de manifest**: Recriar zip com `cd teams-app && zip donna-teams-app.zip manifest.json color.png outline.png`

---

*Donna Teams App Deploy Skill v0.1.0*
