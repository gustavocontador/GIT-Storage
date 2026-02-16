# Task: Write VSL (Video Sales Letter)

**Task ID:** write-vsl
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Create a complete VSL script using the RMBC Method
**Agent:** stefan-georgi

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | Product/service being sold |
| audience | string | Yes | Target audience |
| price_point | string | Yes | Price of the offer |
| mechanism | string | No | Unique mechanism (if known) |
| duration_target | string | No | Target VSL length (short: 5-15min, medium: 15-30min, long: 30-60min) |

---

## RMBC Method Steps

### Phase R: RESEARCH (40% of total time)

```yaml
research_outputs:
  prospect_profile:
    demographics: "{age, gender, income, location}"
    psychographics: "{fears, desires, frustrations, dreams}"
    language: "{exact words they use to describe their problem}"
    failed_solutions: "{what they've tried and why it didn't work}"

  market_analysis:
    awareness_level: "{from Schwartz's 5 Stages}"
    sophistication_level: "{from Schwartz's 5 Levels}"
    competitors: "{who else is selling to this audience}"

  product_deep_dive:
    core_benefit: "{the ONE thing this product does}"
    proof_points: ["{result_1}", "{result_2}", "{result_3}"]
    unique_ingredient: "{what makes this different}"
```

### Phase M: MECHANISM (The Secret Weapon)

```yaml
mechanism_development:
  definition: "The unique explanation of WHY your solution works when others failed"

  mechanism_formula:
    step_1: "Name the mechanism (give it a branded name)"
    step_2: "Explain WHY previous solutions failed (without the mechanism)"
    step_3: "Reveal HOW the mechanism works (simplified science)"
    step_4: "Show PROOF the mechanism works (studies, testimonials)"
    step_5: "Connect mechanism to the product"

  mechanism_test:
    - "Is it unique? (not used by competitors)"
    - "Is it believable? (grounded in logic or science)"
    - "Is it simple? (explainable in 2-3 sentences)"
    - "Does it explain WHY old solutions failed?"
    - "Does it make the product the obvious choice?"
```

### Phase B: BRIEF (The Blueprint)

```yaml
brief_sections:
  lead:
    purpose: "Hook attention in first 30 seconds"
    types: ["Story Lead", "Problem Lead", "Curiosity Lead", "Proof Lead"]
    length: "1-3 minutes"

  problem_amplification:
    purpose: "Make prospect feel the pain deeply"
    elements: ["Relatable scenario", "Emotional stakes", "Cost of inaction"]
    length: "3-5 minutes"

  mechanism_reveal:
    purpose: "Introduce your unique mechanism"
    elements: ["Why old solutions fail", "The discovery", "How it works", "Proof"]
    length: "5-10 minutes"

  product_introduction:
    purpose: "Connect mechanism to your specific product"
    elements: ["What it is", "How to use it", "What to expect"]
    length: "3-5 minutes"

  proof_stack:
    purpose: "Overwhelm with evidence"
    elements: ["Testimonials", "Before/after", "Studies", "Expert endorsements"]
    length: "5-8 minutes"

  offer_stack:
    purpose: "Build value then reveal price"
    elements: ["Core product", "Bonus 1-3", "Total value", "Actual price", "Guarantee"]
    length: "5-8 minutes"

  close:
    purpose: "Drive action NOW"
    elements: ["Urgency", "Scarcity", "Future pacing", "CTA", "Final reminder"]
    length: "2-3 minutes"
```

### Phase C: COPY (Assembly)

```yaml
copy_assembly:
  step_1: "Write the Lead (hook must work in first 10 seconds)"
  step_2: "Write each Brief section as standalone copy"
  step_3: "Add transitions between sections (Seeds of Curiosity)"
  step_4: "Write the Offer Stack (most important section after Lead)"
  step_5: "Write the Close with urgency"
  step_6: "Add pattern interrupts every 3-5 minutes"
  step_7: "Read aloud — must sound conversational, not written"
  step_8: "Time the script (150 words ≈ 1 minute of video)"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| VSL Script | Complete script with stage directions |
| Mechanism Document | Named mechanism with 5-point test |
| Brief Summary | Blueprint of all sections |
| Timing Notes | Estimated duration per section |

## Validation

- [ ] Mechanism passes 5-point test
- [ ] Lead hooks in first 10 seconds
- [ ] All Brief sections present
- [ ] Script reads naturally aloud
- [ ] Offer stack builds value before price
- [ ] At least 3 proof elements included
- [ ] CTA is clear and urgent

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: stefan-georgi_
