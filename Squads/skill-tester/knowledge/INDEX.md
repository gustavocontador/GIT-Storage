# Knowledge Index — Squad Skill-Tester

> Atualizado: 2026-02-10 | Mantido por: squad-creator (Craft)

---

## Documentos Disponíveis

| # | Documento | Conceitos Principais | Atualizado |
|---|-----------|---------------------|------------|
| 1 | [EVALUATION-METHODOLOGY.md](EVALUATION-METHODOLOGY.md) | Avaliação cega sequencial, escala 1-10, 6 critérios default com pesos, justificativa obrigatória, consolidação por skill | 2026-02-10 |
| 2 | [UI-UX-EVALUATION-RUBRIC.md](UI-UX-EVALUATION-RUBRIC.md) | 28-point pre-delivery checklist, sub-critérios UI/UX, anti-patterns negativos, bonus criteria, benchmark frontend-design-hybrid 9.1/10 | 2026-02-10 |
| 3 | [STANDARD-TEST-SCENARIOS.md](STANDARD-TEST-SCENARIOS.md) | SaaS Analytics Dashboard (benchmark primário), Product Landing Page Hero, Multi-Step Onboarding Form, protocolo de execução idêntica | 2026-02-10 |

---

## Decision Map — Quando Consultar Qual Documento

### Por situação operacional

| Situação | Consultar | Seção relevante |
|----------|-----------|-----------------|
| Iniciando comparação de skills | METHODOLOGY | §1 Fluxo de Avaliação + §2 Critérios Default |
| Definindo critérios customizados | METHODOLOGY | §2 Critérios com Pesos + §4 Customização |
| Avaliando skills de frontend/UI | UI-UX RUBRIC | Todos (checklist + anti-patterns + bonus) |
| Escolhendo cenário de teste | SCENARIOS | §1-3 (Dashboard, Landing, Form) |
| Criando cenário custom | SCENARIOS | §4 Protocolo de Cenário Custom |
| Pontuando output de design | UI-UX RUBRIC | §1 Pre-Delivery Checklist + §3 Anti-Patterns |
| Calibrando nota vs benchmark | UI-UX RUBRIC | §5 Benchmark Reference (9.1/10) |
| Garantindo fairness na execução | METHODOLOGY | §1 Avaliação Cega + SCENARIOS §5 Condições Idênticas |

### Por agente

| Agente | Docs Primários | Docs Secundários |
|--------|---------------|------------------|
| **eval-chief** | METHODOLOGY, SCENARIOS | UI-UX RUBRIC |
| **test-runner** | SCENARIOS | METHODOLOGY (para contexto) |
| **quality-judge** | METHODOLOGY, UI-UX RUBRIC | SCENARIOS (para contexto) |
| **skill-tester** (activatable) | Todos os 3 | — |

---

## Conceitos-Chave (Quick Reference)

### Evaluation Methodology
- **Avaliação cega**: Cada output avaliado individualmente antes da comparação
- **6 critérios default**: Relevância (25%), Qualidade (25%), Formato (15%), Tom (15%), Completude (10%), Criatividade (10%)
- **Escala 1-10**: 9-10 Excepcional, 7-8 Bom, 5-6 Adequado, 3-4 Fraco, 1-2 Insuficiente
- **Justificativa obrigatória**: Score sem evidência do output = inválido
- **Consolidação**: Média ponderada por critério, ranking final com key differentiators

### UI/UX Rubric
- **28-point checklist**: Visual Design (7), Micro-Interactions (6), Accessibility (7), Technical (8)
- **Anti-patterns**: Visual Crimes, UX Violations, Technical Sins (-0.5 a -1.0 cada)
- **Bonus criteria**: Design Thinking, Token Discipline, Visual Atmosphere, etc. (+0.5 cada)
- **Benchmark**: frontend-design-hybrid skill = 9.1/10 (gold standard)

### Standard Scenarios
- **SaaS Dashboard**: Benchmark primário — sidebar, KPI cards, charts, dark mode toggle
- **Landing Page Hero**: Headline, CTA, product mockup, social proof
- **Onboarding Form**: Multi-step, validation states, animations, success state

---

## Regras de Uso

1. **Antes de qualquer comparação**: Ler METHODOLOGY §1 (fluxo) + §2 (critérios)
2. **Para skills UI/UX**: Ler UI-UX RUBRIC completa antes de pontuar
3. **Cenário padrão**: Usar SaaS Dashboard (SCENARIOS §1) como primeiro cenário
4. **Customizar só quando necessário**: Default criteria servem para 80%+ dos casos
5. **Benchmark 9.1/10 é teto calibrado**: Notas > 9.1 exigem justificativa extra
