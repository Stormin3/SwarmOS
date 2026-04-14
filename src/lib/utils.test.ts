import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges basic string classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes with clsx', () => {
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('resolves tailwind class conflicts with twMerge', () => {
    expect(cn('p-4 p-8', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500 text-white', 'bg-blue-500')).toBe('text-white bg-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  it('handles mixed inputs', () => {
    expect(cn('class1', ['class2', { class3: true }], 'text-red-500', 'text-blue-500')).toBe('class1 class2 class3 text-blue-500');
  });

  it('handles undefined, null, and false', () => {
    expect(cn('class1', undefined, null, false, 'class2')).toBe('class1 class2');
  });
});
