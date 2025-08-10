
import { getPostBySlug } from '@/services/postService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';
import Script from 'next/script';

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: '記事が見つかりません' };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || '';
  const keywords = post.seoKeywords && post.seoKeywords.length > 0 ? post.seoKeywords : post.tags || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonical = `${siteUrl}/blog/${post.slug}`;
  const toAbsolute = (src?: string) => {
    if (!src) return undefined;
    if (/^https?:\/\//i.test(src)) return src;
    const needsSlash = src.startsWith('/') ? '' : '/';
    return `${siteUrl}${needsSlash}${src}`;
  };
  const ogDefault = process.env.NEXT_PUBLIC_OG_DEFAULT;
  const ogImage = toAbsolute(post.featuredImage || ogDefault);
  let siteName: string | undefined;
  try {
    siteName = new URL(siteUrl).host;
  } catch {}
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
       url: canonical,
       siteName,
       images: ogImage ? [{ url: ogImage }] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

const PostPage = async ({ params }: PageProps) => {
  // ルートは [slug]。URL パラメータの slug で記事を取得
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="space-y-4">
      {/* JSON-LD 構造化データ（BlogPosting） */}
      <Script
        id="blog-post-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || '',
            datePublished: (post.publishedAt as Date)?.toISOString?.() || '',
            dateModified: (post.updatedAt as Date)?.toISOString?.() || (post.publishedAt as Date)?.toISOString?.() || '',
            author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
            keywords: [
              ...((post.seoKeywords || []) as string[]),
              ...((post.tags || []) as string[]),
            ],
            articleSection: post.category || undefined,
          }),
        }}
      />
      <header>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-2">
          {post.publishedAt && (
            <p className="text-sm text-neutral-500">
              {('toDate' in post.publishedAt ? post.publishedAt.toDate() : post.publishedAt).toLocaleDateString('ja-JP')}
            </p>
          )}
          {post.category && (
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {post.category}
            </span>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
            {post.tags.map((t) => (
              <span key={t} className="rounded bg-neutral-100 px-2 py-0.5">#{t}</span>
            ))}
          </div>
        )}
      </header>
      <div className="prose max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default PostPage;
