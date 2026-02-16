# Architecture — Prioritization Squad

## Component Flow Diagram

```
                         ┌─────────────────────┐
                         │     User Request     │
                         │  "prioritize these"  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    🎯 priorize-chief (Tier 0) │
                    │    Diagnosis & Orchestration   │
                    │                               │
                    │  • Understands context         │
                    │  • Selects technique           │
                    │  • Delegates execution         │
                    │  • Validates final output      │
                    └───────┬──────────┬────────────┘
                            │          │
               ┌────────────┘          └────────────┐
               ▼                                    ▼
┌──────────────────────────┐       ┌──────────────────────────────┐
│ ⚡ technique-executor     │       │ 📊 technique-analyst          │
│        (Tier 1)          │       │         (Tier 2)             │
│ Scoring Session Runner   │       │ Comparison & Trade-off       │
│                          │       │                              │
│ • RICE/ICE/GUT scoring   │       │ • Side-by-side comparison    │
│ • WSJF/CD3 calculation   │       │ • Dimension analysis (8-dim) │
│ • AHP pairwise matrices  │       │ • Context-fit scoring        │
│ • MoSCoW classification  │       │ • Trade-off visualization    │
│ • Weighted scoring       │       │ • Recommendation synthesis   │
│ • Matrix generation      │       │ • Historical pattern match   │
└──────────┬───────────────┘       └──────────────┬───────────────┘
           │                                      │
           └──────────────┬───────────────────────┘
                          ▼
              ┌───────────────────────┐
              │   Validated Output    │
              │  (Ranked/Scored List) │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  ✅ technique-review  │
              │    (Checklist)        │
              │  16-point validation  │
              └───────────────────────┘
```

## Tier Organization

```
Tier 0 — DIAGNOSIS (Chief/Orchestrator)
│
│  priorize-chief.md
│  • Entry point for all requests
│  • Context analysis (5 dimensions)
│  • Technique selection decision tree
│  • Delegates execution to Tier 1
│  • Delegates analysis to Tier 2
│  • Final validation & sanity check
│
├── Tier 1 — EXECUTION (Specialist)
│   │
│   └── technique-executor.md
│       • Runs scoring sessions step-by-step
│       • Handles all 23 technique workflows
│       • Score computation & formula verification
│       • Matrix/table generation
│       • Enforces differentiation & anchoring
│
└── Tier 2 — ANALYSIS (Specialist)
    │
    └── technique-analyst.md
        • Technique comparison (8 dimensions)
        • Trade-off analysis
        • Context-fit scoring
        • Recommendation synthesis
        • Cross-technique insight extraction
```

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  User Input  │────▶│  select-technique │────▶│  Recommended     │
│  (context)   │     │  (task)          │     │  Technique(s)    │
└─────────────┘     └──────────────────┘     └────────┬─────────┘
                                                       │
                    ┌──────────────────────────────────┘
                    │
          ┌─────────▼─────────┐
          │ User chooses path  │
          └──┬──────┬──────┬──┘
             │      │      │
    ┌────────┘      │      └────────┐
    ▼               ▼               ▼
┌────────┐   ┌───────────┐   ┌──────────┐
│*execute │   │ *compare  │   │ *quick   │
│(full)   │   │(analysis) │   │(fast)    │
└────┬────┘   └─────┬─────┘   └────┬─────┘
     │              │              │
     │   ┌──────────┘              │
     ▼   ▼                        ▼
┌──────────────┐          ┌──────────────┐
│ technique-   │          │ technique-   │
│ executor     │          │ executor     │
│ (Tier 1)     │          │ (Tier 1)     │
└──────┬───────┘          └──────┬───────┘
       │                         │
       └───────────┬─────────────┘
                   ▼
          ┌──────────────┐
          │  technique-  │
          │  review.md   │
          │ (checklist)  │
          └──────────────┘
```

## File Dependencies

```
squad.yaml (manifest)
├── agents/
│   ├── priorize-chief.md ──────── Tier 0 (orchestrator)
│   │   ├── loads: data/technique-catalog.yaml
│   │   ├── delegates to: technique-executor.md
│   │   └── delegates to: technique-analyst.md
│   ├── technique-executor.md ──── Tier 1 (execution)
│   │   └── loads: data/technique-catalog.yaml
│   └── technique-analyst.md ───── Tier 2 (analysis)
│       └── loads: data/technique-catalog.yaml
├── tasks/
│   ├── select-technique.md ────── Agent: priorize-chief
│   ├── execute-prioritization.md ─ Agent: technique-executor
│   ├── compare-techniques.md ──── Agent: technique-analyst
│   └── quick-prioritize.md ────── Agent: technique-executor
├── data/
│   └── technique-catalog.yaml ─── 23 techniques (shared)
└── checklists/
    └── technique-review.md ────── Post-execution validation
```

## Handoff Protocol

| From | To | Trigger | Payload |
|------|----|---------|---------|
| User | priorize-chief | Any prioritization request | Context description |
| priorize-chief | technique-executor | Technique selected, ready to score | Technique ID + items list |
| priorize-chief | technique-analyst | User wants comparison | Technique IDs + optional context |
| technique-executor | priorize-chief | Scoring complete | Ranked results + scores |
| technique-analyst | priorize-chief | Analysis complete | Comparison table + recommendation |
| priorize-chief | User | Validation passed | Final prioritized output + next steps |

---

*Architecture v1.1 — Prioritization Squad*
