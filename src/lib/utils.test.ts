import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('base-class', 'extra-class')).toBe('base-class extra-class');
  });

  it('should resolve Tailwind CSS class conflicts', () => {
    // twMerge should prioritize the last class for the same property
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('should handle conditional class names', () => {
    expect(cn('px-2', true && 'py-2', false && 'm-2')).toBe('px-2 py-2');
  });

  it('should handle various input types (arrays, objects)', () => {
    expect(cn(['px-2', 'py-2'], { 'm-2': true, 'p-2': false })).toBe('px-2 py-2 m-2');
  });

  it('should ignore falsy values', () => {
    expect(cn('px-2', null, undefined, 0, false, '')).toBe('px-2');
  });
});
