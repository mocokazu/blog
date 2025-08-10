import type { Post } from '@/types/post';
import { filterAndSortPosts } from '@/utils/postFilter';

const makePost = (overrides: Partial<Post>): Post => ({
  id: overrides.id || 'id',
  title: overrides.title || 'Title',
  content: overrides.content || 'Content',
  slug: overrides.slug || 'slug',
  excerpt: overrides.excerpt,
  published: overrides.published ?? true,
  publishedAt: overrides.publishedAt || new Date('2024-01-01T00:00:00Z'),
  updatedAt: overrides.updatedAt || new Date('2024-01-01T00:00:00Z'),
  authorId: overrides.authorId || 'u1',
  authorName: overrides.authorName || 'User',
  authorEmail: overrides.authorEmail || 'user@example.com',
  tags: overrides.tags || [],
  featuredImage: overrides.featuredImage,
  seoTitle: overrides.seoTitle,
  seoDescription: overrides.seoDescription,
  seoKeywords: overrides.seoKeywords || [],
});

describe('filterAndSortPosts', () => {
  const posts: Post[] = [
    makePost({ id: 'a', title: 'Hello World', excerpt: 'greeting', tags: ['news'], publishedAt: new Date('2024-03-01') }),
    makePost({ id: 'b', title: 'Next.js Tips', content: 'router and link', tags: ['tech', 'next'], publishedAt: new Date('2024-05-10') }),
    makePost({ id: 'c', title: 'Daily Log', content: 'hello diary', tags: ['life'], publishedAt: new Date('2024-02-20') }),
    // Firestore Timestamp-like object
    makePost({ id: 'd', title: 'Old Note', content: 'archive', tags: ['life'], publishedAt: { toDate: () => new Date('2023-12-31') } as unknown as any }),
  ];

  it('filters by query across title and excerpt/content', () => {
    const out = filterAndSortPosts(posts, { query: 'hello' });
    expect(out.map((p) => p.id)).toEqual(['a', 'c']); // sorted new->old by default
  });

  it('filters by tag', () => {
    const out = filterAndSortPosts(posts, { tag: 'life' });
    expect(out.map((p) => p.id)).toEqual(['c', 'd']);
  });

  it('sorts by oldest when sort=old', () => {
    const out = filterAndSortPosts(posts, { sort: 'old' });
    expect(out[0].id).toBe('d');
    expect(out[out.length - 1].id).toBe('b');
  });

  it('combines query and tag', () => {
    const out = filterAndSortPosts(posts, { query: 'next', tag: 'next' });
    expect(out.map((p) => p.id)).toEqual(['b']);
  });
});
