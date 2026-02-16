# Task: Build Funnel Copy

**Task ID:** build-funnel-copy
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Create complete funnel copy strategy using the E5 Method
**Agent:** todd-brown

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | Product/service |
| audience | string | Yes | Target audience |
| price_point | string | Yes | Price of the offer |
| funnel_type | enum | No | "webinar", "vsl", "challenge", "trip_wire", "high_ticket" |

---

## E5 Method Steps

### Phase E1: EXAMINE

```yaml
examine:
  purpose: "Understand the market landscape before creating anything"
  outputs:
    market_map:
      - "Who else is selling to this audience?"
      - "What claims are being made?"
      - "What mechanisms are being used?"
      - "What's working? What's saturated?"
    prospect_deep_dive:
      - "What have they tried before?"
      - "Why did those solutions fail?"
      - "What do they believe about the problem?"
      - "What would make them buy TODAY?"
```

### Phase E2: ENGINEER

```yaml
engineer:
  purpose: "Build the offer and funnel architecture"
  outputs:
    big_marketing_idea:
      definition: "The ONE concept that makes your campaign stand out"
      test: "Is it unique? Is it emotionally compelling? Is it intellectually interesting?"
    funnel_thesis:
      definition: "The core argument your funnel makes from ad to checkout"
      structure: "Because [mechanism] → You get [transformation] → Without [sacrifice]"
    offer_stack:
      core: "The main product/service"
      bonuses: "3-5 value-adds that enhance the core"
      guarantee: "Risk reversal that proves confidence"
      urgency: "Legitimate reason to act now"
```

### Phase E3: EVALUATE

```yaml
evaluate:
  purpose: "Test with minimum viable funnel before full build"
  mvf_components:
    - "1 ad with Big Marketing Idea"
    - "1 landing page with Funnel Thesis"
    - "1 offer page with Offer Stack"
  success_metrics:
    - "Cost per lead"
    - "Landing page conversion rate"
    - "Cost per acquisition"
  decision: "If metrics hit baseline → proceed to Enhance. If not → back to Engineer."
```

### Phase E4: ENHANCE

```yaml
enhance:
  purpose: "Optimize each element using A.S.I.S.T."
  asist_process:
    A_analyze: "Identify the weakest conversion point"
    S_strategize: "Develop hypothesis for improvement"
    I_implement: "Create variation"
    S_split_test: "Run A/B test"
    T_track: "Measure and document results"
```

### Phase E5: EXPAND

```yaml
expand:
  purpose: "Scale what works"
  actions:
    - "Increase ad spend on winning campaigns"
    - "Add traffic sources"
    - "Create additional funnels for same audience"
    - "Build back-end offers"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| Big Marketing Idea | Named concept for the campaign |
| Funnel Thesis | Core argument from ad to checkout |
| Offer Stack | Complete offer architecture |
| Funnel Copy Map | Copy needed for each funnel step |
| MVF Plan | Minimum viable funnel for testing |

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: todd-brown_
