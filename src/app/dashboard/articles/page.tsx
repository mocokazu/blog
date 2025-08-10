'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { Article } from '@/types/blog';
import { ArticleService } from '@/lib/database/articles';
import { formatDate, formatRelativeTime } from '@/utils/date';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

export default function ArticlesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadArticles();
    }
  }, [user, loading, router]);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const articleService = new ArticleService();
      
      // 仮のデータ（実際のAPIコールに置き換える）
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Next.js 14の新機能について',
          slug: 'nextjs-14-new-features',
          excerpt: 'Next.js 14で追加された新機能について詳しく解説します。',
          content: 'Next.js 14では多くの新機能が追加されました...',
          status: 'published',
          featured_image: 'https://via.placeholder.com/400x200',
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
            { id: '2', name: 'React', slug: 'react', created_at: '', updated_at: '' }
          ]
        },
        {
          id: '2',
          title: 'TypeScriptのベストプラクティス',
          slug: 'typescript-best-practices',
          excerpt: 'TypeScriptを効果的に使うためのベストプラクティスをまとめました。',
          content: 'TypeScriptを使う際のベストプラクティス...',
          status: 'draft',
          featured_image: undefined,
          author_id: user!.id,
          category_id: '1',
          published_at: null,
          created_at: '2024-01-14T15:00:00Z',
          updated_at: '2024-01-14T16:30:00Z',
          view_count: 0,
          like_count: 0,
          comment_count: 0,
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
            { id: '2', name: 'TypeScript', slug: 'typescript', created_at: '', updated_at: '' }
          ]
        }
      ];
      
      setArticles(mockArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('この記事を削除しますか？')) return;

    try {
      const articleService = new ArticleService();
      await articleService.deleteArticle(articleId);
      setArticles(prev => prev.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('記事の削除に失敗しました');
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マイ記事</h1>
          <p className="text-gray-600 mt-1">
            作成した記事を管理できます
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>新しい記事</span>
          </Button>
        </Link>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="published">公開済み</option>
              <option value="draft">下書き</option>
            </select>
          </div>
        </div>
      </div>

      {/* 記事一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Edit className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? '記事が見つかりません' : 'まだ記事がありません'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? '検索条件を変更してみてください' 
                : '最初の記事を作成してみましょう'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link href="/dashboard/articles/new">
                <Button variant="primary">記事を作成</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredArticles.map((article) => (
              <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {article.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? '公開済み' : '下書き'}
                      </span>
                    </div>
                    
                    {article.excerpt && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.view_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{article.like_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{article.comment_count}</span>
                      </div>
                      <span>
                        {article.published_at 
                          ? `公開: ${formatDate(article.published_at)}`
                          : `更新: ${formatRelativeTime(article.updated_at)}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {article.status === 'published' && (
                      <Link href={`/blog/${article.slug}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総記事数</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">公開済み</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.filter(a => a.status === 'published').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">下書き</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.filter(a => a.status === 'draft').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
