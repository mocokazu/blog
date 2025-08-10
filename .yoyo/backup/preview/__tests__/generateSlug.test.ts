import { generateSlug } from '@/types/post';

describe('generateSlug', () => {
  it('lowercases and trims spaces', () => {
    expect(generateSlug('  Hello World  ')).toBe('hello-world');
  });

  it('removes punctuation and symbols', () => {
    expect(generateSlug('Hello, World! #2025?')).toBe('hello-world-2025');
  });

  it('collapses multiple spaces and hyphens', () => {
    expect(generateSlug('A   B -- C')).toBe('a-b-c');
  });

  it('handles non-latin chars by stripping non-word', () => {
    // non-word characters (including many non-latin chars) are removed, leaving ascii and digits
    expect(generateSlug('タイトル 日本語 123')).toBe('123');
  });
});
