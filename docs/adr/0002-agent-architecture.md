# ADR 0002 — GPT-4o with Function Calling for Agent Core

**Date:** 2025-01-01
**Status:** Accepted
**Deciders:** joshiujjwal

---

## Context

The AI agent needs to answer visa-related questions and also take structured actions (query DB for requirements, update application status, validate checklists). We need to decide how the agent integrates with the application backend.

## Decision

Use OpenAI GPT-4o with **function calling** (tools API). The agent receives a system prompt, conversation history, and a set of tool definitions. When GPT-4o decides to call a tool, the server executes it against PostgreSQL and returns the result to the model to continue the response. Streaming via SSE delivers partial tokens to the frontend as they arrive.

## Consequences

**Positive:**
- GPT-4o natively decides when to call tools vs. answer from knowledge — no custom routing logic
- Streaming keeps UX responsive even for long responses
- Tool definitions are self-documenting (JSON Schema)
- Easy to add new tools without changing agent orchestration logic

**Negative / Trade-offs:**
- Locked into OpenAI API — switching models requires rewriting tool definitions
- Function calling adds latency (extra round-trip to model after tool execution)
- Token costs are higher with full conversation history in every request

**Neutral:**
- Tool execution is synchronous within the agent loop — parallel tool calls possible in GPT-4o but not implemented in v0.1

---

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| LangChain agent | Adds abstraction overhead; function calling is simpler for this use case |
| Custom intent classifier + hardcoded handlers | Brittle; can't handle nuanced follow-up questions |
| RAG-only (no tools) | Can't update application state or do structured data queries |
| Anthropic Claude (tool use) | GPT-4o has better function calling docs/ecosystem at project start |
