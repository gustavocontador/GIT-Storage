# Task: Build Execution

**ID:** build-execution
**Tier:** Tier 3 (Builders) + oversight
**Duration:** 2 weeks
**Elicit:** false

## Objective

Execute full MVP build with scalable architecture. Deliver production-ready code with tests, documentation, and deployment infrastructure.

## What Happens

Tier 3 agents work in parallel:

- **Systems Architect:** Design scalable architecture (Days 1-3)
- **Developer Lead:** Implement features & quality (Days 3-14)
- **Data Specialist:** Implement analytics & tracking (Parallel)
- **DevOps Engineer:** Infrastructure & deployment (Parallel)

## Timeline: 2-Week MVP Sprint

### Days 1-3: Architecture & Planning
**Systems Architect leads:**
- [ ] Database schema design
- [ ] API contracts defined
- [ ] Frontend architecture planned
- [ ] Tech stack confirmed
- [ ] Scalability plan (100x growth path)

**Developer Lead:**
- [ ] Code structure & standards documented
- [ ] Testing strategy written
- [ ] CI/CD pipeline planned

**Data Specialist:**
- [ ] Metrics defined
- [ ] Analytics tracking spec
- [ ] Dashboard design

**DevOps Engineer:**
- [ ] Cloud infrastructure designed
- [ ] Deployment pipeline planned
- [ ] Monitoring & alerting setup

### Days 4-11: Implementation Sprint
**Developer Lead manages:**
- [ ] Daily standups (15 min)
- [ ] Code review every PR
- [ ] Tests written alongside code
- [ ] Blockers surfaced immediately

**Parallel work:**
- Developer: Feature implementation
- Data Specialist: Analytics instrumentation
- DevOps: Infrastructure automation
- Systems Architect: Architecture review & optimization

### Days 12-14: Polish & Deploy
- [ ] All tests passing
- [ ] Linting passes
- [ ] Performance benchmarks met
- [ ] Security audit complete
- [ ] Deployed to staging
- [ ] Final QA pass
- [ ] Deploy to production

## Quality Gates (Must Pass)

- [ ] Code coverage > 80%
- [ ] All tests passing
- [ ] Linting passes
- [ ] No security vulnerabilities
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Deployment automated
- [ ] Monitoring & alerts active

## Daily Coordination

**Master Coordinator runs daily 30-min standup:**
- Systems Architect: Architecture status
- Developer Lead: Implementation progress
- Data Specialist: Metrics & analytics status
- DevOps Engineer: Infrastructure & deployment status
- **Blocker resolution:** Address anything slowing team

## Outputs

### 1. Working MVP
- Production-deployed product
- Real users can access
- Core features working

### 2. Codebase
- Clean, tested code
- Documented architecture
- Ready for scaling

### 3. Infrastructure
- Deployed & monitored
- Auto-scaling configured
- Backups & disaster recovery
- Security hardened

### 4. Metrics & Dashboards
- Analytics tracking live
- Daily dashboard available
- KPIs being measured

### 5. Documentation
- API documentation
- Deployment runbook
- Architecture decision records
- Troubleshooting guide

## Success Criteria

- [ ] MVP deployed & live
- [ ] 100+ beta users invited
- [ ] Core features working reliably
- [ ] Performance meets targets
- [ ] All tests passing
- [ ] No critical security issues
- [ ] Team confident in quality
- [ ] Metrics tracking active

## Next Task

Once complete: **Market Validation** (Task 05)

## Running This Task

```bash
*workflow build-execution
```

**Who:** Full Tier 3 team (4 builders)
**Oversight:** Master Coordinator daily, Mentor weekly
**Governance:** Compliance Officer security review
**Input needed:** Finalized product spec from Roundtable
**Duration:** 2 weeks, ~50 hours intensive work
**Output:** Live MVP at production.ai-first.com

## Daily Checklist

```
EACH MORNING (Master Coordinator):
- [ ] Check GitHub for blockers
- [ ] Review PR queue
- [ ] Run quality gates
- [ ] Update team dashboard
- [ ] Schedule standup

STANDUP FORMAT (30 min):
1. Arch: "Built [X], next is [Y]"
2. Dev: "Shipped [features], tests [pass%]"
3. Data: "Tracking [metrics], dashboards ready"
4. DevOps: "Deployed [version], monitoring [good]"
5. MC: "Blockers? Changes needed?"
```
