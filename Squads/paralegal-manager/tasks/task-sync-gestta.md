# Task: Sync Gestta

**Owner:** fullstack-developer (via BullMQ job)
**Type:** Integration
**Duration:** 2-5 minutos

## Objetivo
Sincronizar tarefas paralegais com Gestta (sistema contábil).

## Flow
1. Fetch tarefas Gestta API
2. Comparar com banco local (diff)
3. Inserir novas tarefas
4. Atualizar status existentes
5. Emitir Socket.io event (atualizar dashboard)
6. Log sync (sucesso/erro)

## Trigger
- Webhook Gestta (tempo real)
- Polling backup (5 min)
- Manual (botão dashboard)

## Output
- Tarefas sincronizadas
- Dashboard atualizado
