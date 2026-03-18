# Email via Himalaya — Skill Donna

> Ler, buscar e responder emails direto do terminal via IMAP/SMTP, sem depender do Microsoft Graph API.

---

## Setup (1x)

```bash
# Configurar conta Outlook/Microsoft 365
himalaya account configure

# Dados necessários:
# - Email: gustavo@oacontabil.com.br
# - IMAP: outlook.office365.com:993 (SSL)
# - SMTP: smtp.office365.com:587 (STARTTLS)
# - Auth: OAuth2 ou App Password (Microsoft 365)
```

### Config file (~/.config/himalaya/config.toml)

```toml
[accounts.oacontabil]
default = true
email = "gustavo@oacontabil.com.br"
display-name = "Gustavo Oliveira"

backend.type = "imap"
backend.host = "outlook.office365.com"
backend.port = 993
backend.encryption = "tls"
backend.auth.type = "password"
backend.auth.command = "security find-generic-password -a gustavo@oacontabil.com.br -s himalaya -w"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.office365.com"
message.send.backend.port = 587
message.send.backend.encryption = "start-tls"
message.send.backend.auth.type = "password"
message.send.backend.auth.command = "security find-generic-password -a gustavo@oacontabil.com.br -s himalaya -w"
```

### Salvar senha no Keychain (seguro)

```bash
security add-generic-password -a gustavo@oacontabil.com.br -s himalaya -w "SUA_SENHA_OU_APP_PASSWORD"
```

---

## Comandos Frequentes

### Ler emails

```bash
# Listar últimos 10 emails do inbox
himalaya envelope list --folder INBOX --page-size 10

# Ler um email específico
himalaya message read <ID>

# Buscar emails
himalaya envelope list --folder INBOX --query "from:fulano assunto:contrato"
```

### Responder/Enviar

```bash
# Responder
himalaya message reply <ID>

# Encaminhar
himalaya message forward <ID>

# Compor novo email (via MML)
himalaya message write <<'MML'
From: gustavo@oacontabil.com.br
To: destinatario@email.com
Subject: Assunto aqui

Corpo do email aqui.
MML
```

### Organizar

```bash
# Mover para pasta
himalaya message move <ID> --to "Archive"

# Marcar como lido
himalaya flag add <ID> --flag seen

# Listar pastas
himalaya folder list
```

---

## Integração com Donna

### Quando Donna usa Himalaya:

1. **"Verifica meus emails"** → `himalaya envelope list --page-size 5`
2. **"Tem email do [pessoa]?"** → `himalaya envelope list --query "from:pessoa"`
3. **"Responde o email do [pessoa]"** → Donna redige resposta, confirma, envia
4. **"Manda email pro [pessoa] sobre [assunto]"** → Donna compõe, confirma, envia

### Regras:

- **SEMPRE confirmar** antes de enviar email
- **Mostrar preview** do email completo antes de enviar
- **Nunca enviar** email para fora sem aprovação explícita do Gustavo

---

*Donna Email Skill (Himalaya) v0.1.0*
