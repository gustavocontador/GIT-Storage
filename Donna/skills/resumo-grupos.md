# Resumo Automático de Grupos — Skill Donna

> Donna gera resumo diário dos grupos WhatsApp mais ativos, destacando menções, decisões e ações necessárias.

---

## Como Funciona

1. **Cron job** roda 1x ao dia (20:00 — após expediente)
2. Donna lê o histórico das últimas 24h dos grupos monitorados
3. Filtra: menções ao Gustavo, decisões tomadas, tarefas atribuídas, cobranças
4. Gera resumo estruturado e envia no "Eu, eu mesmo e Irene"

## Formato do Resumo

```
📊 **Resumo dos Grupos — {data}**

**{Nome do Grupo 1}** ({N} mensagens)
- 🎯 [Decisão/ação importante]
- 📌 [Menção ao Gustavo: contexto]
- ⏰ [Prazo/cobrança detectada]

**{Nome do Grupo 2}** ({N} mensagens)
- 🎯 [Item relevante]

**Grupos silenciosos:** {lista de grupos sem atividade relevante}

Quer que eu detalhe algum grupo?
```

## Critérios de Relevância

### SEMPRE incluir:
- Menções diretas ao Gustavo (@gustavo, "Gustavo", etc.)
- Decisões que afetam o escritório/clientes
- Prazos mencionados
- Cobranças ou pedidos para o Gustavo
- Conflitos ou problemas reportados

### NUNCA incluir:
- Mensagens genéricas (bom dia, memes, links aleatórios)
- Conversas pessoais entre terceiros
- Spam ou mensagens automáticas

## Cron Job OpenClaw

```json
{
  "name": "resumo-grupos-diario",
  "enabled": true,
  "schedule": {
    "kind": "cron",
    "expr": "0 20 * * 1-5",
    "tz": "America/Sao_Paulo"
  },
  "sessionTarget": "isolated",
  "wakeMode": "now",
  "payload": {
    "kind": "agentTurn",
    "message": "Você é a Donna. Gere o RESUMO DIÁRIO DOS GRUPOS. Leia o histórico das últimas 24h dos grupos WhatsApp monitorados. Para cada grupo com atividade relevante: liste menções ao Gustavo, decisões, prazos e cobranças. Formato compacto, máx 3 items por grupo. Ignore memes, bom dias e spam. Se nenhum grupo teve atividade relevante, diga: 'Grupos tranquilos hoje. Nada que precise da sua atenção.'"
  },
  "delivery": {
    "mode": "announce",
    "channel": "whatsapp",
    "to": "5511991461629@s.whatsapp.net"
  }
}
```

## Configuração

### Grupos Monitorados
Configurar em `donna.config.yaml` → `channels.whatsapp.monitored_groups`:

```yaml
channels:
  whatsapp:
    monitored_groups:
      - name: "Escritório OA"
        priority: high
      - name: "Clientes Tributário"
        priority: high
      - name: "Sócios"
        priority: critical
```

### Horário do Resumo
- **Seg-Sex**: 20:00 (pós-expediente)
- **Sáb-Dom**: desabilitado (ajustar se necessário)

## Integração com Briefings Existentes

O resumo de grupos é **complementar** aos 3 briefings diários:
- **07:30 Briefing Manhã** — foco em agenda + prioridades
- **13:00 Update Meio-Dia** — foco em status do dia
- **18:30 Fechamento** — foco em conquistas + pendências
- **20:00 Resumo Grupos** — foco em grupos WhatsApp (NOVO)

---

*Donna Resumo de Grupos Skill v0.1.0*
