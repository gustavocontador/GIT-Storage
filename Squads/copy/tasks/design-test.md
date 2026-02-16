# Task: Design Split Test

**Task ID:** design-test
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Design A/B tests for copy elements using scientific advertising principles
**Agent:** claude-hopkins

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | enum | Yes | "headline", "lead", "offer", "cta", "email_subject", "full_page" |
| current_copy | string | No | Existing copy to test against |
| hypothesis | string | No | What you think will improve performance |
| traffic_volume | string | No | Expected traffic/audience size |

---

## Scientific Testing Principles (Hopkins)

```yaml
principles:
  1_test_one_thing: "Change ONE element at a time. If you change headline AND offer, you won't know which caused the result."
  2_measurable_outcome: "Every test must have a specific, measurable outcome (clicks, conversions, revenue, response rate)."
  3_sufficient_sample: "Run tests long enough to reach statistical significance. Minimum 100 conversions per variant."
  4_document_everything: "Record every test, every result. Build an evidence base, not opinions."
  5_scale_winners: "Once you find a winner, scale it. Then test the next element."
```

## Test Design Template

```yaml
test_plan:
  test_id: "CP-TEST-{number}"
  element: "{what you're testing}"
  hypothesis: "Changing {element} from {A} to {B} will increase {metric} because {reasoning}"

  control_a:
    description: "{current version}"
    copy: "{exact copy}"

  variant_b:
    description: "{proposed change}"
    copy: "{exact copy}"
    change_reason: "{why this should perform better}"

  success_metric: "{primary KPI}"
  secondary_metrics: ["{metric_1}", "{metric_2}"]

  sample_size: "{minimum per variant}"
  duration: "{minimum run time}"
  confidence_level: "95%"

  decision_rules:
    if_b_wins: "Implement B, test next element"
    if_a_wins: "Keep A, develop new hypothesis"
    if_no_difference: "Elements equivalent — test something with higher impact"
```

## Test Priority Matrix

```yaml
priority:
  high_impact:
    - "Headlines (biggest lever — test FIRST)"
    - "Offer/price"
    - "CTA button text and placement"
    - "Lead/opening paragraph"

  medium_impact:
    - "Email subject lines"
    - "Testimonials (which ones, placement)"
    - "Guarantee wording"
    - "Image vs no image"

  low_impact:
    - "Font size/color"
    - "Button color"
    - "Minor wording changes"
    - "Layout tweaks"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| Test plan document | Complete A/B test design |
| Hypothesis | Clear, testable hypothesis |
| Success criteria | How to determine a winner |
| Test calendar | Suggested sequence of tests |

---

_Task Version: 1.0.0_
_Squad: copy_
_Agent: claude-hopkins_
