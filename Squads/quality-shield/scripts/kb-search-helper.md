# Script: KB Search Helper

# Usado por: kb-search task

# Execucao: Chief ao receber bug report

#

# Procedimento automatizado para buscar na knowledge base com ranking.

## Procedimento

### 1. Carregar dados

```
Ler: squads/quality-shield/data/knowledge-base.yaml
Ler: squads/quality-shield/data/regression-patterns.md
```

### 2. Tokenizar query

```
query_tokens = query.toLowerCase().split(/\s+/)
Remover stopwords: ["de", "do", "da", "em", "no", "na", "o", "a", "e", "que", "com"]
```

### 3. Calcular score por entrada

Para cada bug na KB:

```
score = 0

# Symptom match (peso 10 exato, 5 parcial)
if query aparece como substring em bug.symptom:
  score += 10  # match exato
elif qualquer token aparece em bug.symptom:
  score += 5   # match parcial

# Files match (peso 8)
for each file in bug.files:
  if qualquer token aparece em file.path:
    score += 8
    break

# Pattern match (peso 8)
if bug.pattern e qualquer token aparece no pattern:
  score += 8

# Root cause match (peso 6)
if qualquer token aparece em bug.root_cause:
  score += 6

# Flows match (peso 4)
for each flow in bug.flows_affected:
  if qualquer token aparece no flow:
    score += 4
    break

# What caused it match (peso 3)
if qualquer token aparece em bug.what_caused_it:
  score += 3

# Environment match (peso 2)
if query contem "producao" ou "prod" e bug.environment.prod_difference != "":
  score += 2
if query contem "localhost" e bug.environment.worked_in_localhost == true:
  score += 2

# Bonus: multi-field match
fields_matched = count of fields that matched
if fields_matched >= 3:
  score += 3  # correlacao forte
```

### 4. Buscar patterns

```
Para cada pattern em regression-patterns.md:
  Verificar se tokens do query aparecem em:
  - nome do pattern
  - descricao
  - sintomas tipicos
  - arquivos tipicos
  Se match: incluir na resposta com campo que deu match
```

### 5. Rankear e filtrar

```
Ordenar bugs por score decrescente
Filtrar: score < 3 → descartar

Classificar:
  score >= 15: ALTA
  score >= 8:  MEDIA
  score >= 3:  BAIXA

Retornar top 5 (ou knowledge_base.max_search_results do squad-config.yaml)
```

### 6. Fallback para KB pequena

```
if total_bugs < 5:
  Reduzir threshold para score >= 1
  Incluir TODOS os patterns como referencia
  Informar: "KB em fase inicial ({N} entries). Patterns listados como referencia."
```

## Output

Tabela com: ID, Sintoma, Causa Raiz, Score, Relevancia, Campos que deram match.
