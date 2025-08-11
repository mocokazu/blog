
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/services/postService';
import CategorySelect from './CategorySelect';
import TagsSelect from './TagsSelect';
import { Post } from '@/types/post';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    try {
      setSubmitting(true);
      const excerpt = content.replace(/[#>*_`\-\n]/g, ' ').slice(0, 140).trim();
      
      await createPost(
        {
          title,
          content,
          excerpt,
          published,
          tags: selectedTags,
          category: selectedCategory || undefined,
        },
        user.uid,
        user.email ?? 'unknown@example.com',
        user.displayName ?? user.email?.split('@')[0] ?? 'Anonymous'
      );
      setTitle('');
      setContent('');
      setSelectedCategory('');
      setSelectedTags([]);
      setPublished(true);
      setSuccess('記事が正常に作成されました');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="記事のタイトルを入力"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <CategorySelect 
          selectedCategory={selectedCategory} 
          onChange={setSelectedCategory} 
        />
      </div>

      <div className="mb-4">
        <TagsSelect 
          selectedTags={selectedTags} 
          onChange={setSelectedTags} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">本文 (Markdown)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Markdownで記事を書いてください..."
            required
            className="w-full min-h-[240px] rounded border border-gray-300 px-3 py-2 font-mono dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <div className="w-full min-h-[240px] rounded border border-gray-300 px-3 py-2 bg-white dark:bg-neutral-900 overflow-auto">
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || 'プレビューがここに表示されます...'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="published" className="text-sm">すぐに公開する</label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? '作成中...' : '記事を作成'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </div>
    </form>
  );
};

export default CreatePostForm;
