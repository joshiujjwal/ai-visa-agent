// tests/integration/health.test.ts — First integration test: smoke test
// The server must return 200 on GET /health before any other work proceeds.

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '@/api/app.js';

const app = createApp();

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('GET /unknown-route', () => {
  it('returns 404 with structured error', async () => {
    const res = await request(app).get('/this-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
