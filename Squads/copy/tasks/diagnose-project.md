# Task: Diagnose Copy Project

**Task ID:** diagnose-project
**Version:** 1.0.0
**Execution Type:** Hybrid (Agent drafts, human confirms)
**Purpose:** Analyze a copywriting project and recommend the best agent/approach

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| project_description | string | Yes | What the user wants to create |
| target_audience | string | No | Who the copy is for |
| product_service | string | No | What's being sold |
| format | string | No | Desired output format (sales letter, email, VSL, etc.) |

## Preconditions

- [ ] copy-chief agent is active
- [ ] User has described their project

---

## Steps

### Step 1: Gather Project Context

**Elicit from user:**
```yaml
questions:
  - "What are you trying to sell or promote?"
  - "Who is your target audience?"
  - "What format do you need? (sales letter, email, landing page, VSL, ad, etc.)"
  - "What's your market awareness level? (or say 'not sure')"
  - "Do you have existing copy to improve, or starting from scratch?"
```

### Step 2: Classify Market Awareness

**Apply Eugene Schwartz's 5 Stages:**
```yaml
awareness_classification:
  unaware: "Prospect doesn't know they have a problem"
  problem_aware: "Knows the problem, not the solution"
  solution_aware: "Knows solutions exist, not your product"
  product_aware: "Knows your product, not convinced"
  most_aware: "Knows and wants, needs a push"

  action_per_level:
    unaware: "Route to eugene-schwartz for deep diagnosis"
    problem_aware: "Route to gary-halbert or joe-sugarman for education-first copy"
    solution_aware: "Route to dan-kennedy or stefan-georgi for mechanism-driven copy"
    product_aware: "Route to bob-bly or joanna-wiebe for conversion optimization"
    most_aware: "Route to john-caples for headline/offer optimization"
```

### Step 3: Classify Format Need

```yaml
format_routing:
  sales_letter: "gary-halbert (classic) or dan-kennedy (template-driven)"
  email_sequence: "joanna-wiebe (conversion) or dan-kennedy (direct response)"
  landing_page: "joanna-wiebe (CRO-focused)"
  vsl: "stefan-georgi (RMBC Method)"
  print_ad: "joe-sugarman (long-form) or john-caples (headline-driven)"
  b2b_copy: "bob-bly (specialist)"
  funnel: "todd-brown (E5 Method)"
  headline: "john-caples (35 formulas)"
  general: "Start with Tier 0 diagnosis"
```

### Step 4: Present Recommendation

**Output format:**
```yaml
diagnosis:
  project_summary: "{summary}"
  market_awareness: "{level}"
  market_sophistication: "{level if known}"
  recommended_agent: "{agent-id}"
  reasoning: "{why this agent}"
  alternative_agents:
    - "{agent-id}: {reason}"
  suggested_workflow:
    - "Step 1: {action}"
    - "Step 2: {action}"
    - "Step 3: {action}"
```

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Diagnosis report | YAML | Market classification + agent recommendation |
| Routing decision | Action | Handoff to recommended agent |

## Validation

- [ ] Market awareness level identified
- [ ] At least 1 agent recommended with reasoning
- [ ] User confirmed routing decision

---

_Task Version: 1.0.0_
_Squad: copy_
