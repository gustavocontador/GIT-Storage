# Script: Scan Imports

# Usado por: build-dependency-graph task

# Execucao: Chief ou qualquer agente com acesso ao codebase

#

# Este script define o procedimento automatizado para escanear imports do codebase.

# Pode ser executado como uma serie de comandos Grep/Read.

## Procedimento

### 1. Listar todos os modulos

```bash
# Screens
find src/screens -name "*.tsx" -o -name "*.ts" | sort

# Hooks
find src/hooks -name "*.tsx" -o -name "*.ts" | sort

# Services
find src/services -name "*.ts" | sort

# Contexts
find src/contexts -name "*.tsx" | sort

# Components (top-level only, not sub-components)
find src/components -maxdepth 1 -name "*.tsx" | sort

# Core files
echo "src/App.tsx src/AppContext.tsx src/constants.ts src/types.ts"
```

### 2. Para cada arquivo, extrair imports

```bash
# Extrair imports locais (nao node_modules)
grep -E "^import .+ from ['\"]\.\.?/" $FILE | sed "s/.*from ['\"]//;s/['\"].*//"

# Extrair imports absolutos do projeto
grep -E "^import .+ from ['\"]src/" $FILE | sed "s/.*from ['\"]//;s/['\"].*//"
```

### 3. Resolver paths relativos

```
Para cada import relativo (../../hooks/useAuth):
  1. Resolver baseado no diretorio do arquivo importador
  2. Normalizar para path absoluto (src/hooks/auth/useAuth)
  3. Registrar: { from: arquivo, to: dependencia }
```

### 4. Construir grafo reverso (imported_by)

```
Para cada dependencia registrada:
  Se A importa B → B.imported_by.push(A)
```

### 5. Identificar critical modules

```
Para cada modulo:
  Se imported_by.length >= 3 → critical: true
```

### 6. Detectar ciclos

```
Para cada modulo A:
  DFS a partir de A
  Se encontrar A novamente → circular: true
  Registrar ciclo: [A, B, C, A]
```

## Output

Gera YAML no formato de dependency-graph.yaml com metadados de versao.
