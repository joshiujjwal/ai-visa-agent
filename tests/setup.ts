// tests/setup.ts — global test setup for Vitest
import { beforeAll, afterAll } from 'vitest';

// Ensure test environment variables are set
beforeAll(() => {
  process.env['NODE_ENV'] = 'test';
  if (!process.env['TEST_DATABASE_URL']) {
    process.env['TEST_DATABASE_URL'] =
      'postgresql://postgres:password@localhost:5432/ai_visa_agent_test';
  }
  if (!process.env['JWT_SECRET']) {
    process.env['JWT_SECRET'] = 'test-jwt-secret-min-32-chars-long!!';
  }
  if (!process.env['JWT_REFRESH_SECRET']) {
    process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-min-32-chars!!';
  }
  if (!process.env['OPENAI_API_KEY']) {
    process.env['OPENAI_API_KEY'] = 'sk-test-mock-key';
  }
});

afterAll(() => {
  // cleanup if needed
});
