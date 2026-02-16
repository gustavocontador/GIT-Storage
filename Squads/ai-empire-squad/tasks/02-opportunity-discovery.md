# Task: Opportunity Discovery

**ID:** opportunity-discovery
**Tier:** Tier 2 (Roundtable) + Mentor
**Duration:** 2-3 days
**Elicit:** true

## Objective

Identify 5+ high-potential business opportunities aligned with your vision and capabilities. Each opportunity includes market analysis, AI angle, and revenue potential.

## What Happens

The Tier 2 Roundtable researches opportunities from three angles:

- **AI Strategist:** "What unique AI products can we build?"
- **Business Strategist:** "What markets are hot and profitable?"
- **Product Manager:** "What problems desperately need solving?"

Each presents 2-3 opportunities, then combined into top 5 candidates.

## Elicitation Points

### 1. Market Preferences
```
What markets interest you?
- [ ] B2B SaaS
- [ ] B2C Consumer
- [ ] Creator Economy
- [ ] Enterprise Software
- [ ] APIs & Developer Tools
- [ ] No preference - show me everything
```

### 2. Problem Space
```
What problems excite you?
- [ ] Automation (make things faster/cheaper)
- [ ] AI-powered experiences (use Claude)
- [ ] Data intelligence (analytics)
- [ ] Communication/collaboration
- [ ] No preference - show me everything
```

### 3. Research Inputs
```
Provide any research or ideas you've been thinking about:
- URLs of interesting products?
- Customer segments you know?
- Problems you've experienced?
- Competitive products you admire?
```

### 4. Feasibility
```
Solo founder considerations:
- Can one person execute this? (be honest)
- Any domains where you have unfair advantage?
- Any domains to avoid?
```

## Squad Activities

### Days 1-2: Research
- **AI Strategist:** Research latest Claude/AI capabilities, identify novel applications
- **Business Strategist:** Market analysis, TAM sizing, revenue model research
- **Product Manager:** Competitive analysis, user problem research
- **Business Strategist:** Interview 10+ potential customers

### Day 3: Synthesis
- Combine research into 5 opportunity briefs
- Each brief includes:
  - Market size & growth rate
  - Target customer segment
  - Core value proposition
  - Revenue model & pricing
  - Competitive analysis
  - AI/technical differentiation
  - Estimated effort to MVP
  - Risk assessment
- Score each on viability (1-10)

## Output Format

For each opportunity, produce:

```markdown
## [Opportunity Name]

**Score:** 8.2/10

### Market
- **TAM:** $X billion
- **Growth:** X% YoY
- **Target Customer:** [Who exactly]

### Value Proposition
- **Core Problem:** [What pain]
- **Our Unique Solution:** [Differentiation]
- **Why Now:** [Market timing]

### Business Model
- **Revenue Model:** [How money]
- **Pricing:** $X/month or X% take rate
- **Unit Economics:** [CAC:LTV ratio]

### AI Angle
- **Claude Advantage:** [Why Claude is essential]
- **Agent Architecture:** [How agents help]

### Execution
- **MVP Timeline:** 2 weeks
- **Key Risks:** [Top 3 risks]
- **Required Skills:** [What you need]

### Next Steps
- If chosen: [Specific validation steps]
```

## Success Criteria

- [ ] 5+ opportunities identified
- [ ] Market data supports viability
- [ ] Each has clear AI/AI-native angle
- [ ] Feasibility assessed for solo founder
- [ ] Ready for Roundtable Decision

## Next Task

Once complete: **Roundtable Decision** (Task 03)

## Running This Task

```bash
*task opportunity-discovery
```

**Who runs it:** Roundtable (AI, Business, Product strategists)
**Input needed:** Your answers to elicitation questions
**Duration:** 2-3 days
**Output location:** `./squads/ai-empire-squad/docs/opportunities/`
