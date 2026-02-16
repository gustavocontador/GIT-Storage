# Systematic Review Guide — Knowledge Base

> Guia completo para revisões sistemáticas seguindo PRISMA 2020.
> Usado por: literature-reviewer, research-chief

---

## 1. PRISMA 2020 Protocol

### Overview
PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) é o padrão internacional para conduzir e reportar revisões sistemáticas. A versão 2020 substituiu o PRISMA 2009.

### PRISMA 2020 Checklist (27 items)

| Section | Items | Key Requirements |
|---------|-------|-----------------|
| Title | 1 | Identify as systematic review |
| Abstract | 2 | Structured abstract with all PRISMA elements |
| Introduction | 3-4 | Rationale + objectives with PICO |
| Methods | 5-13 | Protocol, eligibility, sources, search strategy, selection, data extraction, risk of bias, synthesis |
| Results | 14-22 | Study selection (flow diagram), characteristics, risk of bias, synthesis results |
| Discussion | 23-26 | Interpretation, limitations, implications |
| Other | 27 | Registration, protocol, funding |

---

## 2. Step-by-Step Protocol

### Step 1: Define Research Question (PICO)

```yaml
systematic_review_question:
  P: "Adults aged 18-65 with chronic low back pain"
  I: "AI-assisted physiotherapy"
  C: "Traditional physiotherapy"
  O: "Pain reduction (VAS), functional improvement (ODI)"
  study_types: "RCTs and quasi-experimental studies"
```

### Step 2: Register Protocol
- **PROSPERO**: Register BEFORE starting the search
- Include: search strategy, eligibility criteria, analysis plan
- Registration number must be cited in the manuscript

### Step 3: Search Strategy

**Databases (minimum 2, recommended 4+):**
- PubMed/MEDLINE (biomedical)
- Scopus (multidisciplinary)
- Web of Science (citation database)
- Google Scholar (broad coverage)
- Domain-specific: IEEE Xplore, ERIC, PsycINFO, CINAHL

**Search String Construction:**

```
("artificial intelligence" OR "machine learning" OR "AI" OR "deep learning")
AND
("physiotherapy" OR "physical therapy" OR "rehabilitation")
AND
("low back pain" OR "lumbar pain" OR "LBP")
```

**Search Documentation (MANDATORY):**
- Full search string per database
- Date of search
- Number of results per database
- Filters applied (date range, language, study type)

### Step 4: Screening

**Two-phase screening:**

| Phase | What | Who | Tool |
|-------|------|-----|------|
| Title/Abstract | Inclusion/exclusion based on title+abstract | 2 independent reviewers | Rayyan, Covidence |
| Full-text | Read full paper, apply detailed criteria | 2 independent reviewers | Covidence, manual |

**Eligibility Criteria (define BEFORE screening):**

```yaml
inclusion:
  - Published in English or Portuguese
  - RCT or quasi-experimental design
  - Adult participants (18-65)
  - Intervention involves AI component
  - Outcome measures include pain or function

exclusion:
  - Conference abstracts only
  - Animal studies
  - Protocols without results
  - Non-peer-reviewed sources
  - Duplicate publications
```

**Inter-rater reliability:**
- Calculate Cohen's Kappa (target: > 0.80)
- Resolve disagreements by discussion or third reviewer

### Step 5: Data Extraction

**Standard extraction form:**

| Field | Example |
|-------|---------|
| Study ID | Smith2024 |
| Authors | Smith, J., Jones, M. |
| Year | 2024 |
| Country | USA |
| Study design | RCT |
| Sample size | N=120 |
| Population | Adults with chronic LBP |
| Intervention | AI-guided exercise program |
| Comparator | Standard physiotherapy |
| Duration | 12 weeks |
| Outcome measures | VAS, ODI |
| Key findings | Significant improvement in VAS (p<0.01) |
| Risk of bias | Low |

### Step 6: Risk of Bias Assessment

**Tools by study type:**
- RCTs: **RoB 2** (Cochrane Risk of Bias tool 2)
- Non-randomized: **ROBINS-I**
- Observational: **Newcastle-Ottawa Scale**
- Qualitative: **CASP** (Critical Appraisal Skills Programme)

**RoB 2 Domains:**
1. Randomization process
2. Deviations from intended interventions
3. Missing outcome data
4. Measurement of outcome
5. Selection of reported result

### Step 7: Synthesis

**Narrative synthesis** (always):
- Organize by theme, outcome, or methodology
- Describe patterns and inconsistencies
- Use vote counting only as supplement

**Meta-analysis** (when appropriate):
- Require: similar PICO, same outcome measure, sufficient studies (k >= 3)
- Report: pooled effect size (OR, RR, SMD, MD), 95% CI
- Heterogeneity: I² statistic (low < 25%, moderate 25-75%, high > 75%)
- Forest plot (mandatory)
- Funnel plot for publication bias (if k >= 10)
- Sensitivity analysis (leave-one-out)
- Subgroup analysis (planned a priori)

---

## 3. PRISMA Flow Diagram

```
Records identified through database searching (n = )
    + Records identified through other sources (n = )
                        ↓
    Records after duplicates removed (n = )
                        ↓
    Records screened (n = )
        → Records excluded (n = )
                        ↓
    Full-text articles assessed (n = )
        → Full-text articles excluded (n = ), with reasons
                        ↓
    Studies included in qualitative synthesis (n = )
                        ↓
    Studies included in meta-analysis (n = )
```

---

## 4. Types of Reviews

| Type | Purpose | Search | Synthesis | Duration |
|------|---------|--------|-----------|----------|
| Systematic Review | Comprehensive, reproducible | Exhaustive | Narrative/Meta-analysis | 6-12 months |
| Scoping Review | Map available evidence | Broad | Narrative, charting | 3-6 months |
| Narrative Review | Expert overview | Selective | Narrative | 1-3 months |
| Rapid Review | Quick evidence summary | Focused | Narrative | 2-6 weeks |
| Meta-analysis | Quantitative synthesis | Exhaustive | Statistical pooling | 6-12 months |
| Umbrella Review | Review of reviews | Systematic reviews only | Narrative | 3-6 months |

---

## 5. Quality Checklist for Systematic Reviews

- [ ] Research question defined using PICO/SPIDER
- [ ] Protocol registered (PROSPERO)
- [ ] Search strategy documented (databases, strings, dates)
- [ ] Minimum 2 databases searched
- [ ] Grey literature considered
- [ ] Eligibility criteria defined BEFORE screening
- [ ] Dual screening (2 independent reviewers)
- [ ] Inter-rater reliability reported (Kappa)
- [ ] Data extraction form standardized
- [ ] Risk of bias assessed per included study
- [ ] Synthesis method appropriate for data
- [ ] PRISMA flow diagram included
- [ ] PRISMA checklist completed (27 items)
- [ ] Limitations discussed
- [ ] GRADE certainty of evidence (if meta-analysis)

---

## 6. Common Pitfalls

| Pitfall | Impact | Prevention |
|---------|--------|------------|
| Search too narrow | Missing relevant studies | Use multiple databases + grey literature |
| No protocol registration | Bias risk, some journals reject | Register on PROSPERO before starting |
| Single-reviewer screening | Bias in study selection | Always use 2 independent reviewers |
| No risk of bias assessment | Cannot judge evidence quality | Use RoB 2 / ROBINS-I |
| Cherry-picking studies | Biased conclusions | Follow protocol, report all results |
| Inappropriate meta-analysis | Misleading pooled effect | Check homogeneity (I²) before pooling |
| Missing PRISMA items | Desk rejection by journals | Complete PRISMA 2020 checklist |

---

## 7. Software Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Rayyan | Title/abstract screening | Free |
| Covidence | Full systematic review management | Paid (free for Cochrane) |
| RevMan | Cochrane reviews, meta-analysis | Free |
| STATA/R | Meta-analysis, forest plots | R is free |
| Zotero/Mendeley | Reference management | Free |
| PRISMA Flow Generator | Create PRISMA diagrams | Free online |
