import { describe, expect, it } from 'vitest';
import { canDiscover, isAdmin } from '../src/lib/security';

describe('El Vago security rules', () => {
  it('does not unlock evidence early', () => {
    expect(canDiscover(2, 0)).toBe(false);
    expect(canDiscover(2, 1)).toBe(false);
    expect(canDiscover(2, 2)).toBe(true);
  });

  it('matches the narrative progression thresholds', () => {
    expect(canDiscover(0, 0)).toBe(true);
    expect(canDiscover(1, 0)).toBe(false);
    expect(canDiscover(1, 1)).toBe(true);
    expect(canDiscover(2, 1)).toBe(false);
    expect(canDiscover(2, 2)).toBe(true);
    expect(canDiscover(3, 2)).toBe(false);
    expect(canDiscover(3, 3)).toBe(true);
    expect(canDiscover(4, 3)).toBe(false);
    expect(canDiscover(4, 4)).toBe(true);
  });

  it('keeps unlocked content available after additional discoveries', () => {
    expect(canDiscover(1, 4)).toBe(true);
    expect(canDiscover(2, 4)).toBe(true);
    expect(canDiscover(3, 4)).toBe(true);
    expect(canDiscover(4, 4)).toBe(true);
  });

  it('accepts only ADMIN as admin', () => {
    expect(isAdmin('ADMIN')).toBe(true);
    expect(isAdmin('USER')).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});
