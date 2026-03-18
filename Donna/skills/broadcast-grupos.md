# Broadcast para Grupos — Skill Donna

> Permite à Donna enviar uma mesma mensagem para múltiplos grupos WhatsApp de uma vez.

---

## Quando Usar

- Avisos gerais (mudanças de expediente, feriados, comunicados)
- Anúncios importantes para vários grupos simultaneamente
- Follow-ups em massa (cobranças, lembretes)

## Como Funciona

1. **Gustavo pede:** "Manda pra todos os grupos: [mensagem]"
2. **Donna confirma:** lista os grupos-alvo + mensagem formatada
3. **Gustavo aprova:** "pode ir" / "envia"
4. **Donna envia:** broadcast via `openclaw message --broadcast`

## Comando OpenClaw

```bash
# Enviar para grupos específicos
openclaw message send --channel whatsapp --broadcast \
  --to "grupo1,grupo2,grupo3" \
  --body "Mensagem aqui"

# Listar grupos disponíveis
openclaw message groups --channel whatsapp
```

## Regras de Segurança

1. **SEMPRE confirmar** antes de enviar broadcast (nunca auto-execute)
2. **Máximo 10 grupos** por broadcast
3. **Mostrar preview** da mensagem formatada antes de enviar
4. **Logar** cada broadcast enviado (data, grupos, mensagem)

## Template de Confirmação

```
**Broadcast para {N} grupos:**

{lista de grupos}

**Mensagem:**
> {mensagem}

Confirma o envio?
```

## Grupos Frequentes (atualizar conforme uso)

| Alias | Grupo | Contexto |
|-------|-------|----------|
| pessoal | "Eu, eu mesmo e Irene" | Inbox pessoal |

---

*Donna Broadcast Skill v0.1.0*
