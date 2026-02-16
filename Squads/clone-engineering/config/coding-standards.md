# Coding Standards — Clone Engineering Squad

## Language
- **Discussion/Instructions:** pt-BR
- **Code/Variables:** English
- **Technical:** Mixed (context-dependent)

## File Formats
- **Config/Data:** YAML
- **Documentation:** Markdown
- **Structured Data:** JSON (programmatic access)

## Naming
- **Files:** kebab-case (e.g., `layer-6-values-hierarchy.yaml`)
- **Slugs:** snake_case (e.g., `ia_expertise`)
- **Chunk IDs:** domain-prefix + number (e.g., `pc-001-valores-fundamentais`)

## YAML Standards
- 2-space indentation
- Quoted strings for values containing special characters
- Comments for non-obvious fields
- Metadata block at top of every YAML artifact

## Markdown Standards
- ATX-style headers (`#`)
- Fenced code blocks with language tags
- Tables for structured comparisons
- Line breaks between sections

## Quality Rules
- Every artifact must have metadata (version, date, confidence, source)
- Cross-references use chunk IDs, not file paths
- Confidence levels: Alta (90%+), Media (70-89%), Baixa (<70%)
- Triangulation evidence documented inline for layers 5-8
