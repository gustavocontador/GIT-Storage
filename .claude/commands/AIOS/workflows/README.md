# AIOS Workflows - Referencia Rapida

> Ative um workflow via o agente responsavel. Exemplo: `/AIOS/agents/pm` → `*create-prd`

## Workflows Disponiveis

| Workflow | Arquivo | Agentes Envolvidos |
|----------|---------|-------------------|
| Spec Pipeline | SPEC-PIPELINE-WORKFLOW.md | @pm → @architect → @analyst → @pm → @qa |
| Greenfield Full-Stack | GREENFIELD-FULLSTACK-WORKFLOW.md | @pm → @architect → @dev → @qa → @devops |
| Greenfield Service | GREENFIELD-SERVICE-WORKFLOW.md | @pm → @architect → @data-engineer → @dev → @qa |
| Greenfield UI | GREENFIELD-UI-WORKFLOW.md | @pm → @ux → @dev → @qa |
| Brownfield Discovery | BROWNFIELD-DISCOVERY-WORKFLOW.md | @analyst → @architect → @qa |
| Brownfield Full-Stack | BROWNFIELD-FULLSTACK-WORKFLOW.md | @architect → @dev → @qa → @devops |
| Brownfield Service | BROWNFIELD-SERVICE-WORKFLOW.md | @architect → @dev → @qa |
| Brownfield UI | BROWNFIELD-UI-WORKFLOW.md | @ux → @dev → @qa |
| QA Loop | QA-LOOP-WORKFLOW.md | @qa ↔ @dev (iterativo) |
| Story Dev Cycle | STORY-DEVELOPMENT-CYCLE-WORKFLOW.md | @sm → @dev → @qa |
| Design System | DESIGN-SYSTEM-BUILD-QUALITY-WORKFLOW.md | @ux |
| Auto Worktree | AUTO-WORKTREE-WORKFLOW.md | @devops → @dev |

## Como Usar

1. Ative o agente lider: `/AIOS/agents/{agent-id}`
2. Execute o comando do workflow (ex: `*create-prd`, `*develop`, `*gate`)
3. O agente orquestra as fases e faz handoff para outros agentes quando necessario

## Arquivos Completos

Localizados em: `AIOS-WORKFLOWS/` e linkados em `.aios-core/development/workflows/`
