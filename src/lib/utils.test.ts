import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge basic class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle tailwind-merge conflict resolution', () => {
    // twMerge will resolve conflicts in favor of the last class
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('m-2', 'mt-4')).toBe('m-2 mt-4');
  });

  it('should handle clsx conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('should handle falsy values', () => {
    expect(cn('class1', null, undefined, '', 0, false, 'class2')).toBe('class1 class2');
  });

  it('should handle complex combinations', () => {
    const isError = true;
    const isLarge = false;
    expect(
      cn(
        'base-class',
        'p-2',
        isError ? 'bg-red-500' : 'bg-green-500',
        { 'text-lg': isLarge },
        ['flex', 'items-center'],
        'p-4' // Overrides p-2 due to twMerge
      )
    ).toBe('base-class bg-red-500 flex items-center p-4');
  });
});
