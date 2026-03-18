# Donna — Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                        DONNA ENGINE                          │
│                  (OpenClaw + Custom Skills)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   PERSONA LAYER                        │  │
│  │  donna-persona.md (Voice DNA + Behavioral Rules)       │  │
│  │  adhd-design-guide.md (Design Constraints)             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ WhatsApp │ │ MS Graph │ │ Google   │ │ Whisper      │   │
│  │ (builtin)│ │ (skill)  │ │ Calendar │ │ Transcription│   │
│  │          │ │ Teams    │ │ (skill)  │ │ (skill)      │   │
│  │          │ │ Outlook  │ │          │ │              │   │
│  │          │ │ Calendar │ │          │ │              │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Executive│ │ Follow-up│ │ Calendar │ │ Collection   │   │
│  │ Panel    │ │ Tracker  │ │ Intel    │ │ Manager      │   │
│  │ (skill)  │ │ (skill)  │ │ (skill)  │ │ (skill)      │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Web      │ │ Broadcast│ │ Himalaya │ │ Resumo       │   │
│  │ Search   │ │ Grupos   │ │ Email    │ │ Grupos       │   │
│  │ (EXA/    │ │ (config) │ │ CLI      │ │ (cron)       │   │
│  │  Apify)  │ │          │ │ (skill)  │ │              │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│                                                              │
├──────────────────── CANAIS DE ENTRADA ───────────────────────┤
│                                                              │
│  WhatsApp        Teams          Outlook         Calendar     │
│  ├─ DMs          ├─ Channels    ├─ Inbox        ├─ Outlook   │
│  ├─ Groups       ├─ Chats       ├─ Sent         └─ Google    │
│  ├─ "Eu,eu,Irene"├─ Presence   └─ Drafts                   │
│  └─ Mentions     └─ Meetings                                │
│                                                              │
├──────────────────── CANAL DE SAÍDA ──────────────────────────┤
│                                                              │
│  WhatsApp (principal) → "Eu, eu mesmo e Irene"              │
│  Teams (quando necessário)                                   │
│  Email (quando necessário)                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | OpenClaw (Node.js, local) |
| **AI Model** | Claude (Anthropic) — primary |
| **WhatsApp** | OpenClaw builtin (WhatsApp Web protocol) |
| **Microsoft** | Microsoft Graph API via OAuth 2.0 |
| **Google** | Google Calendar API v3 via OAuth 2.0 |
| **Transcrição** | OpenAI Whisper API (`whisper-1`, language: `pt`) |
| **Memória** | OpenClaw persistent memory |
| **Skills** | OpenClaw skills system (extensível) |
| **Web Search** | EXA + Apify + Brave (Docker MCP) |
| **Email CLI** | Himalaya (IMAP/SMTP direto) |
| **Broadcast** | OpenClaw message broadcast |
| **Database** | Supabase PostgreSQL (bridge daemon) |
| **Automation** | N8N (Docker, webhooks + scheduled) |
| **Task Mgmt** | Notion API (6 databases) |
| **Voice** | Whisper → Claude → Notion + Calendar + Cron |

## Autenticação

| Serviço | Método | Detalhes |
|---------|--------|---------|
| **OpenClaw** | Local | Roda na máquina, sem auth externo |
| **WhatsApp** | QR Code | Via WhatsApp Web, scaneado 1x |
| **Microsoft 365** | OAuth 2.0 Delegated | Gustavo é admin, consentimento único |
| **Google Calendar** | OAuth 2.0 | Consent screen, refresh token |
| **Whisper** | API Key | OPENAI_API_KEY |

## Permissões Microsoft Graph Necessárias

| Permissão | Tipo | Admin Consent |
|-----------|------|--------------|
| Mail.Read | Delegated | Não |
| Mail.Send | Delegated | Não |
| Calendars.ReadWrite | Delegated | Não |
| Chat.Read | Delegated | Sim |
| Chat.ReadWrite | Delegated | Sim |
| ChannelMessage.Read.All | Application | Sim |
| Presence.Read | Delegated | Não |

## Fluxos Principais

### 1. Processamento de Áudio
```
Gustavo grava áudio → WhatsApp → OpenClaw → Whisper (transcrição)
→ Claude (interpretação + extração) → Donna responde com resumo estruturado
→ Atualiza painel + follow-ups
```

### 2. Monitoramento de WhatsApp
```
Mensagem em grupo → OpenClaw recebe → Claude analisa relevância
→ SE relevante OU menção ao Gustavo → Donna notifica
→ SE ação necessária → Cria tarefa/follow-up
```

### 3. Email Intelligence
```
Novo email → Graph API webhook → OpenClaw → Claude categoriza
→ SE urgente → Donna notifica imediatamente
→ SE ação necessária → Cria tarefa com contexto
→ SE rotina → Inclui no briefing diário
```

### 4. Calendar Conflict Detection
```
Novo evento → Graph API + Google API → Donna verifica conflitos
→ SE conflito → Notifica imediatamente com opções
→ SE preparação necessária → Alerta 24h antes
→ Alertas: 1h antes + 15min antes
```

### 5. Follow-up Tracking
```
Donna detecta frase-gatilho → Cria follow-up rastreável
→ Timer de cobrança inicia → Alerta no momento certo
→ Sugere texto de cobrança com tom adequado
→ Confirma antes de enviar (se externo)
```

## Custo Estimado Mensal

| Item | Custo (R$) |
|------|-----------|
| VPS para OpenClaw (se necessário) | 0-100 |
| Whisper API (~10h áudio/mês) | ~20 |
| Claude API (sumarização, análise) | 25-75 |
| Microsoft 365 (já pago) | 0 |
| Google Calendar API | 0 |
| **Total** | **~45-195/mês** |

## Roadmap de Implementação

| Fase | Escopo | Status |
|------|--------|--------|
| **1. Setup** | OpenClaw + WhatsApp + Claude | DONE |
| **2. Persona** | Donna skill + design ADHD | DONE |
| **3. Inbox** | Canal "Eu, eu mesmo e Irene" | DONE |
| **4. Microsoft** | Teams + Outlook + Calendar | CONFIGURED |
| **5. Intelligence** | Follow-ups + Alertas + Transcrição | CONFIGURED |
| **6. Dashboard** | Painel executivo + Relatórios | PLANNED |
| **7. Web Search** | EXA + Apify + Brave (Docker MCP) | DONE (needs API keys) |
| **8. Broadcast** | Envio para múltiplos grupos | DONE |
| **9. Himalaya** | Email CLI IMAP/SMTP | DONE (needs account config) |
| **10. Resumo Grupos** | Cron job resumo diário 20:00 | DONE |
| **11. Multi-agent** | agentToAgent + 35 squads (tributário, contábil, paralegal, copy) | DONE |
| **12. Teams App** | Manifest + extension prontos, deploy via sideload | READY |
| **13. Proactive Intel** | 3 novos crons: calendar conflicts, follow-ups, email triage | DONE |
| **14. Financial Track** | Supabase tables + detecção em conversas | DONE |
| **15. Dashboard Web** | Painel executivo em http://localhost:3333 | DONE |
