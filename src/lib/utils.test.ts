import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge tailwind classes properly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should resolve tailwind class conflicts', () => {
    // twMerge should pick the last conflicting class
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('px-2', 'p-4')).toBe('p-4');
  });

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'active-class', false && 'inactive-class')).toBe('base-class active-class');
  });

  it('should handle array syntax', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('should handle object syntax', () => {
    expect(cn('base', { 'is-active': true, 'is-hidden': false })).toBe('base is-active');
  });

  it('should ignore nullish and boolean values', () => {
    expect(cn('class1', null, undefined, false, true, 'class2')).toBe('class1 class2');
  });

  it('should handle complex combinations', () => {
    expect(
      cn(
        'text-sm font-medium',
        { 'bg-primary text-white': true },
        ['hover:bg-primary/90', false && 'hidden'],
        'p-4 p-2' // p-2 overrides p-4 via twMerge
      )
    ).toBe('text-sm font-medium bg-primary text-white hover:bg-primary/90 p-2');
  });
});
