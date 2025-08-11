import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where, orderBy, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category, CategoryOption, CategoryTreeItem, generateCategorySlug } from '@/types/category';

const CATEGORIES_COLLECTION = 'categories';

// カテゴリを作成
export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<string> => {
  try {
    // スラッグが指定されていない場合は自動生成
    const slug = categoryData.slug || generateCategorySlug(categoryData.name);
    
    const categoryRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...categoryData,
      slug,
      count: categoryData.count || 0,
      sortOrder: categoryData.sortOrder || 99, // デフォルトは末尾
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return categoryRef.id;
  } catch (error) {
    console.error('カテゴリの作成に失敗しました:', error);
    throw new Error('カテゴリの作成に失敗しました');
  }
};

// カテゴリを更新
export const updateCategory = async (categoryId: string, categoryData: Partial<Category>): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    
    // スラッグが変更される場合は、新しく生成する
    if (categoryData.name && !categoryData.slug) {
      categoryData.slug = generateCategorySlug(categoryData.name);
    }
    
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('カテゴリの更新に失敗しました:', error);
    throw new Error('カテゴリの更新に失敗しました');
  }
};

// カテゴリを削除
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('カテゴリの削除に失敗しました:', error);
    throw new Error('カテゴリの削除に失敗しました');
  }
};

// 全カテゴリを取得
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      orderBy('sortOrder', 'asc'),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        parentId: data.parentId || '',
        count: data.count || 0,
        sortOrder: data.sortOrder || 99
      });
    });
    
    return categories;
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error);
    throw new Error('カテゴリの取得に失敗しました');
  }
};

// カテゴリをIDで取得
export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (categorySnap.exists()) {
      const data = categorySnap.data();
      return {
        id: categorySnap.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        parentId: data.parentId || '',
        count: data.count || 0,
        sortOrder: data.sortOrder || 99
      };
    }
    
    return null;
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error);
    throw new Error('カテゴリの取得に失敗しました');
  }
};

// カテゴリをスラッグで取得
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      where('slug', '==', slug)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        parentId: data.parentId || '',
        count: data.count || 0,
        sortOrder: data.sortOrder || 99
      };
    }
    
    return null;
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error);
    throw new Error('カテゴリの取得に失敗しました');
  }
};

// カテゴリツリーを構築（階層構造）
export const buildCategoryTree = async (): Promise<CategoryTreeItem[]> => {
  const categories = await getAllCategories();
  const tree: CategoryTreeItem[] = [];
  const categoryMap: Record<string, CategoryTreeItem> = {};
  
  // まず全カテゴリをマップに入れる
  categories.forEach(category => {
    categoryMap[category.id!] = { ...category, children: [] };
  });
  
  // 親子関係を構築
  categories.forEach(category => {
    if (category.parentId && categoryMap[category.parentId]) {
      // 親カテゴリが存在する場合、その子として追加
      categoryMap[category.parentId].children!.push(categoryMap[category.id!]);
    } else {
      // 親カテゴリがない場合、ルートに追加
      tree.push(categoryMap[category.id!]);
    }
  });
  
  return tree;
};

// カテゴリの記事数をカウント更新
export const updateCategoryCount = async (categoryId: string, delta: number): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (categorySnap.exists()) {
      const currentCount = categorySnap.data().count || 0;
      await updateDoc(categoryRef, {
        count: Math.max(0, currentCount + delta), // 負にならないように
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('カテゴリカウントの更新に失敗しました:', error);
    throw new Error('カテゴリカウントの更新に失敗しました');
  }
};

// カテゴリ選択肢を取得（フォーム用）
export const getCategoryOptions = async (): Promise<CategoryOption[]> => {
  const categories = await getAllCategories();
  return categories.map(category => ({
    id: category.id!,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId
  }));
};
