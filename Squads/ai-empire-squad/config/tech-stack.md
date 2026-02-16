# Tech Stack for AI-FIRST

## Philosophy

**"Use the best tool for the job, not the tool everyone uses"**

This project prioritizes:
1. **Productivity** - Ship fast with high quality
2. **Scalability** - Build for 100x growth from day 1
3. **Maintainability** - Clear, documented, understandable code
4. **Cost Efficiency** - Bootstrap-friendly, no unnecessary expenses

## Default Tech Stack (Recommended)

### Frontend
**Primary:** React 19+ with TypeScript
- **Why:** Component-based, large ecosystem, hire-able
- **Styling:** Tailwind CSS (utility-first)
- **State:** TanStack Query (data) + Zustand (UI state)
- **Testing:** Vitest + React Testing Library

**Alternative:** Vue 3 if team prefers

### Backend
**Primary:** Node.js (Fastify or Express)
- **Why:** JavaScript across stack, rapid development
- **Type Safety:** TypeScript required
- **API:** REST with OpenAPI docs, or GraphQL
- **Testing:** Vitest + Supertest

**Alternative:** Python (FastAPI) for data-heavy projects
**Alternative:** Go (Gin) for performance-critical services

### Database
**Primary:** PostgreSQL 15+
- **Why:** Relational, scalable, proven, OSS
- **ORM:** Drizzle or Prisma (type-safe)
- **Migrations:** Handled by ORM
- **Backups:** Automated to S3

**Alternative:** MongoDB if schemaless is critical
**Alternative:** DuckDB for analytics

### Infrastructure
**Primary:** AWS (ECS + RDS + CloudFront)
- **Containers:** Docker + ECR
- **Orchestration:** ECS Fargate (serverless containers)
- **Database:** RDS PostgreSQL
- **Cache:** ElastiCache Redis
- **CDN:** CloudFront
- **Storage:** S3
- **CI/CD:** GitHub Actions

**Alternative:** GCP (Cloud Run) for simplicity
**Alternative:** DigitalOcean for cost efficiency in early stage

### Authentication
**Primary:** Auth0 or Clerk
- **Why:** SAML, SSO, MFA out of the box
- **No custom auth in MVP** (security risk, time sink)

**Alternative:** Supabase Auth if self-hosted needed

### Analytics & Monitoring
**Primary:** Segment + Mixpanel (front) + Datadog (back)
- **Event tracking:** Segment (unified)
- **Product analytics:** Mixpanel (user behavior)
- **APM:** Datadog (application performance)
- **Logs:** DataDog (all logs)
- **Alerts:** Datadog (anomalies)

**Alternative:** Plausible (simpler, privacy-first)
**Alternative:** Self-hosted ELK stack (cost, complexity)

### Testing & Quality
- **Unit/Integration:** Vitest
- **E2E:** Playwright (fast, reliable)
- **Code Quality:** ESLint + Prettier (auto-format)
- **Type Checking:** TypeScript strict mode
- **Performance:** Lighthouse CI

### Development Tools
- **IDE:** VS Code (free, team alignment)
- **VCS:** Git + GitHub
- **Package Manager:** pnpm (fast, efficient)
- **Version Node:** Node 22 LTS
- **Local Dev:** Docker + Docker Compose

## Technology Decisions by Project Phase

### Phase 1: Kickoff → Build (Weeks 0-2)
**Focus:** Speed over perfection

- [ ] React + TypeScript (frontend)
- [ ] Node.js + Fastify (backend)
- [ ] PostgreSQL (database)
- [ ] Auth0 (auth)
- [ ] AWS (deploy)
- [ ] GitHub Actions (CI/CD)

### Phase 2: MVP Launch → Validation (Weeks 2-5)
**Focus:** Product-market fit, not scale

- Add: Segment (analytics)
- Add: Datadog (monitoring)
- Add: Sentry (error tracking)
- Add: Stripe (if taking payments)

### Phase 3: Scaling (Weeks 5+)
**Re-evaluate at scale:**
- Database sharding? (PostgreSQL)
- Caching strategy? (Redis)
- Async jobs? (Bull + Redis)
- Search? (Elasticsearch or Typesense)
- Real-time? (Socket.io or Ably)

## Decisions Made For You

**DON'T USE:**
- ❌ Custom authentication (too risky)
- ❌ NoSQL for relational data (complexity)
- ❌ Microservices initially (premature)
- ❌ Custom state management (use libraries)
- ❌ No tests (quality gate)
- ❌ Untyped code (unmaintainable)

**USE:**
- ✅ TypeScript everywhere
- ✅ Pre-built services (Auth0, Stripe, etc.)
- ✅ Cloud infrastructure (AWS, GCP)
- ✅ Managed databases (RDS, not self-hosted)
- ✅ CDN for static assets
- ✅ Tests for all features
- ✅ Monitoring from day 1

## Cost Estimation (Monthly)

**MVP (0-1000 users):**
- AWS: $50-100
- Auth0: Free tier
- Database: $15 (RDS micro)
- Analytics: $50 (Mixpanel)
- **Total: ~$120/month**

**Growth (1000-10000 users):**
- AWS: $200-500
- Auth0: $200
- Database: $100 (RDS small)
- Analytics: $200
- **Total: ~$700/month**

**Scale (10000+ users):**
- AWS: $1000+
- Auth0: $500+
- Database: $500+
- Analytics: $500+
- **Total: $2500+/month**

## Customization Guide

**If you disagree with defaults:**

1. **Get approval from Systems Architect**
2. **Document the decision** in ADR (Architecture Decision Record)
3. **Build POC** to validate choice
4. **Team review** before full adoption

Example ADR:
```markdown
# ADR-001: Use Python instead of Node.js

## Context
Project has heavy ML/data processing requirements

## Decision
Use Python (FastAPI) for backend instead of Node.js

## Consequences
- Data science integration easier
- Python hiring pool larger
- Slightly slower for I/O-heavy workloads
- Reuse of existing Python libraries

## Alternatives Considered
- Node.js: Good for I/O, worse for ML
- Go: Fast, but less ML library ecosystem
```

## Lock-In Strategies (Avoid)

**AVOID these vendor lock-ins in MVP:**
- ❌ AWS-only services (use standard tech)
- ❌ Proprietary databases (use PostgreSQL)
- ❌ Expensive SaaS with no alternative
- ❌ Custom frameworks (use standard frameworks)

**ENABLE these for growth:**
- ✅ AWS-specific optimization (later)
- ✅ Custom caching layers (when needed)
- ✅ Specific integrations (validated need)

## Maintenance

**Tech debt tracking:**
- Keep issues for upgrades (Node 22 → 24, React, etc.)
- Dependency updates: Weekly
- Security patches: Immediate
- Major version upgrades: Quarterly

---

**Decision owner:** Systems Architect
**Questions:** Raise in squad chat
**Changes:** Require ADR + team discussion
