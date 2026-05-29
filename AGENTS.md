# AGENTS.md — AIVisaAgent

> For AI coding agents (OpenAI Codex, GitHub Copilot agent mode, etc.)
> Read this file fully before writing any code.

---

## Setup

```bash
# Prerequisites: Node.js >= 20, PostgreSQL >= 15
npm install
cp .env.example .env
# Fill in DATABASE_URL, OPENAI_API_KEY, JWT_SECRET, JWT_REFRESH_SECRET
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Running Tests

```bash
npm test              # all tests
npm run test:unit     # unit only (fast, no DB)
npm run test:integration  # requires TEST_DATABASE_URL
npm run test:e2e      # Playwright (requires running dev server or test server)
```

**CRITICAL: Run `npm test` before and after every change. If tests were passing before your change, they must still pass after.**

---

## Code Style

### TypeScript
- `strict: true` in tsconfig — no `any`, no `@ts-ignore` unless you add a comment explaining why
- Use `z.infer<typeof Schema>` to derive types from Zod schemas — never duplicate type definitions
- Prefer `const` over `let`; never use `var`
- Use named exports, not default exports (exceptions: React components, route files)
- Error handling: use typed `Result<T, E>` pattern in `src/lib/result.ts` — no `throw` in business logic; throw only in Express error handler

### React
- Functional components only; no class components
- Co-locate component test file: `Button.tsx` + `Button.test.tsx` in the same folder
- Use React Query (`@tanstack/react-query`) for all server state — no `useEffect` + `fetch` combos
- Tailwind CSS for all styling — no inline styles, no CSS modules, no styled-components
- Accessible by default: every form element has a `<label>`, interactive elements have `aria-*` attributes

### API / Express
- All routes validate request body/params with a Zod schema via `validate` middleware
- Controllers are thin — call a service function, return the result
- All async route handlers are wrapped with `asyncHandler` to propagate errors to Express error middleware
- HTTP status codes: 200 (ok), 201 (created), 400 (validation error), 401 (unauthenticated), 403 (forbidden), 404 (not found), 429 (rate limited), 500 (unexpected — never expose stack traces)

### Agent / AI
- Tools are pure functions with injected DB client — `(db: PrismaClient, params: ToolParams) => Promise<ToolResult>`
- System prompt lives in `src/agent/prompts.ts` — never inline it in `agent.ts`
- Keep conversation history to last 10 turns to control token usage
- Always include a `max_tokens` cap on GPT-4o calls

---

## Testing Rules

- **Red/Green TDD** — write a failing test before implementing. The test file must exist and fail before you write the implementation.
- Unit tests mock all external dependencies (DB, OpenAI API, HTTP calls)
- Integration tests use a real test DB — never the dev DB
- E2E tests use Playwright; OpenAI is stubbed via MSW (Mock Service Worker)
- Test file naming: `*.test.ts` for unit/integration, `*.spec.ts` for e2e
- Every new tool in `src/agent/tools.ts` must have a corresponding unit test
- Every new API endpoint must have a corresponding Supertest integration test

---

## PR Instructions

- **One logical change per PR** — if you're tempted to do two things, make two PRs
- **Evidence required** — include test output (`npm test` passing), or screenshots for UI changes
- **Review AI-generated diffs** — read every line of the diff before committing. Don't commit code you don't understand.
- **Title format:** `type(scope): description` — e.g. `feat(agent): add validate_document_checklist tool`
- **Types:** `feat`, `fix`, `test`, `refactor`, `docs`, `chore`
- Link to the TODO.md task in the PR description

---

## What NOT to Do

- Do NOT refactor code that isn't related to the current task
- Do NOT remove or skip existing tests to make the build pass
- Do NOT hardcode secrets, API keys, or URLs — use `process.env.*`
- Do NOT add `console.log` statements — use the `logger` from `src/lib/logger.ts`
- Do NOT generate entire files at once without a corresponding failing test
- Do NOT commit `node_modules/`, `.env`, or Prisma migration files you didn't review
