# Evaluation Methodology — Skill Tester Squad

> Documento canônico para metodologia de avaliação comparativa de skills.
> Referenciado por: eval-chief, quality-judge, skill-tester

---

## §1 Fluxo de Avaliação (Blind Sequential)

A avaliação segue um protocolo cego e sequencial para garantir imparcialidade:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. SETUP   │───>│  2. EXECUTE │───>│  3. EVALUATE│───>│  4. COMPARE │
│  Critérios  │    │  Cenários   │    │  Cega/Indiv │    │  Ranking    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 1.1 Setup (eval-chief)
- Definir critérios de avaliação (defaults ou custom)
- Definir cenários de teste (1-3 cenários)
- Alinhar com o usuário antes de executar
- **Critérios são definidos ANTES da execução, nunca post-hoc**

### 1.2 Execute (test-runner)
- Cada skill recebe os mesmos inputs, character-for-character
- Mesmas constraints (tech stack, scope, persona)
- Nenhum contexto prévio (clean state)
- Output coletado bruto, sem interpretação
- Metadata registrada (comprimento, seções, anomalias)

### 1.3 Evaluate — Fase Individual (quality-judge)
- Cada output avaliado **separadamente**, sem ver os outros
- Score por critério com justificativa e evidência do output
- Identificação de forças e fraquezas por critério
- Média ponderada calculada por skill

### 1.4 Compare — Fase Comparativa (quality-judge → eval-chief)
- Comparação critério-a-critério entre skills
- Identificação de líder por critério e margem
- Ranking final com key differentiators
- Veredicto com justificativa clara

---

## §2 Critérios de Avaliação (Defaults)

Os 6 critérios padrão cobrem 80%+ dos cenários de comparação:

| # | Critério | Peso | O que medir |
|---|----------|------|-------------|
| 1 | **Relevância** | 25% | Output atende ao objetivo solicitado; informação correta e pertinente |
| 2 | **Qualidade** | 25% | Profundidade, precisão e valor do conteúdo; production-readiness |
| 3 | **Formato** | 15% | Estrutura, organização e legibilidade do output |
| 4 | **Tom** | 15% | Tom e estilo adequados ao contexto e audiência |
| 5 | **Completude** | 10% | Cobertura de todos os pontos esperados; nada crítico omitido |
| 6 | **Criatividade** | 10% | Originalidade e valor agregado além do básico |

**Total dos pesos: 100%**

### Fórmula de Score Final

```
Score Final = Σ (score_critério × peso_critério / 100)
```

Exemplo: Relevância 8 × 0.25 + Qualidade 7 × 0.25 + Formato 9 × 0.15 + Tom 8 × 0.15 + Completude 7 × 0.10 + Criatividade 6 × 0.10 = **7.60**

---

## §3 Escala de Pontuação (1-10)

| Score | Significado | Indicadores |
|-------|------------|-------------|
| **9-10** | Excepcional | Supera expectativas; produção-ready; "wow factor"; referência |
| **7-8** | Bom | Atende bem; pontos fortes claros; precisa de ajustes menores |
| **5-6** | Adequado | Funcional mas sem destaque; cumpre o mínimo |
| **3-4** | Fraco | Falhas significativas; requer retrabalho |
| **1-2** | Insuficiente | Não atende ao critério; off-topic ou fundamentalmente errado |

### Regras de Consistência

- **Score 10** é reservado para outputs que excedem expectativas em todas as dimensões
- **Score 1** é reservado para falhas completas (output vazio, off-topic, quebrado)
- **Diferença > 3 pontos** entre critérios similares exige justificativa extra
- Scores devem ser **inteiros ou .5** (ex: 7, 7.5, 8) — sem decimais arbitrários

---

## §4 Customização de Critérios

O eval-chief pode customizar critérios para domínios específicos:

### Quando customizar
- Skills de domínio técnico (ex: código) → adicionar "Correctness"
- Skills de design/UI → substituir critérios por rubrica UI/UX (ver `UI-UX-EVALUATION-RUBRIC.md`)
- Skills de copy → adicionar "Persuasão", "Hook Strength"
- Skills de análise → adicionar "Accuracy", "Actionability"

### Regras de customização
1. **Pesos devem somar 100%**
2. **Mínimo 4 critérios, máximo 8**
3. **Cada critério precisa de descrição clara** do que medir
4. **Definir antes da execução** — nunca ajustar critérios após ver outputs
5. **Documentar customização** no relatório final

---

## §5 Protocolo de Justificativa

Toda pontuação DEVE seguir este formato:

```yaml
criterion: Qualidade
score: 8
justification: |
  O output demonstra profundidade técnica com abordagem em 3 camadas.
  Exemplo: [trecho específico do output que evidencia o score]
strengths:
  - "Abordagem sistemática com tokens de design"
  - "Inclui edge cases e tratamento de erros"
weaknesses:
  - "Falta otimização para mobile em telas < 375px"
```

### Anti-patterns de justificativa
- "Está bom" → INVÁLIDO (sem evidência)
- "Score 7 porque é razoável" → INVÁLIDO (tautológico)
- "Melhor que o outro" → INVÁLIDO (comparativo na fase individual)

---

## §6 Consolidação e Veredicto

### Scorecard Final

```
┌──────────────────────────────────────────────────────────┐
│ SCORECARD COMPARATIVO                                     │
├────────────┬──────────┬──────────┬───────────────────────┤
│ Critério   │ Skill A  │ Skill B  │ Líder                 │
├────────────┼──────────┼──────────┼───────────────────────┤
│ Relevância │ 8.0      │ 7.0      │ Skill A (+1.0)        │
│ Qualidade  │ 7.5      │ 8.5      │ Skill B (+1.0)        │
│ ...        │ ...      │ ...      │ ...                   │
├────────────┼──────────┼──────────┼───────────────────────┤
│ TOTAL      │ 7.60     │ 7.35     │ Skill A (+0.25)       │
└────────────┴──────────┴──────────┴───────────────────────┘
```

### Consistência entre cenários

Quando múltiplos cenários são usados:
- **Skill consistente** (variação < 1.0 entre cenários) → mais confiável
- **Skill inconsistente** (variação > 2.0) → sinalizar como "scenario-dependent"
- O score final é a **média dos cenários**, não o melhor resultado

### Veredicto

O veredicto deve conter:
1. **Vencedor declarado** (ou empate técnico se diferença < 0.3)
2. **Justificativa em 2-3 frases** baseada nos key differentiators
3. **Recomendação de uso** (quando usar cada skill)
4. **Caveats** (se houver — ex: "Skill A é melhor para X, mas Skill B ganha em Y")
