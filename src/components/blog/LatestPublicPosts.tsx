"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/services/postService";
import type { Post } from "@/types/post";
import Link from "next/link";

export default function LatestPublicPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // 全記事を取得し、公開済みの記事のみをフィルタリング
        const data = await getPosts();
        const publishedPosts = data
          .filter(post => post.published)
          // 日付で降順ソート（新しい順）
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          // 最新5件に制限
          .slice(0, 3);
        
        if (mounted) setPosts(publishedPosts);
      } catch (e) {
        if (mounted) setError("記事の取得に失敗しました");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400 text-center py-6">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-6">まだ公開されている記事はありません。</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <article key={post.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/blog/${post.slug}`} className="block h-full">
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400">
                {post.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                {post.excerpt || post.content.substring(0, 120) + '...'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </span>
                
                {post.tags && post.tags.length > 0 && (
                  <span className="text-primary-600 dark:text-primary-400">
                    #{post.tags[0]}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
