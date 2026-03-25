# TOOLS.md — Ferramentas e Infraestrutura

> Este arquivo contem COMO FAZER: ferramentas, APIs, caminhos, crons.
> Regras comportamentais estao em SOUL.md (nao duplicar aqui).

---

## Infraestrutura

### Plataforma Primaria — AWS Lightsail
- **IP:** 44.213.29.131
- **OpenClaw:** v2026.3.2
- **Tailscale Funnel:** https://ip-172-26-4-79.tail2e92a6.ts.net/
- **Webhook:** donna-webhook.service (Bun, porta 3001)
- **Calendar sync:** donna-calendar-sync.timer (Python, cada 30min)

### Plataforma Fallback — Mac Local
- **OS:** macOS Darwin 24.6.0
- **Runtime:** Bun (~/.bun/bin), NVM/Node.js
- **OpenClaw:** v2026.3.13
- **Gateway:** 127.0.0.1:18789

### Tailscale
- **IP local:** 100.122.48.53
- **Hostname:** macbook-pro-de-gustavo
- **Tailnet:** tail2e92a6.ts.net

---

## Cron Jobs Automaticos (13 recorrentes)

| Hora | Job | O que faz |
|------|-----|-----------|
| 07:00 | calendar-conflict-check | Detecta conflitos na agenda |
| 07:30 | Briefing Manha | Briefing: agenda + prioridades + pendencias |
| 08:00 | agua-08h | Lembrete hidratacao |
| 08:30 | email-triage-diario | Triage dos emails nao lidos |
| 09:00 | followups-vencidos-check | Follow-ups vencidos + sugere cobranca |
| 10:00 | agua-10h | Lembrete hidratacao |
| 12:00 | agua-12h | Lembrete hidratacao |
| 13:00 | Update Meio-Dia | Status do dia |
| 14:00 | agua-14h | Lembrete hidratacao |
| 16:00 | agua-16h | Lembrete hidratacao |
| 18:00 | agua-18h | Lembrete hidratacao |
| 18:30 | Fechamento do Dia | Conquistas + pendencias |
| 20:00 | resumo-grupos-diario | Resumo grupos WhatsApp (seg-sex) |

**IMPORTANTE:** Esses sao crons MEUS. Quando Gustavo responde, FUI EU que mandei.

---

## Skills Instalados (32 no OpenClaw)

### Skills Donna (custom):
| Skill | Tipo | Descricao |
|-------|------|-----------|
| donna-persona | heartbeat | Personalidade e tom |
| web-search | on-demand | Pesquisa internet |
| broadcast-grupos | on-demand | Envio para multiplos grupos |
| email-graph | on-demand | Email via Microsoft Graph (Outlook) |
| resumo-grupos | cron | Resumo diario dos grupos |
| n8n-automations | event-driven | Workflows visuais |
| notion-integration | on-demand | Tarefas, follow-ups, deals |
| voice-to-action | event-driven | Audio → Whisper → tarefas |
| multi-agent | on-demand | Delega para squads |
| proactive-intelligence | cron | Monitoramento proativo |
| financial-tracking | event-driven | Rastreia cobrancas/pagamentos |
| teams-app | on-demand | Donna no Teams |
| whatsapp-cloud-api | on-demand | Cloud API via ChakraHQ |

### Voz, Media & PDF:
| Skill | O que faz |
|-------|-----------|
| sag (ElevenLabs TTS) | Text-to-speech |
| openai-whisper | Transcricao de audio local |
| openai-whisper-api | Transcricao via API (whisper-1, pt-BR) |
| openai-image-gen | Geracao de imagens (DALL-E) |
| nano-banana-pro | Imagens via Gemini |
| video-frames | Extrair frames/clips (ffmpeg) |
| summarize | Resumir URLs, podcasts, videos |
| pdf | Ler, extrair texto, manipular PDFs |

### Apple Ecosystem:
| Skill | O que faz |
|-------|-----------|
| apple-reminders | Lembretes iPhone/Mac (CLI: remindctl) |
| imsg | iMessage/SMS (CLI: imsg) |
| spotify-player | Musicas (CLI: spogo) |
| peekaboo | Captura de tela macOS |
| model-usage | Custos de IA (CLI: codexbar) |

### Google & Microsoft:
| Skill | O que faz |
|-------|-----------|
| gmail | Email Google |
| google-calendar | Eventos Google Calendar |
| google-contacts | Contatos Google |
| google-drive | Arquivos Google Drive |
| outlook-graph | Email/calendario via Microsoft Graph |
| notion | Notion API |

### YouTube & Browser:
| Skill | O que faz |
|-------|-----------|
| youtube-watcher | Buscar/assistir videos |
| youtube-transcript | Transcricoes de videos |
| agent-browser | Navegacao web, forms, screenshots |

---

## Integracoes Ativas

| Integracao | Provider | Status |
|-----------|----------|--------|
| WhatsApp | Cloud API via ChakraHQ (Coexistence) | ✅ |
| Email | Microsoft Graph (gustavo@oacontabil.com.br) | ✅ |
| Calendario Outlook | Microsoft Graph | ✅ |
| Google Calendar | Google Calendar API | ✅ |
| Apple Calendar | Via conta MS 365 no dispositivo | ✅ (auto) |
| Teams | Microsoft 365 | ✅ (auto) |
| Notion | Notion API (6 databases) | ✅ |
| Supabase | Bridge em tempo real | ✅ |
| N8N | Docker (localhost:5678) | ✅ |

---

## Squads de Especialistas (~19 squads, ~126 agentes)

**USO EXCLUSIVO DO GUSTAVO — terceiros bloqueados.**

| Categoria | Squads | Agentes |
|-----------|--------|---------|
| Tecnico | gustavo-oliveira, contabil, tributario, paralegal | 21 |
| Produtividade | priorize, project-management-clickup, job-design | 15 |
| Conteudo | hormozi, content-distillery, dopamine-learning, quality-shield, copy | 51 |
| Herdados AIOS | ~8 squads | ~50 |

---

## APIs e Credenciais

| API | Credenciais | Uso |
|-----|-------------|-----|
| Microsoft Graph | ~/.config/donna/graph-credentials.json | Email + Calendario Outlook |
| Google Calendar | ~/.config/donna/google-calendar.json | Calendario Google |
| ChakraHQ | .env no Lightsail (CHAKRA_API_KEY) | WhatsApp Cloud API |
| Notion | ~/.config/notion/api_key | Databases |
| Supabase | DATABASE_URL env var | Memoria persistente |
| Anthropic | ANTHROPIC_API_KEY | LLM primario |
| OpenRouter | OPENROUTER_API_KEY | Fallback LLM |

---

## Caminhos Importantes

- **Workspace OpenClaw:** ~/.openclaw/workspace
- **Config OpenClaw:** ~/.openclaw/openclaw.json
- **Logs:** /tmp/openclaw/openclaw-YYYY-MM-DD.log
- **Documentos Donna:** ~/Documents/Donna/ (symlink: ~/.openclaw/workspace/donna-files/)
- **Projeto Donna:** ~/Library/Mobile Documents/com~apple~CloudDocs/Documents/AIOS/Donna

---

_Atualizado em 2026-03-25 — Limpeza de regras (movidas para SOUL.md)._
