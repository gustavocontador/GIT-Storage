# Coding Standards for AI-FIRST

## Code Quality Requirements

### Language: Language-Agnostic (Best Tool for Job)

**Typical Tech Stack:**
- **Frontend:** React/Vue/Svelte (modern framework)
- **Backend:** Node.js/Python/Go (based on requirements)
- **Database:** PostgreSQL (default), or appropriate choice
- **Testing:** Jest/Pytest (framework-native)
- **Infrastructure:** Kubernetes or Serverless (AWS Lambda, Cloud Run)

### Code Quality Standards

**All code must meet:**
- ✅ Test coverage > 80%
- ✅ Zero linting errors
- ✅ All tests passing
- ✅ Performance benchmarks met
- ✅ No security vulnerabilities (OWASP top 10)
- ✅ Documented APIs
- ✅ Type-safe where applicable

### Testing Strategy

**Test Pyramid:**
```
    /\
   /  \  E2E Tests (10%)
  /----\
 /      \ Integration Tests (30%)
/--------\
          Unit Tests (60%)
```

**Minimums:**
- Unit tests: 80%+ coverage
- Integration tests: Core user flows
- E2E tests: Critical paths

### Code Review Requirements

**Every PR requires:**
1. Code review from Developer Lead
2. Tests written & passing
3. Linting passes
4. Performance benchmarks met
5. Security audit (if touching auth/data)
6. Approval before merge

**Review checklist:**
- [ ] Does this solve the problem stated in the spec?
- [ ] Is the code clean and maintainable?
- [ ] Are edge cases handled?
- [ ] Are tests comprehensive?
- [ ] Does it follow architecture?
- [ ] Any security concerns?
- [ ] Performance acceptable?
- [ ] Documentation clear?

### Naming Conventions

**Functions:** camelCase, verb-first
```javascript
// Good
function calculateUserScore() {}
function validateEmail() {}

// Bad
function score() {}
function check() {}
```

**Classes/Types:** PascalCase
```javascript
class UserService {}
interface ProductData {}
type PaymentStatus = "pending" | "completed"
```

**Constants:** SCREAMING_SNAKE_CASE
```javascript
const MAX_RETRIES = 3
const API_TIMEOUT = 5000
const DEFAULT_PAGE_SIZE = 20
```

**Private methods:** _leadingUnderscore or #privateField
```javascript
class Service {
  #privateMethod() {} // Modern
  _legacyPrivate() {} // Legacy
}
```

### Comment & Documentation

**Document:**
- [ ] Function purposes (if not obvious from name)
- [ ] Complex algorithms
- [ ] Edge cases
- [ ] Why, not what (code shows what, comments explain why)
- [ ] Gotchas and non-obvious decisions

**Example:**
```javascript
// Calculate score using Bayesian averaging
// (We use this instead of simple average due to low-volume products)
function calculateScore(ratings, viewCount) {
  // Minimum threshold to avoid outliers
  const MIN_VIEWS = 10
  if (viewCount < MIN_VIEWS) {
    return averageRating // Safety: more conservative
  }
  return (ratings.sum + MIN_VIEWS * 3) / (ratings.count + MIN_VIEWS)
}
```

**Avoid:**
```javascript
// ❌ Useless comments
let x = 5 // Set x to 5

// ❌ Obvious comments
function getName() {
  // Return the name
  return this.name
}
```

### Error Handling

**Always handle errors explicitly:**
```javascript
// ❌ Bad: Silent failures
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ✅ Good: Explicit error handling
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error(`User not found: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    logger.error(`Failed to fetch user ${id}:`, error)
    throw new Error(`Could not fetch user: ${error.message}`)
  }
}
```

### Performance Standards

**Targets:**
- Page load: < 3 seconds
- API response: < 200ms (p95)
- Database query: < 100ms (p95)
- Memory: < 200MB per node
- CPU: < 70% average

**Monitoring:**
- [ ] Performance metrics logged
- [ ] Slow queries identified
- [ ] Regular profiling sessions

### Security Standards

**Always:**
- [ ] Validate all inputs
- [ ] Escape outputs (prevent XSS)
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Hash passwords (bcrypt, argon2, never plaintext)
- [ ] Use HTTPS everywhere
- [ ] Implement CORS properly
- [ ] Rate limit endpoints
- [ ] Log security events
- [ ] Encrypt sensitive data at rest
- [ ] Regular security audits

### Git Workflow

**Commit format:** Conventional commits
```
type(scope): short description

Detailed explanation if needed.

Fixes #123
```

**Types:** feat, fix, docs, chore, refactor, test, perf

**Branch naming:** feature/X, bugfix/X, chore/X

**Code review before merge:** No exceptions

### Documentation

**Every feature needs:**
1. API documentation (if applicable)
2. Architecture decision record (if significant)
3. Troubleshooting guide (if complex)
4. Examples of usage

**README must include:**
- [ ] What the project does
- [ ] How to run locally
- [ ] Architecture overview
- [ ] Key files explained
- [ ] Common tasks

---

**Enforced by:** Developer Lead
**Violations trigger:** Code review rejection
**Appeals to:** Systems Architect & Mentor
