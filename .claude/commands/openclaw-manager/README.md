OpenClaw Manager — Fleet Orchestrator. Gerencia múltiplos claws OpenClaw.

## Agentes Disponíveis

- `/openclaw-manager:agents:openclaw-chief` — Fleet Orchestrator (pipeline E2E)
- `/openclaw-manager:agents:claw-provisioner` — Provisioning + Credentials
- `/openclaw-manager:agents:fleet-monitor` — Health Check + Alertas
- `/openclaw-manager:agents:skill-ops` — Skill Lifecycle Manager

## Comandos Principais

- `*provision {name}` — Provisionar novo claw
- `*upgrade {name}` — Audit + upgrade claw existente
- `*fleet-status` — Status de toda a frota
- `*health-check` — Health check de todos os claws
- `*inventory` — Inventário de skills
- `*daily-ops` — Operações diárias

## Squad Location

`/Squads/openclaw-manager/`
