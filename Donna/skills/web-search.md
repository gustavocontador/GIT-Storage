# Web Search — Skill Donna

> Donna pesquisa na internet para responder perguntas, buscar informações de empresas, notícias e dados atualizados.

---

## Providers Disponíveis

| Provider | Via | Uso Principal | API Key |
|----------|-----|---------------|---------|
| **EXA** | Docker MCP | Busca semântica, pesquisa de empresas, notícias | EXA_API_KEY |
| **Apify** | Docker MCP | Web scraping, dados de redes sociais, extração estruturada | APIFY_API_KEY |
| **Brave** | Docker MCP | Busca web geral, imagens, vídeos, notícias | BRAVE_API_KEY |
| **WebSearch** | Claude Code nativo | Busca web rápida (quando via Claude Code) | Incluído |
| **Summarize** | OpenClaw skill | Resumir URLs, podcasts, vídeos | Incluído |

## Quando Usar

- "Pesquisa sobre [empresa/assunto]"
- "O que está acontecendo com [notícia]?"
- "Busca informações sobre [pessoa/empresa]"
- "Qual o CNPJ da [empresa]?"
- "Notícias recentes sobre [tema tributário]"

## Prioridade de Uso

1. **WebSearch nativo** — para buscas rápidas e gerais
2. **EXA** — para buscas semânticas profundas, pesquisa de empresas
3. **Summarize** — para resumir conteúdo de URLs específicas
4. **Apify** — para extração estruturada de dados de sites
5. **Brave** — fallback para buscas gerais

## Comandos

### Via Claude Code (quando no terminal)
```
# Busca nativa
WebSearch("consulta aqui")

# Resumir URL
WebFetch("https://url.com", "resuma o conteúdo")
```

### Via Docker MCP (quando no OpenClaw/WhatsApp)
```bash
# EXA - busca semântica
mcp__docker-gateway__web_search_exa query="consulta aqui"

# Apify - scraping
mcp__docker-gateway__search-actors query="instagram scraper"
mcp__docker-gateway__call-actor actorId="..." input={...}

# Brave - busca geral
mcp__docker-gateway__brave_web_search query="consulta aqui"
```

### Via OpenClaw
```bash
# Resumir URL/vídeo
summarize "https://url.com"
```

## Setup Necessário

### 1. EXA API Key (gratuito com 1000 buscas/mês)

```bash
# Obter key em: https://exa.ai/
docker mcp secret set exa EXA_API_KEY=<sua-key>

# OU editar diretamente (workaround do bug de secrets):
# ~/.docker/mcp/catalogs/docker-mcp.yaml → seção exa → env
```

### 2. Apify API Key

```bash
# Obter key em: https://apify.com/
docker mcp secret set apify APIFY_API_KEY=<sua-key>
```

### 3. Brave API Key (opcional)

```bash
# Obter key em: https://brave.com/search/api/
docker mcp secret set brave BRAVE_API_KEY=<sua-key>
```

## Regras de Segurança

- Busca é **auto-execute** (não precisa de confirmação)
- Resultados são **resumidos** para o formato Donna (máx 3 pontos)
- Informações sensíveis encontradas: **alertar** antes de compartilhar

---

*Donna Web Search Skill v0.1.0*
