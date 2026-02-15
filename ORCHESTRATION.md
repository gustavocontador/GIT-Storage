# AIOS Orchestration Map

> Mapa completo de agentes, workflows e como ativar cada um.

---

## Agentes Core (11)

| Agente | Persona | Comando Claude Code | Foco |
|--------|---------|-------------------|------|
| @aios-master | Orion 🌍 | `/AIOS/agents/aios-master` | Orquestrador universal |
| @pm | Morgan 📊 | `/AIOS/agents/pm` | Product Manager |
| @dev | Dex 🛠️ | `/AIOS/agents/dev` | Full Stack Developer |
| @qa | Quinn 🛡️ | `/AIOS/agents/qa` | Quality Assurance |
| @architect | Aria 🏗️ | `/AIOS/agents/architect` | Solution Architect |
| @analyst | Atlas 🔍 | `/AIOS/agents/analyst` | Business Analyst |
| @sm | River 🌊 | `/AIOS/agents/sm` | Scrum Master |
| @devops | Gage ⚙️ | `/AIOS/agents/devops` | DevOps Engineer |
| @ux | Uma 🎨 | `/AIOS/agents/ux` | UX/Design System |
| @data-engineer | Dara 🗄️ | `/AIOS/agents/data-engineer` | Data Engineer |
| @squad-creator | Craft 🏛️ | `/AIOS/agents/squad-creator` | Meta-Squad Creator |

## Sub-Agentes Squad Creator (4)

| Agente | Comando Claude Code | Foco |
|--------|-------------------|------|
| @squad-architect | `/squad-creator/agents/squad-architect` | Orquestrador de criacao |
| @oalanicolas | `/squad-creator/agents/oalanicolas` | Mind Cloning (DNA Mental) |
| @pedro-valerio | `/squad-creator/agents/pedro-valerio` | Process Design |
| @sop-extractor | `/squad-creator/agents/sop-extractor` | SOP Extraction |

---

## Workflows (12)

### Greenfield (projeto novo)

```
SPEC-PIPELINE ─── PRD → Spec
  @pm(gather) → @architect(assess) → @analyst(research) → @pm(write) → @qa(review)

GREENFIELD-FULLSTACK ─── App completo
  @pm(PRD) → @architect(arch) → @dev(impl) → @qa(test) → @devops(deploy)

GREENFIELD-SERVICE ─── Backend service
  @pm(PRD) → @architect(arch) → @data-engineer(schema) → @dev(impl) → @qa(test)

GREENFIELD-UI ─── Frontend
  @pm(PRD) → @ux(design) → @dev(impl) → @qa(test)
```

### Brownfield (projeto existente)

```
BROWNFIELD-DISCOVERY ─── Auditoria
  @analyst(discovery) → @architect(assess) → @qa(validate)

BROWNFIELD-FULLSTACK ─── Refactor completo
  @architect(plan) → @dev(refactor) → @qa(test) → @devops(deploy)

BROWNFIELD-SERVICE ─── Refactor service
  @architect(plan) → @dev(refactor) → @qa(test)

BROWNFIELD-UI ─── Refactor UI
  @ux(audit) → @dev(refactor) → @qa(test)
```

### Cross-cutting

```
QA-LOOP ─── Ciclo iterativo
  @qa(review) ↔ @dev(fix) [repete ate APPROVE]

STORY-DEV-CYCLE ─── Story completa
  @sm(draft) → @dev(implement) → @qa(gate)

DESIGN-SYSTEM ─── Design system
  @ux(audit → tokenize → build → validate)

AUTO-WORKTREE ─── Git worktrees
  @devops(setup) → @dev(work)
```

---

## Fluxo Tipico de Projeto Novo

```
1. /AIOS/agents/pm           → *create-prd
2. /AIOS/agents/architect    → *assess-complexity
3. /AIOS/agents/sm           → *draft (stories)
4. /AIOS/agents/dev          → *develop {story}
5. /AIOS/agents/qa           → *gate {story}
6. /AIOS/agents/devops       → *release
```

## Fluxo de Criacao de Squad

```
1. /AIOS/agents/squad-creator → *create-squad {domain}
2. Sistema pesquisa elite minds automaticamente
3. Aprovacao dos minds → clonagem → validacao
4. *install-commands para ativar via Claude Code
```

---

## Estrutura de Arquivos

```
AIOS/
├── .aios-core/development/     ← Symlinks centralizados
│   ├── agents/                  → AIOS-AGENT-FLOWS/
│   ├── workflows/               → AIOS-WORKFLOWS/
│   ├── tasks/                   → squad-creator/tasks/
│   └── templates/               → squad-creator/templates/
├── .claude/commands/            ← Claude Code commands
│   ├── AIOS/agents/             11 agentes core
│   ├── AIOS/workflows/          README de referencia
│   └── squad-creator/agents/    4 sub-agentes (symlinks)
├── AIOS-AGENT-FLOWS/            10+1 system definitions
├── AIOS-WORKFLOWS/              12 workflow definitions
├── squad-creator/               Meta-squad completo
├── design/                      Design System squad
├── jose_amorim/                 Mind DNA mapping
└── ORCHESTRATION.md             ← Este arquivo
```

---

**AIOS Orchestration Map v1.0**
*15 agentes | 12 workflows | 20 tasks | 13 templates*
