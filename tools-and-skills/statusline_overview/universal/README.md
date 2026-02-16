# Claude Statusline

Barra de status em tempo real para o Claude Code. Mostra modelo, contexto, tempo, squad, agente e projeto — tudo com cores.

```
Opus | ████░░░░░░ 38% 76k | 12m34s | hormozi | architect | meu-projeto | 3f +42 -8
```

## O que mostra

| Seção | Cor | Descrição |
|-------|-----|-----------|
| **Modelo** | Azul | Opus, Sonnet ou Haiku |
| **Contexto** | Verde→Amarelo→Vermelho | Barra de progresso + % da janela de 200k tokens |
| **Tempo** | Ciano | Duração da sessão atual |
| **Squad** | Laranja | Squad ativa (aparece quando você usa `/squad:*`) |
| **Agente** | Ciano | Agente ativo (aparece quando você usa `@agente`) |
| **Projeto** | Amarelo | Nome do repo git + subpasta atual |
| **Git** | Branco/Verde/Vermelho | Arquivos modificados, adições e deleções |

Squad e Agente só aparecem quando estão ativos — a barra fica limpa por padrão.

## Pré-requisitos

- **Claude Code** (CLI)
- **jq** — parser JSON
  ```bash
  # macOS
  brew install jq

  # Ubuntu/Debian
  sudo apt install jq

  # Arch
  sudo pacman -S jq
  ```
- **git** (opcional, para mostrar branch e mudanças)

## Instalação

```bash
git clone https://github.com/SEU-USER/claude-statusline.git
cd claude-statusline
bash install.sh
```

Reinicie o Claude Code. A statusline aparece automaticamente.

## O que o instalador faz

1. Copia `statusline.sh` para `~/.claude/statusline.sh`
2. Copia `track-agent.sh` para `~/.claude/hooks/track-agent.sh`
3. Configura `statusLine` no `~/.claude/settings.json`
4. Adiciona hook `UserPromptSubmit` para tracking de squad/agente
5. Faz backup do `settings.json` antes de alterar

## Como funciona o tracking

O hook `track-agent.sh` é executado toda vez que você envia uma mensagem. Ele detecta padrões na sua mensagem:

| Padrão | Exemplo | O que detecta |
|--------|---------|---------------|
| `@nome` | `@dev`, `@architect` | Agente ativo |
| `/<squad>:*` | `/hormozi:README` | Squad ativa |
| `/<ns>:agents:<nome>` | `/AIOS:agents:dev` | Agente (via namespace) |
| `*exit` | `*exit` | Limpa squad e agente |

Os dados ficam em `~/.claude/session-cache/` — um arquivo JSON por sessão, identificado pelo PID do Claude.

## Desinstalação

```bash
bash uninstall.sh
```

Remove scripts, limpa o `settings.json` (preservando suas outras configurações) e apaga o cache.

## Estrutura

```
claude-statusline/
├── install.sh                    # Instalador
├── uninstall.sh                  # Desinstalador
├── README.md                     # Este arquivo
└── scripts/
    ├── statusline.sh             # Script principal da barra
    └── hooks/
        └── track-agent.sh        # Hook de tracking de squad/agente
```

## Personalização

O script `~/.claude/statusline.sh` é um bash script simples. Você pode editar diretamente para:

- Mudar cores (variáveis `BLUE`, `CYAN`, `ORANGE`, etc.)
- Adicionar/remover seções
- Alterar o tamanho da barra de progresso (`BAR_WIDTH`)
- Mudar o budget de tokens (`BUDGET`, padrão: 200k)

## Licença

MIT
