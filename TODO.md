# AIVisaAgent — Task Breakdown

## How to Use This File

Workflow per task:
1. Write tests FIRST (red phase — they must fail initially)
2. Implement until tests pass (green phase)
3. Review the diff manually — never commit unreviewed code
4. Commit with a descriptive message referencing the task
5. If you learned something non-obvious, update `CLAUDE.md` / `AGENTS.md`
6. Move to the next task only after evidence gate is cleared

---

## Phase 0: Foundation ⬜

- [ ] `npm init` with TypeScript, ESLint (strict), Prettier
- [ ] Configure `tsconfig.json` for strict mode (no `any`, no implicit returns)
- [ ] Add Vitest + Supertest + Playwright as test frameworks
- [ ] Write and pass first smoke test (`GET /health → 200`)
- [ ] Set up Prisma with PostgreSQL connection; run `prisma init`
- [ ] Configure `dotenv` with `.env.example` (all required vars documented)
- [ ] GitHub Actions CI: install → lint → test on every push/PR
- [ ] Review and adjust all AI config files (CLAUDE.md, AGENTS.md, copilot-instructions.md)

**Evidence gate:** CI passes on `main`; smoke test green in CI log.

---

## Phase 1: Data Model & Core Types ⬜

- [ ] Define Prisma schema: `User`, `VisaApplication`, `DocumentChecklist`, `TimelineEvent`
- [ ] Write unit tests for schema validations (required fields, enum values)
- [ ] Run `prisma migrate dev --name init` and seed script with sample countries/visas
- [ ] Define shared TypeScript types in `src/types/` (mirrors Prisma models + API DTOs)
- [ ] Write type-guard utility tests in `tests/unit/types.test.ts`
- [ ] Document data model in `docs/spec.md` under "Data Model"

**Evidence gate:** `npm test` green; migration applied to local DB; schema screenshot in PR.

---

## Phase 2: AI Agent Core ⬜

- [ ] Scaffold agent loop in `src/agent/agent.ts` — GPT-4o with function-calling
- [ ] Write unit tests for agent tool dispatcher (mock OpenAI SDK)
- [ ] Implement tool: `get_country_requirements(country, visa_type)` → returns checklist JSON
- [ ] Implement tool: `validate_document_checklist(application_id)` → returns missing docs
- [ ] Implement tool: `get_timeline_estimate(country, visa_type)` → returns processing days
- [ ] Implement tool: `update_application_status(application_id, status)` → persists to DB
- [ ] Prompt engineering: system prompt with persona, guardrails, and tool descriptions
- [ ] Write integration test: full agent loop with stubbed OpenAI response
- [ ] Manual test: run agent with real GPT-4o key; log token usage

**Evidence gate:** All tool unit tests pass; integration test passes with stub; token usage logged.

---

## Phase 3: REST API ⬜

- [ ] `POST /api/applications` — create new visa application
- [ ] `GET /api/applications/:id` — fetch application with checklist + timeline
- [ ] `PATCH /api/applications/:id/status` — update status
- [ ] `POST /api/agent/chat` — send message to agent, stream response
- [ ] `GET /api/countries/:code/requirements` — return country-specific visa requirements
- [ ] JWT auth middleware: `POST /api/auth/register`, `POST /api/auth/login`
- [ ] Write Supertest integration tests for every endpoint (happy path + 4xx cases)
- [ ] Rate limiting on `/api/agent/chat` (10 req/min per user)
- [ ] Request validation with Zod schemas

**Evidence gate:** All Supertest tests pass; Postman collection exported and committed to `docs/`.

---

## Phase 4: React Frontend ⬜

- [ ] Scaffold React 18 app with Vite + TypeScript + Tailwind CSS
- [ ] `<ChatInterface />` — streaming chat with agent, markdown rendering
- [ ] `<ApplicationDashboard />` — list user's visa applications with status badges
- [ ] `<DocumentChecklist />` — interactive checklist with upload status
- [ ] `<TimelineTracker />` — visual timeline with step completion indicators
- [ ] `<CountryRequirementsCard />` — display country + visa type requirements
- [ ] Auth pages: `<Login />`, `<Register />`
- [ ] React Query for API state management + optimistic updates
- [ ] Write Vitest component tests for each UI component (render + interaction)
- [ ] Playwright e2e: full user journey (register → start application → chat with agent → mark docs ready)

**Evidence gate:** All component tests pass; Playwright e2e passes in headless mode; Lighthouse score ≥ 80.

---

## Phase 5: Country Data & Knowledge Base ⬜

- [ ] Seed DB with visa requirements for top 20 countries (US, UK, Schengen, Canada, Australia, etc.)
- [ ] Build `src/agent/knowledge.ts` — retrieval layer for country requirements
- [ ] Write tests ensuring retrieval returns correct data for each seeded country
- [ ] Document data sources in `docs/adr/0002-country-data-sources.md`
- [ ] Add "last verified" timestamp to country records; agent warns when data > 90 days old

**Evidence gate:** Seed runs cleanly; all 20 countries return correct requirements in tests.

---

## Phase 6: Polish & Harden ⬜

- [ ] Error boundary in React; structured error responses in API
- [ ] Retry logic in agent loop (exponential backoff on OpenAI timeouts)
- [ ] Logging with Pino (structured JSON logs, request IDs)
- [ ] Health check endpoint with DB ping + OpenAI reachability
- [ ] OpenAPI spec auto-generated from Zod schemas (via `zod-to-openapi`)
- [ ] Security: helmet, CORS, input sanitization, SQL injection audit via Prisma
- [ ] Load test `/api/agent/chat` with k6 (target: 50 concurrent users)

**Evidence gate:** Load test report committed; zero high-severity security findings in audit.

---

## Phase 7: Ship ⬜

- [ ] Dockerfile + docker-compose (API + DB + pgAdmin)
- [ ] Environment documentation in README.md (all `REQUIRED_` vars listed)
- [ ] Deploy to Railway / Render (or chosen platform)
- [ ] Production smoke test checklist run manually
- [ ] Tag `v0.1.0` release with changelog

**Evidence gate:** App live at production URL; smoke test checklist all-green.

---

## Parking Lot 🅿️

- Multi-language support (i18n)
- Document OCR for auto-extracting passport/ID data
- Email/SMS notifications for timeline milestones
- Visa appointment slot finder (scraper)
- Mobile app (React Native)
- Agent memory: persist past conversations per user
- PDF export of completed application summary

---

## Lessons Learned 📝

> Update this section as you discover non-obvious things. This is the compound loop.

- _(empty — add first entry after Phase 0 is done)_
