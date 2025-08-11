import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where, orderBy, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tag, TagOption, generateTagSlug } from '@/types/tag';

const TAGS_COLLECTION = 'tags';

// タグを作成
export const createTag = async (tagData: Omit<Tag, 'id'>): Promise<string> => {
  try {
    // スラッグが指定されていない場合は自動生成
    const slug = tagData.slug || generateTagSlug(tagData.name);
    
    const tagRef = await addDoc(collection(db, TAGS_COLLECTION), {
      ...tagData,
      slug,
      count: tagData.count || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return tagRef.id;
  } catch (error) {
    console.error('タグの作成に失敗しました:', error);
    throw new Error('タグの作成に失敗しました');
  }
};

// タグを更新
export const updateTag = async (tagId: string, tagData: Partial<Tag>): Promise<void> => {
  try {
    const tagRef = doc(db, TAGS_COLLECTION, tagId);
    
    // スラッグが変更される場合は、新しく生成する
    if (tagData.name && !tagData.slug) {
      tagData.slug = generateTagSlug(tagData.name);
    }
    
    await updateDoc(tagRef, {
      ...tagData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('タグの更新に失敗しました:', error);
    throw new Error('タグの更新に失敗しました');
  }
};

// タグを削除
export const deleteTag = async (tagId: string): Promise<void> => {
  try {
    const tagRef = doc(db, TAGS_COLLECTION, tagId);
    await deleteDoc(tagRef);
  } catch (error) {
    console.error('タグの削除に失敗しました:', error);
    throw new Error('タグの削除に失敗しました');
  }
};

// 全タグを取得
export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const q = query(
      collection(db, TAGS_COLLECTION),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const tags: Tag[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tags.push({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        count: data.count || 0
      });
    });
    
    return tags;
  } catch (error) {
    console.error('タグの取得に失敗しました:', error);
    throw new Error('タグの取得に失敗しました');
  }
};

// タグをIDで取得
export const getTagById = async (tagId: string): Promise<Tag | null> => {
  try {
    const tagRef = doc(db, TAGS_COLLECTION, tagId);
    const tagSnap = await getDoc(tagRef);
    
    if (tagSnap.exists()) {
      const data = tagSnap.data();
      return {
        id: tagSnap.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        count: data.count || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('タグの取得に失敗しました:', error);
    throw new Error('タグの取得に失敗しました');
  }
};

// タグをスラッグで取得
export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  try {
    const q = query(
      collection(db, TAGS_COLLECTION),
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
        count: data.count || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('タグの取得に失敗しました:', error);
    throw new Error('タグの取得に失敗しました');
  }
};

// タグの記事数をカウント更新
export const updateTagCount = async (tagId: string, delta: number): Promise<void> => {
  try {
    const tagRef = doc(db, TAGS_COLLECTION, tagId);
    const tagSnap = await getDoc(tagRef);
    
    if (tagSnap.exists()) {
      const currentCount = tagSnap.data().count || 0;
      await updateDoc(tagRef, {
        count: Math.max(0, currentCount + delta), // 負にならないように
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('タグカウントの更新に失敗しました:', error);
    throw new Error('タグカウントの更新に失敗しました');
  }
};

// タグ選択肢を取得（フォーム用）
export const getTagOptions = async (): Promise<TagOption[]> => {
  const tags = await getAllTags();
  return tags.map(tag => ({
    id: tag.id!,
    name: tag.name,
    slug: tag.slug
  }));
};

// タグをまとめて取得（ID配列から）
export const getTagsByIds = async (tagIds: string[]): Promise<Tag[]> => {
  if (!tagIds.length) return [];
  
  try {
    const tags: Tag[] = [];
    
    // Firestoreは「in」クエリで最大10個までしか指定できないため
    // 10個ずつに分割して取得
    for (let i = 0; i < tagIds.length; i += 10) {
      const batch = tagIds.slice(i, i + 10);
      const q = query(
        collection(db, TAGS_COLLECTION),
        where('__name__', 'in', batch)
      );
      
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tags.push({
          id: doc.id,
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          count: data.count || 0
        });
      });
    }
    
    return tags;
  } catch (error) {
    console.error('タグの取得に失敗しました:', error);
    throw new Error('タグの取得に失敗しました');
  }
};
