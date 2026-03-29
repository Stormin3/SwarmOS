import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (class names) utility', () => {
  it('merges multiple standard strings into a single string', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('merges class names correctly with objects', () => {
    expect(cn('class1', { class2: true, class3: false, class4: true })).toBe('class1 class2 class4');
  });

  it('merges class names from arrays', () => {
    expect(cn(['class1', 'class2'], 'class3', [{ class4: true }])).toBe('class1 class2 class3 class4');
  });

  it('ignores falsy values (null, undefined, false, 0, "")', () => {
    expect(cn('class1', null, undefined, false, 0, '', 'class2')).toBe('class1 class2');
  });

  it('correctly resolves Tailwind CSS class conflicts', () => {
    // twMerge logic: latter padding classes should override earlier ones
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('p-2 px-4', 'px-6')).toBe('p-2 px-6');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500', { 'bg-blue-500': true })).toBe('bg-blue-500');
    expect(cn('bg-red-500', { 'bg-blue-500': false })).toBe('bg-red-500');
  });

  it('handles empty inputs without throwing errors', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(null)).toBe('');
  });
});
