# Task: Write Landing Page Copy

**Task ID:** write-landing-page
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Create high-converting landing page copy using conversion copywriting methodology
**Agent:** joanna-wiebe

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | Product/service |
| audience | string | Yes | Target audience |
| goal | enum | Yes | "lead_gen", "sales", "webinar_signup", "free_trial" |
| voc_data | string | No | Voice-of-customer data (reviews, surveys, interviews) |

---

## Conversion Copywriting Process

### Phase 1: Research & Discovery

```yaml
voc_mining:
  sources:
    - "Customer reviews (Amazon, G2, Trustpilot)"
    - "Survey responses"
    - "Customer interviews"
    - "Support tickets"
    - "Social media comments"
    - "Reddit/forum discussions"

  what_to_extract:
    pain_quotes: "Exact words customers use to describe their frustration"
    desire_quotes: "Exact words for what they want"
    hesitation_quotes: "Exact words for why they haven't bought"
    outcome_quotes: "Exact words for results they got"

  golden_rule: "Use THEIR words, not yours. The best copy sounds like the customer talking to themselves."
```

### Phase 2: Strategy & Wireframe

```yaml
landing_page_structure:
  above_the_fold:
    hero_headline: "Based on #1 pain or desire from VOC mining"
    sub_headline: "Expand on the promise"
    hero_cta: "Clear, benefit-driven button text"
    social_proof_bar: "Logos, ratings, customer count"

  problem_section:
    approach: "PAS (Problem-Agitate-Solve)"
    content: "Mirror the frustration using VOC language"

  solution_section:
    approach: "Rule of One — ONE big idea, ONE promise"
    content: "How the product solves the specific problem"
    mechanism: "Why this solution works differently"

  proof_section:
    testimonials: "3-5 customer testimonials using VOC language"
    results: "Specific numbers, before/after"
    trust_badges: "Security, guarantees, certifications"

  features_benefits:
    approach: "Benefits first, features as proof"
    format: "Benefit headline + feature explanation"

  objection_handling:
    format: "FAQ or objection-response blocks"
    source: "From VOC hesitation quotes"

  final_cta:
    urgency: "Reason to act now"
    guarantee: "Risk reversal"
    cta_button: "Action-oriented, benefit-driven"
```

### Phase 3: Writing

```yaml
writing_rules:
  rule_of_one:
    - "ONE reader (write to a specific person)"
    - "ONE big idea (not 5 selling points)"
    - "ONE promise (the core transformation)"
    - "ONE offer (don't confuse with options)"

  clarity_rules:
    - "If it's not clear, it's not converting"
    - "8th grade reading level max"
    - "One idea per paragraph"
    - "Short sentences (15 words average)"
```

### Phase 4: Seven Sweeps (Editing)

```yaml
seven_sweeps:
  sweep_1_clarity:
    question: "Is every sentence immediately understandable?"
    action: "Remove jargon, simplify complex ideas"

  sweep_2_voice_tone:
    question: "Does this sound like the brand? Is tone consistent?"
    action: "Adjust formality, personality, energy"

  sweep_3_so_what:
    question: "For each claim, has the reader's 'so what?' been answered?"
    action: "Add 'which means...' after features"

  sweep_4_prove_it:
    question: "Is every claim backed by proof?"
    action: "Add data, testimonials, case studies"

  sweep_5_zero_risk:
    question: "Have all perceived risks been addressed?"
    action: "Add guarantees, address objections"

  sweep_6_specificity:
    question: "Are there vague words that could be more specific?"
    action: "Replace 'many' with '2,847', 'fast' with '14 seconds'"

  sweep_7_empathy:
    question: "Does this feel like it was written FOR the reader?"
    action: "Check for company-centric language, flip to reader-centric"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| Landing page copy | Complete wireframed copy for all sections |
| VOC mining summary | Key quotes and insights extracted |
| Seven Sweeps checklist | Completed editing pass |

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: joanna-wiebe_
