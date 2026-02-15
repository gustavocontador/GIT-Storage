# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **AIOS-FULLSTACK** workspace — an AI Operating System ecosystem for creating and managing squads of AI agents based on real "elite minds" (people with documented frameworks and skin in the game).

Primary language: **Portuguese (pt-BR)**.

## Ecosystem Structure

The AIOS ecosystem is distributed across multiple directories:

| Location | Content |
|----------|---------|
| `squad-creator/` | Meta-squad: creates and manages all other squads |
| `AIOS-AGENT-FLOWS/` | 10 system definitions (QA, SM, DevOps, PM, etc.) |
| `AIOS-WORKFLOWS/` | 12 workflow definitions (greenfield, brownfield, QA loops) |
| `design/` | Design System squad (Brad Frost/Atomic Design) — UI audit, tokens, components, a11y |
| `jose_amorim/` | Mind mapping completo (DNA Mental™ v3.0) — private individual, hybrid workflow, 85-90% fidelity |

## Core Concepts

- **Squad**: Group of specialized agents working together in a domain (28+ active squads, 192 agents, 396 tasks)
- **Mind**: Real person with documented frameworks — source of knowledge for cloning
- **Agent**: Digital clone of a mind, carrying Voice DNA (communication style) and Thinking DNA (frameworks/heuristics)
- **Tier system**: 0 (generalist) → 3 (hyper-specialist), plus orchestrator
- **Quality Gates**: Prefixed `SC_`, multi-phase validation at agent, task, workflow, and squad levels

## Execution Modes

- **YOLO mode**: Automatic, web research, 60-75% fidelity
- **QUALITY mode**: User-provided materials (books, PDFs), 85-95% fidelity

## Key Commands (via squad-creator)

```
*create-squad [domain]          # Create complete squad
*clone-mind [name] --domain X   # Clone an elite mind
*validate-squad [name]          # Run quality gates
*discover-tools [domain]        # Deep tool discovery (5 parallel sub-agents)
*quality-dashboard [name]       # Quality metrics report
```

## Architecture Principles

- Agents must follow 6-level AIOS structure and pass quality gates
- Workflows preferred over standalone tasks for 3+ phase operations
- Tool evaluation uses relative tiers (percentile-based), never absolute thresholds
- Flags (security, maturity) are for human attention, not automatic vetoes
- PRD mandatory for squads with >= 10 workflows
- Agent stories reference workflows, never specify inline
