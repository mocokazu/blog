
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/services/postService';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(true);
  
  const categories = [
    '技術',
    'プログラミング',
    'ライフスタイル',
    'その他',
  ];
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
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      await createPost(
        {
          title,
          content,
          excerpt,
          published,
          tags,
          category: category || undefined,
        },
        user.uid,
        user.email ?? 'unknown@example.com',
        user.displayName ?? user.email?.split('@')[0] ?? 'Anonymous'
      );
      setTitle('');
      setContent('');
      setTagsInput('');
      setPublished(true);
      setSuccess('Post created successfully.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">カテゴリを選択</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タグ (カンマ区切り)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="tag1, tag2, tag3"
        />
        <p className="text-xs text-neutral-500 mt-1">例: react,nextjs,firebase</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post in Markdown..."
            required
            className="w-full min-h-[240px] rounded border px-3 py-2 font-mono"
          />
          <div className="w-full min-h-[240px] rounded border px-3 py-2 bg-white dark:bg-neutral-900 overflow-auto">
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || 'Preview will appear here...'}
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
        <label htmlFor="published" className="text-sm">Publish immediately</label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </div>
    </form>
  );
};

export default CreatePostForm;
