# AIOS Update Package - Manifest Schema

## manifest.json

The manifest is the primary metadata file for update packages. When present, it takes
precedence over all other version detection methods.

```json
{
  "name": "component-name",
  "version": "2.7.0",
  "type": "squad | skill | expansion-pack | core | agents | orchestrator",
  "target_path": "squads/core-squad",
  "description": "Brief description of what this update contains",
  "aios_compatible": ">=2.6.0",

  "files": [
    "agents/tech-lead.md",
    "agents/frontend-specialist.md",
    "squad.yaml",
    "templates/new-template.md"
  ],

  "remove": [
    "agents/deprecated-agent.md",
    "templates/old-template.md"
  ],

  "wrappers": {
    "source_path": "wrappers",
    "files": [
      "tech-lead.md",
      "frontend-specialist.md"
    ]
  },

  "post_checks": [
    "npm run build",
    "npm run type-check"
  ],

  "changelog": "Brief changelog for this version",
  "author": "Author name",
  "date": "2026-02-14"
}
```

## Field Descriptions

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Component identifier (matches directory name) |
| `version` | Yes | Semver version string |
| `type` | Yes | Component type for routing |
| `target_path` | No | Explicit target directory (relative to AIOS root). If omitted, inferred from type + name. |
| `description` | No | Human-readable description |
| `aios_compatible` | No | Minimum AIOS Updater version required (e.g., `>=1.1.0`). Update aborts if not satisfied. |
| `files` | No | Explicit file list (for selective updates). Only these files will be applied. If omitted, all package files are candidates. |
| `remove` | No | Files to remove from target. Requires user confirmation. |
| `wrappers` | No | Agent wrappers config. `source_path`: subfolder in package containing wrapper files (default: `wrappers`). `files`: list of wrapper filenames. Destination is always `.claude/commands/AIOS/agents/`. |
| `post_checks` | No | Commands to run after update (listed for user, never auto-executed) |
| `changelog` | No | What changed in this version |
| `author` | No | Package author |
| `date` | No | Package date (ISO 8601) |

## Version Detection Priority

When no manifest.json exists, version is detected from:

1. `config.yaml` or `squad.yaml` - Look for `version:` field
2. `package.json` - Look for `version` field
3. `version.txt` - Plain text version string
4. `SKILL.md` front-matter - YAML metadata
5. Directory name pattern (e.g., `squad-creator v4`)
6. Fallback: `0.0.0-unknown`

## Type Detection Priority

When `type` is not specified in manifest:

1. Manifest `type` field (explicit)
2. Manifest `pack.id` field present = expansion-pack
3. `squad.yaml` or `config.yaml` with `agents:` = squad
4. `SKILL.md` present = skill
5. `.aios-core/` subdirectories = core
6. Only `.md` agent files = agents
7. `orchestrator/` directory = orchestrator
