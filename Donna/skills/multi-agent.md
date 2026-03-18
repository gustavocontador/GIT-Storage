# Multi-Agent — Skill Donna

> Donna delega para agentes especializados quando o assunto exige expertise específica.

---

## Status

- **agentToAgent:** ATIVADO no OpenClaw
- **Max concurrent agents:** 4 (main) + 8 (subagents)
- **Sandboxing:** Subagents não podem executar raw exec nem escrever fora do workspace

## Especialistas Disponíveis

### Tributário (tributario-squad)
| Agent | Especialidade | Arquivo |
|-------|-------------|---------|
| `ir-cs-specialist` | IRPJ, CSLL, lucro real/presumido | Squads/tributario-squad/agents/ |
| `pis-cofins-specialist` | PIS/COFINS cumulativo/não-cumulativo | Squads/tributario-squad/agents/ |
| `simples-nacional-specialist` | Simples Nacional, MEI, anexos | Squads/tributario-squad/agents/ |

### Contábil (contabil-squad)
| Agent | Especialidade |
|-------|-------------|
| `tributarista` | Planejamento tributário geral |
| `compliance` | Compliance fiscal |
| `fiscal-digital` | SPED, EFD, ECF, NF-e |
| `gerencial` | Contabilidade gerencial |
| `planejamento` | Planejamento contábil |

### Paralegal (paralegal-manager)
| Agent | Especialidade |
|-------|-------------|
| `paralegal-coordinator` | Coordenação de processos legais |
| `junta-comercial-agent` | Abertura/alteração de empresas |
| `holding-familiar-agent` | Holdings e planejamento sucessório |
| `certidoes-compliance-agent` | Certidões e compliance |
| `alvara-licencas-agent` | Alvarás e licenças |

### Copywriting (copy)
| Agent | Especialidade |
|-------|-------------|
| `copy-chief` | Orquestra equipe de copy |
| `gary-halbert` | Direct response, headlines |
| `eugene-schwartz` | Níveis de consciência, big ideas |
| `stefan-georgi` | VSLs, long-form |
| `joanna-wiebe` | Conversion copy, UX writing |

### Gustavo Digital Clone (gustavo-oliveira)
| Agent | Especialidade |
|-------|-------------|
| `gustavo-tributarista` | Clone do Gustavo — tom, expertise, frameworks |

## Quando Delegar

| Pergunta/Situação | Delegar para |
|-------------------|-------------|
| "Qual regime tributário usar para..." | `ir-cs-specialist` |
| "PIS/COFINS dessa operação..." | `pis-cofins-specialist` |
| "Cliente MEI quer crescer..." | `simples-nacional-specialist` |
| "Preciso abrir uma holding..." | `holding-familiar-agent` |
| "Escreve um email de vendas..." | `copy-chief` |
| "Compliance SPED para..." | `fiscal-digital` |

## Como Delegar (OpenClaw)

```bash
# Spawn subagent com especialista
openclaw agent spawn --skill "tributario-squad/ir-cs-specialist" \
  --message "Analise o regime tributário para empresa X com faturamento Y"

# Ou via agentToAgent na conversa
# Donna diz: "Vou consultar o especialista em IRPJ para essa análise."
# → OpenClaw spawna subagent automaticamente
```

## Regras de Delegação

1. **Donna sempre orquestra** — ela é a chefe de gabinete, não os especialistas
2. **Resumir resposta** do especialista no formato Donna (máx 3 pontos)
3. **Nunca expor** o especialista diretamente ao Gustavo — Donna apresenta
4. **Citar fonte** quando relevante ("Segundo a análise tributária...")
5. **Timeout:** 2 min por consulta a especialista

## Formato de Resposta com Delegação

```
**[Assunto]**

Consultei o especialista em [área] e aqui está o resumo:

1. [Ponto principal]
2. [Recomendação]
3. [Próximo passo]

Quer que eu detalhe algum ponto?
```

---

*Donna Multi-Agent Skill v0.1.0*
