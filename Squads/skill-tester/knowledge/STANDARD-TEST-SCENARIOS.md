# Standard Test Scenarios — Skill Tester Squad

> Cenários padronizados para execução controlada de skills.
> Referenciado por: test-runner, eval-chief

---

## §1 Cenário 1: SaaS Analytics Dashboard (Benchmark Primário)

O cenário principal para comparação de skills frontend/UI. Comprovado em exposição de diferenças de qualidade entre skills.

```yaml
scenario:
  name: "SaaS Analytics Dashboard"
  type: primary_benchmark
  description: >
    Create a modern SaaS analytics dashboard with:
    - Sidebar navigation with icons and active state
    - Header with search, notifications bell, and user avatar
    - 4 KPI metric cards (revenue, users, conversion, growth) with sparkline trends
    - Main chart area with a line/area chart showing monthly data
    - Recent activity feed or data table with 5+ rows
    - Dark mode toggle that switches the full interface
  tech_stack: "React + Tailwind CSS (or vanilla HTML/CSS/JS)"
  target_user: "SaaS founder checking daily metrics on a 1440px laptop screen"
  constraints:
    - Single file output (for fair comparison)
    - Must be functional (not just mockup)
    - Must include responsive considerations
    - Must include at least one animation/transition
  evaluation_focus:
    - Visual memorability
    - Systematic token usage
    - Interaction quality
    - Accessibility compliance
```

### Por que SaaS Dashboard?

- **Complexidade equilibrada**: Suficiente para expor diferenças, sem ser impossível
- **Múltiplas dimensões**: Layout, data viz, interações, temas, responsividade
- **Benchmark existente**: frontend-design-hybrid scored 9.1/10 neste cenário
- **Reproduzível**: Spec precisa permite comparação justa

---

## §2 Cenário 2: Product Landing Page Hero (Secundário)

```yaml
scenario:
  name: "Product Landing Page Hero"
  type: secondary
  description: >
    Create a hero section for a design tool SaaS:
    - Bold headline with display font
    - Subheadline and CTA button with hover effect
    - Product screenshot/mockup area
    - Social proof bar (logos or testimonials)
    - Scroll indicator animation
  tech_stack: "HTML + CSS + minimal JS"
  target_user: "Designer evaluating a new tool on mobile and desktop"
  constraints:
    - Single file output
    - Must work on mobile (375px) and desktop (1440px)
    - Must include at least one scroll-based interaction
  evaluation_focus:
    - Typography and visual hierarchy
    - CTA design and hover state
    - Mobile responsiveness
    - First impression impact
```

### Quando usar

- Para skills focadas em marketing/conversão
- Como segundo cenário em comparações completas
- Quando o Dashboard não é representativo do domínio da skill

---

## §3 Cenário 3: Multi-Step Onboarding Form (Terciário)

```yaml
scenario:
  name: "Multi-Step Onboarding Form"
  type: tertiary
  description: >
    Create a 3-step onboarding form with:
    - Progress indicator (steps 1/2/3)
    - Form fields with validation states (empty, valid, error)
    - Animated transitions between steps
    - Success state with confetti/celebration animation
  tech_stack: "React + Tailwind CSS"
  target_user: "New user signing up on a mobile device"
  constraints:
    - Single file output
    - Mobile-first design (375px primary)
    - Must show all 3 validation states
    - Transitions between steps must be animated
  evaluation_focus:
    - Form UX patterns
    - Validation design
    - Transition quality
    - Mobile-first thinking
```

### Quando usar

- Para skills focadas em interação/UX
- Quando formulários são core feature
- Como terceiro cenário em comparações deep

---

## §4 Protocolo de Cenário Custom

Quando nenhum cenário padrão é adequado, criar um cenário custom seguindo este protocolo:

### Template de Cenário

```yaml
scenario:
  name: "[Nome descritivo]"
  type: custom
  description: >
    [Descrição detalhada com lista de features obrigatórias]
  tech_stack: "[Stack exata — mesma para todas as skills]"
  target_user: "[Persona do usuário alvo]"
  constraints:
    - Single file output (for fair comparison)
    - [Constraint específica 1]
    - [Constraint específica 2]
  evaluation_focus:
    - [Dimensão de avaliação 1]
    - [Dimensão de avaliação 2]
```

### Regras para cenários custom

1. **Descrição deve ter features listadas** — não aceitar "faça algo bonito"
2. **Tech stack idêntica** para todas as skills — sem vantagem de framework
3. **Target user definido** — afeta critérios de relevância e tom
4. **Constraints explícitas** — tudo que limita o output deve estar escrito
5. **Single file** como default — facilita comparação justa
6. **Cenário deve ser realizável** em um único turno de LLM

---

## §5 Protocolo de Execução Idêntica

Independente do cenário, a execução DEVE seguir estas condições:

### Condições obrigatórias

| Condição | Regra |
|----------|-------|
| **Same prompt** | Character-for-character idêntico para todas as skills |
| **Same constraints** | Mesma tech stack, features, escopo |
| **Same scope** | Lista idêntica de features e complexidade |
| **Same persona** | Mesmo target user para todas |
| **No prior context** | Cada execução começa de clean state |
| **No modifications** | Output coletado bruto, sem edição |

### Metadata a registrar

```yaml
execution_metadata:
  scenario: "[nome do cenário]"
  timestamp: "[ISO datetime]"
  skill_id: "[identificador]"
  skill_type: "[prompt|system_prompt|slash_command|agent_definition]"
  input_given: "[o input exato usado]"
  output_length: [chars]
  sections_count: [N]
  code_blocks_count: [N]
  has_formatting: [true/false]
  anomalies: ["lista de problemas na execução, se houver"]
```

### Protocol para Slash Commands (.claude/skills/)

1. **Locate**: Skills em `.claude/skills/{skill-name}/SKILL.md`
2. **Read**: Conteúdo completo da SKILL.md = system-level instructions
3. **Construct**: Skill content como contexto + cenário como user prompt
4. **Execute**: Cada skill com cenário idêntico
5. **Collect**: Output completo sem modificação

---

## §6 Seleção de Cenários por Tipo de Skill

| Tipo de Skill | Cenário Primário | Cenários Adicionais |
|---------------|-----------------|---------------------|
| Frontend/UI geral | SaaS Dashboard | Landing Hero, Onboarding Form |
| Landing page/conversão | Landing Hero | SaaS Dashboard |
| Forms/UX | Onboarding Form | SaaS Dashboard |
| Copy/texto | Custom (briefing text) | — |
| Agent definition | Custom (task-based) | — |
| System prompt | Custom (domain-specific) | — |
