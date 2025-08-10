'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/components/blog/ArticleEditor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Article } from '@/types/blog';
import { ArticleService } from '@/lib/database/articles';

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadArticle();
    }
  }, [user, loading, router, params.id]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      const articleService = new ArticleService();
      
      // 仮のデータ（実際のAPIコールに置き換える）
      const mockArticle: Article = {
        id: params.id,
        title: 'Next.js 14の新機能について',
        slug: 'nextjs-14-new-features',
        excerpt: 'Next.js 14で追加された新機能について詳しく解説します。',
        content: `# Next.js 14の新機能について

Next.js 14では多くの新機能が追加されました。この記事では、主要な新機能について詳しく解説します。

## App Router の改善

App Routerがさらに改善され、パフォーマンスが向上しました。

### 主な改善点

1. **Server Components の最適化**
   - レンダリング速度の向上
   - メモリ使用量の削減

2. **Streaming の改善**
   - より効率的なデータストリーミング
   - ユーザー体験の向上

## Turbopack の統合

開発環境でのTurbopackの統合により、ビルド時間が大幅に短縮されました。

## まとめ

Next.js 14は多くの改善が含まれており、開発者体験とパフォーマンスの両方が向上しています。`,
        status: 'published',
        featured_image: 'https://via.placeholder.com/800x400',
        is_premium: false,
        reading_time: 5,
        author_id: user!.id,
        category_id: '1',
        published_at: '2024-01-15T10:00:00Z',
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        view_count: 1234,
        like_count: 45,
        comment_count: 12,
        author: {
          id: user!.id,
          email: user!.email!,
          full_name: user!.user_metadata?.full_name || 'ユーザー',
          avatar_url: undefined,
          bio: undefined,
          website: undefined,
          twitter: undefined,
          github: undefined,
          created_at: '',
          updated_at: ''
        },
        category: {
          id: '1',
          name: 'テクノロジー',
          slug: 'technology',
          description: '',
          created_at: '',
          updated_at: ''
        },
        tags: [
          { id: '1', name: 'Next.js', slug: 'nextjs', created_at: '', updated_at: '' },
          { id: '2', name: 'React', slug: 'react', created_at: '', updated_at: '' },
          { id: '3', name: 'TypeScript', slug: 'typescript', created_at: '', updated_at: '' }
        ]
      };

      // 記事の所有者チェック
      if (mockArticle.author_id !== user!.id) {
        setError('この記事を編集する権限がありません');
        return;
      }

      setArticle(mockArticle);
    } catch (error) {
      console.error('Failed to load article:', error);
      setError('記事の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">エラー</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/dashboard/articles')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            記事一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">記事が見つかりません</h2>
          <p className="text-gray-600">指定された記事は存在しないか、削除された可能性があります。</p>
          <button
            onClick={() => router.push('/dashboard/articles')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            記事一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (updatedArticle: Article) => {
    // 記事保存後の処理
    router.push('/dashboard/articles');
  };

  const handleCancel = () => {
    router.push('/dashboard/articles');
  };

  return (
    <div className="py-8">
      <ArticleEditor
        article={article}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
