# Notion Integration — Skill Donna

> Donna gerencia tarefas, follow-ups e deals diretamente no Notion, em vez de depender apenas de memory/*.md.

---

## Databases Configurados

| Database | ID | Propriedades |
|----------|----|-------------|
| **Tarefas** | `3247ae17-ffa7-8101-855c-ce7093dddd96` | Tarefa, Status, Prazo, Responsável, Categoria, Notas |
| **Follow-ups** | `3247ae17-ffa7-81bd-b204-f8923c398cb8` | Quem, Assunto, Status, Prazo, Tom, Última cobrança, Canal, Notas |
| **Deals** | `3247ae17-ffa7-8149-9612-e397c4bf4f08` | Deal, Contato, Valor, Status, Prazo, Próxima ação, Notas |
| **Notas** | `3247ae17-ffa7-814c-91b8-e09eab53b5b1` | (notas gerais) |
| **Biblioteca** | `3247ae17-ffa7-8143-abc3-c65e49a79e3d` | (referências) |
| **Root** | `3247ae17-ffa7-8099-afdb-c64359145b9e` | (página raiz) |

## API Key

```bash
# Salva em ~/.config/notion/api_key
NOTION_KEY=$(cat ~/.config/notion/api_key)
```

## Operações Frequentes

### Criar Tarefa

```bash
NOTION_KEY=$(cat ~/.config/notion/api_key)
curl -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"database_id": "3247ae17-ffa7-8101-855c-ce7093dddd96"},
    "properties": {
      "Tarefa": {"title": [{"text": {"content": "NOME DA TAREFA"}}]},
      "Status": {"status": {"name": "To Do"}},
      "Prazo": {"date": {"start": "2026-03-20"}},
      "Responsável": {"rich_text": [{"text": {"content": "Gustavo"}}]},
      "Categoria": {"select": {"name": "Operacional"}}
    }
  }'
```

### Criar Follow-up

```bash
curl -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"database_id": "3247ae17-ffa7-81bd-b204-f8923c398cb8"},
    "properties": {
      "Quem": {"title": [{"text": {"content": "NOME DA PESSOA"}}]},
      "Assunto": {"rich_text": [{"text": {"content": "DESCRIÇÃO"}}]},
      "Status": {"status": {"name": "Pendente"}},
      "Prazo": {"date": {"start": "2026-03-20"}},
      "Tom": {"select": {"name": "cordial"}}
    }
  }'
```

### Listar Tarefas Abertas

```bash
curl -X POST "https://api.notion.com/v1/databases/3247ae17-ffa7-8101-855c-ce7093dddd96/query" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"filter": {"property": "Status", "status": {"does_not_equal": "Done"}}}'
```

### Listar Follow-ups Vencidos

```bash
curl -X POST "https://api.notion.com/v1/databases/3247ae17-ffa7-81bd-b204-f8923c398cb8/query" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"filter": {"and": [
    {"property": "Status", "status": {"does_not_equal": "Concluído"}},
    {"property": "Prazo", "date": {"on_or_before": "'$(date -u +%Y-%m-%d)'"}}
  ]}}'
```

## Quando Donna Usa Notion

| Trigger | Ação |
|---------|------|
| "Cria tarefa: [X]" | → Cria no Notion Tarefas |
| "Cobra [pessoa] sobre [X]" | → Cria no Notion Follow-ups |
| "Qual o status do deal [X]?" | → Consulta Notion Deals |
| "Lista minhas tarefas" | → Query Notion Tarefas abertas |
| "Follow-ups vencidos?" | → Query Notion Follow-ups com prazo < hoje |
| Áudio com tarefa detectada | → Auto-cria no Notion |
| Briefing diário | → Puxa dados do Notion |

## Regras de Uso

1. **Dupla escrita**: Donna mantém tanto memory/*.md (para contexto local) quanto Notion (para gestão visual)
2. **Notion é a fonte de verdade** para tarefas e follow-ups
3. **memory/*.md é a fonte de verdade** para contexto, conversas e histórico diário
4. **N8N sincroniza** Notion → Supabase a cada 30 min

---

*Donna Notion Integration Skill v0.1.0*
