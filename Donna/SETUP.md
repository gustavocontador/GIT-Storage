# Donna — Setup Guide

## Pré-requisitos

- [ ] macOS (ou Linux/Windows)
- [ ] Node.js 18+
- [ ] Número WhatsApp dedicado (ou seu pessoal — risco de ban baixo com uso moderado)
- [ ] API Key da Anthropic (Claude)
- [ ] API Key da OpenAI (para Whisper)
- [ ] Acesso admin ao Microsoft 365 (gustavo@oacontabil.com.br)

---

## Fase 1: Instalar OpenClaw

```bash
# Opção 1: One-liner
curl -fsSL https://openclaw.ai/install.sh | bash

# Opção 2: NPM
npm i -g openclaw

# Opção 3: Git (para customização)
git clone https://github.com/openclaw/openclaw.git
cd openclaw && npm install
```

Após instalar:
```bash
openclaw onboard
```

Durante o onboard:
1. Selecione **Claude** como AI provider
2. Insira sua `ANTHROPIC_API_KEY`
3. Escolha o modelo (recomendado: `claude-sonnet-4-5-20250929` para custo/performance)

---

## Fase 2: Conectar WhatsApp

```bash
openclaw channel add whatsapp
```

1. QR code será exibido no terminal
2. Abra WhatsApp no celular → Configurações → Aparelhos conectados → Conectar aparelho
3. Escaneie o QR code
4. Pronto — OpenClaw agora lê e responde no WhatsApp

---

## Fase 3: Instalar Donna Persona

Copie o skill da Donna para o diretório de skills do OpenClaw:

```bash
# Descubra o diretório de skills
openclaw config --show | grep skills

# Copie o skill (ajuste o path conforme necessário)
cp skills/donna-persona.md ~/.openclaw/skills/donna-persona.md
```

Ou crie o skill via comando:
```bash
openclaw skill add donna-persona --from skills/donna-persona.md
```

---

## Fase 4: Configurar Canal Pessoal

1. No WhatsApp, crie um grupo chamado **"Eu, eu mesmo e Irene"**
2. Adicione apenas seu número + o número do OpenClaw
3. Configure o OpenClaw para monitorar este grupo como inbox principal

---

## Fase 5: Configurar Microsoft 365

### 5.1 Registrar App no Azure (Entra ID)

1. Acesse: https://portal.azure.com → Microsoft Entra ID → App registrations
2. New registration:
   - Name: "Donna Executive Assistant"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: `http://localhost:3000/callback` (Web)
3. Anote: **Application (client) ID** e **Directory (tenant) ID**

### 5.2 Criar Client Secret

1. Na app registrada → Certificates & secrets → New client secret
2. Description: "Donna"
3. Expires: 24 months
4. Anote o **Value** (não o Secret ID)

### 5.3 Configurar Permissões

1. API permissions → Add a permission → Microsoft Graph
2. Adicione as permissões delegadas:
   - `Mail.Read`
   - `Mail.Send`
   - `Calendars.ReadWrite`
   - `Chat.Read`
   - `Chat.ReadWrite`
   - `Presence.Read`
3. Grant admin consent for [sua organização]

### 5.4 Configurar no OpenClaw

Adicione ao `.env` ou configuração do OpenClaw:
```env
MS_TENANT_ID=seu-tenant-id
MS_CLIENT_ID=seu-client-id
MS_CLIENT_SECRET=seu-client-secret
```

---

## Fase 6: Configurar Google Calendar

1. Acesse: https://console.cloud.google.com
2. Crie um projeto: "Donna"
3. Ative: Google Calendar API
4. Configure OAuth consent screen
5. Crie credenciais OAuth 2.0 (tipo: Web application)
6. Redirect URI: `http://localhost:3000/google/callback`
7. Anote: **Client ID** e **Client Secret**

```env
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
```

---

## Verificação

Após setup completo, teste:

```bash
# Teste WhatsApp
# Envie "Donna, status" no grupo "Eu, eu mesmo e Irene"

# Teste Claude
openclaw test --skill donna-persona

# Teste conexão
openclaw status
```

---

## Próximos Passos

Após o setup básico funcionar:
1. [ ] Criar skills de integração Microsoft Graph
2. [ ] Criar skill de integração Google Calendar
3. [ ] Criar skill de transcrição (Whisper)
4. [ ] Criar skill de follow-up tracking
5. [ ] Criar skill de painel executivo
6. [ ] Configurar briefing diário automático
7. [ ] Configurar alertas de calendário
