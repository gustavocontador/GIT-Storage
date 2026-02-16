# 🚀 Universal AIOS Indexer - Instalação Rápida

**Versão:** 2.0.0
**Data:** 2026-02-13
**Compatibilidade:** AIOS Framework v3.0+

---

## 📦 O Que É Isso?

Sistema que **automatiza 100%** a indexação de squads, skills e tools no AIOS Framework.

**Antes:** 30-45 minutos de trabalho manual
**Depois:** 5 segundos (automático no commit)

---

## ⚡ Instalação em 3 Passos

### 1. Copie os arquivos para seu projeto AIOS

```bash
# Copie para a raiz do seu projeto AIOS
cp universal-indexer.js /seu-projeto/scripts/
cp squad-indexer.js /seu-projeto/scripts/
cp pre-commit-squad-indexer /seu-projeto/.husky/
```

### 2. Configure os NPM scripts

Adicione no seu `package.json`:

```json
{
  "scripts": {
    "index:all": "node scripts/universal-indexer.js --index",
    "index:scan": "node scripts/universal-indexer.js --scan",
    "index:validate": "node scripts/universal-indexer.js --validate",
    "index:report": "node scripts/universal-indexer.js --report",
    "squad:scan": "node scripts/squad-indexer.js --scan",
    "squad:index": "node scripts/squad-indexer.js --index"
  }
}
```

### 3. Configure o pre-commit hook

Edite `.husky/pre-commit` e adicione:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Universal AIOS Indexer
.husky/pre-commit-squad-indexer
```

**Pronto!** ✅

---

## 🎯 Como Usar

### Automático (Recomendado)

Apenas faça commits normalmente:

```bash
# Crie ou modifique um squad/skill/tool
git add .
git commit -m "feat: add new squad"

# Indexação acontece AUTOMATICAMENTE! ⚡
```

### Manual (Quando Necessário)

```bash
# Ver o que será indexado
npm run index:scan

# Indexar tudo
npm run index:all

# Validar indexes
npm run index:validate

# Relatório completo
npm run index:report
```

---

## 📊 O Que Faz?

Quando você commita mudanças em:
- `squads/*` → Cria symlinks em `.claude/commands/{squad-name}/`
- `.aios/skills/*` → Cria symlinks em `.claude/commands/AIOS/skills/{skill-name}/`
- `tools/*` → Atualiza `tools/README.md` com registry

**Automático:**
- ✅ Cria todos os symlinks necessários
- ✅ Atualiza MEMORY.md com tabelas de squads/skills/tools
- ✅ Atualiza tools/README.md com descrições
- ✅ Stage arquivos modificados no commit
- ✅ Funciona em macOS, Linux, WSL

**Você nunca mais precisa criar symlinks manualmente!**

---

## 🧪 Testado e Aprovado

- ✅ 13 testes completos (todos passaram)
- ✅ 0 bugs encontrados
- ✅ 21 assets indexados com sucesso
- ✅ Performance: < 1 segundo

Ver `TEST-REPORT.md` para detalhes completos.

---

## 📚 Documentação Completa

- **MANUAL-COMPLETO-INDEXER.md** - Manual completo (1000+ linhas)
- **TEST-REPORT.md** - Relatório de testes

---

## ❓ Troubleshooting

**Hook não está executando?**
```bash
# Torne o script executável
chmod +x .husky/pre-commit-squad-indexer
```

**Erro "command not found"?**
```bash
# Verifique que o arquivo está na pasta correta
ls -la scripts/universal-indexer.js
```

**Symlinks não funcionam no Windows?**
- Use WSL (Windows Subsystem for Linux)
- Ou execute com privilégios de administrador

---

## 💡 Dicas

1. **Sempre use `npm run index:scan`** antes de indexar manualmente
2. **Validação periódica:** `npm run index:validate` para encontrar órfãos
3. **Relatório completo:** `npm run index:report` para status de todos assets
4. **Compatibilidade:** Mantém `squad-indexer.js` funcionando normalmente

---

## 🎉 Benefícios

- **95-98% redução de tempo** - 30-45 min → 5 seg
- **100% eliminação de erros** - Zero symlinks incorretos
- **100% prevenção de esquecimentos** - Hook automático
- **Documentação automática** - MEMORY.md sempre atualizado

---

## 🆘 Suporte

Dúvidas ou problemas? Consulte o `MANUAL-COMPLETO-INDEXER.md` para troubleshooting detalhado.

---

**Desenvolvido por:** @devops (Gage)
**Testado com:** Claude Sonnet 4.5
**Licença:** Same as AIOS Framework

🚀 **Aproveite a automação!**
