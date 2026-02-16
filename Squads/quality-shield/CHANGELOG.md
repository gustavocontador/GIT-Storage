# Changelog - quality-shield

All notable changes to this squad will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.3.0] - 2026-02-11

### Added
- **Tasks**: deep-trace, dependency-risk-score, regression-report (deep analysis)
- **Workflows**: hotfix-flow, kb-maintenance, onboarding-flow
- **Checklists**: deploy-checklist, diagnosis-checklist, production-incident-checklist
- **Data**: feature-flows (77 sub-flows, 2,248 lines), knowledge-base, known-interconnections, regression-patterns tracked in manifest
- `data:` section in squad.yaml components for full manifest tracking

### Changed
- Declared `@playwright/test` as node dependency
- Removed placeholder `config.extends: extend` value
- Expanded squad-config.yaml with max_retry_loops per severity and full health_check config

## [1.2.0] - 2026-02-10

### Added
- Initial operational squad with full automated bug-fix pipeline
- **Agents**: Chief (orchestrator), Diagnostician (Sage), Impact Analyst (Nova), Regression Guard (Shield), Production Monitor (Sentinel)
- **Tasks**: diagnose, analyze-impact, regression-check, production-verify, health-check, kb-record, kb-search, build-dependency-graph, map-feature-flow, map-all-flows
- **Workflows**: bug-fix-flow (end-to-end automated pipeline)
- **Checklists**: regression-checklist
- **Templates**: diagnosis-report, impact-report, kb-entry
- **Tools**: playwright-setup
- **Scripts**: scan-imports, kb-search-helper
- **Data**: dependency-graph.yaml
- External agent integration with @dev and @devops
- Severity matrix (CRITICO/ALTO/MEDIO/BAIXO) with regression levels
- Health check system (quick/full, on activation/post-deploy/on-demand)
- squad-config.yaml with timeouts, severity details, critical flows
- README.md with full documentation
