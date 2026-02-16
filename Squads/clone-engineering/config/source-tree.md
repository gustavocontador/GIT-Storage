# Source Tree — Clone Engineering Squad

```
squads/clone-engineering/
├── squad.yaml                          # Squad manifest
├── README.md                           # Squad documentation
│
├── config/
│   ├── coding-standards.md             # Language, naming, quality rules
│   ├── tech-stack.md                   # Tools, DB, LLM, infrastructure
│   └── source-tree.md                  # This file
│
├── agents/                             # 5 agent definitions
│   ├── el-clonador.md                  # Lead — Pipeline Orchestrator
│   ├── mind-mapper.md                  # Cognitive Extraction Specialist
│   ├── kb-curator.md                   # Knowledge Base Architect
│   ├── prompt-architect.md             # System Prompt Engineer
│   └── fidelity-tester.md             # Fidelity Validation Specialist
│
├── tasks/                              # 25 task definitions
│   ├── el-clonador-*.md               # 4 pipeline tasks
│   ├── mind-mapper-*.md               # 7 extraction tasks
│   ├── kb-curator-*.md                # 5 KB tasks
│   ├── prompt-architect-*.md          # 5 prompt tasks
│   └── fidelity-tester-*.md           # 5 validation tasks
│
├── workflows/                          # 3 workflow definitions
│   ├── mmos-full-pipeline.yaml        # Full 7-phase pipeline
│   ├── layer-extraction.yaml          # Single layer extraction
│   └── fidelity-iteration.yaml        # Test-Fix-Retest cycle
│
├── checklists/                         # 3 validation checklists
│   ├── phase-gate-checklist.md        # Phase gate criteria
│   ├── triangulation-checklist.md     # Layers 5-8 triangulation
│   └── fidelity-validation-checklist.md # Fidelity testing
│
├── templates/                          # 5 artifact templates
│   ├── layer-template.yaml            # DNA Mental layer extraction
│   ├── chunk-template.yaml            # KB chunk with metadata
│   ├── system-prompt-template.md      # System prompt structure
│   ├── scenario-template.yaml         # Fidelity test scenario
│   └── fidelity-report-template.md    # Fidelity assessment report
│
├── data/                               # 3 reference data files
│   ├── dna-mental-layers.md           # 8-layer reference documentation
│   ├── mmos-pipeline-phases.md        # Phase descriptions and gates
│   └── persona-switching-rules.md     # Persona activation rules
│
├── tools/                              # Custom tools (future)
└── scripts/                            # Utility scripts (future)
```
