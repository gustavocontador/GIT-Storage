# N8N Automações — Skill Donna

> Workflows visuais que conectam email, calendário, Notion e WhatsApp em automações.

---

## Infraestrutura

- **Container:** `aios-n8n` (Docker)
- **URL:** http://localhost:5678
- **Auth:** Basic (`aios` / ver env)
- **Acesso host:** `host.docker.internal` (para acessar OpenClaw/Supabase do container)

## Workflows Instalados

### 1. Donna Webhook Receiver
- **Endpoint:** `POST http://localhost:5678/webhook/donna-inbox`
- **Função:** Recebe eventos externos e roteia para Donna
- **Fluxo:** Webhook → Classifica tipo → Notifica Donna via OpenClaw → Loga no Supabase
- **Uso:** Qualquer serviço externo pode chamar esse webhook para alertar a Donna

### 2. Donna Notion Task Sync
- **Trigger:** A cada 30 minutos
- **Função:** Puxa tarefas abertas do Notion → sincroniza com Supabase
- **Database Notion:** Tarefas (`3247ae17-ffa7-8101-855c-ce7093dddd96`)
- **Filtro:** Status != "Done", ordenado por Due Date

## Como Usar

### Ativar workflows no N8N:
1. Acessar http://localhost:5678
2. Login: `aios` / senha do container
3. Cada workflow precisa ser **ativado** manualmente na primeira vez (toggle ON)

### Enviar evento via webhook:
```bash
curl -X POST http://localhost:5678/webhook/donna-inbox \
  -H "Content-Type: application/json" \
  -d '{"type": "email", "summary": "Email urgente do João sobre contrato"}'
```

### Testar integração:
```bash
# Verificar se N8N está rodando
curl -s http://localhost:5678/healthz

# Listar workflows via CLI
docker exec aios-n8n n8n export:workflow --all
```

## Workflows Futuros (criar conforme necessário)

| Workflow | Trigger | Ação |
|----------|---------|------|
| Email Digest | Cron 18:00 | Himalaya lista emails → Claude resume → WhatsApp |
| Calendar Conflicts | Cron 07:00 | Google Calendar API → detecta conflitos → alerta |
| Follow-up Escalation | Cron 09:00 | Notion Follow-ups vencidos → gera texto cobrança |
| Deal Pipeline Update | Webhook | Pipedrive webhook → atualiza Notion Deals |

---

*Donna N8N Automations Skill v0.1.0*
