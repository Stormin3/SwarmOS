import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges basic strings correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('resolves tailwind class conflicts correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles falsy values gracefully', () => {
    expect(cn('class1', null, undefined, false, 0, '', 'class2')).toBe('class1 class2');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles complex combinations', () => {
    expect(
      cn(
        'base-class',
        ['array-class1', { 'conditional-true': true, 'conditional-false': false }],
        'text-red-500',
        'text-blue-500' // Should override text-red-500 via twMerge
      )
    ).toBe('base-class array-class1 conditional-true text-blue-500');
  });
});
