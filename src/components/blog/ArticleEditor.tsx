'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isNonEmptyString, isValidSlug } from '@/utils/validation';
import { ArticleService } from '@/lib/database/articles';
import { Article, Category, Tag } from '@/types/blog';
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus,
  Hash,
  Calendar,
  User
} from 'lucide-react';

interface ArticleEditorProps {
  article?: Article;
  onSave?: (article: Article) => void;
  onCancel?: () => void;
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    featured_image: article?.featured_image || '',
    category_id: article?.category_id || '',
    status: article?.status || 'draft' as const,
    tags: article?.tags?.map(tag => tag.name) || [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const articleService = new ArticleService();
      // カテゴリー取得のメソッドを実装する必要があります
      // const categoriesData = await articleService.getCategories();
      // setCategories(categoriesData);
      
      // 仮のデータ
      setCategories([
        { id: '1', name: 'テクノロジー', slug: 'technology', description: '', created_at: '', updated_at: '' },
        { id: '2', name: 'デザイン', slug: 'design', description: '', created_at: '', updated_at: '' },
        { id: '3', name: 'ライフスタイル', slug: 'lifestyle', description: '', created_at: '', updated_at: '' },
      ]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      // タグ取得のメソッドを実装する必要があります
      // const tagsData = await articleService.getTags();
      // setAvailableTags(tagsData);
      
      // 仮のデータ
      setAvailableTags([
        { id: '1', name: 'React', slug: 'react', created_at: '', updated_at: '' },
        { id: '2', name: 'TypeScript', slug: 'typescript', created_at: '', updated_at: '' },
        { id: '3', name: 'Next.js', slug: 'nextjs', created_at: '', updated_at: '' },
      ]);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isNonEmptyString(formData.title)) {
      newErrors.title = 'タイトルを入力してください';
    }

    if (!isNonEmptyString(formData.slug)) {
      newErrors.slug = 'スラッグを入力してください';
    } else if (!isValidSlug(formData.slug)) {
      newErrors.slug = 'スラッグは英数字とハイフンのみ使用できます';
    }

    if (!isNonEmptyString(formData.content)) {
      newErrors.content = '本文を入力してください';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'カテゴリーを選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user) return;

    const updatedFormData = { ...formData, status };
    
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});

    try {
      const articleService = new ArticleService();
      
      const { tags, ...restFormData } = updatedFormData;
      const articleData = {
        ...restFormData,
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : undefined,
        // tagsは別途処理
      };

      let savedArticle: Article;
      
      if (article?.id) {
        // 更新
        savedArticle = await articleService.updateArticle(article.id, articleData);
      } else {
        // 新規作成
        savedArticle = await articleService.createArticle(articleData);
      }

      onSave?.(savedArticle);
    } catch (error) {
      console.error('Failed to save article:', error);
      setErrors({ general: '記事の保存に失敗しました' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // タイトルが変更された場合、スラッグを自動生成
    if (field === 'title' && !article?.id) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* ヘッダー */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {article?.id ? '記事を編集' : '新しい記事を作成'}
            </h1>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreview ? 'エディター' : 'プレビュー'}</span>
              </Button>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  キャンセル
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* フォーム */}
        <div className="p-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {!isPreview ? (
            <div className="space-y-6">
              {/* タイトル */}
              <div>
                <Input
                  label="タイトル"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                  placeholder="記事のタイトルを入力"
                  disabled={isSaving}
                />
              </div>

              {/* スラッグ */}
              <div>
                <Input
                  label="スラッグ (URL)"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  error={errors.slug}
                  placeholder="article-slug"
                  disabled={isSaving}
                  helperText="記事のURLに使用されます"
                />
              </div>

              {/* 概要 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  概要
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="記事の概要を入力（省略可）"
                  disabled={isSaving}
                />
              </div>

              {/* カテゴリー */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリー
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="">カテゴリーを選択</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>
                )}
              </div>

              {/* タグ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                        disabled={isSaving}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="新しいタグを入力"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!newTag.trim() || isSaving}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* アイキャッチ画像 */}
              <div>
                <Input
                  label="アイキャッチ画像URL"
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={isSaving}
                />
              </div>

              {/* 本文 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本文 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder="Markdownで記事を書いてください..."
                  disabled={isSaving}
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                )}
              </div>
            </div>
          ) : (
            /* プレビュー */
            <div className="prose max-w-none">
              <h1>{formData.title || 'タイトル未設定'}</h1>
              {formData.excerpt && (
                <p className="text-lg text-gray-600 italic">{formData.excerpt}</p>
              )}
              <div className="whitespace-pre-wrap">{formData.content}</div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{user?.user_metadata?.full_name || user?.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                loading={isSaving}
                disabled={isSaving}
              >
                下書き保存
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave('published')}
                loading={isSaving}
                disabled={isSaving}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>公開</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
