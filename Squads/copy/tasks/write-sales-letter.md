# Task: Write Sales Letter

**Task ID:** write-sales-letter
**Version:** 1.0.0
**Execution Type:** Agent
**Purpose:** Create a complete sales letter using proven direct response frameworks
**Agents:** gary-halbert, dan-kennedy

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product | string | Yes | Product/service being sold |
| audience | string | Yes | Target audience description |
| awareness_level | string | No | From diagnose-awareness task |
| offer | string | Yes | The offer (price, bonuses, guarantee) |
| tone | string | No | Preferred tone (default: conversational) |
| method | enum | No | "halbert" (story-driven) or "kennedy" (template-driven) |

---

## Method A: Gary Halbert Style

### Structure (Story-Driven)
```yaml
halbert_structure:
  1_envelope: "A-Pile format — handwritten look, personal feel"
  2_grabber: "Physical grabber or shocking opener"
  3_headline: "Curiosity + benefit driven"
  4_lead: "Story that mirrors prospect's situation"
  5_problem: "Vivid description of the problem (starving crowd language)"
  6_agitation: "Make the pain unbearable"
  7_solution: "Introduce product as natural next step in story"
  8_proof: "Testimonials, results, specifics"
  9_offer: "Irresistible offer with bonuses"
  10_guarantee: "Risk reversal (100% or better)"
  11_urgency: "Reason to act NOW"
  12_close: "Clear CTA with multiple response options"
  13_ps: "2-3 P.S. sections (restate key benefit, urgency, bonus)"
```

### Halbert Checklist
- [ ] Does it pass the A-Pile test? (Would you open this?)
- [ ] Is there a starving crowd for this?
- [ ] Does the story feel personal and real?
- [ ] Are there specific numbers and proof?
- [ ] Is the guarantee bold enough?
- [ ] Do the P.S. sections work standalone?

---

## Method B: Dan Kennedy Style

### Structure (28-Step Template)
```yaml
kennedy_28_steps:
  1: "Get attention with a provocative headline"
  2: "Immediately expand with a sub-headline"
  3: "Present the problem vividly"
  4: "Promise a solution"
  5: "Establish your credibility"
  6: "Show the benefits (not features)"
  7: "Tell the prospect what to do"
  8: "Motivate immediate action"
  9: "Use the PAS formula throughout"
  10: "Include proof and testimonials"
  11: "Make a specific, clear offer"
  12: "Add bonuses that exceed the price"
  13: "Build value before revealing price"
  14: "Guarantee satisfaction or better"
  15: "Create urgency and scarcity"
  16: "Tell them exactly what to do (CTA)"
  17: "Give multiple ways to respond"
  18: "Add P.S. sections"
  19: "Format for readability"
  20: "Use short paragraphs"
  21: "Include subheads every 3-5 paragraphs"
  22: "Highlight key points (bold, underline)"
  23: "Include bullet points for benefits"
  24: "Add a Johnson Box at the top"
  25: "Use specifics, not generalities"
  26: "Address objections within the copy"
  27: "Include a response device"
  28: "Review against 10 Rules of Direct Marketing"
```

### Kennedy Checklist (10 Rules)
- [ ] There IS a clear offer
- [ ] There IS a reason to respond NOW
- [ ] There ARE clear instructions for responding
- [ ] There IS tracking/measurement built in
- [ ] There IS follow-up planned
- [ ] The copy IS strong (benefit-focused)
- [ ] Results RULE (not opinions)
- [ ] Everything IS specific (numbers, dates, names)
- [ ] There IS a guarantee
- [ ] There ARE multiple benefits stated 7+ times

---

## Steps

### Step 1: Research (Before Writing)
```yaml
research_checklist:
  - "Who is the starving crowd? What keeps them up at night?"
  - "What have they tried before? Why did it fail?"
  - "What's the unique mechanism of this product?"
  - "What proof/results can we cite?"
  - "What's the irresistible offer?"
```

### Step 2: Draft the Letter
- Choose method (Halbert or Kennedy) based on project
- Follow the structure step by step
- Write the P.S. sections FIRST (they're read most)
- Write the headline LAST (after you know the strongest benefit)

### Step 3: Review and Polish
- Run the appropriate checklist (Halbert or Kennedy)
- Apply Joe Sugarman's Slippery Slide test (does each line lead to the next?)
- Check readability (short sentences, short paragraphs)
- Verify all claims have proof

---

## Outputs

| Output | Description |
|--------|-------------|
| Complete sales letter | Full text following chosen structure |
| Review checklist | Completed checklist with pass/fail |
| Improvement notes | Suggested optimizations |

---

_Task Version: 1.0.0_
_Squad: copy_
