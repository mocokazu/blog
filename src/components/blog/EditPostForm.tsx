
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types/post';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import CategorySelect from './CategorySelect';
import TagsSelect from './TagsSelect';

interface EditPostFormProps {
  postId: string;
}

const EditPostForm = ({ postId }: EditPostFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      try {
        setLoading(true);
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const post = docSnap.data() as Post;
          setTitle(post.title);
          setContent(post.content);
          setSelectedCategory(post.category || '');
          setSelectedTags(Array.isArray(post.tags) ? post.tags : []);
          setSeoTitle(post.seoTitle || post.title || '');
          setSeoDescription(post.seoDescription || post.excerpt || '');
          const kws = Array.isArray(post.seoKeywords) ? post.seoKeywords : [];
          setSeoKeywordsInput(kws.join(', '));
        }
      } catch (err) {
        console.error('記事の取得に失敗しました:', err);
        setError('記事の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !content) {
      setError('タイトルと本文は必須です');
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
        category: selectedCategory || null,
        tags: selectedTags,
        excerpt: excerptFromMarkdown(content),
        seoTitle: (seoTitle || title).trim(),
        seoDescription: (seoDescription || excerptFromMarkdown(content)).trim(),
        seoKeywords,
        updatedAt: serverTimestamp(),
      });
      
      setSuccess('記事が更新されました');
    } catch (err) {
      console.error('記事の更新に失敗しました:', err);
      setError('記事の更新に失敗しました');
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
      <div className="flex items-center gap-3 mt-4">
        <button 
          type="submit"
          className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          記事を更新
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </div>
    </form>
  );
};

export default EditPostForm;
