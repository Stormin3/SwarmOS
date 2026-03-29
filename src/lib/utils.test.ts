import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges basic strings correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2');
  });

  it('handles tailwind class conflicts correctly', () => {
    // twMerge logic: later classes override earlier ones
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles falsy values gracefully', () => {
    expect(cn('class1', null, undefined, false, '', 0, 'class2')).toBe('class1 class2');
  });

  it('handles nested complex structures', () => {
    expect(cn('base-class', ['arr-class1', { 'cond-class1': true, 'cond-class2': false }], 'final-class')).toBe('base-class arr-class1 cond-class1 final-class');
  });
});
