'use client';

import { useState, useEffect, Fragment } from 'react';
import { getCategoryOptions } from '@/services/categoryService';
import { CategoryOption } from '@/types/category';

interface CategorySelectProps {
  selectedCategory: string;
  onChange: (categoryId: string) => void;
}

export default function CategorySelect({ selectedCategory, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const options = await getCategoryOptions();
        setCategories(options);
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

  const buildCategoryHierarchy = (categories: CategoryOption[], parentId: string = ''): JSX.Element[] => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => (
        <Fragment key={cat.id}>
          <option value={cat.id}>{parentId ? '　├ ' : ''}{cat.name}</option>
          {buildCategoryHierarchy(categories, cat.id).map((child, index) => (
            <Fragment key={`${cat.id}-child-${index}`}>
              {child}
            </Fragment>
          ))}
        </Fragment>
      ));
  };

  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium mb-1">
        カテゴリ
      </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        disabled={isLoading}
      >
        <option value="">カテゴリを選択してください</option>
        {categories.length > 0 && buildCategoryHierarchy(categories)}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {isLoading && (
        <p className="mt-1 text-sm text-gray-500">読み込み中...</p>
      )}
    </div>
  );
}
