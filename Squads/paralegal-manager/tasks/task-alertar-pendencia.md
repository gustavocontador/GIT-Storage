# Task: Alertar Pendência Crítica

**Owner:** paralegal-chief-of-staff
**Type:** Proactive Alert
**Duration:** Instantâneo

## Objetivo
Alertar paralegal + cliente sobre pendências críticas.

## Triggers
- Documento pendente < 3 dias: VERMELHO
- Documento pendente 3-7 dias: AMARELO
- Documento não respondido 48h: Ligação telefônica
- Processo travado > 10 dias: Escalation gerência

## Channels
- Sistema: notificação in-app
- Cliente: WhatsApp (Onvio)
- Paralegal: Slack + email
- Gerência: Email (se escalation)

## Output
- Alerta enviado
- Log: alerta + resposta
