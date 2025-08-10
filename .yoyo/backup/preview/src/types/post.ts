import type { Timestamp } from 'firebase/firestore';

export interface Post {
  id?: string; // ドキュメントID（Firestoreで自動生成）
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  publishedAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  authorId: string;
  authorName: string;
  authorEmail: string;
  tags?: string[];
  category?: string; // 記事カテゴリ
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  published: boolean;
  tags?: string[];
  category?: string; // 記事カテゴリ
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// スラッグ生成用のユーティリティ関数
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 英数字、スペース、ハイフン以外を削除
    .trim()
    .replace(/\s+/g, '-') // スペースをハイフンに置換
    .replace(/-+/g, '-'); // 連続するハイフンを1つに
};
