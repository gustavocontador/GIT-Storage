# Source Tree Architecture

## Recommended Project Structure

This structure works for both MVP and scaling to thousands of users.

```
ai-first-app/
├── apps/
│   ├── web/                          # Frontend (React)
│   │   ├── src/
│   │   │   ├── components/           # React components
│   │   │   │   ├── common/           # Reusable components
│   │   │   │   ├── pages/            # Page components
│   │   │   │   └── features/         # Feature-specific components
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── services/             # API client services
│   │   │   ├── stores/               # State management (Zustand)
│   │   │   ├── types/                # TypeScript types
│   │   │   ├── utils/                # Utility functions
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/                   # Static assets
│   │   ├── tests/                    # Component tests
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                          # Backend (Node.js)
│       ├── src/
│       │   ├── routes/               # API route handlers
│       │   │   ├── auth.ts
│       │   │   ├── users.ts
│       │   │   ├── products.ts
│       │   │   └── ...
│       │   ├── services/             # Business logic
│       │   │   ├── auth-service.ts
│       │   │   ├── user-service.ts
│       │   │   ├── product-service.ts
│       │   │   └── ...
│       │   ├── db/                   # Database
│       │   │   ├── schema.ts         # Drizzle/Prisma schema
│       │   │   ├── migrations/       # DB migrations
│       │   │   └── seed.ts           # Initial data
│       │   ├── middleware/           # Express middleware
│       │   │   ├── auth.ts
│       │   │   ├── error-handler.ts
│       │   │   ├── validation.ts
│       │   │   └── ...
│       │   ├── types/                # TypeScript interfaces
│       │   ├── utils/                # Utility functions
│       │   ├── config.ts             # Configuration
│       │   └── index.ts              # Server entry point
│       ├── tests/                    # API tests
│       │   ├── integration/
│       │   └── unit/
│       ├── .env.example
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       └── package.json
│
├── packages/                         # Shared code (monorepo)
│   ├── types/                        # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── product.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                        # Shared utilities
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── api-client/                   # Auto-generated API client
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── docs/                             # Documentation
│   ├── architecture/                 # Architecture decisions
│   │   ├── adr-001-database.md
│   │   ├── adr-002-auth.md
│   │   └── ...
│   ├── api/                          # API documentation
│   │   ├── authentication.md
│   │   ├── users.md
│   │   ├── products.md
│   │   └── ...
│   ├── development/                  # Dev guides
│   │   ├── getting-started.md
│   │   ├── local-setup.md
│   │   ├── testing.md
│   │   └── debugging.md
│   └── deployment/                   # Deployment guides
│       ├── aws-setup.md
│       ├── ci-cd.md
│       └── scaling.md
│
├── .github/
│   └── workflows/                    # GitHub Actions CI/CD
│       ├── test.yml
│       ├── lint.yml
│       ├── build.yml
│       └── deploy.yml
│
├── docker/                           # Docker setup
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
│
├── squads/
│   └── ai-empire-squad/              # This squad
│
├── .env.example                      # Environment template
├── .gitignore
├── docker-compose.yml                # Local development
├── package.json                      # Monorepo root
├── pnpm-workspace.yaml              # Monorepo config
├── turbo.json                       # Build system config
└── README.md                         # Root documentation
```

## Organization Principles

### 1. Feature-Based Organization (Frontend)
Components organized by feature, not by type:
```
components/
├── common/              # Reusable everywhere
├── features/
│   ├── auth/           # Auth feature
│   ├── dashboard/      # Dashboard feature
│   └── products/       # Products feature
```

### 2. Layered Architecture (Backend)
Clear separation of concerns:
```
API Layer (routes/)
    ↓
Service Layer (services/)
    ↓
Database Layer (db/)
    ↓
External APIs
```

### 3. Monorepo with Workspaces
Single repo, multiple packages:
- `apps/web` - Frontend
- `apps/api` - Backend
- `packages/types` - Shared types
- `packages/utils` - Shared utilities

**Benefits:**
- Single dependency tree
- Easy code sharing
- Atomic commits across packages
- Simplified deployment

### 4. Database Organization
```
db/
├── schema.ts              # All tables defined here
├── migrations/            # Versioned changes
│   ├── 001_init.sql
│   ├── 002_add_users.sql
│   └── ...
├── seed.ts                # Initial test data
└── backups/               # Automated backups
```

## File Naming Conventions

### TypeScript Files
```
✅ user-service.ts           (exported service)
✅ use-user-data.ts          (React hook)
✅ user-card.tsx             (React component)
✅ user.types.ts             (TypeScript types)
✅ user.test.ts              (Test file)

❌ UserService.ts            (avoid PascalCase for files)
❌ user_service.ts           (avoid snake_case)
```

### React Components
```
✅ UserCard.tsx              (PascalCase)
✅ user-card.test.tsx        (test in same dir)
✅ user-card.stories.tsx     (Storybook in same dir)

❌ userCard.tsx              (avoid camelCase)
```

### Exported Modules
```
// user-service.ts
export class UserService {
  static async getUser(id: string) { ... }
}

export default UserService
```

## Import Organization

**Order imports by category:**
```typescript
// 1. External packages
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal packages (shared)
import { User } from '@ai-first/types'
import { formatDate } from '@ai-first/utils'

// 3. App-specific imports
import { UserService } from '@/services/user-service'
import { UserCard } from '@/components/features/users'

// 4. Relative imports (last resort)
import { helpers } from './helpers'
```

## Environment Files

**`.env.example`** - Checked into git, template only
```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_first

# Auth
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

**`.env.local`** - Never checked in (in .gitignore)
```
# Your actual secrets go here
DATABASE_URL=postgresql://local_user:local_pass@localhost:5432/ai_first
AUTH0_CLIENT_ID=your_actual_id
# ... actual values
```

## Test Organization

```
api/tests/
├── unit/
│   ├── services/
│   │   └── user-service.test.ts
│   ├── utils/
│   │   └── date.test.ts
│   └── middleware/
│       └── auth.test.ts
│
└── integration/
    ├── routes/
    │   ├── auth.test.ts
    │   ├── users.test.ts
    │   └── products.test.ts
    └── db/
        └── user.test.ts

web/tests/
├── components/
│   ├── UserCard.test.tsx
│   └── ...
├── hooks/
│   └── use-user-data.test.ts
└── e2e/
    ├── auth.e2e.ts
    ├── dashboard.e2e.ts
    └── ...
```

## Build & Dependency Management

### Monorepo Config (pnpm-workspace.yaml)
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Shared Dependencies
- Keep versions consistent across packages
- Use `pnpm list` to audit
- Update regularly with `pnpm up`

## Scalability Notes

This structure scales from 1 to 1000+ endpoints:

**When you hit 50 routes:**
- Split services by domain
- Introduce route grouping

**When you hit 200 routes:**
- Consider API versioning (v1/, v2/)
- Split into multiple API servers

**When you hit 10k+ users:**
- Consider separate read/write databases
- Introduce caching layers
- Split microservices by domain

**The key:** Structure allows growth without rewriting.

---

**Enforced by:** Systems Architect
**Questions:** Ask in squad chat
**Exceptions:** Require architecture review
