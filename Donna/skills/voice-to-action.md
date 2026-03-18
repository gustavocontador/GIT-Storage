# Voice-to-Action Pipeline — Skill Donna

> Áudio do Gustavo → Whisper transcreve → Claude interpreta → Cria tarefas, follow-ups e compromissos automaticamente no Notion e no Painel.

---

## Pipeline Completo

```
┌─────────────┐     ┌──────────┐     ┌───────────────┐     ┌──────────────┐
│  WhatsApp   │ ──→ │ Whisper  │ ──→ │   Claude      │ ──→ │   Actions    │
│  Audio Note │     │ (pt-BR)  │     │ (interpreta)  │     │              │
│             │     │          │     │               │     │ • Notion     │
│             │     │ openai-  │     │ donna-persona │     │ • Follow-ups │
│             │     │ whisper  │     │ extraction    │     │ • Calendar   │
│             │     │ -api     │     │ rules         │     │ • Panel      │
└─────────────┘     └──────────┘     └───────────────┘     └──────────────┘
```

## Fase 1: Transcrição (automática)

- **Provider:** OpenAI Whisper API (`whisper-1`)
- **Idioma:** `pt` (português)
- **Skill:** `openai-whisper-api` (ready no OpenClaw)
- **Trigger:** Gustavo envia áudio no WhatsApp → OpenClaw detecta → Whisper transcreve

## Fase 2: Interpretação (Claude)

Claude analisa a transcrição e extrai:

### Entities a extrair:
| Entity | Exemplo | Destino |
|--------|---------|---------|
| **Tarefa** | "preciso fazer o relatório" | Notion Tarefas |
| **Compromisso** | "reunião com João amanhã 15h" | Google Calendar |
| **Follow-up** | "cobra a Ana sobre o contrato" | Notion Follow-ups |
| **Decisão** | "vamos com a opção B" | memory/decisões |
| **Promessa** | "te mando o documento" | Notion Follow-ups (auto) |
| **Lembrete** | "me lembra de pagar a conta" | OpenClaw cron (one-shot) |
| **Prazo** | "até sexta" | Data calculada → Notion |

### Frases-gatilho (de donna.config.yaml):
```
te retorno → follow-up com prazo
vou ver isso → tarefa para Gustavo
te mando → compromisso de envio
falamos amanhã → reunião implícita
me lembra → lembrete explícito
cobra fulano → cobrança delegada
marca isso → agendamento
depois alinhamos → follow-up futuro
vou resolver → tarefa
fico de mandar → compromisso
semana que vem → prazo
assim que puder → soft deadline
```

## Fase 3: Ações Automáticas

### 3a. Criar Tarefa no Notion
```bash
NOTION_KEY=$(cat ~/.config/notion/api_key)
curl -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"database_id": "3247ae17-ffa7-8101-855c-ce7093dddd96"},
    "properties": {
      "Tarefa": {"title": [{"text": {"content": "EXTRACTED_TASK"}}]},
      "Status": {"status": {"name": "To Do"}},
      "Prazo": {"date": {"start": "EXTRACTED_DATE"}},
      "Categoria": {"select": {"name": "EXTRACTED_CATEGORY"}}
    }
  }'
```

### 3b. Criar Follow-up no Notion
```bash
curl -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"database_id": "3247ae17-ffa7-81bd-b204-f8923c398cb8"},
    "properties": {
      "Quem": {"title": [{"text": {"content": "PERSON_NAME"}}]},
      "Assunto": {"rich_text": [{"text": {"content": "SUBJECT"}}]},
      "Status": {"status": {"name": "Pendente"}},
      "Prazo": {"date": {"start": "DEADLINE"}}
    }
  }'
```

### 3c. Criar evento no Google Calendar
```bash
# Via google-calendar skill já instalado
# Ou via script Python com refresh token
```

### 3d. Criar lembrete one-shot (OpenClaw cron)
```bash
openclaw cron add --name "lembrete-TOPIC" \
  --at "+TIME" \
  --session isolated --announce \
  --channel whatsapp --to "5511991461629@s.whatsapp.net" \
  --message "REMINDER_TEXT" \
  --delete-after-run
```

## Fase 4: Resposta Estruturada

Formato obrigatório pós-áudio (de donna-persona.md):

```
**Entendi:** [resumo em 1-2 frases]

Tarefas criadas:
1. [tarefa] — prazo: [X] — responsável: [Y]

Follow-ups:
- [pessoa] — [assunto] — cobrar em [data]

Compromissos:
- [evento] — [data/hora]

Dúvidas: [se houver ambiguidade]
```

## Segurança

| Ação | Auto-execute? |
|------|--------------|
| Criar tarefa no Notion | SIM |
| Criar follow-up no Notion | SIM |
| Criar lembrete (cron) | SIM |
| Criar evento no calendário | CONFIRMAR antes |
| Enviar mensagem externa | CONFIRMAR antes |
| Reagendar reunião | CONFIRMAR antes |

## Configuração

### Requisitos:
1. OpenClaw com Whisper skill ativo (ready)
2. Notion API key em `~/.config/notion/api_key` (done)
3. Google Calendar credentials no .env (done)
4. donna-persona.md com regras de extração (done)

### Ativar:
O pipeline já funciona nativamente — quando Gustavo envia áudio, o OpenClaw transcreve via Whisper e a persona da Donna (donna-persona.md) instrui o Claude a extrair e agir.

O que este skill adiciona:
- **Escrita no Notion** em vez de apenas memory/*.md
- **Criação de cron jobs** para lembretes
- **Formato de resposta padronizado** com confirmação de ações

---

*Donna Voice-to-Action Pipeline Skill v0.1.0*
