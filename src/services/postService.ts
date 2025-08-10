import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where, orderBy, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post, PostFormData, generateSlug } from '@/types/post';

const POSTS_COLLECTION = 'posts';

export const createPost = async (postData: PostFormData, userId: string, userEmail: string, userName: string): Promise<string> => {
  try {
    const slug = generateSlug(postData.title);
    const now = new Date();
    
    const postRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      slug,
      authorId: userId,
      authorEmail: userEmail,
      authorName: userName,
      publishedAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      tags: postData.tags || [],
    });

    return postRef.id;
  } catch (error) {
    console.error('記事の作成に失敗しました:', error);
    throw new Error('記事の作成に失敗しました');
  }
};

// 記事を更新
export const updatePost = async (postId: string, postData: Partial<PostFormData>): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const updateData: Partial<Post> = {
      ...postData,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await updateDoc(postRef, updateData);
  } catch (error) {
    console.error('記事の更新に失敗しました:', error);
    throw new Error('記事の更新に失敗しました');
  }
};

// 公開状態を切り替え（公開にする場合は publishedAt を現在時刻に更新）
export const setPostPublished = async (postId: string, nextPublished: boolean): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const nowTs = Timestamp.fromDate(new Date());
    const updateData: Partial<Post> = {
      published: nextPublished,
      // 公開にする時のみ公開日時を更新。下書きに戻す場合は既存の公開日時を保持。
      ...(nextPublished ? { publishedAt: nowTs } : {}),
      updatedAt: nowTs,
    };
    await updateDoc(postRef, updateData);
  } catch (error) {
    console.error('公開状態の更新に失敗しました:', error);
    throw new Error('公開状態の更新に失敗しました');
  }
};

// 記事を削除
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('記事の削除に失敗しました:', error);
    throw new Error('記事の削除に失敗しました');
  }
};

// 記事一覧を取得
export const getPosts = async (userId?: string): Promise<Post[]> => {
  try {
    let q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('publishedAt', 'desc')
    );

    // ユーザーIDが指定されている場合はフィルタリング
    if (userId) {
      q = query(q, where('authorId', '==', userId));
    } else {
      // 公開記事のみ取得（公開ブログ一覧向け）
      q = query(q, where('published', '==', true));
    }

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        slug: data.slug,
        excerpt: data.excerpt,
        published: data.published,
        publishedAt: data.publishedAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        authorId: data.authorId,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        tags: data.tags || [],
        category: data.category,
        featuredImage: data.featuredImage,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords || [],
      });
    });

    return posts;
  } catch (error) {
    console.error('記事一覧の取得に失敗しました:', error);
    throw new Error('記事一覧の取得に失敗しました');
  }
};

// 記事をIDで取得
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return null;
    }

    const data = postSnap.data();
    return {
      id: postSnap.id,
      title: data.title,
      content: data.content,
      slug: data.slug,
      excerpt: data.excerpt,
      published: data.published,
      publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : data.publishedAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      authorId: data.authorId,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      tags: data.tags || [],
      category: data.category,
      featuredImage: data.featuredImage,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords || [],
    };
  } catch (error) {
    console.error('記事の取得に失敗しました:', error);
    throw new Error('記事の取得に失敗しました');
  }
};

// スラッグで記事を取得
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('slug', '==', slug),
      // 公開記事のみ（公開サイト向け）。下書きプレビューはダッシュボードで ID 取得を使用。
      where('published', '==', true)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      slug: data.slug,
      excerpt: data.excerpt,
      published: data.published,
      publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : data.publishedAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      authorId: data.authorId,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      tags: data.tags || [],
      category: data.category,
      featuredImage: data.featuredImage,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords || [],
    };
  } catch (error) {
    console.error('記事の取得に失敗しました:', error);
    throw new Error('記事の取得に失敗しました');
  }
};
