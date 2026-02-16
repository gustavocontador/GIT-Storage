# Coding Standards - squAId criaTTivados

## Padrões de Arquivos

### Nomenclatura
- **Arquivos:** kebab-case (ex: `brand-strategy-document.md`)
- **Diretórios:** kebab-case (ex: `search-insights/`)
- **IDs de agentes:** kebab-case (ex: `creative-director`)

### Formato YAML
- Indentação: 2 espaços
- Strings com caracteres especiais: usar aspas duplas
- Multiline strings: usar `|` (literal block)
- Comentários: iniciar com `#` e espaço

### Estrutura de Agents
Cada agente deve conter:
- `id`: identificador único (kebab-case)
- `name`: nome legível
- `type`: director | executor | specialist
- `squad`: sub-squad de pertencimento
- `role`: descrição da função
- `version`: versão do agente
- `confidence`: score de confiança (0.0 - 1.0)

### Estrutura de Tasks
Cada task deve conter:
- `metadata`: nome, versão, squad, responsável
- `descricao`: o que a task faz
- `entrada`: inputs necessários
- `saida`: outputs produzidos
- `passos`: sequência de execução
- `checklist`: validações
- `criterios_aceitacao`: critérios de aceitação

### Estrutura de Data
Cada data file deve conter:
- `metadata`: nome, versão, origem
- Conteúdo estruturado em YAML
- Referências acadêmicas quando aplicável

## Idioma
- **IDs e nomes de arquivo:** inglês (kebab-case)
- **Descrições e conteúdo:** português
- **Termos técnicos:** inglês quando universais

## Versionamento
- Formato: "X.Y" (major.minor)
- Minor: ajustes e correções
- Major: reestruturação
