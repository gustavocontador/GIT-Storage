# Changelog — Prioritization Squad

All notable changes to this squad are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.1.0] - 2026-02-13

### Added
- `technique-executor.md` agent (Tier 1) — Specialist in executing scoring sessions (RICE, ICE, WSJF, AHP, GUT, Weighted Scoring)
- `technique-analyst.md` agent (Tier 2) — Specialist in technique comparisons and trade-off analysis
- `ARCHITECTURE.md` — Component flow diagram and tier organization
- `CHANGELOG.md` — Standalone changelog (this file)
- 2 new objection algorithms in `priorize-chief.md` (total: 5)
- Inline auto-correction guidance in `technique-review.md` checklist

### Changed
- `priorize-chief.md` — Added handoff delegation to new specialist agents
- `technique-review.md` — v1.1 → v1.2: Added inline fix guidance per checkbox item
- `squad.yaml` — Updated to v1.1.0, registered new agents
- `README.md` — Updated to reflect multi-agent architecture

### Improved
- Tier Organization score: 1 agent → 3 agents across Tier 0/1/2
- Documentation score: Added ARCHITECTURE.md + CHANGELOG.md
- Checklist Actionability: Inline auto-correction per failed item
- Objection handling: 3 → 5 domain-specific objection algorithms

---

## [1.0.0] - 2026-02-13

### Added
- Initial creation with 23-technique catalog (`technique-catalog.yaml`)
- `priorize-chief.md` — Tier 0 orchestrator agent with 3 operational frameworks
- 4 tasks: `select-technique`, `execute-prioritization`, `compare-techniques`, `quick-prioritize`
- 1 checklist: `technique-review.md` (16-point quality review)
- `squad.yaml` configuration with pattern library and executor types
- `README.md` with full technique catalog and quick start guide
