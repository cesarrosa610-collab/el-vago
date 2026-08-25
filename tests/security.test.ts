import { describe, expect, it } from 'vitest';
import { canDiscover, isAdmin } from '../src/lib/security';

describe('El Vago security rules', () => {
  it('does not unlock evidence early', () => {
    expect(canDiscover(2, 0)).toBe(false);
    expect(canDiscover(2, 1)).toBe(false);
    expect(canDiscover(2, 2)).toBe(true);
  });
  it('accepts only ADMIN as admin', () => {
    expect(isAdmin('ADMIN')).toBe(true);
    expect(isAdmin('USER')).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});
