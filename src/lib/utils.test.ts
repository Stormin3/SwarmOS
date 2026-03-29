import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges basic class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes using clsx', () => {
    expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2');
  });

  it('resolves Tailwind class conflicts using twMerge', () => {
    // text-red-500 and text-blue-500 conflict, so text-blue-500 should win
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');

    // px-2 and p-4 conflict (p-4 overrides px-2), so p-4 should win
    expect(cn('px-2', 'p-4')).toBe('p-4');
  });

  it('handles a combination of conditionals and conflicts', () => {
    expect(cn('px-2 text-red-500', { 'p-4 text-blue-500': true })).toBe('p-4 text-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('ignores falsy values', () => {
    expect(cn('class1', undefined, null, '', false, 'class2')).toBe('class1 class2');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});
