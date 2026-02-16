# Task: Write Email Sequence

**Task ID:** write-email-sequence
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Create email sequences using conversion copywriting and direct response principles
**Agents:** joanna-wiebe, dan-kennedy

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| goal | enum | Yes | "welcome", "nurture", "sales", "launch", "abandoned_cart" |
| product | string | Yes | Product/service |
| audience | string | Yes | Target audience |
| sequence_length | number | No | Number of emails (default: 5-7) |

---

## Email Sequence Types

### Welcome Sequence (5 emails)
```yaml
welcome:
  email_1:
    timing: "Immediately"
    subject: "Welcome + deliver promised lead magnet"
    purpose: "Set expectations, deliver value, introduce yourself"
    template: "Deliver → Introduce → Tease what's coming"

  email_2:
    timing: "Day 2"
    subject: "Your #1 problem with {topic}"
    purpose: "Address the main pain point"
    template: "Problem → Empathy → Quick win/tip"

  email_3:
    timing: "Day 4"
    subject: "The mistake most {audience} make"
    purpose: "Educate + position your solution"
    template: "Mistake → Why it happens → How to fix it (mechanism preview)"

  email_4:
    timing: "Day 6"
    subject: "Case study / story"
    purpose: "Proof through story"
    template: "Before → Discovery → After → How they did it"

  email_5:
    timing: "Day 7"
    subject: "Invitation to next step"
    purpose: "Soft sell or bridge to sales sequence"
    template: "Summary of value → Invitation → No pressure CTA"
```

### Sales Sequence (7 emails)
```yaml
sales:
  email_1:
    timing: "Day 1"
    subject: "Big problem + announcement"
    purpose: "PAS + introduce the offer"
    structure: "Problem → Agitate → Tease solution → Soft CTA"

  email_2:
    timing: "Day 2"
    subject: "Why this solution is different"
    purpose: "Mechanism reveal"
    structure: "Why old solutions fail → Unique mechanism → CTA"

  email_3:
    timing: "Day 3"
    subject: "Social proof"
    purpose: "Testimonials and results"
    structure: "Customer stories → Specific results → CTA"

  email_4:
    timing: "Day 4"
    subject: "Objection handling"
    purpose: "Address the #1 reason people don't buy"
    structure: "Acknowledge doubt → Counter with proof → CTA"

  email_5:
    timing: "Day 5"
    subject: "Bonuses / full offer reveal"
    purpose: "Stack value"
    structure: "Offer stack → Total value → Price → CTA"

  email_6:
    timing: "Day 6"
    subject: "Urgency (48h warning)"
    purpose: "Create time pressure"
    structure: "Deadline → What they'll miss → CTA"

  email_7:
    timing: "Day 7"
    subject: "Last chance + future pacing"
    purpose: "Final push"
    structure: "Last chance → Future with/without → Final CTA → PS"
```

---

## Email Writing Rules

```yaml
rules:
  subject_lines:
    - "Keep under 50 characters"
    - "Curiosity + benefit combo performs best"
    - "Use lowercase for casual feel"
    - "Personalize when possible ({first_name})"
    - "Test subject lines — they're the headline of emails"

  body:
    - "One idea per email"
    - "One CTA per email (repeat it, but same action)"
    - "Open with a hook, not 'Hi {name}, hope you're well'"
    - "Short paragraphs (1-3 sentences)"
    - "Conversational tone — imagine talking to a friend"
    - "Close every email with a clear next step"

  kennedy_rules:
    - "Every email should be WORTH reading even without the pitch"
    - "Use the 7x benefit repetition across the sequence"
    - "Include a P.S. in every sales email"
    - "Give a reason to respond NOW in every email"
```

---

## Outputs

| Output | Description |
|--------|-------------|
| Complete email sequence | All emails with subject lines and body copy |
| Sequence map | Visual flow showing timing and purpose |
| Testing plan | A/B test recommendations for subject lines |

---

_Task Version: 1.0.0_
_Squad: copy_
