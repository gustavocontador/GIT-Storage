# ⚡ Team Taxonomy Squad - Quick Start (5 Minutes)

## The Simplest Way to Start

### Step 1: Call the Orchestrator (30 seconds)
```
Start: @team-taxonomy-chief
Ask: "What should I do about [your situation]?"
```

The chief will route you to the right specialist(s) automatically.

---

## Three Most Common Scenarios

### 🏗️ Scenario 1: "I'm Designing a New Organization"

**Duration:** 1-2 days  
**Complexity:** Medium

```
1. Start: @team-taxonomy-chief
2. Chief routes: ruth-malan (diagnosis) 
3. Then routes: matthew-skelton (design)
4. Then routes: manuel-pais (interactions)
5. Output: Complete org design
```

**Or run directly:**
```
Run workflow: wf-design-team-structure
```

---

### 🩺 Scenario 2: "My Organization is Broken"

**Duration:** 2-3 hours  
**Complexity:** Low

```
1. Start: @team-taxonomy-chief
2. Chief routes: ruth-malan (diagnose)
3. Ruth identifies root cause
4. Chief routes: matthew-skelton OR manuel-pais (fix)
5. Output: Recommended fixes + action plan
```

**Or run directly:**
```
Run workflow: wf-org-health-check
```

---

### 🤖 Scenario 3: "I'm Building an AI Agent Squad"

**Duration:** 4-6 hours  
**Complexity:** Medium-High

```
1. Start: @team-taxonomy-chief
2. Chief routes: matthew-skelton (topology)
3. Then routes: barry-hawkins (orchestration)
4. Then routes: yoav-shoham (validation)
5. Output: Validated agent design with safety gates
```

**Or run directly:**
```
Run workflow: wf-validate-ai-agents
```

---

## The 6 Specialists (Quick Guide)

| Agent | Use When | Time | Call |
|-------|----------|------|------|
| **ruth-malan** | "I need to diagnose what's wrong" | 45 min | 🔍 Direct |
| **matthew-skelton** | "I need to design team structure" | 1-2 hrs | 👔 Direct |
| **manuel-pais** | "Teams need better interactions" | 1-2 hrs | 👥 Direct |
| **barry-hawkins** | "I'm designing AI agents" | 1-2 hrs | 🤖 Direct |
| **yoav-shoham** | "I need to validate agent protocols" | 1-2 hrs | 🧮 Direct |
| **team-taxonomy-chief** | "I'm not sure where to start" | 30 min | 🎭 Always Start |

---

## The 4 Key Concepts (30 seconds each)

### 1. **4 Team Types** (Matthew Skelton)
```
Stream-Aligned  → Own business value
Platform        → Enable other teams
Enabling        → Teach others (temporary)
Complicated     → Handle hard problems
```

### 2. **3 Interaction Modes** (Manuel Pais)
```
Collaboration   → Sync, high-touch (time-boxed)
X-as-a-Service  → Async, stable service
Facilitation    → Coaching, temporary
```

### 3. **5 Problem Types** (Ruth Malan)
```
Structure       → Teams are wrong
Interaction     → Teams are right, interact wrong
Governance      → Unclear decision authority
Tools/Process   → Infrastructure broken
Culture         → Trust/sharing issues
```

### 4. **Conway's Law** (Architecture ↔ Organization)
```
Design org structure → System architecture emerges
Org structure shapes → How system will look
Therefore: Design org intentionally
```

---

## Decision Tree (Choose Your Path)

```
START: "I have an org question"
  │
  ├─ "I don't know what's wrong"
  │   └─→ @team-taxonomy-chief (routes you)
  │
  ├─ "I know it's broken, need diagnosis"
  │   └─→ @ruth-malan (Tier 0 diagnostic)
  │
  ├─ "I need to design team structure"
  │   └─→ @matthew-skelton (Tier 1 design)
  │
  ├─ "Teams need better interactions"
  │   └─→ @manuel-pais (Tier 1 design)
  │
  ├─ "I'm designing AI agents"
  │   └─→ @barry-hawkins (Tier 2 orchestration)
  │
  └─ "I need to validate agent protocols"
      └─→ @yoav-shoham (Tier 2 validation)
```

---

## Key Files (Bookmark These)

| File | Purpose | Read Time |
|------|---------|-----------|
| **README.md** | Complete guide | 20 min |
| **INDEX.md** | Navigation + learning paths | 10 min |
| **QUICK-START.md** | This file | 5 min |
| **config.yaml** | Full reference | 5 min |
| **QUALITY-DASHBOARD.md** | Quality metrics | 10 min |

---

## Pro Tips (Learn Fast)

### Tip 1: Start with Chief, Not Specialists
```
❌ Wrong: "I need help with interactions. Call @manuel-pais"
✅ Right: Call @team-taxonomy-chief first (chief routes you)
```

### Tip 2: Diagnose Before Restructuring
```
❌ Wrong: "We need to reorganize!" (guess)
✅ Right: "Let ruth diagnose first" (know)
```

### Tip 3: Try Cheap Fixes First
```
Interaction fixes:    2-3 weeks + low cost
Governance fixes:     1-2 weeks + low cost
Restructuring:        2-6 months + high cost

Always try the first two before restructuring!
```

### Tip 4: Use Workflows for Big Changes
```
Single consultation:  Call a specialist directly
Complete transformation: Run a workflow (orchestrates all)
```

### Tip 5: Workflows Have Checkpoints
```
Each phase has:
├─ Clear inputs
├─ Specific actions
├─ Concrete outputs
├─ Quality checkpoints
└─ Success criteria
```

---

## The Fastest Paths (Time Hacks)

### "I need quick guidance" (30 minutes)
```
@team-taxonomy-chief → 30 min conversation
Output: Which workflow to run + initial guidance
```

### "I need a diagnosis" (1 hour)
```
@ruth-malan → Socio-technical analysis
Output: Root cause + problem type classification
```

### "I need a design" (2-4 hours)
```
@matthew-skelton → Team topology design
@manuel-pais → Interaction pattern design
Output: Complete design ready to implement
```

### "I need validation" (2-3 hours)
```
@barry-hawkins → Orchestration design
@yoav-shoham → Game-theoretic validation
Output: Proven design with safety gates
```

---

## Common Questions

**Q: Where do I start?**
A: Always call `@team-taxonomy-chief` first. Chief routes you correctly.

**Q: How long will this take?**
A: Diagnosis (1-2 hrs), Design (2-4 hrs), Validation (3-6 hrs)

**Q: Do I need to understand all 4 frameworks?**
A: No. Specialists apply frameworks. You understand the results.

**Q: Can I just call one specialist?**
A: Yes! But chief coordinates multi-specialist workflows better.

**Q: What if I disagree with recommendations?**
A: Valid! Recommendations are based on frameworks, not dogma.

**Q: How do I implement the design?**
A: Use `squad-creator` to build agents, `dev` squad to implement

---

## Success Checklist

After working with the squad, you should have:

- ✅ Clear understanding of your organizational problem
- ✅ Root cause identified (not just symptoms)
- ✅ Recommended fixes (prioritized by impact)
- ✅ Action plan with timeline
- ✅ Success metrics to measure progress
- ✅ Risks and mitigations identified

---

## Next Steps

### Right Now (5 minutes)
1. Read this QUICK-START.md ✓
2. Note down your situation
3. Pick the matching scenario above

### Today (30 minutes)
1. Call `@team-taxonomy-chief`
2. Describe your situation
3. Get routed to right specialist(s)

### This Week (2-3 hours)
1. Follow the workflow
2. Get recommendations
3. Create action plan

### Next Week (varies)
1. Execute recommendations
2. Measure results
3. Iterate based on feedback

---

## Shortcuts

```
Design New Org:         Run: wf-design-team-structure
Fix Broken Org:         Run: wf-org-health-check
Design AI Agents:       Run: wf-validate-ai-agents
Diagnose Problem:       Call: @ruth-malan
Design Structure:       Call: @matthew-skelton
Design Interactions:    Call: @manuel-pais
Design Agent Orch:      Call: @barry-hawkins
Validate Protocols:     Call: @yoav-shoham
Not Sure:              Call: @team-taxonomy-chief
```

---

## Remember

> **"AI agents scale execution. Team taxonomy scales judgment."**

Structure matters. Design it intentionally.

---

**More Help:**
- Full Guide: [README.md](README.md)
- Navigation: [INDEX.md](INDEX.md)  
- Reference: [config.yaml](config.yaml)
- Quality: [QUALITY-DASHBOARD.md](QUALITY-DASHBOARD.md)

🏗️ **Ready to build better organizations!**
