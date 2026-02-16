# Tool: Playwright Integration

# Usado por: Production Monitor (Sentinel), Health Check, Production Verify

# Prerequisito: Playwright MCP habilitado no Claude Code

## Setup

O Playwright MCP deve estar configurado no ambiente do agente.
Verificar disponibilidade com:

```
# Verificar se Playwright MCP esta acessivel
# O tool aparecera como mcp__playwright__* nas ferramentas disponiveis
```

## Uso no Quality Shield

### Quick Check (on activation)

```
1. playwright.navigate("https://fomibrasil.com.br")
2. playwright.screenshot() → verificar se pagina carregou
3. Verificar elementos: form de login visivel, logo, botoes
4. Se autenticado: navegar para /feed
5. playwright.screenshot() → verificar se feed renderizou
```

### Full Health Check (8 fluxos)

```
Para cada fluxo em health_check_flows.critical:
  1. playwright.navigate(entry_url)
  2. Aguardar page load (timeout do squad-config.yaml)
  3. Para cada step no fluxo:
     a. Executar acao (click, type, navigate)
     b. Verificar resultado esperado (elemento visivel, URL correta)
     c. Capturar timing
  4. playwright.screenshot() → evidencia visual
  5. Registrar resultado: PASS/FAIL + timing + notas
```

### Post-Deploy Verification

```
1. Executar Quick Check primeiro (gate)
2. Se PASS: executar fluxos afetados pelo deploy
3. Para cada fluxo afetado:
   a. Seguir steps do fluxo
   b. Comparar com expected behavior
   c. Capturar evidencia
4. Executar Full Health Check (todos os 8)
5. Emitir veredicto
```

## Limitacoes

| Cenario              | Limitacao                          | Workaround                                                   |
| -------------------- | ---------------------------------- | ------------------------------------------------------------ |
| Google OAuth         | Nao pode completar login no Google | Verificar ate o redirect, Level 4 manual checklist pro resto |
| Captcha              | Se Supabase/Google mostra captcha  | Falhar e reportar como "requer verificacao manual"           |
| 2FA                  | Se usuario tem 2FA no Google       | Falhar e reportar                                            |
| Mobile-only features | Capacitor APIs nao disponiveis     | Pular e flaggar como "requer device testing"                 |
| Dynamic content      | Feed vazio para usuario novo       | Usar usuario com dados existentes                            |

## Credenciais

O Sentinel usa a sessao do usuario atual (via cookies/localStorage do Playwright).
NAO armazenar credenciais em arquivos.
Para health checks automaticos, o usuario deve estar logado no browser do Playwright.
