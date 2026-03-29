import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn()', () => {
  it('should merge basic class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should override tailwind classes', () => {
    // Tailwind specific behavior: p-4 overrides p-2
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle truthy and falsy values conditional inputs', () => {
    expect(cn('base-class', true && 'active-class', false && 'inactive-class', null, undefined)).toBe('base-class active-class');
  });

  it('should handle object inputs properly', () => {
    expect(cn({
      'class1': true,
      'class2': false,
      'class3': true
    })).toBe('class1 class3');
  });

  it('should handle array inputs properly', () => {
    expect(cn(['class1', 'class2'], ['class3'])).toBe('class1 class2 class3');
  });

  it('should handle mixed inputs (string, object, array, conditional)', () => {
    expect(cn(
      'base-class',
      ['array-class1', 'array-class2'],
      { 'obj-class1': true, 'obj-class2': false },
      'p-2 p-4' // tests twMerge at the same time
    )).toBe('base-class array-class1 array-class2 obj-class1 p-4');
  });
});
