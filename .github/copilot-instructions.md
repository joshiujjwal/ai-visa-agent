# GitHub Copilot Instructions — AIVisaAgent

## Project Overview

AIVisaAgent is a TypeScript + React + Node.js application powered by GPT-4o. It guides users through visa applications via an AI chat agent that uses function calling to query country requirements, validate document checklists, and track timelines stored in PostgreSQL via Prisma.

---

## Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Query
- **Backend:** Node.js, Express, TypeScript
- **AI:** OpenAI GPT-4o with function calling + streaming (SSE)
- **Database:** PostgreSQL, Prisma ORM
- **Auth:** JWT (access token in memory, refresh token in httpOnly cookie)
- **Testing:** Vitest, Supertest, Playwright

---

## Coding Conventions

### TypeScript
- `strict: true` — no `any`, no non-null assertions without a comment
- Types come from Zod schemas via `z.infer<>` — do not duplicate type definitions
- Use `readonly` for function parameters that shouldn't be mutated
- Prefer discriminated unions over optional fields for variant data shapes

### Express API
- Route handler signature: `asyncHandler(async (req: AuthedRequest, res: Response) => {...})`
- Validate all inputs with Zod before using them
- Return errors as `{ error: { code: string, message: string } }` — never raw strings

### React Components
- Props interface defined above the component: `interface ButtonProps { ... }`
- No `useEffect` for data fetching — use React Query hooks from `src/hooks/`
- Component file = component + its types + its hook (if small). Test in sibling `*.test.tsx` file.

### Agent Tools
- Signature: `async function toolName(db: PrismaClient, params: ToolParams): Promise<ToolResult>`
- Tool results must be serializable to JSON (no class instances, no undefined values)
- Log tool invocations with `logger.info({ tool: 'toolName', params })` at INFO level

---

## Testing Conventions

- Write tests **before** implementation (TDD)
- Mock OpenAI using `vi.mock('openai')` — never make real API calls in tests
- Use `beforeEach` / `afterEach` for DB cleanup in integration tests, not `afterAll`
- Assertion style: `expect(result).toEqual(expected)` — use `.toEqual` for objects, `.toBe` for primitives

---

## Boundaries (Things Copilot Must NOT Do)

- Do NOT refactor files that are not part of the current task
- Do NOT remove, skip, or comment out existing tests
- Do NOT add dependencies without updating `package.json` comments or README
- Do NOT use `localStorage` for token storage — access tokens are in memory only
- Do NOT inline the OpenAI system prompt — it lives in `src/agent/prompts.ts`
- Do NOT suggest `any` types — suggest a proper type or type guard instead
- Do NOT generate migration files — run `npx prisma migrate dev` instead
