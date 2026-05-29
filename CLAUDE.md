# CLAUDE.md — AIVisaAgent

> Context file for AI coding agents. Keep under 200 lines. Update this when you discover non-obvious things.

---

## What This Project Is

An AI agent (GPT-4o with function calling) that guides users through visa applications. Users interact via chat; the agent queries a PostgreSQL DB for country requirements, validates their document checklist, and tracks timelines.

---

## Commands

```bash
# Install
npm install

# Dev (API + Vite React frontend, concurrently)
npm run dev

# Build
npm run build

# Tests (all)
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests (Playwright, headless)
npm run test:e2e

# Lint
npm run lint

# Type-check
npm run typecheck

# Database
npx prisma migrate dev          # apply migrations in dev
npx prisma migrate reset        # reset dev DB + re-seed
npx prisma db seed              # seed country requirements
npx prisma studio               # GUI browser for DB
```

---

## Directory Map

```
src/
  agent/        GPT-4o agent loop (agent.ts), tool definitions (tools.ts),
                system prompt (prompts.ts), knowledge retrieval (knowledge.ts)
  api/          Express app (app.ts), routes (routes/), controllers (controllers/),
                middleware (auth.ts, rateLimiter.ts, validate.ts)
  components/   React components — one file per component, colocated tests
  db/           Prisma schema (schema.prisma), migrations/, seed script (seed.ts)
  hooks/        React custom hooks (useAgent.ts, useApplications.ts, etc.)
  lib/          Shared pure utilities — no side effects, fully unit-testable
  types/        Shared TypeScript types and Zod schemas

tests/
  unit/         Pure function tests, mock everything external
  integration/  Real DB (test schema), mocked OpenAI, real HTTP via Supertest
  e2e/          Playwright — full browser, test DB, stubbed OpenAI
```

---

## Non-Obvious Conventions

- **Agent tools are pure functions** — each tool in `src/agent/tools.ts` takes a DB client as dependency injection. Never import `prisma` globally inside a tool. This makes unit testing possible without a real DB.
- **Streaming chat** — `POST /api/agent/chat` uses SSE (Server-Sent Events). The response is `Content-Type: text/event-stream`. The frontend uses `EventSource` via a custom hook.
- **Zod schemas are the source of truth** — define Zod schemas in `src/types/`, derive TypeScript types from them (`z.infer<>`), and use `zod-to-openapi` to generate the OpenAPI spec. Never write types by hand if a Zod schema exists.
- **No `any` allowed** — `tsconfig.json` has `"strict": true`. If you're tempted to use `any`, write a type guard instead.
- **JWT refresh pattern** — access tokens (15min) are in memory on the client (not localStorage). Refresh tokens (7 days) are httpOnly cookies. Never store JWTs in localStorage.
- **Country data staleness** — if `country_requirements.last_verified_at` is > 90 days ago, the agent must prepend a warning to its response. This check is in `knowledge.ts`.
- **Test DB isolation** — integration tests use a separate DB (`TEST_DATABASE_URL` env var). Each test suite runs `prisma migrate reset --force` on the test DB before starting. Never run integration tests against the dev DB.
- **OpenAI mock in tests** — use `vi.mock('openai')` in Vitest. The mock is in `tests/__mocks__/openai.ts`. Import it implicitly — Vitest auto-hoists mocks.

---

## Environment Variables

See `.env.example` for all required variables. Key ones:

```
DATABASE_URL            PostgreSQL connection string (dev)
TEST_DATABASE_URL       PostgreSQL connection string (test — separate DB)
OPENAI_API_KEY          GPT-4o API key
JWT_SECRET              Min 32 chars, random
JWT_REFRESH_SECRET      Min 32 chars, different from JWT_SECRET
PORT                    API port (default 3001)
VITE_API_BASE_URL       Frontend API base URL (default http://localhost:3001)
```

---

## Workflow for AI Agents

1. **Read this file + TODO.md first** — understand current phase before writing any code
2. **Run existing tests** — `npm test` must be green before you start. If it's red, fix that first.
3. **Pick one TODO item** — choose the next unchecked item in the current phase
4. **Write tests first (red)** — failing tests define the contract
5. **Implement until green** — minimal code to make tests pass
6. **Run full test suite** — `npm test` must still be green
7. **Review your own diff** — use `git diff --staged` and read every line
8. **Commit** — descriptive message: `feat(agent): implement validate_document_checklist tool`
9. **Update this file** — if you learned something non-obvious, add it to "Non-Obvious Conventions" above

---

## Common Pitfalls

- Don't call `prisma.$connect()` manually — Prisma connects lazily
- Don't forget `await prisma.$disconnect()` in test teardown
- SSE responses must not have `Content-Length` header — Express will buffer them
- GPT-4o function call results must be sent back as `role: "tool"` messages, not `role: "user"`
- Tailwind JIT requires all class names to be complete strings — no dynamic concatenation like `bg-${color}-500`
