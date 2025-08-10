'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { getPosts, deletePost, setPostPublished } from '@/services/postService';
import { Post } from '@/types/post';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
    }
  };

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
  };

  const handleCancelDelete = () => {
    setPostToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete?.id) return;
    
    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      
      // 削除後に一覧を更新
      const updatedPosts = posts.filter(post => post.id !== postToDelete.id);
      setPosts(updatedPosts);
      setPostToDelete(null);
    } catch (error) {
      console.error('記事の削除に失敗しました:', error);
      setError('記事の削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userPosts = await getPosts(user.uid);
        setPosts(userPosts);
      } catch (err) {
        console.error('記事の取得に失敗しました:', err);
        setError('記事の取得に失敗しました。再読み込みしてください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const formatDate = (date: Date | { toDate: () => Date }) => {
    if (!date) return '';
    
    // Timestampオブジェクトの場合はDateオブジェクトに変換
    const dateObj = date instanceof Date ? date : date.toDate();
    
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">記事一覧</h2>
              <Link
                href="/dashboard/ai-writer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                新しい記事を作成
              </Link>
            </div>

            {/* フィルター */}
            <div className="flex items-center gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded border text-sm ${filter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setFilter('all')}
              >
                すべて
              </button>
              <button
                className={`px-3 py-1 rounded border text-sm ${filter === 'published' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setFilter('published')}
              >
                公開
              </button>
              <button
                className={`px-3 py-1 rounded border text-sm ${filter === 'draft' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setFilter('draft')}
              >
                下書き
              </button>
            </div>
            
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">記事がありません</h3>
                <p className="mt-1 text-sm text-gray-500">新しい記事を作成して始めましょう。</p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/ai-writer"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    新しい記事を作成
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {posts
                    .filter((p) => {
                      if (filter === 'all') return true;
                      if (filter === 'published') return p.published;
                      return !p.published; // draft
                    })
                    .map((post) => (
                    <li key={post.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {post.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.published ? '公開中' : '下書き'}
                            </p>
                          </div>
                        </div>
                        {post.excerpt && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              最終更新: {formatDate(post.updatedAt)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <button
                              onClick={async () => {
                                try {
                                  setError('');
                                  setPublishingId(post.id ?? null);
                                  const next = !post.published;
                                  // 楽観的更新
                                  setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, published: next } : p));
                                  if (!post.id) return;
                                  await setPostPublished(post.id, next);
                                } catch (e) {
                                  console.error('公開状態の切り替えに失敗しました', e);
                                  setError('公開状態の切り替えに失敗しました。再度お試しください。');
                                  // 失敗時は元に戻す
                                  setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, published: post.published } : p));
                                } finally {
                                  setPublishingId(null);
                                }
                              }}
                              disabled={isLoading || isDeleting || publishingId === post.id}
                              className={`mr-4 inline-flex items-center px-3 py-1 border text-sm rounded ${post.published ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' : 'border-green-600 text-white bg-green-600 hover:bg-green-700'} disabled:opacity-50`}
                            >
                              {publishingId === post.id ? '更新中...' : (post.published ? '下書きに戻す' : '公開する')}
                            </button>
                            <Link 
                              href={`/dashboard/posts/edit/${post.id}`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              編集
                            </Link>
                            <button 
                              onClick={() => handleDeleteClick(post)}
                              className="text-red-600 hover:text-red-900"
                              disabled={isLoading || isDeleting}
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={!!postToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="記事を削除しますか？"
        description={`「${postToDelete?.title}」を削除します。この操作は元に戻せません。`}
        confirmText="削除する"
        cancelText="キャンセル"
        isLoading={isDeleting}
      />
    </div>
  );
}
