'use client';

import { useState, useEffect } from 'react';
import { getTagOptions } from '@/services/tagService';
import { TagOption } from '@/types/tag';
import { X } from 'lucide-react';

interface TagsSelectProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsSelect({ selectedTags, onChange }: TagsSelectProps) {
  const [tags, setTags] = useState<TagOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<TagOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const options = await getTagOptions();
        setTags(options);
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

  // 入力に応じてタグの候補を更新
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const lowerInput = inputValue.toLowerCase();
    const filtered = tags
      .filter(tag => 
        tag.name.toLowerCase().includes(lowerInput) && 
        !selectedTags.includes(tag.id)
      )
      .slice(0, 5); // 最大5つまで表示
    
    setSuggestions(filtered);
  }, [inputValue, tags, selectedTags]);

  // タグの追加
  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  // タグの削除
  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  // タグ名の取得
  const getTagName = (tagId: string): string => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.name : tagId;
  };

  // 新しいタグの作成 (存在しない場合)
  const handleCreateNewTag = () => {
    if (!inputValue.trim()) return;
    
    // 既に同じ名前のタグが存在するか確認
    const existingTag = tags.find(tag => 
      tag.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    if (existingTag) {
      // 既存のタグを追加
      addTag(existingTag.id);
    } else {
      // TODO: 新しいタグを作成する機能
      // この機能は将来的に実装する予定
      alert('新しいタグの作成機能は現在準備中です');
    }
    
    setInputValue('');
  };

  return (
    <div className="relative">
      <label htmlFor="tags" className="block text-sm font-medium mb-1">
        タグ
      </label>
      
      {/* 選択されたタグの表示 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tagId => (
            <div 
              key={tagId}
              className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm dark:bg-indigo-900 dark:text-indigo-200"
            >
              <span>{getTagName(tagId)}</span>
              <button 
                type="button"
                onClick={() => removeTag(tagId)}
                className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* タグ入力フィールド */}
      <div className="flex">
        <input
          id="tags"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="タグを入力または選択"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isLoading}
        />
      </div>
      
      {/* タグの候補表示 */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:border dark:border-gray-700">
          {suggestions.map((tag) => (
            <li
              key={tag.id}
              onClick={() => addTag(tag.id)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 dark:hover:bg-indigo-900"
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {isLoading && (
        <p className="mt-1 text-sm text-gray-500">読み込み中...</p>
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        タグをカンマ区切りで入力するか、候補から選択してください
      </div>
    </div>
  );
}
