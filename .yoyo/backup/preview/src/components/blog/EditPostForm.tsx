
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types/post';
import MarkdownEditor from '@/components/editor/MarkdownEditor';

interface EditPostFormProps {
  postId: string;
}

const EditPostForm = ({ postId }: EditPostFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywordsInput, setSeoKeywordsInput] = useState('');
  
  const categories = [
    '技術',
    'プログラミング',
    'ライフスタイル',
    'その他',
  ];

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const post = docSnap.data() as Post;
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || '');
        setSeoTitle(post.seoTitle || post.title || '');
        setSeoDescription(post.seoDescription || post.excerpt || '');
        const kws = Array.isArray(post.seoKeywords) ? post.seoKeywords : [];
        setSeoKeywordsInput(kws.join(', '));
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      const seoKeywords = seoKeywordsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const excerptFromMarkdown = (md: string, max = 160) =>
        md
          .replace(/```[\s\S]*?```/g, ' ')
          .replace(/`[^`]*`/g, ' ')
          .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
          .replace(/\[[^\]]*\]\([^\)]*\)/g, ' ')
          .replace(/[#>*_`~\-]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, max);

      await updateDoc(postRef, {
        title,
        content,
        category: category || null,
        excerpt: excerptFromMarkdown(content),
        seoTitle: (seoTitle || title).trim(),
        seoDescription: (seoDescription || excerptFromMarkdown(content)).trim(),
        seoKeywords,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
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

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">SEO タイトル</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="検索結果に表示されるタイトル"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">SEO 説明</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
            placeholder="検索結果の説明文（120-160文字目安）"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">SEO キーワード（カンマ区切り）</label>
          <input
            type="text"
            value={seoKeywordsInput}
            onChange={(e) => setSeoKeywordsInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="例: Next.js, Firebase, 個人開発"
          />
        </div>
      </div>

      <MarkdownEditor
        value={content}
        onChange={setContent}
        placeholder="本文を入力（Markdown対応・プレビュー可・画像アップロード可）"
      />
      <button type="submit">Update Post</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default EditPostForm;
