# Proactive Intelligence — Skill Donna

> Donna monitora emails, calendário e follow-ups em tempo real. Alerta sobre conflitos, prazos e oportunidades antes que o Gustavo precise pedir.

---

## Cron Jobs de Monitoramento

### Schedule Diário Completo

| Hora | Job | O que faz |
|------|-----|-----------|
| **07:00** | `calendar-conflict-check` | Detecta conflitos na agenda de hoje/amanhã |
| **07:30** | `Briefing Manhã` | Briefing completo: agenda + prioridades + pendências |
| **08:00** | `agua-08h` | Lembrete hidratação |
| **08:30** | `email-triage-diario` | Triage dos emails não lidos (categoriza) |
| **09:00** | `followups-vencidos-check` | Alerta follow-ups vencidos + sugere texto cobrança |
| **10:00** | `agua-10h` | Lembrete hidratação |
| **12:00** | `agua-12h` | Lembrete hidratação |
| **13:00** | `Update Meio-Dia` | Status do dia + eventos restantes |
| **14:00** | `agua-14h` | Lembrete hidratação |
| **16:00** | `agua-16h` | Lembrete hidratação |
| **18:00** | `agua-18h` | Lembrete hidratação |
| **18:30** | `Fechamento do Dia` | Conquistas + pendências + preview amanhã |
| **20:00** | `resumo-grupos-diario` | Resumo grupos WhatsApp (seg-sex) |

### Total: 13 jobs recorrentes + lembretes pontuais

## Lógica de Alertas

### Calendário (07:00)
```
IF conflito horário detectado:
  → Alerta imediato com opções
IF evento importante em < 24h:
  → Lembrete de preparação
IF agenda vazia:
  → "Dia limpo. Aproveita."
```

### Follow-ups (09:00)
```
IF prazo vencido:
  → Sugere texto de cobrança (tom cordial → firme → executivo)
IF prazo vence hoje:
  → Alerta urgente
IF sem vencidos:
  → "Tudo em dia."
```

### Email (08:30)
```
FOR EACH email não lido:
  🔴 URGENTE → responder hoje
  🟡 AÇÃO → precisa de algo do Gustavo
  🔵 INFO → apenas ciência
  ⚪ LIXO → ignorar/deletar
```

## Escalation Protocol

| Situação | Ação da Donna |
|----------|-------------|
| Conflito de agenda | Alerta + opções de reagendamento |
| Follow-up 1x vencido | Texto cordial sugerido |
| Follow-up 3x vencido | Texto firme sugerido |
| Follow-up 7+ dias | Texto executivo + sugere escalar |
| Email urgente | Notificação imediata no WhatsApp |
| Prazo em < 48h | Destaca no briefing manhã |
| Promessa não cumprida | Lembra no fechamento do dia |

## Futuras Expansões

- **Webhook de email**: Microsoft Graph notification → N8N → Donna (tempo real)
- **Calendar watch**: Google Calendar push notification → alerta instantâneo
- **Smart grouping**: Agrupar alertas para não bombardear (batch a cada 30min)

---

*Donna Proactive Intelligence Skill v0.1.0*
