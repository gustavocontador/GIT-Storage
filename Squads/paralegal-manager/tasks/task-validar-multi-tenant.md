# Task: Validar Isolamento Multi-Tenant

**Owner:** qa-engineer
**Type:** Security Testing
**Duration:** 30 minutos

## Objetivo
Garantir tenant A não acessa dados tenant B.

## Tests
1. Query sem tenant_id: DEVE falhar
2. Query tenant_id errado: 0 resultados
3. API route sem auth: 401 Unauthorized
4. JWT tenant_id diferente session: rejected
5. S3 path: /tenant-{id}/ validado

## Critical
- 100% coverage multi-tenant queries
- Zero vazamentos detectados
- Prisma middleware: auto-inject tenant_id

## Output
- Test report
- Vulnerabilities: 0 (target)
