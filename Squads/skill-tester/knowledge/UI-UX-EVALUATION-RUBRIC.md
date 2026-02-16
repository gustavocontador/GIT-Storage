# UI/UX Evaluation Rubric — Skill Tester Squad

> Rubrica especializada para avaliação de skills que produzem interfaces visuais.
> Calibrada contra o frontend-design-hybrid skill (9.1/10 benchmark).
> Referenciado por: eval-chief, quality-judge

---

## §1 Pre-Delivery Checklist (28 pontos)

Verificar cada item ao avaliar outputs de skills UI/UX. Cada item não atendido reduz a nota proporcionalmente.

### Visual Design (7 itens)

| # | Item | O que verificar |
|---|------|-----------------|
| V1 | Elemento visual memorável | UMA feature de design que distingue a interface |
| V2 | Hierarquia tipográfica clara | display → H1 → H2 → body → caption |
| V3 | Spacing consistente via tokens | Sem "magic numbers" — tudo do token scale |
| V4 | Máximo 2-3 typefaces | Além disso = visual noise |
| V5 | Proporção 60-30-10 de cor | Primary 60%, secondary 30%, accent 10% |
| V6 | Profundidade em camadas | Shadows, textures, glass, or overlaps |
| V7 | Pelo menos 1 "wow" element | Animação, textura, gradient mesh, etc. |

### Micro-Interactions (6 itens)

| # | Item | O que verificar |
|---|------|-----------------|
| M1 | Staggered entrance animation | Page load com sequência escalonada |
| M2 | Card hover effects | Lift + shadow ou glow |
| M3 | Button press feedback | Scale 0.97 ou efeito equivalente |
| M4 | Smooth transitions em state changes | Transições suaves em mudanças de estado |
| M5 | Chart animations | Draw-in, count-up, ou fill |
| M6 | Scroll-triggered reveals | Conteúdo below-fold com reveal animado |

### Accessibility (7 itens)

| # | Item | O que verificar |
|---|------|-----------------|
| A1 | Contraste >= 4.5:1 (text) / 3:1 (UI) | WCAG 2.1 AA compliance |
| A2 | Touch targets >= 44x44px | Todos os elementos interativos |
| A3 | Alt text em imagens | Todas as `<img>` com `alt` descritivo |
| A4 | Labels em inputs | Todos os `<input>` com `<label>` |
| A5 | `:focus-visible` states | Visível em todos os interativos |
| A6 | `prefers-reduced-motion` | Animações respeitam preferência do sistema |
| A7 | Semantic HTML | `<button>`, `<nav>`, `<main>`, `<dialog>`, `<table>` |

### Technical (8 itens)

| # | Item | O que verificar |
|---|------|-----------------|
| T1 | Mobile-first responsive | Layout funciona a partir de 320px |
| T2 | Animações GPU-only | Apenas transform/opacity/filter/clip-path |
| T3 | Sem dynamic Tailwind classes | Nada de `bg-${color}-500` (purged pelo compiler) |
| T4 | CSS variables para theme values | Custom properties para cores, spacing, etc. |
| T5 | Dark mode suportado | Toggle funcional com tema completo |
| T6 | Sem console errors | Nenhum erro no console |
| T7 | Performant (60fps) | Animações fluidas sem jank |
| T8 | Sem layout-triggering animations | Não animar width, height, margin, padding, top, left |

### Cálculo do Checklist Score

```
Checklist Score = (itens atendidos / 28) × 10
```

Exemplos: 28/28 = 10.0 | 25/28 = 8.9 | 21/28 = 7.5 | 14/28 = 5.0

---

## §2 Sub-Critérios UI/UX por Critério Principal

Quando avaliando skills frontend, detalhar os 6 critérios default nestas subdimensões:

| Critério Principal | Sub-Critérios UI/UX |
|-------------------|---------------------|
| **Relevância (25%)** | Serve o objetivo do usuário; information architecture correta; complexidade adequada à audiência |
| **Qualidade (25%)** | Typography system (scale, pairing, hierarchy); Color architecture (semantic, 60-30-10, sem combos proibidas); Animation system (durations, easings, GPU-only); Spacing consistency (8px base grid) |
| **Formato (15%)** | Organização do código; uso de tokens; estrutura de componentes; limpeza do arquivo |
| **Tom (15%)** | Personalidade visual combina com o contexto; direção estética comprometida (não tímida); mood consistente |
| **Completude (10%)** | Todas as features solicitadas presentes; responsivo; acessível; dark mode se solicitado |
| **Criatividade (10%)** | Elemento memorável presente; layout quebra o grid padrão; delight inesperado; "alguém tiraria screenshot?" |

---

## §3 Anti-Patterns (Indicadores de Deduções)

Deduzir pontos quando estes anti-patterns forem encontrados:

### Visual Crimes (-0.5 a -1.0 cada)

| Anti-Pattern | Deduction | Por quê |
|-------------|-----------|---------|
| Gradient purple/blue em fundo branco | -1.0 | Clichê #1 de AI |
| Inter, Roboto ou Arial como display font | -0.5 | Escolha invisível — sem personalidade |
| Border-radius inconsistente sem propósito | -0.5 | Ruído visual |
| Mais de 3 font-weights em uma view | -0.5 | Complexidade desnecessária |
| Rainbow color scheme | -1.0 | Sem sistema de cor |
| Cards flat sem shadow em dark mode | -0.5 | Falta profundidade |
| Cards idênticos em grid (sem variedade) | -0.5 | Layout genérico |

### UX Violations (-0.5 a -1.0 cada)

| Anti-Pattern | Deduction | Por quê |
|-------------|-----------|---------|
| Confirmshaming em copy | -1.0 | Manipulação anti-ética |
| Placeholder como única label | -0.5 | Desaparece ao digitar |
| Submit desabilitado antes da tentativa | -0.5 | Confuso para o usuário |
| Infinite scroll sem paginação | -0.5 | Sem controle do usuário |
| Autoplay de mídia | -1.0 | UX invasiva |

### Technical Sins (-0.5 a -1.0 cada)

| Anti-Pattern | Deduction | Por quê |
|-------------|-----------|---------|
| `<div onclick>` ao invés de `<button>` | -0.5 | Inacessível |
| Dynamic Tailwind: `bg-${color}-500` | -1.0 | Purged pelo compiler |
| Animar width/height/margin/padding | -0.5 | Layout thrashing |
| `<img>` sem `alt` text | -0.5 | Inacessível |
| `outline: none` sem `:focus-visible` | -0.5 | Focus invisível |
| Body text < 16px mobile | -0.5 | Ilegível |
| Touch targets < 44x44px | -0.5 | Inacessível em mobile |

---

## §4 Bonus Criteria (+0.5 cada)

Premiar até +0.5 pontos bonus para cada qualidade excepcional:

| Bonus | Descrição | Como identificar |
|-------|-----------|------------------|
| **Design Thinking** | Output inclui análise de contexto explícita (WHO/WHAT/WHY) antes do código | Seção de análise antes do código |
| **Token Discipline** | Sistema completo de design tokens (typography, spacing, color, animation, radius) com CSS custom properties | CSS variables para todos os valores de tema |
| **Visual Atmosphere** | Inclui elementos de atmosfera: noise texture, gradient mesh, glassmorphism, ou dramatic layered shadows | Elementos visuais além do básico |
| **Interaction Choreography** | Sequência de page load escalonada/orquestrada, não simultânea | Stagger delays, animações sequenciais |
| **Data Visualization** | Charts com draw-in effects animados, não estáticos | Animações de gráficos |
| **Accessibility Beyond AA** | Vai além do mínimo: skip-to-content link, ARIA live regions, prefers-contrast | Features de acessibilidade avançadas |
| **The Memorability Test** | Pode descrever o design em 10 palavras e NÃO soa como "clean modern dashboard with cards" | Identidade visual única |

**Máximo de bonus acumulável: +3.5**

---

## §5 Benchmark Reference

### Gold Standard: frontend-design-hybrid Skill

- **Path**: `.claude/skills/frontend-design-hybrid/SKILL.md`
- **Score**: 9.1/10 (vencedor de comparação entre 4 skills)
- **Use as**: Calibração de referência para todas as avaliações UI/UX

### 10 Áreas de Avaliação (derivadas do hybrid skill)

1. **Design Thinking** — Força análise de contexto (WHO/WHAT/WHY) antes de código?
2. **Token System** — Usa design tokens sistemáticos (typography, spacing, color, animation, radius)?
3. **Visual Atmosphere** — Inclui "wow factor" (noise textures, gradient mesh, glassmorphism, dramatic shadows)?
4. **Micro-Interactions** — Inclui page load choreography, hover effects, button feedback, scroll reveals?
5. **Data Visualization** — Qualidade de charts, progress indicators, animated data displays
6. **Component Patterns** — Componentes production-quality (CVA variants, cn() helper, responsive strategy)
7. **Accessibility** — WCAG 2.1 AA compliance (contrast, touch targets, semantic HTML, focus states, reduced-motion)
8. **Anti-Patterns Avoidance** — Ausência de visual crimes, UX violations, e technical sins
9. **Pre-Delivery Completeness** — Cobertura do checklist de 28 pontos
10. **The Standard** — O output parece _crafted_, não _generated_? Há visão criativa clara?

### Regra de Calibração

> Qualquer skill que pontuar **acima de 9.1** no mesmo cenário deve **demonstravelmente superar** o output do hybrid skill em qualidade. O avaliador deve citar especificamente em quais dimensões o output excede o benchmark.
