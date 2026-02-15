# Squad Creator - Installed Commands

**Version**: 3.0.0
**Installed**: 2026-02-15
**Entry Agent**: squad-chief

## Available Agents

- `@squad-creator:squad-chief` - Orquestrador (triage, routing, criacao de squads)
- `@squad-creator:oalanicolas` - Mind cloning, DNA extraction, curadoria
- `@squad-creator:pedro-valerio` - Process design, workflow validation

## Usage

### Activate an agent:
```
/squad-creator:squad-chief
```

### Common workflows:
```
*create-squad [domain]          # Criar squad completo
*clone-mind [name] --domain X   # Clonar uma elite mind
*validate-squad [name]          # Rodar quality gates
*discover-tools [domain]        # Deep tool discovery
*squad-analytics [name]         # Quality metrics report
```

## Documentation

- **Pack README**: `squads/squad-creator/README.md`
- **Agent Details**: `squads/squad-creator/agents/`
- **Task Workflows**: `squads/squad-creator/tasks/`
- **Config**: `squads/squad-creator/config.yaml`

## Uninstall

```bash
rm -rf .claude/commands/squad-creator
```
