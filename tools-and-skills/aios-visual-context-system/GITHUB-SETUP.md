# Instruções para Publicar no GitHub

## Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name**: `aios-visual-context-system`
   - **Description**: `🎨 Complete statusline for Claude Code with rich AIOS context integration`
   - **Visibility**: Public
   - **NÃO marque**: "Initialize this repository with a README"
3. Clique em "Create repository"

## Passo 2: Push do Código

```bash
# Navegar para o diretório do repositório
cd /tmp/aios-visual-context-system-repo

# Adicionar remote origin
git remote add origin https://github.com/luizfosc/aios-visual-context-system.git

# Renomear branch para main
git branch -M main

# Push inicial
git push -u origin main
```

## Passo 3: Configurar Repositório no GitHub

### Adicionar Topics (tags)

No GitHub, vá em Settings > Topics e adicione:
- `claude-code`
- `statusline`
- `aios`
- `terminal`
- `cli`
- `developer-tools`
- `productivity`

### Adicionar Screenshot

1. Tire um screenshot do statusline funcionando
2. Salve como `screenshot.png`
3. Upload no README do GitHub:
   ```bash
   # Adicionar screenshot
   cp /path/to/screenshot.png /tmp/aios-visual-context-system-repo/
   cd /tmp/aios-visual-context-system-repo
   git add screenshot.png
   git commit -m "docs: add screenshot"
   git push
   ```

4. Edite README.md no GitHub e adicione após a descrição:
   ```markdown
   ## 📸 Preview

   ![AIOS Visual Context System](screenshot.png)
   ```

## Passo 4: Criar Pull Request para AIOS Core

### 4.1 Fork do AIOS Core

1. Acesse https://github.com/SynkraAI/aios-core
2. Clique em "Fork" (canto superior direito)
3. Aguarde criação do fork

### 4.2 Clonar Fork e Preparar PR

```bash
# Clonar seu fork
cd ~/Projects
git clone https://github.com/luizfosc/aios-core.git aios-core-fork
cd aios-core-fork

# Criar branch para feature
git checkout -b feat/visual-context-system

# Copiar arquivos do Visual Context System
cp -r /tmp/aios-visual-context-system-repo/statusline.sh ./.aios-core/infrastructure/scripts/
cp -r /tmp/aios-visual-context-system-repo/terminal-integration/* ./.aios-core/infrastructure/scripts/terminal/
cp /tmp/aios-visual-context-system-repo/cli-commands/set-title.js ./.aios-core/cli/commands/context/

# Adicionar documentação
mkdir -p docs/visual-context-system
cp -r /tmp/aios-visual-context-system-repo/docs/* docs/visual-context-system/
cp /tmp/aios-visual-context-system-repo/README.md docs/visual-context-system/

# Commit
git add .
git commit -m "feat: add Visual Context System with emoji support

Adds complete Visual Context System for Claude Code integration.

Features:
- Rich statusline showing model, cost, duration, context usage
- Visual progress bar for context window
- Two-line format to avoid input area compression
- Title emoji support for thematic organization
- Terminal integration with automatic tab title updates
- AIOS CLI command integration (set-title with --emoji)
- CPU/RAM monitoring
- Complete documentation

Benefits:
- Better visibility of Claude Code session state
- Organized multi-project workflow with emoji themes
- No more input area compression issues
- Seamless AIOS context integration

Documentation:
- docs/visual-context-system/README.md - Main documentation
- docs/visual-context-system/INSTALL.md - Installation guide
- docs/visual-context-system/QUICK-START.md - Quick start
- docs/visual-context-system/CUSTOMIZATION.md - Customization

Related Issue: #[ISSUE_NUMBER if exists]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push para seu fork
git push -u origin feat/visual-context-system
```

### 4.3 Abrir Pull Request

1. Acesse https://github.com/luizfosc/aios-core
2. Clique em "Compare & pull request" (banner verde)
3. Preencha:
   - **Base repository**: SynkraAI/aios-core
   - **Base branch**: main
   - **Head repository**: luizfosc/aios-core
   - **Compare branch**: feat/visual-context-system
   - **Title**: `feat: Visual Context System with emoji support`
   - **Description**: Use o template abaixo

```markdown
## 🎯 Descrição

Adiciona Visual Context System completo para Claude Code com suporte a emoji temático.

## ✨ Features

- 🎨 **Emoji Temático**: Adicione emoji ao título usando `--emoji` flag
- 📊 **Statusline Rico**: Model, custo, duração, tokens, progress bar visual
- 📐 **Formato de 2 Linhas**: Evita compressão da área de input
- 🖥️ **Terminal Integration**: Atualização automática do tab title
- ⚙️ **AIOS CLI Integration**: Novo comando `context set-title --emoji`
- 💻 **System Monitoring**: CPU/RAM em tempo real

## 📦 O que inclui

- `statusline.sh` - Script principal do statusline
- Terminal integration scripts (update-tab-title.sh, etc)
- CLI command `set-title` com suporte a `--emoji`
- Documentação completa (INSTALL, QUICK-START, CUSTOMIZATION)
- Exemplos de configuração

## 🧪 Testado em

- ✅ macOS Sequoia 15.2
- ✅ Claude Code 2.1+
- ✅ zsh, bash

## 📸 Screenshots

[ADICIONAR SCREENSHOTS AQUI]

## 📚 Documentação

- [README.md](docs/visual-context-system/README.md)
- [INSTALL.md](docs/visual-context-system/INSTALL.md)
- [QUICK-START.md](docs/visual-context-system/QUICK-START.md)
- [CUSTOMIZATION.md](docs/visual-context-system/CUSTOMIZATION.md)

## 🔗 Repositório Standalone

Também disponível como repositório standalone:
https://github.com/luizfosc/aios-visual-context-system

## ✅ Checklist

- [x] Código testado localmente
- [x] Documentação completa
- [x] Exemplos incluídos
- [x] Nenhuma breaking change
- [x] Segue padrões do AIOS

---

**Desenvolvido com ❤️ por Luiz Fosc**
```

4. Clique em "Create pull request"

## Passo 5: Atualizar Links nas Mensagens

Depois que o repo estiver no ar, atualize:

### MENSAGEM-WHATSAPP.txt
Substituir `[SERÁ ADICIONADO]` por:
```
https://github.com/luizfosc/aios-visual-context-system
```

## 🎉 Pronto!

Seu código estará:
1. ✅ No seu GitHub pessoal (standalone)
2. ✅ Como PR no AIOS Core (aguardando review)

---

**Dúvidas?** Abra uma issue no repositório!
