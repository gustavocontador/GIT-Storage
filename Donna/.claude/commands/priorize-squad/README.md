# Priorize Squad - Comandos Instalados

> 23 tecnicas de priorizacao (Eisenhower, RICE, WSJF, Kano, AHP) com seletor automatico por contexto.

## Quick Start

```bash
# Priorizacao rapida (Donna escolhe a tecnica)
/priorize-squad:tasks:quick-prioritize

# Escolher tecnica ideal pro seu caso
/priorize-squad:tasks:select-technique

# Executar priorizacao completa
/priorize-squad:tasks:execute-prioritization

# Comparar tecnicas
/priorize-squad:tasks:compare-techniques
```

## Agentes Disponiveis

| Comando | Papel | Especialidade |
|---------|-------|---------------|
| `/priorize-squad:agents:priorize-chief` | Orchestrator | Coordena, seleciona tecnica, roteia |
| `/priorize-squad:agents:technique-analyst` | Analista | Avalia contexto, recomenda tecnica ideal |
| `/priorize-squad:agents:technique-executor` | Executor | Aplica a tecnica escolhida nos itens |

## Tasks Disponiveis

| Comando | Descricao |
|---------|-----------|
| `/priorize-squad:tasks:quick-prioritize` | Priorizacao rapida automatica |
| `/priorize-squad:tasks:select-technique` | Seletor de tecnica por contexto |
| `/priorize-squad:tasks:execute-prioritization` | Execucao completa com relatorio |
| `/priorize-squad:tasks:compare-techniques` | Comparativo entre tecnicas |

## Localizacao

- **Squad completo:** `Squads/priorize-squad/`
- **Comandos slash:** `.claude/commands/priorize-squad/`

---

_Installed: 2026-03-22_
