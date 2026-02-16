# Task: Write Headlines

**Task ID:** write-headlines
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Generate proven headlines using Caples' 35 formulas and testing methodology
**Agent:** john-caples

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | Product/service |
| key_benefit | string | Yes | Primary benefit to communicate |
| audience | string | Yes | Target audience |
| format | enum | No | "ad", "email_subject", "landing_page", "blog", "social" |
| quantity | number | No | How many headlines to generate (default: 10) |

---

## Caples' 35 Headline Formulas

```yaml
headline_formulas:
  # HOW-TO (Most consistently effective category)
  formula_1: "How to {benefit}"
  formula_2: "How I {achieved result}"
  formula_3: "How {famous/relatable person} {achieves result}"
  formula_4: "How to {benefit} without {pain/sacrifice}"
  formula_5: "How to {benefit} in {specific timeframe}"

  # WHY
  formula_6: "Why {surprising fact}"
  formula_7: "{Number} reasons why {claim}"
  formula_8: "Why some {people} {achieve} while others {fail}"

  # QUESTION
  formula_9: "Do you {have this problem}?"
  formula_10: "Can you {pass this test/answer this question}?"
  formula_11: "Who else wants {benefit}?"
  formula_12: "What {everybody} should know about {topic}"

  # COMMAND
  formula_13: "Give me {small commitment} and I'll {big promise}"
  formula_14: "Stop {doing this wrong thing}"
  formula_15: "Put {product} to work for you"

  # NEWS
  formula_16: "Announcing: {new product/feature}"
  formula_17: "Now you can {previously impossible benefit}"
  formula_18: "At last: {solution to persistent problem}"
  formula_19: "New {product} {does what old couldn't}"

  # TESTIMONIAL
  formula_20: "'{Exact customer quote about result}'"
  formula_21: "They laughed when I {did something} — but when I {result}!"
  formula_22: "I was {in bad situation} until I {discovered solution}"

  # SPECIFIC PROOF
  formula_23: "{Specific number} {achieved result} in {timeframe}"
  formula_24: "{Percentage} of {group} {achieved result}"
  formula_25: "From {bad state} to {good state} in {timeframe}"

  # CURIOSITY
  formula_26: "The secret of {desirable outcome}"
  formula_27: "Little-known {method/way} to {benefit}"
  formula_28: "What {experts} don't tell you about {topic}"

  # WARNING
  formula_29: "Warning: Don't {common mistake} until you {read this}"
  formula_30: "{Number} mistakes {people} make with {topic}"

  # STORY
  formula_31: "The {person} who {unexpected achievement}"
  formula_32: "A {surprising fact} that {leads to benefit}"

  # BENEFIT-DRIVEN
  formula_33: "Get {specific benefit} — guaranteed"
  formula_34: "The easy way to {difficult task}"
  formula_35: "If you {qualifying condition}, you can {big benefit}"
```

## 4 Qualities Every Headline Must Have

```yaml
headline_qualities:
  self_interest: "Does it promise a benefit the reader cares about?"
  news: "Does it announce something new or different?"
  curiosity: "Does it make the reader want to know more?"
  quick_easy: "Does it suggest a quick or easy path to the benefit?"

  scoring: "A great headline hits 2-3 of these. A legendary headline hits all 4."
```

## Steps

### Step 1: Select Best Formulas for Context
- Match formulas to awareness level and format
- Select 5-7 most relevant formulas

### Step 2: Generate Headlines
- Apply each selected formula with product/benefit specifics
- Create 2-3 variations per formula
- Apply Specifics Rule: replace vague words with numbers

### Step 3: Score and Rank
- Score each headline against 4 Qualities (0-4)
- Rank by total score
- Present top 10 with scores and reasoning

### Step 4: Suggest Test Plan
- Recommend top 3 for A/B testing
- Suggest test structure and success metrics

---

## Outputs

| Output | Description |
|--------|-------------|
| Ranked headlines | 10+ headlines with quality scores |
| Formula reference | Which formula each headline uses |
| Test plan | A/B test recommendation |

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: john-caples_
