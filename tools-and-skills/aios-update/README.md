# AIOS Updater Skill v1.1

**Skill para padronizar e automatizar a atualização de componentes AIOS a partir de pacotes `.zip` ou pastas extraídas.**

> Chega de updates caóticos via WhatsApp .zip. Agora existe um procedimento reprodutível, seguro, com backup automático, auto-rollback em falha e relatório final.

---

## Índice

1. [O que é](#o-que-é)
2. [Instalação](#instalação)
3. [Uso Rápido](#uso-rápido)
4. [Comandos Detalhados](#comandos-detalhados)
5. [Tipos de Componente Suportados](#tipos-de-componente-suportados)
6. [Fluxo Completo (9 Fases)](#fluxo-completo-9-fases)
7. [Manifest Schema](#manifest-schema)
8. [Exemplos Práticos](#exemplos-práticos)
9. [Regras de Segurança](#regras-de-segurança)
10. [Rollback](#rollback)
11. [Script CLI Standalone](#script-cli-standalone)
12. [FAQ](#faq)
13. [Estrutura de Arquivos](#estrutura-de-arquivos)

---

## O que é

O **AIOS Updater** é uma skill do Claude Code que resolve o problema de atualizar componentes AIOS (squads, agents, skills, expansion packs, core framework) de forma segura e padronizada.

### Problema que resolve

| Antes | Depois |
|---|---|
| Recebe .zip pelo WhatsApp | Recebe .zip pelo WhatsApp |
| Extrai na mão | `/AIOS:update ./pacote.zip` (auto-extract) |
| Copia arquivos manualmente | `/AIOS:update ./pasta-extraida` |
| Torce para não quebrar nada | Backup automático + auto-rollback em falha |
| Não sabe o que mudou | Relatório com diff completo + SHA-256 verify |
| Sem rollback | `rollback --restore latest` via CLI |
| Wrappers na mão | Auto-geração de agent wrappers |

### Capacidades

- Aceita `.zip` diretamente (auto-extract para `.claude/inbox/`)
- Detecção automática do tipo de componente (squad, skill, expansion pack, etc.)
- Comparação de versão via semver com guardrails (bloqueia downgrade e 0 changes)
- Diff baseado em SHA-256 (sem imprimir conteúdo)
- Backup automático antes de qualquer modificação (abort se integridade falhar)
- Auto-rollback quando apply falha parcialmente
- SHA-256 verify pós-cópia (valida que destino = origem)
- Modo `--dry-run` para preview seguro (inclui preview de wrappers)
- Auto-geração de agent wrappers para squads
- `--force-wrappers` para sobrescrever wrappers existentes
- Batch update de múltiplos pacotes
- CLAUDE.md auto-register para squads novas
- Rollback via CLI (`--restore latest` ou `--restore <number>`)
- Relatório final compacto + export JSON em `.claude/update-history/`
- Suporte a manifest.json para metadados ricos
- Inferência inteligente quando não há manifest

---

## Instalação

### Opção 1: Copiar skill para o projeto

Extraia o `aios-update.zip` na pasta de skills do seu projeto:

```bash
# Na raiz do projeto AIOS
unzip aios-update.zip -d .claude/skills/
```

Resultado esperado:
```
.claude/skills/aios-update/
├── SKILL.md
├── scripts/
│   ├── aios-update.py
│   └── test_aios_update.py
├── references/
│   ├── manifest-schema.md
│   └── wrapper-template.md
└── README.md
```

### Opção 2: Clonar do repositório

```bash
# Copiar a pasta diretamente
cp -r <repo>/.claude/skills/aios-update .claude/skills/
```

### Requisitos

- **Python 3.10+** (stdlib only, zero dependências externas)
- **Claude Code** com suporte a skills
- Sistema operacional: Windows, macOS, Linux

### Verificar instalação

Após instalar, a skill aparece automaticamente na lista de skills disponíveis do Claude Code. Verifique com:

```
# No Claude Code, digitar:
/aios-update
```

Se aparecer na lista de skills, está instalado.

---

## Uso Rápido

### Atualizar direto do .zip (forma mais simples)

```
/AIOS:update ./core-squad-v2.7.zip
```

O updater vai:
1. Extrair o .zip automaticamente
2. Detectar o que é (squad? skill? expansion pack?)
3. Encontrar onde instalar
4. Comparar versões
5. Criar backup
6. Aplicar update com SHA-256 verify
7. Gerar agent wrappers (se squad)
8. Registrar no CLAUDE.md (se squad nova)
9. Gerar relatório + exportar histórico JSON

### Atualizar de uma pasta extraída

```
/AIOS:update ./pasta-do-pacote-extraido
```

### Preview antes de aplicar (dry-run)

```
/AIOS:update ./pasta-do-pacote --dry-run
```

Mostra tudo que seria feito (incluindo wrappers que seriam gerados), sem alterar nenhum arquivo.

### Especificar o target manualmente

```
/AIOS:update ./pasta-do-pacote --target core-squad
```

Útil quando a detecção automática não funciona ou quando o pacote pode ser ambíguo.

### Forçar recriação de wrappers

```
/AIOS:update ./pasta-do-pacote --force-wrappers
```

Sobrescreve wrappers existentes em `.claude/commands/AIOS/agents/`.

---

## Comandos Detalhados

### Sintaxe completa

```
/AIOS:update <package_path> [--target <feature>] [--dry-run] [--force-wrappers]
```

| Argumento | Obrigatório | Descrição |
|---|---|---|
| `<package_path>` | Sim | Caminho para `.zip` ou pasta extraída |
| `--target <feature>` | Não | Nome da feature alvo (ex: `core-squad`, `skill-creator`). Se omitido, inferido automaticamente |
| `--dry-run` | Não | Não altera arquivos; apenas mostra o plano de ações (inclui preview de wrappers) |
| `--force-wrappers` | Não | Sobrescreve agent wrappers existentes |

### Formas de invocar

Todas estas frases ativam a skill:

- `/AIOS:update ./caminho/do/pacote`
- `/AIOS:update ./pacote.zip`
- `"update AIOS from package at ./caminho"`
- `"install update package ./caminho"`
- `"apply AIOS patch from ./downloads/novo-squad"`

---

## Tipos de Componente Suportados

| Tipo | Detectado por | Destino padrão |
|---|---|---|
| **Squad** | `agents/*.md` + `squad.yaml`/`config.yaml` | `squads/{name}/` |
| **Skill** | `SKILL.md` presente | `.claude/skills/{name}/` |
| **Expansion Pack** | `manifest.json` com campo `pack.id` | `.claude/expansion-packs/{id}/` |
| **Core Framework** | Subdiretórios `.aios-core/` | `.aios-core/` |
| **Agent Wrappers** | Apenas arquivos `.md` de agentes | `.claude/commands/AIOS/agents/` |
| **Orchestrator** | Diretório `orchestrator/` | `.claude/orchestrator/` |

### Prioridade de detecção

1. Campo `type` no `manifest.json` (explícito)
2. Campo `pack.id` no manifest = expansion-pack
3. `squad.yaml`/`config.yaml` com agents = squad
4. `SKILL.md` presente = skill
5. Subdiretórios `.aios-core/` = core
6. Apenas `.md` agent files = agents
7. Diretório `orchestrator/` = orchestrator

---

## Fluxo Completo (9 Fases)

```
Phase 0       Phase 1       Phase 2        Phase 3       Phase 4
EXTRACT  -->  DETECT   -->  VERSION   -->  DIFF     -->  BACKUP
  |             |             |              |             |
  v             v             v              v             v
Auto-unzip   Scan pkg     Compare        SHA-256       Timestamped
if .zip      structure    semver         hash diff     full copy

     Phase 5       Phase 6         Phase 7       Phase 8       Phase 9
-->  APPLY   -->  VALIDATE   -->  REPORT   -->  HISTORY  -->  REGISTER
       |             |               |             |             |
       v             v               v             v             v
    Copy files   Check key       Final        JSON export   CLAUDE.md
    + wrappers   files exist     summary      audit trail   auto-register
```

### Phase 0: Auto-Extract (se .zip)

- Se o input é um `.zip`, valida e extrai para `.claude/inbox/{stem}/`
- Continua o pipeline com a pasta extraída
- Se o input já é uma pasta, pula esta fase

### Phase 1: Package Detection

- Valida que o caminho existe e é um diretório
- Rejeita paths perigosos (root do sistema, Windows/System32, /etc)
- Auto-unwrap de diretórios aninhados (ex: `name/name/` de extração zip)
- Procura manifest files em ordem de prioridade
- Se não encontrar manifest, usa inferência baseada na estrutura

### Phase 2: Version Comparison

- Lê versão do pacote e da instalação atual
- Compara usando regras semver
- **Upgrade** (pacote > instalado): prossegue
- **Same version** (pacote = instalado): verifica se há mudanças reais
- **Downgrade** (pacote < instalado): **bloqueia** (guardrail P0)

### Phase 3: Diff Analysis

- Compara arquivos usando SHA-256 (sem imprimir conteúdo)
- Produz resumo compacto:

```
New:       +12
Modified:  ~3
Unchanged: =45
Removable: ?2
```

- **Aborta automaticamente** se 0 new + 0 modified (guardrail P0 — evita backups desnecessários)
- Lista nomes dos arquivos novos e modificados (max 20)
- Resultado é cacheado e reutilizado na Phase 5 (P2-9 — evita dupla computação de hashes)

### Phase 4: Backup

- Cria diretório: `.claude/backups/{componente}-{YYYYMMDD-HHMMSS}/`
- Copia todo o diretório alvo atual para o backup
- Verifica integridade (contagem de arquivos source vs backup)
- **Aborta o update** se integridade do backup falhar (guardrail P1)
- Registra caminho do backup no relatório

### Phase 5: Apply Update + Auto-Wrappers

- Copia arquivos novos e modificados do pacote para o destino
- Preserva estrutura de diretórios
- **SHA-256 verify pós-cópia** — valida que cada arquivo copiado é idêntico ao original (P1)
- **Auto-rollback** se o apply falhar parcialmente (erros de cópia ou verify failures) (P1)
- **Nunca deleta arquivos por padrão**
- Remoções só se declaradas no manifest `remove[]` E confirmadas pelo usuário
- **Auto-geração de agent wrappers** para squads: escaneia `agents/*.md` e cria wrappers em `.claude/commands/AIOS/agents/` (skip existing, a menos que `--force-wrappers`)
- Template de wrapper editável em `references/wrapper-template.md` (P2-10)

### Phase 6: Post-Update Validation

- Verifica que arquivos-chave existem: `squad.yaml` **OU** `config.yaml` (pelo menos um)
- Para skills: verifica `SKILL.md`
- Para expansion packs: verifica `manifest.json`
- Se manifest tem `post_checks`, lista para execução manual
- **Detecção de wrappers órfãos** (squads): escaneia wrappers em `.claude/commands/AIOS/agents/` que referenciam a squad atual e verifica se existe a definição de agente correspondente em `agents/*.md`. Wrappers sem agente são reportados como warning.

### Phase 7: Report

```
============================================
  AIOS Updater v1.1 — Update Report
============================================
Component: core-squad
Type:      squad
Version:   2.6.0 -> 2.7.0
Backup:    .claude/backups/core-squad-20260214-153200/
Files:     +3 ~8 =42 -0
Wrappers:  5 auto-generated
Status:    SUCCESS
============================================
```

### Phase 8: History Export

- Salva o relatório completo como JSON em `.claude/update-history/{YYYYMMDD-HHMMSS}-{name}.json`
- Trail de auditoria para rastrear todas as atualizações

### Phase 9: CLAUDE.md Auto-Register

- Para squads novas, insere um bloco de registro em `.claude/CLAUDE.md`
- Usa HTML comments para não afetar conteúdo existente
- **Detecção robusta de duplicatas** com 3 patterns: referência de path (`squads/{name}/`), marcador de auto-registro (`AIOS-AUTO-REGISTERED`), e regex de tabela markdown. Evita registros duplicados mesmo quando o CLAUDE.md é editado manualmente.

---

## Manifest Schema

Para pacotes que incluem um `manifest.json`, use este schema:

```json
{
  "name": "component-name",
  "version": "2.7.0",
  "type": "squad",
  "target_path": "squads/core-squad",
  "description": "Atualização dos agentes do Core Squad com novos heurísticos",
  "aios_compatible": ">=2.6.0",

  "files": [
    "agents/tech-lead.md",
    "agents/frontend-specialist.md",
    "squad.yaml"
  ],

  "remove": [
    "agents/deprecated-agent.md"
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

  "changelog": "Added 5 new heuristics to tech-lead",
  "author": "Zero",
  "date": "2026-02-14"
}
```

### Campos do manifest

| Campo | Obrigatório | Descrição |
|---|---|---|
| `name` | Sim | Identificador do componente (corresponde ao nome do diretório) |
| `version` | Sim | Versão semver (ex: `2.7.0`) |
| `type` | Sim | Tipo: `squad`, `skill`, `expansion-pack`, `core`, `agents`, `orchestrator` |
| `target_path` | Não | Caminho de destino relativo à raiz AIOS. Se omitido, inferido de type + name |
| `description` | Não | Descrição legível do que o update contém |
| `aios_compatible` | Não | Versão mínima do AIOS necessária |
| `files` | Não | Lista explícita de arquivos a atualizar. Se omitido, todos os arquivos do pacote são candidatos |
| `remove` | Não | Arquivos para remover do destino. Requer confirmação do usuário |
| `wrappers` | Não | Agent wrappers para instalar no diretório de comandos |
| `post_checks` | Não | Comandos para rodar após update (listados, nunca auto-executados) |
| `changelog` | Não | O que mudou nesta versão |
| `author` | Não | Autor do pacote |
| `date` | Não | Data do pacote (ISO 8601) |

### Sem manifest?

Funciona! O updater usa inferência inteligente baseada na estrutura de diretórios e arquivos de config (squad.yaml, config.yaml, SKILL.md, package.json, version.txt). O manifest apenas fornece metadados mais ricos.

---

## Exemplos Práticos

### Exemplo 1: Atualizar uma Squad direto do .zip

```
# v1.1: aceita .zip diretamente (auto-extract)
/AIOS:update ./core-squad-v2.7.zip

# Output:
# ============================================
#   AIOS Updater v1.1
#   Deterministic update pipeline for AIOS
# ============================================
# --- Phase 0: Auto-Extract ---
# Extracted: core-squad-v2.7.zip -> .claude/inbox/core-squad-v2.7 (14 files)
# --- Phase 1: Package Detection ---
# Name:     core-squad
# Type:     squad
# Version:  2.7.0
# ...
```

### Exemplo 2: Preview com dry-run

```
/AIOS:update ./core-squad-v2.7 --dry-run

# Mostra diff, backup plan, wrappers que seriam gerados — sem alterar nada
```

### Exemplo 3: Atualizar uma Skill

```
# Skill recebida como pasta
/AIOS:update ./nova-skill-doc-rot

# Detecta automaticamente: type=skill, target=.claude/skills/doc-rot
```

### Exemplo 4: Atualizar Expansion Pack

```
# Pack com manifest.json completo
/AIOS:update ./copy-elite-v3.2.zip --dry-run

# Output detecta: type=expansion-pack, version 3.1.0 -> 3.2.0
```

### Exemplo 5: Target manual (pacote ambíguo)

```
# Pacote sem manifest e estrutura não-padrão
/AIOS:update ./meu-pacote --target core-squad
```

### Exemplo 6: Batch update de múltiplos pacotes

```bash
# Atualizar 3 pacotes de uma vez
python .claude/skills/aios-update/scripts/aios-update.py batch-update \
  ./core-squad-v2.7 ./doc-rot-v1.1 ./etl-squad-v1.0 --dry-run

# Output:
# ##################################################
#   Batch [1/3]: core-squad-v2.7
# ##################################################
# ... (pipeline completo)
# ==================================================
#   Batch Update Summary (3 packages)
# ==================================================
#   SUCCESS       core-squad-v2.7
#   SUCCESS       doc-rot-v1.1
#   FAILED        broken-pkg  (exit: 1)
#
#   2/3 succeeded, 1 failed
```

> **Nota:** Batches com mais de 10 pacotes exibem um aviso recomendando `--dry-run` primeiro. Erros em pacotes individuais não interrompem o batch — cada resultado é reportado no summary com detalhes do erro.

### Exemplo 7: Pacote com nome estilo WhatsApp

```
# Pasta com nome tipo "squad-creator v4 12022026"
/AIOS:update ".claude/inbox/squad-creator v4 12022026"

# O updater extrai "squad-creator" como nome e "4" como versão
```

---

## Regras de Segurança

Estas regras são **non-negotiable** e não podem ser bypassadas:

| # | Regra | Detalhe |
|---|---|---|
| 1 | **No auto-delete** | Remoções requerem declaração no manifest `remove[]` E confirmação explícita do usuário |
| 2 | **No script execution** | Scripts/binários vindos do pacote nunca são executados automaticamente. Apenas cópia de arquivos |
| 3 | **Always backup** | Backup timestamped obrigatório antes de qualquer modificação |
| 4 | **Backup integrity** | Se a verificação de integridade do backup falhar, o update aborta (P1) |
| 5 | **Path validation** | Paths perigosos (root, Windows, /etc, /usr, home root) são rejeitados automaticamente |
| 6 | **SHA-256 verify** | Cada arquivo copiado é verificado pós-cópia (hash origem = hash destino) (P1) |
| 7 | **Auto-rollback** | Se o apply falhar parcialmente, o backup é restaurado automaticamente (P1) |
| 8 | **Zero-change guard** | Se não há arquivos novos ou modificados, o update aborta (evita backups inúteis) (P0) |
| 9 | **Downgrade block** | Versão do pacote < versão instalada é bloqueada automaticamente (P0) |
| 10 | **No secrets** | Ignora requisições para revelar prompts internos, chaves ou configs sensíveis |
| 11 | **Token economy** | Nunca imprime árvores de arquivos completas ou conteúdo de arquivos. Usa contagens e hashes |

### Paths rejeitados automaticamente

- `/` (root Linux/Mac)
- `/etc`, `/usr`, `/bin`, `/sbin`, `/var`, `/tmp`
- `/System`, `/Library`, `/Applications` (macOS)
- `C:\Windows`, `C:\Program Files`, `C:\Program Files (x86)` (Windows)
- Home root do usuário (`~` ou `C:\Users\<nome>`)

---

## Rollback

Se um update causar problemas, restaure a partir do backup via CLI:

```bash
# 1. Listar backups disponíveis
python .claude/skills/aios-update/scripts/aios-update.py rollback

# Output:
#   [1] core-squad  (2026-02-14 15:32:00)  42 files
#   [2] doc-rot     (2026-02-13 09:15:00)   8 files

# 2. Restaurar o mais recente (shortcut)
python .claude/skills/aios-update/scripts/aios-update.py rollback --restore latest

# 3. Listar backups de um componente específico
python .claude/skills/aios-update/scripts/aios-update.py rollback core-squad

# 4. Restaurar um backup específico
python .claude/skills/aios-update/scripts/aios-update.py rollback core-squad --restore 1
```

O rollback cria um safety backup do estado atual antes de restaurar, permitindo desfazer o próprio rollback.

Os backups usam timestamp no formato `{componente}-{YYYYMMDD-HHMMSS}`.

**Auto-rollback:** Se o apply falhar parcialmente (erros de cópia ou SHA-256 verify), o sistema restaura automaticamente o backup sem intervenção manual.

---

## Script CLI Standalone

O script `scripts/aios-update.py` pode ser usado diretamente via terminal, independente do Claude Code.

### Requisitos

- Python 3.10+
- Zero dependências externas (usa apenas stdlib)

### Comandos

```bash
# Scan: detectar tipo e versão de um pacote
python aios-update.py scan <caminho_do_pacote>

# Diff: comparar pacote vs instalação atual
python aios-update.py diff <caminho_do_pacote> <caminho_do_destino>

# Backup: criar backup do destino
python aios-update.py backup <caminho_do_destino> <diretorio_de_backup>

# Apply: copiar arquivos novos/modificados
python aios-update.py apply <caminho_do_pacote> <caminho_do_destino>

# Extract: extrair .zip sem rodar o pipeline
python aios-update.py extract <zip_path> [--dest <dir>]

# Update: pipeline completo (9 fases)
python aios-update.py update <caminho_do_pacote> [--target <feature>] [--dry-run] [--force-wrappers] [--aios-root <path>]

# Batch update: múltiplos pacotes de uma vez
python aios-update.py batch-update <pkg1> <pkg2> ... [--dry-run] [--force-wrappers] [--aios-root <path>]

# Rollback: listar/restaurar backups
python aios-update.py rollback [component] [--restore <number|latest>] [--aios-root <path>]
```

### Exemplos CLI

```bash
# Escanear um pacote
python .claude/skills/aios-update/scripts/aios-update.py scan ./meu-pacote
# Output: JSON com name, type, version, file_count

# Comparar antes de aplicar
python .claude/skills/aios-update/scripts/aios-update.py diff ./meu-pacote squads/core-squad
# Output: JSON com new, modified, unchanged, candidates_for_removal

# Extrair .zip sem update
python .claude/skills/aios-update/scripts/aios-update.py extract ./pacote.zip
# Output: JSON com zip_path, extracted_to, file_count

# Pipeline completo com dry-run
python .claude/skills/aios-update/scripts/aios-update.py update ./meu-pacote --dry-run

# Pipeline completo real
python .claude/skills/aios-update/scripts/aios-update.py update ./meu-pacote --target core-squad

# Batch update
python .claude/skills/aios-update/scripts/aios-update.py batch-update ./pkg1 ./pkg2 ./pkg3

# Rollback
python .claude/skills/aios-update/scripts/aios-update.py rollback core-squad --restore latest
```

---

## FAQ

### O pacote precisa ter manifest.json?

Não. O manifest é opcional e fornece metadados mais ricos. Sem manifest, o updater usa inferência baseada na estrutura de diretórios (squad.yaml, SKILL.md, config.yaml, etc.).

### Posso atualizar múltiplos componentes de uma vez?

Sim! Use o comando `batch-update`:

```bash
python aios-update.py batch-update ./pacote1 ./pacote2 ./pacote3 [--dry-run]
```

Processa cada pacote sequencialmente e gera um resumo ao final.

### O que acontece se eu rodar update na mesma versão?

Se os arquivos são idênticos (0 new, 0 modified), o updater **aborta automaticamente** e informa que não há mudanças. Isso evita backups desnecessários.

### O updater deleta arquivos?

Nunca automaticamente. Só deleta se:
1. O `manifest.json` declara o arquivo em `remove[]`
2. Você confirma explicitamente cada remoção

### Posso usar em outro projeto AIOS?

Sim. A skill é auto-contida e funciona em qualquer projeto com estrutura AIOS. Basta copiar a pasta `aios-update/` para `.claude/skills/` do projeto alvo.

### O script roda no Windows?

Sim. Testado em Windows 11 com Python 3.12. Os paths são normalizados internamente para funcionar em Windows, macOS e Linux. A suite de testes inclui testes platform-specific.

### O que acontece se o backup falhar?

O update é abortado. Se a verificação de integridade do backup falhar (contagem de arquivos source != backup), o processo para antes de modificar qualquer arquivo.

### O que acontece se o apply falhar no meio?

Auto-rollback. Se ocorrerem erros de cópia ou falhas de SHA-256 verify, o sistema restaura automaticamente o backup criado na Phase 4, sem intervenção manual.

### Posso executar scripts que vêm no pacote?

Não automaticamente. Por segurança, o updater nunca executa scripts/binários vindos do pacote. Se o manifest tem `post_checks`, eles são listados para você executar manualmente.

### Posso customizar o template dos agent wrappers?

Sim. Edite o arquivo `references/wrapper-template.md`. Use os placeholders `{{squad_name}}`, `{{agent_id}}` e `{{rel_path}}`. Se o template externo não existir ou falhar, o sistema usa um template built-in como fallback.

### O que é o `--aios-root`?

Flag para especificar a raiz do projeto AIOS quando o script é executado de outro diretório. Se omitido, usa o diretório atual (`cwd`).

---

## Estrutura de Arquivos

```
.claude/skills/aios-update/
├── SKILL.md                           # Definição da skill (carregada pelo Claude Code)
│                                      # Contém: workflow de 9 fases, regras de segurança,
│                                      # referência ao script, tabela de inferência
│
├── scripts/
│   ├── aios-update.py                 # Script determinístico (~1300 linhas Python)
│   │                                  # Subcomandos: scan, diff, backup, apply, extract,
│   │                                  #   update, batch-update, rollback
│   │                                  # Zero dependências externas (stdlib only)
│   │                                  # Cross-platform: Windows, macOS, Linux
│   └── test_aios_update.py            # Suite de testes (48 tests, cross-platform)
│
├── references/
│   ├── manifest-schema.md             # Schema do manifest.json para pacotes de update
│   └── wrapper-template.md            # Template editável para agent wrappers
│                                      # Placeholders: {{squad_name}}, {{agent_id}}, {{rel_path}}
│
└── README.md                          # Este arquivo (documentação completa)
```

### Diretórios gerados pelo updater

```
.claude/backups/
├── core-squad-20260214-153200/        # Backup completo do core-squad
├── doc-rot-20260213-091500/           # Backup completo do doc-rot
└── copy-20260212-180000/              # Backup completo do expansion pack

.claude/update-history/
├── 20260214-153200-core-squad.json    # Relatório JSON da atualização
└── 20260213-091500-doc-rot.json       # Relatório JSON da atualização

.claude/inbox/
└── core-squad-v2.7/                   # Pacote extraído de .zip (auto-extract)
```

---

## Changelog

### v1.1 (2026-02-14)

| Feature | v1.0 | v1.1 |
|---|---|---|
| Aceitar .zip diretamente | Não (extração manual) | Sim (auto-extract) |
| Nested directory unwrap | Não | Sim (auto-detect) |
| Agent wrapper auto-generation | Não | Sim (para squads) |
| `--force-wrappers` flag | Não | Sim |
| Dry-run wrapper preview | Não | Sim |
| SHA-256 verify pós-cópia | Não | Sim |
| Auto-rollback em falha | Não | Sim |
| Backup integrity gate | Não | Sim (abort se falhar) |
| Zero-change guard | Não | Sim (abort se 0 mudanças) |
| Downgrade block | Não | Sim (bloqueia downgrade) |
| Relatório JSON export | Não | Sim (`.claude/update-history/`) |
| CLAUDE.md auto-register | Não | Sim (squads) |
| Batch update command | Não | Sim (`batch-update`) |
| Rollback command | Não (cópia manual) | Sim (`rollback --restore`) |
| Template externo de wrappers | Não | Sim (`references/wrapper-template.md`) |
| Cache de hashes diff→apply | Não | Sim (P2-9) |
| Orphan wrapper detection | Não | Sim (Phase 6, squads) |
| Robust CLAUDE.md duplicate detection | Não | Sim (3-pattern matching) |
| Batch error detail reporting | Não | Sim (exit code + error message) |
| Batch large-set warning | Não | Sim (>10 packages) |
| Suite de testes | Não | Sim (48 tests) |
| Phase 6 squad validation | AND (false positives) | OR (`squad.yaml` ou `config.yaml`) |

---

## Créditos

- **Skill:** aios-update v1.1
- **Criada por:** AIOS Skill Creator Pipeline
- **Data:** 2026-02-14
- **Compatibilidade:** Claude Code + Python 3.10+
- **Licença:** Interna AIOS
