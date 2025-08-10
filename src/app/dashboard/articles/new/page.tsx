'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ArticleEditor from '@/components/blog/ArticleEditor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Article } from '@/types/blog';

export default function NewArticlePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSave = (article: Article) => {
    // 記事保存後の処理
    router.push('/dashboard/articles');
  };

  const handleCancel = () => {
    router.push('/dashboard/articles');
  };

  return (
    <div className="py-8">
      <ArticleEditor
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
