import type { Post } from '@/types/post';

export type SortOrder = 'new' | 'old';

type FirestoreTimestampLike = { toDate: () => Date };

const toDate = (d: Date | FirestoreTimestampLike): Date =>
  (typeof (d as FirestoreTimestampLike).toDate === 'function' ? (d as FirestoreTimestampLike).toDate() : (d as Date));

export function filterAndSortPosts(
  posts: Post[],
  {
    query = '',
    tag = '',
    category = '',
    sort = 'new',
  }: { query?: string; tag?: string; category?: string; sort?: SortOrder }
): Post[] {
  const q = (query || '').trim().toLowerCase();
  const base = posts.filter((p) => {
    const matchesQuery = q
      ? (p.title || '').toLowerCase().includes(q) || ((p.excerpt || p.content || '').toLowerCase().includes(q))
      : true;
    const matchesTag = tag ? (p.tags || []).includes(tag) : true;
    const matchesCategory = category ? p.category === category : true;
    return matchesQuery && matchesTag && matchesCategory;
  });
  const sorted = [...base].sort((a, b) => {
    const aD = toDate(a.publishedAt).getTime();
    const bD = toDate(b.publishedAt).getTime();
    return sort === 'old' ? aD - bD : bD - aD;
  });
  return sorted;
}
