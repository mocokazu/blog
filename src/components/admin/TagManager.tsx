'use client';

import { useState, useEffect } from 'react';
import { Tag } from '@/types/tag';
import { createTag, updateTag, deleteTag, getAllTags } from '@/services/tagService';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState<Partial<Tag> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // タグデータの取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const allTags = await getAllTags();
        setTags(allTags);
        setError(null);
      } catch (err) {
        console.error('タグの取得に失敗しました:', err);
        setError('タグの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  // タグの追加/編集
  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTag || !currentTag.name) return;
    
    try {
      setIsLoading(true);
      
      if (currentTag.id) {
        // 既存タグの更新
        await updateTag(currentTag.id, currentTag);
      } else {
        // 新規タグの作成
        await createTag(currentTag as Omit<Tag, 'id'>);
      }
      
      // データを再取得
      const allTags = await getAllTags();
      setTags(allTags);
      
      // フォームをリセット
      setIsEditing(false);
      setCurrentTag(null);
      setError(null);
    } catch (err) {
      console.error('タグの保存に失敗しました:', err);
      setError('タグの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  // タグの削除
  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('このタグを削除してもよろしいですか？')) return;
    
    try {
      setIsLoading(true);
      await deleteTag(tagId);
      
      // データを再取得
      const allTags = await getAllTags();
      setTags(allTags);
      setError(null);
    } catch (err) {
      console.error('タグの削除に失敗しました:', err);
      setError('タグの削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 編集モードの切り替え
  const handleEditTag = (tag: Tag) => {
    setCurrentTag(tag);
    setIsEditing(true);
  };
  
  // 新規タグの作成準備
  const handleAddTag = () => {
    setCurrentTag({ name: '' });
    setIsEditing(true);
  };
  
  // フォームのキャンセル
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTag(null);
  };
  
  // 検索機能
  const filteredTags = searchQuery
    ? tags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tags;
  
  return (
    <div className="space-y-8">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* タグ一覧 */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">タグ一覧</h2>
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            disabled={isLoading}
          >
            <PlusCircle size={16} className="mr-2" />
            新規タグ
          </button>
        </div>
        
        {/* 検索フィールド */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="タグを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
          />
        </div>
        
        {isLoading && !isEditing ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">読み込み中...</p>
          </div>
        ) : filteredTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTags.map((tag) => (
              <div 
                key={tag.id} 
                className="border rounded p-4 flex justify-between items-center dark:border-slate-700"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{tag.name}</h3>
                  {tag.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {tag.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{tag.count || 0} 記事</span>
                    <span className="ml-4">スラッグ: {tag.slug}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditTag(tag)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    disabled={isLoading}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id!)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    disabled={isLoading || (tag.count || 0) > 0}
                    title={(tag.count || 0) > 0 ? "記事が関連付けられているため削除できません" : ""}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-slate-600 dark:text-slate-400">
            {searchQuery ? '検索条件に一致するタグがありません' : 'タグがまだ作成されていません'}
          </p>
        )}
      </div>
      
      {/* タグ編集フォーム */}
      {isEditing && currentTag && (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            {currentTag.id ? 'タグを編集' : '新規タグ作成'}
          </h2>
          
          <form onSubmit={handleSaveTag}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  タグ名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentTag.name || ''}
                  onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
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
                  value={currentTag.slug || ''}
                  onChange={(e) => setCurrentTag({ ...currentTag, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
                  placeholder="空白の場合はタグ名から自動生成"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  説明
                </label>
                <textarea
                  id="description"
                  value={currentTag.description || ''}
                  onChange={(e) => setCurrentTag({ ...currentTag, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-700"
                  rows={3}
                />
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
