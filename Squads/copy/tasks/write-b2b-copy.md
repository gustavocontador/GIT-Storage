# Task: Write B2B Copy

**Task ID:** write-b2b-copy
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Create business-to-business copy using systematic frameworks
**Agent:** bob-bly

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | B2B product/service |
| audience | string | Yes | Target business audience (role, industry, company size) |
| format | enum | Yes | "white_paper", "case_study", "product_page", "email", "ad", "brochure" |
| technical_level | enum | No | "executive", "technical", "mixed" |

---

## B2B Copywriting Framework (Bob Bly)

### 5-Step Motivating Sequence

```yaml
motivating_sequence:
  step_1_attention: "Headline/opener that addresses a business pain"
  step_2_problem: "Show you understand their operational challenge"
  step_3_solution: "Present your product as the logical solution"
  step_4_proof: "ROI data, case studies, implementation results"
  step_5_action: "Clear next step — demo, call, download, trial"
```

### 4S Formula for Clarity

```yaml
four_s:
  short_sentences: "Keep sentences under 20 words for complex topics"
  simple_words: "Avoid jargon unless speaking to technical peers"
  specific_details: "Use exact numbers: 'reduces processing time by 47%'"
  straightforward_structure: "One point per paragraph, logical flow"
```

### B2B vs B2C Differences

```yaml
b2b_specifics:
  decision_makers: "Multiple — address all stakeholders"
  buying_cycle: "Longer — nurture with content sequence"
  proof_type: "ROI, case studies, implementation data (not testimonials alone)"
  tone: "Professional but not corporate-speak"
  cta: "Demo, trial, consultation (not 'buy now')"
  features_matter: "In B2B, features ARE important (specs, integrations, compliance)"
  risk: "Career risk — buyer's job depends on good decisions"
```

---

## Format-Specific Guidance

### White Paper Structure
```yaml
white_paper:
  title: "Address a business problem (not your product)"
  executive_summary: "Problem + approach + key findings (1 page)"
  problem_section: "Industry data, trends, cost of status quo"
  solution_approach: "Methodology (product-agnostic at first)"
  your_solution: "How your product implements the approach"
  case_studies: "2-3 customer results with specific metrics"
  conclusion: "Summary + recommended next steps"
  length: "6-12 pages"
```

### Case Study Structure
```yaml
case_study:
  headline: "Result-focused: '{Company} achieved {metric} using {product}'"
  challenge: "Client's problem in their words"
  solution: "How your product was implemented"
  results: "Specific, measurable outcomes (ROI, time saved, revenue)"
  quote: "Client testimonial supporting the results"
  length: "1-2 pages"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| B2B copy | Complete copy in chosen format |
| Stakeholder map | Which decision makers are addressed |
| Proof inventory | ROI data and case studies used |

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: bob-bly_
