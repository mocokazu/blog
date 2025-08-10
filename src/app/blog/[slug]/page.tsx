import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data - In a real app, this would come from your CMS or API
const getArticle = (slug: string) => {
  return {
    id: '1',
    title: 'Next.js 14で始めるモダンなブログ構築',
    content: `
      <h2>はじめに</h2>
      <p>Next.js 14では、App RouterやServer Componentsなどの新機能が追加され、よりパフォーマンスの高いWebアプリケーションを構築できるようになりました。この記事では、これらの新機能を活用したモダンなブログの構築方法を紹介します。</p>
      
      <h2>プロジェクトのセットアップ</h2>
      <p>まずは、Next.jsの最新バージョンでプロジェクトを作成します。</p>
      
      <pre><code>npx create-next-app@latest my-blog --typescript --tailwind --eslint</code></pre>
      
      <h2>App Routerの活用</h2>
      <p>Next.js 14では、App Routerが安定版として利用可能になりました。App Routerを活用することで、より直感的なルーティングが可能になります。</p>
      
      <h2>データフェッチング</h2>
      <p>Server Componentsを活用して、効率的なデータフェッチングを実装します。</p>
      
      <h2>まとめ</h2>
      <p>Next.js 14を活用することで、パフォーマンスと開発者体験の両方を高めたモダンなブログを構築できます。</p>
    `,
    coverImage: '/images/blog/nextjs-14.jpg',
    date: '2025-08-01T10:00:00.000Z',
    readTime: '5',
    tags: ['Next.js', 'TypeScript', 'React'],
    slug: 'nextjs-14-blog',
    author: {
      name: '山田 太郎',
      avatar: '/images/authors/yamada.jpg',
      bio: 'フロントエンドエンジニア。ReactとTypeScriptが好きです。',
    },
  };
};

type Props = {
  params: {
    slug: string;
  };
};

export default function BlogPostPage({ params }: Props) {
  const article = getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          ブログ一覧に戻る
        </Link>
      </div>

      <article className="prose prose-lg max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center mr-6">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center mr-6">
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.readTime} 分で読める</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {article.coverImage && (
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </header>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center">
            {article.author.avatar && (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{article.author.name}</h3>
              {article.author.bio && (
                <p className="text-gray-600">{article.author.bio}</p>
              )}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

// Generate static params for SSG
// In a real app, this would fetch all blog post slugs from your CMS
export async function generateStaticParams() {
  // This is a mock - replace with actual data fetching
  const posts = [
    { slug: 'nextjs-14-blog' },
    { slug: 'tailwind-customization' },
    { slug: 'supabase-authentication' },
  ];
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
