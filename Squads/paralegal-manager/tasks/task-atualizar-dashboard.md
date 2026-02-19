# Task: Atualizar Dashboard (Real-Time)

**Owner:** Sistema (Socket.io)
**Type:** Real-Time Sync
**Duration:** < 100ms

## Objetivo
Atualizar dashboard em tempo real quando dados mudam.

## Triggers
- Processo criado
- Status mudou
- Documento recebido
- Certidão expirou
- Capacidade mudou

## Flow
1. Evento dispara (Prisma hook)
2. Emit Socket.io: `tenant:{id}:dashboard`
3. Clients conectados recebem evento
4. React state atualiza
5. UI re-renderiza (novo dado)

## Metrics
- Latency: < 100ms (evento → UI)
- Concurrent users: suporta 100+
