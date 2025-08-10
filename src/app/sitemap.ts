import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const { getPosts } = await import('@/services/postService');
    const posts = await getPosts(); // 公開記事のみ取得（service側でpublished==true）
    const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: (p.updatedAt as Date) || (p.publishedAt as Date) || new Date(),
    }));

    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
      ...postUrls,
    ];
  } catch {
    // 失敗時でも最低限のサイトマップを返す
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
    ];
  }
}
