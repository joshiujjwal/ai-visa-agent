# AIVisaAgent — Feature Specification

> Living document. Update this before implementing any new feature. Last updated: scaffolding.

---

## Overview

**Problem:** Visa applications are notoriously fragmented. Requirements change by country, visa type, and applicant nationality. Users waste days hunting across embassy websites, miss documents, and face rejection due to incomplete submissions.

**Solution:** An AI agent (GPT-4o with function calling) that acts as a knowledgeable, interactive visa guide. It walks users through country-specific requirements, maintains a personalized document checklist, helps with form questions, estimates processing timelines, and tracks application status — all in a conversational interface.

---

## Functional Requirements

### Authentication
- [ ] User can register with email + password
- [ ] User can log in and receive a JWT (access token + refresh token)
- [ ] Tokens expire: access=15min, refresh=7 days
- [ ] Protected routes return 401 on missing/expired token

### Visa Application Management
- [ ] User can start a new visa application (select destination country + visa type)
- [ ] Application stores: applicant nationality, destination, visa type, travel date, status
- [ ] Statuses: `draft` → `documents_pending` → `submitted` → `under_review` → `approved` / `rejected`
- [ ] User can view all their applications with current status
- [ ] User can archive or delete a draft application

### Document Checklist
- [ ] System generates a country + visa-type-specific document checklist on application creation
- [ ] Each checklist item has: name, description, required/optional flag, upload status
- [ ] User can mark documents as uploaded (no actual file storage in v0.1)
- [ ] Agent can query checklist and tell user what's missing
- [ ] Checklist progress shown as percentage (uploaded / required total)

### AI Agent Chat
- [ ] User can open a chat with the agent for any application context
- [ ] Agent responds using GPT-4o with streaming (SSE)
- [ ] Agent uses function calling for: get requirements, validate checklist, get timeline, update status
- [ ] Agent maintains short-term conversation context (last 10 turns in prompt)
- [ ] Agent refuses off-topic requests gracefully ("I'm specialized in visa processes…")
- [ ] Agent response includes source citations when referencing requirements
- [ ] Rate limit: 10 messages / minute per user

### Country Requirements
- [ ] System stores requirements for ≥ 20 countries
- [ ] Requirements include: visa types, required docs, processing time, fees (USD), embassy link
- [ ] Data versioned with `last_verified_at` timestamp
- [ ] Agent warns user if data is > 90 days old

### Timeline Tracking
- [ ] Timeline shows predicted milestones: doc gathering → submission → processing → decision
- [ ] Each milestone has estimated date based on processing time for country + visa type
- [ ] User can mark milestones complete
- [ ] Agent can describe what happens at each stage

---

## Non-Functional Requirements

- [ ] API p95 response time < 500ms (excluding AI streaming)
- [ ] Agent first-token latency < 2s
- [ ] System handles 50 concurrent users (load tested)
- [ ] Zero PII logged to console or files
- [ ] All secrets via environment variables (never hardcoded)
- [ ] OWASP top 10 addressed in API (helmet, CORS, rate limiting, input validation)
- [ ] Test coverage ≥ 80% on `src/agent/` and `src/api/`

---

## Data Model

### `users`
| Column         | Type        | Notes                    |
|----------------|-------------|--------------------------|
| id             | UUID PK     |                          |
| email          | TEXT UNIQUE |                          |
| password_hash  | TEXT        | bcrypt, cost=12          |
| created_at     | TIMESTAMP   |                          |
| refresh_token  | TEXT NULL   | stored hashed            |

### `visa_applications`
| Column             | Type        | Notes                                     |
|--------------------|-------------|-------------------------------------------|
| id                 | UUID PK     |                                           |
| user_id            | UUID FK     | → users                                   |
| destination_country| TEXT        | ISO 3166-1 alpha-2                        |
| visa_type          | TEXT        | tourist / student / work / family / etc.  |
| applicant_nationality | TEXT     | ISO 3166-1 alpha-2                        |
| travel_date        | DATE NULL   |                                           |
| status             | ENUM        | draft/documents_pending/submitted/...     |
| created_at         | TIMESTAMP   |                                           |
| updated_at         | TIMESTAMP   |                                           |

### `document_checklist_items`
| Column         | Type      | Notes                        |
|----------------|-----------|------------------------------|
| id             | UUID PK   |                              |
| application_id | UUID FK   | → visa_applications          |
| name           | TEXT      | e.g. "Valid Passport"        |
| description    | TEXT      |                              |
| is_required    | BOOLEAN   |                              |
| is_uploaded    | BOOLEAN   | default false                |
| sort_order     | INT       |                              |

### `timeline_events`
| Column         | Type      | Notes                          |
|----------------|-----------|--------------------------------|
| id             | UUID PK   |                                |
| application_id | UUID FK   | → visa_applications            |
| milestone      | TEXT      | e.g. "Documents Ready"         |
| estimated_date | DATE      |                                |
| completed_at   | TIMESTAMP NULL |                           |
| sort_order     | INT       |                                |

### `country_requirements`
| Column            | Type      | Notes                              |
|-------------------|-----------|------------------------------------|
| id                | UUID PK   |                                    |
| country_code      | TEXT      | ISO 3166-1 alpha-2                 |
| visa_type         | TEXT      |                                    |
| required_docs     | JSONB     | array of {name, description}       |
| processing_days   | INT       | typical calendar days              |
| fee_usd           | DECIMAL   |                                    |
| embassy_url       | TEXT      |                                    |
| notes             | TEXT      |                                    |
| last_verified_at  | TIMESTAMP |                                    |

### `chat_messages`
| Column         | Type      | Notes              |
|----------------|-----------|--------------------|
| id             | UUID PK   |                    |
| application_id | UUID FK   |                    |
| role           | ENUM      | user / assistant   |
| content        | TEXT      |                    |
| created_at     | TIMESTAMP |                    |

---

## API Design

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PATCH  /api/applications/:id/status
DELETE /api/applications/:id

GET    /api/applications/:id/checklist
PATCH  /api/applications/:id/checklist/:itemId

GET    /api/applications/:id/timeline
PATCH  /api/applications/:id/timeline/:eventId/complete

POST   /api/agent/chat              (streams SSE)
GET    /api/applications/:id/chat/history

GET    /api/countries
GET    /api/countries/:code/requirements/:visaType

GET    /api/health
```

---

## Agent Tool Definitions

```typescript
tools = [
  {
    name: "get_country_requirements",
    description: "Get visa requirements for a specific country and visa type",
    parameters: { country_code: string, visa_type: string }
  },
  {
    name: "validate_document_checklist",
    description: "Check which required documents are still missing for an application",
    parameters: { application_id: string }
  },
  {
    name: "get_timeline_estimate",
    description: "Return estimated processing timeline for a visa type",
    parameters: { country_code: string, visa_type: string, travel_date?: string }
  },
  {
    name: "update_application_status",
    description: "Update the status of a visa application",
    parameters: { application_id: string, status: ApplicationStatus }
  },
  {
    name: "get_application_summary",
    description: "Return a full summary of the current application state",
    parameters: { application_id: string }
  }
]
```

---

## Test Plan

### Unit Tests (`tests/unit/`)
- Agent tool dispatcher: each tool called with correct args, returns expected shape
- `validate_document_checklist`: returns correct missing-docs list
- `get_timeline_estimate`: returns days in correct range for known countries
- Auth middleware: valid JWT passes, expired JWT returns 401, tampered JWT returns 401
- Zod request validators: valid body passes, missing fields return 400 with correct messages
- Type guards: all TypeScript type guards behave correctly at runtime

### Integration Tests (`tests/integration/`)
- `POST /api/auth/register` → creates user, returns tokens
- `POST /api/applications` → creates application + generates checklist + generates timeline
- `POST /api/agent/chat` → agent streams response, tool calls execute against real DB (test DB)
- Status transition: `draft` → `documents_pending` only when checklist ≥ 80% complete
- Rate limiting: 11th request in 1 min returns 429

### E2E Tests (`tests/e2e/`)
- User journey: register → log in → create application (US tourist) → chat ("what documents do I need?") → mark passport uploaded → check progress

### Edge Cases
- User requests visa for unsupported country → agent responds gracefully, suggests checking embassy website
- OpenAI API timeout → agent returns fallback message, does not crash
- Expired travel date → agent warns user during checklist validation
- User submits with 0 documents uploaded → status transition blocked

---

## Open Questions

- [ ] Should we store actual document files? (v0.1: no — just track upload status; v0.2: S3/R2)
- [ ] Which countries should be in the initial seed? (Proposed: US, UK, Canada, Australia, Schengen x5, Japan, UAE, Singapore, India, China, Brazil, South Korea, New Zealand, Switzerland, Norway)
- [ ] Should the agent have long-term memory across sessions? (v0.1: last 10 turns only; later: vector store)
- [ ] Do we need a separate admin panel for updating country requirements? (v0.1: seed script + manual DB update)
- [ ] Token cost tracking per user — should we expose this in the UI?
