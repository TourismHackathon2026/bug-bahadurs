---
name: nestjs-best-practices
description: NestJS best practices and architecture patterns for building production-ready applications. This skill should be used when writing, reviewing, or refactoring NestJS code to ensure proper patterns for modules, dependency injection, security, and performance.
license: MIT
metadata:
  author: Kadajett
  version: "1.1.0"
---

# NestJS Best Practices

Comprehensive best practices guide for NestJS applications. Contains 40 rules across 10 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:

- Writing new NestJS modules, controllers, or services
- Implementing authentication and authorization
- Reviewing code for architecture and security issues
- Refactoring existing NestJS codebases
- Optimizing performance or database queries
- Building microservices architectures

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Architecture | CRITICAL | `arch-` |
| 2 | Dependency Injection | CRITICAL | `di-` |
| 3 | Error Handling | HIGH | `error-` |
| 4 | Security | HIGH | `security-` |
| 5 | Performance | HIGH | `perf-` |
| 6 | Testing | MEDIUM-HIGH | `test-` |
| 7 | Database & ORM | MEDIUM-HIGH | `db-` |
| 8 | API Design | MEDIUM | `api-` |
| 9 | Microservices | MEDIUM | `micro-` |
| 10 | DevOps & Deployment | LOW-MEDIUM | `devops-` |

## Quick Reference

### 1. Architecture (CRITICAL)

- `arch-avoid-circular-deps` - Avoid circular module dependencies
- `arch-feature-modules` - Organize by feature, not technical layer
- `arch-module-sharing` - Proper module exports/imports, avoid duplicate providers
- `arch-single-responsibility` - Focused services over "god services"
- `arch-use-repository-pattern` - Abstract database logic for testability
- `arch-use-events` - Event-driven architecture for decoupling

### 2. Dependency Injection (CRITICAL)

- `di-avoid-service-locator` - Avoid service locator anti-pattern
- `di-interface-segregation` - Interface Segregation Principle (ISP)
- `di-liskov-substitution` - Liskov Substitution Principle (LSP)
- `di-prefer-constructor-injection` - Constructor over property injection
- `di-scope-awareness` - Understand singleton/request/transient scopes
- `di-use-interfaces-tokens` - Use injection tokens for interfaces

### 3. Error Handling (HIGH)

- `error-use-exception-filters` - Centralized exception handling
- `error-throw-http-exceptions` - Use NestJS HTTP exceptions
- `error-handle-async-errors` - Handle async errors properly

### 4. Security (HIGH)

- `security-auth-jwt` - Secure JWT authentication
- `security-validate-all-input` - Validate with class-validator
- `security-use-guards` - Authentication and authorization guards
- `security-sanitize-output` - Prevent XSS attacks
- `security-rate-limiting` - Implement rate limiting

### 5. Performance (HIGH)

- `perf-async-hooks` - Proper async lifecycle hooks
- `perf-use-caching` - Implement caching strategies
- `perf-optimize-database` - Optimize database queries
- `perf-lazy-loading` - Lazy load modules for faster startup

### 6. Testing (MEDIUM-HIGH)

- `test-use-testing-module` - Use NestJS testing utilities
- `test-e2e-supertest` - E2E testing with Supertest
- `test-mock-external-services` - Mock external dependencies

### 7. Database & ORM (MEDIUM-HIGH)

- `db-use-transactions` - Transaction management
- `db-avoid-n-plus-one` - Avoid N+1 query problems
- `db-use-migrations` - Use migrations for schema changes

### 8. API Design (MEDIUM)

- `api-use-dto-serialization` - DTO and response serialization
- `api-use-interceptors` - Cross-cutting concerns
- `api-versioning` - API versioning strategies
- `api-use-pipes` - Input transformation with pipes

### 9. Microservices (MEDIUM)

- `micro-use-patterns` - Message and event patterns
- `micro-use-health-checks` - Health checks for orchestration
- `micro-use-queues` - Background job processing

### 10. DevOps & Deployment (LOW-MEDIUM)

- `devops-use-config-module` - Environment configuration
- `devops-use-logging` - Structured logging
- `devops-graceful-shutdown` - Zero-downtime deployments

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/arch-avoid-circular-deps.md
rules/security-validate-all-input.md
rules/_sections.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Global Rules (apply to every phase, never violated)
- **API contract is frozen once published.** Any breaking change requires versioning (`/api/v2`), never silent mutation of `/api/v1`.
- **Every list endpoint is paginated.** Standard query params: `?page=1&limit=20`, response always includes `meta: { page, limit, total, totalPages }`. No endpoint returns an unbounded array.
- **Complaint list endpoints support feed-style filtering.** Tourist and authority complaint feeds accept consistent query params where applicable: `status`, `category`, `priority`, `dateFrom`, `dateTo`, `q`, `sort`, `page`, `limit`.
- **Response envelope is consistent:** `{ data, error, meta }` everywhere. No raw arrays/objects returned directly.
- **CORS is explicit allow-list**, never `origin: '*'`. Only the deployed frontend domain(s) + local dev origin are whitelisted. Credentials mode (`credentials: true`) only paired with explicit origins, never wildcard — wildcard + credentials is a known misconfiguration that leaks session data cross-origin.
- **No file exceeds ~150–200 lines.** Each NestJS module: controller → service → repository, split further into smaller providers if a service grows past this.
- **SOLID applied concretely:** controllers depend on service interfaces, not implementations (DIP); one responsibility per service (SRP); category-routing logic and notification logic are separate services, not bolted into `ComplaintService` (OCP — new authority types/categories added via config/strategy, not by editing core logic).
- **Design patterns to use deliberately** (call these out in code comments so it's demoable):
  - **Strategy pattern** for routing logic (per-category routing strategy)
  - **Repository pattern** for all DB access (no raw Prisma/TypeORM calls inside controllers)
  - **Observer/Event pattern** for status-change → webhook/notification fan-out
  - **Factory pattern** for generating reference numbers / login IDs
- **Feature flags are config-driven**, not commented-out code. A central `FeatureFlagService` (env-var or DB-backed) gates: AI categorization, sentiment analysis, translation, heatmap. Code path always exists; flag controls execution.
- **Notifications are event-driven and low-noise.** Important domain events create in-app notifications immediately; email is reserved for high-value events only (verification result, complaint submitted, authority assignment, evidence request, major status change, resolution, admin escalation). No email for every minor internal action.
- **Sensitive data classification is decided in Phase 0 and never bypassed**: passport/ID numbers, phone numbers, email, exact GPS coordinates are "restricted" fields — never returned in list endpoints, only in detail endpoints to authorized roles, and excluded from logs entirely.
- **Logging/monitoring/error tracking are set up in Phase 0**, not bolted on later — every phase from Phase 1 onward uses the same logger/error-tracker instance already wired.
