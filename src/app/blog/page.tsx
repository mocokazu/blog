import ArticleList from '@/components/blog/ArticleList';

// Mock data - In a real app, this would come from your CMS or API
const mockArticles = [
  {
    id: '1',
    title: 'Next.js 14で始めるモダンなブログ構築',
    excerpt: 'Next.js 14の新機能を活用して、パフォーマンスの高いブログを構築する方法を紹介します。',
    coverImage: '/images/blog/nextjs-14.jpg',
    date: '2025-08-01T10:00:00.000Z',
    readTime: '5',
    tags: ['Next.js', 'TypeScript', 'React'],
    slug: 'nextjs-14-blog',
  },
  {
    id: '2',
    title: 'Tailwind CSSのカスタマイズ方法',
    excerpt: 'Tailwind CSSをカスタマイズして、独自のデザインシステムを構築する方法を解説します。',
    coverImage: '/images/blog/tailwind-custom.jpg',
    date: '2025-07-25T14:30:00.000Z',
    readTime: '8',
    tags: ['Tailwind CSS', 'CSS', 'デザイン'],
    slug: 'tailwind-customization',
  },
  {
    id: '3',
    title: 'Supabaseで認証機能を実装する',
    excerpt: 'Supabaseの認証機能を使って、Next.jsアプリにログイン機能を追加する方法を紹介します。',
    coverImage: '/images/blog/supabase-auth.jpg',
    date: '2025-07-15T09:15:00.000Z',
    readTime: '6',
    tags: ['Supabase', '認証', 'Next.js'],
    slug: 'supabase-authentication',
  },
  {
    id: '4',
    title: 'TypeScriptの型定義のベストプラクティス',
    excerpt: 'TypeScriptの型定義を効果的に活用するためのベストプラクティスを紹介します。',
    coverImage: '/images/blog/typescript.jpg',
    date: '2025-07-10T11:20:00.000Z',
    readTime: '10',
    tags: ['TypeScript', '開発効率'],
    slug: 'typescript-best-practices',
  },
  {
    id: '5',
    title: 'React Server Componentsの活用方法',
    excerpt: 'React Server Componentsの特徴と、実際のプロジェクトでの活用方法を解説します。',
    coverImage: '/images/blog/react-server-components.jpg',
    date: '2025-06-28T16:45:00.000Z',
    readTime: '12',
    tags: ['React', 'Next.js', 'パフォーマンス'],
    slug: 'react-server-components',
  },
  {
    id: '6',
    title: 'モダンなフロントエンド開発環境の構築',
    excerpt: 'ESLint, Prettier, Huskyなどを活用した効率的な開発環境の構築方法を紹介します。',
    coverImage: '/images/blog/dev-environment.jpg',
    date: '2025-06-15T13:10:00.000Z',
    readTime: '7',
    tags: ['開発環境', 'ESLint', 'Prettier'],
    slug: 'modern-frontend-dev-env',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ブログ</h1>
        <p className="text-xl text-gray-600">技術的な知見や気づきを発信しています</p>
      </header>
      
      <ArticleList 
        articles={mockArticles} 
        currentPage={1}
        totalPages={3}
        basePath="/blog"
      />
    </div>
  );
}
