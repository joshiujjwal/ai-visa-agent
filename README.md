# AIVisaAgent 🛂

> **AI agent that guides users through the visa application process — country-specific requirements, document checklists, form filling assistance, timeline tracking, and status updates.**

![Status](https://img.shields.io/badge/status-🚧%20Early%20Development-orange)
![Stack](https://img.shields.io/badge/stack-TypeScript%20%7C%20React%20%7C%20Node.js%20%7C%20GPT--4o%20%7C%20PostgreSQL-blue)

---

## Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React 18, TypeScript, Tailwind CSS  |
| Backend     | Node.js, Express, TypeScript        |
| AI Engine   | OpenAI GPT-4o (function calling)    |
| Database    | PostgreSQL + Prisma ORM             |
| Auth        | JWT + refresh tokens                |
| Testing     | Vitest (unit), Supertest (API), Playwright (e2e) |
| CI          | GitHub Actions                      |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/joshiujjwal/ai-visa-agent.git
cd ai-visa-agent

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your OpenAI API key, DB URL, etc.

# 4. Set up database
npx prisma migrate dev

# 5. Start dev servers (API + React)
npm run dev

# 6. Run tests
npm test
```

---

## Project Structure

```
ai-visa-agent/
├── src/
│   ├── agent/          # GPT-4o agent loop, tools, prompts
│   ├── api/            # Express routes, controllers, middleware
│   ├── components/     # React UI components
│   ├── db/             # Prisma schema, migrations, seeds
│   ├── hooks/          # React custom hooks
│   ├── lib/            # Shared utilities (validators, formatters)
│   └── types/          # Shared TypeScript types
├── tests/
│   ├── unit/           # Vitest unit tests (mirrors src/)
│   ├── integration/    # API + DB integration tests
│   └── e2e/            # Playwright end-to-end tests
├── docs/
│   ├── spec.md         # Feature specification
│   └── adr/            # Architecture Decision Records
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   └── skills/
├── CLAUDE.md
├── AGENTS.md
└── TODO.md
```

---

## Contributing

- **Tests first** — write failing tests before any implementation (red/green TDD)
- **Small PRs** — one logical change per PR; link to the TODO.md task
- **Evidence required** — PRs must include test output or screenshots as proof
- **No unreviewed code** — all AI-generated diffs must be manually reviewed before commit
- **Update context files** — if you learn something non-obvious, update `CLAUDE.md` or `AGENTS.md`
