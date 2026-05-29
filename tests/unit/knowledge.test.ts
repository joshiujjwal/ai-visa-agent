// tests/unit/knowledge.test.ts — Unit tests for knowledge.ts staleness logic
// These are the FIRST tests — they define the contract before implementation is complete.

import { describe, it, expect } from 'vitest';
import { isDataStale, buildStalenessWarning } from '@/agent/knowledge.js';

describe('isDataStale', () => {
  it('returns false for data verified today', () => {
    expect(isDataStale(new Date())).toBe(false);
  });

  it('returns false for data verified 89 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 89);
    expect(isDataStale(date)).toBe(false);
  });

  it('returns true for data verified exactly 91 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 91);
    expect(isDataStale(date)).toBe(true);
  });

  it('returns true for data verified 1 year ago', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    expect(isDataStale(date)).toBe(true);
  });
});

describe('buildStalenessWarning', () => {
  it('includes the verification date in the warning message', () => {
    const date = new Date('2024-01-15T00:00:00Z');
    const warning = buildStalenessWarning(date);
    expect(warning).toContain('2024-01-15');
  });

  it('includes a recommendation to verify with embassy', () => {
    const warning = buildStalenessWarning(new Date());
    expect(warning.toLowerCase()).toContain('embassy');
  });

  it('starts with the warning emoji', () => {
    const warning = buildStalenessWarning(new Date());
    expect(warning).toMatch(/^⚠️/);
  });
});
