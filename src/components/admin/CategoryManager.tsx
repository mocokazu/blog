'use client';

import { useState, useEffect } from 'react';
import { Category, CategoryTreeItem } from '@/types/category';
import { createCategory, updateCategory, deleteCategory, buildCategoryTree } from '@/services/categoryService';
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // カテゴリデータの取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoryTree = await buildCategoryTree();
        setCategories(categoryTree);
        setError(null);
      } catch (err) {
        console.error('カテゴリの取得に失敗しました:', err);
        setError('カテゴリの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // カテゴリの追加/編集
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCategory || !currentCategory.name) return;
    
    try {
      setIsLoading(true);
      
      if (currentCategory.id) {
        // 既存カテゴリの更新
        await updateCategory(currentCategory.id, currentCategory);
      } else {
        // 新規カテゴリの作成
        await createCategory(currentCategory as Omit<Category, 'id'>);
      }
      
      // データを再取得
      const categoryTree = await buildCategoryTree();
      setCategories(categoryTree);
      
      // フォームをリセット
      setIsEditing(false);
      setCurrentCategory(null);
      setError(null);
    } catch (err) {
      console.error('カテゴリの保存に失敗しました:', err);
      setError('カテゴリの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  // カテゴリの削除
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('このカテゴリを削除してもよろしいですか？')) return;
    
    try {
      setIsLoading(true);
      await deleteCategory(categoryId);
      
      // データを再取得
      const categoryTree = await buildCategoryTree();
      setCategories(categoryTree);
      setError(null);
    } catch (err) {
      console.error('カテゴリの削除に失敗しました:', err);
      setError('カテゴリの削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 編集モードの切り替え
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
  };
  
  // 新規カテゴリの作成準備
  const handleAddCategory = (parentId?: string) => {
    setCurrentCategory({ name: '', parentId });
    setIsEditing(true);
  };
  
  // フォームのキャンセル
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCategory(null);
  };
  
  // カテゴリの展開/折りたたみ
  const toggleCategoryExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  
  // カテゴリツリーの再帰的レンダリング
  const renderCategoryTree = (categories: CategoryTreeItem[], level = 0) => {
    return (
      <ul className={`pl-${level * 4} mt-${level === 0 ? 0 : 2}`}>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <div className="flex items-center py-2 pl-2 pr-4 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex-1 flex items-center">
                {category.children && category.children.length > 0 ? (
                  <button
                    onClick={() => toggleCategoryExpand(category.id!)}
                    className="mr-1 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {expandedCategories.has(category.id!) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                ) : (
                  <span className="w-6"></span>
                )}
                <span className="flex-1 font-medium">{category.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mr-4">
                  ({category.count || 0}記事)
                </span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  disabled={isLoading}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id!)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  disabled={isLoading || (category.count || 0) > 0}
                  title={(category.count || 0) > 0 ? "記事が関連付けられているため削除できません" : ""}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => handleAddCategory(category.id)}
                  className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  disabled={isLoading}
                >
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>
            
            {/* 子カテゴリ */}
            {expandedCategories.has(category.id!) && category.children && category.children.length > 0 && (
              renderCategoryTree(category.children, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="space-y-8">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* カテゴリ一覧 */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">カテゴリ一覧</h2>
          <button
            onClick={() => handleAddCategory()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            disabled={isLoading}
          >
            <PlusCircle size={16} className="mr-2" />
            新規カテゴリ
          </button>
        </div>
        
        {isLoading && !isEditing ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">読み込み中...</p>
          </div>
        ) : categories.length > 0 ? (
          renderCategoryTree(categories)
        ) : (
          <p className="py-4 text-center text-slate-600 dark:text-slate-400">
            カテゴリがまだ作成されていません
          </p>
        )}
      </div>
      
      {/* カテゴリ編集フォーム */}
      {isEditing && currentCategory && (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            {currentCategory.id ? 'カテゴリを編集' : '新規カテゴリ作成'}
          </h2>
          
          <form onSubmit={handleSaveCategory}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  カテゴリ名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentCategory.name || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block mb-1 font-medium">
                  スラッグ（URLに使用）
                </label>
                <input
                  id="slug"
                  type="text"
                  value={currentCategory.slug || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
                  placeholder="空白の場合はカテゴリ名から自動生成"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  説明
                </label>
                <textarea
                  id="description"
                  value={currentCategory.description || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="sortOrder" className="block mb-1 font-medium">
                  表示順
                </label>
                <input
                  id="sortOrder"
                  type="number"
                  value={currentCategory.sortOrder || 99}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
                  min="0"
                  max="999"
                />
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  小さい数字ほど上部に表示されます
                </p>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
