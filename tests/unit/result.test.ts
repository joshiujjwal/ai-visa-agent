// tests/unit/result.test.ts — Unit tests for the Result<T,E> utility

import { describe, it, expect } from 'vitest';
import { ok, err, isOk, isErr } from '@/lib/result.js';

describe('ok()', () => {
  it('creates a successful result', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(42);
  });
});

describe('err()', () => {
  it('creates a failed result', () => {
    const result = err(new Error('something went wrong'));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('something went wrong');
  });
});

describe('isOk()', () => {
  it('returns true for ok results', () => {
    expect(isOk(ok('hello'))).toBe(true);
  });

  it('returns false for err results', () => {
    expect(isOk(err('oops'))).toBe(false);
  });
});

describe('isErr()', () => {
  it('returns true for err results', () => {
    expect(isErr(err('oops'))).toBe(true);
  });

  it('returns false for ok results', () => {
    expect(isErr(ok(42))).toBe(false);
  });
});
