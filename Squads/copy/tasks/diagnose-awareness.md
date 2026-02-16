# Task: Diagnose Market Awareness Level

**Task ID:** diagnose-awareness
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Classify a market/prospect using Eugene Schwartz's 5 Stages of Awareness
**Agent:** eugene-schwartz

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | Product or service being sold |
| market | string | Yes | Target market description |
| existing_copy | string | No | Current copy to analyze |

---

## Steps

### Step 1: Market Assessment

Gather information about:
```yaml
assessment_questions:
  - "What does the prospect currently believe about their problem?"
  - "Have they tried other solutions? Which ones?"
  - "Do they know your product exists?"
  - "What's the competitive landscape?"
  - "How saturated is the market with similar claims?"
```

### Step 2: Apply 5 Stages of Awareness

```yaml
stages:
  stage_1_unaware:
    definition: "Prospect doesn't even know they have a problem"
    indicators:
      - "No search volume for problem terms"
      - "Market needs education about the problem itself"
      - "No existing solutions being marketed"
    headline_strategy: "Lead with story, emotion, or identification — NOT the product"
    copy_approach: "Long-form education → problem revelation → solution introduction"
    example: "A story about someone who discovered they were losing $1,000/month without knowing"

  stage_2_problem_aware:
    definition: "Prospect knows the problem but not that solutions exist"
    indicators:
      - "Searches for 'why does X happen?' or 'is X normal?'"
      - "Frustration expressed but no solution-seeking behavior"
    headline_strategy: "Lead with the PROBLEM in vivid, specific terms"
    copy_approach: "Agitate problem → reveal solution category → introduce product"
    example: "'Are you tired of waking up exhausted no matter how much you sleep?'"

  stage_3_solution_aware:
    definition: "Knows solutions exist but hasn't chosen yours"
    indicators:
      - "Comparing options, reading reviews"
      - "Has tried competitors or similar solutions"
    headline_strategy: "Lead with your MECHANISM — why your solution is different"
    copy_approach: "Acknowledge existing solutions → reveal why they fail → present unique mechanism"
    example: "'Unlike other sleep aids that mask the problem, NeuraSleep targets the real cause...'"

  stage_4_product_aware:
    definition: "Knows your product but hasn't bought"
    indicators:
      - "Has visited your page, maybe added to cart"
      - "Follows your brand, reads your emails"
    headline_strategy: "Lead with OFFER — deal, discount, bonus, urgency"
    copy_approach: "Remind benefits → overcome final objections → strong CTA with incentive"
    example: "'Get NeuraSleep today: 50% off + free sleep tracker (48 hours only)'"

  stage_5_most_aware:
    definition: "Knows, wants, ready to buy — just needs a nudge"
    indicators:
      - "Repeat visitors, abandoned carts, email openers"
      - "Already bought related products"
    headline_strategy: "Lead with DEAL — name + price + urgency"
    copy_approach: "Minimal copy. Product name + price + CTA. Remove all friction."
    example: "'NeuraSleep — $29 today only. Free shipping. Click here.'"
```

### Step 3: Apply 5 Levels of Market Sophistication

```yaml
sophistication_levels:
  level_1_first_to_market:
    strategy: "Make a direct, simple claim. You're the only one."
    example: "'This pill will help you lose weight'"

  level_2_enlarged_claim:
    strategy: "Make a BIGGER claim than competitors"
    example: "'Lose 30 pounds in 30 days!'"

  level_3_unique_mechanism:
    strategy: "Introduce a NEW MECHANISM that explains WHY it works"
    example: "'The sea-kelp extract that targets belly fat at the cellular level'"

  level_4_expanded_mechanism:
    strategy: "Make the mechanism MORE detailed and specific"
    example: "'Patented KelpTrim™ with 47 micro-nutrients that activate brown fat cells'"

  level_5_identification:
    strategy: "Forget claims — connect through IDENTITY and story"
    example: "'For women who've tried everything and refuse to give up'"
```

### Step 4: Generate Diagnosis Report

```yaml
output_template:
  market_awareness:
    current_stage: "{1-5}"
    stage_name: "{name}"
    evidence: "{why this classification}"

  market_sophistication:
    current_level: "{1-5}"
    level_name: "{name}"
    evidence: "{why this classification}"

  copy_strategy:
    headline_approach: "{strategy for this awareness + sophistication combo}"
    copy_structure: "{recommended structure}"
    key_elements: ["{element_1}", "{element_2}", "{element_3}"]
    avoid: ["{anti_pattern_1}", "{anti_pattern_2}"]

  recommended_agent: "{best agent for execution}"
  reasoning: "{why}"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| Awareness classification (1-5) | With evidence |
| Sophistication classification (1-5) | With evidence |
| Copy strategy recommendation | Headline + structure + elements |
| Agent routing | Which agent should write the copy |

## Validation

- [ ] Both classifications made with evidence
- [ ] Strategy matches classification (not generic advice)
- [ ] Recommended agent aligns with project needs

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: eugene-schwartz_
